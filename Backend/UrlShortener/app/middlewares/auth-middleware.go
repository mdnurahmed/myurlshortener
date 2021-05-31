package middlewares

import (
	"UrlShortener/app/utils"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

//Authenticate is a middleware that
//checks if a request is authenticated
func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		myclaims := utils.AWSCognitoClaims{}
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		token, err := jwt.ParseWithClaims(
			tokenString,
			&myclaims,
			utils.VerifyToken)
		if err != nil || !token.Valid {
			log.WithFields(log.Fields{
				"error_message":  err.Error(),
				"token validity": token.Valid,
			}).Error("Token validation did not succeed")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		log.WithFields(log.Fields{
			"claims": myclaims,
		}).Info("Token validation succeeded")
		c.Set("UserId", myclaims.Subject)
		c.Next()
	}
}
