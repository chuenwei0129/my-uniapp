<template>
  <view :catchtouchmove="true">
    <u-popup :show="show" round="19" :zIndex="11000" @touchmove.stop.prevent>
      <view class="title">
        选择城市
        <view class="close-icon" @click="close">
          <view class="iconfont icon-close"></view>
        </view>
      </view>
      <view class="position" v-if="!splicing">
        <view class="iconfont icon-address"></view>
        <view class="span">当前城市：</view>
        <view
          class="city-btn fl-row-center"
          :class="[highlight ? 'highlight' : '']"
          @click="currentCity"
          v-if="userCity.city"
        >
          {{ userCity.city == "[]" ? userCity.province : userCity.city }}
        </view>

        <view v-else>
          <view
            class="city-btn fl-row-center"
            v-if="!openSettingFirst"
            @click="handelOpensetting0"
          >
            点击授权
          </view>
          <view class="city-btn fl-row-center" v-if="openSettingFirst">
            点击授权<button
              open-type="openSetting"
              @opensetting="handelOpensetting"
            ></button>
          </view>
        </view>
      </view>

      <PickRegions
        :defaultRegion="defaultRegion"
        :isAddWholeNation="isAddWholeNation"
        @getRegion="getRegion"
      >
      </PickRegions>

      <view class="f-btn">
        <view class="confirm" @click="confirm">确定</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getProductList } from "@/api/base/index";
import PickRegions from "@/components/pickRegions/index.vue";

import { getProgramLocation } from "@/utils/index";

export default {
  name: "cpp-select-city",
  props: {
    defaultRegion: [String, Array],
    show: {
      type: Boolean,
    },
    info: {
      type: Object | null,
    },
    splicing: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAddWholeNation: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    PickRegions,
  },
  data() {
    return {
      cityData: [],
      highlight: false,
      openSettingFirst: uni.getStorageSync("storage_openSetting_first"),
    };
  },

  computed: {
    ...mapState({
      userCity: (state) => state.userCity,
    }),
  },

  onLoad(option) {},
  methods: {
    close() {
      this.$emit("close", true);
    },

    async handelOpensetting0(e) {
      uni.setStorageSync("storage_openSetting_first", true);
      this.openSettingFirst = true;
      console.log(
        "handelOpensetting0: ",
        uni.getStorageSync("storage_openSetting_first")
      );
      // const { latitude, longitude } = await getProgramLocation();
      // if(!latitude) {
      // 	return;
      // };

      this.$emit("fetchPosition", e);
    },
    handelOpensetting(e) {
      console.log("去设置");
      this.$emit("openSetting", e);
    },
    getRegion(data) {
      let newData = JSON.parse(JSON.stringify(data));
      if (data[0] && !data[1]) {
        data[1] = {
          code: data[0].children[0].code,
          lat: data[0].children[0].lat,
          lon: data[0].children[0].lon,
          name: data[0].children[0].name,
          parentCode: data[0].children[0].parentCode,
        };
        newData = JSON.parse(JSON.stringify(data));
      }
      if (data.length > 1 && data[1] != undefined) {
        const name = newData[1].name.substr(newData[1].name.length - 1, 1);
        if (name != "市") {
          newData[1].name = newData[1].name + "市";
        }
      }
      this.cityData = this.splicing ? newData : data;
      let d = this.splicing ? newData : data;
      this.$emit("getRegion", d);
    },
    confirm() {
      if (this.cityData.length == 0) {
        let code =
          this.defaultRegion && this.defaultRegion.length == 6
            ? this.defaultRegion
            : null;
        const defaultArr = [
          {
            code: this.info.provinceCode || code,
            name: this.info.province,
            parentCode: this.info.parentCode,
          },
          {
            code: this.info.cityCode || this.info.adcode,
            name: this.info.city,
            parentCode: this.info.parentCode,
          },
        ];
        this.$emit("getRegion", defaultArr);
      } else {
        this.$emit("getRegion", this.cityData);
      }
      this.$emit("confirm", true);
    },
    currentCity() {
      if (this.splicing) return;
      this.highlight = true;
      const { latitude, longitude } = uni.getStorageSync(
        "storage_currentPosition"
      );
      let adcode = this.userCity.adcode.substr(
        this.userCity.adcode.length - 2,
        2
      );

      let code = this.userCity.adcode.replace(adcode, "00");
      // let citycode = this.userCity.adcode.substr(this.userCity.adcode.length-3, 3);
      // let parentCode = this.userCity.adcode.replace(citycode, '000');
      this.userCity.adcode = code;
      // this.dRegion = [parentCode, this.userCity.adcode];
      const defaultArr = [
        {},
        {
          code: this.userCity.adcode,
          lat: latitude,
          lon: longitude,
          name:
            this.userCity.city == "[]"
              ? this.userCity.province
              : this.userCity.city,
          refresh: true,
        },
      ];
      console.log(this.userCity, "na ming:", defaultArr);
      this.$emit("getRegion", defaultArr);
      this.$emit("confirm", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.height {
  // height: 923rpx;
}

.title {
  height: 115rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333;

  position: relative;

  .close-icon {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    right: 28rpx;
    top: 26rpx;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;

    .iconfont {
      font-size: 48rpx;
    }
  }
}

.position {
  width: 100%;
  height: 135rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  padding: 0 37rpx;

  .iconfont {
    color: #666;
    font-size: 40rpx;
  }

  .span {
    font-size: 27rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #666666;
    line-height: 38rpx;
    margin-left: 12rpx;
  }
}

.city-btn {
  min-width: 150rpx;
  height: 69rpx;
  background: #ffffff;
  border-radius: 35rpx;
  font-size: 27rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #000000;
  margin-left: 15rpx;
  position: relative;
  padding: 0 8rpx;

  button {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    opacity: 0;
  }
}

.f-btn {
  background: #ffffff;
  padding: 15rpx 38rpx;
  margin-top: 44rpx;

  .confirm {
    height: 85rpx;
    line-height: 85rpx;
    text-align: center;
    background: rgba(20, 208, 180, 1);
    border-radius: 40rpx;
    font-size: 29rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
}

.highlight {
  background: #ff8315;
  color: #fff;
}
</style>
