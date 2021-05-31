package controllers

import (
	"UrlShortener/app/DTO"
	"UrlShortener/app/errors"
	"UrlShortener/app/models"
	"UrlShortener/app/services"
	"UrlShortener/app/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type IUrlController interface {
	CreateUrl(c *gin.Context)
	RedirectUrl(c *gin.Context)
	GetAllUrls(c *gin.Context)
	DeleteUrl(c *gin.Context)
}

type UrlController struct {
	urlService services.IUrlService
}

func NewInstanceOfUrlController(
	urlService services.IUrlService) UrlController {
	return UrlController{urlService: urlService}
}

//CreateUrl is handler for CreateUrl API
func (u *UrlController) CreateUrl(c *gin.Context) {
	longurl, ok := c.Get("LongUrl")
	if !ok {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	userid, exists := c.Get("UserId")
	if !exists {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	m := models.Url{}
	var err error
	m, err = u.urlService.CreateShortUrl(
		userid.(string),
		longurl.(string),
		utils.Configuration.BaseUrl)
	if err != nil {
		var errorResponse *DTO.ErrorResponse
		_, ok := err.(*errors.CollisionError)
		if ok {
			errorResponse = DTO.NewErrorResponse("CollisionError", "Failed to find a unique short url due to collisions")
		} else {
			errorResponse = DTO.NewErrorResponse("InternalError", "Internal error occured.")
		}
		c.JSON(http.StatusOK, gin.H{
			"error": errorResponse,
		})
		return
	} else {
		c.JSON(http.StatusOK, *utils.MapUrlToCreateUrlRes(&m))
		return
	}
}

//RedirectUrl is handler for RedirectUrl API
func (u *UrlController) RedirectUrl(c *gin.Context) {
	shorturl := c.Param("url")
	if shorturl == "" {
		c.AbortWithStatus(http.StatusBadRequest)
		return
	}
	longurl, err := u.urlService.GetActualUrl(shorturl)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"error": DTO.NewErrorResponse("InternalError", "Internal error occured."),
		})
		return
	}
	if longurl == "" {
		c.JSON(http.StatusOK, gin.H{
			"error": DTO.NewErrorResponse("InvalidShortUrl", "No such short url exists"),
		})
	}
	c.Redirect(http.StatusMovedPermanently, longurl)
}

//GetAllUrls is handler for GetAllUrls API
func (u *UrlController) GetAllUrls(c *gin.Context) {
	userId, _ := c.Get("UserId")
	lastLongUrl, _ := c.Get("last_short_url")
	forward, _ := c.Get("forward")
	res, err := u.urlService.GetAllUrls(userId.(string), lastLongUrl.(string), forward.(bool))
	if err != nil {
		c.JSON(200, gin.H{
			"error": DTO.NewErrorResponse("InternalError", "Internal error occured."),
		})
		return
	}
	c.JSON(200, *utils.MapAllUrlsToGetAllUrlsRes(&res))
}

//DeleteUrl is handler for DeleteUrl API
func (u *UrlController) DeleteUrl(c *gin.Context) {
	userId, _ := c.Get("UserId")
	shortUrl, _ := c.Get("short_url")
	err := u.urlService.DeleteUrl(userId.(string), shortUrl.(string))
	if err != nil {
		c.JSON(200, gin.H{
			"error": DTO.NewErrorResponse("InternalError", "Internal error occured."),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Deleted Succesfully",
	})
}
