<template>
  <scroll-view scroll-x class="race-scroll">
    <view class="race">
      <template v-for="(item, i) in list">
        <template v-if="raceValue(item.type)">
          <view class="line" v-if="i !== 0 && i < list.length"></view>
          <view class="race-part">
            <view class="header">{{ item.name }}</view>
            <view
              class="content"
              :style="{ whiteSpace: i !== 0 ? 'nowrap' : 'normal' }"
              >{{ raceValue(item.type) }}</view
            >
          </view>
          <view class="space"></view>
        </template>
      </template>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: "Race",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      list: [
        {
          type: "liveSpeciesName",
          name: "品种",
        },
        {
          type: "birthDay",
          name: "年龄",
        },
        {
          type: "shape",
          name: "形态体格",
        },
        {
          type: "gender",
          name: "性别",
        },
      ],
      shapeDesc: {
        0: "未知",
        1: "半毛",
        2: "全毛",
        11: "幼体",
        12: "亚成体",
        13: "成体",
      },
    };
  },
  mounted() {},
  methods: {
    raceValue(type) {
      const raceInfo = this.data?.liveSkuDTO;
      switch (type) {
        case "liveSpeciesName":
          return raceInfo?.liveSpeciesName?.length > 9
            ? raceInfo?.liveSpeciesName.slice(0, 9) + "..."
            : raceInfo?.liveSpeciesName;
        case "birthDay":
          return raceInfo?.petAge;
        case "gender":
          return raceInfo?.gender == "1"
            ? "弟弟"
            : raceInfo?.gender == "2"
            ? "妹妹"
            : raceInfo?.gender == "0"
            ? "未知"
            : "";
        case "shape":
          return this.shapeDesc[raceInfo?.shape];
        default:
          return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.race-scroll {
  min-width: 100%;
  min-height: 81rpx;
  margin-top: 27rpx;
  overflow-x: scroll;
}
.race {
  width: 100%;
  background-color: #fff;
  display: flex;
  .space {
    width: 96rpx;
  }
  .race-part {
    max-width: 262rpx;
    .header {
      max-width: 262rpx;
      font-size: 23rpx;
      color: #999999;
      line-height: 33rpx;
      overflow: hidden;
    }
    .content {
      max-width: 262rpx;
      font-weight: 500;
      font-size: 27rpx;
      color: #1f1f1f;
      line-height: 38rpx;
      margin-top: 5rpx;
    }
  }
  .line {
    width: 1rpx;
    min-height: 63rpx;
    margin-right: 31rpx;
    box-sizing: border-box;
    border-right: 1rpx solid #f2f2f2;
  }
}
</style>
