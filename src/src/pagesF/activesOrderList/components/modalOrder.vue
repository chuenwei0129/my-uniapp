
<template>
    <view>
      <u-popup :show="isOpen" mode="center" bgColor="transparent" @close="close" @touchmove.stop.prevent>
          <view class="center-box">
						<view class="content-warn">温馨提示</view>
						<view class="content-desc">{{content}}</view>
						<view class="btn-group">
								<view class="modal-cancel" v-if="!ifCancel" v-on:click="close">{{cancelText}}</view>
								<view class="modal-sure" :style="!ifCancel?'':'width:100%'" v-on:click="handleClose">{{sureText}}</view>
						</view>
          </view>     
      </u-popup>
    </view>
  </template>
  
  <script>
   
  export default {
    name: 'invite',
   
    props: {
      isOpen: {
         type: Boolean,
         default: false,
      },
      content: {
         type: String,
         default: '',
      },
      cancelText: {
         type: String,
         default: '取消',
      },
			ifCancel: {
				type: Boolean,
        default: false,
			},
      sureText: {
         type: String,
         default: '确定',
      }
    },
   
    data() {
      return {}
    },
    methods: {
      close() {
        this.$emit("update:isOpen", false);
        this.$emit("close", false);
      },
      handleClose() {
        this.$emit("update:isOpen", false);
        this.$emit("close", false);
        this.$emit("sureFn")
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
		.center-box {
			box-sizing: border-box;
			width: 577rpx;
			// height: 348rpx;
			background-color: #fff;
			border-radius: 38rpx;
			padding: 0 38rpx;
			.content-warn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 46rpx;
				margin-bottom: 52rpx;
			}
			.content-desc {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 50rpx;
				margin-bottom: 63rpx;
				font-size: 27rpx;
				color: #666666;
			}
			.btn-group {
				display: flex;
				padding: 27rpx 0;
				border-top: 1rpx solid #e6e6e6;
				view {
					width: 50%;
					text-align: center;
					font-size: 36rpx;
				}
				.modal-cancel {
					border-right: 1rpx solid #e6e6e6;
					color: #25252a;
				}
				.modal-sure {
					color: #ffb400;
				}
			}
		}

  </style>
  