import request from '@/utils/request'

export function selectCommonDic(param) {
  return request({
    url: '/usermanage/api/selectCommonDic',
    method: 'get',
    params: param
  })
}