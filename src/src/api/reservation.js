import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 查询城市列表
 */
export const GET_SHOP_CITY_LIST = (data) => {
  return request({
    url: `presentation/customer/applet/shop/city/list`,
    method: "GET",
    data,
    cqm: true,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 查询城市列表
 */
export const GET_NEARBY_SHOP_LIST = (data) => {
  return request({
    url: `presentation/customer/applet/shop/v2/nearby/shop/list`,
    cqm: true,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 门店详情
 */
export const GET_SHOP_DETAIL = (data) => {
  return request({
    url: `presentation/customer/applet/shop/detail`,
    method: "POST",
    data,
    cqm: true,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 测试预约
 */
export const GET_test = (data) => {
  return request({
    url: `presentation/customer/applet/reservation`,
    method: "POST",
    data,
    cqm: true,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 查看预约详情
 */
export const GET_RESERVATION_DETAIL = (data) => {
  return request({
    url: `presentation/customer/applet/reservation/detail`,
    method: "POST",
    cqm: true,
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 取消预约
 */
export const GET_RESERVATION_CANCEL = (data) => {
  return request({
    url: `/presentation/customer/applet/reservation/cancel`,
    method: "POST",
    cqm: true,
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 我的预约列表
 */
export const myorderlist = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/reservation/list",
    method: "POST",
    header: {},
  });
};
/**
 * 获取门店详情
 */
export const shopDetail = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/shop/detail",
    method: "POST",
    header: {},
  });
};
export const getMyPet = (userId) => {
  return request({
    url: `cpp-user-management/v2/user-pet/agg/list/${userId}`,
    method: "GET",
    header: {},
  });
};

/**
 * 查询最近门店信息
 */
export const getLatestShop = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/shop/v2/nearby/shop/info",
    method: "POST",
    header: {},
  });
};
/**
 * 获取具体门店商品列表
 */
export const getGoodsList = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/commodity/list",
    method: "POST",
    header: {},
  });
};
/**
 * 获取相关宠物具体门店商品列表
 */
export const getSkuList = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/reservation/order/projects",
    method: "POST",
    header: {},
  });
};
/**
 * 提交预约页信息查询
 */
export const getReservationInfo = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/reservation/init",
    method: "POST",
    header: {},
  });
};
/**
 * 提交预约
 */
export const submit = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/reservation",
    method: "POST",
    header: {},
  });
};
/**
 * 创建petid
 */
export const createPetId = (data) => {
  return request({
    data,
    url: "cpp-user-management/v2/user-pet/checkMemberPetInfo",
    method: "GET",
    header: {},
  });
};
/**
 * 判断订单是否可以跳转预约美洗页面
 */
export const orderCanJumpReservation = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/orderCanJumpReservation",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};
/**
 * 美洗订单时间选择范围
 */
export const serviceProvider = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/list/service-provider",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};
/**
 *
 * 美洗订单时间选择范围（接口一）
 *
 */
export const newServiceProviderDateApi = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/list/workDate",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};
/**
 *
 * 美洗订单时间选择范围（接口二）
 *
 */
export const newServiceProviderDateInfoApi = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/list/workTime",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};
/**
 * 美洗人员介绍
 */
export const beautyCarerDetail = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/order/beautyCarerDetail/byUser",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};

/**
 * 就诊详情
 */
export const medicalReportDetail = (data) => {
  return request({
    data,
    url: "presentation/customer/content/therapy/v1/queryDiagDetail",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};

/**
 * 美洗预约记录列表
 * @param {*} data
 * @returns
 */
export const getBeautyList = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/list",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};
/**
 * 签到
 * @param {*} data
 * @returns
 */
export const postSignIn = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/signIn",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};
/**
 * 获取风险责任书
 * @param {*} data
 * @returns
 */
export const postSignInBook = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/view/risk/reminder",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};

/**
 * 阅读风险责任书
 * @param {} data
 * @returns
 */
export const readedSignInBook = (data) => {
  return request({
    data,
    url: "presentation/customer/applet/reservation/confirm/view/risk/reminder",
    method: "POST",
    header: {},
    gw: false,
    cqm: true,
  });
};

/**
 * 我的预约列表
 */
export const getRemindList = (data) => {
  return request({
    data,
    cqm: true,
    url: "presentation/customer/applet/reservation/remind/list",
    method: "POST",
    header: {},
  });
};
