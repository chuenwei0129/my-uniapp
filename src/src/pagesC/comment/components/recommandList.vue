<template>
    <view class="bottom-recommand">
        <view class="title">
            <image src="https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/v5.4.0_comment_heart.png" />
            <text>猜你喜欢</text>
            <image style="transform: rotateY(180deg);" src="https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/v5.4.0_comment_heart.png" />
        </view>
        <view class="skus">
            <GoodsList :goods="formattedGoods"></GoodsList>
        </view>
    </view>
</template>

<script>
import GoodsList from "@/components/goodsList/index.vue";
import { GET_RECOMMEND_GOODS } from "@/api/mallv2";
export default {
    components: { GoodsList },
    data(){
        return {
            goodsList:[]
        }
    },
    created(){
        this.requestQueryRecommend()
    },
    methods:{
        async requestQueryRecommend() {
            console.log("推荐===");
            const res = await GET_RECOMMEND_GOODS({
                dbPageNo: 0,
                skipGoods: 0,
                pageNum: 1,
                pageSize: 20,
                type: 1,
            });
            this.goodsList = res.data.data.goodData ?? [];
        },
    },
    computed: {
        formattedGoods() {
            console.log("goodlist====", this.goodsList);
            return this.goodsList.map((e) => {
                const salePrice =
                    e.promotionTag != null ? e.promotionPrice : e.lowestPrice;
                const originPrice = e.promotionTag != null ? e.lowestPrice : 0;
                return {
                    picture: e.majorPicture,
                    title: e.itemName,
                    salePrice: salePrice,
                    originPrice: originPrice,
                    id: e.itemId,
                    skuId: e.skuId,
                    skuTag: e.skuTag,
                    shopId: e.shopId,
                    promotion: e.promotionTag,
                };
            });
        },
    },
}
</script>

<style lang="scss" scoped> 
    .bottom-recommand {
        height: 500rpx;
        .title {
            display: flex;
            align-items: center;
            justify-content: center;

            image {
                width: 20rpx;
                height: 22rpx;
            }

            text {
                font-family: PingFangSC, PingFang SC;
                font-weight: 600;
                font-size: 31rpx;
                color: #202020;
                margin: 0 17rpx;
            }
        }

        .skus {
            margin-top: 40rpx;
        }
    }
</style>