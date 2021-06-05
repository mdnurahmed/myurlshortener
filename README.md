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

## Blueprint of the DynamoDB table 

Cloudformation template 
```
AWSTemplateFormatVersion: 2010-09-09

Parameters : 
  MyTableName:
    Type : String 
    Description : Name of the DynamoDB table
    Default : MYURLSHORTENER
  UserIDAttributeName:
    Type : String 
    Description : Name of the user id atrribute
    Default : user_id
  ShortUrlAttributeName:
    Type : String 
    Description : Name of the short url atrribute
    Default : short_url
  LongUrlAttributeName:
    Type : String 
    Description : Name of the long url atrribute
    Default : long_url
  ShortUrlIndexName:
    Type : String 
    Description : Name of the short url index
    Default : short_url_index
  LongUrlIndexName:
    Type : String 
    Description : Name of the long url index
    Default : long_url_index

Resources:
  myDynamoDBTable: 
    Type: AWS::DynamoDB::Table
    Properties: 
      TableName : !Ref MyTableName
      AttributeDefinitions: 
        - 
          AttributeName: !Ref UserIDAttributeName
          AttributeType: "S"
        - 
          AttributeName: !Ref ShortUrlAttributeName
          AttributeType: "S"
        - 
          AttributeName: !Ref LongUrlAttributeName
          AttributeType: "S"
      KeySchema: 
        - 
          AttributeName: !Ref UserIDAttributeName
          KeyType: "HASH"
        - 
          AttributeName: !Ref ShortUrlAttributeName
          KeyType: "RANGE"
      ProvisionedThroughput: 
        ReadCapacityUnits: 1
        WriteCapacityUnits: 1
      GlobalSecondaryIndexes: 
        - 
          IndexName: !Ref LongUrlIndexName
          KeySchema: 
            - 
              AttributeName: !Ref LongUrlAttributeName
              KeyType: "HASH"
          Projection: 
            ProjectionType: "ALL"
          ProvisionedThroughput: 
            ReadCapacityUnits: 1
            WriteCapacityUnits: 1
        - 
          IndexName: !Ref ShortUrlIndexName
          KeySchema: 
            - 
              AttributeName: !Ref ShortUrlAttributeName
              KeyType: "HASH"
          Projection: 
            ProjectionType: "ALL"
          ProvisionedThroughput: 
            ReadCapacityUnits: 1
            WriteCapacityUnits: 1
      
```
### Blueprint of the Cognito
Cloudformation template for the cognito service :

```

AWSTemplateFormatVersion: '2010-09-09'
Description: Cognito Stack
Parameters:
  AuthName:
    Type: String
    Description: Unique Auth Name for Cognito Resources
    Default : URLSHORTENER
Resources:
  
  # Creates a user pool in cognito for your app to auth against
  # This example requires MFA and validates the phone number to use as MFA
  # Other fields can be added to the schema
  UserPool:
    Type: "AWS::Cognito::UserPool"
    Properties:
      UserPoolName: !Sub ${AuthName}-user-pool
      Schema:
        - Name: name
          AttributeDataType: String
          Mutable: true
          Required: true
      UsernameAttributes : 
        - email 
  
  # Creates a User Pool Client to be used by the identity pool
  UserPoolClient:
    Type: "AWS::Cognito::UserPoolClient"
    Properties:
      ClientName: !Sub ${AuthName}-client
      GenerateSecret: false
      UserPoolId: !Ref UserPool
  
```
## How to run locally
First clone the repo  
```
git clone https://github.com/mdnurahmed/myurlshortener.git
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
Total Possible short urls , 36P7 = 42072307200 ~ 4*10^10 . So probabilty of collisions - 

| After Short Urls Created  | Collision probability      | 
| --------------------------| ---------------------------|
| 1 thousand (1000)         | 1 in 40 million requests   |
| 10 thousand (10,000)      | 1 in 4 million requests    |
| 100 thousand (100,000)    | 1 in 400 thousand requests |
| 1 million (1000000)       | 1 in 40 thousand requests  |
## Concurrency 
Two different processes could generate same short url and write them to database. We solved this problem here using conditional expression. An insert will not suceed if the same short url is already in the database.
## Caching
We could have used dax caching with dynamodb for the 'get all url' and 'redirect' api . But dax is a write through cache . so in that case after we delete an url , it would still appear in 'get all url' calls and redirects even if we delete it through dax cause they would be in the query cache , not in them item cache . we could somewhat solve this by keeping TTL of dax low but the trade-off is user experience . It's pointless to do the delete call through dax as it has no impact but will increase latency , so we can do the delete call bypassing dax completely .  


