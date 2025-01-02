<template>
  <view :class="['main_content']">
    <swiper
      :class="[
        'swiper-box',
        `level_${activeIndex + 1}_box`,
        isNative ? 'marginTop40' : '',
      ]"
      :autoplay="false"
      previous-margin="13.5px"
      next-margin="13.5px"
      :current="activeIndex"
      @change="handleSwipe"
    >
      <swiper-item
        v-for="(item, index) in levelList"
        :key="index"
        :class="[`swiperitem${1 + index}`]"
      >
        <view class="growthwrap">
          <view class="toppart">
            <image class="backbg" :src="`${imageUrl}${index + 1}.png`" />
            <p :class="['leveltip', `level_${index + 1}_normal`]">
              {{
                levelIndex == item.levelIndex
                  ? "当前等级"
                  : item.levelIndex > levelIndex
                  ? "尚未解锁"
                  : "已超越该等级"
              }}
            </p>
            <template
              v-if="
                levelIndex == item.levelIndex && levelIndex !== levelList.length
              "
            >
              <view class="growth" @click="toDetail">
                <template v-if="isMemberLevelLock == 0">
                  <view :class="['growthtext', `level_${index + 1}_normal`]"
                    >成长值
                    <span
                      :class="[`level_${index + 1}_deep`, 'avalibelscore']"
                      >{{ item.availableGrowthValue }}</span
                    >/{{ item.upGrowthValue
                    }}<span class="iconfont icon-outlineArrowRight"></span>
                  </view>
                  <view class="progress">
                    <view
                      class="subbar"
                      :style="{
                        width: `${item.levelProgressBarRatio * 100}rpx`,
                      }"
                    ></view>
                  </view>
                </template>
                <template v-else>
                  <view
                    :class="['upgradeBtn', `btn${item.levelIndex}`]"
                    @click.stop="toUpgrade"
                  >
                    <image
                      :style="{ top: `${top}rpx`, left: `${left}rpx` }"
                      class="slide-down"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member_center_lg.png"
                      alt=""
                    />
                    <text>升级到{{ upBtnTitle[item.levelIndex] }}</text>
                  </view>
                </template>
              </view>
            </template>
            <template v-else>
              <view
                v-if="
                  levelIndex == item.levelIndex &&
                  levelIndex == levelList.length
                "
                :class="['nexttips', `level_${activeIndex + 1}_normal`]"
                @click="toDetail"
              >
                成长值已达到{{ item.startGrowthValue }}
                <view class="iconfont icon-outlineArrowRight"></view>
              </view>
              <view
                v-if="levelIndex < item.levelIndex"
                :class="['nexttips', `level_${activeIndex + 1}_normal`]"
                @click="toDetail"
              >
                成长值需达到{{ item.startGrowthValue }}
                <view class="iconfont icon-outlineArrowRight"></view>
              </view>
            </template>
            <!-- <view class="upgradeBtn" v-if="levelIndex <= item.levelIndex && levelIndex !== levelList.length" @click="toUpgrade">去升级</view> -->
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script>
import { action_report } from "@/utils/track";
export default {
  name: "memberInfo",
  props: {
    levelList: {
      type: Array,
      default: [],
    },
    levelIndex: {
      type: Number,
    },
    isMemberLevelLock: {
      type: String,
      default: 0,
    },
  },
  data() {
    return {
      imageUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/member_level_bg",
      activeIndex: "",
      upBtnTitle: {
        1: "小金豚",
        2: "小钻豚",
        3: "黑金豚",
      },
      top: 0,
      left: -60,
      timer: null,
      timeOut: null,
    };
  },
  emits: ["changeIndex"],
  watch: {
    levelIndex: {
      immediate: false,
      handler: function (v) {
        if (!v) return;
        this.activeIndex = v - 1;
        this.$emit("changeIndex", this.activeIndex, true);
      },
    },
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  mounted() {
    this.starAnimation();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.timeOut);
    this.timer = null;
    this.timeOut = null;
  },
  methods: {
    starAnimation() {
      this.timer = setInterval(() => {
        this.left += 15;
        if (this.left >= 604) {
          clearInterval(this.timer);
          this.left = -60;
          this.timeOut = setTimeout(() => {
            this.starAnimation();
          }, 5000);
        }
      }, 16);
    },
    toUpgrade() {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "member_unlock_upgrade",
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: this.levelIndex,
        },
      });
      if (this.isNative) {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/user/info?isFromMemberCenter=1`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=1`,
        });
      }
    },
    toDetail() {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: "member_growth_click",
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: this.levelIndex,
        },
      });
      // const path = `/pagesE/growthDetail/index`
      //   if(this.isNative){
      //     this.$dsBridge.call("gotoPageThroughRoute", {
      //       page: `${window.location.origin}/crm-medical-h5/#${path}?transparentTopBar=1`,
      //     });
      //   }else{
      //     uni.navigateTo({ url: path });
      //   }
      uni.navigateTo({
        url: `/pagesE/growthDetail/index`,
      });
    },
    handleSwipe(e) {
      const { current } = e.detail;
      this.activeIndex = current;
      this.$emit("changeIndex", this.activeIndex);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./memberInfo.scss";
</style>
