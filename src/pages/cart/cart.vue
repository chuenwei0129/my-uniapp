<template>
  <view class="filter-options">
    <view
      v-for="(option, index) in options"
      :key="index"
      class="filter-item"
      :class="{ active: selectedIndex === index }"
      @click="selectOption(index)"
    >
      <text class="option-text" :class="{ active: selectedIndex === index }">{{
        option
      }}</text>
      <!-- 价格选项后添加上下箭头 -->
      <view v-if="option === '价格'" class="arrow">
        <text class="arrow-text" :class="{ active: selectedIndex === index }"
          >▲</text
        >
        <text class="arrow-text" :class="{ active: selectedIndex === index }"
          >▼</text
        >
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      options: ["综合排序", "距离优先", "销量优先", "价格"],
      selectedIndex: 0, // 默认选中第一个
    };
  },
  methods: {
    selectOption(index) {
      this.selectedIndex = index;
    },
  },
};
</script>

<style>
.filter-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  background-color: #f5f5f5;
}

.filter-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin: 0 5px; /* 控制间距 */
  background-color: #e0e0e0; /* 默认灰色底 */
  border-radius: 8px;
  cursor: pointer;
}

.filter-item.active {
  background-color: #ffe5e5; /* 选中项红色底 */
}

.option-text {
  font-size: 14px;
  color: black; /* 默认黑色文字 */
  font-weight: normal; /* 默认正常字重 */
}

.option-text.active {
  color: red; /* 选中项红色文字 */
  font-weight: 500; /* 选中项 medium 字重 */
}

.arrow {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.arrow-text {
  font-size: 10px;
  color: black; /* 默认黑色箭头 */
}

.arrow-text.active {
  color: red; /* 选中项红色箭头 */
}
</style>
