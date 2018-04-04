import { Component, OnInit } from '@angular/core';
const pkg = require('../../../package.json');

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  routes: Object[] = [
    { icon: 'dashboard', route: '/', title: '控制台', },
    { icon: 'library_books', route: '/main/customer', title: '客服管理', },
    { icon: 'color_lens', route: '/main/sales', title: '销售管理', },
    { icon: 'people', route: '/main/student', title: '学生服务', },
    { icon: 'all_out', route: '/main/distribution', title: '分销管理', },
    { icon: 'person_add', route: '/main/user', title: '用户添加', },
    { icon: 'assignment', route: '/main/order', title: '订单管理', },
    { icon: 'sms', route: '/main/message', title: '消息管理', },
    { icon: 'school', route: '/main/class', title: '班级管理', },
    { icon: 'content_paste', route: '/main/content', title: '内容管理', },
    { icon: 'group_add', route: '/main/recruitment', title: '招聘管理', },
    { icon: 'group', route: '/main/teacher', title: '老师管理', },
    { icon: 'credit_card', route: '/main/interactive', title: '互动课程', },
    { icon: 'star', route: '/main/conference', title: '配置管理', },
    { icon: 'settings', route: '/main/authority', title: '权限管理', },
  ];
  usermenu: Object[] = [
    { icon: 'swap_horiz', route: '/login', title: '切换账号', },
    // { icon: 'tune', route: '/setting', title: '账号设置', },
    { icon: 'exit_to_app', route: '/login', title: '退出', },
  ];

  name: string;
  email: string;
  version: string;

  constructor() {
    this.name = JSON.parse(localStorage.getItem('info')).name;
    this.email = JSON.parse(localStorage.getItem('info')).email ? JSON.parse(localStorage.getItem('info')).email : '暂无邮箱';
  }

  ngOnInit() {
    this.version = `v${pkg.version}`;
  }

}
