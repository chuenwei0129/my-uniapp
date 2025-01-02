<template>
  <view class="container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="status-bar" :style="{ height: navBarHeight + 'px' }"></view>
    <FixedNav
      :title="title"
      :headerShow="isHeaderShow"
      :isShowBack="true"
    ></FixedNav>
    <!-- 筛选按钮 -->
    <view class="btn_list" id="filterButtons">
      <view
        class="item"
        v-for="(btn, i) in btnList"
        :key="i"
        :class="{ active: i === btnIndex }"
        @click="changeData(i)"
      >
        <view class="name">{{ btn.label }}</view>
        <image class="img" v-if="btn.img" :src="btn.img"></image>
      </view>
    </view>
    <scroll-view
      class="scroll-view"
      scroll-y
      @scroll="handleScroll"
      @scrolltolower="handleScrollToLower"
    >
      <view class="main">
        <view class="recommendation">
          <view class="empty-recomment">
            <GoodsList
              :goods="formattedGoods"
              :imageStyle="{ backgroundColor: '#F7F8FC' }"
            />
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
import GoodsList from "../takeBathPage/components/goodsList/index";
import FixedNav from "@/components/fixedNav/index.vue";
import { GET_INSTORE_SERVICE, GET_PRODUCTLIST } from "@/api/mall";
export default {
  components: {
    NavBar,
    GoodsList,
    FixedNav,
  },
  data() {
    return {
      currentIndex: 0,
      isHeaderShow: true, //顶部导航栏显示
      headerTop: 0,
      isFixed: false,
      title: "洗澡",
      btnList: [
        {
          label: "综合排序",
        },
        {
          label: "距离优先",
        },
        {
          label: "综合排序",
        },
        {
          label: "销量优先",
        },
        {
          label: "价格",
          img: 'https://hzcpp-frontend.oss-cn-shanghai.aliyuncs.com/image/medical-mp/v5.4.0/surface.png',
        },
      ],
      btnIndex: 0,
      swiperList: [],
      goodsList: [],
      statusBarHeight: "",
      navBarHeight: "",
      btnTop: 0,
      filterButtonsHeight: 0,
      pageSize: 5,
      pageNo: 1,
      resource: null,
      buttonTop: 0,
    };
  },
  onLoad(option) {
    console.log("option----------------", option);
    if (option.resource) {
      this.resource = option.resource;
    }
  },
  computed: {
    // 图片分组 三个一组
    groupedChildResoureList() {
      let grouped = [];
      for (let i = 0; i < this.swiperList.length; i += 3) {
        grouped.push(this.swiperList.slice(i, i + 3));
      }
      return grouped;
    },
    formattedGoods() {
      return this.goodsList.map((e) => {
        const salePrice =
          e.promotionTag != null ? e.promotionPrice : e.realPrice;
        const originPrice = e.promotionTag != null ? e.realPrice : 0;
        return {
          picture: e.image,
          title: e.itemName,
          salePrice: salePrice,
          originPrice: originPrice,
          id: e.itemId,
          skuId: e.skuId,
          skuTag: e.skuTag,
          shopId: e.shopId,
          promotion: e.promotionTag,
          soldStockTag: e.saledStockQty,
          distance: e.distance,
          shopName: e.shopName,
        };
      });
    },
  },
  methods: {
    selectDot(index) {
      this.currentIndex = index;
    },
    changeData(current) {
      this.pageNo = 1;
      this.pageSize = 5;
      this.btnIndex = current;
      this.getGoodsData();
    },
    handleSwiperChange(event) {
      this.currentIndex = event.detail.current;
    },
    // 获取商品列表
    async getGoodsData() {
      try {
        // const params = {
        //   pageNum: this.pageNo,
        //   pageSize: this.pageSize,
        //   cityCode: uni.getStorageSync("cityCode"), //必传 城市编码
        //   lng: uni.getStorageSync("lon"),
        //   lat: uni.getStorageSync("lat"),
        //   categoryId: [this.resource] || ["1731212194321338369"], //必传 类目id
        //   sortType: this.btnIndex + 1, //必传 排序类型: 1、智能排序 2、距离优先3、销量优先 4、低价优先
        //   fromChannel: "MP",
        // };
        const params = {
          cityCode: "3301",
          lng: 121.45712,
          lat: 31.229234,
          categoryIds: ["1730416863288217602"],
          sortType: 2,
          fromChannel: "APP",
        };
        const { data } = await GET_PRODUCTLIST(params);
        if (data.code === 0 && data.data) {
          this.goodsList = data.data.data;
          console.log("this.goodsList", this.goodsList);
        }
        console.log("获取商品列表---------", this.goodsList);
      } catch (error) {
        console.log("获取商品列表失败" + error);
      }
    },
    handleScrollToLower() {
      console.log("下滑！！！");
      this.pageNo++;
    },
    handleScroll(event) {
      this.isFixed = event.detail.scrollTop >= 340;
    },
    calculateButtonTop() {
      this.buttonTop = parseInt(this.statusBarHeight) + parseInt(this.navBarHeight);
    }
  },
  mounted() {
    this.getGoodsData();
    //#ifdef MP-WEIXIN
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight;
      },
    });
    this.navBarHeight = getApp().globalData.navBarHeight;
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight;
    this.navBarHeight = getApp().globalData.h5NavBarHeight;
    //#endif
    this.calculateButtonTop()
  },
};
</script>

<style scoped lang="scss">
.container {
  line-height: 31rpx;
  background-color: #f7f8fc;
  .main {
    width: 750rpx;
    height: 100vh;
    margin-top: 75rpx;
    .card {
      color: #1f1f1f;
      background-color: #fff;
      border-radius: 23rpx;
      padding: 23rpx;
      .title {
        line-height: 42rpx;
        font-size: 31rpx;
        margin-bottom: 23rpx;
        font-weight: 600;
      }
    }
    .recommendation {
      background-color: #fff;
    }

    .empty-recomment {
      padding: 23rpx 15rpx 0 15rpx;
    }
    .fixed-header {
      position: sticky;
      top: 0;
      z-index: 999;
      background-color: #fff;
      padding: 23rpx 15rpx;
    }
  }
  .btn_list {
    display: flex;
    align-items: center;
    padding: 20rpx 15rpx 15rpx 15rpx;
    background-color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 999;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1f1f1f;
      background: #f7f7f7;
      border-radius: 23rpx;
      margin-right: 15rpx;
      font-size: 21rpx;
      width: 169rpx;
      &:last-child {
        margin-right: 0;
      }
      .name {
        padding: 7rpx 0;
      }
      .img {
        width: 23rpx;
        height: 23rpx;
      }
    }
    .active {
      color: #fe2442;
      background: rgba(255, 77, 77, 0.1);
    }
  }
}
::v-deep .header-fixed {
  background-color: #f7f8fc !important;
}
</style>
