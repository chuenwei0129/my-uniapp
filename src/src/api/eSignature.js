import { Http } from "@/utils/http";
const { request } = new Http();

export const APP_ID = "1729776648698531840";
export const PLATFORM_ID = "1699310123233079297";
/**
 查询当前订单签署状态
 **/

export const getSignStatusByLiveInfoId = (data = {}) => {
  return request({
    url: "presentation/customer/app/esign/v1/getSignStatusRefLiveInfo",
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
/**
 e签宝
 **/

export const detailByTrackingNo = (data = {}) => {
  return request({
    url: "presentation/customer/app/esign/v1/getESignFile",
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
/**
 e签宝
 **/

export const getESignH5Link = (data = {}) => {
  return request({
    url: "presentation/customer/app/esign/v1/getESignH5Link",
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
/**
 是否签署成功的回调
 **/

export const fileGetSignStatus = (data = {}) => {
  return request({
    url: "presentation/customer/app/esign/v1/getSignStatusRefId",
    // url: "https://mock.apifox.com/m1/2881707-0-default/couponCenter",
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    // gw: false,
    cqm: true,
    // loading: false,
    // useSelfLoading: true,
  });
};