<template>
  <view>
    <view> <Cascader ref="Cascader" /></view>
  </view>
</template>

<script>
import { mapState } from "vuex";
import Cascader from "./Cascader.vue";
export default {
  components: {
    Cascader,
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
      symptomTree: (state) => state.symptom,
    }),
  },
  data() {
    return {
      // symptomTree: require("./data.json").symptom,
      firstSelectedIndex: 1,
      secondSelectedIndex: null,
      thirdSelectedIndex: null,
    };
  },
  methods: {
    selectfirstActive(item, index) {
      // this.firstSelectedIndex = index;
      // console.log(item, "item");
      this.$refs.Cascader.selectSymptom();
    },
    firstActive(item, index) {
      this.firstSelectedIndex = index;
      console.log(item, "item");
    },
    secondActive(item, index) {
      this.secondSelectedIndex = index;
    },
    thirdActive(item, index) {
      this.thirdSelectedIndex = index;
    },
    deleteCascaderPage(item) {
      this.$refs.Cascader.deleteCascader(item);
    },
    clearCascaderPage() {
      this.$refs.Cascader.clearCascader();
    },
  },
};
</script>

<style lang="scss" scoped></style>
