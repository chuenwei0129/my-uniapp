<template>
    <view class="evaluate-wrap">
        <view class="status-bar" :style="{ height: statusBarHeight }"></view>
        <view class="navbar">
            <view class="iconfont icon-back" @click="goBack"></view>
            <view class="icon-title">发评价</view>
        </view>
        <view class="sku-info">
            <view class="sku-img">
                <image mode="aspectFill"
                    :src="formData.majorPicture"/>
            </view>
            <view class="sku-desc">
                <view class="sku-desc-top">{{ formData.itemName }}</view>
                <view class="sku-desc-bottom">{{ formData.skuName }}</view>
            </view>
        </view>
        <view class="prompt">发表真实感受，帮更多人做决策～</view>
        <view class="start-content">
            <template v-if="formData.orderType=='021'">
                <view class="start-item">
                <view class="start-item-title">服务</view>
                <view class="start">
                    <startRate v-model="formData.serviceScore" />
                </view>
                <view class="start-item-warn">{{ scoreTextJson[formData.serviceScore].text1 }}</view>
                </view>
                <view class="start-item">
                    <view class="start-item-title">环境</view>
                    <view class="start">
                        <startRate v-model="formData.environmentScore" />
                    </view>
                    <view class="start-item-warn">{{ scoreTextJson[formData.environmentScore].text1 }}</view>
                </view>
            </template>
            <template v-else>
                <view class="start-item">
                <!-- <view class="start-item-title">商品</view> -->
                <view >
                    <startRate v-model="formData.materialScore" />
                </view>
                <view class="start-item-warn">{{ scoreTextJson[formData.materialScore].text1 }}</view>
                </view>
            </template>
        </view>
        <view class="line"></view>
        <view class="input-area">
            <u--textarea v-model="formData.commentContent" ref="utextarea" border="none" height="180" :placeholder="descPlaceHolder"
                maxlength="500"></u--textarea>
            <view class="count">{{ formData.commentContent.length }}/500</view>
        </view>
        <view class="upload-content">
            <view class="title">上传图片，能有效帮助其他人～</view>
            <view class="imgs">
                <!-- <view class="img-item" v-for="item in 3"></view> -->
                <view class="img-item" v-for="item in formData.mediaList">
                    <image mode="aspectFill" :src="item.mediaUrl" alt="" :key="item.mediaUrl"/>
                    <view class="delete-icon" @click="deletePic(item)">
                        <view class="iconfont icon-shutDown"></view>
                    </view>
                </view>
                <u-upload @afterRead="afterRead" :fileList="formData.mediaList" @delete="deletePic" multiple :maxCount="6">
                    <view class="img-item">
                        <image class="upload-img"
                            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/v5.4.0_comment_photo.png" />
                        <view class="upload-text">
                            {{ formData.mediaList.length == 0 ? '上传图片' : `${formData.mediaList.length}/6` }}
                        </view>
                    </view>
                </u-upload>
            </view>
        </view>
        <view class="check">
            <view class="checkbox" @click="formData.anonymousStatus = !formData.anonymousStatus">
                 <view :class="['iconfont', formData.anonymousStatus==1 ? 'icon-selected' : 'icon-unSelected']"></view>
                <view class="label">匿名评价</view>
            </view>
            <view class="warn-text">(选择匿名评价后将不展示你的头像和用户名)</view>
        </view>
        <view class="submit">
            <view
              class="btn"
              @click="submit"
              :class="isAllowSubmit ? 'allowSubmit' : ''"
              >提交</view
            >
        </view>
    </view>
</template>
<script>
import startRate from './components/startRate.vue';
import { BASR_URL } from "@/utils/http";
import { publishComment } from '@/api/comment';
import { action_report, display_report } from "@/utils/track";

