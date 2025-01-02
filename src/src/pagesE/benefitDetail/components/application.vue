<template>
  <view class="application">
    <scroll-view scroll-y="true" class="scroll-application">
      <!-- 适用等级 -->
      <template>
        <view class="nav-title">适用等级</view>
        <view class="equity-desc">
          <view class="desc">会员等级</view>
          <view class="desc" v-if="queryBenefitType === 56">对应权益次数</view>
          <view class="desc" v-else-if="queryBenefitType === 50"
            >对应权益倍数</view
          >
          <view class="desc" v-else-if="queryBenefitType === 51"
            >对应权益数量</view
          >
          <view class="desc" v-else>对应权益说明</view>
        </view>
        <view
          :class="['content', `content_Lv${index + 1}`]"
          v-for="(item, index) in gradeBenefitDetail_V2.levelInfoExplainList"
          :key="item.benefitId"
        >
          <view class="level">
            <text class="LV">Lv{{ item.levelIndex }}</text>
            <text class="desc">{{ levelName[item.levelIndex - 1] }}</text>
          </view>
          <view class="desc">{{ item.desc }}</view>
        </view>
      </template>
      <template>
        <view class="nav-title" v-if="gradeBenefitDetail_V2.benefitIntroduce"
          >权益介绍</view
        >
        <view class="introduce" v-if="gradeBenefitDetail_V2.benefitIntroduce">
          {{ gradeBenefitDetail_V2.benefitIntroduce }}
        </view>
        <!-- 社群类型 -->
        <view
          class="qrcode"
          v-if="queryBenefitType === 55 && gradeBenefitDetail_V2.status !== 0"
        >
          <view class="code">
            <image
              v-if="gradeBenefitDetail_V2.communityBenefit.communityUrl"
              class="fl-row-center"
              :src="gradeBenefitDetail_V2.communityBenefit.communityUrl"
              mode="widthFix"
              :show-menu-by-longpress="true"
            ></image>
          </view>
          <view class="code-tip" v-if="!isNative">长按识别二维码添加好友</view>
        </view>
        <!-- 虚拟奖励  -->
        <view
          class="virtual"
          v-if="queryBenefitType === 54 && gradeBenefitDetail_V2.status !== 0"
        >
          <view class="avatar-box">
            <image
              class="avatar"
              :src="gradeBenefitDetail_V2.virtualBenefit.userImage"
              mode=""
            ></image>
            <view class="avatar-cirle">
              <image
                mode=""
                :src="gradeBenefitDetail_V2.virtualBenefit.image"
              ></image>
            </view>
          </view>
          <view class="virtual-desc">{{
            gradeBenefitDetail_V2.virtualBenefit.validityDesc
          }}</view>
        </view>
      </template>
      <template>
        <view class="nav-title">权益说明</view>
        <view class="introduce-desc">
          <rich-text :nodes="gradeBenefitDetail_V2.benefitDesc"></rich-text>
        </view>
      </template>
      <view class="btn-bottom">
        <view
          v-if="
            [0, 1].includes(gradeBenefitDetail_V2.status) ||
            (gradeBenefitDetail_V2.status === 2 &&
              (queryBenefitType === 54 || queryBenefitType === 57))
          "
          class="btn"
          @click="$u.debounce(handleClick, 500)"
          >{{
            filterStrBtn(gradeBenefitDetail_V2.status, queryBenefitType)
          }}</view
        >
        <view
          v-else
          class="btn noClick"
          @click="$u.debounce(handleClick, 500)"
          >{{
            filterStrBtn(gradeBenefitDetail_V2.status, queryBenefitType)
          }}</view
        >
      </view>
      <view class="placeholder"></view>
    </scroll-view>
    <RealnameAuth
      :show.sync="realnameShow"
      :status="birthdayCheckInfo.status"
    ></RealnameAuth>
    <BirthdayBox
      :show.sync="birthdayBoxShow"
      :goodsList="birthdayCheckInfo.goodsList"
    ></BirthdayBox>
    <levelGiftBox
      :show.sync="LevelGiftCheckShow"
      :goodsList="LevelGiftCheckInfo"
    ></levelGiftBox>
  </view>
