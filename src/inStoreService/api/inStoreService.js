import { Http } from '@/utils/http'
const { request } = new Http()

// 到店服务获取当前城市门店接口
// 城市编码，"cityCode""
// bizType" ： 3 //业务类型 1 ：美洗 2 ：挂号 3 ：到店
// POST /crm-bff-app/presentation/customer/applet/shop/shopByCity
// 前端交互：服务端未返回当前城市门店信息，则拉起洗择城市列表兜底方案：接口默认返回无城市，让用户自选城市预警方案：关键链路接口，若接口异常，监控大群报警」店服务城市列表
// 到店服务城市列表访问地址POST /crm-bff-app/presentation/customer/applet/shop/hasShopCityList输入参数"bizType":3 //业务类型 1 ：美洗 2 ：挂号 3 ：到店服务
// 到店服务首页接口（包含金刚区&组件区&类目推荐）
// 方问地址OST 渝入参数输出参数刂
// 店服务/券码区列
// 访问地址POST /presentation/customer/online-offline/vl/order/service/list输入参数'userld"" status "： 5"//用户土 d// 5 ·待核销访问地址POST /presentation/customer/online-offline/vl/order/service/detail输入参数id://订单土 d
// 切回POST /crm-bff-app/presentation/customer/inStoreService/resource刂入参数""//城市编码"cityCode""lat""lng"，//纬度//经度
// 访问地址POST /crm-bff-app/presentation/customer/inStoreService/productList输入参数" lat ""lng"//纬度//经度"categoryld""sortType"高价优先//类目土 d//排序类型 1 、智能排序 2 、距离优先 3 、销量优先 4 、低价优先 5 、"“//商品标签类型 1 全部 2 猫 3 狗 4 异宠"type"输出参数

export const getProductList = (data = {}) => request({
  url: 'presentation/customer/inStoreService/productList',
  method: 'POST',
  data,
  cqm: true,
  header: {
    ['content-type']: 'application/json;charset=UTF-8',
  },
  })

// 金刚区
export const fetchNavigation = (data = {}) => request({
  url: 'presentation/customer/app/homepage/v3/navigationArea',
  method: 'POST',
  data,
  cqm: true,
  header: {
    ['content-type']: 'application/json;charset=UTF-8',
  },
  })

// 组件区
export const fetchCompList = (data = {}) => request({
  url: 'presentation/customer/app/home/listComponent',
  method: 'POST',
  data,
  cqm: true,
  header: {
    ['content-type']: 'application/json;charset=UTF-8',
  },
  })

export const fetchRecommendClassify= (data = {}) => request({
  url: 'presentation/customer/app/homepage/v2/recommendClassify',
  method: 'POST',
  data,
  cqm: true,
  header: {
    ['content-type']: 'application/json;charset=UTF-8',
  },
  })

  export const fetchCouponList= (data = {}) => request({
    url: 'presentation/customer/online-offline/v1/order/service/list',
    method: 'POST',
    data,
    cqm: true,
    header: {
      ['content-type']: 'application/json;charset=UTF-8',
    },
    })
