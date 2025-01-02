<template>
  <view class="want-see">
    <view class="want-see1-3">
      <view
        class="want-see1"
        v-if="detail && detail[0]"
        @click="handleImg(detail[0])"
      >
        <image
          class="see-img-one"
          v-if="detail && detail[0]"
          @click="handleImg(detail[0])"
          mode="aspectFill"
          :src="detail[0].coverPic"
        >
        </image>
        <view class="mainTitle-subtitle">
          <view class="mainTitle">{{ `${detail[0].mainTitle}` }}</view>
          <view class="subtitle">{{ `${detail[0].subtitle || ""}` }}</view>
        </view>
      </view>

      <view class="want-see2-3">
        <view
          class="want-see2"
          v-if="detail && detail[1]"
          @click="handleImg(detail[1])"
        >
          <image
            class="see-img"
            v-if="detail && detail[1]"
            @click="handleImg(detail[1])"
            mode="aspectFill"
            :src="detail[1].coverPic"
          >
          </image>
          <view class="mainTitle-subtitle">
            <view class="mainTitle">{{ `${detail[1].mainTitle}` }}</view>
            <view class="subtitle">{{ `${detail[1].subtitle || ""}` }}</view>
          </view>
        </view>

        <view
          class="want-see3"
          v-if="detail && detail[2]"
          @click="handleImg(detail[2])"
        >
          <image
            class="see-img"
            v-if="detail && detail[2]"
            @click="handleImg(detail[2])"
            mode="aspectFill"
            :src="detail[2].coverPic"
          >
          </image>
          <view class="mainTitle-subtitle">
            <view class="mainTitle">{{ `${detail[2].mainTitle}` }}</view>
            <view class="subtitle">{{ `${detail[2].subtitle || ""}` }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="want-see4-4" v-if="detail && detail[3] && !detail[4]">
      <view
        class="want-see4"
        v-if="detail && detail[3]"
        @click="handleImg(detail[3])"
      >
        <image
          class="see-img"
          v-if="detail && detail[3]"
          @click="handleImg(detail[3])"
          mode="aspectFill"
          :src="detail[3].coverPic"
        >
        </image>
        <view class="mainTitle-subtitle">
          <view class="mainTitle">{{ `${detail[3].mainTitle}` }}</view>
          <view class="subtitle">{{ `${detail[3].subtitle || ""}` }}</view>
        </view>
      </view>
    </view>
    <view class="want-see4-5" v-if="detail && detail[3] && detail[4]">
      <view
        class="want-see4"
        v-if="detail && detail[3] && detail[4]"
        @click="handleImg(detail[4])"
      >
        <image
          class="see-img"
          v-if="detail && detail[3]"
          @click="handleImg(detail[4])"
          mode="aspectFill"
          :src="detail[3].coverPic"
        >
        </image>
        <view class="mainTitle-subtitle">
          <view class="mainTitle">{{ `${detail[3].mainTitle}` }}</view>
          <view class="subtitle">{{ `${detail[3].subtitle || ""}` }}</view>
        </view>
      </view>
      <view
        class="want-see5"
        v-if="detail && detail[4]"
        @click="handleImg(detail[4])"
      >
        <image
          class="see-img"
          v-if="detail && detail[4]"
          @click="handleImg(detail[4])"
          mode="aspectFill"
          :src="detail[4].coverPic"
        >
        </image>
        <view class="mainTitle-subtitle">
          <view class="mainTitle">{{ `${detail[4].mainTitle}` }}</view>
          <view class="subtitle">{{ `${detail[4].subtitle || ""}` }}</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { action_report, display_report } from "@/utils/track";

/**
 * 区分环境接口请求地址
 */
const SHARE_BASR_URL =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test" ||
  process.env.NODE_ENV === "development-local"
    ? "https://cn-dev02-shareactivity.chongpangpang.com/"
    : "https://shareactivity.chongpangpang.com/";

export default {
  components: {},
  props: {
    // isInactive: {
    //     type: Boolean,
    //     default: true,
    // },
    petId: {
      type: String,
      default: "",
    },
    curLiveCycle: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      detail: null,
    };
  },
  computed: {},
  mounted() {
    console.log("11 curLiveCycle ", this.curLiveCycle, this.petId);
    this.detail = this.curLiveCycle.detail;
    console.log("11  this.detail ", this.detail);
  },
  methods: {
    handleImg(data) {
      console.log("11  data ", SHARE_BASR_URL);
      // let path = `https://cn-dev02-shareactivity.chongpangpang.com/h5/shareActivity/?random=123#/petCraftsmanship?petId=${this.petId}&cycleId=${data.cycleId}&detailId=${data.id}`
      let path =
        SHARE_BASR_URL +
        `h5/shareActivity/?random=123#/petCraftsmanship?petId=${this.petId}&cycleId=${data.cycleId}&detailId=${data.id}`;
      if (path.indexOf("http") !== -1) {
        let newRoute = "";
        if (path.indexOf("h5/shareActivity/?random=123#")) {
          newRoute = path.replace("h5/shareActivity/?random=123#", "#");
        } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
          newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
        } else if (path.indexOf("h5/shareActivity/?random=123")) {
          newRoute = path.replace("h5/shareActivity/?random=123/", "");
        }
        let str = `/pagesA/webView/index?route=${encodeURIComponent(
          newRoute
        )}&type=icon`;
        return uni.navigateTo({
          url: str,
        });
      } else {
        return uni.navigateTo({
          url: path,
        });
      }

      // let newRoute = `/h5/shareActivity/?random=123#/petCraftsmanship?petId=${this.petId}&cycleId=${data.cycleId}&detailId=${data.id}`;

      // let str = `/pagesA/webView/index?route=${encodeURIComponent(
      //     newRoute
      // )}`
      // uni.navigateTo({
      //     url: str,
      // });
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.want-see {
  padding: 0rpx 0rpx 48rpx 0rpx;
  display: flex;
  flex-direction: column;
}

.want-see1 {
  width: 100%;
  height: 277rpx;
  position: relative;
  margin-right: 8rpx;
}

.want-see2 {
  width: 100%;
  height: 135rpx;
  margin-bottom: 8rpx;
  // border-radius: 8rpx;
  position: relative;
}

.want-see3 {
  width: 100%;
  height: 135rpx;
  // border-radius: 8rpx;
  position: relative;
}

.want-see4 {
  width: 100%;
  height: 135rpx;
  border-radius: 8rpx;
  // margin-right: 8rpx;
  position: relative;
  margin-right: 8rpx;
}

.want-see5 {
  width: 100%;
  height: 135rpx;
  // border-radius: 8rpx;
  position: relative;
}

.want-see1-3 {
  display: flex;
}

.want-see2-3 {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.want-see4-4 {
  display: flex;
  margin-top: 12rpx;
}

.want-see4-5 {
  display: flex;
  margin-top: 12rpx;
}

.see-img-one {
  position: absolute;
  width: 100%;
  height: 277rpx;
  border-radius: 8rpx;
}

.see-img {
  position: absolute;
  width: 100%;
  height: 135rpx;
  border-radius: 8rpx;
}

.mainTitle-subtitle {
  position: absolute;
  left: 17rpx;
  bottom: 17rpx;

  .mainTitle {
    // width: 154rpx;
    height: 42rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 600;
    font-size: 31rpx;
    color: #ffffff;
    line-height: 42rpx;
    text-align: left;
    font-style: normal;
  }

  .subtitle {
    // width: 146rpx;
    height: 31rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 21rpx;
    color: #ffffff;
    line-height: 31rpx;
    text-align: left;
    font-style: normal;
  }
}
</style>
