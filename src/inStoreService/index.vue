<template>
  <view class="in-store-service">
    <!-- 顶部导航栏 -->
    <NavBar
      :nav-color="scrolled ? '#86df5c' : '#426080'"
      show-back-btn
      :white-back="false"
    >
      <template #righticon>
        <view class="in-store-service__nav-bar-content">
          <Location />
          <view class="in-store-service__search-bar-back">
            <image
              v-if="scrolled || iconVisible"
              :class="{
                'in-store-service__search-icon--visible': scrolled,
                'in-store-service__search-icon--hidden': !scrolled,
              }"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/header-search.png"
              class="in-store-service__search-icon"
              mode="widthFix"
            />
            <CartButton />
          </view>
        </view>
      </template>
    </NavBar>

    <view
      v-show="!scrolled"
      class="in-store-service__search-box"
    >
      <SearchBar />
    </view>
    <Card />
    <!-- 内容区 -->
    <scroll-view
      scroll-y
      :scroll-top="scrollTop"
      class="in-store-service__scroll-view"
      @scroll="onScroll"
    >
      <!-- 金刚区 -->
      <NavigationArea :items="navigationList" />
      <!-- 券码区 -->
      <CouponArea
        v-if="couponList.length"
        :list="couponList"
      />
      <!-- 组件区 -->
      <ComponentArea
        v-if="componentList.length"
        :list="componentList"
      />
      <!-- 资源区 -->
      <ResourceList :list="resourceList" />

      <!-- 商品 Feeds 流 -->
      <ProductFeeds />
      <!-- 暂时使用来测滚动 -->
      <Feeds />

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
    </scroll-view>
    <view
      v-if="false"
    >
      <NoData
        no-data-text="暂无数据"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      />
    </view>
  </view>
</template>

<script>
import BackToTop from './components/BackToTop.vue'
import ResourceList from './ResourceList.vue'
import CouponArea from './CouponArea.vue'
import ComponentArea from './ComponentArea.vue'
import NavigationArea from './NavigationArea.vue'
import ProductFeeds from './ProductFeeds.vue'
import CartButton from './CartButton.vue'
import Location from './Location.vue'
import SearchBar from './SearchBar.vue'
import NavBar from '@/components/navBar/index.vue'
import NoData from '@/components/noData/index.vue'
import Feeds from './components/Feeds.vue'
import Card from './Card.vue'

// mock api
// import {
//   fetchResourceAPI,
//   fetchCouponListAPI,
//   fetchComponentListAPI,
//   fetchNavigationAPI,
// } from './mock/api'

import {
  fetchResourceAPI,
  fetchCouponListAPI,
  fetchComponentListAPI,
  fetchNavigationAPI,
} from './api/inStoreService'

export default {
  name: 'InStoreService',
  components: {
    BackToTop,
    ResourceList,
    CouponArea,
    ComponentArea,
    NavigationArea,
    ProductFeeds,
    Location,
    CartButton,
    SearchBar,
    NavBar,
    NoData,
    Feeds,
    Card
  },

  data () {
    return {
      // 滚动条位置
      scrollTop: 0,
      oldScrollTop: 0,
      // 是否显示回到顶部按钮
      showBackToTop: false,
      // 导航栏是否吸顶
      scrolled: false,
      // 搜索图标是否可见 (默认不可见)
      iconVisible: false,
      // 资源区数据
      resourceList: [],
      // 优惠券数据
      couponList: [],
      // 组件区数据
      componentList: [],
      // 金刚区数据
      navigationList: [],
    }
  },

  async onLoad () {
    await Promise.all([
      this.fetchResourceData(),
      this.fetchCouponListData(),
      this.fetchComponentListData(),
      this.fetchNavigationData(),
    ])
  },

  methods: {
    async fetchResourceData () {
      const resp = await fetchResourceAPI()
      this.resourceList = resp.data.data.resourceList
      console.log(
        '🚀 ~ fetchResourceData ~ this.resourceList:',
        this.resourceList
      )
    },
    async fetchCouponListData () {
      const resp = await fetchCouponListAPI()
      this.couponList = resp.data.data
      console.log(
        '🚀 ~ fetchCouponListData ~ this.couponList:',
        this.couponList
      )
    },
    async fetchComponentListData () {
      const resp = await fetchComponentListAPI()
      this.componentList = resp.data.data
      console.log(
        '🚀 ~ fetchComponentListData ~ this.componentList:',
        this.componentList
      )
    },

    async fetchNavigationData () {
      const resp = await fetchNavigationAPI()
      this.navigationList = resp.data.data
      console.log(
        '🚀 ~ fetchNavigationData ~ this.navigationList:',
        this.navigationList
      )
    },

    onScroll (event) {
      const { scrollTop } = event.detail

      // 判断是否显示回到顶部按钮
      this.showBackToTop = scrollTop > 750
      this.showBackToTop && this.$refs.backToTop.isScroll()

      // 判断导航栏是否需要吸顶
      if (scrollTop > 70) {
        this.scrolled = true
        this.iconVisible = true
      } else {
        this.scrolled = false
        // 滚动条向上滚动时延迟显示搜索图标
        setTimeout(() => {
          if (!this.scrolled) {
            this.iconVisible = false
          }
        }, 300)
      }

      // 记录滚动条位置
      this.oldScrollTop = scrollTop
    },
    scrollToTop () {
      // 视图会发生重新渲染
      this.scrollTop = this.oldScrollTop
      console.log('🚀 ~ scrollToTop ~ this.oldScrollTop:', this.oldScrollTop)
      // 当视图渲染结束 重新设置为 0
      this.$nextTick(() => {
        this.scrollTop = 0
      })
    },
  },
}
</script>

<style scoped lang="scss">
.in-store-service {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__scroll-view {
    height: calc(100% - var(--window-top));
    margin-top: var(--window-top);
  }

  &__nav-bar-content{
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20rpx;
  }

  &__search-bar-back{
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
    // padding: 0 31rpx 13rpx 15rpx; // 可以根据实际情况调整 padding
  }

  &__search-icon {
    width: 38rpx;
    height: 38rpx;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    transform: scale(0.8);

    &--visible {
      opacity: 1;
      transform: scale(1);
    }

    &--hidden {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  &__search-box {
    padding: 40rpx;
    background-color: #f5f5f5;
  }
}
</style>
