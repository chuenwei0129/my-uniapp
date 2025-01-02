import { Http } from "@/utils/http";
const { request } = new Http();
export const getRecords = (data = {}) => {
  return request({
    url: `pet-growth-diary/v2/event/record`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    cqm: false,
    loading: false,
    use500Error: true,
  });
};
