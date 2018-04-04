import {Component, OnInit} from '@angular/core';
import {BaseService, verifyMiddleWare} from '../../../../services/base.service';
import {FileService} from '../../../../services/file.service';
import {PracticeService} from '../../../../services/practice.service';
import {Md2Toast} from '../../../../common/toast/toast';
import {Router} from '@angular/router';
import {checkFileType} from '../../course/utils';

@Component({
  selector: 'app-add-practice',
  templateUrl: './add-practice.component.html',
  styleUrls: ['./add-practice.component.scss']
})
export class AddPracticeComponent implements OnInit {
  seasons: any[];
  levels: any[];
  selected = {
    tearmCode: '',
    level: '',
    pubStatus: '',
    bookType: undefined
  };
  name: '';
  remark = '';
  contentUrl = '';
  loading = false;

  constructor(private _baseService: BaseService,
              private _fileService: FileService,
              private _practiceService: PracticeService,
              private _toast: Md2Toast,
              private _router: Router) {
    this.initSelect();
  }

  initSelect(): void {
    this._baseService.getAllTerms().subscribe(v => this.seasons = v);
    this._baseService.getAllCourseLevel().subscribe(v => this.levels = v);
  }

  ngOnInit() {
  }

  uploadFile(e): void {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);

      if (this.selected.bookType === 5) {
        if (!checkFileType(e.target.files[0].name, ['zip'])) {
          this._toast.show('不支持该文件类型', 1800);
          e.target.value = '';
          return;
        }
      } else {
        if (!checkFileType(e.target.files[0].name, ['mp4', 'MP4'])) {
          this._toast.show('不支持该文件类型', 1800);
          e.target.value = '';
          return;
        }
      }

      this.loading = true;
      if (this.selected.bookType === 5) {
        this._practiceService.uploadBookContent(formData).subscribe(result => {
          this.loading = false;
          if (verifyMiddleWare(result)) {
            this.contentUrl = result.data;
          }
        });
      } else {
        this._fileService.uploadPublicRead(formData).subscribe(result => {
          this.loading = false;
          if (verifyMiddleWare(result)) {
            this.contentUrl = result.data.url;
          }
        });
      }
    }
  }

  onSubmit(): void {
    const data = Object.assign({}, this.selected, {
      name: this.name,
      remark: this.remark,
      pubStatus: 0,
      contentUrl: this.contentUrl,
      createUsername: JSON.parse(localStorage.getItem('info')).name
    });

    // TODO API
    this._practiceService.addPractice(data).subscribe(result => {
      if (result.code === 200) {
        this._toast.show('添加成功', 1800);
        this._router.navigate(['/main/content/practice']);
      }
    });
  }
}
