# zero-back-top

> 仅测试于 vue2, vue3, 微信小程序. 其他平台可自行测试


## 1. 使用方法

导入 `uni_modules` 后直接使用即可

```
<template>
    <view>
        <view>
            <view></view>
            <view></view>
            <view></view>
            <view></view>
        </view>
        <!-- 默认用法-->
      <zero-back-top :scrollTop='scrollTop'></zero-back-top>

	    <!-- slot用法-->
      <zero-back-top :scrollTop='scrollTop'> top </zero-back-top>

	  <!-- 或 : 自定义位置-->
	  <zero-back-top :bottom="bottom" :right="right" :scrollTop='scrollTop'></zero-back-top>

	  <!-- 或 : 自定义样式 1-->
	  <zero-back-top iconType='arrow-line' color="#ffffff" backgroundColor='rgba(0,0,0,0.6)' :scrollTop='scrollTop'></zero-back-top>

	  <!-- 或 : 自定义样式 2-->
	  <zero-back-top iconType='triangle-text' color="#ffffff" backgroundColor='linear-gradient(to right, #f12711, #f5af19);' :scrollTop='scrollTop'></zero-back-top>
    </view>
</template>


<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				right: 50,
				bottom: 100,
			}
		},
		onLoad() {

		},
		// 别忘了在使用页面监听 onPageScroll
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>

</style>

```

## 2. 参数说明

| 参数            | 类型    | 默认值  | 说明                                                  |
| --------------- | ------- | ------- | ----------------------------------------------------- |
| scrollTop       | Number  | 0       | 当前页面距离顶部,需要在使用页面传进来                 |
| iconType        | String  | rocket  | 图标类型,目前提供六种                                 |
| top             | Number  | 300     | 距离顶部 xx 触发                                      |
| duration        | Number  | 300     | 屏幕滚动动画时间                                      |
| zIndex          | Number  | 99      | z-index                                               |
| iconSize        | Number  | 80      | 图标大小                                              |
| right           | Number  | 50      | 图标固定在屏幕底部右侧距离                            |
| bottom          | Number  | 100     | 图标固定在屏幕底部距离                                |
| color           | String  | #007aff | 图标颜色                                              |
| backgroundColor | String  | #ffffff | 图标容器背景色                                        |
| blurEffect      | Boolean | true    | 毛玻璃效果(要求 backgroundColor 值为 rgba,且有透明度) |
| shadow          | Boolean | true    | 按钮阴影,可自主选择关闭                               |

| iconType 值   | 描述       |
| ------------- | ---------- |
| rocket        | 火箭 1     |
| rocket-line   | 火箭 2     |
| arrow         | 箭头 1     |
| arrow-line    | 箭头 2     |
| arrow-text    | top 字体 1 |
| triangle-text | top 字体 2 |

插件预览:
![code](https://cdn.zerojs.cn/image/common/code-z_1722414660881_1.jpg?imageMogr2/thumbnail/200x)

> 小程序搜索: zerojs 零技术

> 预览的小程序不一定能及时更新当前插件
