const json = {
  "data": {
    "files": [
      {
        "id": "13982550348454b2f7b3fd31d9e3373a3fe00c70",
        "name": "aaa",
        "type": "tree",
        "path": "aaa",
        "mode": "040000"
      },
      {
        "id": "d564d0bc3dd917926892c55e3706cc116d5b165e",
        "name": "aaa",
        "type": "tree",
        "path": "aaa/aaa",
        "mode": "040000"
      },
      {
        "id": "d2cbb5efdecf769988a9b3d952f01eef81f3cd68",
        "name": "src",
        "type": "tree",
        "path": "src",
        "mode": "040000"
      },
      {
        "id": "fb4fb5bc82666fc5cef55d7d726cf8b8bc170bcd",
        "name": "user",
        "type": "tree",
        "path": "src/user",
        "mode": "040000"
      },
      {
        "id": "1d0d980885e37a5b32ebbb2ec616fac63323d30f",
        "name": "userlist",
        "type": "tree",
        "path": "src/user/userlist",
        "mode": "040000"
      },
      {
        "id": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
        "name": ".gitkeep",
        "type": "blob",
        "path": "aaa/.gitkeep",
        "mode": "100644"
      },
      {
        "id": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
        "name": ".gitkeep",
        "type": "blob",
        "path": "aaa/aaa/.gitkeep",
        "mode": "100644"
      },
      {
        "id": "a7ee437bdce8c89d9ca5daad0c027ae8206a72af",
        "name": "use1.js",
        "type": "blob",
        "path": "src/user/use1.js",
        "mode": "100644"
      },
      {
        "id": "7c4a013e52c76442ab80ee5572399a30373600a2",
        "name": "use2.js",
        "type": "blob",
        "path": "src/user/use2.js",
        "mode": "100644"
      },
      {
        "id": "7c4a013e52c76442ab80ee5572399a30373600a2",
        "name": "user.js",
        "type": "blob",
        "path": "src/user/user.js",
        "mode": "100644"
      },
      {
        "id": "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391",
        "name": ".gitkeep",
        "type": "blob",
        "path": "src/user/userlist/.gitkeep",
        "mode": "100644"
      },
      {
        "id": "3e62046fec42187584a64baacc12ac7326d8616c",
        "name": "user.js",
        "type": "blob",
        "path": "src/user/userlist/user.js",
        "mode": "100644"
      },
      {
        "id": "b1975be14b5b45026c43377a11ea89ece2dd1368",
        "name": "test.js",
        "type": "blob",
        "path": "test.js",
        "mode": "100644"
      }
    ],
    "code": 200
  }
}

const files = json['data']['files'];
// console.log(files);

const addChildren = files.map(x => {
  delete x.id;
  delete x.mode;
  x['aPath'] = x['path'].split('/');
  x['children'] = [];

  return x;
})

// console.log(addChildren);

let count = 0;

addChildren.forEach(x => {
  if (x['aPath'].length > count) {
    count = x['aPath'].length;
  }
})
// console.log(count) // 3

let aType = [];

for (let i = 0; i < count; i++) {
  let tmp = [];
  for (let j = 0; j < addChildren.length; j++) {
    if (addChildren[j].aPath.length == i + 1) {
      tmp.push(addChildren[j]);
    }
  }
  aType[i] = tmp;
}

// console.log(JSON.stringify(aType));

// 正序

// for (let i = 0; i < aType.length - 1; i++) {

//   let l1 = aType[i].length;
//   for (let j = 0; j < l1; j++) {
//     let item = {};
//     let sPath1 = '';

//     if (aType[i][j].aPath.length <= 1) {
//       sPath1 = aType[i][j].aPath.join('');
//     } else {
//       sPath1 = aType[i][j].aPath.slice(0, -1).join('');
//     }

//     let l2 = aType[i + 1].length;
//     for (let k = 0; k < l2; k++) {
//       let sPath2 = aType[i + 1][k].aPath.slice(0, -1).join('');

//       if(sPath1 == sPath2 && aType[i][j].type == 'tree') {
//         aType[i][j].children.push(aType[i + 1][k]);
//       }
//     }
//   }
// }

// console.log(JSON.stringify(aType));

// 倒叙
for (let i = aType.length - 1; i > 0; i--) {
  for (let j = 0; j < aType[i].length; j++) {
    let sPath1 = aType[i][j].aPath.slice(0, -1).join('');
    for (let k = 0; k < aType[i - 1].length; k++) {
      let sPath2 = aType[i - 1][k].aPath.join('');
      if (sPath1 == sPath2 && aType[i]) {
        aType[i - 1][k].children.push(aType[i][j]);
      }
    }
  }
}

console.log(JSON.stringify(aType[0]));

// function aa(arr) {
//   let count = 0;
//   const arrToJson = (arr) => {

//     let num = arr.length - 1;

//     if (count === 0) {
//       count++;
//       let tmp = {};
//       tmp[arr[arr.length - 1]] = null;
//       tmp['name'] = arr[arr.length - 1];

//       if (arr.length > 1) {
//         arr.pop();
//         arr.push(tmp);
//         return arrToJson(arr);
//       }
//       return arrToJson([tmp]);
//     }

//     if (num === 0) {
//       return JSON.stringify(arr[0]);
//     }

//     let tmp = {}
//     tmp[arr[num - 1]] = arr[num];
//     tmp['name'] = arr[num - 1];

//     arr = arr.slice(0, -2);
//     arr.push(tmp);

