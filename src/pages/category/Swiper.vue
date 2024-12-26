<template>
  <view class="u-demo-block">
    <u-swiper
      :list="list5"
      @change="(e) => (current = e.current)"
      :autoplay="false"
    >
      <view slot="indicator" class="indicator">
        <view
          class="indicator__dot"
          v-for="(item, index) in list5"
          :key="index"
          :class="[index === current && 'indicator__dot--active']"
        >
        </view>
      </view>
    </u-swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list5: [
        "https://cdn.uviewui.com/uview/swiper/swiper3.png",
        "https://cdn.uviewui.com/uview/swiper/swiper2.png",
        "https://cdn.uviewui.com/uview/swiper/swiper1.png",
      ],
    };
  },
};
</script>

<style lang="scss">
.indicator {
  @include flex(row);
  justify-content: center;

  &__dot {
    height: 6px;
    width: 6px;
    border-radius: 100px;
    background-color: rgba(255, 255, 255, 0.35);
    margin: 0 5px;
    transition: background-color 0.3s;

    &--active {
      background-color: #ffffff;
    }
  }
}
</style>