const scoreTextJson = {
    0: { text1: '请评分', text2: '多多描述商品，能帮助到更多感兴趣的宠友哦～' },
    1: { text1: '非常差', text2: '十分抱歉，请消消气，有什么问题一定帮您解决～' },
    2: { text1: '差', text2: '请留下您宝贵的建议，我们一定努力改进～' },
    3: { text1: '一般', text2: '请填写不满意理由，为更多用户提供真实参考～' },
    4: { text1: '好', text2: '宠物的感受很重要，展开写写吧～' },
    5: { text1: '非常好', text2: '告诉大家宝贝有多好吧，大家都在等着你的评价哟～' }
}
export default {
    components: {
        startRate
    },
    data() {
        return {
            scoreTextJson,
            statusBarHeight: '',
            formData: {
                materialScore:0, //实物评分
                serviceScore: 0, //服务评分
                environmentScore: 0, //环境评分
                commentContent: '',
                mediaList: [],
                anonymousStatus: 0,//是否匿名 0否(默认) 1是",
                orderType:'020'
            },
            query:{},
            loading:false,
            fromNative:false,
        };
    },
    onLoad(options){
        const skuInfo = JSON.parse(options.skuInfo || '{}')
        this.formData = {...this.formData,...skuInfo,mediaList:skuInfo.mediaList || skuInfo.medias || []}
        if(!skuInfo.replyOldId){
            const commentSaveFormData = uni.getStorageSync('commentSaveFormData') || []
            const {saleOrderNo,itemId,skuId} = skuInfo
            const target = commentSaveFormData.find(v=>(v.saleOrderNo==saleOrderNo && v.itemId==itemId && v.skuId==skuId))
            this.formData = {
                ...this.formData,
                ...target
            }
        }
        this.fromNative = options.isNative == 1
        console.log(this.formData,'formData');
    },
    mounted() {
        this.statusBarHeight = this.isNative ? (getApp().globalData.h5StatusBarHeight || 45) + "px" : (getApp().globalData.statusBarHeight || 45) + 'px'
        this.$refs.utextarea.$el.onpaste = (e)=>{
            return false
        }
        display_report({
            display_name: "Postevaluation_display",
            object_type: "Postevaluation",
            extend: {
                commodity_name: this.formData.itemName,
            },
        });
    },
    methods: {
        submit(){
            if(this.loading)return
            if(!this.isAllowSubmit)return uni.$u.toast('请选择评分哦～')
            // if(this.formData.commentContent.length<5)return uni.$u.toast('评价字数需大于5个字')
            action_report({
                action_name: "Postevaluation_submit_display",
                module_name: "Postevaluation",
                extend: {
                    commodity_name: this.formData.itemName,
                },
            });
            this.loading = true
            // 提交
            const mediaList = this.formData.mediaList.map((v,i)=>({
                ...v,
                mediaType:0,
                mediaSort:i+1
            }))
            const params = {
                ...this.formData,
                mediaList,
                anonymousStatus:this.formData.anonymousStatus ? '1' : '0'
            }
            publishComment(params).then(res=>{
                console.log(res);
                if(res){
                    uni.redirectTo({
                        url: `/pagesC/comment/complete?id=${res.data.data}&transparentTopBar=1`,
                    });
                    uni.$u.toast('评价成功～')
                    let commentSaveFormData = uni.getStorageSync('commentSaveFormData') || []
                    const {skuId,itemId,saleOrderNo} = this.formData
                    commentSaveFormData = commentSaveFormData.filter(v=>(v.saleOrderNo!=saleOrderNo || v.itemId!=itemId || v.skuId!=skuId))
                    console.log(commentSaveFormData,'存储数据');
                    
                    uni.setStorageSync('commentSaveFormData',commentSaveFormData)
                }
            }).catch(err=>{
                console.log(err,'提交评价errerrerr');
            }).finally(()=>{
                this.loading = false
            })
        },
        //新增图片
        async afterRead(event) {
            try {
                const res = await this._uploadFile(event.file);
                res?.data && this.formData.mediaList.push({mediaUrl:res.data})
            } catch (e) {
                console.error("新增图片", e);
            }
        },
        _uploadFile(file) {            
            return new Promise((resolve, reject) => {
                const url = process.env.NODE_ENV?.includes("local")
                    ? "/api/"
                    : BASR_URL;
                uni.uploadFile({
                    url: url + "cpp-common-management/v1/file/upload",
                    filePath: file[0].url,
                    name: "file",
                    header: {
                        Authorization: uni.getStorageSync("storage_info").token,
                        fromChannel: "MP",
                    },
                    formData: {
                        file: file[0].url,
                    },
                    success: (uploadFileRes) => {
                        console.log(uploadFileRes);
                        if(uploadFileRes.statusCode == 200){
                            resolve(uploadFileRes);
                        }else{
                            uni.$u.toast(uploadFileRes.errMsg)
                        }
                    },
                    fail: (res) => {
                        console.log(res);
                        reject(res);
                    },
                });
            });
        },
        // 删除图片
        deletePic(item) {
            this.formData.mediaList = this.formData.mediaList.filter(v => v.mediaUrl != item.mediaUrl)
        },
        goBack() {
            console.log(this.detail);
            // skuId && saleOrderNo && itemId
            if(!this.formData.replyOldId){
                let commentSaveFormData = uni.getStorageSync('commentSaveFormData') || []
                const {materialScore,serviceScore,environmentScore,commentContent,mediaList,anonymousStatus,skuId,itemId,saleOrderNo} = this.formData
                const saveFromData = {
                    materialScore,serviceScore,environmentScore,commentContent,mediaList,anonymousStatus,skuId,itemId,saleOrderNo
                }
                commentSaveFormData = commentSaveFormData.filter(v=>(v.saleOrderNo!=saleOrderNo || v.itemId!=itemId || v.skuId!=skuId))
                const target = [saveFromData,...commentSaveFormData].splice(0,10)
                console.log(target,'存储数据');
                
                uni.setStorageSync('commentSaveFormData',target)
            }
            this.isNative ? this.$dsBridge.call("closeCurrentWebview", {}) : uni.navigateBack({ delta: 1 })
        }
    },
    computed: {
        isNative() {
            return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
        },
        descPlaceHolder() {
            const { serviceScore, environmentScore,materialScore } = this.formData
            let min = 0
            if(this.formData.orderType == '021'){
                min = Math.min((serviceScore || 0), Number(environmentScore || 0)) || serviceScore || environmentScore
            }else{
                min = materialScore
            }
            return scoreTextJson[min].text2
        },
        isAllowSubmit(){
            const { serviceScore, environmentScore,materialScore } = this.formData
            return this.formData.orderType == '021' ? serviceScore && environmentScore  : materialScore
        }
    },

};
</script>

