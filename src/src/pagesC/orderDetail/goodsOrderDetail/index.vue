<template>
  <view class="container" @click="closeSubmitMore">
    <view class="nav" v-if="!isShowMap ? true : isShowNav">
      <GoodsNav
        :status="orderDetail.orderStatus"
        :deliveryStatus="deliveryStatus"
        :payEndTime="orderDetail.payEndTime"
        @timeDeadLine="timeDeadLine"
        :cancelReason="orderDetail.cancelReason"
        :deliveryType="deliveryType"
        :estimatedDeliveryTime="estimatedDeliveryTime"
      ></GoodsNav>
    </view>
    <view v-show="isShowMap">
      <MapContainer
        ref="mapContainer"
        :markers="mapMarkers"
        @refreshMarkers="refreshMarkers"
        :distance="mapDistance"
        :is-show-refresh="deliveryStatus == 30"
      />
    </view>
    <view
      class="box"
      :style="{
        paddingBottom: safeBottomPadding,
        paddingTop: isShowMap ? 0 : navHeight,
      }"
    >
      <!--    :style="{ paddingBottom: safeBottomPadding, paddingTop: navHeight }" -->
      <!-- 自提订单信息 -->
      <PickupHeader
        :deliveryInfo="orderDetail.deliveryInfo"
        :shopInfo="orderDetail.shopInfo"
        v-if="
          orderDetail.deliveryInfo && orderDetail.deliveryInfo.deliveryType == 4
        "
      />
      <view
        class="code-wrapper"
        v-if="
          orderDetail.deliveryInfo &&
          orderDetail.deliveryInfo.deliveryType == 4 &&
          orderDetail.orderStatus == 3
        "
      >
        <!-- <image
          v-if="qrCodeUrl.length"
          :src="qrCodeUrl"
          :style="{ width: '308rpx', height: '308rpx', marginBottom: '21rpx' }"
        ></image> -->
        <canvas
          class="fl-row-center"
          id="qrcode"
          canvas-id="qrcode"
          :style="{
            width: '308rpx',
            height: '308rpx',
            marginBottom: '21rpx',
          }"
        ></canvas>
        <view class="code-text">{{ orderDetail.deliveryInfo.pickupCode }}</view>
        <view class="code-intro">到达自提点后请出示二维码 / 提货号</view>
      </view>
      <view
        class="header"
        v-if="[1, 2, 3, 6].includes(orderDetail.deliveryInfo.deliveryType)"
      >
        <view class="header-bar"
          >{{ orderDetail.deliveryInfo.province }}
          {{ orderDetail.deliveryInfo.city }}
          {{ orderDetail.deliveryInfo.county }}

          <text v-if="orderDetail.deliveryInfo.addressName">
            {{ orderDetail.deliveryInfo.addressName }}</text
          >
        </view>
        <view class="header-title">{{ fullAddress }}</view>
        <view class="header-des" v-if="orderDetail.deliveryInfo">{{
          orderDetail.deliveryInfo.name +
          " " +
          orderDetailModel().secretPhone(orderDetail.deliveryInfo.phone)
        }}</view>
        <image
          src="https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/order_detail_header_line.png"
          :style="{ height: '4rpx', width: '100%' }"
          mode="scaleToFill"
        ></image>
      </view>
      <!-- fixd -->
      <view class="goods-box">
        <view class="goods-box-title flx-between">
          <view>
            <img
              v-if="orderDetail.shopInfo.shopType + '' === '1'"
              class="ppyc"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/ppyc1.png"
              alt=""
            />
            <text v-else-if="orderDetail.shopInfo.shopType + '' === '0'">
              {{ orderDetail.shopInfo.shopName }}
            </text>
            <text v-else class="now-shop">
              {{ orderDetail.shopInfo.shopName }}
            </text>
          </view>
          <view>
            <view v-if="!onlineOfflineOrders" class="line-order-box">
              <text class="line-order-box-text">线下订单</text>
            </view>
          </view>
        </view>

        <view v-if="showLiveShopInfo">
          <view
            @click="routerGoodsDetail(bean)"
            v-for="(bean, index) in orderDetail.orderItems"
            :key="index"
          >
            <goodsItem :item="bean"></goodsItem>
            <view
              v-if="
                bean.lastAfterSaleOrderId &&
                orderDetail.afterSaleRefundType !== 2
              "
              class="afterSales"
              @click.stop="$u.debounce(seeAfterSale(bean), 500)"
              >查看售后</view
            >
            <view
              class="afterSales"
              v-else-if="
                bean.availableAfterSale &&
                orderDetail.afterSaleRefundType !== 2 &&
                bean.identifier !== 2
              "
              @click.stop="$u.debounce(applyAfterSale(bean), 500)"
              >申请售后</view
            >
          </view>
        </view>
        <view v-else>
          <liveBodyGoods
            :liveDetailResponse="orderDetail.liveDetailResponse"
            :orgingeItemName="orderDetail.orderItems[0].itemName"
            :price="orderDetail.orderItems[0].price"
          ></liveBodyGoods>
        </view>

        <view
          v-if="orgingeItems.length > 9"
          class="more-btn"
          @click="handleShowMore"
        >
          <template v-if="!showMore">
            收起
            <img
              class="more-btn-icon"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/more-btn-1.png"
              alt=""
            />
          </template>
          <template v-if="showMore">
            查看更多
            <img
              class="more-btn-icon"
              src="https://frontend-cdn.chongpangpang.com/image/medical-mp/goods/more-btn.png"
              alt=""
            />
          </template>
        </view>

        <view
          v-if="isNotLiveDelivery && orderCompleted && !isShowPet"
          class="add-live-box"
          @click="addMyPet"
          >添加到我的宠物</view
        >
      </view>

      <AgreementBox
        v-if="isNotLiveDelivery && agreementObj.code !== 1"
        :onlineAndOffline="onlineOfflineOrders"
        :agreementObj="agreementObj"
        @contract-status="handleContractStatus"
      />

      <view
        class="remark cell start"
        style="padding: 33rpx 23rpx"
        v-if="orderDetail.remark"
      >
        <view class="cell-title">备注</view>
        <view class="cell-des text-right text-left">{{
          orderDetail.remark
        }}</view>
      </view>
      <view class="footer">
        <view class="cell center">
          <view class="cell-title">{{
            orderDetail.source === "43"
              ? isNotLiveDelivery
                ? "商品金额"
                : "订单原价"
              : "商品金额"
          }}</view>
          <goodsPrice
            :salePrice="orderDetail.orderAmount"
            sale-color="#1f1f1f"
            :salePriceIntegerFontSize="29"
            :saleFontWeight="200"
          ></goodsPrice>
        </view>
        <view
          class="cell center"
          v-if="orderDetail.source !== '43' && !isNotLiveDelivery"
        >
          <view class="cell-title">运费</view>
          <goodsPrice
            :salePrice="orderDetail.freight"
            sale-color="#1f1f1f"
            :salePriceIntegerFontSize="29"
            :saleFontWeight="200"
          ></goodsPrice>
        </view>
        <view v-if="hasShopPromotion" class="cell center">
          <view class="cell-title">店铺促销</view>
          <goodsPrice
            :salePrice="orderDetail.totalActivityAmount || 0"
            :salePriceIntegerFontSize="35"
            :saleSignFontSize="23"
            :salePriceDecimalFontSize="23"
            left="-"
          ></goodsPrice>
        </view>
        <view class="cell center">
          <view class="cell-title">{{
            orderDetail.source === "43"
              ? isNotLiveDelivery
                ? "优惠券"
                : "优惠金额"
              : "优惠券"
          }}</view>
          <goodsPrice
            v-if="hasCouponAmount"
            :salePrice="orderDetail.totalCouponAmount || 0"
            :salePriceIntegerFontSize="35"
            :saleSignFontSize="23"
            :salePriceDecimalFontSize="23"
            left="-"
          ></goodsPrice>
          <view v-else> 无 </view>
        </view>
        <view v-if="!isNotLiveDelivery" class="cell center">
          <view class="cell-title">{{
            orderDetail.orderStatus === 1
              ? "应付金额"
              : orderDetail.source === "43"
              ? "实付金额"
              : "实付款"
          }}</view>
          <goodsPrice
            :salePrice="orderDetail.realPayAmount"
            :salePriceIntegerFontSize="35"
            :saleFontWeight="200"
          ></goodsPrice>
        </view>
        <view v-if="orderDetail.score && orderDetail.score > 0">
          <view class="cell center">
            <view class="cell-title">购物返胖豆</view>
            <view class="bean-back" @click="toBeanPage"
              >+{{ orderDetail.score || 0 }}胖豆
              <image
                v-if="[4, 6, 7].includes(orderDetail.orderStatus)"
                class="arrowRight"
                mode="widthFix"
                src="https://frontend-cdn.chongpangpang.com/image/medical-mp/memberV5/arrowRight_red.png"
              ></image
            ></view>
          </view>
          <view class="to-account" @click="toBeanPage">
            <text
              class="txt1"
              v-if="[1, 2, 3, 8, 9].includes(orderDetail.orderStatus)"
              >订单交易完成即可到账</text
            >
            <text
              class="txt1"
              v-else-if="[5, 6].includes(orderDetail.orderStatus)"
              >{{
                orderDetail.orderStatus === 5
                  ? "到店完成核销即可到账"
                  : "可在核销订单查看到账明细"
              }}</text
            >
            <text
              class="txt2"
              v-else-if="[4, 7].includes(orderDetail.orderStatus)"
              >已到账</text
            >
          </view>
          <view class="line-container">
            <view class="line"></view>
          </view>
        </view>

        <view
          class="cell center"
          v-if="orderDetail.source !== '43' && !isNotLiveDelivery"
        >
          <view class="cell-title">配送方式</view>
          <view class="cell-des">{{
            orderDetail.deliveryInfo &&
            orderDetail.deliveryInfo.deliveryType === 4
              ? "到店自提"
              : orderDetail.deliveryInfo.deliveryType === 1
              ? "同城配送"
              : "快递"
          }}</view>
        </view>

        <view
          v-if="isNotLiveDelivery && onlineOfflineOrders"
          class="cell center"
        >
          <view class="cell-title">配送方式</view>
          <view style="font-size: 29rpx; color: #1f1f1f">专车护送</view>
        </view>

        <view
          v-if="isNotLiveDelivery && onlineOfflineOrders"
          class="cell center"
        >
          <view class="cell-title">配送时间</view>
          <view style="font-size: 29rpx; color: #1f1f1f; font-weight: 600"
            >将由门店专员与您电话联系</view
          >
        </view>
        <view class="cell center">
          <view class="cell-title">订单编号</view>
          <view class="u-flex-wrap-reverse fl-row-leftStartNowrap center">
            <view class="cell-des">{{ orderDetail.orderNo }}</view>
            <view class="divider-container">
              <view class="divider"></view>
            </view>
            <view class="cell-title" @click="copy(orderDetail.orderNo)"
              >复制</view
            >
          </view>
        </view>
        <view class="cell center" v-if="orderDetail.source !== '43'">
          <view class="cell-title">提交时间</view>
          <view class="cell-des">{{ orderDetail.orderTime }}</view>
        </view>
        <view
          v-if="isNotLiveDelivery && onlineOfflineOrders && livePayType"
          class="cell center"
        >
          <view class="cell-title">支付时间</view>
          <view class="cell-des">{{ orderDetail.paySuccessTime }}</view>
        </view>
        <view
          v-if="isNotLiveDelivery && onlineOfflineOrders && deliveryTimeShow"
          class="cell center"
        >
          <view class="cell-title">发货时间</view>
          <view class="cell-des">{{
            orderDetail.deliveryInfo.shipmentsTime
          }}</view>
        </view>
        <view
          v-if="isNotLiveDelivery && onlineOfflineOrders && displayDeliveryTime"
          class="cell center"
        >
          <view class="cell-title">签收时间</view>
          <view class="cell-des">{{
            orderDetail.deliveryInfo.signedTime
          }}</view>
        </view>
        <view
          v-if="isNotLiveDelivery && !onlineOfflineOrders"
          class="cell center"
        >
          <view class="cell-title">结算方式</view>
          <view class="cell-des">现金</view>
        </view>
        <!-- <view
          class="cell center"
          v-if="
            ![1, 8, 9].includes(orderDetail.orderStatus)
          "
        >
          <view class="cell-title">支付方式</view>
        
          <view class="cell-des textOverflow">{{
            payName || payTypeEnum[orderDetail.payType]
          }}</view>
        </view> -->
        <!-- 原本显示 -->
        <view
          class="cell center"
          v-if="
            ![1, 8, 9].includes(orderDetail.orderStatus) && !isNotLiveDelivery
          "
        >
          <view class="cell-title">付款时间</view>
          <view class="cell-des">{{
            orderDetail.source === "43"
              ? orderDetail.placeTime
              : orderDetail.paySuccessTime
          }}</view>
        </view>
        <!-- 活体线下订单,订单状态为已完成展示 -->
        <view
          class="cell center"
          v-else-if="!onlineOfflineOrders && isNotLiveDelivery"
        >
          <view class="cell-title">付款时间</view>
          <view class="cell-des">{{
            (orderDetail.source === "43"
              ? orderDetail.placeTime
              : orderDetail.paySuccessTime) || ""
          }}</view>
        </view>
        <view
          class="cell center"
          v-if="isNotLiveDelivery && livePayType && onlineOfflineOrders"
        >
          <view class="cell-title">支付方式</view>

          <view class="cell-des textOverflow">{{
            payName || payTypeEnum[orderDetail.payType]
          }}</view>
        </view>
        <view v-if="isNotLiveDelivery" class="cell center">
          <view class="cell-title">应付金额</view>
          <goodsPrice
            :salePrice="orderDetail.realPayAmount"
            :salePriceIntegerFontSize="35"
            :saleFontWeight="200"
          ></goodsPrice>
        </view>
        <view
          class="cell center"
          v-if="
            orderDetail.deliveryInfo &&
            [7].includes(orderDetail.orderStatus) &&
            orderDetail.deliveryInfo.deliveryType == 4
          "
        >
          <view class="cell-title">提货时间</view>
          <view class="cell-des">{{
            orderDetail.deliveryInfo.signedTime
          }}</view>
        </view>
        <view
          class="cell center"
          v-if="
            deliveryType === 1 &&
            [10, 20, 30, 40, -30, -40, -50, -60].includes(deliveryStatus)
          "
        >
          <view class="cell-title">接单时间</view>
          <view class="cell-des">{{ orderDetail.acceptTime || "" }}</view>
        </view>
        <view
          class="cell center"
          v-if="
            deliveryType === 1 && [30, 40, -50, -60].includes(deliveryStatus)
          "
        >
          <view class="cell-title">取货时间</view>
          <view class="cell-des">{{ orderDetail.fetchTime || "" }}</view>
        </view>
        <view
          class="cell center"
          v-if="deliveryType === 1 && [40].includes(deliveryStatus)"
        >
          <view class="cell-title">送达时间</view>
          <view class="cell-des">{{ orderDetail.finishTime || "" }}</view>
        </view>
        <view
          class="cell center"
          v-if="
            deliveryType === 1 &&
            [10, 20, 30, 40, -30, -40, -50, -60].includes(deliveryStatus)
          "
        >
          <view class="cell-title">配送骑士</view>
          <view class="cell-des">
            {{ orderDetail.deliveryPersonnelName || "" }}
          </view>
        </view>
      </view>
    </view>
    <!-- 达达订单 -->
    <view
      class="goods-bottom fl-row-bet-start"
      :style="{ paddingBottom: safeAreaBottom }"
      v-if="
        deliveryType == 1 &&
        !ORDER_STATUS_LIST['待付款']
          .concat(ORDER_STATUS_LIST['已关闭'])
          .includes(orderDetail.orderStatus)
      "
    >
      <!-- #ifdef MP-WEIXIN -->
      <CustomerService />
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <CustomerServiceH5 />
      <!-- #endif -->
      <view>
        <view
          v-if="btnStatusList.btnGroupOne.includes(deliveryStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            v-if="ORDER_STATUS_LIST['待发货'].includes(orderDetail.orderStatus)"
            class="goods-bottom-button"
            @click="$u.debounce(applyRefund, 500)"
          >
            取消订单
          </view>
          <!-- 拨打电话 -->
          <view
            class="goods-bottom-button"
            @click="contactStore(orderDetail.shopInfo.shopPhone)"
          >
            联系门店
          </view>

          <view class="goods-bottom-button" @click="orderTraceEvents">
            订单追踪
          </view>
        </view>
        <view
          v-else-if="btnStatusList.btnGroupTwo.includes(deliveryStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            class="goods-bottom-button"
            @click="contactStore(orderDetail.shopInfo.shopPhone)"
          >
            联系门店
          </view>
          <view class="goods-bottom-button" @click="contactKnight">
            联系骑士
          </view>
          <view class="goods-bottom-button" @click="orderTraceEvents">
            订单追踪
          </view>
        </view>

        <view
          v-else-if="btnStatusList.btnGroupThree.includes(deliveryStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            v-if="ORDER_STATUS_LIST['待发货'].includes(orderDetail.orderStatus)"
            class="goods-bottom-button content box-btn"
            @click.stop="submitMore"
          >
            更多
          </view>
          <view
            v-else
            class="goods-bottom-button"
            @click="contactStore(orderDetail.shopInfo.shopPhone)"
            >联系门店</view
          >
          <view class="goods-bottom-button" @click="contactKnight">
            联系骑士
          </view>
          <view class="goods-bottom-button" @click="orderTraceEvents">
            订单追踪
          </view>
        </view>
        <view
          v-else-if="btnStatusList.btnGroupFour.includes(deliveryStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            class="goods-bottom-button content box-btn"
            @click.stop="submitMore"
          >
            更多
          </view>
          <view class="goods-bottom-button" @click="contactKnight">
            联系骑士
          </view>
          <view
            class="goods-bottom-button pay"
            @click="$u.debounce(retryBuy, 500)"
          >
            再来一单
          </view>
        </view>
      </view>
    </view>
    <!-- 其他订单 -->
    <view
      v-else-if="!isNotLiveDelivery"
      class="goods-bottom fl-row-bet-start"
      :style="{ paddingBottom: safeAreaBottom }"
    >
      <!-- #ifdef MP-WEIXIN -->
      <CustomerService />
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <CustomerServiceH5 />
      <!-- #endif -->
      <view v-if="orderDetail.source !== '43'">
        <view
          v-if="[1, 12].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            class="goods-bottom-button"
            @click="$u.debounce(cancleOrder, 500)"
          >
            取消订单
          </view>
          <view
            class="goods-bottom-button pay"
            @click="$u.debounce(goPay, 500)"
          >
            去支付
          </view>
        </view>
        <view
          v-else-if="[2].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            class="goods-bottom-button"
            @click="$u.debounce(applyRefund, 500)"
          >
            申请退款
          </view>
        </view>
        <view
          v-else-if="[3].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            v-if="canOrderViewAfterSale"
            class="goods-bottom-button"
            @click="$u.debounce(seeOrderAfterSale, 500)"
          >
            查看售后
          </view>
          <view
            v-if="canOrderAfterSale"
            class="goods-bottom-button"
            @click="$u.debounce(applyOrderAfterSale, 500)"
          >
            申请售后
          </view>
          <view
            v-if="
              orderDetail.deliveryInfo &&
              orderDetail.deliveryInfo.shippingType == 2
            "
            class="goods-bottom-button"
            @click="$u.debounce(seeLogistics, 500)"
          >
            查看物流
          </view>
          <view
            v-if="
              orderDetail.deliveryInfo &&
              orderDetail.deliveryInfo.deliveryType !== 4
            "
            class="goods-bottom-button pay"
            @click="$u.debounce(confirmReceive, 500)"
          >
            确认收货
          </view>
        </view>
        <view
          v-else-if="[4].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            class="goods-bottom-button"
            @tap="$u.debounce(deleteOrder, 500)"
          >
            删除订单
          </view>
          <view
            v-if="canOrderViewAfterSale"
            class="goods-bottom-button"
            @click="$u.debounce(seeOrderAfterSale, 500)"
          >
            查看售后
          </view>
          <view
            v-if="canOrderAfterSale"
            class="goods-bottom-button"
            @click="$u.debounce(applyOrderAfterSale, 500)"
          >
            申请售后
          </view>
          <view
            v-if="showCommentBtn"
            class="goods-bottom-button"
            @tap="$u.debounce(goEvaluatePage, 500)"
            >{{ commentButtonText }}</view
          >
          <view class="goods-bottom-button" @click="$u.debounce(retryBuy, 500)">
            再来一单
          </view>
        </view>
        <view
          v-else-if="[7, 8, 9].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            class="goods-bottom-button"
            @tap="$u.debounce(deleteOrder, 500)"
          >
            删除订单
          </view>
          <view class="goods-bottom-button" @click="$u.debounce(retryBuy, 500)">
            再来一单
          </view>
        </view>
        <view
          v-else-if="[14, 15, 16, 20, 21].includes(orderDetail.orderStatus)"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <!-- <view
            v-if="orderDetail.afterSaleInfo.afterSaleOrderId"
            class="goods-bottom-button"
            @click="$u.debounce(seeAfterSale, 500)"
          >
            查看售后
          </view>
          <view
            v-else
            class="goods-bottom-button"
            @click="$u.debounce(applyAfterSale, 500)"
          >
            申请售后
          </view> -->
          <view
            class="goods-bottom-button"
            @tap="$u.debounce(deleteOrder, 500)"
          >
            删除订单
          </view>
          <view class="goods-bottom-button" @click="$u.debounce(retryBuy, 500)">
            再来一单
          </view>
        </view>
      </view>
    </view>
    <!-- 活体订单 -->
    <AgreementBox
      v-if="isNotLiveDelivery && !onlineOfflineOrders && agreementObj.code == 1"
      :onlineAndOffline="onlineOfflineOrders"
      :agreementObj="agreementObj"
      @contract-status="handleContractStatus"
    />
    <view
      v-if="isNotLiveDelivery && !(!onlineOfflineOrders && orderCompleted)"
      class="goods-bottom fl-row-bet-start"
      :style="{ paddingBottom: safeAreaBottom }"
    >
      <!-- #ifdef MP-WEIXIN -->
      <CustomerService />
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <CustomerServiceH5 />
      <!-- #endif -->
      <view class="u-flex-wrap-reverse fl-row-leftStartNowrap">
        <!-- 待付款、门店备货中，备货完成待配送 -->
        <view
          v-if="pendingStoreStock"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            class="goods-bottom-button"
            @tap="$u.debounce(cancleLiveBodyOrder, 500)"
          >
            取消订单
          </view>
          <view
            class="goods-bottom-button"
            @click="contactStore(orderDetail.shopInfo.shopPhone)"
          >
            联系门店
          </view>
        </view>
        <view
          v-if="goPayBtn"
          class="goods-bottom-button pay"
          @tap="$u.debounce(goPay, 500)"
        >
          去支付
        </view>
        <!-- 待收货、已完成 -->
        <view
          v-if="pendReceiptConfirmationBtn"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            v-if="isGreaterTime"
            class="goods-bottom-button"
            @click="liveBodyOrderAfterSale"
          >
            申请售后
          </view>
          <view
            class="goods-bottom-button"
            @click="contactStore(orderDetail.shopInfo.shopPhone)"
          >
            联系门店
          </view>
          <view class="goods-bottom-button pay" @click="confirmReceive">
            确认收货
          </view>
        </view>

        <!-- 线上交易完成 -->
        <view
          v-if="onlineTransactionCompleted"
          class="u-flex-wrap-reverse fl-row-leftStartNowrap"
        >
          <view
            v-if="isGreaterTime"
            class="goods-bottom-button"
            @click="$u.debounce(liveBodyOrderAfterSale, 500)"
          >
            申请售后
          </view>

          <view
            class="goods-bottom-button"
            @click="contactStore(orderDetail.shopInfo.shopPhone)"
          >
            联系门店
          </view>

          <view
            class="goods-bottom-button"
            @tap="$u.debounce(deleteOrder, 500)"
          >
            删除订单
          </view>
        </view>
        <!-- 订单已取消 -->
        <view v-if="cancelledStatus">
          <view
            class="goods-bottom-button"
            @tap="$u.debounce(deleteOrder, 500)"
          >
            删除订单
          </view>
        </view>
      </view>
    </view>
    <!-- 更多按钮 -->
    <MoreBtn
      v-if="
        btnStatusList.btnGroupThree
          .concat(btnStatusList.btnGroupFour)
          .includes(deliveryStatus) && isMore
      "
      :btnList="btnData"
      :deliveryStatus="deliveryStatus"
      :shopPhone="orderDetail.shopInfo.shopPhone"
      @close-more="submitMore"
      @child-events="childEvents"
      @burialpointevents="burialPointEvents"
      :num="bgNum"
      :class="bgNum ? 'btn-list' : 'btn-list-more'"
      :style="{ bottom: `calc(69rpx + 12rpx + ${safeAreaBottom})` }"
    ></MoreBtn>
    <PopMakePhoneCall
      :show="isPrivacyNumber"
      :phone="localPhoneNo"
      @callprivacyno-events="callPrivacyNoEvents"
      @close="closePop"
    ></PopMakePhoneCall>
    <PopConfirm
      :is-open.sync="isDeletePopShow"
      title="确认删除订单?"
      text="删除后将从你的订单列表移除"
      :dataInfo="orderDetail.orderItems"
      @confirm="deletePopConfirm"
    />
    <PopConfirm
      :is-open.sync="isReceivePopShow"
      title="请确认您已收到货"
      text="确认收货后，平台仍将保障您的权益"
      :dataInfo="orderDetail.orderItems"
      @confirm="receivePopConfirm"
    />
    <PopConfirm
      :is-open.sync="isGoMallPopShow"
      title="提醒"
      text="商品已下架，去看看其他商品吧"
      :dataInfo="orderDetail.orderItems"
      confirmText="逛逛商城"
      @confirm="goMall"
    />
    <CancelOrderPop
      :isOpen.sync="isCancelPopShow"
      :scene="1"
      @confirm="canclePopConfirm"
    ></CancelOrderPop>
    <CancelOrderPop
      :isOpen.sync="isRefundPopShow"
      :scene="2"
      @confirm="refundPopConfirm"
    ></CancelOrderPop>
    <OrderTracking
      v-if="showTrack"
      :show.sync="showTrack"
      :orderDeliveryStatusList="orderDeliveryStatusList"
    ></OrderTracking>

    <ContractInfoPop
      :isOpen.sync="contractPopShow"
      :contractInfo="contractInfo"
      @next="handleNext"
    />

    <u-overlay
      :opacity="0.3"
      :show="showLiveOrderMask"
      :custom-style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(29,33,41,0.5)',
      }"
      @close="handleClose"
    >
      <view class="warp">
        <view class="rect" @tap.stop>
          <image class="img" :src="liveimgUrl" mode="aspectFit"></image>
          <view class="overlay-content">
            <view class="message"
              >萌宠订单仅支持门店售后，你可联系门店咨询</view
            >
            <view class="buttons" @tap.stop>
              <view @click="handleCancel" class="cancel">放弃</view>
              <view class="line"></view>
              <view @click="handleContact" class="concatStore"> 联系门店 </view>
            </view>
          </view>
        </view>
      </view>
    </u-overlay>

    <PaymentPopup
      :show="showPayWay"
      :payWayList="payWayList"
      :selectedPayWay="selectedPayWay"
      @close="closePay"
      @open="openPay"
      @select="handlePayWaySelect"
    />
  </view>
