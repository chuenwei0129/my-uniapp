import { Http } from "@/utils/http";
const { request } = new Http();

/**
 * 查询当前医生的服务中问诊单数量
 */
export const GET_IN_SERVICE = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `pet-medical-inquiry/v1/consultation/sheet/check:service`,
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
 * 查询医生服务中的问诊单，ai需求对接,获取详情
 * @param {*} data
 * @returns
 */
export const GET_IN_SERVICE_FOR_AI = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `pet-medical-inquiry/v1/consultation/user/serviceSheet`,
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
 * 查询最新一条问诊单信息
 */
export const GET_IN_SERVICE_LAST = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `pet-medical-inquiry/v1/consultation/user/sheet:last`,
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
 * 用户主动结束问诊单
 */

export const END_SHEET = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `pet-medical-inquiry/v1/consultation/sheet/end/${data.groupId}`,
    method: "PUT",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 用户主动停止匹配
 */
export const CANCEL_MATCH = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `pet-medical-inquiry/v1/consultation/sheet/cancel/${data.groupId}`,
    method: "PUT",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 问诊单评价
 */
export const RATE_SHEET = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `pet-medical-inquiry/v1/consultation/sheet/comment`,
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
 * 获取评价列表
 */
export const GET_RATE_TAG = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `cpp-instrument/customer/v1/tag`,
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
 * 查询ai会话相关详情
 */
export const GET_AICHAT_DETAIL = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `cpp-im-management/v1/im/group/enterprise-micro-chat`,
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
 * 初始化置顶消息发送
 */
export const QUERY_AICHAT_TOP = (data) => {
  return request({
    url: `cpp-im-management/v1/im/messages/group/send:micro:chat:custom`,
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
 * 点赞/点踩qa信息
 */
export const AI_PRAISE = (data) => {
  return request({
    url: `cpp-chatter/v1/ai/chat/mark`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
