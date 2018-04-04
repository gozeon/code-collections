export * from './api.config';
export * from './interceptors/custom.interceptor';

export * from './base.service';
export * from './lesson.service';
export * from './order.service';
export * from './course.service';
export * from './message.service';
export * from './class.service';
export * from './classTeacher.service';
export * from './foreign-teacher.service';
export * from './user.service';
export * from './conference.service';
export * from './crm-user.service';
export * from './file.service';
export * from './interactive.service';
export * from './track.service';
export * from './prep.service';
export * from './homework.service';

/**
 * @param items items.code Required
 */
export const keyCodetoValue = (items: any[]): any[] => {
  if (items.length === 0) {
    return [];
  }
  return items.map(i => {
    i.value = i.code;
    return i;
  });
};


/**
 * @param items items.code Required
 */
export const keyNameToLabel = (items: any[]): any[] => {
  if (items.length === 0) {
    return [];
  }
  return items.map(i => {
    i.label = i.name;
    return i;
  });
};

export const appendAll = (items: any[]): any[] => {
  if (items.length === 0) {
    return [];
  }
  items.unshift({id: '', code: '', name: '不限', label: '不限'});
  return items;
};

/**
 * 去掉 value 为 null 、''、undefined 的key
 * @param data
 * @returns data
 */
export const keepValue = (data: any): any => {
  Object.keys(data).forEach(key =>
    (data[key] === null || data[key] === '' || data[key] === undefined) && delete data[key]);
  return data;
};