//     count++;

//     return arrToJson(arr);
//   }
//   return arrToJson(arr);
// }

// function s(arr) {
//   const deleteIdMode = arr.map(x => {
//     delete x.id;
//     delete x.mode;
//     delete x.type;
//     return x;
//   });

//   const addApath = deleteIdMode.map(x => {
//     x['aPath'] = x['path'].split('/');
//     x['children'] = [];
//     return x;
//   })

//   for (let i = 0; i < addApath.length; i++) {
//     function aa(i) {
//       if (addApath[i + 1].aPath.length <= 1) {
//         // return addApath[i + 1]['aPath'].join('') == addApath[i]['aPath'].join('');
//         return false;
//       }
//       else {
//         return addApath[i + 1].aPath.slice(0, -1).join('') == addApath[i].aPath.join('')
//       }
//     }
//     if (addApath[i + 1].aPath.length - addApath[i].aPath.length == 1
//       &&
//       aa(i)
//     ) {
//       addApath[i].children.push(addApath[i + 1]);
//     }
//   }

//   console.log(JSON.stringify(addApath));
// }
// s(files)

// const dir1 =
//   files
//     .map(x => {
//       delete x.id;
//       delete x.mode;
//       delete x.type;
//       x['aPath'] = x["path"].split('/');

//       if (x['aPath'].length > 1) {
//         x['aPath'] = x['aPath'].slice(0, -1);
//       }

//       return x;
//     })
//     .map(x => {
//       if (x["aPath"].length === 1) {
//         x['children'] = [

//         ];
//       }
//       return x
//     })

// console.log(JSON.stringify(dir1));

// function s(arr) {
//   let dirCount = 0;
//   const tree = arr.filter(x => x.type == 'tree').map(x => {
//     x['aPath'] = x['path'].split('/');
//     x['aPath'].length > dirCount ? dirCount = x['aPath'].length : dirCount;
//     x['children'] = [];
//     return x;
//   });

//   for (let i = 0; i < dirCount; i++) {
//     const deep1 = tree.filter(x => x['aPath'].length == i+1)
//     console.log(deep1);
//   }

//   console.log(JSON.stringify(tree));
//   console.log(dirCount);
// }
// s(files);

// const pathToArr = files.map(item => {
//   item['path'] = item['path'].split('/');
//   return item;
// })

// const pathToJson = pathToArr.map(item => {
//   item['path'] = aa(item['path']);
//   return item;
// })
// console.log(pathToJson);

// const pathToArr = files.map(item => {
//   let tmp = item['path'].split('/');
//   // tmp.unshift('name');
//   item['aPath'] = tmp;
//   return item;
// })

// const pathToJson = pathToArr.map(item => {
//   item['oPath'] = aa(item['aPath']);
//   delete item.id;
//   delete item.mode;
//   return item;
// })
// console.log(pathToJson);
// console.log(pathToJson.length);
// console.log(files.length);

// let result = {};

// pathToJson.forEach(item => result = Object.assign({}, result, JSON.parse(item['oPath'])));

// console.log(JSON.stringify(result));

// let tt = JSON.stringify(result);


// function n(obj) {
//   for (let i = 0; i < Object.keys(obj).length; i++) {

//   }
//   Object.keys(obj).forEach(item => {
//     // console.log(obj[item])
//     if (typeof obj[item] === 'string') {
//       obj['name'] = item;
//     }

//     return n(obj);
//     // console.log(Object.keys(obj[item]));
//     // console.log(typeof obj[item])
//   })
// }
// n(data);

// console.log(JSON.stringify(data));

// var data = {
//   a: {
//     b: {
//       c: 'd'
//     }
//   },
//   e: 'f'
// }

// var deepMap = function (f, obj) {
//   return Object.keys(obj).reduce(function (acc, k) {
//     // acc['name'] = k;
//     if ({}.toString.call(obj[k]) == '[object Object]') {
//       acc[k] = deepMap(f, obj[k])
//     } else {
//       // acc[k] = f(obj[k], k)
//       acc[k] = {
//         children: [{
//           name: obj[k]
//         }]
//       }
//     }
//     return acc
//   }, {})
// }

// console.log(JSON.stringify(deepMap(function (x) { return x }, data)))


/**
 * return []
 * @param {*} files 
 */
function formatFiles(files) {
  const addChildren = files.map(x => {
    delete x.id;
    delete x.mode;
    x['aPath'] = x['path'].split('/');
    x['children'] = [];

    return x;
  })

  let count = 0;

  addChildren.forEach(x => {
    if (x['aPath'].length > count) {
      count = x['aPath'].length;
    }
  })

  let aType = [];

  for (let i = 0; i < count; i++) {
    let tmp = [];
    for (let j = 0; j < addChildren.length; j++) {
      if (addChildren[j].aPath.length == i + 1) {
        tmp.push(addChildren[j]);
      }
    }
    aType[i] = tmp;
  }

  for (let i = aType.length - 1; i > 0; i--) {
    for (let j = 0; j < aType[i].length; j++) {
      let sPath1 = aType[i][j].aPath.slice(0, -1).join('');
      for (let k = 0; k < aType[i - 1].length; k++) {
        let sPath2 = aType[i - 1][k].aPath.join('');
        if (sPath1 == sPath2 && aType[i]) {
          aType[i - 1][k].children.push(aType[i][j]);
        }
      }
    }
  }

  return aType[0];
}