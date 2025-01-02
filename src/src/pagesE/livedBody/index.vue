<template>
  <view class="page-wrapper">
    <view class="page-container01" v-show="!bgFlage">
      <!-- <view class="status-bar" :style="{ height: statusBarHeight }"></view> -->
      <view class="header" :style="{paddingTop: statusBarHeight}">
        <div class="top">
          <view class="left" @click="backBtn">
            <image class="back-img" src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/goback.png"></image>
            <view class="title-img">
              {{ mainTitle }}
            </view>
            <view class="header-title">{{ subTitle }}</view>
          </view>
           <!-- #ifdef H5 -->
          <image
            class="pet-img"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/petMark_cat.png"
            mode="scaleToFill"
          />
          <!-- #endif -->
        </div>
        <div class="search" @click="toSearch">
          <view class="input-btn iconfont icon-search"></view>
          <view class="placeholder">{{ keyword || '搜宠物品种' }}</view>
        </div>
      </view>
    </view>
    <view class="page-container" v-show="bgFlage">
      <view class="header" :style="{paddingTop: statusBarHeight}">
        <div class="top">
          <view class="left" @click="backBtn">
            <image class="back-img" src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/goback.png"></image>
            <view class="title-img">
              {{ mainTitle }}
            </view>
            <view class="header-title">{{ subTitle }}</view>
          </view>
           <!-- #ifdef H5 -->
          <view @click="toSearch" class="input-btn iconfont icon-search"></view>
          <!-- #endif -->
        </div>
      </view>
    </view>
    <!-- <image
      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/big_bg.png"
      mode="widthFix"
      class="bg-img"
    /> -->
    <!-- 类目and筛选项 -->
    <!-- <CategoryScreening
      :tabList="tabList"
      :tabIndex="tabIndex"
      :breedList="breedList"
      :shopId="shopId"
      :liveShopList="liveShopList"
      :priceList="priceList"
      @liveSelectChange="liveSelectChange"
      :breedStickyTop="breedStickyTop"
      :changeBreedType="changeBreedType"
      @showMore="showMore"
      :secondId="secondId"
      :changePetChangeFlag="changePetChangeFlag"
      :showTop="toShowTop"
      v-show="toShowTop"
      :isClearOther="isClearOther"
      :parentDataOut="parentDataOut"
    /> -->

    <scroll-view
      class="page-scroll-view"
      :lower-threshold="250"
      :scroll-top="scrollTop"
      @scrolltolower="onScrolltolower"
      @scroll="onScroll"
      :scroll-y="enableScroll"
      :style="{
        paddingTop: !toShowTop ? `calc(${bgFlage ? '85rpx' : '177rpx'} + ${statusBarHeight})` : '',
        height: `${activeHeight}`,
      }"
      :refresher-enabled="false"
      :refresher-triggered="isTriggered"
      @refresherrefresh="handleRefresherrefresh"
      @scrolltoupper="handleScrolltoupper"
      @refresher-abort="onRefresherAbort"
      @refresher-restore="onRefresherRestore"
    >
        <view class="banner-wrap">
          <banner-swiper
          banner-key="BANNER_LIVE_CHANNEL_APPLE"
          bannerStyle=""
          moduleName="shop"
          actionName=""
          displayName=""
        />
        </view>
      <view :class="[changeBreedType && 'tabs-container1','tabs-container']" :style="{top:changeBreedType ? `calc(85rpx + ${statusBarHeight})` : 0}">
        <scroll-view scroll-x class="tab-scroll">
          <view class="tab-list-box">
            <view class="listBox">
              <u-tabs
                v-if="isShowPageC"
                :activeStyle="{
                  color: '#1f1f1f',
                  fontSize: '31rpx',
                  fontFamily: 'AlimamaShuHeiTi-Bold',
                }"
                :inactiveStyle="{
                  color: '#1f1f1f',
                  fontSize: '31rpx',
                }"
                lineColor="transparent"
                :list="tabList"
                @click="handleTabsClick"
                @change="handleTabsChange"
                :current="tabIndex"
              ></u-tabs>
            </view>
          </view>
        </scroll-view>
        <view class="date-select"></view>
      </view>
      <!-- :enhanced="true"
      :bounces="false" -->
      <!-- 类目and筛选项 -->
      <CategoryScreening
        :tabList="tabList"
        :tabIndex="tabIndex"
        :breedList="breedList"
        :shopId="shopId"
        :liveShopList="liveShopList"
        :priceList="priceList"
        @liveSelectChange="liveSelectChange"
        :breedStickyTop="breedStickyTop"
        :changeBreedType="changeBreedType"
        @showMore="showMore"
        :secondId="secondId"
        :changePetChangeFlag="changePetChangeFlag"
        :isClearOther="isClearOther"
        :parentDataOut="parentDataOut"
      />

      <!-- 活体商品列表 -->
      <GoodsList
        :goodsList="liveGoodsList"
        :recommendedShop="recommendedShop"
        :tabIndex="tabIndex"
        :tabList="tabList"
        :tabId="tabId"
        :breedId="breedId"
        :filterData="selectParams"
        :tabName="tabName"
        :isLoading="isLoading"
        :isRequesting="isRequesting"
        @handleRefresh="handleRefresh"
        :showAppointmentStatus="showAppointmentStatus"
      />
    </scroll-view>
    <!--  -->
    <livedBodyScreenPop
      v-if="isShowComponent"
      :isOpen.sync="isOpen"
      :breedList="breedList"
      :tabList="tabList"
      :statusBarHeight="statusBarHeight"
      :current.sync="tabIndex"
      :secondClassifyId="
        (selectParams &&
          selectParams.secondClassifyIds &&
          selectParams.secondClassifyIds[0]) ||
        ''
      "
      @handleBreedFilter="handleSelectSearch"
      @close="closeClick"
    ></livedBodyScreenPop>
    <view :class="[!showAllTopIcon && 'topicon-half', 'topicon']" @click="handleToTop" v-if="showTopIcon">
      <view class="icon iconfont icon-BackTop"></view>
    </view>
  </view>
