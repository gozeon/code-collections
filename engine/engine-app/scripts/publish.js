const process = require('process');
const pkgJson = require('../package');
const exec = require('child_process').exec;

function getVersion(type) {
  let aVerion = (pkgJson.version).split('.');

  switch (type) {
    case "major":
      aVerion[0] = Number(aVerion[0]) + 1;
      break;
    case "minor":
      aVerion[1] = Number(aVerion[1]) + 1;
      break;
    case "patch":
      aVerion[2] = Number(aVerion[2]) + 1;
      break;
    default:
      throw new Error('unknown mistake');
      break;
  }

  return aVerion.join('.');
}

function runCommand(type) {
  exec(`npm version ${type} -m "fix: v${getVersion(type)}" && npm publish`, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(stdout);
  })
}

// node scripts/publish.js  major | minor | patch
switch (process.argv[2]) {
  case "major":
    runCommand("major");
    break;
  case "minor":
    runCommand("minor");
    break;
  case "patch":
    runCommand("patch");
    break;
  default:
    console.log('The command is malformed !');
    break;
}