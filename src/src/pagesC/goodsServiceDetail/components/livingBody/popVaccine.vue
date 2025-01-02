<template>
  <root-portal>
    <u-popup
      v-if="isOpen"
      :show="isOpen"
      mode="bottom"
      bgColor="transparent"
      @touchmove.stop.prevent
      :safeAreaInsetBottom="false"
      :closeOnClickOverlay="true"
      :overlay="true"
      @close="close"
    >
      <view class="content">
        <view class="header">
          <text>疫苗驱虫</text>
          <view class="close-icon">
            <image class="icon" :src="close_icon" @click="close" />
          </view>
        </view>
        <view class="main">
          <scroll-view class="main-scroll" scroll-y>
            <template>
              <view
                class="main-item paddingNormal"
                v-for="(item, i) in liveVaccList"
                :key="i"
              >
                <view class="item-header">
                  <text>{{ "疫苗" }}</text>
                  <text class="line">·</text>
                  <text
                    >第{{
                      numberToChinese(item.vaccinationFrequency) ||
                      numberToChinese(i + 1)
                    }}针</text
                  >
                </view>
                <view class="item-desc"
                  >{{ item.vaccinesBrand + "" || "-" }}
                  {{ item.vaccinationTime || "-" }}</view
                >
              </view>
            </template>
            <template v-if="insideInfo && insideInfo.length > 0">
              <view
                class="main-item paddingNormal"
                v-for="(item, i) in insideInfo"
                :key="i"
              >
                <view class="item-header">
                  <text>{{ "体内驱虫" }}</text>
                  <text class="line">·</text>
                  <text
                    >第{{
                      numberToChinese(item.dewormingStepByStep) ||
                      numberToChinese(i + 1)
                    }}次</text
                  >
                </view>
                <view class="item-desc"
                  >{{ item.dewormingBrand + "" || "-" }}
                  {{ item.dewormingTime || "-" }}</view
                >
              </view>
            </template>
            <template v-if="externalInfo && externalInfo.length > 0">
              <view
                class="main-item paddingNormal"
                v-for="(item, i) in externalInfo"
                :key="i"
              >
                <view class="item-header">
                  <text>{{ "体外驱虫" }}</text>
                  <text class="line">·</text>
                  <text
                    >第{{
                      numberToChinese(item.dewormingStepByStep) ||
                      numberToChinese(i + 1)
                    }}次</text
                  >
                </view>
                <view class="item-desc"
                  >{{ item.dewormingBrand + "" || "-" }}
                  {{ item.dewormingTime || "-" }}</view
                >
              </view>
            </template>
          </scroll-view>
        </view>
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </u-popup>
  </root-portal>
</template>

<script>
export default {
  name: "popOfficial",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    liveVacc: {
      type: Array,
      default: () => [],
    },
    insideInfo: {
      type: Array,
      default: () => [],
    },
    externalInfo: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    vaccineList() {
      return this.liveVacc.concat(this.insideInfo, this.externalInfo);
    },
    liveVaccList() {
      return this.liveVacc;
    },
  },
  data() {
    return {
      close_icon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_clear.png",
    };
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    numberToChinese(num) {
      const chineseNum = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
      ];
      const chineseUnit = ["", "十", "百", "千", "万", "亿"];
      let numStr = num?.toString();
      let result = "";
      let unitIndex = 0;
      let zeroFlag = false;
      if (!numStr) return num || "";

      for (let i = numStr.length - 1; i >= 0; i--) {
        let digit = parseInt(numStr[i]);
        if (digit === 0) {
          if (!zeroFlag) {
            result = chineseNum[digit] + result;
            zeroFlag = true;
          }
        } else {
          result = chineseNum[digit] + chineseUnit[unitIndex] + result;
          zeroFlag = false;
        }
        unitIndex++;
      }

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100vw;
  // max-height: 1327rpx;
  max-height: 80vh;
  min-height: 808rpx;
  background: #f7f8fc;
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  .header {
    width: 100%;
    height: 115rpx;
    line-height: 115rpx;
    text-align: center;
    font-weight: 500;
    font-size: 35rpx;
    color: #1f1f1f;
    font-family: PingFangSC, PingFang SC;
    position: relative;
    .close-icon {
      width: 50rpx;
      height: 50rpx;
      background-color: #ecedf1;
      border-radius: 50%;
      // opacity: 0.5;
      position: absolute;
      top: 50%;
      right: 30rpx;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 31rpx;
        height: 31rpx;
        display: inline-block;
      }
    }
  }
  .main {
    padding: 0 29rpx;
    .main-item {
      width: 100%;
      background-color: #fff;
      border-radius: 23rpx;
      margin-bottom: 23rpx;
      .item-header {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 31rpx;
        color: #1f1f1f;
        display: flex;
        align-items: center;
        margin-bottom: 10rpx;
        box-sizing: border-box;
        .item-icon {
          width: 38rpx;
          height: 38rpx;
          display: inline-block;
          margin-right: 13rpx;
        }
        .line {
          margin: 0 5rpx;
        }
      }
      .item-desc {
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        font-size: 25rpx;
        color: #666;
      }
    }
    .paddingDesc {
      padding: 30rpx 29rpx 29rpx 25rpx;
      box-sizing: border-box;
    }
    .paddingNormal {
      padding: 29rpx;
    }
    .main-scroll {
      width: 100%;
      // max-height: calc(1327rpx - 115rpx - 20rpx);
      max-height: calc(80vh - 115rpx - 20rpx);
      min-height: 808rpx;
      overflow: hidden;
    }
  }
}
</style>
