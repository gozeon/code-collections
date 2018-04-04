// export interface Order {
//     page: number;
//     size: number;
//     orderCode?: string;
//     payStatus?: number;
//     orderStatus?: number;
//     checkStatus?: number;
//     channelCodeOne?: number;
//     channelCodeTwo?: number;
//     userCode?: string;
//     parentNum?: string;
//     payWay?: number;
//     stuNum?: string;
//     postalStatus?: number;
//     createId?: number;
//     recommendType?: number;
//     recommendCode?: string;
//   }
// 支付状态
export const MpayStatus: any[] = [
  { name: '不限', value: '' },
  { name: '待支付', value: 0 },
  { name: '已支付', value: 1 },
  { name: '支付失败', value: 2 },
  { name: '已退单', value: 3 },
  { name: '已取消', value: 4 },
  { name: '部分退', value: 5 },
  { name: '待转账', value: 6 },
  { name: '手动退款', value: 7 },
];
// 审核状态
export const McheckStatus: any[] = [
  { name: '不限', value: '' },
  { name: '待审核', value: 0 },
  { name: '审核通过', value: 1 },
  { name: '驳回', value: 2 },
  { name: '审核取消', value: 3 },
  // { name: '无需审核', value: 4 },
];
// 手动优惠
export const McouponCode: any[] = [
  { name: '不限', value: '' },
  { name: '使用', value: 1 },
  { name: '未使用', value: 0 },
];
// 成单渠道
export const MChannel: any[] = [
  { name: '不限', value: '' },
  { name: '分销', value: 10 },
  { name: 'CRM内部', value: 11 },
  { name: '官网', value: 12 },
  { name: '续报', value: 13 },
];
// 物流状态
export const MSendStatus: any[] = [
  { name: '不限', value: '' },
  { name: '未发货', value: 0 },
  { name: '已发货', value: 1 },
  { name: '现场发货', value: 2 },
];
// 父母关系
export const MparentType: any[] = [
  { value: 1, name: '父亲' },
  { value: 2, name: '母亲' }
];
// 性别
export const Msex: any[] = [
  { value: 1, name: '男' },
  { value: 2, name: '女' }
];
// 试听
export const MlisteningStatus: any[] = [
  { value: 1, name: '新分配' },
  { value: 2, name: '强意愿' },
  { value: 3, name: '无意愿' },
  { value: 4, name: '已购买' },
];
export const Mlistening: any[] = [
  { name: '不限', value: '' },
  { value: 1, name: '新分配' },
  { value: 2, name: '强意愿' },
  { value: 3, name: '无意愿' },
  { value: 4, name: '已购买' },
];
// 主课
export const MmainStatus: any[] = [
  { value: 1, name: '新分配' },
  { value: 2, name: '强意愿' },
  { value: 3, name: '无意愿' },
  { value: 4, name: '已购买' },
];
export const Mmain: any[] = [
  { name: '不限', value: '' },
  { value: 1, name: '新分配' },
  { value: 2, name: '强意愿' },
  { value: 3, name: '无意愿' },
  { value: 4, name: '已购买' },
];
// 是否是新东方学员
export const MxdfStatus: any[] = [
  { value: 1, name: '是' },
  { value: 0, name: '否' },
];
export const Mxdf: any[] = [
  { name: '不限', value: '' },
  { value: 1, name: '是' },
  { value: 0, name: '否' },
];
// 种子用户
export const MseedStatus: any[] = [
  { value: 0, name: '不是' },
  { value: 1, name: '1类种子用户' },
];
export const Mseed: any[] = [
  { name: '不限', value: '' },
  { value: 0, name: '不是' },
  { value: 1, name: '1类种子用户' },
];
// 是否登录
export const MisLogin: any[] = [
  { value: 1, name: '已登录' },
  { value: 0, name: '未登录' },
];
// 孩子年龄
export const Mages: any[] = [
  { value: 0, name: '四岁以下' },
  { value: 4, name: '四岁' },
  { value: 5, name: '五岁' },
  { value: 6, name: '六岁' },
  { value: 7, name: '七岁' },
  { value: 8, name: '八岁' },
  { value: 9, name: '九岁' },
  { value: 10, name: '十岁' },
  { value: 11, name: '十一岁' },
  { value: 12, name: '十二岁' },
  { value: 100, name: '十二岁以上' },
];
