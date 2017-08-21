// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * 任何可以被 uiPrint() 调用的方法
 */
export interface Printable {
  onPrint(): void;
}

export function instanceOfPrintable(object: any): boolean {
  return ((typeof object === "object") && ("onPrint" in object));
}
