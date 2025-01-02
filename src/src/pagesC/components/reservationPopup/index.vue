<template>
  <root-portal>
    <view>
      <u-popup
        :show="isShowPop"
        :custom-style="{
          'border-radius': '38rpx 38rpx 0rpx 0rpx',
        }"
        ref="popup"
        mode="bottom"
        length="80%"
      >
        <view class="popup_main">
          <view class="pup_top">
            <view class="pup_hide"></view>
            <view class="pup_title"> 预约看宠 </view>
            <view class="popup_clear_btn" @click="clearClickHandle"></view>
          </view>
          <view class="pup_content">
            <view class="res_time_box res_box">
              <view class="time_box_title res_title">
                <view class="res_title_text">预约时间</view>
                <view class="t_box_title_right">仅作参考，以门店时间为准</view>
              </view>

              <scroll-view class="time_day_list" scroll-x="true">
                <view
                  class="time_day_item"
                  :class="{ time_day_item_hl: index == timeDayIndex }"
                  v-for="(item, index) in timeSlot"
                  :key="index"
                  @click="dayClickHandle(item, index)"
                >
                  <view class="time_day_txt">{{ item.weekTxt }}</view>
                  <view class="time_day_date">{{ item.date.slice(5) }}</view>
                  <view class="time_day_sub"></view>
                  <view
                    class="time_day_sup"
                    v-if="item.tag && ['FULL', 'REST'].includes(item.tag)"
                    >{{ item.tag == "FULL" ? "约满" : "休息" }}</view
                  >
                </view>
              </scroll-view>
              <view
                class="time_tag"
                v-if="
                  timeSlot[timeDayIndex] &&
                  timeSlot[timeDayIndex].timeslots[timeHoursIndex] &&
                  timeSlot[timeDayIndex].timeslots[timeHoursIndex].tag ==
                    'KEEP_PET'
                "
              >
                <view class="time_tag_title"
                  >温馨提示：成功预约后立享“萌宠1小时专享预留服务”</view
                >
                <!-- <view class="time_tag_sub"></view> -->
              </view>
              <view class="time_h_list">
                <view
                  class="time_h_item"
                  :class="{
                    time_h_item_hl: index == timeHoursIndex,
                    time_h_item_dlt: item.tag == 'FULL' || item.usable == 0,
                  }"
                  v-for="(item, index) in timeSlot[timeDayIndex].timeslots"
                  :key="index"
                  @click="hoursClickHandle(item, index)"
                >
                  <view class="time_h_sup" v-if="item.tag == 'KEEP_PET'"
                    >推荐</view
                  >
                  <view class="time_h_sup" v-if="item.tag == 'FULL'">约满</view>
                  <view class="title_h_txt">{{ item.time.slice(0, 5) }}</view>
                </view>
              </view>
            </view>
            <view class="res_ps res_box" @click="handleRemark">
              <view class="ps_title">备注</view>
              <view class="ps_right">
                <view class="ps_content" :class="{ ps_contect_hl: !!psTxt }">{{
                  psTxt ? psTxt : ""
                }}</view>
                <view class="ps_icon" v-if="psTxt"></view>
                <i class="iconfont icon-editorText fo-size" v-else></i>
              </view>
            </view>
            <view class="res_notify_box res_box">
              <view class="res_title">
                <view class="res_title_text">须知</view>
              </view>
              <view class="res_notify">
                <view
                  v-if="needKnow.bizNotice"
                  v-html="needKnow.bizNotice.replace(/\n/g, '<br/>')"
                ></view>
                <view v-else
                  ><image
                    :src="needKnow.bizNoticeUrl"
                    mode="aspectFill"
                    style="width: 661rpx"
                /></view>
              </view>
            </view>
          </view>
          <view class="pup_footer">
            <view class="pup_ft_l"> {{ bottomText }} </view>
            <view class="pup_ft_btn" @click="handleSubmit"> 立即提交 </view>
          </view>
        </view>
      </u-popup>
    </view>
  </root-portal>
</template>

