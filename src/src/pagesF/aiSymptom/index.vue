<template>
  <view class="desc">
    <!-- 导航栏 -->
    <view v-if="aiImgShow">
      <view class="illnessBg">
        <NavBar
          :title="'输入症状'"
          titleColor="#000"
          :showBackBtn="true"
          :whiteBack="false"
          @navBackClickHandle="handleReturn"
          :customback="true"
        />
      </view>
      <view class="contentBox">
        <view>找不到您想要的症状？试试描述下宝贝症状吧~</view>
        <view class="textareaBox">
          <u--textarea
            v-model="symptomDesc"
            placeholder="请输入至少5个字哟~"
            maxlength="128"
            :formatter="limitationNum"
            border="none"
            :showConfirmBar="false"
            height="140"
            @change="symptomChange(symptomDesc)"
            :customStyle="{
              color: '#1f1f1f',
              backgroundColor: '#F7F8FC',
              borderRadius: '1rpx',
              padding: '6rpx',
            }"
          ></u--textarea>
          <view class="numBox"
            ><span :class="[symptomDesc.length > 0 ? 'active' : '']">{{
              symptomDesc.length
            }}</span
            >/128</view
          >
        </view>
        <view
          :class="[
            symptomDesc.length > 4 ? 'activeMessageText' : 'messageText',
          ]"
          @click="aiSearchSymptom"
        >
          症状识别
        </view>
      </view>
    </view>
    <view v-else class="aiBj">
      <view class="ppImg">
        <image
          class="image"
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/ttdoctor.png"
          mode="scaleToFill"
        />
        <view class="describe">豚豚医生努力识别中</view>
      </view>
    </view>
    <!-- ai识别弹窗 -->
    <view>
      <u-popup
        :show="deliverShow"
        mode="center"
        bgColor="transparent"
        @close="close"
        @touchmove.stop.prevent
      >
        <view class="tip-card">
          <view class="pet-icon"></view>
          <view class="content">
            <view class="describe">{{ errMessage }}</view>
          </view>
          <view class="line"> </view>
          <view class="footer">
            <view class="cancel" @click="handleClose">取消</view>
            <view class="line2"></view>
            <view class="confirm" @click="handleConfirm">确定</view>
          </view>
        </view>
      </u-popup>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { identifySymptom } from "../api/aiConsultation";
import { mapMutations, mapState } from "vuex";
import { action_report, display_report } from "@/utils/track";
import NavBar from "@/components/navBar/index.vue";
export default {
  onReady() {},

  data() {
    return {
      symptomDesc: "",
      aiImgShow: true,
      notHaveShow: false,
      deliverShow: false, //ai识别错误弹窗
      errMessage: "",
      limitationNum: (val) => (val.length > 128 ? val.slice(0, 128) : val),
    };
  },
  computed: {
    ...mapState({
      symptomData: (state) => state.symptomData,
      searchSymptom: (state) => state.searchSymptom,
      searchCommonSymptom: (state) => state.searchCommonSymptom,
    }),
  },
  components: {
    NavBar,
  },
  created() {},
  methods: {
    ...mapMutations([
      "aiAddSymptomData",
      "addSymptomData",
      "setAiIdentifyShow",
      "setSymptomDesc",
    ]),
    symptomChange(value) {
      this.symptomDesc = value.trim();
    },
    handleReturn() {
      uni.navigateBack({
        delta: 1,
      });
    },
    async aiSearchSymptom() {
      action_report({
        action_name: "Intelligentconsultation_DescribetSymptoms_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
      setTimeout(() => {
        this.aiImgShow = true;
      }, 18000);
      try {
        if (this.symptomDesc.length > 4) {
          this.aiImgShow = false;
          const res = await identifySymptom({ symptomDesc: this.symptomDesc });
          console.log(res, "res");
          if (res.data.symptomTag != null) {
            // 查询症状所在类下
            let flagAiSymptom = res.data.symptomTag;
            let aiSymptom = [];
            //合并其他症状和常见症状选中二级
            const allSymptom = Array.from(
              new Set([...this.searchSymptom, ...this.searchCommonSymptom])
            );
            allSymptom.forEach((ordinary) => {
              flagAiSymptom.forEach((aiItem) => {
                if (ordinary.diseaseName == aiItem) {
                  let aiData = {
                    tier: ordinary.tier,
                    diseaseName: aiItem,
                    selected: true,
                    aiShow: true,
                  };
                  aiSymptom.unshift(aiData);
                }
              });
            });
            this.searchCommonSymptom.forEach((ordinary) => {
              aiSymptom.forEach((aiItem) => {
                if (ordinary.diseaseName == aiItem.diseaseName) {
                  aiItem.secondTier = ordinary.tier;
                }
              });
            });
            // ai添加症状
            if (this.symptomData.length > 0) {
              this.symptomData.forEach((element, elementIndex) => {
                aiSymptom.forEach((item) => {
                  if (element.diseaseName == item.diseaseName) {
                    this.aiAddSymptomData(item.diseaseName);
                  } else {
                    this.addSymptomData(item);
                  }
                });
              });
            } else {
              aiSymptom.forEach((item) => {
                this.addSymptomData(item);
              });
            }
            this.setAiIdentifyShow(true);
            this.handleReturn();
            this.setSymptomDesc(this.symptomDesc);
          } else {
            this.errMessage = res.data.businessErrorResponseDTO.message;
            this.deliverShow = true;
            console.log("ai识别无症状");
          }
          this.aiImgShow = true;
        } else {
          this.$refs.uToast.show({
            type: "default",
            icon: false,
            message: "请继续输入，至少5个字",
          });
        }
      } catch (_) {
        this.aiImgShow = true;
      }
    },
    // 取消
    async handleClose() {
      this.deliverShow = false;
    },
    // 确定
    async handleConfirm() {
      this.deliverShow = false;
      this.handleReturn();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
