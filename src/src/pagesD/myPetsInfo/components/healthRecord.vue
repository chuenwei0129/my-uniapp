<template>
  <view class="health-component-box">
    <view
      class="top-title"
      v-if="currentPetData.length ? !currentPetData[0].otherPet : true"
    >
      健康档案
    </view>
    <!-- 健康档案数据 -->
    <view
      class="health-record-data"
      v-if="currentPetData.length ? !currentPetData[0].otherPet : true"
    >
      <!-- 体重 -->
      <view class="health-weight" @click="toPerfect(dataFirst.mark, dataFirst)">
        <view class="health-title">
          <view class="left">
            <image
              style="width: 34rpx; height: 34rpx"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/weight.png"
            ></image>
            <view> 体重</view>
          </view>

          <view
            class="right"
            @catchtap="toPerfect(dataFirst.mark, dataFirst)"
            v-if="!dataFirst.weight"
            >去完善</view
          >
        </view>

        <view v-if="!dataFirst.weight" class="health-content-text">
          定时记录体重可以更好的管理爱宠健康～
        </view>

        <view v-else class="health-content">
          <view class="current-weight">
            <view class="kg">
              <span>{{ dataFirst.weight }}</span>
              <span>kg</span>
            </view>
            <view class="time">
              <span>更新：</span>
              <span>{{ dataFirst.recordTimeYmd }}</span>
            </view>
          </view>
          <view class="last-weight" v-if="dataFirst.secondLastWeight">
            <view class="kg">
              <span
                v-if="dataFirst.differValue != 0"
                :class="dataFirst.differValue > 0 ? 'add' : 'minus'"
              >
                {{ Math.abs(dataFirst.differValue) }}
              </span>
              <span v-else>0</span>
              <span>kg</span>
              <image
                v-if="dataFirst.differValue > 0"
                style="width: 15rpx; height: 15rpx; margin-left: 5rpx"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/up@3x.png"
              ></image>

              <image
                v-else-if="dataFirst.differValue < 0"
                style="width: 15rpx; height: 15rpx; margin-left: 5rpx"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/down@3x.png"
              ></image>
            </view>
            <view class="time">
              <span>对比上次：</span>
              <span>{{ dataFirst.secondLastWeight.recordTimeYmd }}</span>
            </view>
          </view>
        </view>
      </view>

      <!-- 其它数据 -->
      <view class="health-other-record">
        <template v-for="item in data">
          <!-- BCS -->
          <view
            class="health-card"
            :key="item.mark"
            @click="toPerfect(item.mark, item)"
          >
            <view class="health-title">
              <view class="left">
                <image
                  style="width: 34rpx; height: 34rpx"
                  :src="getImgUrl(item.mark)"
                ></image>
                <view>{{ getTitle(item.mark) }}</view>
              </view>
              <view
                v-if="
                  (item.mark == 'BCS' && !item.bcs) ||
                  (item.mark == 'QU_CHONG' && !item.anthelminticInfo) ||
                  (item.mark == 'YI_MIAO' && !item.vaccineInfo) ||
                  (item.mark == 'TE_SHU_SHI_QI' && !item.specialPeriod) ||
                  (item.mark == 'BING_SHI' && !item.medicalHistory) ||
                  (item.mark == 'YAN_YU_FANG_SHI' && !item.rearingStyle)
                "
                class="right"
                @catchtap="toPerfect(item.mark, item)"
                >去完善</view
              >
            </view>

            <!-- 仅bsc、驱虫、疫苗类型下展示 -->
            <view
              v-if="
                (item.mark == 'BCS' && !item.bcs) ||
                (item.mark == 'QU_CHONG' && !item.anthelminticInfo) ||
                (item.mark == 'YI_MIAO' && !item.vaccineInfo)
              "
              class="health-content-text"
            >
              {{ getLabel(item.mark) }}
            </view>

            <view class="health-content" v-if="item.mark == 'BCS' && item.bcs">
              <view class="current-data">
                <span class="type">{{ item.bcs.shapeTitle }}</span>
                <image
                  v-if="item.bcs.shapeTitle == '瘦弱'"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/veryThin@3x.png"
                ></image>
                <image
                  v-if="item.bcs.shapeTitle == '偏瘦'"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/thin@3x.png"
                ></image>
                <image
                  v-if="item.bcs.shapeTitle == '标准'"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/health@3x.png"
                ></image>
                <image
                  v-if="item.bcs.shapeTitle == '偏胖'"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/veryFat@3x.png"
                ></image>
                <image
                  v-if="item.bcs.shapeTitle == '肥胖'"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/obesity@3x.png"
                ></image>
              </view>
            </view>
            <!-- 驱虫(存在数据时，区分是否驱虫，status0未驱虫 1已驱虫) -->
            <view
              class="health-content"
              v-if="item.mark == 'QU_CHONG' && item.anthelminticInfo"
            >
              <view
                class="qu-data"
                v-if="
                  item.anthelminticInfo.status != null &&
                  item.anthelminticInfo.status == 0
                "
              >
                未驱虫
              </view>
              <view class="qu-data" v-else>
                <!-- 类型 | 品牌 -->
                <span>{{ item.anthelminticInfo.typeName || "" }}</span>
                <span
                  class="line"
                  v-if="
                    item.anthelminticInfo.typeName &&
                    item.anthelminticInfo.drugName
                  "
                ></span>
                <span>{{ item.anthelminticInfo.drugName || "" }}</span>
              </view>
            </view>
            <!-- 特殊时期 -->
            <view
              class="health-content"
              v-if="item.mark == 'TE_SHU_SHI_QI' && item.specialPeriod"
            >
              <view class="detail-data">
                <span>{{ item.specialPeriod.periodName }}</span>
              </view>
            </view>
            <!-- 疫苗(存在数据时，区分是否接种，status0未接种 1已接种) -->
            <view
              class="health-content"
              v-if="item.mark == 'YI_MIAO' && item.vaccineInfo"
            >
              <view
                class="detail-data"
                v-if="
                  item.vaccineInfo.status != null &&
                  item.vaccineInfo.status == 0
                "
              >
              未接种
              </view>
              <view class="detail-data" v-else>
                <span>{{ item.vaccineInfo.typeName || "" }}</span>
              </view></view
            >
            <!-- 养育方式 -->
            <view
              class="health-content"
              v-if="item.mark == 'YAN_YU_FANG_SHI' && item.rearingStyle"
            >
              <view class="detail-data">
                <span>{{ item.rearingStyle.name }}</span>
              </view>
            </view>
            <!-- 病史 -->
            <view
              class="health-content"
              v-if="item.mark == 'BING_SHI' && item.medicalHistory"
            >
              <view class="detail-data ill">
                <span
                  v-for="(disease, index) in item.medicalHistory
                    .medicalHistoryItems"
                  :key="disease.code"
                >
                  {{ disease.name }}
                  <span
                    v-if="
                      index !=
                      item.medicalHistory.medicalHistoryItems.length - 1
                    "
                    >/</span
                  >
                </span>
              </view>
            </view>

            <view v-if="item.recordTimeYmd" class="health-update-time">
              <span>更新:</span>
              <span>{{ item.recordTimeYmd }}</span>
            </view>
          </view>
        </template>
      </view>
    </view>

    <!-- 健康服务 -->
    <view class="health-service">
      <view class="service-title">
        <image
          style="width: 34rpx; height: 34rpx; margin-right: 8rpx"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/healthService.png"
        ></image>
        <span>健康服务</span>
      </view>
      <view class="service-content">
        <view class="record" @click="goServiceContent">
          <image
            style="width: 54rpx; height: 54rpx; margin-bottom: 7rpx"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/interrogation@3x.png"
          ></image>
          <span>问诊记录</span>
        </view>
        <view class="appointment" @click="goAppointment">
          <image
            style="width: 54rpx; height: 54rpx; margin-bottom: 7rpx"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/myAppointment@3x.png"
          ></image>
          <span>我的预约</span>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { action_report } from "@/utils/track";
