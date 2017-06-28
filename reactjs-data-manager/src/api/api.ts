import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

axios.defaults.baseURL = "https://api.gagogroup.cn/api/v3";
axios.defaults.headers.common['token'] = 'gdc_longrun';

/*添加请求拦截器*/
// axios.interceptors.request.use(function (config: AxiosRequestConfig) {
//   /*在发送请求之前做某事*/
//   return config;
// }, function (error) {
//   /*请求错误时做些事*/
//   return Promise.reject(error);
// });

/*添加响应拦截器*/
axios.interceptors.response.use(function (response: AxiosResponse) {
  /*对响应数据做些事*/
  const result = response.data;
  if (result.hasOwnProperty('data')) {
    return Promise.resolve(result.data);
  }
  if (result.hasOwnProperty('error')) {
    return Promise.reject(new Error(result.error.message));
  }
}, function (error) {
  /*请求错误时做些事*/
  return Promise.reject(error);
});

class Api {
  static async getEffectiveDate(year: number): Promise<any> {
    return await axios.get(`/ndvi/dates?years=[${2017}]`)
  }
}

export default Api;
