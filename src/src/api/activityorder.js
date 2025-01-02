import { Http } from "../utils/http";
const { request } = new Http();

/**
 * 
 * @title 我的活动订单
 * @ http://cn-dev01-api.henhenchina.com/cpp-customer-order/doc.html#/default/%E6%B4%BB%E5%8A%A8%E8%AE%A2%E5%8D%95/orderListUsingGET
 */

 
//订单列表
export const getOrderList = (data) => {
    return request({
      data,
      url: `cpp-customer-order/v1/activity/orders`,
      method: "GET",
    });
  };
  //  取消订单
  export const setCancelOrder = (orderNo) => {
    return request({
      url: `cpp-customer-order/v1/activity/orders/${orderNo}`,
      method: "PUT",
    });
  };
  //删除订单
  export const setDeleteOrder = (orderNo) => {
    return request({
      url: `cpp-customer-order/v1/activity/orders/${orderNo}`,
      method: "DELETE",
    });
  };
  //申请退款
  export const setRefundOrder = (orderNo) => {
    return request({
      url: `cpp-customer-order/v1/activity/orders/refund/${orderNo}`,
      method: "PUT",
	  neglect: true
    });
  };
	/**
	 * 活动下单
	 * @param data
	 * @returns
	 */
		export const PlaceOrder = (data) => {
			var isAndroid = uni.getSystemInfoSync().platform == 'android'
			return request({
				url: `cpp-customer-order/v1/activity/orders`,
				data: data,
				method: "POST",
				header: {
					"Content-Type": "application/json;charset=UTF-8",
					["os"]: isAndroid ? 0 : 1,
					["channel"] : 'WECHAT_APPLET',
					["fromchannel"]: 'MP'
				},
			});
	};

	//预支付
	export const PrePayOrder = (data) => {
		var isAndroid = uni.getSystemInfoSync().platform == 'android'
		return request({
			url: `cpp-customer-payment/v1/payments/${data.orderNo}/prePay`,
			data: data,
			method: "POST",
			header: {
				"Content-Type": "application/json;charset=UTF-8",
				["os"]: isAndroid ? 0 : 1,
			},
		});
	};
  
	export const OrderPay = (data) => {
		const appId = uni.getAccountInfoSync();
		return request({
			url: `cpp-customer-payment/v1/mp-payments/pay`,
			method: "POST",
			data,
			header: {
				"Content-Type": "application/json;charset=UTF-8",
				["AppId"]: appId.miniProgram.appId
			},
		});
	}

	/**
 * 活动订单详情
 * @param orderNo
 * @returns
 */
export const getOrderDetailData = (orderNo) => {
  return request({
    url: `cpp-customer-order/v1/activity/orders/${orderNo}`,
    method: "GET",
  });
};
/**
 * 获取下单页面数据
 * @param data
 * @returns
 */
 export const getPlaceOrderData = (data) => {
    return request({
      url: `cpp-customer-order/v1/activity/orderConfirm`,
      data: data,
      method: "POST",
    });
};
/**
 * 计算价格
 * @param data
 * @returns
 */
 export const calcOrderAmount = (data) => {
    return request({
      url: `cpp-customer-order/v1/activity/calcOrderAmount`,
      data: data,
      method: "POST",
    });
};
