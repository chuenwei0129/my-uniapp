<template>
  <view class="vaccineDeworming-container">
    <view class="vaccineDeworming" v-if="liveVacc.length">
      <view class="content">
        <view class="header">
          <view class="title">疫苗</view>
        </view>
        <view class="scol-view">
          <view
            class="item"
            v-for="(item, i) in liveVacc"
            :key="item.id"
            :class="{
              marginBottom: i == liveVacc.length - 1,
              mBottom_0: !item.vaccinesBrand,
            }"
          >
            <template v-if="item.vaccinesBrand">
              <view class="item-left">
                <text>{{ item.vaccinesBrand || "-" }}</text>
                <text class="line">|</text>
                <text>第{{ item.vaccinationFrequency || "-" }}针</text>
              </view>
              <view class="item-right">
                {{ item.vaccinationTime || "-" }}
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    <view class="vaccineDeworming" v-if="externalInfo.length">
      <view class="content">
        <view class="header">
          <view class="title">外部驱虫</view>
        </view>
        <view class="scol-view">
          <view
            class="item"
            v-for="(item, i) in externalInfo"
            :key="item.id"
            :class="{
              marginBottom: i == externalInfo.length - 1,
              mBottom_0: !item.dewormingBrand,
            }"
          >
            <template v-if="item.dewormingBrand">
              <view class="item-left">
                <text>{{ item.dewormingBrand || "-" }}</text>
                <text class="line">|</text>
                <text>第{{ item.externalDewormingNumber || "-" }}针</text>
              </view>
              <view class="item-right">
                {{ item.dewormingTime || "-" }}
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    <view class="vaccineDeworming" v-if="insideInfo.length">
      <view class="content">
        <view class="header">
          <view class="title">内部驱虫</view>
        </view>
        <view class="scol-view">
          <view
            class="item"
            v-for="(item, i) in insideInfo"
            :key="item.id"
            :class="{
              marginBottom: i == insideInfo.length - 1,
              mBottom_0: !item.dewormingBrand,
            }"
          >
            <template v-if="item.dewormingBrand">
              <view class="item-left">
                <text>{{ item.dewormingBrand || "-" }}</text>
                <text class="line">|</text>
                <text>第{{ item.internalDewormingNumber || "-" }}针</text>
              </view>
              <view class="item-right">
                {{ item.dewormingTime || "-" }}
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
    <PopVaccine
      :isOpen="toIsOpen"
      @close="handleClose"
      :liveVacc="liveVacc"
      :insideInfo="insideInfo"
      :externalInfo="externalInfo"
    />
  </view>
</template>

<script>
import PopVaccine from "./popVaccine.vue";

