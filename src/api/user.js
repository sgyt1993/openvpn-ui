import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/sys/login?userName=' + username + '&password=' + password,
    method: 'get'
  })
}

export function userList() {
  return request({
    url: '/api/users/list',
    method: 'get'
  })
}

export function userRevoke(data) {
  return request({
    url: '/api/user/revoke',
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

export function userUnRevoke(data) {
  return request({
    url: '/api/user/unrevoke',
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

export function createUser(data) {
  return request({
    url: '/api/user/create',
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

export function changeUserPassword(data) {
  return request({
    url: '/api/user/change-password',
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

export function downloadUser(data) {
  return request({
    url: 'api/user/config/show',
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

