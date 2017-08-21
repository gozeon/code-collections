// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.


import {Rectangle} from "./rectangle";
import {Point} from "./point";

/**
 * Geometry 工厂类
 */
export class GeometryFactory {

  /**
   * 构造 Rectangle
   * @param {number[][]} coords 坐标数组，例如 [[92, 101], [93, 100]]
   * @returns {Rectangle} 矩形
   */
  static rectangle(coords: number[][]): Rectangle {
    const upperLeft: Point = new Point(coords[0][0], coords[0][1]);
    const lowerRight: Point = new Point(coords[1][0], coords[1][1]);
    return new Rectangle(upperLeft, lowerRight);
  }
}
