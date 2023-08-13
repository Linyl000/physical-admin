import request from '@/utils/request'

export function getExamList(query) {
  return request({
    url: '/api/exam/paper/list',
    method: 'get',
    params: query
  })
}

export function getExamById(id) {
    return request({
      url: '/api/exam/paper/'+id,
      method: 'get',
    })
  }

  export function addExampaper(data) {
    return request({
      url: '/api/exam/paper',
      method: 'post',
      data
    })
  }

  export function editExampaper(data) {
    return request({
      url: '/api/exam/paper',
      method: 'put',
      data
    })
  }

  export function delExampaper(ids) {
    return request({
      url: '/api/exam/paper/'+ids,
      method: 'DELETE',
    })
  }