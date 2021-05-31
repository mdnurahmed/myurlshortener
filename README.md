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

# After Thoughts 
## Collisions
Total Possible short urls , 36P7 = 42072307200 ~ 4*10^10 . So probabilty of collsions - 

| After Short Urls Created  | Collision probability      | 
| --------------------------| ---------------------------|
| 1 thousand (1000)         | 1 in 40 million requests   |
| 10 thousand (10,000)      | 1 in 4 million requests    |
| 100 thousand (100,000)    | 1 in 400 thousand requests |
| 1 million (1000000)       | 1 in 40 thousand requests  |
## Concurrency 
Two different processes could generate same short url and write them to database. We solved this problem here using conditional expression. An insert will not suceed if the same short url is already in the database.
## Caching
We could have used dax caching with dynamodb for the 'get all url' api . But dax is a write through cache . so in that case after we delete an url , it would still appear in 'get all url' calls even if we delete it through dax cause that would be in the query cache , not in them item cache . we could somewhat solve this by keeping TTL of dax low but the trade-off is user experience . It's pointless to do the delete call through dax as it has no impact but will increase latency , so we can do the delete call bypassing dax completely .  


