import { Http } from "../utils/http";
const { request } = new Http();

/**
 * @title 用户主页数据
 * @yapi
 */

export const GET_USER_INFO_ALL = () => {
  return request({
    url: `cpp-user-management/v1/users/detail`,
    method: "GET",
    // data
  });
};

export const getCardNum = () => {
  return request({
    url: `cpp-user-management/v2/users/asset`,
    method: "GET",
    // data
  });
};

/**
 * @title 编辑用户信息
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/261/interface/api/581
 */

export const EDIT_USER_INFO = (data) => {
  const { userId } = uni.getStorageSync("storage_info");
  return request({
    url: `cpp-user-management/v1/users/${userId}`,
    method: "PUT",
    data,
  });
};

/**
 * 查询用户收藏数量
 */
export const getCollectionNum = (data) => {
  return request({
    url: `presentation/customer/collect/v1/item/collectNum`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 查询用户活动收藏数量
 * @returns
 */
export const getActCollectionNum = () => {
  return request({
    url: `cpp-community-activity/v1/activities/calculate?type=WANTED`,
    method: "GET",
    loading: false,
  });
};
/**
 * 查询用户活体收藏数量
 * @returns 
 */
export const getLiveBodyCollectionNum = (data) => {
  return request({
    url: `presentation/customer/collect/v1/livebody/collectNum`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 查询用户会员码
 */
export const getMemberCode = () => {
  return request({
    url: `presentation/customer/app/member/v1/code`,
    method: "GET",
    gw: false,
    cqm: true,
    loading: false,
  });
};
