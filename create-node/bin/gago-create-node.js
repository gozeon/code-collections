#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

program
  .version(require('../package').version)
  .option('init <project>', 'init a project', initProject)
  .parse(process.argv);

if(process.argv[2] != 'init') {
  program.help();
}

function initProject(project) {

  const projectPath = path.resolve(process.cwd(), `${project}/`);

  if (fs.existsSync(projectPath)) {
    console.log(`${chalk.red('Error')}: ${project} has already existed!`)
    process.exit(1);
  }

  // create dir
  fs.mkdirSync(projectPath);
  try {


    // create package.json
    fs.writeJson(path.resolve(projectPath, 'package.json'), require(path.resolve(__dirname, '../tmp/package.json')), err => {
      checkErr(err, projectPath);
      console.log(chalk.blue(`create ${chalk.yellow('package.json')} => ${chalk.green('success')}`));

      // create tslint.json
      fs.writeJson(path.resolve(projectPath, 'tslint.json'), require(path.resolve(__dirname, '../tmp/tslint.json')), err => {
        checkErr(err, projectPath);
        console.log(chalk.blue(`create ${chalk.yellow('tslint.json')} => ${chalk.green('success')}`));

        // ceeate .gitignore
        fs.writeFile(path.resolve(projectPath, '.gitignore'), 'node_modules/', 'utf8', (err) => {
          checkErr(err, projectPath);
          console.log(chalk.blue(`create ${chalk.yellow('.gitignore')} => ${chalk.green('success')}`));

          // ceeate CHANGELOG.md
          fs.writeFile(path.resolve(projectPath, 'CHANGELOG.md'), '# CHANGELOG', 'utf8', (err) => {
            checkErr(err, projectPath);
            console.log(chalk.blue(`create ${chalk.yellow('CHANGELOG.md')} => ${chalk.green('success')}`));

            // ceeate README.md
            fs.writeFile(
              path.resolve(projectPath, 'README.md'),
              '# README \n# RUN\n```bash\ngulp\n```',
              'utf8', (err) => {
                checkErr(err, projectPath);
                console.log(chalk.blue(`create ${chalk.yellow('README.md')} => ${chalk.green('success')}`));

                // create gulpfile.js
                fs.readFile(path.resolve(__dirname, '../tmp/gulpfile.js'), (err, data) => {
                  checkErr(err, projectPath);
                  fs.outputFile(path.resolve(projectPath, 'gulpfile.js'), data, err => {
                    checkErr(err, projectPath);
                    console.log(chalk.blue(`create ${chalk.yellow('gulpfile.js')} => ${chalk.green('success')}`));

                    // crete src
                    fs.mkdirSync(path.resolve(projectPath, 'src'));

                    // create server.js
                    fs.readFile(path.resolve(__dirname, '../tmp/server.ts'), (err, data) => {
                      checkErr(err, projectPath);
                      fs.outputFile(path.resolve(projectPath, 'src/server.ts'), data, err => {
                        checkErr(err, projectPath);
                        console.log(chalk.blue(`create ${chalk.yellow('server.ts')} => ${chalk.green('success')}`));
                        console.log(`${chalk.bgMagenta('Create Success!')}`)
                        console.log(`${chalk.grey(`cd ${project} && npm install`)}`);
                      });
                    });
                  });
                });
              }
            );
          });
        });
      });
    });

  } catch (err) {
    if (err) {
      checkErr(err, projectPath);
    }
  }
}

function checkErr(err, dirPath) {
  if (err) {
    console.log(chalk.red(err));
    fs.removeSync(dirPath);
    process.exit(1);
  }
}