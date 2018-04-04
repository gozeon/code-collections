import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
declare var require: any;
const Quill = require('quill');
import { FileService } from './../../services/file.service';

@Component({
  selector: 'quill-editor',
  template: `<div class="quill-editor"></div>`,
  styleUrls: [
    './quillEditor.component.scss',
    '../../../../node_modules/quill/dist/quill.core.css',
    '../../../../node_modules/quill/dist/quill.snow.css',
    '../../../../node_modules/quill/dist/quill.bubble.css'
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => QuillEditorComponent),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None
})
export class QuillEditorComponent implements AfterViewInit, ControlValueAccessor, OnChanges {

  // 基本数据
  quillEditor: any;
  editorElem: HTMLElement;
  content: any;
  defaultModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button

      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  // 传入配置
  @Input() options: Object;

  // 派发事件
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() ready: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  // ...
  onModelChange: Function = () => { };
  onModelTouched: Function = () => { };

  // 注入Dom
  constructor(private elementRef: ElementRef, private _fileService: FileService) { }

  // 视图加载完成后执行初始化
  ngAfterViewInit() {
    this.editorElem = this.elementRef.nativeElement.children[0];

    this.quillEditor = new Quill(this.editorElem, Object.assign({
      modules: this.defaultModules,
      placeholder: 'Insert text here ...',
      readOnly: false,
      theme: 'snow',
      boundary: document.body
    }, this.options || {}));
    /**
     * Step1. select local image
     *
     */
    const selectLocalImage = () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      // Listen upload local image and save to server
      input.onchange = () => {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
          saveToServer(file);
        } else {
          console.warn('You could only upload images.');
        }
      };
    };

    /**
     * Step2. save to server
     *
     * @param {File} file
     */
    const saveToServer = (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      this._fileService.uploadPublicRead(fd).subscribe(result => {
        if (result.code === '10000') {
          insertToEditor(result.data.url);
        } else {
          alert('文件上传失败');
        }
      });
      // const xhr = new XMLHttpRequest();
      // xhr.open('POST', 'http://platform.test.blingabc.com/crm-web/file/v1/oss/upload/publicRead', true);
      // xhr.setRequestHeader('authorization', 'dd34e0ff4e10a1d3b9428589369138e0');
      // xhr.onload = () => {
      //   if (xhr.status === 200) {
      //     // this is callback data: url
      //     const url = JSON.parse(xhr.responseText).data.url;
      //     insertToEditor(url);
      //   }
      // };
      // xhr.send(fd);
    };

    /**
     * Step3. insert image url to rich editor.
     *
     * @param {string} url
     */
    const insertToEditor = (url: string) => {
      // push image url to rich editor.
      const range = this.quillEditor.getSelection();
      this.quillEditor.insertEmbed(range.index, 'image', url);
    };
    // quill editor add image handler
    this.quillEditor.getModule('toolbar').addHandler('image', () => {
      selectLocalImage();
    });

    // 写入内容
    if (this.content) {
      this.quillEditor.pasteHTML(this.content);
    }

    // 广播事件
    this.ready.emit(this.quillEditor);

    // mark model as touched if editor lost focus
    this.quillEditor.on('selection-change', (range) => {
      if (!range) {
        this.onModelTouched();
        this.blur.emit(this.quillEditor);
      } else {
        this.focus.emit(this.quillEditor);
      }
    });

    // update model if text changes
    this.quillEditor.on('text-change', (delta, oldDelta, source) => {
      let html = this.editorElem.children[0].innerHTML;
      const text = this.quillEditor.getText();

      if (html === '<p><br></p>') html = null;

      this.onModelChange(html);

      this.change.emit({
        editor: this.quillEditor,
        html: html,
        text: text
      });
    });
  }

  // 数据变更时
  ngOnChanges(changes: SimpleChanges) {
    if (changes['readOnly'] && this.quillEditor) {
      this.quillEditor.enable(!changes['readOnly'].currentValue);
    }
  }

  // 写数据
  writeValue(currentValue: any) {
    this.content = currentValue;

    if (this.quillEditor) {
      if (currentValue) {
        this.quillEditor.pasteHTML(currentValue);
        return;
      }
      this.quillEditor.setText('');
    }
  }

  // 注册事件
  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  // 注册事件
  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }
}
