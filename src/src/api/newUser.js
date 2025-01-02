import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 获取首页相关信息
 */
export const QUERY_HOME_INFO = (data) => {
  return request({
    url: `presentation/customer/marketing/activity/v1/newPersonContent`,
    cqm: true,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 订单校验
 */
export const CHECK_NEWUSER = () => {
  return request({
    url: `presentation/customer/marketing/activity/v1/checkNewPersonOrder`,
    cqm: true,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 查看优惠券可用商品
 */
export const QUERY_ADJUST_GOOD = (data) => {
  return request({
    url: `presentation/customer/app/coupon/v1/good/page`,
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
