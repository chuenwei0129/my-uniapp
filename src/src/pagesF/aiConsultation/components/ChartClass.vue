<template>
  <view>
    <view class="item">
      <view
        @click="openCascader(item)"
        :style="{ top: namePosition.y, left: namePosition.x }"
        :class="[item.tierShow == true ? 'activeName' : 'name']"
        >{{ item.name }}</view
      >
      <!-- <view v-for="(item, index) in linePosition" :key="index">
        <view
          v-if="item.hs == 1"
          :style="{ top: item.y, left: item.x, width: item.w }"
          class="line-horizontal"
        ></view>
        <view
          v-if="item.hs == 2"
          :style="{ top: item.y, left: item.x, height: item.h }"
          class="line-vertical"
        ></view>
      </view>
      <view
        :style="{ top: spotPosition.y, left: spotPosition.x }"
        class="spot"
      ></view> -->
    </view>
    <!-- <CascaderPopup ref="CascaderPopup" /> -->
  </view>
</template>

<script>
import CascaderPopup from "./CascaderPopup.vue";
import { mapMutations } from "vuex";
import { action_report, display_report } from "@/utils/track";
export default {
  components: {
    CascaderPopup,
  },
  props: {
    item: {
      type: Object,
    },
    namePosition: {
      type: Object,
    },
    linePosition: {
      type: Array,
    },
    spotPosition: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setSaveDeliverShow"]),
    openCascader(item) {
      action_report({
        action_name: "Intelligentconsultation_FirstLeveSymptom_byocation_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      this.setSaveDeliverShow(false);
      this.$nextTick(() => {
        this.$emit("symptomPop", item);
        // this.$refs.CascaderPopup.selectCascaderPopup(item);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  position: absolute;
  .name {
    position: absolute;
    width: 115rpx;
    height: 54rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26rpx;
    color: #1f1f1f;
    border: 0.9px solid #c7c7c7;
    border-radius: 36rpx;
    background-color: #fff;
  }
  .activeName {
    position: absolute;
    width: 115rpx;
    height: 54rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26rpx;
    color: #ff5b05;
    border: 1px solid #ff5b05;
    border-radius: 36rpx;
    box-shadow: 2rpx 2rpx 12rpx rgb(255, 91, 5, 0.3);
    background-color: #fff;
  }
  // 横
  .line-horizontal {
    position: absolute;
    border-bottom: 1px dashed #c7c7c7;
  }
  // 竖
  .line-vertical {
    position: absolute;
    border-left: 1px dashed #c7c7c7;
  }
  .spot {
    position: absolute;
    width: 20rpx;
    height: 20rpx;
    background-color: #ffffff;
    border: 6rpx solid #ffeea5;
    border-radius: 25rpx;
  }
}
</style>
