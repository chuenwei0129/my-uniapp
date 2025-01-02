import { Http } from "../utils/http";
const { request } = new Http();
/**
 * @title 用户主页数据
 * @yapi 
 */

 export const GET_USER_INFO_ALL = () => {
  return request({
    url: `cpp-user-management/v1/users/detail`,
    method: "GET",
    // data
  });
}


/**
 * @title 编辑用户信息
 * @yapi http://cn-dev01-yapi.henhenchina.com/project/261/interface/api/581
 */

 export const EDIT_USER_INFO = (data) => {
  const { userId } = uni.getStorageSync("storage_info");
  return request({
    url: `cpp-user-management/v1/users/${userId}`,
    method: "PUT",
    data
  });
}



/**
 * @title 我参与的活动
 * @type值
 *  全部：type=ALL
    已报名：type=ATTENDED
    收藏：type=WANTED
    已取消：type=CANCELED
    已结束：type=FINISH
    待确认：type=PENDING
 * @yapi  http://cn-dev01-yapi.henhenchina.com/project/618/interface/api/24980
 */
  export const GET_ACTIVIITES_LIST = (data) => {
    return request({
      url: `cpp-community-activity/v1/activities/mine`,
      method: "GET",
      data
    });
  }



/**
 * @title 用户基本资料获取
 * @yapi  http://cn-dev01-yapi.henhenchina.com/project/261/interface/api/36186
 */
  export const GET_USER_INFO = () => {
    const { userId } = uni.getStorageSync("storage_info");
    return request({
      // url: `cpp-user-management/v1/user/home/${userId}`,
      url: 'cpp-user-management/v2/users/detail',
      method: "GET",
      // data
    });
  }
  
