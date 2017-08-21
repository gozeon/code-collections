// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {UIElement} from "../base/uielement";
import {NodeElement} from "../base/nodeelement";
import * as moment from "moment";

export interface ButtonInitOptions {
  text: string;
  click?: () => void;
}

export class Button extends UIElement {
  private node_: NodeElement;

  constructor(options: ButtonInitOptions) {
    super();

    const element: HTMLButtonElement = document.createElement("button");
    element.type = "button";
    element.textContent = options.text;
    element.style.outline = "0";
    element.style.cursor = "pointer";
    element.addEventListener("mouseover",
      () => element.style.boxShadow = "0px 1px 1px rgba(0, 0, 0, 0.1)", false);
    element.addEventListener("mouseout", () => element.style.boxShadow = null, false);

    if (options.click) {
      element.addEventListener("click", options.click, false);
    }

    this.node_ = new NodeElement({
      node: element,
      style: {
        border: "1px solid rgba(0,0,0,0.1)",
        backgroundColor: "#f5f5f5",
        padding: "8px"
      }
    });
  }

  node(): NodeElement {
    return this.node_;
  }
}
