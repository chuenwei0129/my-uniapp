<template>
  <u-popup :show="show" round="30" @touchmove.stop.prevent>
    <view class="title">
      付费活动费用须知
      <view class="close-icon" @click="close">
        <view class="iconfont icon-close"></view>
      </view>
    </view>
    <view class="height">
      <view class="scroll">
        <div class="container">
          <p class="fz-14 mt-20">
            参与活动前请详细阅读活动规则及相关条款。凡参与本次活动，则视为同意活动规则及免责声明条款：
          </p>
          <p class="fz-14 lh-28">
            1.为保证活动的顺利进行，参与用户须确保已年满18周岁，具备完全民事行为能力。
          </p>
          <p class="fz-14 lh-28">
            2.宠胖胖依法运营活动，如遇不可抗力因素（不可抗力是指不能控制、不可预见或不能避免的事件）导致活动无法进行时或需要暂停举办的，包括但不限于（活动受恶劣天气影响需停办、活动受政府机关指令要求停办的），在法律允许的范围内，宠胖胖有权决定取消、终止、修改或暂停活动，宠胖胖及活动参与经销商无需为此承担赔偿责任或进行任何形式的补偿。
          </p>
          <p class="fz-14 lh-28">
            3.宠胖胖仅作为提供活动信息的第三方平台，不对活动举办方提供的活动品质提供任何担保，请用户保持审慎参加。
          </p>
          <p class="fz-14 lh-28">
            4.用户应按中国法律之规定，自行参加活动并保证自身安全与财产安全，活动期间若用户自愿进行消费的均由用户个人自行承担。
          </p>
          <p class="fz-14 lh-28">
            5.用户与线下各活动举办方因活动而产生的纠纷，与宠胖胖无关，宠胖胖不参与解决此类纠纷，也不承担任何责任。
          </p>
          <p class="fz-14 lh-28">
            6.用户因自身主观过错或恶意（如不按正常流程操作、填写信息不真实、不完整等类似情形）致使其不能领取活动奖品的，宠胖胖免除提供相应优惠奖项的责任。
          </p>
          <p class="fz-14 lh-28">
            7.由于第三方网站或第三人通过技术手段恶意攻击或篡改致使活动信息发生错误，宠胖胖不负任何法律或经济责任，活动信息以宠胖胖公布版本为准。
          </p>
          <p class="fz-14 lh-28">
            8.活动奖品的质量、售后服务、退货、换货，若活动中有提供奖品的，获奖者可以自行与该奖品的提供商联系解决，与宠胖胖无关。
          </p>
          <p class="fz-14 lh-28">
            9.任何人或任何网站以宠胖胖名义从事类似活动或恶意通知用户领奖，均为假冒，请用户谨慎辨别真假。如因相信前述非宠胖胖提供的活动信息而造成用户损失的，由用户自行承担，与宠胖胖无关。
          </p>
          <p class="fz-14 lh-28 G-Pb-5">10.支付服务</p>
          <p class="fz-14 lh-28 G-Pb-5">
            <span class="bold">1)</span>
            风险自担：宠胖胖是活动信息发布平台，平台上的所有活动均为活动主办方自行发布，您在报名参加活动和支付活动票款时，应认真阅读活动详情页的内容和全部说明，且您已完全了解可能存在的风险（包括但不限于活动主办方信息的真实性、活动内容的真实性、支付前后活动的变更、活动内容与您的预期不符等），并承担由此带来的一切损失和责任。宠胖胖代收款的行为并不视为宠胖胖收取了您的报名费（宠胖胖官方举办的活动除外），亦不视为宠胖胖须对平台上的活动做任何担保或承诺，您不应以任何原因要求宠胖胖退款或承担任何责任。
          </p>
          <p class="fz-14 lh-28 G-Pb-5">
            <span class="bold">2)</span>
            支付：为了方便用户完成交易，宠胖胖可能在不同产品、渠道支持不同的交易支付方式，并由相应的第三方服务商为您提供相应的支付服务。当您报名参加活动并点击确认付款后，您确认已充分理解并同意签署宝付网络科技（上海）有限公司《宝付支付个人用户服务协议》，即同意由宝付网络科技（上海）有限公司为您提供相关支付渠道的支付及/或订单账款管理服务，以解决您在不同支付渠道支付账款时您的账款问题，充分保障交易双方的资金安全。如您需索要发票，请联络活动主办方为您开具等额发票。
          </p>
          <p class="fz-14 lh-28 G-Pb-5">
            <span class="bold">3)</span>
            退款：当您报名付费活动后，如您需要取消参与活动，请在活动开始前12小时外进行取消，所付款项将在24小时内原路返还至付款账户；活动开始前的12小时内（含），不接受取消活动和退还款项。
          </p>
          <p class="fz-14 lh-28 G-Pb-5">
            <span class="bold">4)</span>
            争议：若购票用户和活动主办方用户之间就参加活动或购票产生了争议，且当争议的一方选择通过调解组织、行政部门、仲裁机构或法院解决交易纠纷时，宠胖胖将根据有关组织、部门的要求和《宠胖胖隐私政策》规定披露有关信息。
          </p>
          <p class="fz-14 lh-28">
            11.你在报名活动或使用本服务的过程中，需要提供一些必要的信息，例如：姓名、电话等，以便于后续为你提供相应的服务。未经你的同意，我方不会向平台管理及活动发起方以外的任何公司、组织和个人披露你的个人信息，但法律法规另有规定的除外。
          </p>
        </div>
      </view>
    </view>
    <view class="fixed">
      <view class="btn" :class="[count <= 0 ? 'active' : '']" @click="confirm">
        同意 <span v-if="count && count > 0"> （{{ count }}s）</span>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
    },
    type: {
      type: Boolean,
    },
    num: {
      type: Number,
    },
  },
  data() {
    return {
      count: 3,
      time: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.count && this.count == 3) {
        this.timer = setInterval(() => {
          this.count -= 1;
        }, 1000);
      }
    },
    confirm() {
      if (this.count <= 0) {
        this.$emit("ok", true);
      }
    },
    close() {
      this.$emit("close", true);
    },
  },
  watch: {
    count: {
      handler: function (val, oldval) {
        if (val <= 0) {
          clearInterval(this.timer);
        }
      },
      deep: true,
    },
    show: {
      handler: function (val) {
        this.count = this.num;
        if (val) {
          this.init();
        }
      },
      deep: true,
    },
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
.mt-20 {
  margin-top: 40rpx;
}
.lh-28 {
  line-height: 46rpx !important;
}
.container {
  padding: 0 5%;
  .fz-14 {
    line-height: 34rpx;
    padding-bottom: 40rpx;
    font-family: PingFangSC-Regular, PingFang SC, serif;
    color: #000000;
    font-size: 26rpx;
  }
}
</style>
