class Req {

  constructor (baseUrl, token) {
    this.baseUrl = baseUrl
    this.commonData = token ? { token } : {}
    this.xhr = new XMLHttpRequest()
  }

  set token(token) {
    this.commonData['token'] = token
  }

  run (method, url, data, options) {
    return new Promise((resolve, reject) => {
      this.xhr.open(method, url, true)
      
      this.xhr.onreadystatechange = function () {
        if (this.readyState != 4) return
        if (this.response) {
          resolve(JSON.parse(this.response))
        } else {
          reject()
        }
      }

      let body
      if (options && options.urlencoded) {
        // urlencoded
        this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        body = ''
        for (let key in data) {
          body += key + '=' + encodeURIComponent(data[key]) + '&'
        }
      } else {
        // Default method
        this.xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        body = JSON.stringify(data || {})
      }
      this.xhr.send(body)
    })
  }

  post (uri, json) {
    const data = json
      ? {...this.commonData, ...json}
      : this.commonData
    return this.run('POST', this.baseUrl + uri, data)
  }

}

export default Req
