import Cookies from 'js-cookie'

//设置token Cookie
const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

//设置用户信息Cookie
const UserInfoKey = 'user-info'

export function getUserInfo() {
  return Cookies.get(UserInfoKey)
}

export function setUserInfo(userInfo) {
  return Cookies.set(UserInfoKey, userInfo)
}

export function removeUserInfo() {
  return Cookies.remove(UserInfoKey)
}

//设置user session
//sessionStorage生命周期为当前窗口或标签页，一旦窗口或标签页被永久关闭了，那么所有通过sessionStorage存储的数据也就被清空了
 const UserInfoSession = 'user-info-session'

 export function getUserInfoSession() {
   return window.sessionStorage.getItem(UserInfoSession)
 }

 export function setUserInfoSession(userInfoSession) {
   return window.sessionStorage.setItem(UserInfoSession, userInfoSession)
 }

 export function removeUserInfoSession() {
   return window.sessionStorage.removeItem(UserInfoSession)
 }