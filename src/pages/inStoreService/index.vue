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
          <view>
            <view>
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/loaction-icon.png"
                style="width: 40rpx; height: 40rpx"
              />
              <text
                v-if="locationPermissionStatus.granted"
                @click="goToSelectPositionCityPage"
              >
                {{ locationInfo.address }}
              </text>
              <text v-else-if="locationPermissionStatus.fetching">
                定位中
              </text>
              <text
                v-else-if="locationPermissionStatus.denied"
                @click="goToSelectPositionCityPage"
              >
                定位失败，可手动切换地址
              </text>
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/bottom-arrow.png"
                style="width: 20rpx; height: 20rpx"
              />
            </view>
            <view v-if="locationPermissionStatus.denied">
              <view>打开位置权限，查看附近的内容</view>
              <view @click="goToLocationPermissionSet">
                开启
              </view>
            </view>
          </view>
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
              @click="goToSearchPage"
            />
            <CartButton ref="cartButtonRef" />
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
        :rows-per-page="2"
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

      <!-- 资源区，展示资源 -->
      <ResourceList
        v-if="resourceList.length"
        :list="resourceList"
      />

      <!-- Feeds 组件 -->
      <ProductFeeds
        v-if="shopByCityList.length"
        :location-info="locationInfo"
      />

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
import BackToTop from './BackToTop.vue'
import ResourceList from './ResourceList.vue'
import CouponArea from './CouponArea.vue'
import ComponentArea from './ComponentArea.vue'
import NavigationArea from './NavigationArea.vue'
import CartButton from './CartButton.vue'
import SearchBar from './SearchBar.vue'
import NavBar from '@/components/navBar/index.vue'
import NoData from '@/components/noData/index.vue'
import ProductFeeds from './ProductFeeds.vue'

// 引入 API 接口
// import {
//   fetchResourceAPI,
//   fetchCouponListAPI,
//   fetchComponentListAPI,
//   fetchNavigationAPI,
//   fetchShopByCityAPI,
//   fetchProductListAPI
// } from './api/mockAPI'

// 引入 MOCK APP 接口
// #ifdef MP-WEIXIN
import mockAPP from './api/mockAPP'
// #endif

