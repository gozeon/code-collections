import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseService, ForeignTeacherService, FileService } from '../../../../services';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';
import { ViewImageComponent } from '../../../../dialog/view-image/view-image.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import {
  TdDialogService, TdLoadingService
} from '@covalent/core';
import { Md2Toast } from '../../../../common/toast/index';
import { deepCopy } from '../../utils';

export const LG_IMG_URL = 'https://placekitten.com/g/600/300';
export const AVATAR_IMG_URL = 'https://placekitten.com/g/200/200';

@Component({
  selector: 'app-add-foreign-teacher',
  templateUrl: './add-foreign-teacher.component.html',
  styleUrls: ['./add-foreign-teacher.component.scss']
})
export class AddForeignTeacherComponent implements OnInit {
  form: FormGroup;

  // radio
  radio = {
    sex: 1                     // 性别
  };

  // date
  date = {
    birth: '',         // 出生年月
    interviewTime: ''  // 面试时间
  };

  // select
  select = {
    countryId: undefined,             // 国家ID
    regionId: undefined,              // 地区ID
    stateId: undefined,               // 州ID
    nationalityId: undefined,         // 国籍ID
    timeZone: undefined,              // 时区ID
    globalCode: undefined,            // 手机区号
    teachingExperience: undefined,    // 教学经验
    source: undefined,                // 简历来源
    level: undefined,                 // 外教等级
    interviewScore: undefined,
  };

  // selections
  countries: any[] = []; // 国家
  states: any[] = [];    // 洲
  regions: any[] = [];   // 区
  countries_backup: any[] = []; // 国家
  states_backup: any[] = [];    // 洲
  regions_backup: any[] = [];   // 区

  nationalities: any = [];
  areaCodes: any[] = [];
  timeZones: any[] = [];
  timeZones_backup: any[] = [];
  educationSelections: any[] = [];
  universities: any[] = [];
  certificates: any[] = [];
  experiences: any[] = [];
  sources: any[] = [];
  levels: any[] = [];
  scores: number[];

  // file path
  file = {
    avatar: AVATAR_IMG_URL,     // 头像
    atmCardImg: LG_IMG_URL, // 银行卡图片路径
    validIdImg: LG_IMG_URL, // 身份证件图片路径
    resumePath: ''  // 简历路径
  };

  // Qualification
  // education: number;            // 学历
  // universityId: number;         // 大学ID
  // otherUniversityName: string   // 其他大学名称
  // majorName: string             // 专业名称

  loading = false;
  nickname = '';
  introduction = '';

  educations = [
    {name: undefined, universityId: undefined, otherUniversityName: undefined, major: undefined}
  ];

  constructor(private fb: FormBuilder,
              private _baseService: BaseService,
              private _dialog: MatDialog,
              private _loadingService: TdLoadingService,
              private _dialogService: TdDialogService,
              private _route: Router,
              private _toast: Md2Toast,
              private _foreignTeacherService: ForeignTeacherService,
              private _fileService: FileService) {
    this.form = this.fb.group({
      'email': [''],          // 邮箱
      'firstName': [''],      // 名
      'middleName': [''],     // 中名
      'lastName': [''],       // 姓
      'phone': [''],          // 手机号
      'paypalAccount': [''],  // paypal账号
      'skypeId': [''],        // skype账号
      'accountNumber': [''],  // 银行账户
      'bankName': [''],       // 银行名称
      'interviewer': [''],    // 面试人
    });
  }

  ngOnInit() {
    this.scores = this.createNumScoreArray();
    this.initPage();
  }

  createNumScoreArray(): number[] {
    const r = [];
    for (let i = 70; i <= 100; i++) {
      r.push(i);
    }
    return r;
  }

  initPage(): void {
    Observable.zip(
      this._baseService.getAllCountries(),
      this._baseService.getAllAreaCode(),
      this._baseService.getAllTimeZone(),
      this._baseService.getAllEducation(),
      this._baseService.getAllUniversities(),
      this._baseService.getAllCertificate(),
      this._baseService.getAllExperience(),
      this._baseService.getAllSources(),
      this._baseService.getAllForeignTeacherLevels()
    ).subscribe((data: any[]) => {
      this.countries = data[0];
      this.countries_backup = deepCopy(data[0]);
      this.nationalities = data[0];

      this.areaCodes = data[1].map(i => {
        i.name = `${i.country}: ${i.code}`;
        return i;
      });
      this.timeZones = data[2];
      this.timeZones_backup = deepCopy(data[2]);
      this.educationSelections = data[3];
      this.universities = data[4];
      this.certificates = data[5];
      this.experiences = data[6];
      this.sources = data[7];
      this.levels = data[8];
    });
    return;
  }

