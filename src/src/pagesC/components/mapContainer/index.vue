<template>
  <view
    class="container"
    :style="{
      width: '750rpx',
      height: containerHeight + 'rpx',
    }"
  >
    <!-- #ifdef H5 -->
    <div id="container" class="map-box"></div>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <map
      id="myMap"
      :style="{
        width: '750rpx',
        height: containerHeight + 'rpx',
      }"
      enable-scroll
      enable-zoom
      :enable-rotate="false"
      :markers="markers"
      collision="marker"
      collisionRelation="together"
      @markertap="markertap"
    >
      <!--  :longitude="longitude"
      :latitude="latitude" -->
    </map>
    <!-- #endif -->

    <view class="refresh-bar" v-if="isShowRefresh">
      <view style="display: flex; align-items: center"
        >骑士当前距你<view style="color: red">{{ distance }}</view></view
      >
      <image
        @click="handleRefresh"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/refresh.png"
        mode="scaleToFill"
      />
    </view>
    <view v-else class="refresh-tag">
      <image
        @click="handleRefresh"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/refresh.png"
        mode="scaleToFill"
      />
    </view>
    <view
      class="back"
      :style="{ top: statusBarHeight, height: navBarHeight }"
      @click="goBack"
    >
      <image
        class="back-icon"
        mode="aspectFit"
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/index/back-black-tag.png"
      />
    </view>
  </view>
</template>

<script>
// #ifdef H5
import AMapLoader from "@amap/amap-jsapi-loader";
let AMapConfig = null;
// #endif

