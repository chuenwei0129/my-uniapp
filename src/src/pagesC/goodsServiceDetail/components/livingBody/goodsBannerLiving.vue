<script>
export default {
  name: "goodsServiceBanner",
  data() {
    return {
      isVoiceOff: true, // 声音开关
      voiceOn:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/voiceOn.png", // 静音图标
      voiceOff:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/voiceOff.png", // 打开声音图标
      scrollIndex: 0, // 轮播索引
      screenWidth: "", // 屏幕宽度
      goodsNavWhite:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/goodsNav_white.png", // 距离三角图标
      isPlaying: false,
      playIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/play.png",
      distance: "",
    };
  },
  props: {
    urls: {
      type: Array,
      default: () => [],
    },
    videoUrlList: {
      type: Array,
      default: () => [],
    },
    livebodyData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
    this.screenWidth = getApp().globalData.windowWidth + "px";
  },
  mounted() {},
  computed: {
    videoUrl() {
      if (!this.videoUrlList || this.videoUrlList.length === 0) return "";
      const parts = this.videoUrlList[0]?.split("?");
      const beforeQuestionMark = parts[0];
      return beforeQuestionMark;
    },
    poster() {
      return this.videoUrl + "?x-oss-process=video/snapshot,t_0,f_jpg";
    },
    swiperUrls() {
      const list = this.urls?.map((item) => {
        if (item.url) {
          const parts = item.url.split("?");
          return {
            type: "image",
            url: parts[0],
          };
        }
      });
      if (this.videoUrl || this.videoUrlList?.length > 0) {
        const itemVideo = {
          type: "video",
          url: this.videoUrl || this.videoUrlList[0],
          controls: false,
        };
        list.unshift(itemVideo);
      }
      return list;
    },
    meter() {
      let lat2 = "";
      let lng2 = "";
      let that = this;
      lat2 = uni.getStorageSync("lat") || "";
      lng2 = uni.getStorageSync("lon") || "";
      if (lat2 && lng2) {
        let rad1 = (that.livebodyData.liveShop.lat * Math.PI) / 180.0;
        let rad2 = (lat2 * Math.PI) / 180.0;
        let a = rad1 - rad2;
        let b =
          (that.livebodyData.liveShop.lng * Math.PI) / 180.0 -
          (lng2 * Math.PI) / 180.0;
        let s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
                Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
            )
          );
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        s = s.toString();
        s = s.substring(0, s.indexOf(".") + 2);
        console.log("距离===", s);
        if (s < 1) {
          if (s == "0.0") {
            s = 0;
          } else {
            s = s * 1000 + "m";
          }
        } else {
          s = s + "km";
        }
        this.distance = s;
      } else {
        this.distance = 0;
      }
    },
  },
  methods: {
    onChangeHandle(event) {
      this.scrollIndex = event.detail.current;
      const videoContext = uni.createVideoContext("myVideo", this); //创建视频实例指向video
      // 暂停视频
      if (this.scrollIndex > 0) {
        videoContext.pause();
        this.isPlaying = true;
      } else {
        videoContext.play();
      }
    },
    onChangeBottom(index) {
      this.scrollIndex = index;
    },
    handleNav() {
      uni.$u.throttle(() => {
        uni.openLocation({
          latitude: this.livebodyData.liveShop.lat,
          longitude: this.livebodyData.liveShop.lng,
          name: this.livebodyData.liveShop?.onlineShopName,
          address: this.livebodyData.liveShop.fullAddress,
        });
      }, 500);
    },
    goShopDetail() {
      const { shopId } = this.livebodyData?.liveShop;

      // #ifdef MP-WEIXIN
      let lon, lat;
      const mall_last_search_address_obj = uni.getStorageSync(
        "mall_last_search_address_obj"
      );
      if (!mall_last_search_address_obj) {
        lon = uni.getStorageSync("lon");
        lat = uni.getStorageSync("lat");
      } else {
        lon = mall_last_search_address_obj.lon;
        lat = mall_last_search_address_obj.lat;
      }
      uni.navigateTo({
        url: `/pagesB/inStoreService/index?shopId=${shopId}lat=${lat}&lon=${lon}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesB/inStoreService/index?shopId=${shopId}&transparentTopBar=1`,
      });
      // #endif
    },
    // 控制声音的开/关
    handleVoice() {
      this.isVoiceOff = !this.isVoiceOff;
    },
    sliceText(str, len) {
      if (str.length > len) {
        return str.slice(0, len);
      } else {
        return str;
      }
    },
    /**
     * 算距离
     */
    handleDistance(lat1, lng1) {
      let lat2 = "";
      let lng2 = "";
      return new Promise((resolve, reject) => {
        uni.getLocation({
          type: "gcj02", //设置type为gcj02
          isHighAccuracy: true,
          success: async (res) => {
            lat2 = res.latitude;
            lng2 = res.longitude;
            let rad1 = (lat1 * Math.PI) / 180.0;
            let rad2 = (lat2 * Math.PI) / 180.0;
            let a = rad1 - rad2;
            let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
            let s =
              2 *
              Math.asin(
                Math.sqrt(
                  Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(rad1) *
                      Math.cos(rad2) *
                      Math.pow(Math.sin(b / 2), 2)
                )
              );
            s = s * 6378.137;
            s = Math.round(s * 10000) / 10000;
            s = s.toString();
            s = s.substring(0, s.indexOf(".") + 2);
            resolve(s);
          },
        });
      });
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="banner-wrapper">
      <swiper
        class="swiper-box"
        :current="scrollIndex"
        :style="{ height: screenWidth }"
        @change="onChangeHandle"
      >
        <swiper-item
          v-for="(item, index) in swiperUrls"
          :key="index"
          :style="{ height: '100%' }"
          class="swiper-item"
        >
          <image
            v-if="item.type === 'image'"
            :src="item.url"
            class="swiper-img"
            mode="aspectFill"
          ></image>
          <video
            v-if="item.type === 'video'"
            :src="item.url"
            :loop="true"
            :controls="false"
            :autoplay="true"
            :muted="isVoiceOff"
            object-fit="cover"
            class="swiper-video"
            play-btn-position="center"
            :show-center-play-btn="false"
            :enable-progress-gesture="false"
            id="myVideo"
            ref="myVideo"
          >
            <!-- <cover-view class="play-pause"></cover-view> -->
          </video>
        </swiper-item>
      </swiper>
    </view>
    <!-- 轮播当前页/总页 -->
    <view class="indicator-right">
      <text
        >{{ swiperUrls.length > 0 ? scrollIndex + 1 : 0 }}/{{
          swiperUrls.length
        }}</text
      >
    </view>
    <!-- 视频声音开/关-按钮 -->
    <view
      v-if="videoUrl && scrollIndex === 0"
      class="indicator-video"
      @click.stop="handleVoice"
    >
      <image class="voice-icon" :src="isVoiceOff ? voiceOff : voiceOn" />
    </view>
    <!-- 店铺导航 -->
    <view class="indicator-left">
      <text @click="goShopDetail">{{
        sliceText(livebodyData.liveShop.onlineShopName, 20)
      }}</text>
      <text v-if="distance" @click="handleNav" class="distance">
        {{ distance ? distance : "" }}
      </text>
      <image
        @click="handleNav"
        class="nav-position"
        :src="goodsNavWhite"
      ></image>
    </view>
    <!-- 轮播底部视频/图片展示 -->
    <view class="banner-bottom">
      <scroll-view scroll-x class="scroll-banner">
        <view
          class="item-bottom"
          v-for="(item, i) in swiperUrls"
          :key="i"
          :class="{ border: i === scrollIndex }"
          @click="onChangeBottom(i)"
        >
          <!-- 播放按钮 -->
          <image
            v-if="videoUrl && i === 0"
            class="playIcon"
            :src="playIcon"
          ></image>
          <image
            v-if="videoUrl && i === 0"
            class="item"
            :src="poster"
            mode="aspectFill"
          />
          <image v-else class="item" :src="item.url" />
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<style scoped lang="scss">
.page-wrapper {
  position: relative;

  .indicator-right {
    position: absolute;
    bottom: calc(15rpx + 154rpx);
    right: 29rpx;
    // padding: 0rpx 13rpx;
    height: 35rpx !important;
    width: 54rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 21rpx;
    background-color: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    border-radius: 28rpx;
  }
  .indicator-left {
    position: absolute;
    bottom: calc(15rpx + 154rpx);
    left: 29rpx;
    padding: 5rpx 5rpx 5rpx 13rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 21rpx;
    background-color: rgba(0, 0, 0, 0.4);
    color: #ffffff;
    border-radius: 28rpx;
    .nav-position {
      width: 27rpx;
      height: 27rpx;
      display: inline-block;
    }
    .distance {
      display: inline-block;
      border-left: 1px solid #fff;
      line-height: 21rpx;
      padding-left: 8rpx;
      margin-left: 6rpx;
    }
  }
}
.banner-bottom {
  width: 100vw;
  height: 154rpx;
  background: linear-gradient(
    to bottom,
    #f7f8fc 0%,
    rgba(247, 248, 252, 0) 100%
  );
  padding: 19rpx 0rpx;
  box-sizing: border-box;
  .scroll-banner {
    height: 100%;
    white-space: nowrap;
  }
  .item-bottom {
    width: 115rpx;
    height: 115rpx;
    display: inline-block;
    // background: #d8d8d8;
    border-radius: 12rpx;
    margin-left: 31rpx; // 29rpx;
    overflow: hidden;
    position: relative;
    border: 2rpx solid transparent;
    .item {
      width: 115rpx;
      height: 115rpx;
      display: inline-block;
    }
  }
  .border {
    border-color: #999999 !important;
  }
}
.swiper-img,
.swiper-video {
  width: 100%;
  height: 100%;
  display: inline-block;
}
.indicator-video {
  position: absolute;
  bottom: calc(15rpx + 154rpx + 50rpx);
  right: 29rpx;
  // padding: 0rpx 13rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 21rpx;
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  border-radius: 28rpx;
  width: 54rpx;
  height: 35rpx;
  .voice-icon {
    width: 35rpx;
    height: 35rpx;
    display: inline-block;
  }
}
.play-pause {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
}
.playIcon {
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  display: inline-block;
  width: 31rpx;
  height: 31rpx;
}
</style>
