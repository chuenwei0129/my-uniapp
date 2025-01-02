<template>
  <view>
    <swiper-page v-if="orderList.length" :tipsList="orderList" />
  </view>
</template>

<script>
import swiperPage from "./swiperPage.vue";
import dayjs from 'dayjs'
export default {
  name: "TipsCard",
  data() {
    return {
      orderList: [], // 订单列表
    };
  },
  props: {
    tipsList: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    swiperPage,
  },
  watch: {
    // 三种订单类型数据
    tipsList: {
      handler(val) {
        console.log('三种订单类型数据-----', val);
        let { serviceOrderList, washPetOrderList, lookPetOrderList } = val;
        const list = (serviceOrderList || []).map((v) => ({
          ...v,
          createdTime: v.orderTime,
          selfType: 1,
        }));
        const list1 = (washPetOrderList || []).map((v) => ({
          ...v,
          selfType: 2,
        }));
        const list3 = (lookPetOrderList || []).map((v) => ({
          ...v,
          selfType: 3,
        }));
        this.orderList = [...list, ...list1, ...list3].sort(this.sortUpDate)
        console.log('待使用券排序-----------',this.orderList);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
     sortUpDate(a, b) {
      return dayjs(b.createdTime).valueOf() - dayjs(a.createdTime).valueOf()
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
  margin: 15rpx;
}

.card-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 23rpx;
  background-color: #fff;
  padding: 0 28rpx;
  width: 100%;
  box-sizing: border-box;
  .left {
    display: flex;
    align-items: center;
    flex: 1;
  }
  .img {
    width: 96rpx;
    height: 96rpx;
    border-radius: 10rpx;
  }
  .title_row {
    display: flex;
    flex-direction: column;
    margin: 0 21rpx;
    width: 370rpx;
  }
}

.card-title {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 29rpx;
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
}

.card-action {
  font-size: 29rpx;
  color: #fff;
  background-color: #fe2442;
  border-radius: 35rpx;
  text-align: center;
  min-width: 169rpx;
  max-width: 169rpx;
  height: 69rpx;
  line-height: 69rpx;
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
  margin: 0 4rpx;
  border-radius: 2px;
  background-color: #ccc;
}

.active {
  width: 12rpx;
  height: 4rpx;
  background-color: #1f1f1f;
}
</style>
