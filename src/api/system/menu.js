import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/usermanage/api/menus/treeTwo',
    method: 'get'
  })
}

export function getRoleMenuTree(roleId) {
  return request({
    url: '/usermanage/api/menus/tree/'+roleId,
    method: 'get'
  })
}

export function saveMenu(data) {
  return request({
    url: '/usermanage/api/menus',
    method: 'post',
    data: data
  })
}

export function queryAllStairMenu(){
  return request({
    url: '/usermanage/api/queryAllStairMenu',
    method: 'get'
  })
}


export function queryMenuInfo(id){
  return request({
    url: '/usermanage/api/menus/'+id,
    method: 'get'
  })
}


export function deleteMenuInfo(id){
  return request({
    url: '/usermanage/api/menus/'+id,
    method: 'delete'
  })
}

