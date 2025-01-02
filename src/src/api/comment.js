import { Http } from "@/utils/http";
const { request } = new Http();

/**
 * 发布评价
 */
export const publishComment = (data) => {
  return request({
    url: `presentation/customer/content/comment/publish`,
    method: "POST",
    cqm:true,
    data,
  });
};

// 评价列表-已评价
export const querySkusForAlreadyComment = (data) => {
  return request({
    url: `presentation/customer/content/comment/querySkusForAlreadyComment`,
    method: "POST",
    cqm:true,
    data,
  });
};

// 评价列表-待评价
export const querySkusForWaitComment = (data) => {
  return request({
    url: `presentation/customer/content/comment/querySkusForWaitComment`,
    method: "POST",
    cqm:true,
    data,
  });
};

// 评价详情
export const queryCommentDetail = (data) => {
  return request({
    url: `presentation/customer/content/comment/queryCommentDetail`,
    method: "POST",
    cqm:true,
    data,
  });
};

// 删除评价
export const deleteComment = (data) => {
  return request({
    url: `presentation/customer/content/comment/deleteComment`,
    method: "POST",
    cqm:true,
    data,
  });
};