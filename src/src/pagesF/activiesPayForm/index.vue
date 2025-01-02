<template>
  <view class="pay-card">
    <cpp-navigation-bar bgColor="black"></cpp-navigation-bar>
    <view class="form-bgc"></view>
    <u-toast ref="uToast"></u-toast>
    <view class="main">
      <view class="form">
        <view class="bg-white">
          <view
            class="form-item"
            v-for="(item, inx) in formData"
            :key="item.key"
          >
            <view class="lable">
              <view class="text">{{ item.desc }}</view>
              <view class="required" v-if="item.isRequired">*</view>
            </view>
            <view class="com">
              <input
                class="formInput"
                :placeholder="`请输入${item.desc}`"
                :type="item.key == 'phone' ? 'number' : 'text'"
                :maxlength="item.maxLimit"
                v-model="item.value"
                v-if="item.type == 'text'"
              />
              <textarea
                class="formText"
                maxlength="50"
                v-if="item.type == 'textarea'"
                v-model="item.value"
                :placeholder="`请输入${item.desc}`"
              />
              <view v-if="item.type == 'radio'" class="radiowrap">
                <view
                  :class="[
                    'radioitem',
                    `${item.value == sitem.value ? 'selected' : ''}`,
                  ]"
                  v-for="(sitem, index) in item.values"
                  :key="sitem.value"
                  @click="radioChange(inx, sitem)"
                >
                  {{ sitem.label }}
                </view>
              </view>
              <view v-if="item.type == 'checkbox'" class="checkboxwrap">
                <view
                  :class="[
                    'checkitem',
                    `${item.value[index] == true ? 'selected' : ''}`,
                  ]"
                  v-for="(sitem, index) in item.values"
                  :key="sitem.value"
                  @click="checkboxChange(inx, index, sitem)"
                >
                  {{ sitem.label }}
                </view>
              </view>
              <view v-if="item.subTitle" class="subtitle">{{
                item.subTitle
              }}</view>
              <view v-if="item.type == 'image'" class="imagewrap">
                <view
                  class="imageicon"
                  @click="(data) => handlePhoto(inx, data)"
                  v-if="!item.value"
                ></view>
                <image
                  :src="item.value"
                  class="avatarurl"
                  v-if="item.value"
                  @click="(data) => handlePhoto(inx, data)"
                  mode="aspectFill"
                />
                <view class="tips"
                  >支持 jpg, png, gif, bmp, psd, tiff 等图片格式</view
                >
              </view>
            </view>
          </view>
          <!--  -->
          <div class="tips-txt" v-if="activityData.isSku">温馨提示：</div>
          <div
            class="tips-txt"
            v-if="activityData.isSku && activityData.refundDeadline > 24"
          >
            该活动开始前的最后{{
              activityData.refundDeadline / 24
            }}天内，我们将无法受理退款申请。请您谅解并合理安排您的计划。感谢您的支持和理解。
          </div>
          <div
            class="tips-txt"
            v-if="activityData.isSku && activityData.refundDeadline < 24"
          >
            该活动开始前的最后{{
              activityData.refundDeadline
            }}小时，我们将无法受理退款申请。请您谅解并合理安排您的计划。感谢您的支持和理解。
          </div>
        </view>
      </view>
    </view>
    <view class="footer">
      <view class="submit" @click="handleSubmit">下一步</view>
    </view>

    <!-- 排队提示弹窗 -->
    <QueuePrompt
      :show="orQueueShow"
      :msg="queuePromptContent"
      @cancel="orQueueShow = false"
    />
  </view>
</template>

<script>
import {
  COMMUNITY_ACTIVITY_DETAIL,
  getWhereOrder,
  getOrderQueue,
  submitFormData,
} from "@/api/activityclube";
import QueuePrompt from "../activityDetails/components/QueuePrompt.vue";
import { sendFormId, formId } from "@/utils/index";
import { BASR_URL } from "@/utils/http";
import cppNavigationBar from "../components/cpp-navigation-bar/cpp-navigation-bar";

