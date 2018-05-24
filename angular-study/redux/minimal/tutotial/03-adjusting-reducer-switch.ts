interface Action {
  type: string,
  payload?: any;
}

interface Reducer<T> {
  (state: number, action: Action): T;
}

let reducer: Reducer<number> = (state: number, action: Action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

let incrementAction: Action = { type: "INCREMENT" };
console.log(reducer(9, incrementAction));
let decrementAction: Action = { type: "DECREMENT" };
console.log(reducer(11, decrementAction));
// bash ./node_modules/.bin/ts-node 03-adjusting-reducer-switch.ts