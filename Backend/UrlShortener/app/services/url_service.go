package services

import (
	"UrlShortener/app/errors"
	"UrlShortener/app/models"
	"UrlShortener/app/repositories"

	"math/rand"
	"time"

	log "github.com/sirupsen/logrus"
)

type IUrlService interface {
	CreateShortUrl(
		userid,
		longurl,
		BaseUrl string) (models.Url, error)
	GetActualUrl(shorturl string) (string, error)
	GetAllUrls(
		userId,
		lastShortUrl string,
		forward bool) (res models.AllUrls, err error)
	DeleteUrl(userId, shortUrl string) error
}

type UrlService struct {
	urlRepository repositories.IUrlRepository
}

func NewInstanceOfUrlService(urlRepository repositories.IUrlRepository) UrlService {
	return UrlService{urlRepository: urlRepository}
}

//CreateShortUrl creates a short url for a long url
func (u *UrlService) CreateShortUrl(userid, longurl, BaseUrl string) (models.Url, error) {
	rand.Seed(time.Now().UTC().UnixNano())
	var cnt int64
	res := models.Url{}
	var err error

	cnt, res, err = u.urlRepository.GetShortUrlByLongUrl(longurl)
	if cnt != 0 && err == nil {
		res.ShortUrl = BaseUrl + res.ShortUrl
		return res, nil
	} else if err != nil {
		log.WithFields(log.Fields{
			"error_message": err.Error(),
		}).Error("Error when fetching short url by long url")
		return res, &errors.DatabaseError{}
	}

	found := false
	for i := 1; i <= 3; i++ {
		var chars = []rune("0123456789abcdefghijklmnopqrstuvwxyz")
		s := make([]rune, 7)
		for i := range s {
			s[i] = chars[rand.Intn(len(chars))]
		}
		proposedShortUrl := string(s)
		cnt, _, err = u.urlRepository.GetLongUrlByShortUrl(proposedShortUrl)
		if cnt != 0 || err != nil {
			continue
		}
		res.UserId = userid
		res.ShortUrl = proposedShortUrl
		res.LongUrl = longurl
		err = u.urlRepository.CreateUrl(res)
		if err != nil {
			log.WithFields(log.Fields{
				"error_message": err.Error(),
			}).Error("Error when inserting new url to database")
			continue
		} else {
			found = true
			break
		}
	}

	if !found {
		return models.Url{}, &errors.CollisionError{}
	}
	res.ShortUrl = BaseUrl + res.ShortUrl
	return res, nil
}

//GetActualUrl returns the long url for the corresponding short url
func (u *UrlService) GetActualUrl(shorturl string) (string, error) {
	cnt, res, err := u.urlRepository.GetLongUrlByShortUrl(shorturl)
	if cnt == 1 && err == nil {
		return res.LongUrl, nil
	}
	if err != nil {
		log.WithFields(log.Fields{
			"error_message": err.Error(),
		}).Error("Error when trying to get long url by short url")
		return "", &errors.DatabaseError{}
	}
	return "", nil
}

//GetAllUrls returns all the short urls created by the user
func (u *UrlService) GetAllUrls(
	userId,
	lastShortUrl string,
	forward bool) (models.AllUrls, error) {
	res, err := u.urlRepository.GetAllUrls(userId, lastShortUrl, forward)
	if err != nil {
		log.WithFields(log.Fields{
			"error_message": err.Error(),
		}).Error("Error when trying to get all urls")
		return res, &errors.DatabaseError{}
	}
	return res, nil
}

//DeleteUrl deletes a short url created by the user
func (u *UrlService) DeleteUrl(
	userId,
	shortUrl string) error {
	err := u.urlRepository.DeleteUrl(userId, shortUrl)
	if err != nil {
		log.WithFields(log.Fields{
			"error_message": err.Error(),
		}).Error("Error when trying to delete url")
		return &errors.DatabaseError{}
	}
	return nil
}
