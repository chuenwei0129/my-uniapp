import { Http } from "@/utils/http";
const { request } = new Http();

export const APP_ID = "1729776648698531840";
export const PLATFORM_ID = "1699310123233079297";

/**
 获取优惠券列表
 **/

export const GET_COUPON_LIST = (data = {}) => {
  return request({
    url: "presentation/customer/app/coupon/v1/available/unavailable/max/Discount/list",
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 发送喂食订单
 **/

export const SEND_FEED_ORDER = (data = {}) => {
  return request({
    url: "presentation/customer/app/v1/place/feeder/code",
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
    neglect: true,
  });
};

// 创建订单

/**
 * 创建 商品/服务 订单
 * @param {{}} data
 * @returns
 */
export const CREATE_ORDER = (data) => {
  return request({
    url: "presentation/customer/applet/feeder/feed",
    method: "POST",
    data: {
      appId: APP_ID,
      sourceOrderType: "5",
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    errShow: false,
    loading: false,
    useSelfLoading: true,
  });
};