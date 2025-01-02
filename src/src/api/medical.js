import { Http } from "@/utils/http";
const { request } = new Http();

/**
 * 获取 问诊 预填写数据
 *
 * @param cid
 */
export const GET_CONSULTATION_INFO = (cid) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/getCachePaidConsultationInfo/${cid}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

export const GET_CONSULTATION_INFO_V2 = (data) => {
  return request({
    url: `pet-medical-inquiry/v2/consultation/getCachePaidConsultationInfo`,
    method: 'POST',
    header: {
    },
    data,
    gw: false,
    loading: false,
  });
};

/**
 * 创建 cid
 *
 * */
export const cachePaidConsultationInfo = (data) => {
  return request({
    url: `pet-medical-inquiry/v2/consultation/cachePaidConsultationInfo`,
    method: 'POST',
    data,
    gw: false,
    loading: false,
  })
}
/**
 * 提交 问诊 预填写数据
 */
export const SUBMIT_CONSULT_ORDER = (data, version = 'v1') => {
  let url;
  console.log(`type: ${data.inquiryType}`);
  // 默认专家
  const inquiryType = data.inquiryType ? data.inquiryType : "EXPERT";
  const expertTypes = ["EXPERT", "NUTRITION"];
  if (expertTypes.includes(inquiryType)) {
    url = `pet-medical-inquiry/${version}/consultation`;
  } else {
    url = `pet-medical-inquiry/${version}/consultation/quick`;
  }
  return request({
    url,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 查询 订单 支付流程
 *
 * @param {orderId} data
 */
export const CHECK_ORDER_PAYMENT = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/paymentAssignDoctor`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 *
 * @param data consultationId
 * */
export const CHECK_ORDER_PAYMENT_V2 = (data) => {
  return request({
    url: `pet-medical-inquiry/v2/consultation/consultationPaymentCheck`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 查询 订单 支付流程
 *
 * @param {consultationId} data
 */
export const consultationPaymentCheck = (data) => {
  return request({
    url: `pet-medical-inquiry/v2/consultation/consultationPaymentCheck`,
    method: 'POST',
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
    useSelfLoading: true,
  });
};

/**
 * 获取当前用户usergroupId
 * */
export const acquireUserRyGroup = (data = {}) => {
  return request({
    url: `pet-medical-inquiry/v1/user/acquireUserRyGroup`,
    method: 'POST',
    data,
    gw: false,
    loading: false,
  });
};
/**
 * 编辑宠物档案页面按钮：智能问诊
 */
export const aiConsultationPost = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/consultation/ai",
    method: "POST",
    gw: false,
    loading: false,
    header: {
      os: 2,
    },
  });
};