import * as CourseActions from '../action/course-action';

export interface CourserFilterState {
  level: string;
  term: string;
  courseType: string;
}

export const initCourserFilterState: CourserFilterState = {
  level: '',
  term: '',
  courseType: ''
};

export type Action = CourseActions.All;

export function courserReducer(state: CourserFilterState = initCourserFilterState, action: Action): CourserFilterState {
  switch (action.type) {
    case CourseActions.CHANGE:
      return Object.assign({}, state, action.payload);

    case CourseActions.RESET:
      return initCourserFilterState;

    default:
      return state;
  }
}
