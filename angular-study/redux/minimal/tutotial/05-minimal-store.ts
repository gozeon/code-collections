interface Action {
  type: string;
  payload?: any;
}

interface Reducer<T> {
  (state: T, action: Action): T;
}

class Store<T> {
  private _state: T;

  constructor(private reducer: Reducer<T>, initialState: T) {
    this._state = initialState;
  }

  getState(): T {
    return this._state;
  }
  dispatch(action: Action): void {
    this._state = this.reducer(this._state, action);
  }
}
let reducer: Reducer<number> = (state: number, action: Action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'PLUS':
      return state + action.payload;
    default:
      return state;
  }
};

let store = new Store<number>(reducer, 1);
console.log(store.getState());

store.dispatch({ type: "INCREMENT" });
console.log(store.getState());

store.dispatch({ type: "DECREMENT" });
console.log(store.getState());

store.dispatch({ type: "PLUS", payload: 9 });
console.log(store.getState());

// bash ./node_modules/.bin/ts-node 05-minimal-store.ts
