<template>
  <view class="navigation">
    <!-- 轮播组件 -->
    <swiper
      :indicator-dots="shouldShowIndicator && showIndicator"
      class="navigation__swiper"
      :style="{ height: swiperHeight }"
    >
      <swiper-item
        v-for="(group, index) in groupedItems"
        :key="index"
        class="navigation__swiper-item"
      >
        <view
          v-for="(item, itemIndex) in group"
          :key="itemIndex"
          class="navigation__swiper-item-content"
          :style="{ width: itemWidth + '%' }"
        >
          <view class="navigation__swiper-item-image">
            <u-image
              :src="item.image"
              width="64rpx"
              height="64rpx"
              radius="8rpx"
            />
          </view>
          <view class="navigation__swiper-item-name">
            {{ item.title }}
          </view>
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
      // Mock 数据
      default: () => [
        {
          title: '洗澡',
          image: 'http://iph.href.lu/60x60?text=Bath&bg=0000FF&fg=FFFFFF',
          cornerIcon: 'http://iph.href.lu/20x20?text=Icon&bg=FF0000&fg=FFFFFF',
          jumpType: '1',
          h5Link: 'https://example.com/services/bath',
          appLink: '',
          miniLink: '/pages/service/detail?id=101',
        },
        {
          title: '美容',
          image: 'http://iph.href.lu/60x60?text=Beauty&bg=FF0000&fg=FFFFFF',
          cornerIcon: '',
          jumpType: '2',
          h5Link: '',
          appLink: 'app://beauty-service',
          miniLink: '/pages/service/detail?id=102',
        },
        {
          title: '绝育',
          image: 'http://iph.href.lu/60x60?text=Neuter&bg=00FF00&fg=FFFFFF',
          cornerIcon: '',
          jumpType: '1',
          h5Link: 'https://example.com/services/neuter',
          appLink: '',
          miniLink: '/pages/service/detail?id=103',
        },
        {
          title: '疫苗',
          image: 'http://iph.href.lu/60x60?text=Vaccine&bg=FF00FF&fg=FFFFFF',
          cornerIcon: 'http://iph.href.lu/20x20?text=Icon&bg=FF0000&fg=FFFFFF',
          jumpType: '2',
          h5Link: '',
          appLink: 'app://vaccine-service',
          miniLink: '/pages/service/detail?id=104',
        },
        {
          title: '体检',
          image: 'http://iph.href.lu/60x60?text=Checkup&bg=FFFF00&fg=000000',
          cornerIcon: '',
          jumpType: '3',
          h5Link: '',
          appLink: '',
          miniLink: '/pages/service/detail?id=105',
        }
      ],
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
      return `${145 * this.rows}rpx`
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
  },
}
</script>

<style lang="scss" scoped>
.navigation {
  background: white;
  border-radius: 16rpx;

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
    width: 64rpx;
    height: 64rpx;
  }

  &__swiper-item-name {
    margin-top: 8rpx;
    font-size: 16rpx;
  }
}
</style>
