// Copyright 2017 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as fs from "fs";
import * as rl from "readline";

// 用于生成@秋帅需要的 JSON
// 其中三个 annotation 会指向秋帅要的 name 和 code

const NAME_ANNOTATION = "// @name:";
const CODE_BEGIN_ANNOTATION = "// @code-begin";
const CODE_END_ANNOTATION = "// @code-end";

interface Folder {
  name: string;
  children: Example[];
}

interface Example {
  id: string;
  name: string;
  code: string;
}

async function getExampleFromFile(dir: string, fileName: string): Promise<Example> {
  return new Promise<Example>((resolve, reject) => {
    const lineReader: rl.ReadLine = rl.createInterface({
      input: require("fs").createReadStream(`${dir}${fileName}`)
    });

    let name = "";
    let code: string = "";
    let isCodeBegin = false;

    let id: string = fileName.split("_")[0];

    lineReader.on("line", (line: string) => {

      if (line.indexOf(NAME_ANNOTATION) > -1) { // it is "@name" line
        name = line.substr(NAME_ANNOTATION.length, line.length - NAME_ANNOTATION.length).trim();
        return;
      }

      if (line.indexOf(CODE_BEGIN_ANNOTATION) > -1) {
        isCodeBegin = true;
        return;
      }

      if (line.indexOf(CODE_END_ANNOTATION) > -1) {
        isCodeBegin = false;
        return;
      }

      if (isCodeBegin) {
        code += line + "\n";
      }
    });

    lineReader.on("close", function () {
      resolve({
        id: id,
        name: name,
        code: code.substring(1, code.length - 1)
      })
    });
  });
}

async function getExamplesFromDir(dir: string): Promise<Example[]> {
  const items = fs.readdirSync(dir);

  let examples: Example[] = [];

  for (let item of items) {
    const example: Example = await getExampleFromFile(dir, item);
    examples.push(example);
  }

  return examples;
}

// 主逻辑

async function main() {
  const basicExamples: Example[] = await getExamplesFromDir("example/js/00_basic/");
  const sentinelExamples: Example[] = await getExamplesFromDir("example/js/01_sentinel/");
  const gaofenExamples: Example[] = await getExamplesFromDir("example/js/02_gaofen/");
  const mengcaoExamples: Example[] = await getExamplesFromDir("example/js/03_mengcao/");
  const uiExamples: Example[] = await getExamplesFromDir("example/js/04_ui/");
  const modisExamples: Example[] = await getExamplesFromDir("example/js/05_modis/");
  const testExamples: Example[] = await getExamplesFromDir("example/js/99_test/");

  let basicFolder: Folder = {
    name: "基础教程",
    children: basicExamples
  };

  let sentinelFolder: Folder = {
    name: "Sentinel",
    children: sentinelExamples
  };

  let gfFolder: Folder = {
    name: "高分",
    children: gaofenExamples
  };

  let mengcaoFolder: Folder = {
    name: "蒙草",
    children: mengcaoExamples
  };

  let uiFolder: Folder = {
    name: "图形界面",
    children: uiExamples
  };

  let modisFolder: Folder = {
    name: "MODIS/NDVI",
    children: modisExamples
  };

  let testFolder: Folder = {
    name: "开发测试用例",
    children: testExamples
  };

  const folders: Folder[] = [basicFolder, sentinelFolder, modisFolder, gfFolder, uiFolder, mengcaoFolder, testFolder];

  fs.writeFileSync("example/examples.json", JSON.stringify(folders), "utf8");
}

main().catch((error) => {
  console.log(`生成 examples.json 失败，错误为 ${error}`);
});
