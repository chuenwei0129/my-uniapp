import dayjs from "dayjs";
import Vue from "vue";

// #ifdef H5
import CallApp from "callapp-lib";
// #endif
const imgUrl = "https://image.henhenchina.com/";
export const formatTime = (timer, type = "YYYY-MM-DD") => {
  return dayjs(timer).format(type);
};
export const initTime = (sentTime) => {
  const stamp1 = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  if (sentTime >= stamp1) {
    return dayjs(sentTime).format("HH:mm");
  } else if (stamp1 - sentTime <= 86400000) {
    return `昨天 ${dayjs(sentTime).format("HH:mm")}`;
  } else if (dayjs(sentTime).format("YYYY") === dayjs(stamp1).format("YYYY")) {
    return dayjs(sentTime).format("MM-DD HH:mm");
  } else {
    return dayjs(sentTime).format("YYYY-MM-DD");
  }
};
//
// px 转换为 rpx ，传参类型是数字（Number）

export function rpxTopx(px) {
  let deviceWidth = uni.getSystemInfoSync().windowWidth; //获取设备屏幕宽度

  let rpx = (750 / deviceWidth) * Number(px);

  return Math.floor(rpx);
}
//位置距离过滤显示
export const renderKM = (km) => {
  let newkm = "0.0m";
  if (km > 999999) {
    newkm = "999+km";
  }
  if (km >= 1000 && km <= 999999) {
    newkm = (km / 1000).toFixed(1) + "km";
  }
  if (km > 0 && km < 1000) {
    newkm = parseFloat(km).toFixed(0) + "m";
  }
  return newkm;
};

//门店是否营业
export const isSale = (starTime, endTime) => {
  const nowTime = new Date().getHours();
  if (nowTime >= Number(starTime) && nowTime < Number(endTime)) {
    return "营业中";
  } else {
    return "休息中";
  }
};

//门店营业时间过滤
export const renderDay = (businessDays) => {
  if (!businessDays) return;
  if (businessDays.length >= 7) {
    return "周一至周日";
  } else {
    if (!businessDays.length) return "";
    const allDay = businessDays || [];
    const dayList = [
      "",
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
      "周日",
    ];
    let index = "";
    for (let i = 0; i < allDay.length; i++) {
      if (allDay[i] != allDay[i + 1] - 1) {
        index = i;
        continue;
      }
    }

    if (index && index !== allDay.length - 1) {
      return `${dayList[allDay[0]]}至${dayList[allDay[index]]}，${
        dayList[allDay[index + 1]]
      }至${dayList[allDay[allDay.length - 1]]}`;
    } else {
      return `${dayList[allDay[0]]}至${dayList[allDay[allDay.length - 1]]}`;
    }
  }
};

export function debounce(fun, wait) {
  let timer, _this;
  return function () {
    _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun.call(_this, ...arguments);
    }, wait);
  };
}

export function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

export function isEmptyString(value) {
  return value === "" || value == null;
}

export function isEqualArray(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  if (set1.size !== set2.size) {
    return false;
  }

  for (const item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }

  return true;
}

