// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import { instanceOfPrintable, Printable } from "../gg/base/printable";
import {engineContext} from "../base/context";

(<any>window).print = print;

/**
 * 输出
 */
export function print(printable: Printable): void;
export function print(arg: any): void {
  if (instanceOfPrintable(arg)) {
    arg.onPrint();
  } else {
    uiPrint(arg);
  }
}

export function uiPrint(arg: any): void {
  engineContext.printImpl.print(arg);
}

export function uiPrintUrl(url: string, displayUrl: string = url): void {
  engineContext.printImpl.printUrl(url, displayUrl);
}