</template>

<script>
import goodsItem from "@/pagesC/orderDetail/componse/goodsItem.vue";
import goodsPrice from "@/components/goodsPrice/index.vue";
import { GET_ORDER_DETAIL } from "@/api/mall";
import {
  MALL_ORDER_DETAIL,
  GET_COURIER_LOCATION,
  postSourceIdFindPet,
} from "@/api/mallV3";
import IconButton from "@/pagesC/components/iconButton/index.vue";
import CellItemNormal from "@/pagesC/components/cellItemNormal/index.vue";
import GoodsNav from "@/pagesC/orderDetail/componse/goodsNav.vue";
import orderDetailModel from "@/pagesC/orderDetail/model";
import PopConfirm from "@/pagesC/components/PopConfirm/index.vue";
import CancelOrderPop from "@/pagesC/components/cancelOrderPop/index.vue";
import { deepClone } from "./utils";
import { CHECK_STATUS, POST_SECRETNO } from "@/api/mallv2";
import PickupHeader from "./components/pickupHeader/index.vue";
import UQRCode from "@/pagesC/components/uqrcodejs/uqrcode";
import MoreBtn from "./components/moreBtn.vue";
import PopMakePhoneCall from "./components/popMakePhoneCall.vue";
import { action_report } from "@/utils/track";
import MapContainer from "@/pagesC/components/mapContainer/index.vue";
import OrderTracking from "./components/orderTracking/index.vue";
import { ORDER_STATUS_LIST } from "../../mallOrderList/const";
import { btnStatusList } from "./components/const";
import { formatTime } from "@/utils/index.js";
import liveBodyGoods from "@/pagesC/orderDetail/componse/liveBodyGoods.vue";
import ContractInfoPop from "../../../pagesC/components/contractInfoPop/index.vue";
import { detailByTrackingNo, getESignH5Link } from "@/api/eSignature";
import AgreementBox from "./components/AgreementBox.vue";
import PaymentPopup from "./components/PaymentPopup";
import CustomerServiceH5 from "./components/CustomerServiceH5/index";