<style lang="scss" scoped>
.evaluate-wrap {
    width: 100vw;
    height: 100vh;
    padding-bottom: 213rpx;
    overflow-y: auto;
    box-sizing: border-box;

    .navbar {
        margin-top: 19rpx;
        display: flex;
        align-items: center;
        padding: 0 23rpx;

        .icon-back {
            font-size: 42rpx;
        }

        .icon-title {
            font-weight: 500;
            font-size: 31rpx;
            color: #333333;
            line-height: 46rpx;
            margin-left: 5rpx;
        }
    }

    .sku-info {
        margin-top: 46rpx;
        padding: 0 31rpx;
        display: flex;
        align-items: center;

        .sku-img {
            width: 69rpx;
            height: 69rpx;
            background: #D8D8D8;
            border-radius: 8rpx;
            overflow: hidden;
            image {
                width: 69rpx;
                height: 69rpx;
            }
        }

        .sku-desc {
            margin-left: 12rpx;
            flex: 1;
            font-weight: 300;

            .sku-desc-top {
                width: 100%;
                font-size: 23rpx;
                color: #333333;
                line-height: 33rpx;
            }

            .sku-desc-bottom {
                font-size: 19rpx;
                color: #666666;
                line-height: 27rpx;
                margin-top: 5rpx;
            }
        }
    }

    .prompt {
        font-weight: 300;
        font-size: 21rpx;
        color: #666666;
        line-height: 31rpx;
        margin-top: 46rpx;
        padding: 0 31rpx;
    }

    .start-content {
        padding: 14rpx 35rpx 29rpx;

        .start-item {
            margin-top: 15rpx;
            display: flex;
            align-items: center;

            .start-item-title {
                font-weight: 300;
                font-size: 23rpx;
                color: #333333;
                line-height: 33rpx;
            }

            .start {
                margin-left: 17rpx;
            }

            .start-item-warn {
                font-weight: 300;
                font-size: 23rpx;
                color: #666666;
                line-height: 33rpx;
                margin-left: 25rpx;
            }
        }
    }

    .line {
        height: 6rpx;
        width: calc(100vw - 76rpx);
        margin-left: 38rpx;
        background: #f6f6f6;
    }

    .input-area {
        padding: 28rpx 40rpx 0;

        .u-textarea {
            border: none;
            padding: 0;
            position: relative;
        }

        .uni-textarea-placeholder {
            font-weight: 400;
            font-size: 29rpx;
            color: #CCCCCC !important;
        }

        .u-textarea__count {
            bottom: -100% !important;
        }

        .uni-textarea-wrapper {
            height: 100% !important;
        }

        .count {
            font-size: 23rpx;
            color: #999999;
            line-height: 33rpx;
            text-align: right;
        }
    }

    .upload-content {
        margin-top: 59rpx;

        .title {
            font-weight: 300;
            font-size: 21rpx;
            color: #666666;
            line-height: 31rpx;
            padding: 0 38rpx;
        }

        .imgs {
            margin-top: 4rpx;
            display: flex;
            flex-wrap: wrap;
            padding: 0 23rpx;

            .img-item {
                width: 154rpx;
                height: 154rpx;
                background: #FFFFFF;
                border-radius: 12rpx;
                border: 2rpx solid #F0F0F0;
                margin-left: 15rpx;
                margin-top: 15rpx;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                image {
                    width: 100%;
                    height: 100%;
                    border-radius: 12rpx;
                    overflow: hidden;
                    object-fit: contain;
                }

                .delete-icon {
                    color: #FFFFFF;
                    width: 34rpx;
                    height: 34rpx;
                    background: #666666;
                    position: absolute;
                    top: -12rpx;
                    right: -12rpx;
                    border-radius: 34rpx;
                    line-height: 34rpx;
                    text-align: center;

                    .icon-shutDown {
                        font-size: 26rpx;
                    }
                }

                .upload-img {
                    width: 63rpx;
                    height: 63rpx;
                    border-radius: 0;
                }

                .upload-text {
                    font-size: 23rpx;
                    color: #999999;
                    line-height: 33rpx;
                    margin-top: 7rpx;
                }
            }

            ::v-deep .u-upload__wrap__preview {
                display: none;
            }
        }

    }

    .check {
        padding: 0 38rpx;
        margin-top: 42rpx;
        display: flex;
        align-items: center;

        .checkbox {
            display: flex;
            align-items: center;
            iconfont{
                font-size: 40rpx;
            }
            .icon-unSelected{
                color: #979797;
            }
            .icon-selected{
                color: #FF2442;
            }

            .label {
                font-size: 23rpx;
                color: #333333;
                margin:0 8rpx 0 5rpx;
            } 
        }
        .warn-text{
            font-size: 21rpx;
            color: #999999;
        }
    }
    .submit{
        width: 100%;
        height: 173rpx;
        background: #FFFFFF;
        border-top: 2rpx solid #E6E6E6;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 23rpx 38.46rpx 0;
        .btn{
            height: 85rpx;
            background: #FF2442;
            border-radius: 42rpx;
            font-weight: 500;
            font-size: 31rpx;
            color: #FFFFFF;
            line-height: 85rpx;
            text-align: center;
            opacity: 0.4;
        }
        .allowSubmit{
            opacity: 1;
        }
    }
}
</style>