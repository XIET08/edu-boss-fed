import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'

const request = axios.create({})

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refresh_token 只能使用一次
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
let isRefreshing = false // 控制刷新token的状态
let requests: Function[] = [] // 存储刷新token期间过来的401请求
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  if (error.response) {
    // 请求发出去收到响应了，但是状态码超出 2xx 范围
    const { status } = error.response
    if (status === 400) {
      Message.error('请求参数错误')
    } else if (status === 401) {
      // token 无效（没有提供 token， token 是无效的， token 过期了）
      // 如果有 refresh_token，则尝试使用 refresh_token 获取 新的 access_token
      if (!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }

      if (!isRefreshing) {
        isRefreshing = true // 开启刷新状态
        // 尝试刷新获取新的 token
        return refreshToken().then(res => {
          if (!res.data.success) {
            throw new Error('刷新 Token 失败')
          }

          store.commit('setUser', res.data.content)
          console.log(error.config) // 失败请求的配置信息
          requests.forEach(cb => cb())
          // 重置 requests 数组
          requests = []
          return request(error.config)
        }).catch(error => {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }).finally(() => {
          isRefreshing = false // 重置刷新状态
        })
      }

      // 刷新状态下，把请求挂起放到 requests 数组中
      return new Promise(resolve => {
        requests.push(() => {
          resolve(request(error.config))
        })
      })
      // // 尝试刷新获取新的 token
      // try {
      //   const { data } = await axios.create()({
      //     method: 'POST',
      //     url: '/front/user/refresh_token',
      //     data: qs.stringify({
      //       // refresh_token 只能使用一次
      //       refreshtoken: store.state.user.refresh_token
      //     })
      //   })
      //   // 把本次刷新拿到的 access_token 更新到容器和本地存储中
      //   store.commit('setUser', data.content)
      //   console.log(error.config) // 失败请求的配置信息
      //   return request(error.config)
      // } catch (error) {
      //   // 把当前登录用户状态清除
      //   store.commit('setUser', null)
      //   redirectLogin()
      //   return Promise.reject(error)
      // }
    } else if (status === 403) {
      Message.error('没有权限，请联系管理员')
    } else if (status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) {
    // 请求发出去没有收到响应
    Message.error('请求超时，请刷新重试')
  } else {
    // 在设置请求时触发了错误
    Message.error(`请求失败：${error.message}`)
  }
  // 把请求失败的错误对象继续抛出
  return Promise.reject(error)
})

export default request
