<template>
    <view class="content">
        <view class="empty" v-if="list.length == 0">
            <img src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/no-content.png">
            <text>{{ type == 0 ? '暂无可评价的商品～' : '暂无评价～' }}</text>
            <view class="recommand">
                <recommandList />
            </view>
        </view>
        <view class="no-empty" v-else>
            <u-list class="ev-list" @scrolltolower="scrolltolower">
                <view class="small-title" v-if='type == 0'>您的评价将帮助其他用户</view>
                <view class="ev" v-for="(item, index) in list" :key="index">
                    <u-list-item >
                        <view class="sku-info">
                            <image :src="item.majorPicture" mode="aspectFill" />
                            <view>
                                <view class="sku-name">{{ item.itemName }}</view>
                                <view class="sku-fl">{{ item.skuName }}</view>
                            </view>
                        </view>
                        <template v-if="type == 1">
                            <view class="score-info">
                                <view class="score" v-if="item.orderType=='020'">
                                    <view class="title">商品</view>
                                    <view class="rate">
                                        <startRate :value="item.materialScore" size="15rpx" :readOnly="true" />
                                    </view>
                                    {{ scoreTextJson[item.materialScore] || '' }}
                                </view>
                                <view class="score" v-if="item.orderType=='021'">
                                    <view class="title">服务</view>
                                    <view class="rate">
                                        <startRate :value="item.serviceScore" size="15rpx" :readOnly="true" />
                                    </view>
                                    {{ scoreTextJson[item.serviceScore] || '' }}
                                </view>
                                <view class="score" v-if="item.orderType=='021'">
                                    <view class="title">环境</view>
                                    <view class="rate">
                                        <startRate :value="item.environmentScore" size="15rpx" :readOnly="true" />
                                    </view>
                                    {{ scoreTextJson[item.environmentScore] || '' }}
                                </view>
                            </view>
                            <view class="pjnr">{{ item.commentContent || '您没有填写评价内容' }}</view>
                        </template>
                        <view class="opt">
                            <view class="btn" @click="toComment(item)" v-if="type == 0">去评价</view>
                            <view class="btn" @click="toDetail(item)" v-else="type==0">查看评价</view>
                        </view>
                    </u-list-item>
                </view>
                <view style="height: 20px;"></view>
            </u-list>
        </view>
    </view>
</template>

<script>
import { querySkusForWaitComment, querySkusForAlreadyComment } from '@/api/comment';
import recommandList from "./recommandList.vue";

import startRate from './startRateReadOnly.vue';
import { action_report } from "@/utils/track";

const scoreTextJson = {
    0: '请评分',
    1: '非常差',
    2: '差',
    3: '一般',
    4: '好',
    5: '非常好',
}
export default {
    components: { startRate, recommandList },
    props: {
        type: {
            default: '0'//0待评价  //1已评价
        }
    },
    data() {
        return {
            list: [],
            params: {
                pageNum: 1,
                pageSize: 20
            },
            finished: false,
            loading: false,
            api: querySkusForWaitComment,
            scoreTextJson
        }
    },
    mounted() {
        this.api = this.type == 0 ? querySkusForWaitComment : querySkusForAlreadyComment
        this.getList()
    },
    methods: {
        // 待评价
        getList() {
            if (this.loading) return
            this.loading = true
            this.api(this.params).then(res => {
                console.log(res, 'resres');
                this.params.pageNum += 1
                this.list = [...this.list, ...(res?.data?.data?.data || [])]
                console.log(this.list, 'this.list');

                if (this.list.length == res.data.data.totalCount) {
                    this.finished = true
                }
                this.$emit('l', res?.data?.data?.totalCount || 0)
            }).catch(err => {
                console.log('获取评价列表', err);
            }).finally(() => {
                this.loading = false
            })
        },
        scrolltolower() {
            !this.finished && this.getList()
        },
        toComment(item) {
            action_report({
                action_name: "Reviewscenter_goevaluate_click",
                module_name: "Reviewscenter",
                extend: {
                    commodity_name: item.itemName,
                },
            });
            const path = `/pagesC/comment/submit?skuInfo=${JSON.stringify(item)}&transparentTopBar=1`

            //#ifdef H5
            console.log(`${window.location.origin}/crm-medical-h5/#${path}`);
            this.$dsBridge.call("gotoPageThroughRoute", {
                page: `${window.location.origin}/crm-medical-h5/#${path}`,
            });
            //#endif

            //#ifdef MP-WEIXIN
            uni.navigateTo({
                url: path,
            });
            //#endif
        },
        toDetail(item) {
            const path = `/pagesC/comment/detail?id=${item.id}&transparentTopBar=1`
            
            //#ifdef H5
            console.log(`${window.location.origin}/crm-medical-h5/#${path}`);
            this.$dsBridge.call("gotoPageThroughRoute", {
                page: `${window.location.origin}/crm-medical-h5/#${path}`,
            });
            //#endif

            //#ifdef MP-WEIXIN
            uni.navigateTo({
                url: path,
            });
            //#endif
        },
    },
}
</script>

<style lang="scss" scoped>
.content {
    background-color: #F7F8F9;
    flex: 1;
    height: 100%;
    overflow-y: auto;
    // padding-bottom: 20px;

    .no-empty {
        padding: 0 23rpx;
        height: 100%;

        .small-title {
            font-weight: 300;
            font-size: 25rpx;
            color: #666666;
            line-height: 35rpx;
            margin: 38rpx 0 4rpx 5rpx;
        }


    }

    .empty {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin-top: 38rpx;

        img {
            width: 231rpx;
            height: 231rpx;
        }

        text {
            font-weight: 400;
            font-size: 25rpx;
            color: #999999;
            line-height: 35rpx;
            margin-top: 8rpx;
        }

        .recommand {
            margin-top: 58rpx;
        }
    }
}

.ev {
    background: #FFFFFF;
    border-radius: 23rpx;
    margin-top: 19rpx;
    padding: 29rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}


.sku-info {
    display: flex;
    align-items: center;

    image {
        width: 92rpx;
        height: 92rpx;
        min-width: 92rpx;
        border-radius: 8rpx;
        margin-right: 15rpx;
        background: #D8D8D8;    
    }

    .sku-name {
        width: 538rpx;
        font-weight: 400;
        font-size: 25rpx;
        color: #1F1F1F;
        line-height: 35rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .sku-fl {
        width: 538rpx;
        font-weight: 300;
        font-size: 23rpx;
        color: #999999;
        line-height: 33rpx;
        margin-top: 9rpx;
    }
}

.opt {
    display: flex;
    justify-content: flex-end;
    margin-top: 23rpx;

    .btn {
        width: 119rpx;
        height: 54rpx;
        background: #FF2442;
        border-radius: 27rpx;
        font-weight: 500;
        font-size: 23rpx;
        color: #FFFFFF;
        line-height: 54rpx;
        text-align: center;
    }
}

.score-info {
    margin-top: 23rpx;

    .score {
        display: flex;
        align-items: center;
        font-weight: 300;
        font-size: 19rpx;
        color: #666666;
        height: 30rpx;

        .rate {
            width: 100rpx;
            transform: scale(0.24);
            margin: 0 15rpx 0 10rpx;
        }
    }

}

.pjnr {
    margin-top: 23rpx;
    font-weight: 300;
    font-size: 25rpx;
    color: #1F1F1F;
    line-height: 40rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>