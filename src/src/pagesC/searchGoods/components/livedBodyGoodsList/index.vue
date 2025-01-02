<template>
  <view class="goods-list">
    <view
      v-for="(item, index) in goodsList"
      :key="index"
      class="goods-item"
      @click="goToPage(item)"
    >
      <view class="goods-img">
        <image :src="item.majorPicture" />
        <view v-if="item.shopName" class="goods-address">{{
          item.shopName.slice(0, 14)
        }}</view>
      </view>

      <view class="goods-info">
        <view class="goods-name">
          <text class="name">{{ item.itemName || "未知" }}</text>
          <!-- <image :src="sexImgList[item.gender]" /> -->
          <view
            v-if="item.gender == 2"
            class="image iconfont icon-woman"
          ></view>
          <view
            v-else-if="item.gender == 1"
            class="image iconfont icon-man"
          ></view>
        </view>
        <!-- speciesClassification: 品种分类;   // 活体品种 1, "猫类活体" 50, "犬类活体" 214 "水族" 836, "鸟类活体" 460, "爬行类活体" 835, "其他小宠" -->
        <view
          v-if="
            item.speciesClassification == 1 || item.speciesClassification == 50
          "
          class="goods-type"
        >
          <template>{{ getComputedAge(item) }}</template>
          <template v-if="item.numberOfVaccines"
            >/疫苗{{ item.numberOfVaccines }}针</template
          >
          <template v-if="item.numberOfDeworming"
            >/驱虫{{ item.numberOfDeworming }}次</template
          >
        </view>
        <view v-else class="goods-type">
          {{ shapeMap[item.shape] || "" }}
        </view>
        <view class="goods-price">
          <view class="price">
            <text>￥</text>
            <text>{{ item.minSalePrice || 0 }}</text>
          </view>
          <view class="types" v-if="item.reservation || item.collect">
            <!-- <view v-if="item.reservation == 1">已预约</view> -->
            <view v-if="item.reservation != 1 && item.collect == 1"
              >已收藏</view
            >
          </view>
        </view>
      </view>
    </view>

    <view v-if="!isRequesting && goodsList.length === 0" class="no-data">
      <image :src="noDataImg" />
    </view>

    <view class="page-bottom" v-if="isLoading">
      <view class="loading-container">
        <image
          src="http://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/loading.png"
        />
        <view>胖胖努力中…</view>
      </view>
    </view>
    <view v-if="noMoreData && goodsList.length > 6" class="last-container">
      已经到底啦喵～
    </view>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  emits: ["onClickItem"],
  props: {
    goodsList: {
      type: Array,
      default: [],
    },
    toPath: {
      type: String,
      default: "/",
    },
    isRequesting: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    noMoreData: {
      type: Boolean,
      default: false,
    },
    recommendedShop: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      // 性别图标组
      // sexImgList: [
      //   "http://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/male.png",
      //   "http://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/female.png",
      // ],
      // 列表为空图片组
      noDataList: [
        "http://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/goods_img.png",
        "http://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/goods_img.png",
        "http://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/goods_img.png",
      ],
      // 异宠形态体格map
      shapeMap: {
        // "0": "未知",
        1: "半毛",
        2: "全毛",
        11: "幼体",
        12: "亚成体",
        13: "亚成体",
      },
    };
  },
  mounted() {
    //加载字体文件;
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
    goToPage(info) {
      uni.$u.throttle(() => {
        // 埋点相关
        const { userId } = uni.getStorageSync("storage_info");
        action_report({
          display_name: "Livepetchannel_pet_click",
          extend: {
            user_id: userId,
            commodity_id: info.itemId,
          },
        });
        this.$emit("onClickItem", info);
      });
    },
    handleToView() {
      // this.recommendedShop.id为附近门店id字段
      uni.navigateTo({
        url: "/pagesE/livedBody/index",
        query: {
          id: this.recommendedShop.id,
        },
      });
    },
    // 猫狗的年龄整合
    getComputedAge(info) {

      const year = info.years == 0 || !info.years ? "" : `${info.years}年`;
      const month =
        info.months == 0 || !info.months ? "" : `${info.months}个月`;
      const day = `${info.days || 0}天`;
      console.log(info, `${year}${month}${day}`);
      return `${year}${month}${day}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  padding: 15rpx 0;
  width: 100%;
}

.goods-item {
  margin-bottom: 15rpx;
  margin-left: 18rpx;
  .goods-img {
    width: 350rpx;
    height: 350rpx;
    margin-bottom: 17rpx;
    border-radius: 23rpx;
    position: relative;

    image {
      width: 100%;
      height: 100%;
      border-radius: 23rpx;
    }

    .goods-address {
      position: absolute;
      left: 8rpx;
      bottom: 8rpx;
      height: 31rpx;
      line-height: 31rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 21rpx;
      color: #ffffff;
      padding: 0 12rpx;
    }
  }
  .goods-info {
    padding: 0 17rpx 17rpx 17rpx;

    .goods-name {
      display: flex;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 27rpx;
      color: #333333;
      .name {
        max-width: 285rpx;
        overflow: hidden;
        white-space: nowrap;
      }

      .image {
        width: 27rpx;
        height: 27rpx;
        margin-left: 4rpx;
        font-size: 27rpx;
      }
    }
    .goods-type {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 23rpx;
      color: #999999;
      margin-bottom: 15rpx;

      max-width: 316rpx;
      white-space: nowrap; /* 保证文本在一行内显示 */
      overflow: hidden; /* 超出容器的文本将被截断 */
    }
    .goods-price {
      display: flex;
      align-items: center;

      .price {
        font-family: D-DIN-Bold, D-DIN;
        font-weight: bold;
        font-size: 31rpx;
        color: #1f1f1f;

        & text:nth-child(1) {
          font-size: 23rpx;
          font-family: D-DIN-Bold, D-DIN;
        }
        & text:nth-child(2) {
          font-family: D-DIN-Bold, D-DIN;
        }
      }
      .types {
        margin-left: auto;

        view {
          background: #ffefef;
          border-radius: 17rpx;
          padding: 2rpx 10rpx;

          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 21rpx;
          color: #fe2442;
        }
      }
    }
  }
}

.guide {
  margin-top: 96rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 185rpx;
  width: 100%;

  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 25rpx;
  color: #666666;

  .guide-btn {
    background: #ffffff;
    border-radius: 35rpx;
    border: 1rpx solid rgba(254, 36, 66, 0.5);
    opacity: 0.8;
    padding: 15rpx 39rpx;
    margin-top: 29rpx;

    font-size: 29rpx;
    color: #fe2442;
  }
}

.page-bottom {
  width: 100%;
}
.loading-container {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 16rpx;

  image {
    width: 46rpx;
    height: 46rpx;
  }
  view {
    margin-top: 19rpx;

    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 23rpx;
    color: #5a5a5a;
  }
}
.no-data {
  width: 100%;
  display: flex;
  justify-content: center;

  image {
    width: 346rpx;
    height: 346rpx;
  }
}
.last-container {
  width: 100%;
  display: flex;
  margin-top: 60rpx;
  padding-bottom: 15rpx;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 23rpx;
  color: #5a5a5a;
  line-height: 33rpx;
  margin-bottom: 77rpx;
}
</style>
