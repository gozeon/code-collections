/**
 * ['a', 'b', 'c', 'd']
 * to
 * {
 *  'a' : {
 *    'b': {
 *      'c' : 'd' 
 *   }    
 *  }
 * }
 * @param {Array} arr 
 */
const arrToJson = (arr) => {
  let num = arr.length - 1;
  if (num === 0) {
    return JSON.stringify(arr[0]);
  }
  let tmp = {};
  tmp[arr[num - 1]] = arr[num];
  arr = arr.slice(0, -2);
  arr.push(tmp);
  return arrToJson(arr);
}

const result = arrToJson(['a','b','c','d'])
console.log(result); // {"a":{"b":{"c":"d"}}}