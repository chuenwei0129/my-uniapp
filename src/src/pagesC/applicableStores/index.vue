<script>
import ApplicableStoreItem from "@/pagesC/applicableStores/components/applicableStoreItem.vue";
import { getOtherApplicableStores } from "@/api/mallv2";
import NoData from "@/components/noData/index.vue";

export default {
  name: "applicableStores",
  components: { NoData, ApplicableStoreItem },
  data() {
    return {
      isCompleted: false,
      list: [],
    };
  },
  methods: {
    async getOtherApplicableStores(itemId, shopId) {
      try {
        const res = await getOtherApplicableStores({
          itemId,
          shopId,
        });
        this.list = res?.data?.data || [];
        this.isCompleted = true;
      } catch (e) {
        this.isCompleted = true;
      }
    },
    onLoad(options) {
      const itemId = options?.itemId || "";
      const shopId = options?.shopId || "";
      this.getOtherApplicableStores(itemId, shopId);
    },
  },
};
</script>

<template>
  <view class="page-wrapper">
    <scroll-view v-if="list.length" class="scroll-wrapper" scroll-y>
      <ApplicableStoreItem
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      ></ApplicableStoreItem>
    </scroll-view>
    <view v-if="!list.length && isCompleted" class="no-data-wrapper">
      <NoData
        noDataText="暂无数据"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      ></NoData>
    </view>
  </view>
</template>
<style>
page {
  background-color: #f7f8fc;
}
</style>
<style scoped lang="scss">
@import "./index.scss";
</style>
