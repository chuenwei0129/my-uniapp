import { getWxSign } from "../api";
import wx from "weixin-js-sdk";

const config = {
  APP_ID: "wxcb936df96d4fdf99",
};
/**
 *
 * @param {*} params
 * params.title 分享标题
 * params.desc 分享文案
 * params.link 分享链接
 * params.imgUrl 分享图片url
 */
export const secondShare = (params) => {
  console.log("🚀 ~ secondShare ~ params:", params);
  getWxSign(config.APP_ID)
    .then((res) => {
      console.log("🚀 ~ .then ~ res:", res);

      const data = res.data;
      const timestamp = new Date().getTime();
      wx.ready(() => {
        //新接口
        wx.updateAppMessageShareData({
          title: params.title,
          desc: params.desc,
          link: `${params.link}${params.link.indexOf('?') > -1 ? '&' : '?'}t=${timestamp}`,
          imgUrl: params.imgUrl,
          success: () => {
            // Notify({type:'success',message:'分享成功！'})
          },
        });

        wx.updateTimelineShareData({
          title: params.title,

          link: `${params.link}${params.link.indexOf('?') > -1 ? '&' : '?'}t=${timestamp}`,
          imgUrl: params.imgUrl,
          success: () => {
            // Notify({type:'success',message:'分享成功！'})
          },
        });
      });
      wx.error((err) => {
        // alert("微信sdk初始化错误：" + JSON.stringify(err));
      });
      wx.config({
        // debug: true,
        appId: config.APP_ID,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
        success: (suc) => {
          console.log("🚀 ~ .then ~ suc:", suc);
        },
        fail(err) {
          console.log("🚀 ~ fail ~ err:", err);
        },
      });
    })
    .catch((err) => {
      // Toast({
      //   message: err.msg || JSON.stringify(err),
      // });
    });
};
