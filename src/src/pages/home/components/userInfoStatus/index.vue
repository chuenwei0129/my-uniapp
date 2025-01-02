<template>
  <view class="user-info-status">
    <view class="no-login" v-if="!isLogin" @click="gotoLogin">
      <view class="left">
        <image
          class="user-acatar-url"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/unlogin-V2.png"
        ></image>
        <view>立即登录，查看会员特权</view>
      </view>
      <image
        class="right"
        style="width: 27rpx; height: 27rpx"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/left-arrow.png"
      ></image>
    </view>
    <view v-else class="is-login">
      <view class="left">
        <image
          mode="aspectFill"
          class="user-acatar-url"
          @click="gotoEditUserInfo"
          :src="userInfo.avatarUrl"
        ></image>
        <view class="user-info-show">
          <view class="nickname-level">
            <view class="nickname" @click="gotoEditUserInfo">{{
              userInfo.nickName
            }}</view>
            <image
              class="level-icon"
              :src="`https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/v${
                userInfo.levelIndex || 1
              }_icon.png`"
            ></image>
          </view>
          <view class="member-info">
            <view @click="gotoEquity">
              {{ userInfo.benefitQty || "" }}大特权
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
              ></image>
            </view>
            <view @click="gotoIntegrate">
              {{ userInfo.score || "" }}胖豆
              <image
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/rightarrow.png"
              ></image>
            </view>
          </view>
        </view>
      </view>
      <view class="right">
        <view v-if="petList.length" @click="clickPet" class="pet-img-content">
          <view
            class="pet-img-box"
            :class="showPetImgs"
            v-for="(item, index) in showPetList"
            :key="index"
          >
            <image
              mode="aspectFill"
              class="pet-img"
              :src="item.avatarUrl"
            ></image>
          </view>
          <view v-if="petList.length > 3" class="more-pet">
            <image
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/more_pet.png"
            ></image>
          </view>
        </view>
        <view v-else class="no-pet" @click="handleAddPet">
          <view>添加宠物</view>
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/pet_plus.png"
          ></image>
        </view>
        <!-- <image class="pet-img pet-num" src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/unlogin-V2.png"></image>
                <image class="pet-img pet-num" src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chatai/unlogin-V2.png"></image> -->
      </view>
    </view>
  </view>
</template>

<script>
// import { getPetList } from "@/api/base/index";
// import { getMemberAgg } from "@/api/home"
import { action_report, display_report } from "@/utils/track";
import { QUERY_LEVEL } from "@/api/member";
export default {
  name: "userInfoStatus",
  data () {
    return {
      isLogin: false,
      levelInfo: {},
    };
  },
  props: {
    petList: {
      type: Array,
      default: [],
    },
    userInfo: {
      type: Object,
      default: () => { },
    },
  },
  mounted () {
    // this.getUserInfo()
    const info = uni.getStorageSync("storage_info") || {};
    this.isLogin = !!info.token;
    if (this.isLogin) {
      this._getUserLevel();
    }
  },
  computed: {
    showPetImgs () {
      return this.petList.length >= 2 ? "pet-num" : "";
    },
    showPetList () {
      return this.petList.slice(0, 3);
    },
  },
  methods: {
    async getUserInfo () {
      try {
        const res = await getMemberAgg();
        this.isLogin = true;
        res.data && (this.userInfo = res.data?.data);
      } catch (e) {
        this.isLogin = false;
        console.error("获取会员信息错误", e);
      }
    },
    async getPetList (userId) {
      try {
        const res = await getPetList({ userId });
        this.petList = res.data || [];
        // 测试宠物的数量
        // this.petList = this.petList.slice(0, 3)
        // this.petList = []
      } catch (e) {
        console.error("获取宠物列表错误", e);
      }
    },
    gotoLogin () {
      uni.navigateTo({ url: "/pagesD/login/index" });
    },
    handleAddPet () {
      if (!this.isLogin) {
        return uni.navigateTo({ url: "/pagesD/login/index" });
      }
      uni.navigateTo({ url: "/pagesD/petInfo/index?type=taskdesc&transparentTopBar=1" });
    },
    gotoEditUserInfo () {
      uni.navigateTo({
        url: "/pagesD/editUserInfo/index?backUrl=/pages/home/index",
      });
    },
    gotoEquity () {
      action_report({
        action_name: "home_privilege_click",
        module_name: "shop",
        extend: {
          user_id: uni.getStorageSync("storage_info").userId,
        },
      });
      uni.navigateTo({
        url: `/pagesE/memberCenter/index?levelConfigId=${this.levelInfo.levelConfigId}`,
      });
    },
    gotoIntegrate () {
      action_report({
        action_name: "home_points_click",
        module_name: "shop",
        extend: {
          user_id: uni.getStorageSync("storage_info").userId,
        },
      });
      uni.navigateTo({
        url: "/pagesA/pointsPage/index",
      });
    },
    clickPet () {
      uni.navigateTo({
        url: `/pagesD/myPetsInfo/index?petId=${this.petList[0].id}`,
      });

      // action_report({
      //     action_name: "myinfo_petinfo_click",
      //     module_name: "myinfo",
      //     extend: {
      //     pet_id: item.id,
      //     },
      // });
    },
    //获取用户会员等级
    async _getUserLevel () {
      const { data } = await QUERY_LEVEL();
      this.levelInfo = data.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info-status {
  position: relative;
  z-index: 1;
  // padding: 0 23rpx 15.38rpx;
  .no-login,
  .is-login {
    height: 135rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // width: 719rpx;
    padding: 0 28rpx;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      #ffffff 100%
    );
    border-radius: 23rpx;
    border: 2rpx solid #fff;
    // border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.3)) 2 2;
  }
  .no-login {
    .right {
      width: 26.92rpx;
      height: 26.92rpx;
    }
    view {
      font-weight: 400;
      font-size: 29rpx;
      color: #1f1f1f;
      line-height: 40rpx;
      text-align: left;
    }
  }
  .left {
    display: flex;
    align-items: center;
  }
  .nickname-level {
    display: flex;
    align-items: center;
    margin-bottom: 5.77rpx;
  }
  .nickname {
    margin-right: 9.62rpx;
    max-width: 259.62rpx;
    font-weight: 400;
    font-size: 29rpx;
    color: #1f1f1f;
    line-height: 40rpx;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .level-icon {
    width: 69rpx;
    height: 27rpx;
  }
  .user-acatar-url {
    margin-right: 19.23rpx;
    width: 88.46rpx;
    height: 88.46rpx;
    border-radius: 50%;
  }
  .member-info {
    display: flex;
    font-weight: 300;
    font-size: 25rpx;
    color: #1f1f1f;
    line-height: 35rpx;
    > view {
      white-space: nowrap;
      &:first-of-type {
        margin-right: 19.23rpx;
      }
    }
    image {
      width: 20rpx;
      height: 20rpx;
    }
  }
  .is-login {
    display: flex;
    align-items: center;
    .right {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 200rpx;
      height: 135rpx;
    }
  }
  .pet-img-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    position: relative;
    .pet-img-box {
      display: flex;
      padding-left: 4rpx;
      padding-top: 4rpx;
      padding-right: 0rpx;
      padding-bottom: 4rpx;
      background-color: #fff;
      // background-color: red;
      border-radius: 50%;
      &:last-of-type {
        padding-right: 0px;
      }
    }
    .pet-img,
    .more-pet {
      width: 65rpx;
      height: 65rpx;
      border-radius: 50%;
      object-fit: contain;
    }
    .more-pet {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 50%;
      right: 0rpx;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.5);
      // margin-top: 2rpx;
      // margin-left: 2rpx;
      image {
        width: 42rpx;
        height: 42rpx;
      }
    }
  }
  .pet-num {
    margin-left: -32.69rpx;
  }
  .no-pet {
    display: flex;
    align-items: center;
    view {
      margin-right: 9.62rpx;
      font-weight: 400;
      font-size: 27rpx;
      color: #1f1f1f;
      line-height: 38rpx;
      text-align: left;
    }
    image {
      width: 34.62rpx;
      height: 34.62rpx;
    }
  }
}
</style>
