import { Http } from "@/utils/http";
const { request } = new Http();

/**
 卡包列表
 **/

export const getMyCardList = (cardType = 0) => {
  const data = { cardType: cardType };
  return request({
    url: "presentation/customer/member/asset/v1/card",
    // url: "https://mock.apifox.com/m1/2881707-0-default/presentation/customer/member/asset/v1/card",
    data,
    method: "POST",
    header: {
      // // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
