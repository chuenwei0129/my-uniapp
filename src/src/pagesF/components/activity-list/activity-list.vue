<template>
  <view class="list">
    <view class="ul">
      <view class="banner" v-if="bannerArr && bannerArr.length">
        <advertising-banner
          class="advertising-banner"
          v-if="bannerArr && bannerArr.length"
          :info="bannerArr"
        >
        </advertising-banner>
      </view>
      <view
        class="li-item"
        v-for="item in listArr"
        :key="item.id"
        @click="goDetail(item)"
      >
        <view class="top-img">
          <image class="img" :src="item.coverUrl" mode="widthFix"></image>
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
              <view class="date">{{ dateTime(item.startTimestamp) }}</view>
            </view>

            <view class="b-right">{{ showAddress(item) }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from "dayjs";
import { mapState } from "vuex";
import { action_report } from "@/utils/track";
import advertisingBanner from "../advertising-banner/advertising-banner.vue";
const module_name = "activity";
export default {
  name: "activity-list",
  props: {
    listArr: {
      type: Array,
    },
    bannerArr: {
      type: Array,
      default: [],
    },
    enterType: {
      type: String,
    },
    cityCode: {
      type: String,
    },
  },
  components: {
    advertisingBanner,
  },
  data() {
    return {
      weekList: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
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
    isOriginator(item) {
      const { userId } = uni.getStorageSync("storage_info");
      if (item.signUpUsers[0].userId == userId) {
        return true;
      }
      return false;
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
      // if(!this.userInfo.token) {
      // 	uni.navigateTo({
      // 	  url: "/pagesD/login/index",
      // 	});
      // 	return;
      // }
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
      // else if(activityStatus == 'CANCELED'){
      // 	return "已取消"
      // }else if(activityStatus == 'UP_SHELF'){
      // 	return "已报名"
      // }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
