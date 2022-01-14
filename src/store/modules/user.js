import { login, logout, getInfo } from '@/api/system/user'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo, getUserInfoSession, setUserInfoSession, removeUserInfoSession } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  currentUserInfo: getUserInfo(),
  currentUserInfoSession: getUserInfoSession(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, currentUserInfo) => {
    state.currentUserInfo = currentUserInfo
  },
  SET_USER_INFO_SESSION: (state, currentUserInfoSession) => {
    state.currentUserInfoSession = currentUserInfoSession
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login 用户登录
  login({ commit }, userInfo) {
    // 定义登录信息用户名，密码
    const { username, password, code, uuid } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, code: code, uuid: uuid }).then(response => {
        const { data } = response
        // 设置token Cookie
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        // 设置userInfo Cookie
        commit('SET_USER_INFO', JSON.stringify({'userId':data.userId,'username':data.username}))
        setUserInfo(JSON.stringify({'userId':data.userId,'username':data.username}))
        //设置userInfo Session
        commit('SET_USER_INFO_SESSION', JSON.stringify({'userId':data.userId,'username':data.username}))
        setUserInfoSession(JSON.stringify({'userId':data.userId,'username':data.username}))

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info 获取用户信息，做验证
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        //同步操作mutations中的方法
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout 用户退出
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_USER_INFO', '')
        commit('SET_USER_INFO_SESSION', '')
        removeUserInfoSession()
        removeUserInfo()
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        //异步操作actions的方法
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      commit('SET_USER_INFO', '')
      removeUserInfo()
      commit('SET_USER_INFO_SESSION', '')
      removeUserInfoSession()
      resolve()
    })
  },

  // dynamically modify permissions 动态修改用户角色，权限 用不到
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
