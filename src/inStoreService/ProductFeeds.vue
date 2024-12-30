<template>
  <view>
    <!-- 分类标签 -->
    <view class="sticky-container">
      <FilterTabs
        :list="tabList"
        @onChange="onTabChange"
      />
      <FilterOptions @filterChange="onFilterChange" />
    </view>
    <!-- 商品列表 -->
  </view>
</template>

<script>
import FilterTabs from './FilterTabs.vue'
import FilterOptions from './FilterOptions.vue'
// import { fetchRecommendClassifyAPI, fetchProductListAPI } from './mock/api'
import { fetchRecommendClassifyAPI, fetchProductListAPI } from './api/inStoreService'

export default {
  name: 'ProductFeeds',
  components: {
    FilterTabs,
    FilterOptions,
  },
  data () {
    return {
      // 类目区
      tabList: [],
      productList: [], // 新增：商品列表数据
      params: {
        pageNum: 1,
        pageSize: 10,
        // 类目 id
        // 默认为推荐类目
        categoryId: 0,
        // 排序类型
        sortType: 1,
      },
    }
  },
  async created () {
    await this.fetchRecommendClassifyData()
    // 默认选中第一个 tab，并将其 categoryId 赋值给 params
    if (this.tabList.length > 0) {
      this.params.categoryId = this.tabList[0].id
    }
    await this.fetchProductListData()
  },
  methods: {
    async fetchRecommendClassifyData () {
      const resp = await fetchRecommendClassifyAPI()
      // 推荐类型 => 1：类目区 2：推荐区
      this.tabList = resp.data.data.filter((item) => item.recommendType === 1)
      console.log(
        '🚀 ~ fetchRecommendClassifyData ~ this.tabList:',
        this.tabList
      )
    },
    async fetchProductListData () {
      const resp = await fetchProductListAPI(this.params)
      this.productList = resp.data.data
      console.log(
        '🚀 ~ fetchProductListData ~ this.productList:',
        this.productList
      )
    },
    onTabChange (currentTab) {
      console.log('🚀 ~ onTabChange ~ currentTab:', currentTab)
      this.params.categoryId = currentTab.id
      this.params.pageNum = 1
      this.fetchProductListData()
    },
    onFilterChange (filterType) {
      console.log('🚀 ~ onFilterChange ~ filterType:', filterType)
      this.params.sortType = filterType
      this.params.pageNum = 1 // 重置页码
      this.fetchProductListData() // 重新获取数据
    },
  },
}
</script>

<style scoped>
.sticky-container {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #fff; /* 背景色 */
}

</style>
