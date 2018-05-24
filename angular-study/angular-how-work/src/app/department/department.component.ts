import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../product/product.model';

@Component({
  selector: 'product-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

}
