import { action_report } from "@/utils/track";
export const wxShareMethod = (
  params = {
    title: "分享好友，领取免费宠物在线问诊（限时）",
    path: "/pages/index/index",
    imageUrl:
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/share/share-img-logo.png",
    desc: "分享好友，领取免费宠物在线问诊（限时）",
  }
) => {
  return {
    onShareAppMessage(res) {
      // if (res.from === "button") {
      //   // 来自页面内分享按钮
      //   console.log(res.target);
      // }
      return {
        title: params.title,
        path: params.path,
        imageUrl: params.imageUrl,
        desc: params.desc,
      };
    },
    onShareTimeline(res) {
      return {
        title: params.title,
        path: params.path,
        imageUrl: params.imageUrl,
        desc: params.desc,
      };
    },
  };
};
