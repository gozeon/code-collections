import { isArray, isString, isEmpty } from "lodash";

function Search(data, query) {
  return new Promise((resolve, reject) => {
    if (isArray(data) && isString(query)) {
      if (isEmpty(data) || isEmpty(query)) {
        resolve(data);
      }
      resolve(data.filter(item => new RegExp(query, "ig").test(item)));
    }
    reject("参数错误");
  });
}

export { Search };
