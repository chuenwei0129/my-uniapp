<script>
import MyWaterFall from '@/components/waterfall/index.vue'
import NoData from '@/components/noData/index.vue'
import { getCategoryTreeGoodsV2 } from '@/api/mall'

export default {
  components: {
    NoData,
    MyWaterFall,
  },
  data () {
    return {
      filterParams: {
        pageNum: 1,
        pageSize: 20,
        classifyId: '1731211291052806146',
        sort: 1,
      },
      list: [],
    }
  },

  mounted () {
    this.onLoadData()
  },
  methods: {
    onChange (type) {
      this.filterParams.sort = type
      this.filterParams.pageNum = 1
      this.onLoadData()
      console.log('----------onChange--------')
    },
    async onLoadData () {
      this.showNoMoreData = false
        try {
          if (this.filterParams.pageNum === 1) {
            this.$refs?.waterfallFlow?.clear()
            this.list = []
          }
          const res = await getCategoryTreeGoodsV2({
            pageNum: this.filterParams.pageNum,
            pageSize: this.filterParams.pageSize,
            classifyId: this.filterParams.classifyId,
            sort: this.filterParams.sort,
            shopId: this.shopId,
          })
          // 将数据赋值给瀑布流 list 属性
          this.totalCount = Number(res?.data?.data?.totalCount || 0)
          const data = res?.data?.data?.data || []

          this.list = this.list.concat(data)
        } catch (e) {
        }
      },
    onClickItem (item) {
      console.log('item--------', item)
      uni.$u.debounce(() => {
        uni.navigateTo({
          url: `/pagesC/goodsServiceDetail/index?itemId=${
            item?.itemId || ''
          }&skuId=${item?.skuId || ''}&shopId=${item?.shopId}`,
        })
      }, 500)
    },
  },
}
</script>
<template>
  <view class="page-wrapper filter-page-wrapper">
    <SubSection @filter-change="onChange" />
    <view
      v-if="list.length"
    >
      <MyWaterFall
        ref="waterfallFlow"
        v-model="list"
        img-key="majorPicture"
        :shop-logo="true"
        origin="filterGoodsService"
        :no-more-data="showNoMoreData"
        @onClickItem="onClickItem"
      />
    </view>
    <view
      v-if="!list.length"
      class="no-data-wrapper"
    >
      <NoData
        no-data-text="暂无数据"
        img="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/empty-sheet-tag.png"
      />
    </view>
  </view>
</template>


