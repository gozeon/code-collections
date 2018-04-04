import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  myForm: FormGroup; // 表单
  channelCodeOnes: any[]; // 渠道一
  channelCodeTwos: any[]; // 渠道二
  mobile: any;
  selectData: any = {mobile: '', channelCodeOne: '', channelCodeTwo: ''};

  constructor(private _userService: UserService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectData.mobile = data;
  }

  ngOnInit() {
    // 一级渠道
    this._userService.getchanneList(-1).subscribe(v => {
      this.channelCodeOnes = v;
    });
    // 表单及验证
    this.myForm = new FormGroup({
      channelCodeOne: new FormControl('', Validators.required),
      channelCodeTwo: new FormControl('', Validators.required),
    });
  }

  select(ev: any) {
    const channelId = this.channelCodeOnes.filter(i => i.code == this.selectData.channelCodeOne);
    // 二级渠道
    this._userService.getchanneList(channelId[0].id).subscribe(v => {
      this.channelCodeTwos = v;
    });
  }
}
