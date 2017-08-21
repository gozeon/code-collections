// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

/**
 * Visualization parameters for Map.addLayer() (Image)
 *
 * @see https://developers.google.com/earth-engine/image_visualization
 */
export interface ImageVisualizationParameters {
  bands?: string[]; // Comma-delimited list of three band names to be mapped to RGB
  min?: number[]; // Value(s) to map to 0
  max?: number[]; // Value(s) to map to 255
  gain?: number[]; // Value(s) by which to multiply each pixel value
  bias?: number[]; // Value(s) to add to each DN
  gamma?: number[]; // Gamma correction factor(s)
  palette?: string[]; // List of CSS-style color strings (single-band images only)
  opacity?: number; // opacity
  format?: "jpg" | "png"; // Either "jpg" or "png"
}
