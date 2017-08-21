// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * HUD 需要实现的协议
 */
export interface HudProtocol {

  /**
   * 显示 HUD
   */
  show(): void;

  /**
   * 隐藏 HUD
   */
  hide(): void;
}
