package DTO

//CreateUrlReq is the request object for CreateUrl API
type CreateUrlReq struct {
	LongUrl string `json:"long_url"`
}

//GetAllUrlsReq is the request object for GetAllUrls API
type GetAllUrlsReq struct {
	LastShortUrl string `json:"last_short_url"`
	Forward      bool   `json:"forward"`
}

//DeleteUrlReqis the request object for DeleteUrl API
type DeleteUrlReq struct {
	ShortUrl string `json:"short_url"`
}
