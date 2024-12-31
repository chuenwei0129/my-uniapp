<template>
  <view>
    <view class="waterfallBox">
      <view
        id="leftColumn"
        class="column column1"
      >
        <!-- 骨架屏 -->
        <view
          v-if="showSkeleton && useSkeleton && leftList.length === 0"
          class="skeleton-waterfall paddingRight"
        >
          <view
            v-for="i in 2"
            :key="i"
            class="skeleton-item"
          >
            <image
              class="icon"
              :src="skeletonIcon"
            />
          </view>
        </view>
        <myWaterItem
          v-else
          :img-key="imgKey"
          :list="leftList"
          :shop-logo="shopLogo"
          :origin="origin"
          @onClickItem="onClickItem"
        />
      </view>
      <view
        id="rightColumn"
        class="column column2"
      >
        <!-- 骨架屏 -->
        <view
          v-if="showSkeleton && useSkeleton && rightList.length === 0"
          class="skeleton-waterfall paddingLeft"
        >
          <view
            v-for="i in 2"
            :key="i"
            class="skeleton-item"
          >
            <image
              class="icon"
              :src="skeletonIcon"
            />
          </view>
        </view>
        <myWaterItem
          v-else
          :img-key="imgKey"
          :list="rightList"
          :shop-logo="shopLogo"
          :origin="origin"
          @onClickItem="onClickItem"
        />
      </view>
    </view>
    <view
      v-if="noMoreData"
      class="last-container"
    >
      已经到底啦喵～
    </view>
  </view>
</template>
<script>
import myWaterItem from '@/components/waterfall/water-item.vue'
export default {
  name: 'MyWaterFall',
  components: {
    myWaterItem,
  },
  props: {
    value: {
      type: Array,
      required: true,
      default: function () {
        return []
      },
    },
    //图片在data对象字段
    imgKey: {
      type: String,
      default: '',
    },
    addTime: {
      type: [Number, String],
      default: 5,
    },
    idKey: {
      type: String,
      default: 'id',
    },
    shopLogo: {
      type: Boolean,
      default: false,
    },
    noMoreData: {
      type: Boolean,
      default: false,
    },
    // 父级来源
    origin: {
      type: String,
      default: '',
    },
    // 是否使用骨架屏
    useSkeleton: {
      type: Boolean,
      default: false
    },
  },
  emits: ['onClickItem'],

  data () {
    return {
      leftList: [],
      rightList: [],
      tempData: [],
      // 骨架屏icon
      skeletonIcon:
        'https://frontend-cdn.chongpangpang.com/image/medical-mp/home/skeleton_icon.png',
      showSkeleton: true, // 骨架屏 开启/关闭
    }
  },
  computed: {
    copyFlowList () {
      return this.cloneData(this.value)
    },
  },
  watch: {
    copyFlowList (nVal, oVal) {
      const startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0
      this.tempData = this.tempData.concat(
        this.cloneData(nVal.slice(startIndex))
      )
      this.splitData()
    },
  },
  mounted () {
    this.tempData = this.cloneData(this.copyFlowList)
    this.splitData()
    uni.$on('skeleton-refresh', (bool) => {
      setTimeout(() => {
        this.showSkeleton = bool
      }, 300)
    })
  },
  methods: {
    async splitData () {
      if (!this.tempData.length) return
      const leftRect = await this.$uGetRect('#leftColumn')
      const rightRect = await this.$uGetRect('#rightColumn')
      const item = this.tempData[0]
      if (!item) return
      if (leftRect.height < rightRect.height) {
        this.leftList.push(item)
      } else if (leftRect.height > rightRect.height) {
        this.rightList.push(item)
      } else {
        if (this.leftList.length <= this.rightList.length) {
          this.leftList.push(item)
        } else {
          this.rightList.push(item)
        }
      }
      this.tempData.splice(0, 1)
      const that = this
      if (that.tempData.length) {
        setTimeout(() => {
          that.splitData()
        }, that.addTime)
      }
    },
    cloneData (data) {
      return JSON.parse(JSON.stringify(data))
    },
    onClickItem (item) {
      console.log(item)
      this.$emit('onClickItem', item)
    },
    // 清除数据，用于重新渲染
    clear () {
      this.leftList = []
      this.rightList = []
      this.tempData = []
    },
  },
}
</script>

<style lang="scss" scoped>
.waterfallBox {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: #f7f8fc;
}

.column {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: auto;
}
.column1 {
  margin: 0 8rpx 0 16rpx;
}
.column2 {
  margin: 0 16rpx 0 8rpx;
}
.last-container {
  width: 100%;
  display: flex;
  margin-top: 60rpx;
  padding-bottom: 25rpx;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 23rpx;
  color: #5a5a5a;
  line-height: 33rpx;
}

.skeleton-waterfall {
  width: calc((100vw - 30rpx) / 2);
  box-sizing: border-box;
  .skeleton-item {
    width: 352rpx; // calc((100vw - 46rpx) / 2);
    height: 552rpx;
    background: #ffffff;
    border-radius: 23rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16rpx;
    .icon {
      display: block;
      width: 165rpx;
      height: 65rpx;
    }
  }
}
.paddingRight {
  padding-right: 8rpx;
}
.paddingLeft {
  padding-left: 8rpx;
}
</style>
