// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {NodeElement} from "./nodeelement";

/**
 * UI 组件，所有的 UI 都应当继承于此类来实现
 */
export abstract class UIElement {

  /**
   * 所需要的节点，节点内含 HTML 以及自定义的 CSS Style
   */
  abstract node(): NodeElement;
}
