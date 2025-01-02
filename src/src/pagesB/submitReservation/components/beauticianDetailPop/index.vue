<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="handleCancel"
    :round="20"
    @touchmove.stop.prevent
  >
    <view class="beauticianDetailPop">
      <view class="header">
        <view class="title">美容师介绍</view>
        <image
          class="cancel"
          @click="handleCancel"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/del.png"
          fit="contain"
        />
      </view>
      <scroll-view class="list" scroll-x="true">
        <view class="content">
          <view
            :class="[
              'beautyItem',
              newSelectedServiceId == item.serviceId ? 'selected' : '',
              item.reservationFull == 1 ? 'disabled' : '',
            ]"
            v-for="(item, index) in beauticianListData"
            @click="chooseBeautician(item.serviceId, item, index)"
            :key="item.serviceId"
          >
            <view class="buszy" v-if="item.reservationFull == 1"> 约满 </view>
            <view class="beauty_info">
              <view class="beauty_avater">
                <image class="avater" :src="item.pic" mode="scaleToFill" />
              </view>
              <view class="beauty_name">{{ item.name }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="beauty-dec">
        <view class="beauty-introduce">
          {{ dec || "" }}
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
import { beautyCarerDetail } from "@/api/reservation";
import { action_report, display_report } from "@/utils/track";
const module_name = "store";

export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    beauticianListData: {
      type: Array,
      default: () => [],
    },
    selectedServiceId: {
      type: String,
      default: "",
    },
    selectedServiceIndex: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    selectedServiceId(newVal) {
      this.newSelectedServiceId = newVal;
      this.newSelectedServiceIndex = this.selectedServiceIndex;
      this.selectedService = this.beauticianListData[this.selectedServiceIndex];
    },
    newBeauticianListData(newVal) {
      if (!this.selectedServiceId && newVal && newVal.length > 0) {
        this.newSelectedServiceIndex = 0;
        this.selectedService =
          this.beauticianListData[this.selectedServiceIndex];
        this.newSelectedServiceId =
          this.beauticianListData[this.selectedServiceIndex].serviceId;
        this.reservationFull = this.selectedService.reservationFull;
      }
    },
    isOpen(newVal) {
      if (newVal) {
        this.newBeauticianListData = this.beauticianListData;
      }
    },
  },
  data() {
    return {
      newSelectedServiceId: null,
      newSelectedServiceIndex: null,
      newBeauticianListData: [],
      selectedService: {},
      dec: null,
      reservationFull: 0, //判断是否约满
    };
  },
  computed: {},
  onLoad(options) {},
  onReady() {},
  methods: {
    async getDetail() {
      try {
        const res = await beautyCarerDetail({
          userId: this.newSelectedServiceId,
        });

        if (res.data && res.data.data) {
          this.dec = res.data.data.introduction;
        } else {
          console.log("API response data is null or undefined:", res);
          this.dec = ""; // 或者设置一个默认值
        }

        this.reservationFull = this.selectedService.reservationFull;
      } catch (error) {
        console.log("Error fetching detail:", error);
      }
    },
    handleOpen() {
      console.log("beautician detail show");
      display_report({
        display_name: "appointmentsubmit_beauticianbrief_show",
        object_type: module_name,
        extend: {},
      });
      this.getDetail();
    },
    handleCancel() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
      this.newSelectedServiceId = this.selectedServiceId;
      this.newSelectedServiceIndex = this.selectedServiceIndex;
      this.newBeauticianListData = [];
      this.dec = null;
    },
    handleAddSkuInfo() {
      if (this.selectedServiceId == this.newSelectedServiceId) return;
      if (this.reservationFull == 1) return;

      // this.$emit("update:isOpen", false);
      // this.$emit("close", false);
    },
    chooseBeautician(id, item, index) {
      // if (this.selectedServiceId == this.newSelectedServiceId) return;
      if (item.reservationFull == 1) return;
      console.log(item, "================================666");
      this.newSelectedServiceId = id;
      this.newSelectedServiceIndex = index;
      this.selectedService = item;
      this.$emit("confirm", this.newSelectedServiceId);
      this.getDetail();
      // 美容师选择埋点
      console.log("beautician detail choose");
      action_report({
        action_name: "appointmentsubmit_beauticianbrief_chose",
        module_name: module_name,
        extend: {
          serviceId: this.newSelectedServiceId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
