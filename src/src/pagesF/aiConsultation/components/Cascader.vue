<template>
  <view class="outBox">
    <scroll-view
      :scroll-top="scrollTop"
      scroll-y="true"
      ref="firstScrollBox"
      class="firstBox"
    >
      <view
        @click="
          () => {
            firstActive(item, index + 1);
          }
        "
        v-for="(item, index) in symptomTree"
        :key="item.id"
        class="first-default"
        :class="{
          'fist-selected': index + 1 === firstSelectedIndex,
          'first-below-selected':
            index + 1 > 0 &&
            firstSelectedIndex > 0 &&
            index === firstSelectedIndex,
          'first-above-selected':
            index < symptomTree.length - 1 &&
            firstSelectedIndex !== null &&
            index + 2 === firstSelectedIndex,
        }"
        >{{ item.diseaseName }}</view
      >
      <view class="first-footer"></view>
    </scroll-view>
    <scroll-view scroll-y="true" class="secondBox">
      <view class="outSecondBox">
        <view
          @click="
            () => {
              secondActive(item, index + 1);
            }
          "
          v-for="(item, index) in secondSymptomTree"
          :key="item.id"
          class="second-default"
          :class="{
            'second-selected': index + 1 === secondSelectedIndex,
            'second-below-selected':
              index + 1 > 0 &&
              secondSelectedIndex > 0 &&
              index === secondSelectedIndex,
            'second-above-selected':
              index < secondSymptomTree.length - 1 &&
              secondSelectedIndex !== null &&
              index + 2 === secondSelectedIndex,
          }"
        >
          <view class="second-text-box">
            <span
              :class="[item.selected ? 'second-text-select' : 'second-text']"
              >{{ item.diseaseName }}</span
            >
            <image
              v-if="
                item.textDescription ||
                item.images.length > 0 ||
                item.videos.length > 0
              "
              @click.stop="
                () => {
                  symptomPopupInterpret(item);
                }
              "
              class="image"
              :src="[
                item.selected || index + 1 === secondSelectedIndex
                  ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/cexplainSelect.png'
                  : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/cexplain.png',
              ]"
              mode="scaleToFill"
            />
          </view>
          <!-- 二级选中 -->
          <view v-if="item.selected == true && item.child.length === 0">
            <u-icon name="checkmark" color="#FF5B05" size="15"></u-icon>
          </view>
          
          <view v-if="item.child && item.child.length > 0">
            <u-icon name="play-right-fill" :color="[item.selected? '#FF5B05' : '#aaaaaa']" size="11"></u-icon>
          </view>
        </view>
        <view class="second-footer"></view>
      </view>
    </scroll-view>
    <scroll-view scroll-y="true" class="thirdBox">
      <view
        @click="
          () => {
            thirdActive(item, index + 1);
          }
        "
        v-for="(item, index) in thirdSymptomTree"
        :key="item.id"
        class="third-default"
        :class="{
          'third-selected': index + 1 === thirdSelectedIndex,
          'third-below-selected':
            index + 1 > 0 &&
            thirdSelectedIndex > 0 &&
            index === thirdSelectedIndex,
          'third-above-selected':
            index < thirdSymptomTree.length - 1 &&
            thirdSelectedIndex !== null &&
            index + 2 === thirdSelectedIndex,
        }"
      >
        <view class="third-text-box">
          <span :class="[item.selected ? 'third-text-select' : 'third-text']">{{
            item.diseaseName
          }}</span>
          <image
            v-if="
              item.textDescription ||
              item.images.length > 0 ||
              item.videos.length > 0
            "
            @click.stop="
              () => {
                symptomPopupInterpret(item);
              }
            "
            class="image"
            :src="[
              item.selected
                  ? 'https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/cexplainSelect.png'
                  : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/cexplain.png',
            ]"
            mode="scaleToFill"
          />
        </view>
        <view v-if="item.selected == true">
          <u-icon name="checkmark" color="#FF5B05" size="15"></u-icon>
        </view>
      </view>

      <view class="third-footer"></view>
    </scroll-view>
    <SymptomPopup ref="SymptomPopup" />
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import SymptomPopup from "./SymptomPopup.vue";
import { action_report, display_report } from "@/utils/track";
export default {
  components: {
    SymptomPopup,
  },
  props: {
    show: {
      type: Boolean,
    },
    aid: {
      type: String,
    },
  },
  computed: {
    ...mapState({
      symptomData: (state) => state.symptomData,
      searchSymptom: (state) => state.searchSymptom,
      searchCommonSymptom: (state) => state.searchCommonSymptom,
      symptomTree: (state) => state.symptom,
    }),
  },
  data() {
    return {
      // symptomTree: require("./data.json").symptom,
      secondSymptomTree: [],
      thirdSymptomTree: [],
      firstSelectedIndex: null,
      secondSelectedIndex: null,
      thirdSelectedIndex: null,
      // symptomShow: false,
      scrollTop: 0,
      tier: "", //层级-图表显示
    };
  },
  methods: {
    ...mapMutations(["addSymptomData", "deleteSymptomData"]),
    //外部选中
    selectSymptom() {
      if (this.firstSelectedIndex == null) {
        this.firstActive(this.symptomTree[0], 1);
      }
    },
    // 一级症状选中
    firstActive(item, index) {
      console.log(item, index, 11223344);
      action_report({
        action_name: "Intelligentconsultation_FirstLevelSymptom_bytype_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      console.log(index, item.diseaseName, 9999);
      this.firstSelectedIndex = index;
      this.tier = item.diseaseName;
      this.secondSymptomTree = [];
      this.$nextTick(() => {
        let newArryShow = JSON.parse(JSON.stringify(item.child));
        newArryShow.forEach((showItem) => {
          showItem.selected = false;
        });
        // 判断-选中
        newArryShow.forEach((showItem) => {
          this.symptomData.forEach((sendItem) => {
            if (showItem.diseaseName === sendItem.diseaseName) {
              showItem.selected = true;
            }
            // 二级菜单选中
            if(showItem.diseaseName === sendItem.secondDiseaseName) {
              showItem.selected = true;
            }
          });
        });
        this.secondSymptomTree = newArryShow;
      });
      this.thirdSymptomTree = [];
      this.secondSelectedIndex = null;
    },
    // 二级症状选择
    secondActive(item, index) {
      console.log(item, "item23423");
      this.symptomData.length;
      // 判断-选中-赋值
      if (item.child.length == 0) {
        // 选中
        if (this.secondSymptomTree[index - 1].selected == true) {
          this.secondSymptomTree[index - 1].selected = false;
          //删除显示的数据
          this.symptomData.forEach((value, index) => {
            if (item.diseaseName == value.diseaseName) {
              this.deleteSymptomData(index);
            }
          });
        } else {
          if (this.symptomData.length > 49) {
            this.$refs.uToast.show({
              type: "default",
              title: "默认主题",
              message: "已选症状数达到上限，请删除后重选",
            });
            return;
          }
          this.secondSymptomTree[index - 1].selected = true;
          this.secondSymptomTree[index - 1].tier = this.tier;
          if (this.tier == "常见") {
            this.searchSymptom.forEach((item) => {
              if (
                item.diseaseName ==
                this.secondSymptomTree[index - 1].diseaseName
              ) {
                this.secondSymptomTree[index - 1].secondTier = item.tier;
              }
            });
          } else {
            this.searchCommonSymptom.forEach((vlaue) => {
              if (
                vlaue.diseaseName ==
                this.secondSymptomTree[index - 1].diseaseName
              ) {
                console.log(vlaue, "vlaue");
                this.secondSymptomTree[index - 1].secondTier = vlaue.tier;
              }
            });
          }
          // 添加数据
          console.log(this.secondSymptomTree[index - 1], 999);
          this.addSymptomData(this.secondSymptomTree[index - 1]);
        }
      } else {
        // 赋值
        this.thirdSymptomTree = [];
        this.thirdSelectedIndex = null;
        this.secondSelectedIndex = index;
        this.$nextTick(() => {
          let newArryShow = JSON.parse(JSON.stringify(item.child));
          newArryShow.forEach((showItem) => {
            showItem.selected = false;
            showItem.secondDiseaseName = item.diseaseName
          });
          // 判断-赋值-选中
          newArryShow.forEach((showItem) => {
            this.symptomData.forEach((sendItem) => {
              if (showItem.diseaseName === sendItem.diseaseName) {
                showItem.selected = true;
              }
            });
          });
          this.thirdSymptomTree = newArryShow;
        });
      }
    },
    // 三级症状选中
    thirdActive(item, index) {
      // 选中
      if (this.thirdSymptomTree[index - 1].selected == true) {
        this.thirdSymptomTree[index - 1].selected = false;
        //删除显示的数据
        this.symptomData.map((value, index) => {
          if (item.diseaseName == value.diseaseName) {
            this.deleteSymptomData(index);
          }
        });
      } else {
        if (this.symptomData.length > 49) {
          this.$refs.uToast.show({
            type: "default",
            title: "默认主题",
            message: "已选症状数达到上限，请删除后重选",
          });
          return;
        }
        this.thirdSymptomTree[index - 1].selected = true;
        this.thirdSymptomTree[index - 1].tier = this.tier;
        if (this.tier == "常见") {
          this.searchSymptom.forEach((item) => {
            if (
              item.diseaseName == this.thirdSymptomTree[index - 1].diseaseName
            ) {
              this.thirdSymptomTree[index - 1].secondTier = item.tier;
            }
          });
        } else {
          this.searchCommonSymptom.forEach((vlaue) => {
            if (
              vlaue.diseaseName == this.thirdSymptomTree[index - 1].diseaseName
            ) {
              this.thirdSymptomTree[index - 1].secondTier = vlaue.tier;
            }
          });
        }
        // 添加数据
        this.addSymptomData(this.thirdSymptomTree[index - 1]);
      }
        const parentItem = this.findParentByChildId(item.diseaseName)
        const status = this.thirdSymptomTree.some(child => child.selected) // 第三级别是否有选中的
        if(parentItem) {
          const index = this.secondSymptomTree.findIndex(item => item.diseaseName === parentItem.diseaseName)
          if(index > -1 ) {
            // 更新二级选中三角状态
            this.$set(this.secondSymptomTree[index], 'selected', status);
          }
        }
    },

    findParentByChildId(childId) {
        for (let i = 0; i < this.symptomTree.length; i++) {
          let parent = this.findChildParent(this.symptomTree[i], childId);
          if (parent) return parent;
        }
        return null;
      },
    findChildParent(parent, childId) {
        if (parent.child) {
          for (let j = 0; j < parent.child.length; j++) {
            if (parent.child[j].diseaseName === childId) return parent;
            if (parent.child[j].child) {
              let result = this.findChildParent(parent.child[j], childId);
              if (result) return result;
            }
          }
        }
        return null;
    },
    // 外部清空选中 一二三级状态
    clearCascader() {
      this.firstSelectedIndex = null;
      this.secondSelectedIndex = null;
      this.thirdSelectedIndex = null;
      this.secondSymptomTree = [];
      this.thirdSymptomTree = [];
    },
    // 外部删除症状
    deleteCascader(item) {
      if (this.secondSymptomTree.length != 0) {
        this.secondSymptomTree.forEach((value) => {
          if (value.diseaseName == item.diseaseName) {
            value.selected = false;
          }
        });
      }
      if (this.thirdSymptomTree.length != 0) {
        this.thirdSymptomTree.forEach((value) => {
          if (value.diseaseName == item.diseaseName) {
            value.selected = false;
          }
        });
      }
    },
    // 外部选中症状
    selectCascader(item) {
      console.log(item, "iitemmetk");
      this.symptomTree.map((value, index) => {
        if (value.diseaseName == item.name) {
          this.firstActive(value, index + 1);
          if (index > 6) {
            this.$nextTick(() => {
              this.scrollTop = 300;
            });
          }
        }
      });
    },
    // 关闭清空滚动距离
    closeCascader() {
      this.$nextTick(() => {
        this.scrollTop = 0;
      });
    },
    // 症状释译弹框
    symptomPopupInterpret(item) {
      action_report({
        action_name: "Intelligentconsultation_SymptomDefinition_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      this.$refs.SymptomPopup.formatData(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.outBox {
  display: flex;
  height: calc(100vh - 697rpx);
  // border-top: 10rpx solid #f8f8f8;
  background-color: #f8f8f8;
  // 第一级
  .firstBox {
    width: 160rpx;
    height: calc(100vh - 697rpx);
    overflow-y: auto;
    .first-default {
      width: 160rpx;
      height: 100rpx;
      line-height: 100rpx;
      padding-left: 30rpx;
      background-color: #eeeeee;
      color: #666666;
      font-size: 27rpx;
    }
    .fist-selected {
      background-color: #f8f8f8; /* 选中项高亮 */
      color: #ff5b05;
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
      height: 200rpx;
      width: 160rpx;
      background-color: #eeeeee;
    }
  }
  // 第二级
  .secondBox {
    width: 288rpx;
    height: calc(100vh - 697rpx);
    overflow-y: auto;
    background-color: #f8f8f8;
    .outSecondBox {
      background-color: #ffffff;
      .second-default {
        width: 288rpx;
        height: 100rpx;
        padding-left: 20rpx;
        background-color: #f8f8f8;
        color: #666666;
        font-size: 27rpx;
        display: flex;
        align-items: center; /* 垂直居中 */
      }
      .second-text-box {
        width: 220rpx;
        .second-text {
          vertical-align: middle;
        }
        .second-text-select {
          vertical-align: middle;
          color: #ff5b05;
          font-weight: bold;
        }
        .image {
          vertical-align: middle;
          width: 35rpx;
          height: 35rpx;
        }
      }

      .second-selected {
        background-color: #ffffff;
        color: #ff5b05;
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
        width: 288rpx;
        background-color: #f8f8f8;
      }
    }
  }
  // 第三级
  .thirdBox {
    width: 300rpx;
    height: calc(100vh - 697rpx);
    overflow-y: auto;
    background-color: #ffffff;
    .third-default {
      width: 300rpx;
      height: 100rpx;
      padding-left: 20rpx;
      background-color: #ffffff;
      color: #666666;
      font-size: 28rpx;
      display: flex;
      align-items: center; /* 垂直居中 */
    }
    .third-text-box {
      width: 235rpx;
      padding-right: 15rpx;
      .third-text {
        vertical-align: middle;
      }
      .third-text-select {
        vertical-align: middle;
        color: #ff5b05;
        font-weight: bold;
      }
      .image {
        vertical-align: middle;
        width: 35rpx;
        height: 35rpx;
      }
    }
    .third-selected {
      background-color: #ffffff;
      color: #ff5b05;
      font-weight: bold;
    }

    .third-above-selected {
      background-color: #ffffff;
      // border-radius: 0 0 12rpx 0;
    }

    .third-below-selected {
      background-color: #ffffff;
      // border-radius: 0 12rpx 0 0;
    }
    .third-footer {
      height: 200rpx;
      width: 300rpx;
      background-color: #ffffff;
    }
  }
}
</style>
