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
