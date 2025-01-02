<template>
  <view class="desc">
    <!-- 导航栏 -->
    <view class="illness-bg">
      <nav-bar
        titleColor="#000"
        :showBackBtn="true"
        :whiteBack="false"
        @navBackClickHandle="handleReturn"
        :customback="true"
      >
        <template v-slot:righticon>
          <view class="search-box">
            <u-search
              :focus="true"
              :placeholder="placeholderName"
              v-model="keyword"
              :showAction="false"
              borderColor="#1f1f1f"
              color="1f1f1f"
              height="63rpx"
              bgColor="#fff"
              placeholderColor="#999"
              :searchIconSize="15"
              searchIcon="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/aisearch.png"
              :inputStyle="{ caretColor: '#238CFF' }"
              @search="onSearchClickHandle"
              @click="onClickHandle"
              @change="onValueChangeHandle"
              @clear="onClearClickHandle"
            ></u-search>
          </view>
        </template>
      </nav-bar>
    </view>
    <view v-if="contentShow" class="list-box">
      <view v-if="keyword" class="list-box-scroll">
        <view
          @click="searchSelect(item, 1)"
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
        <view class="name">
          没有搜到相关症状。建议您更换关键词，返回上页选择或搜索热门症状～
        </view>
      </view>
      <view class="not-have"></view>
    </view>
    <view v-if="hotNameShow">
      <view class="hot-box">
        <view class="hot-name">热门搜索</view>
        <view class="hot-in-box">
          <view
            v-for="(item, index) in searchCommonSymptom.slice(0, 10)"
            key="index"
            class="hot-item"
            @click="searchSelect(item, 2)"
          >
            <view class="image-search">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/hot-search.png"
                mode="scaleToFill"
              />
            </view>
            <view class="symptom-name">{{
              item.diseaseName.substring(0, 8)
            }}</view>
            <view v-if="index < 3" class="image-hot">
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/hot.png"
                mode="scaleToFill"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import NavBar from "./components/navBar/index.vue";
export default {
  // props: {
  //   saveModeShow: {
  //     type: Number,
  //   },
  // },
  data() {
    return {
      contentShow: true,
      keyword: "",
      fillist: [],
      saveModeShow: "",
      hotNameShow: true,
      placeholderName: "",
    };
  },
  onLoad(option) {
    console.log(option.saveModeShow, "saveModeShow");
    this.saveModeShow = option.saveModeShow;
    this.placeholderName = `输入“${option.nickName.substring(0, 6)}”的症状`;
    console.log(this.searchCommonSymptom, "this.searchCommonSymptom");
  },
  computed: {
    ...mapState({
      searchSymptom: (state) => state.searchSymptom,
      searchCommonSymptom: (state) => state.searchCommonSymptom,
    }),
  },
  components: {
    NavBar,
  },
  created() {},
  methods: {
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
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
      console.log(symptomList, "symptomList");
      this.fillist = symptomList.filter((item) => {
        return item.diseaseName.indexOf(this.keyword) !== -1;
      });
      if (this.fillist.length == 0) {
        this.contentShow = false;
        this.hotNameShow = true;
        console.log(this.hotNameShow, "this.hotNameShow");
      } else {
        this.contentShow = true;
        this.hotNameShow = false;
      }
    },
    searchSelect(item, type) {
      console.log(item, "item");
      console.log(this.searchCommonSymptom, "this.searchCommonSymptom");
      if (type == 1) {
        this.searchCommonSymptom.forEach((vlaue) => {
          if (vlaue.diseaseName == item.diseaseName) {
            item.secondTier = vlaue.tier;
          }
        });
      } else {
        this.searchSymptom.forEach((vlaue) => {
          if (vlaue.diseaseName == item.diseaseName) {
            item.secondTier = vlaue.tier;
          }
        });
      }

      this.addSymptomData(item);
      this.handleReturn();
    },
    // handleReturn() {
    //   this.$emit("goSwitch", this.saveModeShow);
    // },
    onSearchClickHandle() {},
    onClickHandle() {},
    onClearClickHandle() {
      this.fillist = [];
      this.keyword = "";
      this.hotNameShow = true;
    },
    onValueChangeHandle(value) {
      if (this.keyword.length > 0) {
        this.search();
      } else {
        this.contentShow = true;
        this.hotNameShow = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
