<template>
  <view>
    <view style="height: 70rpx"></view>
    <!-- <view style="height: 130rpx"></view> -->
    <view class="page-wrapper">
      <view v-for="(item, index) in newChartClass" :key="index">
        <ChartClass
          :item="item"
          :namePosition="item.namePosition"
          :linePosition="item.linePosition"
          :spotPosition="item.spotPosition"
          @symptomPop="symptomPop"
        />
      </view>
    </view>
    <view class="prompt">症状可多选，选择越全面越有利于诊断~</view>
    <CascaderPopup ref="CascaderPopup" />
  </view>
</template>

<script>
import { mapState } from "vuex";
import ChartClass from "./ChartClass.vue";
import CascaderPopup from "./CascaderPopup.vue";
import { animalData } from "../data";
export default {
  components: {
    ChartClass,
    CascaderPopup,
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
    }),
  },
  watch: {
    symptomData: {
      immediate: true,
      handler(newValue, oldValue) {
        this.chartShow();
      },
    },
  },
  created() {
    // console.log(this.chartClass, "chartClass");
  },
  data() {
    return {
      chartClassData: animalData.dog,
      newChartClass: [],
    };
  },
  methods: {
    chartShow() {
      this.newChartClass = JSON.parse(JSON.stringify(this.chartClassData));
      this.newChartClass.forEach((element) => {
        element.tierShow = false;
        this.symptomData.forEach((item) => {
          if (element.name == item.tier) {
            element.tierShow = true;
          }
          if (element.name == item.secondTier) {
            element.tierShow = true;
          }
        });
      });
    },
    symptomPop(item) {
      this.$refs.CascaderPopup.selectCascaderPopup(item);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  margin: 0 auto;
  position: relative;
  // background-image: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/dog.png");
  background-image: url("//frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/dogLine.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 580rpx;
  height: 556rpx;
}
.prompt {
  font-size: 23rpx;
  color: #aaaaaa;
  width: 430rpx;
  text-align: center;
  margin: 80rpx auto 0;
}
</style>
