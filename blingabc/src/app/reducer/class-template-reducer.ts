import * as ClassTemplateActions from '../action/class-template-action';

export interface ClassTemplateFilterState {
  level: string;
  term: string;
  courseType: string;
  state: string;
  stage: string;
  schoolTimeId: string;

}

export const initClassTemplateFilterState: ClassTemplateFilterState = {
  level: '',
  term: '',
  courseType: '',
  state: '',
  stage: '',
  schoolTimeId: '',
};

export type Action = ClassTemplateActions.All;

export function courserReducer(state: ClassTemplateFilterState = initClassTemplateFilterState, action: Action): ClassTemplateFilterState {
  switch (action.type) {
    case ClassTemplateActions.CHANGE:
      return Object.assign({}, state, action.payload);

    case ClassTemplateActions.RESET:
      return initClassTemplateFilterState;

    default:
      return state;
  }
}
