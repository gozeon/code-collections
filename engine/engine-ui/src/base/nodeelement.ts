// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import { CssStyle } from "./cssstyle";

import { v1 } from "uuid";

export interface NodeElementInitOptions {
  node: HTMLElement;
  style: CssStyle;
}


/**
 * 节点对象，内含 HTML Element 和自定义的类似 CSS 的 style
 */
export class NodeElement {
  html: HTMLElement;
  style: CssStyle;

  constructor(options: NodeElementInitOptions) {
    this.html = options.node;
    this.style = options.style;

    this.initStatus_();
  }

  appendChild(nodeElement: NodeElement): this {
    this.html.appendChild(nodeElement.html);
    return this;
  }

  private initStatus_(): void {
    this.setupDefaultId_();
    this.setupHtmlCss_();
  }

  private setupDefaultId_(): void {
    this.html.id = v1().replace(/\-/g, "").replace(/^\d/, "a");
  }

  private setupHtmlCss_(): void {
    this.html.style.padding = this.style.padding;
    this.html.style.width = this.style.width;
    this.html.style.height = this.style.height;
    this.html.style.margin = this.style.margin;
    this.html.style.color = this.style.color;
    this.html.style.border = this.style.border;
    this.html.style.fontSize = this.style.fontSize;
    this.html.style.backgroundColor = this.style.backgroundColor;
    this.html.style.fontWeight = this.style.fontWeight;

    this.setupPosition_();
  }

  private setupPosition_(): void {
    if (!this.style.position) return;

    this.html.style.position = "absolute";
    switch (this.style.position) {
      case "top-right":
        this.html.style.top = "10px";
        this.html.style.right = "10px";
        break;
      case "bottom-left":
        this.html.style.bottom = "30px";
        this.html.style.left = "10px";
        break;
      case "bottom-right":
        this.html.style.bottom = "30px";
        this.html.style.right = "10px";
        break;
      default:
        this.html.style.top = "10px";
        this.html.style.left = "10px";
        break;
    }
  }
}
