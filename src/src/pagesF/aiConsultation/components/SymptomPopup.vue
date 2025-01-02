<template>
  <view>
    <!-- 视频-文字 -->
    <u-popup bgColor="transparent" :show="videoShow" mode="center">
      <view class="video-popup-box">
        <view v-if="videoShow" class="content-box">
          <view class="title">{{ showItem.diseaseName }}</view>
          <view class="video-box">
            <view
              class="in-vidoe-box"
              v-if="showItem.video == [] ? false : true"
            >
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
      console.log(item, "symptomPopuData");
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
// 视频-文字
.video-popup-box {
  position: relative;
  width: 600rpx;
  // background: #ccc;

  .content-box {
    background-color: #fff;
    border-radius: 40rpx;
    padding-bottom: 38rpx;
    .title {
      width: 600rpx;
      color: #1f1f1f;
      font-size: 32rpx;
      text-align: center;
      font-weight: bold;
      padding-top: 45rpx;
    }
    .video-box {
      height: 520rpx;
      margin-top: 20rpx;
      display: flex;
      justify-content: center;
      .in-vidoe-box {
        width: 540rpx;
        height: 500rpx;
        background-color: beige;
        border-radius: 8rpx;
        video {
          width: 540rpx;
          height: 500rpx;
          border-radius: 8rpx;
        }
      }
    }
    .description-text {
      color: #1f1f1f;
      font-size: 28rpx;
      width: 600rpx;
      max-height: 158rpx;
      padding: 0 50rpx 8rpx;
      display: -webkit-box;
      -webkit-line-clamp: 4; /* 控制显示的行数 */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .confirm {
      width: 520rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: #ffeea5;
      color: #1f1f1f;
      font-size: 32rpx;
      margin: 40rpx auto 0;
      border-radius: 44rpx;
    }
  }
  .close {
    margin: 40rpx auto 0;
    width: 64rpx;
    height: 64rpx;
    color: #fff;
    .image {
      width: 64rpx;
      height: 64rpx;
    }
  }
}
// 图片-文字
.img-popup-box {
  position: relative;
  width: 600rpx;
  // background: #ccc;

  .content-box {
    background-color: #fff;
    border-radius: 40rpx;
    padding-bottom: 38rpx;
    .title {
      width: 600rpx;
      color: #1f1f1f;
      font-size: 32rpx;
      text-align: center;
      font-weight: bold;
      padding-top: 45rpx;
    }
    .img-box {
      height: 220rpx;
      margin-top: 20rpx;
      display: flex;
      justify-content: center;
      .in-img-box {
        margin: 0 10rpx;
        .image {
          width: 200rpx;
          height: 200rpx;
          z-index: 9999; /* 设置层级 */
          border-radius: 8rpx;
        }
        .imageThree {
          z-index: 9999; /* 设置层级 */
          width: 160rpx;
          height: 160rpx;
          border-radius: 8rpx;
        }
      }
    }
    .description-text {
      color: #1f1f1f;
      font-size: 28rpx;
      width: 600rpx;
      max-height: 158rpx;
      padding: 0 50rpx 8rpx;
      display: -webkit-box;
      -webkit-line-clamp: 4; /* 控制显示的行数 */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .confirm {
      width: 520rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: #ffeea5;
      color: #1f1f1f;
      font-size: 32rpx;
      margin: 40rpx auto 0;
      border-radius: 44rpx;
    }
  }
  .close {
    margin: 40rpx auto 0;
    width: 64rpx;
    height: 64rpx;
    color: #fff;
    .image {
      width: 64rpx;
      height: 64rpx;
    }
  }
}
// 文字
.text-popup-box {
  position: relative;
  width: 600rpx;
  // background: #ccc;

  .content-box {
    background-color: #fff;
    border-radius: 40rpx;
    padding-bottom: 38rpx;
    .title {
      width: 600rpx;
      color: #1f1f1f;
      font-size: 32rpx;
      text-align: center;
      font-weight: bold;
      padding-top: 45rpx;
    }
    .description-text {
      color: #1f1f1f;
      font-size: 28rpx;
      width: 600rpx;
      max-height: 260rpx;
      overflow-y: auto;
      padding: 20rpx 50rpx 15rpx;
    }
    .confirm {
      width: 520rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: #ffeea5;
      color: #1f1f1f;
      font-size: 32rpx;
      margin: 40rpx auto 0;
      border-radius: 44rpx;
    }
  }
  .close {
    margin: 40rpx auto 0;
    width: 64rpx;
    height: 64rpx;
    color: #fff;
    .image {
      width: 64rpx;
      height: 64rpx;
    }
  }
}
</style>
