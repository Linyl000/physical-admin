import request from '@/utils/request'

export function coureseTaskList(query) {
  return request({
    url: '/api/work/coureseTask/list',
    method: 'get',
    params: query
  })
}