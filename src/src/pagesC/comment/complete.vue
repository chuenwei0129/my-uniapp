<template>
    <scroll-view class="scroll-view" @scroll="handleScroll" scroll-y>
        <view class="page-wrap">
            <view>
                <view class="status-bar" :style="{ height: statusBarHeight }"></view>
                <!-- #ifdef H5 -->
                <view class="header" @click="toDetail">完成</view>
                <!-- #endif -->
                 <!-- #ifdef MP-WEIXIN -->
                <view class="header" style="opacity: 0;">完成</view>
                <!-- #endif -->
                <FixedNav title="感谢评价" :headerShow="isHeaderShow" :backfc="null">
                </FixedNav>
                <view class="center">
                    <view class="success-img">
                        <image src="https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/v5.4.0_comment_zan.png" />
                    </view>
                    <view class="big-title">感谢评价！</view>
                    <view class="small-title">感谢你的评价，帮更多人做决策~</view>
                    <view class="btns">
                        <view class="btn" @click="toDetail">查看评价</view>
                        <view class="btn" @click="backHome">返回首页</view>
                    </view>
                </view>
            </view>
            <view class="bottom-ev" v-if="commentList.length">
                <view class="top">
                    <view class="title">继续评价</view>
                    <view class="more" @click="toCommentArea">
                        <text>查看更多评价</text>
                        <image src="https://frontend-cdn.chongpangpang.com/image/medical-mp/my/my_more.png" />
                    </view>
                </view>
                <view class="ev-list">
                    <view class="ev" v-for="item in commentList">
                        <view class="left">
                            <image
                                :src="item.majorPicture"
                                mode="aspectFill" />
                            <view class="sku-info">
                                <view class="name">{{ item.itemName }}</view>
                                <view class="time">{{ item.completionTime || '' }}</view>
                            </view>
                        </view>
                        <view class="right" @click="toComment(item)">去评价</view>
                    </view>
                </view>
            </view>
            <view class="recommand" v-else>
                <recommandList/>
            </view>
            <view style="height: 20px;"></view>
        </view>
    </scroll-view>
</template>
<script>
import FixedNav from "@/components/fixedNav/index.vue";
import recommandList from "./components/recommandList.vue";
import { querySkusForWaitComment } from '@/api/comment';

export default {
    components: { FixedNav ,recommandList},
    data() {
        return {
            statusBarHeight: '',
            showMore: false,
            isHeaderShow: false,
            commentList:[],
            id:'',
        };
    },
    onLoad(options){
        this.id = options.id || ''
    },
    mounted(){
        this.statusBarHeight = this.isNative ? (getApp().globalData.h5StatusBarHeight || 45) + "px" : (getApp().globalData.statusBarHeight || 45) + 'px'
    },
    onShow() {
        this.querySkusForWaitComment()
    },
    methods: {
        querySkusForWaitComment(){
            const params = {
                pageNum:1,
                pageSize:20
            }
            querySkusForWaitComment(params).then(res=>{
                console.log(res.data.data.data,'评价列表');
                this.commentList = res?.data?.data?.data || []
            }).catch(err=>{
                console.log('获取评价列表',err);
            })
        },
        toComment(item){
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
        toCommentArea(){
            const path = `/pagesC/comment/center?transparentTopBar=1`
            
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
        toDetail() {
            const path = `/pagesC/comment/detail?transparentTopBar=1&id=${this.id}`
            
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
        backHome(){
            
          //#ifdef H5
          this.$dsBridge.call("closeCurrentWebview", {});
          this.$dsBridge.call("gotoPageThroughRoute", {
            page: `/home?homeSelectedIndex=0`,
          });
          //#endif

          //#ifdef MP-WEIXIN
          uni.switchTab({
            url: "/pages/home/index",
          });
          //#endif
        },
        handleScroll(e) {            
            if (e && e.detail && e.detail.scrollTop > 200) {
                this.isHeaderShow = true;
            } else {
                this.isHeaderShow = false;
            }
        },
    },
    computed: {
        isNative() {
            return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
        },
    },
};
</script>

<style lang="scss" scoped>
.scroll-view {
    height: 100vh;
    background: #F7F8FC;
}

.page-wrap {
    width: 100vw;
    height: 100vh;
    background: #F7F8FC;

    .wrap {
        height: 750rpx;
        background: linear-gradient(180deg, #FFFFFF 0%, #F7F8FC 100%);
    }

    .header {
        padding: 21rpx 32rpx 0;
        text-align: right;
        font-size: 27rpx;
        color: #333333;
    }

    .center {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 48rpx;

        .success-img {
            image {
                width: 154rpx;
                height: 154rpx;
            }
        }

        .big-title {
            font-weight: 500;
            font-size: 38rpx;
            color: #1F1F1F;
            line-height: 54rpx;
            margin: 10rpx 0 11rpx;
        }

        .small-title {
            font-weight: 300;
            font-size: 25rpx;
            color: #666666;
            line-height: 35rpx;
        }

        .btns {
            display: flex;

            .btn {
                width: 231rpx;
                height: 69rpx;
                background: #FFFFFF;
                border-radius: 38rpx;
                border: 1rpx solid #E6E6E6;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 27rpx;
                color: #333333;
                line-height: 69rpx;
                text-align: center;
                margin: 32rpx 23rpx 0 0;
            }
        }
    }

    .bottom-ev {
        padding: 28rpx;
        margin: 58rpx 23rpx 0;
        background: #FFFFFF;
        border-radius: 23rpx;
        border: 1rpx solid #FFFFFF;
        backdrop-filter: blur(10px);

        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                font-weight: 500;
                font-size: 31rpx;
                color: #1F1F1F;
                line-height: 42rpx;
            }

            .more {
                height: 33rpx;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                font-size: 23rpx;
                color: #999999;
                line-height: 33rpx;
                display: flex;
                align-items: center;

                image {
                    width: 23rpx;
                    height: 23rpx;
                    margin-left: 7rpx;
                }
            }
        }

        .ev-list {
            margin-top: 10rpx;

            .ev {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 28rpx;

                .left {
                    flex: 1;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;

                    image {
                        width: 90rpx;
                        height: 90rpx;
                        min-width: 90rpx;
                        background: #D8D8D8;
                        border-radius: 8rpx;
                    }

                    .sku-info {
                        margin-left: 17rpx;
                        flex: 1;

                        .name {
                            width: 350rpx;
                            font-weight: 300;
                            font-size: 25rpx;
                            color: #1F1F1F;
                            line-height: 35rpx;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        .time {
                            font-weight: 300;
                            font-size: 23rpx;
                            color: #999999;
                            line-height: 33rpx;
                            height: 33rpx;
                            margin-top: 6rpx
                        }
                    }
                }

                .right {
                    width: 119rpx;
                    min-width: 119rpx;
                    height: 54rpx;
                    background: #FFFFFF;
                    border-radius: 27rpx;
                    border: 1rpx solid #FF2442;
                    font-weight: 500;
                    font-size: 23rpx;
                    color: #FF2442;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }

    .recommand {
        margin: 58rpx 15rpx 0;
    }
}

::v-deep .header-fixed {
    .left {
        opacity: 0;
    }
}
</style>