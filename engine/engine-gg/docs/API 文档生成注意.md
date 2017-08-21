# 文档生成说明
## 文档会生成到docs/out.json
 ```Shell
 gulp typedoc
 ```
## 注释格式例子
```typescript
  /**
   * setCenter(lon: number, lat: number, zoom: number): void
   *
   * Sets center
   * @param lon Longitude
   * @param lat Latitude
   * @param zoom Zoom level
   * @return void
   */
  static setCenter(lon: number, lat: number, zoom: number): void {
    Map.instance.setCenter([lon, lat]);
    Map.instance.zoomTo(zoom);
  }
```

```json
		{
							"id": 47,
							"name": "setCenter",
							"kind": 2048,
							"kindString": "Method",
							"flags": {
								"isStatic": true,
								"isExported": true
							},
							"signatures": [
								{
									"id": 48,
									"name": "setCenter",
									"kind": 4096,
									"kindString": "Call signature",
									"flags": {},
									"comment": {
										"shortText": "setCenter(lon: number, lat: number, zoom: number): void",
										"text": "Sets center",
										"returns": "void\n"
									},
									"parameters": [
										{
											"id": 49,
											"name": "lon",
											"kind": 32768,
											"kindString": "Parameter",
											"flags": {},
											"comment": {
												"text": "Longitude"
											},
											"type": {
												"type": "intrinsic",
												"name": "number"
											}
										},
										{
											"id": 50,
											"name": "lat",
											"kind": 32768,
											"kindString": "Parameter",
											"flags": {},
											"comment": {
												"text": "Latitude"
											},
											"type": {
												"type": "intrinsic",
												"name": "number"
											}
										},
										{
											"id": 51,
											"name": "zoom",
											"kind": 32768,
											"kindString": "Parameter",
											"flags": {
												"isOptional": true
											},
											"comment": {
												"text": "Zoom level"
											},
											"type": {
												"type": "intrinsic",
												"name": "number"
											}
										}
									],
									"type": {
										"type": "intrinsic",
										"name": "void"
									}
								}
							],
							"sources": [
								{
									"fileName": "ui/map/map.ts",
									"line": 81,
									"character": 18
								}
							]
						}
```