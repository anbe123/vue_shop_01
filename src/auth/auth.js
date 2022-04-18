const token_key = 'token'
const username_key = 'username'
const userid_key = 'user_id'

class Auth {
  // 构造函数
  constractor() {
    this.token = localStorage.getItem(token_key)
      ? localStorage.getItem(token_key)
      : ''
    this.usernaem = localStorage.getItem(username_key)
      ? localStorage.getItem(username_key)
      : ''
    this.user_id = localStorage.getItem(userid_key)
      ? localStorage.getItem(userid_key)
      : ''
  }
  //存
  setAuth(token, username, id) {
    this.token = token
    this.username = username
    this.id = id
    localStorage.setItem(token_key, token)
    localStorage.setItem(username_key, username)
    localStorage.setItem(userid_key, user_id)
  }
  //删
  delAuth(token, username, id) {
    this.token = ''
    this.username = ''
    this.id = ''
    localStorage.removeItem(token_key, token)
    localStorage.removeItem(username_key, username)
    localStorage.removeItem(userid_key, user_id)
  }
}

// 单例
const auth = new Auth()

export default auth
