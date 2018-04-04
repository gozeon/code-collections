export enum Resources {
  PREVIEW = 'PREVIEW',
  COURSE_WARE_FOR_CLASS = 'COURSEWARE_FOR_CLASS',
  COURSE_WARE_FOR_PREPARATION = 'COURSEWARE_FOR_PREPARATION',
  PICTURE_BOOK = 'PICTURE_BOOK',
  EXERCISES = 'EXERCISES'
}

export interface RESOURCE {
  lessonAttr?: Resources;
  resourceUrl?: string;
  resourceName?: string;
  resourceRelationId?: string;
  resourceState?: 1 | 2 | 3;
}

export function getResource(type: Resources, target: any[]): RESOURCE {
  if (target.filter(item => item.lessonAttr === type).length === 1) {
    return target.filter(item => item.lessonAttr === type)[0];
  }
  return {};
}

export function createResource(type: Resources, data: any): RESOURCE {
  if (type === Resources.COURSE_WARE_FOR_CLASS || type === Resources.COURSE_WARE_FOR_PREPARATION) {
    return {
      lessonAttr: type,
      resourceUrl: data.url || null,
      resourceName: data.name || null,
      resourceRelationId: data.id || null,
      resourceState: data.url ? 1 : 3
    };
  }
  return {
    lessonAttr: type,
    resourceUrl: data.url || null,
    resourceName: data.name || null,
    resourceRelationId: data.id || null,
    resourceState: getState(data.state, data.name)
  };
}

function getState(state, url): 1 | 2 | 3 {
  if (state && url) {
    return 1;
  }

  if (state && !url) {
    return 2;
  }

  if (!state && !url) {
    return 3;
  }
}

export function formatState(state): boolean {
  if (state) {
    if (+state === 1 || +state === 2) {
      return true;
    }
  }

  return false;
}

export function checkFileSize(fileSize: number, scale: number): boolean {
  const size = +((fileSize / 1024) / 1024).toFixed(4); // MB
  return size > scale;
}

export function checkFileType(filename: string, target: string[]): boolean {
  if (target.length < 0) {
    return true;
  }
  for (let i = 0; i < target.length; i++) {
    const end = filename.slice(-target[i].length);
    if (end === target[i]) {
      return true;
    } else {
      continue;
    }
  }
  return false;
}
