<template>
    <view class="container">
      <view class="rating">
        <!-- 循环生成星星 -->
        <view 
          v-for="(item, index) in totalStars" 
          :key="index" 
          @tap="onStarTap(index + 1)"
          class="star"
        >
          <!-- 星星图片，添加动画类名 -->
          <image
            :src="index < value ? selectedStarImage : emptyStarImage"
            class="star-image"
            :class="{'animate-star': index < animateStars}"
            @animationend="onAnimationEnd"
          ></image>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  export default {
    props:{
      totalStars:{
        default:5
      },
      value:{
        default:0
      },
      readOnly:{
        default:false
      }
    },
    data() {
      return {
        animateStars: 0, // 触发动画的星星数
        selectedStarImage: 'https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/evaluate_activeStart.png', // 选中星星的图标
        emptyStarImage: 'https://frontend-cdn.chongpangpang.com/image/medical-mp/v5.4.0/evaluate_start.png' // 未选中星星的图标
      };
    },
    methods: {
      // 点击星星
      onStarTap(starCount) {
        this.$emit('input',starCount)
        if(this.readOnly)return
        this.animateStars = starCount; // 触发动画        
        
      },
      // 动画结束回调
      onAnimationEnd() {
        this.animateStars = 0; // 重置动画类名
      }
    }
  };
  </script>
  
  <style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .rating {
    display: flex;
    flex-direction: row;
  }
  
  .star {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    margin-right: 3rpx
  }
  
  .star-image {
    width: 70rpx;
    height: 70rpx;
    transition: transform 0.5s ease; /* 添加过渡效果 */
  }
  
  .star-image.animate-star {
    animation: scaleAndBounce 0.5s ease; /* 引入动画 */
  }
  
  @keyframes scaleAndBounce {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1); /* 放大到 1.3 倍 */
    }
    100% {
      transform: scale(1);
    }
  }
  </style>