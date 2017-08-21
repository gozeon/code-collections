// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * 日期工具
 */
export class DateUtils {

  /**
   * 数月前
   * @param {Date} date 相对哪天
   * @param {number} months 多少个月
   * @returns {Date} 新的日期
   */
  static monthsAgo(date: Date, months: number): Date {
    let dt: Date = new Date(date);
    dt.setMonth(dt.getMonth() - months);
    return dt;
  }
}
