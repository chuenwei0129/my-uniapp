import { Http } from "@/utils/http";
const { request } = new Http();

/**
 * @title 问诊单 文档地址
 * @yapi  https://cn-dev02-api.henhenchina.com/pet-medical-inquiry/doc.html#/default/%E9%97%AE%E8%AF%8A/consultationSheetPageUsingGET
 *
 */

/**
 * @title 问诊单分页查询
 */
export const getSheetsList = (data = {}) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/sheets`,
    method: "GET",
    data,
    gw: false,
    loading: false,
    errShow: false,
  });
};

/**
 * @title 问诊单信息
 */
export const getSheetsDetail = (data = {}) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/sheet/info`,
    method: "GET",
    data,
    loading: false,
  });
};

/**
 * @title 处方药品信息校验接口
 */
export const getCheckMedical = (data = {}) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/${data.diagnosticSheetId}/medical`,
    method: "GET",
    data,
    loading: false,
  });
};

/**
 *
 * 处方分页查询接口
 */

export const getPrescriptionList = (data = {}) => {
  return request({
    url: `pet-medical-inquiry/v1/consultation/diagnostic/page`,
    method: "POST",
    data,
    gw: false,
    loading: false,
    errShow: false,
  });
};
