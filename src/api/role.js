import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/api/role/query',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/api/role/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    },
    data: data,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'))
        return ret
      }
    ]
  })
}

export function updateRole(data) {
  return request({
    url: `/api/role/update`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    },
    data: data,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'))
        return ret
      }
    ]
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/role/del?roleId=${id}`,
    method: 'get'
  })
}

export function addRoleCcd(data) {
  return request({
    url: '/api/roleCcd/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function delRoleCcd(data) {
  return request({
    url: '/api/roleCcd/del',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8;'
    },
    data: data,
    transformRequest: [
      function(data) {
        let ret = ''
        for (const it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'))
        return ret
      }
    ]
  })
}
