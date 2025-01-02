<template>
  <view>
    <!-- 骨架屏 -->
    <view class="skeleton-list" >
      <view v-for="(item, index) in 3" :key="index">
        <view class="skeleton-item">
          <view class="card-content">
            <view class="content-herder flex-layout">
              <view class="store-name flex-layout">
                <view class="left-icon skeleton-empty"></view>
                <view class="text skeleton-empty"></view>
              </view>
              <view class="right-tag skeleton-empty"></view>
            </view>

            <view class="content-goods flex-layout">
              <view class="goods-img"></view>
              <view class="goods-info">
                <view class="goods-info-name skeleton-empty"></view>
                <view class="goods-info-name skeleton-empty"></view>
                <view class="goods-info-introduce flex-layout skeleton-empty">
                </view>
              </view>
              <view class="goods-info-right">
                <view class="goods-info-price skeleton-empty"></view>
                <view class="goods-info-num skeleton-empty"></view>
              </view>
            </view>

            <view class="content-total-price flex-layout">
              <view class="left skeleton-empty"></view>
              <view class="right flex-layout">
                <view class="text skeleton-empty"></view>
                <view class="price flex-layout skeleton-empty"> </view>
              </view>
            </view>
          </view>

          <view class="card-btns">
            <view class="btn-item"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.flex-layout {
  display: flex;
  justify-content: center;
  align-items: center;
}
.skeleton-list {
  padding: 20rpx 15rpx 20rpx;

  .skeleton-item {
    width: 100%;
    height: 433rpx;
    padding: 23rpx;
    background: #ffffff;

    margin-bottom: 20rpx;
    border-radius: 23rpx;

    .skeleton-empty {
      background: #f7f8fc;
      border-radius: 4rpx;
    }

    .content-herder {
      height: 38rpx;
      margin-bottom: 30rpx;
      justify-content: space-between;

      .store-name {
        height: 38rpx;
        border-radius: 4rpx;
        justify-content: start;

        .left-icon {
          width: 35rpx;
          height: 35rpx;
          margin-right: 8rpx;
        }

        .text {
          width: 308rpx;
          height: 35rpx;
        }
      }

      .right-tag {
        width: 77rpx;
        height: 35rpx;
      }
    }

    .content-goods {
      width: 100%;
      justify-content: space-between;
      align-items: start;

      .goods-img {
        width: 154rpx;
        height: 154rpx;
        background: #f7f8fc;
        border-radius: 12rpx;
      }

      .goods-info {
        max-width: 385rpx;
        margin-left: 23rpx;

        .goods-info-name {
          width: 385rpx;
          height: 35rpx;
          margin-bottom: 10rpx;
        }

        .goods-info-introduce {
          text-align: right;
          margin-left: 17rpx;
        }
      }

      .goods-info-right {
        width: 83rpx;
        margin-left: 17rpx;
        display: flex;
        flex-direction: column;
        align-items: end;

        .goods-info-price {
          width: 83rpx;
          height: 35rpx;
        }

        .goods-info-num {
          margin-top: 8rpx;
          width: 38rpx;
          height: 35rpx;
        }
      }
    }

    .content-total-price {
      justify-content: space-between;
      margin-top: 30rpx;

      .left {
        width: 58rpx;
        height: 35rpx;
      }

      .right {
        .text {
          width: 94rpx;
          height: 35rpx;
          margin-right: 8rpx;
        }

        .price {
          width: 133rpx;
          height: 35rpx;
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
        background: #f7f8fc;
        border-radius: 35rpx;
      }
    }
  }
}
</style>