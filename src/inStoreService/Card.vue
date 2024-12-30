<template>
  <view class="container">
    <view 
      v-for="(item, index) in items" 
      :key="index" 
      class="card"
      :class="{ 'two-columns': columns === 2, 'three-columns': columns === 3 }"
    >
      <image
        class="card-img"
        :src="item.img"
        mode="aspectFill"
      />
      <view class="overlay">
        {{ item.distance }} | {{ item.location }}
      </view>
      <view class="card-content">
        <view class="title">
          {{ item.title }}
        </view>
        <view class="coupon">
          {{ item.coupon }}
        </view>
        <view class="price-sales">
          <view class="price">
            ¥ {{ item.price }}
          </view>
          <view class="sales">
            销量{{ item.sales }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CardList',
  props: {
    items: {
      type: Array,
      required: true
    },
    columns: {
      type: Number,
      default: 2 // 默认两列展示
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
}
.card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
}
.card.two-columns {
  width: 48%;
}
.card.three-columns {
  width: 31%;
}
.card-img {
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
}
.card-content {
  padding: 15px;
}
.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}
.coupon {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}
.price-sales {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-size: 20px;
  color: #ff4d4f;
  font-weight: bold;
}
.sales {
  font-size: 12px;
  color: #999;
}
</style>
