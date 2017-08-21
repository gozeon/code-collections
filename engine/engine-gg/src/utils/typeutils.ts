// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * 类型辅助类
 */
export class Typeutils {

  static isString(maybeStr: any): boolean {
    return (typeof maybeStr === "string");
  }

  static isObject(maybeObj: any): boolean {
    return (typeof maybeObj === "object");
  }
}
