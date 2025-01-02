import { Http } from "../utils/http";
const { request } = new Http();

export const postTracking = (data) => {
  return request({
    url: `cpp-databricks/v3/collect`,
    method: "POST",
    data,
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    useSelfLoading: true,
    loading: false,
  });
};
