import { Http } from "@/utils/http";
const { request } = new Http();

export const APP_ID = "1729776648698531840";
export const PLATFORM_ID = "1699310123233079297";

/**
 领券中心
 **/

export const getCouponCenterList = (data = {}) => {
  return request({
    url: "presentation/customer/app/coupon/center/v1/list",
    // url: "https://mock.apifox.com/m1/2881707-0-default/couponCenter",
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

// 领取优惠券
export const receiveCoupon = (data) => {
  return request({
    url: "presentation/customer/app/coupon/v1/receive",
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};
