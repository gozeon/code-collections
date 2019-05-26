package search

import "log"

type defaultMatcher struct {
}

func init() {
	log.Println("search/default: run init()")
	var matcher defaultMatcher
	Register("default", matcher)
}

func (m defaultMatcher) Search(feed *Feed, searchTern string) ([]*Result, error) {
	return nil, nil
}
