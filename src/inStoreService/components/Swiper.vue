<template>
  <view class="u-demo-block">
    <u-swiper
      :list="list"
      :autoplay="false"
      @change="e => current = e.current"
    >
      <view
        slot="indicator"
        class="indicator"
      >
        <view
          v-for="(item, index) in list"
          :key="index"
          class="indicator__dot"
          :class="[index === current && 'indicator__dot--active']"
        />
      </view>
    </u-swiper>
  </view>
</template>

<script>
  export default {
      data () {
          return {
              list: [
                  'https://cdn.uviewui.com/uview/swiper/swiper3.png',
                  'https://cdn.uviewui.com/uview/swiper/swiper2.png',
                  'https://cdn.uviewui.com/uview/swiper/swiper1.png',
              ],
          }
      }
  }
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

  .indicator-num {
      padding: 2px 0;
      background-color: rgba(0, 0, 0, 0.35);
      border-radius: 100px;
      width: 35px;
      @include flex;
      justify-content: center;

      &__text {
           color: #FFFFFF;
           font-size: 12px;
       }
  }
</style>
