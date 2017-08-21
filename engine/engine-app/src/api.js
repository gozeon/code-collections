import axios from 'axios';
import token from './token';
import MiniStorage from './storage';

const client = axios.create({
  baseURL: __API__,
  params: {
    token: token.getToken()
  }
});

client.interceptors.request.use(function (config) {
  // Do something before request is sent
  Map.reset();
  $('div#loading').css('display', 'flex');
  $('div#print').text('');
  $('div#print').empty();
  $('div#error').empty();
  $('div#error').hide();
  $('div#layerBar').hide();
  $('div#layerBarList').empty();
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

client.interceptors.response.use(function (response) {
  $('div#loading').hide();
  const result = response.data;

  if (result.hasOwnProperty('data')) {
    return Promise.resolve(result.data);
  }
  if (result.hasOwnProperty('error')) {
    return Promise.reject(new Error(result.error.message));
  }
}, function (error) {
  /*请求错误时做些事*/
  $('div#loading').hide();

  // HTTP status code 401
  if (error.response && error.response.status == 401) {
    $('<div>Authorization failed, Try refreshing the app!<div>')
      .css({
        "position": "absolute",
        "background-color": "rgba(204, 11, 11, 0.94)",
        "color": "#fff",
        "padding": "2px 5px",
        "top": "70px",
        "left": "50%",
        "width": "160px",
        "margin-left": "-80px",
        "z-index": "9"
      }).appendTo($('body'));
    MiniStorage.clean();
    setTimeout(() => location.reload(), 3000);
  }
  return Promise.reject(error);
});

class Api {
  static async login(name, paw) {
    return await client({
      method: 'post',
      url: '/login',
      data: {
        username: name,
        password: paw
      }
    })
  }
  static async runCode(code) {
    return await client({
      method: 'post',
      url: '/task',
      data: {
        playgroundSourceCode: code
      }
    })
  }
  static async getAllFiles() {
    return await client({
      method: 'get',
      url: `/user/files?recursive=true`
    })
      .then(data => data['tree'] || [])
      .then(data => formatFiles(data))
  }
  static async getFileContent(path) {
    return await client({
      method: 'get',
      url: `/user/file?file_path=${path}`
    })
  }
  static async createFile(path, content) {
    return await client({
      method: 'post',
      url: `/user/file`,
      data: {
        filePath: path,
        content: content
      }
    })
  }

  static async updateFileContent(path, content) {
    return await client({
      method: 'put',
      url: `/user/file`,
      data: {
        filePath: path,
        content: content
      }
    })
  }
}

function formatFiles(files) {
  if(files.length == 0) {
    return [];
  }
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

export default Api;
