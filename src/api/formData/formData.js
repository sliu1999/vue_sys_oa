import request from '@/utils/request'

const formDataApi = {
  create: function() {
    const obj = {}
    // 提交表单数据
    obj.submit = function(data) {
      return request({
        url: '/usermanage/api/oa/submit',
        method: 'post',
        data: data
      })
    }
    // 历史列表删除
    obj.delHistory = function(processIds) {
      return request({
        url: '/usermanage/api/oa/deleteProcess/' + processIds,
        method: 'delete'
      })
    }
    //历史流程分页
    obj.getHistoryList = function(data) {
		  return request({
		    url: '/usermanage/api/oaProcessHiss',
		    method: 'get',
		    params:data
		  })
		}
    //获取待办列表
    obj.getAgencyList = function(data) {
      return request({
        url: '/usermanage/api/oa/listRunProcess',
        method: 'get',
        params:data
      })
    }
    //获取流程详情
    obj.getAgencyList = function(data) {
      return request({
        url: '/usermanage/api/oa/listRunProcess',
        method: 'get',
        params:data
      })
    }

    // 获取某个历史表单详情
    obj.selectHisData = function(id) {
      return request({
        url: '/usermanage/api/oa/getHisProcessDetail/' + id,
        method: 'get'
      })
    }

    //根据此接口返回值判断是否退回到了开始节点
    obj.getProcessLog = function(id) {
      return request({
        url: '/usermanage/api/oa/getProcessLog/' + id,
        method: 'get'
      })
    }
    // 获取某个待办表单详情
    obj.selectData = function(id) {
      return request({
        url: '/usermanage/api/oa/getProcessDetail/' + id,
        method: 'get'
      })
    }
    // 获取某个待办表单详情(表单数据date类型数据未处理)
    obj.selectDataTwo = function(id) {
      return request({
        url: '/usermanage/api/oa/getProcessDetailTwo/' + id,
        method: 'get'
      })
    }

     // 待办事项通过
     obj.approve = function(data) {
      return request({
        url: '/usermanage/api/oa/handle',
        method: 'post',
        data
      })
    }

    // 待办事项转交
    obj.transfer = function(data) {
      return request({
        url: '/usermanage/api/oa/transfer',
        method: 'post',
        data
      })
    }
    // 待办事项拒绝
    obj.refuse = function(data) {
      return request({
        url: '/usermanage/api/oa/refuse',
        method: 'post',
        data
      })
    }

    return obj
  }
}.create()

export default formDataApi
