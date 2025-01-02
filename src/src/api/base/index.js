import store from "@/store";
import { Http } from "../../utils/http";
const { request } = new Http();

//手机号授权注册登录（微信）
/* 
登录文档：http://cn-dev01-yapi.henhenchina.com/project/121/interface/api/35570
*/
export const loginCode = (data) => {
  return request({
    data,
    url: "user-auth-api/v1/applets/wx/decrypt/phone",
    method: "POST",
    header: {},
    loading: false,
    gw: false,
  });
};

//手机号授权注册登录（支付宝）
export const loginCodeAlipay = ({ data }) => {
  return request({
    data,
    url: "user-auth-api/v1/applets/alipay/decrypt/phone",
    method: "POST",
    header: {},
    loading: false,
  });
};

//支付宝获取alipayUserId
export const getAlipayUserId = ({ data }) => {
  return request({
    data,
    url: "user-auth-api/v1/applets/alipay/access/token",
    method: "GET",
    header: {},
    loading: false,
  });
};

//获取用户基本信息
/* 
* @isOrigin 是否强制刷新
http://cn-dev01-yapi.henhenchina.com/project/261/interface/api/36186
 */
export const getUserInfo = async (isOrigin = false, useSelfLoading = false) => {
  try {
    console.log("store", store);
    if (!isOrigin) {
      if (store.state.userInfo.ryId || store.state.userInfo.ryUid) {
        return store.state.userInfo;
      }
    }
    return request({
      url: "cpp-user-management/v2/users/detail",
      method: "GET",
      header: {},
      loading: false,
      useSelfLoading,
    }).then((res) => {
      return res.data;
    });
  } catch (e) {
    throw new Error(e);
  }
};
//获取医生基本信息
/* 
https://cn-dev02-api.henhenchina.com/pet-medical-inquiry/doc.html#/default/%E5%8C%BB%E7%94%9F/getClientDoctorInfoUsingGET/*  
 */
export const getDocDetail = () => {
  return request({
    url: "pet-medical-inquiry/v1/doctor",
    method: "GET",
    header: {},
  });
};

//经纬度查询城市
export const searchUserLocation = ({ data }) => {
  return request({
    data,
    url: "h5-marketing-management/v1/addresses/location",
    method: "GET",
    header: {},
    gw: false,
    loading: false,
  });
};

//获取城市
export const cityData = () => {
  return request({
    url: "h5-marketing-management/v1/addresses/cities",
    method: "GET",
    header: {},
    loading: false,
  });
};

/**
 * 微信小程序端注册、下单和付款事件进行数据归因以及数据分析 （小程序端埋点上报）
 * @param {*} data
 * @returns
 */
export const wxBurying = (data) => {
  return request({
    data,
    url: `cpp-user-management/v1/users/burying`,
    method: "POST",
  });
};

/**
 * 开卡支付
 * @param {*} data
 * @returns
 */
export const openPayCard = (data, type) => {
  return request({
    data,
    url:
      type === "wxpay"
        ? "cpp-customer-payment/v1/membership-cards/pay"
        : "cpp-customer-payment/v1/prePays/membership-cards/pay",
    method: "POST",
  });
};

/**
 * 获取宠物列表
 * @param {*} params
 * @returns
 */
export const getPetList = (params) => {
  return request({
    url: `cpp-user-management/v2/user-pet/list/${params.userId}`,
    method: "GET",
    header: {
      // // ["content-type"]: "application/json;charset=UTF-8",
    },
    // gw: false,
    loading: false,
  });
};

/**
 *
 * @param {*} data
 * @returns
 */
export const getLiveCycle = (data) => {
  return request({
    data,
    url: `pet-growth-diary/v1/liveCycleConfig/liveCycle/${data.petType}/${data.petId}`,
    method: "GET",
    header: {
      // // ["content-type"]: "application/json;charset=UTF-8",
    },
    // gw: false,
    loading: false,
  });
};

/**
 * 获取宠物月龄信息
 * @param {*} data
 * @returns
 */
export const getMonthRecord = (data) => {
  return request({
    data,
    url: `pet-growth-diary/v2/event/month-record`,
    method: "POST",
    header: {
      // // ["content-type"]: "application/json;charset=UTF-8",
    },
    // gw: false,
    loading: false,
  });
};

/**
 * 提交病情描述：专家问诊
 * @param {*} data
 * @returns
 */
export const submitMessage = (data, version = "v1") => {
  return request({
    data,
    url: `pet-medical-inquiry/${version}/consultation`,
    method: "POST",
    gw: false,
    loading: false,
  });
};

/**
 * 查询用户当前问诊单的相关信息（商品、价格、折扣、传递至确认订单）
 * @param {*} data
 * source 平台 “ANDROID” “IOS”
 * inquiryType 问诊类型 EXPERT QUICK
 * checkServiceSheetFlag 是否校验用户是否存在服务中问诊单 true校验，false不校验；默认false
 * @returns
 */
export const checkUserQualification = (data, version = "v1") => {
  return request({
    data,
    url: `pet-medical-inquiry/${version}/consultation/newCheckUserQualification`,
    method: "POST",
    gw: false,
    loading: false,
    header: {
      appVersion: "5.0.9",
    },
  });
};

