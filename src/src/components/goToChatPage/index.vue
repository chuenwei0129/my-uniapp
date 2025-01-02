<template>
  <view class="wrapper-gt">
    <u-popup
      :show="show"
      mode="center"
      bgColor="transparent"
      @close="close"
      @touchmove.stop.prevent
    >
      <view class="tip-card">
        <view class="pet-icon"></view>
        <view class="content">
          {{ content }}
        </view>
        <view class="line"> </view>
        <view class="footer">
          <view class="cancel" @click="cancel">我知道了</view>
          <view class="line2"></view>
          <view class="confirm" @click="confirm">去问诊</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import { mapState, mapMutations } from "vuex";
import { postStepOutEndApi } from "@/pagesA/api/chatAi";
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      content: "您有一个正在进行中的问诊，请先结束本次问诊",
      confirmLock: false,
    };
  },
  onLoad(options) {
    this.id = options.id || "";
    this._getSheetsDetail();
  },
  computed: {
    ...mapState({
      serviceSheetsList: (state) => state.serviceSheetsList,
    }),
  },
  methods: {
    async postStepOutEnd(id) {
      const res = await postStepOutEndApi(id);
      console.log(res);
    },
    cancel() {
      this.$emit("update:show", false);
    },
    async confirm() {
      if (this.confirmLock) {
        return;
      }
      this.confirmLock = true;
      try {
        if (!this.serviceSheetsList.length) {
          uni.switchTab({ url: "/pages/index/index" });
          return;
        }
        this.$emit("update:show", false);
        const res = await GET_IN_SERVICE_LAST({});
        const {
          groupId,
          remainingTime,
          doctorAvatarUrl,
          doctorUserName,
          state,
          remainingWaitingTime,
          id,
          inquiryType,
          createTime,
        } = res.data;
        console.log("000000000000000000000000000000000000", res.data);
        let result = {
          groupId,
          remainingTime,
          remainingWaitingTime,
          doctorAvatarUrl,
          doctorUserName,
          sheetState: state,
          id,
          inquiryType,
          createTime,
        };
        this.confirmLock = false;
        this.postStepOutEnd(id);
        uni.navigateTo({
          url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
            result
          )}&fromOrigin=continue&inquiryType=${
            res.data.inquiryType
          }&sheetId=${id}`,
        });
      } catch (e) {
        this.confirmLock = false;
        console.error("handleGoChat", e);
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/utils/fn.scss";

.wrapper-gt {
  .modal ::v-deep .u-modal {
    .u-modal__content {
      text-align: center;
      font-size: 27rpx;
      font-weight: 400;
      color: #666666;
    }
  }
}
.tip-card {
  box-sizing: border-box;
  width: 577rpx;
  background: #ffffff;
  border-radius: 38rpx;
  backdrop-filter: blur(10px);
  padding: 0 38rpx;
  position: relative;
  .pet-icon {
    @include absNormal($w: 346rpx, $h: 192rpx, $top: -115rpx, $left: 50%);
    transform: translateX(-50%);
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/zhichong/index/pop-pet-icon.png"
    );
  }
  .content {
    padding: 77rpx 0;
    font-size: 27rpx;
    color: #666666;
    line-height: 38rpx;
    text-align: center;
  }
  .line {
    width: 500rpx;
    height: 0.5px;
    background-color: #e6e6e6;
  }
  .footer {
    display: flex;
    align-items: center;
    .cancel {
      flex: 1;
      font-size: 31rpx;
      color: #25252a;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 94rpx;
    }
    .line2 {
      width: 2rpx;
      height: 38rpx;
      background-color: #e6e6e6;
    }
    .confirm {
      flex: 1;
      height: 94rpx;
      font-weight: bold;
      font-size: 31rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #14d0b4;
    }
  }
}
</style>
