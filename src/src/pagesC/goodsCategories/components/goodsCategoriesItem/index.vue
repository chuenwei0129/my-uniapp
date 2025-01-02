<template>
  <view>
    <template>
      <view class="lee-wrap" :style="{ height: leeWrapHeight }">
        <view class="lee-menu-wrap">
          <scroll-view
            scroll-y
            scroll-with-animation
            class="lee-tab-view menu-scroll-view"
            :scroll-top="scrollTop"
            :scroll-into-view="itemId"
          >
            <view class="bg-view" :style="{ background: 'white' }">
              <view
                v-for="(item, index) in list"
                :key="index"
                class="lee-tab-item"
                :class="[
                  current === index ? 'lee-tab-item-active' : '',
                  current === index - 1 ? 'lee-tab-item-active-first' : '',
                  index === list.length - 2 && current === list.length - 1
                    ? 'lee-tab-item-active-last'
                    : '',
                  index === current - 1 ? 'lee-tab-item-active-top' : '',
                  index === current + 1 ? 'lee-tab-item-active-bottom' : '',
                ]"
                @tap.stop="switchMenu(index, item)"
              >
                <text class="u-line-1">{{ item.name.slice(0, 4) || "" }}</text>
              </view>
            </view>
          </scroll-view>
          <scroll-view
            :scroll-top="scrollRightTop"
            scroll-y
            scroll-with-animation
            class="right-box"
            @scroll="rightScroll"
          >
            <view class="page-view">
              <view
                class="class-item"
                :id="'item' + index"
                v-for="(item, index) in list"
                :key="index"
              >
                <view class="item-title">
                  <text>{{ item.name }}</text>
                </view>
                <slot name="custom" :row="item">
                  <view class="item-container">
                    <view
                      class="thumb-box"
                      v-for="(item1, index1) in item.children"
                      :key="index1"
                      @click="$emit('onGoodItem', item1)"
                    >
                      <image
                        class="item-menu-img"
                        :src="
                          !isEmptyString(item1.picture)
                            ? item1.picture
                            : 'https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/common_placeholder_icon.png'
                        "
                        mode="aspectFill"
                      ></image>
                      <view class="item-menu-name">{{
                        item1.name.slice(0, 6) || ""
                      }}</view>
                    </view>
                  </view>
                </slot>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import { isEmptyString } from "@/utils";
import { action_report } from "@/utils/track";

export default {
  name: "goodsCategoriesItem",
  props: {
    leeWrapHeight: "",
    leeMarginTop: 0,
    // 数据列表
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      scrollTop: 0, //tab标题的滚动条位置
      oldScrollTop: 0, // tab标题的滚动条旧位置
      current: 0, // 预设当前项的值
      menuHeight: 0, // 左边菜单的高度
      menuItemHeight: 0, // 左边菜单item的高度
      itemId: "", // 栏目右边scroll-view用于滚动的id
      arr: [], // 储存距离顶部高度的数组
      scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
      timer: null,
    };
  },
  mounted() {
    this.getMenuItemTop();
  },
  computed: {},
  emits: ["onGoodItem"],
  methods: {
    isEmptyString,
    // 获取一个目标元素的高度
    getElRect(elClass, dataVal) {
      new Promise((resolve, reject) => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("." + elClass)
          .fields(
            {
              size: true,
            },
            (res) => {
              if (!res) {
                setTimeout(() => {
                  this.getElRect(elClass);
                }, 10);
                return;
              }
              this[dataVal] = res.height;
              resolve();
            }
          )
          .exec();
      });
    },
    getMenuItemTop() {
      new Promise((resolve) => {
        let selectorQuery = uni.createSelectorQuery().in(this);
        selectorQuery
          .selectAll(".class-item")
          .boundingClientRect((rects) => {
            if (!rects.length) {
              setTimeout(() => {
                this.getMenuItemTop();
              }, 10);
              return;
            }
            rects.forEach((rect) => {
              this.arr.push(rect.top - this.leeMarginTop);
              resolve();
            });
          })
          .exec();
      });
    },
    // 设置左边菜单的滚动状态
    async leftMenuStatus(index) {
      this.current = index;
      // 如果为0，意味着尚未初始化
      if (this.menuHeight === 0 || this.menuItemHeight === 0) {
        await this.getElRect("menu-scroll-view", "menuHeight");
        await this.getElRect("lee-tab-item", "menuItemHeight");
      }
      // 将菜单活动item垂直居中
      this.scrollTop =
        index * this.menuItemHeight +
        this.menuItemHeight / 2 -
        this.menuHeight / 2;
    },
    // 点击左边的栏目切换
    async switchMenu(index, item) {
      action_report({
        action_name: "Allcategories_class1_click",
        module_name: "shop",
        extend: {
          class1_name: item.name,
        },
      });
      if (this.arr.length === 0) {
        await this.getMenuItemTop();
      }
      if (index === this.current) return;
      this.scrollRightTop = this.oldScrollTop;
      this.$nextTick(function () {
        this.scrollRightTop = this.arr[index];
        this.current = index;
        this.leftMenuStatus(index);
      });
    },
    // 右边菜单滚动  如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
    async rightScroll(e) {
      this.oldScrollTop = e.detail.scrollTop;
      if (this.arr.length === 0) {
        await this.getMenuItemTop();
      }
      if (this.timer) return;
      if (!this.menuHeight) {
        await this.getElRect("menu-scroll-view", "menuHeight");
      }
      setTimeout(() => {
        // 节流
        this.timer = null;
        let scrollHeight = e.detail.scrollTop + 20;
        for (let i = 0; i < this.arr.length; i++) {
          let height1 = this.arr[i];
          let height2 = this.arr[i + 1];
          if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
            this.leftMenuStatus(i);
            return;
          }
        }
      }, 10);
    },
  },
};
</script>

