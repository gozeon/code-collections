interface Action {
  type: string;
  payload?: any;
}

interface Reducer<T> {
  (state: T, action: Action): T;
}

let reducer: Reducer<number> = (state: number, action: Action) => {
  return state;
}

console.log(reducer(1, null));
// bash ./node_modules/.bin/ts-node 01-identity-reducer.ts