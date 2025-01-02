export default {
  data() {
    return {
      params: {
        title: "分享好友，领取免费宠物在线问诊（限时）",
        path: "/pages/index/index",
        imageUrl:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/share/share-img-logo.png",
        desc: "分享好友，领取免费宠物在线问诊（限时）",
      },
    };
  },
  //1.发送给朋友
  onShareAppMessage() {
    return {
      title: this.params.title,
      path: this.params.path,
      imageUrl: this.params.imageUrl,
      desc: this.params.desc,
    };
  },
  //2.分享到朋友圈
  onShareTimeline() {
    return {
      title: this.params.title,
      path: this.params.path,
      imageUrl: this.params.imageUrl,
      desc: this.params.desc,
    };
  },
};