</template>

<script>
import RealnameAuth from "./realnameAuth.vue";
import BirthdayBox from "./birthdayBox.vue";
import levelGiftBox from "./levelGiftBox.vue";
import { EQUITY_CHECK, RECEIVE_BENEFIT, LevelGift_CHECK } from "@/api/memberV2";
import { action_report } from "@/utils/track";
const h5Domain = {
  dev: "https://cn-dev02-shareactivity.chongpangpang.com/#",
  jumpdev: "https://cn-dev02-shareactivity.chongpangpang.com",
  pro: "https://shareactivity.chongpangpang.com/#",
  jumppro: "https://shareactivity.chongpangpang.com",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/#",
};
const env =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "dev"
    : process.env.NODE_ENV === "pre"
    ? "pre"
    : "pro";
export default {
  name: "applicationLevel", // 适用等级-组件
  components: {
    RealnameAuth,
    BirthdayBox,
    levelGiftBox,
  },
  props: {
    gradeBenefitDetail_V2: {
      type: Object,
      default: () => {},
    },
    queryBenefitType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      realnameShow: false, // 实名认证
      birthdayBoxShow: false, // 生日盲盒
      levelName: ["小银豚", "小金豚", "小钻豚", "黑金豚"],
      birthdayCheckInfo: {}, // 生日权益校验
      LevelGiftCheckInfo: {},
      LevelGiftCheckShow: false,
      action_report_query: {
        50: "quanyi_xiaofei_click", // 50-消费得胖豆 -
        51: "quanyi_shengji_click", // 51-升级得胖豆 -
        52: "quanyi_shiwu_click", // 52-生日盲盒
        53: "quanyi_zhuanshu_click", // 53-会员专属兑换 -
        54: "quanyi_xuni_click", // 54-虚拟奖励 -
        55: "quanyi_shequn_click", // 55-会员社群 -
        56: "quanyi_tuikuan_click", // 56-消费仅退款
        57: "quanyi_gift_click", // 57-等级会员礼
        20: "quanyi_coupon_click", // 20-优惠劵 -
      },
    };
  },
  computed: {
    isNative() {
      return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
    },
  },
  mounted() {
    // 阿里妈妈字体
    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  methods: {
    /**
     * 
     * @param {Number} status 0-未解锁;1-可领取;2-已使用;3-已过期
     * @param {Number} type   
     * // 50-消费得胖豆 -
      // 51-升级得胖豆 -
      // 52-生日盲盒-1
      // 53-会员专属兑换 -
      // 54-虚拟奖励 -
      // 55-会员社群 -
      // 56-消费仅退款
      // 57-等级会员礼物
      // 20-优惠劵 -
     */
    btnStrCommon(status, str, type) {
      if (status === 1) {
        return str;
      } else if (status === 2) {
        if (type === 54) return "去佩戴";
        else return "已领取";
      } else if (status === 3) {
        return "已失效";
      } else if (status === 0) {
        return "去升级解锁权益";
      }
    },
    filterStrBtn(status, type) {
      console.log(status);
      switch (type) {
        case 50:
          return this.btnStrCommon(status, "下单得胖豆");
        case 51:
          return this.btnStrCommon(status, "去使用");
        case 52:
          return this.btnStrCommon(status, "领取礼物");
        case 53:
          return this.btnStrCommon(status, "去兑换");
        case 54:
          return this.btnStrCommon(status, "去领取", 54);
        case 55:
          return this.btnStrCommon(status, "保存图片");
        case 56:
          return this.btnStrCommon(status, "去使用");
        case 57:
          return this.btnStrCommon(status, "领取兑换奖励");
        case 20:
          return this.btnStrCommon(status, "领取兑换奖励");
      }
    },
    toast(str) {
      uni.showToast({
        title: str,
        icon: "none",
      });
    },
    go(url, type) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: this.action_report_query[type],
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      uni.navigateTo({ url });
    },
    goBack() {
      // #ifdef MP-WEIXIN
      uni.navigateBack({ delta: 1 });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },
    // app引导页跳转
    toGuideApp(type, query) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: this.action_report_query[type],
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      let url = "/pagesE/guideApp/index";
      if (query) url = `${url}?type=${query}`;
      this.go(url);
    },
    // 小程序内保存图片
    saveImg(type) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: this.action_report_query[type],
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      // #ifdef MP-WEIXIN
      this.miniSaveImg();
      // #endif
      // #ifdef H5
      const imageUrl =
        this.gradeBenefitDetail_V2?.communityBenefit?.communityUrl;
      this.$dsBridge.call("saveImage", { imageUrl });
      // #endif
    },
    // 下载到本地相册
    saveAlbum() {
      const url = this.gradeBenefitDetail_V2?.communityBenefit?.communityUrl;
      console.log("🚀 ~ saveAlbum ~ url:", url);
      uni.downloadFile({
        url: url,
        filePath: `${wx.env.USER_DATA_PATH}/${Date.now()}.jpg`,
        success: (res) => {
          console.log("🚀 ~ saveAlbum ~ 下载文件成功:", res);
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.filePath,
              success: () => {
                uni.showToast({
                  title: "保存成功",
                  icon: "none",
                });
              },
              fail: (err) => {
                console.log("🚀 ~ saveAlbum ~ err:", err);
                uni.showToast({
                  title: "保存失败",
                  icon: "none",
                });
              },
            });
          }
        },
        fail: (err) => {
          console.log("下载失败", err);
        },
      });
    },
    miniSaveImg() {
      wx.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.writePhotosAlbum"]) {
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success: () => {
                this.saveAlbum();
              },
              fail: () => {
                uni.showModal({
                  title: "提示",
                  content: "需要授权",
                  success: function (res) {
                    if (res.confirm) {
                      console.log("用户点击确定");
                    } else if (res.cancel) {
                      console.log("用户点击取消");
                    }
                  },
                });
                wx.showModal({
                  title: "提示",
                  content: "需要授权访问相册",
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (suc) => {
                          console.log("🚀 ~ miniSaveImg ~~~~~ suc:", suc);
                          if (suc.authSetting["scope.writePhotosAlbum"]) {
                            this.saveAlbum();
                          }
                        },
                        fail: (err) => {
                          console.log("相册授权失败", err);
                          uni.showModal({
                            title: "提示",
                            content: "相册授权失败",
                            success: function (res) {
                              if (res.confirm) {
                                console.log("用户点击确定");
                              } else if (res.cancel) {
                                console.log("用户点击取消");
                              }
                            },
                          });
                        },
                      });
                    }
                  },
                  fail: (err) => {
                    console.log("授权失败");
                  },
                });
              },
            });
          } else {
            this.saveAlbum();
          }
        },
        fail: (err) => {
          console.log("获取用户权限失败");
        },
      });
    },
    /**
     * 领取权益（优惠券）
     * @param {Number} awardType 1-实物奖励 2-虚拟奖励
     */
    async receiveAward(awardType, type) {
      const { levelConfigId, actualBenefit, virtualBenefit } =
        this.gradeBenefitDetail_V2;
      const refID =
        awardType === 1
          ? actualBenefit && actualBenefit.refId
          : virtualBenefit && virtualBenefit.refId;
      const refName = awardType === 1 ? "实物奖励" : "虚拟奖励";
      const params = {
        benefitId: this.gradeBenefitDetail_V2.benefitId, // 权益id
        levelConfigId: levelConfigId, // 等级配置id
        refId: refID, // 奖励id
      };
      try {
        const {
          data: { data },
        } = await RECEIVE_BENEFIT(params);
        if (data) {
          const userInfo = uni.getStorageSync("storage_info");
          action_report({
            action_name: this.action_report_query[type],
            module_name: "member",
            extend: {
              userId: userInfo.userId,
              memberLv: userInfo.levelIndex,
              id: refID,
              name: refName,
            },
          });
          // this.$parent.getGradeBenefitDetail(this.gradeBenefitDetail_V2.benefitId, type)
          this.$emit("change", type);
          console.log("虚拟奖励打印：：：", this.gradeBenefitDetail_V2);
          this.toast("领取成功");
          // this.$forceUpdate()
          if (awardType == 2) return;
          // #ifdef MP-WEIXIN
          this.go("/pagesB/couponPackage/index");
          // #endif
          // #ifdef H5
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `/coupon/my-list`, // 券包列表
          });
          // #endif
        }
      } catch (error) {
        console.log("RECEIVE_BENEFIT::", error);
      }
    },
    switchGo(url, type) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: this.action_report_query[type],
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      uni.switchTab({ url });
    },
    // 小程序内底部按钮跳转
    miniProgram(typeList, type, status) {
      console.log(typeList, type, status);
      if (typeList.includes(type)) {
        if (type === 50 && status === 1) this.switchGo("/pages/mall/index", 50);
        else if (status === 1) this.toGuideApp(type, 1);
        else if (status === 0) this.goBack(type);
        // 虚拟奖励去【去佩戴】跳app引导页
        else if (type === 54 && status === 2) this.toGuideApp(type, 1);
      } else if (type === 52) {
        if (status === 0) this.goBack(type);
        else if (status === 2) this.goBack(type);
        else this.equityCheck(type);
      } else if (type === 55) {
        // 保存图片
        if (status === 0) this.goBack(type);
        else this.saveImg(type);
      } else if (type === 56) {
        if (status === 1) this.go("/pagesC/mallOrderList/index", type);
        else if (status === 0) this.goBack(type);
      } else if (type === 20) {
        // 实物奖励
        if (status === 1) this.receiveAward(1, type);
        else if (status === 0) this.goBack(type);
      } else if (type == 57) {
        if (status == 0) {
          this.goBack(type);
        } else if ([1, 2].includes(status)) {
          this.toGuideApp(type, 1);
        }
      }
    },
    // 跳转app页面
    nativeRouter(str, type) {
      console.log("🚀 ~ nativeRouter ~ str, type:", str, type);
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: this.action_report_query[type],
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      // if(type === 53) {
      //   window.location.href = `${h5Domain[env]}${str}`
      // } else
      if (type === 56 || type === 50) {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: str,
        });
      } else {
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${h5Domain[env]}${str}`,
        });
      }
    },
    // H5内 底部按钮跳转
    click_H5(type, status) {
      // status 0-未解锁;1-可领取;2-已使用;3-已过期
      const typeList = [50, 51, 53];
      let url_53;
      let commonUrl;
      if (
        this.gradeBenefitDetail_V2 &&
        this.gradeBenefitDetail_V2.scoreStrategy
      ) {
        const { refId, siftTagType, specialName, specialType } =
          this.gradeBenefitDetail_V2?.scoreStrategy;
        url_53 = `/integral/specialzone/${refId}?transparentTopBar=1&specialType=${specialType}&specialName=${encodeURIComponent(
          specialName
        )}&siftTagType=${siftTagType}`;
      } else {
        url_53 = "/integral/index?transparentTopBar=1&orderSource=2";
      }
      switch (type) {
        case 50:
          commonUrl = `/home?homeSelectedIndex=1`;
          break;
        case 51:
          commonUrl = "/integral/index?transparentTopBar=1";
          break;
        case 53:
          commonUrl = url_53;
          break;
        default:
          commonUrl = "/integral/index?transparentTopBar=1";
          break;
      }
      console.log("commonUrl========", commonUrl);
      if (typeList.includes(type)) {
        if (status === 0) this.goBack(type);
        else if (status === 1) this.nativeRouter(commonUrl, type); // 跳转到胖豆商城
      } else if (type === 20) {
        // 实物奖励
        if (status === 1) this.receiveAward(1, type);
        else if (status === 0) this.goBack(type);
      } else if (type === 52) {
        if (status === 0) this.goBack(type);
        else if (status === 2)
          this.nativeRouter(
            `/integral/details?transparentTopBar=1&from=native`
          );
        else this.equityCheck(type);
      } else if (type === 56) {
        if (status === 1)
          this.nativeRouter(
            "/flutter?entryPoint=mallMyOrderListPage&index=0",
            type
          );
        else if (status === 0) this.goBack(type);
      } else if (type === 55) {
        if (status === 0) this.goBack(type);
        else this.saveImg(type); // 保存图片
      } else if (type === 54) {
        // 虚拟奖励
        if (status === 0) this.goBack(type);
        else if (status === 1) this.receiveAward(2, type);
        else if (status === 2)
          this.nativeRouter(
            "/integral/dressshop?tabType=2&from=native&transparentTopBar=1",
            type
          ); // 去佩戴
      } else if (type === 57) {
        console.log(status);
        if (status === 0) {
          this.goBack(type);
        } else if (status === 1) {
          // 判断商品是否有库存、扣减库存后跳转胖豆订单下单页
          console.log("订单页面");
          this.LevelGiftCheck(type);
          // this.nativeRouter(
          //   "/integral/order/:id?transparentTopBar=1",
          //   type
          // );
        } else if (status === 2) {
          console.log("胖豆兑换记录页面");
          this.nativeRouter(
            "/integral/details?transparentTopBar=1&from=native"
          );
        }
      }
    },
    handleClick() {
      const type = this.queryBenefitType;
      const status = this.gradeBenefitDetail_V2.status;
      const typeList = [50, 51, 53, 54];
      if (this.isNative) {
        // 非小程序（APP、H5）
        this.click_H5(type, status);
      } else {
        // this.click_H5(type, status);
        this.miniProgram(typeList, type, status);
      }
    },

    // 领取权益（生日盲盒）
    async receiveAward_benefit(goods) {
      console.log("走了----------领取权益（生日盲盒）");
      const {
        goodsId,
        goodsName,
        goodsLogoPic,
        originScore,
        payScore,
        goodsQuantity,
      } = goods;
      const query = `transparentTopBar=1&goodsId=${goodsId}&goodsName=${goodsName}&originScore=${originScore}&payScore=${payScore}&goodsQuantity=${goodsQuantity}&orderSource=3&goodsLogoPic=${encodeURIComponent(
        encodeURIComponent(goodsLogoPic)
      )}`;
      // this.$dsBridge.call("gotoPageThroughRoute", {
      //   page: `${h5Domain[env]}integral/order/${goodsId}?${query}`,
      //   // page: `${h5Domain[env]}integral/order/${goodsId}?${query}`,
      // });
      window.location.href = `${h5Domain[env]}integral/order/${goodsId}?${query}`;
    },
    async LevelGiftCheck(type) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: this.action_report_query[type],
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      try {
        const params = {
          benefitId: this.gradeBenefitDetail_V2.benefitId,
        };
        const { data } = await LevelGift_CHECK(params);
        this.LevelGiftCheckInfo = data.data;
        console.log("🚀 ~ LevelGiftCheck ~ data:", data);
        if (data.code === 0 || data.status === 0) {
          const userInfo = uni.getStorageSync("storage_info");
          action_report({
            action_name: "member_gift_exchange",
            module_name: "member",
            extend: {
              userId: userInfo.userId,
              memberLv: userInfo.levelIndex,
              goodsId: this.LevelGiftCheckInfo.find(
                (item) => item.isSubmitGoods
              ).goodsId,
            },
          });
          this.LevelGiftCheckShow = true;
        }
      } catch (error) {
        console.log("🚀 ~ equityCheck ~ error:", error);
      }
    },
    async equityCheck(type) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name: this.action_report_query[type],
        module_name: "member",
        extend: {
          userId: userInfo.userId,
          memberLv: userInfo.levelIndex,
        },
      });
      try {
        const params = {
          benefitId: this.gradeBenefitDetail_V2.benefitId,
        };
        const {
          data: { data },
        } = await EQUITY_CHECK(params);
        this.birthdayCheckInfo = data;
        console.log("🚀 ~ equityCheck ~ data:", data);
        if (data.status === 0) {
          if (data?.goodsList.length === 1) {
            this.$emit("change", type);
            if (this.isNative) {
              // 非小程序
              this.receiveAward_benefit(data.goodsList[0]);
            } else {
              // 小程序
              this.toGuideApp(type, 1);
            }
          } else {
            this.birthdayBoxShow = true;
          }
        } else {
          this.realnameShow = true;
        }
      } catch (error) {
        console.log("🚀 ~ equityCheck ~ error:", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../utils/fn.scss";
.application {
  width: 750rpx;
  // min-height: 200rpx;
  height: 1242rpx;
  background-color: #fff;
  border-radius: 31rpx 31rpx 0rpx 0rpx;
  padding: 38rpx 29rpx 215rpx;
  overflow: hidden;
  .scroll-application {
    height: 1242rpx;
    width: 100%;
    .placeholder {
      width: 100%;
      height: 215rpx;
    }
  }
  .nav-title {
    @include textfclaw(35rpx, #333333, $align: left, $lineH: 48rpx);
    font-weight: 600;
    padding: 0rpx 0 23rpx;
    box-sizing: border-box;
    margin-top: 57rpx;
  }
  .equity-desc {
    width: 692rpx;
    height: 83rpx;
    background: #f3f3f4;
    border-radius: 15rpx;
    font-size: 29rpx;
    color: #1f1f1f;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 17rpx 0 28rpx;
    margin-bottom: 12rpx;
    box-sizing: border-box;
  }
  .content {
    width: 692rpx;
    height: 83rpx;
    border-radius: 15rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 17rpx 0 28rpx;
    margin-bottom: 12rpx;
    box-sizing: border-box;
    .level {
      .LV {
        font-family: AlimamaShuHeiTi, AlimamaShuHeiTi-Bold;
        font-weight: bold;
        font-size: 29rpx;
        color: #1f1f1f;
        margin-right: 21rpx;
      }
    }
    .desc {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 29rpx;
      color: #1f1f1f;
    }
    &.content_Lv1 {
      background: linear-gradient(270deg, #ffffff 0%, #f7f8fc 100%);
    }
    &.content_Lv2 {
      background: linear-gradient(270deg, #ffffff 0%, #f7f8fc 100%);
    }
    &.content_Lv3 {
      background: linear-gradient(270deg, #ffffff 0%, #fffbdb 100%);
    }
    &.content_Lv4 {
      background: linear-gradient(270deg, #ffffff 0%, #fffbdb 100%);
    }
  }
  .introduce {
    // padding: 0 0 22rpx 0;
    color: #666666;
    font-size: 29rpx;
  }
  .introduce-desc {
    font-family: PingFangSC, PingFang SC;
    @include textfclaw(29rpx, #666666, $align: left, $lineH: 46rpx);
  }
  .gray {
    @include textfclaw(29rpx, #666, $align: left, $lineH: 46rpx);
  }
  .btn-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 750rpx;
    height: 173rpx;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 6rpx;
    box-sizing: border-box;
    z-index: 99;
    .btn {
      width: 673rpx;
      height: 96rpx;
      background: #fee900;
      border-radius: 48rpx;
      font-weight: 500;
      z-index: 999;
      @include textfclaw(35rpx, #1f1f1f, $align: center, $lineH: 96rpx);
    }
    .noClick {
      opacity: 0.4;
    }
  }
  .qrcode {
    margin: 10rpx auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .code {
      width: 365rpx;
      height: 365rpx;
      margin-top: 26rpx;
    }
    .code-tip {
      width: 100%;
      @include textfclaw(29rpx, #1f1f1f, $align: center, $lineH: 40rpx);
      margin-top: 29rpx;
    }
  }
  .virtual {
    margin: 10rpx auto;
    @include flex();
    align-items: center;
    flex-direction: column;
    .avatar-box {
      position: relative;
      margin-top: 53rpx;
      @include flex();
      .avatar {
        width: 213rpx;
        height: 213rpx;
        border-radius: 50%;
        display: inline-block;
      }
      .avatar-cirle {
        width: 265rpx;
        height: 265rpx;
        border: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        display: inline-block;
        image {
          width: 100%;
          height: 100%;
          display: inline-block;
        }
      }
    }
    .virtual-desc {
      @include textfclaw(29rpx, #666666, $align: center, $lineH: 40rpx);
      margin-top: calc(28rpx + 28rpx);
    }
  }
}
</style>
