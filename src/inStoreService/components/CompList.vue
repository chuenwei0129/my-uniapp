<template>
  <view class="u-demo-block__content">
    <u-row
      justify="space-between"
      gutter="10"
    >
      <u-col span="3">
        <view class="demo-layout bg-purple" />
      </u-col>
      <u-col span="3">
        <view class="demo-layout bg-purple-light" />
      </u-col>
      <u-col span="3">
        <view class="demo-layout bg-purple" />
      </u-col>
      <u-col span="3">
        <view class="demo-layout bg-purple-light" />
      </u-col>
    </u-row>
  </view>
</template>

<script>
import { fetchCompList } from '../api/inStoreService'

export default {

  async created () {
    const res = await fetchCompList({
      page: 2,
    })
    console.log('🚀 ~ created ~ res:', res)
  }
}

</script>

<style lang="scss">
  .wrap {
      padding: 12px;
  }

  .demo-layout {
      height: 25px;
      border-radius: 4px;
  }

  .bg-purple {
      background: #CED7E1;
  }

  .bg-purple-light {
      background: #e5e9f2;
  }

  .bg-purple-dark {
      background: #99a9bf;
  }
</style>
