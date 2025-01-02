import { Http } from "../utils/http";
const { request } = new Http();

/**
 * @title 工具列表
 */
export const getToolsLis = (data) => {
  return request({
    url: `cpp-instrument/open/v2/tool/item/discovery/list`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      // #ifdef H5
      appVersion: getApp().globalData.appVersion,
      // #endif
      // #ifdef MP-WEIXIN
      appVersion: "5.2.0",
      // #endif
    },
    gw: false,
    loading: false,
    errShow: false,
  });
};
