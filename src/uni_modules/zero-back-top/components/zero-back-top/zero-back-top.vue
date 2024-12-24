<template>
	<view v-if="show">
		<view class="zero-back-top"  :class="[fadeOut?'fade-out':'',blurEffect?'blur-effect':'',shadow?'shadow':'']" 
		:style="{
		'--duration':`${duration+100}ms`,
		  width: `${iconSize}rpx`,
		  height: `${iconSize}rpx`,
		  right: `${right}rpx`,
		  bottom: `${bottom}rpx`,
		  <!-- #ifdef H5 -->
		   bottom: `${bottom+60}rpx`,
		  <!-- #endif -->
		  background:backgroundColor,
		  zIndex: zIndex
		}" @click="backToTop">
		<template v-if="$slots.default">
		<slot name="default"></slot>
		</template>
		<template v-else>
		<text class="icon iconbacktop" :class="['backtop-'+iconType]" :style="{
			color:color,
			fontSize:`${iconSize*0.7}rpx`,
			lineHeight:`${iconSize}rpx`,
			}">
		</text>
		</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: "zero-back-top",
		emits: ["setScrollTop"],
		props: {
			// 需要在使用页面 onPageScroll 传进来
			scrollTop: {
				type: Number,
				default: 0
			},
			iconType: {
				type: String,
				default: 'rocket',
			},
			// 距离顶部 xx 触发
			top: {
				type: Number,
				default: 300
			},
			// 屏幕滚动时间
			duration: {
				type: Number,
				default: 300
			},
			// z-index
			zIndex: {
				type: Number,
				default: 99
			},
			// 图标大小
			iconSize: {
				type: Number,
				default: 80
			},
			// 距离右边的距离
			right: {
				type: Number,
				default: 50
			},
			// 距离底部的距离
			bottom: {
				type: Number,
				default: 120
			},
			// 图标颜色
			color: {
				type: String,
				default: '#007aff',
			},
			// 图标背景色
			backgroundColor: {
				type: String,
				default: '#ffffff80',
			},
			blurEffect:{
				type:Boolean,
				default:true
			},
			shadow:{
				type:Boolean,
				default:true
			},
		},
		data() {
			return {
				fadeOut: false,
			};
		},
		computed: {
			show() {
				let top
				// 如果是rpx，转为px
				if (/rpx$/.test(this.top)) {
					top = uni.rpx2px(parseInt(this.top))
				} else {
					// 如果px，通过parseInt获取其数值部分
					top = parseInt(this.top)
				}
				return this.scrollTop > top
			},
			// textIcon() {
			// 	let obj = {
			// 		'rocket': & #xe7d9;
			// 	}
			// 	return obj[this.iconType]
			// }
		},
		methods: {
			backToTop() {
				this.fadeOut = true
				uni.pageScrollTo({
					scrollTop: 0,
					duration: this.duration
				});
				let timer = null
				timer = setTimeout(() => {
					this.fadeOut = false
					timer = null
				}, this.duration);

				this.$emit('setScrollTop')
			}
		}
	}
</script>

<style lang="scss">
	.backtop-arrow:before {
		content: "\e844";
	}

	.backtop-rocket-line:before {
		content: "\e79e";
	}

	.backtop-rocket:before {
		content: "\e633";
	}

	.backtop-arrow-text:before {
		content: "\e660";
	}

	.backtop-arrow-line:before {
		content: "\e62b";
	}

	.backtop-triangle-text:before {
		content: "\e649";
	}

	@font-face {
		font-family: iconbacktop;
		src: url('../../static/zerobacktop.ttf') format('truetype');
	}

	.iconbacktop {
		font-family: iconbacktop;
	}

	.zero-back-top {
		box-sizing: border-box;
		position: fixed;
		overflow: hidden;
		border-radius: 50%;
		animation: fadeIn 0.3s linear both;
		text-align: center;
		animation-duration: var(--duration);
	}
	.blur-effect{
		backdrop-filter: blur(10rpx);//毛玻璃属性
	}
	.shadow{
		box-shadow: 0 0 20rpx rgba(#ced2d2, 0.6);
	}
	.fade-out {
		animation: fadeOut 0.3s linear both;
	}
	@keyframes fadeIn {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: scale(0.5);
		}
	}
</style>