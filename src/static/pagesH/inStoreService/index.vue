<template>
  <view class="in-store-service">
    <!-- 顶部导航栏 -->
    <NavBar
      ref="navBarRef"
      :nav-color="isNavBarFixed ? '#86df5c' : '#426080'"
      show-back-btn
      :white-back="false"
    >
      <template #righticon>
        <view class="in-store-service__nav-bar-content">
          <Location />
          <view class="in-store-service__search-bar-back">
            <!-- 根据滚动状态显示或隐藏搜索图标 -->
            <image
              v-if="isNavBarFixed || isSearchIconVisible"
              :class="{
                'in-store-service__search-icon--visible': isNavBarFixed,
                'in-store-service__search-icon--hidden': !isNavBarFixed,
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

    <!-- 搜索框，滚动时隐藏 -->
    <view
      v-show="!isNavBarFixed"
      class="in-store-service__search-box"
    >
      <SearchBar />
    </view>
    <!-- 内容区 -->
    <scroll-view
      scroll-y
      :scroll-top="scrollTop"
      class="in-store-service__scroll-view"
      :style="{ height: `calc(100vh - ${navHeight})` }"
      @scroll="onScroll"
    >
      <!-- 金刚区，展示导航项 -->
      <NavigationArea
        v-if="navigationList.length"
        :items="navigationList"
      />
      <!-- 券码区，展示优惠券 -->
      <CouponArea
        v-if="couponList.length"
        :list="couponList"
      />
      <!-- 组件区，展示组件 -->
      <ComponentArea
        v-if="componentList.length"
        :list="componentList"
      />
      <!-- 资源区，展示资源列表 -->
      <ResourceList
        v-if="resourceList.length"
        :list="resourceList"
      />

      <!-- 商品 Feeds 流，展示商品信息 -->
      <!-- <ProductFeeds /> -->
      <!-- 用于测试滚动的 Feeds 组件 -->
      <!-- <Feeds /> -->
      <u-safe-bottom />

      <!-- 回到顶部按钮，滚动到一定位置时显示 -->
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
    <!-- 暂无数据提示，当前未启用 -->
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
// import ProductFeeds from './ProductFeeds.vue'
import CartButton from './CartButton.vue'
import Location from './Location.vue'
import SearchBar from './SearchBar.vue'
import NavBar from '@/components/navBar/index.vue'
import NoData from '@/components/noData/index.vue'

// 引入 API 接口
import {
  fetchResourceAPI,
  fetchCouponListAPI,
  fetchComponentListAPI,
  fetchNavigationAPI,
  fetchProductListAPI,
  fetchShopByCityAPI,
} from './api/inStoreService'

export default {
  name: 'InStoreService',
  components: {
    BackToTop,
    ResourceList,
    CouponArea,
    ComponentArea,
    NavigationArea,
    // ProductFeeds,
    Location,
    CartButton,
    SearchBar,
    NavBar,
    NoData,
    // Feeds,
  },

  data () {
    return {
      // 滚动条位置
      scrollTop: 0,
      oldScrollTop: 0,
      // 是否显示回到顶部按钮
      showBackToTop: false,
      isNavBarFixed: false,
      // 搜索图标是否可见 (默认不可见)
      isSearchIconVisible: false,
      // 资源区数据
      resourceList: [],
      // 优惠券数据
      couponList: [],
      // 组件区数据
      componentList: [],
      // 金刚区数据
      navigationList: [],
      navHeight: 0,
    }
  },

  async onLoad () {
    // 页面加载时获取数据
    await Promise.all([
      this.fetchResourceData(),
      this.fetchCouponListData(),
      this.fetchComponentListData(),
      this.fetchNavigationData(),
      this.fetchProductListData(),
      this.fetchShopByCityData()
    ])
  },

  mounted () {
    // 获取导航栏高度
    this.navHeight = this.$refs.navBarRef.navHeight
  },

  methods: {
    // 获取资源区数据
    async fetchResourceData () {
      const resp = await fetchResourceAPI()
      this.resourceList = resp.data.data.resourceList
      console.log(
        '🚀 ~ fetchResourceData ~ this.resourceList:',
        this.resourceList
      )
    },
    async fetchProductListData () {
      const resp = await fetchProductListAPI()
      console.log('🚀 ~ fetchProductListData ~ resp:', resp)
    },
    // 获取优惠券数据
    async fetchCouponListData () {
      const resp = await fetchCouponListAPI()
      this.couponList = resp.data.data
      console.log(
        '🚀 ~ fetchCouponListData ~ this.couponList:',
        this.couponList
      )
    },
    // 获取组件区数据
    async fetchComponentListData () {
      const resp = await fetchComponentListAPI()
      this.componentList = resp.data.data
      console.log(
        '🚀 ~ fetchComponentListData ~ this.componentList:',
        this.componentList
      )
    },

    // 获取金刚区数据
    async fetchNavigationData () {
      const resp = await fetchNavigationAPI()
      this.navigationList = resp.data.data
      console.log(
        '🚀 ~ fetchNavigationData ~ this.navigationList:',
        this.navigationList
      )
    },

    async fetchShopByCityData () {
      const resp = await fetchShopByCityAPI()
      console.log('🚀 ~ fetchShopByCityData ~ resp:', resp)
      // this.shopByCityList = resp.data.data
      // console.log(
      //   '🚀 ~ fetchShopByCityData ~ this.shopByCityList:',
      //   this.shopByCityList
      // )
    },

    // 滚动事件处理
    onScroll (event) {
      const { scrollTop } = event.detail

      // 判断是否显示回到顶部按钮
      this.showBackToTop = scrollTop > 750
      this.showBackToTop && this.$refs.backToTop.isScroll()
      // 记录滚动条位置
      this.oldScrollTop = scrollTop

      // 判断页面是否已经滚动到一定位置，从而控制导航栏的样式和搜索图标的显示。
      if (scrollTop > 70) {
        this.isNavBarFixed = true
        this.isSearchIconVisible = true
      } else {
        this.isNavBarFixed = false
        // 滚动条向上滚动时延迟显示搜索图标
        setTimeout(() => {
          if (!this.isNavBarFixed) {
            this.isSearchIconVisible = false
          }
        }, 300)
      }
    },
    // 回到顶部
    scrollToTop () {
      // 视图会发生重新渲染
      this.scrollTop = this.oldScrollTop
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
