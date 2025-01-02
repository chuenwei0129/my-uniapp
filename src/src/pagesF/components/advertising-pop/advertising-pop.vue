<template>
    <view class="popup" v-if="showStatus">
        <view class="popup-bg" @click="closePopup"></view>
        <view class="popup-content">
            <image class="popup-img" mode="widthFix" :src="info[0].content.material.url"
                @click="setRouter(info[0].content.route.path)">
            </image>
            <!-- <image class="popup-btn" src="/static/images/btns/popClose.png" @click="closePopup"> </image> -->
        </view>
    </view>
</template>

<script>

export default {

    props: {
        showStatus: {
            type: Boolean,
            required: false,
            default: true
        },

        info: {
            type: Object | null,
        }
    },
    methods: {
        closePopup() {
            console.log("closePop")
            this.$emit("closePop");
        },

        setRouter(url) {
            this.$emit("closePop");
            uni.navigateTo({
                url
            });
        },
    }

}
</script>



<style lang="scss" scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}

.popup-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.popup-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

}

.popup-img {
    width: 620rpx;
    //   object-fit:contain;
    //   object-fit: cover;
}

.popup-btn {
    width: 64rpx;
    height: 64rpx;

}
</style>