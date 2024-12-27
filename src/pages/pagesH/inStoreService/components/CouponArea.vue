<template>
  <view class="coupon-area">
    <swiper
      :indicator-dots="couponList.length > 1"
      :autoplay="true"
      :interval="3000"
      :circular="true"
      :current="current"
      class="coupon-area__swiper"
      indicator-active-color="#FF2342"
      indicator-color="#ddd"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in couponList"
        :key="index"
        class="coupon-area__swiper-item"
      >
        <CouponCard
          :coupon="item"
          :show-more-button="couponList.length >= 5"
          @click="handleClick"
          @view-more="viewMore"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import CouponCard from './CouponCard.vue'

export default {
  name: 'CouponArea',
  components: {
    CouponCard,
  },
  props: {
    couponList: {
      type: Array,
      default: () => [
        {
          id: 1,
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=0000FF&fg=FFFFFF',
          itemName: '狗狗犬类精致洗护',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.8.30 到期',
          shopName: '南京雨花万象天地店',
        },
        {
          id: 2,
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=00FF00&fg=FFFFFF',
          itemName: '猫咪美容护理套餐',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.9.15 到期',
          shopName: '上海浦东金茂大厦店',
        },
        {
          id: 3,
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=FF0000&fg=FFFFFF',
          itemName: '宠物寄养服务',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.10.1 到期',
          shopName: '北京朝阳大悦城店',
        },
        {
          id: 3,
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=FFFF00&fg=FFFFFF',
          itemName: '宠物食品大礼包',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.11.20 到期',
          shopName: '广州天河城店',
        },
        {
          id: 4,
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=00FFFF&fg=FFFFFF',
          itemName: '宠物玩具套装',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.12.25 到期',
          shopName: '深圳南山海岸城店',
        },
      ],
    },
  },
  data () {
    return {
      current: 0,
    }
  },

  methods: {
    handleClick (coupon) {
      uni.showToast({
        title: `查看券码: ${coupon.id}`,
        icon: 'success',
      })
    },
    viewMore () {
      uni.showToast({
        title: '查看更多优惠券',
        icon: 'none',
      })
    },
    onSwiperChange (event) {
      this.current = event.detail.current
      console.log('当前索引:', this.current)
    },
  },
}
</script>

<style scoped>
/* 整体样式 */
.coupon-area {
  background-color: #F6F8FC;
  border-radius: 10px;
  border: 1px solid #E5E5E5;
}

/* 轮播容器样式 */
.coupon-area__swiper {
  height: 200px;
}

/* Swiper-item 样式 */
.coupon-area__swiper-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Swiper 指示器样式 */
.coupon-area__swiper /deep/ .uni-swiper-dot {
  width: 20px; /* 长条宽度 */
  height: 4px; /* 长条高度 */
  border-radius: 2px; /* 圆角 */
  background-color: #ddd;
  margin: 0 4px; /* 间距 */
}

.coupon-area__swiper /deep/ .uni-swiper-dot-active {
  background-color: #FF2342;
}
</style>
