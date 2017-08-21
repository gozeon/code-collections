// Copyright 2017 Gago Sakura Team. All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

export type CssStylePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/**
 * CSS 样式，用于控件中的 style
 */
export interface CssStyle {
  position?: CssStylePosition;
  padding?: string;
  width?: string;
  height?: string;
  margin?: string;
  color?: string;
  border?: string;
  fontSize?: string;
  backgroundColor?: string;
  fontWeight?: "bold";
}
