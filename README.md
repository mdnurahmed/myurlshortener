# myurlshortener
A simple url shortener with authentication and authorization using gin-gonic frmaework of golang in the backend with a warpper for aws lambda and aws API-GATEWAY , so if usage goes up and it becomes price prohibitive, it's a one line change to swap it to a container & run via Fargate/ECS. In the frontend reactjs frmawork was used . 

# Live Demo
[# Live Demo](https://d1nkdlbzuru4c8.cloudfront.net)


# Architecture 
![Image of Architecure](https://github.com/mdnurahmed/myurlshortener/blob/main/architecure.jpeg)

# Run Locally
## Requirements
- [Go](https://golang.org/doc/install)
- [Node.js](https://nodejs.org/en/download/)
- or [Docker](https://docs.docker.com/get-docker/)
## How to run locally
First clone the repo  
```
https://github.com/mdnurahmed/myurlshortener.git
cd myurlshortener/Backend/UrlShortener
```
Then fill up the [backend environment variables](https://github.com/mdnurahmed/myurlshortener/blob/main/Backend/UrlShortener/app.env).Then run the backend
```
#using go 
go run main.go
#or using docker 
docker-compose -f url-compose.yaml up --build
```
Alternatively you can run the backend using sam-cli . First fill up the [environemnt variables](https://github.com/mdnurahmed/myurlshortener/blob/main/Backend/template.yaml) in template.yaml file . 
```
cd myurlshortener/Backend/
sam local start-api
```
Then fill up the [frontend environment variables](https://github.com/mdnurahmed/myurlshortener/blob/main/Frontend/.env) and  run the frontend 
```
cd myurlshortener/Frontend/
#using yarn 
yarn start
#or using npm
npm start
#or using docker
docker-compose -f reactapp.yaml up --build
```


