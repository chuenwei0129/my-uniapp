<template>
  <view class="result-wrapper">
    <CutepetFilter
      :scrollHeight="scrollHeight"
      :shopId="shopId"
      :liveShopList="liveShopList"
      :priceList="priceList"
      @onChange="handleDataFromChild"
    />
    <scroll-view
      class="scroll-wrapper"
      :style="{
        height: `${scrollHeight}`,
      }"
      scroll-y
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <view v-if="emptyData" class="empty-wrapper">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/search_goods_empty.png"
          class="empty-img"
        >
        </image>
        <view class="empty-text">没有找到相关商品，换一个关键词试试吧~</view>
      </view>
      <block v-else>
        <livedBodyGoodsList
          ref="livedBody"
          :goodsList="goodsList"
          :isLoading="isRefreshing"
          :noMoreData="noMoreData"
          @onClickItem="onClickItem"
        ></livedBodyGoodsList>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import CutepetFilter from "../cutepetFilter/index.vue";
import livedBodyGoodsList from "../livedBodyGoodsList/index.vue";
import { getUserInfo } from "@/api/base/index";
import { GET_PRICE_RANGE, GET_LIVESHOP_LIST } from "@/api/mallv2";
import { GET_SEARCH_GOODS } from "@/api/mallv2";
import { GET_SEARCH_LIVING } from "@/api/mall";
import { action_report, display_report } from "@/utils/track";
const module_name = "shop";

const PAGE_SIZE = 10;

