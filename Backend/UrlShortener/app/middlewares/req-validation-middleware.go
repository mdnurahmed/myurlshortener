package middlewares

import (
	"UrlShortener/app/DTO"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

//CreateUrlReqValidate is a middleware that
//validates the request to the CreateUrl API
func CreateUrlReqValidate() gin.HandlerFunc {
	return func(c *gin.Context) {
		m := DTO.CreateUrlReq{}
		var err error
		err = c.Bind(&m)
		if err != nil || m.LongUrl == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": DTO.NewErrorResponse("NoLongUrlProvided", "Long Url has to be provided"),
			})
			return
		}
		_, err = url.ParseRequestURI(m.LongUrl)
		if err != nil {
			//c.AbortWithStatus(http.StatusBadRequest)
			c.JSON(http.StatusBadRequest, gin.H{
				"error": DTO.NewErrorResponse("InvalidLongUrl", "Long Url is not valid"),
			})
			return
		}
		c.Set("LongUrl", m.LongUrl)
		c.Next()
	}
}

//GetAllUrlsReqValidate is a middleware that
//validates the request to the GetAllUrls API
func GetAllUrlsReqValidate() gin.HandlerFunc {
	return func(c *gin.Context) {
		m := DTO.GetAllUrlsReq{}
		m.LastShortUrl = c.DefaultQuery("last_short_url", "")
		m.Forward = true
		forward := c.DefaultQuery("forward", "")
		if forward == "false" {
			m.Forward = false
		}
		c.Set("last_short_url", m.LastShortUrl)
		c.Set("forward", m.Forward)

		c.Next()
	}
}

//DeleteUrlReqValidate is a middleware that
//validates the request to the DeleteUrl API
func DeleteUrlReqValidate() gin.HandlerFunc {
	return func(c *gin.Context) {
		m := DTO.DeleteUrlReq{}

		err := c.Bind(&m)
		if err != nil || m.ShortUrl == "" {
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}

		c.Set("short_url", m.ShortUrl)
		c.Next()
	}
}
