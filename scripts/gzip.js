const fs = require('fs');
const path = require('path');
const zlip = require('zlib');

const TEST_PATH = path.join(__dirname, './test');

function loop(targetPath) {
  if (verifyDirectory(targetPath)) {
    fs.readdirSync(targetPath).forEach(item => {
      const deepPath = path.join(targetPath, item);
      if (verifyDirectory(deepPath)) {
        loop(deepPath);
      } else {
        gzip(path.join(targetPath, item));
      }
    });
  } else {
    throw new Error('Please enter the correct file path!');
  }
}

function verifyDirectory(path) {
  return fs.lstatSync(path).isDirectory();
}

function gzip(path) {
  const input = fs.createReadStream(path);
  const output = fs.createWriteStream(path+'.gz');
  input.pipe(zlip.createGzip()).pipe(output);
}

loop(TEST_PATH);
