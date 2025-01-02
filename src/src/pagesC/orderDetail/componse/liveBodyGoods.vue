<template>
  <view class="card">
    <image
      v-if="liveDetailResponse.majorPicture"
      :src="liveDetailResponse.majorPicture"
      class="icon"
    ></image>
    <image v-else :src="productDefaultimg" class="icon"></image>

    <view class="content flx-col-bet-center">
      <view class="row flx-col">
        <!-- 1:猫类活体 50:犬类活体 -->
        <view v-if="[1, 50].includes(liveDetailResponse.speciesClassification)">
          <view class="goods-live-title">
            {{ orgingeItemName || "--" }}
          </view>
          <view class="goods-live-title-second">{{ liveTitleSecond }}</view>
        </view>

        <view v-else-if="highValueLivingOrg">
          <view class="goods-live-title">
            {{ orgingeItemName || "--" }}
          </view>
          <view class="goods-live-title-second">
            <text v-if="liveDetailResponse.gender"
              >{{ sexList[liveDetailResponse.gender] || "--" }}丨</text
            >
            <text>{{ liveDetailResponse.shapeName || "--" }}</text>
          </view>
        </view>
      </view>
      <view class="row fl-row-bet-start">
        <goodsPrice
          :salePrice="price"
          :saleSignFontSize="23"
          :salePriceIntegerFontSize="29"
          :sale-color="'#1F1F1F'"
        ></goodsPrice>
      </view>
    </view>
  </view>
</template>

<script>
import goodsPrice from "@/components/goodsPrice/index.vue";
export default {
  components: { goodsPrice },
  props: {
    liveDetailResponse: {
      type: Object,
      default: () => ({
        speciesClassification: "",
        gender: "",
        chipCode: "",
        years: "",
        months: "",
        days: "",
        numberOfVaccines: "",
        numberOfDeworming: "",
        itemName: "",
      }),
    },
    price: {
      type: String,
      default: "0",
    },
    orgingeItemName: {
      type: String,
      defalut: "",
    },
  },

  computed: {
    liveTitleSecond() {
      console.log(this.liveDetailResponse, "{{ liveDetailResponse }}");
      const {
        gender,
        years = 0,
        months = 0,
        days = 0,
        numberOfDeworming = 0,
        numberOfVaccines = 0,
      } = this.liveDetailResponse || {};
      let genderStr;
      if (gender) {
        genderStr = this.sexList[gender] + "丨";
      } else {
        genderStr = "";
      }
      const date = `${years ? years + "年" : ""}${months ? months + "月" : ""}${
        days ? days + "天丨" : ""
      }`;
      const needleStr = `疫苗${
        numberOfVaccines === null || numberOfVaccines === undefined
          ? ""
          : numberOfVaccines
      }针丨`;
      const frequencyStr = `驱虫${
        numberOfDeworming === null || numberOfDeworming === undefined
          ? ""
          : numberOfDeworming
      }次`;
      const joinStr = `${genderStr}${date.trim()}${needleStr}${frequencyStr}`;
      return joinStr;
    },
    outliersGreater() {
      const { speciesClassification = "", minSalePrice = 0 } =
        this.liveDetailResponse || {};

      // 检查 liveDetailResponse 是否为对象
      if (
        typeof this.liveDetailResponse !== "object" ||
        this.liveDetailResponse === null
      ) {
        console.error("liveDetailResponse is not an object");
        return false;
      }

      const classificationList = [1, 2];

      return !classificationList.includes(speciesClassification);
    },

    highValueLivingOrg() {
      const otherLiveBody = [836, 835, 460, 214];
      const { speciesClassification, alienPetType } =
        this.liveDetailResponse || {};
      return otherLiveBody.includes(speciesClassification) && alienPetType == 1;
    },
  },

  data() {
    return {
      productDefaultimg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/product_default.webp",
      sexList: {
        0: "未知",
        1: "弟弟",
        2: "妹妹",
      },
    };
  },
};
</script>

<style lang="scss">
.card {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  background-color: #ffffff;
  padding: 14rpx 0;
  .icon {
    width: 154rpx;
    height: 154rpx;
    background-color: #f7f8fc;
    border-radius: 9rpx;
    flex-shrink: 0;
  }

  .content {
    margin-left: 17rpx;
    display: flex;
    flex-direction: column;
    flex: 1;
    .row {
      flex-wrap: nowrap;
      .title {
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 显示省略号 */
        max-width: 410rpx;
        padding-bottom: 4rpx;
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
        flex: 1;
        display: flex;
        align-items: center;
        .goods-gift-flag {
          line-height: 33rpx;
          background: white;
          border-radius: 6rpx;
          border: 1rpx solid #ffcfd8;
          margin-right: 12rpx;
          font-size: 23rpx;
          color: #fe2442;
          padding-top: 2rpx;
          padding-left: 8rpx;
          padding-right: 4rpx;
        }
      }
      .des {
        font-size: 29rpx;
        font-weight: 400;
        color: #666666;
        max-width: 410rpx;
      }
      .price {
        font-size: 29rpx;
        font-weight: 400;
        color: #1f1f1f;
      }
      .num {
        font-size: 25rpx;
        font-weight: 400;
        color: #666666;
      }
      .goods-live-title {
        height: 37rpx;
        line-height: 37rpx;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
        font-weight: 400;
        font-size: 29rpx;
        color: #1f1f1f;
        text-align: left;
        font-style: normal;
      }
      .goods-live-title-second {
        font-weight: 400;
        font-size: 27rpx;
        color: #666666;
        line-height: 38rpx;
        text-align: left;
        font-style: normal;
        white-space: pre-wrap;
      }
    }
    .flx-col {
      display: flex;
      flex-direction: column;
    }
  }

  .flx-col-bet-center {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 3rpx;
    overflow: hidden;
  }

  .goods-bottom {
    height: 85rpx;
    background: #ffffff;
    border-radius: 42rpx;
    border: 2rpx solid rgba(254, 36, 66, 0.5);
    margin: 44rpx 28rpx;
  }
}
.reality {
  font-size: 21rpx;
  margin-right: 5rpx;
  line-height: 32rpx;
}
</style>
