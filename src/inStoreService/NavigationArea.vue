<template>
  <view class="navigation-area">
    <swiper
      :indicator-dots="shouldShowIndicator && showIndicator"
      class="navigation-area__swiper"
      :style="{ height: swiperHeight }"
      indicator-color="#f2f2f2"
      indicator-active-color="#ff5722"
    >
      <swiper-item
        v-for="(group, index) in groupedItems"
        :key="index"
        class="navigation-area__swiper-item"
      >
        <view
          v-for="(item, itemIndex) in group"
          :key="itemIndex"
          class="navigation-area__swiper-item-content"
          :style="{ width: itemWidth + '%' }"
        >
          <view
            class="navigation-area__swiper-item-image"
            @click="handleClick(item)"
          >
            <u-image
              :src="item.image"
              width="96rpx"
              height="96rpx"
              radius="12rpx"
            />
          </view>
          <view class="navigation-area__swiper-item-name">
            {{ item.title }}
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'NavigationArea',
  props: {
    items: {
      type: Array,
      required: true,
    },
    // 每行显示的 item 数量
    itemsPerRow: {
      type: Number,
      default: 5,
    },
    // 每页显示的行数
    rows: {
      type: Number,
      default: 1,
    },
    // 是否显示指示点
    shouldShowIndicator: {
      type: Boolean,
      default: true,
    },
  },

  data () {
    return {
      // 分组后的 items 数组
      groupedItems: [],
    }
  },

  computed: {
    // 计算每个 item 的宽度，根据每行显示的 item 数量动态调整
    itemWidth () {
      return 100 / this.itemsPerRow
    },
    // 计算轮播组件的高度，根据行数动态调整
    swiperHeight () {
      return `${200 * this.rows}rpx`
    },
    // 判断是否需要显示指示点，当分组后的 items 数量大于 1 时显示
    showIndicator () {
      return this.groupedItems.length > 1
    },
  },

  watch: {
    // 监听 items 的变化，当 items 变化时重新分组
    items: {
      handler: 'groupItems',
      immediate: true,
    },
  },

  mounted () {
    // 组件挂载时调用 groupItems 方法进行分组
    this.groupItems()
  },

  methods: {
    // 对 items 进行分组的方法
    groupItems () {
      // 计算每页显示的 item 数量
      const itemsPerPage = this.itemsPerRow * this.rows
      // 使用 reduce 方法对 items 进行分组
      this.groupedItems = this.items.reduce((groups, item, index) => {
        const groupIndex = Math.floor(index / itemsPerPage)
        if (!groups[groupIndex]) {
          groups[groupIndex] = []
        }
        groups[groupIndex].push(item)
        return groups
      }, [])
    },

    handleClick (item) {
      uni.showToast({
        title: `金刚区跳转: ${item.miniLink}`,
        icon: 'success',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation-area {
  background: white;
  border-radius: 16rpx;
  padding-bottom: 8rpx;

  &__swiper-item {
    display: flex;
    flex-wrap: wrap;
  }

  &__swiper-item-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 16rpx 0;
    overflow: hidden;
  }

  &__swiper-item-image {
    width: 96rpx;
    height: 96rpx;
  }

  &__swiper-item-name {
    margin-top: 8rpx;
    font-size: 24rpx;
  }
}

/* 使用 ::v-deep 修改指示器样式 */
::v-deep .uni-swiper-dot {
  width: 16rpx !important;
  height: 6rpx !important;
  border-radius: 3rpx !important;
  margin-left: 6rpx !important;
  background-color: #f2f2f2 !important;
}

::v-deep .uni-swiper-dot-active {
  background-color: #ff5722 !important;
  width: 24rpx !important;
}
</style>
