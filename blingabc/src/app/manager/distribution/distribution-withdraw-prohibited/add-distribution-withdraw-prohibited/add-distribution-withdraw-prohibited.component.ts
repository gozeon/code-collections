import { Component, OnInit } from '@angular/core';
import { BaseService, FileService, verifyMiddleWare } from '../../../../services';
import { Md2Toast } from '../../../../common/toast';
import { Router } from '@angular/router';
import { DistributionService } from '../../../../services/distribution.service';

@Component({
  selector: 'app-add-distribution-withdraw-prohibited',
  templateUrl: './add-distribution-withdraw-prohibited.component.html',
  styleUrls: ['./add-distribution-withdraw-prohibited.component.scss']
})
export class AddDistributionWithdrawProhibitedComponent implements OnInit {
  mainUri = '/main/distribution/withdraw-prohibited';
  name;
  email;

  constructor(private _toast: Md2Toast,
              private _distributionService: DistributionService,
              private _router: Router,) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    const data = Object.assign({}, {
      name: this.name,
      email: this.email,
      createUsername: JSON.parse(localStorage.getItem('info')).username
  })
    ;

    this._distributionService.addWithdrawProhibited(data).subscribe(result => {
      if (verifyMiddleWare(result)) {
        this._toast.show('添加成功', 1800);
        this._router.navigate([this.mainUri]);
      }
    });
  }
}
