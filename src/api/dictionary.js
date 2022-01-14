import request from '@/utils/request'

const DictionaryApi = {
    create: function() {
        const obj = {}
        // 获取列表
        obj.getDictionaryListNoPage = function(parentId) {
            return request({
                url: '/usermanage/api/SysDictionary/list/' + parentId,
                method: 'get'
            })
        }
        // 获取tree列表
        obj.getTreeDictionary = function(id) {
        return request({
            url: '/usermanage/api/SysDictionary/tree/' + id,
            method: 'get'
        })
        }
        // 通过id获取name
        obj.getDictionaryName = function(id) {
            return request({
                url: '/usermanage/api/SysDictionary/getNameByIds/' + id,
                method: 'get'
            })
        }
        // 获取多个字典LIST
        obj.getDictionaryLabels = function(ids) {
            return request({
                url:'/usermanage/api/SysDictionary/getList/' + ids,
                method: 'get'
            })
        }





            // 获取列表
        obj.getDictionaryList = function(url, parentId, pageNum, pageSize, dictionaryName) {
                return request({
                    url: url + '/SysDictionary/list/' + parentId + '/' + pageNum + '/' + pageSize + '?dictionaryName=' + dictionaryName,
                    method: 'get'
                })
            }
         
         
            // 获取列表
        obj.getRoleDictionaryList = function(url, roleId) {
                return request({
                    url: url + '/SysRoleDictionary/list/' + roleId,
                    method: 'get'
                })
            }
          
            // 获取列表id
        obj.getRoleDictionaryIdList = function(url, roleId) {
                return request({
                    url: url + '/SysRoleDictionary/idList/' + roleId,
                    method: 'get'
                })
            }
            // 获取
        obj.getDictionary = function(url, id) {
                return request({
                    url: url + '/SysDictionary/' + id,
                    method: 'get'
                })
            }
            // 新增
        obj.addDictionary = function(url, data) {
                return request({
                    url: url + '/SysDictionary/add',
                    method: 'post',
                    data
                })
            }
            // 编辑
        obj.editDictionary = function(url, data) {
                return request({
                    url: url + '/SysDictionary/edit',
                    method: 'post',
                    data
                })
            }
            // 删除
        obj.delDictionary = function(url, id) {
                return request({
                    url: url + '/SysDictionary/remove/' + id,
                    method: 'post'
                })
            }

        // 批量删除菜单
        obj.delRoleList = function(url, ids) {
            return request({
                url: url + '/SysDictionary/deleteIdList/' + ids,
                method: 'delete'
            })
        }
        return obj
    }
}.create()

export default DictionaryApi