<script>
import { action_report, display_report } from "@/utils/track";
export default {
  props: {
    isShowRsvtPop: {
      type: Boolean,
      default: false,
    },
    timeSlot: {
      type: Array,
    },
    needKnow: {
      type: Object,
    },
    commodityId: {
      type: String,
    },
  },
  watch: {
    isShowRsvtPop: {
      handler(newValue, oldValue) {
        this.isShowPop = newValue;
        if (newValue) {
          this.timeHoursIndex = null;
          this.timeDayIndex = this.timeSlot.findIndex(
            (item) => item.tag == "AVAILABLE"
          );
        }
      },
      immediate: true,
    },
  },
  computed: {
    bottomText() {
      if (this.timeDayIndex !== null && this.timeHoursIndex !== null) {
        return (
          this.timeSlot[this.timeDayIndex].weekTxt +
          " " +
          this.timeSlot[this.timeDayIndex].date +
          " " +
          this.timeSlot[this.timeDayIndex].timeslots[
            this.timeHoursIndex
          ].time.slice(0, 5)
        );
      } else {
        return "";
      }
    },
  },
  data() {
    return {
      isShowPop: false,
      timeDayIndex: 0,
      timeHoursIndex: null,
      psTxt: "",
      reserText:
        "1、“预留宠物”的预约单，指您提交预约单起往后1小时，门店为您提供该宠物的专属预留服务，超时不预留；<br/>2、“仅预约”的预约单，因宠物线上线下同步销售，门店不保证该宠物的库存情况，请实时关注宠物在售状态；<br/>3、您预约的时间如超过1小时未到店，本次预约单自动取消；<br/>4、请您如实填写预约信息，到店后请出示预约核销码，由门店专员接待。",
    };
  },
  methods: {
    handleRemark() {
      // 跳转编辑 备注，最多100字
      let that = this;
      uni.navigateTo({
        url: `/pagesC/editRemark/index?remark=${encodeURIComponent(
          that.psTxt ?? ""
        )}&maxlength=50&placeholder=${encodeURIComponent("请输入备注")}`,
        events: {
          resultEvent(res) {
            console.log(`res: ${JSON.stringify(res)}`);
            that.psTxt = res.data?.trim();
          },
        },
      });
    },
    clearClickHandle() {
      this.$emit("closePopup", !this.value);
      // this.isShowPop = !this.isShowPop
    },
    dayClickHandle(item, index) {
      if (["FULL", "REST"].includes(item.tag)) return;
      if (index !== this.timeDayIndex) {
        this.timeHoursIndex = null;
      }
      action_report({
        action_name: "PetsReservation_time_click",
        module_name: "",
        extend: {
          commodity_id: this.commodityId,
        },
      });
      this.timeDayIndex = index;
    },
    hoursClickHandle(item, index) {
      if (item.tag == "FULL" || item.usable == 0) return;
      action_report({
        action_name: "PetsReservation_time_click",
        module_name: "",
        extend: {
          commodity_id: this.commodityId,
        },
      });
      this.timeHoursIndex = index;
    },
    handleSubmit() {
      console.log(this.timeDayIndex, this.timeHoursIndex);
      if (this.timeDayIndex == null || this.timeHoursIndex == null) {
        return uni.showToast({
          title: "请选择时间",
          icon: "none",
        });
      }
      let checked = this.timeSlot[this.timeDayIndex];
      this.$emit("submit", {
        userRemark: this.psTxt,
        reservationBeginTime:
          checked.date + " " + checked.timeslots[this.timeHoursIndex].time,
        reservationEndTime:
          checked.date + " " + checked.timeslots[this.timeHoursIndex].endTime,
      });
    },
  },
  mounted() {
    // 阿里妈妈字体
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("AlimamaShuHeiTi-Bol");
      },
      fail() {
        console.log("fail load AlimamaShuHeiTi-Bol");
      },
    });
  },
};
</script>

