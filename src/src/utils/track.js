import SnowflakeId from "snowflake-id";
import dayjs from "dayjs";
import { postTracking } from "@/api/track";
import { getOpenId } from "@/api/base/index";
// #ifdef H5
import dsBridge from "dsbridge";
// #endif
const snowflake = new SnowflakeId({
  mid: 42,
  offset: (2019 - 1970) * 31536000 * 1000,
});
let systemInfo;
//设备信息
uni.getSystemInfo({
  success: function (res) {
    uni.setStorageSync("systemInfo", res);
    systemInfo = res;
  },
});
const {
  brand: manufacturer,
  model,
  SDKVersion: sdk_version,
  osVersion: os_version,
  windowHeight: screen_height,
  windowWidth: screen_width,
  deviceId: device_id,
  version,
} = systemInfo || {};

//common 公共字段
export const common_data = {
  // user_id:store.state.userId,
  // sex:store.state.userInfo.sex,
  // user_type:store.state.userInfo.userType,
  // #ifdef H5
  // user_id: dsBridge.call("getUserId", "getUserId"),
  // #endif
  // user_id: "222222222222222222222222222222222222222222222222",
  province: uni.getStorageSync("province"),
  city: uni.getStorageSync("city"),
  county: "",
  lng: uni.getStorageSync("lon"),
  lat: uni.getStorageSync("lat"),
  manufacturer,
  model,
  sdk_version,
  platform: "wx-applet",
  os_version,
  screen_height,
  screen_width,
  device_id,
  // #ifdef MP-WEIXIN
  source: "sp-wx",
  // #endif
  // #ifdef H5
  source: "app",
  // #endif
  version,
};

const common_event_data = {
  event_version: "v3",
  last_id: "",
  event_name: "",
  event_data: {},
};
const handleGetOpenId = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      uni.login({
        success: async (res) => {
          var code = res.code,
            appId = "wx49133dd26d6fc20b";
          console.log("正在登录中...");
          //根据获取的code去腾讯服务器，请求用户数据，返回的结果中，包含openid
          try {
            const resOpenid = await getOpenId({ appId, code });
            uni.setStorageSync("openId", resOpenid.data.openId);
            resolve(resOpenid.data.openId);
          } catch (error) {
            reject(error);
          }
        },
        fail: (err) => {
          console.log("登录失败！" + err);
        },
      });
    }, 100);
  });
};
export async function enter_page(data) {
  console.log("🚀 ~ enter_page ~ enter_page:进入");
  // #ifdef H5

  let localJson = dsBridge.call(
    "getPositioningCoordinates",
    "getPositioningCoordinates"
  );
  try {
    let loaclInfo = JSON.parse(localJson);
    const local = loaclInfo;
    const {
      currentLat = "", //无定位时默认城市中心点
      currentLon = "", //无定位时默认城市中心点
      currentCounty = "", // 当前省市
      currentCity = "", // 当前城市
    } = local;
    common_data.lat = currentLat;
    common_data.lon = currentLon;
    common_data.province = currentCounty;
    common_data.city = currentCity;
  } catch (error) {
    console.log(error);
  }
  // #endif
  let openId = uni.getStorageSync("openId");
  // #ifdef MP-WEIXIN
  while (!openId) {
    try {
      openId = await handleGetOpenId();
      console.log("取到openid", openId);
    } catch (error) {
      console.log("Retrying to get openId...");
    }
  }
  // #endif
  const session_id = snowflake.generate();
  const id = "enter_page-" + session_id + "-" + new Date().getTime();
  const enter_page_data = {
    common: {
      ...common_data,
      // #ifdef MP-WEIXIN
      user_id: data.user_id,
      // #endif
      // #ifdef H5
      user_id: dsBridge.call("getUserId", "getUserId"),
      // #endif
      sex: data.sex,
      user_type: data.user_type,
      send_time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    },
    event_list: [
      {
        ...common_event_data,
        event_time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        event_timestamp: new Date().getTime(),
        event_name: "enter_page",
        session_id,
        id,
        last_id: data.last_id,
        event_data: {
          page_id: data.page_id,
          last_page_id: data.last_page_id,
          extend: {
            ...uni.getStorageSync("enter_page_extend_info"),
            ...(uni.getStorageSync("umt_extend") || {}),
            ...(data.extend || {}),
            openid: openId,
          },
        },
      },
    ],
  };
  console.log("enterpage+中间");
  //enter_page行为last_id
  uni.setStorageSync("enter_page_last_id", id);
  //上一个页面的page_id 追溯用户行为
  uni.setStorageSync(
    "action_last_page_id",
    uni.getStorageSync("enter_page_last_page_id") || ""
  );
  //存当前page_id , 用于下个页面用户行为追溯
  uni.setStorageSync("enter_page_last_page_id", data.page_id);
  // console.log(enter_page_data);
  postTracking(enter_page_data);
}

