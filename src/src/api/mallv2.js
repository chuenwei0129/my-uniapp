import { Http } from "@/utils/http";
const { request } = new Http();

export const MALL_APP_ID = "1729776648698531840";
export const MALL_PLATFORM_ID = "1699310123233079297";
export const addressInfo = uni.getStorageSync("mall_last_search_address_obj");

// v2版本接口

/**
 商品专区
**/

export const getGoodsSpecialArea = (data = {}) => {
  return request({
    url: "presentation/customer/app/commodity/v2/HotAreaItem",
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
 商品详情
 **/

export const getGoodsDetail = (data = {}) => {
  return request({
    url: `presentation/customer/goods/v3/detail`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
    use500ShowToast: true,
  });
};

/**
 全部适用门店
 **/

export const getOtherApplicableStores = (data = {}) => {
  return request({
    url: "presentation/customer/app/mall/v2/otherApplicableStores",
    data: {
      ...data,
      lon: uni.getStorageSync("lon"),
      lat: uni.getStorageSync("lat"),
      cityCode: "",
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
    url: "presentation/customer/app/classify/v2/tree",
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

// export const getCategoryTreeGoods = (data = {}) => {
//   return request({
//     url: "presentation/customer/goods/listByClassify",
//     data,
//     method: "POST",
//     header: {
//       // ["content-type"]: "application/json;charset=UTF-8",
//     },
//     gw: false,
//     cqm: true,
//     loading: false,
//     use500Error: true,
//   });
// };
/**
 * 首页推荐类目
 * @returns
 */
export const GET_RECOMMEND_CLASSIFY = () => {
  return request({
    url: "presentation/customer/app/homepage/v1/recommendClassify",
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
 * 新版首页核心区
 * @returns
 */
export const featureArea = () => {
  return request({
    url: "presentation/customer/app/homepage/v1/featureArea",
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
 * 新版首页金刚区
 * @returns
 */
export const navigationArea = () => {
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
export const GET_RECOMMEND_AREA = () => {
  return request({
    url: "presentation/customer/app/commodity/v1/homePageArea",
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
 * 首页推荐商品
 * @param { :dbPageNo, skipGoods, pageNum, pageSize, type: 1: 首页推荐  2：购买后的推荐} data
 * @returns
 */
export const GET_RECOMMEND_GOODS = (data) => {
  return request({
    url: "presentation/customer/goods/v2/recommend/home",
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      userCurrentLat: addressInfo.lat,
      userCurrentLon: addressInfo.lon,
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
    url: "presentation/customer/app/mall/v2/nearest",
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
    url: "presentation/customer/app/classify/v2/skuInfoContainsNodeTree",
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
export const GET_HAS_SHOP_CITIES = (data) => {
  return request({
    url: "presentation/customer/applet/shop/config/city/list",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data,
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 新的城市列表更换
 */
export const NEW_GET_HAS_SHOP_CITIES = (data) => {
  return request({
    url: "presentation/customer/applet/shop/in-store-service/city/list",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    data,
    gw: false,
    cqm: true,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 搜索商品
 * @param {参数} data
 */
export const GET_SEARCH_GOODS = (data) => {
  return request({
    url: "presentation/customer/app/commodity/v2/search",
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
    url: "presentation/customer/applet/shop/v2/nearby/shop/list",
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
 *
 * 获取所有门店
 */
export const NEW_GET_STORE_LIST = (data) => {
  return request({
    url: "presentation/customer/applet/shop/v3/nearby/shop/list",
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
 * 获取 商城首页的辐射门店信息
 */
export const FECTH_NEAR_SHOP_STORE = (data) => {
  return request({
    url: "presentation/customer/app/mall/v3/range/nearest",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
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

/**
 * 到店服务获取最近门店信息
 */
export const NEW_FECTH_NEAR_SHOP_STORE = (data) => {
  return request({
    url: "presentation/customer/app/mall/v2/range/nearest",
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
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
    url: "presentation/customer/app/v2/afterSale/create",
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
/*
 * @returns {Promise<unknown>}
 * @constructor
 */
export const GET_CART_TOTAL = (data) => {
  return request({
    url: "presentation/app/v1/cart/count",
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
 * @returns {Promise<unknown>}
 * @活体价格区间
 */
export const GET_PRICE_RANGE = (data) => {
  return request({
    url: "presentation/customer/live/channel/v1/list-live-price-range",
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
 * @/live-shop-list
 * @活体门店查询
 */
export const GET_LIVESHOP_LIST = (data) => {
  return request({
    url: "presentation/customer/live/channel/v1/live-shop-list",
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
 * 查询当前订单是不是整单支付
 * id
 */
export const GET_ORDER_EXTEND = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/extend",
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
 * 查询订单支付状态是否成功
 * id
 */
export const GET_ORDER_TRADE_DETAIL = (data) => {
  return request({
    url: "presentation/app/v1/trade/detail",
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

// 创建订单

/**
 * 创建 商品/服务 订单
 * @param {{}} data
 * @returns
 */
export const CREATE_ORDER = (data) => {
  return request({
    url: "presentation/app/v2/trade/create",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      sourceOrderType: "5",
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    errShow: false,
    loading: false,
    useSelfLoading: true,
  });
};
// 创建订单

/**
 * 创建 商品/服务 订单
 * @param {{}} data
 * @returns
 */
export const CREATE_ORDERv3 = (data) => {
  return request({
    url: "presentation/app/v3/trade/create",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      sourceOrderType: "5",
      ...data,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    errShow: false,
    loading: false,
    useSelfLoading: true,
  });
};
/**
 * 获取售后单寄回商家收货地址信息
 * @returns {Promise<unknown>}
 * @constructor
 */
export const GET_SEND_BACK_ADDRESS = (data) => {
  return request({
    url: "presentation/customer/app/v2/afterSale/sendBackAddress",
    method: "POST",
    data: {
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
 * 再来一单
 * @returns
 */
export const CHECK_STATUS = (data) => {
  return request({
    url: "presentation/app/v1/cart/batchAdd",
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

/* 
  收货后-退款计算金额

*/
export const CALCULATE_MONEY = (data) => {
  return request({
    url: "presentation/customer/app/v1/afterSale/calculate",
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
/* 
  联想搜索词
*/
export const SEARCH_ASSOCIATE = (data) => {
  return request({
    url: "presentation/customer/app/commodity/v2/associate",
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

/* 
  查询门店详情信息
*/
export const FETCH_SHOP_DETAIL = (data) => {
  return request({
    url: "presentation/customer/app/mall/v1/shop/detail",
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
 * 确认订单页面-获取自提信息
 */
export const GET_SELFTAKE_INFO = (data) => {
  return request({
    url: "presentation/customer/app/v1/order/selfCheckout",
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
 * 联系骑士获取隐私号
 */
export const POST_SECRETNO = (data) => {
  return request({
    url: "presentation/customer/online-offline/v1/order/secretNo",
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
 商品详情胖豆
 **/

export const postPdInfo = (data = {}) => {
  return request({
    url: `presentation/customer/goods/getScore`,
    data,
    method: "POST",
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
  });
};
/**
 * 获取门店在售宠物
 */
export const GET_SHOP_INLIST = (data = {}) => {
  return request({
    url: "presentation/customer/app/mall/v2/mall-living-pets",
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
 * 获取门店以及城市列表
 * @param 
 * {
 *   "lng": "30.2741",
     "lat": "120.1551",
     "bizType": 1,
     "channelType":1
 * }
 */
export const GET_CITY_SHOP_LIST = (data = {}) => {
  return request({
    url: "presentation/customer/applet/shop/districtListByCity",
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
 * 获取所有订单列表
 * @param 
 */
     export const GET_SEARCH_ORDER_LIST= (data = {}) => {
      return request({
        url: "presentation/customer/online-offline/v1/order/search",
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
// 热词搜索
export const GET_HOT_WORD = (data = {}) => {
  return request({
    url: "cpp-home/v2/hot/word",
    method: "POST",
    data
  });
};