  onSubmit(): void {
    // if (!validatorEmail(this.form.value.email)) {
    //   this.warn('This is required or not correct!')
    //   return;
    // }

    // if (!validatorPhoneNumber(this.form.value.phone)) {
    //   this.warn('手机号格式不正确!');
    //   return;
    // }

    const data = Object.assign({},
      this.file,
      this.radio,
      this.select,
      this.form.value,
      {
        birthday: this.date.birth ? moment(this.date.birth).format('x') : null,
        interviewTime: this.date.interviewTime ? moment(this.date.interviewTime).format('x') : null,
        certificate: this.certificates.map(i => {
          if (i.certificate) {
            return i.code;
          }
        }).filter(e => e).join(','),
        educations: this.educations,
        name: this.nickname,
        introduction: this.introduction
      });

    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);
    Object.keys(data).forEach(key => (data[key] === AVATAR_IMG_URL || data[key] === LG_IMG_URL) && delete data[key]);

    // TODO API
    this._loadingService.register();
    this._foreignTeacherService.createForeignTecher(data).subscribe(r => {
      this._loadingService.resolve();
      if (r.code === 200) {
        this.success('Add');
      } else {
        this._toast.show(`${r.msg}`, 1800);
        return;
      }
    });
  }

  showImageExampleDialog(e: any): void {
    this._dialog.open(ViewImageComponent, {width: '50%', data: e.target.src});
  }

  chooseIamge(event: any, type: string): void {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      if (type === 'resume' && event.target.files[0].name.slice(-3) !== 'pdf') {
        event.target.value = '';
        this.warn('Only PDF format will be accepted.');
        return;
      }

      const filesize = +((event.target.files[0].size / 1024) / 1024).toFixed(4);

      if (filesize > 2) {
        event.target.value = '';
        this.warn('The size must be lower than 2M.');
        return;
      }

      this.loading = true;
      this._fileService.uploadPublicRead(formData).subscribe(r => {
        this.loading = false;
        if (r.code === '10000' && r.msg === 'ok') {
          switch (type) {
            case 'avatar':
              this.file.avatar = r.data.url;
              break;
            case 'atm':
              this.file.atmCardImg = r.data.url;
              break;
            case 'valid':
              this.file.validIdImg = r.data.url;
              break;
            case 'resume':
              this.file.resumePath = r.data.url;
              break;
          }
        } else {
          event.target.value = '';
          this._toast.show(r.msg, 1800);
        }
      });
    }
  }

  getStateByCountryId(): void {
    if (this.select.countryId) {
      this.states = [];
      this.regions = [];
      this._baseService.getAllStateByCountryId(this.select.countryId).subscribe(data => {
        this.states = data;
        this.states_backup = deepCopy(data);
      });
    }
  }

  getRegionByStateId(): void {
    if (this.select.stateId) {
      this.regions = [];
      this._baseService.getAllRegionsByStateId(this.select.stateId).subscribe(data => {
        this.regions = data;
        this.regions_backup = deepCopy(data);
      });
    }
  }

  checkBoxChange(item: any): void {
    if (item.code === 'CERT_3' && item.certificate) {
      this.certificates = this.certificates.map(i => {
        delete i.certificate;
        return i;
      });
      this.certificates = this.certificates.map(i => {
        if (i.code === 'CERT_3') {
          i.certificate = true;
        }
        return i;
      });
    } else if (item.code !== 'CERT_3' && item.certificate) {
      this.certificates = this.certificates.map(i => {
        if (i.code === 'CERT_3') {
          i.certificate = false;
        }
        return i;
      });
    }
  }

  success(str: string): void {
    this._toast.show(`${str} success`, 1800);
    this._route.navigate(['/main/teacher/foreign']);
  }

  warn(msg: string): void {
    this._dialogService.openAlert({
      title: 'Warn',
      message: msg,
    });
    return;
  }

  addQualificationGroup(): void {
    this.educations.push(
      {name: undefined, universityId: undefined, otherUniversityName: undefined, major: undefined}
    );
  }

  removeQualificationGroup(): void {
    this.educations.pop();
  }

  sameAs(): void {
    this.select.nationalityId = this.select.countryId;
  }

  filterCountries(e: any): void {
    const value = e.target.value;
    const rep = new RegExp(value, 'ig');

    if (value) {
      this.countries = this.countries_backup.filter(i => rep.test(i.name));
    } else {
      this.countries = this.countries_backup;
    }
  }

  filterStates(e: any): void {
    const value = e.target.value;
    const rep = new RegExp(value, 'ig');

    if (value) {
      this.states = this.states_backup.filter(i => rep.test(i.name));
    } else {
      this.states = this.states_backup;
    }
  }

  filterRegions(e: any): void {
    const value = e.target.value;
    const rep = new RegExp(value, 'ig');

    if (value) {
      this.regions = this.regions_backup.filter(i => rep.test(i.name));
    } else {
      this.regions = this.regions_backup;
    }
  }

  filterTimeZone(e: any): void {
    const value = e.target.value;
    const rep = new RegExp(value, 'ig');

    if (value) {
      this.timeZones = this.timeZones_backup.filter(i => rep.test(i.name));
    } else {
      this.timeZones = this.timeZones_backup;
    }
  }
}
