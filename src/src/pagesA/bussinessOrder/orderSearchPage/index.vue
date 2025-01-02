<template>
  <view class="page-container">
    <view class="search-wrapper">
      <u-search
        placeholder="日照香炉生紫烟"
        v-model="searchValue"
        :showAction="false"
      ></u-search>
    </view>
    <view class="order-wrapper">
      <OrderCard />
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import OrderCard from "../components/ordercard.vue";
export default {
  //...wxShareMethod(),
  components: { OrderCard },
  props: {},
  data() {
    return {
      searchValue: "",
      tabList: [
        {
          name: "全部",
        },
        {
          name: "待付款",
        },
        {
          name: "待发货",
        },
        {
          name: "待收货",
        },
        {
          name: "退款/售后",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
