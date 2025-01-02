<template>
  <view>
    <view class="cell" @click="onItemClick">
      <view class="cell-title">配送方式</view>
      <view class="cell-desc01" v-if="commodityType">到店自提</view>
      <view class="cell-desc" v-else>
        <view
          :class="['tag-item', item.actived ? 'tag-item-actived' : '']"
          v-for="(item, index) in tagList"
          :key="index"
          @click="handleCheckTag(index)"
          >{{ item.name }}</view
        >
      </view>
    </view>
    <!-- 同城小于5公里 配送到家 当天21:00后下单，预计明日送达  -->
    <!-- 同城大于5公里 快递发货 当天17:00下单前 预计7月13号送达， 后=>  预计7月14号送达-->
    <view v-if="commodityType">
      <view class="pickup-panel">
        <view class="pp-item" style="margin-bottom: 23rpx">
          <view class="pp-title">自提点</view>
          <view class="pp-desc">{{
            comSelfCheckoutInfo.selfCheckoutAddress.shopName
          }}</view>
        </view>
        <view class="add-detail">
          <view class="content">
            {{
              comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.address
            }}
          </view>
          <view class="nav" @tap="$u.debounce(handleOpenNav, 500)">
            <view class="nav-icon">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_navigator.png"
                class="icon"
              ></image>
            </view>
            <text class="nav-text">导航</text>
          </view>
        </view>
        <view class="pp-item" style="margin-bottom: 38rpx">
          <view class="pp-title">提货人手机号</view>
          <view class="pp-desc-phone">
            <view>
              <u--input
                placeholder="请输入手机号"
                border="none"
                inputAlign="right"
                color="#1F1F1F"
                type="number"
                v-model="comSelfCheckoutInfo.selfCheckoutPhone"
                class="phone-input"
                maxlength="11"
                :customStyle="{ width: '225rpx', paddingRight: '11rpx' }"
                @change="phoneChange"
                placeholderStyle="fontSize: 25rpx !important;color: #B0B0B0;fontWeight: 400;"
              ></u--input>
            </view>
            <view class="iconfont icon-edit"></view>
          </view>
        </view>
        <view class="pp-item">
          <view class="pp-title">提货时间</view>
          <view class="pp-desc-time">
            <view @click="handleOpenChoosetime">
              {{ comSelfCheckoutInfo.selfCheckoutTimeStr }}
            </view>
            <view
              @click="handleOpenChoosetime"
              class="iconfont icon-arrowRight"
            ></view>
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view
        v-if="tagList.findIndex((i) => i.actived) == 0"
        class="delivery-policy"
      >
        <view class="deliveryPolicy"> {{ deliveryPolicy }}</view>
      </view>
      <view
        class="pickup-panel"
        v-if="tagList.findIndex((i) => i.actived) == 1"
      >
        <view class="pp-item" style="margin-bottom: 23rpx">
          <view class="pp-title">自提点</view>
          <view class="pp-desc">{{
            comSelfCheckoutInfo.selfCheckoutAddress.shopName
          }}</view>
        </view>
        <view class="add-detail">
          <view class="content">
            {{
              comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.address
            }}
          </view>
          <view class="nav" @tap="$u.debounce(handleOpenNav, 500)">
            <view class="nav-icon">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_navigator.png"
                class="icon"
              ></image>
            </view>
            <text class="nav-text">导航</text>
          </view>
        </view>
        <view class="pp-item" style="margin-bottom: 38rpx">
          <view class="pp-title">提货人手机号</view>
          <view class="pp-desc-phone">
            <view>
              <u--input
                placeholder="请输入手机号"
                border="none"
                inputAlign="right"
                color="#1F1F1F"
                type="number"
                v-model="comSelfCheckoutInfo.selfCheckoutPhone"
                class="phone-input"
                maxlength="11"
                :customStyle="{ width: '225rpx', paddingRight: '11rpx' }"
                @change="phoneChange"
                placeholderStyle="fontSize: 25rpx !important;color: #B0B0B0;fontWeight: 400;"
              ></u--input>
            </view>
            <view class="iconfont icon-edit"></view>
          </view>
        </view>
        <view class="pp-item">
          <view class="pp-title">提货时间</view>
          <view class="pp-desc-time">
            <view @click="handleOpenChoosetime">
              {{ comSelfCheckoutInfo.selfCheckoutTimeStr }}
            </view>
            <view
              @click="handleOpenChoosetime"
              class="iconfont icon-arrowRight"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <deliveryTimePop
      :isOpen.sync="isShowTimePop"
      @confirm="handlePrivacyClose"
      :selfCheckoutDateList="comSelfCheckoutInfo.selfCheckoutDateList"
      :selfCheckoutStartTime="comSelfCheckoutInfo.selfCheckoutStartTime"
    />
  </view>
