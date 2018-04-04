const process = require('process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const WARN = chalk.keyword('orange');

const SOURCE_FILE = path.join(__dirname, './compress-build.js');
const TARGET_FILE = path.join(__dirname, '../node_modules/@angular/cli/tasks/build.js');

const SOURCE_FILE_ng = path.join(__dirname, './ng.js');
const TARGET_FILE_NG = path.join(__dirname, '../node_modules/@angular/cli/bin/ng');

const SOURCE_TABLE_FILE = path.join(__dirname, './data-table.js');
const TARGET_TABLE_FILE = path.join(__dirname, '../node_modules/@covalent/core/data-table/data-table.component.js');

if (process.argv[2] === 'compress') {
  fs.readFile(SOURCE_FILE, 'utf8', function (err, data) {
    if (err) throw err;

    fs.writeFile(TARGET_FILE, data, 'utf8', function (err) {
      if (err) throw err;
      console.log(WARN(' using compress by gzip!\n'));
    })
  });
}

if (process.argv[2] === 'memory') {
  fs.readFile(SOURCE_FILE_ng, 'utf8', function (err, data) {
    if (err) throw err;

    fs.writeFile(TARGET_FILE_NG, data, 'utf8', function (err) {
      if (err) throw err;
      console.log(WARN(' increase memory limit 2048MB !\n'));
    })
  });
}

if (process.argv[2] === 'table') {
  fs.readFile(SOURCE_TABLE_FILE, 'utf8', function (err, data) {
    if (err) throw err;

    fs.writeFile(TARGET_TABLE_FILE, data, 'utf8', function (err) {
      if (err) throw err;
      console.log(WARN(' delete data-table default height(+1) !\n'));
    })
  });
}
