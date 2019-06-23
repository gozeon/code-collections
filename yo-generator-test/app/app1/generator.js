'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the kickass ${chalk.red('generator-ttt')} generator!`)
    )

    const prompts = [
      {
        type: String,
        name: 'name',
        message: 'What is your name?',
        default: 'goze'
      }
    ]

    return this.prompt(prompts).then(props => {
      console.log(props)
      this.props = props
    })
  }

  writing() {
    this.fs.copy(
      `${this.templatePath()}/**/?(.)!(_)*`,
      this.destinationPath()
    )
  }

  install() {
    // this.installDependencies()
  }
}
