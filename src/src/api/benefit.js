import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 获取所有等级相关的权益列表
 */
export const QUERY_BENEFIT_LIST = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v1/level`,
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
 * 根据权益id 查询
 */
export const QUERY_BENEFIT_DETAIL = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v1/detail`,
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
 *
 * 成长值明细
 */

export const QUERY_GROWTH_DETAIL = (data) => {
  return request({
    url: `/presentation/customer/app/member/level/v1/growth/detail`,
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

//获取宠物养育方式
export const GET_LIFE_BY_USER_ID = (data) => {
  return request({
    url: `presentation/customer/online-offline/v1/get/live/by/user/id`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
}

//引导建档弹窗调用的获取宠物信息接口
export const GET_HIGH_VALU_ORDERS = (data) => {
  return request({
    url: `presentation/customer/online-offline/v2/get/live/by/user/id`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
}