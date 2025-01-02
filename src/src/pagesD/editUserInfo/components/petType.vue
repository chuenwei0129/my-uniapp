<template>
    <u-popup :show="show" round="19" @touchmove.stop.prevent>
        <view class="content">
            <view class="header">
                <text @click="close">取消</text>
                <view>宠物类型</view>
                <text @click="hanldConfirm">确定</text>
            </view>
            <view class="pickerView">
                <picker-view
                    class="picker"
                    indicator-class="indicator"
                    :value="value"
                    :immediate-change="true"
                    @change="bindChange"
                    >
                    <picker-view-column class="column">
                        <view class="text" v-for="(item, index) in tepList" :key="index">{{
                            item
                            }}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </u-popup>
</template>

<script>
import { tepList } from "../data/index";
export default {
    name: 'petType',
    data() {
        return {
            tepList,
            value: []
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        pet: {
            type: Number,
            default: 0
        }
    },
    watch: {
        pet: {
            handler(newVal) {
                this.value = [newVal]
            },
        }
    },
    methods: {
        bindChange(e) {
            this.value = e.detail.value;
        },
        close() {
            this.$emit("update:show", false);
        },
        hanldConfirm() {
            this.$emit("confirm", this.value[0]);
            this.close()
        },
    }
}
</script>

<style lang="scss" scoped>
.content {
    padding: 0 38rpx;
}

.header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    height: 113rpx;
    align-items: center;
    border-bottom: 1rpx solid #e6e6e6;

    text:first-child {
        font-size: 31rpx;
        color: #666666;
    }

    text:last-child {
        font-size: 31rpx;
        color: #1F1F1F;
    }

    view {
        font-size: 35rpx;
        font-weight: bold;
        color: #1F1F1F;
    }
}

.pickerView {
    height: 550rpx;
    padding: 100rpx 0;

    .picker {
        background-color: #fff;
        width: 100%;
        height: 247rpx;
    }
}
</style>
<style scoped>
/deep/ .column {
    font-size: 31rpx;
    color: #000;
    text-align: center;
    line-height: 96rpx;
}

/deep/ .indicator::after {
    border-bottom: 0 !important;
}

/deep/ .indicator::before {
    border-top: 0 !important;
}

/deep/ .column .indicator {
    width: 100% !important;
    border-radius: 48rpx;
    overflow: hidden;
    background-color: #F3F3F4;
    opacity: 0.6;
    height: 96rpx;
}
.picker /deep/.indicator {
    color: #1F1F1F;
}
</style>