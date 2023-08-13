import request from '@/utils/request'

export function getTitleList(query) {
  return request({
    url: '/api/exam/title/list',
    method: 'get',
    params: query
  })
}

export function getTitleById(id) {
    return request({
      url: '/api/exam/title/'+id,
      method: 'get',
    })
  }

  export function addTitlepaper(data) {
    return request({
      url: '/api/exam/title',
      method: 'post',
      data
    })
  }

  export function editTitlepaper(data) {
    return request({
      url: '/api/exam/title',
      method: 'put',
      data
    })
  }

  export function delTitlepaper(ids) {
    return request({
      url: '/api/exam/title/'+ids,
      method: 'DELETE',
    })
  }