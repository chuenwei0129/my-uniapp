<template>
  <view>
    <view class="message-bg">
      <view class="message-status-bar" />

      <view class="message-head">
        <view class="message-head-icon" @click="back">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/backarrow.png"
          />
        </view>
        <view class="message-head-text">养宠提醒</view>

        <view class="message-head-more-icon" @click="handleGoPetCalendar(1)">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/peiInfo/ic_pet_notice_main.png"
          />
        </view>
      </view>

      <view class="message-no-data" v-if="isShowEmpty">
        <NoData
          noDataText="暂无养宠提醒"
          clickDataText="去设置提醒"
          @func="handleGoPetCalendar(2)"
          img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
        />
      </view>

      <view class="message-list-bg" v-if="messages.length > 0">
        <u-list
          @scrolltolower="scrolltolower"
          @scrolltoupper="scrolltoupper"
          :height="listHeight"
          @scroll="handleScroll"
          v-if="messages.length !== 0 && isShowUList"
        >
          <view v-show="isUpper">
            <u-loading-icon textSize="18" v-if="isUpper"></u-loading-icon>
          </view>

          <u-list-item v-for="(item, index) in messages" :key="item.id">
            <MessageCard :key="item.id" :message="item" />
          </u-list-item>
        </u-list>
      </view>
    </view>

    <u-toast ref="uToast" />
  </view>
</template>

<script>
import MessageCard from "@/pagesE/petNoticeMessage/messageCard/index.vue";
import {
  GET_PET_NOTICE_MESSAGES,
  PET_ALL_MESSAGE_READED,
} from "@/api/petMessage";
import NoData from "../components/noDataWithButton/index.vue";
import "../../utils/fn.scss";
import { display_report, action_report } from "@/utils/track";

