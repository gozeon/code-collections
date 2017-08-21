// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import { Label } from "./label";
import { CssStyle } from "../base/cssstyle";
import { UIElement } from "../base/uielement";
import { NodeElement } from "../base/nodeelement";

export interface PanelInitOptions {
  widgets?: Label[];
  style?: CssStyle;
  layout?: "horizontal" | "vertical" | "both";
}

/**
 * 面板控件，常作为 container 使用
 */
export class Panel extends UIElement {
  private node_: NodeElement;

  constructor(options: PanelInitOptions) {
    super();
    this.initNode_(options);
  }

  private initNode_(options: PanelInitOptions) {
    const element = document.createElement("div");

    // default layout
    element.style.display = "flex";
    element.style.flexDirection = "column";
    element.style.zIndex = "9";

    if (options.widgets && options.layout) {
      element.style.alignItems = "flex-start";
      switch (options.layout) {
        case "horizontal":
          element.style.flexDirection = "row";
          break;

        case "vertical":
          element.style.flexDirection = "column";
          break;

        default:
          break;
      }
      options.widgets.forEach((label: Label) => element.appendChild(label.node().html));
    }

    this.node_ = new NodeElement({
      node: element,
      style: Object.assign({}, { backgroundColor: "#fff" }, options.style)
    });
  }

  node(): NodeElement {
    return this.node_;
  }

  add(element: UIElement) {
    this.node_.appendChild(element.node());
  }

  hide() {
    this.node_.html.style.display = "none";
  }
}
