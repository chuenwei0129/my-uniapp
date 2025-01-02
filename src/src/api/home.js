import { Http } from "@/utils/http";
const { request } = new Http();
export const getHomeNearestMall = (data = {}) => {
  return request({
    url: `presentation/customer/content/mainPage/v1/queryNearestMall`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
    errShow: data.errShow,
  });
};
/**
 * 查询信息流广告
 */
export const getCarouselList = (data) => {
  return request({
    url: `reach-touch/reach/touch/exhibition/carousel/${data.key}`,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["appversion"]: "2.1.7",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 查询信息流广告
 */
export const getHomeLayoutList = () => {
  return request({
    url: `cpp-instrument/open/v1/tool/banner/mainPage/layout`,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["appversion"]: "2.1.7",
    },
    gw: false,
    loading: false,
  });
};

/**
 获取新人活动banner和弹窗
 type:1 banner 2弹窗
 key:NEW_USER_CHALLENGE_HOME_BANNER NEW_USER_CHALLENGE_POP_UP
**/
export const getNewPersonBannerPopUp = (type = 1) => {
  const data = {
    key:
      type === 1
        ? "NEW_USER_CHALLENGE_HOME_BANNER"
        : "NEW_USER_CHALLENGE_POP_UP",
  };
  return request({
    url: `presentation/customer/marketing/activity/v1/newPersonTouchContent`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};

/**
 * 工具
 */
export const getToolsList = (data) => {
  return request({
    url: `cpp-instrument/open/v2/tool/item/raise/list`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["appversion"]: "5.1.0",
    },
    gw: false,
    loading: false,
  });
};


/**
 * 查询会员信息
 */
// customer/app/member/v1/info/agg
export const getMemberAgg = (data = {}) => {
  return request({
    url: `presentation/customer/app/member/v1/info/agg`,
    method: "POST",
    data,
    gw: false,
    loading: false,
    cqm: true,
  })
}

/**
 * banner轮播图接口
 */
export const getBannerData = (data) => {
  return request({
    url: `reach-touch/reach/touch/exhibition/banner/${data.key}`,
    method: "GET",
    data,
    gw: false,
    loading: false,
    cqm: false,
    useSelfLoading: true
  })
}