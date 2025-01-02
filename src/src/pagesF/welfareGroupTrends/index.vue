<template>
  <view class="index-warp">
    <image
      class="bg"
      src="https://image.henhenchina.com/61ee0fe4f58112000178d924/752aa69a395f4e6c912c4f589c95051f.png"
    >
    </image>
    <image
      class="ewm"
      :src="qrCode"
      show-menu-by-longpress="true"
      @click="previewImage"
    >
    </image>
    <view class="frame1" v-if="qName.length <= 9">
      <view class="qName1">
        {{ qName }}
      </view>
    </view>
    <view class="frame2" v-else>
      <view class="qName2">
        {{ qName }}
      </view>
    </view>
  </view>
</template>

<script>
import { COMMUNITY_ACTIVITY_DETAIL } from "@/api/activityclube";
export default {
  // #ifdef MP-WEIXIN
  // //...wxShareMethod(),
  // #endif
  components: {},
  data() {
    return {
      qrCode: "",
      qName: "",
      query: {
        aid: "",
      },
      detailData: undefined,
    };
  },
  computed: {},
  async onLoad(option) {
    console.log("option ", option);
    this.query.aid = option.aid;

    const { data } = await COMMUNITY_ACTIVITY_DETAIL({ id: this.query.aid });
    if (data) {
      this.detailData = data;
      this.qName = this.detailData.activityName;
      this.qrCode = this.detailData.qrCode;
    }
  },
  onReady() {},
  onShow() {},
  onHide() {},

  methods: {
    // ...mapMutations(["setUserInfo"]),

    setRouter(url, query) {
      uni.navigateTo({
        url,
      });
    },

    //长按识别二维码
    previewImage(e) {
      uni.previewImage({
        // 需要预览的图片链接列表。若无需预览，可以注释urls
        urls: [e.target.src],
        // 为当前显示图片的链接/索引值
        current: e.target.src,
        // 图片指示器样式
        indicator: "default",
        // 是否可循环预览
        loop: false,
        // 长按图片显示操作菜单，如不填默认为保存相册
        longPressActions: {
          itemList: [this.l("发送给朋友"), this.l],
        },
        success: (res) => {
          console.log("previewImage res", res);
        },
        fail: (err) => {
          console.log("previewImage err", err);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
