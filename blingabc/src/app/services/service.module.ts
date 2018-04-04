import { NgModule } from '@angular/core';
import {AUTH_PROVIDERS} from './auth.service';
import {LoggedInGuard} from '../guard/loggedIn.guard';
import {BtnService} from '../manager/user/service/btn.service';
import {
  LessonService, BaseService, OrderService, ForeignTeacherService,
  CourseService, MessageService, ClassService, ClassTeacherService, UserService, ConferenceService,
  CRMUserService, FileService, InteractiveService,
} from './index';
import { TrackService } from './track.service';
import { DataService } from '../manager/user/service/data.service';
import { ContentGuard } from '../guard/content.guard';
import { PrepService } from './prep.service';
import { HomeworkService } from './homework.service';
import { PracticeService } from './practice.service';
import { StudentService } from './student.service';
import { EeoService } from './eeo.service';
import { FreshmanGuidanceService } from './freshman-guidance.service';
import { DeviceService } from './device.service';
import { DistributionService } from './distribution.service';

const SERVICE_PROVIDERS = [
  AUTH_PROVIDERS,
  LoggedInGuard,
  ContentGuard,
  BtnService,
  DataService,
  BaseService,
  LessonService,
  OrderService,
  CourseService,
  MessageService,
  ClassService,
  ClassTeacherService,
  ForeignTeacherService,
  UserService,
  ConferenceService,
  CRMUserService,
  FileService,
  InteractiveService,
  TrackService,
  PrepService,
  HomeworkService,
  PracticeService,
  StudentService,
  EeoService,
  FreshmanGuidanceService,
  DeviceService,
  DistributionService,
];

@NgModule({
  providers: [
    ...SERVICE_PROVIDERS
  ],
})
export class ServiceModule { }
