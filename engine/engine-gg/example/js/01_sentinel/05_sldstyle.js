// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

// @name: 对 NDVI 进行分类显示

// @code-begin

Map.setCenter(117, 44.62, 12);

// 加载 Sentinel-2 (蒙草中西乌旗范围)
var region = gg.GeometryFactory.rectangle([
  [116.156, 45.408],
  [119.342, 43.832]
]);

// 选出 Sentinel-2 符合地域、日期的最优图片以便于之后做 NDVI
var sentinel2Img = gg.ImageFactory.imageCollection("sentinel-2")
  .filterDate("2017-06-21", "2017-07-01") // 日期
  .filterBounds(region)
  .first();

// 处理成 NDVI
var ndvi = sentinel2Img.normalizedDifference(["B08", "B04"]);

// 使用 SLD style 分类
var sldIntervals =
  '<?xml version="1.0" ?>\n' +
  '<sld:StyledLayerDescriptor version="1.0.0" xmlns="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:sld="http://www.opengis.net/sld">\n' +
  '    <sld:UserLayer>\n' +
  '        <sld:LayerFeatureConstraints>\n' +
  '            <sld:FeatureTypeConstraint/>\n' +
  '        </sld:LayerFeatureConstraints>\n' +
  '        <sld:UserStyle>\n' +
  '            <sld:Name>0930_wlg</sld:Name>\n' +
  '            <sld:Title/>\n' +
  '            <sld:FeatureTypeStyle>\n' +
  '                <sld:Name/>\n' +
  '                <sld:Rule>\n' +
  '                    <sld:RasterSymbolizer>\n' +
  '                        <sld:Geometry>\n' +
  '                            <ogc:PropertyName>grid</ogc:PropertyName>\n' +
  '                        </sld:Geometry>\n' +
  '                        <sld:Opacity>1</sld:Opacity>\n' +
  '                        <sld:ColorMap type="intervals">\n' +
  '                            <sld:ColorMapEntry color="#ff1d20" label="&lt;= -1" opacity="1.0" quantity="-1"/>\n' +
  '                            <sld:ColorMapEntry color="#ff0055" label="-1 - -0.99" opacity="1.0" quantity="-0.99"/>\n' +
  '                            <sld:ColorMapEntry color="#f20655" label="-0.99 - 0" opacity="1.0" quantity="0"/>\n' +
  '                            <sld:ColorMapEntry color="#fead00" label="0 - 0.1" opacity="1.0" quantity="0.1"/>\n' +
  '                            <sld:ColorMapEntry color="#ffe251" label="0.1 - 0.17" opacity="1.0" quantity="0.17"/>\n' +
  '                            <sld:ColorMapEntry color="#ddf19f" label="0.17 - 0.2" opacity="1.0" quantity="0.2"/>\n' +
  '                            <sld:ColorMapEntry color="#c7e78a" label="0.2 - 0.25" opacity="1.0" quantity="0.25"/>\n' +
  '                            <sld:ColorMapEntry color="#b1de75" label="0.25 - 0.3" opacity="1.0" quantity="0.3"/>\n' +
  '                            <sld:ColorMapEntry color="#8acc62" label="0.3 - 0.4" opacity="1.0" quantity="0.4"/>\n' +
  '                            <sld:ColorMapEntry color="#52b151" label="0.4 - 0.5" opacity="1.0" quantity="0.5"/>\n' +
  '                            <sld:ColorMapEntry color="#1a9641" label="&gt; 0.5" opacity="1.0" quantity="inf"/>\n' +
  '                        </sld:ColorMap>\n' +
  '                    </sld:RasterSymbolizer>\n' +
  '                </sld:Rule>\n' +
  '            </sld:FeatureTypeStyle>\n' +
  '        </sld:UserStyle>\n' +
  '    </sld:UserLayer>\n' +
  '</sld:StyledLayerDescriptor>\n';
Map.addLayer(ndvi.sldStyle(sldIntervals));

// @code-end