<template>
  <view @touchmove.stop.prevent="stopPrevent">
  <u-popup
    :safeAreaInsetBottom="false"
    :show="show"
    mode="bottom"
    :round="38"
    @close="close"
    @touchmove.stop.prevent
    @open="openClick"
  >
    <view class="customPopup">
      <view class="customPopup__head">
        <view class="customPopup__head__close" @click="close">
          <view class="iconfont icon-shutDown icon-col"></view>
        </view>
        <view class="customPopup__head__title">BCS评分(体型选择)</view>
      </view>
      <view class="customPopup__page"
        >{{ current + 1 }}/{{ bcsItems.length }}</view
      >
      <view class="customPopup__swiper">
        <swiper
          class="swiper"
          :autoplay="false"
          :current="current"
          @change="swiperChange"
          previous-margin="75rpx"
          next-margin="75rpx"
          :circular="true"
          :duration="duration"
        >
          <swiper-item v-for="(item, index) in bcsItems" :key="index">
            <view class="swiper-item">
              <view class="swiper-item-bg" :class="colorList[index]">
                <view class="swiper-item-box">
                  <image
                    class="swiper-item-box__image"
                    :src="item.shapeUrl"
                  ></image>
                </view>

                <view class="swiper-item-bg__shapeTitle">{{
                  item.shapeTitle
                }}</view>
                <view class="swiper-item-bg__shapeDesc">{{
                  item.shapeDesc
                }}</view>
                <image
                  class="currently"
                  :src="
                    current === index
                      ? currentlySelectedSrc
                      : noCurrentlySelectedsrc
                  "
                ></image>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
      <view class="customPopup__btn" @click="confirmClick()">
        <view class="confirm">确定</view>
      </view>
    </view>
  </u-popup>
</view>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    bcsItems: {
      type: Array,
      default: [],
    },
    bcsShapeType: {
      type: String,
      default: '',
    },
    healthyCode:{
      type: String,
      default: '',
    },
    petId:{
      type: String,
      default: '',
    }
  },
  data () {
    return {
      current: 1,
      colorList: [
        'swiper-item-green',
        'swiper-item-blue',
        'swiper-item-yellow',
        'swiper-item-purple',
        'swiper-item-pink',
      ],
      currentlySelectedSrc: "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/currentlySelected.png",
      noCurrentlySelectedsrc: "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/noCurrentlySelected.png",
      duration: '0'
    };
  },
  mounted () {

  },
  methods: {
    stopPrevent(){
      return
    },
    openClick () {
      //曲线处理swiper 首次加载左侧空白问题  以及处理回显效果
      let index = 0
      // this.duration === '0'
      if (this.bcsShapeType) {
        index = this.bcsItems.findIndex(person => person.shapeType === this.bcsShapeType);
      }
      console.log('openClick', this.duration, this.bcsShapeType, index)
      this.current = index
      this.$nextTick(() => {
        this.duration = '500'
      })

    },
    swiperChange (event) {
      console.log(event.detail);
      let { current, source } = event.detail
      this.current = current
    },
    close () {
      this.duration = '0'
      this.$emit("update:show", false);
      this.$emit("close", false);
    },
    confirmClick () {
      let item = this.bcsItems[this.current]
      this.$emit("confirmsClick", item);
      if(this.healthyCode){
      // 在宠物档案页填写bcs
      action_report({
        action_name: "petfiles_add_bcs",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
          pet_id: this.petId,
        },
      });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.customPopup {
  height: 1212rpx;
  background-color: #fff;
  border-radius: 38rpx;
  &__head {
    position: relative;
    width: 100%;
    height: 115rpx;
    border-radius: 38rpx;
    @include flex();
    &__close {
      position: absolute;
      top: 29rpx;
      right: 29rpx;
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      background: #ecedf1;
      @include flex();
      .icon-col {
        width: 31rpx;
        height: 31rpx;
        color: #000;
      }
    }
    &__title {
      height: 38rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 35rpx;
      color: #1f1f1f;
      line-height: 38rpx;
      text-align: center;
      font-style: normal;
    }
  }
  &__page {
    width: 100%;
    height: 90rpx;
    @include flex();
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-size: 31rpx;
    color: #333333;
  }
  &__swiper {
    width: 100%;
    height: 800rpx;
    .swiper {
      height: 100%;
      .swiper-item {
        height: 100%;
        padding: 0 15.5rpx;
        width: 100%;
        background-color: #fff;

        .swiper-item-bg {
          position: relative;
          width: 100%;
          height: 100%;
          // background-color: #e9fffc;
          padding: 31rpx 31rpx 0;
          border-radius: 31rpx;
          .swiper-item-box {
            background-color: #fff;
            border-radius: 31rpx;
            &__image {
              width: 100%;
              height: 473rpx;
              border-radius: 31rpx;
            }
          }
          &__shapeTitle {
            width: 100%;
            text-align: center;
            margin-top: 35rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 35rpx;
            color: #000000;
          }
          &__shapeDesc {
            font-weight: 400;
            font-size: 27rpx;
            color: #666666;
            width: 100%;
            text-align: left;
            margin-top: 15rpx;
            padding: 0 19rpx;
          }
          .currently {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 58rpx;
            height: 58rpx;
          }
        }
        .swiper-item-green {
          background: #e9fffc !important;
        }
        .swiper-item-blue {
          background: #e7f4ff !important;
        }
        .swiper-item-yellow {
          background: #fff2e5 !important;
        }
        .swiper-item-purple {
          background: #edecff !important;
        }
        .swiper-item-pink {
          background: #fdecff !important;
        }
      }
    }
  }
  &__btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 38rpx 65rpx;
    // padding-bottom: 65rpx;
    .confirm {
      width: 673rpx;
      height: 85rpx;
      background: #fee900;
      border-radius: 42rpx;
      @include flex();
      font-weight: 500;
      font-size: 31rpx;
      color: #1f1f1f;
    }
  }
}
</style>
