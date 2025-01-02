import { Http } from "@/utils/http";
const { request } = new Http();

export const MALL_APP_ID = "1729776648698531840";
export const MALL_PLATFORM_ID = "1699310123233079297";

/**
 宠物消息头通知列表
 **/

export const GET_PET_NOTICE_MESSAGES = (data = {}) => {
  return request({
    url: "cpp-user-management/v1/message/query",
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: false,
    loading: false,
    use500Error: true,
  });
};

/**
 宠物消息头通知已读
 **/

export const PET_ALL_MESSAGE_READED = (type, data) => {
  console.log("PET_ALL_MESSAGE_READED ", type);
  return request({
    url: `cpp-user-management/v1/message/read/all/${type}`,
    data,
    method: "PUT",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: false,
    loading: false,
    use500Error: true,
  });
};
