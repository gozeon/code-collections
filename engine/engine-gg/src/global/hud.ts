// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {engineContext} from "../base/context";

/**
 * HUD of HTML
 */
export class Hud {

  static show() {
    engineContext.hudImpl.show();
  }

  static hide() {
    engineContext.hudImpl.hide();
  }
}
