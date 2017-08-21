import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as ace from 'brace';
import { Editor } from 'brace';
import 'brace/theme/xcode.js';
import 'brace/mode/javascript.js';

import { EditorContent } from './editor.model';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnChanges {
  @Input() editorContent: EditorContent;
  private editor: Editor;
  private _editorContent: EditorContent

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this._editorContent = changes.editorContent.currentValue;
    this.editor = ace.edit('editor');
    this.editor.setOptions({
      tabSize: 2
    });
    this.editor.setTheme('ace/theme/xcode');
    this.editor.getSession().setMode('ace/mode/javascript');
    // this.editor.setReadOnly(true);
    this.editor.setValue(this._editorContent.content);
  }
}
