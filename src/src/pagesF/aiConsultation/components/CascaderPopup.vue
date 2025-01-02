<template>
  <view>
    <u-popup
      :round="20"
      safe-area-inset-bottom="false"
      :show="cascaderShow"
      mode="bottom"
    >
      <view class="popup-box">
        <view class="title-box">
          <view class="left"></view>
          <view class="title">
            <view class="title-in-box">
              <view class="title-left">选择症状</view>
              <view class="title-right">(可多选)</view>
            </view>
          </view>
          <view @click="close" class="right-img">
            <image
              class="image"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/closeCascader.png"
              mode="scaleToFill"
            />
          </view>
        </view>
        <view> <Cascader ref="Cascader" /></view>
        <view class="confirm-box">
          <view
            @click="confirm"
            :class="[symptomData.length > 0 ? 'activeConfirm' : 'confirm']"
            >确认选择
            <span v-if="symptomData.length > 0">
              ({{ symptomData.length }})</span
            >
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Cascader from "./Cascader.vue";
export default {
  components: {
    Cascader,
  },
  props: {
    // cascaderShow: {
    //   type: Boolean,
    // },
    aid: {
      type: String,
    },
  },
  created() {},
  data() {
    return {
      cascaderShow: false,
    };
  },
  computed: {
    ...mapState({
      symptomData: (state) => state.symptomData,
    }),
  },
  methods: {
    ...mapMutations(["setLiuShow"]),
    close() {
      this.cascaderShow = false;
      this.$refs.Cascader.closeCascader();
      this.setLiuShow(false);
    },
    confirm() {
      if (this.symptomData.length > 0) {
        this.cascaderShow = false;
        this.setLiuShow(false);
      }
    },
    selectCascaderPopup(item) {
      this.cascaderShow = true;
      this.setLiuShow(true);
      console.log(item, "CascaderPopup");
      this.$nextTick(() => {
        this.$refs.Cascader.selectCascader(item);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "@/utils/fn.scss";
.popup-box {
  position: relative;
  // height: 1100rpx;
  height: 70vh;
  background: #ffffff;
  border-radius: 38rpx;
  .title-box {
    display: flex;
    margin: 30rpx 0 35rpx 0;
    .left {
      width: 75rpx;
      height: 52rpx;
    }
    .title {
      width: 600rpx;
      height: 52rpx;
      line-height: 52rpx;
      color: #1f1f1f;
      font-size: 32rpx;
      text-align: center;
      font-weight: bold;
      .title-in-box {
        display: flex;
        text-align: center;
        // background-color: pink;
        width: 270rpx;
        margin: 0 auto;
        .title-right {
          width: 135rpx;
          // background-color: blue;
          color: #aaa;
          font-weight: 500;
          font-size: 30rpx;
          margin-left: 5rpx;
        }
      }

      // span {
      //   color: #aaa;
      //   font-weight: 500;
      //   font-size: 30rpx;
      //   margin-left: 5rpx;
      // }
    }
    .right-img {
      width: 75rpx;
      height: 52rpx;
      .image {
        width: 52rpx;
        height: 52rpx;
      }
    }
  }
  .confirm-box {
    width: 750rpx;
    height: 110rpx;
    // height: 175rpx;
    position: absolute;
    bottom: 0rpx;
    background-color: #ffffff;
    .confirm {
      width: 700rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: #ffeea5;
      color: #1f1f1f;
      font-size: 32rpx;
      margin: 15rpx auto 0;
      border-radius: 44rpx;
      opacity: 0.6;
      font-weight: bold;
    }
    .activeConfirm {
      width: 700rpx;
      height: 88rpx;
      line-height: 88rpx;
      text-align: center;
      background-color: #ffeea5;
      color: #1f1f1f;
      font-size: 32rpx;
      margin: 15rpx auto 0;
      border-radius: 44rpx;
      font-weight: bold;
    }
  }
}
</style>
