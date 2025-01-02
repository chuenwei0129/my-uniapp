<template>
  <view class="health-gist">
    <image
      class="doctorInfo"
      v-if="doctorInfo"
      mode="aspectFill"
      :src="doctorInfo"
    >
    </image>
    <view class="article">
      <view class="paragraph" v-for="(item, index) in keynotes" :key="index">
        <view class="title">{{ item.title }}</view>
        <view class="content">{{ item.content }}</view>
      </view>
      <view class="btom">
        <view class="icon"></view>
        <view class="txt">以上内容经过宠胖胖健康专家团队审核</view>
      </view>

      <view class="sjx-up"></view>
    </view>
  </view>
</template>
<script>
import { action_report, display_report } from "@/utils/track";
export default {
  components: {},
  props: {
    doctorInfo: {
      type: String,
      default: "",
    },
    keynotes: {
      type: Array,
      default: null,
    },
    agePhase: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    handleImg() {},
  },
  watch: {
    agePhase: {
      immediate: true,
      handler(newValue, oldValue) {
        display_report({
          display_name: "pet_page_agehealth_display",
          object_type: "petpage",
          extend: {
            age: this.agePhase,
          },
        });
      },
    },
  },
};
</script>

<style scoped lang="scss">
.health-gist {
}

.doctorInfo {
  width: 692rpx;
  height: 208rpx;
  background: #f5f6f7;
  border-radius: 23rpx;
  margin-bottom: 19rpx;
}

.article {
  width: 692rpx;
  background: #f5f6f7;
  border-radius: 15rpx;
  padding: 38rpx 19rpx 28rpx 19rpx;

  position: relative;

  .sjx-up {
    width: 31rpx;
    height: 15rpx;
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petRecords/sjx-up.png");
    background-size: cover;

    position: absolute;
    left: 77rpx;
    top: -15rpx;
  }

  .paragraph {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 38rpx;

    .title {
      font-family: PingFangSC, PingFang SC;
      font-weight: 600;
      font-size: 31rpx;
      color: #1f1f1f;
      line-height: 42rpx;
      text-align: left;
      font-style: normal;
      margin-bottom: 15rpx;
    }

    .content {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #666666;
      line-height: 44rpx;
      text-align: left;
      font-style: normal;
    }
  }
}

.btom {
  display: flex;
  justify-content: center;
  margin-top: -10rpx;

  .icon {
    width: 28rpx;
    height: 28rpx;
    background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petRecords/sh-right.png");
    background-size: cover;
    margin-right: 8rpx;
  }

  .txt {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 23rpx;
    color: #d49f66;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
  }
}
</style>
