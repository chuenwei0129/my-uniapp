<template>
   <view class="wrap">
    <view class="status-bar" :style="{ height: statusBarHeight }"></view>
    <view class="status-bar" :style="{ height: navBarHeight }"></view>
    <FixedNav title="评价详情" :headerShow="true" :backfc="goBack"/>
    <view class="content">
        <view class="base-info">
            <view class="user-info">
                <image :src="detail.memberIcon || 'https://image.chongpangpang.com/61ee0fe4f58112000178d924/fc1246fc0798419691a86b3151c2e51b.png'"></image>
                <text class="name">{{ detail.memberName || '匿名买家' }}</text>
                <text class="ev-type">{{detail.anonymousStatus ? '匿名评价' : ''}}</text>
            </view>
            <view class="time">{{ detail.createdTime }}</view>
        </view>
        <view class="sku-info">
            <image :src="detail.majorPicture" mode="scaleToFill"/>
            <view class="sku-desc">
                <view class="title">{{detail.itemName}}</view>
                <view class="desc">{{ detail.skuName }}</view>
            </view>
        </view>
        <view class="score-info">
            <view class="score" v-if="detail.orderType=='020'">
                <view class="title">商品</view>
                <view class="rate"><startRate :value="detail.materialScore || 0" size="15rpx" :readOnly="true" /></view>
                <view class="score-desc">{{ scoreTextJson[detail.materialScore] || '' }}</view>
            </view>
            <view class="score" v-if="detail.orderType=='021'">
                <view class="title">服务</view>
                <view class="rate"><startRate :value="detail.serviceScore || 0" size="15rpx" :readOnly="true" /></view>
                <view class="score-desc">{{ scoreTextJson[detail.serviceScore] || '' }}</view>
            </view>
            <view class="score" v-if="detail.orderType=='021'">
                <view class="title">环境</view>
                <view class="rate"><startRate :value="detail.environmentScore || 0" size="15rpx" :readOnly="true" /></view>
                <view class="score-desc">{{ scoreTextJson[detail.environmentScore] || '' }}</view>
            </view>
        </view>
        <view class="ev-info">
            {{ detail.commentContent || '' }}
        </view>
        <view class="ev-imgs">
            <image v-for="item,index in detail.medias" @click='handlePreviewImages(item)' :key="item.mediaUrl" :src="item.mediaUrl" mode="scaleToFill"/>
        </view>
        <view class="reply" v-if="detail.merchantContent">
            <text class="title">商家回复：</text>
           {{ detail.merchantContent }}
        </view>
        <view class="empty"></view>
    </view>
    <view class="fail" v-if="[2,4].includes(detail.auditStatus)">
        <view class="title">审核未通过</view>
        <view class="reason">原因：{{ detail.auditMsg || '审核未通过，您可重新发布评价' }}</view>
    </view>
    <view class="fail" v-if="detail.auditStatus==0">
        <view class="title">审核中</view>
    </view>
    <view class="fixed-btns" v-if="detail.showDelButton==1 || detail.showRepostButton">
        <view class="del-btn btn" v-if="detail.showDelButton==1" @click="showClearPop=true">删除</view>
        <view class="edit-btn btn" v-if="detail.showRepostButton" @click="toComment">重新编辑</view>
    </view>
    <popConfirm
      :show.sync="showClearPop"
      @handleConfirm="del"
    />
   </view>
</template>
<script>
import FixedNav from "@/components/fixedNav/index.vue";
import startRate from './components/startRateReadOnly.vue';
import popConfirm from "./components/popConfirm.vue";
import { queryCommentDetail,deleteComment } from '@/api/comment';
const scoreTextJson = {
    0: '请评分',
    1: '非常差',
    2: '差',
    3: '一般',
    4: '好', 
    5: '非常好', 
}

