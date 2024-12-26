<template>
  <view class="coupon">
    <swiper
      :indicator-dots="couponList.length > 1"
      :autoplay="true"
      :interval="3000"
      :circular="true"
      :current="current"
      class="coupon__swiper"
      indicator-active-color="#FF2342"
      indicator-color="#ddd"
      @change="onSwiperChange"
    >
      <swiper-item
        v-for="(item, index) in couponList"
        :key="index"
      >
        <view class="coupon__card">
          <view class="coupon__header">
            <text class="coupon__header__left">
              待使用
            </text>
            <view
              v-if="couponList.length >= 5"
              class="coupon__header__right"
              @click="viewMore"
            >
              <text>查看更多</text>
              <u-icon
                name="play-right-fill"
                size="14"
              />
            </view>
          </view>
          <view class="coupon__content">
            <image
              :src="item.imageUrl"
              class="coupon__content__image"
            />

            <!-- 中间三行文字 -->
            <view class="coupon__content__info">
              <view class="coupon__content__title">
                {{ item.itemName }}
              </view>
              <view class="coupon__content__expiry-date">
                {{ item.verifyValidEndTime }}
              </view>
              <view class="coupon__content__location">
                <u-icon
                  name="map"
                  size="14"
                />
                {{ item.shopName }}
              </view>
            </view>

            <!-- 右侧按钮 -->
            <view class="coupon__content__action">
              <button
                class="coupon__content__button"
                @click="handleClick(item)"
              >
                查看券码
              </button>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  props: {
    couponList: {
      type: Array,
      default: () => [ {
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=0000FF&fg=FFFFFF',
          itemName: '狗狗犬类精致洗护',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.8.30 到期',
          shopName: '南京雨花万象天地店',
        },
        {
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=00FF00&fg=FFFFFF',
          itemName: '猫咪美容护理套餐',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.9.15 到期',
          shopName: '上海浦东金茂大厦店',
        },
        {
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=FF0000&fg=FFFFFF',
          itemName: '宠物寄养服务',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.10.1 到期',
          shopName: '北京朝阳大悦城店',
        },
        {
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=FFFF00&fg=FFFFFF',
          itemName: '宠物食品大礼包',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.11.20 到期',
          shopName: '广州天河城店',
        },
        {
          imageUrl: 'http://iph.href.lu/800x600?text=Hello%20World&bg=00FFFF&fg=FFFFFF',
          itemName: '宠物玩具套装',
          status: 5,
          statusName: '待核销',
          verifyValidEndTime: '2024.12.25 到期',
          shopName: '深圳南山海岸城店',
        },],
    },
  },
  data () {
    return {
      current: 0,
    }
  },

  methods: {
    handleClick (coupon) {
      uni.showToast({
        title: `查看券码: ${coupon.itemName}`,
        icon: 'success',
      })
    },
    viewMore () {
      uni.showToast({
        title: '查看更多优惠券',
        icon: 'none',
      })
    },
    onSwiperChange (event) {
      this.current = event.detail.current
      console.log('当前索引:', this.current)
    },
  },
}
</script>

<style scoped>
/* 整体样式 */
.coupon {
  padding: 10px;
  background-color: #F6F8FC;
  border-radius: 10px;
}

/* 标题栏样式 */
.coupon__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.coupon__header__left {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.coupon__header__right {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #007aff;
  cursor: pointer;
}

/* 轮播容器样式 */
.coupon__swiper {
  height: 200px;
}

/* Swiper-item 样式 */
.coupon__swiper /deep/ .swiper-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.coupon__card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%; /* 固定宽度 */
  height: 150px; /* 固定高度 */
  margin: 0 auto; /* 水平居中 */
}

/* 内容区域样式 */
.coupon__content {
  display: flex;
  align-items: center;
  flex: 1;
}

/* 图片样式 */
.coupon__content__image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  object-fit: cover;
  margin-right: 10px;
}

/* 信息栏样式 */
.coupon__content__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* 防止文字溢出 */
}

.coupon__content__title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏溢出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}

.coupon__content__expiry-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coupon__content__location {
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 按钮样式 */
.coupon__content__action {
  margin-left: 10px;
}

.coupon__content__button {
  background-color: #FF2342;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.coupon__content__button:hover {
  background-color: #d81b3a;
}

/* Swiper 指示器样式 */
.coupon__swiper /deep/ .uni-swiper-dot {
  width: 20px; /* 长条宽度 */
  height: 4px; /* 长条高度 */
  border-radius: 2px; /* 圆角 */
  background-color: #ddd;
  margin: 0 4px; /* 间距 */
}

.coupon__swiper /deep/ .uni-swiper-dot-active {
  background-color: #FF2342;
}
</style>
