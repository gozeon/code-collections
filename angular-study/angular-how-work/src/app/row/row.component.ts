import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../product/product.model';


@Component({
  selector: 'product-row ',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css'],
  host: {'class': 'item'}
})
export class RowComponent implements OnInit {
  @Input() product: Product;

  constructor() { }

  ngOnInit() {
  }

}
