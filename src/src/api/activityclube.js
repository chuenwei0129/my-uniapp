import { Http } from "../utils/http";
const { request } = new Http();

const { token } = uni.getStorageSync("storage_info") || {};
/**
 * 活动详情页
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/23906
 */
export const COMMUNITY_ACTIVITY_DETAIL = (data) => {
  return request({
    url: `cpp-community-activity/v1/activities/${data.id}`,
    method: "GET",
    loading: false,
  });
};

/**
 * @title 活动详情 点击收藏
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/24044
 * @title 取消活动收藏
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/24050
 */
export const ACTIVITY_WANT = (data, med = "PUT") => {
  return request({
    url: `cpp-community-activity/v1/activities/${data.id}/want`,
    method: med,
    loading: false,
  });
};

/**
 * @title 参与人员列表(参与者身份)
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/23966
 */
export const ACTIVITY_USER_LIST = (id) => {
  return request({
    url: `cpp-community-activity/v2/activities/${id}/user-list`,
    method: "GET",
    param: {
      pageSize: 20,
      pageNo: 1,
    },
  });
};

/**
 * @title 创建者查看活动详情页的 成员列表 (没用到)
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/35450
 */
export const ACTIVITY_USER_LIST_CREATOR = (data) => {
  return request({
    url: `cpp-community-activity/v2/activities/user-list`,
    method: "POST",
    data,
  });
};
/**
 * @title 关键字搜索
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/27650
 */
export const ACTIVITY_SEARCH_LIST = (data) => {
  const Tokens = uni.getStorageSync("storage_info") || {};
  let url = Tokens.token
    ? "cpp-community-activity/v1/activities:bi-search"
    : "cpp-community-activity/v3/activities:bi-search";
  return request({
    url,
    method: "POST",
    data,
  });
};

/*
 * @title 首页查询活动列表 （已结束 报名中）
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/32550
 *
 */
export const ACTIVITY_HOME_LIST = (data) => {
  const Tokens = uni.getStorageSync("storage_info") || {};
  let url = Tokens.token
    ? "cpp-community-activity/v2/activities/home-list"
    : "cpp-community-activity/v3/activities/home-list";
  let cityCode = uni.getStorageSync("storage_location_city_code") || "";
  if (data.citySearchType === "NATIONAL") {
    data.cityCode = cityCode;
  }
  return request({
    url,
    method: "POST",
    data,
    gw: Tokens.token ? true : false,
  });
};

/**
 * @title 活动推荐筛选列表数据
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/23882
 */
export const COMMUNITY_ACTIVITY_TAG = () => {
  return request({
    url: `cpp-community-activity/v1/activities/tag`,
    method: "GET",
  });
};

/**
 * @title 城市数据 查询所有地址列表
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/392/interface/api/13346
 */
export const getCityData = () => {
  return request({
    url: "h5-marketing-management/v1/addresses",
    method: "GET",
    header: {},
    gw: false,
  });
};

/**
 * @title 活动收藏列表
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/24188
 */
export const ACTIVITY_WANT_LSIT = (data) => {
  return request({
    url: `cpp-community-activity/v2/activities/${data.id}/want-list`,
    method: "GET",
    data,
  });
};

/**
 * @title 取消报名
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/23894
 */
export const ACTIVITY_CANCEL = (activityId) => {
  return request({
    url: `cpp-community-activity/v1/activities/${activityId}/cancel`,
    method: "POST",
    data: { code: 201 },
    neglect: false,
  });
};

/**
 * @title 活动举报
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/23888
 */
export const ACTIVITY_REPORT = (data) => {
  return request({
    url: `cpp-community-activity/v1/activities/tip-off`,
    method: "POST",
    data,
  });
};

/**
 * @title 活动报名
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/35426
 */
export function sendSignUpV2(data) {
  return request({
    url: "cpp-community-activity/v2/activities/sign-up",
    method: "POST",
    data: data,
    header: {
      fromChannel: "MP",
    },
  });
}

/**
 * @title 活动二次确认报名
 * @yapi https://cn-test01-api.henhenchina.com/cpp-community-activity/doc.html#/default/%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83-%E6%B4%BB%E5%8A%A8%E7%AE%A1%E7%90%86/againConfirmUsingPOST
 */
