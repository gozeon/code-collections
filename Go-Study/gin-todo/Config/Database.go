package Config

import (
	"fmt"
	"github.com/jinzhu/gorm"
)

var DB *gorm.DB

type DBConifg struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
}

func BuildDBConfig() *DBConifg {
	dbConfig := DBConifg{
		Host:     "127.0.0.1",
		Port:     3306,
		User:     "root",
		Password: "root",
		DBName:   "todos",
	}

	return &dbConfig
}

func DBurl(dbConfig *DBConifg) string {

	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local",
		dbConfig.User,
		dbConfig.Password,
		dbConfig.Host,
		dbConfig.Port,
		dbConfig.DBName)

}
