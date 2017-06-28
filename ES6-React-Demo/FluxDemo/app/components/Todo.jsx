import React from 'react';
import uuid from 'uuid';

import TodoAction from '../actions/ToDoAction';
import TodoStore from '../stores/ToDoStore';
import List from './List';
import CreateButton from './CreateButton';

class Todo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: TodoStore.getAll()
    };

    this.createTodo = this.createTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    TodoStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    TodoStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({
      todos: TodoStore.getAll()
    });
  }

  createTodo() {
    // 创建Todo的事件回调
    TodoAction.create({ id: uuid.v4(), content: '3rd stuff' });
  }

  deleteTodo(id) {
    // 删除Todo的事件回调
    TodoAction.delete(id);
  }

  render() {
    return (
      <div>
        <List items={this.state.todos} onDelete={this.deleteTodo} />
        <CreateButton onClick={this.createTodo} />
      </div>
    );
  }
}

export default Todo;
