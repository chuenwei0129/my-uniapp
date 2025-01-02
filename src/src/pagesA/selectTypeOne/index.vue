<template>
  <view class="card">
    <view class="content">
      <view
        class="petItem"
        v-for="item in petTypes"
        :key="item.id"
        @click="
          () => {
            handleSelect(item.id);
          }
        "
      >
        <image :src="item.imgClass" mode="scaleToFill" />
        <view class="name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
//import { wxShareMethod } from "@/utils/wxShare";
export default {
  //...wxShareMethod(),
  onLoad(option) {},
  onReady() {},
  onShow() {},
  data() {
    return {
      petTypes: [
        {
          id: 1,
          imgClass:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/index/cat.png",
          name: "喵星人",
        },
        {
          id: 50,
          imgClass:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/index/dog.png",
          name: "汪星人",
        },
        {
          id: 214,
          imgClass:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/index/other2.png",

          name: "水族",
        },
        {
          id: 460,
          imgClass:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/index/jump.png",
          name: "爬行",
        },
        {
          id: 835,
          imgClass:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/index/water.png",
          name: "其他小宠",
        },
      ],
    };
  },

  mounted() {},
  methods: {
    handleSelect(id) {
      uni.navigateTo({
        url: `/pagesA/selectTypeTwo/index?parentId=${id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
