<template>
  <view class="goods-list">
    <view
      v-for="(item, index) in goodsList"
      :key="index"
      class="goods-item"
      @click="goToPage(item)"
    >
      <view class="goods-img">
        <!-- <view v-if="item.shelveStatus == 2" class="sold-out">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/myCollection/sold_out_text.png"
          />
        </view> -->
        <view v-if="item.saleStatus == 4" class="sale">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/myCollection/sale_text.png"
          />
        </view>
        <view v-else-if="[0, 1, 3].includes(item.saleStatus)" class="sale">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/myCollection/sold_out_text.png"
          />
        </view>
        <image :src="item.majorPicture" />
        <view v-if="item.storeName" class="goods-address">
          {{ item.storeName && item.storeName.slice(0, 8) }}
        </view>
      </view>

      <view class="goods-info">
        <view class="goods-name">
          <text>{{ item.itemName && item.itemName.slice(0, 10) }}</text>
          <image :src="sexImgList[item.gender]" />
        </view>

        <view v-if="item.alienFlag == 0" class="goods-type">
          <template>{{ getComputedAge(item) }}</template
          ><template v-if="item.vaccinationList"
            >/疫苗{{ item.vaccinationList.length }}针</template
          ><template v-if="item.dewormingList"
            >/驱虫{{ item.dewormingList.length }}次</template
          >
        </view>
        <view v-else class="goods-type">
          {{ item.physicalBuild || "" }}
        </view>

        <view class="goods-price">
          <view class="price">
            <text>￥</text>
            <text>{{ item.lowestPrice }}</text>
            <!-- <text v-if="item.salePrice">￥{{ item.salePrice }}</text> -->
          </view>
          <!-- <view class="types">
            <view v-if="item.reserved">已预约</view>
          </view> -->
        </view>
      </view>
    </view>

    <view v-if="isLoading && goodsList.length === 0" class="no-data">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/no_data.png"
      />
      <view class="empty-text">空空滴，快开始你的第一个收藏吧</view>
    </view>

    <view v-else class="page-bottom">
      <view v-if="isRequesting" class="loading-container">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/loading.png"
        />
        <view>胖胖努力中…</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
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
      default: false,
    },
  },
  data() {
    return {
      // 性别图标组
      sexImgList: [
        "",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/male.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/female.png",
      ],
    };
  },
  methods: {
    goToPage(info) {
      if (
        info.saleStatus == 3 ||
        info.saleStatus == 4 ||
        info.shelveStatus == 2
      )
        return;
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${info.itemId}&shopId=${info.shopId}`,
      });
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?shopId=${info.shopId}&itemId=${info.itemId}&skuId=${info.skuId}`,
      });
      // #endif
    },
    handleToView() {
      uni.navigateTo({ url: "" });
    },
    // 猫狗的年龄整合
    getComputedAge(info) {
      const year = info.years == 0 ? "" : `${info.year || 0}年`;
      const month = info.months == 0 ? "" : `${info.year || 0}个月`;
      const day = `${info.year || 0}天`;
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
    .sold-out {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 23rpx;

      image {
        width: 85rpx;
        height: 25rpx;
      }
    }
    .sale {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 23rpx;

      image {
        width: 85rpx;
        height: 25rpx;
      }
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

      image {
        width: 27rpx;
        height: 27rpx;
        margin-left: 4rpx;
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
        font-family: D-DIN, D-DIN;
        font-weight: bold;
        font-size: 31rpx;
        color: #1f1f1f;

        & text:nth-child(1) {
          font-size: 23rpx;
        }
        & text:nth-child(3) {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 23rpx;
          color: #999999;
          text-decoration: line-through;
          margin-left: 6rpx;
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
  align-items: center;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);

  image {
    width: 346rpx;
    height: 346rpx;
  }
  .empty-text {
    margin-top: 19rpx;
    font-size: 25rpx;
    font-weight: 400;
    color: #999999;
  }
}
</style>
