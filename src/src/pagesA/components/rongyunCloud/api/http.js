// import store from "@/store";
// #ifdef H5
import dsBridge from "dsbridge";
// #endif

const tips = {
  500: "服务器异常",
  0: "发生未知错误",
  13: "请求超时, 请检查网络",
};
/**
 * 区分环境接口请求地址
 */
const SHARE_BASR_URL = process.env.NODE_ENV.includes("development")
  ? "https://cn-dev01-shareactivity.chongpangpang.com/"
  : process.env.NODE_ENV.includes("test")
  ? "https://cn-dev02-shareactivity.chongpangpang.com/"
  : process.env.NODE_ENV.includes("pre")
  ? "https://cn-test01-shareactivity.chongpangpang.com/"
  : "https://shareactivity.chongpangpang.com/";

export const BASR_URL =
  process.env.NODE_ENV === "development"
    ? "https://cn-dev01-gw.chongpangpang.com/"
    : process.env.NODE_ENV === "test" ||
      process.env.NODE_ENV === "development-local"
    ? "https://cn-dev02-gw.chongpangpang.com/"
    : // ? "http://10.1.4.252:8200/"
    process.env.NODE_ENV == "pre"
    ? "https://cn-test01-gw.chongpangpang.com/"
    : "https://cn-prod01-gw.henhenchina.com/";

console.log("process.env.NODE_ENV hhtp", process.env);

export const BASR_URL_NO =
  process.env.NODE_ENV === "development"
    ? "https://cn-dev01-shareactivity.chongpangpang.com/api-cpp/"
    : process.env.NODE_ENV === "test"
    ? "https://cn-dev02-shareactivity.chongpangpang.com/api-cpp/"
    : process.env.NODE_ENV === "pre"
    ? "https://cn-test01-shareactivity.chongpangpang.com/api-cpp/"
    : "https://shareactivity.chongpangpang.com/api-cpp/";

const CQM_URL_ENUM = {
  "development-local": "https://test-crm.chongpangpang.com/crm-bff-app/",
  development: "https://dev-crm.chongpangpang.com/crm-bff-app/",
  test: "https://test-crm.chongpangpang.com/crm-bff-app/",
  pre: "https://pre-crm.chongpangpang.com/crm-bff-app/",
  production: "https://crm.chongpangpang.com/crm-bff-app/",
};
export const CQM_URL = CQM_URL_ENUM[process.env.NODE_ENV];

