import store from "@/store";
import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 聚合支付预付款 /v1/payments/{orderNo}/prePay
 * data:
 */
export const PRE_PAY = (data) => {
  return request({
    url: `cpp-customer-payment/v1/payments/${data.orderNo}/prePay`,
    method: "POST",
    data,
  });
};
/**
 * 聚合支付付款 /v1/payments/{payOrderNo}/pay
 */
export const PAY = (data) => {
  return request({
    url: `cpp-customer-payment/v1/payments/${data.payOrderNo}/pay`,
    method: "POST",
    data,
  });
};
/**
 * 订单相关
 * 注意支付相关接口页码字段为page
 */
/**
 * 获取订单列表
 * @param {*} params
 * @returns
 */
export const GET_ORDER_LIST = (data) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:list`,
    method: "GET",
    data,
    loading: false,
  });
};
/**
 * 查询订单详情
 */

export const GET_ORDER_DETAIL = (orderNo) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:detail/${orderNo}`,
    method: "GET",
    loading: false,
  });
};
/**
 * 提交订单
 * @param {*} orderNo
 * @returns
 */
export const SUBMIT_ORDER = (data) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:submit`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["fromChannel"]: "MP",
    },
  });
};
/**
 * 订单确认页面
 */
export const CONFIRM_ORDER = (data) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:confirm`,
    method: "POST",
    data,
  });
};
/**
 * 修改订单地址 /cpp-customer-order/v1/ec/order:edit-address
 */
export const EDIT_ADDRESS = (data) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:edit-address`,
    method: "PUT",
    data,
  });
};
/**
 * 确认收货
 */
export const CONFIRM_RECEIPT = (orderNo) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:confirm-receipt/${orderNo}`,
    method: "PUT",
  });
};
/**
 * 订单取消理由
 */
export const GET_CANCEL_REASON = () => {
  return request({
    url: `cpp-customer-order/v1/ec/order:cancelReason`,
    method: "GET",
  });
};
/**
 * 查询订单物流信息
 */
export const GET_DELIVERY_INFO = (trackingNo) => {
  return request({
    url: `cpp-business-order/v1/ec/logistics/${trackingNo}`,
    method: "GET",
  });
};
/**
 * 删除订单
 */
export const DELETE_ORDER = (orderNo) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:delete/${orderNo}`,
    method: "PUT",
  });
};
/**
 * 根据订单编号查询问诊单信息
 */
export const QUERY_SHEET_BY_ORDERNO = (orderNo) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/${orderNo}/consultationSheetInfoByOrderNo`,
    method: "GET",
  });
};

/**
 * 申请退款
 */
export const APPLY_AFTERSALE = (data) => {
  return request({
    url: `cpp-customer-order/v1/ec/after/sale/apply`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["fromChannel"]: "MP",
    },
  });
};
/**
 * 查询售后单详情 /v1/ec/order/after/sale/{afterSaleNo}
 */
export const DETAIL_AFTERSALE = (afterSaleNo) => {
  return request({
    url: `cpp-customer-order/v1/ec/order/after/sale/${afterSaleNo}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["fromChannel"]: "MP",
    },
    loading: false,
  });
};
/**
 * 删除售后单
 */
export const DELETE_AFTERSALE = (afterSaleNo) => {
  return request({
    url: `cpp-customer-order/v1/ec/order/after/sale/${afterSaleNo}`,
    method: "PUT",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["fromChannel"]: "MP",
    },
  });
};
/**
 * 取消订单
 */
export const CANCEL_ORDER = (orderNo) => {
  return request({
    url: `cpp-customer-order/v1/ec/order:cancel/${orderNo}`,
    method: "PUT",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 查询我的页面订单数量
 */
export const QUERY_ORDERNUM = () => {
  return request({
    url: `cpp-customer-order/v1/ec/order:count`,
    method: "GET",
    loading: false,
  });
};
/**
 * 支付流程
 */
export const OrderPay = (data) => {
  const appId = uni.getAccountInfoSync();
  return request({
    url: `cpp-customer-payment/v1/mp-payments/pay`,
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      ["AppId"]: appId.miniProgram.appId,
    },
  });
};
