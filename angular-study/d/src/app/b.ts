import * as moment from 'moment';

export const now = () => {
  return moment().format();
};
