var glob = require("glob");
var globby = require("globby");
const path = require("path");
const ROOT_FOLDER = "MOCK";
const ROOT_PATH = path.join(__dirname, ROOT_FOLDER);

// glob(`${ROOT_PATH}/**/*.json`, { ignore: [] }, function(er, files) {
//   const result = []

//   for (let i = 0; i < files.length; i++) {
//     // win mac 正反斜杠
//     const rootPath = path.posix.join(...ROOT_PATH.split(path.sep));
//     const deleteRootPath = files[i].replace(new RegExp(rootPath), '')
//     const deleteEndJson = deleteRootPath.replace(/\.json$/g, '')
//     result.push(deleteEndJson)
//   }

//   console.log(result)
// });

(async () => {
    const paths = await globby([ROOT_PATH]);

    console.log(paths);
    //=> ['unicorn', 'rainbow']
})();
