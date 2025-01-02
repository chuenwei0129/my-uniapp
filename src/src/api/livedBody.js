import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 获取活体一二级类目
 */
export const GET_TAB_LIST = () => {
  return request({
    url: "presentation/customer/live/channel/v1/live-classify-detail",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    cqm: true,
  });
};

/**
 * 获取活体频道图片
 */
export const GET_LIVE_BODY_IMG = () => {
  return request({
    url: "presentation/customer/live/channel/v1/live-channel-images",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    cqm: true,
  });
};

/**
 * 活体商品搜索
 */
export const GET_GOODS_LIST = (data) => {
  return request({
    url: "presentation/customer/live/channel/v1/search-v2",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data,
    cqm: true,
  });
};
/**
 * 活体商品搜索v3
 */
export const GET_GOODS_LIST_v3 = (data) => {
  return request({
    url: "presentation/customer/live/channel/v1/search-v3",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data,
    cqm: true,
  });
};
/**
 * 活体预约查询
 */
export const GET_APPOINTMENT_STATUS = () => {
  return request({
    url: "presentation/customer/applet/reservation/getWatchPetReservation",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    cqm: true,
  });
};

/**
 * 获取附近门店信息
 */
export const GOTO_CHECK_SHOP = (data) => {
  return request({
    url: "presentation/customer/live/channel/v1/goto-shop",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    cqm: true,
  });
};

/**
 * 获取收藏萌宠列表
 */
export const GET_LIVED_BODY_LIST = (data) => {
  return request({
    url: "presentation/customer/collect/v1/livebody/page",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data,
    cqm: true,
  });
};


/**
 * 获取收藏萌宠列表
 */
export const GET_TITLE = (data) => {
  return request({
    url: "presentation/customer/app/v1/officialGuarantee",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data,
    cqm: true,
  });
};