// 引入 API 接口
import {
  fetchResourceAPI,
  fetchCouponListAPI,
  fetchComponentListAPI,
  fetchNavigationAPI,
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
    CartButton,
    SearchBar,
    NavBar,
    NoData,
    ProductFeeds
  },

  data () {
    return {
      // 导航栏高度
      navHeight: 0,
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
      products: [],
      // 定位相关逻辑
      shopByCityList: [],
      locationInfo: {
        address: '',
        cityCode: '',
        cityName: '',
        lon: '',
        lat: '',
        province: '',
        provinceCode: '',
        country: '',
        countryCode: '',
      },
      locationPermissionStatus: {
        // 正在获取
        fetching: false,
        // 已授权
        granted: false,
        // 未授权
        denied: false,
      }
    }
  },

  async onLoad () {
    // #ifdef MP-WEIXIN
    this.$dsBridge = mockAPP
    // #endif
    // 获取定位权限
    this.checkLocationPermission()
  },

  onShow () {
    // 获取购物车数量
    // this.$refs.cartButtonRef.getCartNum()
  },

  mounted () {
    // 获取导航栏高度
    this.navHeight = this.$refs.navBarRef.navHeight
  },

  methods: {
    prevDateFun (object) {
			console.log('🚀 ~ prevDateFun ~ object:', object)
      
		},
    goToSearchPage () {
      uni.navigateTo({
        url: '/pagesC/searchGoods/index',
      })
    },
    // 检查定位权限
    checkLocationPermission () {
      // 正在获取定位权限状态
      this.locationPermissionStatus.fetching = true
      // 获取定位权限状态 异步 返回！
      this.$dsBridge.call(
        'checkLocationPermission',
        'checkLocationPermission',
        (data) => {
          // 获取定位权限状态成功
          try {
            this.locationPermissionStatus.fetching = false
            console.log('🚀 ~ checkLocationPermission ~ data:', data)
            const hasLocationPermission = JSON.parse(data)
            // 更新定位权限状态
            if (hasLocationPermission) {
              // 已授权
              this.locationPermissionStatus.granted = true
              // 有权限，开始定位
              // 定位操作往往需要一定的时间
              // H5 通知 App 开始定位，App 在后台进行定位操作。
              this.$dsBridge.call('startOnceLocation', 'startOnceLocation')
              // 定位完成后，App 会通过回调将结果返回 H5。
              this.$dsBridge.register('locationCallback', this.getLocationInfo)
            } else {
              // 未授权
              this.locationPermissionStatus.denied = true
              // 没有权限，跳转到选择城市列表页面
              this.goToSelectPositionCityPage()
            }
          } catch (error) {
            console.log('🚀 ~ checkLocationPermission ~ error:', error)
          }
        }
      )
    },
    // 跳转定位APP权限设置
    goToLocationPermissionSet () {
      // 跳转到 APP 定位权限设置页面
      this.$dsBridge.call(
        'gotoLocationPermissionSet',
        'gotoLocationPermissionSet'
      )
      // 开起成功后会走 locationCallback 回调
      this.$dsBridge.register('locationCallback', this.afterLocationPermissionSet)
    },
    afterLocationPermissionSet (data) {
      try {
        // const isAuthorizationGranted = JSON.parse(data)
        const isAuthorizationGranted = data
        console.log('🚀 ~ afterLocationPermissionSet ~ isAuthorizationDenied:', !isAuthorizationGranted)
        // 处理用户拒绝授权的情况
        if (isAuthorizationGranted) {
          // 用户已经授权
          this.locationPermissionStatus.granted = true
          this.locationPermissionStatus.denied = false
          this.getLocationInfo(data)
        } else {
          // 用户拒绝授权
          this.locationPermissionStatus.granted = false
          this.locationPermissionStatus.denied = true
          this.goToSelectPositionCityPage()
        }
      } catch (error) {
        console.log('🚀 ~ afterLocationPermissionSet ~ error:', error)
      }
    },
    // TODO: 选择城市列表页面，uniapp 跳转，暂时用 Toast 代替
    goToSelectPositionCityPage () {
      uni.navigateTo({
        url: '/pagesD/selectPositionCity/index',
      })
    },
    getLocationInfo (data) {
      console.log('🚀 ~ getLocationInfo ~ data:', data)
      try {
        if (!data) {
          console.error('Error: Data is empty or undefined. Please check network connectivity.')
          return
        }
        // this.locationInfo = JSON.parse(data)
        this.locationInfo = data
        // 获取当前城市门店信息
        this.fetchShopByCityData()
      } catch (error) {
        this.locationInfo = data
        this.fetchShopByCityData()
        console.error('Error parsing data:', error)
      }
    },
  // 获取资源区数据
  async fetchResourceData () {
      const { cityCode, lon: lng, lat } = this.locationInfo
      const resp = await fetchResourceAPI({
        cityCode,
        lng,
        lat,
        fromChannel: 'APP'
      })
      console.log('🚀 ~ fetchResourceData ~ resp:', resp)
      this.resourceList = resp.data.data.resourceList || []
    },
    // 获取优惠券数据
    async fetchCouponListData () {
      // TODO: 测试
      const userId = this.$dsBridge.call('getUserId', 'getUserId') || '401211901598814208'
      const resp = await fetchCouponListAPI({
        userId,
        status: 5
      })
      console.log('🚀 ~ fetchCouponListData ~ resp:', resp)
      this.couponList = resp.data.data || []
    },
    // 获取组件区数据
    async fetchComponentListData () {
      const resp = await fetchComponentListAPI()
      console.log('🚀 ~ fetchComponentListData ~ resp:', resp)
      this.componentList = resp.data.data ||[]
    },
    // 获取金刚区数据
    async fetchNavigationData () {
      const resp = await fetchNavigationAPI()
      console.log('🚀 ~ fetchNavigationData ~ resp:', resp)
      this.navigationList = resp.data.data || []
    },
    // 获取城市门店数据
    async fetchShopByCityData () {
      const { cityCode } = this.locationInfo
      const resp = await fetchShopByCityAPI({
        cityCode,
        bizType: 3
      })
      console.log('🚀 ~ fetchShopByCityData ~ resp:', resp)
      this.shopByCityList = resp.data.data || []
      // 根据返回值处理门店信息
      if (this.shopByCityList.length === 0) {
        // 如果门店信息为空，跳转到选择城市列表页面
        this.goToSelectPositionCityPage()
        return
      }
      // 门店信息不为空，处理页面其他逻辑
      await Promise.allSettled([
        this.fetchNavigationData(),
        this.fetchResourceData(),
        this.fetchCouponListData(),
        this.fetchComponentListData()
      ])
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
  background-color: #fff;

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
