<template>
  <u-popup
    :show="isOpen"
    mode="bottom"
    @open="handleOpen"
    @close="close"
    :round="20"
    @touchmove.stop.prevent
  >
    <view class="petPop">
      <view class="header">
        <view class="cancel" @click="handleCancel">取消</view>
        <view class="title">请选择爱宠</view>
        <view class="confirm" @click="handleConfirm">确定</view>
      </view>
      <view class="petCard">
        <view class="petcontent">
          <scroll-view
            class="petList"
            :class="{
              autoList: petList.length <= 3,
            }"
            scroll-y
          >
            <view
              class="petItem"
              :class="{
                selectBorder: index === selectIndex,
              }"
              v-for="(item, index) in petList"
              :key="index"
              @click="
                () => {
                  handleSelectPet(index);
                }
              "
            >
              <view class="avator">
                <image
                  class="avators"
                  :src="item.avatarUrl"
                  mode="aspectFill"
                />
              </view>
              <view class="base">
                <view class="nameCard">
                  <text class="name">{{ item.nickName }}</text>
                  <text class="year">{{ item.guardTime }}</text>
                </view>
                <view class="pettype">
                  <text class="typeName">{{ item.categoryName }}</text>
                  <text class="sex">{{ item.sexName }}</text>
                  <text class="gang">I</text>
                  <text class="yu">{{
                    renderYuText(item.sterilizationStatus)
                  }}</text>
                </view>
              </view>
              <view class="select" v-show="index === selectIndex"></view>
            </view>
          </scroll-view>
        </view>
      </view>
      <view class="footers">
        <view class="new" @click="handleAddPetInfo">
          <view class="addIcon"></view>
          <view class="text">新建爱宠档案</view>
        </view>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    petList: {
      type: Array,
      default () {
        return [];
      },
    },
    selectPetId: {
      type: String,
      default: "",
    },
    inquiryType: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      checked: true,
      selectIndex: "-1",
      enterType: "",
    };
  },
  computed: {},
  onLoad (options) { },
  onReady () { },
  methods: {
    handleOpen () {
      const ind = this.petList.findIndex((p) => p.id == this.selectPetId);
      this.selectIndex = ind;
    },
    handleCancel () {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleConfirm () {
      const selected = this.petList[this.selectIndex];
      this.$emit("update:isOpen", false);
      this.$emit("confirm", selected);
    },
    handleSelectPet (index) {
      this.selectIndex = index;
    },
    close () {
      this.$emit("update:isOpen", false);
      this.$emit("close", false);
    },
    handleAddPetInfo () {
      if (this.inquiryType == "AI") {
        this.$emit("update:isOpen", false);
        this.$emit("close", false, "AI");
      } else {
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesD/petInfo/index?type=taskdesc&apptype=add&transparentTopBar=1`,
        });
        // #endif
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesD/petInfo/index?type=taskdesc&transparentTopBar=1`,
        });
        // #endif
      }
    },

    renderYuText (type) {
      const types = {
        0: "绝育未知",
        1: "未绝育",
        2: "已绝育",
      };
      return types[type];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
