const exec = require('child_process').exec;

const command = [
  "npm uninstall engine-api --save",
  "npm install engine-api --save"
].join(' && ');

console.log(command);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log(error);
    return;
  }
  if (stderr) {
    console.log(stderr);
  }
  runGit();
})

function runGit() {
  const v = require('../package')["dependencies"]["engine-api"];
  const gitCommand = [
    "git add package.json",
    `git commit -m "fix: engine-api ${v}"`
  ].join(' && ');

  console.log(gitCommand);

  exec(gitCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return;
    }
    if (stderr) {
      console.log(stderr);
    }
    console.log(stdout)
  });
}
