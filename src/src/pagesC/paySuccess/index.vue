<template>
  <view class="page-wrapper">
    <scroll-view
      class="scroll-wrapper"
      :style="{
        height: `${scrollHeight}`,
      }"
      scroll-y
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <!-- 添加图标 -->
      <view class="result">
        <view class="success-pay">
          <view class="mode">¥</view>
          <!-- {{ orderInfo.payAmount }} -->
          <view class="amount">
            {{ salePriceInteger }}.
            <view class="dec">{{ salePriceDecimal || "00" }}</view>
          </view>
        </view>

        <!-- <image class="success-ico" :src="result.icon"></image>
        <view class="success-text">{{ result.text }}</view>
        <view class="success-desc">{{ result.desc }}</view> -->

        <view class="action-wrapper">
          <view class="action" @click="handleOrder()">查看订单</view>
          <view class="action btn" @click="handleMall()">逛逛商城</view>
        </view>
      </view>
      <!-- 消费返胖豆 v-if="orderInfo.score > 0"-->
      <view class="shop-pangdou" v-if="orderInfo.score > 0">
        <view class="title">购物返胖豆</view>
        <!-- <img src="" alt="" /> -->
        <div class="box-item">
          <view class="img-box"></view>
          <view class="content">
            <img
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/pangdou.png"
              alt=""
            />
            <view class="img-value">{{ orderInfo.score }}</view>
          </view>
        </div>

        <view class="trading-box">
          <view class="value"
            >交易完成返{{ orderInfo.score }}胖豆，可免费兑换商品</view
          >
          <!-- <view class="lable" @click="goPangdouHome">去兑换</view> -->
          <!-- 去胖豆主页 -->
          <!-- <img
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/unfoldIcon.png"
            alt=""
          /> -->
          <!-- <view class="iconfont icon-arrowRight"> </view> -->
        </view>
        <view class="pd-goods" @click="goPangdouHome">
          <view class="pd-goods-item" v-for="item in list" :key="item.goodsId">
            <image :src="item.goodsLogoPic" class="pd-img"></image>
            <view class="pd-text">{{ item.goodsName }}</view>
            <view class="pd-btn">去兑换</view>
          </view>
        </view>
      </view>
      <!-- 更多商品 -->
      <MyWaterFall
        v-model="goodsList"
        imgKey="majorPicture"
        ref="waterfallFlow"
        @onClickItem="onClickItem"
      ></MyWaterFall>
    </scroll-view>
  </view>
</template>