class Http {
  request({
    url,
    data = {},
    method = "GET",
    neglect = false,
    cqm = false,
    wxSign = false,
    header,
    loading = false,
    errShow = true,
    useSelfToast = false,
    useSelfLoading = false,
    use500Error = false,
    use500ShowToast = false,
  }) {
    const defaultheader = {
      "content-type": "application/json;charset=UTF-8",
      "application-version": "2.0.0",
    };
    let allUrl = "";
    // #ifdef MP-WEIXIN
    if (url.startsWith("http")) {
      allUrl = url;
    } else {
      allUrl = cqm ? CQM_URL + url : BASR_URL + url;
    }
    //#endif

    // #ifdef H5
    if (process.env.NODE_ENV == "development-local") {
      allUrl = cqm ? "/cqmApi/" + url : "/api/" + url;
    } else if (url.startsWith("http")) {
      allUrl = url;
    } else {
      allUrl = cqm ? CQM_URL + url : BASR_URL + url;
    }
    if (wxSign) {
      allUrl = SHARE_BASR_URL + url;
    }

    //#endif

    // TODO:  生产
    // #ifdef MP-WEIXIN
    // const info = uni.getStorageSync("storage_info") || {};
    // #endif
    // TODO:  临时开发
    // #ifdef H5
    // const info = uni.getStorageSync("storage_info")
    //   ? uni.getStorageSync("storage_info")
    //   : {
    //       token:
    //         "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJDUFAtSldUIiwib2xkVXNlcklkIjoiMzAwMDkwMDk4MDk5MTM0NDY0IiwiaXNzIjoibWVvdy1rOHMtY24tZGV2MDIiLCJleHAiOjE3MDY4NTk1NTcsImlhdCI6MTcwNTA0NTE1NywidXNlcklkIjoiMzAwMDkwMDk4MDk5MTM0NDY0IiwianRpIjoiNjVhMGVjYTUwOWFlOTEwMDAxODk0MGUyIiwibWVtYmVySWQiOiIzMDAwOTAwOTgwOTkxMzQ0NjQifQ.5j6BC1IvPZDUaz0LBScwu-Il-ud07LMWzxtBo4OsTko3gJeTGiuoST2w2hBY3SNSUlZ9KsWmykMVTY0XIULNHQ",
    //       openId: "ogGoH4yQB8bk99h0bPB2CmvhjpLs",
    //       userId: "300090098099134464",
    //       isNewUser: false,
    //       phone: "13003636137",
    //       appId: "wx49133dd26d6fc20b",
    //       unionId: "oTcb46S0o6nCXUjT99FOqhnMcUzo",
    //       avatarUrl: "https://image.henhenchina.com/account_21.png",
    //       nickName: "宠友cdnrAA",
    //       memberId: "300090098099134464",
    //       showUserId: "9999972342",
    //       oldUserId: "300090098099134464",
    //       city: null,
    //       age: null,
    //       ryId: "f8i+Z3Vq/ZT1b0gjQSThUMHz17Inv6sv/+ygg9KvpBrVZ5Yu+jDMPDau6fUgC60pLhyWbnqX7+g=@37xa.cn.rongnav.com;37xa.cn.rongcfg.com",
    //       ryUid: "meow_1703145670856_13003636137",
    //       sex: 2,
    //       isOfficial: null,
    //       userAvatarDecoration: null,
    //     };
    // if (process.env.NODE_ENV?.includes("local")) {
    //   uni.setStorageSync("storage_info", info);
    // }
    //#endif

    const info = uni.getStorageSync("storage_info") || {};

    const nowHeader = { ...defaultheader, ...header, fromChannel: "MP" };
    if (info.token) {
      nowHeader["Authorization"] = info.token;
    }
    if (info.token) {
      nowHeader["token"] = info.token;
    }

    if (info.userId) {
      nowHeader["X-User-Id"] = info.userId;
    }

    if (uni.getStorageSync("openId")) {
      nowHeader["Third-Party-User-Id"] = uni.getStorageSync("openId");
    }
    const nowData = { ...data };
    nowData["appId"] = nowData.appId || "1729776648698531840";
    nowData["tenantId"] = nowData.tenantId || "default_tenant";

    // #ifdef H5
    let appVersion = dsBridge.call("getAppInfo", "version");
    if (appVersion) {
      nowHeader["appVersion"] = appVersion;
      nowHeader["fromChannel"] = "APP";
    }
    // #endif

    return new Promise((resolve, reject) => {
      if (!useSelfLoading) {
        loading ? uni.showLoading() : uni.hideLoading();
      }
      uni.request({
        // url: (gw ? BASR_URL : BASR_URL_NO) + url,
        url: allUrl,
        data: nowData,
        method,
        header: nowHeader,
        timeout: 60000,
        success: (res) => {
          if (!useSelfLoading) {
            uni.hideLoading();
          }
          if (
            res.statusCode === 200 ||
            res.statusCode === 201 ||
            res.statusCode === 204
          ) {
            if (res.header["token"]) {
              uni.setStorageSync("token", res.header["token"]);
            }
            if (cqm) {
              //宠奇妙网络请求特殊处理
              // code：1001-1005为喂食扫码error返回逻辑，自行处理
              // 20000, 20001, 20003, 20004商详页异常逻辑兜底状态码
              if (
                res.data.code == 0 ||
                [
                  1001, 1002, 1003, 1004, 1005, 20000, 20001, 20003, 20004,
                ].includes(res.data.code)
              ) {
                resolve({ ...res });
              } else {
                reject(res);
                // code: 30000,30001为正常业务，用于在订单详情（达达配送类型）更换地址时，判断是否同城配送，详情页面使用30000，30001code码有业务逻辑，其他code码走通用逻辑
                if ([30000, 30001].includes(res.data.code)) return;
                if (errShow) {
                  uni.showToast({
                    icon: "none",
                    title: res.data.message,
                    duration: 1000,
                  });
                }
              }
              return;
            }
            resolve({ ...res });
          } else {
            reject(res);
          }
        },
        fail: (err) => {
          if (!useSelfLoading) {
            uni.hideLoading();
          }
          if (err && err.statusCode === 401) {
            return reject(err);
          }
          console.log("network err", err);
          if (err.error == 13 || err.error == 12 /* || err.error == 14 */) {
            reject({
              status: 12,
              msg: "网络信号差",
            });
            return;
          }
          reject(err);
        },
      });
    }).catch((err) => {
      if (err && err.statusCode === 401 && !Http.errRequestFlage) {
        Http.errRequestFlage = true;
        return redirecLogOut();
      }
      console.log(err);
      if (!useSelfLoading) {
        uni.hideLoading();
      }
      if (neglect) {
        return;
      }
      if (err.status == 500 || err.status == 404 || err == 500) {
        if (use500Error) {
          return Promise.reject({
            error: err,
          });
        } else {
          errShow && this._show_error(err);
        }
        return;
      } else {
        console.log("触发异常", "当前接口：", allUrl);
        if (!useSelfLoading) {
          uni.hideLoading();
        }
        if (use500ShowToast) {
          return console.log("error");
        }
        errShow &&
          // uni.showToast({
          //   icon: "none",
          //   title: `${err.data.message || err.msg || "网络异常，请重试"}`,
          //   duration: 1500,
          // });
          setTimeout(() => {
            if (!useSelfToast) {
              uni.$u.toast(err.data.message || err.msg || "网络异常，请重试");
            }
          }, 500);
      }
      // code: 30000,30001为正常业务，用于在订单详情（达达配送类型）更换地址时，判断是否同城配送，详情页面使用30000，30001code码有业务逻辑，其他code码走通用逻辑
      if ([30000, 30001].includes(err.data.code)) {
        return Promise.reject({
          code: err.data.code,
          message: err.data.message,
        });
      }
      return Promise.reject({
        code: 500,
        message: err.data.message,
      });
    });
  }

  static errRequestFlage = false;
  //  toast error
  _show_error(error_code, err) {
    uni.showToast({
      icon: "none",
      title: tips[err],
      duration: 1500,
    });
  }
}

function redirecLogOut() {
  uni.clearStorageSync();

  // store.commit("setUserInfo", {});

  // uni.showToast({
  //   icon: "none",
  //   title: "用户信息到期，请重新登陆",
  //   duration: 1000,
  // });
  Http.errRequestFlage = false;
  setTimeout(() => {
    uni.reLaunch({
      url: "/pagesD/login/index",
    });
  }, 1000);
  return;
}

export { Http };
