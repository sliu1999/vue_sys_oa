import request from '@/utils/request'

export function getStaffsList(data) {
  return request({
    url: '/usermanage/api/staffs/list',
    method: 'get',
    params: data
  })
}

export function getStaffsPage(data) {
  return request({
    url: '/usermanage/api/staffs/page',
    method: 'get',
    params: data
  })
}

export function delStaffById(id) {
  return request({
    url: '/usermanage/api/staffs/'+id,
    method: 'delete'
  })
}

export function getStaffById(id) {
  return request({
    url: '/usermanage/api/staffs/'+id,
    method: 'get'
  })
}

export function saveStaff(data) {
  return request({
    url: '/usermanage/api/staffs',
    method: 'post',
    data: data
  })
}



