import request from '@/utils/request'

//获取部门树DeptApi.getTreeList
export function getDepartTree() {
  return request({
    url: '/usermanage/api/departments/treeTwo',
    method: 'get'
  })
}
//获取除当前点击的部门外其他部门树
export function getDepartTreeExceptMe(param) {
  return request({
    url: '/usermanage/api/departments/treeExceptMe',
    method: 'get',
    params: param
  })
}
//获取部门列表
export function getDepartListExceptMe(param) {
  return request({
    url: '/usermanage/api/departments/treeExceptMeList',
    method: 'get',
    params: param
  })
}

export function saveDepart(data) {
  return request({
    url: '/usermanage/api/departments',
    method: 'post',
    data: data
  })
}

//获取部门详情DeptApi.getDept
export function queryDepartInfo(id){
  return request({
    url: '/usermanage/api/departments/'+id,
    method: 'get'
  })
}

export function queryDepartPage(data){
  return request({
    url: '/usermanage/api/departments/page',
    method: 'get',
    params: data
  })
}


export function deleteDepartInfo(id){
  return request({
    url: '/usermanage/api/departments/'+id,
    method: 'delete'
  })
}

//DeptApi.getDeptById
export function getDepartListByIds(ids){
  return request({
    url: '/usermanage/api/getDepartListByIds/'+id,
    method: 'get'
  })
}

//DeptApi.getAllDeptList
export function departmentList(data){
  return request({
    url: '/usermanage/api/departmentList',
    method: 'get',
    params: data
  })
}




