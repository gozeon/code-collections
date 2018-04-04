/**
 * 随机生成key 类似uuid
 * @link https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @returns {string} 1cc45d7e-fedf-2c55-230c-dbc395cfc49e
 */
export function guid(): string {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
