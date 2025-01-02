import { Http } from "@/utils/http";
const { request } = new Http();

export const MALL_APP_ID = "1729776648698531840";
export const MALL_PLATFORM_ID = "1699310123233079297";

/**
 * 商城订单列表查询
 * @param {*} data
 * @returns
 */
export const MALL_ORDER_LIST = (data) => {
  return request({
    url: "presentation/customer/online-offline/v1/order/page",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 订单详情查询
 * @param {*} data
 * @returns
 */
export const MALL_ORDER_DETAIL = (data) => {
  return request({
    url: "presentation/customer/online-offline/v1/order/detail",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 获取预约时间
 */
export const GET_RESERVATION_TIME = (data) => {
  return request({
    url: "presentation/customer/applet/reservation/list/timeslot",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
/**
 * 创建预约看宠
 */
export const CREATE_RESERVATION = (data) => {
  return request({
    url: "presentation/customer/applet/reservation/createLiveReservation",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      channelSource: 2,
      ...data,
    },
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
 * 查询预约须知和用户协议
 */
export const GET_NEEDKNOW = (data) => {
  return request({
    url: "presentation/customer/applet/reservation/view/risk/reminder",
    method: "POST",
    data: {
      appId: MALL_APP_ID,
      ...data,
    },
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
 商品是否收藏
 **/
export const isCollectedGoods_livebody = (data = {}) => {
  return request({
    url: "presentation/customer/collect/v1/livebody/isCollected",
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
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
 * 获取活体收藏数量
 * @param {*} data
 * @returns
 */
export const GET_COLECT_TOTAL_livebody = (data) => {
  return request({
    url: "presentation/customer/collect/v1/livebody/collectedNum",
    method: "POST",
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 商品收藏
 **/
export const collectGoods_livebody = (data = {}) => {
  return request({
    url: "presentation/customer/collect/v1/livebody/collect",
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
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
 取消商品收藏
 **/
export const unCollectGoods_livebody = (data = {}) => {
  return request({
    url: "presentation/customer/collect/v1/livebody/cancel",
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
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
 活体商品详情
 **/
export const getGoodsDetail_livebody = (data = {}) => {
  return request({
    url: `presentation/customer/live/v1/dog-cat-live-detail`,
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
    method: "POST",
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
    use500Error: true,
    use500ShowToast: true,
  });
};
/**
 * 查询骑手位置
 */
export const GET_COURIER_LOCATION = (data) => {
  return request({
    url: "presentation/customer/online-offline/v1/order/transporter/position",
    method: "POST",
    data,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

export const postSourceIdFindPet = (data = {}) => {
  return request({
    url: `presentation/customer/app/pet/v1/sourceIdFindPet`,
    data: {
      platformId: MALL_PLATFORM_ID,
      appId: MALL_APP_ID,
      ...data,
    },
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
 * 查询骑手位置
 */
export const getPetClassify = (data) => {
  return request({
    url: "presentation/customer/goods/v1/getPetClassify",
    method: "POST",
    data,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 查询优质评价（排序后的前两条） & 评价总数（商品详情页）
 */
export const GET_QUALITY_COMMENTS = (data) => {
  return request({
    url: "presentation/customer/content/comment/queryTopCommentsByItemId",
    method: "POST",
    data,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};

/**
 * 查询spu下sku所有评价（商品详情页）
 */
export const GET_SPU_COMMENTS = (data) => {
  return request({
    url: "presentation/customer/content/comment/queryCommentsByItemId",
    method: "POST",
    data,
    header: {
      ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: true,
    loading: false,
  });
};
