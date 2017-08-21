// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import {UIElement} from "../base/uielement";
import {NodeElement} from "../base/nodeelement";
import * as moment from "moment";
import {Label} from "./label";
import { v1 } from "uuid";

export interface TextboxInitOptions {
  name: string;
  format: string;
  value: string;
}

export class Textbox extends UIElement {
  private node_: NodeElement;
  private inputId_ = v1().replace(/\-/g, "").replace(/^\d/, "a");

  constructor(options: TextboxInitOptions) {
    super();
    const label: Label = new Label({
      value: options.name,
      style: {
        color: "#ccc"
      }
    });
    label.node().html.style.display = "block";

    const input: HTMLInputElement = document.createElement("input");
    input.type = "text";
    input.value = options.value;
    input.setAttribute("aria-label", options.format);
    input.style.padding = "3px 5px";
    input.style.fontSize = "14px";
    input.style.marginBottom = "10px";
    input.id = this.inputId_;
    input.addEventListener("focus", () => input.style.outline = "1px solid #357ae8", false);
    input.addEventListener("blur", () => input.style.outline = "0", false);

    const div: HTMLDivElement = document.createElement("div");
    div.appendChild(label.node().html);
    div.appendChild(input);
    this.node_ = new NodeElement({
      node: div,
      style: {}
    });
  }

  node(): NodeElement {
    return this.node_;
  }

  getValue(): string {
    return (<HTMLInputElement>document.querySelector(`#${this.inputId_}`)).value;
  }
}