export default {
  components: {
    CutepetFilter,
    livedBodyGoodsList,
  },

  props: {
    sort: {
      type: [String, Number],
      default: 1,
    },

    keyword: {
      type: String,
      default: "",
    },

    scrollHeight: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      scrollViewHeight: 0,
      goodsList: [],
      isRefreshing: false,
      emptyData: false,
      noMoreData: false,
      pageNum: 1,
      sortType: 1,
      loadLock: false,
      obj: {},
      priceList: [], // 价格列表
      liveShopList: [], // 活体门店列表
      selectDTO: {}, // 用于存储筛选组件传来的原始所有筛选条件（门店、排序、性别、价格）
      shopId: "", // 初始化门店id
    };
  },

  created() {
    this.scrollViewHeight = `calc(100vh - 70rpx)`;
  },

  mounted() {
    this.sortType = this.sort;
    console.log(`sortType: ${this.sort}`);
    // this.onRefresh();
    this.getPriceRangeList();
    this.getLiveshopList();
  },

  watch: {
    keyword: {
      handler: (val) => {
        console.log(`search goods result: ${val}`);
        this.onRefresh();
      },
    },
  },

  methods: {
    // 获取价格列表
    async getPriceRangeList() {
      try {
        let { data } = await GET_PRICE_RANGE();
        this.priceList = data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getLiveshopList() {
      return new Promise(async (resolve, reject) => {
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
          const isRequest = this.putLiveShopList(
            lon,
            lat,
            province,
            provinceCode,
            city,
            cityCode
          );
          resolve(isRequest);
        } else {
          // #ifdef H5
          const res = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
            ? JSON.parse(
                this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
                {}
              )
            : {};
          const isRequest = await this.putLiveShopList(res.lon, res.lat);
          resolve(isRequest);
          // #endif
          // #ifdef MP-WEIXIN
          uni.getLocation({
            type: "gcj02",
            success: async (res) => {
              const isRequest = await this.putLiveShopList(
                res.longitude,
                res.latitude
              );
              resolve(isRequest);
            },
            fail: async (err) => {
              console.log("dfdfdfsd", err);
              const isRequest = await this.putLiveShopList();
              resolve(isRequest);
            },
          });
          // #endif
        }
      });
    },
    putLiveShopList(lon, lat, province, provinceCode, city, cityCode) {
      return new Promise(async (resolve, reject) => {
        let query = {
          lng: lon, // -- 经度
          lat: lat, // -- 纬度
          province,
          provinceCode,
          city,
          cityCode,
        };
        if (!lon || !lat || !province) {
          resolve(false);
        }
        let { data } = await GET_LIVESHOP_LIST(query);
        console.log(data);

        this.liveShopList = data.data;
        this.liveShopList.forEach((item) => {
          if (item.selectedShop === 1) {
            this.shopId = item.shopId;
          }
        });
        this.loadGoods(this.sortType, true);
        resolve(true);
      });
    },
    async getUserMemberId() {
      let memberId = this.userInfo?.memberId;
      if (memberId) {
        console.log(`memberId: ${memberId}`);
        return memberId;
      }

      const user = await getUserInfo(true, true);
      if (this.userInfo) {
        this.userInfo.memberId = memberId;
      }
      console.log(`memberId: ${user.memberId}`);
      return user.memberId;
    },
    onFilterChange(type) {
      this.sortType = type;
      // 重新请求
      this.onRefresh();
    },
    handleDataFromChild(data) {
      console.log("handleDataFromChildhandleDataFromChild", data);
      // this.obj = data;
      this.selectDTO = data;
      const priceInfo = data?.filterInfo?.priceInfo || {};
      const sexInfo = data?.filterInfo?.sexInfo || {};
      const shopInfo = data?.shopInfo || {};
      const sortInfo = data?.sortInfo || {};
      this.obj = {
        shopIdList: shopInfo?.shopId ? [shopInfo.shopId] : [],
        gender: sexInfo?.sex ? sexInfo.sex : undefined,
        lowerPrice: priceInfo?.priceRangeBegin
          ? priceInfo.priceRangeBegin
          : undefined,
        highPrice: priceInfo?.priceRangeEnd
          ? priceInfo.priceRangeEnd
          : undefined,
        sortType: sortInfo?.id ? sortInfo.id : undefined,
      };
      // 重新请求
      this.onRefresh();
    },
    onRefresh() {
      // 正在下拉刷新，直接返回
      console.log("isRefreshing: ", this.isRefreshing);
      if (this.isRefreshing) {
        console.log("已经在刷新了~");
        return;
      }

      this.loadGoods(this.sortType, true);
    },

    onLoadMore() {
      if (this.noMoreData) {
        console.log("没有更多了~");
        return;
      }
      this.loadGoods(this.sortType);
    },

    onClickItem(item) {
      // 活体商品详情
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${item.itemId}&skuId=${
          item?.skuId || ""
        }&shopId=${item?.shopId}&liveId=${item?.liveId}`,
      });
    },

    async loadGoods(type, refresh = false) {
      if (this.loadLock) return;
      this.loadLock = true;
      const nextPageNum = refresh ? 1 : this.pageNum + 1;
      if (refresh) {
        this.cutepetList = [];
      }


      const data = {
        pageNum: nextPageNum,
        platformId: "1699310123233079297",
        pageSize: PAGE_SIZE,
        keyword: this.keyword,
        memberId: await this.getUserMemberId(),
        sort: 5,
        shopIdList: this.obj.shopIdList || [this.shopId],
        gender: this.obj.gender === 0 ? undefined : this.obj.gender,
        lowerPrice: this.obj.lowerPrice,
        highPrice: this.obj.highPrice,
        sortType: this.obj.sortType || 1,
      };
      console.log("load goods: ", data);
      if (!this.isArrAllTruthy(data.shopIdList)) data.shopIdList = [];
      try {
        const res = await GET_SEARCH_LIVING(data);
        console.log("search goods: ", res);
        const pageGoods = res.data?.data?.data ?? [];
        if (refresh) {
          this.goodsList = pageGoods;
        } else {
          this.goodsList = [...this.goodsList, ...pageGoods];
        }
        this.goodsList.map((item) => {
          display_report({
            display_name: "search_commodity_show",
            object_type: module_name,
            extend: {
              commodity_name: item.itemName,
              commodity_id: item.itemId,
            },
          });
        });
        console.log("goods list: ", this.goodsList);
        this.pageNum = nextPageNum;
        this.emptyData = this.goodsList.length == 0;
        // 是否为空
        this.noMoreData =
          res.data?.data?.empty ||
          pageGoods.length == 0 ||
          pageGoods.length < 10;
        this.loadLock = false;
      } catch (err) {
        console.log(err);
        this.loadLock = false;
      } finally {
        this.loadLock = false;
        if (this.isRefreshing) {
          this.isRefreshing = false;
        }
      }
    },
    // 判断数组内是否全部为真值
    isArrAllTruthy(arr) {
      return arr.every((item) => item);
    },
  },
};
</script>

<style lang="scss" scoped>
.result-wrapper {
  display: flex;
  flex-flow: column nowrap;

  .scroll-wrapper {
    background: #f7f8fc;
  }

  .empty-wrapper {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    .empty-img {
      width: 346rpx;
      height: 346rpx;
    }

    .empty-text {
      font-size: 29rpx;
      font-weight: 400;
      color: #666666;
    }
  }
}
</style>
