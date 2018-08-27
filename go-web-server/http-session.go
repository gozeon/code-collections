package main

import (
	"fmt"
	"github.com/gorilla/sessions"
	"log"
	"net/http"
)

const (
	CONN_HOST = "localhost"
	CONN_PORT = "8080"
)

var store *sessions.CookieStore

func init() {
	store = sessions.NewCookieStore([]byte("secret-key"))
}

func home(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session-name")
	var authenticated interface{} = session.Values["authenticated"]
	if authenticated != nil {
		isAuthenticated := session.Values["authenticated"].(bool)

		if !isAuthenticated {
			http.Error(w, "you are unauthorized to view the page", http.StatusForbidden)
			return
		}

		fmt.Fprintf(w, "home page")
	} else {
		http.Error(w, "you are unauthorized to view the page", http.StatusForbidden)
		return
	}
}

func login(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session-name")
	session.Values["authenticated"] = true
	session.Save(r, w)
	fmt.Fprintf(w, "you have successfully loggend in.")
}

func logout(w http.ResponseWriter, r *http.Request) {
	session, _ := store.Get(r, "session-name")
	session.Values["authenticated"] = false
	session.Save(r, w)
	fmt.Fprintf(w, "you have successfully logged out.")
}

func main() {
	http.HandleFunc("/home", home)
	http.HandleFunc("/login", login)
	http.HandleFunc("/logout", logout)

	err := http.ListenAndServe(CONN_HOST+":"+CONN_PORT, nil)
	if err != nil {
		log.Fatal("error strating http server: ", err)
		return
	}
}