<style scoped lang="scss">
.popup_main {
  background: #f7f8fc;
  border-radius: 38rpx 38rpx 0rpx 0rpx;
  height: 80vh;
  overflow: hidden;
  position: relative;

  .pup_top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // padding-bottom: 8rpx;
    position: relative;

    .pup_hide {
      width: 60rpx;
      height: 6rpx;
      background: #000000;
      border-radius: 4rpx;
      opacity: 0.2;
      position: absolute;
      top: 20rpx;
      left: 50%;
      transform: translateX(-50%);
      display: none;
    }

    .pup_title {
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      font-size: 35rpx;
      color: #1f1f1f;
      // line-height: 108rpx;
      line-height: 112rpx;
      text-align: center;
      font-style: normal;
    }

    .popup_clear_btn {
      width: 52rpx;
      height: 52rpx;
      border-radius: 50%;
      background: #ecedf1 no-repeat center;
      background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_clear.png");
      background-size: 32rpx 32rpx;
      position: absolute;
      top: 30rpx;
      right: 30rpx;
    }
  }

  .pup_content {
    width: 100%;
    height: calc(100% - 120rpx);
    padding: 18rpx 16rpx calc(132rpx + 16rpx);
    padding-top: 0;
    overflow: scroll;

    .res_box {
      width: 100%;
      padding: 0 28rpx;
      // padding-left: 31rpx;
      margin-bottom: 20rpx;
      background: #fff;
      border-radius: 24rpx;

      .res_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 26rpx;

        .res_title_text {
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          font-size: 32rpx;
          color: #1f1f1f;
          line-height: 44rpx;
          text-align: left;
          font-style: normal;
        }

        .t_box_title_right {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          color: #999999;
          line-height: 34rpx;
          text-align: right;
          font-style: normal;
        }
      }

      .time_day_list {
        width: 100%;
        // display: flex;
        // flex-wrap: nowrap;
        margin-top: 30rpx;
        white-space: nowrap;
        // overflow-x: scroll;
        border-bottom: 2rpx solid #f8f8f8;
        margin-bottom: 20rpx;

        .time_day_item {
          width: 60rpx;
          height: 110rpx;
          flex-shrink: 0;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 0 96rpx 0 4rpx;
          box-sizing: content-box;

          &:last-child {
            padding: 0 4rpx;
          }

          .time_day_txt {
            font-weight: 500;
            font-size: 26rpx;
            color: #666666;
            line-height: 36rpx;
            text-align: center;
            font-style: normal;
          }

          .time_day_date {
            margin-top: -2rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #666666;
            line-height: 34rpx;
            text-align: center;
            font-style: normal;
            white-space: nowrap;
          }

          .time_day_sub {
            position: absolute;
            bottom: 2rpx;
            left: 4rpx;
            width: 60rpx;
            height: 4rpx;
            background: #fff;
            border-radius: 3rpx;
          }

          .time_day_sup {
            width: 58rpx;
            height: 35rpx;
            background: #000000;
            border-radius: 10rpx 10rpx 10rpx 0rpx;
            opacity: 0.25;
            position: absolute;
            left: 64rpx;
            top: 14rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            font-size: 19rpx;
            color: #ffffff;
            line-height: 27rpx;
            text-align: center;
            font-style: normal;
          }
        }

        .time_day_item_hl {
          .time_day_txt {
            color: #1f1f1f;
          }

          .time_day_date {
            color: #1f1f1f;
          }

          .time_day_sub {
            background: #1f1f1f;
          }
        }
      }

      .time_tag {
        width: 100%;
        // padding-top: 20rpx;
        // padding-bottom: 16rpx;
        position: relative;

        .time_tag_title {
          width: 100%;
          height: 60rpx;
          background: #ffefef;
          border-radius: 16rpx;
          padding: 12rpx 20rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 26rpx;
          color: #fe2442;
          line-height: 36rpx;
          text-align: left;
          font-style: normal;
        }

        .time_tag_sub {
          position: absolute;
          bottom: -28rpx;
          left: 65rpx;
          background: transparent;
          width: 0;
          height: 0;
          border: 22rpx solid transparent;
          border-color: #ffefef transparent transparent transparent;
        }
      }

      .time_h_list {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: 10rpx;
        padding-top: 20rpx;
        .time_h_item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 156rpx;
          height: 96rpx;
          background: #f3f3f4;
          border-radius: 19rpx;
          border: 2rpx solid #f3f3f4;
          margin-right: 15rpx;
          margin-bottom: 20rpx;

          &:nth-child(4n) {
            margin-right: 0;
          }

          .time_h_sup {
            width: 58rpx;
            height: 35rpx;
            background: #fe2442;
            border-radius: 0rpx 15rpx 0rpx 15rpx;
            position: absolute;
            top: -1rpx;
            right: -1rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 19rpx;
            color: #ffffff;
            line-height: 27rpx;
            text-align: center;
            font-style: normal;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .title_h_txt {
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 29rpx;
            color: #1f1f1f;
            line-height: 40rpx;
            text-align: center;
            font-style: normal;
          }
        }

        .time_h_item_hl {
          background: #ffefef;
          border-color: #fe2442;

          .title_h_txt {
            color: #fe2442;
          }
        }

        .time_h_item_dlt {
          .time_h_sup {
            background: #000000;
            opacity: 0.25;
          }

          .title_h_txt {
            color: #999999;
          }
        }
      }
    }

    .res_ps {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 36rpx 30rpx;

      .ps_title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        font-size: 31rpx;
        color: #1f1f1f;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
      }

      .ps_right {
        margin-right: -6rpx;
        display: flex;
        align-items: center;

        .ps_content {
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          font-size: 30rpx;
          color: #666666;
          line-height: 42rpx;
          text-align: right;
          font-style: normal;
        }

        .ps_contect_hl {
          width: 544rpx;
          font-weight: 400;
          font-size: 29rpx;
          color: #1f1f1f;
          line-height: 42rpx;
          text-align: right;
          font-style: normal;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          white-space: nowrap;
        }
        .fo-size {
          font-size: 42rpx;
        }
        .ps_icon {
          width: 24rpx;
          height: 24rpx;
          background-color: #999999;
          margin-left: 4rpx;
          background: #fff no-repeat center;
          background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rsvt_right.png");
          background-size: 100%;
        }
      }
    }

    .res_notify_box {
      width: 100%;
      padding: 0 30rpx;
      margin-bottom: 20rpx;
      background: #fff;
      border-radius: 24rpx;

      .res_notify {
        margin-top: 18rpx;
        padding-bottom: 30rpx;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 30rpx;
        color: #666666;
        line-height: 46rpx;
        text-align: justify;
        font-style: normal;
      }
    }
  }

  .pup_footer {
    position: absolute;
    bottom: 0%;
    right: 0%;
    width: 100%;
    background: #fff;
    padding-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .pup_ft_l {
      padding-left: 46rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: #1f1f1f;
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
    }

    .pup_ft_btn {
      margin: 12rpx 0;
      margin-right: 26rpx;
      width: 300rpx;
      height: 88rpx;
      background: #fe2442;
      border-radius: 44rpx;
      font-family: AlimamaShuHeiTi-Bold;
      // font-weight: bold;
      font-size: 28rpx;
      color: #ffffff;
      line-height: 36rpx;
      text-align: center;
      font-style: normal;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
