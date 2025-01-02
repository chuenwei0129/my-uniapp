<template>
  <view
    class="pet-detail"
    :class="[
      selectInfo.catPet && !iflong ? 'cat-type' : '',
      selectInfo.dogPet && !iflong ? 'dog-type' : '',
      selectInfo.otherPet && !iflong ? 'other-type' : '',
      selectInfo.catPet && iflong ? ['long', 'cat-type-mul'] : '',
      selectInfo.dogPet && iflong ? ['long', 'dog-type-mul'] : '',
      selectInfo.otherPet && iflong ? ['long', 'other-type-mul'] : '',
    ]"
  >
    <view class="pet-info">
      <image
        @click="toEditPet"
        :src="selectInfo.avatarUrl"
        class="pet-avatar"
        mode="aspectFill"
      ></image>
      <view class="details">
        <view class="petname"
          >{{ selectInfo.nickName.slice(0, 7)
          }}<view class="editicon" @click="toEditPet"></view>
        </view>
        <view class="tags" v-if="!selectInfo.otherPet">
          <view class="yearage tagitem" v-if="selectInfo.humanAge"
            >相当于人类{{ selectInfo.humanAge }}岁</view
          >
          <view
            class="growthlevel tagitem"
            v-if="selectInfo.currentCycleName"
            >{{ selectInfo.currentCycleName }}</view
          >
        </view>
      </view>
    </view>
    <view
      :class="['pet-card', `${selectInfo.otherPet ? 'other-pet-card' : ''}`]"
    >
      <view class="attritem">
        <view>
          <view class="attrvalue">{{
            selectInfo.categoryName.slice(0, 5)
          }}</view>
          <view class="attrtitle">品种</view>
        </view>
      </view>
      <view class="attritem">
        <view>
          <view class="attrvalue">{{ getAge }}</view>
          <view class="attrtitle">年龄</view>
        </view>
      </view>
      <view class="attritem">
        <view>
          <view class="attrvalue">{{
            selectInfo.sexName == "MM" ? "妹妹" : "弟弟"
          }}</view>
          <view class="attrtitle">性别</view>
        </view>
      </view>
      <view class="attritem" v-if="!selectInfo.otherPet">
        <view>
          <view class="attrvalue">{{
            selectInfo.sterilizationStatus == 0
              ? "未知"
              : selectInfo.sterilizationStatus == 2
              ? "已绝育"
              : "未绝育"
          }}</view>
          <view class="attrtitle">绝育情况</view>
        </view>
      </view>
    </view>
    <view class="birthdate">
      <view class="dateicon"></view>出生日期: {{ selectInfo.birth }}
    </view>
    <view :class="['pet-list', iflong ? '' : 'single']">
      <view class="list-wrap">
        <image
          :src="item.avatarUrl"
          v-if="iflong"
          v-for="(item, index) in petList"
          :key="index"
          :class="['petitemsrc', `${petId == item.id ? 'selected' : ''}`]"
          mode="aspectFill"
          @click="togglePet(item)"
        >
        </image>
        <view class="addbtn" @click="addPet" :class="ismul ? 'btn-empty' : ''">
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/addbtn.png"
            class="add-icon"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { action_report } from "@/utils/track";
