/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'
// import store from '@/store'

interface User {
  phone: string
  password: string
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    // 如果 data 是普通对象，则 Content-Type 是 application/json
    // 如果 data 是 qs.stringify(data) 转换之后的数据位 key=value&key=value，则Content-Type 为 application/x-www-form-urlencoded
    // 如果 data 是 FormData， 则 Content-Type 是 multipart/form-data
    // axios 默认发送的是 application/json
    data: qs.stringify(data)
  })
}

export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}
