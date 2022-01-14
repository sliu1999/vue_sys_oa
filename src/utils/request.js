import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 'http://192.168.1.245:8888'// url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
// 将token放入请求头
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    console.log(res,"res")
    //登录时报错
    if (res.errorCode === 1000 || res.errorCode === 1001) {
      Message({
        message: res.msg || 'Error!',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    }

    // if the custom code is not 20000, it is judged as an error.
    // 如果返回值errorCode 不为0 则返回弹框接口错误
    //登录到系统之后的错误

    //token错误
    // 2000未知错误 2001参数不合法  2002无效token 2003无效签名 2004token已过期 2005token缺失 2006刷新Token无效
    if (res.errorCode >=2000 ) {
      // to re-login
      MessageBox.confirm('您的用户信息已过期，您可以取消退出以留在此页面，或再次登录', '确认退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    //其他接口错误
    if (res.errorCode === -1) {
      Message({
        message: res.msg || 'Error!',
        type: 'error',
        duration: 5 * 1000
      })

      
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error,"接口请求失败") // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
