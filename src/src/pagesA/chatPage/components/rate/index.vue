<template>
  <view class="page-wrapper">
    <view class="rate-bar border-shadow" v-if="sheetStateLocal !== 3">
      <view class="text"> 请对本次服务进行评价：</view>
      <view>
        <u-rate
          :count="5"
          v-model="rateValue"
          inactive-color="#EDEDED"
          active-color="#ffc901"
          size="24"
        ></u-rate>
      </view>
    </view>
    <view v-else class="rated">
      <view class="text">感谢您的使用和评价！</view>
      <!-- <view class="return" @click="handleGoSheet">继续问诊</view> -->
    </view>
    <u-popup :show="show" :round="19" @close="close" mode="bottom">
      <view class="rate-bar">
        <view class="text"> 请对本次服务进行评价：</view>
        <view>
          <u-rate
            :count="5"
            v-model="rateValue"
            inactive-color="#EDEDED"
            active-color="#ffc901"
            size="24"
          ></u-rate>
        </view>
      </view>
      <view class="rate-zone">
        <view class="tag-list">
          <view
            @click="
              () => {
                chooseTag(item.tagId);
              }
            "
            v-for="(item, index) in tagList"
            :key="index"
            :class="['tag', item.checked ? 'checked' : '']"
          >
            {{ item.tagName }}</view
          >
        </view>
      </view>

      <view class="desca">
        <u--textarea
          class="descText"
          v-model="content"
          placeholder="谈谈您本次对问诊医生的印象吧"
          maxlength="500"
          border="none"
          :showConfirmBar="false"
          :customStyle="{
            color: '#000000',
            backgroundColor: '#f5f5f5',
            borderRadius: '16rpx',
            padding: '6rpx',
          }"
        ></u--textarea>
      </view>
      <view class="button-zone">
        <view
          class="messageText"
          :class="{
            allowMessage,
          }"
          @click="handleSubmit"
        >
          提交
        </view>
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </u-popup>
  </view>
</template>

<script>
import { RATE_SHEET, GET_RATE_TAG } from "@/api/chat";
import { props } from "uview-ui/libs/mixin/mixin";
import { mapState, mapMutations } from "vuex";
import dayjs from 'dayjs'
export default {
  components: {},
  props: {
    groupId: {
      type: String,
    },
    sheetState: {
      type: Number,
    },
  },

  data() {
    return {
      time: "",
      rateValue: 0,
      show: false,
      tagList: [],
      content: "",
      sheetStateLocal: this.sheetState,
      allowMessage: {},
    };
  },
  computed: {
    ...mapState({
      serviceSheetsList: (state) => state.serviceSheetsList,
      lastSheetsMessage: (state) => state.lastSheetsMessage,
      sheetsList: (state) => state.sheetsList,
      userSelectedPetId: (state) => state.userSelectedPetId,
    }),
  },
  mounted() {},
  watch: {
    rateValue: {
      handler(newV, oldV) {
        this.show = true;
        this.time = new Date().valueOf();

        GET_RATE_TAG({
          bizType: "CONSULTATION",
          tagCategory: newV,
        }).then((res) => {
          this.tagList = res.data[newV];
        });
      },
    },
    sheetState: {
      handler(newV, oldV) {},
    },
  },
  methods: {
    async changeStar() {
      //唤起看板
      this.show = true;
      if (!this.rateValue) return;
      const res = await GET_RATE_TAG({
        bizType: "CONSULTATION",
        tagCategory: this.rateValue,
      });
      this.tagList = res.data[this.rateValue];
    },
    close() {
      const dd = new Date().valueOf();
      
      if (dd - this.time < 200) {
        return;
      }
      this.show = false;
    },
    chooseTag(targetId) {
      // console.log(this.tagList);
      this.tagList = this.tagList.map((i) => {
        if (i.tagId == targetId) {
          return {
            ...i,
            checked: !i.checked,
          };
        } else {
          return {
            ...i,
          };
        }
      });
    },
    async handleSubmit() {
      let tagIds = this.tagList.map((i) => {
        if (i.checked) {
          return i.tagId;
        }
      });
      const res = await RATE_SHEET({
        content: this.content,
        groupId: this.groupId,
        score: this.rateValue,
        tagIds,
      });
      //更新问诊单状态
      this.sheetStateLocal = 3;
      this.show = false;
    },
    // backToIndex() {
    //   uni.switchTab({ url: "/pages/index/index" });
    // },
    // 去问诊
    handleGoSheet() {
      if (this.userSelectedPetId) {
        uni.navigateTo({
          url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}`,
        });
      } else {
        return uni.showToast({
          title: "请先添加宠物",
          icon: "error",
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