export default {
  components: {},
  props: {
    petId: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: [],
    },
    dataFirst: {
      type: Object,
      default: {},
    },
    currentPetData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      // imgData: {
      //   "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/veryThin@3x.png",
      //   "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/thin@3x.png",
      //   "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/health@3x.png",
      //   "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/veryFit@3x.png",
      //   "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/obesity@3x.png",
      // },
      title: {
        BCS: "BCS",
        QU_CHONG: "驱虫",
        TE_SHU_SHI_QI: "特殊时期",
        YI_MIAO: "疫苗",
        YAN_YU_FANG_SHI: "养育方式",
        BING_SHI: "病史",
      },
      labels: {
        BCS: "体况评分",
        QU_CHONG: "建议3个月1次",
        YI_MIAO: "建议接种疫苗",
      },
      typeImgUrl: {
        BCS: "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/BSC.png",
        QU_CHONG:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/expellingInsects.png",
        TE_SHU_SHI_QI:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/specialPeriod.png",
        YI_MIAO:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/vaccine.png",
        YAN_YU_FANG_SHI:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/lifeStyle.png",
        BING_SHI:
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/medicalHistory.png",
      },

      typeArr: ["YI_MIAO", "QU_CHONG", "TI_ZHONG", "TE_SHU_SHI_QI"],
    };
  },
  computed: {
    healthCode() {},
  },
  methods: {
    // 获取不同类型下对应的文案
    getLabel(item) {
      return this.labels[item] || "";
    },

    // 获取不同类型下图片地址
    getImgUrl(item) {
      return this.typeImgUrl[item] || "";
    },

    // 获取不同类型下标题文案
    getTitle(item) {
      return this.title[item] || "";
    },

    //去完善
    toPerfect(type, item) {
      console.log(type, item, "mark");

      // 疫苗 驱虫 体重 特殊时期使用一套逻辑
      if (this.typeArr.includes(type)) {
        this.$emit("openPop", item);
      } else if (type == "BING_SHI") {
        this.$emit("openPop2", item);
      } else if (type == "BCS") {
        this.$emit("openBscPop", item);
      } else if (type == "YAN_YU_FANG_SHI") {
        this.$emit("openliftStylePop", item);
      }
    },

    //问诊记录app里是原生页面 小程序跳小程序
    goServiceContent() {
      action_report({
        action_name: "petfiles_healthy_onlineconsultation_click",
        module_name: "petfiles",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
        },
      });
      //在线问诊
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesA/sheetList/index`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/medical/inquiry/records`,
      });
      // #endif
    },

    //我的预约小程序的跳转
    goAppointment() {
      console.log(process.env.NODE_ENV, "process.env.NODE_ENV,");

      action_report({
        action_name: "Pet_page_appointment_click",
        module_name: "Pet",
        extend: {
          // #ifdef H5
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
          // #endif
          
          // #ifdef MP-WEIXIN
          user_id: uni.getStorageSync("storage_info").userId,
          // #endif
        },
      });
      //我的预约
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesB/myReservation/index`,
      });
      // #endif
      // #ifdef H5
      if (process.env.NODE_ENV === "development") {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `https://dev-cpp.chongpangpang.com/crm-medical-h5/#/pagesB/myReservation/index`,
        });
      } else if (process.env.NODE_ENV === "test") {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `https://test-cpp.chongpangpang.com/crm-medical-h5/#/pagesB/myReservation/index`,
        });
      } else if (process.env.NODE_ENV === "production") {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `https://cpp.chongpangpang.com/crm-medical-h5/#/pagesB/myReservation/index`,
        });
      }
      // #endif
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.health-component-box {
  width: 692rpx;
  height: 500rpx;
  //   background: blue;
  margin: auto;
  padding-top: 12rpx;
  .top-title {
    margin-bottom: 23rpx;
    font-size: 30rpx;
    color: #1f1f1f;
    font-weight: bold;
  }

  //健康档案数据
  .health-record-data {
    //体重
    .health-weight {
      width: 100%;
      height: 169rpx;
      background: #fff;
      border-radius: 15rpx;
      margin-bottom: 19rpx;
      padding: 19rpx 23rpx 0 23rpx;
      .health-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40rpx;
        .left {
          display: flex;
          align-items: center;
          image {
            margin-right: 8rpx;
          }
          view {
            font-size: 28rpx;
            color: #1f1f1f;
            font-weight: bold;
          }
        }
        .right {
          line-height: 1;
          font-size: 23rpx;
          color: #ff5b05;
        }
      }
      .health-content-text {
        margin-top: 23rpx;
        color: #999999;
        font-size: 23rpx;
      }
      .health-content {
        display: flex;
        justify-content: space-between;
        margin-top: 11rpx;
        .current-weight {
          width: 313rpx;
          height: 100rpx;
          margin-right: 10rpx;
        }
        .current-weight,
        .last-weight {
          .kg {
            span {
              font-size: 23rpx;
              color: #666666;
              &:nth-child(1) {
                font-size: 38rpx;
                color: #1f1f1f;
                margin-right: 5rpx;
                font-family: D-DIN-Bold;
              }
            }
          }
          .time {
            font-size: 23rpx;
            color: #999999;
          }
        }
        .last-weight {
          width: 313rpx;
          height: 100rpx;
          padding-left: 23rpx;
          .kg {
            .add {
              color: #fe2442 !important;
            }
            .minus {
              color: #23c689 !important;
            }
          }
        }
      }
    }
    //其它数据
    .health-other-record {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .health-card {
        width: 336rpx;
        height: 169rpx;
        background: #fff;
        border-radius: 15rpx;
        margin-bottom: 19rpx;
        padding: 19rpx 23rpx 0 23rpx;
        .health-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40rpx;
          .left {
            display: flex;
            align-items: center;
            image {
              margin-right: 8rpx;
            }
            view {
              font-size: 28rpx;
              color: #1f1f1f;
              font-weight: bold;
            }
          }
          .right {
            line-height: 1;
            font-size: 23rpx;
            color: #ff5b05;
          }
        }
        .health-content-text {
          margin-top: 23rpx;
          color: #999999;
          font-size: 23rpx;
        }
        .health-content {
          height: 30rpx;
          margin-top: 15rpx;
          .current-data {
            display: flex;
            align-items: center;
            .type {
              color: #333333;
              font-size: 25rpx;
            }
            image {
              width: 151rpx;
              height: 17rpx;
              margin-left: 17rpx;
              margin-top: 5rpx;
            }
          }
          .qu-data {
            display: flex;
            align-items: center;
            height: 30rpx;
            color: #333333;
            font-size: 25rpx;
            .line {
              width: 1px;
              height: 24rpx;
              background: #333333;
              margin: 0 6rpx;
            }
          }
          .detail-data {
            height: 30rpx;
            color: #333333;
            font-size: 25rpx;
          }
          .ill {
            width: 100%;
            height: unset;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .health-update-time {
          display: flex;
          align-items: center;
          height: 30rpx;
          color: #999;
          font-size: 23rpx;
          margin-top: 13rpx;
          span {
            &:nth-child(1) {
              margin-right: 8rpx;
            }
          }
        }
      }
    }
  }
  //健康服务
  .health-service {
    width: 100%;
    height: 206rpx;
    background: #fff;
    border-radius: 23rpx;
    padding: 19rpx 0 23rpx 23rpx;
    .service-title {
      display: flex;
      align-items: center;
      height: 40rpx;
      margin-bottom: 27rpx;
      span {
        font-size: 28rpx;
        color: #1f1f1f;
        font-weight: bold;
      }
    }
    .service-content {
      display: flex;
      padding-left: 11rpx;
      .record,
      .appointment {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 2rpx;
        span {
          font-size: 25rpx;
          color: #1f1f1f;
        }
      }
      .record {
        margin-right: 80rpx;
      }
    }
  }
}
</style>
