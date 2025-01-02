<template>
  <scroll-view
    ref="scrollView"
    class="scroll-view"
    scroll-x="true"
    :scroll-left="scrollLeft"
    id="scroll-id"
  >
    <view class="scroll-container">
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        v-if="list.length"
        :style="{
          marginLeft: index > 0 ? '19rpx' : '0',
        }"
        @click="handleEditPet(item)"
        :id="`scroll-item-${index}`"
      >
        <image
          mode="aspectFill"
          class="pet-avatar"
          :src="item.avatarUrl"
          @click="clickPet(item)"
        ></image>
        <view class="pet-info" @click="clickPet(item)">
          <view class="pet-name-edit">
            <view class="pet-name">{{ item.nickName.slice(0, 7) }}</view>
          </view>
          <view class="pet-desc"
            >{{ item.categoryName }} |
            {{ 1 == item.sex ? "弟弟" : "妹妹" }}</view
          >
        </view>
      </view>
      <view class="pet-add-item" v-if="list.length" @click="handleAddPet">
        <view>
          <view class="pet-add">
            <view class="pet-add-img"></view>
            <view class="pet-add-txt">添加宠物</view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>
<script>
import { mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  data () {
    return {
      curAddress: "",
      curShopName: "",
      noLocalTips: "",
      noStoreList: null,
      scrollLeft: 0,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  mounted () {
    // 展示事件
    display_report({
      display_name: "myinfo_addpet_display",
      object_type: "myinfo",
    });

    if (this.list && this.list.length) {
      for (let index = 0; index < this.list.length; index++) {
        const item = this.list[index];
        action_report({
          action_name: "myinfo_petinfo_display",
          module_name: "myinfo",
          extend: {
            pet_id: item.id,
          },
        });
      }
    }
  },
  created () { },
  methods: {
    handleAddPet () {
      action_report({
        action_name: "myinfo_addpet_click",
        module_name: "myinfo",
      });

      if (!this.userInfo.token) {
        uni.navigateTo({
          url: "/pagesD/login/index",
        });
        return;
      }
      uni.navigateTo({
        url: "/pagesD/petInfo/index?type=taskdesc&transparentTopBar=1",
      });
    },
    handleEditPet (item) {
      uni.navigateTo({
        url: `/pagesD/myPetsInfo/index?petId=${item.id}`,
      });

      action_report({
        action_name: "myinfo_petinfo_click",
        module_name: "myinfo",
        extend: {
          pet_id: item.id,
        },
      });
    },

    getSelectorQueryRect (query, selector, all = false) {
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

    async clickPet (item) {
      // uni.navigateTo({
      //   url: `/pagesE/petRecords/index?petId=${item.id}`,
      // });
    },
  },
  watch: {
    list (newVal, oldVal) { },
  },
};
</script>

<style scoped lang="scss">
@import "@/utils/fn.scss";
@import "@/utils/membertheme.scss";

@mixin pet-background {
  height: 103rpx;
  background-color: rgba($color: #ffffff, $alpha: 0.6);
  display: inline-flex;
  margin-top: 25rpx;
  align-items: center;
  justify-content: center;
  border-radius: 23rpx;
  vertical-align: top;
}

.scroll-view {
  white-space: nowrap;
  width: 100%;

  .item {
    @include pet-background;
    width: 423rpx;

    background: #f5f6f7;

    .pet-avatar {
      width: 77rpx;
      height: 77rpx;
      border-radius: 54rpx;
      margin-left: 13rpx;
      object-fit: contain;
      margin-bottom: 3rpx;
    }

    .pet-info {
      flex: 1;
      margin-left: 15rpx;
      margin-right: 10rpx;
      min-width: 0;

      .pet-name-edit {
        display: flex;
        justify-content: start;
        align-items: center;

        .pet-name {
          // font-size: 42rpx;
          // font-weight: 600;
          // color: #1f1f1f;
          // line-height: 58rpx;
          // overflow: hidden;
          // text-overflow: ellipsis;

          font-weight: 500;
          font-size: 27rpx;
          color: #1f1f1f;
          line-height: 38rpx;
          text-align: left;
          font-style: normal;
        }

        .edit {
          width: 31rpx;
          height: 31rpx;
          background: url("https://frontend-cdn.chongpangpang.com/image/medical-mp/petRecords/edit.png");
          background-size: cover;
          margin-left: 10rpx;
          padding-right: 30rpx;
        }
      }

      .pet-desc {
        overflow: hidden;
        text-overflow: ellipsis;

        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        font-size: 25rpx;
        color: #999999;
        line-height: 35rpx;
        text-align: left;
        font-style: normal;
      }
    }
  }

  .pet-add-item {
    @include pet-background;
    margin-left: 19rpx;

    width: 231rpx;
    // height: 104rpx;
    background: #f5f6f7;
    border-radius: 15rpx;

    .pet-add {
      display: flex;
      flex-direction: row;
      justify-content: right;
      align-items: center;
      // margin-right: 36rpx;
    }

    .pet-add-img {
      width: 19rpx;
      height: 19rpx;
      margin-right: 23rpx;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/myV2/add-btn-img.png"
      );
    }

    .pet-add-txt {
      height: 38rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 27rpx;
      color: #1f1f1f;
      line-height: 38rpx;
      text-align: left;
      font-style: normal;
    }
  }
}
</style>
