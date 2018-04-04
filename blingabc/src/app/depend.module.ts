import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Md2DatepickerModule } from './common/datepicker';
import { DragulaModule } from 'ng2-dragula';
import {
  MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatDialogModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule,
  MatMenuModule, MatOptionModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSnackBarModule, MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {
  CovalentChipsModule,
  CovalentCommonModule, CovalentDataTableModule,
  CovalentDialogsModule, CovalentExpansionPanelModule, CovalentFileModule, CovalentLayoutModule, CovalentLoadingModule,
  CovalentMediaModule,
  CovalentPagingModule,
  CovalentSearchModule
} from '@covalent/core';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { CovalentHttpModule } from '@covalent/http';
import { CustomInterceptor } from './services/interceptors/custom.interceptor';
import { QuillEditorModule } from './common/quill-editor/quillEditor.module';
import { Md2ToastModule } from './common/toast/index';
import { Md2Toast } from './common/toast/toast';

const httpInterceptorProviders: Type<any>[] = [
  CustomInterceptor
];

const DEPEND_MODULE = [
  CovalentLoadingModule,
  CovalentDialogsModule,
  CovalentMediaModule,
  CovalentLayoutModule,
  CovalentSearchModule,
  CovalentCommonModule,
  CovalentDataTableModule,
  CovalentPagingModule,
  CovalentDynamicFormsModule,
  CovalentFileModule,
  CovalentChipsModule,
  CovalentHttpModule.forRoot({
    interceptors: [{
      interceptor: CustomInterceptor, paths: ['**']
    }]
  }),
  CovalentExpansionPanelModule,
  MatSnackBarModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatSlideToggleModule,
  MatMenuModule,
  MatOptionModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatDialogModule,
  MatChipsModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatCardModule,
  // ng2-dragula
  DragulaModule,
  // Mat2
  Md2DatepickerModule,
  Md2ToastModule,
  // ngx-quill-editor
  QuillEditorModule,
];

@NgModule({
  imports: [
    CommonModule,
    ...DEPEND_MODULE,
  ],
  providers: [
    httpInterceptorProviders,
    Md2Toast,
    CovalentLayoutModule,
  ]
})
export class DependModule {
}
