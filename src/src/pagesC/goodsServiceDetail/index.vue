<script>
// import GoodsPrice from "@/components/goodsPrice/index.vue";
import GoodsServiceParamPopView from "@/pagesC/goodsServiceDetail/components/goodsServiceParamPopView.vue";
import GoodsSafeguardPopView from "@/pagesC/goodsServiceDetail/components/goodsSafeguardPopView.vue";
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
import IconButton from "@/pagesC/components/iconButton/index.vue";
import GradientButton from "@/pagesC/components/gradientButton/index.vue";
import GoodsServiceUseRules from "@/pagesC/goodsServiceDetail/components/goodsServiceUseRules.vue";
import GoodsServiceApplicableStore from "@/pagesC/goodsServiceDetail/components/goodsServiceApplicableStore.vue";
import GoodsServiceBanner from "@/pagesC/goodsServiceDetail/components/goodsServiceBanner.vue";
import GoodsBannerLiving from "@/pagesC/goodsServiceDetail/components/livingBody/goodsBannerLiving.vue";
import PopConfirm from "@/pagesC/goodsServiceDetail/components/livingBody/popConfirm.vue";
import GoodsTitleLiving from "@/pagesC/goodsServiceDetail/components/livingBody/goodsTitleLiving.vue";
import VaccineDeworming from "@/pagesC/goodsServiceDetail/components/livingBody/vaccineDeworming.vue";
import RaceDesc from "@/pagesC/goodsServiceDetail/components/livingBody/raceDesc.vue";
import ShopInfoLiving from "@/pagesC/goodsServiceDetail/components/livingBody/shopInfoLiving.vue";
import GoodsServiceTitlePriceTags from "@/pagesC/goodsServiceDetail/components/goodsServiceTitlePriceTags.vue";
import GoodsServicePictures from "@/pagesC/goodsServiceDetail/components/goodsServicePictures.vue";
import GoodsServiceSpecsParam from "@/pagesC/goodsServiceDetail/components/goodsServiceSpecsParam.vue";
import GoodsSpecsV2 from "@/pagesC/goodsServiceDetail/components/goodsSpecsV2.vue";
import GoodsNewUserActivityCountdown from "@/pagesC/goodsServiceDetail/components/goodsNewUserActivityCountdown.vue";
import RsvtPopup from "@/pagesC/components/reservationPopup/index.vue";
import Appraise from "@/pagesC/goodsServiceDetail/components/appraise/index.vue";
import AppraiseCard from "@/pagesC/goodsServiceDetail/components/appraise/appraiseCard.vue";
import GoodsDetailNav from "@/pagesC/goodsServiceDetail/components/goodsDetailNav.vue";
import CallApp from "@/pagesC/goodsServiceDetail/components/callApp.vue";
import GuideBrowser from "@/pagesC/goodsServiceDetail/components/guideBrowser.vue";
import {
  sendFormId,
  rsvtionformId,
  getBrowserInfo,
  lunchApp,
} from "@/utils/index";
import {
  FETCH_SHOP_DETAIL,
  GET_CART_TOTAL,
  GET_RECOMMEND_GOODS,
} from "@/api/mallv2";
import { GET_UPGRADE_DESC } from "@/api/memberV2";
import {
  collectGoods,
  isCollectedGoods,
  unCollectGoods,
  GET_COUPON_LIST,
} from "@/api/mall";
import {
  isCollectedGoods_livebody,
  GET_COLECT_TOTAL_livebody,
  collectGoods_livebody,
  unCollectGoods_livebody,
  getGoodsDetail_livebody,
} from "@/api/mallV3";
import { getGoodsDetail, getOtherApplicableStores } from "@/api/mallv2";
import {
  GET_RESERVATION_TIME,
  CREATE_RESERVATION,
  GET_NEEDKNOW,
  GET_QUALITY_COMMENTS,
} from "@/api/mallV3";
import NoData from "@/components/noData/index.vue";
import { addCart } from "@/api/cart";
import GoodsServiceSpecsPopView from "@/pagesC/goodsServiceDetail/components/goodsServiceSpecsPopView.vue";
import { mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
import { getQueryString } from "@/utils/index";
import { parseShortLink } from "@/api/base/index";

import { eventBus } from "@/utils/eventBus";

const h5Domain = {
  development: "https://cn-dev01-shareactivity.chongpangpang.com/",
  test: "https://cn-dev02-shareactivity.chongpangpang.com/",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/",
  production: "https://shareactivity.chongpangpang.com/",
};
export default {
  name: "index",
  components: {
    GoodsServiceSpecsPopView,
    NoData,
    GoodsServiceSpecsParam,
    GoodsSpecsV2, // 实物-规格
    GoodsServicePictures,
    GoodsServiceTitlePriceTags,
    GoodsServiceBanner,
    GoodsServiceApplicableStore,
    GoodsServiceUseRules,
    GoodsServiceParamPopView,
    GoodsSafeguardPopView, // 保障弹窗
    // GoodsPrice,
    CellItemNormal,
    IconButton,
    GradientButton,
    GoodsNewUserActivityCountdown,
    GoodsBannerLiving, // 活体 banner
    GoodsTitleLiving, // 活体 title
    VaccineDeworming, // 疫苗驱虫(活体)
    RaceDesc, // 品种介绍(活体)
    ShopInfoLiving, // 店铺信息(活体)
    PopConfirm, // 锁单弹层(活体)
    RsvtPopup, // 预约弹层（活体）
    Appraise, // 评价列表
    AppraiseCard, // 评价卡片
    GoodsDetailNav, // 商详导航
    CallApp,
    GuideBrowser,
  },
  data() {
    return {
      goodsData: [],
      data: {
        pageNum: 1,
        pageSize: 10,
        type: 2,
      },
      isAnimating: false,
      isCart: false,
      showPopView: false,
      showParamsPopView: false,
      showSpecsPopView: false,
      backButtonTop: "",
      navBarHeight: "",
      isCompleted: false,
      collected: false,
      storesList: [],
      itemId: "",
      itemName: "",
      skuId: "",
      //附近门店第1个id
      mallId: "",
      //附近门店第1个id
      shopName: "",
      //外面传过来的
      shopId: "",
      // 活动传过来
      activityId: "",
      //skuList
      skuList: [],
      //购买数量
      buyNum: 1,
      //商品详情
      detailData: {
        // 轮播图
        carouselPicture: [],
        // 详情图片
        detailPicture: [],
        //是否是虚拟商品
        virtualized: false,
        //是否是药品
        drugClassify: false,
        //商品id
        itemId: "",
        //商品名称
        itemName: "",
        //参数
        itemProperties: [],
        //使用规则
        limitTimeDesc: "",
        //   物流模板
        logisticsTemplate: "",
        //是否上架
        onSaleStatus: false,
        //限制件数
        saleStrategy: {
          buyLimitNum: -1, //表示无限制
        },
        //店铺id
        shopId: "",
        // 店铺名称
        shopName: "",
        //skuList
        skuList: [],
        //specList
        specList: [],
        //specList
        selectSku: {},
        //总销量
        totalSaleQty: [],
        //默认地址
        userDefaultAddress: "",
        //服务时间
        serviceTime: "",
        // 新人商品
        newPersonFlag: false,
        // 新人商品倒计时
        newPersonCountDownTime: 0,
      },
      cartNum: 0,
      writing: "确认",
      writingType: 1, //1加入购物车 2立即购买
      couponList: [],
      activityList: [],
      couponListForPop: [],
      activityListForPop: [],
      isCanBuy: true, // 是否可以购买
      // isService: false, // 是否到点服务跳转
      codeOrigin: "",
      dataSettled: false,
      collectIcon_0:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/collectIcon_0.png",
      collectIcon_1:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/collectIcon_1.png",
      // 预约看宠
      isShowRsvtPop: false,
      // 是否活体
      isLiveBody: false,
      // 活体收藏数量
      collectCount: 0,
      // 活体是否收藏
      livebodyCollected: false,
      timeSlot: [],
      needKnow: {},
      // 活体详情
      livebodyDetail: null,
      // 活体轮播图
      carouselPicture_livebody: [],
      // 锁单弹层
      showLockPop: false,
      // 是否有买家锁单
      ifBuyerLockOrder: 0,
      // 是否有库存
      ifStock: 0,
      // 是/否售出 4:售出 不为4:未售出
      //   UNKNOWN(0, ""),
      // OFF_SALE(1, "未上架"),
      // ON_SALE(2, "售卖中"),
      // SOLD_OUT(3, "无库存"),
      // SOLD(4, "已出售");
      saleStatus: null,
      // 上架状态（true：上架，false：下架）
      onShelf: true,
      // 是否开启预约
      ifEnableSubscribe: 0,
      // 自己是否预约
      ifOneselfSubscribe: 0,
      livbodySkuId: null,
      // 活体品种 1, "猫类活体" 2, "犬类活体" 3, "鸟类活体" 4, "爬行类活体" 5, "小宠类活体"
      speciesClassification: null,
      // 异宠类型;1:高价值异宠  2:低价值异宠
      alienPetType: null,
      // 是否是高价值 true是，false否
      isHighValue: false,
      // 疫苗
      vaccinationList: [],
      // 驱虫
      liveDewormingRecordDTO: [],
      // 性格特点
      speciesIntroduction: "",
      // 品种介绍
      disposition: "",
      // 饲养介绍
      feedingDesc: "",
      isSecondGetDetail: false,
      noDataTextObj: {
        noDataText: "您查看的宝贝商城不存在～",
        noDataText2: "可能已下架",
        isShowBtnBox: false,
        img: "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/no-content.png",
      },
      //1：线上   2：扫一扫
      channelType: 1,
      upGradeDescObj: {},
      // 评价数
      commentCount: 0,
      // 优质评价
      highQualityCommentList: [],
      openComment: false,
      showSafeguardPopView: false,
      safeguardList: [],
      currentTab: "",
      scrollTop: 0,
      scrollTopV2: 0,
      isScrollingToAnchor: false, // 标志位，防止多次触发滚动
      statusBarHeight: "",
      // 返回图标&分享图标定位高度
      iconTop: 0,
      sectionPositions: [],
      currentIndex: 0,
      // 直播-数据
      liveStreamingData: {},
      // 是否唤起app
      isOpenCallApp: false,
      // 是否展示浏览器打开
      isOpenBrowser: false,
      // 唤起APP传参
      // #ifdef H5
      scheme: {
        host: "main_activity",
        params: {
          router: "/web/main",
          WebViewUrl: encodeURIComponent(
            `${window.location.href}&transparentTopBar=1`
          ),
        },
      },
      // #endif
    };
  },
  created() {
    this.getShopList();
    this.backButtonTop = getApp().globalData?.statusBarHeight + "px";
    this.navBarHeight = getApp().globalData?.navBarHeight + "px";
  },
  mounted() {
    this.getUpgradeDesc();
    // 阿里妈妈字体
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
    // #ifdef MP-WEIXIN
    this.statusBarHeight = getApp().globalData?.statusBarHeight + "px";
    this.navBarHeight = getApp().globalData?.navBarHeight + "px";
    this.iconTop = this.backButtonTop;
    // #endif
    // #ifdef H5
    this.navBarHeight = getApp().globalData?.h5NavBarHeight + "px";
    this.statusBarHeight = getApp().globalData?.h5StatusBarHeight + "px";
    if (this.isNative) {
      this.iconTop = `calc(${this.navBarHeight})`;
    } else {
      this.iconTop = `15rpx`;
      this.statusBarHeight = 0;
    }
    // #endif

    // 获取优质评论
    this.getQualityComments();
    setTimeout(() => {
      this.updateSectionPositions();
    });
  },
  computed: {
    formattedGoods() {
      return this.goodsData.map((e) => {
        const salePrice =
          e.promotionTag != null ? e.promotionPrice : e.lowestPrice;
        const originPrice = e.promotionTag != null ? e.lowestPrice : 0;
        return {
          picture: e.majorPicture,
          title: e.itemName,
          salePrice: salePrice,
          originPrice: originPrice,
          id: e.itemId,
          skuId: e.skuId,
          skuTag: e.skuTag,
          shopId: e.shopId,
          promotion: e.promotionTag,
        };
      });
    },
    ...mapState(["userInfo"]),
    // showEmptyView () {
    //   // const itemId = this.detailData?.itemId || "";
    //   // const isToken = this.userInfo.token;
    //   // return this.isCompleted;
    //   return this.isCompleted;
    //   // if (this.userInfo.token) {
    //   //   this.isCompleted = false;
    //   // } else {
    //   //   this.isCompleted = true;
    //   // }
    //   // return itemId.length <= 0 && this.isCompleted;
    //   // return true;
    // },
    // 开启了预约看宠功能 && 未下架 && 未售出
    reservation() {
      return (
        this.ifEnableSubscribe &&
        this.onShelf &&
        ![3, 4].includes(this.saleStatus)
      );
    },
    selectedSpecs() {
      return this.selectedSku?.nickName + ` x${this.buyNum}`;
    },
    properties() {
      return this.detailData?.itemProperties || [];
    },
    // 选中的sku
    selectedSku() {
      let curSku = {};
      for (let index = 0; index < this.skuList.length; index++) {
        const ele = this.skuList[index];
        if (ele.selected) {
          curSku = ele;
          return curSku;
        }
      }
      curSku =
        this.skuList.length > 0 ? this.skuList[0] : this.detailData.selectSku;
      return curSku;
    },
    goodsState() {
      const saleStockQty = this.selectedSku?.salableStockQty || "0";
      const stockNum = Number(saleStockQty);
      const onSaleStatus = this.detailData?.onSaleStatus || false;
      if (stockNum <= 0) {
        return 3; //库存不足
      } else if (this.buyNum > stockNum) {
        return 3; //购买数量大于库存
      } else if (!onSaleStatus) {
        return 2; //商品下架
      } else {
        return 1;
      }
    },
    outsideState() {
      const saleStockQty = this.selectedSku?.salableStockQty || "0";
      const stockNum = Number(saleStockQty);
      const onSaleStatus = this.detailData?.onSaleStatus || false;
      if (stockNum <= 0) {
        return 3; //库存不足
      } else if (!onSaleStatus) {
        return 2; //商品下架
      } else {
        return 1;
      }
    },
    // 虚拟商品下单相关参数
    curSkuId() {
      return this.selectedSku?.id || "";
    },
    virtualized() {
      return this.detailData?.virtualized || "";
    },
    goodsType() {
      if (this.detailData.virtualized) {
        return "service";
      }
      return "mall";
    },
    shareImgUrl() {
      const urls = this.detailData?.carouselPicture || [];
      if (Array.isArray(urls) && urls.length) {
        return urls[0];
      }
      return "";
    },
    title() {
      // 猫、狗、高价值活体
      if (
        [1, 50].includes(this.speciesClassification) ||
        ([214, 836, 460, 835].includes(this.speciesClassification) &&
          this.alienPetType == 1)
      ) {
        return "来带走一只属于你的宠物吧！";
      }
      return this.detailData?.itemName || "";
    },
    //是否存在最大券 && 促销活动
    isMaxCoupon() {
      const res1 = this.couponList.find((item) => item.maxDiscountCoupons);
      const res2 = this.isPromotionActivity;
      return res1 || res2;
    },
    // 是否有促销活动
    isPromotionActivity() {
      const activityList = this.activityList || [];
      const firstActivity = activityList.length > 0 ? activityList[0] : null;
      if (!!firstActivity) {
        return (firstActivity.activities || []).length > 0;
      }
      return false;
    },

    // 是否新人免费商品
    isNewUserFreeGoods() {
      const { newPersonFlag, newPersonCountDownTime } = this.detailData;
      return newPersonFlag && newPersonCountDownTime > 0;
    },
    // 是否新人专区商品
    isNewUserAreaGoods() {
      const { newPersonFlag } = this.detailData;
      return newPersonFlag && !this.isNewUserFreeGoods;
    },
    // 是否库存不足商品
    isSoldOutGoods() {
      return this.outsideState === 3;
    },
    // 是否下架商品
    isNoSaleGoods() {
      return this.outsideState === 2;
    },
    isNative() {
      return this.$dsBridge && this.$dsBridge?.call("getToken") !== undefined;
    },
  },
  methods: {
    getQualityComments() {
      let params = {
        shopId: this.shopId || this.detailData.shopId,
        itemId: this.itemId || this.detailData.itemId,
      };
      GET_QUALITY_COMMENTS(params)
        .then((res) => {
          console.log("🚀 ~ .then ~ res:", res);
          this.commentCount = res?.data?.data?.commentCount;
          this.highQualityCommentList = res?.data?.data?.commentList;
        })
        .catch((err) => {
          console.log("获取优质评价--失败：：", err);
          // const res = highCommentsData;
          // this.commentCount = res?.data?.commentCount;
          // this.highQualityCommentList = res?.data?.commentList;
        });
    },
    async getUpgradeDesc() {
      try {
        if (!this.userInfo.token) {
          return;
        }
        const res = await GET_UPGRADE_DESC();
        this.upGradeDescObj = res?.data?.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 跳预约详情页面
    goRsvtPage() {
      let route =
        h5Domain[process.env.NODE_ENV] +
        `wallet-h5/#/livingBody/reservationDetail?reservationId=${this.livebodyDetail.liveSkuDTO.subscribeOrderNo}&transparentTopBar=1`;

      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/webView/index?route=${encodeURIComponent(
          route
        )}&type=icon`,
      });
      // #endif
      // #ifdef H5
      let domain = h5Domain[process.env.NODE_ENV] + `wallet-h5/#/`;
      let path = `livingBody/reservationDetail?reservationId=${this.livebodyDetail.liveSkuDTO.subscribeOrderNo}`;
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${domain}${path}`,
      });
      // #endif
    },
    // 预约看宠弹层
    async openRsvtPopup() {
      try {
        //todo
        action_report({
          action_name: "LivepetDetailpage_reservation_click",
          module_name: "action",
          extend: {
            user_id: this.userInfo.userId,
            commodity_id: this.detailData.itemId,
          },
        });
        const resTime = await GET_RESERVATION_TIME({
          storeId: this.livebodyDetail.liveShop.storeId,
          // 预约类型
          bizType: 4,
          // 宠物id
          skuId: this.livebodyDetail.liveSkuDTO.skuId,
        });
        const resNeedKnow = await GET_NEEDKNOW({
          storeId: this.livebodyDetail.liveShop.storeId,
          bizType: 4,
        });
        this.timeSlot = resTime?.data?.data;
        this.needKnow = resNeedKnow?.data?.data;
        this.isShowRsvtPop = true;
      } catch (error) {
        console.log("🚀 ~ openRsvtPopup ~ error:11111111", error);
      }
    },
    getShopList() {
      this.getShopListApi();
      // console.log(this.goodsData);
    },
    async getShopListApi() {
      const res = await GET_RECOMMEND_GOODS();
      this.goodsData = res.data.data.goodData;
    },
    handleRefresh() {
      this.getDetail();
    },
    // 获取可用优惠券列表
    async getAvailableCouponList(price) {
      // 新人免费不查询优惠券
      if (this.isNewUserFreeGoods && !this.isLiveBody) {
        return;
      }
      if (!this.selectedSku?.id && !this.isLiveBody) {
        return;
      }

      const { itemId, shopId, minLowestPrice } = this.detailData;
      const params = {
        itemId,
        channel: "MINI",
        skuQty: 1,
      };
      if (this.isLiveBody) {
        params.price = this.livebodyDetail.liveSkuDTO?.salePrice;
        params.skuId = this.livebodyDetail.liveSkuDTO?.skuId;
        params.shopId = this.livebodyDetail.liveShop.shopId;
      } else {
        params.price = price
          ? price
          : this.selectedSku.minSalePrice
          ? this.selectedSku.minSalePrice
          : minLowestPrice;
        params.skuId = this.selectedSku.id;
        params.classifyIdList = this.detailData.classifyIdList || [];
        params.brandId = this.detailData.brandId || [];
        params.shopId = shopId;
      }
      if (this.isNative) {
        params.channel = "APP";
      }
      const res = await GET_COUPON_LIST(params);
      const { data } = res?.data || {
        batchGetAvaliableRespDTO: [],
        listAvailableCouponsRespDTO: [],
      };
      let batchGetAvailableRespDTO = data.batchGetAvaliableRespDTO || [];
      batchGetAvailableRespDTO = batchGetAvailableRespDTO.map((e) => {
        return {
          ...e,
          activities: (e.activities || []).map((v) => {
            return {
              ...v,
              promotionType: 2,
            };
          }),
        };
      });
      this.couponList = data.listAvailableCouponsRespDTO || [];
      this.activityList = batchGetAvailableRespDTO;
      this.couponListForPop = data.listAvailableCouponsRespDTO || [];
      this.activityListForPop = batchGetAvailableRespDTO;
    },
    // 查询购物车总数量
    async getCartCount() {
      let params = {
        checked: false,

        cartType: 1,
      };
      if (!this.userInfo.token) {
        return;
      }
      const res = await GET_CART_TOTAL(params);
      let { data } = res.data;
      this.cartNum = data;
    },

    //加入购物车
    async onAddCartClickHandler() {
      action_report({
        action_name: "Detailpage_cartbutton_click",
        module_name: "shop",
        extend: {
          commodity_id: this.detailData.itemId,
        },
      });
      if (this.isOpenCallApp || this.isOpenBrowser) return;

      this.writingType = 1;
      if (this.$dsBridge && !this.$dsBridge?.call("getToken", "getToken")) {
        // APP
        this.goLoginActionH5();
        return;
      } else {
        // 非 APP
        if (!this.userInfo.token) {
          this.goToLoginAction();
          return;
        }
      }
      if (this.detailData.virtualized) {
        const res = await addCart({
          cartType: 1,
          shopId: this.detailData.shopId,
          skuId: this.curSkuId,
          skuQty: 1,
          tenantId: "default_tenant",
        });
        // uni.showToast({
        //   title: "加入购物车成功",
        //   duration: 2000,
        // });
        this.$refs.uToast.show({
          message: "加入购物车成功",
        });
        this.isAnimating = true;
        setTimeout(() => {
          this.isAnimating = false;
        }, 300);
        //解决toast一闪
        setTimeout(() => {
          this.getCartCount();
        }, 1000);
      } else {
        this.showSpecsPopView = true;
        this.writing = "确认";
      }
    },
    handleCartTapped() {
      action_report({
        action_name: "Detailpage_carticon_click",
        module_name: "shop",
      });
      if (this.isCart) {
        // #ifdef MP-WEIXIN
        uni.navigateBack();
        // #endif
        // #ifdef H5
        this.$dsBridge.call("closeCurrentWebview", {});
        // #endif
      } else {
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/shoppingCart/index`,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesC/shoppingCart/index`,
        });
        // #endif
      }
    },
    async getDetail() {
      if (!this.isSecondGetDetail) {
        this.dataSettled = false;
      }
      try {
        let params = {
          itemId: this.itemId,
          shopId: this.shopId,
          channelType: this.channelType,
          selectShopId: uni.getStorageSync("onlineCurMallId"),
          channel: "MP", // "MINI",
        };
        if (this.isNative) {
          params.selectShopId =
            this.$dsBridge && this.$dsBridge.call("getMallShopId");
          params.channel = "APP";
        }
        if (this.activityId) {
          params.newPersonActivityId = this.activityId;
        }
        if (this.skuId) {
          params.skuId = this.skuId;
        }
        // NOT_ONLINE_SHOP_NOT_CREATE("20000","（扫一扫）该商品在线上门店未创建"),
        // NOT_ONLINE_SHOP_NOT_INVENTORY("20001","（扫一扫）该商品在线上门店已售罄"),
        // NOT_ONLINE_SHOP_OFF("20003","（扫一扫）该商品在线上门店未上架"),
        // ONLINE_BASE("20004","（线上）用户线上场景进入商品详情页（兜底）"),
        const res = await getGoodsDetail(params);
        if (res.data.code === 0) {
          this.isCompleted = false;
        } else if ([20000, 20001, 20003, 20004].includes(res.data.code)) {
          console.log("getGoodsDetail", 1);

          if (res.data.code == 20004) {
            console.log("getGoodsDetail", 2);
            this.noDataTextObj.noDataText = "您查看的宝贝不存在～";
            this.noDataTextObj.noDataText2 = "可能已下架";
          } else {
            console.log("getGoodsDetail", 3);
            if (res.data.code == 20000) {
              this.noDataTextObj.noDataText = "您查看的宝贝商城不存在～";
            } else if (res.data.code == 20003) {
              console.log("getGoodsDetail", 4);
              this.noDataTextObj.noDataText = "您查看的宝贝商城未上架～";
              this.noDataTextObj.img =
                "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/notListedYet.png";
            } else if (res.data.code == 20001) {
              this.noDataTextObj.noDataText = "您查看的宝贝商城已售罄～";
              this.noDataTextObj.img =
                "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/soldOut.png";
            }
            this.noDataTextObj.noDataText2 = "如需在线购买，可联系门店店员处理";
          }

          this.isCompleted = true;
          this.noDataTextObj.isShowBtnBox = false;
        } else {
          this.noDataTextObj.noDataText = "您查看的宝贝商城不存在,可能已下架";
          this.noDataTextObj.noDataText2 = "";
          this.isCompleted = true;
          this.noDataTextObj.isShowBtnBox = true;
        }

        const livebodyInfo = res.data?.data?.liveSkuDetailDTO;
        this.liveStreamingData = res.data?.data;
        console.log(
          "🚀 ~ getDetail ~ this.liveStreamingData:",
          this.liveStreamingData
        );
        // 调起直播间
        this.$nextTick(() => {
          console.log(
            "🚀 ~ onShow ~ this.liveStreamingData:888",
            this.liveStreamingData
          );
          if (this.liveStreamingData?.livingStatus == 1 && this.isNative) {
            const { liveRoomId, playUrl } = this.liveStreamingData;
            const { skuId } =
              this.liveStreamingData?.liveSkuDetailDTO?.liveSkuDTO;
            this.$dsBridge?.call("showLiveWindow", {
              playUrl,
              roomId: liveRoomId,
              refId: skuId,
            });
          }
        });
        // 活体品种 1, "猫类活体" 50, "犬类活体" 214 "水族" 836, "鸟类活体" 460, "爬行类活体" 835, "其他小宠"
        this.speciesClassification =
          livebodyInfo?.liveSkuDTO?.speciesClassification;
        // 异宠类型;1:高价值异宠  2:低价值异宠
        this.alienPetType = livebodyInfo?.liveSkuDTO?.alienPetType;
        /**
         * 判断高/低价值异宠
         * 先判断品种，若是猫狗则高价值、非猫狗再判断是否是高/低价值异宠
         */
        if (
          [1, 50].includes(this.speciesClassification) ||
          ([214, 836, 460, 835].includes(this.speciesClassification) &&
            this.alienPetType == 1)
        ) {
          // 高价值
          this.isHighValue = true;
        } else {
          // 低价值
          this.isHighValue = false;
        }
        if (this.isHighValue) {
          this.isCompleted = false;
          this.isLiveBody = true;
          this.detailData = res?.data?.data.itemDetail;
          this.livebodyDetail = res.data.data?.liveSkuDetailDTO; // 正式
          this.livbodySkuId = this.livebodyDetail?.liveSkuDTO.skuId;
          // 疫苗
          this.vaccinationList =
            this.livebodyDetail?.liveSkuDTO.vaccinationList;
          // 驱虫
          this.liveDewormingRecordDTO =
            this.livebodyDetail?.liveSkuDTO.liveDewormingRecordDTO;
          // 品种介绍
          this.disposition = this.livebodyDetail?.liveSkuDTO.disposition;
          // 性格特点
          this.speciesIntroduction =
            this.livebodyDetail?.liveSkuDTO.speciesIntroduction;
          // 饲养介绍
          this.feedingDesc = this.livebodyDetail?.liveSkuDTO.feedingDesc;
          // 底部按钮状态
          this.ifBuyerLockOrder =
            this.livebodyDetail?.liveSkuDTO?.ifBuyerLockOrder; // 是否锁定订单
          this.ifStock = this.livebodyDetail?.liveSkuDTO?.ifStock; // 库存
          this.saleStatus = this.livebodyDetail?.liveSkuDTO?.saleStatus; // 销售状态
          this.onShelf = this.livebodyDetail?.liveSkuDTO?.onShelf; // 上架状态
          this.ifEnableSubscribe =
            this.livebodyDetail?.liveSkuDTO?.ifEnableSubscribe; // 是否可预约
          this.ifOneselfSubscribe =
            this.livebodyDetail?.liveSkuDTO?.ifOneselfSubscribe; // 是否自己预约
          display_report({
            display_name: "LivepetDetailpage_show",
            module_name: "display_report",
            extend: {
              user_id: this.userInfo.userId,
              commodity_id: this.livebodyDetail.liveSkuDTO.itemId,
            },
          });

          // 转换图片
          let images = this.livebodyDetail?.liveSkuDTO.imgUrlList || [];
          images = images.map((item) => {
            return {
              url: item,
              type: "image",
            };
          });
          // 活体轮播图
          this.carouselPicture_livebody = images;
          //获取优惠券信息----一期活体，没有优惠券
          // if (this.userInfo.token) {
          //   await this.getAvailableCouponList();
          // }
        } else {
          this.isLiveBody = false;
          this.detailData = res?.data?.data.itemDetail;
          this.livebodyDetail = res.data.data?.liveSkuDetailDTO;
          // 转换图片
          let images = res?.data?.data?.itemDetail?.carouselPicture || [];
          images = images.map((item) => {
            return {
              url: item,
              type: "image",
            };
          });
          // 测试图片
          this.detailData.carouselPicture = images;
          this.skuList = this.detailData?.skuList || [];
          this.initWithItemIdSkuSpec();
          if (this.detailData.virtualized) {
            await this.getOtherApplicableStoresList();
          }
          //获取优惠券信息
          if (this.userInfo.token) {
            await this.getAvailableCouponList();
          }
        }
        // 云超商品-保障
        console.log("******************", this.detailData);
        if (this.detailData?.cloudFlag) {
          this.safeguardList = this.detailData?.officialGuaranteeList;
        }
      } catch (e) {
        this.isCompleted = true;
      } finally {
        this.isSecondGetDetail = true;
        this.dataSettled = true;
        this.getIsCollectedLivebody(); // 活体是否被收藏
      }
    },
    async getOtherApplicableStoresList() {
      try {
        let params = {};
        params.itemId = this.itemId;
        if (this.shopId.length) {
          params.shopId = this.shopId;
        }
        const res = await getOtherApplicableStores(params);
        this.storesList = res?.data?.data || [];
        if (Array.isArray(this.storesList)) {
          if (this.storesList.length) {
            this.mallId = this.storesList?.[0]?.shopId || "";
            this.detailData.shopName = this.storesList?.[0]?.mallName || "";
            this.shopName = this.detailData.shopName;
            this.detailData.serviceTime = this.storesList[0]?.serviceTime || "";
          }
        }
      } catch (e) {}
    },
    async getIsCollectedGoods() {
      try {
        const res = await isCollectedGoods({ itemId: this.itemId });
        this.collected = res?.data?.data?.collected || false;
      } catch (e) {}
    },
    backClickHandle() {
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        fail: (result) => {
          uni.switchTab({ url: "/pages/mall/index" });
        },
      });
      // #endif
    },
    // 支付前判断能否购买：1. 是否是云超，2 是否门店前后一致 - 到店服务虚拟品排除掉

    async checkedShopDetail() {
      this.isCanBuy =
        this.detailData.shopId == uni.getStorageSync("onlineCurMallId");
      let params = {
        shopId: this.detailData.shopId,
      };
      let res = await FETCH_SHOP_DETAIL(params);
      // 0 普通 1 云超
      const { shopTag, shopId } = res.data.data;
      console.log("aaaa========>", shopTag, res.data);
      if (shopTag == 1) {
        this.isCanBuy = true;
      }
      // 虚拟商品不校验地址
      if (this.detailData.virtualized) {
        this.isCanBuy = true;
      }
    },
    //立即支付
    async onBuyClickHandle() {
      if (this.isOpenCallApp || this.isOpenBrowser) return;

      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        // APP
        this.goLoginActionH5();
        return;
      } else {
        // 非 APP
        if (!this.userInfo.token) {
          this.goToLoginAction();
          return;
        }
      }
      await this.checkedShopDetail();
      action_report({
        action_name: "Detailpage_buy_click",
        module_name: "shop",
        extend: {
          commodity_id: this.detailData.itemId,
        },
      });
      // 存储商品shopId 用于确认订单页面同城配送兜底
      uni.setStorageSync("mallShopId", this.detailData.shopId);
      if (this.isNewUserFreeGoods) {
        action_report({
          action_name: "newcomersdetailpage_collect_click",
          module_name: "newcomersorderpage",
        });
        const res = await addCart({
          cartType: 2,
          shopId: this.detailData.shopId,
          skuId: this.curSkuId,
          skuQty: 1,
          tenantId: "default_tenant",
        });
        if (res.data.data.isSuccess) {
          const sourceChannel = this.isNewUserFreeGoods ? "1" : "";
          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pagesC/submitOrder/index?itemId=${this.itemId}&skuId=${
              this.curSkuId
            }&skuQty=${this.buyNum}&shopId=${
              this.detailData.shopId
            }&shopName=${encodeURIComponent(this.shopName)}&type=${
              this.goodsType
            }&sourceChannel=${sourceChannel}`,
          });
          // #endif
          // #ifdef H5
          let route = `pagesC/submitOrder/index?itemId=${this.itemId}&skuId=${
            this.curSkuId
          }&skuQty=${this.buyNum}&shopId=${
            this.detailData.shopId
          }&shopName=${encodeURIComponent(this.shopName)}&type=${
            this.goodsType
          }&sourceChannel=${sourceChannel}&transparentTopBar=1`;
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/${route}`,
          });
          // #endif
        }
        return;
      }
      /**
       * 自提需求去掉校验能不能买逻辑
       */
      // if (!this.isCanBuy) {
      //   uni.showModal({
      //     title: "提示",
      //     content: "当前选择地址不支持该商品配送，请重新选择",
      //     confirmText: "确定",
      //     showCancel: false,
      //     success: () => {},
      //   });
      //   return;
      // }
      this.writingType = 2;

      if (this.detailData.virtualized) {
        //虚拟商品加购一次
        const res = await addCart({
          cartType: 2,
          shopId: this.detailData.shopId,
          skuId: this.curSkuId,
          skuQty: 1,
          tenantId: "default_tenant",
        });
        // 虚拟商品直接结算，无需地址，实物商品加购需校验
        if (res.data.data.isSuccess) {
          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pagesC/submitOrder/index?itemId=${this.itemId}&skuId=${
              this.curSkuId
            }&skuQty=${this.buyNum}&shopId=${
              this.detailData.shopId
            }&shopName=${encodeURIComponent(this.shopName)}&type=${
              this.goodsType
            }`,
          });
          // #endif
          // #ifdef H5
          let route = `pagesC/submitOrder/index?itemId=${this.itemId}&skuId=${
            this.curSkuId
          }&skuQty=${this.buyNum}&shopId=${
            this.detailData.shopId
          }&shopName=${encodeURIComponent(this.shopName)}&type=${
            this.goodsType
          }&transparentTopBar=1`;
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/${route}`,
          });
          // #endif
        }
      } else {
        this.showSpecsPopView = true;
        this.writing = "立即购买"; // "确认";
      }
    },
    // 活体-立即购买
    async onBuyLivebody() {
      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        // APP
        this.goLoginActionH5();
        return;
      } else {
        // 非 APP
        if (!this.userInfo.token) {
          this.goToLoginAction();
          return;
        }
      }
      action_report({
        action_name: "LivepetDetailpage_buy_click",
        module_name: "action_report",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.livebodyDetail.liveSkuDTO.itemId,
        },
      });
      // 校验是否锁单
      try {
        const res = await addCart({
          cartType: 2,
          shopId: this.livebodyDetail?.liveShop?.shopId,
          skuId: this.livbodySkuId,
          skuQty: 1,
          tenantId: "default_tenant",
        });
        if (res.data.data.isSuccess) {
          const { shopId, shopName } = this.livebodyDetail?.liveShop;
          const { itemId, skuId } = this.livebodyDetail?.liveSkuDTO;
          // #ifdef MP-WEIXIN
          uni.navigateTo({
            url: `/pagesC/submitOrder/index?itemId=${itemId}&skuId=${skuId}&skuQty=1&shopId=${shopId}&shopName=${encodeURIComponent(
              shopName
            )}&type=liveType`,
          });
          // #endif
          // #ifdef H5
          let route = `pagesC/submitOrder/index?itemId=${itemId}&skuId=${skuId}&skuQty=1&shopId=${shopId}&shopName=${encodeURIComponent(
            shopName
          )}&type=liveType&transparentTopBar=1`;
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `${window.location.origin}/crm-medical-h5/#/${route}`,
          });
          // #endif
        }
      } catch (error) {
        console.log(
          "🚀 ~ onBuyLivebody ~~~~~~~~~~活体-立即购买~ error:",
          error
        );
        /**
         * "30101", "宠物无法加入购物车"
         * "30102", "宠物已被预约 无法下单"
         */
        if (error.code == 30102) {
          this.toShowLockPop();
        } else if (![200, 30101, 30102].includes(error.code)) {
          if (this.isHighValue) this.getDetail();
        }
      }
    },
    onSelectSpecs() {
      this.writingType = 2;
      this.showSpecsPopView = true;
    },
    onShowSpecsParam() {
      this.showParamsPopView = true;
    },
    onShowSafeguard() {
      this.showSafeguardPopView = true;
    },
    /**
     * 普通商品/低价值异宠-收藏
     */
    handleClick_Collect() {
      console.log("*********   收藏    **********");
      // 低价值异宠
      if (
        [214, 836, 460, 835].includes(this.speciesClassification) &&
        this.alienPetType == 2
      ) {
        this.handleColectLivebody();
      } else {
        // 普通商品
        this.collectClickHandle();
      }
    },
    /**
     * 普通商品/低价值异宠-取消收藏
     */
    handleClick_Uncollect() {
      // 低价值异宠
      if (
        [214, 836, 460, 835].includes(this.speciesClassification) &&
        this.alienPetType == 2
      ) {
        this.unHandleCollectLivebody();
      } else {
        // 普通商品
        this.unCollectClickHandle();
      }
    },
    async collectClickHandle() {
      action_report({
        action_name: "Detailpage_collect_click",
        module_name: "shop",
        extend: {
          commodity_id: this.detailData.itemId,
        },
      });
      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        // APP
        this.goLoginActionH5();
        return;
      } else {
        // 非 APP
        if (!this.userInfo.token) {
          this.goToLoginAction();
          return;
        }
      }
      console.log("收藏======》", this.detailData);
      try {
        const res = await collectGoods({
          itemId: this.itemId,
          shopId: this.detailData.shopId,
        });
        this.collected = true;
        // uni.showToast({
        //   icon: "none",
        //   title: "收藏成功，可在我的页查看",
        //   duration: 1000,
        // });
        this.$refs.uToast.show({
          message: "收藏成功，可在我的页查看",
        });
      } catch (e) {}
    },
    async unCollectClickHandle() {
      action_report({
        action_name: "Detailpage_remove_click",
        module_name: "shop",
        extend: {
          commodity_id: this.detailData.itemId,
        },
      });
      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        // APP
        this.goLoginActionH5();
        return;
      } else {
        // 非 APP
        if (!this.userInfo.token) {
          this.goToLoginAction();
          return;
        }
      }
      try {
        const res = await unCollectGoods({ itemId: this.itemId });
        this.collected = false;
        // uni.showToast({
        //   icon: "none",
        //   title: "已取消收藏",
        //   duration: 1000,
        // });
        this.$refs.uToast.show({
          message: "已取消收藏",
        });
      } catch (e) {}
    },
    /**itemId，第1次初始化 **/
    initWithItemIdSkuSpec() {
      this.skuList.forEach((ele, index) => {
        const saleStockQty = ele?.salableStockQty || "0";
        const stockNum = Number(saleStockQty);
        ele.disabled = stockNum <= 0;
        ele.selected = this.detailData?.selectSku?.id === ele.id;
      });
      /** 对原specList进行深拷贝 **/
      this.$set(this.$data, "skuList", this.skuList.slice(0));
    },
    selectSkuSpec(item, index) {
      this.getAvailableCouponList(item.minSalePrice);
      this.skuList.forEach((ele, index) => {
        ele.selected = item.id === ele.id;
      });
      this.$set(this.$data, "skuList", this.skuList.slice(0));
    },
    goToLoginAction() {
      uni.navigateTo({
        url: `/pagesD/login/index`,
      });
    },
    goLoginActionH5() {
      this.$dsBridge.call("jumpLogin");
    },
    async switchShop(arg) {
      const { buyNum, skuId } = arg;
      this.shopId = this.detailData.cloudShopId;
      this.skuId = skuId;
      try {
        await this.getDetail();
        this.buyNum = buyNum;
      } catch (_) {}
    },
    // 活体是否收藏
    async getIsCollectedLivebody() {
      if (!this.userInfo.token) {
        return;
      }
      try {
        const res = await isCollectedGoods_livebody({ itemId: this.itemId });
        if (
          [214, 836, 460, 835].includes(this.speciesClassification) &&
          this.alienPetType == 2
        ) {
          this.collected = res?.data?.data?.collected || false;
        } else {
          this.livebodyCollected = res?.data?.data?.collected || false;
        }
      } catch (e) {
        console.log("🚀 ~ getIsCollectedLivebody ~ e:", e);
      }
    },
    // 活体收藏数量
    getCollectCount() {
      if (!this.userInfo.token) {
        return;
      }
      GET_COLECT_TOTAL_livebody({ itemId: this.itemId })
        .then((res) => {
          if (res.data.code === 0) {
            const data = res.data?.data;
            const num = data?.collectNum > 99 ? "99+" : data?.collectNum;
            this.collectCount = num;
          } else {
            this.collectCount = 0;
          }
        })
        .catch((err) => {
          console.log("🚀 ~收藏数量：：：： err:", err);
        });
    },
    // 活体收藏
    async handleColectLivebody() {
      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        // APP
        this.goLoginActionH5();
        return;
      } else {
        // 非 APP
        if (!this.userInfo.token) {
          this.goToLoginAction();
          return;
        }
      }
      try {
        const res = await collectGoods_livebody({
          itemId: this.itemId,
          shopId:
            this.livebodyDetail?.liveShop?.shopId || this.detailData?.shopId,
        });
        if (res.data.code === 0) {
          // 低价值
          if (
            [214, 836, 460, 835].includes(this.speciesClassification) &&
            this.alienPetType == 2
          ) {
            this.collected = true;
          } else {
            // 高价值
            this.livebodyCollected = true;
            // 同步活体频道收藏状态
            // #ifdef MP-WEIXIN
            const { liveId, itemId } = this.livebodyDetail?.liveSkuDTO;
            eventBus.$emit("live-collect", { liveId, itemId, collect: 1 });
            // #endif
          }
        }
        action_report({
          action_name: "LivepetDetailpage_collect_click",
          module_name: "action_report",
          extend: {
            user_id: this.userInfo.userId,
            commodity_id:
              this.livebodyDetail?.liveSkuDTO?.itemId || this.itemId,
          },
        });
        // uni.showToast({
        //   icon: "none",
        //   title: "收藏成功，可在我的页查看",
        //   duration: 3000,
        // });
        this.$refs.uToast.show({
          message: "收藏成功，可在我的页查看",
        });
        this.getCollectCount();
      } catch (e) {
        console.log("🚀 ~ handleColectLivebody ~ e:", e);
      }
    },
    // 活体取消收藏
    async unHandleCollectLivebody() {
      if (this.$dsBridge && !this.$dsBridge.call("getToken", "getToken")) {
        // APP
        this.goLoginActionH5();
        return;
      } else {
        // 非 APP
        if (!this.userInfo.token) {
          this.goToLoginAction();
          return;
        }
      }
      try {
        const res = await unCollectGoods_livebody({ itemId: this.itemId });
        if (res.data?.code === 0) {
          // 低价值
          if (
            [214, 836, 460, 835].includes(this.speciesClassification) &&
            this.alienPetType == 2
          ) {
            this.collected = false;
          } else {
            // 高价值
            this.livebodyCollected = false;
            // #ifdef MP-WEIXIN
            // 同步活体频道收藏状态;
            const { liveId, itemId } = this.livebodyDetail?.liveSkuDTO;
            eventBus.$emit("live-collect", { liveId, itemId, collect: 0 });
            // #endif
          }
        }
        // uni.showToast({
        //   icon: "none",
        //   title: "已取消收藏",
        //   duration: 3000,
        // });
        this.$refs.uToast.show({
          message: "已取消收藏",
        });
        this.getCollectCount();
      } catch (e) {}
    },
    async rsvtSubmit(data) {
      let that = this;
      try {
        // #ifdef MP-WEIXIN
        uni.requestSubscribeMessage({
          tmplIds: [
            "n4xGdbZm9ShFD-LB2SFB50peaxnWjgnQ6BiEJR9yH0E",
            "wwTKkf5iuBBZQDdIl3zm-JIcatT7DzlPCl5yj2QxXTg",
            "4GnbmF_xYNm2Ojmysjye2NVLhvVw0nt09g9Y19kHl58",
          ],
          fail(e) {
            console.log("拉起失败");
            console.log(e);
          },
          async complete() {
            await that.toRsvtSubmit(data);
          },
        });
        // #endif
        // #ifdef H5
        await that.toRsvtSubmit(data);
        // #endif
      } catch (error) {
        console.log("🚀 ~ rsvtSubmit ~ error:", error);
      }
    },
    async toRsvtSubmit(data) {
      const that = this;
      const res = await CREATE_RESERVATION({
        ...data,
        mainSkuId: that.livebodyDetail.liveSkuDTO.skuId,
        storeId: that.livebodyDetail.liveShop.storeId,
        shopId: that.livebodyDetail.liveShop.shopId || that.shopId,
      });
      console.log("🚀 ~ rsvtSubmit ~ res:", res);
      action_report({
        action_name: "PetsReservation_submit_click",
        module_name: "",
        extend: {
          user_id: that.userInfo.userId,
          commodity_id: that.livebodyDetail.liveSkuDTO.itemId,
        },
      });
      that.isShowRsvtPop = false;
      const h5Domain = {
        development: "https://cn-dev01-shareactivity.chongpangpang.com/",
        test: "https://cn-dev02-shareactivity.chongpangpang.com/",
        pre: "https://cn-test01-shareactivity.chongpangpang.com/",
        production: "https://shareactivity.chongpangpang.com/",
      };
      let route =
        h5Domain[process.env.NODE_ENV] +
        `wallet-h5/#/livingBody/reservationDetail?reservationId=${res.data.data.reservationId}&transparentTopBar=1`;

      console.log("777777========>", `${route}&type=icon`);
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/webView/index?route=${encodeURIComponent(
          route
        )}&type=icon`,
      });
      // #endif
      // #ifdef H5
      let domain = h5Domain[process.env.NODE_ENV] + `wallet-h5/#/`;
      let path = `livingBody/reservationDetail?reservationId=${res.data.data.reservationId}&type=icon`;
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${domain}${path}`,
      });
      // #endif
    },
    // 活体联系门店
    toCallShop() {
      action_report({
        action_name: "LivepetDetailpage_phone_click",
        module_name: "action_report",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.livebodyDetail.liveSkuDTO.itemId,
        },
      });
      // 拨打电话
      uni.makePhoneCall({
        phoneNumber: this.livebodyDetail.liveShop.shopPhone,
      });
    },
    toShowLockPop() {
      this.showLockPop = true;
    },
    // 打开评价列表
    handleOpenAppraisePop() {
      action_report({
        action_name: "Detailpage_evaluate_all_click",
        module_name: "Detailpage",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.detailData.itemName,
        },
      });
      this.openComment = true;
    },
    handleCloseAppraise() {
      this.openComment = false;
      this.scrollTop = 0;
    },
    handleChangeTab(tab) {
      // this.currentTab = tab;

      if (this.isScrollingToAnchor) return;
      this.isScrollingToAnchor = true;
      // 使用选择器查询找到目标元素
      uni
        .createSelectorQuery()
        .in(this)
        .select(`#${tab}`)
        .boundingClientRect((rect) => {
          if (rect) {
            // 获取当前页面的滚动位置
            const currentScrollTop = this.scrollTop;
            const statusBarHeight =
              this.statusBarHeight && this.statusBarHeight?.split("px")[0];
            const navBarHeight =
              this.navBarHeight && this.navBarHeight?.split("px")[0];
            let targetTop =
              rect.top + currentScrollTop - statusBarHeight - navBarHeight;
            // 设置滚动位置
            this.scrollTopV2 = targetTop < 0 ? 0 : targetTop;

            // scroll-top 属性惰性更新，+1更新值， settimeout-1恢复值
            if (this.currentTab == tab)
              this.scrollTopV2 = this.scrollTopV2 + 0.1;
            this.$nextTick(() => {
              // 确保滚动动画完成后再重置标志位
              setTimeout(() => {
                this.isScrollingToAnchor = false;
                this.scrollTopV2 = this.scrollTopV2 - 0.1;
              }, 300); // 300ms 是滚动动画的持续时间
            });
            console.log("🚀 ~ .boundingClientRect ~ rect:", tab, rect, {
              rectTop: rect.top,
              currentScrollTop,
              scrollTopV2: this.scrollTopV2,
              statusBarHeight,
              navBarHeight,
            });
          }
        })
        .exec();
    },
    handleScrollToUpper(e) {
      this.scrollTop = 0;
      if (this.scrollTop > 0 && this.scrollTop < 5) {
        this.updateSectionPositions();
      }
      this.updateCurrentIndex();
    },
    handleScroll(e) {
      // 更新当前滚动位置
      this.scrollTop = e.detail.scrollTop;
      if (this.scrollTop > 0 && this.scrollTop < 5) {
        this.updateSectionPositions();
      }
      this.updateCurrentIndex();
    },
    updateSectionPositions() {
      const sections = ["goodsDetail", "appraiseDetail", "goodsDetailInfo"];
      const query = uni.createSelectorQuery().in(this);
      sections.forEach((section, index) => {
        query.select(`#${section}`).boundingClientRect((rect) => {
          if (rect) {
            this.$set(this.sectionPositions, index, rect.top);
          }
        });
      });
      query.exec();
    },
    // 更新当前选中的锚点索引
    updateCurrentIndex() {
      let newIndex = 0;
      for (let i = 0; i < this.sectionPositions?.length; i++) {
        if (
          this.scrollTop >=
          this.sectionPositions[i] -
            this.statusBarHeight?.split("px")[0] -
            this.navBarHeight?.split("px")[0]
        ) {
          newIndex = i;
        } else {
          break;
        }
      }

      // 如果新索引与当前索引不同，则更新
      if (newIndex !== this.currentIndex) {
        this.currentIndex = newIndex;
      }
    },
    // 分享
    handleShareDetail() {
      console.log("----  点击了 -- 分享按钮  ----");
      if (this.isLiveBody) {
        action_report({
          action_name: "LivepetDetailpage_showicon_click",
          module_name: "LivepetDetailpage",
          extend: {
            user_id: this.userInfo?.userId,
            commodity_id: this.livebodyDetail?.liveSkuDTO?.itemName,
          },
        });
      }
      // #ifdef H5
      const imgShare =
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/shareicon.png";

      const goodsDomain = {
        development: "https://dev-cpp.chongpangpang.com/crm-medical-h5/#",
        test: "https://test-cpp.chongpangpang.com/crm-medical-h5/#",
        production: "https://cpp.chongpangpang.com/crm-medical-h5/#",
      };
      let shareUrl = `${
        goodsDomain[process.env.NODE_ENV]
      }/pagesC/goodsServiceDetail/index?itemId=${this.itemId}&skuId=${
        this.skuId
      }&shopId=${this.shopId}&activityId=${this.activityId}`;

      console.log("分享信息：：：", this.livebodyDetail);
      let content, image;
      if (this.isLiveBody) {
        // 活体
        content = this.livebodyDetail?.liveSkuDTO?.itemName;
        image = this.livebodyDetail?.liveSkuDTO?.imgUrlList[0] || imgShare;
      } else {
        // 非活体
        content = this.detailData?.itemName;
        image = this.detailData?.carouselPicture[0]?.url || imgShare;
      }
      this.$dsBridge.call("openShare", {
        title: "为你推荐了一个好物，快看看吧~", //标题
        content, //分享内容
        shareUrl,
        image, // 分享的logo(微信)
        sharingChannels: [
          "WECHAT_FRIEND",
          "WXCHAT_FRIEND_CIRCLE",
          "QQ",
          "WEIBO",
        ],
      });
      // #endif
    },
    // 客服
    handleClick_chat() {
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/user/custom/service`,
      });
      // #endif
    },

    toCallApp() {
      console.log(
        "----  点击了 -- 唤起app按钮  ----",
        this.scheme,
        uni.getStorageSync("browserEnv")
      );
      // #ifdef H5
      let browserEnv = uni.getStorageSync("browserEnv");
      if (browserEnv == "微信") {
        // 关闭唤起app导航条，打开浏览器引导
        this.isOpenCallApp = false;
        this.isOpenBrowser = true;

        uni.setStorageSync("isCallApp", true);
      } else {
        console.log("----  点击了 -- 引导下载app  ----");
        // 引导下载app
        lunchApp(this.scheme);
      }
      // #endif
    },
  },
  onShow() {
    uni.$on("onSelectSpecClickHandle", (result) => {
      const item = result[0];
      let index = result[1];
      this.selectSkuSpec(item, index);
    });
    uni.$on("onBuyNumChange", (value) => {
      this.buyNum = value;
    });
    display_report({
      display_name: "Detailpage_show",
      object_type: "Detailpage",
      extend: {
        commodity_id: this.itemId,
      },
    });
    if (this.isSecondGetDetail) {
      this.getDetail();
    }
    this.getIsCollectedGoods(); // 普通商品是否收藏
    this.getCollectCount(); // 获取活体收藏数量
    this.getCartCount(); // 查询购物车数量

    if (!this.isNative) {
      // 非 APP 环境
      // #ifdef MP-WEIXIN
      let browserEnv = uni.getStorageSync("browserEnv")?.browserType;
      // #endif
      // #ifdef H5
      let browserEnv = localStorage.getItem("browserEnv");
      // #endif
      console.log("🚀 ~ onShow ~ browserEnv:", browserEnv);
      if (browserEnv == "微信小程序") {
        // 小程序环境
        uni.setStorageSync("isCallApp", false);
      } else {
        // 非 小程序环境
        this.isOpenCallApp = true;
        this.isOpenBrowser = false;

        uni.setStorageSync("isCallApp", true);
        const that = this;
        document.addEventListener(
          "click",
          function (event) {
            event.preventDefault(); // 阻止默认行为
            event.stopPropagation(); // 阻止事件传播
            that.toCallApp();
          },
          true
        ); // 使用捕获阶段（捕获阶段会先于冒泡阶段触发）
      }
    } else {
      // APP 环境
      this.isOpenCallApp = false;
      this.isOpenBrowser = false;
      uni.setStorageSync("isCallApp", false);
    }
  },
  async onLoad(options) {
    console.log("options=====>", options);
    this.itemId = options?.itemId || "";
    this.skuId = options?.skuId || "";
    this.shopId = options?.shopId || "";
    this.activityId = options?.activityId || "";
    // codeOrigin='scan'
    if (options.codeOrigin == "scan") {
      this.channelType = 2;
      this.codeOrigin = options.codeOrigin;
      display_report({
        display_name: "Detailpage_scan_show",
        object_type: "Detailpage",
        extend: {
          shopId: options?.shopId,
          itemId: options?.itemId,
        },
      });
    }
    // this.isService = options?.isService;
    this.isCart = options?.isCart || false;
    if (options.q) {
      //微信扫码打开
      this.channelType = 2;
      let u = decodeURIComponent(options.q);
      console.log("🚀 ~ onLoad ~ u:", u);
      if (!u.includes("?")) {
        //短链
        let r = await parseShortLink(u);
        u = r.data?.data?.resultStr;
      }
      console.log(options.q, "options.q", u);
      const query_string = u.split("?")[1];
      this.itemId = getQueryString("itemId", query_string) || "";
      this.skuId = getQueryString("skuId", query_string) || "";
      this.shopId = getQueryString("shopId", query_string) || "";
      this.codeOrigin = getQueryString("codeOrigin", query_string) || "";
      display_report({
        display_name: "Detailpage_scan_show",
        object_type: "Detailpage",
        extend: {
          shopId: getQueryString("shopId", query_string),
          itemId: getQueryString("itemId", query_string),
        },
      });
    }
    if (options.channelType) {
      this.channelType = options.channelType;
    }
    console.log("firstSkuId--------", this.skuId);

    setTimeout(() => {
      this.getDetail(); //  获取商详
    }, 50);
    //用于登陆完成返回原页面 last_route_params
    uni.removeStorageSync("last_route_params");
    const last_route_params = `?itemId=${this.itemId}&shopId=${this.shopId}&skuId=${this.skuId}&codeOrigin=${this.codeOrigin}`;
    uni.setStorageSync("last_route_params", last_route_params);
  },
  onUnload() {
    uni.$off("onSelectSpecClickHandle");
    uni.$off("onBuyNumChange");
  },
  beforeDestroy() {
    this.isOpenCallApp = false;
    this.isOpenBrowser = false;
    uni.removeStorageSync("isCallApp");
  },
  onShareAppMessage() {
    return {
      title: this.title,
      imageUrl: this.shareImgUrl,
      path: `/pagesC/goodsServiceDetail/index${uni.$u.queryParams({
        itemId: this.itemId,
        skuId: this.curSkuId,
        shopId: this.detailData.shopId,
      })}`,
    };
  },
};
</script>

<template>
  <view>
    <template>
      <!-- 唤端 -->
      <view>
        <CallApp v-if="isOpenCallApp" @toCallApp="toCallApp" />
        <!-- 占位 -->
        <view v-if="isOpenCallApp" style="height: 150rpx"></view>
      </view>
      <GuideBrowser v-if="isOpenBrowser" />
    </template>
    <!-- 非活体 -->
    <template v-if="dataSettled && !isLiveBody">
      <view
        class="page-wrapper"
        v-if="dataSettled"
        :style="{ backgroundColor: openComment ? '#fff' : '' }"
      >
        <template v-if="openComment">
          <Appraise
            :itemData="detailData"
            :commentCount="commentCount"
            @close="handleCloseAppraise"
            :navBarHeight="navBarHeight"
            :statusBarHeight="statusBarHeight"
            :scroll-with-animation="true"
            :userInfo="userInfo"
          />
        </template>
        <template v-else>
          <scroll-view
            v-if="!isCompleted"
            class="scroll-wrapper scrollView"
            :class="{
              'scroll-wrapper_callapp': isOpenCallApp || isOpenBrowser,
            }"
            scroll-y
            @scroll="handleScroll"
            @scrolltoupper="handleScrollToUpper"
            ref="scrollView"
            :scroll-top="scrollTopV2"
          >
            <!-- 导航 -->
            <view v-show="scrollTop > 50">
              <GoodsDetailNav
                @changeTab="handleChangeTab"
                @shareDetail="handleShareDetail"
                @goBack="backClickHandle"
                :currentIndex="currentIndex"
                :scrollTop="scrollTop"
              />
            </view>
            <!--      轮播图-->
            <GoodsServiceBanner
              id="goodsDetail"
              :urls="detailData.carouselPicture"
              :videoUrlList="detailData.detailVideo"
            />
            <!--      标题-->
            <GoodsServiceTitlePriceTags
              :selectedSku="selectedSku"
              :data="detailData"
              :couponList="couponList"
              :activityList="activityList"
              :upGradeDescObj="upGradeDescObj"
              @onRefresh="handleRefresh"
            />
            <!-- 规格-v2 -->
            <GoodsSpecsV2
              v-if="!detailData.virtualized"
              :selectedSpecs="selectedSpecs"
              :selectedSku="selectedSku"
              :data="detailData"
              :goodsState="goodsState"
              :activityId="activityId"
              @onSelectSpecs="onSelectSpecs"
              @onShowSpecsParam="onShowSpecsParam"
              @onShowSafeguard="onShowSafeguard"
            />
            <!--      商品实物:规格-->
            <!-- <GoodsServiceSpecsParam
              v-if="!detailData.virtualized"
              :selectedSpecs="selectedSpecs"
              :selectedSku="selectedSku"
              :data="detailData"
              :goodsState="goodsState"
              :activityId="activityId"
              @onSelectSpecs="onSelectSpecs"
              @onShowSpecsParam="onShowSpecsParam"
            /> -->

            <!--      使用规则-->
            <GoodsServiceUseRules
              v-if="detailData.virtualized"
              :storeInfo="storesList[0]"
              :limitTimeDesc="detailData.limitTimeDesc"
            />
            <!--      适用门店-->
            <GoodsServiceApplicableStore
              v-if="storesList.length && detailData.virtualized"
              :itemId="itemId"
              :shopId="shopId"
              :storelist="storesList"
              :storeInfo="storesList[0]"
            />
            <!-- 评价卡片  -->
            <view id="appraiseDetail"></view>
            <AppraiseCard
              :commentCount="commentCount"
              :highQualityList="highQualityCommentList"
              @openPop="handleOpenAppraisePop"
            />

            <!--      商品图片-->
            <view id="goodsDetailInfo"> </view>
            <GoodsServicePictures
              v-if="detailData.detailPicture.length"
              :urls="detailData.detailPicture"
            />
          </scroll-view>
        </template>
        <!--    底部按钮-->
        <view
          v-if="!isCompleted"
          class="bottom-wrapper"
          :class="{ bottomBorder: openComment }"
        >
          <GoodsNewUserActivityCountdown
            v-if="isNewUserFreeGoods"
            :countdown-ts="detailData.newPersonCountDownTime"
            @onFinish="getDetail"
          />
          <view class="bottom-buttons">
            <view class="left-buttons">
              <!-- #ifdef MP-WEIXIN -->
              <CustomerService class="customer-service" from="goodsDetail" />
              <!-- #endif -->
              <!-- #ifdef H5 -->
              <IconButton
                title="客服"
                :fontSize="20"
                position="top"
                :iconSize="44"
                height="44"
                color="transparent"
                :interval="5"
                :fontClassStyle="'color: #1f1f1f; font-size: 42rpx'"
                fontClass="icon-chat"
                style="height: 44px; min-width: 58rpx"
                @onClick="$u.debounce(handleClick_chat, 500)"
              />
              <!-- #endif -->
              <IconButton
                v-if="collected && !isNewUserFreeGoods"
                title="已收藏"
                :fontSize="20"
                position="top"
                :iconSize="44"
                color="transparent"
                :interval="5"
                height="44"
                style="height: 44px; margin-left: 27rpx; min-width: 58rpx"
                url="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/collected_icon.png"
                @onClick="$u.debounce(handleClick_Uncollect, 500)"
              />
              <IconButton
                v-if="!collected && !isNewUserFreeGoods"
                title="收藏"
                :fontSize="20"
                position="top"
                :iconSize="44"
                height="44"
                color="transparent"
                :interval="1"
                :fontClassStyle="'color: #1f1f1f;font-weight:400;font-size: 44rpx'"
                fontClass="icon-collect"
                style="height: 44px; margin-left: 27rpx; min-width: 58rpx"
                @onClick="$u.debounce(handleClick_Collect, 500)"
              />
              <view
                v-if="!isNewUserFreeGoods"
                :class="['shop-cart', isAnimating ? 'cartActive' : '']"
                @click="handleCartTapped"
              >
                <view class="shop-cart-logo">
                  <i class="cartIcon iconfont icon-gouwuche"></i>
                  <view class="num" v-if="cartNum > 0">{{ cartNum }}</view>
                </view>
                <text style="font-size: 20rpx">购物车</text>
              </view>
            </view>
            <view class="right-buttons">
              <template>
                <GradientButton
                  v-if="isSoldOutGoods"
                  title="库存不足"
                  :fontSize="29"
                  fontWeight="bold"
                  :borderRadius="43"
                  color="#FE2442"
                  titleColor="#FFFFFF4D"
                />
                <GradientButton
                  v-else-if="isNoSaleGoods"
                  title="商品已下架"
                  :fontSize="29"
                  fontWeight="bold"
                  :borderRadius="43"
                  color="#FE2442"
                  titleColor="#FFFFFF4D"
                />
                <GradientButton
                  v-else-if="isNewUserFreeGoods"
                  title="立即购买"
                  :fontSize="29"
                  fontWeight="bold"
                  :borderRadius="43"
                  color="#FE2442"
                  titleColor="#FFFFFF"
                  @onClick="$u.debounce(onBuyClickHandle, 500)"
                />
                <view class="btn-list" v-else>
                  <view
                    :class="['btn-item', 'coupon-left']"
                    @click="$u.debounce(onAddCartClickHandler, 500)"
                  >
                    加入购物车
                  </view>
                  <view
                    :class="['btn-item', 'coupon-right']"
                    @click="$u.debounce(onBuyClickHandle, 500)"
                  >
                    立即购买
                  </view>
                </view>
              </template>
            </view>
          </view>
        </view>
        <!--    返回按钮-->
        <view
          v-if="
            !openComment && scrollTop <= 50 && !isOpenCallApp && !isOpenBrowser
          "
          :class="isCompleted ? 'nodata' : 'back-wrapper'"
          :style="{ top: iconTop, left: '15rpx', height: navBarHeight }"
          @click="backClickHandle"
        >
          <view class="icon-box">
            <i class="iconleft iconfont icon-back"></i>
          </view>
        </view>
        <!-- 分享 -->
        <!-- #ifdef H5 -->
        <view
          v-if="
            !isCompleted &&
            !openComment &&
            scrollTop <= 50 &&
            !isOpenCallApp &&
            !isOpenBrowser
          "
          :class="isCompleted ? 'nodata' : 'back-wrapper-right'"
          :style="{
            top: iconTop,
            right: '15rpx',
            height: navBarHeight,
          }"
          @click="handleShareDetail"
        >
          <view class="icon-box">
            <i class="iconRight iconfont icon-share"></i>
          </view>
        </view>
        <!-- #endif -->
        <view v-if="isCompleted" class="no-data-wrapper">
          <!-- 旧版本的暂无数据 -->
          <!-- <NoData
           noDataText="呀，商品走丢了~"
           img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
         ></NoData> -->
          <!-- 新版本的暂无数据 -->
          <NoData
            :noDataText="noDataTextObj.noDataText"
            :noDataText2="noDataTextObj.noDataText2"
            :img="noDataTextObj.img"
            :goodsData="formattedGoods"
            :isShowBtnBox="noDataTextObj.isShowBtnBox"
          ></NoData>
        </view>
        <GoodsServiceParamPopView
          :properties="properties"
          :show.sync="showParamsPopView"
          @onClose="showParamsPopView = false"
        />
        <!-- 保障弹窗 -->
        <GoodsSafeguardPopView
          :show.sync="showSafeguardPopView"
          :shopPetBenefitList="safeguardList"
        />

        <GoodsServiceSpecsPopView
          :couponList="couponListForPop"
          :activityList="activityListForPop"
          feat_commerce_public_20240110
          :goodsState="goodsState"
          :data="detailData"
          :selectedSku="selectedSku"
          :skuList="skuList"
          :show.sync="showSpecsPopView"
          :curSkuId="curSkuId"
          :writing="writing"
          :writingType="writingType"
          @onClose="showSpecsPopView = false"
          @getCartCount="getCartCount"
          @onRefresh="handleRefresh"
          @onSwitchShop="switchShop"
          :selectBuyNum="buyNum"
        />
      </view>
    </template>
    <!-- 活体 living body -->
    <template v-else-if="dataSettled && isLiveBody">
      <view class="page-wrapper bg">
        <!-- 详情  -->
        <scroll-view
          v-if="!isCompleted"
          class="scroll-wrapper"
          :class="{
            'scroll-wrapper_callapp': isOpenCallApp || isOpenBrowser,
          }"
          scroll-y
          @scroll="handleScroll"
          @scrolltoupper="handleScrollToUpper"
          :scroll-top="scrollTopV2"
        >
          <view v-show="scrollTop > 50">
            <GoodsDetailNav
              @changeTab="handleChangeTab"
              @shareDetail="handleShareDetail"
              @goBack="backClickHandle"
              :currentIndex="currentIndex"
              :scrollTop="scrollTop"
              :isLive="true"
            />
          </view>
          <GoodsBannerLiving
            v-if="livebodyDetail"
            :urls="carouselPicture_livebody"
            :videoUrlList="livebodyDetail.liveSkuDTO.videoUrlList"
            :livebodyData="livebodyDetail"
            id="goodslLive"
          />
          <GoodsTitleLiving
            :data="livebodyDetail"
            :couponList="couponList"
            :activityList="activityList"
            :upGradeDescObj="upGradeDescObj"
            @onRefresh="handleRefresh"
          />
          <view class="liner-parent">
            <view class="liner-bg"></view>
          </view>
          <view id="goodsDetailInfoLive"></view>
          <!-- 疫苗驱虫  -->
          <VaccineDeworming
            :livebodyData="livebodyDetail"
            v-if="
              [1, 50].includes(speciesClassification) &&
              (vaccinationList.length > 0 || liveDewormingRecordDTO.length > 0)
            "
          />
          <!-- 品种介绍 -->
          <RaceDesc
            v-if="disposition || speciesIntroduction || feedingDesc"
            :livebodyData="livebodyDetail"
          />
          <!-- 门店信息 -->
          <ShopInfoLiving
            :livebodyData="livebodyDetail"
            :reservation="reservation"
          />
          <!-- 锁单弹层 -->
          <PopConfirm :show="showLockPop" :livebodyData="livebodyDetail" />
          <RsvtPopup
            v-if="isShowRsvtPop"
            :isShowRsvtPop="isShowRsvtPop"
            @closePopup="isShowRsvtPop = false"
            @submit="rsvtSubmit"
            :timeSlot="timeSlot"
            :needKnow="needKnow"
            :commodityId="itemId"
          />
        </scroll-view>
        <!--顶部图片左上角 返回按钮-->
        <view
          v-if="scrollTop <= 50 && !isOpenCallApp && !isOpenBrowser"
          :class="isCompleted ? 'nodata' : 'back-wrapper'"
          :style="{ top: iconTop, left: '15rpx', height: navBarHeight }"
          @click="backClickHandle"
        >
          <view class="icon-box">
            <i class="iconleft iconfont icon-back"></i>
          </view>
        </view>
        <!-- 分享 -->
        <!-- #ifdef H5 -->
        <view
          v-if="
            !isCompleted && scrollTop <= 50 && !isOpenCallApp && !isOpenBrowser
          "
          :class="isCompleted ? 'nodata' : 'back-wrapper-right'"
          :style="{
            top: iconTop,
            right: '15rpx',
            height: navBarHeight,
          }"
          @click="handleShareDetail"
        >
          <view class="icon-box">
            <i class="iconRight iconfont icon-share"></i>
          </view>
        </view>
        <!-- #endif -->
        <!-- 底部按钮  -->
        <view class="bottom-wrapper" v-if="!isCompleted">
          <view class="bottom-buttons live-btn">
            <view class="left-buttons">
              <!-- 收藏  -->
              <view :class="['collected-b', isAnimating ? 'cartActive' : '']">
                <view class="collected-b-logo">
                  <image
                    v-if="!livebodyCollected"
                    class="collected-b-logo-img"
                    :src="collectIcon_0"
                    @tap="$u.debounce(handleColectLivebody, 500)"
                  />
                  <image
                    v-if="livebodyCollected"
                    class="collected-b-logo-img"
                    :src="collectIcon_1"
                    @tap="$u.debounce(unHandleCollectLivebody, 500)"
                  />
                  <view
                    class="num"
                    :class="{
                      num1: collectCount <= 9,
                      num2: collectCount > 9 && collectCount <= 99,
                      num3: collectCount > 99,
                    }"
                    v-if="collectCount > 0"
                    >{{ collectCount }}</view
                  >
                </view>
                <text class="live-collect-text">{{
                  livebodyCollected ? "已收藏" : "收藏"
                }}</text>
              </view>

              <IconButton
                title="电话"
                :fontSize="20"
                position="top"
                :iconSize="44"
                color="transparent"
                :interval="1"
                url="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/phoneIcon.png"
                style="margin-left: 25rpx"
                @onClick="$u.debounce(toCallShop, 500)"
              />
            </view>
            <view class="right-buttons live-right-btn">
              <template>
                <!-- 未开启预约 && 未售出 && 未下架 && 未锁单 -->
                <view
                  class="btn-living only-btn"
                  v-if="
                    !ifEnableSubscribe &&
                    ![3, 4].includes(saleStatus) &&
                    onShelf &&
                    !ifBuyerLockOrder
                  "
                  @tap="$u.debounce(onBuyLivebody, 500)"
                  >立即购买</view
                >
                <!-- 开启预约 && 已锁单 && 未售出 && 未下架 && 不是自己预约 -->
                <view
                  class="btn-living opacity5 only-btn"
                  v-if="
                    ifEnableSubscribe &&
                    ifBuyerLockOrder &&
                    ![3, 4].includes(saleStatus) &&
                    onShelf &&
                    !ifOneselfSubscribe
                  "
                  >已被他人预约看宠</view
                >
                <!-- (上架 && 已售出) -->
                <view
                  class="btn-living opacity5 only-btn"
                  v-if="onShelf && saleStatus == 4"
                  >已去往新家</view
                >
                <!--(上架 && 无库存) -->
                <view
                  class="btn-living opacity5 only-btn"
                  v-if="onShelf && saleStatus == 3"
                  >暂未入库</view
                >
                <!-- 已下架  -->
                <view class="btn-living opacity5 only-btn" v-if="!onShelf"
                  >已下架</view
                >
                <!-- 开启了预约看宠功能 && 未下架 && 未售出 -->
                <view class="btn-list-living" v-if="reservation">
                  <!-- 自己未预约 -->
                  <view
                    :class="[
                      'btn-item-living',
                      'coupon-left-living',
                      'notOnly-btn',
                    ]"
                    @click="$u.debounce(openRsvtPopup, 500)"
                    v-if="!ifBuyerLockOrder && !ifOneselfSubscribe"
                  >
                    预约看宠
                  </view>
                  <!-- 自己已预约 -->
                  <view
                    :class="[
                      'btn-item-living',
                      'coupon-left-living',
                      'notOnly-btn',
                    ]"
                    @click="$u.debounce(goRsvtPage, 500)"
                    v-if="!ifBuyerLockOrder && ifOneselfSubscribe"
                  >
                    已预约
                  </view>
                  <view
                    :class="[
                      'btn-item-living',
                      'coupon-right-living',
                      'margin0',
                      'notOnly-btn',
                    ]"
                    @tap="$u.debounce(onBuyLivebody, 500)"
                    v-if="
                      (ifBuyerLockOrder && ifOneselfSubscribe) ||
                      !ifBuyerLockOrder
                    "
                  >
                    立即购买
                  </view>
                </view>
              </template>
            </view>
          </view>
        </view>
        <!-- 无数据展示 -->
        <view v-if="isCompleted" class="no-data-wrapper">
          <NoData
            :noDataText="noDataTextObj.noDataText"
            :noDataText2="noDataTextObj.noDataText2"
            :img="noDataTextObj.img"
            :goodsData="formattedGoods"
            :isShowBtnBox="noDataTextObj.isShowBtnBox"
          ></NoData>
        </view>
      </view>
    </template>
    <!-- cpp_h5_loading -->
    <view v-else class="data-unsettled">
      <image
        src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
        mode="scaleToFill"
      />
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<style>
page {
  background-color: #f7f8fc;
}
</style>
<style scoped lang="scss">
@import "./index.scss";
.liner-parent {
  width: 100%;
  // height: 100%;
  background-color: #fff;
  .liner-bg {
    margin: 0 auto;
    width: 692rpx;
    height: 2rpx;
    // border: 2rpx solid #f8f8f8;
    background-color: #f8f8f8;
  }
}
</style>
