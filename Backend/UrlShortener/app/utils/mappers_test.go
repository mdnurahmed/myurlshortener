package utils

import (
	"UrlShortener/app/models"
	"testing"
)

func TestMapUrlToCreateUrlRes(t *testing.T) {
	userid, longurl, shorturl := "123", "longurl", "shorturl"

	m := models.Url{
		UserId:   userid,
		LongUrl:  longurl,
		ShortUrl: shorturl,
	}

	res := MapUrlToCreateUrlRes(&m)
	if res.LongUrl != longurl {
		t.Errorf("Expected %s but got %s\n", longurl, res.LongUrl)
	}
	if res.ShortUrl != shorturl {
		t.Errorf("Expected %s but got %s\n", shorturl, res.ShortUrl)
	}
}

func TestMapAllUrlsToGetAllUrlsRes(t *testing.T) {
	lastuserid, lastshorturl := "123", "short_url"
	url := []models.JustUrl{
		{
			ShortUrl: "shorturl",
			LongUrl:  "longurl",
		},
	}
	m := models.AllUrls{
		Urls:         url,
		LastUserID:   lastuserid,
		LastShortUrl: lastshorturl,
	}

	res := MapAllUrlsToGetAllUrlsRes(&m)
	if res.Urls[0].LongUrl != url[0].LongUrl {
		t.Errorf("Expected %s but got %s\n", url[0].LongUrl, res.Urls[0].LongUrl)
	}
	if res.Urls[0].ShortUrl != url[0].ShortUrl {
		t.Errorf("Expected %s but got %s\n", url[0].ShortUrl, res.Urls[0].ShortUrl)
	}

	if res.LastShortUrl != lastshorturl {
		t.Errorf("Expected %s but got %s\n", lastshorturl, res.LastShortUrl)
	}
}
