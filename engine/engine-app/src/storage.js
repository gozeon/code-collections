import md5 from 'md5';

class MiniStorage {
  static setItem(key, value) {
    localStorage.setItem(md5(key), value);
  }
  static getItem(key) {
    return localStorage.getItem(md5(key));
  }
  static removeItem(key) {
    localStorage.removeItem(md5(key));
  }
  static clean() {
    localStorage.clear();
  }
}

export default MiniStorage;
