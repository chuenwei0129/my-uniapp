import { Http } from "@/utils/http";
const { request } = new Http();

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