const module_name = "remind";
export default {
  data() {
    return {
      pageScrollState: false,
      statusBarHeight: "0rpx",
      listHeight: 0, //问诊单列表高度
      isLock: false, // 是否正在上来加载
      isCompleted: false, // 是否数据加载完毕
      isUpper: false, // 是否正在下来刷新
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },

      isShowEmpty: false,
      messages: [],
      isShowUList: true,
    };
  },

  components: {
    NoData,
    MessageCard,
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
    screenWidth() {
      return uni.getSystemInfoSync().screenWidth;
    },
  },

  mounted() {
    try {
      this.statusBarHeight = this.statusBarHeight =
        getApp().globalData.statusBarHeight + "px";
    } catch (e) {
      this.statusBarHeight = "100rpx";
    }

    if (this.statusBarHeight === null) {
      this.statusBarHeight = "100rpx";
    }

    const windowInfo = uni.getWindowInfo();

    // this.$dsBridge.call("statusBarHeight", "statusBarHeight");
    //
    // this.safeAreaTop = getApp().globalData.statusBarHeight + 5;
    // this.safeAreaBottom = windowInfo.safeAreaInsets.bottom + 49;
    //结束上一次监听
    // uni.$off();
    // //全局事件订阅，只要订阅了事件就可以收到值
    // uni.$on("changeTab", async (res) => {
    //   // this.isShowUList = false;
    //   this.messages = [];
    //   this.pageInfo = {
    //     pageNo: 1,
    //     pageSize: 10,
    //   };
    //   this.isLock = false;
    //   this.isCompleted = false;
    //   await this.getPetNoticeMessages();
    //   this.$nextTick(() => {
    //     // this.scrollTop = 1;
    //     // this.isShowUList = true;
    //   });
    // });
    uni.getSystemInfo({
      success: (res) => {
        this.listHeight = res.windowHeight - this.rpxToPx(180);
        // this.listHeight = res.windowHeight;
      },
    });

    this.scrolltoupper();

    const { userId } = uni.getStorageSync("storage_info");
    display_report({
      display_name: "remind_display",
      object_type: module_name,
      extend: {
        user_id: userId,
      },
    });

    PET_ALL_MESSAGE_READED("RAISING_PET", {});
  },

  onShow() {
    uni.getSystemInfo({
      success: (res) => {
        console.log("res ", res);
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
  },

  created() {},
  onReady() {
    // #ifdef H5
    this.$dsBridge.register("petNoticeMessage", this.scrolltoupper);
    // #endif
  },

  methods: {
    rpxToPx(rpx) {
      return (rpx / 750) * this.screenWidth;
    },
    handleScroll(e) {
      // if (e.detail.scrollTop >= 40) {
      //   this.pageScrollState = true;
      // }
      // if (e.detail.scrollTop < 40) {
      //   this.pageScrollState = false;
      //   uni.pageScrollTo({
      //     scrollTop: 0,
      //   });
      // }
    },

    handleGoPetCalendar(type) {
      // 跳转至原生的宠物信息日历页面
      this.$dsBridge.call("goToCalendar", {});

      const { userId } = uni.getStorageSync("storage_info");
      action_report({
        action_name:
          type === 1
            ? "remind_setremind_click"
            : "remind_nullpage_setremind_click",
        module_name: module_name,
        extend: {
          user_id: userId,
        },
      });
    },

    // 上拉加载更多
    scrolltolower() {
      console.log("到底");
      if (!this.isCompleted) {
        this.getPetNoticeMessages();
        this.isLock = true;
      }
    },

    back() {
      console.log("返回");
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      if (this.isNative) {
        this.$dsBridge.call("closeCurrentWebview", {});
      } else {
        // router.go(-1);
      }
      // #endif
    },

    // 下来刷新
    scrolltoupper() {
      console.log("scrolltoupper  开始");
      if (this.isLock || this.isUpper) {
        return;
      }
      this.isCanLoadMore = true;
      this.isUpper = true;
      // 下拉刷新的逻辑
      // this.resetPageData();
      this.pageInfo = {
        ...this.pageInfo,
        pageNo: 1,
      };
      this.getPetNoticeMessages();
      this.isLock = false;
      this.isCompleted = false;
    },

    async getPetNoticeMessages() {
      try {
        if (this.isLock || this.isCompleted) {
          //|| this.isCompleted
          return;
        }

        // const res = " [{\n" +
        //     "        \"id\": \"65d61be2b9ee0500017040fc\",\n" +
        //     "            \"messageType\": \"RAISING_PET\",\n" +
        //     "            \"messageCategory\": \"PETS_PLAN\",\n" +
        //     "            \"userId\": 302969838543806464,\n" +
        //     "            \"readFlag\": false,\n" +
        //     "            \"delFlag\": false,\n" +
        //     "            \"createTime\": \"2024-02-21 23:50:58\",\n" +
        //     "            \"updateTime\": \"2024-02-21 23:50:58\",\n" +
        //     "            \"messageBody\": {\n" +
        //     "          \"cycleType\": \"MONTH\",\n" +
        //     "              \"remindTime\": \"2024-02-22 00:00\",\n" +
        //     "              \"petId\": \"11337\",\n" +
        //     "              \"avatarUrl\": \"https://image.henhenchina.com/SERVICE/2024-01-22/5F85B19BC6CF8164FF402A89DDB56328.png\",\n" +
        //     "              \"remindId\": \"65addeaccb4c7e0001c076ea\",\n" +
        //     "              \"message\": \"“啦啦啦”到称个体重时间啦~\",\n" +
        //     "              \"cyclePeriod\": \"1\"\n" +
        //     "        },\n" +
        //     "        \"createTimeDisplay\": \"2024/02/21\"\n" +
        //     "      }, {\n" +
        //     "        \"id\": \"65d61be2b9ee0500017040fa\",\n" +
        //     "            \"messageType\": \"RAISING_PET\",\n" +
        //     "            \"messageCategory\": \"PETS_PLAN\",\n" +
        //     "            \"userId\": 302969838543806464,\n" +
        //     "            \"readFlag\": false,\n" +
        //     "            \"delFlag\": false,\n" +
        //     "            \"createTime\": \"2024-02-21 23:50:58\",\n" +
        //     "            \"updateTime\": \"2024-02-21 23:50:58\",\n" +
        //     "            \"messageBody\": {\n" +
        //     "          \"cycleType\": \"DAY\",\n" +
        //     "              \"remindTime\": \"2024-02-22 08:00\",\n" +
        //     "              \"petId\": \"11307\",\n" +
        //     "              \"avatarUrl\": \"https://image.henhenchina.com/SERVICE/2024-01-02/BF7A45FB1EC69ACEC4556D4A60C48FA6.png\",\n" +
        //     "              \"remindId\": \"6593752c1f7c0d00014d7459\",\n" +
        //     "              \"message\": \"“fujfj”到打扫消毒时间啦~\",\n" +
        //     "              \"cyclePeriod\": 3\n" +
        //     "        },\n" +
        //     "        \"createTimeDisplay\": \"2024/02/21\"\n" +
        //     "      }] ";
        // const sheets  = JSON.parse(res)

        console.log("GET_PET_NOTICE_MESSAGES  开始");
        const res = await GET_PET_NOTICE_MESSAGES({
          pageNo: this.pageInfo.pageNo,
          pageSize: this.pageInfo.pageSize,
          messageType: "RAISING_PET",
        });
        console.log("GET_PET_NOTICE_MESSAGES  结束");

        const data = res.data;

        const sheets = [...data.data];

        if (this.isUpper || this.pageInfo.pageNo === 1) {
          this.messages = sheets;
        } else {
          this.messages = [...this.messages, ...sheets];
        }

        this.isShowEmpty = this.messages.length === 0;

        console.log("sheets.length 长度  " + sheets.length);

        if (sheets.length > 0) {
          this.pageInfo.pageNo++;
        }

        if (sheets.length < this.pageInfo.pageSize) {
          console.log("isCanLoadMore 不能加载更多了");
          this.isCompleted = true;
        }

        this.isLock = false;
      } catch (e) {
        this.isLock = false;
      } finally {
        if (this.isUpper) {
          setTimeout(() => {
            this.isUpper = false;
          }, 200);
        }
      }
    },
  },

  watch: {},
};
</script>

<style scoped lang="scss">
.message-bg {
  display: flex;
  flex-direction: column;
  // width: 100%;
  // height: 100%;
  height: 100vh;
}

.message-status-bar {
  width: 100%;
  height: 96rpx;
}

.message-list-bg {
  height: calc(100vh - 184rpx);
  overflow-y: scroll;
  background-color: #f1f2ff;
}

.message-head {
  display: flex;
  width: 100%;
  // top: 0;
  // left: 0;
  // position: fixed;
  height: 88rpx;
  align-items: center;
  background-color: white;

  .message-head-text {
    width: 100%;
    text-align: center;
    font-weight: bold;
  }

  .message-head-icon {
    width: 60rpx;
    height: 44rpx;
    margin-left: 32rpx;
    margin-right: 32rpx;
  }

  .message-head-more-icon {
    width: 56rpx;
    height: 44rpx;
    margin-left: 32rpx;
    margin-right: 32rpx;
  }
}

.message-no-data {
  height: calc(100vh - 184rpx);
  width: 100%;
  padding-top: 450rpx;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  background-color: #f1f2ff;
}

.goods-list-content {
  display: flex;
  width: 100%;

  .even-goods-list {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .odd-goods-list {
    @extend .even-goods-list;
    margin-left: 8px;
  }

  .goods-item {
    margin-bottom: 32rpx;
  }
}
</style>
