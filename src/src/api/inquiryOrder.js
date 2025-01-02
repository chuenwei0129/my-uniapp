import { Http } from "@/utils/http";
const { request } = new Http();

/**
 问诊订单详情
 **/

export const inquiryOrderDetail = (data = {}, version = "v1") => {
  return request({
    url: `pet-medical-inquiry/${version}/consultation/sheet/info`,
    method: "GET",
    data,
    loading: false,
  });
};

/**
 取消问诊订单
 **/

export const inquiryOrderCancle = (data = {}) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/cancelOrder`,
    method: "POST",
    data,
    loading: true,
  });
};

/**
 支付分派医生
 **/

export const paymentAssignDoctor = (data = {}) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/paymentAssignDoctor`,
    method: "POST",
    data,
    loading: false,
  });
};