<script>
import { GET_RECOMMEND_GOODS } from "@/api/mallv2";
import MyWaterFall from "@/components/waterfall/index.vue";
import { action_report } from "@/utils/track";
import { getUserScoreGoods } from "@/api/activity";
import { mapState } from "vuex";
export default {
  components: {
    MyWaterFall,
  },

  data() {
    return {
      result: {
        icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/ico_pay_success.png",
        text: "支付成功",
        desc: "稍等，商品正在快马加鞭准备中",
      },
      goodsList: [],
      pageNum: 1,
      dbPageNo: 0,
      skipGoods: 0,
      itemIds: [],
      noMoreData: false,
      orderInfo: {
        orderId: "",
        orderType: "",
        payAmount: 0.02,
        score: 0,
        itemIds: [],
      },
      list: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    salePriceInteger() {
      const salePriceNum = Number.parseFloat(this.orderInfo.payAmount);
      if (salePriceNum !== salePriceNum) {
        return "0";
      }
      const num = salePriceNum.toFixed(2);
      return `${num}`.split(".")[0];
    },
    salePriceDecimal() {
      const salePriceNum = Number.parseFloat(this.orderInfo.payAmount);
      if (salePriceNum !== salePriceNum) {
        return "";
      }
      const num = salePriceNum.toFixed(2);
      const res = `${num}`.split(".")[1];
      if (res === "00") {
        return "";
      }
      if (res.substring(1, 2) === "0") {
        return res.substring(0, 1);
      }
      return res;
    },
  },
  onLoad(options) {
    try {
      this.orderInfo = JSON.parse(decodeURIComponent(options.orderInfo));
      console.log("options1111", this.orderInfo);
    } catch (err) {
      console.log(err);
    }
    this.itemIds = this.orderInfo?.itemIds ?? [];
    this.scrollHeight = `100vh`;
    this.onRefresh();
  },
  mounted() {
    console.log("111222333", this.userInfo.userId);

    this.getPdGoods();
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  methods: {
    async getPdGoods() {
      console.log("getPdGoods", this.orderInfo.score);

      try {
        const res = await getUserScoreGoods({
          pageNo: 1,
          pageSize: 3,
          goodsType: 1,
          scene: 1,
          sortType: 2,
        });
        this.list = res.data.data;
      } catch (error) {
        console.log(erroe);
      }
    },
    handleOrder() {
      uni.navigateTo({
        url: `/pagesC/mallOrderList/index?listIndex=${0}`,
      });
      // action_report({
      //   action_name: "Paysuccessful_vieworder_click",
      //   module_name: "shop",
      // });
      // if (this.orderInfo.orderType == "021") {
      //   uni.redirectTo({
      //     url: `/pagesC/orderDetail/serviceOrderDetail/index?orderId=${this.orderInfo.orderId}`,
      //   });
      // } else {
      //   uni.redirectTo({
      //     url: `/pagesC/orderDetail/goodsOrderDetail/index?orderId=${this.orderInfo.orderId}`,
      //   });
      // }
    },
    goPangdouHome() {
      action_report({
        action_name: "paysuccess_exchange_click",
        module_name: "shop",
        extend: {
          user_id: this.userInfo.userId,
        },
      });
      uni.navigateTo({
        url: "/pagesE/guideApp/index?type=1",
      });
    },
    handleMall() {
      action_report({
        action_name: "Paysuccessful_strolling_click",
        module_name: "shop",
      });
      // 查看商城
      uni.switchTab({
        url: "/pages/mall/index",
      });
    },

    onRefresh() {
      this.pageNum = 1;
      this.dbPageNo = 0;
      this.skipGoods = 0;
      this.loadRecommendGoods(true);
      console.log("refresh");
    },

    onLoadMore() {
      if (this.noMoreData) {
        console.log("没有更多数据了~");
        return;
      }
      console.log("load more");
      this.pageNum = this.pageNum + 1;
      this.loadRecommendGoods();
    },

    onClickItem(item) {
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${item.itemId}&skuId=${
          item?.skuId || ""
        }&shopId=${item?.shopId}`,
      });
    },

    async loadRecommendGoods() {
      console.log("load recommend, page num: ", this.pageNum);
      try {
        const params = {
          pageNum: this.pageNum,
          pageSize: 10,
          dbPageNo: this.dbPageNo,
          skipGoods: this.skipGoods,
          type: "2",
          bugGoodId: this.itemIds,
        };
        const res = await GET_RECOMMEND_GOODS(params);
        console.log("res: ", res);
        const goodsList = res.data?.data?.goodData ?? [];
        console.log(`goodsList: `, goodsList);
        if (this.pageNum == 1) {
          this.goodsList = goodsList;
        } else {
          this.goodsList = [...this.goodsList, ...goodsList];
        }
        this.dbPageNo = res.data?.data?.dbPageNo ?? 0;
        this.skipGoods = res.data?.data?.skipGoods ?? 0;
        // 没有更多了
        this.noMoreData = res.data?.data?.empty || this.goodsList.length == 0;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
page {
  background-color: #f7f8fc;
}
</style>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100vw;
  height: 100vh;

  .scroll-wrapper {
    width: 100%;
    height: 100vh;

    .result {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      width: 100vw;
      background-color: #f7f8fc;

      .success-ico {
        width: 104rpx;
        height: 104rpx;
      }

      .success-text {
        margin-top: 35rpx;
        font-size: 42rpx;
        font-weight: bold;
        color: #1f1f1f;
      }

      .success-desc {
        font-size: 29rpx;
        font-weight: 400;
        color: #999999;
      }

      .action-wrapper {
        display: flex;
        flex-flow: row nowrap;
        margin-top: 62rpx;
        margin-bottom: 60rpx;

        .action {
          width: 269rpx;
          height: 85rpx;
          line-height: 85rpx;
          text-align: center;
          border-radius: 42rpx;
          border: 2rpx solid #e6e6e6;
          color: #1f1f1f;
        }
        .btn {
          margin-left: 31rpx;
        }

        .space {
          width: 30rpx;
        }
      }

      .success-pay {
        display: flex;
        height: 63rpx;
        // margin-top: 10rpx;
        align-items: center;
        vertical-align: middle;
        .mode {
          font-size: 42rpx;
          // justify-content: center;
          font-weight: bold;
          color: #1f1f1f;
          margin-right: 5rpx;
          margin-top: 10rpx;
          font-family: D-DIN-Bold;
        }
        .amount {
          display: flex;
          justify-content: center;
          font-size: 62rpx;
          color: #1f1f1f;
          // justify-content: center;
          // line-height: 47rpx;
          font-family: D-DIN-Bold;
          .dec {
            margin-top: 19rpx;
            font-size: 42rpx;
          }
        }
      }
    }
    .shop-pangdou {
      // display: flex;
      // justify-content: center;
      width: 96%;
      margin-left: 2%;
      // height: 362rpx;
      background: #ffffff;
      border-radius: 23rpx;
      padding: 29rpx;
      margin-bottom: 17rpx;
      .title {
        color: #1f1f1f;
        font-size: 33rpx;
        line-height: 39rpx;
        font-weight: 500;
      }
      .box-item {
        display: flex;
        justify-content: center;
        position: relative;
        margin-bottom: 30rpx;
        .img-box {
          @keyframes rotateBackground {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          height: 193rpx;
          width: 193rpx;
          background-repeat: no-repeat;
          background-size: contain;
          animation: rotateBackground 5s linear infinite;
          background-image: url(https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/light.png);
        }
        .content {
          z-index: 999;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          img {
            height: 193rpx;
            width: 193rpx;
            z-index: 999;
          }
          .img-value {
            z-index: 1;
            position: absolute;
            left: 50%;
            top: 50%;
            color: #6e4708;
            font-family: D-DIN-Bold;
            font-size: 35rpx;
            transform: translate(-50%, -50%);
          }
        }
      }

      .trading-box {
        display: flex;
        justify-content: center;
        align-items: center;
        .value {
          color: #333333;
          font-size: 29rpx;
          line-height: 40rpx;
        }
        .lable {
          color: #ff5b05;
          font-size: 29rpx;
          line-height: 40rpx;
          margin-left: 10rpx;
        }
        img {
          width: 24rpx;
          height: 24rpx;
        }
      }
      .pd-goods {
        width: 100%;
        height: 365rpx;
        display: flex;
        justify-content: start;
        background: #f7f8fc;
        border-radius: 15rpx;
        margin-top: 19rpx;
        padding: 15rpx;
        gap: 18rpx;
        .pd-goods-item {
          width: 200rpx;
          height: 335rpx;
          border-radius: 19rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          // margin-left: 15rpx;
          .pd-img {
            width: 200rpx;
            height: 200rpx;
            border-radius: 12rpx;
          }
          .pd-text {
            width: 100%;
            height: 35rpx;
            margin-top: 15rpx;
            padding: 0 8rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 25rpx;
            color: #666666;
            line-height: 35rpx;
            text-align: center;
            font-style: normal;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .pd-btn {
            width: 119rpx;
            height: 54rpx;
            border-radius: 27rpx;
            border: 2rpx solid #ffcfd8;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            font-size: 25rpx;
            color: #fe2442;
            line-height: 54rpx;
            text-align: center;
            font-style: normal;
            margin-top: 15rpx;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
