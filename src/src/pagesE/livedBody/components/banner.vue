<template>
    <view class="customer-banner-wrap" :style="showStyle" v-if="bannerList.length">
        <swiper class="swiper" circular :autoplay="true" :interval="5000" :duration="500" @change="handleAdChanged" style="height: 127rpx;border-radius: 23rpx;overflow: hidden;">
            <swiper-item v-for="(item, index) in bannerList" :key="index" style="height: 127rpx;border-radius: 23rpx;overflow: hidden">
                <view class="swiper-item" @click="bannerJump(item, index)">
                    <image style="width: 100%; height: 127rpx;" :src="item.material.url" mode="aspectFill"></image>
                </view>
            </swiper-item>
        </swiper>
        <!-- 面板指示点 -->
        <view v-if="bannerList.length > 1" class="ad-indicator">
          <view class="ad-indicator-wrapper">
            <view
              v-for="ad in bannerList"
              :class="[
                'indicator-item',
                bannerList[currentAdIndex].id === ad.id
                  ? 'indicator-item-selected'
                  : '',
              ]"
              :key="ad.id"
            />
          </view>
        </view>
    </view>
</template>

<script>
import { adRouteGo } from "@/utils/index";
import { getBannerData } from '@/api/home'
import { action_report, display_report } from "@/utils/track";
export default {
    name: 'bannerSwiper',
    data() {
        return {
            bannerList: [],
            currentAdIndex: 0,
        }
    },
    props: {
        bannerKey: {
            type: String,
            default: '',
            require: true
        },
        bannerStyle: {
            type: String
        },
        moduleName: {
            type: String,
            default: '',
            require: true
        },
        actionName: {
            type: String,
            default: '',
            require: true
        },
        displayName: {
            type: String,
            default: '',
            require: true
        }
    },
    mounted() {
        this.getBannerList()
    },
    computed: {
        showStyle() {
            return this.bannerStyle
        }
    },
    methods: {
        async getBannerList() {
            try {
                const res = await getBannerData({
                    key: this.bannerKey,
                    cityCode: uni.getStorageSync("cityCode"),
                })
                this.bannerList = res.data?.map(item => {
                    const { id: ad_id, title: ad_name } = item.content
                    display_report({
                        display_name: this.displayName,
                        object_type: this.moduleName,
                        extend: { ad_name, ad_id }
                    })
                    return item.content
                })
            } catch (error) {
                this.bannerList = []
            }
        },
        handleAdChanged(e) {
            const { current } = e.detail;
            this.currentAdIndex = current;
        },
        bannerJump(item, index) {
            const { route, id: ad_id, title: ad_name } = item
            adRouteGo(route);
            action_report({
                action_name: this.actionName,
                module_name: this.moduleName,
                extend: { ad_name, ad_id },
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.customer-banner-wrap {
    width: 719rpx !important;
    height: 127rpx;
    margin: 0 auto;
    position: relative;
    border-radius: 23rpx; 
    .swiper .swiper-item {
        height: 127rpx !important;
        overflow: hidden;
    }
    swiper-item {
        border-radius: 23rpx; 
    }
    .swiper-item {
        // display: flex;
        // justify-content: center;
        // background: red;
        border-radius: 23rpx; 
        > view {
            border-radius: 23rpx; 
        }
        image {
            border-radius: 23rpx; 
        }
    }
    .ad-indicator {
      position: absolute;
      width: 100%;
      height: 0;
      bottom: 15rpx;
      .ad-indicator-wrapper {
        display: flex;
        justify-content: center;
        position: absolute;
        width: 100%;
        // top: -15rpx;
        .indicator-item {
          width: 12rpx;
          height: 4rpx;
          border-radius: 4rpx;
          background-color: #ccc;
          margin: 0 2rpx;
        //   opacity: 0.25;
        //   border: 1rpx solid rgba(255, 255, 255, 0.63);
        }
        .indicator-item-selected {
          background: #1f1f1f;
        //   border: 1rpx solid #1f1f1f;
        //   opacity: 1 !important;
        }
        // .indicator-item + .indicator-item {
        //   margin-left: 6rpx;
        // }
      }
    }
}
</style>