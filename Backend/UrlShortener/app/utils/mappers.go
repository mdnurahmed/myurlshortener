package utils

import (
	"UrlShortener/app/DTO"
	"UrlShortener/app/models"
)

//Maps models.Url object to DTO.CreateUrlRes object
func MapUrlToCreateUrlRes(u *models.Url) *DTO.CreateUrlRes {
	return &DTO.CreateUrlRes{
		ShortUrl: u.ShortUrl,
		LongUrl:  u.LongUrl,
	}
}

//Maps models.AllUrls object toDTO.GetAllUrlsRes object
func MapAllUrlsToGetAllUrlsRes(u *models.AllUrls) *DTO.GetAllUrlsRes {
	res := DTO.GetAllUrlsRes{}
	res.LastShortUrl = u.LastShortUrl
	for _, url := range u.Urls {
		res.Urls = append(res.Urls, DTO.JustUrl{
			ShortUrl: url.ShortUrl,
			LongUrl:  url.LongUrl,
		})
	}
	return &res
}
