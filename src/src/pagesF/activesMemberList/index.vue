<template>
  <view>
    <view class="item-card-warp" v-if="listArr && listArr.length > 0">
      <view class="item-card" v-for="(item, index) in listArr" :key="item.id">
        <view class="items-center">
          <view class="head-picture">
            <image
              class="img"
              :src="
                item.userAvatar
                  ? item.userAvatar
                  : 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/morentouxiang.png'
              "
              mode="scaleToFill"
            ></image>
            <image
              v-if="item.identityType == 1"
              class="img-one"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/discovery/faqiren_2x.png"
            >
            </image>
          </view>
          <view class="icon-right">
            <view class="icon-right-up">
              <view class="name">{{ item.userName }}</view>
              <view class="sex fl-row-center" v-if="item.sex">
                <image
                  class="img"
                  :src="
                    item.sex === 1
                      ? 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/a_gender_male.png'
                      : 'https://frontend-cdn.chongpangpang.com/image/activity-miniapp/index/a_gender_female.png'
                  "
                >
                </image>
              </view>
            </view>
            <view class="icon-right-ticketName" v-if="item.ticketName">
              {{ item.ticketName }}
            </view>
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
import {
  ACTIVITY_USER_LIST,
  ACTIVITY_USER_LIST_CREATOR,
} from "@/api/activityclube";
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
  methods: {
    // ...mapMutations([""]),
    async getList() {
      // if(this.isOriginator) {
      // 	const {data} = await ACTIVITY_USER_LIST_CREATOR({activityId: this.activityId});
      // 	this.listArr = data;
      // } else {
      const { data } = await ACTIVITY_USER_LIST(this.activityId);
      this.listArr = data;
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
