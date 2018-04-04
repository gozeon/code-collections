import { Action } from '@ngrx/store';
import { CourserFilterState } from '../reducer/course-reducer';

export const CHANGE = '[Courser] CHANGE';
export const RESET = '[Courser] RESET';

export class Change implements Action {
  readonly type = CHANGE;

  constructor(public payload: CourserFilterState) {
  }
}

export class Reset implements Action {
  readonly type = RESET;
}

export type All
  = Change
  | Reset;
