import { Http } from '@/utils/http'
const { request } = new Http()
export const getProductList = (data) => request({
  url: 'presentation/customer/inStoreService/productList',
  method: 'POST',
  data,
  cqm: true,
  })

// 购物车数量
export const fetchCartCount = (data) => request({
    url: 'presentation/app/v1/cart/count',
    method: 'POST',
    data,
    cqm: true,
  })

// 金刚区
export const fetchNavigation = (data) => request({
  url: 'presentation/customer/app/homepage/v3/navigationArea',
  method: 'POST',
  data,
  cqm: true,
  })

// 组件区
export const fetchCompList = (data) => request({
  url: 'presentation/customer/app/home/listComponent',
  method: 'POST',
  data,
  cqm: true,
  })

// Tabs
export const fetchRecommendClassify= (data) => request({
  url: 'presentation/customer/app/homepage/v2/recommendClassify',
  method: 'POST',
  data,
  cqm: true,
  })

  // 优惠券
  export const fetchCouponList= (data) => request({
    url: 'presentation/customer/online-offline/v1/order/service/list',
    method: 'POST',
    data,
    cqm: true,
    })

// 资源区
export const fetchResource = (data) => request({
  url: 'presentation/customer/inStoreService/resource',
  method: 'POST',
  data,
  cqm: true,
  })
