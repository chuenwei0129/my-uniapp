import { loginCode, wxBurying } from "@/api/base/index";
import { getQueryString } from "@/utils/index";
import { thirdPartyLogin } from "@/api/activity";
import store from "@/store";
export const appId = "wx49133dd26d6fc20b";

// #ifdef MP-WEIXIN
let regChannel = "medical_applet";
// #endif
// #ifdef MP-ALIPAY
let regChannel = "medical_applet";
// #endif
let previousUserId = uni.getStorageSync("previousUserId");

export const getProvider = (service = "oauth") => {
  return new Promise((resolve, reject) => {
    uni.getProvider({
      service,
      success: function (res) {
        let provider = res.provider[0];

        resolve(provider);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

export const login = (provider) => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: provider,
      success: function (loginRes) {
        resolve(loginRes.code);
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
};

export const getCode = async () => {
  try {
    const provider = await getProvider();

    const code = await login(provider);

    console.log("code code", code);

    return code;
  } catch (e) {
    console.log("getcode err", e);
    throw new Error(e);
  }
};

export const getPhoneNumber = async (e, code, store) => {
  try {
    console.log("code 222", code);
    let last_route_params = uni.getStorageSync("last_route_params") || "";
    const query_string = last_route_params.split("?")[1];
    let codeOrigin = getQueryString("codeOrigin", query_string) || "";
    let shopId;
    if (codeOrigin == "scan") {
      shopId = getQueryString("shopId", query_string) || "";
      regChannel = "product_price_tag";
    }
    let params = {
      appId,
      code,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      regChannel,
      shopId,
    };
    if (previousUserId) {
      params.previousUserId = previousUserId;
      params.activeCode = "MEDICAL";
    }
    const storeID = store.state.storeID;
    console.log("getPhoneNumber storeID", storeID);
    if (storeID) {
      params.deliveryChannel = storeID;
    }
    console.log("getPhoneNumber params", params);

    const res = await loginCode(params);

    console.log("getPhoneNumber res", res);
    wxBurying({
      appletsOpenId: res.data.openId,
      businessType: "APPLETS_MED_REGISTER",
      appletsType: "WECHAT_MED",
    });
    return res.data;
  } catch (e) {
    console.log("getPhoneNumber, error", e);
  } finally {
    // const code = await getCode();
  }
};

// export const getCode = () => {
//   return new Promise((resolve, reject) => {
//     uni.checkSession({
//       success(res) {
//         let jsCode = uni.getStorageSync("storage_loginCode");
//         if (res.errMsg == "checkSession:ok" && jsCode) {
//           console.log(res, "session_key 未过期，并且存在code");
//           resolve(jsCode);
//         } else {
//           uni.login({
//             provider: uni.getStorageSync("storage_provider"),
//             success: function (loginRes) {
//               resolve(loginRes.code);
//             },
//             fail: function (err) {
//               reject(err);
//             },
//           });
//         }
//       },
//       fail() {
//         console.log("session_key 已经失效，需要重新执行登录流程");
//         uni.removeStorageSync("storage_session");
//         uni.login({
//           provider: uni.getStorageSync("storage_provider"),
//           success: function (loginRes) {
//             // console.log(loginRes)
//             resolve(loginRes.code);
//           },
//           fail: function (err) {
//             reject(err);
//           },
//         });
//       },
//     });
//   });
// };

// export const getPhoneNumber = async (e, code) => {
//   return new Promise((resolve, reject) => {
//     let params = {
//       appId,
//       code,
//       encryptedData: e.detail.encryptedData,
//       iv: e.detail.iv,
//       regChannel,
//     };
//     loginCode(params).then((res) => {
//       resolve(res.data);
//     });
//   });
// };
export const thirdPartyLoginFun = async (params, callback) => {
  try {
    const MAX_RETRIES = 10; // 最大重试次数
    const INTERVAL = 100; // 检测间隔（ms）

    // 调用第三方登录接口
    const res = await thirdPartyLogin(params);

    if (!res || !res.data) {
      console.error("No data returned from thirdPartyLogin");
      uni.showToast({ title: "登录失败，请稍后重试", icon: "none" });
      return;
    }

    const user_info = res.data;

    // 存储用户信息
    uni.setStorageSync("storage_info", user_info);
    store.commit("setUserInfo", user_info);

    // 轮询检查是否存在 user_id
    const checkStorageForUserId = (retryCount = 0) => {
      const storageInfo = uni.getStorageSync("storage_info");
      const storageInfoInStore = store.state.userInfo;
      if (
        (storageInfo && storageInfo.userId) ||
        (storageInfoInStore && storageInfoInStore.userId)
      ) {
        callback(storageInfo.token); // 调用回调并传递 token
      } else if (retryCount < MAX_RETRIES) {
        setTimeout(() => checkStorageForUserId(retryCount + 1), INTERVAL);
      } else {
        console.error("User ID not found in storage_info after retries");
        uni.showToast({ title: "用户信息加载超时", icon: "none" });
      }
    };

    checkStorageForUserId(); // 开始轮询
  } catch (error) {
    console.error("Error during thirdPartyLogin:", error);
    uni.showToast({ title: "登录失败，请稍后重试", icon: "none" });
  }
};
