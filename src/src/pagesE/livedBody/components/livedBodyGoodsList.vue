<template>
  <view class="goods-list">
    <view
      v-for="(item, index) in list"
      :key="item.liveId"
      class="goods-item"
      @click="() => $u.debounce(() => goToPage(item), 500)"
    >
      <view class="goods-img">
        <image :src="item.majorPicture" mode="aspectFill" />
        <!-- 判断是否有门店liveShop信息 -->
        <view v-if="item.shopName" class="goods-address">
          {{ item.shopName.slice(0, 14) }}
        </view>
      </view>

      <view class="goods-info">
        <view class="goods-name">
          <text class="name">{{ item.itemName }}</text>
          <image :src="sexImgList[item.gender]" mode="aspectFill" />
        </view>
        <!-- speciesClassification: 品种分类;1:猫类活体 50:犬类活体 214:水族活体 460:爬行类活体 835:小宠类活体 836:鸟类活体 -->
        <view
          v-if="
            item.speciesClassification == 1 || item.speciesClassification == 50
          "
          class="goods-type"
        >
          <template>{{ getComputedAge(item) }}</template
          ><template v-if="item.numberOfVaccines"
            >/疫苗{{ item.numberOfVaccines }}针</template
          ><template v-if="item.numberOfDeworming"
            >/驱虫{{ item.numberOfDeworming }}次</template
          >
        </view>
        <view v-else class="goods-type">
          {{ shapeMap[item.shape] || "" }}
        </view>
        <view class="goods-price">
          <view class="price">
            <text>￥</text>
            <text>{{ item.minSalePrice }}</text>
            <!-- <text v-if="item.salePrice">￥{{ item.salePrice }}</text> -->
          </view>
          <view class="types">
            <!-- <view v-if="item.reservation == 1">已预约</view> -->
            <view v-if="item.collect == 1">已收藏</view>
          </view>
        </view>
      </view>
      <!-- #ifdef H5 -->
      <view class="zhibo" @click.stop="() => $u.debounce(() => toLiveRoom(item), 500)" v-if="item.livingStatus === 1">
        <image
          class="img"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/iSpt.png"
          alt=""
        />
        <view class="num">{{ broadcastNum(item.likeNum) }}</view>
      </view>
      <!-- #endif -->
    </view>

    <view v-if="!isRequesting && list.length === 0" class="no-data">
      <image
        :src="
          (tabList && tabList[tabIndex] && tabList[tabIndex].noneIMG) ||
          noDataImg
        "
      />
      <view v-if="recommendedShop.shopName == undefined">
        你喜欢的{{ tabName }}还在途中
      </view>
    </view>

    <view
      v-if="
        !isLoading && list.length < 3 && recommendedShop.shopName != undefined
      "
      class="guide"
      :class="{ 'guide-mg': list.length == 0 }"
    >
      <view class="guide-text">
        {{ recommendedShop.shopName }}有更多相似{{ tabName }}
      </view>
      <view class="guide-btn" @click="handleRefresh(recommendedShop)"
        >前往查看</view
      >
    </view>
    <view v-else class="page-bottom">
      <view v-if="isLoading" class="loading-container">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/loading.png"
        />
        <view>胖胖努力中…</view>
      </view>
      <view
        v-if="!isLoading && !(!isRequesting && list.length === 0)"
        class="last-container"
      >
        已经到底啦喵～
      </view>
    </view>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  options: {
    styleIsolation: "shared", // 解除样式隔离
  },
  props: {
    goodsList: {
      type: Array,
      default: [],
    },
    tabList: {
      type: Array,
      default: [],
    },
    toPath: {
      type: String,
      default: "/",
    },
    isRequesting: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    recommendedShop: {
      type: Object,
      default: {},
    },
    tabIndex: {
      type: Number,
      default: 0,
    },
    tabId: {
      type: String,
      default: "",
    },
    breedId: {
      type: String,
      default: "",
    },
    filterData: {
      type: Object,
      default: {},
    },
    tabName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 性别图标组
      sexImgList: [
        "",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/male.png",
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/female.png",
      ],
      // 列表为空图片组
      noDataImg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/search_goods_empty.png",
      // 异宠形态体格map
      shapeMap: {
        // 0: "未知",
        1: "半毛",
        2: "全毛",
        11: "幼体",
        12: "亚成体",
        13: "亚成体",
      },
      visitedShopIds: [],
      list: [],
      clickItemInfo: {}, // 当前点击的item项
    };
  },
  mounted() {
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {
        console.log("success load ttflbgd");
      },
      fail(e) {
        console.log("fail load ttf", e);
      },
    });
    console.log("tabName===3", this.tabName);
  },
  created() {},
  computed: {},
  watch: {
    tabList: {
      handler(region, oldRegion) {},
      immediate: true,
      deep: true,
    },
    goodsList: {
      handler(region, oldRegion) {
        this.list = JSON.parse(JSON.stringify(region));
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // #ifdef H5
    broadcastNum(num) {
      const wan = Number(num) / 10000; // 计算万位数
      console.log("broadcastNum", wan);

      if (Number(num) >= 10000) {
        // 检查wan是否为整数
        if (Number.isInteger(wan)) {
          // 如果是整数，则直接转换为字符串并拼接"万"
          return wan.toString() + "万";
        } else {
          // 如果不是整数，则保留一位小数并拼接"万"
          return wan.toFixed(1) + "万";
        }
      } else {
        // 如果不超过10000，则直接返回数值的字符串形式
        return num;
      }
    },
    // #endif
    handleRefresh(recommendedShop) {
      this.$emit("handleRefresh", recommendedShop);
    },
    // debounceGoPage(info) {
    //   // uViewUI 组件库自带防抖功能 不能传递参数，否则会失效，这里中转一下
    //   this.clickItemInfo = info;
    //   uni.$u.debounce(this.goToPage, 500);
    // },
    goToPage(info) {
      // const info = this.clickItemInfo;
      console.log("debounce goToPage");
      // 埋点相关
      let userId;
      // #ifdef H5
      userId = this.$dsBridge.call("getUserId", "getUserId");
      // #endif
      // #ifdef MP-WEIXIN
      const res = uni.getStorageSync("storage_info");
      userId = res.userId;
      // #endif
      action_report({
        action_name: "Livepetchannel_pet_click",
        extend: {
          user_id: userId,
          commodity_id: info.itemId,
        },
      });
      // 同步活体频道收藏状态
      // #ifdef H5
      localStorage.setItem(
        "liveCollect",
        JSON.stringify({
          itemId: info.itemId,
        })
      );
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/flutter?entryPoint=goodsShopSpecialDetailPage&primaryId=${info.itemId}&shopId=${info.shopId}&skuId=${info.skuId}`,
      });
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?shopId=${info.shopId}&itemId=${info.itemId}&skuId=${info.skuId}&transparentTopBar=1`,
      });
      // #endif
    },
    handleToView() {
      // this.recommendedShop.shopId为附近门店id字段
      // 记录用户跳转门店前已选择的类目和筛选条件
      let queryStr = `?shopId=${this.recommendedShop.shopId}`;
      if (this.tabId) queryStr += `&tabId=${this.tabId}`;
      if (this.breedId) queryStr += `&breedId=${this.breedId}`;
      if (this.filterData.gender && this.filterData.gender != 0)
        queryStr += `&gender=${this.filterData.gender}`;
      if (this.filterData.lowerPrice)
        queryStr += `&lowerPrice=${this.filterData.lowerPrice}`;
      if (this.filterData.highPrice)
        queryStr += `&highPrice=${this.filterData.highPrice}`;
      this.visitedShopIds = uni.getStorageSync("visitedShopIds") || [];
      this.visitedShopIds.push(this.filterData.allstores.shopId);
      uni.setStorageSync("visitedShopIds", this.visitedShopIds);

      uni.redirectTo({
        url: `/pagesE/livedBody/index${queryStr}&tabIndex=${this.tabIndex}`,
      });
    },
    // 猫狗的年龄整合
    getComputedAge(info) {
      const year = info.years == 0 || !info.years ? "" : `${info.years}年`;
      const month =
        info.months == 0 || !info.months ? "" : `${info.months}个月`;
      const day = `${info.days || 0}天`;
      return `${year}${month}${day}`;
    },
    // 跳转直播间
    toLiveRoom(item){
      console.log(item);
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/live/body/main?roomId=${item.liveRoomId}&refId=${item.liveId}`,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  padding: 15rpx 0;
  padding-top: 19rpx;
  width: 100%;
  background: linear-gradient( 180deg, #FFFFFF 0%, #F7F8FC 100%);
  background-size: 100% 720rpx;
}

.goods-item {
  // #ifdef H5
  position: relative;
  // #endif
  margin-bottom: 15rpx;
  margin-left: 18rpx;
  background: #FFFFFF;
  border-radius: 23rpx;
  .goods-img {
    width: 352rpx;
    height: 352rpx;
    margin-bottom: 17rpx;
    border-radius: 23rpx;
    position: relative;
    border-radius: 23rpx 23rpx 0rpx 0rpx;
    image {
      width: 100%;
      height: 100%;
      border-radius: 23rpx 23rpx 0rpx 0rpx;
    }

    .goods-address {
      position: absolute;
      left: 8rpx;
      bottom: 8rpx;
      height: 31rpx;
      line-height: 31rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 15rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 21rpx;
      color: #ffffff;
      padding: 0 10rpx;
    }
  }
  .goods-info {
    padding: 0 17rpx 17rpx 17rpx;

    .goods-name {
      display: flex;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 27rpx;
      color: #333333;
      line-height: 35rpx;
      .name {
        max-width: calc(316rpx - 31rpx);
        white-space: nowrap; /* 保证文本在一行内显示 */
        overflow: hidden; /* 超出容器的文本将被截断 */
        text-overflow: ellipsis;
      }

      image {
        width: 27rpx;
        height: 27rpx;
        margin-left: 6rpx;
      }
    }
    .goods-type {
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 23rpx;
      color: #666666;
      margin-bottom: 15rpx;
      line-height: 35rpx;
      max-width: 316rpx;
      white-space: nowrap; /* 保证文本在一行内显示 */
      overflow: hidden; /* 超出容器的文本将被截断 */
      margin-top: 3rpx;
    }
    .goods-price {
      display: flex;
      align-items: center;

      .price {
        // font-family: D-DIN-Bold, D-DIN;
        font-weight: 600;
        color: #1f1f1f;

        & text:nth-child(1) {
          font-size: 23rpx;
          font-family: PingFangSC-Medium, PingFang SC;
        }
        & text:nth-child(2) {
          font-family: D-DIN-Bold, D-DIN;
          font-size: 31rpx;
        }
        & text:nth-child(3) {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 23rpx;
          color: #999999;
          text-decoration: line-through;
          margin-left: 6rpx;
        }
      }
      .types {
        margin-left: auto;

        view {
          background: #ffefef;
          border-radius: 17rpx;
          padding: 0 10rpx;

          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 21rpx;
          line-height: 35rpx;
          color: #fe2442;
        }
      }
    }
  }
  // #ifdef H5
  .zhibo {
    position: absolute;
    left: 8rpx;
    top: 8rpx;
    height: 35rpx;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 23rpx;
    display: flex;
    align-items: center;
    justify-content: start;
    padding-right: 10rpx;
    .img {
      width: 35rpx;
      height: 35rpx;
      border-radius: 50%;
      margin-right: 10rpx;
      background-color: #dc283d;
    }
    .num {
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 21rpx;
      color: #ffffff;
      line-height: 35rpx;
      text-align: left;
      font-style: normal;
    }
  }
  // #endif
}
.guide-mg {
  margin-top: 19rpx !important;
}
.guide {
  margin-top: 117rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  // padding-bottom: 185rpx;
  width: 100%;

  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 25rpx;
  color: #666666;

  .guide-text {
    margin-left: 15%;
    margin-right: 15%;
  }

  .guide-btn {
    background: #ffffff;
    border-radius: 50rpx;
    border: 1px solid rgba(254, 36, 66, 0.5);
    opacity: 0.8;
    padding: 15rpx 39rpx;
    margin-top: 29rpx;
    font-size: 29rpx;
    color: #fe2442;
  }
}

.page-bottom {
  width: 100%;
}
.loading-container {
  margin-top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-bottom: 16rpx;

  image {
    width: 46rpx;
    height: 46rpx;
  }
  view {
    margin-top: 19rpx;

    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 23rpx;
    color: #5a5a5a;
  }
}
.no-data {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 163rpx;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 25rpx;
  color: #666666;

  image {
    width: 346rpx;
    height: 346rpx;
  }
}
.last-container {
  width: 100%;
  display: flex;
  margin-top: 60rpx;
  // padding-bottom: 25rpx;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 23rpx;
  color: #5a5a5a;
  line-height: 33rpx;
  margin-bottom: 77rpx;
}
</style>
