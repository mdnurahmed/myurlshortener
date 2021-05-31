package router

import (
	"UrlShortener/app/controllers"
	mw "UrlShortener/app/middlewares"
	"UrlShortener/app/repositories"
	"UrlShortener/app/services"
	"UrlShortener/app/utils"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/gin-gonic/gin"
	"github.com/lestrrat-go/jwx/jwk"
	log "github.com/sirupsen/logrus"
)

//InitializeApp initilizes the app like loading configuration,
//environment variables , setting up routes for apis
func InitializeApp() *gin.Engine {
	log.SetFormatter(&log.JSONFormatter{})
	log.SetOutput(os.Stdout)
	log.SetReportCaller(true)

	if os.Getenv("LogToFile") == "True" {
		f, err := os.OpenFile("logs", os.O_WRONLY|os.O_CREATE, 0755)
		if err != nil {
			log.WithFields(log.Fields{
				"erro_message": err.Error(),
			}).Fatal("Couldn't create a file for logging")
		}
		log.SetOutput(f)
	}

	config, err := utils.LoadConfig(".")
	if err != nil {
		log.WithFields(log.Fields{
			"erro_message": err.Error(),
		}).Fatal("Couldn't load config object")
	}

	utils.Configuration = config
	log.WithFields(log.Fields{
		"Config": config,
	}).Info("Configuration object")

	publicKeySet, err := jwk.FetchHTTP(utils.Configuration.PublicKeysURL)
	if err != nil {
		log.WithFields(log.Fields{
			"erro_message": err.Error(),
		}).Fatal("failed to fetch public key")
	}
	utils.PublicKeySet = publicKeySet

	sess := session.Must(session.NewSession(&aws.Config{Region: aws.String(utils.Configuration.Region)}))
	dbconfig := aws.Config{}
	svc := dynamodb.New(sess, &dbconfig)
	rp := repositories.NewInstanceOfUrlRepository(
		svc,
		utils.Configuration.TableName,
		utils.Configuration.ShortUrlIndexName,
		utils.Configuration.LongUrlIndexName)
	urlService := services.NewInstanceOfUrlService(&rp)
	urlController := controllers.NewInstanceOfUrlController(&urlService)

	r := gin.Default()
	r.Use(mw.CORSMiddleware())
	r.POST(
		"/create-url",
		mw.CreateUrlReqValidate(),
		mw.Authenticate(),
		urlController.CreateUrl)
	r.GET(
		"/get-all-urls",
		mw.GetAllUrlsReqValidate(),
		mw.Authenticate(),
		urlController.GetAllUrls)

	r.DELETE("/delete",
		mw.DeleteUrlReqValidate(),
		mw.Authenticate(),
		urlController.DeleteUrl)
	r.GET("/:url", urlController.RedirectUrl)
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "PONG",
		})
	})
	return r
}
