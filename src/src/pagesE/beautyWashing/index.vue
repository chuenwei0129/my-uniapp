<template>
  <view
    class="page-wrapper"
    :class="{
      p160: isSign,
    }"
    v-if="shopInfo"
  >
    <view class="header-top">
      <div class="bar" :style="{ height: statusBarHeight }"></div>

      <div class="bar-c">
        <view class="return" @click="handleReturn"></view>
        <view class="status-text">
          <image :src="getSrc(info.status).img" mode="scaleToFill" />
          <view>{{ getSrc(info.status).text }}</view>
        </view>
      </div>
    </view>
    <div class="block"></div>
    <div class="content">
      <div class="shop-card">
        <div class="header-info">
          <div class="ll">
            <view class="shop-name">
              <text>{{ shopInfo.shopName }}</text>
            </view>
            <view class="shop-bottom">
              <view class="shop-address">
                {{ shopInfo.address }}
              </view>
              <!-- <view class="shop-distance">
                {{ distance }}
              </view> -->
            </view>
          </div>

          <view class="rr">
            <view
              class="shop-additional-item"
              @tap="$u.debounce(handleNavigateShop, 500)"
            >
              <view class="shop-item-back">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_navigator.png"
                />
              </view>
              <text>导航</text>
            </view>
            <view
              class="shop-additional-item"
              @tap="$u.debounce(handleCallPhone, 500)"
            >
              <view class="shop-item-back">
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/in_store_service_phone.png"
                />
              </view>
              <text>电话</text>
            </view>
          </view>
        </div>
        <div class="goods-card">
          <div class="goodsimg">
            <image :src="info.commodityDetailResponse.pic" />
          </div>
          <div class="name-card">
            <div class="name">
              {{ info.commodityDetailResponse.skuName }}
            </div>
            <div
              v-if="
                info.commodityDetailResponse &&
                info.commodityDetailResponse.price !== null
              "
              class="price"
            >
              <text class="pp">¥</text>
              {{ info.commodityDetailResponse.price }}
            </div>
          </div>
          <div v-if="info.status == 40" class="status">
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/finish-mx.png"
              mode="scaleToFill"
            />
          </div>
        </div>
        <div v-if="info.status != 40" class="server-info">
          <div class="server-item">
            <div class="lable">预约时间</div>
            <div class="text">
              {{ showTime(info.reservationBeginTime) }}
            </div>
          </div>
        </div>
        <div class="server-info">
          <div class="server-item">
            <div class="lable">美容师</div>

            <div class="text text2">
              <image class="petImg" :src="info.servicePic" mode="scaleToFill" />

              {{ info.serviceName || "-" }}
            </div>
          </div>
        </div>
        <div class="server-info">
          <div class="server-item">
            <div class="lable">服务宠物</div>
            <div class="text text2">
              <image class="petImg" :src="info.petPic" mode="scaleToFill" />
              {{ info.petName }}
            </div>
          </div>
        </div>
        <div class="server-info">
          <div class="server-item">
            <div class="lable">宠物体重</div>
            <div class="text">{{ info.petWeight ? info.petWeight : 0 }}KG</div>
          </div>
        </div>

        <div v-if="renderAddGoods(info)" class="server-info">
          <div class="server-item">
            <div class="lable">服务增项</div>
            <div class="text">{{ renderAddGoods(info) }}</div>
          </div>
        </div>
        <div v-if="info.status != 40" class="server-info">
          <div class="server-item server-item2">
            <div class="lable">备注</div>
            <div class="text text-remark">
              {{ info.userRemark || "-" }}
            </div>
          </div>
        </div>
        <template v-if="isOpen">
          <div class="server-info">
            <div class="server-item">
              <div class="lable">服务用时</div>
              <div class="text">{{ info.actualTime }}分钟</div>
            </div>
          </div>
          <div v-if="info.reservationBeginTime" class="server-info">
            <div class="server-item">
              <div class="lable">开始时间</div>
              <div class="text">{{ showTime(info.confirmTime) }}</div>
            </div>
          </div>
          <div v-if="info.reservationEndTime" class="server-info">
            <div class="server-item">
              <div class="lable">完成时间</div>
              <div class="text">{{ showTime(info.finishTime) }}</div>
            </div>
          </div>
          <div class="server-info">
            <div class="server-item server-item2">
              <div class="lable">备注</div>
              <div class="text text-remark">
                {{ info.userRemark || "-" }}
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="isOpen && info.status == 40"
          @click="handleOpen(false)"
          class="close"
        >
          收起
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/arr_up.png"
          />
        </div>
        <div
          v-if="!isOpen && info.status == 40"
          @click="handleOpen(true)"
          class="open"
        >
          更多
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/arr_down.png"
          />
        </div>
      </div>
      <div v-if="[20, 40].includes(info.status)" class="work-card">
        <div
          class="title"
          :style="{
            paddingBottom:
              info.reservationRecordResponse &&
              info.reservationRecordResponse.comment
                ? ''
                : '31rpx',
          }"
        >
          美容师服务记录
        </div>
        <div
          v-if="
            info.reservationRecordResponse &&
            info.reservationRecordResponse.comment
          "
          class="record"
        >
          {{
            info.reservationRecordResponse.comment
              ? info.reservationRecordResponse.comment
              : "暂无记录"
          }}
        </div>
        <div
          v-if="
            ([20, 40].includes(info.status) &&
              info.reservationRecordResponse &&
              info.reservationRecordResponse.beforeImgs) ||
            ([20, 40].includes(info.status) &&
              info.reservationRecordResponse &&
              info.reservationRecordResponse.afterImgs)
          "
          class="phone-card"
        >
          <div
            v-if="
              info.reservationRecordResponse &&
              info.reservationRecordResponse.beforeImgs
            "
            class="before"
          >
            <div class="before-header">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/before.png"
                mode="scaleToFill"
              />
            </div>
            <scroll-view
              :enable-flex="true"
              :scroll-x="true"
              class="before-con"
            >
              <div class="vi">
                <image
                  v-for="pi in info.reservationRecordResponse.beforeImgs"
                  :key="pi"
                  :src="pi"
                  @click="previewShopImages(pi)"
                  class="phone-item"
                  mode="scaleToFill"
                />
              </div>
            </scroll-view>
          </div>
          <div
            v-if="
              info.reservationRecordResponse &&
              info.reservationRecordResponse.afterImgs
            "
            class="after"
          >
            <div class="after-header">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/after.png"
                mode="scaleToFill"
              />
            </div>
            <!-- :enable-flex="true" -->
            <scroll-view class="after-con" :enable-flex="true" :scroll-x="true">
              <div class="vi">
                <image
                  v-for="pii in info.reservationRecordResponse.afterImgs"
                  :key="pii"
                  :src="pii"
                  @click="previewShopImages(pii)"
                  class="phone-item"
                  mode="scaleToFill"
                />
              </div>
            </scroll-view>
          </div>
        </div>
        <div v-else class="empty-phone">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/phone-empty.png"
            mode="scaleToFill"
          />
          <view class="text">美容师正在竭尽全力上传您的爱宠靓照～</view>
        </div>
      </div>
    </div>
    <div v-if="isSign" class="sign">
      <view class="sign-btn" @click="handleToSign">到店签到</view>
    </div>
    <Responsibility
      :isOpen.sync="isResponsibilityShow"
      :signBookWord="signBookWord"
      @close="handleResponsibilityClose"
      :info="info"
    />
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getMxList, getMxDetail } from "@/api/index";
import { postSignIn, postSignInBook } from "@/api/reservation";

