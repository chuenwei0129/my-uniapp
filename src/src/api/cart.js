import { Http } from "../utils/http";
import { compareVersion } from "@/utils";
const { request } = new Http();

export const MALL_APP_ID = "1729776648698531840";
export const MALL_PLATFORM_ID = "1699310123233079297";
export const addressInfo = uni.getStorageSync("mall_last_search_address_obj");
/**
 * 查询辐射范围内最近的门店
 */
export const queryRangeStore = (data) => {
  return request({
    url: `presentation/customer/app/mall/v3/range/nearest`,
    method: "POST",
    cqm: true,
    data,
  });
};
/**
 * 获取购物车详情
 */
export const queryCartList = (data) => {
  return request({
    url: `presentation/app/v2/cart/list`,
    method: "POST",
    data: {
      ...data,
      // #ifdef MP-WEIXIN
      sourceType: 5,
      // #endif
      // #ifdef H5
      sourceType: 4,
      // #endif
      supportActivity: supportActivity(),
    },
    cqm: true,
  });
};
const supportActivity = () => {
  // #ifdef MP-WEIXIN
  return true;
  // #endif
  // #ifdef H5
  try {
    if (compareVersion(getApp().globalData.appVersion, "5.0.9") >= 0) {
      console.log("支持活动");
      return true;
    }
    console.log("不支持活动");
    return false;
  } catch (e) {
    console.log("catch(e)不支持活动", e);
    return false;
  }
  // #endif
};
/**
 * 更新购物车商品数量
 */
export const postUpdateSkuNum = (data) => {
  return request({
    url: `presentation/app/v1/cart/update`,
    method: "POST",
    data,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 删除购物车中的商品
 */
export const postDeleteSku = (data) => {
  return request({
    url: `presentation/app/v1/cart/delete`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};
/**
 * 批量删除购物车选中的商品
 */
export const postBatchDeleteSku = (data) => {
  return request({
    url: `presentation/app/v1/cart/deleteByChecked`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};

/**
 * 选中取消所有商品
 */
export const postCheckedAll = (data) => {
  return request({
    url: `presentation/app/v1/cart/checkedAll`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};
/**
 * 选中取消某个sku
 */
export const postCheckedSku = (data) => {
  return request({
    url: `presentation/app/v1/cart/checked`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};
/**
 * 选中取消某个店铺的所有商品
 */
export const postCheckedStore = (data) => {
  return request({
    url: `presentation/app/v1/cart/checkedShopAll`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};

/**
 * 推荐商品
 */
export const queryRecommend = (data) => {
  return request({
    url: `presentation/customer/goods/v2/recommend/home`,
    method: "POST",
    data,
    header: {
      userCurrentLat: addressInfo.lat,
      userCurrentLon: addressInfo.lon,
    },
    cqm: true,
  });
};

/**
 添加购物车
**/

export const addCart = (data = {}) => {
  return request({
    url: "presentation/app/v3/cart/add",
    data,
    method: "POST",
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 结算页详情
**/

export const settlement = (data = {}) => {
  return request({
    url: "presentation/app/v3/cart/settlement",
    data,
    method: "POST",
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
    useSelfToast: true,
  });
};

/**
 * 结算页面下单
 */
export const postTradeCreate = (data) => {
  return request({
    url: `presentation/app/v1/trade/create`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};

/**
 * 修改订单地址 /
 */
export const editAddressApi = (data) => {
  return request({
    url: `presentation/app/v1/cart/consigneeAddress`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};

/**
 * 获取优惠券列表
 */
export const postCouponList = (data) => {
  return request({
    url: `presentation/customer/app/coupon/v1/list`,
    method: "POST",
    data,
    cqm: true,
  });
};

/**
 * 获取优惠券列表
 */
export const postCouponListByType = (data) => {
  return request({
    url: `presentation/customer/app/coupon/v1/available/unavailable/list`,
    method: "POST",
    data,
    cqm: true,
  });
};
/**
 * 切换优惠券
 */
export const postCouponSwitch = (data) => {
  return request({
    url: `presentation/app/v1/cart/switchCoupon`,
    method: "POST",
    data,
    cqm: true,
    loading: true,
  });
};

/**
 * 查询店铺
 */
export const GET_SHOP_LIST = (data) => {
  return request({
    url: `presentation/customer/app/mall/v1/shopList`,
    method: "POST",
    data,
    cqm: true,
    loading: false,
  });
};

/**
 * 获取云仓对应sku库存
 * @param data { skuIdList: [] }
 * @constructor
 */
export const GET_CLOUD_SALE_STOCK_LIST = (data) => {
  return request({
    url: "presentation/customer/goods/v2/listCloudSaleStock",
    method: "POST",
    data,
    cqm: true,
    loading: false,
  });
};
/**
 * 清空所有失效商品
 */
export const CLEAN_INVALID_GOODS = (data) => {
  return request({
    url: "presentation/app/v2/cart/deleteAllInvalid",
    method: "POST",
    data,
    cqm: true,
    loading: false,
  });
};
