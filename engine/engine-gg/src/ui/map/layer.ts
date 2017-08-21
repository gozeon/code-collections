// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * Map layer
 */
export class Layer {
  /**
   * The identifier.
   */
  id: string;

  /**
   * 别名
   */
  name?: string;

  /**
   * constructor(id: string)
   *
   * Create a Layer
   * @param id The identifier.
   * @return void
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * 显示的名称
   * @returns {string}
   */
  displayName(): string {
    if (this.name && this.name !== "") {
      return this.name
    } else {
      return this.id;
    }
  }
}