//import { wxShareMethod } from "@/utils/wxShare";
import dayjs from "dayjs";
import Responsibility from "./components/responsibility";
export default {
  // #ifdef MP-WEIXIN
  //...wxShareMethod(),
  // #endif
  components: {
    Responsibility,
  },
  data() {
    return {
      infoId: "",
      pageScrollState: false,
      statusBarHeight: "",
      shopInfo: "",
      isOpen: false,
      info: "",
      isSign: false,
      isResponsibilityShow: false,
      signBookWord: "",
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      userPetList: (state) => state.userPetList,
    }),
  },
  onLoad(option) {
    if (option.id) {
      this.infoId = option.id;
      this.handleGetDetail();
    }
  },
  onReady() {},
  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        console.log("res ", res);
        //#ifdef MP-WEIXIN
        this.statusBarHeight = res.statusBarHeight + "px";
        //#endif
        //#ifdef H5
        this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
        //#endif
      },
    });
  },
  methods: {
    // ...mapMutations(["setUserInfo", "setUserSelectedPetId"]),
    handleGetDetail() {
      getMxDetail({
        reservationId: this.infoId,
        currentLat: uni.getStorageSync("lat"),
        currentLng: uni.getStorageSync("lon"),
      }).then((res) => {
        console.log("🚀 ~ onLoad ~ res:", res);
        this.info = res.data.data;
        this.shopInfo = res.data.data.shopDetail;
        this.isSign = res.data.data.viewSignInBtn;
        postSignInBook({ storeId: this.info.shopId }).then((res) => {
          console.log("🚀 ~ postSignIn ~ res:", res);
          this.signBookWord = res.data.data.riskReminder;
        });
      });
    },
    async getInfoDetail() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };

      let lss = await getMxList({
        ...params,
        reservationType: 1,
        userId: uni.getStorageSync("storage_info").userId,
        petId: this.petId,
      });
    },
    handleOpen(v) {
      this.isOpen = v;
    },
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
    handleNavigateShop() {
      //#ifdef H5
      const { lat, lng, shopName, address } = this.shopInfo;
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/address/navigation/map?targetName=${shopName}&targetAddress=${address}&targetLat=${lat}&targetLng=${lng}`,
      });
      //#endif
      //#ifdef MP-WEIXIN
      uni.openLocation({
        latitude: this.shopInfo.lat,
        longitude: this.shopInfo.lng,
        name: this.shopInfo.shopName,
        address: this.shopInfo.address,
        success: function (res) {},
      });

      //#endif
    },
    showTime(time) {
      let show_day = new Array(
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六"
      );

      return `${dayjs(time).format("YYYY-MM-DD")} ${
        show_day[dayjs(time).format("d")]
      } ${dayjs(time).format("HH:mm")}`;
    },
    handleCallPhone() {
      uni.makePhoneCall({
        phoneNumber: this.shopInfo.shopPhone,
      });
    },
    handleResponsibilityClose() {},
    handleToSign() {
      postSignIn({ reservationId: this.infoId }).then((res) => {
        console.log("🚀 ~ postSignIn ~ res:", res);
        uni.showToast({
          icon: "none",
          title: "签到成功",
          duration: 1000,
        });
        // #ifdef H5
        if (this.signBookWord) {
          this.isResponsibilityShow = true;
        }
        this.handleGetDetail();
        // #endif
        // #ifdef MP-WEIXIN
        uni.requestSubscribeMessage({
          tmplIds: [
            "vXiMmduYPxdVlcgw8xCCqYks83hj37XY5g1Hqr7k1nU",
            "7y8S3xJW78FZFL6gN9th0ng5xotPU2avbqz4I_7HB2I",
            "5eO4lSHq3REs3nFmsjD66FFuH3Q0o1-xIt9eQto7chw",
          ],
          complete: () => {
            if (this.signBookWord) {
              this.isResponsibilityShow = true;
            }
            this.handleGetDetail();
          },
        });
        // #endif
      });
    },

    getSrc(i) {
      const srcObj = {
        "-10": {
          img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/status1.png",
          text: "已取消",
        },
        "-20": {
          img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/status1.png",
          text: "预约失败",
        },
        0: {
          img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/status4.png",
          text: "待到店",
        },
        10: {
          img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/status4.png",
          text: "待服务",
        },
        20: {
          img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/status2.png",
          text: "服务中",
        },
        40: {
          img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/status5.png",
          text: "已完成",
        },
        "-30": {
          img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/casehistory/status4.png",
          text: "未到店",
        },
      };
      return srcObj[i];
    },
    renderMin(info) {
      const num = dayjs(info.finishTime).diff(info.confirmTime);
      if (String(num / 1000 / 60).includes(".")) {
        return (num / 1000 / 60).toFixed(0) + 1;
      }
      return (num / 1000 / 60).toFixed(0);
    },
    previewShopImages(url) {
      console.log("🚀 ~ previewShopImages ~ url:", url);

      uni.previewImage({
        urls: [url],
      });
    },
    renderAddGoods(info) {
      const add = info.reservationItems.filter((f) => f.type == 2);
      if (add && add.length > 0) {
        return add.map((s) => s.skuName).join("、");
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
