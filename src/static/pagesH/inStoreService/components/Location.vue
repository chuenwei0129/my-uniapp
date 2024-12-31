<template>
  <view
    class="content"
    :style="{ paddingTop: statusBarHeight }"
  >
    <!-- 标题 -->
    <view>
      <view
        class="status-bar"
        :style="{ height: statusBarHeight }"
      />
      <view class="header-box">
        <view
          class="fixed-header"
          :style="{ paddingTop: statusBarHeight }"
        >
          <view class="left">
            <view
              class="iconfont icon-back"
              @click="goBack"
            />
          </view>
          <view class="title">
            选择城市
          </view>
          <view class="right" />
        </view>
      </view>

      <view class="city-list-box">
        <u-index-list
          :index-list="indexList"
          custom-nav-height="90"
          :sticky="true"
          inactive-color="#000000"
          active-color="#2DCE80"
        >
          <u-index-item>
            <u-index-anchor
              v-show="false"
              :text="indexList[0]"
            />
            <view class="current-position-item">
              <view class="position-left">
                <view class="block">
                  <view class="iconfont icon-address" />
                  <view
                    v-if="!isPosition"
                    class="fail-txt m-r-6"
                    @click="openPositionBtn"
                  >
                    <text>定位失败，请</text>
                    <text>开启定位</text>
                  </view>
                  <view
                    v-else
                    class="fail-txt m-r-6 area-txt"
                  >
                    当前位置: {{ positionInfo.province + positionInfo.cityName + positionInfo.address }}
                  </view>
                </view>
              </view>
              <view class="position-right">
                <view class="block refresh-btn">
                  <view class="iconfont icon-address1" />
                  <view class="refresh-txt m-r-6">
                    重新定位
                  </view>
                </view>
              </view>
            </view>

            <view
              v-if="isPosition"
              class="city-tip"
            >
              附近门店城市
            </view>
            <view
              v-if="isPosition"
              class="city-box"
            >
              <view
                v-for="(item,index) in cityStoreList"
                :key="index"
                class="city-txt"
              >
                {{ item.cityName }}
              </view>
            </view>

            <view class="city-tip">
              以下城市开通了宠胖胖到店服务项目
            </view>
          </u-index-item>

          <template v-for="(item, index) in itemArr">
            <!-- #ifdef APP-NVUE -->
            <u-index-anchor :text="indexList[index + 1]" />
            <!-- #endif -->

            <u-index-item>
              <!-- #ifndef APP-NVUE -->
              <u-index-anchor :text="indexList[index + 1]" />
              <!-- #endif -->
              <view
                v-for="(cell, index) in item"
                class="list-cell"
              >
                {{ cell.cityName }}
              </view>
            </u-index-item>
          </template>
        </u-index-list>
      </view>
    </view>

    <!-- 选择城市弹框 -->
    <u-popup
      :show="isOpen"
      mode="bottom"
      :round="20"
      closeable
      @close="closePopup"
      @touchmove.stop.prevent
    >
      <view class="popup-box">
        <view class="popup-title">
          选择城市
        </view>
        <view class="popup-info">
          <text>当前所在城市暂未开设宠胖胖门店，已自动为您匹配最近城市</text>
          <view class="iconfont icon-a-iconlineCity" />
          <text class="city-name">
            南京市
          </text>
          <text>，您可点击“切换城市”按钮进行目标城市修改</text>
        </view>

        <view class="popup-footer">
          <view
            class="foot-btn toggle-btn"
            @click="closePopup"
          >
            切换城市
          </view>
          <view class="foot-btn select-btn">
            选择南京市
          </view>
        </view>
      </view>
    </u-popup>

    <InAppTips />
  </view>
