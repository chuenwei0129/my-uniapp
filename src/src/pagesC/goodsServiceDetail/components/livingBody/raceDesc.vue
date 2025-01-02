<template>
  <view class="race-container">
    <!-- <view class="liner-bg" v-if="isHighValue || noVaccine"></view> -->
    <view class="race-desc" :class="{ marginTop: isHighValue || noVaccine }">
      <view class="content">
        <view class="header">
          <view class="title">品种介绍</view>
          <view class="check" v-if="showCheck" @click="handleClick">
            <text>更多</text>
            <image class="check-icon" :src="rightIcon_gray" />
          </view>
        </view>
        <view
          class="item"
          id="itemcontext"
          :class="showCheck ? 'line-clamp' : ''"
        >
          {{ speciesIntroduction || "" }}
          <!-- <br /> -->
          {{ (isHighValue ? feedingDesc : disposition) || "" }}
        </view>
      </view>
    </view>
    <PopRace
      :speciesIntroduction="speciesIntroduction"
      :disposition="isHighValue ? feedingDesc : disposition"
      :isOpen="toIsOpen"
      @close="handleClose"
    />
  </view>
</template>
<script>
import { action_report } from "@/utils/track";
import { mapState } from "vuex";
import PopRace from "./popRace.vue";
export default {
  components: { PopRace },
  name: "raceDesc",
  props: {
    livebodyData: {
      type: Object,
      default: () => {},
    },
    commodityType: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    isHighValue() {
      const speciesClassification =
        this.livebodyData?.liveSkuDTO?.speciesClassification;
      const alienPetType = this.livebodyData?.liveSkuDTO?.alienPetType;
      return (
        [214, 836, 460, 835].includes(speciesClassification) &&
        alienPetType == 1
      );
    },
    noVaccine() {
      const { liveDewormingRecordDTO, vaccinationList } =
        this.livebodyData?.liveSkuDTO;
      return !(liveDewormingRecordDTO.length > 0 || vaccinationList.length > 0);
    },
  },
  data() {
    return {
      toIsOpen: false,
      rightIcon_gray:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png",
      speciesIntroduction: "", // 品种介绍
      disposition: "", // 性格特点
      feedingDesc: "", // 饲养介绍
      showCheck: true,
    };
  },
  mounted() {
    this.speciesIntroduction =
      this.livebodyData?.liveSkuDTO?.speciesIntroduction;
    this.disposition = this.livebodyData?.liveSkuDTO?.disposition;
    this.feedingDesc = this.livebodyData?.liveSkuDTO?.feedingDesc;
    this.checkTextLines();
    setTimeout(() => {
      console.log("第二次调用");
      this.checkTextLines();
    }, 500);
  },
  methods: {
    checkTextLines() {
      // 获取 <div> 标签的节点信息
      if (this.speciesIntroduction || this.disposition || this.feedingDesc) {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("#itemcontext")
          .boundingClientRect((data) => {
            console.log(123132, data);

            // 获取文本内容的高度
            const height = data.height;
            // 假设行高为31rpx
            const lineHeight = 35;
            // 计算文本行数
            const lines = Math.ceil(height / lineHeight);
            console.log("判断文本行数是否达到了3行", height, lines);
            // 判断文本行数是否达到了2行
            if (lines >= 3) {
              console.log("文本达到了3行或以上");
              this.showCheck = true;
            } else {
              this.showCheck = false;
              console.log("文本没有达到3行");
            }
          })
          .exec();
      }
    },
    handleClick() {
      action_report({
        action_name: "LivepetDetailpage_varietyIntroduction",
        module_name: "LivepetDetailpage",
        extend: {
          user_id: this.userInfo.userId,
          commodity_id: this.livebodyData?.liveSkuDTO?.itemName,
        },
      });
      this.toIsOpen = true;
    },
    handleClose(bool) {
      this.toIsOpen = bool;
    },
  },
};
</script>
<style lang="scss" scoped>
.marginTop {
  margin-top: -10rpx !important; // -31rpx !important;
}
.race-container {
  // position: relative;
  // padding-top: 15rpx;
  .liner-bg {
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 100vw;
    height: 48rpx;
    background: linear-gradient(180deg, #ffffff 0%, #f7f8fc 100%);
  }
}
.race-desc {
  width: 100%;
  // padding: 0 15rpx;
  // margin-top: 19rpx;
  box-sizing: border-box;
  padding: 38rpx 29rpx;
  background: #fff;
  .content {
    // height: 131rpx;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 19rpx;
      .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 31rpx;
        color: #1f1f1f;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
      }
      .check {
        font-family: PingFangSC, PingFang SC;
        font-weight: 300;
        font-size: 25rpx;
        color: #666666;
        line-height: 35rpx;
        text-align: right;
        font-style: normal;
        display: flex;
        align-items: center;
        .check-icon {
          display: inline-block;
          width: 27rpx;
          height: 27rpx;
          margin-top: -1rpx;
        }
      }
    }
    .item {
      font-family: PingFangSC, PingFang SC;
      font-weight: 300;
      font-size: 25rpx;
      // height: 69rpx;
      color: #1f1f1f;
      line-height: 35rpx;
      overflow-wrap: break-word;
      word-break: break-all;
    }
  }
}
.line-clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>
