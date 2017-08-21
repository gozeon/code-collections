// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {HudProtocol} from "../protocol/ui/hud";
import {PrintProtocol} from "../protocol/global/print";
import {API} from "../api/api";

export interface ContextInitOptions {
  hud: HudProtocol;
  print: PrintProtocol;
  apiToken: string;
}

/**
 * Engine API 的上下文
 */
export class EngineContext {
  hudImpl: HudProtocol;
  printImpl: PrintProtocol;

  init(options: ContextInitOptions) {
    this.hudImpl = options.hud;
    this.printImpl = options.print;
    API.token = options.apiToken;
  }
}

export let engineContext = new EngineContext();