const keys = {
  1: ["vaccinesBrand", "vaccinationTime", "疫苗", "针"],
  2: ["dewormingBrand", "dewormingTime", "体内驱虫", "次"],
  3: ["dewormingBrand", "dewormingTime", "体外驱虫", "次"],
};
export default {
  name: "vaccineDeworming",
  components: { PopVaccine },
  props: {
    livebodyData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      toIsOpen: false,
      rightIcon_gray:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/rightIcon_gray.png",
    };
  },
  computed: {
    liveVacc() {
      const liveSkuInfo = this.livebodyData.liveSkuDTO;
      // 对数组进行排序
      // liveSkuInfo.vaccinationList.sort(this.sortByDateDescending);
      const sortedArray1 = this.sortByDateDescending(
        liveSkuInfo.vaccinationList,
        "vaccinationTime"
      );
      return sortedArray1;
    },
    insideInfo() {
      const liveSkuInfo = this.livebodyData.liveSkuDTO;
      const liveDewormingInfo = liveSkuInfo?.liveDewormingRecordDTO?.filter(
        (item) => item.dewormingType == 1
      );
      const sortedArray2 = this.sortByDateDescending(
        liveDewormingInfo,
        "dewormingTime"
      );
      return sortedArray2;
    },
    externalInfo() {
      const liveSkuInfo = this.livebodyData.liveSkuDTO;
      const liveExternalInfo = liveSkuInfo?.liveDewormingRecordDTO?.filter(
        (item) => item.dewormingType == 2
      );
      const sortedArray3 = this.sortByDateDescending(
        liveExternalInfo,
        "dewormingTime"
      );
      return sortedArray3;
    },
  },
  mounted() {},
  methods: {
    sortByDateDescending(array, dateField) {
      return array.sort((a, b) => {
        const dateA = new Date(a[dateField]);
        const dateB = new Date(b[dateField]);
        return dateB - dateA; // 降序排列
      });
    },
    /**
     * 过滤数组处理疫苗驱虫数据
     * @param list
     * @param type 1 疫苗 2 体内驱虫 3 体外驱虫
     */
    filterList(list, type) {
      if (list && list.length > 0) {
        const newObjMap = {};
        list.forEach((item) => {
          const key0 = keys[type][0]; // 品牌
          const key1 = keys[type][1]; // 时间
          if (!newObjMap[item[key0]]) {
            newObjMap[item[key0]] = [];
          }
          newObjMap[item[key0]].push(item[key1]);
        });
        console.log("newObjMap", newObjMap);

        let result = "";
        for (const [brand, times] of Object.entries(newObjMap)) {
          console.log("newObjMap1", brand, times);
          result = brand;
          // result += `${brand} ${times.join("、")}，`;
        }
        // 去掉最后一个逗号和空格
        // result = result.slice(0, -1);
        let obj = {
          name: keys[type][2],
          times: `${list.length}${keys[type][3]}`,
          desc: result,
        };
        return obj;
      }
    },
    handleClose(bool) {
      this.toIsOpen = bool;
    },
    handleClick() {
      this.toIsOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.vaccineDeworming-container {
  position: relative;

  background: #fff;
  .liner-bg {
    margin: 0 auto;
    width: 692rpx;
    height: 2rpx;
    // border: 2rpx solid #f8f8f8;
    background-color: #f8f8f8;
  }
}
.vaccineDeworming {
  width: 100%;
  // margin-top: 37rpx;
  padding-top: 37rpx;
  box-sizing: border-box;
  position: relative;
  .content {
    background: #fff;
    border-radius: 23rpx;
    padding-left: 29rpx;
    box-sizing: border-box;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 23rpx;
      height: 42rpx;
      .title {
        font-family: PingFangSC, PingFang SC;
        font-weight: 600;
        font-size: 31rpx;
        color: #1f1f1f;
        line-height: 42rpx;
        text-align: left;
        font-style: normal;
      }
    }
    .scol-view {
      display: flex;
      flex-direction: row;
      overflow-x: auto; /* 允许水平滚动 */
      white-space: nowrap; /* 防止换行 */
      .item {
        flex: 0 0 auto; /* 防止子元素伸缩 */
        width: 385rpx;
        height: 108rpx;
        background: #f7f8fc;
        border-radius: 15rpx;
        padding: 17rpx 20rpx 17rpx 23rpx;
        margin-right: 15rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .item-left {
          height: 35rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 300;
          font-size: 25rpx;
          color: #1f1f1f;
          line-height: 35rpx;
          text-align: left;
          font-style: normal;
          margin-bottom: 4rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          .line {
            // color: #6a6a6a;
            margin: 0 10rpx;
          }
        }
        .item-right {
          height: 35rpx;
          font-family: PingFangSC, PingFang SC;
          font-weight: 300;
          font-size: 25rpx;
          color: #999999;
          line-height: 35rpx;
          text-align: left;
          font-style: normal;
        }
      }
    }

    .marginBottom {
      margin-bottom: 0 !important;
    }
    .name {
      margin-right: 10rpx;
    }
  }
}

.mBottom_0 {
  margin-bottom: 0 !important;
}
</style>
