<template>
  <view class="edit-warp">
    <view class="desc">
      <view class="desc_textArea">
        <input
          v-model="nickName"
          class="content"
          maxlength="10"
          @input="monitorInput"
          placeholder="请填写昵称"
        />
        <view class="count">{{ num }}/10</view>
      </view>
    </view>
    <view class="btn">
      <view class="cancel" @click="handleEdit('cancel')">取消</view>
      <view class="submit" @click="handleEdit('submit')">保存</view>
    </view>
  </view>
</template>

<script>
import { GET_USER_INFO_ALL, EDIT_USER_INFO } from "@/api/my";
export default {
  // #ifdef MP-WEIXIN
  // #endif
  components: {},
  data() {
    return {
      userInfo: {},
      num: 0,
      nickName: "",
    };
  },
  computed: {},
  onLoad(option) {},
  onReady() {},
  onShow() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const { data } = await GET_USER_INFO_ALL();
      this.nickName = data.nickName;
      this.userInfo = data;
      this.num = this.nickName.length >= 10 ? 10 : this.nickName.length;
      // this.monitorInput();
    },
    monitorInput(e) {
      if (e.detail.cursor < 10) {
        this.num = e.detail.value.length;
        this.nickName = e.detail.value.slice(0, e.detail.cursor);
      }
      if (e.detail.cursor >= 10) {
        this.num = 10;
      }
    },
    async handleEdit(type) {
      if (type == "cancel") {
        uni.navigateBack({
          delta: 1,
        });
      } else {
        const res = await EDIT_USER_INFO({
          nickName: this.nickName,
        });
        if (res.statusCode == 200) {
          uni.navigateBack({
            delta: 1,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
