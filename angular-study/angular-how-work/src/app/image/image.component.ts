import { Component, OnInit, Input } from '@angular/core';

import { Product } from '../product/product.model';

@Component({
  selector: 'product-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css'],
  host: { 'class': 'ui small image' }
})
export class ImageComponent implements OnInit {
  @Input() product: Product;
  constructor() { }

  ngOnInit() {
  }

}
