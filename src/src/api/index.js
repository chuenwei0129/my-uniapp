import { Http } from "../utils/http";
const { request } = new Http();

export const getUserInfo = () => {
  return request({
    data,
    url: "operations-mgt-shop-management/v1/locations",
    method: "GET",
    header: {},
  });
};

/**
 * 首页 获取附近门店信息
 * @returns 门店信息
 */
export const GET_TOP_SHOP = (data) => {
  return request({
    url: `presentation/customer/applet/shop/v2/nearby/shop/info`,
    method: "POST",
    cqm: true,
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 获取宠物列表
 */
export const GET_PET_LIST = (params) => {
  return request({
    url: `cpp-user-management/v2/user-pet/list/${params.userId}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    // gw: false,
    loading: false,
  });
};
/**
 * 获取宠物列表V3
 */
export const GET_PET_LIST_V3 = (params) => {
  return request({
    url: `cpp-user-management/v3/user-pet/list/${params.userId}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    // gw: false,
    loading: false,
  });
};
/**
 * 获取医生列表
 */
export const GET_DOC_LIST = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/client/v2/doctors`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 获取医生详情
 */
export const GET_DOC_DETAIL = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/client/doctor`,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 获取评价列表 配合后台接口修改
 */
export const GET_COMMENT_LIST = (data) => {
  return request({
    // url: `api-cpp/operations-mgt-pet-medical-management/v1/comments`,
    url: `pet-medical-inquiry/v1/doctor/comment`,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 获取数据看板
 */
export const GET_DATA = (params) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/user/statistic`,
    method: "GET",
    params,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * @title 城市数据 查询所有地址列表
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/392/interface/api/13346
 */
export const getCityData = () => {
  return request({
    url: "h5-marketing-management/v1/addresses",
    method: "GET",
    header: {},
    gw: false,
  });
};
/**
 * 查询医生是否在线
 */
export const GET_ONLINE_STATUS = (doctorUserId) => {
  return request({
    url: `pet-medical-inquiry/v1/doctor/onlineStatus/${doctorUserId}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 根据宠物id查询宠物详情
 */
export const GET_PET_DETAIL = (params) => {
  return request({
    url: `cpp-user-management/v1/user-pet/identity/card/${params.petId}`,
    method: "GET",
    params,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 修改宠物信息
 */
export const EDIT_PET_DETAIL = (data) => {
  return request({
    url: `cpp-user-management/v2/user-pet/pets/${data.petId}`,
    method: "PUT",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 新增宠物信息
 */
export const ADD_PET_DETAIL = (data) => {
  return request({
    url: `cpp-user-management/v2/user-pet/pets`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 新增宠物信息包括生命周期接口
 */
export const ADD_PETS_SAVE = (data) => {
  return request({
    url: `cpp-user-management/v3/user-pet/pets/save`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: true,
    loading: false,
  });
};
/**
 * 编辑宠物信息查询接口 包括生命周期
 */
export const ADD_USER_PETS_DETAIL = (data) => {
  return request({
    url: `cpp-user-management/v3/user-pet/pets/detail`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 校验专家问诊服务时间和服务次数
 */
export const CAN_EXPERT_ASK = () => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/check/expert/serviceTimeAndTimes`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 所有类型的问诊次数和时间段校验
 */
export const CAN_I_ASK = (inquiryType) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/check/${inquiryType}/serviceTimeAndTimes`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 所有类型的问诊次数和时间段校验v2
 */
export const CAN_I_ASK_V2 = (inquiryType, version = 'v1') => {
  return request({
    url: `pet-medical-inquiry/${version}/consultation/${inquiryType}/WECHAT_XCX/checkUserQualification`,
    method: version === 'v1' ? 'GET' : 'POST',
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
    useSelfToast: true,
  });
};
/**
 * 免费义诊开关
 */
export const CAN_QUICK_ASK = () => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/check/quick/switch`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 获取医疗项配置信息
 */
export const ENTRY_CONFIG = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/medicalItemList`,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 首页入口信息配置
 */
export const ENTR_INFO = () => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/type/basicInfo`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 查询用户优惠券列表
 */

export const GET_COUPON_LIST = (data) => {
  return request({
    url: `cpp-card-coupon-management/v1/coupon/records:search`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["os"]: 2,
    },
    gw: false,
    loading: false,
    use500ShowToast: true,
  });
};

/**
 * 获取优惠券数量
 */
export const GET_COUPON_PACK_QTY = (data) => {
  return request({
    url: `presentation/customer/app/coupon/v1/member/coupon/qty`,
    method: "POST",
    cqm: true,
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

/**
 * 获取优惠券数量
 */
export const GET_COUPON_PACK_List = (data) => {
  return request({
    url: `presentation/customer/app/coupon/v1/pack/list`,
    method: "POST",
    cqm: true,
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

// 获取问诊券的数量
export const GET_COUPON_ADVICE_LIST = (data) => {
  return request({
    url: `presentation/customer/app/coupon/v2/pack/list`,
    method: "POST",
    cqm: true,
    data,
    gw: false,
    loading: false,
  });
};

/**
 * 查询banner信息
 */
export const GET_BANNER_INFO = (data) => {
  return request({
    url: `reach-touch/reach/touch/exhibition/banner/${data.key}`,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 查询过滤后可用优惠券列表
 */
export const GET_COUPON_LIST_IN_POP = (inquiryType) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/${inquiryType}/availableCoupons`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 弹窗查询可用医疗资源
 */
export const GET_RESOURCE_LIST_IN_POP = (inquiryType) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/${inquiryType}/availableResource`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 查询历史病历
 */
export const GET_CASE_LIST = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/petHostoryDiagnostic`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
export const getMxList = (data) => {
  return request({
    url: `presentation/customer/applet/reservation/list`,
    method: "POST",
    data,
    cqm: true,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
export const getMxDetail = (data) => {
  return request({
    url: `presentation/customer/applet/reservation/detail`,
    method: "POST",
    data,
    cqm: true,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
  });
};
/**
 * 查询用户可用卡列表,列表页面
 * {
	"status": "",
	"useBusinessIdentifier": "MEDICAL"
}
 */
export const GET_CARD_LIST = (data) => {
  return request({
    url: `cpp-card-coupon-management/v1/card/records:search`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["os"]: 2,
    },
    gw: false,
    loading: false,
  });
};
/**
 * 智能问诊卡片的答案点击记录上报接口
 * {
	"optionIndex": "选项下标",
	"questionCardUsageRecordId": "问题使用记录ID"
   }
 */
export const CHAT_AIQUEST_CARD_CLICK_UPLOAD = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/question-card/answer-usage-records`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
      ["os"]: 2,
    },
    gw: false,
    loading: false,
  });
};

/**
 * 获取医生筛选标签信息
 */
export const GET_DOCTOR_TAGINFO = (data) => {
  return request({
    url: `cpp-instrument/customer/v1/tag`,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 查询通知消息
 */
export const GET_NOTICE_INFO = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/notice`,
    method: "GET",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 变更通知状态
 */
export const CHANGE_NOTICE = (id, sts) => {
  return request({
    url: `pet-medical-inquiry/v1/notice/${id}/${sts}/status`,
    method: "PUT",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
/**
 * 获取微信认证签名等信息
 * @returns
 */
export function getWxSign(id) {
  return request({
    method: "GET",
    url: `api-cpp-gw/cpp-common-management/v1/publicWx/sign?url=${encodeURIComponent(
      window.location.href
    )}&wxAppId=${id}`,
    wxSign: true,
  });
}
/**
 * 根据渠道码code查询schema
 */
export const getSchemaByCode = (data) => {
  return request({
    url: `presentation/customer/promotion-plan/v1/getSchemaByCode`,
    method: "POST",
    data,
    cqm: true,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
