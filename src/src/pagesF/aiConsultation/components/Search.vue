<template>
  <view>
    <view class="search-bar">
      <view class="return" @click="handleReturn">
        <image
          class="image"
          src="https://frontend-cdn.chongpangpang.com/image/H5%08MINAPPAC/back.png"
          mode="scaleToFill"
        />
      </view>
      <u-search
        :focus="true"
        placeholder="搜索"
        v-model="keyword"
        :showAction="false"
        borderColor="#1f1f1f"
        color="1f1f1f"
        height="64rpx"
        bgColor="#fff"
        placeholderColor="#999"
        :searchIconSize="15"
        searchIcon="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/aisearch.png"
        :inputStyle="{ caretColor: '#238CFF' }"
        @search="onSearchClickHandle"
        @click="onClickHandle"
        @change="onValueChangeHandle"
        @focus="onFocusClickHandle"
        @blur="onBlurClickHandle"
        @clear="onClearClickHandle"
      ></u-search>
      <view @click="search" class="search-name">搜索</view>
    </view>
    <view v-if="contentShow" class="list-box">
      <view v-if="keyword" class="list-box-scroll">
        <view
          @click="searchSelect(item)"
          :key="index"
          v-for="(item, index) in fillist"
          class="list-item"
          >{{ item.diseaseName }}</view
        >
      </view>
    </view>
    <view v-else>
      <view class="no-box">
        <view class="img">
          <image
            class="image"
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/noData.png"
            mode="scaleToFill"
          />
        </view>
        <view class="name"> 没有找到相关症状，换一个关键词试试吧~ </view>
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  props: {
    saveModeShow: {
      type: Number,
    },
  },
  created() {},
  data() {
    return {
      contentShow: true,
      keyword: "",
      fillist: [],
    };
  },
  computed: {
    ...mapState({
      searchSymptom: (state) => state.searchSymptom,
      searchCommonSymptom: (state) => state.searchCommonSymptom,
    }),
  },

  methods: {
    ...mapMutations(["addSymptomData"]),
    search() {
      if (this.keyword == "") {
        this.$refs.uToast.show({
          type: "default",
          icon: false,
          message: "请输入症状",
        });
        return;
      }
      // 返回过滤后的数组
      let symptomList = JSON.parse(JSON.stringify(this.searchSymptom));
      this.fillist = symptomList.filter((item) => {
        return item.diseaseName.indexOf(this.keyword) !== -1;
      });
      if (this.fillist.length == 0) {
        this.contentShow = false;
      } else {
        this.contentShow = true;
      }
    },
    searchSelect(item) {
      console.log(item, "item");
      this.searchCommonSymptom.forEach((vlaue) => {
        if (vlaue.diseaseName == item.diseaseName) {
          item.secondTier = vlaue.tier;
        }
      });
      console.log(item, "item112233");
      this.addSymptomData(item);
      // this.handleReturn();
    },
    handleReturn() {
      this.$emit("goSwitch", this.saveModeShow);
    },
    onSearchClickHandle() {},
    onClickHandle() {},
    onClearClickHandle() {
      this.fillist = [];
      this.keyword = "";
    },
    onBlurClickHandle() {},
    onFocusClickHandle() {},
    onValueChangeHandle(value) {
      if (this.keyword.length > 0) {
        this.search();
      } else {
        this.contentShow = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar {
  width: 700rpx;
  height: 60rpx;
  margin: 6rpx auto 0;
  background-color: #ffffff;
  display: flex;
  .return {
    width: 44rpx;
    height: 44rpx;
    margin: 10rpx 10rpx 0 0;
    .image {
      width: 44rpx;
      height: 44rpx;
    }
  }
  .search-name {
    height: 60rpx;
    line-height: 60rpx;
    color: #1f1f1f;
    font-size: 30rpx;
    margin-left: 24rpx;
    // background-color: brown;
  }
}
.list-box {
  margin-top: 40rpx;
  .list-box-scroll {
    height: calc(100vh - 450rpx);
    overflow-y: auto;
    padding-bottom: 100rpx;
    .list-item {
      width: 690rpx;
      height: 90rpx;
      line-height: 90rpx;
      border-bottom: 1rpx solid #f8f8f8;
      margin: 0 auto;
      font-size: 30rpx;
    }
  }
}
.no-box {
  width: 360rpx;
  margin: 200rpx auto;
  .img {
    image {
      width: 360rpx;
      height: 360rpx;
    }
  }
  .name {
    font-size: 26rpx;
    width: 380rpx;
    text-align: center;
    margin: 20rpx auto 40rpx;
    color: #999999;
  }
}
</style>
