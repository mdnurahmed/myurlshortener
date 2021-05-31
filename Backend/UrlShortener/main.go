package main

import (
	"UrlShortener/app/router"
	"context"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

var ginLambda *ginadapter.GinLambda
var r *gin.Engine

func init() {
	r = router.InitializeApp()
	ginLambda = ginadapter.New(r)
}
func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	if os.Getenv("Lambda") == "True" {
		log.WithFields(log.Fields{}).Info("Running as a lambda function")
		lambda.Start(Handler)
	} else {
		log.WithFields(log.Fields{}).Info("Running as normal web app")
		r.Run()
	}
}
