<template>
  <view>
    <view class="item-card-warp" v-if="listArr && listArr.length > 0">
      <view class="item-card" v-for="(item, index) in listArr" :key="item.id">
        <view class="items-center">
          <view class="head-picture">
            <image
              class="img"
              :src="item.userAvatar"
              mode="scaleToFill"
            ></image>
          </view>
          <view class="name">{{ item.userName }}</view>
          <view class="sex fl-row-center" v-if="item.sex">
            <image
              class="img"
              :src="
                item.sex === 1
                  ? 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/a_gender_male.png'
                  : 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/a_gender_female.png'
              "
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="fl-row-center h-vh">
      <NoData
        noDataText="空空如也，胖胖好寂寞..."
        img="https://frontend-cdn.chongpangpang.com/image/activity-miniapp/myActives/nodata-404.png"
      />
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { ACTIVITY_WANT_LSIT } from "@/api/activityclube";
import NoData from "@/components/noData/index.vue";
export default {
  // #ifdef MP-WEIXIN

  // #endif
  components: {
    NoData,
  },
  data() {
    return {
      activityId: "",
      listArr: [],
      pageNo: 1,
      totalPage: 1,
    };
  },
  computed: {
    ...mapState({
      isOriginator: (state) => state.isOriginator,
    }),
  },
  onLoad(option) {
    this.activityId = option.aid;
    this.getList();
  },
  onReady() {},
  onShow() {},
  onReachBottom() {
    if (this.pageNo == this.totalPage) return;
    this.pageNo++;
    this.getList();
  },
  methods: {
    // ...mapMutations([""]),
    async getList() {
      let params = {
        id: this.activityId,
        pageNo: this.pageNo,
        pageSize: 50,
      };
      const {
        data: { data, totalPage },
      } = await ACTIVITY_WANT_LSIT(params);
      this.listArr = [...this.listArr, ...data];
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