<style lang="scss" scoped>
$lee-main-color: #101010;
$lee-left-color: #1f1f1f;
$lee-left-indicator-color: #ffd41e;
$lee-tab-item-active: #ffffff;

scroll-view ::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
.lee-wrap {
  ///* #ifdef H5 */
  //height: calc(100% - var(--window-top));
  ///* #endif */
  display: flex;
  flex-direction: column;
  //height: 100%;
}

.lee-menu-wrap {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.lee-tab-view {
  width: 200rpx;
  height: 100%;
  background: #f7f8fc;
}

.lee-tab-item {
  height: 110rpx;
  background: #f7f8fc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25rpx;
  color: $lee-left-color;
  font-weight: 400;
  line-height: 1;
}

.lee-tab-item-active {
  position: relative;
  color: $lee-left-color;
  font-size: 25rpx;
  font-weight: 600;
  background: $lee-tab-item-active;
}
.lee-tab-item-active-first {
  border-radius: 0 12rpx 0 0;
}

.lee-tab-item-active-last {
  border-radius: 0 0 12rpx 0;
}
.lee-tab-item-active-top {
  border-radius: 0 0 12rpx 0;
}
.lee-tab-item-active-bottom {
  border-radius: 0 12rpx 0 0;
}
.lee-tab-item-active::before {
  content: "";
  position: absolute;
  border-left: 6px solid $lee-left-indicator-color;
  height: 25rpx;
  left: 0;
  top: 42.5rpx;
}

.lee-tab-view {
  height: 100%;
}

.right-box {
  background-color: #fff;
}

.page-view {
  padding: 0 16rpx;
}

.class-item {
  // margin-bottom: 8rpx;
  background-color: #fff;
  padding: 16rpx;
  border-radius: 8rpx;
}

.class-item:last-child {
  min-height: 100vh;
}

.item-title {
  font-size: 25rpx;
  font-weight: 400;
  color: #999999;
  line-height: 35rpx;
  box-sizing: border-box;
  padding: 20rpx 0;
}

.item-menu-name {
  margin-top: 8rpx;
  font-size: 25rpx;
  font-weight: 400;
  color: #666666;
  line-height: 35rpx;
}

.item-container {
  display: flex;
  flex-wrap: wrap;
}

.thumb-box {
  width: 33.333333%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.item-menu-img {
  width: 170rpx;
  height: 170rpx;
  border-radius: 8rpx;
}
</style>
