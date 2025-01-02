<script>
import GoodsServiceParamPopView from "@/pagesC/goodsServiceDetail/components/goodsServiceParamPopView.vue";
import GoodsServiceSpecsPopView from "@/pagesC/goodsServiceDetail/components/goodsServiceSpecsPopView.vue";
import { getLogisticsTemplate } from "@/api/mall";
import { mapState } from "vuex";
export default {
  name: "goodsSpecsV2",
  components: {
    GoodsServiceSpecsPopView,
    GoodsServiceParamPopView,
  },
  data() {
    return {
      logisticsTemplate: "",
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    goodsState: {
      type: Number,
      default: 1,
    },
    selectedSpecs: {
      type: String,
      default: "",
    },
    selectedSku: {
      type: Object,
      default: () => {},
    },
    activityId: {
      type: String,
      default: "",
    },
  },
  watch: {
    "$props.data.logisticsTemplate": {
      handler(newValue, oldValue) {
        this.logisticsTemplate = newValue || "";
        if (!this.userInfo.token) {
          this.logisticsTemplate = "填写收货地址，查看包邮政策";
          return;
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState(["userInfo"]),

    properties() {
      return this.data?.itemProperties || [];
    },
    propertiesString() {
      return this.properties.map((obj) => obj.propertyName).join("、");
    },
    // 是否新人免费商品
    isNewUserFreeGoods() {
      const { newPersonFlag, newPersonCountDownTime } = this.data;
      return newPersonFlag && newPersonCountDownTime > 0;
    },
    isCloudFlag() {
      return this.data?.cloudFlag || false;
    },
    safeguardTitleList() {
      return this.data?.officialGuaranteeList?.map((item) => item.ogMainText);
    },
  },
  emits: ["onSelectSpecs", "onShowSpecsParam", "onShowSafeguard"],
  methods: {
    async getLogisticsTemplate() {
      try {
        if (!this.userInfo.token) {
          this.logisticsTemplate = "填写收货地址，查看包邮政策";
          return;
        }
        const res = await getLogisticsTemplate({
          newPersonActivityId: this.activityId,
        });
        this.logisticsTemplate = res?.data?.data?.resultStr || "";
        console.log("----------", this.logisticsTemplate, res?.data?.data);
      } catch (e) {}
    },
    onItemClick() {
      if (this.logisticsTemplate) return;
      if (!this.userInfo.token) {
        this.goToLoginAction();
        return;
      }
      uni.navigateTo({
        url: "/pagesA/addressManagement/addressDetail/index?openType=add",
      });
    },
    onSelectSpecs() {
      this.$emit("onSelectSpecs");
    },
    onShowSpecsParam() {
      this.$emit("onShowSpecsParam");
    },
    onShowSafeguard() {
      this.$emit("onShowSafeguard");
    },
    goToLoginAction() {
      uni.navigateTo({
        url: `/pagesD/login/index`,
      });
    },
  },
  onUnload() {
    uni.$off("addAddressClickHandle");
  },
  mounted() {
    uni.$on("addAddressClickHandle", () => {
      this.getLogisticsTemplate();
    });
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="goods-rules">
      <view v-if="isCloudFlag" class="rules-item" @click="onShowSafeguard">
        <view class="left">
          <view class="label">保障</view>
          <view class="desc">
            <view
              class="desc-item"
              v-for="(item, index) in safeguardTitleList"
              :key="index"
            >
              <i class="iconfont icon-right iconRight"></i>
              <view class="text">{{ item }}</view>
            </view>
          </view>
        </view>
        <i class="iconfont icon-bearingRight"></i>
      </view>
      <view
        class="rules-item"
        v-if="!isNewUserFreeGoods"
        @click="onSelectSpecs"
      >
        <view class="left">
          <view class="label">选择</view>
          <view class="value">
            {{ selectedSpecs }}
          </view>
        </view>
        <i class="iconfont icon-bearingRight"></i>
      </view>
      <view class="rules-item" @click="onItemClick">
        <view class="left">
          <view class="label">物流</view>
          <view
            class="value"
            :class="[logisticsTemplate ? 'descColor1' : 'descColor2']"
          >
            {{
              logisticsTemplate
                ? logisticsTemplate
                : "填写收货地址，查看包邮政策"
            }}
          </view>
        </view>
      </view>
      <view
        class="rules-item last"
        v-if="properties.length"
        @click="onShowSpecsParam"
      >
        <view class="left">
          <view class="label">参数</view>
          <view class="value">
            {{ propertiesString }}
          </view>
        </view>
        <i class="iconfont icon-bearingRight"></i>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@import "@/utils/fn.scss";
.page-wrapper {
  background-color: #fff;
  border-radius: 23rpx;
  margin: 15.38rpx 15.38rpx 0;
  padding: 32rpx 15.38rpx 32rpx 23rpx;

  .goods-rules {
    .rules-item {
      display: flex;
      align-items: center;
      margin-bottom: 32rpx;
      justify-content: space-between;
      .left {
        display: flex;
      }
      .label {
        width: 85rpx;
        @include textfclaw(25rpx, #999, left, 35rpx);
      }
      .desc-right {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .desc {
        display: flex;
        align-items: center;
        max-width: 535rpx;
        overflow: hidden;
        white-space: nowrap;
        .desc-item {
          display: flex;
          align-items: center;
          @include textfclaw(25rpx, #1f1f1f, left, 35rpx);
          margin-right: 23.08rpx;
          .text {
            margin-left: 8rpx;
          }
        }
      }
      .value {
        max-width: 535rpx;
        overflow: hidden;
        white-space: nowrap;
        @include textfclaw(25rpx, #1f1f1f, left, 35rpx);
      }
    }
    .rules-item.last {
      margin-bottom: 0;
    }
    .descColor1 {
      color: #333;
    }
    .descColor2 {
      color: #1e95ea;
    }
    .iconfont {
      color: #999999;
    }
    .iconRight {
      font-size: 25rpx;
      color: #1f1f1f;
    }
  }
}
</style>
