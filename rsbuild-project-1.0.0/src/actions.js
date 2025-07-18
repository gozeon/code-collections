function callAction({ actionName, callback }) {
  const funcName = `action_callback_${Math.random().toString(36).slice(-5)}`;
  window[funcName] = function () {
    callback && callback(...arguments);
  };

  AAAA.sdk[actionName](funcName);
}

export function getAppInfo() {
  return new Promise((res, rej) => {
    callAction({
      actionName: 'getAppInfo',
      callback: (r) => res(r),
    });
  });
}

export function getUserInfo() {
  return new Promise((res, rej) => {
    callAction({
      actionName: 'getUserInfo',
      callback: (r) => res(r),
    });
  });
}

export function requestPost({ url, paramsJson = '', timeout = 60 }) {
  return new Promise((res, rej) => {
    const funcName = `action_callback_${Math.random().toString(36).slice(-5)}`;
    window[funcName] = function () {
      res(...arguments);
    };
    AAAA.sdk.requestPost(url, paramsJson, timeout, funcName);
  });
}

export function selectImage() {
  return new Promise((res, rej) => {
    callAction({
      actionName: 'selectImage',
      callback: (r) => res(r),
    });
  });
}
