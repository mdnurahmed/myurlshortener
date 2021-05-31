package repositories

import (
	"UrlShortener/app/models"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type IUrlRepository interface {
	CreateUrl(url models.Url) error
	GetLongUrlByShortUrl(ShortUrl string) (count int64, url models.Url, err error)
	GetShortUrlByLongUrl(LongUrl string) (count int64, url models.Url, err error)
	GetAllUrls(userId, lastShortUrl string, forward bool) (urls models.AllUrls, err error)
	DeleteUrl(userId, shortUrl string) error
}

type UrlRepository struct {
	db                *dynamodb.DynamoDB
	tableName         string
	shortUrlIndexName string
	longUrlIndexName  string
}

func NewInstanceOfUrlRepository(
	db *dynamodb.DynamoDB,
	tableName,
	shortUrlIndexName,
	longUrlIndexName string) UrlRepository {
	return UrlRepository{
		db:                db,
		tableName:         tableName,
		shortUrlIndexName: shortUrlIndexName,
		longUrlIndexName:  longUrlIndexName}
}

//CreateUrl inserts models.Url item into the database
func (u *UrlRepository) CreateUrl(m models.Url) error {
	av, err := dynamodbattribute.MarshalMap(m)
	if err != nil {
		return err
	}
	input := &dynamodb.PutItemInput{
		Item:                av,
		TableName:           aws.String(u.tableName),
		ConditionExpression: aws.String("attribute_not_exists(short_url)"),
	}
	_, err = u.db.PutItem(input)
	return err
}

//GetLongUrlByShortUrl finds the long url for a short url
func (u *UrlRepository) GetLongUrlByShortUrl(ShortUrl string) (int64, models.Url, error) {
	res := models.Url{}
	input := &dynamodb.QueryInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":short_url": {
				S: aws.String(ShortUrl),
			},
		},
		ExpressionAttributeNames: map[string]*string{
			"#s": aws.String("short_url"),
		},
		KeyConditionExpression: aws.String("#s = :short_url"),
		TableName:              aws.String(u.tableName),
		IndexName:              aws.String(u.shortUrlIndexName),
	}
	result, err := u.db.Query(input)
	var cnt int64
	if result.Count != nil {
		cnt = *result.Count
	}
	if err != nil || cnt == 0 {
		return cnt, res, err
	}

	err = dynamodbattribute.UnmarshalMap(result.Items[0], &res)
	if err != nil {
		return cnt, res, err
	} else {
		return cnt, res, nil
	}
}

//GetShortUrlByLongUrl finds the short url for a long url
func (u *UrlRepository) GetShortUrlByLongUrl(LongUrl string) (int64, models.Url, error) {
	res := models.Url{}
	input := &dynamodb.QueryInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":long_url": {
				S: aws.String(LongUrl),
			},
		},
		ExpressionAttributeNames: map[string]*string{
			"#l": aws.String("long_url"),
		},
		KeyConditionExpression: aws.String("#l = :long_url"),
		TableName:              aws.String(u.tableName),
		IndexName:              aws.String(u.longUrlIndexName),
	}
	result, err := u.db.Query(input)
	var cnt int64
	if result.Count != nil {
		cnt = *result.Count
	}
	if err != nil || cnt == 0 {
		return cnt, res, err
	}

	err = dynamodbattribute.UnmarshalMap(result.Items[0], &res)
	if err != nil {
		return cnt, res, err
	} else {
		return cnt, res, nil
	}
}

//GetAllUrls finds all the short urls and long urls for a user
func (u *UrlRepository) GetAllUrls(
	userId,
	lastShortUrl string,
	forward bool) (models.AllUrls, error) {

	lastKey := models.LastEvaluatedKey{}
	url := models.JustUrl{}
	res := models.AllUrls{}
	var lastEvaluatedKey map[string]*dynamodb.AttributeValue
	if lastShortUrl != "" {
		lastEvaluatedKey = map[string]*dynamodb.AttributeValue{
			"user_id": {
				S: aws.String(userId),
			},
			"short_url": {
				S: aws.String(lastShortUrl),
			},
		}
	}

	input := &dynamodb.QueryInput{
		ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
			":user_id": {
				S: aws.String(userId),
			},
		},
		ExpressionAttributeNames: map[string]*string{
			"#u": aws.String("user_id"),
		},
		KeyConditionExpression: aws.String("#u = :user_id"),
		TableName:              aws.String(u.tableName),
		Limit:                  aws.Int64(5),
		ExclusiveStartKey:      lastEvaluatedKey,
		ScanIndexForward:       aws.Bool(forward),
	}
	result, err := u.db.Query(input)
	var cnt int64
	if result.Count != nil {
		cnt = *result.Count
	}
	if err != nil || cnt == 0 {
		return res, err
	}
	for i := 0; i < int(cnt); i++ {
		err = dynamodbattribute.UnmarshalMap(result.Items[i], &url)
		if err != nil {
			return res, err
		} else {
			res.Urls = append(res.Urls, url)
		}
	}

	if (*result).LastEvaluatedKey != nil {
		err = dynamodbattribute.
			UnmarshalMap((*result).LastEvaluatedKey, &lastKey)
		if err != nil {
			return res, err
		}
		res.LastShortUrl = lastKey.LastShortUrl
		res.LastUserID = lastKey.UserId
	}
	return res, err
}

//DeleteUrl deletes a short url created by the user
func (u *UrlRepository) DeleteUrl(userId, shortUrl string) error {
	input := &dynamodb.DeleteItemInput{
		Key: map[string]*dynamodb.AttributeValue{
			"user_id": {
				S: aws.String(userId),
			},
			"short_url": {
				S: aws.String(shortUrl),
			},
		},
		TableName: aws.String(u.tableName),
	}

	_, err := u.db.DeleteItem(input)
	return err
}
