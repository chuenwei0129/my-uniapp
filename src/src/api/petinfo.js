import { Http } from "@/utils/http";

//文档地址
//https://alidocs.dingtalk.com/i/nodes/mExel2BLV5vzkOewcQqn1elaJgk9rpMq?cid=58417527825&corpId=ding284d711033d5620abc961a6cb783455b&doc_type=wiki_doc&iframeQuery=utm_medium%3Dim_card%26utm_source%3Dim&utm_medium=im_card&utm_scene=team_space&utm_source=im# 「20240409_活动临时紧急需求」

const { request } = new Http();
export const GET_HEALTH_INFO = (petId) => {
  return request({
    url: `pet-growth-diary/v1/petProfile/health/${petId}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

//指标页：体重
export const GET_WEIGHT_ANALYSIS = (petId) => {
  return request({
    url: `pet-growth-diary/v2/event/weight-analysis/${petId}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

//修改体型
export const GET_WEIGHT_CONFIRM_SHAPE = (data = {}) => {
  return request({
    url: `pet-growth-diary/v1/event/weight/confirm-shape`,
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

//指标页：体重趋势（复用）
export const GET_WEIGHT_CHART = (data = {}) => {
  return request({
    url: `pet-growth-diary/v1/event/weight-chart`,
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

//指标页：其它指标
export const GET_INDICATOR = (petId) => {
  return request({
    url: `pet-growth-diary/v1/petProfile/indicator/${petId}`,
    method: "GET",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

//账单
export const GET_BILL = (data = {}) => {
  return request({
    url: `pet-growth-diary/v1/event/bill`,
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


//获取基础数据 疫苗养宠方式 特殊时期
export const GET_CATEGORY_BATCHITEMS = (data = {}) => {
  return request({
    url: `pet-growth-diary/v2/category/batch/items`,
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
/**
 * 宠物病史
 */
export const GET_PET_CASCADER_HISTORY = (data) => {
  return request({
    url: `pet-growth-diary/v1/category/disease`,
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
 * 宠物档案-弹层-动态同步
 * @param {*} data
 */
export const UPDATE_DYNAMIC = (data) => {
  return request({
    url: `pet-growth-diary/v1/event`,
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
 * 保存健康档案 单个保存
 */
export const HOLD_PETHEALTHRECORD = (data = []) => {
  return request({
    url: `pet-growth-diary/v1/petHealthRecordV2`,
    // url: `pet-growth-diary/v1/category/v2/create/items`,
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
 * 根据记日常mark获取itemInfo
 */
export const GET_ITEM_BYTYPE = (data) => {
  return request({
    url: `pet-growth-diary/v1/category/getItemByType`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

//获取最新健康档案
export const GET_HEALTH_DATA = (data) => {
  return request({
    url: `pet-growth-diary/v1/getHealthRecordAllMark `,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};


//获取宠物所有身形标准---BCS
export const GET_PET_BODY_TYPE = (data) => {
  return request({
    url: `pet-growth-diary/v2/category/create/bcs`,
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
 * 宠物健康-特殊时期
 */
export const GET_SPECIAL_PERIOD = (data) => {
  return request({
    url: `pet-growth-diary/v2/category/items`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
};

//获取宠物养育方式
export const GET_LIFE_STYLE_DATA = (data) => {
  return request({
    url: `pet-growth-diary/v2/category/items`,
    data,
    method: "POST",
    header: {
      // ["content-type"]: "application/json;charset=UTF-8",
    },
    gw: false,
    loading: false,
  });
}
