<template>
  <view class="product-card">
    <!-- 商品图 -->
    <view class="image-container">
      <u-image
        width="100%"
        height="300rpx"
        :src="product.image"
        mode="aspectFill"
      />
    </view>
    <!-- 商品信息 -->
    <view class="info-container">
      <!-- 商品名 -->
      <view class="name">
        <u-text :lines="1">
          {{ product.name }}
        </u-text>
      </view>
      <!-- 营销信息 -->
      <view class="promotion">
        <u-text
          lines="2"
          type="info"
        >
          <!-- {{ JSON.stringify(product.promotionTag, null, 2) }} -->
          限时折扣，数量有限，先到先得！
        </u-text>
      </view>
      <view class="price-sales">
        <!-- 商品价格 -->
        <view class="price">
          ￥{{ product.realPrice }}
        </view>
        <!-- 商品销量 -->
        <view class="sales">
          销量 {{ product.saledStockQty || 0 }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {}
  },
  methods: {},
}
</script>
