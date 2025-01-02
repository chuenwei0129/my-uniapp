import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 个人主页会员等级升降弹窗
 * @param {*} data
 * @returns
 */
export const UP_DOWN_POP = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v2/upDownPop`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};

/**
 * 我的页面【查询会员等级】
 * @param {*} data
 * @returns
 */
export const GET_MY_MEMBER_GRADE = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v2/member`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 会员权益主页-查询会员等级配置
 * @param {*} data
 * @returns
 */
export const GET_MEMBER_LV_CONFIG = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v2/config`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 会员权益主页-等级下权益信息
 * @param {*} data
 * @returns
 */
export const GRADE_BENEFIT_INFO = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v2/config/benefit`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 会员权益详细页-查询所有等级下配置的权益信息v3
 * @param {*} data
 * @returns
 */
export const ALLGRADE_BENEFIT_INFO_v3 = (data) => {
  return request({
    url: `presentation/customer/app/member/level/v3/config/benefit`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 会员权益详细页-查询所有等级下配置的权益信息
 * @param {*} data
 * @returns
 */
export const ALLGRADE_BENEFIT_INFO = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v2/level`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};

/**
 * 会员权益详情-查询详情信息
 * @param {*} data
 * @returns
 */
export const GRADE_BENEFIT_DETAIL = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v2/detail`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};

/**
 * 会员权益详情-领取生日权益校验
 * @param {*} data
 * @returns
 */
export const EQUITY_CHECK = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v2/receiveBirthdayCheck`,
    method: "POST",
    data,
    cqm: true,
    useSelfToast: true,
    useSelfLoading: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 会员权益详情-会员等级礼校验
 * @param {*} data
 * @returns
 */
export const LevelGift_CHECK = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v2/receiveMemberLevelGiftCheck`,
    method: "POST",
    data,
    cqm: true,
    useSelfToast: true,
    useSelfLoading: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 会员权益-权益规则链接
 * @param {*} data
 * @returns
 */
export const GTE_RULES = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v1/queryEquityRulesLink`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 用户任务列表--会员中心
 * @param {*} data
 * @returns
 */
export const QUERY_TASKS = (data) => {
  return request({
    url: `presentation/customer/member/level/task/v1/queryTasks`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};

/**
 * 会员权益详情-领取权益
 * @param {*} data
 * @returns
 */
export const RECEIVE_BENEFIT = (data) => {
  return request({
    url: `presentation/customer/app/member/benefit/v2/receive`,
    method: "POST",
    data,
    cqm: true,
    useSelfToast: true,
    useSelfLoading: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};

/**
 * 会员专属兑换-卡片展示
 * @param {*} data
 * @returns
 */
export const ONLY_REDEMPTION_ITEM = (data) => {
  return request({
    url: `/presentation/customer/app/member/benefit/v1/queryMemberOnlyRedemptionItems`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};

/**
 * 会员周边商品
 * @param {*} data
 * @returns
 */
export const ONLY_REDEMPTION_ITEM_v3 = (data) => {
  return request({
    url: `cpp-user-score-management/v1/user-score-goods/page`,
    method: "GET",
    data,
  });
};

/**
 * 胖豆数量
 * @param {*} data
 * @returns
 */
export const PD_COUNT = (data) => {
  return request({
    url: `cpp-user-score-management/v1/user-score/total-scores`,
    method: "GET",
    data,
  });
};
/**
 * 查询胖豆任务
 */
export const GET_USERSCORE_TASKBYCODE = (data) => {
  return request({
    url: `cpp-user-score-management/v2/user-score/taskByCode`,
    data,
    method: "POST",
  });
};

// 增加会员升级描述/crm-bff-app/presentation/customer/app/member/level/v2/upgradeDesc
export const GET_UPGRADE_DESC = (data = {}) => {
  return request({
    url: "presentation/customer/app/member/level/v2/upgradeDesc",
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 小程序引导下载页短信提醒
 */
export const TO_NOTE_TIP = (data) => {
  return request({
    url: `/presentation/customer/app/msg/v1/sendDownloadAppMsg`,
    method: "POST",
    data,
    cqm: true,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