export default {
  components: {
    QueuePrompt,
    cppNavigationBar,
  },
  data() {
    return {
      formData: {},
      activityData: null,
      aid: "",
      index: -1,
      activityTypeRef: "",
      isOrderList: {}, // 是否存在订单
      orQueueShow: false,
      queuePromptContent: "",
      quantityLimit: 0,
    };
  },
  onLoad(options) {
    if (options.aid) {
      this.aid = options.aid;
      this.index = options.index || 0;
      this.getActivity();
    }
  },
  methods: {
    handlePhoto(index, data) {
      const that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: data == 1 ? ["camera"] : ["album"],
        success: function (res) {
          uni.uploadFile({
            url: BASR_URL + "cpp-common-management/v1/file/upload",
            filePath: res.tempFilePaths[0],
            name: "file",
            header: {
              Authorization: uni.getStorageSync("storage_info").token,
              fromChannel: "MP",
            },
            formData: {
              file: res.tempFilePaths[0],
            },
            success: (uploadFileRes) => {
              console.log(uploadFileRes);
              //TODO
              that.$set(
                that.formData[index],
                "value",
                uploadFileRes.data || ""
              );
            },
            complete: (err) => {
              console.log(err);
            },
          });
        },
      });
    },
    radioChange(index, item) {
      this.$set(this.formData[index], "value", item.value);
    },
    checkboxChange(inx, index, item) {
      if (this.formData[inx].value[index]) {
        this.$set(this.formData[inx].value, index, false);
      } else {
        this.$set(this.formData[inx].value, index, true);
      }
      console.log("form", this.formData[inx].value);
    },
    async getActivity() {
      const { data } = await COMMUNITY_ACTIVITY_DETAIL({ id: this.aid });
      console.log("COMMUNITY_ACTIVITY_DETAIL data ", data);
      //this.formData = data.formExtend;
      this.formData = data.formExtend.map((item, index) => {
        return {
          ...item,
          value: item.type == "checkbox" ? {} : "",
        };
      });
      // this.formData = [
      //   {
      //     desc: '姓名',
      //     isRequired: 1,
      //     key: "realName",
      //     maxLimit: 10,
      //     type: 'text'
      //   },
      //   {
      //     desc: '手机号',
      //     isRequired: 1,
      //     key: "phone",
      //     maxLimit: 11,
      //     type: 'text'
      //   },
      //   {
      //     desc: '宝贝昵称',
      //     isRequired: 1,
      //     key: "nickName",
      //     maxLimit: 11,
      //     type: 'text'
      //   },
      //   {
      //     desc: '参与本次活动的目的？',
      //     isRequired: 1,
      //     key: "target",
      //     maxLimit: 11,
      //     type: 'checkbox',
      //     values:[
      //       {
      //         "value":"1",
      //         "label":"给毛孩子找对象"
      //       },
      //       {
      //         "value":"2",
      //         "label":"带毛孩子来娱乐社交"
      //       },
      //       {
      //         "value":"3",
      //         "label":"让毛孩子自己挣嫁妆和彩礼"
      //       },
      //     ]
      //   },
      //   {
      //     desc: '宝贝品种',
      //     isRequired: 1,
      //     key: "petType",
      //     maxLimit: 11,
      //     type: 'text'
      //   },
      //   {
      //     desc: '宝贝年龄',
      //     isRequired: 1,
      //     key: "age",
      //     maxLimit: 11,
      //     type: 'text'
      //   },
      //   {
      //     desc: '宝贝性别',
      //     isRequired: 1,
      //     key: "sex",
      //     type: 'radio',
      //     values:[
      //       {
      //         "value":"1",
      //         "label":"gg"
      //       },
      //       {
      //         "value":"2",
      //         "label":"mm"
      //       },
      //       {
      //         "value":"3",
      //         "label":"未知"
      //       }
      //     ]
      //   },
      //   {
      //     desc: '宝贝擅长的',
      //     isRequired: 1,
      //     key: "good",
      //     type: 'text',
      //     maxLimit: 11,
      //   },
      //   {
      //     desc: '请上传一张爱宠的靓照',
      //     subTitle: '我们将打印出来哦～',
      //     isRequired: 1,
      //     key: "image",
      //     type: 'image'
      //   },
      // ].map((item, index) => {
      //   return {
      //     ...item,
      //     value: item.type == 'checkbox' ? {} : ''
      //   }
      // })

      this.activityTypeRef = data.activityType;
      this.quantityLimit = data.isSku ? 99999999 : data.quantityLimit;
      this.activityData = data;
      if (data.isSku) {
        this.ticketData = data.tickets[this.index];
        console.log("this.index ", this.index);
        console.log("data.tickets ", data.tickets);
      }
    },
    showToast(params) {
      this.$refs.uToast.show({
        ...params,
      });
    },
    handleSubmit() {
      for (let i = 0; i < this.formData.length; i++) {
        if (this.formData[i].isRequired && !this.formData[i].value) {
          return this.showToast({ message: `请输入${this.formData[i].desc}` });
        }
        if (this.formData[i].type == "checkbox") {
          if (!Object.values(this.formData[i].value).includes(true)) {
            return this.showToast({
              message: `请输入${this.formData[i].desc}`,
            });
          }
        }
      }
      const phoneItem = this.formData.find((f) => f.key === "phone");
      if (phoneItem) {
        const reg =
          /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
        if (!reg.test(phoneItem.value)) {
          return this.showToast({ message: `请输入正确的手机号` });
        }
      }
      const formObj = {};
      this.formData.forEach((it) => {
        if (it.type == "checkbox") {
          let ids = [];
          for (let i = 0; i < it.values.length; i++) {
            if (it.value[i]) {
              ids.push(it.values[i].value);
            }
          }
          formObj[it.key] = ids.join(",");
        } else {
          formObj[it.key] = it.value;
        }
      });
      const submitFormObj = {};
      for (const key in formObj) {
        if (Object.prototype.hasOwnProperty.call(formObj, key)) {
          if (!["realName", "phone"].includes(key)) {
            submitFormObj[key] = formObj[key];
          }
        }
      }
      if (this.activityTypeRef === "PAY") {
        let params = {
          activityId: this.aid,
          realName: formObj.realName,
          phone: formObj.phone,
          formExtend: JSON.stringify(submitFormObj),
        };
        if (this.activityData && this.activityData.isSku) {
          params.skuId = this.ticketData.skuId;
          params.ticketId = this.ticketData.ticketId;
        }
        console.log("params1234 ", params);
        submitFormData(params).then((res) => {
          const params = {
            activityId: this.aid,
            orderStatus: 10,
          };
          getWhereOrder(params).then((res) => {
            console.log(res.data, "是否存在订单");
            this.isOrderList = {
              isExist: res.data.isExist,
              orderNo: res.data.unpaidOrderNoList,
            };

            if (!res.data.isExist) {
              this.getPlayerQueue();
            }
            if (res.data.isExist) {
              // localStorage.setItem("noticeAgreedPay", "200");
              if (this.activityData.isSku) {
                let activityType =
                  this.activityData.activityType == "PAY"
                    ? "PAID_ACTIVITIES"
                    : "NEW_USER_SIGN_IN";

                uni.redirectTo({
                  url: `/pagesF/activesPlaceOrder/index?isExist=${res.data.isExist}&orderNos=${res.data.unpaidOrderNoList}&aid=${this.aid}&skuId=${this.ticketData.skuId}&activityType=${activityType}`,
                });
              } else {
                uni.redirectTo({
                  url: `/pagesF/activesPlaceOrder/index?isExist=${res.data.isExist}&orderNos=${res.data.unpaidOrderNoList}&aid=${this.aid}`,
                });
              }
              // router.push({
              //   path: "/ActivityOrderDetails",
              //   query: {
              //     isExist: res.isExist,
              //     orderNos: res.unpaidOrderNoList,
              //     aid: activityIdRef.value,
              //     uid: shareUIdRef.value,
              //   },
              // });
            }
          });
        });
      } else {
        //免费活动 手机信息返回到详情
        uni.setStorageSync("storage_form_extend", JSON.stringify(formObj));
        uni.setStorageSync("storage_form_finsh", "yes");
        uni.redirectTo({
          url: `/pagesF/activityDetails/index?aid=${this.aid}`,
        });
        sendFormId({
          modelIdArr: [JSON.parse(formId).DXTU, JSON.parse(formId).RWYw],
          path: `/pagesF/activityDetails/index?aid=${this.aid}`,
        });
      }
    },

    // 进行报名成功人数和待支付订单人数的总数校验
    getPlayerQueue() {
      getOrderQueue({ activityId: this.aid }).then((res) => {
        // console.log(res.data, "--1-",this.activityData,this.quantityLimit);
        // this.quantityLimit = this.activityData.isSku? 99999999: this.activityData.quantityLimit;
        if (
          res.data.queueNum &&
          res.data.participantsNum + res.data.queueNum >= this.quantityLimit
        ) {
          this.queuePromptContent = `当前有用户正在排队报名活动中，请稍后再来查看吧，排队人数：${res.data.queueNum}人`;
          this.orQueueShow = true;
        } else if (res.data.participantsNum == this.quantityLimit) {
          this.queuePromptContent = "当前活动报名人数已满，去看看其他活动吧~";
          this.orQueueShow = true;
        } else {
          if (this.activityData.isSku) {
            let activityType =
              this.activityData.activityType == "PAY"
                ? "PAID_ACTIVITIES"
                : "NEW_USER_SIGN_IN";
            let url1 = `url: /pagesF/activesPlaceOrder/index?isExist=${this.isOrderList.isExist}&orderNos=${this.isOrderList.unpaidOrderNoList}&aid=${this.aid}&skuId=${this.ticketData.skuId}&activityType=${activityType}`;
            console.log("url1 ", url1);
            // return
            uni.redirectTo({
              url: `/pagesF/activesPlaceOrder/index?isExist=${this.isOrderList.isExist}&orderNos=${this.isOrderList.unpaidOrderNoList}&aid=${this.aid}&skuId=${this.ticketData.skuId}&activityType=${activityType}`,
            });
          } else {
            uni.redirectTo({
              url: `/pagesF/activesPlaceOrder/index?isExist=${this.isOrderList.isExist}&orderNos=${this.isOrderList.unpaidOrderNoList}&aid=${this.aid}`,
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
