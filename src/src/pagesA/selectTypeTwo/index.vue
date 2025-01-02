<template>
  <view class="pet-card">
    <!-- @select="clickSelect" :id="item.letter" -->
    <!-- #ifdef H5 -->
    <NavBar
      :title="'添加宠物'"
      navColor="#ffffff"
      :whiteBack="false"
      showBackBtn
      @navBackClickHandle="handleReturn"
      :customback="true"
      :style="{position: 'sticky',top: 0,left: 0, zIndex: 999}"
    >
    </NavBar>
    <!-- #endif -->
    <!-- :style="{ height: `calc(100vh - ${navHeight}px)` }" -->

      <u-index-list
        custom-nav-height="30"
        :sticky="true"
        :index-list="indexList"
        class="container"
        inactiveColor="#000000"
        activeColor="#2DCE80"
      >
        <view slot="header">
          <view>
            <view class="search">
              <view class="inp" @click="handleToSearch">
                <view class="searchicon"></view>
                <view class="place">搜索宠物品种</view>
              </view>
            </view>
          </view>
          <view class="hot">
            <view
              class="hot-item"
              v-for="hitem in hotList"
              :key="hitem.id"
              @click="
                () => {
                  handSelectPet(hitem);
                }
              "
            >
              <view class="avator">
                <image class="hotImg" :src="hitem.pic" mode="scaleToFill" />
              </view>
              <view class="petname">{{ hitem.name.substr(0, 5) }}</view>
            </view>
          </view>
        </view>
        <view v-for="(item, index) in itemArr" :key="item.letter">
          <!-- #ifdef APP-NVUE -->
          <u-index-anchor :text="indexList[index]"></u-index-anchor>
          <!-- #endif -->
          <u-index-item>
            <!-- #ifndef APP-NVUE -->
            <u-index-anchor :text="indexList[index]"></u-index-anchor>
            <!-- #endif -->
            <view
              class="list-cell"
              v-for="(cell, index) in item.data"
              :key="cell.id"
              @click="
                () => {
                  handSelectPet(cell);
                }
              "
            >
              <view class="text">
                {{ cell.name }}
              </view>
              <view class="line"> </view>
            </view>
          </u-index-item>
        </view>
      </u-index-list>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
import { getPetIndexList } from "@/api/base";
import NavBar from "@/components/navBar/index.vue";
export default {
  //...wxShareMethod(),
  components: {
    NavBar,
  },
  onLoad(option) {
    // this.categoryId = option.categoryId || "50";
    // this.petId = option.petId || "";
    this.parentId = option.parentId || "";
    this.enterType = option.enterType || "";
    console.log("selectTypeTwo : ", option);

    // #ifdef H5
    let h5NavHeight =
      Number(getApp().globalData.h5StatusBarHeight) +
      Number(getApp().globalData.h5NavBarHeight);
      //h5NavHeight是navbar高度  搜索栏在盒子高度之内不用加上搜索栏高度
    this.navHeight = h5NavHeight;
    //兜底逻辑
    console.log(this.navHeight, '高',this.rpx2px(244),h5NavHeight,this.rpx2px(85))
    // #endif

    // #ifdef MP-WEIXIN
    this.navHeight = 0;
    // #endif
  },
  onReady () { },
  onShow () { },
  data () {
    return {
      // categoryId: "",
      // petId: "",
      parentId: "",
      hotList: [],
      // indexList: [],
      indexList: [],
      itemArr: [],
      indexListOld: [],

      enterType: "",
      navHeight: "",
    };
  },

  mounted () {
    this.initPage();
  },
  methods: {
    handleGoBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
    // rpx转px
    rpxToPx (rpx) {
      const screenWidth = uni.getSystemInfoSync().screenWidth;
      return (screenWidth * Number.parseInt(rpx)) / 750;
    },

    clickSelect (e) {
      console.log("clickSelectclickSelectclickSelectclickSelectclickSelect");
      //从当前位置到达目标位置
      console.log(e);
      uni
        .createSelectorQuery()
        .select("#" + e)
        .boundingClientRect((data) => {
          //目标位置的节点：类或者id
          uni
            .createSelectorQuery()
            .select(".container")
            .boundingClientRect((res) => {
              //最外层盒子的节点：类或者id
              this.$nextTick(function () {
                uni.pageScrollTo({
                  scrollTop: data.top - res.top,
                  duration: 0, //app端这个必须设置成0
                });
              });
            })
            .exec();
        })
        .exec();
    },
    initPage () {
      getPetIndexList(this.parentId).then((res) => {
        const { list, second } = res.data;
        this.hotList = list || [];
        this.indexListOld = second;
        console.log("second: ", second);
        console.log("indexList: ", this.indexList);
        // second.forEach(item => {
        //   for (let index = 0; index < this.indexListOld.length; index++) {
        //     const temp = this.indexListOld[index];
        //     if(temp.name == item.name){
        //       this.indexListOld[index].value = item.value;
        //     }
        //   }
        // });
        console.log("indexListOld: ", this.indexListOld);
        for (let index = 0; index < this.indexListOld.length; index++) {
          const temp = this.indexListOld[index];
          this.indexList.push(temp.name);
          console.log("temp: ", temp);
          let a = { data: temp.value, letter: temp.name };
          console.log("a: ", a);
          this.itemArr.push(a);
        }
        // this.indexList.unshift("#")
        // this.itemArr.unshift({ data: [{ name: '#' }], letter: '#' })
        console.log("indexList: ", this.indexList);
        console.log("itemArr: ", this.itemArr);
      });
    },
    handleToSearch () {
      const allList = [];
      console.log("indexList: ", this.indexListOld);
      this.indexListOld.forEach((i) => {
        allList.push(...i.value);
      });
      uni.setStorageSync("searchList", allList);

      if (this.enterType == "AI") {
        uni.navigateTo({
          url: `/pagesA/selectTypeTwoSearch/index?enterType=AI`,
        });
      } else {
        uni.navigateTo({
          url: `/pagesA/selectTypeTwoSearch/index`,
        });
      }
    },
    handSelectPet (item) {
      // uni.redirectTo({
      //   url: `/pagesD/petInfo/index?categoryId=${item.id}&categoryName=${item.name}`,
      // });
      console.log("selectPetType item: ", item);
      // setTimeout(() => {

      // }, 1000);

      if (this.enterType == "AI") {
        uni.navigateBack({
          delta: 1,
          success: () => {
            uni.$emit("selectPetTypeAI", {
              categoryId: item.id,
              categoryName: item.name,
            });
          },
        });
      } else {
        console.log("返回");
        uni.navigateBack({
          delta: 1,
          success: () => {
            uni.$emit("selectPetType", {
              categoryId: item.id,
              categoryName: item.name,
            });
          },
        });
      }
    },
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
    rpx2px(rpx) {
      const systemInfo = uni.getSystemInfoSync();
      const screenWidth = systemInfo.screenWidth;
      const pxRatio = screenWidth / 750; // 750 是设计稿的宽度，可以根据实际情况修改
      return rpx * pxRatio;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
::v-deep .header .navbar-wrapper .title {
  font-weight: 500 !important;
}
//修复h5偶发的页面底部被挡住问题
// #ifdef H5
// ::v-deep .u-index-list{
//   uni-scroll-view{
//     max-height: 1446rpx !important;
//   }
// }
// #endif
</style>
