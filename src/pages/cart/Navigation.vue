<template>
  <view>
    <!-- 轮播组件 -->
    <swiper
      :indicator-dots="shouldShowIndicator && showIndicator"
      class="swiper"
      :style="{ height: swiperHeight }"
    >
      <swiper-item
        v-for="(group, index) in groupedItems"
        :key="index"
        class="swiper__item"
      >
        <view
          v-for="(item, itemIndex) in group"
          class="swiper__item-content"
          :key="itemIndex"
          :style="{ width: itemWidth + '%' }"
        >
          <view class="swiper__item-image">
            <u-image
              :src="item.image"
              width="64rpx"
              height="64rpx"
              radius="32rpx"
            >
            </u-image>
          </view>
          <view class="swiper__item-name">{{ item.title }}</view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  props: {
    // 传入的 items 数组，包含要显示的 item 数据
    items: {
      type: Array,
      default: () => [],
    },
    // 每行显示的 item 数量
    itemsPerRow: {
      type: Number,
      default: 4,
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

  watch: {
    // 监听 items 的变化，当 items 变化时重新分组
    items: {
      handler: 'groupItems',
      immediate: true,
    },
  },

  mounted() {
    // 组件挂载时调用 groupItems 方法进行分组
    this.groupItems()
  },

  computed: {
    // 计算每个 item 的宽度，根据每行显示的 item 数量动态调整
    itemWidth() {
      return 100 / this.itemsPerRow
    },
    // 计算轮播组件的高度，根据行数动态调整
    swiperHeight() {
      return `${145 * this.rows}rpx`
    },
    // 判断是否需要显示指示点，当分组后的 items 数量大于 1 时显示
    showIndicator() {
      return this.groupedItems.length > 1
    },
  },

  data() {
    return {
      // 分组后的 items 数组
      groupedItems: [],
    }
  },

  methods: {
    // 对 items 进行分组的方法
    groupItems() {
      // 计算每页显示的 item 数量
      const itemsPerPage = this.itemsPerRow * this.rows
      // 使用 reduce 方法对 items 进行分组
      this.groupedItems = this.items.reduce((groups, item, index) => {
        // 计算当前 item 所属的分组索引
        const groupIndex = Math.floor(index / itemsPerPage)
        // 如果当前分组不存在，则初始化一个空数组
        if (!groups[groupIndex]) {
          groups[groupIndex] = []
        }
        // 将当前 item 添加到对应的分组中
        groups[groupIndex].push(item)
        return groups
      }, [])
    },
  },
}
</script>

<style lang="scss" scoped>
/* Block: 轮播组件 */
.swiper {
  margin: 8rpx 32rpx;
  background: white;
  border-radius: 32rpx;
}

/* Element: 轮播项 */
.swiper__item {
  display: flex;
  flex-wrap: wrap;
}

/* Element: 轮播项内容 */
.swiper__item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16rpx 0;
  overflow: hidden;
}

/* Element: 轮播项图片 */
.swiper__item-image {
  width: 64rpx;
  height: 64rpx;
}

/* Element: 轮播项名称 */
.swiper__item-name {
  margin-top: 8rpx;
  font-size: 16rpx;
}
</style>
