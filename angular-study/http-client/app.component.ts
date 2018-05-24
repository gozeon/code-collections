import { Component } from '@angular/core';
import { Client } from './client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  viewProviders: [Client],
})
export class AppComponent {
  title = 'app';
  constructor(private _client: Client) {
    this._client.getStages().subscribe((result) => {
      console.log(result);
    });
  }
}
