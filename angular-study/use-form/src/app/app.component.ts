import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';

function skuValidator(control: FormControl): ValidationErrors {
  if (!control.value.match(/^123/)) {
    return { invalidSku: false }
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  myform: FormGroup;
  myform2: FormGroup;
  myform3: FormGroup;
  myform4: FormGroup;
  constructor(fb: FormBuilder) {
    this.myform = fb.group({
      'fsku': ''
    })
    this.myform2 = fb.group({
      'sku2': ['', Validators.required]
    })
    this.myform3 = fb.group({
      'sku3': ['', Validators.compose([
        Validators.required, skuValidator
      ])]
    })
    this.myform4 = fb.group({
      'sku4': ['', Validators.required]
    })
  }
  onSubmit(form: any): void {
    console.log(form)
  }
  onSubmit1(value: any): void {
    console.log(value);
  }
  onSubmit2(value: any): void {
    console.log(value);
  }
  onSubmit3(value: any): void {
    console.log(value);
  }
}
