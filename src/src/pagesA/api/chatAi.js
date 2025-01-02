import { Http } from "@/utils/http";
const { request } = new Http();
// AI问诊出发自定义消息
export const postRegisterMessageApi = (data) => {
  return request({
    // url: `v1/consultation/aiInquiry/questionAnswer`,
    url: `pet-medical-inquiry/v1/consultation/aiInquiry/questionAnswer`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
// AI评论点赞点踩
export const postAICommentApi = (data) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/ai/sheet/comment`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
    use500ShowToast: true,
  });
};
// AI问诊单暂时离开
export const postStepOutApi = (consultationId) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/stepOut`,
    method: "POST",
    data: {
      consultationId,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
// AI问诊单暂时离开后进入
export const postStepOutEndApi = (consultationId) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/stepOutEnd`,
    method: "POST",
    data: {
      consultationId,
    },
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};
//问诊模块名称管理查询接口
export const getTypeModule = (data) => {
  return request({
    data,
    url: "pet-medical-inquiry/v1/consultation/module/name",
    method: "POST",
    gw: false,
    loading: false,
    header: {
      os: 2,
    },
  });
};
