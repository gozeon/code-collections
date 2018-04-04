import { CourserFilterState, courserReducer } from './course-reducer';
import { LessonFilterState, lessonReducer } from './lesson-reducer';

export const reducer = {
  course: courserReducer,
  lesson: lessonReducer,
};


export interface AppState {
  course: CourserFilterState;
  lesson: LessonFilterState;
}
