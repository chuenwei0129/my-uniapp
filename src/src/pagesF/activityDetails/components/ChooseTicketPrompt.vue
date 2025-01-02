<template>
  <u-popup class="popup" :show="show" mode="center" @touchmove.stop.prevent>
    <wiew class="popBg">
      <view class="title"> 温馨提示 </view>

      <Text class="desc"> 您有一个正在报名中的票种，请选择要报名的票种 </Text>

      <Text class="curName"> 当前票种 </Text>
      <view
        :class="[0 == tagIndex ? 'curItem-check' : 'curItem']"
        @click="check(0)"
      >
        <Text class="ticketTitle">
          {{ curOrder.ticketName }}
        </Text>
        <Text class="ticketPrice">
          {{ "¥" + curOrder.ticketPrice }}
        </Text>
      </view>

      <Text class="curName"> 报名中票种 </Text>
      <view
        :class="[1 == tagIndex ? 'curItem-check' : 'curItem']"
        @click="check(1)"
      >
        <Text class="ticketTitle">
          {{ atyOrder.orderItemResponses[0].itemDesc }}
        </Text>
        <Text class="ticketPrice">
          {{ "¥" + atyOrder.orderItemResponses[0].price }}
        </Text>
      </view>

      <view class="btn-group">
        <view class="modal-cancel" @click="close">
          <Text class="btnText"> 再想想 </Text>
        </view>
        <view class="modal-sure" @click="confirm">
          <Text> 确定 </Text>
        </view>
      </view>
    </wiew>
  </u-popup>
</template>

<script>
import { setCancelOrder } from "@/api/activityorder";
export default {
  props: {
    show: {
      type: Boolean,
    },
    type: {
      type: Boolean,
    },
    curOrder: {
      type: Object,
    },
    atyOrder: {
      type: Object,
    },
  },
  data() {
    return {
      isCheck: false,
      time: null,
      tagIndex: 0,
      curData: {
        title: "1人1宠物",
        price: "99",
      },
      oldData: {
        title: "2人2宠物",
        price: "99",
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    async confirm() {
      // if (this.isCheck) {
      // 	this.$emit("next", true);
      // } else {
      // 	uni.showToast({
      // 		icon: 'none',
      // 		title: '请选择票种'
      // 	})
      // }
      if (this.tagIndex == 0) {
        let res = await setCancelOrder(this.atyOrder.orderNo);
        console.log("res ", res);
        if (res.data == true) {
          this.$emit("confirmHandle", "");
        } else {
          uni.showToast({
            icon: "none",
            title: "取消订单异常",
          });
        }
      } else {
        this.$emit("confirmHandle", this.atyOrder.orderNo);
      }
    },
    close() {
      this.$emit("close", true);
    },
    check(index) {
      this.tagIndex = index;
      // this.isCheck = true
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.popup {
  width: 576rpx;
  height: 711rpx;
}

.popBg {
  width: 576rpx;
  height: 711rpx;
  display: flex;
  flex-direction: column;
}

.title {
  height: 115rpx;
  background: #ffffff;
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  font-size: 35rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  line-height: 38rpx;
  text-align: center;
  padding: 38rpx 0;
  // border-bottom: 1rpx solid #e6e6e6;
  position: relative;
}

.desc {
  width: 576rpx;
  height: 77rpx;
  font-size: 27rpx;
  font-weight: 400;
  color: #666666;
  line-height: 38rpx;
  text-align: center;
  max-width: 461rpx;
  margin: 0 auto;
}

.curName {
  width: 92rpx;
  height: 33rpx;
  font-size: 23rpx;
  font-weight: 400;
  color: #aaaaaa;
  line-height: 33rpx;
  margin-left: 38rpx;
  margin-top: 36rpx;
}

.curItem {
  width: 500rpx;
  height: 92rpx;
  background: #f5f6f7;
  border-radius: 15rpx;
  margin-left: 38rpx;
  margin-top: 5rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.curItem-check {
  width: 500rpx;
  height: 92rpx;
  background: #fffae6;
  border-radius: 15rpx;
  border: 4rpx solid #ffd41e;
  margin-left: 38rpx;
  margin-top: 5rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticketTitle {
  height: 42rpx;
  font-size: 31rpx;
  font-weight: 400;
  color: #000000;
  line-height: 42rpx;
  margin-left: 30rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 320rpx;
}

.ticketPrice {
  height: 42rpx;
  font-size: 31rpx;
  font-weight: 500;
  color: #000000;
  line-height: 42rpx;
  margin-right: 30rpx;
}

.btn-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 84rpx 38rpx 38rpx 38rpx;

  Text {
    height: 42rpx;
    font-size: 31rpx;
    font-weight: 500;
    color: #666666;
    line-height: 42rpx;
    margin: 0 auto;
    text-align: center;
  }

  .modal-cancel {
    width: 240rpx;
    height: 85rpx;
    border-radius: 42rpx;
    border: 2rpx solid #e6e6e6;
    display: flex;
    align-items: center;
  }

  .modal-sure {
    width: 240rpx;
    height: 85rpx;
    background: #ffc900;
    border-radius: 42rpx;
    display: flex;
    align-items: center;
  }
}
</style>
