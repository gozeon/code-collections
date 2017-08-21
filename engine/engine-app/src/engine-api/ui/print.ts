import * as gg from 'engine-api';
import JSONFormatter from 'json-formatter-js';

export class UIPrint implements gg.PrintProtocol {
  print(arg: any): void {
    if (arg.constructor === [].constructor || arg.constructor === {}.constructor) {
      if (arg.constructor === {}.constructor && arg.hasOwnProperty('text') && arg.hasOwnProperty('url')) {
        const a = document.createElement('a');
        a.href = arg.url;
        a.textContent = arg.text;
        a.className = 'download-url';
        document.querySelector('#print').appendChild(a);
        return;
      }
      const formatter = new JSONFormatter(arg);
      document.querySelector('#print').appendChild(formatter.render());
    } else if (arg instanceof Error) {
      $('#error').css('display', 'inline-table').append(`<div>${arg.message}</div>`);
    } else if (arg === null) {
      document.querySelector('#print').textContent = 'null';
    } else if (arg === undefined) {
      document.querySelector('#print').textContent = 'undefined';
    } else if (arg) {
      document.querySelector('#print').textContent = arg;
    }
  }
  printUrl(url: string, displayUrl: string): void {
    this.print({ text: displayUrl, url: url });
  }

  printError(error: Error): void {
    this.print(error);
  }
}
