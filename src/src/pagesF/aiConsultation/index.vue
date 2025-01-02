<template>
  <view>
    <view id="box" v-show="consultationLoading" class="desc">
      <!-- 导航栏 -->
      <NavBar
        :title="'智能问诊'"
        titleColor="#000"
        :showBackBtn="true"
        :whiteBack="false"
        @navBackClickHandle="handleReturn"
        :customback="true"
        navColor="#f7f8fc"
      />
      <!-- 宠物切换 -->
      <view class="pet-box">
        <scroll-view scroll-x="true" class="pet-scroll">
          <view
            :class="{
              petItemFirst: index === 0,
            }"
            class="pet-item"
            v-for="(item, index) in petList"
            :key="index"
          >
            <view
              :class="
                selectedPet.id == item.id ? 'active-img-name' : 'img-name'
              "
              @click="selectItem(item, 1)"
            >
              <view>
                <image
                  :src="item.avatarUrl"
                  mode="aspectFill"
                  style="
                    width: 36px;
                    height: 36px;
                    margin-top: 13rpx;
                    border-radius: 18px;
                    margin-right: 15rpx;
                  "
                />
              </view>
              <view class="item-name">
                {{ item.nickName.substring(0, 4) }}
              </view>
              <view
                class="iconfont icon-edit edit-icon"
                @click.stop="editClick(item, 1)"
              ></view>
            </view>
            <view class="icon-box">
              <view v-if="modeShow == 1">
                <view :class="[selectedPet.id == item.id ? 'lock' : '']"></view>
              </view>
              <view v-else>
                <view
                  :class="[selectedPet.id == item.id ? 'allRight' : '']"
                ></view>
              </view>
            </view>
          </view>
          <view style="margin-right: 30rpx" class="pet-item">
            <view class="pet-item-new" @click="addPetsMethod">
              <view>
                <image
                  mode="scaleToFill"
                  style="
                    height: 36px;
                    margin-top: 13rpx;
                    border-radius: 18px;
                  "
                />
              </view>
              <view style="color: #999999; font-size: 28rpx"> +添加宠物 </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 内容选择 -->
      <view class="external-box">
        <view class="in-box">
          <!-- 假搜索 -->
          <view v-if="modeShow != 1" class="fSearch">
            <view @click="goSearch" class="fSearch-left">
              <view class="left-img">
                <image
                  class="image"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/aisearch.png"
                  mode="scaleToFill"
                />
              </view>
              <view class="left-placeholder">搜索症状</view>
            </view>
            <view class="fSearch-right">
              <image
                v-if="modeShow == 2 || modeShow == 4"
                @click="goSwitch(3)"
                class="image"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/tabulation.png"
                mode="scaleToFill"
              />
              <image
                v-if="modeShow == 3"
                @click="goSwitch(2)"
                class="image"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/chart.png"
                mode="scaleToFill"
              />
            </view>
          </view>
          <!-- 搜索模式 -->
          <view v-if="modeShow == 1"
            ><Search :saveModeShow="saveModeShow" @goSwitch="goSwitch"
          /></view>
          <!-- 图表模式 -->
          <scroll-view scroll-y="true" class="scrollBox" v-show="modeShow == 2">
            <!-- 猫 -->
            <view v-if="petCategoryIdShow == 1">
              <Cat />
            </view>
            <!-- 狗 -->
            <view v-if="petCategoryIdShow == 50">
              <Dog />
            </view>
          </scroll-view>
          <!-- 级联列表模式 -->
          <view v-show="modeShow == 3">
            <CascaderPage ref="CascaderPage"
          /></view>
          <!-- 异宠模式 -->
          <view v-show="modeShow == 4">
            <AlienPet :selectedPet="selectedPet"
          /></view>
        </view>
      </view>
      <!-- 显示兼容app -->
      <view v-show="liuShow == false">
        <!-- 选中显示 -->
        <view v-if="symptomData.length != 0">
          <scroll-view
            scroll-y="true"
            v-if="modeShow != 1 && modeShow != 4"
            class="select-box"
          >
            <view class="in-box">
              <view class="first-item">已选({{ symptomData.length }}个)</view>
              <view
                class="out-box"
                v-for="(item, index) in symptomData"
                :key="index"
              >
                <view :class="[item.aiShow ? 'aiItem' : 'item']">
                  <view class="name">{{ item.diseaseName }}</view>
                  <view @click="deleteSymptom(item, index)" class="close">
                    <image
                      class="image"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/shutDown.png"
                      mode="scaleToFill"
                    />
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
        <!-- 协议-问诊按钮 -->
        <view v-if="modeShow != 1 && modeShow != 4" class="message">
          <view class="agreement">
            <check-box
              @change="checkboxChange"
              :value="checkboxValue"
              :agreementName="'《宠胖胖智能问诊服务知情同意书》'"
            >
            </check-box>
          </view>
          <view
            :class="[
              symptomData.length > 0 && checkboxValue
                ? 'activeMessageText'
                : 'messageText',
            ]"
            @click="handleMessage"
          >
            开始问诊
          </view>
        </view>
      </view>
      <!-- 拖拽按钮 -->
      <view v-if="deliverShow == false">
        <view v-if="liuShow == false">
          <view v-show="modeShow == 2 || modeShow == 3" class="liuDragBox">
            <!-- <view @click="goSwitch(1)">123</view> -->
            <liu-drag-button :bottomPx="180" @clickBtn="clickBtn">
              <image
                class="liuDrag"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/dragbutton.png"
                mode="scaleToFill"
              />
            </liu-drag-button>
          </view>
        </view>
      </view>
      <!-- 温馨提示 退出 -->
      <u-popup
        :show="promptShow"
        mode="center"
        bgColor="transparent"
        @touchmove.stop.prevent
      >
        <view class="prompt-card">
          <view class="pet-icon"></view>

          <view class="content">
            <view class="describe">温馨提示</view>
            <view class="agreement">
              <view class="agreement-text">此时退出不会保存已选症状哟～</view>
            </view>
          </view>
          <view class="line"> </view>
          <view class="footer">
            <view class="cancel" @click="promptClose">取消</view>
            <view class="line2"></view>
            <view class="confirm" @click="promptConfirm">确定</view>
          </view>
        </view>
      </u-popup>
      <!-- 是否分娩弹窗 -->
      <view>
        <u-popup
          :show="deliverShow"
          mode="center"
          bgColor="transparent"
          @touchmove.stop.prevent
        >
          <view class="tip-card">
            <view class="pet-icon"></view>

            <view class="content">
              <view class="describe">{{ petPopText }}</view>
              <view class="agreement">
                <view
                  :class="['radiocheck', checked ? 'checked' : '']"
                  @click="checkChange"
                ></view>

                <view class="agreement-text">一周内保持选项不再提醒</view>
              </view>
            </view>
            <view class="line"> </view>
            <view class="footer">
              <view class="cancel" @click="handleClose"
                >{{ needDeliveryTime ? "否" : "不调整" }}
              </view>
              <view class="line2"></view>
              <view class="confirm" @click="handleConfirm">
                {{ needDeliveryTime ? "是" : "确认" }}
              </view>
            </view>
          </view>
        </u-popup>
      </view>

      <!-- 宠物处于孕期未填写分娩日期场景 -->
        <u-datetime-picker
          :show="isShowPetbirth"
          v-model="petDate"
          mode="date"
          title="选择日期"
          :minDate="recordLatelyTime"
          :maxDate="new Date().getTime()"
          confirmColor="#333"
          confirmText="确定"
          :formatter="formatter"
          :itemHeight="50"
          @confirm="handleConfirmPet($event, 'date')"
          :closeOnClickOverlay="false"
          @close="handleClosePet"
          @cancel="handleClosePet"
        ></u-datetime-picker>

      <!-- ai识别弹窗 -->
      <view v-if="aiIdentifyShow" class="aiIdentifyBox">
        <view class="aiIdentify">识别症状已自动添加～</view>
      </view>

      <!-- toast 提示 -->
      <view v-if="symptomShow" class="symptomBox">
        <view class="aiIdentify">至少选择一个症状才能开始问诊～</view>
      </view>
      <view v-if="argumentsShow" class="symptomBox">
        <view style="width: 380rpx" class="aiIdentify"
          >请先同意以下协议条款～</view
        >
      </view>
      <!-- <u-toast ref="aiToast"></u-toast> -->
    </view>
    <view v-show="!consultationLoading">
      <view class="dad-wrapper" ref="dadRef">
        <image
          src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
          mode="scaleToFill"
        />
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "@/components/navBar/index.vue";
import { action_report, display_report } from "@/utils/track";
import { mapMutations, mapState } from "vuex";
import {
  getPopUp,
  getSymptomModel,
  getDeliver,
  getPetList,
  aiSubmitMessageQuick,
  getPetPeriodPop,
  confirmPetPeriodPop,
} from "../api/aiConsultation";
import Search from "./components/Search.vue";
import Cat from "./components/Cat.vue";
import Dog from "./components/Dog.vue";
import CascaderPage from "./components/CascaderPage.vue";
import AlienPet from "./components/AlienPet.vue";
import CheckBox from "./components/Checkbox.vue";
import dayjs from "dayjs";

