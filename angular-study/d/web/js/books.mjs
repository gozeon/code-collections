import {copy} from '/js/utils.mjs'

export default () => {
  console.log('Hi from the default export!');
};

// Named export `doStuff`
export const doStuff = () => {
  console.log('Doing stuff…');
};

export const loadPageInto = (el) => {
  console.log(copy({name: 'books'}))
  el.textContent = 'book';
}
