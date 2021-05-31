package models

type Url struct {
	UserId   string `dynamodbav:"user_id"`
	ShortUrl string `dynamodbav:"short_url"`
	LongUrl  string `dynamodbav:"long_url"`
}

type JustUrl struct {
	ShortUrl string `dynamodbav:"short_url"`
	LongUrl  string `dynamodbav:"long_url"`
}

type AllUrls struct {
	Urls         []JustUrl
	LastUserID   string
	LastShortUrl string
}

type LastEvaluatedKey struct {
	UserId       string `dynamodbav:"user_id"`
	LastShortUrl string `dynamodbav:"short_url"`
}
