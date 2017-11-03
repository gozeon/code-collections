const fs = require('fs');
const path = require('path');
const zlip = require('zlib');
const process = require('process');

// node gzip.js path

if (process.argv[2]) {
  const TARGET_PATH = path.join(process.cwd(), process.argv[2]);

  if (fs.existsSync(TARGET_PATH)) {
    loop(TARGET_PATH).then(success('GZip Done!'));
  } else {
    warning('Please enter the correct file path!');
    return;
  }
} else {
  warning('Please enter the correct file path!');
  return;
}

async function loop(targetPath) {
  if (verifyDirectory(targetPath)) {
    const directory = fs.readdirSync(targetPath);
    directory.forEach(item => {
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
  if (path.slice(-3) === '.gz') {
    return;
  }
  const input = fs.createReadStream(path);
  const output = fs.createWriteStream(path + '.gz');
  input.pipe(zlip.createGzip()).pipe(output);
}

function success(msg) {
  console.log('\x1b[36m%s\x1b[0m', msg);
}

function warning(msg) {
  console.log('\x1b[31m', msg);
}
