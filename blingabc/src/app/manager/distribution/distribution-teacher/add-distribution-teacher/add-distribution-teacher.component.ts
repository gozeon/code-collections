import { Component, OnInit } from '@angular/core';
import { AVATAR_IMG_URL } from '../../../teacher/foreign-teacher/add-foreign-teacher/add-foreign-teacher.component';
import { appendAll, BaseService, FileService, verifyMiddleWare } from '../../../../services';
import { Md2Toast } from '../../../../common/toast';
import { DistributionService } from '../../../../services/distribution.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-distribution-teacher',
  templateUrl: './add-distribution-teacher.component.html',
  styleUrls: ['./add-distribution-teacher.component.scss']
})
export class AddDistributionTeacherComponent implements OnInit {
  mainUri = '/main/distribution/teacher';
  avatarUri = AVATAR_IMG_URL;
  name = undefined;
  authCard = undefined;
  email = undefined;
  provinces = [];
  citys = [];
  areas = [];
  provinceCode;
  cityCode;
  areaCode;

  constructor(private _fileService: FileService,
              private _toast: Md2Toast,
              private _baseService: BaseService,
              private _distributionService: DistributionService,
              private _router: Router,) {
  }

  ngOnInit() {
    this._baseService.getAllProvinces().subscribe(v => this.provinces = v);
  }

  chooseIamge(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      this._fileService.uploadPublicRead(formData).subscribe(r => {
        if (verifyMiddleWare(r)) {
          this.avatarUri = r.data.url;
        } else {
          event.target.value = '';
          this._toast.show(r.msg, 1800);
        }
      });
    }
  }

  getStateByProvinceId() {
    this._baseService.getAllCitys(this.provinceCode).subscribe(v => this.citys = v);
  }

  getStateByCityId() {
    this._baseService.getAllAreas(this.cityCode).subscribe(v => this.areas = v);
  }

  onSubmit(): void {
    const data = Object.assign({}, {
      name: this.name,
      email: this.email,
      provinceCode: this.provinceCode,
      cityCode: this.cityCode,
      areaCode: this.areaCode,
      authCard: this.authCard,
      headImg: this.avatarUri === AVATAR_IMG_URL ? undefined : this.avatarUri,
    });

    this._distributionService.addTeacher(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('添加成功', 1800);
        this._router.navigate([this.mainUri]);
      }
    });
  }
}
