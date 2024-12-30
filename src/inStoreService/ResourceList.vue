<template>
  <view v-if="filterList.length > 0">
    <view
      v-for="(item, index) in filterList"
      :key="index"
    >
      <ResourceItem
        :id="item.id"
        :title="item.name"
        :list="item.resList"
      />
    </view>
  </view>
</template>

<script>
import ResourceItem from './ResourceItem.vue'

export default {
  name: 'ResourceList',
  components: {
    ResourceItem,
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  computed: {
    // 商品数量 = 0 则不展示该区域: 过滤掉商品数量为 0 的列表项
    filterList () {
      return this.list.filter((item) => item.resList !== null)
    },
  },
}
</script>