export function isEmptyObj(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * 启动唤醒App
 */
// #ifdef H5
export function lunchApp(lunchObject) {
  if (!lunchObject) {
    lunchObject = {
      host: "cpp",
    };
  }
  const APP_STORE = "https://apps.apple.com/cn/app/id1501134228";
  const APP_YYB =
    "https://sj.qq.com/myapp/detail.htm?apkName=com.longyan.mmmutually";
  const originUrl = process.env.NODE_ENV?.includes("development")
    ? "https://cn-dev02-chongpangpang.henhenchina.com"
    : "https://shareactivity.chongpangpang.com";
  const APP_FALLBACK = originUrl + "/h5/shareActivity/?random=123#/guide";
  const callApp = new CallApp({
    scheme: {
      protocol: "hhkj",
      host: lunchObject.host,
      port: "",
    },
    universal: {
      host: "backend.henhenchina.com/h5/down/down.html?from=emW1zy",
      pathKey: "",
    },
    appstore: APP_STORE,
    // yingyongbao: APP_YYB,
    fallback: APP_FALLBACK,
    timeout: 2000,
  });
  callApp.open({
    path: lunchObject.path,
    param: lunchObject.params,
    callback: () => {
      console.log("APP_YYB===>", APP_YYB);
      // ios 不走默认得fallback 手动进行跳转
      window.location.href = APP_YYB;
    },
  });
}
// #endif
export const RightType_ENUM = {
  201: "单品券",
  211: "满减券",
  216: "满折券",
};
// 格式化优惠标签
export function formatDiscount(rightType, rule, promotionName) {
  if (rightType == 201) {
    return promotionName;
  }
  const { amount, discount, mostAmount, threshold } = rule || {};
  if (rightType == 211) {
    return `满${threshold}减${amount}`;
  }

  if (rightType == 216) {
    let num = discount * 10;
    let str = num.toFixed(2) + "";
    return `满${threshold}打${str.replace(/\.?0+$/, "")}折`;
  }

  return "";
}

export function formatFloat(val) {
  let v = val;
  if (typeof v === "string") {
    v = parseFloat(v);
  }
  if (typeof v !== "number") {
    return 0;
  }
  let res = v.toFixed(2).split(".")[1];
  if (res === "00") {
    return v.toFixed(0);
  }
  if (res[1] === "0") {
    return v.toFixed(1);
  }
  return v.toFixed(2);
}

export const getWidth = (text, font) => {
  let canvas = uni.createCanvasContext("width-canvas");
  canvas.font = font;
  return canvas.measureText(text).width;
};

// rpx转px
export const rpxToPx = (rpx) => {
  const screenWidth = uni.getSystemInfoSync().screenWidth;
  return (screenWidth * Number.parseInt(rpx)) / 750;
};

// px转rpx
export const pxToRpx = (px) => {
  const screenWidth = uni.getSystemInfoSync().screenWidth;
  return (750 * Number.parseInt(px)) / screenWidth;
};

export function getQueryString(name, query_string) {
  if (!query_string) return null; // 如果无参，返回null
  var re = /[?&]?([^=]+)=([^&]*)/g;
  var tokens;
  while ((tokens = re.exec(query_string))) {
    if (decodeURIComponent(tokens[1]) === name) {
      return decodeURIComponent(tokens[2]);
    }
  }
  return null;
}
export const getProgramLocation = () => {
  return new Promise((resolves, reject) => {
    uni.authorize({
      scope: "scope.userLocation",
      success(res) {
        // console.log('成功:', res)
        uni.setStorageSync("storage_openSetting", false);
        uni.getLocation({
          type: "gcj02",
          altitude: true,
          isHighAccuracy: true,
          success: function (res) {
            uni.setStorageSync("storage_currentPosition", {
              longitude: res.longitude,
              latitude: res.latitude,
            });
            resolves(res);
          },
        });
      },
      fail(err) {
        // console.log('失败：', err.errMsg)
        uni.setStorageSync("storage_openSetting", true);
        uni.removeStorageSync("storage_currentPosition");
        reject(err);
      },
    });
  });
};
// 订阅消息方法
export const sendFormId = (obj) => {
  return new Promise((resolve) => {
    uni.requestSubscribeMessage({
      tmplIds: obj.modelIdArr,
      success(res) {
        console.log("订阅消息：", res);
        resolve();
        if (res.errMsg == "requestSubscribeMessage:ok") {
          const list = Object.keys(res).filter((e) => res[e] === "accept");
          delete res.errMsg;
          if (list.length > 0) {
            const authorizedTemplateIds = res;
            //       const params = {
            // appId: 'wxe1578bc68a4dbe64',
            // data: obj.data,
            //             openId: Tokens.openId,
            // page: obj.path,
            // templateId: authorizedTemplateIds,
            //             userId: Tokens.userId
            //       };
            // API_SEND_WX(params)
            // API_SEND_WX(params).then(data => {
            // 	resolve(data.data})
            // })
          }
        }
      },
      fail(res) {
        console.log("订阅失败obj：", res);
        var outCode = res.errCode;
        if (res.errCode == 20004) {
          var content = "建议开启订阅消息，接收宠胖胖小程序发送的消息通知";
        }
        if (res.errCode == 10002) {
          var content = "网络问题，请求消息失败,建议退出本页面重新进入";
        }
        uni.showModal({
          title: "提示",
          content: content,
          cancelText: "取消",
          confirmText: "去开启",
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              uni.openSetting({});
            } else if (res.cancel) {
              if (outCode == 20004) {
                resolve();
              }
            }
          },
        });
      },
    });
  });
};
export const rsvtionformId = JSON.stringify({
  DXTU: "DBHF8CZsIn8rQlBoAkKN0mrqJPAZ6nx2Qv5vZCCrDS8", //活动即将开始提醒
  RWYw: "3-cHlz_NEtmW1aXbh7yTuffN3p8o6gzlIYKqaBI52Ro", //取消报名通知
  AEPP: "CJWDEg1igylXrc4kz4hxtJIySQQw4BPU4u1V6VXbMf8", //活动变更通知
  BvLo: "P3PUKfH-UL22a6jSjmFN-SoeUD4Is5tO5dkL6ETL6No", //活动报名通知
  owjg: "skndbDaiF1omop_200QC-BPaNjfwum6TVkDoEw6zoxg", //活动取消通知
});
export const formId = JSON.stringify({
  DXTU: "DBHF8CZsIn8rQlBoAkKN0mrqJPAZ6nx2Qv5vZCCrDS8", //活动即将开始提醒
  RWYw: "3-cHlz_NEtmW1aXbh7yTuffN3p8o6gzlIYKqaBI52Ro", //取消报名通知
  AEPP: "CJWDEg1igylXrc4kz4hxtJIySQQw4BPU4u1V6VXbMf8", //活动变更通知
  BvLo: "P3PUKfH-UL22a6jSjmFN-SoeUD4Is5tO5dkL6ETL6No", //活动报名通知
  owjg: "skndbDaiF1omop_200QC-BPaNjfwum6TVkDoEw6zoxg", //活动取消通知
});
//显示富文本
export function exchangeEl(string) {
  if (!string || string.length == 0) {
    return;
  }
  let noStyle = `style="display:block;max-width: 100%;vertical-align: top;"`;
  let text = string
    .replace(/<img[^>]*>/gi, function (match, capture) {
      let src = "";
      match.replace(/(src="[^\"]*")/, function (matchItem) {
        src = matchItem;
        return matchItem;
      });
      return `<img ${src} ${noStyle} />`;
    })
    .replace(/src="\/storage\/uploads/g, `src="${imgUrl}/`);

  return text;
}
//支付
export const wxPay = async (data, paySuccess) => {
  const { userId, openId } = uni.getStorageSync("storage_info");
  let that = this;
  uni.getProvider({
    service: "payment",
    success: function (res) {
      const provider = res.provider[0];
      OrderPay(
        {
          biz: "COMMUNITY_ACTIVITY_PAY",
          originAmount: data.price,
          payServiceType:
            provider === "wxpay" ? "WECHAT_JSXCX" : "ALIPAY_ALXCX",
          payType: provider === "wxpay" ? "WX" : "ZFB",
          // paymentAmount: 19.9,
          orderNo: data.orderNo,
          paymentAmount: data.price,
          userId: userId || "",
          discountAmount: 0,
          deductionAmount: 0,
          channelUserId: provider === "wxpay" ? openId : userId,
        },
        provider
      ).then((res) => {
        if (provider === "wxpay") {
          // 微信
          uni.requestPayment({
            provider: provider,
            orderInfo: { ...res.data, package: res.data.packages },
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.packages,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: function (res) {
              console.log("success:" + JSON.stringify(res));
              // that.resumemy();
              paySuccess && paySuccess("success");
              // that.init()
            },
            fail: function (err) {
              // that.resumemy();
              // that.init()
              paySuccess && paySuccess("error");
              console.log("fail:" + JSON.stringify(err));
            },
          });
        }
      });
    },
  });
};
export const distance = (lat1, lng1) => {
  const { latitude, longitude } = uni.getStorageSync("storage_currentPosition");
  console.log("🚀 ~ distance ~ latitude, longitude:", latitude, longitude);

  let lat2 = latitude;
  let lng2 = longitude;
  let rad1 = (lat1 * Math.PI) / 180.0;
  let rad2 = (lat2 * Math.PI) / 180.0;
  let a = rad1 - rad2;
  let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137;
  console.log("🚀 ~ distance ~ s:", s);

  s = Math.round(s * 10000) / 10000;
  s = s.toString();
  s = s.substring(0, s.indexOf(".") + 2);
  return s;
};
//广告位跳转
export const adRouteGo = (route) => {
  const type = route.type;
  const path = route.path;
  switch (type) {
    case "NATIVE":
      const tabPaths = [
        "/pages/mall/index",
        "/pages/index/index",
        "/pages/home/index",
        "/pages/service/index",
      ];
      if (tabPaths.some((e) => e === path)) {
        if (path.indexOf("/pages/service/index") > -1) {
          uni.setStorageSync("adchannel", true);
        }
        return uni.switchTab({
          url: path,
        });
      } else {
        return uni.navigateTo({
          url: path,
        });
      }
    case "APPLET":
      try {
        let appId = JSON.parse(path).menu;
        let pathReal = JSON.parse(path).function;
        const systemInfo = uni.getAccountInfoSync();
        if (systemInfo.miniProgram.appId == appId) {
          return uni.navigateTo({
            url: pathReal,
          });
        } else {
          return uni.navigateToMiniProgram({
            appId,
            path: pathReal,
            success(res) {
              // 打开成功
            },
          });
        }
      } catch (error) {}
    case "URL":
      if (path.indexOf("http") !== -1) {
        let newRoute = "";
        if (path.indexOf("h5/shareActivity/?random=123#") > -1) {
          newRoute = path.replace("h5/shareActivity/?random=123#", "#");
        } else if (path.indexOf("h5/shareActivity/?random=123/#/") > -1) {
          newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
        } else if (path.indexOf("h5/shareActivity/?random=123") > -1) {
          newRoute = path.replace("h5/shareActivity/?random=123/", "");
        } else {
          newRoute = path;
        }
        let str = `/pagesA/webView/index?route=${encodeURIComponent(
          newRoute
        )}&type=icon`;
        return uni.navigateTo({
          url: str,
        });
      } else {
        if (path) {
          return uni.navigateTo({
            url: path,
          });
        }
      }
  }
};

let _mime = (option, value) => {
  let mimeTypes = navigator.mimeTypes;
  for (let mt in mimeTypes) {
    if (mimeTypes[mt][option] == value) {
      return true;
    }
  }
  return false;
};
export const getBrowserInfo = () => {
  // #ifdef MP-WEIXIN
  return {
    browserType: "微信小程序",
  };
  // #endif
  let u = window.navigator.userAgent;
  let ua = u.toLocaleLowerCase();
  let browserType = null;
  if (ua.match(/msie/) || ua.match(/trident/)) {
    browserType = "IE";
  } else if (ua.match(/firefox/)) {
    browserType = "火狐";
  } else if (ua.match(/alipay/)) {
    browserType = "支付宝";
  } else if (ua.match(/weibo/)) {
    browserType = "微博";
  } else if (ua.match(/ucbrowser/)) {
    browserType = "UC";
  } else if (ua.match(/opera/) || ua.match(/opr/)) {
    browserType = "欧朋";
  } else if (ua.match(/baidu/)) {
    browserType = "百度";
  } else if (ua.match(/metasr/) || ua.match(/sogo/)) {
    browserType = "搜狗";
  } else if (ua.match(/liebao/)) {
    browserType = "猎豹";
  } else if (ua.match(/2345/)) {
    browserType = "2345";
  } else if (ua.match(/MicroMessenger/i)) {
    if (ua.match(/MicroMessenger/i)[0] === "micromessenger") {
      browserType = "微信";
    }
  } else if (ua.match(/qqbrowser/)) {
    browserType = "QQ";
  } else if (ua.match(/maxthon/)) {
    browserType = "遨游";
  } else if (ua.match(/chrome/)) {
    let is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
    if (is360) {
      browserType = "360";
    } else {
      browserType = "谷歌";
    }
  } else if (
    !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) &&
    ua.match(/safari/)
  ) {
    browserType = "Safari";
  } else {
    browserType = "未知";
  }
  return browserType;
};
