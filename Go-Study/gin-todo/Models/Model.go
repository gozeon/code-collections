package Models

type Todo struct {
	Id          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

func (b *Todo) TableName() string {
	return "todo"
}