</template>

<script>
import livedBodyScreenPop from "./components/livedBodyScreenPop/index.vue";
import GoodsList from "./components/goodsList.vue";
import CategoryScreening from "./components/categoryScreening.vue";
import bannerSwiper from './components/banner.vue'
import {
  GET_TAB_LIST,
  GET_LIVE_BODY_IMG,
  GET_GOODS_LIST,
  GOTO_CHECK_SHOP,
  GET_APPOINTMENT_STATUS,
  GET_GOODS_LIST_v3,
  GET_TITLE
} from "@/api/livedBody";
import { display_report } from "@/utils/track";
import { GET_PRICE_RANGE, GET_LIVESHOP_LIST,GET_HOT_WORD } from "@/api/mallv2";
import { getUserInfo } from "@/api/base/index";
import { eventBus } from "@/utils/eventBus";
import { isEmptyObj } from "@/utils/index";
export default {
  components: {
    CategoryScreening,
    GoodsList,
    livedBodyScreenPop,
    bannerSwiper
  },
  mounted() {
    // 从商详点击活体收藏同步频道列表收藏（标识）
    // #ifdef MP-WEIXIN
    eventBus.$on("live-collect", (data) => {
      console.log("🚀 ~ eventBus.$on ~ data:", data);
      this.goodsList.forEach((item) => {
        if (item.liveId === data.liveId) {
          item.collect = data.collect;
        }
      });
    });
    // #endif
    // 筛选项弹层出现时，禁止滚动
    eventBus.$on("select-mask", (bool) => {
      if (bool) {
        this.enableScroll = false;
      } else {
        this.enableScroll = true;
      }
    });
    // 监听智能排序、筛选是否重新选择了，用于清除推荐门店
    uni.$on("clearRecommendShop", (bool) => {
      this.isClearRecommend = true;
    });
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  beforeDestroy() {
    eventBus.$off("live-collect");
    eventBus.$off("select-mask");
    uni.$off("clearRecommendShop");
    // #ifdef H5
    localStorage.removeItem("liveCollect");
    // #endif
  },
  data() {
    return {
      goodsListLen: 0,
      option: undefined,
      tabIndex: 0,
      tabList: [],
      breedList: [],
      statusBarHeight: getApp().globalData.statusBarHeight,
      breedStickyTop: "0px", // 品种栏吸顶值
      filterStickyTop: "0px",
      changeBreedType: false, // 二级类目的显示方式
      shopId: "",
      isAgain: false,
      isOptionAgain: false,
      tabId: "",
      tabName: "",
      bgFlage: false,
      scrollTop: 0,
      tabsNum: 0,
      isShowPageC: true,
      priceList: [], // 价格
      liveShopList: [], // 活体筛选门店
      selectParams: {}, // 筛选参数
      recommendedShop: {}, // 推荐门店
      isLoading: false, // 是否正在加载
      goodsList: [], // 商品列表
      isRequesting: false, // 是否正在请求
      isLoading: false, // 是否正在加载
      breedId: "",
      pageNum: 1,
      pageSize: 10,
      isLastPage: false,
      memberId: "",
      isOpen: false,
      recommendShopList: [], // 推荐门店 shopId 列表
      secondId: "", // 二级类目id
      isShowComponent: true,
      isQuery: false, // 子组件是否传参了
      changePetChangeFlag: false,
      activeHeight: "100vh",
      isTriggered: false, // 滚动条下拉刷新
      triggeredShopIds: [], // 触发下拉刷新的 shopId 列表
      refreshing: false, // 是否正在刷新
      toShowTop: false, // 是否显示顶部的筛选栏
      showAppointmentStatus: false, // 是否显示预约状态
      enableScroll: true, // 是否允许滚动
      isClearOther: false, // 是否清空其他筛选条件
      parentDataOut: {}, // 吸顶/非吸顶筛选栏数据（用于两边UI以及数据同步）
      selectDTO: {}, // 用于存储子组件传来的原始所有筛选条件（二级类目、门店、排序、性别、价格）
      isClearRecommend: false, // 是否清空推荐门店
      getGoodsListParams: {}, // 记录获取商品列表的参数，用于刷新单个活体收藏状态、直播热度
      keyword:'',
      showTopIcon:false,
      showAllTopIcon:false,
      showTopIconTimer:null,
      hotWords:[],
      loopTimer:null,
      rollTime:5000,
      loopIndex:0,
      mainTitle:'',
      subTitle:''
    };
  },

  onLoad(option) {
    this.option = option;
    this.shopId = option.shopId;
    if (option.tabIndex > -1) {
      this.isShowPageC = false;
      setTimeout(() => {
        this.isShowPageC = true;
      }, 10);
      this.tabIndex = Number(option.tabIndex);
      this.isAgain = false;

      this.getTabList(option.tabIndex);
    }
    if (!option.tabId) {
      uni.removeStorageSync("visitedShopIds");
    }

    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
        this.getTopHeight(this.statusBarHeight);
        this.activeHeight = `calc(100vh - 177rpx - ${this.statusBarHeight})`;
      },
    });
    //#endif

    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    this.getTopHeight(this.statusBarHeight);
    this.activeHeight = "100vh";
    //#endif

    // 埋点相关
    let userId;
    // #ifdef H5
    userId = this.$dsBridge.call("getUserId", "getUserId");
    // #endif
    // #ifdef MP-WEIXIN
    const res = uni.getStorageSync("storage_info");
    userId = res.userId;
    // #endif
    display_report({
      display_name: "Livepetchannel_show",
      extend: {
        user_id: userId,
      },
    });
    this.getPriceRangeList();
    this.getLiveshopList();
    this.getHotWord()
    this.getTitle()
  },
  onShow() {
    console.log("livedBody onShow");
    this.getAppointmentStatus();
    // #ifdef H5
    this.$dsBridge.register("refreshCartPage", this.refreshCollect);
    // #endif
    // 获取热搜索词
  },
  onReady() {
    console.log("onReady====>", "触发了H5的方法");
    // #ifdef H5
    // this.$dsBridge.register("refreshCartPage", this.refreshCollect);
    // #endif
  },
  computed: {
    liveGoodsList() {
      return Array.from(new Set(this.goodsList));
    },
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  methods: {
    // 获取热搜索词
    getHotWord(){
      GET_HOT_WORD({type:14}).then(res=>{
        console.log(res,'热词');
        this.hotWords = res?.data?.hotWords || []
        this.rollTime = (res?.data?.rollTime || 5)*1000 
        this.loopKeyWord()
      }).catch(err=>{
        console.log(err,'热词');
      })
    },
    // 获取标题
    getTitle(){
      GET_TITLE({type:6}).then(res=>{
        const info = (res?.data?.data || [])[0] || {}
        this.mainTitle = info.name || ''
        this.subTitle = info.info || ''
      }).catch(err=>{
        console.log(err,'officialGuarantee');
      })
    },
    loopKeyWord(){
      this.keyword = this.hotWords[0] || ''
      this.loopTimer = setInterval(()=>{
        this.loopIndex = (this.loopIndex+1) >= this.hotWords.length ? 0 : this.loopIndex+1        
        this.keyword = this.hotWords[this.loopIndex] || this.hotWords[this.loopIndex] || ''
      },this.rollTime)
    },
    toSearch(){
      // #ifdef MP-WEIXIN      
      uni.navigateTo({
         url: `/pagesC/searchGoods/index?from=liveBody&keyword=${this.keyword}`
      })
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/home/search?scene=3&keyword=${this.keyword}`
      });
      // #endif
    },
    // 从商详点击活体收藏同步频道列表收藏（标识）
    refreshCollect() {
      console.log("this.getGoodsListParams===>", this.getGoodsListParams);
      const dataH5 = JSON.parse(localStorage?.getItem("liveCollect")) || {};
      console.log(
        "🚀 ~ onShow ~ isEmptyObj(dataH5:",
        isEmptyObj(dataH5),
        dataH5,
        Object.prototype.toString.call(dataH5)
      );
      if (!isEmptyObj(dataH5)) {
        GET_GOODS_LIST_v3(this.getGoodsListParams)
          .then((res) => {
            let newGoodsList = res.data.data.data;
            console.log(
              "🚀 ~ GET_GOODS_LIST_v3 ~ res:",
              res,
              newGoodsList,
              dataH5,
              Object.prototype.toString.call(dataH5)
            );
            if (newGoodsList && newGoodsList.length > 0) {
              let collectItem = {};
              [collectItem] = newGoodsList?.filter(
                (newGoodsItem) => newGoodsItem.itemId === dataH5.itemId
              );
              console.log("collectItem====>", collectItem, newGoodsList);
              this.goodsList.forEach((item) => {
                if (
                  !isEmptyObj(collectItem) &&
                  item.itemId === collectItem.itemId
                ) {
                  item.collect = collectItem.collect;
                  // #ifdef H5
                  localStorage.removeItem("liveCollect");
                  // #endif
                }
              });
            }
          })
          .catch((err) => {
            console.log("🚀 ~ GET_GOODS_LIST_v3 ~ err:", err);
          });
      }
    },
    // 获取预约状态
    async getAppointmentStatus() {
      try {
        const res = await GET_APPOINTMENT_STATUS();
        this.showAppointmentStatus =
          res.data.data.haveWatchPetReservation || false;
      } catch (error) {
        console.log("request error:", error);
      }
    },
    // 自定义下拉刷新
    handleRefresherrefresh() {
      if (this.refreshing) return;
      this.refreshing = true;
      this.isTriggered = true;
      setTimeout(() => {
        this.isTriggered = false;
        this.pageNum = 1;
        this.goodsList = [];
        this.liveShopList.forEach((ele) => {
          if (this.triggeredShopIds && this.triggeredShopIds[0]) {
            if (ele.shopId == this.triggeredShopIds[0]) {
              this.isQuery = true; // 模拟子组件传参用于修改goodsList接口shopIdList传参
              this.selectParams.allstores = ele;
            }
          }
        });
        this.getGoodsList();
        this.getAppointmentStatus();
      }, 1000);
    },
    // 当刷新动作结束需要恢复到初始状态时触发
    onRefresherRestore() {
      this.refreshing = false;
    },
    // 下拉刷新中断
    onRefresherAbort() {
      this.refreshing = false;
    },
    // 滚动到顶部触发事件
    handleScrolltoupper() {
      this.bgFlage = false;
      this.changeBreedType = false;
    },
    // 接收类目pop数据，刷新页面
    handleSelectSearch(data, index) {
      if (!data) return;
      this.pageNum = 1;
      const { parentId, id } = data;
      const firstIndex = this.tabList.findIndex((item) => item.id === parentId);
      if (this.tabIndex != firstIndex) {
        this.isShowComponent = false;
        this.breedList = this.tabList[firstIndex].subClassify;
      }
      this.tabIndex = firstIndex;
      this.tabName = this.tabList[firstIndex].name;
      this.secondId = id ? id : "";
      this.changePetChangeFlag = !this.changePetChangeFlag;
      this.selectParams.secondClassifyIds = id ? [id] : [];
      this.tabId = parentId;
      this.goodsList = [];
      this.isShowComponent = true;
      this.getGoodsList();
    },
    // 类目pop
    showMore() {
      this.isOpen = true;
    },
    // 【前往查看】刷新数据
    handleRefresh(shopInfo) {
      this.pageNum = 1;
      this.shopId = shopInfo.shopId;
      this.$set(this, "shopId", shopInfo.shopId);
      this.selectParams.shopIdList = [shopInfo.shopId];
      // 点击[前往查看]时,排除该门店推荐
      this.recommendShopList = [...this.recommendShopList, shopInfo.shopId];
      this.goodsList = [];
      this.isQuery = false;
      this.getGoodsList();
    },
    // 获取活体商品数据
    async getGoodsList(type) {
      if (!this.memberId) {
        const user = await getUserInfo(true, true);
        this.memberId = user.memberId;
      }
      const { secondClassifyIds, highPrice, lowerPrice, gender, shopIdList } =
        this.selectParams;

      const shopIds = shopIdList ? shopIdList : [];
      const firstIds = this.tabId ? [this.tabId] : [];
      const params = {
        memberId: this.memberId,
        firstCategoryIds: firstIds, // 一级类目
        secondClassifyIds: secondClassifyIds,
        highPrice: highPrice,
        lowerPrice: lowerPrice,
        gender: gender,
        pageNum: this.pageNum,
        pageSize: 10,
        searchType: 1,
      };
      const firstShop = this.liveShopList[0];
      // 如果第一个门店selectedShop为1,进入页面默认展示该门店,同时推荐门店列表中不展示该门店
      if (
        firstShop?.selectedShop == 1 &&
        firstShop?.shopId &&
        !this.hasTruthyValue(shopIdList)
      ) {
        params.shopIdList = [firstShop.shopId];
      }
      // 如果筛选组件传参了,判断是否修改了门店,没有修改则使用推荐门店(this.shopId变量只有点击前往查看或者路由参数有值时才赋值);
      if (this.isQuery) {
        params.shopIdList = shopIds || [this.shopId];
      } else if (!this.isQuery && this.shopId) {
        params.shopIdList = [this.shopId];
        // 首次进入或者筛选组件未传参时,推荐门店中-排除默认选中的门店id
        let firstShopId = "";
        if (firstShop.selectedShop == 1 && firstShop.shopId) {
          firstShopId = firstShop.shopId;
          this.recommendShopList.push(firstShopId);
        }
      }

      // 排序--TODO 待联调
      if (this.selectParams?.sortInfo) {
        params.sortType = this.selectParams?.sortInfo?.id;
      } else {
        params.sortType = 1;
      }

      try {
        this.refreshing = false;
        this.isLoading = true;
        this.isRequesting = true;
        // 排除查看过的门店id,若第一个门店selectedShop为1,进入页面默认展示该门店,同时推荐门店列表中不展示该门店
        if (params.shopIdList?.length > 0) {
          const list = [...this.recommendShopList, ...params.shopIdList];
          this.recommendShopList = Array.from(new Set(list));
        }
        // #ifdef H5
        params.searchType = 2;
        // #endif
        // 记录下拉刷新前的门店id
        this.triggeredShopIds = params.shopIdList;
        console.log("🚀 ~ getGoodsList ~ params:", params);
        this.getGoodsListParams = params;
        const res = await GET_GOODS_LIST_v3(params);
        const resData = res.data.data.data || [];
        if (resData && resData.length < 10) {
          this.isLastPage = true;
        } else {
          this.isLastPage = false;
        }
        if (type && type == "changeTab") {
          this.goodsList = [];
          this.goodsList = resData;
        } else {
          this.goodsList.push(...resData);
        }
        this.isLoading = false;
        this.isRequesting = false;
        if (this.goodsList.length < 3) {
          const query = {
            ...params,
            excludeShopIdList: this.recommendShopList || [],
            allShopIdList: this.liveShopList.map((item) => item.shopId) || [],
          };
          const res = await GOTO_CHECK_SHOP(query);
          // 推荐门店 shopId 列表
          this.recommendedShop = res.data?.data || {};
          this.isClearRecommend = false;
        }
      } catch (error) {
        this.isLoading = false;
        this.isRequesting = true;
        this.refreshing = false;
      }
    },
    splitData(data) {
      const secondClassifyIds = data.categoryInfo?.secondClassifyIds || []; // 二级类目
      const shopInfo = data.dataOut?.shopInfo || {};
      const sortInfo = data.dataOut?.sortInfo || {}; // 排序
      const filterInfo = data.dataOut?.filterInfo || {};
      const gender = filterInfo.sexInfo?.sex; // 性别
      const lowerPrice = filterInfo.priceInfo?.priceRangeBegin; // 最低价
      const highPrice = filterInfo.priceInfo?.priceRangeEnd; // 最低价
      const shopIdList = shopInfo.shopId && [shopInfo.shopId]; // 门店
      return {
        secondClassifyIds,
        shopIdList,
        gender,
        lowerPrice,
        highPrice,
        sortInfo,
      };
    },

    // 活体筛选条件
    liveSelectChange(params) {
      console.log("🚀 ~ liveSelectChange ~ params:", params);
      this.isQuery = true;
      this.pageNum = 1;
      this.recommendedShop = {};
      this.goodsList = [];
      this.isLastPage = false;
      this.selectDTO = params; // 用于存储子组件传来的原始所有筛选条件（二级类目、门店、排序、性别、价格）
      this.selectParams = this.splitData(params);
      const { gender, highPrice, lowerPrice, secondClassifyIds, sortInfo } =
        this.splitData(params);
      // 判断智能排序、筛选是否重新选择了值，若是则排除推荐门店列表 清空
      if (this.isClearRecommend) {
        this.recommendShopList = [];
      }
      // 处理卡片二级类目选中态与吸顶二级类目条选中态不同步问题
      if (secondClassifyIds.length > 0) {
        this.secondId = secondClassifyIds[0];
      } else {
        this.secondId = "";
      }
      // 处理筛选栏同步问题(固定与吸顶)
      if (this.selectParams.shopIdList?.length > 0) {
        this.$set(this, "shopId", this.selectParams.shopIdList[0]);
      } else {
        this.$set(this, "shopId", "");
      }
      if (sortInfo || gender || highPrice || lowerPrice) {
        this.parentDataOut = params.dataOut;
        this.$set(this, "parentDataOut", params.dataOut);
      }
      this.changePetChangeFlag = !this.changePetChangeFlag;
      this.getGoodsList();
      // uni.$u.debounce(this.getGoodsList("changeTab"), 200);
    },
    async getLiveshopList() {
      let lon, lat, province, provinceCode, city, cityCode;
      const mall_last_search_address_obj = uni.getStorageSync(
        "mall_last_search_address_obj"
      ); //当前收货地址位置
      if (!mall_last_search_address_obj) {
        lon = uni.getStorageSync("lon");
        lat = uni.getStorageSync("lat");
        province = uni.getStorageSync("province");
        provinceCode = uni.getStorageSync("provinceCode");
        city = uni.getStorageSync("currentCity");
        cityCode = uni.getStorageSync("selectedCityCode");
      } else {
        lon = mall_last_search_address_obj.lon;
        lat = mall_last_search_address_obj.lat;
        province = mall_last_search_address_obj.province;
        provinceCode = mall_last_search_address_obj.provinceCode;
        city = mall_last_search_address_obj.city;
        cityCode = mall_last_search_address_obj.cityCode;
      }

      if (lon && lat && province) {
        const isRequest = {
          lng: lon,
          lat: lat,
          province: province,
          provinceCode: provinceCode,
          city: city,
          cityCode: cityCode,
        };
        await this.getShopList(isRequest);
      } else {
        // #ifdef H5
        let res = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
          ? JSON.parse(
              this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
              {}
            )
          : {};
        const isRequest = {
          lng: res.lon,
          lat: res.lat,
          province: res.province,
          provinceCode: res.provinceCode,
          city: res.cityName,
          cityCode: res.cityCode,
        };
        await this.getShopList(isRequest);
        // #endif
        // #ifdef MP-WEIXIN
        uni.getLocation({
          type: "gcj02",
          success: async (res) => {
            const isRequest = {
              lng: res.longitude,
              lat: res.latitude,
            };
            await this.getShopList(isRequest);
          },
          fail: async (err) => {
            await this.getShopList();
          },
        });
        // #endif
      }
    },
    // 获取活体门店
    async getShopList(params) {
      try {
        let { data } = await GET_LIVESHOP_LIST(params);
        this.liveShopList = data.data;
        if (!this.shopId) {
          this.liveShopList.forEach((item) => {
            if (item.selectedShop === 1) {
              this.shopId = item.shopId;
            }
          });
        }
      } catch (error) {
        console.log("🚀 ~ getShopList ~ error:", error);
      } finally {
        this.getTabList(0); // 获取tab列表
      }
    },
    // 获取筛选价格
    async getPriceRangeList() {
      try {
        let { data } = await GET_PRICE_RANGE();
        this.priceList = data.data || [];
      } catch (error) {
        console.log("🚀 ~ getPriceRangeList ~ error:", error);
      }
    },
    getTopHeight(statusBarHeight) {
      // -----导航栏 + 手机状态栏 = 品种栏top高度
      this.breedStickyTop = `calc(77rpx + 86rpx + ${statusBarHeight})`;

      // -----导航栏 + 品种栏 + 手机状态栏 = 筛选栏top高度
      this.filterStickyTop = `calc(81rpx + 76rpx + ${this.statusBarHeight})`;
    },
    // tab点击事件
    handleTabsClick(item) {
      console.log("this.tabIndex", this.tabIndex, item.index);
      if (this.tabIndex === item.index) return;
      this.tabIndex = item.index;
      this.tabId = item.id; // 存储附近门店跳转的tab id
      this.tabName = item.name;
      console.log("点击了===", this.tabName);
      // this.goodsList = [];
      this.pageNum = 1;
      this.breedList = item.subClassify || [];
      this.recommendShopList = [];
      this.recommendedShop = {};
      const shopIdList = this.selectParams.shopIdList;
      this.$set(this, "goodsList", []);
      this.$set(this, "selectParams", {});
      this.$set(this, "secondId", "");
      this.$set(this, "isClearOther", !this.isClearOther);
      this.$set(this.selectParams, "secondClassifyIds", []);
      this.$set(this.selectParams, "shopIdList", shopIdList);
    },
    handleTabsChange(item) {
      if (this.option.tabIndex) {
        this.isAgain = true;
      }
      this.goodsList = [];
      this.$set(this, "goodsList", []);
      this.getTabList(this.tabIndex, "changeTab");
      console.log("change===");
    },
    // 返回按钮
    backBtn() {
      //#ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
      //#ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
      //#endif
    },
    // 滚动条触发事件
    onScroll(e) {      
      this.oldScrollTop = e.detail.scrollTop;
      this.showTopIconTimer = null
      clearTimeout(this.showTopIconTimer)
      this.showAllTopIcon = false
      if(e.target.scrollTop >= 750){
        this.showTopIcon = e.target.scrollTop > 750;
        this.showTopIconTimer = setTimeout(()=>{
          this.showAllTopIcon = true
        },1000)
      }else{
        this.showTopIcon = false
      }
      if (e.target.scrollTop > 20) {
        this.bgFlage = true;
      } else {
        this.bgFlage = false;
      }
      if (e.target.scrollTop > 150) {
        if (this.goodsList.length < 5) return;
        this.changeBreedType = true;
        // this.toShowTop = true;
        // 及时同步吸顶二级类目的选中状态;
        if (!this.selectParams?.secondClassifyIds) {
          this.secondId = "";
        }
      } else {
        this.changeBreedType = false;
        // this.toShowTop = false;
      }
      this.parentDataOut = this.selectDTO.dataOut;
      this.changePetChangeFlag = !this.changePetChangeFlag;
    },
    handleToTop() {      
      this.scrollTop = this.oldScrollTop;
      setTimeout(() => {
        this.$nextTick(() => {
          this.scrollTop = 0;
        });
      }, 150);
    },
    // 滚动条触底事件
    onScrolltolower() {
      if (this.isLastPage) return;
      this.pageNum++;
      this.getGoodsList();
    },

    // 获取活体tab及品种数据
    async getTabList(nowIndex = 0, type = "") {
      try {
        this.$nextTick(async () => {
          if (!this.isAgain) {
            const res = await GET_TAB_LIST();
            this.tabList = res.data.data || [];
            this.isAgain = true;
            this.tabId = this.tabList[nowIndex] && this.tabList[nowIndex].id; // 存储附近门店跳转的tab id
            await this.getLiveBodyImg();
          }
          this.tabName = this.tabList[nowIndex].name; // 获取提示文字
          this.breedList =
            (this.tabList[nowIndex] && this.tabList[nowIndex].subClassify) ||
            [];

          if (this.option && !this.isOptionAgain) {
            this.isOptionAgain = true;
          }
          uni.$u.debounce(this.getGoodsList(type), 200);
          // this.getGoodsList(type);
        });
      } catch (error) {
        console.log("request error:", error);
      }
    },

    // 获取活体tab及品种数据
    async getLiveBodyImg(nowIndex = 0) {
      try {
        const {
          data: { data },
        } = await GET_LIVE_BODY_IMG();
        let pitImg = [];
        let dataImg = [];
        data.forEach((item) => {
          if (item.type == 2) {
            pitImg.push(item);
          } else if (item.type == 1) {
            dataImg.push(item);
          }
        });
        // 此处逻辑为获取和id对应的一级类目的imageUrl，若无则使用第一项的imageUrl
        this.tabList.forEach((tab) => {
          const index = data.findIndex(
            (item) => item.firstClassifyId == tab.id
          );
          const defaultIndex = data.findIndex(
            (item) => item.firstClassifyId == 0
          );
          if (index != -1) {
            console.log(123113131131, tab.subClassify[0]);
            tab.noneIMG = pitImg[index]?.imageUrl;
            tab.subClassify.unshift({
              appId: undefined,
              icon: undefined,
              id: "",
              name: "全部",
              parentId: tab.id,
              picture: dataImg[index].imageUrl,
              platformId: undefined,
              subClassify: [],
            });
          } else {
            tab.noneIMG = pitImg[defaultIndex]?.imageUrl;
            tab.subClassify.unshift({
              appId: undefined,
              icon: undefined,
              id: "",
              name: "全部",
              parentId: tab.id,
              picture: dataImg[defaultIndex].imageUrl,
              platformId: undefined,
              subClassify: [],
            });
          }
        });
      } catch (error) {
        console.log("request error:", error);
      }
    },

    closeClick() {
      this.isOpen = false;
    },
    // 判断数组是否有真值
    hasTruthyValue(arr) {
      if (!arr || arr.length === 0) return false;
      return arr.some((value) => value);
    },
  },
  beforeDestroy() {
    clearInterval(this.loopTimer);
    this.loopTimer = null
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<style lang="scss">
.back-btn {
  width: 42rpx;
  height: 42rpx;
  position: fixed;
  .banc-img {
    width: 42rpx;
    height: 42rpx;
  }
}
.tab-list {
  width: 100%;
  height: 42rpx;
  display: flex;
  align-items: center;
  overflow: auto;
  box-sizing: border-box;
  .tab-item {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 31rpx;
    color: #1f1f1f;
    line-height: 42rpx;
    text-align: center;
    padding: 0 22rpx;
  }
  .activeTab {
    font-family: AlimamaShuHeiTi, AlimamaShuHeiTi-Bold !important;
  }
  .lastItem {
    margin-right: 200rpx !important;
  }
}
.tab-list-box {
  display: flex;
  align-items: center;
  .listBox {
    width: 100%; // 300rpx;
  }
}
::v-deep .u-tabs__wrapper__nav__item {
  padding: 0 29rpx !important;
}
::v-deep .u-tabs__wrapper__nav__line{
  width: 38rpx;
  height: 0 !important;
  border: 2rpx solid #FE2442;
  background: #FE2442;
  margin-bottom: 8rpx;
}
</style>