export default {
  name: "",
  components: {},
  props: {
    containerHeight: {
      type: Number,
      default: 618,
    },
    longitude: {
      type: Number,
      default: 122,
    },
    latitude: {
      type: Number,
      default: 30.28,
    },
    orderStatus: {
      type: Number,
      default: 0,
    },
    isShowRefresh: {
      type: Boolean,
      default: true,
    },
    markers: {
      type: Array,
      default: () => {
        return [];
      },
    },
    distance: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      //   points: [],
      statusBarHeight: "",
      navHeight: "",
      navBarHeight: "",
      //#ifdef H5
      mapContent: null,
      // #endif

      list: [
        {
          height: 30.871794871794872,
          iconPath:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/mylocation.png",
          id: 1,
          latitude: "31.2290070",
          longitude: "121.4568040",
          title: "我的",
          width: 30.871794871794872,
          zIndex: 1,
        },

        {
          height: 41.8974358974359,
          iconPath:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/store.png",
          id: 2,
          latitude: "31.2288190",
          longitude: "121.4563850",
          title: "店铺",
          width: 44.1025641025641,
          zIndex: 2,
        },
        {
          height: 114.66666666666667,
          iconPath:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/in-store-right.png",
          id: 3,
          latitude: "31.2288190",
          longitude: "121.4563850",
          title: "骑手",
          width: 191.84615384615387,
          zIndex: 999,
        },
      ],
    };
  },
  computed: {
    points() {
      return this.markers.map((i) => {
        return {
          longitude: i.longitude,
          latitude: i.latitude,
        };
      });
    },
  },
  watch: {
    markers: {
      handler(newMarkers) {
        // #ifdef H5
        this.updateMarkers(newMarkers);
        // #endif
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + "px";
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    this._mapContext = uni.createMapContext("myMap", this);
    console.log("map实例", this._mapContext);
    // #endif
    // #ifdef H5
    this.navHeight = getApp().globalData.h5NavBarFullHeight + "px";
    this.navBarHeight = getApp().globalData.h5NavBarHeight + "px";
    this.statusBarHeight = getApp().globalData.h5StatusBarHeight + "px";
    this.initMap();
    // #endif
  },
  methods: {
    handleRefresh() {
      this.$emit("refreshMarkers");
    },
    // 返回上一页的逻辑
    goBack() {
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        fail: (e) => {
          console.log("result---------fail");
          uni.switchTab({
            url: "/pages/mall/index",
          });
        },
      });
      // #endif

      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },

    // #ifdef MP-WEIXIN
    //  添加标记点
    addMarkers() {
      const make = this.markers;
      console.log(make);
      this._mapContext.addMarkers({
        make,
        clear: true, //是否先清空地图上所有 marker
        fail(err) {
          console.log("err", err);
        },
        complete(res) {
          console.log("addMarkers", res);
        },
      });
    },
    // 点击标记点
    markertap(value) {
      console.log(value, "点击标记点");
    },
    cluster() {
      console.log("地图实例", this._mapContext, this.markers);
      //   缩放视野展示所有经纬度;
      this._mapContext.includePoints({
        points: this.points,
        padding: [150, 100, 40, 100],
        complete(res) {
          console.log("includePoints", res);
        },
      });
    },
    // #endif
    // #ifdef H5
    initMap() {
      console.log("执行了");
      window._AMapSecurityConfig = {
        securityJsCode: "98e6e2e80f392b259d7e02d877615ab1",
      };
      console.log("initMap initMap");
      return AMapLoader.load({
        key: "be710d1cedc69627f23ccb85df0c938a",
        version: "1.4.15",
        plugins: ["AMap.PlaceSearch", "AMap.Geocoder"],
        // Loca: {
        //   version: "2.0",
        // },
      })
        .then(async (AMap) => {
          AMapConfig = AMap;
          if (this.list.length < 2) {
            return;
          }

          try {
            const zoom = 15;
            const mapOptions = {
              viewMode: "3D",
              center: [this.list[0].longitude, this.list[0].latitude],
              zoom,
              animateEnable: true,
            };
            this.mapContent = new AMap.Map("container", mapOptions);
            this.updateMarkers(this.markers);
            console.log("this.mapContent", this.mapContent);
          } catch (err) {
            console.log("计算距离或创建地图时出错: ", err);
          }
        })
        .catch((e) => {
          console.log("map Err:", e);
        });
    },

    updateMarkers(markers) {
      console.log("markers", this.markers);
      console.log("list", this.list);

      if (!this.mapContent || !Array.isArray(markers) || markers.length === 0) {
        return;
      }

      // 获取地图的当前缩放级别
      const zoomLevel = this.mapContent.getZoom();

      // 清除现有标记点
      this.mapContent.clearMap();
      // 创建 OverlayGroup
      const markerGroup = new AMap.OverlayGroup();
      markers.forEach((item) => {
        // 点标记显示内容，HTML要素字符串
        const widthRound = Math.round(item.width);
        const heightRound = Math.round(item.height);
        // 计算图片的缩放比例
        const baseWidth = Math.round(item.width);
        const baseHeight = Math.round(item.height);
        const scaleFactor = 1 / (zoomLevel / 15); // 假设缩放级别 15 为基准

        // 动态计算图片的宽度和高度
        let width = Math.round(baseWidth * scaleFactor);
        let height = Math.round(baseHeight * scaleFactor);

        // 如果宽度大于 100，则将宽度和高度调整为原始尺寸的三分之二
        if (width > 100) {
          width = Math.round(baseWidth * (2 / 3));
          height = Math.round(baseHeight * (2 / 3));
        }
        const markerContent =
          `<div class="custom-content-marker" style="width: ${width}px; height: ${height}px;">` +
          `<img src="${item.iconPath}" style="width: 100%; height: 100%; object-fit: cover;"/></div>`;
        const position = new AMap.LngLat(item.longitude, item.latitude); // Marker 经纬度
        // 动态计算 offset，以图片底部中心点为锚点
        const offset = new AMap.Pixel(-width / 2, -height / 2);
        const marker = new AMap.Marker({
          position: position,
          content: markerContent,
          offset: offset,
        });

        markerGroup.addOverlay(marker);
      });

      // 将 OverlayGroup 添加到地图
      this.mapContent.add(markerGroup);

      // 调用 setFitView 方法
      this.mapContent.setFitView(markerGroup);
      console.log("更新后的标记点", this.mapContent);
    },
    resetMarkers() {
      if (this.mapContent) {
        this.mapContent.clearMap();
        this.updateMarkers(this.markers);
        console.log("标记点已重置");
      }
    },
    // #endif
  },
};
</script>

<style scoped lang="scss">
.container {
  position: relative;
  .map-box {
    height: 100%;
  }
  .back {
    position: absolute;
    left: 20rpx;
    top: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .back-icon {
      width: 42rpx;
      height: 42rpx;
    }
  }
  .refresh-bar {
    position: absolute;
    height: 58rpx;
    width: 719rpx;
    bottom: 0rpx;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 29rpx;
    padding-right: 15rpx;
    box-sizing: border-box;
    font-size: 27rpx;
    z-index: 1;
    image {
      height: 42rpx;
      width: 42rpx;
      object-fit: cover;
    }
  }
  .refresh-tag {
    position: absolute;
    height: 58rpx;
    width: 58rpx;
    bottom: 0rpx;
    right: 15rpx;
    border-radius: 18rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      height: 42rpx;
      width: 42rpx;
      object-fit: cover;
    }
  }
}
</style>
