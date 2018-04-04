import { Component, OnInit } from '@angular/core';
import { IPageChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { DistributionService } from '../../../services/distribution.service';
import { BaseService } from '../../../services';
import { MatDialog } from '@angular/material';
import { DistributionTeacherAccountPreviewComponent } from '../../../dialog/distribution-teacher-account-preview/distribution-teacher-account-preview.component';

@Component({
  selector: 'app-distribution-teacher',
  templateUrl: './distribution-teacher.component.html',
  styleUrls: ['./distribution-teacher.component.scss']
})
export class DistributionTeacherComponent implements OnInit {

  search = {
    name: undefined,
    email: undefined,
  };

  provinces = [];
  citys = [];
  areas = [];
  provinceCode;
  cityCode;
  areaCode;

  page = 1;
  pageSize = 30;
  filteredData: any[] = [];
  filteredTotal: number;
  columns: ITdDataTableColumn[] = [
    {name: 'id', label: '操作'},
    {name: 'name', label: '姓名',},
    {name: 'email', label: '邮箱'},
    {name: 'authMobile', label: '手机号',},
    {name: 'provinceName', label: '省'},
    {name: 'cityName', label: '市'},
    {name: 'areaName', label: '区'},
    {name: 'totalMoney', label: '总收入'},
    {name: 'realMoney', label: '账户余额'},
  ];

  constructor(private _distributionService: DistributionService,
              private _baseService: BaseService,
              private _dialog: MatDialog,) {
    this._baseService.getAllProvinces().subscribe(v => this.provinces = v);
  }

  ngOnInit() {
    this.filter();
  }

  filter() {

    let data = Object.assign({}, this.search, {
      page: this.page,
      size: this.pageSize,
      provinceCode: this.provinceCode,
      cityCode: this.cityCode,
      areaCode: this.areaCode,
    });

    this._distributionService.getAllTeacherWithAccount(data).subscribe(result => {
      this.filteredTotal = result.total;
      this.filteredData = result.list;
    });
  }

  pageChange(pagingEvent: IPageChangeEvent): void {

    this.pageSize = pagingEvent.pageSize;
    this.page = pagingEvent.page;

    this.filter();
  }

  getStateByProvinceId() {
    this._baseService.getAllCitys(this.provinceCode).subscribe(v => this.citys = v);
    this.filter();
  }

  getStateByCityId() {
    this._baseService.getAllAreas(this.cityCode).subscribe(v => this.areas = v);
    this.filter();
  }

  showDilog(row: any): void {
    this._dialog.open(DistributionTeacherAccountPreviewComponent, {width: '50%', height: '90%', data: row});
  }

  reset() {
    this.search = {
      name: undefined,
      email: undefined,
    };
    this.provinceCode = undefined;
    this.cityCode = undefined;
    this.areaCode = undefined;

    this.filter();
  }
}
