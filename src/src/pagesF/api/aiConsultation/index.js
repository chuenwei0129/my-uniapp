// import store from "@/store";
import { Http } from "../../../utils/http";
const { request } = new Http();

/**
 * 提交病情描述：智能问诊义诊
 */
export const aiSubmitMessageQuick = (data) => {
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

/**
 * 宠物症状模型列表
 */
export const getSymptomModel = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/consultation/pet/symptomModel",
    method: "POST",
    gw: false,
    loading: false,
    header: {
      os: 2,
    },
  });
};

/**
 * 附近门店
 */
export const getStorePage = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/store/near/storePage",
    method: "POST",
    gw: false,
    loading: false,
    header: {
      os: 2,
    },
  });
};

/**
 * 宠物近期是否分娩弹窗
 */
export const getPopUp = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/consultation/pet/popUp",
    method: "POST",
    gw: false,
    loading: false,
    header: {
      os: 2,
    },
  });
};

/**
 * 添加宠物近期分娩信息
 */
export const getDeliver = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/consultation/pet/recent/deliver",
    method: "POST",
    gw: false,
    loading: false,
    header: {
      os: 2,
    },
  });
};

/**
 * ai问诊报告详情
 */
export const getAiDetail = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/consultation/report/detail",
    method: "POST",
    gw: false,
    loading: false,
    // header: {
    //   os: 2,
    // },
  });
};

/**
 * 根据描述分析病症
 */
export const identifySymptom = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/disease/ai/symptom",
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
 * @param {*} params
 * @returns
 */
export const getPetList = (params,data) => {
  return request({
    url: `cpp-user-management/v2/user-pet/list/${params.userId}?queryPetLifeCycle=true`,
    method: "GET",
    header: {},
    loading: false,
  });
};

// 判断能否智能问诊判断
export const isGoToAIApi = () => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/inquiryCheck`,
    method: "POST",
    header: {},
    loading: false,
  });
};
// 联系客服记录数据
export const noticeMakeCallApi = () => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/contactService`,
    method: "POST",
    header: {},
    loading: false,
  });
};


/**
 * 收集宠物所处时期弹窗展示与否
 * @param
 */
export const getPetPeriodPop = (data) => {
  return request({
    url: `pet-growth-diary/v1/pet/popUp`,
    method: "POST",
    data,
    header: {},
    loading: false
  });
};


/**
 * 确认宠物所处时期弹窗展示与否
 * @param
 */
export const confirmPetPeriodPop = (data) => {
  return request({
    url: `pet-growth-diary/v1/pet/UpdateSpecialPeriod`,
    method: "POST",
    header: {},
    data,
    loading: false,
  });
};
