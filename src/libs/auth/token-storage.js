import Cookies from 'js-cookie'

class TokenStorage {
  static get () {
    return Cookies.get('token')
  }
  static set (token) {
    return Cookies.set('token', token)
  }
  static del () {
    return Cookies.remove('token')
  }
}

export default TokenStorage
