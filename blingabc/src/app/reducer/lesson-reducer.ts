import * as LessonActions from '../action/lesson-action';

export interface LessonFilterState {
  level: string;
  term: string;
  courseType: string;
}

export const initLessonFilterState: LessonFilterState = {
  level: '',
  term: '',
  courseType: ''
};

export type Action = LessonActions.All;

export function lessonReducer(state: LessonFilterState = initLessonFilterState, action: Action): LessonFilterState {
  switch (action.type) {
    case LessonActions.CHANGE:
      return Object.assign({}, state, action.payload);

    case LessonActions.RESET:
      return initLessonFilterState;

    default:
      return state;
  }
}
