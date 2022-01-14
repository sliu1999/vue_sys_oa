import request from '@/utils/request'

/**
 * 获取所有角色下拉列表
 * @param {}} data 
 * @returns 
 */
export function getAllRole() {
  return request({
    url: '/usermanage/api/getAllRole',
    method: 'get'
  })
}

/**
 * 
 * @returns 获取角色分页列表
 */
export function getRolePage(data) {
  return request({
    url: '/usermanage/api/roles/page',
    method: 'get',
    params: data
  })
}

/**
 * 保存角色
 * @param {*} data 
 * @returns 
 */
export function saveRole(data) {
  return request({
    url: '/usermanage/api/roles',
    method: 'post',
    data: data
  })
}

/**
 * 删除角色
 * @param {} id 
 * @returns 
 */
export function delRoleById(id) {
  return request({
    url: '/usermanage/api/roles/'+id,
    method: 'delete'
  })
}

/**
 * 获取角色
 * @param {*} id 
 * @returns 
 */
export function getRoleById(id) {
  return request({
    url: '/usermanage/api/roles/'+id,
    method: 'get'
  })
}

export function getRoleListByIds(ids) {
  return request({
    url: '/usermanage/api/roles/getRoleListByIds/'+ids,
    method: 'get'
  })
}
