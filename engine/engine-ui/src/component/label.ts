// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {CssStyle} from "../base/cssstyle";
import {UIElement} from "../base/uielement";
import {NodeElement} from "../base/nodeelement";

export interface LabelInitOptions {
  value?: string;
  style?: CssStyle;
}

/**
 * 标签
 */
export class Label extends UIElement {
  private node_: NodeElement;

  constructor(options: LabelInitOptions) {
    super();
    this.initNode_(options);
  }

  private initNode_(options: LabelInitOptions) {
    const node = document.createElement("span");

    if (options.value) {
      node.innerText = options.value;
    } else {
      node.style.height = "0px";
    }

    this.node_ = new NodeElement({
      node: node,
      style: Object.assign({}, {backgroundColor: "#fff"}, options.style)
    });
  }

  node(): NodeElement {
    return this.node_;
  }
}
