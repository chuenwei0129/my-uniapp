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
    <!-- 展示商品信息 -->
    <ProductList
      v-if="products.length"
      :products="products"
    />
    <view
      v-else
    >
      暂无数据
    </view>
  </view>
</template>

<script>
import FilterTabs from './FilterTabs.vue'
import FilterOptions from './FilterOptions.vue'
import ProductList from './ProductList.vue'

// import { fetchRecommendClassifyAPI, fetchProductListAPI } from './api/mockAPI'
import { fetchRecommendClassifyAPI, fetchProductListAPI } from './api/inStoreService'

export default {
  name: 'ProductFeeds',
  components: {
    FilterTabs,
    FilterOptions,
    ProductList,
  },
  props: {
    locationInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      tabList: [],
      products: [], // 新增：商品列表数据
      params: {
        pageNum: 1,
        pageSize: 10,
        // 类目 id
        // 默认为推荐类目
        categoryId: '',
        // 排序类型
        sortType: 1,
      },
    }
  },
  async created () {
    await this.fetchRecommendClassifyData()
    await this.fetchProductListData()
  },
  methods: {
    async fetchRecommendClassifyData () {
      const resp = await fetchRecommendClassifyAPI()
      console.log('🚀 ~ fetchRecommendClassifyData ~ resp:', resp)
      this.tabList = resp.data.data.filter((item) => item.recommendType === 1)
    },
    async fetchProductListData () {
      const { cityCode, lon: lng, lat } = this.locationInfo
      const resp = await fetchProductListAPI({
        pageNum: 1,
        pageSize: 10,
        cityCode,
        lng,
        lat,
        categoryIds: this.params.categoryId ? [this.params.categoryId] : undefined,
        sortType: this.params.sortType,
        fromChannel: 'APP'
      })
      console.log('🚀 ~ fetchProductListData ~ resp:', resp)
      this.products = resp.data.data.data || []
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
  background-color: #fff;
}
</style>
