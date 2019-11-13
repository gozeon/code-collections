'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const gozesay = require('gozesay')
const _ = require('lodash')

module.exports = class extends Generator {
  prompting() {
    this.log(gozesay(`如果这个世界不喜欢你，那它就是我的敌人了。`))

    const prompts = [
      {
        type: String,
        name: 'name',
        message: '请输入组件名字',
        default: 'zyb-coupon',
      },
      {
        type: String,
        name: 'menuName',
        message: '请输入组件菜单名字',
        default: '优惠券',
      },
      {
        type: String,
        name: 'menuIco',
        message: '请输入组件菜单图标',
        default: 'icon_coupon',
      },
      {
        type: String,
        name: 'description',
        message: '请输入组件描述',
        default: '营销组件之优惠券',
      },
    ]

    return this.prompt(prompts).then(props => {
      this.props = props
    })
  }

  writing() {
    // this.fs.copy(`${this.templatePath()}/**/?(.)!(_)*`, this.destinationPath())

    const { name, menuName, menuIco, description } = this.props

    this.fs.copyTpl(
      `${this.templatePath()}/**/*`,
      this.destinationPath(`${name}/`),
      {
        name,
        description,
        menuName,
        menuIco,
        nameBigCamelCase: _.startCase(_.camelCase(name)).replace(/ /g, ''),
      },
      {},
      {
        globOptions: {
          dot: true,
        },
      }
    )
  }

  // install() {
  //     this.installDependencies({
  //         npm: false,
  //         yarn: false,
  //         bower: false
  //     })
  // }

  end() {
    this.log('\n')
  }
}
