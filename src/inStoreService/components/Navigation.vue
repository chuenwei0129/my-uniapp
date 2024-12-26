<template>
  <view class="navigation">
    <swiper
      :indicator-dots="navigationList.length > 1"
      :autoplay="true"
      :interval="3000"
      :circular="true"
      class="navigation__swiper"
    >
      <swiper-item
        v-for="(item, index) in navigationList"
        :key="index"
      >
        <view class="navigation__card">
          <u-row
            class="navigation__content"
            gutter="10"
          >
            <u-col
              v-for="(element, idx) in item.elements"
              :key="idx"
              span="2.4"
            >
              <view
                class="navigation__item"
                @click="handleNavigation(element)"
              >
                <view class="image__container">
                  <image
                    :src="element.image"
                    class="navigation__image"
                    mode="aspectFill"
                  />
                  <view
                    v-if="element.cornerIcon"
                    class="corner__icon"
                  >
                    <image
                      :src="element.cornerIcon"
                      mode="aspectFit"
                    />
                  </view>
                </view>
                <text class="navigation__title">
                  {{ element.title }}
                </text>
              </view>
            </u-col>
          </u-row>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  props: {
    navigationList: {
      type: Array,
      default: () => [
        {
          elements: [
            {
              title: '洗澡',
              image: 'http://iph.href.lu/60x60?text=Bath&bg=0000FF&fg=FFFFFF',
              cornerIcon: 'http://iph.href.lu/20x20?text=Icon&bg=FF0000&fg=FFFFFF',
              jumpType: '1',
              h5Link: 'https://example.com/services/bath',
              appLink: '',
              miniLink: '/pages/service/detail?id=101',
            },
            {
              title: '美容',
              image: 'http://iph.href.lu/60x60?text=Beauty&bg=FF0000&fg=FFFFFF',
              cornerIcon: '',
              jumpType: '2',
              h5Link: '',
              appLink: 'app://beauty-service',
              miniLink: '/pages/service/detail?id=102',
            },
            {
              title: '绝育',
              image: 'http://iph.href.lu/60x60?text=Neuter&bg=00FF00&fg=FFFFFF',
              cornerIcon: '',
              jumpType: '1',
              h5Link: 'https://example.com/services/neuter',
              appLink: '',
              miniLink: '/pages/service/detail?id=103',
            },
            {
              title: '疫苗',
              image: 'http://iph.href.lu/60x60?text=Vaccine&bg=FF00FF&fg=FFFFFF',
              cornerIcon: 'http://iph.href.lu/20x20?text=Icon&bg=FF0000&fg=FFFFFF',
              jumpType: '2',
              h5Link: '',
              appLink: 'app://vaccine-service',
              miniLink: '/pages/service/detail?id=104',
            },
            {
              title: '体检',
              image: 'http://iph.href.lu/60x60?text=Checkup&bg=FFFF00&fg=000000',
              cornerIcon: '',
              jumpType: '3',
              h5Link: '',
              appLink: '',
              miniLink: '/pages/service/detail?id=105',
            },
          ],
        },
        // 更多卡片数据
      ],
    },
  },
  methods: {
    handleNavigation (item) {
      console.log(item)
    }
  },
}
</script>

<style scoped>
.navigation {
  background-color: #fff;
}
.navigation__swiper {
  height: auto;
}
.navigation__card {
  padding: 10px;
}
.navigation__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.navigation__item {
  text-align: center;
}
.image__container {
  position: relative;
}
.navigation__image {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin: 0 auto;
}
.corner__icon {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
}
.navigation__title {
  margin-top: 8px;
  font-size: 12px;
  color: #333;
}
</style>