export default {
  props: {
    petList: {
      type: Array,
      default: [],
    },
    petId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // selectInfo: {},
      // selectedId: ''
    };
  },
  computed: {
    getAge() {
      let time = this.selectInfo.guardTime;
      if (
        time.indexOf("岁") > -1 &&
        time.indexOf("月") > -1 &&
        time.indexOf("天") > -1
      ) {
        return time.split("月")[0] + "月";
      } else {
        return time;
      }
    },
    iflong() {
      return this.petList.length >= 2 ? true : false;
    },

    ismul() {
      return this.petList.length >= 3 ? true : false;
    },
    selectInfo() {
      let petData = this.petList.filter((item, index) => item.id == this.petId);
      return petData?.length ? petData[0] : this.petList[0];
    },

    //背景图样式
    // bgStyle() {
    //   return (item) => {
    //     return [
    //       item.catPet ?'cat-type':'',
    //       item.dogPet ?'dog-type':'',
    //       item.otherPet ?'other-type':'',
    //     ];
    //   };
    // },
  },
  methods: {
    toEditPet() {
      action_report({
        action_name: "petfiles_edit",
        module_name: "Pet",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
      // #ifdef MP-WEIXIN
      uni.redirectTo({
        url: `/pagesD/editPetProfile/index?petId=${this.selectInfo.id}&type=edit&enterType=myPetAdd`,
      });
      // #endif
      // #ifdef H5
      uni.navigateTo({
        url: `/pagesD/editPetProfile/index?petId=${this.selectInfo.id}&type=edit&enterType=myPetAdd`,
      });
      // this.$dsBridge.call("editPet", this.selectInfo.id);
      // #endif
    },
    togglePet(item) {
      this.$emit("changePet", item.id);
    },
    addPet() {
      action_report({
        action_name: "petfiles_addpet_display",
        module_name: "petfiles",
        // #ifdef H5
        extend: {
          user_id: this.$dsBridge.call("getUserId", "getUserId"),
        },
        // #endif
      });
      //原来区分小程序 h5 h5跳原生编辑页面 现在不区分
      uni.redirectTo({
        url: `/pagesD/petInfo/index?enterType=myPetAdd&transparentTopBar=1`,
      });
    },
  },
  mounted() {

    if (!this.petId) {
      this.petId = this.petList[0].id;
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../../utils/fn.scss";

.pet-detail {
  width: 692rpx;
  height: 335rpx;
  position: relative;
  margin: 19rpx auto 0;
  margin-bottom: 19rpx;

  &.cat-type {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/catBg@3x.png"
    );
  }
  &.dog-type {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/dogBgUp@3x.png"
    );
  }
  &.other-type {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/otherBgUp@3x.png"
    );
  }

  &.cat-type-mul {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/catMul@3x.png"
    );
  }

  &.dog-type-mul {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/dogMulUp@3x.png"
    );
  }

  &.other-type-mul {
    @include bg(
      "https://frontend-cdn.chongpangpang.com/image/medical-mp/petChannel/otherMulUp@3x.png"
    );
  }

  &.long {
    .pet-list {
      @include absNormal(212rpx, 77rpx, $top: 10rpx, $left: 480rpx);
    }
  }

  .pet-info {
    display: flex;
    align-items: center;
    padding: 31rpx 31rpx 38rpx 31rpx;

    .pet-avatar {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      margin-right: 19rpx;
    }

    .details {
      // display: flex;
      // align-items: center;
      .petname {
        display: flex;
        align-items: center;
        @include textfclaw(38rpx, #1f1f1f, $align: left, $lineH: 54rpx);
        font-weight: bold;
      }

      .editicon {
        width: 31rpx;
        height: 31rpx;
        margin-left: 10rpx;
        @include bg(
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/editicon.png"
        );
      }

      .tags {
        display: flex;

        .tagitem {
          padding: 4rpx 15rpx;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 21rpx;
          border: 1rpx solid rgba(255, 255, 255, 0.6);
          @include textfclaw(23rpx, #2b2c3c, $lineH: 31rpx);
          margin-right: 10rpx;
        }
      }
    }
  }

  .pet-card {
    display: flex;
    align-items: center;
    width: 100%;

    .attritem {
      width: 172rpx;
      height: 81rpx;
      padding: 0 8rpx;
      @include flex();

      border-right: 2rpx solid rgba(255, 255, 255, 0.4);

      &:last-of-type {
        border-right: none;
      }

      .attrvalue {
        @include textfclaw(29rpx, #1f1f1f, $align: center, $lineH: 40rpx);
        margin-bottom: 8rpx;
        font-weight: bold;
      }

      .attrtitle {
        @include textfclaw(23rpx, #78753f, $align: center, $lineH: 33rpx);
      }
    }
  }
  .other-pet-card {
    .attritem {
      width: 230rpx;
    }
  }
  .birthdate {
    margin-top: 29rpx;
    padding-left: 31rpx;
    display: flex;
    align-items: center;
    color: #1f1f1f;
    @include textfclaw(23rpx, #78753f, $align: left, $lineH: 31rpx);

    .dateicon {
      width: 31rpx;
      height: 31rpx;
      margin-right: 10rpx;
      @include bg(
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/mypetinfo/dateicon.png"
      );
    }
  }

  .pet-list {
    @include absNormal(212rpx, 77rpx, $top: 10rpx, $left: 615rpx);
    // overflow-x: scroll;
    &.single {
      width: 65rpx;
    }
    .list-wrap {
      overflow-x: scroll;

      display: flex;

      .petitemsrc {
        flex-shrink: 0;
        width: 58rpx;
        height: 58rpx;
        display: inline-block;
        border-radius: 50%;
        margin-right: 10rpx;
        border: 4rpx solid rgba(255, 255, 255, 0);

        &.selected {
          border: 4rpx solid #ff5b05;
        }
      }
    }

    .addbtn {
      width: 58rpx;
      height: 58rpx;
      background: #ffffff;
      border-radius: 50%;
      @include flex();
      flex-shrink: 0;

      .add-icon {
        width: 27rpx;
        height: 27rpx;
      }
      &.btn-empty {
        margin-right: 20rpx;
      }
    }
  }
}
</style>
