import MiniStorage from './storage';

class Token {
  static setToken(token) {
    MiniStorage.setItem('token', token);
  }

  static getToken() {
    return MiniStorage.getItem('token');
  }

  static removeToken() {
    MiniStorage.removeItem('token');
    MiniStorage.removeItem('name');
  }
}

export default Token;
