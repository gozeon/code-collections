import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../../../services/device.service';
import { Router } from '@angular/router';
import { Md2Toast } from '../../../../common/toast';
import { verifyMiddleWare } from '../../../../services';

@Component({
  selector: 'app-add-problem-record',
  templateUrl: './add-problem-record.component.html',
  styleUrls: ['./add-problem-record.component.scss']
})
export class AddProblemRecordComponent implements OnInit {
  mainUri = '/main/customer/problem';

  data = {
    videocam: false,
    headset: false,
    mic: false,
    language: false,
    phone: undefined,
    remark: undefined,
  };

  constructor(private _deviceService: DeviceService,
              private _router: Router,
              private _toast: Md2Toast,) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const a = [];
    if (this.data.videocam) {
      a.push(1);
    }
    if (this.data.headset) {
      a.push(2);
    }
    if (this.data.mic) {
      a.push(3);
    }
    if (this.data.language) {
      a.push(4);
    }

    const d = Object.assign({}, {
      telephone: this.data.phone,
      remarks: this.data.remark,
      type: a.join()
    });

    this._deviceService.addDeviceTask(d).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('添加成功', 1800);
        this._router.navigate([this.mainUri]);
      }
    });
  }
}
