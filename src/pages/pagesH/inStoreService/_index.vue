<template>
  <view class="page">
    <view
      class="nav-bar"
      :class="{ 'nav-bar-scroll': scrolled }"
    >
      <Location />
      <view
        style="display:flex; justify-content: space-between; align-items: center; padding: 0 31rpx 13rpx 15rpx;"
        class="searchbar-back"
      >
        <image
          v-if="scrolled || iconVisible"
          :class="{ 'search-icon-visible': scrolled, 'search-icon-hidden': !scrolled }"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/header-search.png"
          style="width: 38rpx; height: 38rpx"
          class="search-icon"
          mode="widthFix"
        />
        <CartButton />
      </view>
    </view>
    <view
      v-show="!scrolled"
      class="search-box"
    >
      <SearchBar />
    </view>
    <scroll-view
      scroll-y
      class="content"
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <!-- 金刚区 -->
      <Navigation />
      <!-- 组件区 -->
      <!-- <CompArea /> -->
      <!-- 券码区 -->
      <Coupon />
      <!-- 资源区 -->
      <ResourceCard />
      <!-- Feeds 流 -->
      <ClassifyTabs />
      <Feeds />
    </scroll-view>
    <!-- 回到顶部 -->
    <BackToTop
      v-show="showBackToTop"
      ref="backToTop"
      @click="scrollToTop"
    >
      <template #icon>
        <u-icon name="arrow-upward" />
      </template>
    </BackToTop>
  </view>
</template>

<script>
import Location from './components/Location.vue'
import CartButton from './components/CartButton.vue'
import SearchBar from './components/SearchBar.vue'
import Navigation from './components/Navigation.vue'
import Coupon from './components/Coupon.vue'
import ClassifyTabs from './components/ClassifyTabs.vue'
// import CompArea from './components/CompArea.vue'
import BackToTop from './components/BackToTop.vue'
import Feeds from './components/Feeds.vue'
import ResourceCard from './components/ResourceCard.vue'

// api
import { fetchCartCount, fetchCouponList, fetchNavigation, fetchRecommendClassify, fetchCompList, fetchResource } from './api/inStoreService'

export default {
  components: {
    Location,
    ClassifyTabs,
    CartButton,
    SearchBar,
    Navigation,
    Coupon,
    BackToTop,
    // CompArea,
    Feeds,
    ResourceCard
  },
  data () {
    return {
      scrollTop: 0,
      oldScrollTop: 0,
      scrolled: false,
      iconVisible: false,
      showBackToTop: false,
    }
  },

  async created () {
    try {
      const { userId } = uni.getStorageSync('storage_info')
      const [cartCountRes ,navigationRes ,couponRes, compAreaRes, resourceListRes, recommendClassifyRes ] = await Promise.all([
        // 购物车数量
        fetchCartCount({ checked: false, cartType: 1 }),
        // 金刚区
        // displayChannel: 'APP_MP',
        fetchNavigation({ bizType: 2 }),
        // 券码
        fetchCouponList({ userId: Number(userId), status: 5 }),
        // 组件区
        fetchCompList({ page: 2 }),
        // 资源区
        fetchResource({ cityCode: '320100','lng': 32.00335, 'lat': 118.73145}),
        // 类目区
        fetchRecommendClassify({
          recommendType: 1,
          commodityClassifyType: 2
        })
      ])
      console.log('🚀 ~ created ~ cartCountRes:', cartCountRes)
      console.log('🚀 ~ created ~ resourceListRes:', resourceListRes)
      console.log('🚀 ~ created ~ cartCountRes:', cartCountRes)
      console.log('🚀 ~ created ~ couponRes:', couponRes)
      console.log('🚀 ~ created ~ compAreaRes:', compAreaRes)
      console.log('🚀 ~ created ~ recommendClassifyRes:', recommendClassifyRes)
      console.log('🚀 ~ created ~ navigationRes:', navigationRes)
    } catch (error) {
      console.error('请求失败:', error)
    }
  },
  methods: {
    onScroll (event) {
      const { scrollTop } = event.detail

      this.scrolled = scrollTop > 100
      this.showBackToTop = scrollTop > 750
      this.showBackToTop && this.$refs.backToTop.isScroll()

      if (scrollTop > 80) {
        this.iconVisible = true
      } else {
        this.iconVisible = false
      }

      this.oldScrollTop = scrollTop
    },
    scrollToTop () {
      // 视图会发生重新渲染
      this.scrollTop = this.oldScrollTop
      // 当视图渲染结束 重新设置为0
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
  },
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.nav-bar {
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #426080;
  transition: background-color 0.3s;
}
.nav-bar-scroll {
  background-color: #86df5c;
}

.search-icon {
  width: 40rpx;
  height: 40rpx;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  transform: scale(0.8);
}
.search-icon-visible {
  opacity: 1;
  transform: scale(1);
}
.search-icon-hidden {
  opacity: 0;
  transform: scale(0.8);
}

.search-box {
  margin-top: 70rpx;
  padding: 20rpx;
  background-color: #f5f5f5;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 20rpx;
  background-color: #F6F8FC;
}
.content-item {
  padding: 20rpx;
  background-color: #fff;
  margin-bottom: 10rpx;
  border-radius: 10rpx;
}
</style>
