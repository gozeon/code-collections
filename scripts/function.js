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
// const arrToJson = (arr) => {
//   let num = arr.length - 1;
//   if (num === 0) {
//     return JSON.stringify(arr[0]);
//   }
//   let tmp = {};
//   tmp[arr[num - 1]] = arr[num];
//   arr = arr.slice(0, -2);
//   arr.push(tmp);
//   return arrToJson(arr);
// }

// const result = arrToJson(['a','b','c','d'])
// console.log(result); // {"a":{"b":{"c":"d"}}}


/**
 * to use Object.assign()
 */
let count = 0;
const arrToJson = (arr) => {

  let num = arr.length - 1;

  if (count === 0) {
    count++;
    let tmp = {};
    tmp[arr[arr.length - 1]] = null;

    if (arr.length > 1) {
      arr.pop();
      arr.push(tmp);
      return arrToJson(arr);
    }
    return arrToJson([tmp]);
  }

  if (num === 0) {
    return JSON.stringify(arr[0]);
  }

  let tmp = {}
  tmp[arr[num - 1]] = arr[num];
  arr = arr.slice(0, -2);
  arr.push(tmp);

  count++;

  return arrToJson(arr);
}

// console.log(arrToJson(['a', 'b', 'c'])) // {"a":{"b":{"c":null}}}
console.log(arrToJson(['a'])) // {"a":null}