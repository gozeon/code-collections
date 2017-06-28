#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

program
  .version(require('../package.json').version)
  .option('init <project>', 'init a project', initProject)
  .parse(process.argv);

if (process.argv[2] != 'init') {
  program.help();
}

function initProject(project) {
  const projectPath = path.resolve(process.cwd(), `${project}/`);
  if (fs.existsSync(projectPath)) {
    console.log(`${chalk.red('Error')}: ${project} has already existed!`)
    process.exit(1);
  }
  
  try{
  // create init project
  fs.mkdirSync(projectPath);
  console.log(chalk.blue(`create ${chalk.yellow(`${project}/`)} => ${chalk.green('success')}`));

  // create .gitignore
  fs.writeFileSync(path.resolve(projectPath, '.gitignore'), 'node_modules/', 'utf8')
  console.log(chalk.blue(`create ${chalk.yellow(`.gitignore`)} => ${chalk.green('success')}`));

  // ceeate CHANGELOG.md
  fs.writeFileSync(path.resolve(projectPath, 'CHANGELOG.md'), '# CHANGELOG', 'utf8');
  console.log(chalk.blue(`create ${chalk.yellow(`CHANGELOG.md`)} => ${chalk.green('success')}`));

  // ceeate README.md
  fs.writeFileSync(
    path.resolve(projectPath, 'README.md'),
    '# README \n' +
    '# RUN\n' +
    '```bash\n' +
    'npm run dev\n' +
    '```\n' +
    '# Third Party\n' +
    '[规范参考](https://github.com/yokots/react-ts-demo/issues/1)',
    'utf8');
  console.log(chalk.blue(`create ${chalk.yellow(`README.md`)} => ${chalk.green('success')}`));

  // create package.json
  fs.copySync(path.resolve(__dirname, '../tmp/package.json'), path.resolve(projectPath, 'package.json'));
  console.log(chalk.blue(`create ${chalk.yellow(`package.json`)} => ${chalk.green('success')}`));

  // create webpack.config.js
  fs.copySync(path.resolve(__dirname, '../tmp/webpack.config.js'), path.resolve(projectPath, 'webpack.config.js'));
  console.log(chalk.blue(`create ${chalk.yellow(`webpack.config.js/`)} => ${chalk.green('success')}`));

  // create tslint.json
  fs.copySync(path.resolve(__dirname, '../tmp/tslint.json'), path.resolve(projectPath, 'tslint.json'));
  console.log(chalk.blue(`create ${chalk.yellow(`tslint.json`)} => ${chalk.green('success')}`));

  // create tslint.json
  fs.copySync(path.resolve(__dirname, '../tmp/yarn.lock'), path.resolve(projectPath, 'yarn.lock'));
  console.log(chalk.blue(`create ${chalk.yellow(`yarn.lock`)} => ${chalk.green('success')}`));

  // create src
  fs.copySync(path.resolve(__dirname, '../tmp/src'), path.resolve(projectPath, 'src'));
  console.log(chalk.blue(`create ${chalk.yellow(`src/`)} => ${chalk.green('success')}`));

  console.log(`${chalk.bgMagenta('Create Success!')}`)
  console.log(`${chalk.grey(`cd ${project} && npm install`)}`);
  }catch(err) {
    if(err) {
      console.error(err);
      fs.removeSync(projectPath);
      process.exit(1);
    }
  }
}