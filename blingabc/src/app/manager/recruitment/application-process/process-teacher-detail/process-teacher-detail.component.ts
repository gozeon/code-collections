import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseService, ForeignTeacherService, FileService, ClassService } from '../../../../services';
import { Observable } from 'rxjs/Observable';
import { MatDialog, } from '@angular/material';
import { ViewImageComponent } from '../../../../dialog/view-image/view-image.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ITdDataTableColumn, IPageChangeEvent, TdDialogService, TdLoadingService
} from '@covalent/core';

export const LG_IMG_URL = 'https://placekitten.com/g/600/300';
export const AVATAR_IMG_URL = 'https://placekitten.com/g/200/200';

import { ChangeForeignTeacherComponent } from '../../../../dialog/change-foreign-teacher/change-foreign-teacher.component';
import { Md2Toast } from '../../../../common/toast/index';

@Component({
  selector: 'app-process-teacher-detail',
  templateUrl: './process-teacher-detail.component.html',
  styleUrls: ['./process-teacher-detail.component.scss']
})
export class ProcessTeacherDetailComponent implements OnInit {
  form: FormGroup;
  id: number;
  foreignId: number;
  virtualPhone: undefined; // 虚拟手机号

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
  countries: any[] = [];
  areaCodes: any[] = [];
  timeZones: any[] = [];
  educationSelections: any[] = [];
  universities: any[] = [];
  certificates: any[] = [];
  experiences: any[] = [];
  sources: any[] = [];
  states: any[] = [];
  regions: any[] = [];
  levels: any[] = [];
  scores: number[];

  // file path
  file = {
    avatar: AVATAR_IMG_URL,     // 头像
    atmCardImg: LG_IMG_URL, // 银行卡图片路径
    validIdImg: LG_IMG_URL, // 身份证件图片路径
    resumePath: ''  // 简历路径
  };

  educations = [
    {name: undefined, universityId: undefined, otherUniversityName: undefined, major: undefined}
  ];

  // Teacher Performance
  time = {
    startAt: undefined,
    endAt: undefined,
  };
  isShowReset = false;
  nickname = '';

  // lesson table
  lessonColumns: ITdDataTableColumn[] = [
    {name: 'startAt', label: 'Lesson Date'},
    {name: 'classCode', label: 'Class ID'},
    {name: 'classLessonCode', label: 'Lesson ID'},
    {name: 'classLessonName', label: 'Lesson'},
    {name: 'liveCurrentContain', label: 'Registered students'},
    {name: 'stateName', label: 'Lesson Status'},
    // { name: 'id', label: '', },
  ];
  lessonData: any[] = [];
  lessonTotal: number;
  lessonFromRow = 1;
  lessonPage = 1;
  lessonPageSize = 5;

  // class table
  classColumns: ITdDataTableColumn[] = [
    {name: 'startAt', label: 'First Lesson Date'},
    {name: 'classCode', label: 'Class ID'},
    {name: 'className', label: 'Class'},
    {name: 'liveCurrentContain', label: 'Registered students'},
    {name: 'lessonTotal', label: 'Lesson'},
    {name: 'completedLessonNum', label: 'Process'},
    // { name: 'id', label: '', },
  ];
  classData: any[] = [];
  classTotal: number;
  classFromRow = 1;
  classPage = 1;
  classPageSize = 5;

  loading = false;

