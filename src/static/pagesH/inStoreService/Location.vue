<template>
  <view>
    <view
      class="location-container"
    >
      <view
        class="cur-location"
        @click="handle2AddressPage"
      >
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/loaction-icon.png"
          style="width: 40rpx; height: 40rpx"
        />
        <view
          v-if="curAddress"
          class="location-name"
        >
          {{ curAddress }}
        </view>
        <view
          v-else
          class="location-name"
        >
          {{ noLocalTips }}
        </view>
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index2/bottom-arrow.png"
          style="width: 20rpx; height: 20rpx"
        />
      </view>
    </view>
    <!-- v-if="!myOpenSetting" -->
    <view
      v-if="false"
      class="location-fail"
    >
      <view class="location-desc">
        <view>打开位置权限，查看附近的内容</view>
      </view>
      <view
        class="location-button"
        @tap="$u.debounce(handleOpenSetting, 500)"
      >
        开启
      </view>
    </view>
  </view>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getAddressList, searchUserLocation } from '@/api/base'
import { checkLocationAuth, getAuthLocation } from '@/utils/location'

export default {
  data () {
    return {
      show: false,
      curAddress: '',
      location: {
        // 测试用
        lon: 119.99933512369792,
        lat: 30.28137261284722,
      },
      addressList: [],
      refresh: '',
      noLocalTips: '正在获取定位',
      noStoreList: null,
      isMainPageOpenPosition: false, // 是否是 首页 打开位置权限
      isClickOpenSetting: false,
      openLocationFlag: false,
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      selectedAddress: (state) => state.selectedAddress,
      openSetting: (state) => state.openSetting,
      locFailMsg: (state) => state.locFailMsg,
    }),
    myOpenSetting: {
      get () {
        return (
          this.openSetting || uni.getStorageSync('medicine_openSetting_first')
        )
      },
      set () {},
    },
  },
  mounted () {
    // 初始化时根据定位拿门店
    uni.$on('noStoreList', (res) => {
      this.noStoreList = res
    })
    this.getMyAddress()
  },
  methods: {
    ...mapMutations([
      'setOpenSetting',
      'setSelectedAddress',
      'setLocationFailMsg',
    ]),
    async handleOpenSetting () {
      //获取当前定位
      this.getAddressInfo()
    },
    async getAddressInfo () {
      const that = this
      try {
        const { latitude, longitude } = await getAuthLocation()
        this.myOpenSetting = true
        this.isClickOpenSetting = true
        this.setOpenSetting(true)
        uni.setStorageSync('medicine_openSetting_first', true)
        this.searchLocation(
          {
            lon: longitude,
            lat: latitude,
          },
          true,
          true
        )
        // await this.successLocation();
      } catch (e) {
        console.log('获取位置失败首页', that.locFailMsg)
        uni.showModal({
          title: '提示',
          content: '您拒绝了位置的授权，不可使用',
          showCancel: false,
          success: function (res) {
            //打开设置
            uni.openSetting({
              success (res) {
                const userLocation = res.authSetting['scope.userLocation']
                if (userLocation) {
                  // 继续进行授权成功后的操作
                  that.successLocation()
                } else {
                  // 用户拒接授权 给提示
                  // uni.showToast({
                  //   title: "您已拒绝位置授权",
                  //   duration: 2000,
                  // });
                  // that.setLocationFailMsg(true);
                  // that.noLocalTips = "定位失败，手动切换";
                }
              },
            })
          },
        })
      }
    },
    async successLocation () {
      this.setOpenSetting(true)
      uni.setStorageSync('medicine_openSetting_first', true)
      this.myOpenSetting = true
      await this.checkLocation()
      this.$emit(
        'updateOpenSet',
        uni.getStorageSync('medicine_openSetting_first')
      )
    },
    //根据经纬度查取地区
    async searchLocation (data, refresh = true, saveflag) {
      const res = await searchUserLocation({ data })
      console.log('接口返回====>', res.data)
      const { adcode, city, district, province, address } = res.data
      const { lat, lon } = data
      const cityCode = adcode.slice(0, 4) + '00'
      const provinceCode = cityCode.slice(0, 2) + '0000'

      uni.setStorageSync('lon', data.lon)
      uni.setStorageSync('lat', data.lat)
      uni.setStorageSync('province', province)
      uni.setStorageSync('provinceCode', provinceCode)
      uni.setStorageSync('city', city)
      uni.setStorageSync('cityCode', cityCode)
      uni.setStorageSync('district', district)
      uni.setStorageSync('adcode', adcode)
      uni.setStorageSync('currentCity', city)
      uni.setStorageSync('selectedCityCode', cityCode)
      uni.setStorageSync('address', address)
      const _obj = {
        lon: data.lon,
        lat: data.lat,
      }
      const item = Object.assign(res.data, _obj)
      // let item = {
      //   lat: data.lat,
      //   lon: data.lon,
      //   address: address,
      //   cityCode: cityCode,
      //   adcode: adcode,
      //   city: city,
      //   cityName: selectedCityCode,
      // };
      if (saveflag) {
        this.isMainPageOpenPosition = true
        this.openLocationFlag = true
        // 每次从新获取地址时需要把地址信息存到默认定位地址当中
        uni.setStorageSync('addressList', item)
      }

      if (refresh) {
        this.curAddress = address
        uni.setStorageSync('mall_last_search_address_obj', item)
        this.setSelectedAddress(item)
      }
      if (this.isClickOpenSetting) {
        // 在到店服务页面确保经纬度存入缓存中
        this.$emit('openSetting', true)
      }
    },
    // 跳转选择城市页面
    handle2AddressPage () {
      uni.navigateTo({
        url: '/pagesC/mallAddress/index',
        events: {
          resultEvent: async (res) => {
            console.log('当前选择地址：', res.data)
            const { addressName, address, lat, lon } = res.data
            this.curAddress = address
            this.location = {
              lat: lat,
              lon: lon,
            }
            // await this.searchLocation({ ...this.location });
          },
        },
      })
    },
    getMyAddress () {
      const saveAddress = false
      if (this.myOpenSetting) {
        //已开启定位 优先取用户实时位置LBS
        //获取当前定位
        this.getAddressInfo()
      } else {
        let lastSearchAddressObj = this.selectedAddress
        lastSearchAddressObj = uni.getStorageSync(
          'mall_last_search_address_obj'
        )
        // if (!lastSearchAddressObj.lat) {
        //   // 第一次进入时获取缓存的定位地址
        //   lastSearchAddressObj = uni.getStorageSync("addressList");
        //   // 把定位地址信息缓存到选择地址的storage里面
        //   uni.setStorageSync(
        //     "mall_last_search_address_obj",
        //     lastSearchAddressObj
        //   );
        //   saveAddress = true;
        // }
        const { lat, lon, address, city } = lastSearchAddressObj
        if (lat && lon) {
          this.location = { ...lastSearchAddressObj }
          this.curAddress = address || city || ''
          this.searchLocation(
            {
              lon: lon,
              lat: lat,
            },
            false,
            saveAddress
          )
        } else {
          this.checkLocation()
        }
      }
    },
    async checkLocation () {
      // this.opensetting = uni.getStorageSync("medicine_openSetting_first");
      console.log('开启了', this.myOpenSetting)
      if (this.myOpenSetting) {
        console.log('location-nav==打开了隐私定位')
        this.getAddressInfo()
      } else {
        // 文案提示： 定位失败，手动切换 - 去登录重新
        this.noLocalTips = '定位失败，手动切换'
        this.curAddress = ''
        console.log('location-nav==未打开隐私定位')
        return
      }
    },
  },
  watch: {
    selectedAddress: {
      immediate: true,
      handler (newValue, oldValue) {
        console.log('地址切换', newValue.lat)
        let item = {}

        if (this.myOpenSetting) {
          //开启定位情况下 等获取LBS结束后再取值
          if (newValue.lat && newValue.lon) {
            item = uni.getStorageSync('mall_last_search_address_obj')
            this.curAddress = item.address
          }
        } else {
          item = uni.getStorageSync('mall_last_search_address_obj')
          this.curAddress = item.address
        }
        // 若是在首页开启定位，则重新调取商品接口
        if (this.isMainPageOpenPosition) {
          item.type = 'mainPageOpenPosition'
          this.isMainPageOpenPosition = false // 防止重复调用
        }
        if (item.lat && item.lon) {
          this.$emit('changeAddress', item)
        }
      },
    },
  },
}
</script>
<style scoped lang="scss">
.location-container {
  position: relative;
  z-index: 1;
  height: 80rpx;
  line-height: 80rpx;
  display: flex;
  position: relative;
  margin-top: 4rpx;

  .cur-location {
    line-height: 80rpx;
    height: 80rpx;
    width: calc(100% - 154rpx);
    margin-left: 28.85rpx;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;

    image {
      width: 35rpx;
      height: 35rpx;
    }

    .location-name {
      max-width: 380rpx;
      height: 40rpx;
      font-size: 31rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #1f1f1f;
      text-indent: 10rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 38rpx;
    }

    .location-shop-name {
      max-width: 150rpx;
      // height: 28rpx;
      font-size: 19rpx;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #1f1f1f;
      line-height: 27rpx;
      margin-left: 10rpx;
      margin-right: 10rpx;
      border-radius: 4rpx;
      padding: 0 4rpx;
      height: 31rpx;
      // margin-top: 6rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border: 2rpx solid #333333;
    }
  }
}

.location-fail {
  position: relative;
  z-index: 1;
  height: 77rpx;
  font-size: 27rpx;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16rpx;
  padding-right: 25rpx;
  // margin-bottom: 20rpx;
  background-color: rgba(254, 36, 66, 1);

  .location-desc {
    color: #fff;
    display: flex;
    align-items: center;

    image {
      width: 43rpx;
      height: 43rpx;
      margin-right: 16rpx;
    }
  }

  .location-button {
    font-weight: 500;
    color: rgba(254, 36, 66, 1);
    width: 100rpx;
    height: 50rpx;
    line-height: 50rpx;
    background: #fff;
    border-radius: 25rpx;
    text-align: center;
  }
}
</style>