export default {
    components: { FixedNav,startRate,popConfirm },
    data() {
        return {
            statusBarHeight: '',
            navBarHeight:'',
            isHeaderShow:false,
            showClearPop:false,
            scoreTextJson,
            id:'',
            skuId:'',
            saleOrderNo:'',
            detail:{
                // "auditStatus": "审核状态，0:审核中 1:审核通过 2:审核未通过",
            },
            fromNative:'',
        };
    },
    onLoad(options){
        console.log(options,'options');
        this.id = options.id || ''
        this.skuId = options.skuId || ''
        this.saleOrderNo = options.saleOrderNo || ''
        this.fromNative = options.isNative == 1
    },
    mounted() {
        this.statusBarHeight = this.isNative ? (getApp().globalData.h5StatusBarHeight || 45) + "px" : (getApp().globalData.statusBarHeight || 45) + 'px'
        this.navBarHeight = this.isNative ? (getApp().globalData.h5NavBarHeight || 45) + "px" : (getApp().globalData.navBarHeight || 45) + 'px'
        this.getDetail()
    },
    methods: {
        getDetail(){
            queryCommentDetail({
                id:this.id,
                skuId:this.skuId,
                saleOrderNo:this.saleOrderNo
            }).then(res=>{
                console.log('详情',res);
                this.detail = res?.data?.data || {}
            }).catch(err=>{
                console.log(err,'详情');
            })
        },
        handlePreviewImages(item) {
            uni.previewImage({
                current: item.mediaUrl,
                urls: this.detail.medias.map((item) => item.mediaUrl)
            });
        },
        toComment(){
            const params = {
                ...this.detail,
                replyOldId:this.id,
                materialScore:0,
                serviceScore: 0,
                environmentScore: 0,
                commentContent: '',
                mediaList: [],
                medias:[],
                anonymousStatus: 0,
            }
            const path = `/pagesC/comment/submit?skuInfo=${JSON.stringify(params)}&transparentTopBar=1`
            
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
        del(){
            const params = {
                saleOrderNo:this?.detail?.saleOrderNo || '',
                skuIds:[this?.detail?.skuId || '']
            }
            deleteComment(params).then(res=>{
                this.showClearPop=false
                uni.redirectTo({
                    url: `/pagesC/comment/center?transparentTopBar=1`,
                });
                uni.$u.toast('评论已删除')
            }).catch(err=>{
                console.log(err,'删除评价');
            }).finally(()=>{

            })
        },
        goBack(){
            this.isNative ? this.$dsBridge.call("closeCurrentWebview", {}) : uni.navigateBack({ delta: 1 })
        }
    },
    computed: {
        formattedGoods() {
            console.log("goodlist====", this.goodsList);
            return (this.goodsList || []).map((e) => {
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
        isNative() {
            return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
        },
    },

};
</script>

<style lang="scss" scoped>
    .wrap{
        width: 100vw;
        height: 100vh;
        background-color: #fff;
    }
    .fixed-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        font-size: 31rpx;
        color: #333333;
        line-height: 46rpx;
        padding: 21rpx 23rpx;
        text-align: center;
        position: relative;
        .icon-back{
            font-size: 42rpx;
            position: absolute;
            left: 23rpx;
            top: 21rpx;
        }
    }
    .content{
        margin: 0 30rpx;
        .base-info{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 54rpx;
            .user-info{
                display: flex;
                align-items: center;
                image{
                    width: 46rpx;
                    height: 46rpx;
                    border-radius: 46rpx;
                    background: #D8D8D8;
                }
                .name{
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 500;
                    font-size: 23rpx;
                    color: #1F1F1F;
                    line-height: 23rpx;
                    margin: 0 11rpx 0 15rpx;
                }
                .ev-type{
                    font-weight: 300;
                    font-size: 19rpx;
                    color: #333333;
                    line-height: 27rpx;
                }
            }
            .time{
                font-family: PingFangSC, PingFang SC;
                font-weight: 300;
                font-size: 19rpx;
                color: #666666;
                line-height: 17rpx;
            }
            
        }
        .sku-info{
            margin-top: 29rpx;
            width: 100%;
            height: 96rpx;
            background: #F8F8F8;
            border-radius: 6rpx;
            display: flex;
            align-items: center;
            padding: 0 10rpx;
            image{
                width: 77rpx;
                height: 77rpx;
                min-width: 77rpx;
                border-radius: 8rpx;
                background: #D8D8D8;
            }
            .sku-desc{
                flex: 1;
                margin-left: 12rpx;
                .title{
                    width: 590rpx;
                    font-weight: 300;
                    font-size: 23rpx;
                    color: #333333;
                    line-height: 33rpx;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .desc{
                    width: 590rpx;
                    font-weight: 400;
                    font-size: 19rpx;
                    color: #666666;
                    line-height: 27rpx;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    margin-top: 3rpx
                }
            }
        }
        .score-info{
            margin-top: 23rpx;
            .score{
                display: flex;
                align-items: center;
                font-weight: 300;
                font-size: 19rpx;
                color: #666666;
                height: 30rpx;
                .rate{
                    width: 100rpx;
                    transform: scale(0.24);
                    margin: 0 15rpx 0 10rpx;
                }
            }
            
        }
        .ev-info{
            font-weight: 300;
            font-size: 25rpx;
            color: #1F1F1F;
            line-height: 40rpx;
            margin-top: 19rpx;
            margin-bottom: 23rpx
        }
        .ev-imgs{

            image{
                width: 223rpx;
                height: 223rpx;
                &:nth-child(3n+1){
                    border-radius: 8rpx 0rpx 0rpx 8rpx;
                }
                &:nth-child(3n+2){
                    margin: 0 10rpx;
                }
                &:nth-child(3n+3){
                    border-radius: 0rpx 8rpx 8rpx 0rpx;
                }
            }
        }
        
        .reply{
            font-weight: 300;
            font-size: 23rpx;
            color: #666666;
            line-height: 37rpx;
            margin-top: 28rpx;
            .title{
                font-weight: 400;
                font-size: 23rpx;
                color: #666666;
                line-height: 33rpx;
            }
        }
    }
    .empty{
        height: 381rpx;
    }
    .fail{
        // min-height: 138rpx;
        background: #F8F8F8;
        border-radius: 8rpx;
        position: fixed;
        bottom: 204rpx;
        left: 0;
        right: 0;
        margin: 0 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 23rpx;
        .title{
            font-weight: 500;
            font-size: 23rpx;
            color: #1F1F1F;
        }
        .reason{
            font-weight: 300;
            font-size: 23rpx;
            color: #333333;
            margin-top: 10rpx;
        }
    }
    .fixed-btns{
        height: 173rpx;
        background: #FFFFFF;
        border-top: 2rpx solid #E6E6E6;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 30rpx;
        .btn{
            width: 188rpx;
            height: 69rpx;
            border-radius: 38rpx;
            line-height: 69rpx;
            text-align: center;
            font-size: 27rpx;
            margin-left: 23rpx
        }
        .del-btn{
            background: #FFFFFF;
            border: 1rpx solid #E6E6E6;
            color: #333;
        }
        .edit-btn{
            background: #FF2442;
            color: #FFFFFF;
        }
    }
</style>