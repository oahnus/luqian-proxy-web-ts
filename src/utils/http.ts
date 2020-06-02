import axios, {AxiosResponse} from 'axios'
import { RespData } from '@/types/RespData'
import { Message } from 'element-ui';
import router from '@/router/index'
import Vue from 'vue'

let instance: any = {}

instance = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

instance.interceptors.request.use(
  (config: any) => {
    let token = Vue.cookies.get('token')
    let headers = config['headers']
    if (headers) {
      headers['AUTH'] = Vue.cookies.get('token')
    } else {
      config['headers'] = {
        'AUTH': Vue.cookies.get('token')
      }
    }
    return config
  },
  (error: any) => {
    // Do something with request error
    console.error('error:', error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器 axios的一些配置
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      const respData: RespData = response.data
      if (respData.code === 0) {
        return respData.data
      } else {
        if (respData.code === 60401) {
          router.replace('/')
        } else {
          Message({
            message: respData.msg,
            type: 'error'
          })
        }
        return Promise.reject(new Error(respData.msg || 'Error'))
      }
    } else {
      Message({
        message: '网络错误',
        type: 'error'
      })
      return Promise.reject(new Error(response.data.msg || 'Error'));
    }
    return response;
  },
  (error: any) => {
    console.error('error:' + error); // for debug
    return Promise.reject(error);
  }
);

export default instance;
