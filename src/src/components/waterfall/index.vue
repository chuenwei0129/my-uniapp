<template>
  <view>
    <view class="waterfallBox">
      <view id="leftColumn" class="column column1">
        <myWaterItem
          :imgKey="imgKey"
          :list="leftList"
          @onClickItem="onClickItem"
          :shopLogo="shopLogo"
          :origin="origin"
        ></myWaterItem>
      </view>
      <view id="rightColumn" class="column column2">
        <myWaterItem
          :imgKey="imgKey"
          :list="rightList"
          @onClickItem="onClickItem"
          :shopLogo="shopLogo"
          :origin="origin"
        ></myWaterItem>
      </view>
    </view>
    <view v-if="noMoreData" class="last-container"> 已经到底啦喵～ </view>
  </view>
</template>
<script>
import myWaterItem from "@/components/waterfall/water-item.vue";
export default {
  name: "myWaterFall",
  props: {
    value: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    //图片在data对象字段
    imgKey: {
      type: String,
      default: "",
    },
    addTime: {
      type: [Number, String],
      default: 5,
    },
    idKey: {
      type: String,
      default: "id",
    },
    shopLogo: {
      type: Boolean,
      default: false,
    },
    noMoreData: {
      type: Boolean,
      default: false,
    },
    // 父级来源
    origin: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      leftList: [],
      rightList: [],
      tempData: [],
    };
  },
  watch: {
    copyFlowList (nVal, oVal) {
      let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
      this.tempData = this.tempData.concat(
        this.cloneData(nVal.slice(startIndex))
      );
      this.splitData();
    },
  },
  components: {
    myWaterItem,
  },
  mounted () {
    this.tempData = this.cloneData(this.copyFlowList);
    this.splitData();
  },
  computed: {
    copyFlowList () {
      return this.cloneData(this.value);
    },
  },
  emits: ["onClickItem"],
  methods: {
    async splitData () {
      if (!this.tempData.length) return;
      let leftRect = await this.$uGetRect("#leftColumn");
      let rightRect = await this.$uGetRect("#rightColumn");
      let item = this.tempData[0];
      if (!item) return;
      if (leftRect.height < rightRect.height) {
        this.leftList.push(item);
      } else if (leftRect.height > rightRect.height) {
        this.rightList.push(item);
      } else {
        if (this.leftList.length <= this.rightList.length) {
          this.leftList.push(item);
        } else {
          this.rightList.push(item);
        }
      }
      this.tempData.splice(0, 1);
      const that = this;
      if (that.tempData.length) {
        setTimeout(() => {
          that.splitData();
        }, that.addTime);
      }
    },
    cloneData (data) {
      return JSON.parse(JSON.stringify(data));
    },
    onClickItem (item) {
      console.log(item);
      this.$emit("onClickItem", item);
    },
    // 清除数据，用于重新渲染
    clear () {
      this.leftList = [];
      this.rightList = [];
      this.tempData = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.waterfallBox {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: #f7f8fc;
}

.column {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: auto;
}
.column1 {
  margin: 0 8rpx 0 16rpx;
}
.column2 {
  margin: 0 16rpx 0 8rpx;
}
.last-container {
  width: 100%;
  display: flex;
  margin-top: 60rpx;
  padding-bottom: 25rpx;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 23rpx;
  color: #5a5a5a;
  line-height: 33rpx;
}
</style>