//用户行为调用
export async function action_report(binding) {
  let openId = uni.getStorageSync("openId");
  // #ifdef MP-WEIXIN
  while (!openId) {
    try {
      openId = await handleGetOpenId();
      console.log("取到openid");
    } catch (error) {
      console.log("Retrying to get openId...");
    }
  }
  // #endif
  const session_id = snowflake.generate();
  const id = "action-" + session_id + "-" + new Date().getTime();
  const {
    userId: user_id,
    sex,
    userType: user_type,
  } = uni.getStorageSync("storage_info") || {};
  const action_data = {
    common: {
      ...common_data,
      user_id,
      sex,
      user_type,
      send_time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    },
    event_list: [
      {
        ...common_event_data,
        event_time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        event_timestamp: new Date().getTime(),
        event_name: "action",
        session_id,
        id,
        last_id: uni.getStorageSync("action_last_id"),
        event_data: {
          page_id: uni.getStorageSync("enter_page_last_page_id"),
          last_page_id: uni.getStorageSync("action_last_page_id"),
          action_type: "click",
          action_name: binding.action_name,
          object_id: binding.object_id,
          object_type: binding.object_type,
          module_name: binding.module_name,
          extend: {
            ...binding.extend,
            ...(uni.getStorageSync("umt_extend") || {}),
            openid: openId,
          },
        },
      },
    ],
  };
  uni.setStorageSync("action_last_id", id);
  postTracking(action_data);
}

//元素曝光  需要业务侧自行判断元素的曝光
export async function display_report(data) {
  let openId = uni.getStorageSync("openId");
  // #ifdef MP-WEIXIN
  while (!openId) {
    try {
      openId = await handleGetOpenId();
      console.log("取到openid");
    } catch (error) {
      console.log("Retrying to get openId...");
    }
  }
  // #endif
  setTimeout(() => {
    // display曝光事件在enter_page之后
    const session_id = snowflake.generate();
    const id = "display-" + session_id + "-" + new Date().getTime();
    const {
      userId: user_id,
      sex,
      userType: user_type,
    } = uni.getStorageSync("storage_info") || {};
    const display_data = {
      common: {
        ...common_data,
        user_id,
        sex,
        user_type,
        send_time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      },
      event_list: [
        {
          ...common_event_data,
          event_time: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          event_timestamp: new Date().getTime(),
          event_name: "display",
          session_id,
          id,
          last_id: uni.getStorageSync("display_last_id"),
          event_data: {
            page_id: uni.getStorageSync("enter_page_last_page_id"),
            display_name: data.display_name || "",
            object: [
              {
                object_id: data.object_id || data.display_name,
                object_type: data.object_type,
                rank_num: data.rank_num || "1",
                page_num: data.page_num || "1",
              },
            ],
            extend: {
              ...(data.extend || {}),
              ...(uni.getStorageSync("umt_extend") || {}),
              openid: openId,
            },
          },
        },
      ],
    };
    uni.setStorageSync("display_last_id", id);
    postTracking(display_data);
  }, 800);
}
