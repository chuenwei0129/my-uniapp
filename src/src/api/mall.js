import { Http } from "@/utils/http";
const { request } = new Http();

export const MALL_APP_ID = "1729776648698531840";
export const MALL_PLATFORM_ID = "1699310123233079297";

/**
 商品专区
**/

export const getGoodsSpecialArea = (data = {}) => {
  return request({
    url: "presentation/customer/app/commodity/v1/HotAreaItem",
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
/**
 物流模板
 **/

export const getLogisticsTemplate = (data) => {
  return request({
    url: "presentation/customer/goods/v2/refreshLogisticsTemplate",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data,
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
/**
 商品是否收藏
 **/

export const isCollectedGoods = (data = {}) => {
  return request({
    url: "presentation/customer/collect/v1/item/isCollected",
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
/**
 商品收藏
 **/

export const collectGoods = (data = {}) => {
  return request({
    url: "presentation/customer/collect/v1/item/collect",
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};

/**
 取消商品收藏
 **/

export const unCollectGoods = (data = {}) => {
  return request({
    url: "presentation/customer/collect/v1/item/cancel",
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};

/**
 商品详情
 **/

export const getGoodsDetail = (itemId, data = {}) => {
  return request({
    url: `presentation/customer/goods/detail/${itemId}`,
    data,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};

/**
 全部适用门店
 **/

export const getOtherApplicableStores = (data = {}) => {
  return request({
    url: "presentation/customer/app/mall/v1/otherApplicableStores",
    data: {
      ...data,
      lon: uni.getStorageSync("lon"),
      lat: uni.getStorageSync("lat"),
      cityCode: uni.getStorageSync("selectedCityCode") || "330100",
    },
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};

/**
 商品类目树
 **/

export const getGoodsCategoryTree = (data = {}) => {
  return request({
    url: "presentation/customer/app/classify/tree",
    data,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
//presentation/customer/goods/listByClassify
/**
 商品筛选
 **/

export const getCategoryTreeGoods = (data = {}) => {
  return request({
    url: "presentation/customer/goods/listByClassify",
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
//presentation/customer/goods/listByClassify
/**
 商品筛选(v2新接口)
 **/

export const getCategoryTreeGoodsV2 = (data = {}) => {
  return request({
    url: "presentation/customer/goods/v2/listByClassify",
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
/**
 * 首页推荐类目
 * @returns
 */
export const GET_RECOMMEND_CLASSIFY = () => {
  return request({
    url: "presentation/customer/app/classify/recommend",
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 首页金刚区
 * @returns {Promise<unknown>}
 * @constructor
 */
export const GET_RECOMMEND_HOT = () => {
  return request({
    url: "presentation/customer/app/homepage/v1/navigationArea",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 首页推荐专区
 * @returns
 */
export const GET_RECOMMEND_AREA = (data) => {
  return request({
    url: "presentation/customer/app/homepage/v1/blockArea",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 首页推荐商品
 * @param { :dbPageNo, skipGoods, pageNum, pageSize, type: 1: 首页推荐  2：购买后的推荐} data
 * @returns
 */
export const GET_RECOMMEND_GOODS = (data) => {
  return request({
    url: "presentation/customer/goods/recommend/home",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 查询距离最近的门店
 * @param {
 * "areaCode": "string",
 * "areaName": "string",
 * "cityCode": "string",
 * "cityName": "string",
 * "lat": 0,
 * "lon": 0,
 * } data
 * @returns
 */
export const GET_NEAREST_SHOP = (data) => {
  return request({
    url: "presentation/customer/app/mall/v1/nearest",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 到店服务-店铺服务商品类目信息
 * @param {
 * storeId: 店铺id
 * } data
 * @returns
 */
export const GET_SHOP_CLASSIFY = (data) => {
  return request({
    url: "presentation/customer/app/classify/v1/skuInfoContainsNodeTree",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 是否开通 预约美洗服务
 * @param {{shopId, bizType, channelType}} data
 * @returns
 */
export const CHECK_MX_RESERVATION = (data) => {
  return request({
    url: "presentation/customer/applet/shop/channel/business/isEnabled",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 有门店的城市地址信息
 * @constructor
 */
export const GET_HAS_SHOP_CITIES = () => {
  return request({
    url: "presentation/customer/app/address/v1/hasMallCityAddress",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 通过订单Id获取物流详情
 * @returns
 */
export const GET_LOGISTICS_DETAIL = (data) => {
  return request({
    url: "presentation/customer/app/v1/logistics/detailByOrderId",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 查看订单详情
 * @returns
 */
export const GET_ORDER_DETAIL = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/detail",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 删除订单
 * @returns
 */
export const DELETE_ORDER = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/delete",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 取消订单
 * @returns
 */
export const CANCEL_ORDER = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/cancel",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 确认收货
 * @returns
 */
export const CONFIRM_ORDER = (data) => {
  return request({
    url: "presentation/customer/app/v1/order:confirm-receipt",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 检查上架状态
 * @returns
 */
export const CHECK_STATUS = (data) => {
  return request({
    url: "presentation/customer/app/commodity/v1/itemStatus",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 商城订单列表查询
 * @returns
 */
export const GET_MALL_ORDER_LIST = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/page",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 商城售后列表查询
 * @returns
 */
export const GET_MALL_AFTER_LIST = (data) => {
  return request({
    url: "presentation/customer/app/v1/afterSale/page",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 我的订单列表角标数量统计
 * @returns
 */
export const GET_MALL_ORDER_LIST_BRADGE = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/subscript",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 申请售后/退款
 * @param data {
 *   additionalDesc: string,       // 补充描述
 *   afterSaleNum: integer,        // 申请售后数量
 *   afterSaleReason: string,      // 退款原因
 *   afterSaleType: integer,       // 售后类型： 6-售后商城仅退款 7-售后商城退款退货
 *   buyerCertificateList: array,  // 售后申请上传凭证
 *   itemId: itemId,               // 商品itemId
 *   orderId: integer,             // 订单id
 *   orderItemId: integer,         // 订单行id
 *   refundAmount: number,         // 退款金额
 *   remark: skuId,                // 备注
 *   skuId: skuId,                 // skuId
 * }
 * @returns {Promise<unknown>}
 * @constructor
 */
export const APPLY_AFTER_SALE = (data) => {
  return request({
    url: "presentation/customer/app/v1/afterSale/create",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 搜索商品
 * @param {参数} data
 */
export const GET_SEARCH_GOODS = (data) => {
  return request({
    url: "presentation/customer/app/commodity/v1/search",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 搜索活体
 * @param {参数} data
 */
export const GET_SEARCH_LIVING = (data) => {
  return request({
    url: "presentation/customer/live/v1/livingSearch",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 查询售后单详情
 * @param data {{afterSaleOrderId}}
 * @returns {Promise<unknown>}
 * @constructor
 */
export const GET_AFTER_SALE_DETAIL = (data) => {
  return request({
    url: "presentation/customer/app/v1/afterSale/detail",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/*
 * 获取 当前定位 的门店列表
 */
export const GET_STORE_LIST = (data) => {
  return request({
    url: "presentation/customer/app/mall/v1/sameCityMall",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 获取售后单寄回商家收货地址信息
 * @returns {Promise<unknown>}
 * @constructor
 */
export const GET_SEND_BACK_ADDRESS = () => {
  return request({
    url: "presentation/customer/app/v1/afterSale/sendBackAddress",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * C端买家订单物流单号填写
 * @param data {
 *   deliveryCompanyName string 配送公司名称
 *   logisticsNo string 配送公司名称
 * }
 * @constructor
 */
export const CREATE_AFTER_SALE_SEND_BACK = (data) => {
  return request({
    url: "presentation/customer/app/v1/afterSale/sendBack",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 获取 我的收藏
 * @param {{pageNum, pageSize}} data
 */
export const GET_COLLECTION_LIST = (data) => {
  return request({
    url: "presentation/customer/collect/v1/item/page",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 取消收藏
 * @param {{itemId}} data
 */
export const CANCEL_COLLECTION = (data) => {
  return request({
    url: "presentation/customer/collect/v1/item/cancel",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 撤销售后申请
 * @param data {
 *   afterSaleOrderId string 售后单Id
 * }
 * @returns {Promise<unknown | void>}
 * @constructor
 */
export const REVOKE_AFTER_SALE = (data) => {
  return request({
    url: "presentation/customer/app/v1/afterSale/revoke",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * C端用户删除售后单
 * @param data {
 *   afterSaleOrderId string 售后单Id
 * }
 * @returns {Promise<unknown | void>}
 * @constructor
 */
export const DELETE_AFTER_SALE = (data) => {
  return request({
    url: "/presentation/customer/app/v1/afterSale/delete",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 商品提交初始化数据
 * @param {[{itemId, shopId, shopName, skuId, skuQty}]} data
 * @returns
 */
export const GET_SUBMIT_INIT_DATA = (data) => {
  return request({
    url: "presentation/customer/app/v1/order:confirm",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 商品/服务 提交订单， 计算价格
 * @param {{addressId, memberId, orderItems, shopId}} data
 * @returns
 */
export const CALC_SUBMIT_PAY_AMOUNT = (data) => {
  return request({
    url: "presentation/customer/app/v1/order:calculate",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 创建 商品/服务 订单
 * @param {{}} data
 * @returns
 */
export const CREATE_ORDER = (data) => {
  return request({
    url: "presentation/customer/app/v1/order",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      sourceOrderType: "5",
      payType: "2",
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 获取退款原因
 * @returns {Promise<unknown | void>}
 * @constructor
 */
export const GET_AFTER_SALE_REFUND_REASON = () => {
  return request({
    url: "presentation/customer/app/v1/afterSale/refundReason",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

export const GET_AFTER_SALE_CANCEL_REASON = () => {
  return request({
    url: "presentation/customer/app/v1/afterSale/cancelReason",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 查看订单详情
 * @returns
 */
export const GET_ORDER_DETAIL_LOADING = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/detail",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 查看订单胖豆
 * @returns
 */
export const POST_ORDER_DETAIL_ONLINE = (data) => {
  return request({
    url: "presentation/customer/online-offline/v1/order/detail",
    method: "POST",
    data,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 获取 微信小程序预支付 信息
 */
export const PREPAY_WX_MP = (data) => {
  const accountInfo = uni.getAccountInfoSync();
  return request({
    url: "presentation/customer/applet/payment/v1/pay",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data: {
      appId: MALL_APP_ID,
      thirdAppId: accountInfo.miniProgram.appId,
      ...data,
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 获取 商城首页的辐射门店信息
 */
export const FECTH_NEAR_SHOP_STORE = (data) => {
  return request({
    url: "presentation/customer/app/mall/v3/range/nearest",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

// 获取可用优惠券列表
export const GET_COUPON_LIST = (data) => {
  return request({
    url: "presentation/customer/app/coupon/v2/available/list",
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
    use500ShowToast: true,
  });
};

// 领取优惠券
export const GET_COUPON_RECEIVE = (data) => {
  return request({
    url: "presentation/customer/app/coupon/v1/receive",
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};

//优惠券可用商品列表
export const AVAILABLE_GOODS_LIST = (data) => {
  return request({
    url: "presentation/customer/app/coupon/v1/good/page",
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 活动赠品列表
 * @param data {shopId, skuIds}
 * @returns {Promise<Object>}
 * @constructor
 */
export const GET_FREE_GIFT_ITEM = (data) => {
  return request({
    url: "presentation/customer/app/commodity/v2/freeGiftItem",
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 促销适用商品
 * @param data {shopId, activityId, sort, pageNum, pageSize}
 * @returns {Promise<unknown | void>}
 * @constructor
 */
export const GET_PROMOTION_ACTIVITY_ITEM = (data) => {
  return request({
    url: "presentation/customer/app/commodity/v2/promotionActivityItem",
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 对接app端支付 prepay
 */
export const APP_PREPAY = (data) => {
  return request({
    url: "presentation/customer/app/payment/v1/prePay",
    method: "POST",
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};

// 资源详情页
export const GET_INSTORE_SERVICE = (data) => {
  return request({
    url: `presentation/customer/inStoreService/index`,
    method: "POST",
    loading: false,
    cqm: true,
    data
  });
};

// 二级类目
export const GET_PRODUCTLIST = (data) => {
  return request({
    url: `presentation/customer/inStoreService/productList`,
    method: "POST",
    loading: false,
    cqm: true,
    data
  });
};
