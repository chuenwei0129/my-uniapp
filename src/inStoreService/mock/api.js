uni.addInterceptor({
  returnValue (res) {
    if (!(!!res && (typeof res === 'object' || typeof res === 'function') && typeof res.then === 'function')) {
      return res
    }
    return new Promise((resolve, reject) => {
      res.then((res) => res[0] ? reject(res[0]) : resolve(res[1]))
    })
  },
})

/**
 * 获取到店服务页资源区数据
 * @function fetchResourceAPI
 * @param {Object} [data={}] - 请求参数对象
 * @param {string} data.cityCode - 必传，城市编码
 * @param {number} data.lng - 必传，经度
 * @param {number} data.lat - 必传，纬度
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchResourceAPI({
 *   cityCode: '110100',
 *   lng: 116.397428,
 *   lat: 39.90923
 * }).then(response => {
 *   console.log(response.data);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
export const fetchResourceAPI = (
  data = {
    cityCode: '110100',
    lng: 0.0,
    lat: 0.0,
  }
) =>
  uni.request({
    url: 'https://run.mocky.io/v3/8c94ec24-3322-4f56-8343-727de7cf5502',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  })

/**
 * 获取优惠券列表数据
 * @function fetchCouponListAPI
 * @param {Object} [data={}] - 请求参数对象
 * @param {number} data.userId - 必传，用户 ID
 * @param {number} data.status - 必传，优惠券状态（例如：5 - 待核销）
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchCouponListAPI({
 *   userId: 12345,
 *   status: 5
 * }).then(response => {
 *   console.log(response.data);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
export const fetchCouponListAPI = (
  data = {
    userId: 0, // 用户 id，这块有改动，不是字符串传数值
    status: 5, // 5 - 待核销
  }
) =>
  uni.request({
    url: 'https://run.mocky.io/v3/f5f16bad-5537-4735-8962-2451155f038f',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  })

/**
 * 获取到店服务组件区数据
 * @function fetchComponentListAPI
 * @param {Object} [data={}] - 请求参数对象
 * @param {number} data.page - 必传，页面标识，2 表示到店服务
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchComponentListAPI({
 *   page: 2
 * }).then(response => {
 *   console.log(response.data);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
export const fetchComponentListAPI = (
  data = {
    page: 2, // 2 - 到店服务
  }
) =>
  uni.request({
    url: 'https://run.mocky.io/v3/a48dc23e-6370-4489-b934-5b68c300fa0d',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  })

  /**
 * 获取到店服务金刚区导航数据
 * @function fetchNavigationAPI
 * @param {Object} [data={}] - 请求参数对象
 * @param {number} data.bizType - 必传，业务场景类型，2 表示到店服务金刚区
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchNavigationAPI({
 *   bizType: 2
 * }).then(response => {
 *   console.log(response.data);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
export const fetchNavigationAPI = (
  data = {
    bizType: 2, // 业务场景-2-到店服务金刚区
  }
) =>
  uni.request({
    url: 'https://run.mocky.io/v3/d135efd6-57ae-4e7b-9240-125ccfa4ab71',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  })

  /**
 * 获取推荐类目数据
 * @function fetchRecommendClassifyAPI
 * @param {Object} [data={}] - 请求参数对象
 * @param {number} data.recommendType - 必传，推荐类型（例如：1 - 类目区）
 * @param {number} data.commodityClassifyType - 必传，商品类型（例如：2 - 服务商品）
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchRecommendClassifyAPI({
 *   recommendType: 1,
 *   commodityClassifyType: 2
 * }).then(response => {
 *   console.log(response.data);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
export const fetchRecommendClassifyAPI = (
  data = {
    recommendType: 1, // 推荐类型 => 1：类目区 2：推荐区 3：资源位
    commodityClassifyType: 2, // 商品类型 => 1：实物商品 2：服务商品 3：活体商品
  }
) =>
  uni.request({
    url: 'https://run.mocky.io/v3/7e13fa80-f8cd-4153-b61f-a2fb1a8ad63f',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  })

/**
 * 获取商品列表数据
 * @function fetchProductListAPI
 * @param {Object} [data={}] - 请求参数对象
 * @param {number} data.pageNum - 必传，页码
 * @param {number} data.pageSize - 必传，每页大小
 * @param {string} data.cityCode - 必传，城市编码
 * @param {number} data.lng - 必传，经度
 * @param {number} data.lat - 必传，纬度
 * @param {number} data.categoryId - 必传，类目 ID
 * @param {number} data.sortType - 必传，排序类型（例如：1 - 智能排序）
 * @returns {Promise} 返回一个 Promise 对象，包含请求的结果
 * @example
 * fetchProductListAPI({
 *   pageNum: 1,
 *   pageSize: 2,
 *   cityCode: '110100',
 *   lng: 116.397428,
 *   lat: 39.90923,
 *   categoryId: 1,
 *   sortType: 1
 * }).then(response => {
 *   console.log(response.data);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
export const fetchProductListAPI = (
  data = {
    pageNum: 1,
    pageSize: 2,
    cityCode: '', // 必传 城市编码
    lng: 0.0, // 必传 经度
    lat: 0.0, // 必传 纬度
    categoryId: 1, // 必传 类目id
    sortType: 1, // 必传 排序类型: 1、智能排序 2、距离优先 3、销量优先 4、低价优先
  }
) =>
  uni.request({
    url: 'https://run.mocky.io/v3/8909137b-82c8-4b1f-8305-58304a3bb60d',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
  })
