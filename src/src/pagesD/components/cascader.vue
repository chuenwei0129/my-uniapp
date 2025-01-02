<template>
  <view @touchmove.stop.prevent="stopPrevent">
    <u-popup
      :show="isShowPop"
      @close="close"
      round="38rpx"
      mode="bottom"
      @touchmove.stop.prevent
      :safeAreaInsetBottom="false"
    >
      <view class="content">
        <view class="top-nav">
          <view class="title">选择病史</view>
          <view class="nav-close" @click="close">
            <image :src="closeIcon" class="close"></image>
          </view>
        </view>
      </view>
      <view class="outBox">
        <scroll-view
          :scroll-top="scrollTop"
          scroll-y="true"
          ref="firstScrollBox"
          class="firstBox"
        >
          <view
            @click="firstActive(item, index)"
            v-for="(item, index) in symptomTree"
            :key="item.id"
            class="first-default"
            :class="{
              'first-selected': index === firstSelectedIndex,
              'first-below-selected':
                index + 1 > 0 &&
                firstSelectedIndex + 1 > 0 &&
                index - 1 === firstSelectedIndex,
              'first-above-selected':
                index < symptomTree.length - 1 &&
                firstSelectedIndex !== null &&
                index + 1 === firstSelectedIndex,
            }"
          >
            <view class="first-text">
              <view class="name">{{ item.name }}</view>
              <view v-if="item.secondSelectedNum > 0" class="first-index">{{
                item.secondSelectedNum
              }}</view>
            </view>
            <view v-if="index == firstSelectedIndex" class="line"></view>
          </view>
          <view class="first-footer"></view>
        </scroll-view>
        <!-- 二级  -->
        <scroll-view scroll-y="true" class="secondBox">
          <view class="outSecondBox">
            <view
              @click="secondActive(item, index)"
              v-for="(item, index) in secondSymptomTree"
              :key="item.id"
              class="second-default"
              :class="{ 'second-selected': item.selected }"
            >
              <!-- :class="{
              'second-selected': index + 1 === secondSelectedIndex,
              'second-below-selected':
                index + 1 > 0 &&
                secondSelectedIndex > 0 &&
                index === secondSelectedIndex,
              'second-above-selected':
                index < secondSymptomTree.length - 1 &&
                secondSelectedIndex !== null &&
                index + 2 === secondSelectedIndex,
            }" -->
              <view class="second-text-box">
                <span
                  :class="[
                    item.selected ? 'second-text-select' : 'second-text',
                  ]"
                  >{{ item.name }}</span
                >
              </view>
              <view v-if="item.selected == true" class="selected-icon">
                <u-icon name="checkmark" color="#FF5B05" size="15"></u-icon>
              </view>
            </view>
            <view class="second-footer"></view>
          </view>
        </scroll-view>
        <!-- 底部按钮 -->
        <view class="confirm-box">
          <view
            @click="confirm"
            :class="[
              selectedCascaderList.length > 0 ? 'activeConfirm' : 'confirm',
            ]"
            >确认选择
            <span v-if="selectedCascaderList.length > 0">
              ({{ selectedCascaderList.length }})</span
            >
          </view>
        </view>
        <u-toast ref="uToast"></u-toast>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { GET_PET_CASCADER_HISTORY } from "@/api/petinfo.js";
import { action_report } from "@/utils/track";