</template>
<script>
	import {
		shopByCity,
		hasShopCityList
	} from '@/api/selectPositionCity'
	import FixedNav from '@/components/fixedNav/index.vue'
	import InAppTips from './components/inAppTips/index.vue'
	export default {
		components: {
			FixedNav
		},
		data () {
			return {
				statusBarHeight: '',
				isHeaderShow: false,
				tabVal: '未评价',
				orderType: 1,
				waitCommentNum: 0,

				indexList: [],
				itemArr: [],
				isOpen: true,
				isPosition: true, // 是否开启定位, 是：true, 否： false
				positionInfo: {
					province: '',
					cityName: '',
					address: '',
					cityCode: '',
					county: '',
					lat: '', // 纬度
					lon: '', // 经度
				}, // 位置信息
				nearStoreList: [], // 附近门店
				cityStoreList: [],
				appLocationTipShow: true, //app内定位权限有方法&&未开启定位
			}
		},
		computed: {
			isNative () {
				return this.$dsBridge && this.$dsBridge.call('getToken', 'getToken')
			},
		},
		onLoad (options) {

		},
		mounted () {
			this.statusBarHeight = this.isNative ? (getApp().globalData.h5StatusBarHeight || 45) + 'px' : (getApp()
				.globalData.statusBarHeight || 45) + 'px'
			this.getHasShopCityList()
			this.getShopByCity()
		},

		methods: {
			// 获取到店服务城市列表
			async getHasShopCityList () {
				try {
					const param = {
						bizType: 3, // 业务类型，3：到店服务
						// lng: isPosition ? this.positionInfo.lon : 118.7338,
						// lat: isPosition ? this.positionInfo.lat : 31.9840
					}
					const res = await hasShopCityList(param)
					this.cityStoreList = res.data.data || []
					this.itemArr = []
					if (this.cityStoreList.length > 0) {
						this.indexList = this.cityStoreList.map((item) => item.cityPY)
						this.indexList.forEach((m, n) => {
							const arr = []
							this.cityStoreList.forEach((item) => {
								if (m == item.cityPY) {
									arr.push(item)
								}
							})
							this.itemArr.push(arr)
						})
						this.indexList.unshift('#')
					}
				} catch (e) {
					console.error('获取用户收藏数量错误', e)
				}
			},

			// 到店服务 获取当前城市门店
			async getShopByCity () {
				try {
					const param = {
						cityCode: isPosition ? this.positionInfo.cityCode : 3301 , // 城市编码
						bizType: 3 // 业务类型，3：到店服务
					}
					const res = await shopByCity(param)
					console.log(1111, res)
					this.nearStoreList = res.data.data
				} catch (e) {
					console.error('获取用户收藏数量错误', e)
				}
			},

			handleChange (val) {
				if (this.tabVal == val) return
				this.tabVal = val
			},
			goBack () {
				this.isNative ? this.$dsBridge.call('closeCurrentWebview', {}) : uni.navigateBack({
					delta: 1
				})
			},
			
			// 开启定位
			openPositionBtn () {
				this.appLocationTipShow = true
			},

			//打开app系统设置权限
			openAppLocation () {
				this.$dsBridge.call(
					'gotoLocationPermissionSet',
					'gotoLocationPermissionSet'
				)
			},

			// 未开启定位提示
			refreshBtn () {
				uni.showToast({
					icon: 'none',
					title: '您未开启定位，请先开启定位或选择目标城市',
				})
				// uni.showToast({
				//   icon:'none',
				//   title: "定位失败，请重新选择",
				// });
			},

			// 打开弹框
			openPopup () {
				this.isOpen = true
			},

			// 关闭弹框
			closePopup () {
				this.isOpen = false
			},

			// 重新定位 
			refreshPositin () {
				this.$dsBridge.register('locationCallback', this.getAppLoctaion)
				this.getHasShopCityList()
			},

			// 获取位置信息
			getAppLoctaion (data) {
				console.log('再次接收经纬度数据2', data)
				if (typeof data === 'string') {
					data = JSON.parse(data)
				}
				if (typeof data === 'string') {
					data = JSON.parse(data)
				}
				this.positionInfo = data
				this.getShopByCity()
			},
		},
		onReady () {
			// #ifdef H5
			// 判断是否开启定义
			// this.isPosition = this.$dsBridge.call(
			// 	"checkNotificationsPermission",
			// 	"checkNotificationsPermission"
			// );
			if (!this.isPosition) {
				this.refreshBtn()
			} else {
				this.$dsBridge.register('locationCallback', this.getAppLoctaion)
			}
			// #endif
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100vw;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-left: 28rpx;
		padding-right: 28rpx;
		// overflow: hidden;
		background-color: #fff;
	}

	.header-box {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		padding: 0 28rpx;
		background-color: #ffffff;
	}

	.fixed-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 31rpx;
		color: #333333;
		line-height: 70rpx;
		padding: 21rpx 23rpx;
		text-align: center;
		position: relative;

		.icon-closeMark {
			position: absolute;
			left: 0;
			bottom: 21rpx;
			font-size: 42rpx;
			color: #1F1F1F;
		}
	}

	.current-position-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 18rpx;
		padding: 26rpx 28rpx;
		width: 100%;
		border-radius: 15rpx;
		background: #F7F8FC;

		.block {
			display: flex;
			width: 100%;
		}

		.icon-address {
			font-size: 34rpx;
			color: #FFBB00;
		}

		.icon-address1 {
			font-size: 30rpx;
			color: #007AFF;
		}

		.m-r-6 {
			margin-left: 6rpx;
		}

		.fail-txt {
			font-size: 26rpx;
			color: #1F1F1F;

			text:nth-of-type(2) {
				color: #007AFF;
			}
		}

		.area-txt {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.refresh-btn {
			display: flex;
			justify-content: flex-end;
		}

		.refresh-txt {
			color: #007AFF;
		}

		.position-left {
			display: flex;
			width: calc(100% - 186rpx);
			font-size: 26rpx;
		}

		.position-right {
			width: 150rpx;
			font-size: 23rpx;
		}
	}

	.city-tip {
		padding: 24rpx 0 12rpx;
		font-size: 23rpx;
		color: #999999;
	}

	.city-box {
		display: flex;
		flex-wrap: wrap;

		.city-txt {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 16rpx;
			margin-bottom: 16rpx;
			width: 215rpx;
			height: 65rpx;
			font-size: 25rpx;
			color: #1F1F1F;
			border-radius: 10rpx;
			background: #F7F8FC;
		}
	}

	.popup-box {
		height: 460rpx;

		.popup-title {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 115rpx;
			font-size: 35rpx;
			color: #1F1F1F;
		}

		.popup-info {
			margin-top: 32rpx;
			padding: 0 38rpx;
			font-size: 27rpx;
			color: #1F1F1F;

			.icon-a-iconlineCity {
				display: inline-block;
			}

			.city-name {
				font-weight: 560;
			}
		}

		.popup-footer {
			display: flex;
			justify-content: space-between;
			padding: 48rpx 38rpx 0;

			.foot-btn {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 31rpx;
				color: #1F1F1F;
			}

			.toggle-btn {
				width: 323rpx;
				height: 85rpx;
				border-radius: 42rpx;
				border: 2rpx solid #E6E6E6;
			}

			.select-btn {
				width: 323rpx;
				height: 85rpx;
				background: #FEE900;
				border-radius: 40rpx;
			}
		}
	}

	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		overflow: hidden;
		font-size: 26rpx;
		color: #1F1F1F;
		height: 62rpx;
		line-height: 62rpx;
		background-color: #fff;
	}

	::v-deep .u-index-anchor {
		background-color: #ffffff !important;
		border: none !important;
		padding-left: 0 !important;
		top: -2rpx;
	}
</style>
