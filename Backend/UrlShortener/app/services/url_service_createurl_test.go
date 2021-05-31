package services

import (
	"UrlShortener/app/errors"
	"UrlShortener/app/models"
	"fmt"
	"testing"

	"github.com/stretchr/testify/mock"
)

type MockUrlRepository struct {
	mock.Mock
}

func (u *MockUrlRepository) CreateUrl(m models.Url) error {
	args := u.Called(m)
	return args.Error(0)
}

func (u *MockUrlRepository) GetLongUrlByShortUrl(ShortUrl string) (int64, models.Url, error) {
	args := u.Called(ShortUrl)
	return args.Get(0).(int64), args.Get(1).(models.Url), args.Error(2)
}

func (u *MockUrlRepository) GetShortUrlByLongUrl(LongUrl string) (int64, models.Url, error) {
	args := u.Called(LongUrl)
	return args.Get(0).(int64), args.Get(1).(models.Url), args.Error(2)
}

func (u *MockUrlRepository) GetAllUrls(
	userId,
	lastShortUrl string,
	forward bool) (models.AllUrls, error) {
	args := u.Called(userId, lastShortUrl, forward)
	return args.Get(0).(models.AllUrls), args.Error(1)
}

func (u *MockUrlRepository) DeleteUrl(userId, shortUrl string) error {
	args := u.Called(userId, shortUrl)
	return args.Error(0)
}

func initializeTest() (*MockUrlRepository, UrlService) {
	mockRepo := new(MockUrlRepository)
	urlService := NewInstanceOfUrlService(mockRepo)
	return mockRepo, urlService
}

//when no short url for the long url was created before and everything goes right
func TestUrlService_CreateShortUrl_HappyCase(t *testing.T) {
	mockRepo, urlService := initializeTest()
	var userid, longurl, baseurl string
	//setup
	userid, longurl, baseurl = "123", "longurl", "baseurl"
	mockRepo.On("CreateUrl", mock.Anything).Return(nil)
	mockRepo.On("GetShortUrlByLongUrl", longurl).
		Return(int64(0), models.Url{}, nil)
	mockRepo.On("GetLongUrlByShortUrl", mock.AnythingOfType("string")).
		Return(int64(0), models.Url{}, nil)
		//testing
	res, err := urlService.CreateShortUrl(userid, longurl, baseurl)
	if err != nil {
		t.Errorf("Expected no error but got error - %s", err.Error())
	}
	if res.LongUrl != longurl {
		t.Errorf("Expected long url to be %s but got %s", longurl, res.LongUrl)
	}
	if res.UserId != userid {
		t.Errorf("Expected user id to be %s but got %s", userid, res.UserId)
	}
}

//when no short url for the long url was created before and but collision occurs when writing to database
func TestUrlService_CreateShortUrl_SadCase(t *testing.T) {
	mockRepo, urlService := initializeTest()
	var userid, longurl, baseurl string
	//setup
	userid, longurl, baseurl = "123", "longurl", "baseurl"
	mockRepo.On("CreateUrl", mock.Anything).Return(fmt.Errorf("Some Error"))
	mockRepo.On("GetShortUrlByLongUrl", longurl).
		Return(int64(0), models.Url{}, nil)
	mockRepo.On("GetLongUrlByShortUrl", mock.AnythingOfType("string")).
		Return(int64(0), models.Url{}, nil)
		//testing
	res, err := urlService.CreateShortUrl(userid, longurl, baseurl)
	if err == nil {
		t.Errorf("Expected error but got no error ")
	}
	if _, ok := err.(*errors.CollisionError); !ok {
		t.Errorf("Expected CollisionError but did not get it")
	}
	if res.LongUrl != "" {
		t.Errorf("Expected long url to be empty but got %s", res.LongUrl)
	}
	if res.UserId != "" {
		t.Errorf("Expected user id to be empty but got %s", res.UserId)
	}
	if res.ShortUrl != "" {
		t.Errorf("Expected short url to be empty but got %s", res.ShortUrl)
	}
}

//shorturl already created for the longurl and everything goes right case
func TestUrlService_CreateShortUrl_AlreadyCreatedCase(t *testing.T) {
	mockRepo, urlService := initializeTest()
	var userid, longurl, baseurl, shorturl string

	//setup
	userid, longurl, shorturl, baseurl = "123", "longurl", "shorturl", "baseurl"
	mockRepo.On("CreateUrl", mock.Anything).Return(nil)
	mockRepo.On("GetShortUrlByLongUrl", longurl).
		Return(int64(1), models.Url{
			UserId:   userid,
			ShortUrl: shorturl,
			LongUrl:  longurl,
		}, nil)

		//testing
	res, err := urlService.CreateShortUrl(userid, longurl, baseurl)
	if err != nil {
		t.Errorf("Expected no error but got error - %s", err.Error())
	}
	if res.LongUrl != longurl {
		t.Errorf("Expected long url to be %s but got %s", longurl, res.LongUrl)
	}
	if res.UserId != userid {
		t.Errorf("Expected user id to be %s but got %s", userid, res.UserId)
	}
	if res.ShortUrl != baseurl+shorturl {
		t.Errorf("Expected short url to be %s but got %s", baseurl+shorturl, res.ShortUrl)
	}
}
