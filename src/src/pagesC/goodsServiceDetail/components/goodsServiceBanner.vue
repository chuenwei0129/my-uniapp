<script>
export default {
  name: "goodsServiceBanner",
  data() {
    return {
      // 声音开关
      isVoiceOff: true,
      // 是否播放
      isPlaying: false,
      scrollIndex: 0,
      screenWidth: "",
      // 静音图标
      voiceOn:
        "https://frontend-cdn.henhenchina.com/image/medical-mp/livedBody/voiceOn.png",
      // 打开声音图标
      voiceOff:
        "https://frontend-cdn.henhenchina.com/image/medical-mp/livedBody/voiceOff.png",
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
  },
  computed: {
    videoUrl() {
      if (!this.videoUrlList || this.videoUrlList.length === 0) return "";
      const parts = this.videoUrlList[0]?.split("?");
      const beforeQuestionMark = parts[0];
      return beforeQuestionMark;
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
  },
  created() {
    this.screenWidth = getApp().globalData.windowWidth + "px";
  },
  methods: {
    onChangeHandle(event) {
      console.log("event---------", event);
      this.scrollIndex = event.detail.current;
      //创建视频实例指向video
      const videoContext = uni.createVideoContext("myVideo", this);
      // 暂停/播放-视频
      if (this.scrollIndex > 0) {
        videoContext.pause();
        this.isPlaying = true;
      } else {
        videoContext.play();
      }
    },
    // onImageClickHandle(index) {
    //   // url为objec数组, 此处需转换
    //   let url = this.urls.map((item) => {
    //     return item.url;
    //   });
    //   uni.previewImage({
    //     urls: url,
    //     current: index,
    //   });
    // },
    // 控制声音的开/关
    handleVoice() {
      this.isVoiceOff = !this.isVoiceOff;
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="banner-wrapper">
      <swiper
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
            object-fit="contain"
            class="swiper-video"
            play-btn-position="center"
            :enable-progress-gesture="false"
            :show-center-play-btn="false"
            id="myVideo"
            ref="myVideo"
          ></video>
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
  </view>
</template>

<style scoped lang="scss">
.page-wrapper {
  position: relative;

  .indicator {
    position: absolute;
    bottom: 23rpx;
    right: 25rpx;
    padding: 8rpx 16rpx 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 21rpx;
    background-color: rgba(0, 0, 0, 0.55);
    color: #ffffff;
    border-radius: 28rpx;
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
  bottom: calc(19rpx + 35rpx + 15rpx);
  right: 29rpx;
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
.indicator-right {
  position: absolute;
  bottom: 19rpx;
  right: 29rpx;
  height: 35rpx !important;
  min-width: 54rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 21rpx;
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  border-radius: 28rpx;
}
</style>
