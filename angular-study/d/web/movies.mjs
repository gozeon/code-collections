import {copy} from '/utils.mjs'

export default () => {
  console.log('Hi from the default export!');
};

// Named export `doStuff`
export const doStuff = () => {
  console.log('Doing stuff…');
};

export const loadPageInto = (el) => {
  alert(copy({name: 'movies'}))
  el.textContent = 'movies';
}
