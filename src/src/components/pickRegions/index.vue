<template>
  <view class="center">
    <view v-if="multiArray[0] && multiArray[0].length > 2">
      <picker-view
        :value="multiIndex"
        @change="handleValueChange2"
        @pickend="handlePickend"
        indicator-class="picker-indicator"
        class="picker-view"
      >
        <picker-view-column class="column one">
          <view
            class="item"
            v-for="(item, index) in multiArray[0]"
            :key="index"
          >
            {{ item }}
          </view>
        </picker-view-column>
        <picker-view-column class="column two">
          <view
            class="item"
            v-for="(item, index) in multiArray[1]"
            :key="index"
            >{{ item }}</view
          >
        </picker-view-column>
      </picker-view>
    </view>
    <!-- 		<picker
			class="pick"
			mode="multiSelector"
			:value="multiIndex"
			:range="multiArray"
			@change="handleValueChange"
			@columnchange="handleColumnChange"
		  >
			<slot></slot>
		</picker> -->
  </view>
</template>

<script>
import { getCityData } from "@/api/index";
export default {
  props: {
    defaultRegion: [String, Array],
    level: {
      type: Number,
      required: false,
    },
    isAddWholeNation: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      cityArr: [],
      districtArr: [],
      multiIndex: [0, 0, 0],
      isInitMultiArray: true,
      cityData: [],
      storeKeyArr: [0, 0],
    };
  },
  mounted() {
    getCityData().then((res) => {
      this.cityData = res.data;
      //添加全国
      if (this.isAddWholeNation) {
        this.cityData.unshift({
          children: [
            {
              children: [],
              code: -1,
              lat: null,
              level: 0,
              lon: null,
              name: "全国",
              parentCode: null,
            },
          ],
          code: -1,
          lat: null,
          level: 0,
          lon: null,
          name: "全国",
          parentCode: null,
        });
      }

      this.cityArr = this.cityData[0].children;
      this.districtArr = this.cityData[0].children[0].children;
      uni.setStorageSync("defaultCity", {
        province: this.cityData[0],
        city: this.cityData[0].children[0],
      });
      if (Array.isArray(this.defaultRegion)) {
        this.handleArrDefaultRegion(this.defaultRegion);
        return;
      }
      if (this.defaultRegion && this.defaultRegion.length == 6) {
        this.handleDefaultRegion(this.defaultRegion);
      } else {
        console.warn("defaultRegion非有效格式");
      }
    });
  },
  watch: {
    defaultRegion: {
      handler(region, oldRegion) {
        if (Array.isArray(region)) {
          // 避免传的是字面量的时候重复触发
          oldRegion = oldRegion || [];
          if (!Array.isArray(oldRegion)) {
            oldRegion = [oldRegion];
          }
          if (!oldRegion.join("")) {
            this.handleDefaultRegion(region);
            return;
          }
          if (region.join("") !== oldRegion.join("")) {
            this.handleArrDefaultRegion(region);
          }
        } else if (region && region.length == 6) {
          this.handleDefaultRegion(region);
        } else {
          console.warn("defaultRegion非有效格式");
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    multiArray() {
      return this.pickedArr.map((arr) => arr.map((item) => item.name));
    },
    pickedArr() {
      // 进行初始化
      if (this.isInitMultiArray && this.cityData.length != 0) {
        return [
          this.cityData,
          this.cityData[0].children,
          this.cityData[0].children[0].children,
        ];
      }
      if (this.level == 3) {
        return [this.cityData, this.cityArr, this.districtArr];
      }
      return [this.cityData, this.cityArr];
    },
  },
  methods: {
    handleColumnChange(e) {
      this.isInitMultiArray = false;
      const that = this;
      let col = e.detail.column;
      let row = e.detail.value;
      that.multiIndex[col] = row;
      try {
        switch (col) {
          case 0:
            if (that.cityData[that.multiIndex[0]].children.length == 0) {
              that.cityArr = that.districtArr = [
                that.cityData[that.multiIndex[0]],
              ];
              break;
            }
            that.cityArr = that.cityData[that.multiIndex[0]].children;
            that.districtArr =
              that.cityData[that.multiIndex[0]].children[
                that.multiIndex[1]
              ].children;
            break;
          case 1:
            that.districtArr =
              that.cityData[that.multiIndex[0]].children[
                that.multiIndex[1]
              ].children;
            break;
          case 2:
            break;
        }
      } catch (e) {
        that.districtArr =
          that.cityData[that.multiIndex[0]].children[0].children;
      }
    },
    handleValueChange2(e) {
      this.storeKeyArr = e.detail.value;
      this.cityArr = this.cityData[e.detail.value[0]].children;
    },
    handlePickend(e) {
      setTimeout(() => {
        this.isInitMultiArray = false;
        let [index0, index1] = this.storeKeyArr;
        let [arr0, arr1] = this.pickedArr;
        let address = [arr0[index0], arr1[index1]];
        this.$emit("getRegion", address);
      }, 100);
    },
    handleValueChange(e) {
      // 结构赋值
      if (this.level == 3) {
        let [index0, index1, index2] = e.detail.value;
        let [arr0, arr1, arr2] = this.pickedArr;
        let address = [arr0[index0], arr1[index1], arr2[index2]];
        this.$emit("getRegion", address);
      }
      let [index0, index1] = e.detail.value;
      let [arr0, arr1] = this.pickedArr;
      let address = [arr0[index0], arr1[index1]];
      this.$emit("getRegion", address);
      return;
    },
    handleArrDefaultRegion(region) {
      let children = this.cityData;
      const province = region[0];
      const city = region[1];
      for (let j = 0; j < children.length; j++) {
        let condition = children[j].code == province ? true : false;
        if (condition) {
          this.cityArr = this.cityData[j].children;
          for (let i = 0; i < children[j].children.length; i++) {
            if (children[j].children[i].code == city) {
              this.multiIndex = [j, i];
              this.storeKeyArr = this.multiIndex;
            }
          }
        }
      }
      this.handlePickend();
    },
    handleDefaultRegion(region) {
      const isCode = !Array.isArray(region);
      this.isInitMultiArray = false;
      let children = this.cityData;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < children.length; j++) {
          // console.log(children[j].code, '///////', region)
          let condition = isCode
            ? children[j].code == region
            : children[j].name.includes(region[i]);

          if (condition) {
            // 匹配成功进行赋值
            children = children[j].children;

            if (i == 0) {
              this.cityArr = children;
            } else if (i == 1) {
              this.districtArr = children;
            }
            this.$set(this.multiIndex, i, j);
            break;
          } else {
            // 首次匹配失败就用默认的初始化
            // console.log(i,j,children.length-1);
            if (i == 0 && j == children.length - 1) {
              this.isInitMultiArray = true;
            }
          }
        }
      }
    },
  },
};
</script>
<style scoped>
.picker-view {
  width: 100%;
  height: 396rpx;
}

.item {
  color: #4d4d4f;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 77rpx;
}

.center {
  padding: 0 31rpx;
}

v-deep .picker-indicator {
  height: 77rpx !important;
}

/*  /deep/ .picker-indicator::after{
		border-bottom: 0 !important;
	}

	/deep/ .picker-indicator::before{
		border-top: 0 !important;
	}
	/deep/ .column .picker-indicator  {
		width: 100% !important;
		overflow: hidden;
		background-color: #eee;
		opacity: 0.6;
		height: 77rpx;
	}
	/deep/ .one .picker-indicator  {
		border-radius: 48rpx 0 0 48rpx;
	}
	/deep/ .two .picker-indicator  {
		border-radius: 0 48rpx 48rpx 0;
	} */
</style>
