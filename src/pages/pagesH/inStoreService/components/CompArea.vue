<template>
  <view class="comp-area">
    <u-row
      gutter="10"
      class="comp-area__row"
    >
      <u-col
        v-for="(item, index) in images"
        :key="index"
        :span="imageSpan"
      >
        <view
          class="comp-area__item"
          :style="{ minHeight: maxImageHeight + 'px' }"
        >
          <img
            :src="item.image"
            :style="imageStyles[index]"
            class="comp-area__image"
            @click="navigateTo(item.link)"
          >
        </view>
      </u-col>
    </u-row>
  </view>
</template>

<script>
export default {
  name: 'CompArea',
  props: {
    images: {
      type: Array,
      default: () => [
        {
          image:
            'https://wp-file-dev.oss-cn-hangzhou.aliyuncs.com/%E9%97%A8%E5%BA%97logo/20241224/d2e16f32-fd9b-4959-b65a-9bf89b2c7185_904.png',
          imageHeight: '39',
          imageWidth: '66',
          link: '3333',
        },
        {
          image:
            'https://wp-file-dev.oss-cn-hangzhou.aliyuncs.com/%E9%97%A8%E5%BA%97logo/20241224/d2e16f32-fd9b-4959-b65a-9bf89b2c7185_904.png',
          imageHeight: '39',
          imageWidth: '66',
          link: '3333',
        },
        {
          image:
            'https://wp-file-dev.oss-cn-hangzhou.aliyuncs.com/%E9%97%A8%E5%BA%97logo/20241224/d2e16f32-fd9b-4959-b65a-9bf89b2c7185_904.png',
          imageHeight: '39',
          imageWidth: '66',
          link: '3333',
        },
        {
          image:
            'https://wp-file-dev.oss-cn-hangzhou.aliyuncs.com/%E9%97%A8%E5%BA%97logo/20241224/b518a5a4-0030-4250-86eb-1a7452d92ef2_470.png',
          imageHeight: '96',
          imageWidth: '96',
          link: '3333',
        },
      ],
    },
  },
  computed: {
    imageSpan () {
      return this.images.length > 0 ? 12 / this.images.length : 12
    },
    maxImageHeight () {
      let maxHeight = 0
      this.images.forEach((item) => {
        if (parseInt(item.imageHeight) > maxHeight) {
          maxHeight = parseInt(item.imageHeight)
        }
      })
      return maxHeight + 20 // 10px padding top and bottom
    },
    imageStyles () {
      return this.images.map((item) => {
        const aspectRatio = item.imageWidth / item.imageHeight
        const itemImageHeight = parseInt(item.imageHeight)

        return {
          width: 'calc(100% - 20px)', // 减去 padding
          maxWidth: `${aspectRatio * itemImageHeight}px`,
          // 高度根据情况判断
          height:
            this.maxImageHeight >= itemImageHeight
              ? `${itemImageHeight}px`
              : 'auto',
          maxHeight: `${this.maxImageHeight - 20}px`, // 图片最大高度为容器高度减去padding
          borderRadius: '8px',
        }
      })
    },
  },
  methods: {
    navigateTo (link) {
      uni.showToast({
        title: `${link}`,
        icon: 'success',
      })
      // uni.navigateTo({
      //   url: link // 使用数据中的 link 进行跳转
      // });
    },
  },
}
</script>

<style scoped>
.comp-area {
  margin-top: 20rpx;
}

.comp-area__row {
  display: flex;
  align-items: flex-start; /* 修改为 flex-start */
}

.comp-area__item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 10px;
  /* 删除 height: 100%; */
}

.comp-area__image {
  display: block;
  border-radius: 8px;
  transition: transform var(--animation-duration, 0.3s);
}

.comp-area__image:hover {
  transform: scale(1.1);
}
</style>
