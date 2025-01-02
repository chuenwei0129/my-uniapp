<script>
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
import GoodsServiceParamPopView from "@/pagesC/goodsServiceDetail/components/goodsServiceParamPopView.vue";
import GoodsServiceSpecsPopView from "@/pagesC/goodsServiceDetail/components/goodsServiceSpecsPopView.vue";
import { getLogisticsTemplate } from "@/api/mall";
import { mapState } from "vuex";

export default {
  name: "goodsServiceSpecsParam",
  components: {
    GoodsServiceSpecsPopView,
    GoodsServiceParamPopView,
    CellItemNormal,
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
        console.log("🚀 ~ newValue:", newValue);
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
  },
  emits: ["onSelectSpecs", "onShowSpecsParam"],
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
      console.log("-------------addAddressClickHandle----------------");
      this.getLogisticsTemplate();
    });
    console.log(this.$props.data.logisticsTemplate);
  },
};
</script>

<template>
  <view class="page-wrapper">
    <view class="goods-desc">
      <CellItemNormal
        v-if="!isNewUserFreeGoods"
        title="已选"
        :desc="selectedSpecs"
        :showArrow="true"
        :oneline="true"
        @onItemClick="onSelectSpecs"
      />
      <CellItemNormal
        title="物流"
        :desc="
          logisticsTemplate ? logisticsTemplate : '填写收货地址，查看包邮政策'
        "
        :descColor="logisticsTemplate ? '#333333' : '#1E95EA'"
        :showArrow="!logisticsTemplate"
        @onItemClick="onItemClick"
      />
      <CellItemNormal
        v-if="properties.length"
        title="参数"
        :desc="propertiesString"
        :isLast="true"
        :showArrow="true"
        oneLine
        @onItemClick="onShowSpecsParam"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
.page-wrapper {
  background-color: #fff;
  border-radius: 16rpx;
  margin: 15.38rpx 16rpx 0;
}
</style>
