<template>
  <view>
    <tabbar @changeIndex="handleChangeIndex"></tabbar>
    <view class="container">
      <view v-if="tabbarIndex == 0" class="shop-container">
        <view v-if="isCollectionEmpty" class="empty-wrapper">
          <view class="" v-if="showOverlay">
            <u-loading-page
              :loading="true"
              loading-text="努力加载中…… "
              color="#333"
              font-size="16"
            ></u-loading-page>
          </view>
          <template v-else>
            <view class="empty-ico"></view>
            <view class="empty-text">空空滴，快开始你的第一个收藏吧</view>
            <view class="empty-action" @click="handleEmptyAction"
              >去商城选购</view
            >
          </template>
        </view>
        <block v-else>
          <scroll-view
            scroll-y
            :style="{
              height: '100vh',
            }"
            refresher-enabled="true"
            :refresher-triggered="isRefreshing"
            @refresherrefresh="onRefresh"
            @scrolltolower="onLoadMore"
          >
            <view
              v-for="(item, index) in items"
              :key="item.itemId"
              :class="[
                'touch-item',
                item.isTouchMove ? 'touch-move-active' : '',
              ]"
              @touchstart="touchstart($event)"
              @touchmove="touchmove(index, $event)"
            >
              <!-- content就是选中的这个元素 -->
              <view class="content" @tap="goToDetail(item, index)">
                <view class="pic-container">
                  <image
                    :src="item.majorPicture"
                    :class="['pic', isInvalid(item) ? 'invalid' : '']"
                    mode="aspectFill"
                  ></image>
                  <view v-if="isInvalid(item)" class="invalid-text"
                    >已失效</view
                  >
                </view>

                <view :class="['info', isInvalid(item) ? 'invalid' : '']">
                  <view class="name">{{ item.itemName }}</view>
                  <!-- 金额 -->
                  <GoodsPrice
                    :salePrice="item.lowestPrice"
                    :saleSignFontSize="23"
                    :salePriceIntegerFontSize="38"
                    :saleFontWeight="700"
                    :salePriceDecimalFontSize="27"
                  />
                </view>
              </view>
              <view class="del" @tap="del(item, index)">取消收藏</view>
            </view>
          </scroll-view>
        </block>
      </view>
      <view v-if="tabbarIndex == 1">
        <scroll-view
          class="page-scroll-view"
          refresher-enabled="true"
          :refresher-triggered="isLivedBodyRefreshing"
          @refresherrefresh="onLiveBodyRefresh"
          @scrolltolower="$u.debounce(onScrolltolower, 500)"
          scroll-y
          :style="{ height: tabHeight }"
        >
          <LivedBodyGoodsList
            v-if="flag"
            :goodsList="goodsList"
            :isRequesting="isRequesting"
            :isLoading="isLoading"
          />
        </scroll-view>
      </view>
      <view v-if="tabbarIndex == 2" class="shop-container">
        <view class="list-box" v-if="listData && listData.length > 0">
          <view class="list">
            <view class="ul">
              <view
                class="li-item"
                v-for="item in listData"
                :key="item.id"
                @click="goDetail(item)"
              >
                <view class="top-img">
                  <image
                    class="img"
                    :src="item.coverUrl"
                    mode="widthFix"
                  ></image>
                  <view class="badge-name" v-if="item.badgeName">{{
                    item.badgeName
                  }}</view>
                  <view
                    class="badge-name left-bottom"
                    v-if="
                      item.activityStatus &&
                      activityStatusStr(item.activityStatus) != null
                    "
                    >{{ activityStatusStr(item.activityStatus) }}</view
                  >
                </view>

                <view class="info">
                  <view class="title ellipsis">{{ item.activityName }}</view>
                  <view class="flex">
                    <view class="info-left">
                      <view
                        class="price-tag fl-row-center"
                        :class="[item.activityType == 'PAY' ? 'pay' : '']"
                      >
                        {{ item.activityType == "PAY" ? "付费" : "免费" }}
                      </view>
                      <view class="date">{{
                        dateTime(item.startTimestamp)
                      }}</view>
                    </view>

                    <view class="b-right">{{ showAddress(item) }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="no-data" v-else>
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/no_data.png"
          />
          <view class="empty-text">空空滴，快开始你的第一个收藏吧</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import GoodsPrice from "@/components/goodsPrice/index.vue";
import { GET_COLLECTION_LIST, CANCEL_COLLECTION } from "@/api/mall";
import tabbar from "./components/tabbar.vue";
import { GET_ACTIVIITES_LIST } from "@/api/activitymine";
import dayjs from "dayjs";
import { mapState } from "vuex";
import { action_report } from "@/utils/track";
import LivedBodyGoodsList from "./components/livedBodyGoodsList.vue";
import { GET_LIVED_BODY_LIST } from "@/api/livedBody";

const module_name = "activity";

const PAGE_SIZE = 20;

export default {
  components: {
    GoodsPrice,
    tabbar,
    LivedBodyGoodsList,
  },

  data() {
    return {
      items: [],
      startX: 0, //开始坐标
      startY: 0,
      pageNum: 1,
      isRefreshing: false,
      noMoreData: false,
      showOverlay: true,
      tabbarIndex: 0,
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
      tabVal: "",
      listData: [],
      weekList: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],

      // 萌宠收藏tab
      goodsList: [],
      isRequesting: true,
      // : true,
      requestNum: 0, // mock测试用变量
      tabHeight: 0,
      livedBodyListForm: {
        platformId: "1699310123233079297",
        appId: "1729776648698531840",
        pageNum: 1,
        pageSize: 10,
      },
      isLoading: false,
      isLivedBodyRefreshing: false,
      livedBodyNoMoreData: false,
      flag: true,
    };
  },

  computed: {
    isCollectionEmpty() {
      return this.pageNum == 1 && (this.items?.length ?? 0) == 0;
    },
  },

  onLoad(option) {
    // let arr = [];
    // for (var i = 0; i < 10; i++) {
    //   arr.push({
    //     itemId: i,
    //     itemName: `商品标题${i} sjlkjsa;lkjsdlkfjas;lkfajsd;lkfaj;sdflkajsdfl;kasjdfal;ksd23232323232`,
    //     content: i + " 向左滑动删除-<<",
    //     lowestPrice: 19.99,
    //     isTouchMove: false //默认全隐藏删除
    //   })
    // }
    // this.items = arr;
    this.onRefresh();
    this.getMyActivityList();
  },
  onShow() {
    // 取消收藏返回列表刷新
    if (this.tabbarIndex === 0) {
      this.onRefresh();
    } else if (this.tabbarIndex === 1) {
      // this.livedBodyListForm.pageNum = 1;
      // this.goodsList = [];
      this.flag = false;
      setTimeout(() => {
        this.flag = true;
      }, 10);
      this.getGoodsList(true);
    } else if (this.tabbarIndex === 2) {
      this.getMyActivityList();
    }
    uni.getSystemInfo({
      success: (res) => {
        // 100vh - tabbar高度 = tab高度
        const topHeight = 77 / (750 / res.screenWidth);
        this.tabHeight = `calc(100vh - ${topHeight}px)`;
      },
    });
  },
  onReachBottom() {
    if (this.pageNo == this.totalPage) return;
    this.pageNo++;
    this.getMyActivityList();
  },
  methods: {
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (target) {
      //开始触摸时 重置所有删除
      this.items.forEach((v, i) => {
        if (v.isTouchMove)
          //只操作为true的
          v.isTouchMove = false;
      });
      this.startX = target.changedTouches[0].clientX;
      this.startY = target.changedTouches[0].clientY;
    },
    //滑动事件处理
    touchmove: function (index, target) {
      let that = this,
        startX = that.startX, //开始X坐标
        startY = that.startY, //开始Y坐标
        touchMoveX = target.changedTouches[0].clientX, //滑动变化坐标
        touchMoveY = target.changedTouches[0].clientY, //滑动变化坐标
        //获取滑动角度
        angle = that.angle(
          { X: startX, Y: startY },
          { X: touchMoveX, Y: touchMoveY }
        );
      const newItems = that.items.map(function (v, i) {
        v.isTouchMove = false;
        //滑动超过30度角 return
        if (Math.abs(angle) > 15) return v;
        if (i == index) {
          if (touchMoveX > startX)
            //右滑
            v.isTouchMove = false;
          //左滑
          else v.isTouchMove = true;
        }
        return v;
      });
      that.items = newItems;
    },

    angle: function (start, end) {
      var _X = end.X - start.X,
        _Y = end.Y - start.Y;
      //返回角度 /Math.atan()返回数字的反正切值
      return (360 * Math.atan(_Y / _X)) / (2 * Math.PI);
    },

    isInvalid(item = {}) {
      //VALID: "有效" INVALID: '失效'
      return item.collectStatus === "INVALID";
    },

    onRefresh() {
      this.isRefreshing = true;
      this.getCollectionList(true);
    },

    onLoadMore() {
      if (this.noMoreData) {
        console.log("没有更多数据了~");
        return;
      }
      this.getCollectionList();
    },

    async getCollectionList(refresh = false) {
      const nextPageNum = refresh ? 1 : this.pageNum + 1;
      try {
        const res = await GET_COLLECTION_LIST({
          pageNum: nextPageNum,
          pageSize: PAGE_SIZE,
          platformId: "1699310123233079297",
          appId: "1729776648698531840",
        });
        console.log("res: ", res);
        // res.data?.data
        const list = res.data?.data?.data ?? [];
        this.showOverlay = false;
        if (refresh) {
          this.items = list;
          this.isRefreshing = false;
        } else {
          this.items = [...this.items, ...list];
        }
        // 没有更多了
        this.noMoreData =
          res.data?.data?.empty ?? PAGE_SIZE > (res.data?.data?.pageSize ?? 0);
        this.pageNum = nextPageNum;
      } catch (err) {
        console.log(err);
        if (refresh) {
          this.isRefreshing = false;
          this.showOverlay = false;
        }
      }
    },
    // 进入商品详情
    goToDetail(item, index) {
      console.log("点击查看的item----->", item);
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${item.itemId}&shopId=${item.shopId}`,
      });
    },
    //删除事件
    async del(item, index) {
      try {
        console.log(`del id: ${item.itemId}, index: ${index}`);
        await CANCEL_COLLECTION({
          itemId: item.itemId,
          platformId: "1699310123233079297",
          appId: "1729776648698531840",
        });
        this.onRefresh();
      } catch (err) {
        console.log(err);
      }
    },

    handleEmptyAction() {
      // 跳转商城首页
      uni.switchTab({
        url: "/pages/mall/index",
      });
    },
    handleChangeIndex(e) {
      this.tabbarIndex = e;
      // 萌宠tab显示初始化
      if (e === 1) {
        this.getGoodsList(true);
      }
    },
    async getMyActivityList() {
      const { latitude, longitude } = uni.getStorageSync(
        "storage_currentPosition"
      );
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        type: "WANTED",
      };
      if (latitude) {
        params.lat = latitude;
        params.lon = longitude;
      }

      const res = await GET_ACTIVIITES_LIST(params);
      this.totalPage = res.data.totalPage;
      this.listData = [...this.listData, ...res.data.data];
    },
    goDetail(item) {
      action_report({
        action_name: "xcxdiscover_pet_travel_event_click",
        module_name: module_name,
        extend: {
          subjectId: item.id,
          subjectName: item.activityName,
        },
      });
      this.setRouter("/pagesF/activityDetails/index?aid=" + item.id);
    },
    showAddress(info) {
      let distance = info.distance;
      let cityCode = info.cityCode;
      //   console.log("showAddress ", info);
      console.log("showAddress1 ", cityCode, this.cityCode);
      let locationCityCode =
        uni.getStorageSync("storage_location_city_code") || "";
      if (
        cityCode == this.cityCode &&
        locationCityCode == this.cityCode &&
        distance
      ) {
        if (distance < 1000) {
          return distance.toFixed(0) + "m";
        }
        distance = distance / 1000;
        let num = "";
        if (distance >= 999) {
          num = "999+km";
        } else {
          num = Math.floor(distance * 100) / 100;
          num = distance.toFixed(1) + "km";
        }
        return num;
      } else {
        return info.cityName;
      }
    },
    dateTime(t) {
      let timeStr = `${dayjs(t).format("MM-DD")} ${
        this.weekList[Number(dayjs(t).format("d"))]
      } `;
      return timeStr;
    },
    setRouter(url) {
      uni.navigateTo({
        url,
      });
    },
    activityStatusStr(activityStatus) {
      if (activityStatus == "FINISHED") {
        return "已结束";
      } else if (activityStatus == "REJECTED") {
        return "已下架";
      }
      return null;
    },
    onLiveBodyRefresh() {
      this.livedBodyListForm.pageNum = 1;
      this.isLivedBodyRefreshing = true;
      this.getGoodsList(true);
    },
    // 滚动条触底事件
    onScrolltolower() {
      console.log(4);
      console.log("onScrolltolower");
      if (this.livedBodyNoMoreData) {
        console.log("没有更多数据了~");
        return;
      }
      this.getGoodsList();
    },
    async getGoodsList(refresh = false) {
      console.log("nextPageNum", refresh);
      this.isLoading = false;
      const nextPageNum = refresh ? 1 : this.livedBodyListForm.pageNum + 1;
      console.log("nextPageNum", nextPageNum);

      try {
        // this.isRequesting = true;
        // this.isLoading = true;
        const data = {
          ...this.livedBodyListForm,
          pageNum: nextPageNum,
        };
        const res = await GET_LIVED_BODY_LIST(data);
        console.log("GET_LIVED_BODY_LIST", res);
        let resData = res.data?.data?.data || [];
        this.isRequesting = false;
        this.isLoading = true;
        if (refresh) {
          console.log("refresh", resData);
          this.goodsList = resData;
          this.isLivedBodyRefreshing = false;
        } else {
          this.goodsList = [...this.goodsList, ...resData];
        }
        this.livedBodyNoMoreData =
          res.data?.data?.empty ??
          this.livedBodyListForm.pageSize > (res.data?.data?.pageSize ?? 0);
        // 过滤只要状态为2/3/4的宠物，0--未知，1--未上架，2--售卖中，3--无库存，4--已售出
        this.livedBodyListForm.pageNum = nextPageNum;
      } catch (error) {
        console.log("request error:", error);
        this.isLoading = true;
        // this.isLoading = false;
        if (refresh) {
          this.isLivedBodyRefreshing = false;
          this.isRequesting = false;
        }
      }
    },
  },
};
</script>

<style>
page {
  height: 100%;
  width: 100%;
  background-color: #f7f8fc;
}
</style>

<style lang="scss" scoped>
$swipe-del-with: 162rpx;

.container {
  /* padding-left: 15rpx;
  padding-right: 15rpx; */
  background-color: #f7f8fc;
  width: 100%;
  /* height: 100%; */

  display: flex;
  flex-flow: column nowrap;
}

.shop-container {
  padding: 0 15rpx;
}

.touch-item {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  background-color: white;
  border-radius: 16rpx;
  margin-top: 19rpx;
  overflow: hidden;
}

.content {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  height: 246rpx;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  padding: 30rpx;
  -webkit-transform: translateX($swipe-del-with);
  transform: translateX($swipe-del-with);
  margin-left: -$swipe-del-with;
  overflow: hidden;

  .invalid {
    opacity: 0.4;
  }

  .pic-container {
    height: 184rpx;
    width: 184rpx;
    border-radius: 8rpx;
    background-color: #f5f4f5;
    position: relative;

    .pic {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      height: 184rpx;
      width: 184rpx;
      border-radius: 8rpx;
      background-color: #f5f4f5;
    }

    .invalid-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      width: 106rpx;
      height: 46rpx;
      background: #000000;
      text-align: center;
      border-radius: 23rpx;
      opacity: 0.8;

      font-size: 25rpx;
      font-weight: 400;
      line-height: 46rpx;
      color: #ffffff;
    }
  }

  .info {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;
    margin-left: 30rpx;
    overflow: hidden;
    flex: 1 1 0;

    .invalid {
      opacity: 0.4;
    }

    .name {
      color: #333333;
      margin-top: 8rpx;
      font-size: 29rpx;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .price {
      margin-bottom: 19rpx;
      color: #ff5b05;
      font-size: 27rpx;
      font-weight: bold;
    }
  }
}

.del {
  background-color: #ff8315;
  width: $swipe-del-with;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 25rpx;
  font-weight: bold;
  -webkit-transform: translateX($swipe-del-with);
  transform: translateX($swipe-del-with);
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
  /* display: none; */
}

.touch-move-active .content,
.touch-move-active .del {
  -webkit-transform: translateX(0);
  transform: translateX(0);
}

.empty-wrapper {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  .empty-ico {
    height: 346rpx;
    width: 346rpx;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/empty_my_collection.png");
  }

  .empty-text {
    margin-top: 19rpx;
    font-size: 25rpx;
    font-weight: 400;
    color: #999999;
  }

  .empty-action {
    margin-top: 30rpx;
    width: 202rpx;
    height: 62rpx;
    background: #ffd41e;
    border-radius: 31rpx;

    font-size: 25rpx;
    font-weight: bold;
    color: #1f1f1f;
    text-align: center;
    line-height: 62rpx;
  }
}

.item-card-warp {
  width: 704rpx;
  border-radius: 15rpx;
  margin: 19rpx auto 0;
  box-shadow: 0px 0px 8rpx 0px rgba(0, 0, 0, 0.04);
  background: #ffffff;
}
.item-card {
  .items-center {
    height: 138rpx;
    padding: 19rpx 31rpx;
  }
  .head-picture {
    position: relative;
    .img {
      width: 77rpx;
      height: 77rpx;
      background: #d8d8d8;
      display: block;
      border-radius: 50%;
    }
  }

  .name {
    font-size: 27rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 38rpx;
    padding-left: 19rpx;
  }

  .sex {
    margin-left: 12rpx;
    .img {
      width: 48rpx;
      height: 32rpx;
    }
  }
}

.img-one {
  position: absolute;
  top: -16rpx;
  left: -53rpx;
  width: 106rpx;
  height: 106rpx;
  margin-left: 50%;
}
.index-warp {
  background-color: #ffffff;
  padding-top: 31rpx;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 29rpx 23rpx;
}
.no-data {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  image {
    width: 346rpx;
    height: 346rpx;
  }
  .empty-text {
    margin-top: 19rpx;
    font-size: 25rpx;
    font-weight: 400;
    color: #999999;
  }
}
.ul {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.info {
  padding: 0 19rpx;
  .flex {
    display: flex;
    margin-top: 8rpx;
    justify-content: space-between;
    align-items: center;
  }

  .info-left {
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .date {
    height: 27rpx;
    font-size: 19rpx;
    font-weight: 400;
    color: #666666;
    line-height: 27rpx;
  }

  .b-right {
    font-size: 19rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
}
.li-item {
  width: 342rpx;
  height: 384rpx;
  background: #ffffff;
  box-shadow: 0px 0px 15rpx 0px rgba(47, 53, 77, 0.05);
  border-radius: 15rpx;
  overflow: hidden;
  margin-top: 19rpx;
  .title {
    font-size: 27rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 38rpx;
    margin-top: 19rpx;
  }
}
.top-img {
  width: 100%;
  height: 260rpx;
  position: relative;
  overflow: hidden;
  .badge-name {
    position: absolute;
    bottom: 12rpx;
    right: 12rpx;
    width: 50rpx;
    height: 25rpx;
    // background: rgba(255, 255, 255, .7);
    border-radius: 4rpx;
    font-size: 17rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 400;
    // color: #333333;
    line-height: 25rpx;
    text-align: center;

    background: rgba(0, 0, 0, 0.5);
    opacity: 0.7;

    color: rgba(255, 255, 255, 0.8);
  }

  .left-bottom {
    left: 12rpx;
    width: 70rpx;
  }

  .img {
    width: 100%;
    height: 100%;
    border-radius: 15rpx;
    display: block;
  }
}
.bom {
  border-top: 1rpx solid #f5f5f5;
  height: 68rpx;
  padding: 0 17rpx 0 19rpx;
  .b-right {
    font-size: 19rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
}
.price-tag {
  width: 62rpx;
  // height: 31rpx;
  padding: 2rpx 0rpx;
  background: rgba(20, 208, 180, 0.1);
  border-radius: 8rpx;
  border: 1rpx solid #14d0b4;
  font-size: 19rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #14d0b4;
  // line-height: 29rpx;
  // text-align: center;
  margin-right: 8rpx;
  &.pay {
    border: 1rpx solid #f4333c;
    color: #f4333c;
    background: rgba(244, 51, 60, 0.1);
  }
}
.tag {
  min-width: 77rpx;
  // height: 31rpx;
  border-radius: 8rpx;
  border: 2rpx solid #333333;
  font-size: 19rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rpx 4rpx;
  .img {
    width: 16rpx;
    height: 16rpx;
    margin-right: 8rpx;
  }
}

.banner {
  width: 342rpx;
  height: 385rpx;
  //   background: #ffffff;
  border-radius: 15rpx;
  margin-top: 19rpx;

  .advertising-banner {
    width: 342rpx;
    height: 385rpx;
  }
}

.page-scroll-view {
  /* height: 100vh; */
  overflow-y: scroll;
  position: relative;
}
</style>
