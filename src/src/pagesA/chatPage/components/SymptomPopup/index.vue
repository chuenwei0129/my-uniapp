<template>
  <view>
    <!-- 视频-文字 -->
    <u-popup bgColor="transparent" :show="videoShow" mode="center">
      <view class="video-popup-box">
        <view class="content-box">
          <view class="title">{{ showItem.diseaseName }}</view>
          <view class="video-box">
            <view class="in-vidoe-box">
              <video :src="showItem.videos[0]"></video>
            </view>
          </view>
          <view class="description-text">
            {{ showItem.textDescription }}
          </view>

          <view @click="close" class="confirm">我知道了</view>
        </view>
        <view class="close">
          <image
            @click="close"
            class="image"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/close.png"
            mode="scaleToFill"
          />
        </view>
      </view>
    </u-popup>
    <!-- 图片-文字 -->
    <u-popup bgColor="transparent" :show="imgShow" mode="center">
      <view class="img-popup-box">
        <view class="content-box">
          <view class="title">{{ showItem.diseaseName }}</view>

          <view :style="{ height: imgHeight }" class="img-box">
            <view v-for="(item, index) in showItem.images" class="in-img-box">
              <image
                @click="onImageClickHandle(index)"
                :class="[otherClass ? 'imageThree' : 'image']"
                :src="item"
                mode="scaleToFill"
              />
            </view>
          </view>
          <view class="description-text">
            {{ showItem.textDescription }}
          </view>

          <view @click="close" class="confirm">我知道了</view>
        </view>
        <view class="close">
          <image
            @click="close"
            class="image"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/close.png"
            mode="scaleToFill"
          />
        </view>
      </view>
    </u-popup>
    <!-- 文字 -->
    <u-popup bgColor="transparent" :show="textShow" mode="center">
      <view class="text-popup-box">
        <view class="content-box">
          <view class="title">{{ showItem.diseaseName }}</view>
          <view class="description-text">
            {{ showItem.textDescription }}
          </view>

          <view @click="close" class="confirm">我知道了</view>
        </view>
        <view class="close">
          <image
            @click="close"
            class="image"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/close.png"
            mode="scaleToFill"
          />
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
// import { nextTick } from "vue/types/umd";

export default {
  props: {},
  data() {
    return {
      showItem: {},
      textShow: false,
      imgShow: false,
      videoShow: false,
      contentShow: 0, //1视频 2图片 3文字
      otherClass: false,
      imgHeight: "220rpx",
    };
  },
  methods: {
    formatData(item) {
      console.log(item, item.textDescription.length, "symptomPopuData");
      if (item.textDescription.length > 0) {
        this.contentShow = 3;
      }
      if (item.images.length > 0) {
        this.contentShow = 2;
        if (item.images.length > 2) {
          this.otherClass = true;
          this.imgHeight = "190rpx";
          item.images.splice(3);
        }
      }
      if (item.videos.length > 0) {
        this.contentShow = 1;
      }
      if (this.contentShow == 3) {
        this.textShow = true;
      } else if (this.contentShow == 2) {
        this.imgShow = true;
      } else {
        this.videoShow = true;
      }
      console.log(item, "item");
      this.showItem = item;
    },
    close() {
      this.contentShow = 0;
      this.videoShow = false;
      this.imgShow = false;
      this.textShow = false;
    },
    onImageClickHandle(index) {
      // url为objec数组, 此处需转换
      // let url = this.urls.map((item) => {
      //   return item.url;
      // });
      uni.previewImage({
        urls: this.showItem.images,
        current: index,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
