// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var root = document.querySelector('#root');
var log = root.querySelector('.stdout');
var text = root.querySelector('input');
var btnGroup = root.querySelectorAll('button');

const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  log.innerHTML = `stdout: ${data}`;
});

ls.stderr.on('data', (data) => {
  log.innerHTML = `stderr: ${data}`;
});

ls.on('close', (code) => {
  log.textContent = log.textContent + `child process exited with code ${code}`;
});

function generatorProject(name = text.value) {
  if (!name) {
    dialog.showErrorBox('The Project Name Is Undefined', 'please input project name');
    return;
  }
  const index = dialog.showMessageBox({
    type: 'question',
    buttons: ['cnacel', 'submit'],
    message: `Are you generator ${name}?`,
  });
  if (index === 1) {
    // submit
    log.innerHTML = `generator ${name} ...`;
  } else {
    // cancel index===0

  }
}

function gulpTask(name, el = log) {
  const task = spawn('gulp', [name]);
  task.stdout.on('data', (data) => {
    el.innerHTML =  data;
  });

  task.stderr.on('data', (data) => {
    el.innerHTML = `stderr: ${data}`;
  });

  task.on('close', (code) => {
    el.textContent = el.textContent + `child process exited with code ${code}`;
  });
}

function clock(name) {
  let div = document.createElement('pre');
  div.className = 'box';
  root.appendChild(div);
  gulpTask(name, div)
}

for (let i = 0; i < btnGroup.length; i++) {
  btnGroup[i].onclick = function (e) {
    switch (e.target.textContent) {
      case '创建项目':
        generatorProject();
        break;
      case 'gulp clock':
        clock('clock');
        break;
      case 'gulp haha':
      default:
        gulpTask('haha');
        break;
    }
  }
}
