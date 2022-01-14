import request from '@/utils/request'


const formTableDesignApi = {
    create: function() {
        const obj = {}
            // 获取表单列表结构数据(全部)
            obj.getFormMods = function() {
                return request({
                    url: '/usermanage/api/formMods',
                    method: 'get'
                  })
                }
            // 获取表单详情
            obj.select = function(id) {
                return request({
                    url: '/usermanage/api/oaFormModels/'+id,
                    method: 'get'
                    })
                }
            // 新增表单
            obj.add = function(data) {
                return request({
                    url:  '/usermanage/api/oaFormModels',
                    method: 'post',
                    data: data
                })
            }
            // 更新表单
            obj.edit = function(data) {
                    return request({
                        url:  '/usermanage/api/updateFormModelConfig',
                        method: 'post',
                        data: data
                    })
                }
            // 获取表单权限列表结构数据
            obj.getNewMods = function() {
                return request({
                    url: '/usermanage/api/getFormListByAuth',
                    method: 'get',
                })
            }
            // 获取表单列表结构数据(type=1普通表)
            obj.getMods = function(url) {
                return request({
                    url: '/usermanage/api/mods',
                    method: 'get'
                })
            }

        return obj
    }
}.create()

export default formTableDesignApi