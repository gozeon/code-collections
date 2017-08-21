// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * 输出协议，用于在 Inspector 输出内容
 */
export interface PrintProtocol {

  /**
   * 输出内容
   * @param arg
   */
  print(arg: any): void;

  /**
   * 输出地址
   * @param {string} url URL 实际地址
   * @param {string} displayUrl 显示的地址
   */
  printUrl(url: string, displayUrl: string): void;
}
