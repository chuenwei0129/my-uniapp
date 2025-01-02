<template>
  <view class="dad-wrapper">
    <scroll-view
      class="doc-list-wrapper"
      :scroll-y="!modalopen"
      @scrolltolower="scrolltolower"
      :scroll-top="scrollTop"
      @scroll="handleScroll"
    >
      <view class="head">
        <image src="" mode="scaleToFill" class="img" :src="detail.shopImage" />
      </view>
      <view class="shop">
        <view class="shop-info">
          <view class="name">{{ detail.shopName }}</view>
          <view class="address">{{ detail.address }}</view>
          <view class="icons">
            <view class="left">
              <view class="icon1 iconfont icon-address"></view>
              <view class="distance">距离你{{ detail.distance }}km</view>
              <view class="btn">
                <view class="text">离你最近</view>
              </view>
            </view>
            <view class="right">
              <view class="iphone-icon"></view>
              <view class="iphone-text">联系</view>
              <view class="navigation-icon"></view>
              <view class="navigation-text">导航</view>
            </view>
          </view>
        </view>

        <view :class="['content', ismore ? 'more' : '']">
          <view class="frame">
            <view class="title">门店简介</view>
            <view
              class="container"
              :class="[ismore ? 'container-more' : 'container-text']"
            >
              <view class="container-text" v-html="handleTxtMsgToHtml(msg)">
              </view>
            </view>
            <view class="more" @click="handleMore(true)" v-if="!ismore">
              <view class="text">查看更多</view>
              <view class="iconfont icon-outlineArrowDown"></view>
            </view>
            <view class="more" @click="handleMore(false)" v-else>
              <view class="text">收起</view>
              <view class="iconfont icon-outlineArrowUp"></view>
            </view>
          </view>
        </view>

        <view class="list-frame">
          <view class="title">预约服务</view>
          <view class="list-bg">
            <view
              :class="[
                'item-bg',
                index == 0 ? 'first' : '',
                index == list.length - 1 ? 'last' : '',
              ]"
              v-for="(item, index) in list"
              :key="index"
            >
              <view class="up">
                <image class="img" :src="item.pic" mode="scaleToFill" />
                <view class="info">
                  <view class="name">{{ item.skuName }}</view>
                  <view class="des">{{ item.skuName }}</view>
                  <view class="last">
                    <view class="price">¥{{ item.price }}</view>
                  </view>
                </view>
                <view class="btn" @click="handleReservation(item)">
                  <view class="text">预约</view>
                </view>
              </view>
              <view class="line" v-if="index < list.length - 1"> </view>
            </view>
          </view>
        </view>
        <view class="last-view" style="width: 100%; height: 52rpx"></view>
      </view>

      <!--        
        <view class="list-bg" >
          <view class="item-bg" v-for="(item, index) in list" :key="index">
            <image
              class="img"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/reservation/list-gou"
              mode="scaleToFill"
            />
            <view class="info">
             
            </view>
          </view>
        </view> -->
    </scroll-view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import DaDropdownVue2 from "../components/da-dropdown-vue2/index.vue";
import { GET_SHOP_DETAIL } from "@/api/reservation";

export default {
  //...wxShareMethod(),
  components: { DaDropdownVue2 },
  props: {},
  data() {
    return {
      list: [{}, {}, {}, {}, {}],
      msg: "1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1\r\n1",
      ismore: false,
      detail: {},
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  onLoad(option) {
    console.log("option - ", option);
    this.getShopDetail({
      shopId: option.shopId,
      currentLat: option.currentLat,
      currentLng: option.currentLng,
    });
  },
  methods: {
    handleReset() {},
    handleConfirm(data) {
      console.log("handleConfirm - ", data);
    },
    handleClose() {},
    handleOpen() {},
    scrolltolower() {},
    scrollTop() {},
    handleScroll() {},
    // 换行符处理
    handleTxtMsgToHtml(content) {
      content = content.replace(/\n/g, (lineStr) => {
        return lineStr.slice(1) + "<br />";
      });

      return content;
    },

    handleMore(ismore) {
      console.log("handleMore --");
      this.ismore = ismore;
    },

    async getShopDetail(params) {
      try {
        const res = await GET_SHOP_DETAIL(params);

        this.detail = res.data.data;
        this.list = this.detail.commodityListResponses;
        console.log("this.detail ", this.detail);
      } catch (e) {
        console.error("获取门店详情失败", e);
      }
    },

    handleReservation(info) {
      console.log("预约");
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