</template>
<script>
import deliveryTimePop from "../deliveryTimePop/index.vue";
export default {
  components: {
    deliveryTimePop,
  },
  props: {
    selfCheckoutInfo: {
      type: Object,
    },
    deliveryPolicy: {
      type: String,
    },
    cartShopList: {
      type: Object,
    },
    checkAlienPetType: {
      type: Boolean,
      default: true,
    },
    commodityType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tagList: [
        { name: "配送到家", actived: true },
        { name: "快递发货", actived: true },
        { name: "到店自提", actived: false },
      ],
      navUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/navigationIcon.png",
      // formData: {
      //   phone: "11212121212",
      //   time: "",
      // },
      isShowTimePop: false,
      comSelfCheckoutInfo: {},
      dateActivatedIndex: 0,
      timeActivatedIndex: 0,
      isHomeDelivery: false,
      // deliveryType: 2,
    };
  },
  watch: {
    selfCheckoutInfo: {
      handler(newVal, oldVal) {
        this.comSelfCheckoutInfo = newVal;
        console.log("🚀 ~ handler ~ newVal:", newVal);
      },
      deep: true,
    },
    isShowTimePop: {
      handler(newVal, oldVal) {
        this.$emit("isShowTimePop", newVal);
      },
    },
    formatDate() {},
    cartShopList: {
      handler(newVal, oldVal) {
        if (newVal && newVal.deliveryType == 2) {
          this.tagList = [
            { name: "快递发货", actived: true },
            { name: "到店自提", actived: false },
          ];
        } else if (newVal && newVal.deliveryType == 1) {
          this.tagList = [
            { name: "配送到家", actived: true },
            { name: "到店自提", actived: false },
          ];
        }
      },
      immediate: true,
      deep: true,
    },
    checkAlienPetType: {
      handler(newVal, oldVal) {
        if (!newVal && this.commodityType) {
          this.tagList = [
            // { name: "快递发货", actived: true },
            { name: "到店自提", actived: true },
          ];
        }
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // this.setHomeDelivery();
  },
  mounted() {},
  onLoad(options) {},

  computed: {},
  emits: ["onItemClick"],
  methods: {
    onItemClick() {
      this.$emit("onItemClick");
    },
    setHomeDelivery() {
      console.log("this.cartShopList=>>>>>>>>>>>>>>>>", this.cartShopList);
      if (this.cartShopList.deliveryType == 2) {
        this.tagList.shift();
      } else if (this.cartShopList.deliveryType == 1) {
        this.tagList.splice(1, 1);
      }
    },
    handleCheckTag(i) {
      let nowAIndex = this.tagList.findIndex((i) => i.actived);
      if (i == nowAIndex) return;
      this.tagList = this.tagList.map((item, index) => {
        if (i == index) {
          return {
            ...item,
            actived: true,
          };
        } else {
          return {
            ...item,
            actived: false,
          };
        }
      });
      /**
       * 0 : 1 同城配送 1:4自提
       */
      let indexEnum = {
        0: 1,
        1: 4,
      };
      this.$emit("changeDeliveryType", indexEnum[i]);
    },
    handleOpenChoosetime() {
      this.isShowTimePop = true;
    },
    handlePrivacyClose(e) {
      console.log("时间列表", e, this.comSelfCheckoutInfo.selfCheckoutDateList);
      this.isShowTimePop = false;
      let left =
        this.comSelfCheckoutInfo.selfCheckoutDateList[e.dateActivatedIndex];
      let right = left.selfCheckoutTimeList[e.timeActivatedIndex];
      this.dateActivatedIndex = e.dateActivatedIndex;
      this.timeActivatedIndex = e.timeActivatedIndex;
      this.$emit("updataDeliveryInfo", {
        selfCheckoutPhone: this.comSelfCheckoutInfo.selfCheckoutPhone,
        selfCheckoutStartTime: right.selfCheckoutStartTime,
        selfCheckoutEndTime: right.selfCheckoutEndTime,
      });
    },
    phoneChange(e) {
      let left =
        this.comSelfCheckoutInfo.selfCheckoutDateList[this.dateActivatedIndex];
      let right = left.selfCheckoutTimeList[this.timeActivatedIndex];
      this.$emit("updataDeliveryInfo", {
        selfCheckoutPhone: e,
        selfCheckoutStartTime: right.selfCheckoutStartTime,
        selfCheckoutEndTime: right.selfCheckoutEndTime,
      });
    },
    handleOpenNav() {
      console.log('handleOpenNav',this.comSelfCheckoutInfo.selfCheckoutAddress);
      
      // #ifdef MP-WEIXIN
      uni.openLocation({
        latitude: Number(
          this.comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.lat
        ),
        longitude: Number(
          this.comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.lon
        ),
        name: this.comSelfCheckoutInfo.selfCheckoutAddress.shopName,
        address:
          this.comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.address,
        success: function (res) {},
        fail: function (res) {},
      });
      // #endif
      // #ifdef H5
      //targetName 目的地名称
      // targetAddress 目的地地址
      // targetImg  目的地图片
      // targetLat 目的地纬度
      // targetLng 目的地经度
      let lat = Number(
        this.comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.lat
      );
      let lon = Number(
        this.comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.lon
      );
      let targetName = this.comSelfCheckoutInfo.selfCheckoutAddress.shopName;
      let targetAddress =
        this.comSelfCheckoutInfo.selfCheckoutAddress.shopAddressInfo.address;
      let targetImg = "";
      console.log('目的地纬度',lat,lon);
      
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/address/navigation/map?targetName=${targetName}&targetAddress=${targetAddress}&targetImg=${targetImg}&targetLat=${lat}&targetLng=${lon}`,
      });
      // #endif
    },
  },
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
