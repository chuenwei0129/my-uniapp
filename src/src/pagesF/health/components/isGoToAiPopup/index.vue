<template>
  <view class="popup">
    <u-popup
      :show="show"
      @close="close"
      @open="open"
      mode="center"
      :round="10"
      :overlay="isOverlay"
      :customStyle="{
        width: '300px',
      }"
      :safeAreaInsetBottom="false"
    >
      <view class="content">
        <view class="popupContent">
          <view class="contentTitle"> 温馨提示 </view>
          <view class="contentDesc">
            {{ isGoToAiList.desc }}
          </view>
        </view>
        <CustomerService
          style="background-color: red; width: 20px; height: 20px"
        />
        <view class="buttonBox">
          <view
            class="canncel"
            v-if="isGoToAiList.buttons.length !== 2"
            @click="close"
            >取消</view
          >
          <view class="returnButton" v-for="item in isGoToAiList.buttons">
            <view class="buttonInfo" @click="skinToQuickOrCall(item)">
              <CustomerService style="margin-left: 15rpx" />
              {{ item === "1" ? "宠医义诊" : "联系客服" }}
            </view>
          </view>
        </view>
        <view class="line"></view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import { noticeMakeCallApi } from "@/pagesF/api/aiConsultation/index";
export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isGoToAiList: {
      type: Object,
      default: () => ({
        buttons: [],
      }),
    },
    userSelectedPetId: {
      type: String,
    },
  },
  computed: {},
  data() {
    return {
      callButton: false,
      quickButton: false,
      isOverlay: true,
    };
  },
  methods: {
    open() {
      // console.log('open');
    },
    close() {
      this.$emit("update:show", false);
      // console.log('close');
    },
    skinToQuickOrCall(type) {
      if (type === "2") {
        console.log("联系客服");

        this.noticeMakeCall();
        // #ifdef H5

        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/user/custom/service?`,
        });
        // #endif
        // #ifdef MP-WEIXIN
        this.$emit("skinToCust");
        // #endif
      } else {
        uni.navigateTo({
          url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=QUICK`,
        });
      }
      this.close();
    },
    async noticeMakeCall() {
      const res = await noticeMakeCallApi();
      console.log(res);
    },
  },
};
</script>
<style lang="scss">
.content {
  padding: 24px 20px 13px;
  .popupContent {
    .contentTitle {
      font-weight: 500;
      font-size: 16px;
      color: #1f1f1f;
      text-align: center;
    }
    .contentDesc {
      padding: 16px 10px 41px;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      border-bottom: 1px solid #e6e6e6;
    }
  }
  .buttonBox {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-top: 14px;
    .canncel {
      width: 140px;
      text-align: center;
    }
    .returnButton {
      width: 140px;
      text-align: center;
      padding-left: 20px;
    }
  }
  .line {
    height: 20px;
    width: 1px;
    background-color: #e6e6e6;
    margin-left: 130px;
    margin-top: -20px;
  }
}
</style>
