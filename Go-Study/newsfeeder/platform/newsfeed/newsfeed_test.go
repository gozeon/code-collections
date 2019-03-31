package newsfeed

import "testing"

func TestRepo_Add(t *testing.T) {
	feed := New()
	feed.Add(Item{})

	if len(feed.Items) == 0 {
		t.Errorf("item was not added")
	}
}

func TestRepo_GetAll(t *testing.T) {
	feed := New()
	feed.Add(Item{})
	results := feed.GetAll()
	if len(results)!=1 {
		t.Errorf("Item was not added")
	}
}