export default {
  components: {
    Search,
    Cat,
    Dog,
    CascaderPage,
    AlienPet,
    NavBar,
    CheckBox,
  },
  onReady() {},
  onLoad(options) {
    // #ifdef H5
    uni.setStorageSync("shareType", "APP");
    // #endif
  },
  onShow() {
    display_report({
      display_name: "onlineconsultation_Intelligentconsultation_display",
      object_type: "ai_consultation",
      extend: {
        source:
          uni.getStorageSync("umt_extend").umt_code ||
          uni.getStorageSync("shareType"),
      },
    });
    setTimeout(() => {
      this.setAiIdentifyShow(false);
    }, 1500);
    // #ifdef H5
    if (
      this.$dsBridge.call(
        "getPositioningCoordinates",
        "getPositioningCoordinates"
      )
    ) {
      let localJson = this.$dsBridge.call(
        "getPositioningCoordinates",
        "getPositioningCoordinates"
      );
      this.local = localJson ? JSON.parse(localJson) : "";
      this.userId = this.$dsBridge.call("getUserId", "getUserId");
    }
    // #endif
    this.$nextTick(() => {
      // #ifdef MP-WEIXIN
      this.userId = this.userInfo.userId;
      // #endif
      getPetList({ userId: this.userId, queryPetLifeCycle: true }).then(
        (res) => {
          if (res.data.length == this.petList?.length) {
            const result = res.data.filter(
              (obj) => obj.id === this.selectedPet.id
            );
            this.petList = res.data;
            this.selectItem(result[0]);
          } else {
            this.petList = res.data;
            this.selectItem(res.data[0]);
          }
        }
      );
    });
  },

  onHide() {
    // 处理用户打开时间弹窗未选择关闭手机屏幕场景
    this.deliverShow = false;
    this.isShowPetbirth = false;
  },
  created() {},
  onUnload() {
    uni.removeStorageSync("symptArry");
    // this.setSelectPetItem({});
  },
  data() {
    return {
      recordLatelyTime: "", //最近一次修改时间记录
      needDeliveryTime: false, //是否需要填写分娩日期
      petPopText: "", //弹窗文本
      petDate: dayjs(), //当前时间
      isShowPetbirth: false, //分娩日期选择
      promptShow: false, //温馨提示
      deliverShow: false, //分娩弹窗
      deliverValue: [], //分娩是否选中
      checkValue: "",
      selectedPet: {}, //选中宠物
      petList: [], //宠物列表
      checkboxValue: false, //协议是否选中
      modeShow: 2, //1搜索，2图表，3级联，4异宠模式
      saveModeShow: 2,
      catShow: true,
      dogShow: false,
      petCategoryIdShow: 4, //1猫50狗
      // symptomTree: require("./components/data.json").symptom,
      symptomTree: [],
      symptomList: [],
      commonSymptomList: [],
      deliverData: {}, //是否分娩数据
      local: {},
      userId: "",
      consultationLoading: false,
      symptomShow: false,
      argumentsShow: false,
      checked: true, //是否一周内进行提示，默认为true
      periodType: "", //宠物时期类型
    };
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      symptomData: (state) => state.symptomData,
      aiIdentifyShow: (state) => state.aiIdentifyShow,
      selectPetItem: (state) => state.selectPetItem,
      symptomDesc: (state) => state.symptomDesc,
      liuShow: (state) => state.liuShow,
      jumpModelShow: (state) => state.jumpModelShow,
      saveDeliverShow: (state) => state.saveDeliverShow,
    }),
  },

  methods: {
    ...mapMutations([
      "deleteSymptomData",
      "setsearchSymptom",
      "setsearchCommonSymptom",
      "setSymptom",
      "setAiIdentifyShow",
      "clearSymptomData",
      "setSelectPetItem",
      "setJumpModelShow",
      "setSaveDeliverShow",
      "assignmentSymptomData",
      "setSymptomDesc",
      // "setFirstSelectedIndex",
    ]),
    handlePageLoad() {
      this.consultationLoading = true;
    },
    // 多维数组扁平化
    delayering() {
      if (this.symptomList.length == 0) {
        this.symptomTree.forEach((element) => {
          if (element.diseaseName == "常见") {
            element.child.forEach((item) => {
              if (item.child.length == 0) {
                item.tier = element.diseaseName;
                this.commonSymptomList.push(item);
              } else {
                item.child.forEach((lastItem) => {
                  lastItem.tier = element.diseaseName;
                  this.commonSymptomList.push(lastItem);
                });
              }
            });
          } else {
            element.child.forEach((item) => {
              if (item.child.length == 0) {
                item.tier = element.diseaseName;
                this.symptomList.push(item);
              } else {
                item.child.forEach((lastItem) => {
                  lastItem.tier = element.diseaseName;
                  this.symptomList.push(lastItem);
                });
              }
            });
          }
        });
        this.setsearchSymptom(this.symptomList);
        this.setsearchCommonSymptom(this.commonSymptomList);
      }
      this.$nextTick(() => {
        this.handlePageLoad();
      });
    },
    // 返回判断是否有选中的数据
    handleReturn() {
      if (this.symptomData.length > 0) {
        this.promptShow = true;
      } else {
        // #ifdef MP-WEIXIN
        uni.navigateBack({
          delta: 1,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("closeCurrentWebview", {});
        // #endif
        uni.removeStorageSync("symptArry");
      }
    },
    promptClose() {
      this.promptShow = false;
    },
    promptConfirm() {
      this.promptShow = false;
      this.clearSymptomData();
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
      uni.removeStorageSync("symptArry");
    },
    deleteSymptom(item, index) {
      this.deleteSymptomData(index);
      this.$refs.CascaderPage.deleteCascaderPage(item);
    },
    // 切换模式
    goSwitch(mode) {
      if (this.modeShow == 4) {
        return;
      }
      if (mode == 1) {
        action_report({
          action_name: "Intelligentconsultation_SearchForSymptoms_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
      }
      this.setJumpModelShow(mode);
      // 异宠模式不可切换
      if (this.modeShow != 4) {
        this.modeShow = mode;
        if (this.modeShow != 1) {
          this.saveModeShow = mode;
        }
      }
      if (this.modeShow == 3) {
        this.$refs.CascaderPage.selectfirstActive();
      }
    },
    // 点击编辑图标
    editClick(item, flagValue) {
      this.selectItem(item, flagValue);
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesD/editPetProfile/index?petId=${this.selectedPet.id}&type=aiConsultationEdit&apptype=emit&transparentTopBar=1`,
      });
      // #endif
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesD/editPetProfile/index?petId=${this.selectedPet.id}&type=aiConsultationEdit`,
      });
      // #endif
    },
    // 选中宠物某一项目
    selectItem(item, flagValue) {
      if (this.modeShow != 1) {
        // 切换存症状数据
        if (this.symptomData.length > 0) {
          let symptArry = uni.getStorageSync("symptArry")
            ? uni.getStorageSync("symptArry")
            : [];
          if (symptArry.length == 0) {
            let saveItem = {
              data: this.symptomData,
              id: this.selectedPet.id,
              symptomDesc: this.symptomDesc ? this.symptomDesc : "",
            };
            symptArry.push(saveItem);
          } else {
            let saveItem = {
              data: this.symptomData,
              id: this.selectedPet.id,
              symptomDesc: this.symptomDesc ? this.symptomDesc : "",
            };
            // 查找是否存在具有相同id的对象
            let index = symptArry.findIndex((obj) => obj.id === saveItem.id);
            if (index !== -1) {
              // 如果存在，替换它
              symptArry[index] = saveItem;
            } else {
              // 如果不存在，添加到数组中
              symptArry.push(saveItem);
            }
          }
          uni.setStorageSync("symptArry", symptArry);
        } else {
          let symptArry = uni.getStorageSync("symptArry")
            ? uni.getStorageSync("symptArry")
            : [];
          if (symptArry.length > 0) {
            // 查找是否存在具有相同id的对象
            symptArry.forEach((item, index) => {
              if (item.id == this.selectedPet.id) {
                symptArry.splice(index, 1);
              }
            });
            uni.setStorageSync("symptArry", symptArry);
          }
        }
        // 清数据
        this.clearSymptomData();
        //回显数据
        let fsymptArry = uni.getStorageSync("symptArry")
          ? uni.getStorageSync("symptArry")
          : [];
        if (fsymptArry.length != 0) {
          fsymptArry.forEach((value, index) => {
            if (item.id == value.id) {
              this.assignmentSymptomData(value.data);
            }
          });
        }
        this.selectedPet = item;
        this.periodType = item.petLifeCycle?.specialPeriod?.periodName;

        //判断显示猫狗异宠物
        if (item.petCategoryId == 1) {
          this.petCategoryIdShow = 1;
        }
        if (item.petCategoryId == 50) {
          this.petCategoryIdShow = 50;
        }
        if (item.petCategoryId != 50 && item.petCategoryId != 1) {
          this.modeShow = 4;
          this.handlePageLoad();
          return;
        } else {
          this.modeShow = 2;
          //宠物切换清空级联选择状态并默认负值常见症状
          if (flagValue == 1) {
            this.$refs.CascaderPage.clearCascaderPage();
            // this.$refs.CascaderPage.selectfirstActive();
          } else {
            if (this.jumpModelShow) {
              this.modeShow = this.jumpModelShow;
            }
          }
        }
        this.setDeliver(item);
        if (item.id != this.selectPetItem.id) {
          this.setSaveDeliverShow(true);
        }
        //判断宠物协议是否要勾选
        let agreementData = uni.getStorageSync("newAgreement")
          ? uni.getStorageSync("newAgreement")
          : [];
        if (agreementData.length > 0) {
          agreementData.forEach((item) => {
            if (item == this.selectedPet.id) {
              this.checkboxValue = true;
            } else {
              if (flagValue == 1) {
                this.checkboxValue = false;
              }
            }
          });
        } else {
          if (flagValue == 1) {
            this.checkboxValue = false;
          }
        }
        this.setSelectPetItem(item);
      }
    },
    // 跳转添加宠物
    addPetsMethod() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesD/petInfo/index?type=AI_INQUIRY`,
      });
      // #endif

      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesD/petInfo/index?type=AI_INQUIRY&nopet=nopet&apptype=add&transparentTopBar=1`,
      });
      // #endif
      action_report({
        action_name: "Intelligentconsultation_add_pet_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    },
    //点击拖拽按钮
    clickBtn() {
      this.setSaveDeliverShow(false);
      uni.navigateTo({
        url: "/pagesF/aiSymptom/index",
      });
    },
    //点击跳转到搜索页面
    goSearch() {
      this.setSaveDeliverShow(false);
      console.log(this.selectedPet.nickName, "selectedPet");
      uni.navigateTo({
        url: `/pagesF/aiSearch/index?saveModeShow=${this.saveModeShow}&nickName=${this.selectedPet.nickName}`,
      });
    },
    // 开始问诊
    handleMessage() {
      if (this.symptomData.length == 0) {
        this.symptomShow = true;
        setTimeout(() => {
          this.symptomShow = false;
        }, 1800);
        return;
      }
      if (!this.checkboxValue) {
        this.argumentsShow = true;
        setTimeout(() => {
          this.argumentsShow = false;
        }, 1800);
        return;
      }
      if (this.symptomData.length > 0 && this.checkboxValue) {
        let symptomList = [];
        this.symptomData.forEach((item) => {
          symptomList.push(item.diseaseName);
        });
        //是否绝育
        let sterilization = "";
        if (this.selectedPet.sterilizationStatus == 1) {
          sterilization = false;
        } else if (this.selectedPet.sterilizationStatus == 2) {
          sterilization = true;
        }

        console.log(symptomList, "symptomList");
        const params = {
          aiConsultationId: "",

          // #ifdef MP-WEIXIN
          cityCode: uni.getStorageSync("cityCode")
            ? uni.getStorageSync("cityCode").slice(0, 4)
            : "",
          lat: uni.getStorageSync("lat") ? uni.getStorageSync("lat") : "",
          lon: uni.getStorageSync("lon") ? uni.getStorageSync("lon") : "",
          // #endif
          // #ifdef H5
          cityCode: this.local.cityCode ? this.local.cityCode.slice(0, 4) : "",
          lat: this.local.lat,
          lon: this.local.lon,
          // #endif
          couponNo: "",
          entrance: "AI",
          groupId: "",
          inquiryType: "AI_INQUIRY",
          preFilledInfo: {
            vaccinationStatus:
              this.selectedPet?.petLifeCycle?.vaccineInfo?.status, //疫苗接种情况 接种情况 // 0 - 未接种 / 1 - 已接种
            vaccinationOption:
              this.selectedPet?.petLifeCycle?.vaccineInfo?.typeName, //接种选项(疫苗种类名称)
            specialPeriod:
              this.selectedPet?.petLifeCycle?.specialPeriod?.periodName, //特殊时期
            age: this.selectedPet.guardTime,
            avatarUrl: this.selectedPet.avatarUrl,
            categoryName: this.selectedPet.categoryName,
            dailyExerciseAmount: "",
            dietHabit: [],
            expelInsects: 0,
            gender: this.selectedPet.sex,
            illnessDesc: this.symptomDesc,
            medicalDemand: [],
            nickName: this.selectedPet.nickName,
            petId: this.selectedPet.id,
            petType: this.selectedPet.petCategoryId == 1 ? "CAT" : "DOG",
            sterilization: sterilization,
            sterilizationStatus: this.selectedPet.sterilizationStatus,
            symptomDuration: "",
            symptomImags: [],
            vaccine: 0,
            weight: this.selectedPet.weight,
          },
          resourceId: "",
          resourceType: "",
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
          channelCode: "",
          // source: "WECHAT_XCX",
          sourceOrderType: 5,
          symptomType: symptomList,
        };
        if (!this.selectedPet.otherPet) {
          console.log(this.selectedPet.otherPet, this.selectedPet);
          //选中的是猫狗 判断疫苗和特殊时期字段是否为空
          if (
            !this.selectedPet?.petLifeCycle?.specialPeriod ||
            !this.selectedPet?.petLifeCycle?.vaccineInfo
          ) {
            uni.setStorageSync("aiparams", JSON.stringify(params));
            // 疫苗和特殊时期为空  有一个没填就跳到编辑页面
            uni.navigateTo({
              url: `/pagesD/editPetProfile/index?petId=${this.selectedPet.id}&type=AI_INQUIRY`,
            });
            return;
          }
        }

        console.log("params=================================>", params);
        aiSubmitMessageQuick(params).then((res) => {
          //清空缓存
          uni.removeStorageSync("symptArry");
          this.setSelectPetItem({});
          this.clearSymptomData();
          this.setSymptomDesc("");
          //缓存协议
          let agreementData = uni.getStorageSync("newAgreement")
            ? uni.getStorageSync("newAgreement")
            : [];
          agreementData.push(this.selectedPet.id);
          let newAgreement = [...new Set(agreementData)];
          uni.setStorageSync("newAgreement", newAgreement);
          // #ifdef MP-WEIXIN

          uni.redirectTo({
            url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              res.data
            )}&fromOrigin=new&inquiryType=AI_INQUIRY&petId=${
              this.selectedPet.id
            }`,
          });
          // #endif
          // #ifdef H5
          let messageInfoCode = encodeURIComponent(JSON.stringify(res.data));
          // this.$dsBridge.call("gotoPageThroughRoute", {
          //   page: `${window.location.origin}/crm-medical-h5/#/pagesA/chatPage/index?messageInfo=${messageInfoCode}&fromOrigin=new&inquiryType=AI_INQUIRY&petId=${this.selectedPet.id}&transparentTopBar=1`,
          // });
          // this.$dsBridge.call("closeCurrentWebview", {});
          uni.redirectTo({
            url: `/pagesA/chatPage/index?messageInfo=${messageInfoCode}&fromOrigin=new&inquiryType=AI_INQUIRY&petId=${this.selectedPet.id}`,
          });
          // #endif
        });
      }
    },
    // 协议勾选
    checkboxChange(value) {
      this.checkboxValue = value;
    },
    // 协议跳转
    goAgreement() {
      this.setSaveDeliverShow(false);
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pagesA/webView/index?route=/meow-interface/html/aiAgreement.html&type=jump",
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${
          window.location.origin
        }/crm-medical-h5/#/pagesA/webView/index?route=/meow-interface/html/aiAgreement.html&type=jump&title=${encodeURIComponent(
          "隐私协议"
        )}`,
      });
      // #endif
    },

    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      return value;
    },

    // 调取是否分娩
    async setDeliver(item) {
      // const res = await getPopUp({ petId: item.id });
      // if (this.saveDeliverShow) {
      //   if (res.data.popUp == 1) {
      //     this.deliverShow = true;
      //   }
      // }
      // this.deliverData = res.data;
      // this.getSymptom(res.data.deliver);

      const { data } = await getPetPeriodPop({ petId: item.id });
      let lately = dayjs(data.recordTime); //2024-01-01 00:00:00
      if (data.popUp) {
        this.deliverShow = true;
        this.petPopText = data.desc;
        this.needDeliveryTime = data.needDeliveryTime; //是否需要填写分娩日期
        this.recordLatelyTime = lately.unix() * 1000; //最近一次手动选择孕期的时间,用作时间选择的起始值

        if (this.periodType == "孕期") {
          display_report({
            display_name: "pregnancy_popup_display",
            module_name: "Pet",
            extend: {
              // #ifdef MP-WEIXIN
              user_id: this.userInfo.userId,
              // #endif
              // #ifdef H5
              user_id: this.$dsBridge.call("getUserId", "getUserId"),
              // #endif
            },
          });
        } else if (this.periodType == "哺乳期") {
          display_report({
            display_name: "lactation_popup_display",
            module_name: "Pet",
            extend: {
              // #ifdef MP-WEIXIN
              user_id: this.userInfo.userId,
              // #endif
              // #ifdef H5
              user_id: this.$dsBridge.call("getUserId", "getUserId"),
              // #endif
            },
          });
        } else if (this.periodType == "发情期") {
          display_report({
            display_name: "estrus_popup_display",
            module_name: "Pet",
            extend: {
              // #ifdef MP-WEIXIN
              user_id: this.userInfo.userId,
              // #endif
              // #ifdef H5
              user_id: this.$dsBridge.call("getUserId", "getUserId"),
              // #endif
            },
          });
        }
      }

      this.getSymptom();
    },

    // 勾选弹窗展示时间
    checkChange() {
      let curstatus = this.checked;
      this.checked = !curstatus;
    },

    // 宠物症状模型列表
    async getSymptom(value) {
      console.log(
        "this.selectedPet",
        this.selectedPet?.petLifeCycle?.specialPeriod?.deliveryTime
      );

      const params = {
        petId: this.selectedPet.id,
        deliver: -1,
        deliveryTime:
          this.selectedPet?.petLifeCycle?.specialPeriod?.deliveryTime,
      };
      const { data } = await getSymptomModel(params);
      this.symptomTree = data.symptom;
      this.setSymptom(data.symptom);
      this.delayering();
    },
    // 是否分娩勾选
    // checkboxDeliver(n) {
    //   this.checkValue = n.length;
    // },

    // 分娩否
    async handleClose() {
      if (this.periodType == "孕期") {
        action_report({
          action_name: "pregnancy_popup_click",
          module_name: "Pet",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: this.userInfo.userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            pet_id: this.selectedPet.id,
            option: "no",
          },
        });
      } else if (this.periodType == "哺乳期") {
        action_report({
          action_name: "lactation_popup_click",
          module_name: "Pet",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: this.userInfo.userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            pet_id: this.selectedPet.id,
            option: "no",
          },
        });
      } else if (this.periodType == "发情期") {
        action_report({
          action_name: "estrus_popup_click",
          module_name: "Pet",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: this.userInfo.userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            pet_id: this.selectedPet.id,
            option: "no",
          },
        });
      }

      const requestData = {
        petId: this.selectedPet.id,
        sustainPop: this.checked,
        confirm: false,
      };
      confirmPetPeriodPop(requestData)
        .then((res) => {
          console.log(res);
          this.deliverShow = false;
        })
        .catch((error) => {});
    },
    // 分娩是
    async handleConfirm() {
      if (this.periodType == "孕期") {
        action_report({
          action_name: "pregnancy_popup__click",
          module_name: "Pet",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: this.userInfo.userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            pet_id: this.selectedPet.id,
            option: "yes",
          },
        });
      } else if (this.periodType == "哺乳期") {
        action_report({
          action_name: "lactation_popup_click",
          module_name: "Pet",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: this.userInfo.userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            pet_id: this.selectedPet.id,
            option: "yes",
          },
        });
      } else if (this.periodType == "发情期") {
        action_report({
          action_name: "estrus_popup_click",
          module_name: "Pet",
          extend: {
            // #ifdef MP-WEIXIN
            user_id: this.userInfo.userId,
            // #endif
            // #ifdef H5
            user_id: this.$dsBridge.call("getUserId", "getUserId"),
            // #endif
            pet_id: this.selectedPet.id,
            option: "yes",
          },
        });
      }

      //判断是否进行时间选择,needDeliveryTime true打开弹窗,false直接调用接口
      if (this.needDeliveryTime) {
        this.deliverShow = false;
        this.isShowPetbirth = true;
      } else {
        const requestData = {
          petId: this.selectedPet.id,
          sustainPop: this.checked,
          confirm: true,
        };
        confirmPetPeriodPop(requestData)
          .then((res) => {
            console.log(res);
            this.deliverShow = false;
          })
          .catch((error) => {});
      }
    },

    handleClosePet() {
      console.log("取消吧");
      this.isShowPetbirth = false;
    },

    // 孕期未填写预产期场景下的确认
    handleConfirmPet(e, type) {
      if (type == "date") {
        const requestData = {
          petId: this.selectedPet.id,
          sustainPop: this.checked,
          confirm: true,
          deliveryTime: dayjs(e.value).format("YYYY-MM-DD") + " 00:00:00",
        };
        confirmPetPeriodPop(requestData)
          .then((res) => {
            console.log(res);
            this.isShowPetbirth = false;
          })
          .catch((error) => {});
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
