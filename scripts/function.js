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

/**
 * to use Object.assign()
 */
function arrToJsonNull(arr) {
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

  return arrToJson(arr);
}


console.log(arrToJsonNull(['a', 'b', 'c'])) // {"a":{"b":{"c":null}}}
// console.log(arrToJsonNull(['a'])) // {"a":null}

/**
 * deep map Object
 * @param {Function} f 
 * @param {Object} obj 
 */
var deepMap = function (f, obj) {
  return Object.keys(obj).reduce(function (acc, k) {
    if ({}.toString.call(obj[k]) == '[object Object]') {
      acc[k] = deepMap(f, obj[k])
    } else {
      acc[k] = f(obj[k], k)
    }
    return acc
  }, {})
}

var add1 = function (val, key) {
  console.log(key, val);
  return val*2;
}

var o = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  }
}

console.log(deepMap(add1, o)) // { a: 2, b: { c: 4, d: { e: 6 } } }