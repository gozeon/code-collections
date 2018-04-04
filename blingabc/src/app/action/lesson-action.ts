import { Action } from '@ngrx/store';
import { LessonFilterState } from '../reducer/lesson-reducer';

export const CHANGE = '[Lesson] CHANGE';
export const RESET = '[Lesson] RESET';

export class Change implements Action {
  readonly type = CHANGE;

  constructor(public payload: LessonFilterState) {
  }
}

export class Reset implements Action {
  readonly type = RESET;
}

export type All
  = Change
  | Reset;
