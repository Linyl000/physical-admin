import request from '@/utils/request'

// 查询课程列表
export function listCourse(query) {
  return request({
    url: '/api/base/course/list',
    method: 'get',
    params: query
  })
}

// 查询课程详细
export function getCourse(id) {
  return request({
    url: '/api/base/course/' + id,
    method: 'get'
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: '/api/base/course',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateCourse(data) {
  return request({
    url: '/api/base/course',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delCourse(id) {
  return request({
    url: '/api/base/course/' + id,
    method: 'delete'
  })
}
//老师列表
export function listTeacher(query) {
  return request({
    url: '/api/system/teacher/list',
    method: 'get',
    params: query
  })
}
