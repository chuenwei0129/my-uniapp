<template>
  <u-popup :show="true" round="30" @touchmove.stop.prevent>
    <view class="title">
      选择报名票种
      <view class="close-icon" @click="close">
        <view class="iconfont icon-close"></view>
      </view>
    </view>

    <view class="height">
      <view class="scroll">
        <view class="list">
          <view
            clase="list-item"
            v-for="(item, index) in ticketsData"
            :key="index"
          >
            <view class="list-item-base" @click="check(index)">
              <view
                :class="[
                  index == tagIndex
                    ? 'list-item-base-bg-check'
                    : 'list-item-base-bg',
                ]"
              >
                <view
                  class="list-item-base-bg-title"
                  :class="[
                    item.status && item.ticketNum - item.participate > 0
                      ? ''
                      : 'grey',
                    index == tagIndex ? 'check' : '',
                  ]"
                >
                  {{ item.ticketName }}
                </view>
                <view
                  class="list-item-base-bg-price"
                  :class="[
                    item.status && item.ticketNum - item.participate > 0
                      ? ''
                      : 'grey',
                    index == tagIndex ? 'check' : '',
                  ]"
                >
                  {{ "¥" + item.ticketPrice }}
                </view>
              </view>
              <view class="list-item-base-des">
                <view class="list-item-base-des-str">
                  {{
                    item.status
                      ? "已参与" +
                        item.participate +
                        "人， 剩余" +
                        (item.ticketNum - item.participate) +
                        "人"
                      : ""
                  }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="fixed">
      <view
        class="btn"
        :class="[isCheck ? 'active' : 'active']"
        @click="confirm"
      >
        下一步
      </view>
    </view>

    <!-- 温馨提示 ChooseTicketPrompt-->
    <ChooseTicketPrompt
      :show="chooseTicketPromptPop"
      :curOrder="curOrder"
      :atyOrder="atyOrder"
      @confirmHandle="confirmHandle"
      @close="closeChoosePromptPop"
    />
  </u-popup>
</template>

<script>
import ChooseTicketPrompt from "./ChooseTicketPrompt.vue";
import { getActivityAtyOrder } from "@/api/activityclube";
export default {
  components: {
    ChooseTicketPrompt,
  },
  props: {
    show: {
      type: Boolean,
    },
    type: {
      type: Boolean,
    },
    ticketsData: {
      type: Array,
    },
    activityId: {
      type: String,
    },
  },
  data() {
    return {
      isCheck: false,
      time: null,
      tagIndex: null,
      chooseTicketPromptPop: false,
      curOrder: null,
      atyOrder: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    async confirm() {
      if (this.isCheck) {
        this.curOrder = this.ticketsData[this.tagIndex];
        console.log("atyOrder: ", this.curOrder);
        const { data } = await getActivityAtyOrder({
          activityId: this.activityId,
        });
        if (data) {
          this.atyOrder = data;
          console.log("atyOrder-1:", this.atyOrder);
          if (
            this.atyOrder &&
            this.atyOrder.orderItemResponses &&
            this.atyOrder.orderItemResponses[0].skuId != this.curOrder.skuId
          ) {
            console.log("atyOrder0:", this.atyOrder);

            this.chooseTicketPromptPop = true;
          } else {
            console.log("atyOrder1:", this.tagIndex, this.atyOrder);
            this.chooseTicketPromptPop = false;
            this.$emit(
              "next",
              this.tagIndex,
              this.atyOrder ? this.atyOrder.orderNo : ""
            );
          }
        } else {
          console.log("atyOrder  1:", this.atyOrder);
          this.chooseTicketPromptPop = false;
          this.$emit("next", this.tagIndex);
        }
      } else {
        uni.showToast({
          icon: "none",
          title: "请选择票种",
        });
      }
    },
    close() {
      this.$emit("close", true);
    },
    check(index) {
      let curOrder = this.ticketsData[index];
      if (curOrder.status && curOrder.ticketNum - curOrder.participate > 0) {
        this.tagIndex = index;
        this.isCheck = true;
      }
    },

    // 关闭温馨提示弹窗
    closeChoosePromptPop() {
      this.chooseTicketPromptPop = false;
    },

    // 打开温馨提示弹窗
    async confirmHandle(orderNo) {
      console.log("orderNo ", orderNo);
      if (orderNo) {
        this.$emit("next", -1, orderNo);
      } else {
        this.$emit("next", this.tagIndex);
      }
    },
  },
  watch: {
    // count: {
    // 	handler: function(val, oldval) {
    // 		if (val <= 0) {
    // 		  clearInterval(this.timer);
    // 		}
    // 	},
    // 	deep: true
    // },
    // show: {
    // 	handler: function(val) {
    // 		this.count = this.num;
    // 		if (val) {
    // 		  this.init();
    // 		}
    // 	},
    // 	deep: true
    // }
  },
};
</script>

<style lang="scss" scoped>
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
  border-bottom: 1rpx solid #e6e6e6;
  position: relative;

  .close-icon {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    right: 28rpx;
    top: 26rpx;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;

    .iconfont {
      font-size: 48rpx;
    }
  }
}

.fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 138rpx;
  background: #ffffff;
  padding: 15rpx 38rpx 38rpx 38rpx;
}

.btn {
  background: #eeeeee;
  border-radius: 40rpx;
  height: 85rpx;
  font-size: 31rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #aaaaaa;
  line-height: 85rpx;
  text-align: center;

  &.active {
    background: #fee900;
    color: #1f1f1f;
  }
}

.height {
  height: 1056rpx;
}

.scroll {
  height: calc(1056rpx - 120rpx);
  overflow-y: scroll;
}

.list-item-base {
  display: flex;
  flex-direction: column;
  margin: 19rpx 30rpx;
}

.list-item-base-bg {
  height: 92rpx;
  width: auto;
  background: #f5f6f7;
  border-radius: 15rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-item-base-bg-check {
  width: auto;
  height: 92rpx;
  background: rgba(255, 131, 21, 0.1);
  border-radius: 15rpx;
  border: 4rpx solid #fee900;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-item-base-bg-title {
  width: auto;
  height: 42rpx;
  font-size: 31rpx;
  font-weight: 400;
  color: #000000;
  line-height: 42rpx;
  margin-left: 30rpx;

  &.grey {
    color: #aaaaaa;
  }

  &.check {
    font-weight: bold;
  }
}

.list-item-base-bg-price {
  width: auto;
  height: 42rpx;
  font-size: 31rpx;
  font-weight: 500;
  color: #000000;
  line-height: 42rpx;
  margin-right: 30rpx;
  font-weight: bold;

  &.grey {
    color: #aaaaaa;
  }

  &.check {
    font-weight: bold;
  }
}

.list-item-base-des {
}

.list-item-base-des-str {
  width: auto;
  height: 33rpx;
  font-size: 23rpx;
  font-weight: 400;
  color: #999999;
  line-height: 33rpx;
  text-align: right;
  margin-top: 7rpx;
}
</style>
