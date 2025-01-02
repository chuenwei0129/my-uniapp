<template>
  <view class="appraise-list">
    <!-- #ifdef H5 -->
    <view class="preview-img" v-if="isPreview">
      <swiper
        class="swiper-preview"
        circular
        @change="handldeChange"
        :current="currentIndex"
      >
        <swiper-item
          class="swiper-box"
          v-for="(item, index) in allImageList"
          :key="item.id"
        >
          <view class="item-preview" @click="closePreview">
            <image class="img" :src="item.mediaUrl" mode="aspectFit"></image>
          </view>
        </swiper-item>
      </swiper>
      <view class="img-count">
        {{ currentIndex + 1 }}/{{ allImageList.length }}
      </view>
    </view>
    <!-- #endif -->

    <view class="list-box">
      <view class="list-item" v-for="item in commentsList" :key="item">
        <view class="user-info">
          <view class="user">
            <view class="img">
              <image
                v-if="item.anonymousStatus == 1"
                class="avatar"
                :src="anonymityAvatar"
                mode="aspectFill"
              />
              <image v-else class="avatar" :src="item.memberIcon"></image>
            </view>
            <view v-if="item.anonymousStatus == 1" class="name">匿名买家</view>
            <view v-else class="name">{{ item.memberName }}</view>
          </view>
          <view class="time">{{ item.createdTime }}</view>
        </view>
        <!-- 评价星星 -->
        <AppraiseStar
          :goodsType="appraiseType"
          :skuName="item.skuName"
          :star="{
            serviceScore: item.serviceScore,
            environmentScore: item.environmentScore,
            materialScore: item.materialScore,
          }"
        />
        <!-- 商品评价 -->
        <AppraiseText
          :appraiseText="item.commentContent"
          :text-type="1"
          :merchantEdit="item.modifyStatus"
        />

        <view>
          <AppraiseImgList
            :imgList="item.medias"
            :allImgList="allImageList"
            @onPreviewImages="onPreviewImages"
          />
        </view>
        <!-- 商家回复  -->
        <AppraiseText
          v-if="item.merchantContent"
          :appraiseText="item.merchantContent"
          :text-type="2"
          :merchantEdit="item.modifyStatus"
        />

        <!-- 优质评价 -->
        <image
          v-if="item.topStatus == 1"
          class="high-quality"
          :src="highQualityImg"
        ></image>
      </view>
      <template v-if="isLoading">
        <view class="data-unsettled">
          <image
            class="loading-img"
            src="https://frontend-cdn.chongpangpang.com/image/cpp-static/prod/ui/cpp_h5_loading.png"
            mode="scaleToFill"
          />
        </view>
      </template>
      <view class="list-bottom" v-else>
        <view class="line"></view>
        <view class="text">已经到底了</view>
        <view class="line"></view>
      </view>
    </view>
  </view>
</template>

<script>
import AppraiseText from "./appraiseText.vue";
import AppraiseImgList from "./appraiseImgList.vue";
import AppraiseStar from "./appraiseStar.vue";
export default {
  name: "AppraiseList",
  props: {
    commentsList: {
      type: Array,
      default: () => [],
    },
    appraiseType: {
      type: Number,
      default: 1, // 1-实物类型，2-服务类型
    },
    isLoading: {
      type: Boolean,
    },
  },
  components: {
    AppraiseText,
    AppraiseImgList,
    AppraiseStar,
  },
  computed: {
    allImageList() {
      let list = [];
      this.commentsList.map((itemComment) => {
        if (itemComment?.medias?.length > 0) {
          list = list.concat(itemComment.medias);
        }
      });
      return list;
    },
  },
  mounted() {
    console.log("commentsList", this.commentsList);
  },
  data() {
    return {
      highQualityImg:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/high-quality.png",
      anonymityAvatar:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/anonymity-avatar.png",
      currentIndex: 1,
      isPreview: false,
    };
  },
  methods: {
    // commentItem(item) {
    //   if (item.autoStatus == 1) {
    //     // 使用系统自动评价
    //     const str = "此用户觉得商品很好，给出了好评";
    //     return str;
    //   } else if (item.autoStatus == 0) {
    //     // 使用用户评论
    //     return item.commentContent;
    //   } else {
    //     // 异常
    //     const str = "此用户未填写评价内容";
    //     return str;
    //   }
    // },
    handldeChange(e) {
      this.currentIndex = e.detail.current;
    },
    onPreviewImages(imgUrl) {
      let index = this.allImageList?.findIndex(
        (item) => item.mediaUrl === imgUrl
      );
      this.isPreview = true;
      this.currentIndex = index || 0;
    },
    closePreview() {
      this.isPreview = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/utils/fn.scss";
.appraise-list {
  width: 100%;
  max-height: 100%;
  // #ifdef H5
  padding: 0 31rpx 200rpx;
  overflow: hidden;
  // #endif
  // #ifdef MP-WEIXIN
  padding: 0 31rpx 56rpx;
  // #endif
  .preview-img {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    .img-count {
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      @include flex();
      color: #fff;
    }
    .swiper-preview {
      width: 100%;
      height: 100%;
      background-color: #000;
      @include flex();
      .swiper-box {
      }
      .item-preview {
        width: 100%;
        height: 100%;
        @include flex();
      }
    }
  }
  .list-item {
    width: 100%;
    margin-top: 35rpx;
    box-sizing: border-box;
    position: relative;
    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-style: normal;
      .user {
        display: flex;
        align-items: center;
        .img {
          width: 46rpx;
          height: 46rpx;
          border-radius: 50%;
          background-color: #ccc;
          overflow: hidden;
        }
        .avatar {
          width: 100%;
          height: 100%;
        }

        .name {
          margin-left: 8rpx;
          font-weight: 500;
          @include textfclaw(23rpx, #1f1f1f, left, 23rpx);
        }
      }
      .time {
        font-weight: 300;
        @include textfclaw(21rpx, #999, left, 17rpx);
      }
    }
    .star-box {
      display: flex;
      .iconfont {
        display: inline-block;
        margin-right: 5rpx;
        font-size: 19rpx;
        color: #e6e6eb;
        line-height: 25rpx;
      }
      .light {
        color: #ff2442 !important;
      }
      .goods-name {
        font-weight: 300;
        @include textfclaw(19rpx, #666, center, 27rpx);
        margin-left: 10rpx;
        display: flex;
        .skyName {
          max-width: 530rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .skuName2 {
          max-width: 430rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .buy {
        margin-right: 4rpx;
      }
    }
    .high-quality {
      width: 92rpx;
      height: 92rpx;
      // background-color: pink;
      text-align: center;
      line-height: 92rpx;
      position: absolute;
      top: 42rpx;
      right: 0;
    }
  }
  .list-bottom {
    margin-top: 50rpx;
    @include flex();
    .line {
      width: 131rpx;
      height: 1rpx;
      background-color: #e6e6e6;
      box-sizing: border-box;
    }
    .text {
      @include textfclaw(21rpx, #333, center, 31rpx);
      margin: 0 19rpx;
    }
  }
}
.data-unsettled {
  height: 300rpx;
  width: 750rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading-img {
    width: 60rpx;
    height: 60rpx;
  }
}
</style>
