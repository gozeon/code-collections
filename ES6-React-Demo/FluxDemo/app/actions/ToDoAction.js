import AppDispatcher from '../dispatcher/AppDispatcher';

const ToDoAction = {
  // 用一个函数包裹AppDispatcher.dispatch方法
  create(todo) {
    AppDispatcher.dispatch({
      actionType: 'CREATE_TODO',
      todo
    });
  },
  delete(id) {
    AppDispatcher.dispatch({
      actionType: 'DELETE_TODO',
      id
    });
  }
};

export default ToDoAction;
