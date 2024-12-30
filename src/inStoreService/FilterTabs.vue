<template>
  <u-tabs
    :list="tabs"
    line-width="31rpx"
    line-height="2"
    line-color="#FE2442"
    font-size="14"
    :active-style="{
      color: '#000',
      fontFamily: 'AlimamaShuHeiTi-Bold',
      transform: 'scale(1)',
    }"
    :inactive-style="{
      color: '#000',
      transform: 'scale(1)',
    }"
    :current="current"
    @change="$emit('onChange', $event)"
  />
</template>

<script>
export default {
  name: 'ClassifyTabs',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    current: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    tabs () {
      // 添加推荐类目，id为0
      const recommendedTab = { id: 0, name: '推荐' }
      return [recommendedTab, ...this.list]
    },
  },
  created () {
    uni.loadFontFace({
      family: 'AlimamaShuHeiTi-Bold',
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success () {
        console.log('success load ttf')
      },
      fail () {
        console.log('fail load ttf')
      },
    })
  },
}
</script>
