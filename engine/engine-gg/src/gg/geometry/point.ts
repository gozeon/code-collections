// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {Geometry} from "./geometry";

/**
 * Point
 */
export class Point extends Geometry {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  toCoordinates(): number[] {
    return [this.x, this.y];
  }

  toCoordinatesString(): string {
    return `[${this.x}, ${this.y}]`;
  }
}