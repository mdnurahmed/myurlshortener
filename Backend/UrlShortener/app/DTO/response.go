package DTO

//CreateUrlRes is the response object for CreateUrlRes API
type CreateUrlRes struct {
	ShortUrl string `json:"short_url"`
	LongUrl  string `json:"long_url"`
}

//GetAllUrlsRes is the response object for GetAllUrlsRes API
type GetAllUrlsRes struct {
	Urls         []JustUrl `json:"urls"`
	LastShortUrl string    `json:"LastShortUrl"`
}

type JustUrl struct {
	ShortUrl string `json:"short_url"`
	LongUrl  string `json:"long_url"`
}

//ErrorResponse is response object when error occurs
type ErrorResponse struct {
	Name    string `json:"name" `
	Message string `json:"message"`
}

//NewErrorResponse returns a new ErrorResponse object
func NewErrorResponse(name string, msg string) *ErrorResponse {
	return &ErrorResponse{
		Name:    name,
		Message: msg,
	}
}
