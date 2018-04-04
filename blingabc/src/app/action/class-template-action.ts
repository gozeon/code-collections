import { Action } from '@ngrx/store';
import { ClassTemplateFilterState } from '../reducer/class-template-reducer';

export const CHANGE = '[Class Template] CHANGE';
export const RESET = '[Class Template] RESET';

export class Change implements Action {
  readonly type = CHANGE;

  constructor(public payload: ClassTemplateFilterState) {
  }
}

export class Reset implements Action {
  readonly type = RESET;
}

export type All
  = Change
  | Reset;
