<template>
  <view class="order-item">
    <view class="card-content">
      <view class="content-herder flex-layout">
        <view class="store-name flex-layout">
          <view
            class="left-icon iconfont"
            :class="{ isIconClass: `${orderIconMap[[orderInfo.orderType]]}` }"
          ></view>
          <view
            class="text"
            v-if="['030', '031', '103'].includes(orderInfo.orderType)"
            >{{ orderNameMap[orderInfo.orderType] }}
          </view>
          <view class="text" v-else>{{ orderInfo.shopName }} </view>
        </view>

        <view class="right-tag" :class="{ 'obligation-tag': isObligation() }">
          <template v-if="['020', '021'].includes(orderInfo.orderType)">
            <view v-if="orderInfo.deliveryStatus">
              {{ deliveryStatusMap[orderInfo.deliveryStatus] }}
            </view>
          </template>
          <template v-else-if="['030'].includes(orderInfo.orderType)">
            <view v-if="orderInfo.orderStatus">
              {{ inquiryStatusMap[orderInfo.orderStatus] }}
            </view>
          </template>
          <template v-else>
            <view>
              {{ orderStatusMap[orderInfo.orderStatus] }}
            </view>
          </template>
          <!-- 待付款显示倒计时 -->
          <view v-if="isObligation()">
            {{ countdownText }}
          </view>
        </view>

        <!--  -->
      </view>
      <!-- 预约美洗单，预约看宠单 -->
      <template v-if="['100', '101'].includes(orderInfo.orderType)">
        <view class="reservation-goods flex-layout" @click="handleGoToDetail">
          <view class="reservation-img">
            <image v-if="orderInfo.skuPic" :src="orderInfo.skuPic"></image>
          </view>
          <view class="reservation-info">
            <view class="reservation-info-title">{{ orderInfo.skuName }} </view>
            <view
              class="reservation-pet-info flex-layout"
              v-if="orderInfo.orderType === '100'"
            >
              <view>宠&emsp;&emsp;物：</view>
              <view>{{ orderInfo.petName }}</view>
            </view>
            <view class="reservation-pet-info flex-layout">
              <view>预约时间：</view>
              <view>{{ orderInfo.reservationBeginTime }}</view>
            </view>
            <view class="reservation-pet-info flex-layout">
              <view>预约类型：</view>
              <view>{{ orderInfo.orderType === "100" ? "美洗" : "看宠" }}</view>
            </view>
          </view>
        </view>
      </template>
      <!-- 处方药品订单 -->
      <template v-else-if="['102'].includes(orderInfo.orderType)">
        <view :class="{ expand: !isExpanded }">
          <view
            class="content-goods flex-layout"
            v-for="(ele, ind) in orderInfo.orderItems"
            :key="ind"
            @click="handleGoToDetail"
          >
            <view class="goods-img">
              <image v-if="ele.imageUrl" :src="ele.imageUrl"></image>
              <!-- 默认图片 -->
              <image v-else :src="productDefaultimg"></image>
            </view>
            <view class="goods-info">
              <view class="goods-info-name">
                {{ ele.skuName }}
              </view>
              <view class="goods-info-introduce flex-layout">
                <view>{{ ele.specification }}</view>
              </view>
            </view>
            <view class="goods-info-right">
              <view class="goods-info-price">￥{{ ele.price }} </view>
              <view class="goods-info-num">x{{ ele.skuQty }} </view>
            </view>
          </view>
        </view>
        <view v-if="orderInfo.orderItems && orderInfo.orderItems.length > 3">
          <view
            class="overflow-show flex-layout"
            v-if="!isExpanded"
            @click="isExpanded = true"
            >展开</view
          >
          <view
            class="overflow-show flex-layout"
            v-else
            @click="isExpanded = false"
            >收起</view
          >
        </view>
        <view class="content-total-price flex-layout">
          <view class="left">共{{ orderInfo.totalSkuQty }}件</view>
          <view class="right flex-layout">
            <view class="text">实付款</view>
            <view class="price flex-layout">
              <view class="">￥</view>
              <view class="integer">{{ orderInfo.payAmount }}</view>
            </view>
          </view>
        </view>
      </template>
      <!-- 胖豆订单 -->
      <template v-else-if="['103'].includes(orderInfo.orderType)">
        <view>
          <view
            class="content-goods flex-layout"
            v-for="(ele, ind) in orderInfo.detailResponseList"
            :key="ind"
            @click="handleGoToDetail"
          >
            <view class="goods-img">
              <image v-if="ele.goodsLogoPic" :src="ele.goodsLogoPic"></image>
              <!-- 默认图片 -->
              <image v-else :src="productDefaultimg"></image>
            </view>
            <view class="goods-info">
              <view class="goods-info-name">
                {{ ele.goodsName }}
              </view>
            </view>
            <view class="goods-info-right">
              <!-- <view class="goods-info-price">￥{{ ele.price }} </view> -->
              <view class="goods-info-num">x{{ ele.goodsQuantity }} </view>
            </view>
          </view>
        </view>
        <view class="content-total-price flex-layout">
          <view class="left">共{{ orderInfo.totalSkuQty }}件</view>
          <view class="right flex-layout">
            <view class="text">实付款&emsp;</view>
            <view class="price flex-layout">
              <view class="integer">{{ orderInfo.orderSource }}</view>
            </view>
            <view class="text">&emsp;胖豆</view>
          </view>
        </view>
      </template>
      <!-- 其他付钱订单 -->
      <template v-else>
        <view :class="{ expand: !isExpanded }">
          <view
            class="content-goods flex-layout"
            v-for="(ele, ind) in orderInfo.orderItems"
            :key="ind"
            @click="handleGoToDetail"
          >
            <view class="goods-img">
              <image v-if="ele.imageUrl" :src="ele.imageUrl"></image>
              <!-- 默认图片 -->
              <image v-else :src="productDefaultimg"></image>
            </view>
            <view class="goods-info">
              <view class="goods-info-name">
                {{ ele.skuName }}
              </view>
              <view class="goods-info-introduce flex-layout">
                <view>{{ ele.specification }}</view>
              </view>
            </view>
            <view class="goods-info-right">
              <view class="goods-info-price">￥{{ ele.price }} </view>
              <view class="goods-info-num">x{{ ele.skuQty }} </view>
            </view>
          </view>
        </view>
        <view v-if="orderInfo.orderItems && orderInfo.orderItems.length > 3">
          <view
            class="overflow-show flex-layout"
            v-if="!isExpanded"
            @click="isExpanded = true"
            >展开</view
          >
          <view
            class="overflow-show flex-layout"
            v-else
            @click="isExpanded = false"
            >收起</view
          >
        </view>
        <view class="content-total-price flex-layout">
          <view class="left">共{{ orderInfo.totalSkuQty }}件</view>
          <view class="right flex-layout">
            <view class="text">实付款</view>
            <view class="price flex-layout">
              <view class="">￥</view>
              <view class="integer">{{ orderInfo.payAmount }}</view>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 喂食订单不展示按钮 -->
    <view class="card-btns" v-if="orderInfo.orderType !== '031'">
      <view
        class="btn-item"
        @click.stop="handleCancelPop('cancel')"
        v-if="
          [1, 12].includes(orderInfo.orderStatus) ||
          (['100', '101'].includes(orderInfo.orderType) &&
            [3, 5].includes(orderInfo.orderStatus))
        "
      >
        取消订单
      </view>
      <view
        class="btn-item primary"
        @click.stop="handlepayment()"
        v-if="
          [1, 12].includes(orderInfo.orderStatus) ||
          (['020', '021', '030', '035', '036', '102'].includes(
            orderInfo.orderType
          ) &&
            [1, 12].includes(orderInfo.orderStatus))
        "
      >
        立即支付
      </view>
      <view
        class="btn-item"
        @click.stop="handleCancelPop('refund')"
        v-if="
          [2].includes(orderInfo.orderStatus) &&
          ['020', '021', '035', '036'].includes(orderInfo.orderType)
        "
      >
        申请退款
      </view>
      <view
        class="btn-item"
        @click.stop="handleGoToDelivery"
        v-if="
          [3, 4, 7].includes(orderInfo.orderStatus) &&
          ['020', '021', '035', '036', '102', '103'].includes(
            orderInfo.orderType
          )
        "
      >
        查看物流
      </view>
      <view
        class="btn-item primary"
        @click.stop="handleConfirmPop('receipt')"
        v-if="
          [3].includes(orderInfo.orderStatus) &&
          ['020', '021', '035', '036', '102', '103'].includes(
            orderInfo.orderType
          )
        "
      >
        确认收货
      </view>
      <view
        class="btn-item primary"
        @click.stop="handleGoToCheckVerificationCode"
        v-if="
          [5].includes(orderInfo.orderStatus) &&
          ['021'].includes(orderInfo.orderType)
        "
      >
        查看核销码
      </view>
      <!-- 付费问诊 -->
      <view
        class="btn-item"
        @click.stop="handleGoChat"
        v-if="
          [4, 7].includes(orderInfo.orderStatus) &&
          ['030'].includes(orderInfo.orderType)
        "
        >去评价
      </view>

      <!-- 实际付款 -->
      <view
        class="btn-item"
        @click.stop="handleGoEvaluate"
        v-if="
          [4, 7].includes(orderInfo.orderStatus) &&
          ['020', '021', '030', '035', '036'].includes(orderInfo.orderType) &&
          (orderInfo.showCommentButton === 1 ||
            orderInfo.showCommentButton == 2)
        "
        >去评价
      </view>
      <view
        class="btn-item"
        @click.stop="handleLookEvaluate"
        v-if="
          [4, 7].includes(orderInfo.orderStatus) &&
          ['020', '021', '030', '035', '036'].includes(orderInfo.orderType) &&
          orderInfo.showCommentButton === 3
        "
        >查看评价
      </view>
      <template v-if="['020', '21'].includes(orderInfo.orderType)">
        <view
          v-if="orderInfo.ifAddPet != 1"
          class="btn-item"
          @click.stop="
            () => {
              addToMypet(orderInfo);
            }
          "
          >添加宠物
        </view>
        <!-- source 字段  43 是线下 1 是线上 -->
        <view
          v-if="orderInfo.ifSignTheContract != 1"
          class="btn-item"
          @click.stop="
            () => {
              signTheContract(orderInfo);
            }
          "
          >签署合同
        </view>
      </template>
      <view
        class="btn-item"
        @click.stop="handleConfirmPop('delete')"
        v-if="
          [8].includes(orderInfo.orderStatus) &&
          ['020', '021', '030', '035', '036', '100', '101'].includes(
            orderInfo.orderType
          )
        "
        >删除订单
      </view>
      <view
        class="btn-item"
        @click.stop="handleConfirmPop('another')"
        v-if="
          [7, 8].includes(orderInfo.orderStatus) &&
          ['020', '021', '030', '035', '036'].includes(orderInfo.orderType)
        "
        >再来一单
      </view>
      <view
        class="btn-item"
        @click.stop="handleEnd"
        v-if="['030'].includes(orderInfo.orderType)"
        >结束问诊
      </view>
      <view
        class="btn-item"
        v-if="['030'].includes(orderInfo.orderType)"
        @click.stop="handleGoChat('continue')"
      >
        继续问诊
      </view>
    </view>
  </view>
