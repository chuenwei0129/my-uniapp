<template>
    <view class="tips-card">
        <swiper :autoplay="false"  :interval="3000" :duration="500" :current.sync="currentIndex" class="swiper" @change="handleSwiperChange">
        <swiper-item v-for="(item, index) in tipsList" :key="index" class="card-item">
          <view class="left">
            <image class="img" :src="item.skuPic || item.orderItems[0].imageUrl" />
            <view class="title_row">
              <template v-if="item.selfType==1">
                <view class="card-title">{{ item.orderItems[0].skuName }}</view>
                <template v-if="item.verifyInfoList && item.verifyInfoList.length && item.verifyInfoList[0].verifyValidEndTime">
                  <view class="card-subtitle" :style="{color:isExpired(item.verifyInfoList[0].verifyValidEndTime),display: 'flex',fontWeight: 300}">
                    待使用
                    <view class="unit">|</view>  
                    <view class="card-date">{{ formatDateTime(item.verifyInfoList[0].verifyValidEndTime) }}到期</view>
                  </view>
                </template>
              </template>
              <template v-else>
                <view class="card-title">{{ item.skuName }}</view>
                <view class="card-subtitle" v-if="item.reservationBeginTime" :style="{color:isExpired(item.reservationBeginTime)}">
                  请于{{ formatDateTime(item.reservationBeginTime) }}到店{{ item.selfType == 2 ? '服务' : '看宠' }}
                </view>
              </template>
            </view>
          </view>
          <view class="card-action" @click="showCouponCode(item)">查看{{ item.selfType == 2 ? '详情' : '劵码' }}</view>
        </swiper-item>
      </swiper>
      <view class="pagination" v-if="tipsList.length > 1">
        <view class="dot" :class="{ active: currentIndex === index }" v-for="(dot, index) in tipsList.length" :key="index" @click="selectDot(index)">
        </view>
      </view>
    </view>
  </template>
  
  <script>
  import dayjs from "dayjs";
  const h5Domain = {
    development: "https://cn-dev01-shareactivity.chongpangpang.com/",
    test: "https://cn-dev02-shareactivity.chongpangpang.com/",
    pre: "https://cn-test01-shareactivity.chongpangpang.com/",
    production: "https://shareactivity.chongpangpang.com/",
  };
  export default {
    name: "TipsCardSwiper",
    props: {
        tipsList: {
            type: Array,
            default: () => []
        }
    },
    data() {
      return {
        currentIndex: 0,
      };
    },
    methods: {
      showCouponCode(item) {
        if(item.selfType == 3){
          let route = h5Domain[process.env.NODE_ENV] +
          `wallet-h5/#/livingBody/reservationDetail?reservationId=${item.id}`;
          uni.navigateTo({
            url: `/pagesA/webView/index?route=${encodeURIComponent(
              route
            )}&type=icon`,
          });
        }else if(item.selfType == 1){
          uni.navigateTo({
            url: `/pagesC/orderDetail/serviceOrderDetail/index?orderId=${item.orderId}`,
          });
        }else{
          uni.navigateTo({
            url: `/pagesB/reservationService/index?reservationId=${item.id}`,
          });
        }
      },
      isExpired(date) {
        const isToday = dayjs(date).isSame(dayjs(), 'day');
        return isToday ? '#FE2442' : '';
      },
      formatDateTime(dateTimeString) {
        const date = dayjs(dateTimeString, 'YYYY-MM-DD HH:mm:ss');
        return date.format('YYYY.MM.DD HH:mm');
      },
  
      selectDot(index) {
        this.currentIndex = index;
      },
      handleSwiperChange (event) {
        this.currentIndex = event.detail.current;
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  
  .swiper {
    position: relative;
    overflow: hidden;
    border-radius: 23rpx;
    background-color: #fff;
    height: 154rpx;
  }
  
  .tips-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 154rpx;
    margin: 15rpx 16rpx;
  }
  
  .card-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 23rpx;
    background-color: #fff;
    padding: 0 29rpx;
    width: 100%;
    box-sizing: border-box;
    .left{
      display: flex;
      align-items: center;
      flex: 1;
    }
    .img {
      width: 96rpx;
      height: 96rpx;
      border-radius: 15rpx;
    }
    .title_row {
      display: flex;
      flex-direction: column;
      margin: 0 13rpx 0 21rpx;
      width: 370rpx;
    }
  }
  
  .card-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 29rpx;
    margin-bottom: 6rpx;
    font-weight: 500;
    color: #1F1F1F;
  }
  
  .unit {
      padding: 0 10rpx;
  }
  
  .card-subtitle {
    font-size: 25rpx;
    color: #666666;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 300;
  }
  
  .card-action {
    font-size: 29rpx;
    color: #fff;
    background-color: #FE2442;
    border-radius: 35rpx;
    text-align: center;
    min-width: 169rpx;
    max-width: 169rpx;
    height: 69rpx;
    line-height: 69rpx;
    font-weight: 500;
  }
  
  .card-date {
    font-size: 25rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .is-expired .card-subtitle {
    color: red;
  }
  
  /* 锚点样式 */
  .pagination {
    position: absolute;
    bottom: 15rpx;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dot {
    width: 12rpx;  
    height: 4rpx;  
    margin: 0 2rpx;
    border-radius: 4rpx;
    background-color: #ccc;
  }
  
  .active {
    width: 12rpx;  
    height: 4rpx; 
    background-color: #1F1F1F;  
  }
  
  </style>