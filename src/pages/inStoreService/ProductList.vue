<template>
  <view class="product-list">
    <view class="product-list__column product-list__column--even">
      <template v-if="evenProducts && evenProducts.length > 0">
        <ProductCard
          v-for="productItem in evenProducts"
          :key="productItem.id"
          class="product-list__product-card"
          :product="productItem"
        />
      </template>

      <view
        v-else-if="showEvenSkeleton"
        class="product-list__skeleton product-list__skeleton--even"
      >
        <view
          v-for="i in 2"
          :key="i"
          class="product-list__skeleton-item"
        >
          <image
            class="product-list__skeleton-icon"
            :src="skeletonIcon"
          />
        </view>
      </view>
    </view>

    <view class="product-list__column product-list__column--odd">
      <template v-if="oddProducts && oddProducts.length > 0">
        <ProductCard
          v-for="productItem in oddProducts"
          :key="productItem.id"
          class="product-list__product-card"
          :product="productItem"
        />
      </template>

      <view
        v-else-if="showOddSkeleton"
        class="product-list__skeleton product-list__skeleton--odd"
      >
        <view
          v-for="i in 2"
          :key="i"
          class="product-list__skeleton-item"
        >
          <image
            class="product-list__skeleton-icon"
            :src="skeletonIcon"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductList',
  components: {
    ProductCard,
  },
  props: {
    useSkeleton: {
      type: Boolean,
      default: false,
    },
    products: {
      type: Array,
      required: true,
    },
    adItems: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      skeletonIcon:
        'https://frontend-cdn.chongpangpang.com/image/medical-mp/home/skeleton_icon.png',
      showSkeleton: true,
    }
  },
  computed: {
    filteredProducts () {
      return (type) => {
        const isEven = type === 'even'
        if (this.adItems.length > 0) {
          return this.products.filter(
            (_, index) => (index % 2 === 0) === isEven
          )
        } else {
          return this.products.filter(
            (_, index) => (index % 2 !== 0) === isEven
          )
        }
      }
    },
    oddProducts () {
      return this.filteredProducts('odd')
    },
    evenProducts () {
      return this.filteredProducts('even')
    },
    showEvenSkeleton () {
      return (
        this.showSkeleton &&
        this.evenProducts.length === 0 &&
        this.oddProducts.length === 0 &&
        this.useSkeleton
      )
    },
    showOddSkeleton () {
      return (
        this.showSkeleton &&
        this.oddProducts.length === 0 &&
        this.evenProducts.length === 0 &&
        this.useSkeleton
      )
    },
  },
  mounted () {
    // 建议在父组件中控制 showSkeleton，避免延迟
    uni.$on('skeleton-refresh', (bool) => {
      this.$nextTick(() => {
        this.showSkeleton = bool
      })
    })
  },
  methods: {
    handleClickProduct () {},
  },
}
</script>

<style scoped lang="scss">
.product-list {
  display: flex;
  width: 96%;
  margin: 0 auto;
  justify-content: space-between;

  &__column {
    display: flex;
    flex-direction: column;
    width: calc((100vw - 46rpx) / 2);

    &--odd {
      margin-left: 15rpx;
    }
  }

  &__product-card {
    margin-bottom: 16rpx;
  }

  &__skeleton {
    // 提取公共样式
    width: calc((100vw - 30rpx) / 2);
    box-sizing: border-box;

    &--even {
      padding-right: 8rpx;
    }

    &--odd {
      padding-left: 8rpx;
    }

    &-item {
      // 考虑使用百分比或 vw/vh 单位
      width: 352rpx;
      height: 552rpx;
      background: #ffffff; // 使用 SCSS 变量
      border-radius: 23rpx; // 使用 SCSS 变量
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16rpx; // 使用 SCSS 变量
    }

    &-icon {
      display: block;
      width: 165rpx;
      height: 65rpx;
    }
  }
}
</style>