export const originCheckUserQualification = (data, version = "v1") => {
  return request({
    data,
    url: `pet-medical-inquiry/${version}/consultation/checkUserQualification`,
    method: "POST",
    gw: false,
    loading: false,
    header: {
      appVersion: "5.0.9",
    },
  });
};

/**
 * 提交病情描述：免费义诊（知宠）
 *
 * v2:接口文档
 * POST  /v2/consultation/quick
 *
 * 入参：
 * {
 *   //其他参数沿用老接口现有参数，以下是新增参数
 *
 * }
 *
 * 出参：
 * {
 *     "userGroupId":"xxxx",
 *     "preemptWaitDuration":60,// 当前问诊单类型在问诊池可停留时间
 *     "consultationId":"xxxxxx", // 问诊单id
 *     "deadlineTime":"2024-11-26 15:00:00" // 抢单截止时间
 * }
 *
 *
 */
export const submitMessageQuick = (data, version = "v1") => {
  return request({
    data,
    url: `pet-medical-inquiry/${version}/consultation/quick`,
    method: "POST",
    gw: false,
    loading: false,
    header: {
      os: 2,
    },
  });
};
/**
 * 获取宠物列表
 * @param {*} parentId
 * @returns
 */
export const getPetIndexList = (parentId) => {
  return request({
    url: `cpp-user-management/v1/user-pet/pet/category/${parentId}`,
    method: "GET",
    gw: false,
  });
};

/**
 * 获取宠物详情
 * @param {*} petId
 * @returns
 */
export const getPetDetail = (petId) => {
  return request({
    url: `cpp-user-management/v1/user-pet/detail/${petId}`,
    method: "GET",
    gw: false,
  });
};

/**
 * 标签列表查询
 * 文档地址：https://cn-dev02-api.henhenchina.com/cpp-customer-tool/doc.html#/default/%E5%B7%A5%E5%85%B7%E6%A0%87%E7%AD%BE/getTagListUsingGET
 */
export const getTag = (data) => {
  return request({
    //url: `api-cpp/cpp-customer-tool/v1/consultation/sheet/check:service`,
    url: `cpp-instrument/customer/v1/tag`,
    method: "GET",
    data,
    // header: {
    //   // ["content-type"]: "application/json;charset=UTF-8",
    // },
    gw: false,
    loading: false,
  });
};
/**
 * 获取七牛云tokne
 */
export const getQiNiuToken = () => {
  return request({
    url: `operations-mgt-common-management/v1/file/upload/token`,
    method: "GET",
    gw: false,
    loading: false,
  });
};

/**
 * 获取地址列表
 * @returns
 */
export const getAddressList = () => {
  return request({
    url: "cpp-user-management/v1/user-addresses",
    method: "GET",
    data: {
      pageSize: 100,
    },
    loading: false,
  });
};

export const getAddressListDetail = (userAddressId) => {
  return request({
    url: `cpp-user-management/v1/user-addresses/${userAddressId}`,
    method: "GET",
    loading: false,
  });
};

/**
 * 删除用户地址
 * @param {*} userAddressId
 * @returns
 */
export const delAddress = (userAddressId) => {
  return request({
    url: `cpp-user-management/v1/user-addresses/${userAddressId}`,
    method: "DELETE",
    loading: false,
  });
};

/**
 * 新增收货地址
 * @param {*} data
 * @returns
 */
export const addUserAddress = (data) => {
  return request({
    url: `cpp-user-management/v1/user-addresses`,
    method: "POST",
    data,
    loading: false,
  });
};
/**
 * 编辑收货地址
 * @param {*} userAddressId
 * @param {*} data
 * @returns
 */
export const editAddress = (userAddressId, data) => {
  return request({
    url: `cpp-user-management/v1/user-addresses/${userAddressId}`,
    method: "PUT",
    data,
    loading: false,
  });
};

/**
 * 短链换原始链接
 */

export const parseShortLink = (url) => {
  return request({
    url: "presentation/customer/goods/v2/parseShortLink",
    method: "POST",
    loading: false,
    cqm: true,
    data: {
      shortLink: url,
    },
  });
};
/**
 * 无感获取openid
 */
export const getOpenId = (data) => {
  return request({
    data,
    url: "user-auth-api/v1/applets/wx/code2Session",
    method: "GET",
    loading: false,
  });
};

/**
 *
 * 获取平安来源问诊数据请求
 */

export const getPinganDataRequest = (data) => {
  return request({
    url: `pet-medical-inquiry/outer/consultation/out/sheet/info`,
    method: "POST",
    data,
    gw: false,
    loading: false,
    errShow: false,
  });
};

/**
 * 获取最新健康档案
 */
export const healthFiles = (data) => {
  return request({
    data,
    url: "pet-growth-diary/v1/getHealthRecord",
    method: "POST",
    header: {},
  });
};

/**
 * 宠物健康-元数据（疫苗/驱虫）
 */
export const GET_HEALTH_METADATA = (data) => {
  return request({
    url: `pet-growth-diary/v2/category/create/items`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 获取默认门店列表(无位置情况下)
 */
export const GET_DEFAULT_SHOPLIST = (data) => {
  return request({
    url: `presentation/customer/applet/shop/findNearShopList`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
    cqm: true,
  });
};
