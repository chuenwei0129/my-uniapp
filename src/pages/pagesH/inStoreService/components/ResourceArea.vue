<template>
  <view>
    <ResourceCard
      :title="cardTitle1"
      :list="cardList1"
      @view-more="handleViewMore1"
    />
    <ResourceCard
      :title="cardTitle2"
      :list="cardList2"
      @view-more="handleViewMore2"
    />
    <ResourceCard
      :title="cardTitle3"
      :list="cardList3"
      @view-more="handleViewMore3"
    />
    <ResourceCard
      :title="cardTitle4"
      :list="cardList4"
      @view-more="handleViewMore4"
    />
  </view>
</template>

<script>
import ResourceCard from './ResourceCard.vue'

export default {
  components: {
    ResourceCard
  },
  data () {
    return {
      cardTitle1: '单个卡片',
      cardList1: [
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行文本内容较长，会溢出',
          text2: '第二行文本',
          text3: '第三行文本内容也比较长'
        }
      ],
      cardTitle2: '两个卡片',
      cardList2: [
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行文本',
          text2: '第二行文本较长，会溢出',
          text3: '第三行文本'
        },
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行文本',
          text2: '第二行文本',
          text3: '' // 特意留空，测试对齐
        }
      ]
      ,
      cardTitle3: '三个卡片',
      cardList3: [
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行文本',
          text2: '第二行',
          text3: '第三行文本较长，会溢出'
        },
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行文本内容较长，会溢出',
          text2: '第二行',
          text3: '第三行'
        },
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行',
          text2: '第二行文本',
          text3: '第三行文本内容较长'
        }
      ],
      cardTitle4: '四个卡片',
      cardList4: [
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行文本',
          text2: '第二行',
          text3: '第三行文本较长，会溢出'
        },
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行文本内容较长，会溢出',
          text2: '第二行',
          text3: '第三行'
        },
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行',
          text2: '第二行文本',
          text3: '第三行文本内容较长'
        },
        {
          image: 'https://via.placeholder.com/150',
          text1: '第一行',
          text2: '第二行文本内容较长',
          text3: '第三行文本内容较长'
        }
      ]
    }
  },
  methods: {
    handleViewMore1 () {
      uni.showToast({ title: '查看更多 1', icon: 'none' })
    },
    handleViewMore2 () {
      uni.showToast({ title: '查看更多 2', icon: 'none' })
    },
    handleViewMore3 () {
      uni.showToast({ title: '查看更多 3', icon: 'none' })
    },
    handleViewMore4 () {
      uni.showToast({ title: '查看更多 4', icon: 'none' })
    },
  }
}
</script>