</template>

<script>
import {
  ORDER_STATUS_MAP,
  DELIVERY_STATUS_MAP,
  INQUIRY_STATUS_MAP,
  OEDER_NAME_MAP,
  OEDER_ICON_MAP,
} from "../const";
import { getPetClassify } from "@/api/mallV3";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import { mapState, mapMutations } from "vuex";
import { getUserInfo } from "@/api/base";
import dayjs from "dayjs";

export default {
  props: {
    orderInfo: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      isExpanded: false, // 是否展开
      orderStatusMap: ORDER_STATUS_MAP, // 订单状态
      deliveryStatusMap: DELIVERY_STATUS_MAP, // 门店达达订单标签
      inquiryStatusMap: INQUIRY_STATUS_MAP, // 付费问诊类型
      orderNameMap: OEDER_NAME_MAP, // 订单名称
      orderIconMap: OEDER_ICON_MAP, // icon
      productDefaultimg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/product_default.webp",
      countdownText: "，剩余00:00",
      targetTime: null,
      timerId: null,
      isIconClass: true,
    };
  },
  created() {
    if (this.isObligation()) {
      // 启动定时器，每秒更新页面
      this.timerId = setInterval(() => {
        this.updateTime();
      }, 1000);
    }
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    // 去详情页
    handleGoToDetail() {
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/orderDetail/goodsOrderDetail/index?orderId=${this.orderInfo.orderId}`,
      });
      //#endif
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/orderDetail/goodsOrderDetail/index?orderId=${this.orderInfo.orderId}&transparentTopBar=1`,
      });
      //#endif
    },
    // 判断是否是待付款 , 不是投喂和胖豆订单
    isObligation() {
      return (
        (this.orderInfo.orderStatus == 1 || this.orderInfo.orderStatus == 12) &&
        this.orderInfo.orderType !== "031" &&
        this.orderInfo.orderType !== "103"
      );
    },
    // 待付款更新倒计时
    updateTime() {
      const newyear = new Date(this.orderInfo.payEndTime);
      //获取当前时间
      const date1 = new Date();
      //两个日期对象直接相减就能获取两个日期相差的时间戳(以毫秒计，也就是能得出相差多少毫秒)
      const ms = newyear - date1;
      //获取分钟数
      const m = Math.floor((((ms % (3600 * 24 * 1000)) / 1000) % 3600) / 60);
      //获取秒数
      const s = Math.floor((((ms % (3600 * 24 * 1000)) / 1000) % 3600) % 60);
      console.log({ m, s });
      if (m <= 0 && s <= 0) {
        console.log("倒计时结束");
        clearInterval(this.timerId);
        this.$emit("updateOrderList");
      } else {
        this.countdownText = `，剩余${m < 10 ? `0${m}` : m}:${
          s < 10 ? `0${s}` : s
        }`;
      }
    },
    // 取消订单/申请退款弹窗
    handleCancelPop(type) {
      this.$emit("cancelPop", {
        orderInfo: this.orderInfo,
        type,
      });
    },
    // 去支付
    handlepayment() {
      this.handleGoToDetail();
    },
    // 查看物流
    handleGoToDelivery() {
      const { orderId } = this.orderInfo;
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/logisticsDetail/index?orderId=${orderId}`,
      });
      //#endif
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/logisticsDetail/index?orderId=${orderId}&transparentTopBar=1`,
      });
      //#endif
    },
    // 查看核销码
    handleGoToCheckVerificationCode() {
      const { orderId } = this.orderInfo;
      //#ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/orderDetail/serviceOrderDetail/index?orderId=${orderId}`,
      });
      //#endif
      //#ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/orderDetail/serviceOrderDetail/index?orderId=${orderId}&transparentTopBar=1`,
      });
      //#endif
    },
    // 删除订单/确认收货/再来一单弹窗
    handleConfirmPop(type) {
      this.$emit("confirmPop", {
        orderInfo: this.orderInfo,
        type,
      });
    },
    // 付费问诊评价
    async handleGoChat(type) {
      // #ifdef MP-WEIXIN
      //ai问诊可以查看聊天记录
      if (this.orderInfo.inquiryType == "AI_INQUIRY") {
        uni.navigateTo({
          url: `/pagesA/chatPage/index?messageInfo=&fromOrigin=continue&inquiryType=${this.orderInfo.inquiryType}&groupId=${this.orderInfo.groupId}&state=${this.orderInfo.state}&sheetId=${this.orderInfo.id}`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
      }
      return;
      // #endif
      let result;
      try {
        if (type == "continue" && this.orderInfo.inquiryType != "AI_INQUIRY") {
          const res = await GET_IN_SERVICE_LAST({});
          const {
            groupId,
            remainingTime,
            doctorAvatarUrl,
            doctorUserName,
            state,
            remainingWaitingTime,
            id,
            inquiryType,
          } = res.data;
          result = {
            groupId,
            remainingTime,
            remainingWaitingTime,
            doctorAvatarUrl,
            doctorUserName,
            sheetState: state,
            id,
            inquiryType,
          };
          uni.navigateTo({
            url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              result
            )}&fromOrigin=continue&inquiryType=${this.orderInfo.inquiryType}`,
          });
        } else if (
          type != "continue" &&
          this.orderInfo.inquiryType != "AI_INQUIRY"
        ) {
          result = {
            groupId: this.orderInfo.groupId,
            remainingTime: this.orderInfo.remainingTime,
            remainingWaitingTime: this.orderInfo.remainingWaitingTime,
            doctorAvatarUrl: this.orderInfo.doctorAvatarUrl,
            doctorUserName: this.orderInfo.doctorUserName,
            sheetState: this.orderInfo.state,
            id: this.orderInfo.id,
            inquiryType: this.orderInfo.inquiryType,
          };
          uni.navigateTo({
            url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              result
            )}&fromOrigin=continue&inquiryType=${
              this.orderInfo.inquiryType
            }&sheetId=${this.orderInfo.id}`,
          });
        } else {
          // #ifdef MP-WEIXIN

          uni.navigateTo({
            url: `/pagesA/chatPage/index?messageInfo=&fromOrigin=continue&inquiryType=${this.orderInfo.inquiryType}&groupId=${this.orderInfo.groupId}&state=${this.orderInfo.state}&sheetId=${this.orderInfo.id}`,
          });
          // #endif
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/pagesA/chatPage/index?messageInfo=&fromOrigin=rate&inquiryType=${this.orderInfo.inquiryType}&groupId=${this.orderInfo.groupId}&state=${this.orderInfo.state}&sheetId=${this.orderInfo.id}`,
          });
          // #endif
        }
      } catch (e) {
        console.error("handleGoChat", e);
      }
    },

    // 去评价
    handleGoEvaluate() {
      // 1、单sku去评价 2、多sku去评价中心 3、查看评价
      console.log("this.orderInfo", this.orderInfo);
      const skuInfo = {
        saleOrderNo: this.orderInfo.orderNo,
        shopId: this.orderInfo.shopId,
        shopName: this.orderInfo.shopName,
        memberId: this.orderInfo.memberId,
        orderType: this.orderInfo.orderType,
        majorPicture: this.orderInfo.orderItems[0].imageUrl,
        skuId: this.orderInfo.orderItems[0].skuId,
        skuName: this.orderInfo.orderItems[0].skuName,
        itemId: this.orderInfo.orderItems[0].itemId,
        itemName: this.orderInfo.orderItems[0].itemId,
        storeId: this.orderInfo.shopId,
        storeName: this.orderInfo.shopName,
      };

      console.log("this.orderInfo", this.orderInfo);
      if (this.orderInfo.showCommentButton === 1) {
        // 单个发布评价
        //#ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/comment/submit?skuInfo=${JSON.stringify(skuInfo)}`,
        });
        //#endif
        //#ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${
            window.location.origin
          }/crm-medical-h5/#/pagesC/comment/submit?skuInfo=${JSON.stringify(
            skuInfo
          )}&transparentTopBar=1`,
        });
        //#endif
      } else if (this.orderInfo.showCommentButton === 2) {
        // 评价中心（tabval 0 待评价，1已评价）
        //#ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/comment/center?tabval=0`,
        });
        //#endif
        //#ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesC/comment/center?tabval=0&transparentTopBar=1`,
        });
        //#endif
      }
    },
    // 查看评价
    handleLookEvaluate() {
      if (this.orderInfo.orderItems.length === 1) {
        // 单个发布评价
        //#ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/comment/submit?saleOrderNo=${this.orderInfo.orderNo}&skuId=${this.orderInfo.orderItems[0].skuId}`,
        });
        //#endif
        //#ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesC/comment/submit?saleOrderNo=${this.orderInfo.orderNo}&skuId=${this.orderInfo.orderItems[0].skuId}&transparentTopBar=1`,
        });
        //#endif
      } else {
        // 评价中心（tabval 0 待评价，1已评价）
        //#ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/comment/center?tabval=1`,
        });
        //#endif
        //#ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesC/comment/center?tabval=1&transparentTopBar=1`,
        });
        //#endif
      }
    },
    // 删除订单/确认收货/再来一单弹窗
    handleConfirmPop(type) {
      this.$emit("confirmPop", {
        orderInfo: this.orderInfo,
        type,
      });
    },
    //添加到我的宠物
    async addToMypet(orderInfo) {
      try {
        const memberId = await this.getUserMemberId();
        const res = await getPetClassify({
          memberId: memberId,
          skuId: this.orderInfo?.orderItems[0].skuId,
        });
        let liveItem = res?.data?.data;
        console.log("liveItem===================================>", res);
        let birthday = dayjs(liveItem?.birthday).format("YYYY-MM-DD");
        let str = `/pagesD/petInfo/index?enterType=createliving&sourceId=${orderInfo?.orderId}&parentCategoryId=${liveItem?.firstCategoryId}&sex=${liveItem?.gender}&birth=${birthday}&categoryId=${liveItem?.secondCategoryId}&categoryName=${liveItem?.secondCategoryName}&transparentTopBar=1`;
        uni.navigateTo({
          url: str,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async getUserMemberId() {
      let memberId = this.userInfo?.memberId;
      if (memberId) {
        // console.log(`memberId: ${memberId}`);
        return memberId;
      }

      const user = await getUserInfo(true, true);
      if (this.userInfo) {
        this.userInfo.memberId = memberId;
      }
      // console.log(`memberId: ${user.memberId}`);
      return user.memberId;
    },
    //签署合同
    signTheContract(orderInfo) {
      console.log(
        "signTheContractsignTheContractsignTheContractsignTheContract",
        orderInfo
      );
      uni.navigateTo({
        url: `/pagesC/orderDetail/goodsOrderDetail/index?orderId=${orderInfo.orderId}`,
      });
    },
    /**
     * 用户主动结束问诊单
     */
    async handleEnd() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesE/guideApp/index?type=2`,
      });
      // #endif
      //#ifdef H5
      this.$emit("openMessage", this.orderInfo.groupId);
      //#endif
    },
  },
};
</script>

<style scoped lang="scss">
.flex-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}

.order-item {
  padding: 23rpx;
  margin-bottom: 20rpx;
  background: #ffffff;
  border-radius: 23rpx;

  .content-herder {
    height: 38rpx;
    margin-bottom: 30rpx;
    justify-content: space-between;

    .store-name {
      height: 38rpx;
      border-radius: 4rpx;
      // justify-content: start;

      .left-icon {
        width: 30rpx;
        height: 30rpx;
        font-size: 30rpx;
        border-radius: 4rpx;
        margin-right: 8rpx;
      }

      .text {
        font-weight: bold;
        font-size: 25rpx;
        color: #1f1f1f;
      }
    }

    .right-tag {
      display: flex;
      height: 35rpx;
      border-radius: 4rpx;
      font-weight: 400;
      font-size: 25rpx;
      color: #666666;
    }
    .obligation-tag {
      color: #fe2442;
    }
  }

  .content-goods {
    width: 100%;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 28rpx;

    .goods-img {
      width: 154rpx;
      height: 154rpx;
      border-radius: 12rpx;
      uni-image {
        width: 154rpx !important;
        height: 154rpx !important;
        border-radius: 12rpx;
      }
    }

    .goods-info {
      flex: 1;
      margin-left: 23rpx;

      .goods-info-name {
        margin-bottom: 10rpx;
        font-weight: 400;
        font-size: 25rpx;
        color: #1f1f1f;
        line-height: 38rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .goods-info-introduce {
        justify-content: start;
        font-weight: 400;
        font-size: 23rpx;
        color: #666666;
      }
    }

    .goods-info-right {
      margin-left: 17rpx;
      display: flex;
      flex-direction: column;
      align-items: end;

      .goods-info-price {
        height: 38rpx;
        font-weight: bold;
        font-size: 25rpx;
        color: #1f1f1f;
        line-height: 38rpx;
      }

      .goods-info-num {
        height: 35rpx;
        font-size: 23rpx;
        color: #848484;
        line-height: 35rpx;
      }
    }
  }
  .expand {
    max-height: 546rpx;
    overflow: hidden;
  }
  .reservation-goods {
    width: 100%;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 28rpx;
    .reservation-img {
      width: 154rpx;
      height: 154rpx;
      border-radius: 12rpx;
      uni-image {
        width: 154rpx !important;
        height: 154rpx !important;
        border-radius: 12rpx;
      }
    }
    .reservation-info {
      flex: 1;
      margin-left: 23rpx;
      .reservation-info-title {
        height: 38rpx;
        font-family: PingFangSC, SC;
        font-weight: bold;
        font-size: 25rpx;
        color: #1f1f1f;
        line-height: 38rpx;
      }
      .reservation-pet-info {
        justify-content: start;
        height: 35rpx;
        font-size: 23rpx;
        color: #666666;
        line-height: 35rpx;
        margin-top: 10rpx;
      }
    }
  }

  .overflow-show {
    width: 673rpx;
    height: 69rpx;
    background: #fafafa;
    border-radius: 12rpx;
    margin-bottom: 28rpx;
  }
  .content-total-price {
    justify-content: space-between;

    .left {
      height: 35rpx;
      font-weight: 400;
      font-size: 23rpx;
      color: #848484;
      line-height: 35rpx;
    }

    .right {
      height: 50rpx;

      .text {
        font-weight: 400;
        font-size: 25rpx;
        color: #1f1f1f;
      }

      .price {
        align-items: baseline;
        font-size: 23rpx;
        color: #1f1f1f;
        font-weight: bold;

        .integer {
          font-size: 35rpx;
        }

        .decimal {
          font-size: 23rpx;
        }
      }
    }
  }

  .card-btns {
    max-width: 100%;
    margin-top: 23rpx;
    display: flex;
    justify-content: end;
    align-items: center;

    .btn-item {
      width: 169rpx;
      height: 69rpx;
      margin-right: 23rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 400;
      font-size: 27rpx;
      color: #1f1f1f;
      border-radius: 35rpx;
      border: 1rpx solid #e6e6e6;
    }

    .btn-item:last-child {
      margin-right: 0;
    }

    .primary {
      font-weight: 500;
      color: #ffffff;
      background: #fe2442;
      border-radius: 35rpx;
      border: 1rpx solid #fe2442;
    }
  }
}
</style>