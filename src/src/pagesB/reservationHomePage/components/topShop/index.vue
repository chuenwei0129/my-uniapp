<template>
  <view class="topshop-home-wrapper">
    <view
      class="shop-header-image"
      @click="
        () => {
          clickImg(shopInfo.shopImages[0], shopInfo.shopImages);
        }
      "
    >
      <image :src="shopInfo.shopImages[0]" mode="aspectFill" class="cover" />
    </view>
    <view class="shop-info">
      <view class="shopname">{{ shopInfo.shopName || "" }}</view>
      <view class="shopaddr">{{ shopInfo.address || "" }}</view>
      <view class="distanceinfo" v-if="shopInfo.distance">
        <view class="iconfont icon-address"></view>
        <view
          >距离你{{
            Number(shopInfo.distance) > 1000
              ? (Number(shopInfo.distance) / 1000).toFixed(1) + "km"
              : shopInfo.distance + "m"
          }}</view
        >
        <view class="closettag" v-if="closet">离你最近</view>
        <view class="changeshopicon" @click.stop="changeShop">
          <view class="changeicon"></view>
          切换门店
        </view>
      </view>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import { mapState, mapMutations } from "vuex";
import { action_report } from "@/utils/track";
const module_name = "store";
export default {
  //...wxShareMethod(),
  components: {},
  props: {
    shopInfo: {
      type: Object,
      default: {
        distance: "",
      },
    },
    closet: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(["setIsChooseImage"]),
    clickImg(current, urls) {
      var that = this;
      action_report({
        action_name: "appointment_list_storepicture_clk",
        module_name: module_name,
        extend: {
          shopId: this.shopInfo.shopId,
          shopName: this.shopInfo.shopName,
        },
      });
      this.setIsChooseImage(true);
      uni.$emit("previewImgLock", true);

      uni.previewImage({
        urls: urls, //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: current, // 当前显示图片的http链接，默认是第一个
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {
          that.setIsChooseImage(false);
        },
      });
    },
    changeShop() {
      action_report({
        action_name: "appointment_list_changestore_clk",
        module_name: module_name,
        extend: {
          shopId: this.shopInfo.shopId,
          shopName: this.shopInfo.shopName,
        },
      });
      uni.navigateTo({
        url: `/pagesB/changeReservationShop/index?shopId=${this.shopInfo.shopId}&cityCode=${this.shopInfo.cityCode}`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
