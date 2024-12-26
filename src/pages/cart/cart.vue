<template>
	<view>
		<!-- 顶部导航栏 -->
		<u-navbar title="" bgColor="#40ae36">
			<template #left>
				<view class="left">
					<view>
						<u-icon name="map" color="#fff" size="20px"></u-icon>
					</view>
					<view style="margin-left: 16rpx;margin-right: 8rpx;">海淀区中关村大厦</view>
					<view>
						<u-icon name="arrow-down-fill" color="#fff" size="14px" :customStyle="{transform:'scale(0.6)'}">
						</u-icon>
					</view>
				</view>
			</template>
			<template #right>
				<view class="right">
					<view>
						<u-icon name="scan" color="#fff" size="25px"></u-icon>
					</view>
					<view style="margin-left: 15rpx;">
						<u-icon name="chat" color="#fff" size="25px"></u-icon>
					</view>
				</view>
			</template>
		</u-navbar>
		<!-- 金刚区 -->
		<view class="vajra">
			<u-row justify="space-between" gutter="10">
				<u-col span="2.4">
					<view class="item">
						<view class="img">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="text">水果蔬菜</view>
					</view>
				</u-col>
				<u-col span="2.4">
					<view class="item">
						<view class="img">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="text">肉禽蛋品</view>
					</view>
				</u-col>
				<u-col span="2.4">
					<view class="item">
						<view class="img">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="text">海鲜水产</view>
					</view>
				</u-col>
				<u-col span="2.4">
					<view class="item">
						<view class="img">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="text">速食冷冻</view>
					</view>
				</u-col>
				<u-col span="2.4">
					<view class="item">
						<view class="img">
							<image src="../../static/logo.png" mode=""></image>
						</view>
						<view class="text">粮油米面</view>
					</view>
				</u-col>
			</u-row>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list1: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png'
				]
			}
		},
		onLoad() {

		},
		methods: {
			onSearch() {
				console.log('跳转');
			}
		}
	}
</script>

<style lang="scss">
	.left {
		display: flex;
		align-items: center;
		color: #fff;
		font-size: 30rpx;
	}

	.right {
		display: flex;
	}

	.search {
		margin-top: 44px;
		padding: 15rpx 26rpx;
	}

	.swiper {
		padding: 10rpx 25rpx 25rpx;
	}
	.vajra {
		padding:10rpx 25rpx;
	}
	
	.item {
	        height:163rpx;
	        border-radius: 4px;
			display:flex;
			flex-direction: column;
			align-items: center;
			.img {
				height:108rpx;
				width: 108rpx;
				background:red;
				border-radius: 50%;
				margin-bottom:7rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.text {
				font-size: 24rpx;
				color: #666666;
			}
	    }
</style>