  constructor(private fb: FormBuilder,
              private _baseService: BaseService,
              private _dialog: MatDialog,
              private _sanitizer: DomSanitizer,
              private _dialogService: TdDialogService,
              private _route: Router,
              private _toast: Md2Toast,
              private _foreignTeacherService: ForeignTeacherService,
              private _fileService: FileService,
              private _router: ActivatedRoute,
              private _classService: ClassService,
              private _loadingService: TdLoadingService) {
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
    this.initForeignTeacherInfo();
    this.filter();
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
      this.areaCodes = data[1].map(i => {
        i.name = `${i.country}: ${i.code}`;
        return i;
      });
      this.timeZones = data[2];
      this.educationSelections = data[3];
      this.universities = data[4];
      this.certificates = data[5].map(i => {
        i.certificate = undefined;
        return i;
      });
      this.experiences = data[6];
      this.sources = data[7];
      this.levels = data[8];
    });
    return;
  }

  initForeignTeacherInfo(): void {
    this._router.params.subscribe(parms => {
      if (Boolean(parms['id'])) {
        this.id = parms['id'];
        this._foreignTeacherService.getForeignTeacherById(parms['id']).subscribe(result => {
          if (result && result.countryId && result.stateId) {
            Observable.zip(
              this._baseService.getAllStateByCountryId(result.countryId),
              this._baseService.getAllRegionsByStateId(result.stateId),
            ).subscribe(data => {
              this.states = data[0];
              this.regions = data[1];
              this.initValueToPage(result);
            });
          } else {
            this.initValueToPage(result);
          }
        });
      }
    });
  }

  initValueToPage(teacher: any): void {
    this.foreignId = teacher.foreignId;

    this.virtualPhone = teacher.virtualPhone;

    this.radio = {
      sex: teacher.sex
    };

    this.date = {
      birth: teacher.birthday ? moment(teacher.birthday).format() : null,
      interviewTime: teacher.interviewTime ? moment(teacher.interviewTime).format() : null
    };

    this.select = {
      countryId: teacher.countryId,
      regionId: teacher.regionId,
      stateId: teacher.stateId,
      nationalityId: teacher.nationalityId,
      timeZone: teacher.timeZone,
      globalCode: teacher.globalCode,
      teachingExperience: teacher.teachingExperience,
      source: teacher.source,
      level: teacher.level,
      interviewScore: teacher.interviewScore,
    };

    this.form.setValue({
      email: teacher.email,
      firstName: teacher.firstName,
      middleName: teacher.middleName,
      lastName: teacher.lastName,
      phone: teacher.phone,
      paypalAccount: teacher.paypalAccount,
      skypeId: teacher.skypeId,
      accountNumber: teacher.accountNumber,
      bankName: teacher.bankName,
      interviewer: teacher.interviewer,
    });

    this.form.controls['email'].disable();

    this.file = {
      avatar: teacher.avatar ? teacher.avatar : AVATAR_IMG_URL,     // 头像
      atmCardImg: teacher.atmCardImg ? teacher.atmCardImg : LG_IMG_URL, // 银行卡图片路径
      validIdImg: teacher.validIdImg ? teacher.validIdImg : LG_IMG_URL, // 身份证件图片路径
      resumePath: teacher.resumePath ? teacher.resumePath : ''  // 简历路径
    };

    this.educations = teacher.educations;
    this.nickname = teacher.name;

    if (teacher.certificate) {
      const tmp = teacher.certificate.split(',');
      this.certificates = this.certificates.map(item => {
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i] === item.code) {
            item.certificate = tmp[i];
          }
        }
        return item;
      });
    }
  }

  onSubmit(): void {
    // if (!validatorEmail(this.form.value.email)) {
    //   this.warn('邮箱格式不正确!')
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
        foreignId: this.foreignId,
        birthday: this.date.birth ? moment(this.date.birth).format('x') : null,
        interviewTime: this.date.interviewTime ? moment(this.date.interviewTime).format('x') : null,
        educations: this.educations,
        // name: this.nickname,
        certificate: this.certificates.map(i => {
          if (i.certificate) {
            return i.code;
          }
        }).filter(e => e).join(','),
      });

    Object.keys(data).forEach(key => (data[key] === null || data[key] === '') && delete data[key]);
    Object.keys(data).forEach(key => (data[key] === AVATAR_IMG_URL || data[key] === LG_IMG_URL) && delete data[key]);

    // TODO API
    this._loadingService.register();
    this._foreignTeacherService.updateForeignTecher(this.id, data).subscribe(r => {
      this._loadingService.resolve();
      if (r.code === 200) {
        this.success('update');
        this._route.navigate(['/main/recruitment/process']);
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
      });
    }
  }

  getRegionByStateId(): void {
    if (this.select.stateId) {
      this.regions = [];
      this._baseService.getAllRegionsByStateId(this.select.stateId).subscribe(data => {
        this.regions = data;
      });
    }
  }

  success(str: string): void {
    this._toast.show(`${str} sucess`, 1800);
    this.initForeignTeacherInfo();
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

  lessonPageChange(pagingEvent: IPageChangeEvent): void {
    this.lessonFromRow = pagingEvent.fromRow;
    this.lessonPage = pagingEvent.page;
    this.lessonPageSize = pagingEvent.pageSize;
    this.filter();
  }

  classPageChange(pagingEvent: IPageChangeEvent): void {
    this.classFromRow = pagingEvent.fromRow;
    this.classPage = pagingEvent.page;
    this.classPageSize = pagingEvent.pageSize;
    this.filter();
  }

  filter(): void {
    this._router.params.subscribe(parms => {
      if (Boolean(parms['id'])) {
        Observable.zip(
          this._foreignTeacherService.getLessonsByForeignTecherId({
            id: parms['id'],
            page: this.lessonPage,
            size: this.lessonPageSize,
            startDate: this.time.startAt ? moment(this.time.startAt).format('x') : null,
            endDate: this.time.endAt ? moment(this.time.endAt).format('x') : null,
          }),
          this._foreignTeacherService.getClasssByForeignTecherId({
            id: parms['id'],
            page: this.classPage,
            size: this.classPageSize,
            startDate: this.time.startAt ? moment(this.time.startAt).format('x') : null,
            endDate: this.time.endAt ? moment(this.time.endAt).format('x') : null,
          }),
        ).subscribe(result => {
          if (result[0].code === '10000' && result[0].msg === 'ok') {
            this.lessonData = result[0].data.list.map(i => {
              i.startAt = i.beginDate ? moment(i.beginDate).format('YYYY-MM-DD HH:mm') : null;
              return i;
            });
            this.lessonTotal = result[0].total;
          }

          if (result[1].code === '10000' && result[1].msg === 'ok') {
            this.classData = result[1].data.list.map(i => {
              i.startAt = i.classStartDate ? moment(i.classStartDate).format('YYYY-MM-DD HH:mm') : null;
              return i;
            });
            this.classTotal = result[1].total;
          }
        });
      }
    });
  }

  toFilter(): void {
    if (this.time.startAt && this.time.endAt) {
      this.filter();
      this.isShowReset = true;
    } else {
      this.warn('Please enter the time period');
    }
  }

  resetFilter(): void {
    this.time = {
      startAt: undefined,
      endAt: undefined,
    };
    this.isShowReset = false;
    this.filter();
  }

  openChangeForeignTeacher(type: string, row: any): void {
    this._dialog.open(ChangeForeignTeacherComponent, {
      width: '50%',
      data: {id: this.id, name: this.form.value.name}
    })
      .afterClosed()
      .subscribe(data => {
        if (data) {
          switch (type) {
            case 'lesson':
              break;
            case 'class':
              break;
          }
        }
      });
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

  sameAs(): void {
    this.select.nationalityId = this.select.countryId;
  }
}
