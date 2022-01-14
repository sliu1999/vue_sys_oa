import request from '@/utils/request'

const AccessApi = {
  create: function() {
    const obj = {}

    // 获取发起权限列表
    obj.getStartAccessList = function() {
      return request({
        url: '/usermanage/api/oaFormMains/list',
        method: 'get'
      })
    }

    // 查询单个发起权限详情
    obj.getStartAccess = function(id) {
      return request({
        url: '/usermanage/api/oaFormMains/' + id,
        method: 'get'
      })
    }

    // 删除发起权限
    obj.delStartAccess = function(id) {
      return request({
        url: '/usermanage/api/oaFormMains/' + id,
        method: 'delete'
      })
    }

    // 新增发起权限
    obj.addStartAccess = function(data) {
      return request({
        url: '/usermanage/api/oaFormMains',
        method: 'post',
        data
      })
    }

     // 修改发起权限
     obj.editStartAccess = function(data) {
      return request({
        url: '/usermanage/api/oaFormMains',
        method: 'put',
        data
      })
    }







    // 新增表单分类
    obj.addFormCats = function(url, data) {
      return request({
        url: url + '/OaFormModType/add',
        method: 'post',
        data
      })
    }
    // 修改表单某个分类
    obj.editFormCats = function(url, data) {
      return request({
        url: url + '/OaFormModType/update',
        method: 'post',
        data
      })
    }
    // 删除表单某个分类
    obj.delFormCats = function(url, id) {
      return request({
        url: url + '/OaFormModType/remove/' + id,
        method: 'post'
      })
    }
    // 修改表单分类下某个模块
    obj.editFormMods = function(url, data) {
      return request({
        url: url + '/OaFormMod/update',
        method: 'post',
        data
      })
    }
    // 删除表单分类下某个模块
    obj.delFormMods = function(url, id) {
      return request({
        url: url + '/OaFormMod/remove/' + id,
        method: 'post'
      })
    }
    // 确认删除表单分类(有实例)下某个模块
    obj.confirmDelFormMods = function(url, id) {
      return request({
        url: url + '/OaFormMod/delete/' + id,
        method: 'post'
      })
    }
    return obj
  }
}.create()

// 登录
export default AccessApi
