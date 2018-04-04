/**
 * deep copy array
 * @param {any[]} arr
 * @returns {any[]}
 */
export function deepCopy(arr: any[]): any[] {
  return JSON.parse(JSON.stringify(arr));
}
