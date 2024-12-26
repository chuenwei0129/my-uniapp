<template>
  <view class="filter-options">
    <view class="filter-options__group">
      <FilterOption
        v-for="filter in filters"
        :key="filter.type"
        :label="filter.label"
        :is-active="filter.type === currentFilter"
        :custom="filter.custom"
        @onClick="onSelectFilter(filter.type)"
      />
    </view>
  </view>
</template>

<script>
import FilterOption from './FilterOption.vue'

export default {
  name: 'FilterOptions',
  components: { FilterOption },
  emits: ['filterChange'],
  data () {
    return {
      currentFilter: 1, // 当前选中的筛选类型
      filterTypes: {
        INTELLIGENT: 1, // 智能排序
        DISTANCE: 2, // 距离优先
        SALES: 3, // 销量优先
        PRICE_ASC: 4, // 价格升序
        PRICE_DESC: 5, // 价格降序
      },
    }
  },
  computed: {
    filters () {
      const { filterTypes } = this
      return [
        { type: filterTypes.INTELLIGENT, label: '智能排序' },
        { type: filterTypes.DISTANCE, label: '距离优先' },
        { type: filterTypes.SALES, label: '销量优先' },
        {
          type: this.currentFilter === filterTypes.PRICE_ASC ? filterTypes.PRICE_DESC : filterTypes.PRICE_ASC,
          label: '价格',
          custom: this.currentFilter === filterTypes.PRICE_ASC ? 'asc' : this.currentFilter === filterTypes.PRICE_DESC ? 'desc' : 'default'
        },
      ]
    },
  },
  methods: {
    onSelectFilter (filterType) {
      if (this.currentFilter === filterType && (filterType === this.filterTypes.PRICE_ASC || filterType === this.filterTypes.PRICE_DESC)) {
        // 如果当前已经是价格排序，则切换升序和降序
        this.currentFilter = filterType === this.filterTypes.PRICE_ASC ? this.filterTypes.PRICE_DESC : this.filterTypes.PRICE_ASC
      } else {
        this.currentFilter = filterType
      }
      this.$emit('filterChange', this.currentFilter)
    },
  },
}
</script>

<style lang="scss">
.filter-options {
  width: 100%;
  background-color: transparent;
  padding: 6rpx 29rpx;

  display: flex;
  justify-content: center;
  align-items: center;

  &__group {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
