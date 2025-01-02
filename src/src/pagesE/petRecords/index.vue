<template>
  <view class="records-page">
    <view class="petList">
      <pet-view
        v-if="petList.length"
        :list="petList"
        pageName="petRecords"
        :petId="petId"
        @select="updateSelect"
      />
    </view>
    <view class="records">
      <scroll-view
        class="age"
        scroll-x="true"
        style="white-space: nowrap"
        :scroll-left="scrollLeft"
        v-if="curPetType != 'OTHER'"
      >
        <view
          class="monthBtn"
          v-for="(item, index) in liveCycle"
          :key="index"
          :id="`scroll-month-item-${index}`"
        >
          <view
            @click="monthClick(index)"
            :class="['monthStr', currentAgePhaseIndex == index ? 'active' : '']"
            >{{ item.agePhaseName }}</view
          >
        </view>
      </scroll-view>

      <scroll-view
        scroll-y
        :class="['cards', `${curPetType == 'OTHER' ? 'other' : ''}`]"
        @scrolltolower="scrolltolowerFn"
      >
        <view
          class="recordstitle-more"
          v-if="curPetType != 'OTHER' && currentAgePhase <= petCurrentAgePhase"
        >
          <view class="recordstitle">成长记录</view>
          <view class="viewall-right" @click="viewAllHandle">
            <view class="viewall" @click="goRecordAll">查看全部</view>
            <view class="right"></view>
          </view>
        </view>
        <view class="content" v-if="monthRecords.length != 0">
          <!-- <view class="line"></view> -->
          <view class="right">
            <view
              class="card"
              v-for="(item, index) in monthRecords"
              :key="index"
              v-if="curPetType == 'OTHER' || index < 3"
            >
              <view
                class="card-content"
                :style="{ background: getBackGround(item) }"
              >
                <view class="titleRow">
                  <view class="icon-title">
                    <view :class="['icon', getIcon(item)]"></view>
                    <view class="title">{{ getTitle(item) }}</view>
                  </view>
                  <view class="time">{{ getTime(item.recordTime) }}</view>
                </view>

                <view
                  class="remark"
                  v-if="
                    item.type != 'STORE' &&
                    item.type != 'MEDICAL' &&
                    getRemark(item) != ''
                  "
                >
                  <view class="left">{{ getRemark(item) }}</view>
                  <!-- <view class="right"></view> -->
                </view>

                <view class="medical-remark" v-if="item.type == 'MEDICAL'">
                  <view class="left">{{ getRemark(item) }}</view>
                  <view
                    class="right"
                    v-if="isNotShowMedicalReport(item)"
                    @click="handleViewMedicalReport(item)"
                  >
                    <view class="view-record-txt">查看报告</view>
                    <view class="right-img"></view>
                  </view>
                </view>

                <view class="store-remark" v-if="item.type == 'STORE'">
                  <view class="left">{{ getRemark(item) }}</view>
                  <view class="right" @click="handleViewRecord(item)">
                    <view class="view-record-txt">查看记录</view>
                    <view class="right-img"></view>
                  </view>
                </view>

                <view
                  class="doctor-advice"
                  v-if="'MEDICAL' == item.type && doctorsAdvice(item).length"
                >
                  {{ `医嘱：${doctorsAdvice(item)}` }}
                </view>

                <image
                  class="card-img"
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  mode="aspectFill"
                  @click="previewImages(item.imageUrl)"
                />
              </view>

              <!-- <view class="point-big"></view>
              <view class="point-small"></view> -->
            </view>
          </view>
        </view>
        <view
          v-if="
            0 == monthRecords.length &&
            curPetType &&
            'OTHER' != curPetType &&
            currentAgePhase <= petCurrentAgePhase
          "
        >
          <view class="no-records">该月龄下暂无记录～</view>
        </view>
        <view v-if="curPetType && curPetType != 'OTHER'">
          <view class="recordstitle" v-if="doctorInfo && keynotes">{{
            `${agePhaseName}健康要点`
          }}</view>
          <health-gist
            :agePhase="currentAgePhase"
            :doctorInfo="doctorInfo"
            :keynotes="keynotes"
            v-if="doctorInfo && keynotes"
          />
          <view
            class="recordstitle"
            v-if="curLiveCycle && curLiveCycle.detail && petId"
            >猜你想看</view
          >
          <want-see
            :petId="petId"
            :curLiveCycle="curLiveCycle"
            v-if="curLiveCycle && curLiveCycle.detail && petId"
          />

          <view
            class="recordstitle"
            v-if="curPetType && curPetType != 'OTHER' && tools && tools.length"
            :curLiveCycle="curLiveCycle"
            >工具</view
          >
          <tools
            :agePhase="currentAgePhase"
            :tools="tools"
            v-if="curPetType && curPetType != 'OTHER' && tools && tools.length"
          />
        </view>

        <view
          class="no-data-con"
          v-if="0 == monthRecords.length && 'OTHER' == curPetType"
        >
          <NoData
            noDataText="这里空空如也～"
            img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
          ></NoData>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
