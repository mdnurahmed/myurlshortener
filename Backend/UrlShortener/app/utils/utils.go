package utils

import (
	"errors"
	"fmt"

	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/lestrrat-go/jwx/jwk"
	"github.com/spf13/viper"
)

var PublicKeysURL string
var PublicKeySet *jwk.Set

type AWSCognitoClaims struct {
	Groups   []string `json:"cognito:groups"`
	Username string   `json:"email"`
	ClientID string   `json:"client_id"`
	jwt.StandardClaims
}

type Config struct {
	TableName         string `mapstructure:"TableName"`
	PublicKeysURL     string `mapstructure:"PublicKeysURL"`
	LongUrlIndexName  string `mapstructure:"LongUrlIndexName"`
	ShortUrlIndexName string `mapstructure:"ShortUrlIndexName"`
	Region            string `mapstructure:"Region"`
	ClientId          string `mapstructure:"ClientId"`
	BaseUrl           string `mapstructure:"BaseUrl"`
}

var Configuration Config

func LoadConfig(path string) (config Config, err error) {
	if os.Getenv("Lambda") == "True" {
		config.TableName = os.Getenv("TableName")
		config.LongUrlIndexName = os.Getenv("LongUrlIndexName")
		config.ShortUrlIndexName = os.Getenv("ShortUrlIndexName")
		config.PublicKeysURL = os.Getenv("PublicKeysURL")
		config.Region = os.Getenv("Region")
		config.ClientId = os.Getenv("ClientId")
		config.BaseUrl = os.Getenv("BaseUrl")
	} else {
		viper.AddConfigPath(path)
		viper.SetConfigName("app")
		viper.SetConfigType("env")
		viper.AutomaticEnv()
		err = viper.ReadInConfig()
		if err != nil {
			return
		}
		err = viper.Unmarshal(&config)
	}
	return
}

func VerifyToken(token *jwt.Token) (interface{}, error) {
	_, ok := token.Method.(*jwt.SigningMethodRSA)
	if !ok {
		return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
	}
	kid, ok := token.Header["kid"].(string)
	if !ok {
		return nil, errors.New("kid header not found")
	}
	claims, ok := token.Claims.(*AWSCognitoClaims)
	if !ok || claims.ClientID != Configuration.ClientId {
		return nil, errors.New("there is problem to get claims")
	}
	keys := PublicKeySet.LookupKeyID(kid)
	if len(keys) == 0 {
		return nil, fmt.Errorf("key %v not found", kid)
	}
	val, err := keys[0].Materialize()
	return val, err
}
