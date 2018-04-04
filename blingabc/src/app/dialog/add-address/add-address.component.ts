import { Component, OnInit, Inject } from '@angular/core';
import { BaseService } from '../../services';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

  // 地址
  logistics: any;

  selectData: any[] = []; // 点击确定 传过去的数据
  isAdd = true; // 是否能保存

  // 省市区
  provinces: any[];
  citys: any[];
  areas: any[];

  myForm: FormGroup; // 表单

  constructor(private _baseService: BaseService, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.logistics = data.logistics;
    this.selectData = [this.logistics];
  }

  ngOnInit() {
    // this.logistics = this.data.logistics;
    // 请求省份
    this._baseService.getAllProvinces().subscribe(v => this.provinces = v);
    this._baseService.getAllCitys(this.logistics.provinceCode).subscribe(v => this.citys = v);
    this._baseService.getAllAreas(this.logistics.cityCode).subscribe(v => this.areas = v);
    // 表单及验证
    this.myForm = new FormGroup({
      name: new FormControl(''),
      mobile: new FormControl(''),
      address: new FormControl(''),
      provinceCode: new FormControl(''),
      cityCode: new FormControl(''),
      areaCode: new FormControl(''),
    });
  }


  // 选择省下拉菜单 -- 出现相应的市
  selectprovinces(ev: any) {
    this.logistics.provinceName = this.codeToName(ev.value, this.provinces, 'provinceName', 'provinceCode');
    this.citys = [];
    this.areas = [];
    this._baseService.getAllCitys(ev.value).subscribe(v => this.citys = v);

  }
  // 选择市下拉菜单 -- 出现相应的区
  selectcitys(ev: any) {
    this.logistics.cityName = this.codeToName(ev.value, this.citys, 'cityName', 'cityCode');
    this._baseService.getAllAreas(ev.value).subscribe(v => this.areas = v);
  }
  // 选择区下拉菜单
  selectareas(ev: any) {
    this.logistics.areaName = this.codeToName(ev.value, this.areas, 'areaName', 'areaCode');
  }
  // 根据code 找到相应省市区
  codeToName(value, arr, name, code) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][code] == value) {
        return arr[i][name];
      }
    }
  }
}
