import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

// import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
// import "monaco-editor/esm/vs/editor/edcore.main.js";
// import "monaco-editor/esm/vs/language/json/monaco.contribution.js";

import "./editor.css";

import example from "./example";

self.MonacoEnvironment = {
  getWorkerUrl: function(moduleId, label) {
    if (label === "json") {
      return "./json.worker.js";
    }
    if (label === "css") {
      return "./css.worker.js";
    }
    if (label === "html") {
      return "./html.worker.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.js";
    }
    return "./editor.worker.js";
  }
};

const editor = monaco.editor.create(document.getElementById("editor"), {
  value: example,
  language: "json"
});

const editor2 = monaco.editor.create(document.getElementById("result"), {
  value: "// Please press Command + Enter on left editor",
  language: "json"
});

async function handleFaker() {
  try {
    const inputValue = editor.getValue();
    const complier = await import("../utils/complier");
    const fakerData = await import("../utils/fakerData");
    const template = complier.default.compile(inputValue);
    const result = template({ faker: new fakerData.default().getData() });

    editor2.setValue(result);
  } catch (error) {
    alert(error.toString());
  }
}

editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, handleFaker);

document
  .querySelector("#faker")
  .addEventListener("click", handleFaker, false);
