<template>
  <view class="content">
    <view class="frame">
      <view class="title">
        <view class="title-name">预约信息</view>
        <view class="title-extra">仅作参考，以门店时间为准</view>
      </view>
      <view class="line"></view>
      <view class="m-row">
        <view class="row-left">预约宠物</view>
        <view class="row-right">{{ detail.petName }}</view>
      </view>
      <view class="m-row">
        <view class="row-left">服务时间</view>
        <view class="row-right">{{ showTime }}</view>
      </view>
      <view class="m-row">
        <view class="row-left">服务人员</view>
        <view class="row-right">{{ detail.serviceName || "到店分配" }}</view>
      </view>
      <view class="m-row" v-if="detail.remark">
        <view class="row-left">备注</view>
        <view class="row-right">{{ detail.remark }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    detail: {
      type: Object,
    },
    showTime: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  onReady() {},
  onShow() {
    console.log("11 this.showTime ", this.showTime);
  },
  onLoad(options) {},
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";

.content {
  width: 100%;
  // height: 346rpx;

  background-color: #ffffff;
  margin-bottom: 19rpx;
  border-radius: 24rpx;

  .frame {
    width: 100%;
    height: 100%;
    padding: 0rpx 30rpx 20rpx;
  }

  .title {
    display: flex;
    justify-content: space-between;
    height: 105rpx;
    font-size: 29rpx;
    // font-weight: 500;
    color: #1f1f1f;
    line-height: 105rpx;
    display: flex;
    .title-name {
      font-size: 29rpx;
      font-weight: 500;
      color: #1f1f1f;
    }
    .title-extra {
      font-size: 23rpx;
      color: #999;
    }
  }

  .line {
    height: 2rpx;
    border: 1rpx solid #f8f8f8;
    margin-bottom: 11rpx;
  }

  .m-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 86rpx;

    .row-left {
      min-width: 160rpx;
      height: 38rpx;
      font-size: 29rpx;
      color: #1f1f1f;
    }

    .row-right {
      flex: auto;
      font-size: 29rpx;
      color: #666666;
      text-align: right;
      word-break: break-all;
    }
  }
}
</style>
