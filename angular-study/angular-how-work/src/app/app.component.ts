import { Component } from '@angular/core';

import { Product } from './product/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  products: Product[];

  constructor() {
    this.products = [
      new Product(
        'ABCsD',
        'AssBCE',
        '../../assets/images/ss.jpg',
        ['a', 'b', 'c'],
        120
      ),
      new Product(
        'ABfCD',
        'ABssCE',
        '../../assets/images/ss.jpg',
        ['a', 'b'],
        120.22
      ),
      new Product(
        'dABCD',
        'ABCddE',
        '../../assets/images/ss.jpg',
        ['a', 'b', 'c', 'e'],
        120.12
      )
    ];
  }

  productWasSelected(product: Product): void {
    console.log('Product clicked: ', product);
  }
}
