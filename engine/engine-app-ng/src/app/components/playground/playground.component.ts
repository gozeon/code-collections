import { Component, OnInit } from '@angular/core';
import { EditorContent } from '../editor/editor.model';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  editorContent: EditorContent = {
    name: '*scripts',
    content: `console.log('hello world!');`
  };

  constructor() {
  }

  ngOnInit() {

  }

  setEditor(e: any): void {
    if (e.node.code) {
      this.editorContent = {
        name: e.node.name,
        content: e.node.code
      }
    }
  }

}
