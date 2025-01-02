import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 查询会员等级
 */
export const QUERY_LEVEL = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v2/member`,
    cqm: true,
    method: "POST",
    data,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 查询 30 天内过期成长值
 */
export const GETEXPIRED_GROWTH = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v1/member/getExpiredGrowth`,
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
 * 开启成长之旅
 */
export const OPEN_LEVEL = (data) => {
  return request({
    url: `presentation/customer/app/member/personal/v1/openLevel`,
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
 * 查询会员等级配置
 */
export const QUERY_MEMBER_CONFIG = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v1/config`,
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
 * 查询会员等级下配置权益信息
 */
export const QUERY_BENEFIT_CONFIG = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v1/config/benefit`,
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
 * 查询会员等级权益下明细数据
 */
export const QUERY_BENEFIT_DETAIL = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v1/benefit/detail`,
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
 * 领取优惠券权益
 */
export const RECEIVE_COUPON = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v1/receive`,
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
 * 查询消费仅退款权益信息
 */
export const REFUND_BENEFIT = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v1/queryVerifyRefundBenefit`,
    cqm: true,
    method: "POST",
    data,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
