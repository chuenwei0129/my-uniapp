import { Http } from "../utils/http";
const { request } = new Http();

/**
 *  资源弹框
 * 
 */
export function getAdvertisementPostion(data) {
    let key = data?.key || "POPUP_CONSULTATION_HOME_APPLE"
    let cityCode = uni.getStorageSync("storage_location_city_code") || "";
    data.cityCode = cityCode;
    return request({
      url: `reach-touch/reach/touch/exhibition/popups/${key}`,
      method: "GET",
      header: {
        "appversion": "2.0.0",
      },
      data,
    });
  }

  /**
 *  悬浮广告 
 * 
 */
export function getFloatPosition(data) {
    let key = data?.key || "FLOAT_HOME_APPLE"
    let cityCode = uni.getStorageSync("storage_location_city_code") || "";
    data.cityCode = cityCode;
    return request({
      url: `reach-touch/reach/touch/exhibition/float/${key}`,
      method: "GET",
      data,
      header: {
        "appversion": "2.0.0",
      },
    });
  }



