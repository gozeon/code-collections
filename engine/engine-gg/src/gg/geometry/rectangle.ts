// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Geometry} from "./geometry";
import {Point} from "./point";

/**
 * Rectangle
 */
export class Rectangle extends Geometry {
  upperLeft: Point;
  lowerRight: Point;

  constructor(upperLeft: Point, lowerRight: Point) {
    super();
    this.upperLeft = upperLeft;
    this.lowerRight = lowerRight;
  }

  toCoordinates(): number[][] {
    return [
      this.upperLeft.toCoordinates(),
      this.lowerRight.toCoordinates()
    ];
  }

  toCoordinatesString(): string {
    return `[${this.upperLeft.toCoordinatesString()}, ${this.lowerRight.toCoordinatesString()}]`;
  }
}