export function againConfirm(data) {
  return request({
    url: `cpp-community-activity/v1/activities/${data.activityId}/again:confirm`,
    method: "POST",
    data: data,
  });
}

/**
 * @ 查询活动排队人数
 * https://cn-dev02-api.henhenchina.com/cpp-community-activity/doc.html#/default/%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83-%E6%B4%BB%E5%8A%A8%E7%AE%A1%E7%90%86V2/playerQueueUsingPOST
 */
export const getOrderQueue = (data) => {
  return request({
    url: `cpp-community-activity/v2/activities/player-queue/${data.activityId}`,
    method: "POST",
    data,
  });
};

/**
 * @title 查询活动是否存在待支付订单
 * https://cn-dev02-api.henhenchina.com/cpp-community-activity/doc.html#/default/%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83-%E6%B4%BB%E5%8A%A8%E7%AE%A1%E7%90%86V2/activityOrderListUsingPOST
 */
export function getWhereOrder(data) {
  return request({
    url: `cpp-community-activity/v2/activities/order-list`,
    method: "POST",
    data,
  });
}

/**
 * @title 付费活动中参与者信息提交
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/35482
 */
export function submitFormData(data) {
  return request({
    url: `cpp-community-activity/v2/activities/formExtend`,
    method: "POST",
    data,
  });
}

/**
 * @title 获取弹窗展示位
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/561/interface/api/18314
 */
 export function getPopInfo(data) {
  let key = data?.key || "POPUP_FRIENDS_CLUB_HOME"
  let cityCode = uni.getStorageSync("storage_location_city_code") || "";
  // if (data.citySearchType === "NATIONAL") {
    data.cityCode = cityCode;
  // }
  return request({
    url: `reach-touch/reach/touch/exhibition/popups/${key}`,
    method: "GET",
    data,
  });
 }

 /**
 * @title 分页查询活跃主题列表
 * @yapi 
 */
  export function getPageActiveSubjectList(data) {
    return request({
      url: `cpp-community-activity/v1/subject/pageActiveSubjectList`,
      method: "POST",
      data,
    });
  }
  
   /**
 * @title 活动列表接口（新接口）
 * @yapi 
 */
    export function getActivityList(data) {
      return request({
        url: `cpp-community-activity/v4/activities/home-list`,
        method: "POST",
        data,
      });
    }
    


/**
 * @title 获取banner展示位
 * @yapi hhttp://cn-dev01-yapi.henhenchina.com/project/561/interface/api/38506
 */
 export function getBanner(data) {
  let key = data?.key || "CAROUSEL_INTEREST_APPLE"
  let cityCode = uni.getStorageSync("storage_location_city_code") || "";
  // if (data.citySearchType === "NATIONAL") {
    data.cityCode = cityCode;
  // }
  return request({
    url: `reach-touch/reach/touch/exhibition/carousel/${key}`,
    method: "GET",
    data,
    header: {
      "appversion": "2.0.0",
    },
  });
}

/**
 * @title 活动票种列表
 * @yapi https://cn-dev02-api.henhenchina.com/cpp-community-activity/doc.html#/default/%E6%B4%BB%E5%8A%A8%E4%B8%AD%E5%BF%83-%E6%B4%BB%E5%8A%A8%E7%AE%A1%E7%90%86/getActivityTicketUsingGET
 */
 export function getActivityTicket(data) {
  let activityId = data?.activityId 
  return request({
    url: `cpp-community-activity/v1/${activityId}/ticket`,
    method: "GET",
    data,
  });
}

/**
 * @title 根据活动id 和活动类型查询正向活动订单详情
 * @yapi https://cn-dev02-api.henhenchina.com/cpp-customer-order/doc.html#/default/%E6%B4%BB%E5%8A%A8%E8%AE%A2%E5%8D%95/atyOrderUsingGET
 */
 export function getActivityAtyOrder(data) {
  return request({
    url: `cpp-customer-order/v1/activity/atyOrder`,
    method: "GET",
    data,
  });
}