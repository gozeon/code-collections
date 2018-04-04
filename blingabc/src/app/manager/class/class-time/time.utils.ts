/**
 *  将时间转换为显示格式
 * @param t 1_8:30
 * @return 周一-8:30
 */
export const formatTimeToZh = (t: string): string => {
  if (t) {
    switch (t.split('_')[0]) {
      case '1':
        return `周一-${t.split('_')[1]}`;
      case '2':
        return `周二-${t.split('_')[1]}`;
      case '3':
        return `周三-${t.split('_')[1]}`;
      case '4':
        return `周四-${t.split('_')[1]}`;
      case '5':
        return `周五-${t.split('_')[1]}`;
      case '6':
        return `周六-${t.split('_')[1]}`;
      default:
        return `周日-${t.split('_')[1]}`;
    }
  } else {
    return t;
  }
}

/**
 *  将时间转换为接口需要格式
 * @param t  周一-8:30
 * @return 1_8:30
 */
export const formatTimeToNumber = (t: string): string => {
  if (t) {
    switch (t.split('-')[0]) {
      case '周一':
        return `1_${t.split('-')[1]}`;
      case '周二':
        return `2_${t.split('-')[1]}`;
      case '周三':
        return `3_${t.split('-')[1]}`;
      case '周四':
        return `4_${t.split('-')[1]}`;
      case '周五':
        return `5_${t.split('-')[1]}`;
      case '周六':
        return `6_${t.split('-')[1]}`;
      default:
        return `7_${t.split('-')[1]}`;
    }
  } else {
    return t;
  }
}

/**
 * 转换API给的字符串为中文形式
 * @param t "2_10:10,3_13:00"
 * @return "周二-10:10,周三-13:00"
 */
export const formatTimeArrToZh = (t: string): string => t.split(',').map(i => formatTimeToZh(i)).join(', ');
