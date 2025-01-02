import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 到店服务 获取当前城市门店
 */
export const shopByCity = (data) => {
  return request({
    url: `presentation/customer/applet/shop/shopByCity`,
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 到店服务 城市列表  
 */
export const hasShopCityList = (data) => {
  return request({
    url: `presentation/customer/applet/shop/hasShopCityList`,
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};

