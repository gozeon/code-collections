const exec = require('child_process').exec;
exec('npm get registry', (error, stdout, stderr) => {
  if (!(stdout.trim() == 'http://npmjs.gagogroup.cn/')) {
    throw new Error('Please set npm registry');
  }
})