const h5Domain = {
  dev: "https://cn-dev02-shareactivity.chongpangpang.com/#",
  jumpdev: "https://cn-dev02-shareactivity.chongpangpang.com",
  pro: "https://shareactivity.chongpangpang.com/#",
  jumppro: "https://shareactivity.chongpangpang.com",
  pre: "https://cn-test01-shareactivity.chongpangpang.com/#",
};
const env =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "dev"
    : process.env.NODE_ENV === "pre"
    ? "pre"
    : "pro";
export default {
  ///订单状态： 1-待支付、2-待发货、3-待收货、4-已签收、(5-待核销、6-已核销)、7-交易完成、8-交易关闭、
  // 9-已过期、12-支付中、14-退款中、15-已退款、16-退货退款、20-部分退款、21-部分退货退款
  // 测试-达达订单状态：1-待支付、2-门店备货中、3-待派单、4-正在召唤骑士、5-骑士已接单、6-商家已取消配送、7-骑士取消配送、
  // 8-骑士已到店、9-骑士送货中、10-派送异常、物品返回中、11-订单已送达、12-订单已取消、
  // 确认-达达订单状态：-1-待付款、-7-门店备货中、null-待派单 5-待接单、10-待取货、-30-已取消派单、20-骑士已到店、30-骑士送货中
  // -50-派送异常、物品返回中、40-已完成、-40-订单已取消
  components: {
    CancelOrderPop,
    MoreBtn,
    PopMakePhoneCall,
    PopConfirm,
    IconButton,
    CellItemNormal,
    GoodsNav,
    goodsItem,
    goodsPrice,
    PickupHeader,
    MapContainer,
    OrderTracking,
    liveBodyGoods,
    ContractInfoPop,
    AgreementBox,
    PaymentPopup,
    CustomerServiceH5,
  },

  data() {
    return {
      sercretNo: "",
      localPhoneNo: "",
      isPrivacyNumber: false,
      // deliveryStatusTest: 40,
      deliveryTypeTest: true,
      btnData: [
        { id: 1, name: "联系门店" },
        { id: 2, name: "取消订单" },
      ],
      btnList: [
        { id: 1, name: "联系门店" },
        { id: 2, name: "申请售后" },
      ],
      btnListMore: [
        { id: 1, name: "联系门店" },
        { id: 3, name: "删除订单" },
      ],
      orderId: "",
      statusBarHeight: "",
      navHeight: "",
      navBarHeight: "",
      safeAreaBottom: "",
      safeBottomPadding: "",
      orderDetail: orderDetailModel.data,
      isReceivePopShow: false,
      isDeletePopShow: false,
      isRefundPopShow: false,
      isCancelPopShow: false,
      isGoMallPopShow: false,
      showMore: false,
      orgingeItems: [],
      codeSize: "",
      qrCodeUrl: "",
      qrCodeTimer: null,
      payTypeEnum: {
        1: "混合支付",
        2: "微信",
        3: "支付宝",
        4: "云闪付",
        5: "积分兑换",
        6: "现金",
        7: "余额",
        8: "POS",
        9: "微信",
        10: "会员卡支付",
        11: "聚合支付",
        12: "微信",
        13: "支付宝",
        14: "宠胖胖扫码支付",
        15: "美团扫码支付",
        16: "抖音扫码支付",
      },
      score: "",
      isMore: false,
      isShowNav: false,
      payName: "", // 支付方式
      bgNum: true,
      showTrack: false, // 订单追踪显示/隐藏
      deliveryType: null, // 订单物流配送类型
      deliveryStatus: null, // 订单详情状态
      estimatedDeliveryTime: null, // 待派单预计时间
      orderDeliveryStatusList: [], // 订单追踪列表
      mapMarkers: [],
      mapDistance: "",
      ORDER_STATUS_LIST,
      btnStatusList,
      orderStatusList: ORDER_STATUS_LIST,
      isShowPet: false,
      contractPopShow: false,
      contractInfo: {},
      showLiveOrderMask: false,
      liveimgUrl:
        "https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/popovercutePet.png",
      showPayWay: false,
      selectedPayWay: "",
      payWayList: [
        {
          label: "微信支付",
          value: "WX",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/submit_order_wx_pay.png",
        },
        {
          label: "支付宝",
          value: "ZFB",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/medicalorder/pay-alipay.png",
        },
      ],
    };
  },

  mounted() {
    console.log("mounted");
    const windowInfo = uni.getWindowInfo();
    this.navBarHeight = getApp().globalData.navBarHeight + "px";
    this.statusBarHeight = getApp().globalData.statusBarHeight + "px";
    this.safeAreaBottom =
      windowInfo.safeAreaInsets.bottom + uni.upx2px(12) + "px";
    this.safeBottomPadding = windowInfo.safeAreaInsets.bottom + 60 + "px";
    //加载字体文件
    uni.loadFontFace({
      family: "D-DIN-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/order/d_din_bold.ttf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },

  onLoad(option) {
    console.log("onLoadonLoadonLoad:::", option);
    this.orderId = option.orderId;
    //从列表进入 直接弹出订单追踪弹窗
    this.showTrack = Boolean(option?.showPop || "");
  },

  async onShow() {
    if (this.qrCodeTimer) {
      clearTimeout(this.qrCodeTimer);
      this.qrCodeTimer = null;
      console.log("关闭定时器");
    }
    console.log(
      "onShowonShowonShow:::",
      this.orderId,
      getApp().globalData.windowWidth
    );
    await this.loadData();
    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight + "px";
    // #endif

    // #ifdef H5
    this.navHeight = getApp().globalData.h5NavBarFullHeight + "px";
    // #endif

    //如果两行文案需要增加30px，
    console.log(this.orderDetail.orderStatus);
    if (
      (this.orderDetail.orderStatus == 1 ||
        [-10, -20, -30, -40, -50, -60, 40].includes(this.deliveryStatus)) &&
      ![15, 20, 21].includes(this.orderDetail.orderStatus)
    ) {
      if (
        this.orderDetail.cancelReason &&
        this.orderDetail.cancelReason.length > 20
      ) {
        // #ifdef MP-WEIXIN
        this.navHeight = getApp().globalData.navHeight + 30 + "px";
        // #endif
        // #ifdef H5
        this.navHeight = getApp().globalData.h5NavBarFullHeight + 30 + "px";
        // #endif
      } else {
        // #ifdef MP-WEIXIN
        this.navHeight = getApp().globalData.navHeight + 30 + "px";
        // #endif
        // #ifdef H5
        this.navHeight = getApp().globalData.h5NavBarFullHeight + 30 + "px";
        // #endif
      }
    }
    // 活体订单, 顶部导航栏增加副标题(待收货&交易完成),需要增加padding
    const liveBodyPaddList = [
      ...this.orderStatusList["交易完成"],
      ...this.orderStatusList["待收货"],
    ];
    if (
      this.isNotLiveDelivery &&
      liveBodyPaddList.includes(this.orderDetail.orderStatus)
    ) {
      // #ifdef MP-WEIXIN
      this.navHeight = getApp().globalData.navHeight + 21 + "px";
      // #endif

      // #ifdef H5
      this.navHeight = getApp().globalData.h5NavBarFullHeight + 21 + "px";
      // #endif
    }
    console.log("🚀 ~ onShow ~ this.isShowMap:", this.isShowMap);
    this.getBtnList();
    if (this.isShowMap) {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs.mapContainer) {
            // #ifdef MP-WEIXIN
            this.$refs.mapContainer.cluster();
            // #endif

            // #ifdef H5
            this.$refs.mapContainer.resetMarkers();
            // #endif
          }
        });
      }, 10);
    }
    // 活体订单线上订单线下订单,底部padding 增加96rpx
    if (this.isNotLiveDelivery) {
      const windowInfo = uni.getWindowInfo();
      this.safeBottomPadding =
        windowInfo.safeAreaInsets.bottom + 60 + uni.upx2px(96) + "px";
    }
  },
  onHide() {
    console.log("关闭onhide", this.qrCodeTimer);
    if (this.qrCodeTimer) {
      clearTimeout(this.qrCodeTimer);
      this.qrCodeTimer = null;
      console.log("关闭定时器");
    }
  },
  onUnload() {
    console.log("关闭onunload", this.qrCodeTimer);
    if (this.qrCodeTimer) {
      clearTimeout(this.qrCodeTimer);
      this.qrCodeTimer = null;
      console.log("关闭定时器");
    }
  },
  computed: {
    fullAddress() {
      const info = this.orderDetail?.deliveryInfo;
      if (info?.address?.includes(info.city)) {
        return `${info?.address}${info.addressName ?? ""}${
          info.houseNumber ?? ""
        }`;
      } else {
        return `${info.province ?? ""}${info.city ?? ""}${info.county ?? ""}${
          info?.address ?? ""
        }${info.addressName ?? ""}${info.houseNumber ?? ""}`;
      }
    },
    orderItem() {
      const arr = this.orderDetail?.orderItems ?? [];
      return arr.length > 0 ? arr[0] : {};
    },
    hasShopPromotion() {
      return (this.orderDetail?.totalActivityAmount || 0) > 0;
    },
    hasCouponAmount() {
      return (
        this.orderDetail.totalCouponAmount &&
        this.orderDetail.totalCouponAmount > 0
      );
    },
    // 是否可以整单售后
    canOrderAfterSale() {
      return (
        !this.orderDetail.afterSaleInfo &&
        this.orderDetail.orderOperatorResponse?.canAfterSale &&
        this.orderDetail.afterSaleRefundType === 2
      );
    },
    // 是否可以查看整单售后
    canOrderViewAfterSale() {
      return (
        !!this.orderDetail.afterSaleInfo &&
        this.orderDetail.afterSaleRefundType === 2
      );
    },
    hasGift() {
      return this.orderDetail.orderItems.some((e) => {
        return e.identifier === 2 || e.identifier === "2";
      });
    },
    //是否显示地图
    isShowMap() {
      if (this.orderDetail) {
        let deliveryStatus = this.deliveryStatus;
        let deliveryType = this.deliveryType;
        return (
          [10, 20, 30].includes(deliveryStatus) &&
          deliveryType === 1 &&
          ![8, 9, 14, 15, 16].includes(this.orderDetail.orderStatus)
        );
      }
    },
    //付款后待骑手接单
    isShowDeliveryWaitReceive() {
      if (this.orderDetail) {
        return [-7, -8, 1, 5, -5, -10].includes(this.deliveryStatus);
      }
    },
    // 是否为活体
    isNotLiveDelivery() {
      // orderType 035/036为活体订单 035: 高价活体订单 036: 低价活体订单
      // deliveryType 1: 同城配送 2: 快递 3: 到店核销 4: 门店配送(配送到家) 5: 线下门店配送类型(无需收货地址）6:活体订单
      const orderType = this.orderDetail?.orderType || "";
      const { whetherItIsDisplayedOrNot = "" } = this.orderDetail || {};
      const LIVE_DELIVERY_TYPE = ["035"];
      const RETAIL_ORDERS = ["016"];
      const retailOrder =
        RETAIL_ORDERS.includes(orderType) && whetherItIsDisplayedOrNot;
      // 是否是活体类型
      // return this.deliverhuoyType == LIVE_DELIVERY_TYPE;
      return LIVE_DELIVERY_TYPE.includes(orderType) || retailOrder;
    },

    // 获取签署协议对象
    agreementObj() {
      try {
        const imgExhibition = {
          1: { url: "online.png", width: 154 },
          2: { url: "contract.png", width: 123 },
          3: { url: "contract.png", width: 123 },
          4: { url: "loseefficacy.png", width: 98 },
        };

        const singText = {
          1: "请签署",
          2: "已签署",
          3: "已生效",
          4: "已失效",
        };

        const signStatusTextList = {
          1: "签署合同",
          2: "查看合同",
        };

        let { signingStatus, theNameOfTheAgreement = "" } =
          this.orderDetail?.electronicContracts || {};

        let contractURLStr;
        let signStatusText;

        switch (signingStatus) {
          case 1:
            contractURLStr =
              singText[signingStatus] +
              " " +
              "《" +
              theNameOfTheAgreement +
              "》";
            signStatusText = signStatusTextList[1];
            break;
          case 2:
            contractURLStr =
              singText[signingStatus] +
              " " +
              "《" +
              theNameOfTheAgreement +
              "》";
            signStatusText = signStatusTextList[2];
            break;
          case 3:
            contractURLStr =
              "《" +
              theNameOfTheAgreement +
              "》" +
              " " +
              singText[signingStatus];
            signStatusText = signStatusTextList[2];
            break;
          default:
            contractURLStr =
              "《" +
              theNameOfTheAgreement +
              "》" +
              " " +
              singText[signingStatus];
        }

        const { url = "", width } = imgExhibition[signingStatus] || {};

        const resultAgreement = {
          title: contractURLStr,
          url: url,
          width: width,
          code: signingStatus,
          signStatusText: signStatusText,
        };
        return resultAgreement;
      } catch (error) {
        console.log("agreementObj fail:", error);
        return {};
      }
    },

    // 活体支付方式、支付时间展示
    livePayType() {
      // 门店备货中|备货已完成|待收货状态|交易完成状态
      const originStatusArr = [
        ...this.orderStatusList["待收货"],
        ...this.orderStatusList["交易完成"],
        ...this.orderStatusList["待发货"],
      ];
      const orderStatus = this.orderDetail?.orderStatus;
      const result = originStatusArr.includes(orderStatus);
      return result;
    },

    // 发货时间展示
    deliveryTimeShow() {
      // 交易完成|待收货
      const originStatusArr = this.orderStatusList["交易完成"].concat(
        this.orderStatusList["待收货"]
      );
      const result = originStatusArr.includes(this.orderDetail?.orderStatus);
      return result;
    },
    // 签收时间展示
    displayDeliveryTime() {
      // 交易完成
      const originStatusArr = this.orderStatusList["交易完成"];
      const result = originStatusArr.includes(this.orderDetail?.orderStatus);
      return result;
    },

    // 线上线下订单标识
    onlineOfflineOrders() {
      return this.orderDetail.source == "1"; // 43线下、1线上
    },

    // 交易完成状态
    orderCompleted() {
      // 交易完成
      const originStatusArr = this.orderStatusList["交易完成"];
      const result = originStatusArr.includes(this.orderDetail?.orderStatus);
      return result;
    },

    //去支付按钮
    goPayBtn() {
      const { orderStatus } = this.orderDetail;
      return this.orderStatusList["待付款"].includes(orderStatus);
    },

    cancelledStatus() {
      const { orderStatus } = this.orderDetail || {};
      return this.orderStatusList["已关闭"].includes(orderStatus);
    },

    onlineTransactionCompleted() {
      const { orderStatus } = this.orderDetail || {};
      return this.orderStatusList["交易完成"].includes(orderStatus);
    },

    pendReceiptConfirmationBtn() {
      const { orderStatus } = this.orderDetail || {};
      return this.orderStatusList["待收货"].includes(orderStatus);
    },

    pendingStoreStock() {
      const { orderStatus } = this.orderDetail || {};
      return this.orderStatusList["待付款"]
        .concat(this.orderStatusList["待发货"])
        .includes(orderStatus);
    },
    isGreaterTime() {
      // speciesClassification品 种分类 品种分类;1:猫类活体 50:狗  214:水族  460:爬行类活体 835:其他小宠 836:鸟类
      // alienPetType 异宠类型 1:高价值异宠  2:低价值异宠
      const catDogList = [1, 50];
      const otherLiveBody = [836, 835, 460, 214];
      const { orderStatus, liveDetailResponse } = this.orderDetail || {};
      const { alienPetType = "", speciesClassification = "" } =
        liveDetailResponse || {};

      if (!this.isNotLiveDelivery) return false;
      if (
        catDogList.includes(speciesClassification) ||
        (otherLiveBody.includes(speciesClassification) && alienPetType == 1)
      ) {
        return this.orderStatusList["待收货"]
          .concat(this.orderStatusList["交易完成"])
          .includes(orderStatus);
      }
      if (otherLiveBody.includes(speciesClassification) && alienPetType == 2) {
        const currentTime = Date.now();
        const endTime = this.orderDetail.deliveryInfo.signedTime || "";
        if (!endTime) return;
        const date = new Date(endTime);
        const days = 14;

        // 加 14 天
        date.setDate(date.getDate() + days);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        const str = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const formatEndTime = new Date(str);
        return currentTime < formatEndTime;
      }
      return false;
    },
    showLiveShopInfo() {
      const { alienPetType, speciesClassification } =
        this.orderDetail?.liveDetailResponse || {};
      const otherLiveBody = [836, 835, 460, 214];

      return (
        !this.isNotLiveDelivery ||
        (otherLiveBody.includes(speciesClassification) && alienPetType === 2)
      );
    },
    showCommentBtn() {
      // 判断是否显示评论按钮
      // 1 - 单 SKU 去评价
      // 2 - 多 SKU 去评价
      // 3 - 查看评价
      const showCommentButton = this.orderDetail.showCommentButton;
      switch (showCommentButton) {
        case 1:
        case 2:
        case 3:
          return true;
        default:
          return false;
      }
    },
    commentButtonText() {
      // 决定按钮的文本内容
      const showCommentButton = this.orderDetail.showCommentButton;

      switch (showCommentButton) {
        case 1:
        case 2:
          return "去评价";
        case 3:
          return "查看评价";
        default:
          return "";
      }
    },
    isSingleSKU() {
      // 判断是否为单个 SKU
      return this.orderDetail.showCommentButton === 1;
    },
    isMultipleSKU() {
      // 判断是否为多个 SKU
      return this.orderDetail.showCommentButton === 2;
    },
    isViewComments() {
      // 判断是否为查看评价
      return this.orderDetail.showCommentButton === 3;
    },
  },

  methods: {
    // 拨打电话
    contactStore(phone) {
      uni.makePhoneCall({
        phoneNumber: phone,
      });
    },
    // 订单追踪
    orderTraceEvents() {
      this.showTrack = true;
      this.burialPointEvents("Orderdetails_tracking_click");
      // Intra-city
    },
    // 拨打隐私号码弹窗
    closePop(value) {
      this.isPrivacyNumber = value;
    },
    // 更多按钮子组件触发事件
    childEvents(index) {
      if (index == 1) {
        this.applyRefund();
      } else if (index == 2) {
        this.applyOrderAfterSale();
      } else {
        this.deleteOrder();
      }
    },
    // 更多按钮数据
    getBtnList() {
      if ([10, -20, -30, -40].includes(this.deliveryStatus)) {
        return this.btnData;
      } else if (this.deliveryStatus == 40) {
        console.log("订单完成");
        this.bgNum = true;
        this.btnData = this.btnListMore;
      }
    },
    // 是否更多按钮
    submitMore() {
      console.log(123);
      this.isMore = !this.isMore;
    },
    closeSubmitMore() {
      this.isMore = false;
    },
    orderDetailModel() {
      return orderDetailModel;
    },

    // 联系骑士
    async contactKnight() {
      this.burialPointEvents("Orderdetails_contactrider_click");

      try {
        const { data } = await this.isPrivacyNumberEvents();
        console.log("data=...........", data);
        if (data.data.isReal) {
          //真实号码
          // 非隐私号
          const phone = data.data.secretNo;
          this.contactStore(phone);
        } else {
          this.isPrivacyNumber = true;
          // this.localPhoneNo = data.data.secretNo;
          this.localPhoneNo = this.orderDetail.deliveryInfo.phone;
          this.sercretNo = data.data.secretNo;
        }
      } catch (error) {}
    },
    // 埋点
    burialPointEvents(action_name) {
      const userInfo = uni.getStorageSync("storage_info");
      action_report({
        action_name,
        module_name: "Intra-city",
        extend: {
          user_id: userInfo.userId,
        },
      });
    },
    // 拨打隐私号
    callPrivacyNoEvents(value) {
      console.log("隐私号", value);
      this.burialPointEvents("Orderdetails_contactrider_confirmcall_click");
      const phone = this.sercretNo;
      this.contactStore(phone);
    },
    // 是否可以拨打隐私号
    async isPrivacyNumberEvents() {
      // 配送员电话 订单详情 deliveryPersonnelNumber，我的电话deliveryInfo.phone
      // userPhoneNumber: 用户手机号 horsePhoneNumber: 骑士手机号
      const data = {
        userPhoneNumber: this.orderDetail.deliveryInfo.phone,
        horsePhoneNumber: this.orderDetail.deliveryPersonnelNumber,
      };
      const res = await POST_SECRETNO({ ...data });
      // const data = {
      //   code: -1,
      //   sercretNo: "18268280939",
      // };
      return res;
    },
    ///可见刷新加载数据
    async loadData() {
      const orderId = this.orderId;
      const res = await MALL_ORDER_DETAIL({ id: orderId });
      // const res = await GET_ORDER_DETAIL({ orderId: orderId });
      console.log("loadDataloadDataloadData:::", res);
      if (res?.data?.code === 0) {
        this.orderDetail = res?.data?.data ?? {};
        // import("./test.json")
        //   .then((module) => {
        //     const data = module.default;
        //     this.orderDetail = data.data;
        //     console.log(data, "datadddddddddddddddd");
        //   })
        //   .catch((error) => {
        //     console.error("Error loading JSON file:", error);
        //   });
        this.deliveryType =
          this.orderDetail?.deliveryType ||
          this.orderDetail?.deliveryInfo?.deliveryType;
        console.log("orderDetail======", this.orderDetail);
        this.estimatedDeliveryTime = this.orderDetail?.estimatedDeliveryTime;
        this.deliveryStatus = this.orderDetail?.deliveryStatus;
        this.orderDeliveryStatusList =
          this.orderDetail?.orderDeliveryStatusList;
        this.orgingeItems = deepClone(this.orderDetail.orderItems);
        if (this.orderDetail.orderItems.length > 9) {
          this.orderDetail.orderItems = this.orderDetail.orderItems.slice(0, 2);
          this.showMore = true;
        }
        /**
         * 二维码
         */
        if (res?.data?.data.deliveryInfo?.deliveryType == 4) {
          if (res?.data?.data.orderStatus == 3) {
            if (!this.qrCodeUrl) {
              this.drawCode(res?.data?.data.deliveryInfo.pickupCode);
            }
            this.qrCodeTimer = setTimeout(() => {
              this.loadData();
            }, 5000);
          } else {
            clearTimeout(this.qrCodeTimer);
            this.qrCodeTimer = null;
          }
        }
        /**
         * 处理达达配送地图点位,获取骑手位置
         */
        let deliveryStatus = this.orderDetail?.deliveryStatus;
        let deliveryType = this.orderDetail?.deliveryType;
        let myLat = this.orderDetail?.deliveryInfo.lat;
        let myLon = this.orderDetail?.deliveryInfo.lon;
        let shopLat = this.orderDetail?.shopInfo.shopAddressInfo.lat;
        let shopLon = this.orderDetail?.shopInfo.shopAddressInfo.lon;
        if ([10, 20, 30].includes(deliveryStatus) && deliveryType === 1) {
          if (this.qrCodeTimer) {
            clearTimeout(this.qrCodeTimer);
            this.qrCodeTimer = null;
          }
          try {
            const { data } = await GET_COURIER_LOCATION({ id: orderId });
            console.log("🚀 ~ loadData ~ courier:", data.data);
            let markerArray = [
              { latitude: myLat, longitude: myLon },
              { latitude: shopLat, longitude: shopLon },
            ];
            if (!data.data.transporterLng || !data.data.transporterLat) {
              markerArray.push({ latitude: shopLat, longitude: shopLon });
            } else {
              markerArray.push({
                latitude: data.data.transporterLat,
                longitude: data.data.transporterLng,
              });
            }
            this.handleMarkers(markerArray);
            this.qrCodeTimer = setTimeout(() => {
              this.loadData();
            }, 60000);
          } catch (error) {
            console.log("🚀 ~ loadData ~ error:", error);
          }
        } else {
          clearTimeout(this.qrCodeTimer);
          this.qrCodeTimer = null;
        }
        // 支付方式
        this.payName = "";
        const paymentDetailDOList = res?.data?.data.paymentDetailDOList;
        if (paymentDetailDOList && paymentDetailDOList.length > 0) {
          paymentDetailDOList.forEach((item) => {
            this.payName += `${
              this.payName ? "+" + item.payTypeName : item.payTypeName
            }`;
          });
        }
        const showAddBtn = this.orderStatusList["交易完成"].includes(
          this.orderDetail.orderStatus
        );
        if (showAddBtn && this.isNotLiveDelivery) {
          this.showAddPetToOrder();
        }
      } else {
        uni.showToast({
          title: res?.data?.message,
          icon: "none",
        });
      }
    },

    ///复制
    copy(orderNum) {
      console.log(`copy${orderNum}`);
      uni.setClipboardData({
        data: orderNum,
        success: function () {
          uni.showToast({
            title: "已成功复制",
            icon: "none",
          });
        },
        fail: function () {
          uni.showToast({
            title: "复制失败",
            icon: "none",
          });
        },
      });
    },

    ///商品详情
    routerGoodsDetail(bean) {
      const pages = getCurrentPages(); // 获取加载的页面
      const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
      const route = currentPage.route; // 当前页面的路由信息
      if (route == "pagesC/orderDetail/goodsOrderDetail/index") return;
      console.log("商品详情");
      const { itemId, skuId } = bean;
      const shopId = this.orderDetail?.shopInfo?.shopId ?? "";
      uni.navigateTo({
        url: `/pagesC/goodsServiceDetail/index?itemId=${itemId}&shopId=${
          shopId || ""
        }&skuId=${skuId || ""}`,
      });
    },

    /// 再次购买 & 再来一单
    /// 跳转到商品详情，itemId是必传参数，shopId和skuId如果存在，就传，如果不存在，字段不传或者是传空字符串
    async retryBuy() {
      console.log("再来一单:::::", this.orderDetail);

      const { itemId, skuId } = this.orderItem;
      const shopId = this.orderDetail?.shopInfo?.shopId ?? "";

      let skuAddDTOList = [];
      this.orderDetail.orderItems.forEach((item) => {
        if (item.identifier !== 2 && item.identifier !== "2") {
          skuAddDTOList.push({
            skuId: item.skuId,
            skuQty: item.skuQty,
          });
        }
      });
      let shopAddDTOList = [
        {
          shopId: shopId,
          skuAddDTOList: skuAddDTOList,
        },
      ];
      const res = await CHECK_STATUS({
        shopAddDTOList,
      });
      console.log("再来一单:::::", res);
      if (res?.data?.data?.isSuccess) {
        console.log("跳到商品详情:::::", itemId, shopId, skuId);
        // uni.navigateTo({
        //   url: `/pagesC/goodsServiceDetail/index?itemId=${itemId}&shopId=${
        //     shopId || ""
        //   }&skuId=${skuId || ""}`,
        // });
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesC/shoppingCart/index`,
        });
        // #endif
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesC/shoppingCart/index`,
        });
        // #endif
      } else {
        this.isGoMallPopShow = true;
      }
    },
    goMall() {
      console.log("逛逛商城");
      this.isGoMallPopShow = false;
      uni.switchTab({
        url: `/pages/mall/index`,
      });
    },

    ///取消订单
    cancleOrder() {
      console.log("取消订单 - 弹框");
      this.isCancelPopShow = true;
    },
    canclePopConfirm() {
      this.isCancelPopShow = false;
      orderDetailModel.com_cancelOrder(this.orderId, () => {
        console.log("取消订单成功，刷新界面");
        this.loadData();
      });
    },

    ///删除订单
    deleteOrder() {
      console.log("删除订单");
      this.isDeletePopShow = true;
    },
    deletePopConfirm() {
      this.isDeletePopShow = false;
      orderDetailModel.com_deleteOrder(this.orderId);
    },

    ///确认收货
    confirmReceive() {
      console.log("确认收货");
      this.isReceivePopShow = true;
    },
    receivePopConfirm() {
      this.isReceivePopShow = false;
      const { orderType = "" } = this.orderDetail || {};
      const isNavigateEvaluate = orderType === "020";

      orderDetailModel.com_confirmOrder(
        this.orderId,
        isNavigateEvaluate,
        () => {
          // 实物订单才跳转
          setTimeout(() => {
            uni.showToast({
              icon: "none",
              title: "正在前往评价",
            });
          }, 0);
          const navigationParams = this.getNavigationParams();
          if (navigationParams) {
            this.navigateToPage(navigationParams.page, navigationParams.params);
          }
        }
      );
    },

    // 组装跳转参数
    getNavigationParams() {
      const transparentTopBar = 1;
      const {
        orderNo = "",
        storeId = "",
        orderItems = [],
        shopInfo = {},
        orderType = "",
      } = this.orderDetail || {};

      if (this.isMultipleSKU) {
        // 进入评价中心页
        return { page: "center", params: { transparentTopBar } };
      }
      if (this.isSingleSKU) {
        // 发布评价页
        const { shopId = "", shopName = "" } = shopInfo;
        const {
          imageUrl = "",
          skuId = "",
          itemId = "",
          skuName = "",
          itemName = "",
        } = orderItems[0] || {};
        const skuInfo = {
          saleOrderNo: orderNo,
          shopId,
          orderType,
          majorPicture: imageUrl,
          skuId,
          itemId,
          skuName,
          itemName,
          storeId,
          shopName,
        };
        return { page: "submit", params: { skuInfo, transparentTopBar } };
      }
      if (this.isViewComments) {
        // /pagesC/comment/detail?transparentTopBar=1&id=${this.id}&saleOrderNo=xxx&skuId=xxx
        const { skuId = "" } = orderItems[0] || {};
        const params = {
          id: "",
          saleOrderNo: orderNo,
          skuId: skuId,
        };
        return { page: "detail", params: { params, transparentTopBar } };
      }
      return null;
    },

    navigateToPage(page, params) {
      console.log(params, "params");
      const queryString = Object.keys(params)
        .map((key) => `${key}=${JSON.stringify(params[key])}`)
        .join("&");
      console.log(queryString, "queryString");
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/comment/${page}?${queryString}`,
      });
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesC/comment/${page}?${queryString}`,
      });
      // #endif
    },

    ///查看物流
    seeLogistics() {
      console.log("查看物流");
      orderDetailModel.com_seeLogistics(this.orderId);
    },

    ///申请退款
    applyRefund() {
      console.log("申请退款 - 弹框");
      this.isRefundPopShow = true;
    },
    refundPopConfirm(reason, additionalReason) {
      console.log("reason::", reason);
      console.log("orderItem::", this.orderItem);
      this.isRefundPopShow = false;
      orderDetailModel.com_applyRefund(
        this.orderId,
        this.orderItem,
        reason.reason,
        reason.additionalReason,
        this.orderDetail.payAmount
      );
    },

    // 申请整单售后
    applyOrderAfterSale() {
      console.log("售后单=>>>>>>");
      if (this.orderDetail.sourceChannel === 1) {
        uni.showToast({
          title: "新人活动商品不支持退货退款",
          icon: "none",
        });
        return;
      }
      orderDetailModel.com_applyAfterSale(
        this.orderId,
        this.orderDetail.orderItems,
        this.orderDetail.storeId,
        this.orderDetail.afterSaleRefundType,
        this.hasGift
      );
    },

    ///申请售后
    applyAfterSale(item) {
      console.log("申请售后 - 跳界面");
      if (this.orderDetail.sourceChannel === 1) {
        uni.showToast({
          title: "新人活动商品不支持退货退款",
          icon: "none",
        });
        return;
      }
      // 赠品不支持售后
      if (item.identifier === 2) {
        uni.showToast({
          title: "抱歉，由于您不满足条件，无法申请退款。",
          icon: "none",
        });
        return;
      }
      // #ifdef MP-WEIXIN
      orderDetailModel.com_applyAfterSale(
        this.orderId,
        [item],
        this.orderDetail.storeId,
        this.orderDetail.afterSaleRefundType,
        this.hasGift
      );
      // #endif
      // #ifdef H5
      console.log("this.orderDetail::", this.$dsBridge, [item]);
      localStorage.setItem("getOrderItems", JSON.stringify([item]));
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesC/selectAfterSaleType/index?orderId=${this.orderId}&storeId=${this.orderDetail.storeId}&afterSaleRefundType=${this.orderDetail.afterSaleRefundType}&hasGift=${this.hasGift}`,
      });
      // #endif
    },

    ///查看售后
    seeAfterSale(item) {
      orderDetailModel.com_seeAfterSale(item.lastAfterSaleOrderId);
    },

    seeOrderAfterSale() {
      orderDetailModel.com_seeAfterSale(
        this.orderDetail.afterSaleInfo.afterSaleOrderId
      );
    },

    ///倒计时结束，刷新界面
    timeDeadLine() {
      this.loadData();
      console.log("timeDeadLine倒计时结束，刷新界面:::");
    },

    ///去支付
    goPay() {
      // #ifdef MP-WEIXIN
      console.log("去支付");
      // this.requestWxPay(this.orderDetail.orderNo, this.orderItem.skuName, this.orderDetail.realPayAmount);
      orderDetailModel.com_requestWxPay(
        this.orderDetail.orderNo,
        this.orderItem.skuName,
        this.orderDetail.realPayAmount,
        this.orderId,
        this.orderDetail.totalCouponAmount || 0,
        this.orderDetail.totalActivityAmount || 0,
        "",
        () => {
          ///支付成功或失败，都刷新界面
          console.log("支付成功2");
          // 支付成功 或 失败，都刷新界面
          setTimeout(() => {
            this.loadData();
          }, 100);
        },
        () => {
          console.log("支付失败1");
          setTimeout(() => {
            this.loadData();
          }, 100);
        }
      );
      // #endif
      // #ifdef H5
      this.showPayWay = true;
      // #endif
    },

    //查看更多
    handleShowMore() {
      if (this.orderDetail.orderItems.length > 2) {
        this.orderDetail.orderItems = this.orderDetail.orderItems.slice(0, 2);
        this.showMore = true;
      } else {
        this.orderDetail.orderItems = this.orgingeItems;
        this.showMore = false;
      }
    },

    drawCode(url) {
      console.log("1111");
      var that = this;
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置二维码内容
      qr.data = url;
      // 设置二维码大小，必须与canvas设置的宽高一致
      qr.size = uni.upx2px(308);
      // 调用制作二维码方法
      qr.make();
      // 获取canvas上下文
      var canvasContext = uni.createCanvasContext("qrcode", this); // 如果是组件，this必须传入
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      setTimeout(() => {
        qr.drawCanvas();
        setTimeout(() => {
          uni.canvasToTempFilePath(
            {
              canvasId: "qrcode",
              success: (res) => {
                console.log("二维码", res.tempFilePath);
                that.qrCodeUrl = res.tempFilePath;
              },
              fail: (err) => {
                console.error("二维码 err, ", err);
              },
            },
            that
          );
        }, 1000);
      }, 100);
    },
    // 跳转胖豆主页
    toBeanPage() {
      const str = "/integral/index?transparentTopBar=1";
      const status = this.orderDetail.orderStatus;
      if ([4, 6, 7].includes(status)) {
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${h5Domain[env]}${str}`,
        });
        // #endif
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: "/pagesE/guideApp/index?type=1",
        });
        // #endif
      }
    },
    /**
     * 自提门店超出范围判断 传入的 lat1, lng1
     */
    handleDistance(pointA, pointB) {
      // let lat1 = pointA.latitude;
      // let lng1 = pointA.longitude;
      let { latitude: lat1, longitude: lng1 } = pointA;
      let { latitude: lat2, longitude: lng2 } = pointB;

      // let lat2 = "";
      // let lng2 = "";
      return new Promise((resolve, reject) => {
        // lat2 = res.latitude;
        // lng2 = res.longitude;
        let rad1 = (lat1 * Math.PI) / 180.0;
        let rad2 = (lat2 * Math.PI) / 180.0;
        let a = rad1 - rad2;
        let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
        let s =
          2 *
          Math.asin(
            Math.sqrt(
              Math.pow(Math.sin(a / 2), 2) +
                Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)
            )
          );
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        s = s.toString();
        if (s.indexOf(".") > -1) {
          s = s.split(".")[0] + "." + s.split(".")[1].substring(0, 3);
        } else {
        }
        resolve(s);
      });
    },
    /**
     * 地图点位加载
     */
    async handleMarkers(poiarr) {
      let ratio = 390 / getApp().globalData.windowWidth;
      console.log("🚀 ~ handleMarkers ~ ratio:", ratio);
      let markers = [
        {
          id: 1,
          latitude: poiarr[0].latitude,
          longitude: poiarr[0].longitude,
          width: 28 / ratio,
          height: 28 / ratio,
          title: "我的",
          iconPath:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/mylocation.png",
          zIndex: 1,
        },
        {
          id: 2,
          latitude: poiarr[1].latitude,
          longitude: poiarr[1].longitude,
          width: 40 / ratio,
          height: 38 / ratio,
          title: "店铺",
          iconPath:
            "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/store.png",
          zIndex: 2,
        },
      ];
      let courierEnum = {
        "on-way-right":
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/on-way-right.png",
        "on-way-left":
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/on-way-left.png",
        "to-store-left":
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/to-store-left.png",
        "to-store-right":
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/to-store-right.png",
        "in-store-left":
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/in-store-left.png",
        "in-store-right":
          "https://frontend-cdn.chongpangpang.com/image/medical-mp/dada/in-store-right.png",
      };
      console.log(
        poiarr[0].latitude,
        poiarr[2].latitude,
        this.deliveryType,
        this.deliveryStatus
      );
      let courierIconPath = "";
      let directionFlag =
        poiarr[0].latitude - poiarr[2].latitude > 0 ? "right" : "left";
      switch (directionFlag) {
        case "left":
          if (this.deliveryStatus == 10) {
            courierIconPath = courierEnum["to-store-left"];
          } else if (this.deliveryStatus == 20) {
            courierIconPath = courierEnum["in-store-left"];
          } else {
            courierIconPath = courierEnum["on-way-left"];
          }
          break;
        case "right":
          if (this.deliveryStatus == 10) {
            courierIconPath = courierEnum["to-store-right"];
          } else if (this.deliveryStatus == 20) {
            courierIconPath = courierEnum["in-store-right"];
          } else {
            courierIconPath = courierEnum["on-way-right"];
          }
          break;
      }
      markers.push({
        id: 3,
        latitude: poiarr[2].latitude,
        longitude: poiarr[2].longitude,
        width:
          this.deliveryStatus == 10
            ? 158 / ratio
            : this.deliveryStatus == 20
            ? 174 / ratio
            : 142 / ratio,
        height:
          this.deliveryStatus == 10
            ? 104 / ratio
            : this.deliveryStatus == 20
            ? 104 / ratio
            : 104 / ratio,
        title: "骑手",
        iconPath: courierIconPath,
        zIndex: 999,
      });
      let distance = await this.handleDistance(
        { latitude: poiarr[0].latitude, longitude: poiarr[0].longitude },
        { latitude: poiarr[2].latitude, longitude: poiarr[2].longitude }
      );
      console.log("🚀 ~ handleMarkers ~ distance:", distance);
      if (distance < 1) {
        distance = distance * 1000 + "m";
      } else {
        distance = distance + "km";
      }
      console.log("🚀 ~ handleMarkers ~ distance:", distance, markers);
      this.mapDistance = distance;
      this.mapMarkers = markers;
    },
    refreshMarkers() {
      this.loadData();
      this.$nextTick(() => {
        if (this.$refs.mapContainer) {
          // #ifdef MP-WEIXIN
          this.$refs.mapContainer.cluster();
          // #endif

          // #ifdef H5
          this.$refs.mapContainer.resetMarkers();
          // #endif
        }
      });
    },

    /**
     * 处理合同状态
     * 根据订单详情中的电子合同状态，决定是否显示或操作合同
     */
    handleContractStatus() {
      // 如果订单详情或电子合同信息不存在，则不执行后续逻辑
      // if (!this.orderDetail || !this.orderDetail.electronicContracts) {
      //   return;
      // }

      const { signingStatus = 1 } = this.orderDetail.electronicContracts || {};
      const { deliveryInfo = {} } = this.orderDetail;
      // 根据电子合同状态，执行相应的操作
      // 待签署（1-在线签署标签）、已签署未付款（2-查看合同标签）、已签署已付款（3-查看合同标签）、已签署订单关闭（4-已失效标签）
      switch (signingStatus) {
        case 1:
          this.contractInfo = { ...deliveryInfo };
          this.signOnlineFun();
          break;
        case 2:
          this.viewAgreement();
          break;
        case 3:
          this.viewAgreement();
          break;
        case 4:
          break;
        default:
          "";
      }
    },

    /**
     * 查看合同
     * 检查订单详情和电子合同信息，准备查看合同内容
     */
    viewAgreement() {
      try {
        // 如果订单详情或电子合同信息不存在，则不执行后续逻辑
        if (!this.orderDetail || !this.orderDetail.electronicContracts) {
          return;
        }
        const { contractURL = "", signingStatus = "" } =
          this.orderDetail.electronicContracts || {};

        // 签署状态 1:未签名(需要签署) 2:已签名未付款(查看合同) 3:已签名(查看合同) 4:已签名订单关闭(失效状态不可查看)
        const passStatus = [2, 3];
        const passStatusFlag = passStatus.includes(signingStatus);
        if (!contractURL && !passStatusFlag) return;

        this.previewWechat(contractURL);
      } catch (err) {
        throw new Error(err);
      }
    },

    // 添加到我的宠物
    addMyPet() {
      // parentCategoryId  类型
      // categoryId: 品种
      try {
        let {
          gender = "",
          birthDay = new Date(),
          speciesClassification = "",
          liveSpeciesId = "",
          secondCategoryName = "",
        } = this.orderDetail.liveDetailResponse || {};

        const sourceId = this.orderDetail.orderId || "";
        const shopId = this.orderDetail?.shopInfo?.shopId ?? "";
        const url = `/pagesD/petInfo/index?enterType=createliving&transparentTopBar=1&sourceId=${sourceId}&parentCategoryId=${speciesClassification}&sex=${gender}&birth=${formatTime(
          birthDay
        )}&categoryId=${liveSpeciesId}&categoryName=${secondCategoryName}&shopId=${shopId}`;
        uni.navigateTo({
          url: url,
        });
      } catch (e) {
        console.log(e);
      }
    },

    async showAddPetToOrder() {
      try {
        if (!this.orderDetail || !this.orderDetail.orderId) {
          return false;
        }
        const params = {
          sourceId: this.orderDetail.orderId,
        };
        const result = await postSourceIdFindPet(params);
        if (result.data.data) {
          this.isShowPet = result.data.data.isAddPet;
        }
      } catch (err) {
        console.error("Error in showAddPetToOrder:", err);
        this.isShowPet = false;
      }
    },

    // 在线签署,填写信息弹框
    signOnlineFun() {
      this.contractPopShow = true;
    },
    // 签署电子合同
    async handleNext(data) {
      try {
        console.log(data);
        const cartSkuLInfo = this.orderDetail?.liveDetailResponse || {};
        const liveInForId = cartSkuLInfo?.liveInForId || "";
        const { speciesClassification, alienPetType = "" } = cartSkuLInfo;
        const { storeId, orderNo, orderId, realPayAmount } = this.orderDetail; // 活体门店id
        let numberSpeciesClassification = Number(speciesClassification);
        if (isNaN(numberSpeciesClassification)) {
          numberSpeciesClassification = "";
        }
        const liveType = [1, 50].includes(numberSpeciesClassification)
          ? "LIVE_ORDER_DOG_CAT_PET"
          : numberSpeciesClassification
          ? "LIVE_ORDER_HIGH_VALUE_OTHER_PET"
          : "";
        const query = {
          liveInfoId: liveInForId || "", // 活体信息ID
          amount: realPayAmount ?? 0, // 活体最小零售价
          storeId: storeId, // 门店id
          signType: liveType, // 给默认值
          phone: data.phone,
          address: data.address,
          customerName: data.customerName,
        };
        uni.showLoading({
          title: "加载中。。。",
        });
        const res = await detailByTrackingNo(query);
        let pages = getCurrentPages(); //页面对象
        const currentPage = pages[pages.length - 1];
        // currentPage.$page.fullPath;
        // const fullPath = "wechat://back";
        let fullPath = "";
        // #ifdef MP-WEIXIN
        fullPath = "wechat://back"; //重定向地址
        // #endif
        // #ifdef H5
        fullPath = "cppsign://liveSign.end"; //重定向地址
        // #endif
        const h5query = {
          storeId: storeId, // 模版关联ID
          signType: liveType,
          fileId: res.data.data.fileId, // 文件id
          liveInfoId: liveInForId, // 关联id
          redirectUrl: fullPath, // 重定向地址
          relateNumber: orderNo, // 订单号
          phone: data.phone,
          relateId: orderId, // 订单id
        };
        const h5res = await getESignH5Link(h5query);
        uni.setStorageSync("signRefRelationId", h5res.data.signRefRelationId);
        // 跳转到合同签字页面
        // #ifdef MP-WEIXIN
        const str = `/pagesA/webView/index?route=${encodeURIComponent(
          h5res.data.data.url
        )}&type=icon`;
        uni.navigateTo({
          url: str,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: h5res.data.data.url,
        });
        // #endif
        uni.hideLoading();
      } catch (err) {
        uni.hideLoading();
        console.error("Error in handleNext:", err);
      }
    },
    // 预览pdf(查看签署合同)
    previewWechat(urlPdf) {
      uni.showLoading({
        title: "正在加载中..",
      });
      uni.downloadFile({
        url: urlPdf,
        success: function (res) {
          var filePath = res.tempFilePath;
          uni.openDocument({
            filePath: filePath,
            showMenu: true,
            success: function (res) {
              console.log("打开文档成功");
              uni.hideLoading();
            },
          });
        },
        complete: function (r) {
          uni.hideLoading();
        },
      });
    },
    // 活体取消订单
    cancleLiveBodyOrder() {
      const item = this.orderDetail?.orderItems[0] || {};
      console.log("申请售后 - 跳界面");
      const orderStatusFlag = this.orderStatusList["待付款"].includes(
        this.orderDetail.orderStatus
      );
      if (orderStatusFlag) {
        this.isCancelPopShow = true;
      } else {
        this.isRefundPopShow = true;
      }
    },
    // 待收货,交易完成状态,申请售后时间
    showOverlayDialog() {
      this.showLiveOrderMask = true;
    },
    handleClose() {
      this.showLiveOrderMask = false;
    },
    handleCancel() {
      this.showLiveOrderMask = false;
    },
    handleContact() {
      this.showLiveOrderMask = false;
      const phone = this.orderDetail.shopInfo.shopPhone || "";
      this.contactStore(phone);
    },
    liveBodyOrderAfterSale() {
      this.showOverlayDialog();
    },
    // 去评价&去查看
    goEvaluatePage() {
      const navigationParams = this.getNavigationParams();
      if (navigationParams) {
        this.navigateToPage(navigationParams.page, navigationParams.params);
      }
    },
    openPay() {},
    closePay() {
      this.showPayWay = false;
    },
    handlePayWaySelect(value) {
      this.showPayWay = false;
      // 其他处理逻辑
      // #ifdef H5
      this.selectedPayWay = value;
      orderDetailModel.com_requestAppPay({
        tradeInfo: {
          orderNo: this.orderDetail.orderNo,
          itemName: this.orderItem.skuName,
          payAmount: this.orderDetail.realPayAmount,
          discountAmount: this.orderDetail.totalCouponAmount || 0,
          promotionAmount: this.orderDetail.totalActivityAmount || 0,
          currentPayType: value,
        },
        successCallback: () => {
          ///支付成功或失败，都刷新界面
          console.log("app支付成功");
          // 支付成功 或 失败，都刷新界面
          setTimeout(() => {
            this.loadData();
          }, 100);
        },
        failCallback: () => {
          ///支付成功或失败，都刷新界面
          console.log("app支付失败");
          // 支付成功 或 失败，都刷新界面
          setTimeout(() => {
            this.loadData();
          }, 100);
        },
      });
      // #endif
    },
  },
  onPageScroll: function (e) {
    if (this.isShowMap) {
      let str = this.navHeight.slice(0, -2);
      if (e.scrollTop >= str) {
        this.isShowNav = true;
      } else {
        this.isShowNav = false;
      }
    }
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
