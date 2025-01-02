<template>
    <view class="wrap">
        <view>
            <view class="status-bar" :style="{ height: statusBarHeight }"></view>
            <view class="fixed-header">
                <view class="left">
                    <view class="iconfont icon-back" @click="goBack"></view>
                </view>
                <view class="title">评价中心</view>
                <view class="right"></view>
            </view>
            <view class="tabs">
                <view :class="tabVal == '未评价' ? 'active-tab tab' : 'tab'" @click="handleChange('未评价')">未评价({{waitCommentNum || 0}})</view>
                <view :class="tabVal == '已评价' ? 'active-tab tab' : 'tab'" @click="handleChange('已评价')">已评价</view>
            </view>
        </view>
        <scrollList style="flex: 1;" v-if="tabVal == '未评价'" key="scrollList1" @l="val=>waitCommentNum=val" type="0"></scrollList>
        <scrollList style="flex: 1;" v-else  key="scrollList2" type="1"></scrollList>
    </view>
</template>
<script>
import FixedNav from "@/components/fixedNav/index.vue";
import recommandList from "./components/recommandList.vue";
import scrollList from './components/scrollList.vue'
import { display_report } from "@/utils/track";
export default {
    components: { FixedNav, recommandList,scrollList },
    data() {
        return {
            statusBarHeight: '',
            isHeaderShow: false,
            tabVal: '未评价',
            orderType: 1,
            waitCommentNum:0,
            fromNative:'',
        };
    },
    onLoad(options){
        this.tabVal = options.tabval == 1 ? '已评价' : '未评价'
        this.fromNative = options.isNative == 1
    },
    mounted() {
        this.statusBarHeight = this.isNative ? (getApp().globalData.h5StatusBarHeight) + "px" : (getApp().globalData.statusBarHeight) + 'px'
        display_report({
            display_name: "Reviewscenter_display",
            object_type: "Reviewscenter",
        });
    },
    
    methods: {
        handleChange(val) {
            if (this.tabVal == val) return
            this.tabVal = val
        },
        goBack(){
            this.isNative ? this.$dsBridge.call("closeCurrentWebview", {}) : uni.navigateBack({ delta: 1 })
        }
    },
    computed: {
        isNative() {
            return this.$dsBridge && this.$dsBridge.call("getToken", "getToken");
        },
    },

};
</script>

<style lang="scss" scoped>
.wrap {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.fixed-header {
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

    .icon-back {
        font-size: 42rpx;
        position: absolute;
        left: 23rpx;
        top: 21rpx;
    }
}

.tabs {
    height: 85rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;

    .tab {
        font-weight: 300;
        font-size: 27rpx;
        color: #333333;
        line-height: 85rpx;

        &:nth-child(1) {
            margin-right: 148rpx;
        }
    }

    .active-tab {
        font-weight: 500;
        color: #1F1F1F;
        position: relative;

        &::after {
            content: '';
            width: 58rpx;
            height: 4rpx;
            background: #1F1F1F;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>