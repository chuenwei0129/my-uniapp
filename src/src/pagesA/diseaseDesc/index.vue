<template>
  <view class="desc">
    <!-- 标题 -->
    <view
      class="nav-bar"
      :class="{ 'nav-bar-scrollbg': isScroll }"
      :style="{
        paddingTop: statusBarHeight,
      }"
    >
      <view class="nav-wrapper">
        <view class="nav-back" @click="handleNavBack"></view>
        <view class="title-wrapper">
          <view class="title">病情描述</view>
        </view>
      </view>
    </view>

    <!--背景-->
    <view class="top">
      <!-- 文案描述 -->
      <view class="copywriting-box">
        <view class="writing-top">病情描述清晰，快速与医生对话</view>
        <view class="writing-bottom">马上录入你家宠物的病情信息吧~</view>
      </view>
    </view>

    <!-- 宠物切换 -->
    <view
      class="pet-box"
      :class="{ 'pet-box-sticky': hasPetBoxStickyClass }"
      :style="{ top: petBoxTop }"
    >
      <scroll-view
        scroll-x="true"
        class="pet-scroll"
        :scroll-into-view="petScrollToViewData"
      >
        <view
          :class="{
            petItemFirst: index === 0,
            'active-opacity': selectedPet && selectedPet.id == item.id,
          }"
          class="pet-item"
          v-for="(item, index) in petList"
          :key="index"
          :id="`pet_item_${item.id}`"
        >
          <view
            :class="
              selectedPet && selectedPet.id == item.id
                ? 'active-img-name'
                : 'img-name'
            "
            @click="selectItem(item)"
          >
            <view class="pet-item-inner">
              <image
                :src="item.avatarUrl"
                mode="aspectFill"
                class="pet-item-img"
              />
              <view class="pet-item-label">
                {{ item.nickName.substring(0, 4) }}
              </view>
            </view>
          </view>
          <view class="icon-box">
            <view>
              <view
                :class="[
                  selectedPet && selectedPet.id == item.id ? 'allRight' : '',
                ]"
              ></view>
            </view>
          </view>
        </view>
        <view style="margin-right: 30rpx" class="pet-item">
          <view class="img-name" @click="addPetsMethod">
            <view class="pet-item-inner">
              <image src="" mode="aspectFill" class="pet-item-img no-img" />
              <view class="pet-item-label-add">+添加宠物</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="content">
      <!-- <view class="line"></view> -->
      <!-- :class="{ 'qu-fixed': isSubmitting }" -->
      <view class="qu" id="qu">
        <view class="archives card">
          <!-- 无档案记录 -->
          <view v-if="filesShow && !isAlienPet">
            <view class="quone">
              <view class="quTitle"
                >请选择疫苗接种情况<text class="required">*</text></view
              >
              <view class="yuList">
                <view
                  class="checkItem"
                  @click="
                    () => {
                      handleChecked('yuList', yitem);
                    }
                  "
                  v-for="yitem in yuList"
                  :key="yitem.key"
                  :class="{
                    checked: yitem.checked,
                  }"
                >
                  {{ yitem && yitem.name }}
                </view>
              </view>
              <!--      疫苗类型        -->
              <!--              <view-->
              <!--                @click="-->
              <!--                  () => {-->
              <!--                    openFiles(1);-->
              <!--                  }-->
              <!--                "-->
              <!--                class="select-box"-->
              <!--                v-if="getListName(yuList) === '已接种'"-->
              <!--              >-->
              <!--                <view class="name">疫苗类型</view>-->
              <!--                <view class="select-item">-->
              <!--                  <view class="name-left" v-if="filesVaccine.vaccineType"-->
              <!--                    >{{ filesVaccine.vaccineType }}-->
              <!--                  </view>-->
              <!--                  <view class="left" v-else>请选择</view>-->
              <!--                  <view class="right">-->
              <!--                    <image-->
              <!--                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"-->
              <!--                      mode="aspectFill"-->
              <!--                    />-->
              <!--                  </view>-->
              <!--                </view>-->
              <!--              </view>-->
            </view>
            <view class="qutwo">
              <view class="quTitle"
                >请选择是否驱虫<text class="required">*</text></view
              >
              <view class="quList">
                <view
                  class="checkItem"
                  @click="
                    () => {
                      handleChecked('quList', qitem);
                    }
                  "
                  v-for="qitem in quList"
                  :key="qitem.key"
                  :class="{
                    checked: qitem.checked,
                  }"
                >
                  {{ qitem && qitem.name }}
                </view>
              </view>
              <!--     定时驱虫         -->
              <!--              <view v-if="getListName(quList) === '定时驱虫'">-->
              <!--                <view-->
              <!--                  @click="-->
              <!--                    () => {-->
              <!--                      openDatePicker();-->
              <!--                    }-->
              <!--                  "-->
              <!--                  class="select-box"-->
              <!--                >-->
              <!--                  <view class="name">最近驱虫时间</view>-->
              <!--                  <view class="select-item">-->
              <!--                    <view v-if="petDate == null" class="left">请选择</view>-->
              <!--                    <view v-else class="name-left">{{ petDate }} </view>-->
              <!--                    <view class="right">-->
              <!--                      <image-->
              <!--                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"-->
              <!--                        mode="aspectFill"-->
              <!--                      />-->
              <!--                    </view>-->
              <!--                  </view>-->
              <!--                </view>-->
              <!--                <view-->
              <!--                  @click="-->
              <!--                    () => {-->
              <!--                      openCommonPicker(2);-->
              <!--                    }-->
              <!--                  "-->
              <!--                  class="select-box"-->
              <!--                >-->
              <!--                  <view class="name">驱虫类型</view>-->
              <!--                  <view class="select-item">-->
              <!--                    <view-->
              <!--                      v-if="filesInsect.expelInsectsType"-->
              <!--                      class="name-left"-->
              <!--                      >{{ filesInsect.expelInsectsType }}</view-->
              <!--                    >-->
              <!--                    <view v-else class="left">请选择</view>-->
              <!--                    <view class="right">-->
              <!--                      <image-->
              <!--                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"-->
              <!--                        mode="aspectFill"-->
              <!--                      />-->
              <!--                    </view>-->
              <!--                  </view>-->
              <!--                </view>-->
              <!--                <view-->
              <!--                  @click="-->
              <!--                    () => {-->
              <!--                      openCommonPicker(3);-->
              <!--                    }-->
              <!--                  "-->
              <!--                  class="select-box"-->
              <!--                >-->
              <!--                  <view class="name">驱虫品牌</view>-->
              <!--                  <view class="select-item">-->
              <!--                    <view-->
              <!--                      v-if="filesInsect.expelInsectsBrand"-->
              <!--                      class="name-left"-->
              <!--                      >{{ filesInsect.expelInsectsBrand }}</view-->
              <!--                    >-->
              <!--                    <view v-else class="left">请选择</view>-->
              <!--                    <view class="right">-->
              <!--                      <image-->
              <!--                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png"-->
              <!--                        mode="aspectFill"-->
              <!--                      />-->
              <!--                    </view>-->
              <!--                  </view>-->
              <!--                </view>-->
              <!--              </view>-->
            </view>
            <view class="qutwo">
              <view class="quTitle"
                >当前体重<text class="required">*</text></view
              >
              <view class="input-wrapper">
                <view class="diseaseDesc-wight">
                  <u--input
                    placeholder="请输入体重"
                    border="surround"
                    shape="circle"
                    v-model="weightData"
                    type="digit"
                    clearable
                    :customStyle="{ width: '604rpx' }"
                    @input="handleWeightChange"
                  ></u--input>
                  <view class="unit">kg</view>
                </view>
              </view>
            </view>
          </view>
          <!-- 有档案记录 -->
          <view v-if="!filesShow && !isAlienPet">
            <view
              @click="
                () => {
                  openFiles(3);
                }
              "
              class="weight-box"
            >
              <view class="name">当前体重</view>
              <view v-if="filesWeight.weight" class="weight-time">
                <view class="left">
                  <view>{{ filesWeight.weight }}</view>
                  <view class="unit">kg</view>
                </view>
                <view class="right">
                  <view class="time-date"
                    >最新时间：{{ filesWeight.time.substring(0, 10) }}</view
                  >
                  <view class="time-icon">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
              <view v-else class="no-weight-time">
                <view class="right">
                  <view>请完善体重信息</view>
                  <view class="time-icon">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
            </view>
            <view
              @click="
                () => {
                  openFiles(1);
                }
              "
              class="vaccine-box"
            >
              <view class="name">疫苗接种</view>
              <view v-if="filesVaccine.vaccineTime" class="vaccine-time">
                <view class="left">
                  <view>{{ filesVaccine.vaccineType }}</view>
                </view>
                <view class="right">
                  <view
                    >最新时间：{{
                      filesVaccine.vaccineTime.substring(0, 10)
                    }}</view
                  >
                  <view class="time-icon">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
              <view v-else class="no-vaccine-time">
                <view class="right">
                  <view>请完善疫苗信息</view>
                  <view class="time-icon">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
            </view>
            <view
              @click="
                () => {
                  openFiles(2);
                }
              "
              class="insect-box"
            >
              <view class="name">驱虫情况</view>
              <view v-if="filesInsect.expelInsectsTime" class="insect-time">
                <view class="left">
                  <view>{{ filesInsect.expelInsectsType }}</view>
                  <view
                    class="line"
                    v-if="
                      filesInsect.expelInsectsType &&
                      filesInsect.expelInsectsBrand
                    "
                    >|</view
                  >
                  <view>{{ filesInsect.expelInsectsBrand }}</view>
                </view>
                <view class="right">
                  <view
                    >最新时间：{{
                      filesInsect.expelInsectsTime.substring(0, 10)
                    }}</view
                  >
                  <view class="time-icon">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
              <view v-else class="no-insect-time">
                <view class="right">
                  <view>请完善驱虫信息</view>
                  <view class="time-icon">
                    <image
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/order/edit-address.png"
                      mode="aspectFill"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="quthree">
            <view class="quTitle"
              >请选择症状类型（可多选）<text class="required">*</text></view
            >
            <view class="quList">
              <view
                class="checkItemWidth"
                v-for="qitem in diseaseList"
                :key="qitem.tagId"
                :class="{
                  checked: qitem.checked,
                }"
                @click="
                  () => {
                    handleChecked('diseaseList', qitem, 'tagId', true);
                  }
                "
              >
                {{ qitem.tagName }}
              </view>
            </view>
          </view>
        </view>
        <view class="detail card">
          <view class="quTitle detailTitle"
            >请描述爱宠病情<text class="required">*</text></view
          >
          <view class="desca">
            <u--textarea
              height="135"
              v-model="illnessDesc"
              placeholder="请描述爱宠病情"
              maxlength="500"
              count
              :formatter="testFormatter"
              :showConfirmBar="false"
            ></u--textarea>
          </view>
        </view>

        <view class="disease-card card">
          <view class="disease-img">
            <view class="quTitle">上传症状图片</view>
            <view
              style="
                font-size: 23rpx;
                color: #999999;
                font-weight: 400;
                margin-top: -19rpx;
                margin-bottom: 19rpx;
              "
              >请提前上传图片，以便医生给您更好的建议</view
            >
            <u-upload
              :fileList="diseaseImgs"
              @afterRead="afterRead"
              @delete="deletePic"
              :deletable="upLoadDeletable"
              name="1"
              :maxCount="9"
              :width="'154rpx'"
              :height="'154rpx'"
            >
              <view class="upload-emp">
                <view>
                  <image
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/inquiry/mp_icon_upload.png"
                    mode="widthFix"
                    style="width: 64rpx; height: 64rpx"
                  ></image>
                </view>
                <view
                  >{{
                    diseaseImgs && diseaseImgs.length ? diseaseImgs.length : 0
                  }}/9</view
                >
              </view>
            </u-upload>
          </view>

          <view class="qufour">
            <view class="quTitle">症状出现时长</view>
            <view class="quList">
              <view
                class="checkItem"
                v-for="qitem in diseaseTimeList"
                :key="qitem.key"
                :class="{
                  checked: qitem.checked,
                }"
                @click="
                  () => {
                    handleChecked('diseaseTimeList', qitem);
                  }
                "
              >
                {{ qitem && qitem.name }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="message">
      <view class="agreement">
        <u-checkbox-group
          placement="column"
          size="14px"
          activeColor="#000000"
          @change="checkboxChange"
          v-model="checkboxValue"
        >
          <u-checkbox> </u-checkbox>
        </u-checkbox-group>
        <view class="agreement-text">
          已阅读并同意
          <text @click="goAgreement"
            >《上海宠氧互联网宠物医院宠物健康咨询服务知情同意书》</text
          >
        </view></view
      >
      <view
        v-if="inquiryType !== 'EXPERT'"
        class="messageText"
        :class="!!allowSubmit ? 'allowMessage' : ''"
        @click="handleMessage"
      >
        开始咨询
      </view>
      <view
        v-else
        class="expert-submit-btn"
        :class="!!allowSubmit ? 'allowMessage' : ''"
        @click="handleMessage"
      >
        <text class="expert-submit-btn-text"
          >开始问诊 {{ discountedPrice }}元/次</text
        >
        <text
          class="expert-submit-btn-text2"
          v-if="originalPrice > 0 && !doctorUserId"
          >¥ {{ originalPrice }}</text
        >
        <text class="expert-submit-btn-hint" v-if="!doctorUserId"
          >限时优惠</text
        >
      </view>
      <!-- <u-safe-bottom></u-safe-bottom> -->
    </view>
    <u-popup
      :show="doctorShow"
      :overlayStyle="{ background: 'rgba(3, 100, 219, 0)' }"
      mode="center"
      bgColor="transparent"
      @touchmove.stop.prevent
    >
      <view class="doctor-box">
        <view class="load-icon">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/payLoading.png"
            mode="widthFix"
          ></image>
        </view>
        <view class="load-name"> 连接医生({{ secondNum }}s) </view>
      </view>
    </u-popup>
    <ChangePetPop
      :petList="petList"
      :selectPetId="petId + ''"
      :isOpen.sync="isPetShow"
      @confirm="handleSelectPet"
      @close="handlePetPopClose"
    />
    <CommonPicker
      v-if="isShowPop"
      :isShowPop.sync="isShowPop"
      :columns="columns"
      :secondName="secondName"
      @onchange="handlePickerChange"
    />
    <DatePicker :isShowPop.sync="isShowDate" @onChange="handleDateChange" />
    <HealthPop
      :healthType="healthType"
      type="add"
      :show.sync="healthPopShow"
      :petInfo="petInfoObj"
      @complete="healthPopComplete"
    ></HealthPop>
    <ConfirmPop ref="symptomPopup"></ConfirmPop>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import ChangePetPop from "@/components/changePetPop";
import DatePicker from "./components/datePicker";
import CommonPicker from "./components/commonPicker";
import HealthPop from "./components/healthPop";
import ConfirmPop from "./components/confirmPop/index";
import { mapState, mapMutations } from "vuex";
import dayjs from "dayjs";
import {
  getPetList,
  submitMessage,
  getTag,
  submitMessageQuick,
  checkUserQualification,
  healthFiles,
  GET_HEALTH_METADATA,
} from "@/api/base";
import { BASR_URL } from "@/utils/http";
import { GET_IN_SERVICE_LAST } from "@/api/chat";
import { action_report } from "@/utils/track";
import { getAISheetInfoApi } from "@/pagesB/api/index";
import chatMixins from "@/pagesA/mixins/chatMixins";
import { pxToRpx } from "@/utils/index";
import { cachePaidConsultationInfo } from "@/api/medical";
import { inquiryOrderDetail } from "@/api/inquiryOrder";

export default {
  async onLoad(option) {
    console.log("添加病情里面的option===================>", option);
    this.petId = option.petId;
    this.doctorUserId = option.doctorUserId;
    this.groupId = option.groupId;
    this.inquiryType = option.inquiryType || "EXPERT"; //  QUICK
    this.resourceId = option.resourceId;
    this.resourceType = option.resourceType;
    this._getDiseaseTag();
    this.isAientry = option.aientry;
    uni.removeStorageSync("aientryLoginFlag");
    console.log("option.sheetId", option.sheetId);
    if (option.sheetId) {
      this.getAISheetInfo(option.sheetId);
    }
    this.sheetId = option.sheetId;

    /**
     * 从问诊单 待接诊进入 增加入参
     * from=consultOrder
     * consultationId=xxxxxx
     * userGroupId=xxxxxxx
     * deadlineTime=2024-11-26 15:00:00
     * */
    this.from = option.from; // 来源 consultOrder-问诊单 inquiryOrderSubmit-确认订单支付成功
    this.consultationId = option.consultationId;
    this.userGroupId = option.userGroupId;
    this.deadlineTime = option.deadlineTime;
  },
  onPageScroll(e) {
    // e.scrollTop 获取页面的滚动高度
    const targetH = 100;
    this.hasPetBoxStickyClass = e.scrollTop > targetH;

    if (e.scrollTop > 30) {
      this.isScroll = true;
    } else {
      this.isScroll = false;
    }
  },
  mounted() {
    //#ifdef MP-WEIXIN
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    // 90 - nav-bar设置的高度
    this.petBoxTop = pxToRpx(getApp().globalData.statusBarHeight) + 90 + "rpx";
    //#endif
    //#ifdef H5
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    // 90 - nav-bar设置的高度
    this.petBoxTop =
      pxToRpx(getApp().globalData.h5StatusBarHeight) + 90 + "rpx";
    //#endif
  },
  onReady() {},
  onUnload() {
    this.clearInstance();
  },
  async onShow() {
    getPetList({ userId: this.$dsBridge && this.$dsBridge.call("getUserId", "getUserId") || this.userInfo.userId }).then((res) => {
      if (
        res.data &&
        res.data.length &&
        res.data.length !== this.petList?.length
      ) {
        this.petList = res.data;
        const selectPet = res.data.find((i) => i.id == this.petId);
        const resultPetData =
          this.petId && this.consultationId ? selectPet : res.data[0];
        console.log("设置宠物", resultPetData, selectPet);
        this.selectedPet = resultPetData;
        this.petId = this.selectedPet.id;
        this.selectItem(this.selectedPet);
        // 滚动到选择的宠物
        this.$nextTick(() => {
          this.petScrollToViewData = `pet_item_${this.selectedPet.id}`;
        });

        if (this.selectPetItem.id) {
          return;
        }
        this.selectPetItem = selectPet;
      }
    });

    this.checkUserQualificationRequest();

    const consultationInfo = uni.getStorageSync("submit_consultation_info");
    // 针对submit异常返回可能会丢失消息，需要续接获取历史消息的逻辑
    console.log("获取到续接消息", consultationInfo);
    if (consultationInfo) {
      const { from, consultationId } = consultationInfo;
      this.from = from;
      this.consultationId = consultationId;
      // 赋值完成立刻清除，防止其他异常场景
      uni.removeStorageSync("submit_consultation_info");
    }
    this.$nextTick(async () => {
      this.inquiryOrderDetailHandler();
      this.RYconnectMethod();
    });
  },
  data() {
    return {
      petScrollToViewData: "",
      originalPrice: 0,
      discountedPrice: 0,
      warmShow: false, //温馨提醒
      from: "",
      consultationId: "",
      userGroupId: "",
      deadlineTime: "",
      sheetId: "", //引流的问诊单id
      yuList: [
        {
          name: "已接种",
          key: 1,
          checked: false,
        },
        {
          name: "未接种",
          key: 2,
          checked: false,
        },
        // {
        //   name: "接种不全",
        //   key: 3,
        //   checked: false,
        // },
        // {
        //   name: "接种不详",
        //   key: 4,
        //   checked: false,
        // },
      ],
      quList: [
        {
          name: "定时驱虫",
          key: 1,
          checked: false,
        },
        // {
        //   name: "未定时驱虫",
        //   key: 2,
        //   checked: false,
        // },
        {
          name: "未做驱虫",
          key: 3,
          checked: false,
        },
      ],
      diseaseTimeList: [
        {
          name: "小于3天",
          key: "小于3天",
          checked: false,
        },
        {
          name: "3-7天",
          key: "3-7天",
          checked: false,
        },
        {
          name: "1-3周",
          key: "1-3周",
          checked: false,
        },
        {
          name: "3周以上",
          key: "3周以上",
          checked: false,
        },
      ],
      inquiryType: "EXPERT", //QUICK 快速 EXPERT 专家
      diseaseImgs: [],
      illnessDesc: "",
      isPetShow: false,
      petId: "",
      selectPetItem: {},
      petList: [],
      diseaseList: [],
      doctorUserId: "",
      groupId: "",
      upLoadDeletable: true,
      resourceId: "",
      resourceType: "",
      sheetData: "",
      weightData: null,
      testFormatter: (val) => (val.length > 500 ? val.slice(0, 500) : val),
      checkboxValue: [],
      isAientry: "", //是否企微进入
      selectedPet: {}, //选中宠物
      statusBarHeight: 0,
      filesShow: true, //宠物档案是否有内容
      doctorShow: false, //连接医生load
      // 宠物时间
      petDate: null,
      // 宠物时间弹窗
      isShowDate: false,
      // 公共疫苗-驱虫类型-驱虫品牌-弹窗
      isShowPop: false,
      // 公共弹层数据
      columns: [],
      // 公共弹窗标题
      secondName: "",
      //宠物档案体重信息
      filesWeight: {
        time: "",
        weight: "",
      },
      //宠物档案疫苗信息
      filesVaccine: {
        vaccine: "", //接种疫苗情况 1：已接种疫苗；2：未接种疫苗
        vaccineType: "", //疫苗类型
        vaccineTypeId: "", //疫苗类型Id
        vaccineTime: "", //接种疫苗时间  "yyyy-MM-dd HH:mm:ss"
      },
      //宠物档案驱虫信息
      filesInsect: {
        expelInsects: "", // 是否驱虫 1：定时驱虫；2：未做驱虫
        expelInsectsType: "", //驱虫类型
        expelInsectsTypId: "", // 驱虫类型Id
        expelInsectsBrand: "", //驱虫品牌
        expelInsectsBrandId: "", //驱虫品牌Id
        expelInsectsTime: "", //驱虫时间 "yyyy-MM-dd HH:mm:ss"
      },
      waitingTimer: null,
      timeOutId: null,
      secondNum: 0,
      petBoxTop: 0, // 选择宠物区域的定位高度
      hasPetBoxStickyClass: false, // 是否开启选择宠物区域样式
      // 大弹窗
      healthPopShow: false,
      insectList: [], //驱虫数据列表
      healthType: null,
      petInfoObj: {
        petIds: "1810904736532234242", // 宠物id
        petType: "DOG", // // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
        sex: "1", // 性别: 1-GG, -2MM
        date: "2024-11-01 00:00", // 时间
        drugId: "673c07e54f69c42afb221d71", // 驱虫品牌id
        drugName: "欣宠克", // 驱虫品牌name
        typeId: "6735b0aabbf92b477c533585", // 驱虫/疫苗类型 id
        typeName: "哺乳期", // 驱虫/疫苗类型 name
        weight: "23", // 体重
        specailMark: "", // 特殊时期mark
      },
      isSubmitting: false, // 防止多次提交
      isAlienPet: false, // 是否异宠
      isScroll: false, // 是否滚动
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    allowSubmit() {
      const reg = /^(?:[+-]?)(?:0|[1-9]\d*|0[1-9]\d*)(\.\d{1,2})?$/;
      // const reg = /^[+-]?(0|([1-9]\d*))(\.\d{1,2})?$/;
      const yuAllow = this.yuList.find((y) => y.checked);
      const quAllow = this.quList.find((q) => q.checked);
      const tagAllow = this.diseaseList.find((q) => q.checked);
      const weightAllow = reg.test(this.weightData) && this.weightData <= 1000;
      // 关于异宠修改校验
      if (!this.isAlienPet) {
        return !!(
          yuAllow &&
          quAllow &&
          tagAllow &&
          this.illnessDesc &&
          this.weightData &&
          weightAllow &&
          this.checkboxValue?.length
        );
      } else {
        return !!(tagAllow && this.illnessDesc && this.checkboxValue?.length);
      }
    },
  },
  mixins: [chatMixins],
  // mounted() {
  //   getPetList({ userId: this.userInfo.userId }).then((res) => {
  //     const selectPet = res.data.find((i) => i.id == this.petId);

  //     this.selectPetItem = selectPet;
  //     this.petList = res.data;
  //     this.petId = selectPet.id;
  //   });
  // },
  methods: {
    async inquiryOrderDetailHandler() {
      if (!this.consultationId) {
        return;
      }
      // 针对携带问诊单id的需要查询问诊单详情
      const res = await inquiryOrderDetail({
        id: this.consultationId,
      });
      if (res.data) {
        // 症状类型
        const { symptomType, petInformation } = res.data;
        //      上传症状图片    描述爱宠病情    症状出现时长
        const {
          symptomImags,
          illnessDesc,
          symptomDuration,
          weight,
          vaccineDetail,
          expelInsectsDetail,
        } = petInformation;
        console.log(
          "res.data",
          symptomType,
          illnessDesc,
          petInformation,
          weight
        );
        // 症状类型赋值
        this.diseaseList.forEach((item) => {
          const findData = symptomType.find(
            (symptomTypeItem) => symptomTypeItem.tagId === item.tagId
          );
          item.checked = !!findData;
        });
        // 描述爱宠病情赋值
        this.illnessDesc = illnessDesc;
        // 上传症状图片赋值
        this.diseaseImgs = (symptomImags || []).map((url) => {
          return {
            url,
            status: "success",
            message: "",
          };
        });
        // 症状出现时长 diseaseTimeList
        this.diseaseTimeList.forEach((item) => {
          item.checked = item.key === symptomDuration;
        });
        // 已经阅读协议
        this.checkboxValue = [""];
        // 当前体重
        this.weightData = weight;

        // 请选择疫苗接种情况
        if (this.yuList && this.yuList.length > 0) {
          if (vaccineDetail?.vaccine == 1) {
            this.yuList[0].checked = true;
          } else if (vaccineDetail?.vaccine == 0) {
            this.yuList[1].checked = true;
          }
        }
        // 请选择驱虫情况
        if (this.quList && this.quList.length > 0) {
          if (expelInsectsDetail?.expelInsects == 0) {
            this.quList[1].checked = true;
          } else if (expelInsectsDetail?.expelInsects == 1) {
            this.quList[0].checked = true;
          }
        }
      }
    },
    // 查询用户当前问诊单的相关信息
    async checkUserQualificationRequest() {
      try {
        let source = "IOS";
        //#ifdef H5
        source = this.$dsBridge.call("getAppInfo", "os") ?? "IOS";
        // #endif

        /**
         * 查询用户当前问诊单的相关信息
         * @return
         * 那个result含义是这些
         * 问诊资格校验响应结果 1有问诊次数；2有可用问诊卡券；3无问诊资格；4存在服务中问诊单；5收费
         * */
        const checkUserQualificationRes = await checkUserQualification(
          {
            source,
            doctorUserId: this.doctorUserId,
            inquiryType: this.inquiryType,
            checkServiceSheetFlag: false, // 静默不需要查询当前用户是否有问诊单
          },
          "v2"
        );
        const { result, goods } = checkUserQualificationRes.data;
        //             原价            折扣价
        const { skuId, originalPrice, discountedPrice } = goods;
        this.originalPrice = originalPrice;
        this.discountedPrice = discountedPrice;
      } catch (e) {}
    },
    getListName(arr) {
      const findData = arr.find((item) => item.checked);
      return findData ? findData.name : "";
    },
    // 引流回显
    async getAISheetInfo(sheetId) {
      const res = await getAISheetInfoApi({ id: sheetId });
      this.petId = res.data.petId;
      this.illnessDesc = res.data.illnessDesc || "";
      this.diseaseList = this.diseaseList.map((obj) => {
        const checked = res.data.symptomType.some(
          (value) => value === obj.tagName
        );
        return { ...obj, checked };
      });
    },
    handleChecked(type, item, key = "key", isMulti = false) {
      this[type] = this[type].map((y) => {
        if (y[key] === item[key]) {
          return {
            ...y,
            checked: !y.checked,
          };
        } else if (!isMulti) {
          return {
            ...y,
            checked: false,
          };
        }
        return y;
      });
    },
    // 获取病症分类
    async _getDiseaseTag() {
      try {
        const { data } = await getTag({
          bizType: "CONSULTATION_SYMPTOM",
        });
        if (data.ALL) {
          this.diseaseList = data.ALL;
        }
      } catch (e) {
        console.error("获取病症分类", e);
      }
    },
    handleChangePet() {
      this.isPetShow = true;
    },
    handlePetPopClose() {
      this.isPetShow = false;
    },
    //上一条问诊单详情
    async lastDetail() {
      const res = await GET_IN_SERVICE_LAST({ petId: this.petId });
      // this.sheetData = res.data;
      if (res.data && res.data.petInformation) {
        this.weightData = res.data.petInformation?.weight
      } else {
        this.weightData = ''
      }
    },
    handleSelectPet(item) {
      this.selectPetItem = item;
      this.petId = item.id;
      this.lastDetail();
    },
    handleMessage() {
      // this.$refs.symptomPopup.openModal({
      //   diseaseName: '温馨提醒',
      //   text: '医生暂时离开，退款将原路返回您的账户'
      // })
      // return;
      console.log(
        "体重:::::",
        !this.filesShow && !this.isAlienPet && this.weightData <= 0,
        this.weightData,
        this.filesWeight.weight
      );
      if (!this.filesShow && !this.isAlienPet && this.filesWeight.weight <= 0) {
        uni.showToast({
          title: "请输入体重",
          icon: "none",
        });
        return;
      } else if (
        !this.filesShow &&
        !this.isAlienPet &&
        !this.filesVaccine.vaccineType
      ) {
        uni.showToast({
          title: "请选择疫苗接种",
          icon: "none",
        });
        return;
      } else if (
        !this.filesShow &&
        !this.isAlienPet &&
        !this.filesInsect.expelInsectsType
      ) {
        uni.showToast({
          title: "请选择驱虫情况",
          icon: "none",
        });
        return;
      }

      var that = this;
      if (
        (this.weightData < 0 || this.weightData == 0) &&
        !this.isAlienPet &&
        this.filesShow
      ) {
        uni.showToast({
          title: "输入的体重必须大于0",
          icon: "none",
        });
        return;
      }
      if (this.isSubmitting) {
        console.log("请求中");
        return;
      }
      if (this.allowSubmit) {
        const yuAllow = this.yuList.find((y) => y.checked);
        const quAllow = this.quList.find((q) => q.checked);
        const tagAllow = this.diseaseList.filter((q) => q.checked);
        const timeAllow = this.diseaseTimeList.find((q) => q.checked);

        let petType = "OTHER";
        if (this.selectPetItem.petCategoryId === 1) {
          petType = "CAT";
        }
        if (this.selectPetItem.petCategoryId === 50) {
          petType = "DOG";
        }
        const now = dayjs();
        const formatted = now.format("YYYY-MM-DD HH:mm:ss");
        const params = {
          // couponNo: this.couponNo,
          inquiryType: this.inquiryType,
          resourceId: this.resourceId,
          resourceType: this.resourceType,
          doctorUserId: this.doctorUserId,
          groupId: this.groupId,
          preFilledInfo: {
            gender: this.selectPetItem.sex,
            ...this.selectPetItem,
            petId: this.selectPetItem.id,
            age: this.selectPetItem.guardTime,
            petType,
            // vaccine: this.isAlienPet ? "" : yuAllow.key,
            // expelInsects: this.isAlienPet ? "" : quAllow.key,
            illnessDesc: this.illnessDesc,
            weight: this.weightData,
            recordWeightTime: this.filesWeight.time
              ? dayjs(this.filesWeight.time).format("YYYY-MM-DD HH:mm:ss")
              : formatted,
            //驱虫详情
            expelInsectsDetail: this.filesInsect,
            //疫苗详情对象
            vaccineDetail: this.filesVaccine,
          },
          symptomType: tagAllow,
          source: "WECHAT_XCX",
          lon: uni.getStorageSync("lon") || "", //经度
          lat: uni.getStorageSync("lat") || "", //维度
          aiConsultationId: this.sheetId || "",
          sourceOrderType: 5, // 移动小程序开单
        };

        // #ifdef H5
        params.source = this.$dsBridge.call("getAppInfo", "os");
        // #endif
        if (!params.preFilledInfo.expelInsectsDetail.expelInsectsType) {
          params.preFilledInfo.expelInsects = this.isAlienPet
            ? ""
            : quAllow.key;
        } else {
          params.preFilledInfo.expelInsectsDetail.expelInsects = this.isAlienPet
            ? ""
            : quAllow.key;
        }
        if (!params.preFilledInfo.vaccineDetail.vaccineType) {
          params.preFilledInfo.vaccine = this.isAlienPet ? "" : yuAllow.key;
        } else {
          params.preFilledInfo.vaccineDetail.vaccine = this.isAlienPet
            ? ""
            : yuAllow.key;
        }
        if (
          params &&
          params.preFilledInfo &&
          params.preFilledInfo.expelInsectsDetail &&
          params.preFilledInfo.expelInsectsDetail.expelInsectsTime
        ) {
          params.preFilledInfo.expelInsectsDetail.expelInsectsTime = dayjs(
            params.preFilledInfo.expelInsectsDetail.expelInsectsTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }
        if (
          params &&
          params.preFilledInfo &&
          params.preFilledInfo.vaccineDetail &&
          params.preFilledInfo.vaccineDetail.vaccineTime
        ) {
          params.preFilledInfo.vaccineDetail.vaccineTime = dayjs(
            params.preFilledInfo.vaccineDetail.vaccineTime
          ).format("YYYY-MM-DD HH:mm:ss");
        }

        // #ifdef H5
        params.sourceOrderType = 4; // app开单
        try {
          const local = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
            ? JSON.parse(
                this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
                {}
              )
            : {};
          console.log(local, "localJson");
          const {
            lat = "", // 无定位时默认城市中心点
            lon = "", // 无定位时默认城市中心点
            cityCode = "", // 城市编码
          } = local;
          params.lon = lon ? (lon == "0.0" ? "" : lon) : "";
          params.lat = lat ? (lat == "0.0" ? "" : lat) : ""; //兼容ios空值返回0.0
        } catch (e) {
          console.log("获取定位信息失败");
        }
        // #endif

        if (timeAllow) {
          params.preFilledInfo.symptomDuration = timeAllow.key;
        }

        if (this.diseaseImgs.length > 0) {
          params.preFilledInfo.symptomImags = this.handleUploadImg(
            this.diseaseImgs
          );
        }

        console.log("submit:", params);
        if (this.inquiryType == "QUICK") {
          this.isSubmitting = true;
          submitMessageQuick(params, "v2")
            .then(async (res) => {
              console.log("dddddd", res);
              // #ifdef MP-WEIXIN
              // that.$uma.trackEvent("pet_pre_ask", {
              //   user_id: uni.getStorageSync("userId"),
              //   type: "QUICK",
              // });
              if (this.isAientry) {
                action_report({
                  action_name: "freeconsultation_submit_confirm_clk",
                  module_name: "MEDICAL",
                  extend: {
                    source: "WECHATIM",
                  },
                });
              }
              // #endif
              const { userGroupId, preemptWaitDuration, consultationId } =
                res.data;

              uni.removeStorageSync("aientry");

              // uni.redirectTo({
              //   url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
              //     res.data
              //   )}&fromOrigin=new&inquiryType=QUICK`,
              // });
            })
            .finally(() => {
              this.isSubmitting = false;
            });
        } else {
          // 专家问诊-需要保存填写信息，如果需要付费则是在跳转订单确认创单
          cachePaidConsultationInfo(params, "v2").then(async (res) => {
            // 跳转至确认订单页面 https://dev-cpp.chongpangpang.com/crm-medical-h5/#/pagesD/inquiryOrderSubmit/index?cid=106936185777885184_1732691869868&skuId=1753985499261607937&originalPrice=29&discountedPrice=0.01
            /**
             * 需要兼容老版本指定场景，派单需要走v2
             * */
            const cid = res.data;
            let source = "IOS";
            //#ifdef H5
            source = this.$dsBridge.call("getAppInfo", "os");
            // #endif

            /**
             * 查询用户当前问诊单的相关信息
             * @return
             * 那个result含义是这些
             * 问诊资格校验响应结果 1有问诊次数；2有可用问诊卡券；3无问诊资格；4存在服务中问诊单；5收费
             * */
            const checkUserQualificationRes = await checkUserQualification(
              {
                source,
                inquiryType: this.inquiryType,
                checkServiceSheetFlag: false, // 静默不需要查询当前用户是否有问诊单
                doctorUserId: this.doctorUserId,
              },
              "v2"
            );

            /**
             * {
             *  "result":5,
             *  "consultationSheet":null,
             *  "goods": {
             *      "originalPrice":29,
             *      "discountedPrice":0.01,
             *      "skuId":"1753985499261607937",
             *      "discountTypeText":"限时优惠"
             *    }
             *  }
             *
             * */
            console.log(checkUserQualificationRes);

            // 跳转至确认订单页面 https://dev-cpp.chongpangpang.com/crm-medical-h5/#/pagesD/inquiryOrderSubmit/index?cid=106936185777885184_1732691869868&skuId=1753985499261607937&originalPrice=29&discountedPrice=0.01

            const { result, goods } = checkUserQualificationRes.data;
            // 收费场景-跳转至确认订单页面
            if (+result === 5) {
              const { skuId, originalPrice, discountedPrice } = goods;
              // #ifdef MP-WEIXIN
              uni.redirectTo({
                url: `/pagesD/inquiryOrderSubmit/v2/index?cid=${cid}&skuId=${skuId}&originalPrice=${originalPrice}&discountedPrice=${discountedPrice}`,
              });
              // #endif

              // #ifdef H5
              this.$dsBridge.call("gotoPageThroughRoute", {
                page: `${window.location.origin}/crm-medical-h5/#/pagesD/inquiryOrderSubmit/v2/index?cid=${cid}&skuId=${skuId}&originalPrice=${originalPrice}&discountedPrice=${discountedPrice}&transparentTopBar=1`,
              });
              // #endif
            } else {
              //免费场景创单
              this.isSubmitting = true;
              submitMessage(params, "v2").finally(() => {
                this.isSubmitting = false;
              });
            }

            // #ifdef MP-WEIXIN
            // that.$uma.trackEvent("pet_pre_ask", {
            //   user_id: uni.getStorageSync("userId"),
            //   type: "EXPERT",
            // });
            // #endif
            // uni.redirectTo({
            //   url: `/pagesA/bussinessOrder/confirmOrderPage/v2/index?diagnosticSheetId=${consultationId}&fromOrigin=new&inquiryType=EXPERT`,
            // });
          });
        }
      }
    },
    renderYuText(type) {
      const types = {
        0: "绝育未知",
        1: "未绝育",
        2: "已绝育",
      };
      if (!type) return types[0];
      return types[type];
    },
    handleUploadImg(imgs) {
      if (typeof imgs !== "object") {
        return imgs;
      }

      if (!Array.isArray(imgs)) {
        return imgs.url;
      }

      const arr = imgs.map((item) => {
        return item.url;
      });
      // console.log("7777777", arr);

      return arr;
    },
    // 删除图片
    deletePic(event) {
      console.log("删除图片", event);
      this.diseaseImgs.splice(event.index, 1);
    },
    //新增图片
    async afterRead(event) {
      try {
        this.upLoadDeletable = false;
        console.log("新增图片event", event);
        this.diseaseImgs.push({
          status: "uploading",
          message: "上传中",
          ...event.file,
        });

        const length = this.diseaseImgs.length;

        // console.log("dfsdfds", {
        //   status: "uploading",
        //   message: "上传中",
        //   ...event.file,
        // });

        const res = await this._uploadFile(event.file);
        this.diseaseImgs.splice(length - 1, 1, {
          ...event.file,
          status: "success",
          message: "",
          url: res.data,
        });

        // console.log(
        //   "3333333",
        //   {
        //     ...event.file,
        //     status: "success",
        //     message: "",
        //     url: res.data,
        //   },
        //   this.diseaseImgs
        // );
      } catch (e) {
        console.error("新增图片", e);
      } finally {
        this.upLoadDeletable = true;
      }
    },

    _uploadFile(file) {
      return new Promise((resolve, reject) => {
        const url = process.env.NODE_ENV?.includes("local")
          ? "/api/"
          : BASR_URL;

        uni.uploadFile({
          // url: BASR_URL + "cpp-common-management/v1/file/upload",
          url: url + "cpp-common-management/v1/file/upload",
          filePath: file.url,
          name: "file",
          header: {
            Authorization: uni.getStorageSync("storage_info").token,
            fromChannel: "MP",
          },
          formData: {
            file: file.url,
          },
          success: (uploadFileRes) => {
            resolve(uploadFileRes);
          },
          fail: (res) => {
            console.log(res);
            reject(res);
          },
        });
      });
    },

    handleGetWeight(weight) {
      this.weightData = weight;
    },
    handleWeightChange(val) {
      console.log("val", val);
      // 允许输入数字、小数点和以零开头的情况
      let cleanedValue = val.replace(/[^0-9.]/g, "");

      // 确保只有一个零开头
      if (
        cleanedValue.startsWith("0") &&
        cleanedValue.length > 1 &&
        cleanedValue[1] !== "."
      ) {
        cleanedValue = "0" + cleanedValue.slice(1).replace(/^0+/, "");
      }
      if (cleanedValue[0] === ".") {
        cleanedValue = "0" + cleanedValue.slice(0).replace(/^0+/, "0.");
      }
      if (cleanedValue === "0.0") {
        cleanedValue = "0";
      }
      // 确保只有一个小数点
      cleanedValue = cleanedValue.replace(/(\..*)\./g, "$1");

      // 保留一位小数
      cleanedValue = cleanedValue.replace(/(\.\d)\d*/, "$1");
      this.$nextTick(() => {
        if (cleanedValue !== val) {
          this.weightData = cleanedValue;
        } else {
          if (Number(cleanedValue) > 1000) {
            uni.showToast({
              title: "最高输入1000kg",
              icon: "none",
            });
            cleanedValue = "1000";
          }
          this.weightData = cleanedValue;
        }
      });
    },
    checkboxChange(n) {
      // if (n.length) {
      //   uni.setStorageSync("agreement", true);
      // }
      this.checkboxValue = n.length ? [""] : [];
    },
    goAgreement() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: "/pagesA/webView/index?route=/meow-interface/html/oxygen-pet.html&type=jump&title=隐私协议",
      });
      // #endif
      // #ifdef H5
      const h5Domain = {
        dev: "https://cn-dev02-shareactivity.chongpangpang.com/#",
        jumpdev: "https://cn-dev02-shareactivity.chongpangpang.com",
        // dev: "http://172.16.200.41:3000/#",
        pro: "https://shareactivity.chongpangpang.com/#",
        jumppro: "https://shareactivity.chongpangpang.com",
        pre: "https://cn-test01-shareactivity.chongpangpang.com/#",
        jumppre: "https://cn-test01-shareactivity.chongpangpang.com",
      };
      const jumpEnv =
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
          ? "jumpdev"
          : process.env.NODE_ENV === "pre"
          ? "jumppre"
          : "jumppro";
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${h5Domain[jumpEnv]}/meow-interface/html/oxygen-pet.html`,
      });
      // #endif
    },
    // testFormatter(val) {
    //   return val.length > 500 ? val.slice(0, 500) : val;
    // },
    // 跳转添加宠物
    addPetsMethod() {
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesD/petInfo/index?type=${this.inquiryType}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesD/petInfo/index?nopet=nopet&type=${this.inquiryType}&apptype=add&transparentTopBar=1`,
      });
      // #endif
    },
    // 选中宠物某一项目
    selectItem(item) {
      if (!item) {
        return;
      }
      this.selectedPet = item;
      this.selectPetItem = item;
      this.petId = item.id;
      console.log(item, "889977");
      // 判断是否异宠 清除宠物档案
      if (item.catPet || item.dogPet) {
        console.log("不是异宠");
        this.isAlienPet = false;
        this.getHealthFiles();
      } else {
        console.log("是异宠");
        this.isAlienPet = true;
        if (!this.consultationId) this.weightData = "";
        this.filesInsect = {};
        this.filesVaccine = {};
      }
    },
    // 获取宠物档案
    getHealthFiles() {
      healthFiles({
        userId: this.$dsBridge && this.$dsBridge.call("getUserId", "getUserId") || this.userInfo.userId,
        petId: this.selectedPet.id,
      }).then((res) => {
        if (res.data?.length == 0) {
          this.filesShow = true;
          // 清空本地档案数据
          this.filesVaccine.vaccineType = "";
          this.filesVaccine.vaccineTime = "";
          this.filesVaccine.vaccineTypeId = "";
          this.filesVaccine.vaccine = "";
          this.filesInsect.expelInsectsType = "";
          this.filesInsect.expelInsectsBrand = "";
          this.filesInsect.expelInsectsTime = "";
          this.filesInsect.expelInsects = "";
          this.filesInsect.expelInsectsTypId = "";
          this.filesInsect.expelInsectsBrandId = "";
          this.filesWeight.weight = "";
          this.filesWeight.time = "";
          if (!this.consultationId) this.weightData = "";
          this.yuList[0].checked = false;
          this.quList[0].checked = false;
          this.yuList[1].checked = false;
          this.quList[1].checked = false;
        } else {
          // 清空本地档案数据
          // this.filesShow = false;
          this.filesData = res.data;
          this.filesVaccine.vaccineType = "";
          this.filesVaccine.vaccineTime = "";
          this.filesVaccine.vaccineTypeId = "";
          this.filesVaccine.vaccine = "";
          this.filesInsect.expelInsectsType = "";
          this.filesInsect.expelInsectsBrand = "";
          this.filesInsect.expelInsectsTime = "";
          this.filesInsect.expelInsects = "";
          this.filesInsect.expelInsectsTypId = "";
          this.filesInsect.expelInsectsBrandId = "";
          this.filesWeight.weight = "";
          this.filesWeight.time = "";
          this.yuList[0].checked = false;
          this.quList[0].checked = false;
          this.yuList[1].checked = false;
          this.quList[1].checked = false;
          if (!this.consultationId) this.weightData = "";

          // 有宠物档案数据赋值
          res.data.forEach((element) => {
            if (element.mark == "YI_MIAO") {
              this.filesVaccine.vaccineTypeId = element.vaccineInfo?.typeId;
              this.filesVaccine.vaccineType = element.vaccineInfo?.typeName;
              this.filesVaccine.vaccineTime = element.recordTimeHm;
              this.filesVaccine.vaccine = element.vaccineInfo.status;
              if (this.filesVaccine.vaccine == 1) {
                this.yuList[0].checked = true;
              } else {
                this.yuList[0].checked = false;
              }
              if (this.filesVaccine.vaccineType) {
                this.yuList[0].checked = true;
              }
            }
            if (element.mark == "QU_CHONG") {
              this.filesInsect.expelInsectsType =
                element.anthelminticInfo?.typeName;
              this.filesInsect.expelInsectsBrand =
                element.anthelminticInfo?.drugName;
              this.filesInsect.expelInsectsTime = element.recordTimeHm;
              this.filesInsect.expelInsects = element.anthelminticInfo.status;
              this.filesInsect.expelInsectsTypId =
                element.anthelminticInfo?.typeId;
              this.filesInsect.expelInsectsBrandId =
                element.anthelminticInfo?.drugId;
              if (  this.filesInsect.expelInsects == 1 &&
                    this.filesInsect.expelInsectsType &&
                    this.filesInsect.expelInsectsBrand
              ) {
                this.quList[0].checked = true;
              } else {
                this.quList[0].checked = false;
              }
            }
            if (element.mark == "TI_ZHONG") {
              this.filesWeight.weight = element.weight;
              this.filesWeight.time = element.recordTimeHm;
              this.weightData = element.weight;
            }
          });
          let markList = (res.data || []).map((markItem) => markItem.mark);
          if (
            markList.includes("YI_MIAO") &&
            this.filesVaccine.vaccineType &&
            markList.includes("QU_CHONG") &&
            this.filesInsect.expelInsectsType &&
            markList.includes("TI_ZHONG")
          ) {
            this.filesShow = false;
          } else {
            this.filesShow = true;
          }
        }
      });
    },

    handleNavBack() {
      //#ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      //#endif
      //#ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      //#endif
    },
    // 获取 宠物健康-元数据（疫苗/驱虫）
    getHealthMetadata(mark, dsc) {
      let petType = "OTHER";
      if (this.selectedPet.petCategoryId === 1) {
        petType = "CAT";
      }
      if (this.selectedPet.petCategoryId === 50) {
        petType = "DOG";
      }
      const params = {
        mark: mark, // 条目标记不能为空
        petType: petType, //"DOG", // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"
        sex: this.selectedPet.sex, // "1", // 性别: 1-GG, -2MM
      };
      GET_HEALTH_METADATA(params).then((res) => {
        this.columns = res.data;
        this.isShowPop = true;
      });
    },
    openDatePicker() {
      this.isShowDate = true;
    },
    openCommonPicker(type) {
      //1疫苗 2驱虫类型 3驱虫品牌
      if (type == "2") {
        this.secondName = "驱虫类型";
        this.getHealthMetadata("QU_CHONG_LEI_XING_V2");
      }
      if (type == "3") {
        if (!this.insectMark) {
          uni.showToast({
            title: "请先选择驱虫类型",
            icon: "none",
          });
          return;
        }
        this.secondName = "驱虫品牌";
        this.getHealthMetadata(this.insectMark);
        // this.isShowPop = true;
      }
    },
    openFiles(type) {
      // 1 疫苗 2 驱虫 3 体重 4 特殊时期
      this.healthType = type;

      console.log(this.selectedPet, "this.selectedPet1111");
      this.healthPopShow = true;

      let petType = "OTHER";
      if (this.selectedPet.petCategoryId === 1) {
        petType = "CAT";
      }
      if (this.selectedPet.petCategoryId === 50) {
        petType = "DOG";
      }
      this.petInfoObj.petIds = this.selectedPet.id; //宠物id
      this.petInfoObj.sex = this.selectedPet.sex; // 性别: 1-GG, -2MM
      this.petInfoObj.petType = petType; // 宠物类型:CAT-猫,DOG-狗，OTHER-其他"

      if (type == "1") {
        this.petInfoObj.date = this.filesVaccine.vaccineTime; // 时间
      }
      if (type == "2") {
        this.petInfoObj.date = this.filesInsect.expelInsectsTime; // 时间
      }
      if (type == "3") {
        this.petInfoObj.date = this.filesWeight.time; // 时间
      }

      this.petInfoObj.drugId = this.filesInsect.expelInsectsBrandId; // 驱虫品牌id
      this.petInfoObj.drugName = this.filesInsect.expelInsectsBrand; // 驱虫品牌name

      if (type == "1") {
        this.petInfoObj.typeId = this.filesVaccine.vaccineTypeId; // 驱虫/疫苗类型 id
        this.petInfoObj.typeName = this.filesVaccine.vaccineType; // 驱虫/疫苗类型 name
      }

      if (type == "2") {
        this.petInfoObj.typeId = this.filesInsect.expelInsectsTypId; // 驱虫/疫苗类型 id
        this.petInfoObj.typeName = this.filesInsect.expelInsectsType; // 驱虫/疫苗类型 name
      }

      this.petInfoObj.weight = this.filesWeight.weight; // 体重
      this.petInfoObj.specailMark = this.insectMark; // 特殊时期mark
      console.log(this.petInfoObj, "this.petInfoObj");
    },
    // 时间选择
    handleDateChange(data) {
      console.log(data, "data");
      this.petDate = data;
      // this.healthData[this.healthType - 1].children.map((item) => {
      //   if (item.id === this.openPopId) {
      //     item.selectedObj = data;
      //     item.name = data;
      //   }
      // });
    },
    // 大弹窗回调
    healthPopComplete(data) {
      console.log(data, "data大");
      if (this.healthType == 1) {
        this.filesVaccine.vaccineType = data.typeName;
        this.filesVaccine.vaccineTypeId = data.typeId;
        this.filesVaccine.vaccineTime = data.date;
        this.yuList[0].checked = true;
      }

      if (this.healthType == 2) {
        this.filesInsect.expelInsectsType = data.typeName;
        this.filesInsect.expelInsectsTypId = data.typeId;
        this.filesInsect.expelInsectsBrand = data.drugName;
        this.filesInsect.expelInsectsBrandId = data.drugId;
        this.filesInsect.expelInsectsTime = data.date;
        this.quList[0].checked = true;
      }
      if (this.healthType == 3) {
        this.filesWeight.time = data.date;
        this.filesWeight.weight = data.weight;
        this.weightData = data.weight;
      }

      // this.petDate = data;
    },
    handlePickerChange(data) {
      console.log(data, "data");
      if (this.secondName == "驱虫类型") {
        this.filesInsect.expelInsectsType = data ? data.name : "";
        this.filesInsect.expelInsectsTypId = data.id;
        this.filesInsect.expelInsectsBrand = "";
        this.filesInsect.expelInsectsBrandId = "";
        this.insectMark = data.mark; //驱虫品牌
      }
      if (this.secondName == "驱虫品牌") {
        this.filesInsect.expelInsectsBrand = data.name;
        this.filesInsect.expelInsectsBrandId = data.id;
      }

      // if ([1, 2].includes(this.healthType)) {
      //   this.getHealthMetadata(data.mark, "name");
      // }
      // if (this.openPopType === "typeId") {
      //   this.selectedParams.typeId = data.id;
      //   this.selectedParams.typeName = data.name;
      // } else if (this.openPopType === "typeName") {
      //   this.selectedParams.drugId = data.id;
      //   this.selectedParams.drugName = data.name;
      // }
    },
  },
  components: {
    ChangePetPop,
    DatePicker,
    CommonPicker,
    HealthPop,
    ConfirmPop,
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
