# da-dropdown-vue2

一个基于 Vue3 的头部导航栏下拉弹窗组件，全平台兼容。

内容同步于 Vue3 版本，在此查看 ===> **[Vue3 版](https://ext.dcloud.net.cn/plugin?id=11840)**

_与 Vue3 版本版本不同的是，此版本兼容更全面，比如 360 小程序、快应用等均支持_

### 关于使用

可在右侧的`使用 HBuilderX 导入插件`或`下载示例项目ZIP`，方便快速上手。

可通过下方的示例及文档说明，进一步了解使用组件相关细节参数。

插件地址：https://ext.dcloud.net.cn/plugin?id=11840

### 功能一览

1. 下拉列表（单选）
2. 点击常亮
3. 点击排序
4. 下拉筛选（单选按钮、多选按钮、滑动选择器）
5. 级联筛选（单选）
6. 日期筛选（日期快选、日期区间选择）
7. 顶部搜索
8. 自定插槽

### 组件示例

```jsx
<template>
  <DaDropdownVue2
    ref="DaDropdownRef"
    :dropdownMenu.sync="dropdownMenuList"
    themeColor="#007aff"
    textColor="#333333"
    :duration="300"
    :fixedTop="true"
    :menuActiveText="false"
    @confirm="handleConfirm"
    @close="handleClose"
    @open="handleOpen">
  </DaDropdownVue2>
</template>
```

```js
import DaDropdownVue2 from '@/components/da-dropdown-vue2/index.vue'

function getMockServiceData() {
  return new Promise((resolve, reject) => {
    resolve([
      { label: '下拉列表项1', value: '1', suffix: '副标题' },
      { label: '下拉列表项2', value: '2' },
      { label: '下拉列表项3', value: '3' },
    ])
  })
}

export default {
  components: { DaDropdownVue2 },
  data() {
    return {
      title: 'hello',
      dropdownMenuList: [
        // 演示数据请看下方各模块说明或下载示例项目查看
        // ...
      ],
    }
  },
  methods: {
    handleConfirm(v) {
      console.log('handleConfirm ==>', v)
    },
    handleClose(v) {
      console.log('handleClose ==>', v)
    },
    handleOpen(v) {
      console.log('handleOpen ==>', v)
    },
    handleSwitchChange(event, item, index) {
      console.log('handleSwitchChange ==>', event, item, index)

      // 更新数据及视图
      const curItem = this.dropdownMenuList[index]
      curItem.value = event.detail.value === true ? 1 : 0
      this.$set(this.dropdownMenuList, index, curItem)
      // 操作完成后关闭弹窗
      this.$refs.DaDropdownRef?.handlePopupHide()
    },
  },
}
```

### 组件参数

| 属性           | 类型      | 默认值    | 必填 | 说明                               |
| :------------- | :-------- | :-------- | :--- | :--------------------------------- |
| dropdownMenu   | `Array`   | `[]`      | 是   | 导航菜单数据                       |
| menuActiveText | `Boolean` | `true`    | 否   | 激活菜单项时是否改变菜单文字       |
| themeColor     | `String`  | `#007aff` | 否   | 主题颜色                           |
| textColor      | `String`  | `#333333` | 否   | 导航文字颜色                       |
| bgColor        | `String`  | `#ffffff` | 否   | 背景颜色，当固定在顶部时，此为必填 |
| fixedTop       | `Boolean` | `false`   | 否   | 是否固定在顶部                     |
| fixedTopValue  | `Number`  | `0`       | 否   | 固定在头部时的位置，单位 px        |
| duration       | `Number`  | `300`     | 否   | 弹窗动画的过渡时间                 |

> 温馨提示：如果页面定义了 "navigationStyle": "custom" ，因此固定头部时需要额外获取状态栏高度，以免被异形屏头部覆盖，此时的 fixedTopValue 的作用就出来了，通过 fixedTopValue 自定义加减固定头部所处的位置。

### 菜单项参数

#### dropdownMenu 基础参数

| 属性  | 类型     | 默认值 | 必填 | 说明                                     |
| :---- | :------- | :----- | :--- | :--------------------------------------- |
| title | `String` | -      | 是   | 菜单名称                                 |
| prop  | `String` | -      | 是   | 菜单 prop 值，**菜单项的 prop 是唯一的** |
| type  | `String` | -      | 是   | 菜单类型，参考下方类型说明               |

除上方基础参数以外，不同的 `type` 会有额外的配置参数

type 类型说明

> - cell 下拉列表
> - click 点击
> - sort 排序
> - filter 复杂筛选
> - picker 级联
> - daterange 日期范围
> - search 搜索框(菜单项 type 唯一)
> - slot 弹窗插槽

#### cell 下拉列表

| 属性       | 类型               | 默认值                               | 必填 | 说明                                             |
| :--------- | :----------------- | :----------------------------------- | :--- | :----------------------------------------------- |
| value      | `Number`\|`String` | -                                    | 否   | 默认值，和`options`的 value 必须保持同类型       |
| showAll    | `Boolean`          | `false`                              | 否   | 是否显示 “不限” 项                               |
| showIcon   | `Boolean`          | `false`                              | 否   | 是否在选中时显示勾选图标                         |
| field      | `Object`           | `{ label: 'label', value: 'value' }` | 否   | 列表子项数据对应内容字段                         |
| options    | `Array`            | `[]`                                 | 否   | 下拉列表子项数据                                 |
| syncDataFn | `Function`         | -                                    | 否   | 异步函数返回下拉列表子项数据，优先级大于 options |

```js
// cell 格式示例
const dropdownMenuList = [
  {
    title: '下拉',
    type: 'cell',
    prop: 'god1',
    showAll: true,
    // showIcon: true,
    // value: '2', // 默认内容2
    options: [
      { label: '下拉列表项1', value: '1'},
      { label: '下拉列表项2', value: '2' },
      { label: '下拉列表项3', value: '3' },
    ],
    // 获取远程数据
    // syncDataFn: getMockServiceData,
  },
]

// 模拟远程数据
function getMockServiceData() {
  return new Promise((resolve, reject) => {
    resolve([
      { label: '下拉列表项1', value: '1', suffix: '副标题' },
      { label: '下拉列表项2', value: '2' },
      { label: '下拉列表项3', value: '3' },
    ])
  })
}
```

#### click 点击

| 属性  | 类型      | 默认值 | 必填 | 说明                              |
| :---- | :-------- | :----- | :--- | :-------------------------------- |
| value | `Boolean` | -      | 否   | 默认值，true 选中、false 取消选中 |

```js
// click 格式示例
const dropdownMenuList = [
  {
    title: '点击',
    type: 'click',
    prop: 'god2',
    // value: true, // 默认选中
  },
]
```

#### sort 排序

| 属性  | 类型          | 默认值 | 必填 | 说明                        |
| :---- | :------------ | :----- | :--- | :-------------------------- |
| value | `asc`\|`desc` | -      | 否   | 默认值，asc 升序、desc 倒序 |

```js
// sort 格式示例
const dropdownMenuList = [
  {
    title: '排序',
    type: 'sort',
    prop: 'god3',
    // value: 'asc', // 默认升序
  },
]
```

#### filter 复杂筛选

| 属性    | 类型     | 默认值 | 必填 | 说明                                         |
| :------ | :------- | :----- | :--- | :------------------------------------------- |
| value   | `Object` | -      | 否   | 默认值，格式`{ prop1: '值1', prop2: '值2' }` |
| options | `Array`  | `[]`   | 否   | 筛选子项数据，**说明见下**                   |

##### filter -> options 参数说明

| 属性           | 类型                          | 必填 | 说明                                                                                          |
| :------------- | :---------------------------- | :--- | :-------------------------------------------------------------------------------------------- |
| title          | `String`                      | 是   | 筛选项的子项标题                                                                              |
| type           | `radio`\|`checkbox`\|`slider` | 是   | 筛选项的子项类型，可选 radio 单选按钮、checkbox 多选按钮、slider 滑动选择器                   |
| prop           | `String`                      | 是   | 筛选项的子项 prop，**注意保持子项 prop 唯一**                                                 |
| componentProps | `Object`                      | 否   | 筛选项的对应的组件配置，[slider 组件配置](https://uniapp.dcloud.net.cn/component/slider.html) |
| options        | `Array`                       | 否   | 筛选子项的类型对应的数据                                                                      |

```js
// filter 格式示例
const dropdownMenuList = [
  {
    title: '筛选',
    type: 'filter',
    prop: 'god4',
    // 默认选中单选2、多选2、3、滑动30
    // value: { ft1: '2', ft2: ['2', '3'], ft3: 30 },
    options: [
      {
        title: '单选',
        type: 'radio',
        prop: 'ft1',
        options: [
          { label: '单选1', value: '1' },
          { label: '单选2', value: '2' },
          { label: '单选3', value: '3' },
        ],
      },
      {
        title: '多选',
        type: 'checkbox',
        prop: 'ft2',
        options: [
          { label: '多选1', value: '1' },
          { label: '多选2', value: '2' },
          { label: '多选3', value: '3' },
        ],
      },
      {
        title: '滑块',
        type: 'slider',
        prop: 'ft3',
        componentProps: {
          min: 0,
          max: 100,
          step: 1,
          showValue: true,
        },
      },
    ],
  },
]
```

#### picker 级联(无限级)

| 属性       | 类型       | 默认值                                                     | 必填 | 说明                                         |
| :--------- | :--------- | :--------------------------------------------------------- | :--- | :------------------------------------------- |
| value      | `Array`    | -                                                          | 否   | 默认值，格式`['一级value', '二级value']`     |
| showAll    | `Boolean`  | `false`                                                    | 否   | 是否显示 “不限” 项                           |
| showIcon   | `Boolean`  | `false`                                                    | 否   | 是否在选中末级时显示勾选图标                 |
| field      | `Object`   | `{ label: 'label', value: 'value', children: 'children' }` | 否   | 级联子项数据对应内容字段                     |
| options    | `Array`    | `[]`                                                       | 否   | 级联子项数据                                 |
| syncDataFn | `Function` | -                                                          | 否   | 异步函数返回级联子项数据，优先级大于 options |

```js
// picker 格式示例
const dropdownMenuList = [
  {
    title: '级联选择',
    type: 'picker',
    prop: 'god5',
    showAll: true,
    showIcon: true,
    // showAll 为true时相当于在options第一的位置插入“不限”项
    // { label: '不限', value: '-9999' },
    field: {
      label: 'label',
      value: 'value',
      children: 'children',
    },
    // value: ['2', '22'], // 默认选中 级联X22
    options: [
      {
        label: '级联X1',
        value: '1',
        children: [
          { label: '级联X11', value: '11' },
          { label: '级联X12', value: '12' },
        ],
      },
      {
        label: '级联X2',
        value: '2',
        children: [
          { label: '级联X21', value: '21' },
          { label: '级联X22', value: '22' },
        ],
      },
    ],
  },
]
```

#### daterange 日期范围

| 属性  | 类型     | 默认值 | 必填 | 说明                                                 |
| :---- | :------- | :----- | :--- | :--------------------------------------------------- |
| value | `Object` | -      | 否   | 默认值，格式`{ start: '开始日期', end: '结束日期' }` |

```js
// daterange 格式示例
const dropdownMenuList = [
  {
    title: '日期范围',
    type: 'daterange',
    prop: 'god6',
    // 默认选中 2022-01-01到2022-02-01
    // value: { start: '2022-01-01', end: '2022-02-01' },
  },
]
```

#### search 头部搜索

| 属性  | 类型     | 默认值 | 必填 | 说明   |
| :---- | :------- | :----- | :--- | :----- |
| value | `String` | -      | 否   | 默认值 |

```js
// search 格式示例
const dropdownMenuList = [
  {
    title: '搜索',
    type: 'search',
    prop: 'god0',
  },
]
```

#### slot(1-5) 拓展插槽

| 属性  | 类型     | 默认值 | 必填 | 说明   |
| :---- | :------- | :----- | :--- | :----- |
| value | `String` | -      | 否   | 默认值 |

```jsx
// slot 格式示例
<template>
  <DaDropdownVue2>
    <template v-slot:slot1="{item,index}">
      <view>
        自定义插槽1内容
        <switch :checked="item.value == 1" />
        <text>{{ item.value == 1 ? '激活' : '未激活' }}</text>
      </view>
    </template>
    <template v-slot:slot2="{item,index}">
      <view>自定义插槽2内容 {{item.value}} {{index}}</view>
    </template>
    <template v-slot:slot3="{item,index}">
      <view>自定义插槽3内容 {{item.value}} {{index}}</view>
    </template>
    <template v-slot:slot4="{item,index}">
      <view>自定义插槽4内容 {{item.value}} {{index}}</view>
    </template>
    <template v-slot:slot5="{item,index}">
      <view>自定义插槽5内容 {{item.value}} {{index}}</view>
    </template>
  </DaDropdownVue2>
</template>
```

```js
const dropdownMenuList = [
  {
    title: '插槽1',
    type: 'slot1',
    prop: 'god1',
  },
  {
    title: '插槽2',
    type: 'slot2',
    prop: 'god2',
  },
  {
    title: '插槽3',
    type: 'slot3',
    prop: 'god3',
  },
  {
    title: '插槽4',
    type: 'slot4',
    prop: 'god4',
  },
  {
    title: '插槽5',
    type: 'slot5',
    prop: 'god5',
  },
]
```

### 组件事件

| 事件名称 | 回调参数         | 说明                                                               |
| :------- | :--------------- | :----------------------------------------------------------------- |
| open     | `() => void`     | 打开弹窗时回调                                                     |
| close    | `() => void`     | 关闭弹窗时回调                                                     |
| confirm  | `(data) => void` | 确定选择内容时回调，返回选择的数据，格式`{'菜单项prop值': '内容'}` |

### 组件版本

v2.1.1

### 差异化

已通过测试

> - H5 页面
> - 微信小程序
> - 支付宝、钉钉小程序
> - 字节跳动、抖音、今日头条小程序
> - 百度小程序
> - 飞书小程序
> - QQ 小程序
> - 京东小程序
> - 快应用
> - 360 小程序

未测试

> - 快手小程序由于非企业用户暂无演示

### 开发组

[@CRLANG](https://crlang.com)
