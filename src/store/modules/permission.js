//静态路由 
//import { asyncRoutes, constantRoutes } from '@/router'
//动态路由
import { constantRoutes } from '@/router'
import Layout from '@/layout'
import { getToken} from '@/utils/auth'
import { getRoutes } from '@/api/system/user'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
 // 递归权限过滤和数据转换
 export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = {...route}
    if (hasPermission(roles, tmp)) {
      // 静态路由
      // if (tmp.children) {
      //   tmp.children = filterAsyncRoutes(tmp.children, roles)
      // }
      // res.push(tmp)
      // 动态路由
      const component = tmp.component
      if (route.component) {
        if (component === 'Layout') {
          tmp.component = Layout
        } else {
          // 接口组件字符串转换成组件对象
          tmp.component = (resolve) => require([`@/views/${component}`], resolve)
        }
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  token: getToken(),
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 静态路由
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
      // 动态路由
      //请求后台数据替换src/router/index.js的asyncRoutes异步路由
      getRoutes(state.token).then(response => {
        // filterAsyncRoutes方法作权限过滤和数据转换，roles为登录用户角色ID集合，如：[1,2]
        const accessedRoutes = filterAsyncRoutes(response.data, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
