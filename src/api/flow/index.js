import request from '@/utils/request'

const FlowApi = {
  create: function () {
    const obj = {}

    //获取未绑定流程的表单列表
    obj.getMods = function() {
      return request({
        url: '/usermanage/api/flowMods',
        method: 'get'
      })
    }
    // 获取列表
    obj.getList = function (data) {
      return request({
        url: '/usermanage/api/oaFlows/list',
        method: 'get',
        params: data
      })
    }
    //获取详情
    obj.getDetail = function (flowId) {
        return request({
          url: '/usermanage/api/oaFlows/' + flowId,
          method: 'get'
        })
      }
      //流程新增
      obj.add = function (data) {
        return request({
          url: '/usermanage/api/addOrEditFlow',
          method: 'post',
          data
        })
      }
      //获取所有角色列表
      obj.getGwList = function (data) {
        return request({
          url: '/usermanage/api/getAllRole',
          method: 'get',
          params: data
        })
      }
      //获取用户分页
      obj.getNameList = function(data) {
        return request({
          url: '/usermanage/api/users/page',
          method: 'get',
          params: data
        })
      }
      //获取表单模型详情
      obj.getModule = function (formId) {
        return request({
          url: '/usermanage/api/oaFormModels/'+formId,
          method: 'get'
        })
      }
        //通过人员id获取人员信息
    obj.getUser = function (ids) {
      return request({
        url: '/usermanage/api/getUserInfoByIdStrings/'+ids,
        method: 'get',
      })
    }
      //流程删除
      obj.del = function (id) {
        return request({
          url: '/usermanage/api/oaFlows/'+id,
          method: 'delete'
        })
      }
      
      
    
    
    
    return obj
  }
}.create()

export default FlowApi