// import { QUERY_LEVEL } from "@/api/member";
// import PetList from "./components/petList/index.vue";
import NoData from "@/components/noData/index.vue";
import { mapState } from "vuex";
import { formatTime } from "@/utils/index";
import { getPetList, getLiveCycle, getMonthRecord } from "@/api/base/index";
import PetView from "@/pages/home/components/petView/index.vue";
import WantSee from "./components/wantSee/index.vue";
import HealthGist from "./components/healthGist/index.vue";
import Tools from "./components/tools/index.vue";
import { action_report, display_report } from "@/utils/track";
import { getToolsList } from "@/api/home";
export default {
  name: "PetRecords",
  components: { NoData, PetView, WantSee, Tools, HealthGist },
  data() {
    return {
      petList: "",
      liveCycle: [],
      petCurrentAgePhase: 0,
      currentAgePhase: 0,
      currentAgePhaseIndex: 0,
      monthRecords: [],
      pageNo: 1,
      isFinished: false,
      petId: "",
      scrollLeft: 0,
      curPetType: "",
      petCategoryId: "",
      curLiveCycle: null,
      doctorInfo: "",
      keynotes: null,
      tools: null,
      agePhaseName: "",
      // checkIndex: 0
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },

  async onLoad(option) {
    console.log("petRecords option: ", option);
    this.petId = option.petId;

    try {
      display_report({
        display_name: "pet_page_display",
        object_type: "petpage",
      });
      console.log("petRecords onShow === 111111112 ");

      const res = await getPetList({
        userId: this.userInfo.userId,
      });
      this.petList = res.data;
      //   console.log("this.petList : ", this.petList, this.petId);
      let petInfo = null;
      if (this.petId == "" || !this.petId) {
        petInfo = this.petList[0];
        this.petId = petInfo.id;
      } else {
        for (let index = 0; index < this.petList.length; index++) {
          const p = this.petList[index];
          if (p.id == this.petId) {
            petInfo = p;
          }
        }
      }

      this.updateLiveCycle(petInfo);
    } catch (error) {
      console.log(error);
    }
  },
  async onShow() {},
  methods: {
    goRecordAll() {
      uni.navigateTo({
        url: `/pagesE/recordALL/index?petId=${this.petId}`, //`/pagesB/reservationService/index?reservationId=${this.info?.id}`,
      });

      action_report({
        action_name: "pet_page_viewall_click",
        module_name: "petpage",
      });
    },
    async monthClick(index) {
      this.currentAgePhaseIndex = index;
      this.pageNo = 1;
      this.isFinished = false;
      this.currentAgePhase = this.liveCycle[index].agePhase;
      this.getList();
    },

    getTitle(bean) {
      if (bean.type == "DAILY") {
        return bean.originalTitle;
      } else if (bean.type == "STORE") {
        let extendJson = JSON.parse(bean.extendJson);
        return `${extendJson.serviceName}【${extendJson.storeName}】`;
      } else if ("MEDICAL" == bean.type) {
        let extendJson = JSON.parse(bean.extendJson);
        return `${extendJson.serviceName}【${extendJson.storeName}】`;
      } else if (bean.type == "CASE") {
        return "记病历";
      } else {
        return bean.originalTitle;
      }
    },

    getTime(time) {
      let str = formatTime(time, "YYYY/MM/DD");
      //   console.log("time ", str);
      return str;
    },

    isNotShowMedicalReport(bean) {
      let extendJson = JSON.parse(bean.extendJson);
      return extendJson.showDetail;
    },

    doctorsAdvice(bean) {
      let extendJson = JSON.parse(bean.extendJson);
      if (extendJson.doctorsAdvice) {
        return `${extendJson.doctorsAdvice}`;
      } else {
        return "";
      }
    },

    getRemark(bean) {
      //   console.log("item ", bean);
      if (bean.type == "DAILY") {
        if (bean.mark == "TI_ZHONG") {
          return `体重：${bean.weight}KG ${
            bean.desc != "" ? `| ${bean.desc}` : ""
          }`;
        }

        if (bean.healthyInfo != null) {
          return `${bean.healthyInfo.typeName}${
            bean.healthyInfo.drugName != ""
              ? `| ${bean.healthyInfo.drugName}`
              : ""
          }  ${bean.desc != "" ? `| ${bean.desc}` : ""}`;
        }

        return bean.desc || "";
      } else if (bean.type == "BILL") {
        return `支出：￥${bean.amount} ${
          bean.desc != "" ? `| ${bean.desc}` : ""
        }`;
      } else if (bean.type == "CASE") {
        return `${bean.medicalRecordInfo?.symptom} | ${bean.medicalRecordInfo?.diagnosis}`;
      } else if (bean.type == "STORE") {
        let extendJson = JSON.parse(bean.extendJson);
        return `￥${extendJson.price} ${
          extendJson.packageName != "" ? `| ${extendJson.packageName}` : ""
        }`;
      } else if ("MEDICAL" == bean.type) {
        let extendJson = JSON.parse(bean.extendJson);
        return `${extendJson.diagnosis} ${
          extendJson.doctorName != "" ? `| 医生： ${extendJson.doctorName}` : ""
        }`;
      } else {
        return bean.desc || "";
      }
    },

    getBackGround(bean) {
      if (bean.type == "DAILY") {
        if (bean.mark == "QU_CHONG") {
          return "#F6F4FF";
        } else if (bean.mark == "YI_MIAO") {
          return "#FCEFF8";
        } else {
          return "#F0F5FF";
        }
      } else if (bean.type == "BILL") {
        return "#FFF8F1";
      } else if (bean.type == "CASE") {
        return "#EEFCFF";
      } else if (bean.type == "STORE") {
        return "##FFEBE1";
      } else if (bean.type == "MEDICAL") {
        return "###FFEBE1";
      } else {
        return "#F0F5FF";
      }
    },

    getIcon(bean) {
      if (bean.type == "DAILY") {
        if (bean.mark == "QU_CHONG") {
          return "icon3";
        } else if (bean.mark == "YI_MIAO") {
          return "icon2";
        } else {
          return "icon1";
        }
      } else if (bean.type == "BILL") {
        return "icon4";
      } else if (bean.type == "CASE") {
        return "icon5";
      } else if (bean.type == "STORE") {
        return "icon6";
      } else if (bean.type == "MEDICAL") {
        return "icon6";
      } else {
        return "icon1";
      }
    },

    previewImages(imageUrl) {
      uni.previewImage({
        urls: [imageUrl],
      });
    },

    async scrolltolowerFn() {
      console.log("到底");
      // if (!this.isFinished) {
      //   this.pageNo += 1;
      //   this.getList();
      // }
    },

    async getList() {
      let params = {
        pageNo: this.pageNo,
        pageSize: 10,
        petId: this.petId,
        agePhase: this.currentAgePhase, //this.liveCycle[this.currentAgePhase].agePhase,
      };
      if (this.curPetType == "OTHER") {
        params.agePhase = "";
      }
      const monthRecordRes = await getMonthRecord(params);
      if (this.pageNo > 1) {
        this.monthRecords = this.monthRecords.concat(monthRecordRes.data);
      } else {
        this.monthRecords = monthRecordRes.data;
      }
      if (monthRecordRes.data.length === 0) {
        this.isFinished = true;
      }

      if (monthRecordRes.data.length > 0) {
        for (let index = 0; index < monthRecordRes.data.length; index++) {
          const d = monthRecordRes.data[index];
          if (d.type == "STORE") {
            display_report({
              display_name: "pet_page_bathview_display",
              object_type: "petpage",
            });
          } else if (d.type == "MEDICAL") {
            display_report({
              display_name: "pet_page_visit_records_display",
              object_type: "petpage",
            });
          }
        }
      }

      console.log("this.currentAgePhaseIndex", this.currentAgePhaseIndex);
      this.keynotes = null;
      // this.$nextTick(() => {
      this.keynotes = this.liveCycle[this.currentAgePhaseIndex]?.keynotes;
      console.log("this.keynotes", this.keynotes);
      // });
      this.agePhaseName =
        this.liveCycle[this.currentAgePhaseIndex]?.agePhaseName;
      console.log("this.agePhaseName", this.agePhaseName);

      this.curLiveCycle = null;
      this.$nextTick(() => {
        this.curLiveCycle = this.liveCycle[this.currentAgePhaseIndex];
        console.log("this.curLiveCycle", this.curLiveCycle);
      });

      const tools = await getToolsList({ petCategory: this.petCategoryId });

      this.tools = tools.data.data;
      console.log("工具", this.tools);
    },

    async updateLiveCycle(petInfo) {
      //   console.log("petInfo : ", petInfo);
      this.pageNo = 1;
      this.isFinished = false;
      this.petId = petInfo.id;

      let petType = "OTHER";
      if (petInfo.petCategoryId === 1) {
        petType = "CAT";
      } else if (petInfo.petCategoryId === 50) {
        petType = "DOG";
      }
      this.curPetType = petType;
      this.petCategoryId = petInfo.petCategoryId;

      if (petType == "OTHER") {
      } else {
        const liveCycleRes = await getLiveCycle({
          petId: this.petId,
          petType: petType,
        });
        console.log("liveCycleRes : ", liveCycleRes);
        this.doctorInfo = liveCycleRes.data.doctorInfo;
        this.liveCycle = liveCycleRes.data.cycleList;
        this.currentAgePhase = liveCycleRes.data.currentAgePhase;
        this.petCurrentAgePhase = liveCycleRes.data.currentAgePhase;
        for (let index = 0; index < this.liveCycle.length; index++) {
          const lc = this.liveCycle[index];
          console.log("lc : ", lc);
          if (lc.agePhase == this.currentAgePhase) {
            this.curLiveCycle = lc;
            this.keynotes = lc.keynotes;
            this.agePhaseName = lc?.agePhaseName;
            // this.checkIndex = index
            console.log(
              "this.curLiveCycle this.agePhaseName : ",
              this.agePhaseName
            );
            console.log("index : ", index);
            //   console.log("liveCycleRes1 : ", index, this.scrollLeft);

            this.$nextTick(async () => {
              this.currentAgePhaseIndex = index;

              const query = uni.createSelectorQuery().in(this);
              let ret = await this.getSelectorQueryRect(
                query,
                `#scroll-month-item-${index}`,
                true
              );
              // console.log("created11 res111 ret11  ", ret);
              // console.log("this.scrollLeft : ", this.scrollLeft);
              this.scrollLeft = index * ret[0].width - 10 - 140;
              // console.log("this.scrollLeft : ", this.scrollLeft);
            });

            // setTimeout(async () => {

            // }, 200);
            break;
          }
        }
      }
      this.getList();
    },

    getSelectorQueryRect(query, selector, all = false) {
      return new Promise((resolve, reject) => {
        if (all) {
          query
            .selectAll(selector)
            .boundingClientRect((rects) => {
              resolve(rects);
            })
            .exec();
        } else {
          query
            .select(selector)
            .boundingClientRect((rect) => {
              resolve(rect);
            })
            .exec();
        }
      });
    },

    async updateSelect(petInfo) {
      //   console.log("updateSelect ", petInfo);
      this.updateLiveCycle(petInfo);
    },

    handleViewRecord(bean) {
      let extendJson = JSON.parse(bean.extendJson);
      let jumpUrl = extendJson.jumpUrl;
      console.log("jumpUrl ", jumpUrl);
      uni.navigateTo({
        url: jumpUrl, //`/pagesB/reservationService/index?reservationId=${this.info?.id}`,
      });

      action_report({
        action_name: "pet_page_bathview_click",
        module_name: "petpage",
      });
    },

    handleViewMedicalReport(bean) {
      let extendJson = JSON.parse(bean.extendJson);
      let registrationId = extendJson.registrationId;
      let diagType = extendJson.diagType;
      console.log("registrationId ", registrationId);
      console.log("diagType ", diagType);
      uni.navigateTo({
        url: `/pagesE/petMedicalReport/index?registrationId=${registrationId}&diagType=${diagType}`,
      });

      action_report({
        action_name: "pet_page_visit_records_view_click",
        module_name: "petpage",
      });
    },

    viewAllHandle() {
      console.log("this.curLiveCycle", this.curLiveCycle);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