export default {
  components: {},
  props: {
    petType: {
      type: Number,
      default: 1, // 1：猫 2:狗
    },
    isShowPop: {
      type: Boolean,
      default: false,
    },
    petInfo: {
      type: Object,
      default: () => {},
    },
    healthyCode: {
      type: String,
    },
  },
  computed: {},
  watch: {
    isShowPop: {
      handler(val) {
        if (val) {
          console.log("----- 打开弹窗 ----", this.petInfo, this.petType);
          this.handleEchoData();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.getCascader();
    this.handleEchoData();
  },
  data() {
    return {
      // 关闭 icon
      closeIcon:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/block_close.png",
      // 二级病症数据
      secondSymptomTree: [],
      // 一级病症选中 index
      firstSelectedIndex: null,
      // 二级病症选中 index
      secondSelectedIndex: null,
      // 滚动条位置
      scrollTop: 0,
      // 所有病症数据
      symptomTree: [],
      // 选中的病症（二级）
      selectedCascaderList: [],
    };
  },
  methods: {
    stopPrevent() {
      return;
    },
    handleEchoData() {
      if (this.petInfo?.medicalHistoryItems?.length == 0) {
        this.initSymptomTree();
        // 未完善病史，默认展示第一项
        let medicalHistoryItems = this.petInfo?.medicalHistoryItems || [];
        if (
          (!medicalHistoryItems || medicalHistoryItems.length == 0) &&
          this.symptomTree?.length > 0
        ) {
          this.secondSymptomTree = this.symptomTree[0]?.subs;
          this.firstSelectedIndex = 0;
        }
      } else {
        this.symptomTree?.forEach((item, index) => {
          item?.subs?.forEach((subItem, subIndex) => {
            if (
              !!this.petInfo?.medicalHistoryItems &&
              this.petInfo?.medicalHistoryItems?.some(
                (value) => value.code == subItem.id
              )
            ) {
              subItem.selected = true;
              item.selected = true;
              this.selectedCascaderList.push(subItem);
              this.firstSelectedIndex = index;
              this.firstActive(item, index);
            }
          });
        });
      }

      this.symptomTree?.forEach((firstItem, index) => {
        if (this.selectedCascaderList?.length == 0) {
          this.$set(this.symptomTree[index], "secondSelectedNum", 0);
        } else {
          firstItem.subs?.forEach((subItem, subIndex) => {
            this.selectedCascaderList.forEach((secondItem) => {
              if (
                secondItem.id == 101 &&
                this.petType === 1 &&
                firstItem.id == 1
              ) {
                this.$set(this.symptomTree[index], "secondSelectedNum", 1);
              } else if (
                secondItem.id == 1701 &&
                this.petType === 2 &&
                firstItem.id == 17
              ) {
                this.$set(this.symptomTree[index], "secondSelectedNum", 1);
              } else if (subItem.id == secondItem.id) {
                let num =
                  firstItem.secondSelectedNum > 0
                    ? firstItem.secondSelectedNum + 1
                    : 1;
                firstItem.secondSelectedNum = num;
                this.$set(this.symptomTree[index], "secondSelectedNum", num);
              }
            });
          });
        }
      });
      console.log(
        "回显====》",
        this.selectedCascaderList,
        this.symptomTree[this.firstSelectedIndex]
      );
    },
    // 获取病史
    getCascader() {
      // type：宠物类型 1：猫 2:狗
      GET_PET_CASCADER_HISTORY({ type: this.petType || this.petInfo.petType })
        .then((res) => {
          this.symptomTree = res.data;
        })
        .catch((err) => {
          console.log("🚀 ~ GET_PET_CASCADER_HISTORY ~ err:", err);
        });
    },
    close() {
      this.$emit("update:isShowPop", false);
      this.$emit("close", false);
      setTimeout(() => {
        this.selectedCascaderList = [];
        this.initSymptomTree();
      });
    },
    // 一级症状选中
    firstActive(item, index) {
      this.firstSelectedIndex = index;
      let newArryShow = item?.subs && JSON.parse(JSON.stringify(item.subs));
      this.$nextTick(() => {
        newArryShow?.forEach((showItem) => {
          if (showItem.selected == true) showItem.selected = true;
          else showItem.selected = false;
        });
        this.secondSymptomTree = newArryShow;
      });
    },
    // 二级症状选择
    secondActive(item, index) {
      // 猫无病症
      const isNoneCatDisease =
        this.petType === 1 &&
        this.selectedCascaderList.some((v) => v.id == 101) &&
        item.id != 101;

      // 狗无病症
      const isNoneDogDisease =
        this.petType === 2 &&
        this.selectedCascaderList.some((v) => v.id == 1701) &&
        item.id != 1701;

      if (isNoneCatDisease || isNoneDogDisease) {
        uni.showToast({
          title: "您已选择无病症",
          icon: "none",
        });
        return;
      }
      if (this.secondSymptomTree[index].selected == true) {
        // 取消 选中
        this.secondSymptomTree[index].selected = false;

        // 删除选中
        const findindex = this.selectedCascaderList.findIndex(
          (value) => item.id == value.id
        );
        this.selectedCascaderList.splice(findindex, 1);
        this.symptomTree[this.firstSelectedIndex].subs[index].selected = false;
        this.$set(
          this.symptomTree[this.firstSelectedIndex].subs[index],
          "selected",
          false
        );
        this.$set(
          this.symptomTree[this.firstSelectedIndex],
          "secondSelectedNum",
          this.symptomTree[this.firstSelectedIndex].secondSelectedNum-- <= 0
            ? 0
            : this.symptomTree[this.firstSelectedIndex].secondSelectedNum
        );

        // 猫无病症
        const isNoneCatDisease2 =
          this.petType === 1 &&
          this.symptomTree[this.firstSelectedIndex].id == 1 &&
          item.id == 101;

        // 狗无病症
        const isNoneDogDisease2 =
          this.petType === 2 &&
          this.symptomTree[this.firstSelectedIndex].id == 17 &&
          item.id == 1701;
        if (isNoneCatDisease2 || isNoneDogDisease2) {
          this.selectedCascaderList = [];
        }
      } else {
        // 猫无病症
        const isNoneCatDisease3 =
          this.petType === 1 &&
          this.symptomTree[this.firstSelectedIndex].id == 1 &&
          item.id == 101;

        // 狗无病症
        const isNoneDogDisease3 =
          this.petType === 2 &&
          this.symptomTree[this.firstSelectedIndex].id == 17 &&
          item.id == 1701;
        // 选中
        // 无病史
        if (isNoneCatDisease3 || isNoneDogDisease3) {
          this.selectedCascaderList = [];
          this.selectedCascaderList.push(item);
          this.secondSymptomTree[index].selected = true;
          this.symptomTree?.map((tempItem, tempIndex) => {
            tempItem?.subs?.map((tempSubItem, subIndex) => {
              const isNoneCatDisease4 = this.petType === 1 && item.id == 101;

              // 狗无病症
              const isNoneDogDisease4 = this.petType === 2 && item.id == 1701;
              if (
                (isNoneCatDisease4 || isNoneDogDisease4) &&
                item.id == tempSubItem.id
              ) {
                tempSubItem.selected = true;
                this.$set(
                  this.symptomTree[tempIndex].subs[subIndex],
                  "selected",
                  true
                );
                this.secondSymptomTree[subIndex].selected = true;
              } else {
                tempSubItem.selected = false;

                this.$set(
                  this.symptomTree[tempIndex].subs[subIndex],
                  "selected",
                  false
                );
              }
            });
          });
          this.secondSymptomTree =
            this.symptomTree[this.firstSelectedIndex].subs;
        } else {
          // 选中-添加数据
          this.selectedCascaderList.push(item);
          this.secondSymptomTree[index].selected = true;
          // 添加数据
          this.symptomTree[this.firstSelectedIndex].subs[index].selected = true;
          this.$set(
            this.symptomTree[this.firstSelectedIndex].subs[index],
            "selected",
            true
          );
        }
      }
      let selectNum = 0;
      this.symptomTree[this.firstSelectedIndex].subs.forEach(
        (subitem, index) => {
          this.selectedCascaderList.forEach((selectItem) => {
            if (selectItem.id === subitem.id) {
              selectNum++;
            }
          });
        }
      );
      // 猫无病症
      const isNoneCatDisease3 =
        this.petType === 1 &&
        this.symptomTree[this.firstSelectedIndex].id == 1 &&
        item.id == 101;

      // 狗无病症
      const isNoneDogDisease3 =
        this.petType === 2 &&
        this.symptomTree[this.firstSelectedIndex].id == 17 &&
        item.id == 1701;
      if (isNoneCatDisease3 || isNoneDogDisease3) {
        this.symptomTree?.forEach((firstItem, index) => {
          if (this.selectedCascaderList?.length == 0) {
            this.$set(this.symptomTree[index], "secondSelectedNum", 0);
          } else if (this.petType === 1 && firstItem.id == 1) {
            this.$set(this.symptomTree[index], "secondSelectedNum", 1);
          } else if (this.petType === 2 && firstItem.id == 17) {
            this.$set(this.symptomTree[index], "secondSelectedNum", 1);
          } else {
            this.$set(this.symptomTree[index], "secondSelectedNum", 0);
          }
        });
      } else {
        this.symptomTree[this.firstSelectedIndex].secondSelectedNum = selectNum;
      }

      console.log(
        "选中项--------》",
        this.selectedCascaderList,
        this.symptomTree[this.firstSelectedIndex]
      );
    },
    // 病症选择结束-确认
    confirm() {
      if (this.selectedCascaderList?.length === 0) {
        uni.showToast({
          title: "请选择病史",
          icon: "none",
        });
        return;
      } else {
        if (this.healthyCode === "healthyCode") {
          action_report({
            action_name: "petfiles_add_illness",
            module_name: "Pet",
            extend: {
              // #ifdef H5
              user_id: this.$dsBridge.call("getUserId", "getUserId"),
              // #endif
              // #ifdef MP-WEIXIN
              user_id: uni.getStorageSync("storage_info").userId,
              // #endif
              pet_id: this.petInfo.petId,
            },
          });
        }
        console.log("提交病症===》", this.selectedCascaderList);
        // return;
        this.$emit("change", this.selectedCascaderList);
        this.selectedCascaderList = [];
        this.initSymptomTree();
      }
    },
    // 病症数据初始化
    initSymptomTree() {
      const tempArr = JSON.parse(JSON.stringify(this.symptomTree));
      tempArr?.forEach((tempItem) => {
        tempItem.selected = false;
        tempItem.secondSelectedNum = 0;
        tempItem?.subs?.forEach((tempSubItem) => {
          tempSubItem.selected = false;
        });
      });
      this.symptomTree = tempArr;
      this.secondSymptomTree = [];
      this.$set(this, "symptomTree", tempArr);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.content {
  width: 100%;
  background: #fff;
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  padding: 0 29rpx;
  box-sizing: border-box;
  overflow: hidden;
  .top-nav {
    width: 100%;
    height: 115rpx;
    border-radius: 38rpx 38rpx 0rpx 0rpx;
    @include flex();
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    font-style: normal;
    @include textfclaw(35rpx, #1f1f1f, center, 38rpx);
    position: relative;
    .nav-close {
      background-color: #ecedf1;
      border-radius: 50%;
      @include absNormal(50rpx, 50rpx, 50%, 0rpx, auto, auto);
      transform: translateY(-50%);
      @include flex();
      .close {
        width: 31rpx;
        height: 31rpx;
      }
    }
  }
}
.outBox {
  display: flex;
  width: 100vw;
  height: 1175rpx; // 885rpx;
  background-color: #f8f8f8;
  border-radius: 0rpx 0rpx 12rpx 0rpx;
  // 第一级
  .firstBox {
    width: 173rpx;
    height: calc(100% - 115rpx - 75rpx);
    overflow-y: auto;
    .first-default {
      width: 173rpx;
      height: 100rpx;
      // line-height: 100rpx;
      // padding-left: 30rpx;
      background-color: #eeeeee;
      color: #1f1f1f;
      font-size: 27rpx;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      @include flex();
      position: relative;
    }
    .first-index {
      min-width: 29rpx;
      height: 29rpx;
      background: #ff1515;
      border-radius: 15rpx;
      color: #fff;
      font-weight: 600;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -13rpx;
      right: -5rpx;
      font-size: 19rpx;
      // transform: translateX(50%);
    }
    .line {
      width: 6rpx;
      height: 31rpx;
      background: #fe2442;
      border-radius: 0rpx 2rpx 2rpx 0rpx;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .first-text {
      width: 150rpx;
      position: relative;
      .name {
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .first-selected {
      background-color: #f8f8f8 !important; /* 选中项高亮 */
      color: #fe2442;
      font-weight: bold;
    }

    .first-above-selected {
      background-color: #eeeeee;
      border-radius: 0 0 12rpx 0;
    }

    .first-below-selected {
      background-color: #eeeeee;
      border-radius: 0 12rpx 0 0;
    }
    .first-footer {
      height: 210rpx;
      width: 173rpx;
      background-color: #eeeeee;
    }
  }
  // 第二级
  .secondBox {
    width: calc(100vw - 173rpx);
    height: calc(100% - 115rpx - 75rpx);
    overflow-y: auto;
    background-color: #f8f8f8;
    .outSecondBox {
      // background-color: #ffffff;
      .second-default {
        width: calc(100vw - 173rpx);
        height: 100rpx;
        padding-left: 20rpx;
        background-color: #f8f8f8;
        color: #333;
        font-size: 27rpx;
        display: flex;
        align-items: center; /* 垂直居中 */
      }
      .second-text-box {
        width: calc(100% - 44rpx - 17rpx); //220rpx;
        .second-text {
          vertical-align: middle;
        }
        .second-text-select {
          vertical-align: middle;
          color: #fe2442;
          font-weight: bold;
        }
        .image {
          vertical-align: middle;
          width: 35rpx;
          height: 35rpx;
        }
        span {
          display: inline-block;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .second-selected {
        // background-color: #ffffff;
        color: #fe2442;
        font-weight: bold;
      }

      .second-above-selected {
        background-color: #f8f8f8;
        border-radius: 0 0 12rpx 0;
      }

      .second-below-selected {
        background-color: #f8f8f8;
        border-radius: 0 12rpx 0 0;
      }
      .second-footer {
        height: 200rpx;
        width: calc(100vw - 173rpx);
        background-color: #f8f8f8;
      }
    }
  }
}
.confirm-box {
  width: 750rpx;
  height: 185rpx;
  position: absolute;
  bottom: 0rpx;
  background-color: #ffffff;
  .confirm {
    width: 673rpx;
    height: 85rpx;
    line-height: 85rpx;
    text-align: center;
    background-color: #fee900;
    color: #1f1f1f;
    font-size: 32rpx;
    margin: 15rpx auto 0;
    border-radius: 40rpx;
    opacity: 0.6;
    font-weight: 500;
  }
  .activeConfirm {
    width: 673rpx;
    height: 85rpx;
    line-height: 85rpx;
    text-align: center;
    background-color: #fee900;
    color: #1f1f1f;
    font-size: 32rpx;
    margin: 17rpx auto 0;
    border-radius: 40rpx;
    font-weight: 500;
  }
}
</style>
