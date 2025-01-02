import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 根据邀请人获取邀请列表
 */
export const GET_BE_SHARED = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `cpp-user-management/v1/invite/query-by-inviter`,
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
 * 邀请列表分页 /cpp-user-management/v1/invite/query-by-inviter-page
 */
export const GET_BE_SHARED_PAGE = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `cpp-user-management/v1/invite/query-by-inviter-page`,
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
 * 五月拉新活动
 */
/**
 * 领取奖品
 */
export const GAIN_PRIZE = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/activity/prizeReceive",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    loading: false,
  });
};
/**
 * 用户信息查询
 */
export const GET_USERINFO_MAY = (params) => {
  return request({
    url: `pet-medical-inquiry/v1/activity/${params.activityCode}/userInfo`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    loading: false,
  });
};

/**
 * 生成试卷
 */
export const GET_MBTI_CREATE_CATEGORY = (params) => {
  return request({
    url: `pet-growth-diary/v1/exam-paper/create/${params.category}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    loading: false,
  });
};

/**
 * 提交试卷
 */
export const MBTI_SUBMIT_CATEGORY = (data) => {
  return request({
    data,
    url: "pet-growth-diary/v1/exam-paper/submit",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};

/**
 * 获取活动 h5  配置
 * @param {*} data
 * @returns
 */
export const getActivitySeting = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/activity/configDetail`,
    header: {},
    method: "POST",
    data,
    loading: false,
  });
};
/**
 * 支付成功查询胖豆可兑换商品
 * @param {*} data
 * @returns
 */
export const getUserScoreGoods = (data) => {
  return request({
    url: `cpp-user-score-management/v1/user-score-goods/page`,
    // header: {},
    method: "GET",
    data,
    loading: false,
  });
};
/**
 * 支付成功查询胖豆可兑换商品
 * @param {*} data
 * @returns
 */
export const thirdPartyLogin = (data) => {
  return request({
    url: `cpp-user-management/v1/thirdParty/login`,
    method: "POST",
    data,
    loading: false,
  });
};