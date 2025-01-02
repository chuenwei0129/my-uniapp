<template>
  <view class="home-page">
    <template v-if="!showDefaultList">
      <scroll-view
        scroll-y
        class="submitreservation-scrollwrapper"
        :scroll-top="scrollTop"
        @scroll="scrollFun"
        @scrolltoupper="handleScrollToUpper"
      >
        <NavBar
          :showTitle="isHeaderShow"
          :navColor="isHeaderShow ? '#FF758B' : 'transparent'"
          :customback="true"
          :whiteBack="true"
          title="预约美洗"
          fontSize="35rpx"
          titleColor="#ffffff"
          showBackBtn
          @navBackClickHandle="handleReturn"
          style="position: fixed; left: 0p; top: 0; width: 100%; z-index: 11"
        >
        </NavBar>
        <view :style="{ paddingTop: navHeight + 'px' }">
          <view
            class="content-bg"
            :style="{
              'margin-top': -navHeight + 'px',
              height: scrollViewHeight + 'px',
            }"
          >
            <view class="shop-info-wrapper">
              <view class="shop-info">
                <view class="info-wrapper">
                  <view class="shop-name-wrapper">
                    <view
                      class="shop-name"
                      @click.stop.prevent="handleSwitchShopNew"
                      >{{ shopDetail.shopName }}</view
                    >
                    <!-- <view class="change-shop" @click="handleSwitchShop"> -->
                    <view
                      class="change-shop"
                      @click.stop.prevent="handleSwitchShopNew"
                    >
                      <image
                        class="change-shop-ico"
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/changeShopIcon.png"
                        mode="aspectFit"
                      ></image>
                    </view>
                  </view>
                  <view class="shop-address">
                    <!-- 距离 -->
                    <view class="distance">
                      <view v-if="shopDetail.distance">
                        距您{{
                          Number(shopDetail.distance) > 1000
                            ? (Number(shopDetail.distance) / 1000).toFixed(1) +
                              "km"
                            : shopDetail.distance + "m"
                        }},
                      </view>
                    </view>
                    <view class="shop-address-name">{{
                      shopDetail.address
                    }}</view>
                  </view>
                  <view class="shop-extra">
                    <!-- 门店导航 -->
                    <view class="contact" @click="handleNav">
                      <image
                        class="contact-ico"
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/navigationIconV2.png"
                        fit="contain"
                      >
                      </image>
                      <view>导航</view>
                    </view>
                    <!-- 咨询门店 -->
                    <view class="contact" @click="handleShopCallPhone">
                      <image
                        class="contact-ico"
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/phoneIconV2.png"
                        fit="contain"
                      >
                      </image>
                      <view>电话</view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="content-wrapper">
            <view class="petList">
              <view class="select_pet">选择爱宠</view>
              <template v-if="petList.length <= 1">
                <view class="listwrap">
                  <view
                    class="petItem selected"
                    v-for="(item, index) in petList"
                    @click="choosePet(item.id, index)"
                    :key="item.id"
                  >
                    <view class="petavatar">
                      <image :src="item.avatarUrl" mode="aspectFill" />
                    </view>
                    <view class="['petname','selected']">{{
                      item.nickName
                    }}</view>
                  </view>
                  <view
                    class="petItem addpet"
                    @click="addPet"
                    :class="[petList.length == 1 ? 'displayTwo' : '']"
                  >
                    <span>
                      <image
                        class="add_icon"
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/petAddIcon@3x.png"
                        mode="scaleToFill"
                      />
                    </span>
                    添加宠物</view
                  >
                </view>
              </template>
              <template v-else>
                <view class="new_listwrap">
                  <view class="listwrap">
                    <view
                      :class="[
                        'petItem',
                        selectPetIndex == index ? 'selected' : '',
                      ]"
                      v-for="(item, index) in petList"
                      @click="choosePet(item.id, index)"
                    >
                      <view class="petavatar">
                        <image :src="item.avatarUrl" mode="aspectFill" />
                      </view>
                      <view
                        class="petname"
                        :class="[selectPetIndex == index ? 'selected' : '']"
                        >{{ item.nickName }}</view
                      >
                    </view>
                  </view>
                  <view class="petItem addpet" @click="addPet">
                    <view class="content">
                      <image
                        class="add_icon"
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/petAddIcon@3x.png"
                        mode="scaleToFill"
                      />
                      <view class="info"> 添加 </view>
                    </view>
                  </view>
                </view>
              </template>
            </view>
            <view class="sku-list service-list">
              <view class="title">
                <view>选择服务</view>
                <view
                  v-if="
                    skuListData &&
                    skuListData.data &&
                    skuListData.data.length > 0
                  "
                  class="title-introduce"
                  @click="handleSkuDetailOpen"
                >
                  <view style="margin-right: 8rpx">服务介绍</view>
                  <u-icon
                    name="play-right-fill"
                    size="19rpx"
                    color="#999999"
                  ></u-icon>
                </view>
              </view>

              <template v-if="skuListData">
                <view
                  v-if="
                    skuListData &&
                    skuListData.data &&
                    skuListData.data.length > 0
                  "
                >
                  <!-- 服务列表 -->
                  <view class="sku-wrapper">
                    <!-- 服务商品 -->
                    <!-- 商品数量：1/2 -->
                    <view
                      class="sku-item-wrapper"
                      v-if="
                        skuListData.data.length == 1 ||
                        !(skuListData.data[0] instanceof Array)
                      "
                    >
                      <view
                        v-for="item in skuListData.data"
                        :class="[
                          'sku-item',
                          selectedSkuId == item.skuId ? 'selected' : '',
                          skuListData.data.length == 1 ? 'oneSku' : '',
                        ]"
                        @click="handleShopSkuItemClick(item)"
                      >
                        <image
                          class="sku-pic"
                          :src="item.skuPicture"
                          mode="aspectFill"
                        ></image>
                        <view class="sku-content">
                          <view
                            class="sku-name"
                            :class="[
                              selectedSkuId == item.skuId ? 'selected' : '',
                            ]"
                          >
                            {{ item.skuName }}
                          </view>
                          <view class="sku-info">
                            <!-- 价格 -->
                            <view
                              v-if="
                                item.skuPrice !== undefined &&
                                item.skuPrice !== null
                              "
                              class="sku-price"
                            >
                              <GoodsPrice
                                :salePrice="item.skuPrice"
                                :saleColor="'#FE2442'"
                                :saleSignWidth="0"
                                :saleSignFontSize="25"
                                :saleFontWeight="100"
                                :salePriceIntegerFontSize="25"
                                :salePriceDecimalFontSize="25"
                              >
                              </GoodsPrice>
                              <view
                                style="
                                  font-size: 17rpx;
                                  color: #fe2442;
                                  margin-left: 2rpx;
                                "
                                >起</view
                              >
                            </view>
                            <!-- 时间 -->
                            <view
                              v-if="
                                item.duration !== undefined &&
                                item.duration !== null
                              "
                              class="sku-duration"
                            >
                              <view
                                class="sku-duration-box"
                                :class="[
                                  selectedSkuId == item.skuId ? 'selected' : '',
                                ]"
                                >{{ item.duration }}分钟</view
                              >
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                    <!-- 商品数量：2+ -->
                    <view v-else>
                      <view
                        class="sku-item-wrapper"
                        v-for="(skuList, index) in skuListData.data"
                        :key="index"
                      >
                        <view
                          v-for="item in skuList"
                          :key="item.skuId"
                          :class="[
                            'sku-item',
                            selectedSkuId == item.skuId ? 'selected' : '',
                          ]"
                          @click="handleShopSkuItemClick(item)"
                        >
                          <image
                            class="sku-pic"
                            :src="item.skuPicture"
                            mode="aspectFill"
                          ></image>
                          <view class="sku-content">
                            <view
                              class="sku-name"
                              :class="[
                                selectedSkuId == item.skuId ? 'selected' : '',
                              ]"
                            >
                              {{ item.skuName }}
                            </view>
                            <view class="sku-info">
                              <!-- 价格 -->
                              <view
                                v-if="
                                  item.skuPrice !== undefined &&
                                  item.skuPrice !== null
                                "
                                class="sku-price"
                              >
                                <GoodsPrice
                                  :salePrice="item.skuPrice"
                                  :saleColor="'#FE2442'"
                                  :saleSignWidth="0"
                                  :saleSignFontSize="25"
                                  :saleFontWeight="100"
                                  :salePriceIntegerFontSize="25"
                                  :salePriceDecimalFontSize="25"
                                >
                                </GoodsPrice>
                                <view
                                  style="
                                    font-size: 17rpx;
                                    color: #fe2442;
                                    margin-left: 2rpx;
                                  "
                                  >起</view
                                >
                              </view>
                              <!-- 时间 -->
                              <view
                                v-if="
                                  item.duration !== undefined &&
                                  item.duration !== null
                                "
                                class="sku-duration"
                              >
                                <view
                                  class="sku-duration-box"
                                  :class="[
                                    selectedSkuId == item.skuId
                                      ? 'selected'
                                      : '',
                                  ]"
                                  >{{ item.duration }}分钟</view
                                >
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="sku-empty" v-else>
                  <view class="empty-text">
                    该门店暂无可约项目，具体请咨询门店
                  </view>
                </view>
              </template>
            </view>
            <!-- <view
          v-if="skuListData && skuListData.data && skuListData.data.length > 0"
          class="sku-list"
        > -->
            <view
              v-if="skuAddListData && skuAddListData.length > 0"
              class="sku-list add-sku-list"
            >
              <view class="title">
                <view>加项服务</view>
                <!-- <view class="title-introduce" > 请注意预留足够服务时间</view> -->
                <view
                  v-if="skuAddListData && skuAddListData.length > 0"
                  class="title-introduce"
                  @click="handleAddItemDeatilPop"
                >
                  <view style="margin-right: 8rpx">服务介绍</view>
                  <u-icon
                    name="play-right-fill"
                    size="19rpx"
                    color="#999999"
                  ></u-icon>
                  <!-- 服务介绍<image
                  class="title-introduce-icon"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/serviceIcon.png"
                  fit="contain"
                ></image -->
                </view>
              </view>
              <div
                v-if="skuAddListData && skuAddListData.length > 0"
                class="add-list"
              >
                <div class="select-add">
                  <div
                    v-for="(aitem, index) in selectAddItemList"
                    :key="index"
                    class="add-item2"
                  >
                    <div class="sku">
                      {{ aitem.skuName }}
                    </div>
                    <div v-if="aitem.skuPrice !== null" class="price">
                      <GoodsPrice
                        :salePrice="aitem.skuPrice"
                        saleColor="#1F1F1"
                        :saleSignWidth="0"
                        :saleSignFontSize="29"
                        :saleFontWeight="100"
                        :salePriceIntegerFontSize="29"
                        :salePriceDecimalFontSize="29"
                      >
                      </GoodsPrice>
                    </div>
                    <div class="del" @click="handleDelAddItem(index)">
                      <image
                        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/livedBody/closeRight.png"
                        mode="scaleToFill"
                      />
                    </div>
                  </div>

                  <div
                    v-if="selectAddItemList.length"
                    class="short-btn"
                    @click="handleAddItem"
                  >
                    <image
                      class="add_service_icon"
                      src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/petAddIcon@3x.png"
                      mode="scaleToFill"
                    />
                  </div>
                </div>
                <div
                  v-if="!selectAddItemList.length"
                  class="addbtn"
                  @click="handleAddItem"
                >
                  <image
                    class="add_service_icon"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/petAddIcon@3x.png"
                    mode="scaleToFill"
                  />
                  <view class="info">立即添加</view>
                </div>
              </div>
              <!-- <view v-else class="sku-empty">
            <view class="empty-text"> 该门店暂无可约项目，具体请咨询门店 </view>
          </view> -->
            </view>
            <view v-if="selectedSkuId" class="orderList">
              <view class="ordertitle">
                <view>选择时间</view>
                <view class="ordertitle-extra">仅作参考，以门店时间为准</view>
              </view>
              <view class="datelist">
                <view
                  :class="['date', activeDayIndex == index ? 'selected' : '']"
                  v-for="(item, index) in timeslots"
                  :key="index"
                  @click="chooseDate(item, index)"
                >
                  <view :class="['dateinfo']">
                    <view class="date-value">
                      {{ item.weekTxt }}
                    </view>
                    <view class="date-num">{{
                      item.date.split(" ")[0].slice(5)
                    }}</view>
                    <view class="extra-icon" v-if="item.tag == 1">约满</view>
                    <view class="extra-icon" v-if="item.tag == 2">休息</view>
                  </view>
                  <view class="select-line"></view>
                </view>
              </view>
              <view
                class="period-grid"
                v-if="weekTimeSlot && weekTimeSlot.length > 0"
              >
                <view
                  :class="[
                    'period',
                    activeTimeSlotsIndex == index ? 'selected' : '',
                  ]"
                  v-for="(item, index) in weekTimeSlot"
                  :key="index"
                  @click="selectPeriod(item, index)"
                >
                  <view :class="['timeInfo', item.tag == 0 ? '' : 'disabled']">
                    {{ item.time.slice(0, 5) }}
                    <view class="extra-icon" v-if="item.tag == 1">约满</view>
                  </view>
                </view>
              </view>
              <view class="period-empty" v-else>
                <view class="empty-text"> 门店休息 </view>
              </view>
            </view>
            <view v-if="selectedSkuId" class="beauticianList">
              <view class="title">
                <view>选择美容师</view>
                <view
                  v-if="beauticianListData && beauticianListData.length > 0"
                  class="title-introduce"
                  @click="handleBeauticianDetailOpen"
                >
                  <view style="margin-right: 8rpx">美容师介绍</view>
                  <u-icon
                    name="play-right-fill"
                    size="19rpx"
                    color="#999999"
                  ></u-icon>
                  <!-- 美容师介绍
                <image
                  class="title-introduce-icon"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/appointment/serviceIcon.png"
                  fit="contain"
                >
                </image -->
                </view>
              </view>
              <!-- 美容师列表 -->
              <view
                v-if="beauticianListData && beauticianListData.length > 0"
                class="beauty-wrapper"
              >
                <view
                  v-for="(item, index) in beauticianListData"
                  :key="item.serviceId"
                  :class="[
                    'beauty-item',
                    selectedServiceId == item.serviceId ? 'selected' : '',
                  ]"
                  @click="handleBeauticianSelect(item, index)"
                >
                  <image
                    class="beauty-pic"
                    :src="item.pic"
                    mode="aspectFill"
                  ></image>
                  <view
                    :class="[
                      'beauty-name',
                      item.reservationFull == 1 ? 'disabled' : '',
                      selectedServiceId == item.serviceId ? 'selected' : '',
                    ]"
                  >
                    {{ item.name }}
                  </view>
                  <view class="extra-icon" v-if="item.reservationFull == 1"
                    >约满</view
                  >
                </view>
              </view>
              <view class="empty-text" v-else>暂无美容师空闲</view>
            </view>
            <!-- 备注信息 -->
            <view
              v-if="selectedSkuId"
              class="edit-remark"
              @click="handleRemark()"
            >
              <view class="name">备注</view>
              <view v-if="remark" class="value">{{ remark }}</view>
              <i
                v-else
                class="value iconfont icon-editorText fo-size"
                style="font-size: 42rpx; color: #363636"
              ></i>
            </view>

            <view
              class="noticewrap"
              v-if="selectedSkuId && shopDetail.bizNotice !== '<p><br></p>'"
            >
              <view class="noticetitle">须知</view>
              <template v-if="isImageUrl">
                <view class="noticecontent">
                  <image :src="shopDetail.bizNotice" mode="widthFix" />
                </view>
              </template>
              <template v-else>
                <view
                  v-html="shopDetail.bizNotice"
                  class="noticecontent"
                ></view>
              </template>
            </view>
            <!-- 底部边距，解决noticewrap设置margin不生效 -->
            <view style="height: 10rpx"></view>
          </view>
        </view>
      </scroll-view>
      <view
        class="bottomwrap"
        :style="{
          height: selectedSkuId ? '238rpx' : '158rpx',
        }"
      >
        <view v-if="selectedSkuId" class="agreement">
          <!-- 增加 -->
          <SubmitCheckBox v-model="checkboxValue" @change="checkboxChange">
          </SubmitCheckBox>
          <view class="agreement-text">
            <text @click="goAgreement">《宠胖胖门店服务预约用户协议》</text>
          </view>
        </view>
        <view class="order-submit-wrapper">
          <view class="select-wrapper">
            <view v-if="selectedSkuId" class="selected-skuid">{{
              commodityDetail.skuName || ""
            }}</view>
            <view class="select-time" v-if="selectedSkuId"
              >{{ activeDayInfo.weekTxt || "" }}
              {{
                activeDayInfo.date
                  ? activeDayInfo.date.split(" ")[0].slice(5) || ""
                  : ""
              }}
              {{
                activeTimeSlots.time
                  ? activeTimeSlots.time.slice(0, 5) || ""
                  : ""
              }}</view
            >
          </view>
          <view
            :class="['orderbtn', !!allowSubmit ? 'allow' : '']"
            @click="submitReservation"
            >立即提交</view
          >
        </view>
      </view>
      <SkuDetailPop
        :isOpen.sync="isSkuDetailShow"
        :skuListData="skuListData"
        :selectedSkuId="selectedSkuId"
        :commodityDetail="commodityDetail"
        @confirm="handleSelectSku"
        @close="handleSkuDetailClose"
      />
      <AddDetailPop
        :isOpen.sync="isAddItemDetailShow"
        :skuListData="skuAddListData"
        :selectedSkuId="selectedAddSkuIds"
        @confirm="handleSelectAddSku"
        @close="handleAddSkuDetailClose"
      />
      <AddItemPop
        :isOpen.sync="isAddItemOpen"
        :skuListData="skuAddListData"
        :selectedSkuIds="selectAddItemList"
        @confirm="handleSelectAddItemList"
        @close="handleAddItemListClose"
      />
      <view class="popaa">
        <FailMessage
          :isOpen.sync="failModalShow"
          :failMessage="failMessage"
          @close="handleFailClose"
        />
      </view>

      <BeauticianDetailPop
        :isOpen.sync="isBeauticianDetailShow"
        :beauticianListData="beauticianListData"
        :selectedServiceId="selectedServiceId"
        :selectedServiceIndex="selectedServiceIndex"
        @confirm="handleSelectBeautician"
        @close="handleBeauticianDetailClose"
      />
      <shopChange
        v-if="popupShow"
        :show.sync="popupShow"
        :bizType="1"
        :shopInfo="shopDetail"
        :location="{ lat: lat, lon: lon }"
        :isMedicine="true"
        :selectShopId="optionData.actShopId"
        @getChangeShopInfo="getChangeShopInfo"
        @copy="addressCopy"
      />
    </template>
    <template v-else>
      <DefaultCityList
        :shopList="shopList"
        :showBackBtn="true"
        @copy="addressCopy"
        @selectshop="selectShop"
        @openSetting="openSetting"
      >
        <!-- #ifdef H5 -->
        <template slot="inapptips">
          <InAppTips
            @openAppLocation="openAppLocation"
            v-if="appLocationTipShow"
          ></InAppTips>
        </template>
        <!-- #endif -->
      </DefaultCityList>
    </template>
  </view>
</template>
<script>
// import shopChange from "./components/shopChange/index.vue";
import shopChange from "@/pages/service/components/shopChange/index.vue";
import InAppTips from "./components/inAppTips/index.vue";
import FixedNav from "@/components/fixedNav/index.vue";
import DefaultCityList from "@/pages/service/components/defaultCityList/index.vue";
import { mapState } from "vuex";
import {
  getReservationInfo,
  submit,
  getMyPet,
  createPetId,
  serviceProvider,
  getSkuList,
  newServiceProviderDateApi,
  newServiceProviderDateInfoApi,
} from "@/api/reservation";
import { action_report, display_report } from "@/utils/track";
import { getAuthSetting } from "@/utils/location";
import SubmitCheckBox from "./components/submitCheckBox/index.vue";
import GoodsPrice from "@/components/goodsPrice/index.vue";
import { GET_TOP_SHOP } from "@/api/index";
import SkuDetailPop from "./components/skuDetailPop";
import AddDetailPop from "./components/addDetailPop";
import AddItemPop from "./components/addItemPop";
import FailMessage from "./components/failMessage";
import BeauticianDetailPop from "./components/beauticianDetailPop";
import NavBar from "@/components/navBar/index.vue";
import { GET_DEFAULT_SHOPLIST } from "@/api/base";
const module_name = "store";
export default {
  components: {
    GoodsPrice,
    SubmitCheckBox,
    SkuDetailPop,
    BeauticianDetailPop,
    AddDetailPop,
    AddItemPop,
    FailMessage,
    FixedNav,
    shopChange,
    NavBar,
    DefaultCityList,
    InAppTips,
  },
  props: {},
  data() {
    return {
      lon: uni.getStorageSync("lon"),
      lat: uni.getStorageSync("lat"),
      cityCode: uni.getStorageSync("cityCode"),
      shopInfo: null,
      weekShow: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      checkboxValue: false,
      petList: [],
      selectPetIndex: 0,
      activeDayIndex: 0,
      commodityDetail: {}, //商品详情
      shopDetail: {}, //店铺详情
      timeslots: [], //预约配置信息
      activeTimeSlotsIndex: null,
      activeTimeSlots: {},
      weekTimeSlot: [],
      activeDayInfo: {},
      optionData: {}, //预约首页传入参数
      submitFlag: false,
      selectedSkuId: null,
      isDataLoaded: false,
      skuListData: null,
      beauticianListData: null,
      remark: "",
      isSkuDetailShow: false, //服务介绍
      isBeauticianDetailShow: false, //美容师介绍
      selectedServiceId: null, //选择的美容师id
      selectedServiceIndex: null, //选择的美容师index
      navHeight: "",
      statusBarHeight: "",
      isAddItemDetailShow: false,
      selectedAddSkuIds: "",
      skuAddListData: [],
      selectAddItemList: [],
      isAddItemOpen: false,
      failMessage: "有商品已下架，请重新选择",
      failModalShow: false,
      isFirst: true,
      isHeaderShow: false, //顶部导航栏显示
      location: {
        lat: "",
        lon: "",
      },
      popupShow: false,
      toadyDate: "",
      scrollTop: 0,
      // #ifdef H5
      userLocationCheckEd: null,
      // #endif
      scrollViewHeight: 0,
      navColor: "transparent",
      shopList: [], //没有定位时门店列表
      appLocationTipShow: false, //app内定位权限有方法&&未开启定位
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    petNameString() {
      return function (str) {
        return str?.length > 4 ? str.slice(0, 4) : str;
      };
    },
    activeDayTimeSlots() {
      if (this.timeslots[this.activeDayIndex]?.timeSlots) {
        return this.timeslots[this.activeDayIndex]?.timeSlots;
      } else {
        return [];
      }
    },
    allowSubmit() {
      // 校验是否 提交，宠物、SKU、美容师勾选协议后，方法提交
      const flag =
        (this.beauticianListData && this.beauticianListData.length) > 0
          ? this.selectedServiceId
            ? true
            : false
          : true;
      let petListFlag = Array.isArray(this.petList) && this.petList.length > 0;
      let asFlag =
        this.checkboxValue &&
        petListFlag &&
        this.selectPetIndex >= 0 &&
        this.selectedSkuId &&
        this.activeDayIndex >= 0 &&
        this.activeTimeSlotsIndex !== null &&
        flag;
      return asFlag;
    },
    isImageUrl() {
      return (
        /^https:\/\/.*/g.test(this.shopDetail.bizNotice) ||
        /^http:\/\/.*/g.test(this.shopDetail.bizNotice)
      );
    },

    selectedShopInfo() {
      return this.shopInfo ?? this.shopDetail;
    },
    showDefaultList() {
      console.log("tiaojian===", this.optionData.shopId, this.lat, this.lon);
      return !this.optionData.shopId && !(this.lat && this.lon);
    },
    shopSkuInfo() {
      const { selectedSkuId } = this;
      const { shopId } = this.optionData;
      return { selectedSkuId, shopId };
    },
  },
  watch: {
    shopSkuInfo: {
      handler(val, oldVal) {
        if (val?.selectedSkuId && val?.shopId) {
          this.getTimeSlotList();
        }
      },
      deep: true,
    },

    selectAddItemList: {
      handler(val, oldVal) {
        this.getTimeSlotList();
      },
      deep: true,
    },
    scrollTop: {
      handler(val) {
        if (val > 30) {
          console.log("滑动距离大于30");
        }
      },
    },
  },
  onShow() {
    console.log("show==");
    display_report({
      display_name: "appointmentsubmit_show",
      object_type: module_name,
      extend: {
        shopId: this.optionData.shopId,
        skuId: this.optionData.skuId,
      },
    });
    display_report({
      display_name: "washing_page_display",
      object_type: "washing",
    });

    this.isFirst = false;
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight + "px";
      },
    });
    // #ifdef H5
    if (this.$dsBridge.hasNativeMethod("checkLocationPermission")) {
      console.log("判断定位开启方法存在==");
      this.$dsBridge.call(
        "checkLocationPermission",
        "checkLocationPermission",
        (val) => {
          console.log("权限开启与否", val);
          this.appLocationTipShow = !Number(val);
          this.getH5Lat(!this.appLocationTipShow);
        }
      );
    } else {
      this.getH5Lat();
    }
    // #endif
    // #ifdef MP-WEIXIN
    this.getInit();
    // #endif
  },
  async onLoad(option) {
    console.log("option==", option);
    this.optionData = option;
    this.$set(this.optionData, "actShopId", option.actShopId);
    // await this.getPetList();

    // #ifdef H5
    this.navHeight = getApp().globalData.h5NavBarFullHeight;
    this.scrollViewHeight = uni.upx2px(538);
    // #endif

    // #ifdef MP-WEIXIN
    this.navHeight = getApp().globalData.navHeight;
    this.scrollViewHeight = uni.upx2px(538);
    // #endif
    console.log(this.navHeight, "安全距离");
  },
  created() {},
  mounted() {
    // this.navHeight = getApp().globalData.navHeight + "px";
    this.newServiceProviderDate();

    uni.loadFontFace({
      family: "AlimamaShuHeiTi-Bold",
      source:
        'url("https://frontend-cdn.chongpangpang.com/image/medical-mp/mall/AlimamaShuHeiTi-Bold.otf")',
      success() {
        console.log("success load ttf");
      },
      fail() {
        console.log("fail load ttf");
      },
    });
  },
  methods: {
    async getInit() {
      if (this.optionData.shopId && this.optionData.merchantId) {
        await this.getPetList();
        this.loadInitData();
      } else {
        if (this.lat && this.lon) {
          await this.getPetList();
          this.getNearestShop();
        } else {
          console.log("空白门店");
          //todo 请求门店列表
          this.getNoAddressShopList();
        }
      }
    },
    //打开app系统设置权限
    openAppLocation() {
      this.$dsBridge.call(
        "gotoLocationPermissionSet",
        "gotoLocationPermissionSet"
      );
    },
    async getNoAddressShopList() {
      const _params = {
        bizType: 1,
        // #ifdef H5
        channelType: 2,
        // #endif
        // #ifdef MP-WEIXIN
        channelType: 1,
        // #endif
        lat: "",
        lng: "",
        cityCode: "",
      };
      try {
        const res = await GET_DEFAULT_SHOPLIST(_params);
        this.shopList = res.data.data;
        res.data.data.forEach((item) => {
          display_report({
            display_name: "chooseshop_display",
            object_type: "cityshop_list",
            extend: {
              // #ifdef MP-WEIXIN
              user_id: uni.getStorageSync("storage_info").userId,
              // #endif
              // #ifdef H5
              user_id: this.$dsBridge.call("getUserId", "getUserId"),
              // #endif
              shop_id: item.shopId,
            },
          });
        });
      } catch (e) {
        console.log("error", e);
      }
    },
    async openSetting(value) {
      this.lat = uni.getStorageSync("lat");
      this.lon = uni.getStorageSync("lon");
      this.cityCode = uni.getStorageSync("cityCode");
      await this.getPetList();
      this.getNearestShop();

      // this.queryData();
      // this.isMedicine = value;
    },
    selectShop(item) {
      this.$set(this.optionData, "merchantId", item.merchantId);
      //后端接口问题导致shopId需要取storeId,此shopId非真正意义shopid
      this.$set(this.optionData, "shopId", item.storeId);
      this.$set(this.optionData, "actShopId", item.shopId);
      console.log("item==", item);
      if (this.optionData.shopId) {
        this.getPetList();
        this.loadInitData();
      }
    },
    addressCopy(e) {
      uni.setClipboardData({
        data: e,
        showToast: false,
        success: (res) => {
          uni.showToast({
            title: "已复制门店信息",
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
    // 新接口获取排班周期
    async newServiceProviderDate() {
      const res = await newServiceProviderDateApi();
      console.log(res);
      this.timeslots = res.data.data.workDateInfoList;
      this.activeDayIndex = 0;
      // this.activeDayInfo = this.timeslots[0];
      this.toadyDate = this.timeslots[0].date;
    },
    handleSwitchShopNew() {
      action_report({
        action_name: "washing_switch_click",
        module_name: "washing",
      });
      this.popupShow = true;
    },
    getChangeShopInfo(item) {
      console.log(item, "======================");
      const { lat, lng: lon, shopId, storeId } = item;
      // 保存切换门店的id，防止在开启定位的时候导致门店数据请求错误
      // uni.setStorageSync("onlineCurMallId", shopId);
      // 单独设置一个门店的shopid用于保存切换门店之后的id，再次进入是切换门店之后的id
      uni.setStorageSync("serviceShopId", shopId);
      uni.setStorageSync("serviceStoreId", storeId);
      this.$set(this.optionData, "shopId", item.storeId);
      this.$set(this.optionData, "merchantId", item.merchantId);
      this.$set(this.optionData, "actShopId", item.shopId);
      this.optionData.skuId = null;
      this.loadInitData();
    },
    //滚动监听
    scrollFun(e) {
      if (e.detail.scrollTop >= 90) {
        this.isHeaderShow = true;
      }
      if (e.detail.scrollTop < 90) {
        this.isHeaderShow = false;
      }
    },
    //滚动到顶
    handleScrollToUpper() {
      this.isHeaderShow = false;
    },
    // 新增导航功能
    handleNav() {
      action_report({
        action_name: "washing_navigation_click",
        module_name: "washing",
      });
      console.log(this.shopDetail, "detail");
      const {
        shopName = "",
        address = "",
        lat = "",
        lng = "",
      } = this.shopDetail;
      // #ifdef MP-WEIXIN
      uni.$u.throttle(() => {
        uni.openLocation({
          latitude: lat,
          longitude: lng,
          name: shopName,
          address: address,
        });
      }, 500);
      // #endif

      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/address/navigation/map?targetName=${shopName}&targetAddress=${address}&targetLat=${lat}&targetLng=${lng}`,
      });
      // #endif
    },
    // 选择美容师
    handleBeauticianSelect(item, index) {
      action_report({
        action_name: "washing_beautician_card_click",
        module_name: "washing",
      });
      if (item.reservationFull == 1) return;
      this.selectedServiceId = item.serviceId;
      this.selectedServiceIndex = index;
    },
    handleReturn() {
      console.log("1111");
      // #ifdef MP-WEIXIN
      uni.navigateBack({
        delta: 1,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("closeCurrentWebview", {});
      // #endif
    },
    // 服务介绍
    handleSkuDetailOpen() {
      action_report({
        action_name: "washing_service_introduction_click",
        module_name: "washing",
      });
      this.isSkuDetailShow = true;
    },
    handleAddItemDeatilPop() {
      if (!this.skuAddListData || this.skuAddListData.length <= 0) {
        return;
      }
      this.isAddItemDetailShow = true;
      this.selectedAddSkuIds = this.skuAddListData[0].skuId;
    },
    handleDelAddItem(index) {
      this.selectAddItemList.splice(index, 1);
    },
    handleAddItem() {
      action_report({
        action_name: "washing_add_additional_click",
        module_name: "washing",
      });
      this.isAddItemOpen = true;
    },
    handleSkuDetailClose() {
      this.isSkuDetailShow = false;
    },
    handleAddSkuDetailClose() {
      this.isAddItemDetailShow = false;
    },
    handleAddItemListClose() {
      this.isAddItemOpen = false;
    },
    handleSelectSku(selectedSkuId, commodityDetail) {
      this.selectedSkuId = selectedSkuId;
      this.commodityDetail = commodityDetail;
    },
    handleSelectAddSku(selectedSkuId, commodityDetail) {
      const isHas = this.selectAddItemList.find(
        (i) => i.skuId == commodityDetail.skuId
      );
      if (isHas) {
        return;
      }
      this.selectAddItemList.push(commodityDetail);
    },
    handleSelectAddItemList(list) {
      this.selectAddItemList = list;
      console.log("addlist=====", this.selectAddItemList);
    },
    // 美容师介绍
    handleBeauticianDetailOpen() {
      action_report({
        action_name: "washing_beautician_introduction_click",
        module_name: "washing",
      });
      this.isBeauticianDetailShow = true;
    },
    handleBeauticianDetailClose() {
      this.isBeauticianDetailShow = false;
    },
    handleSelectBeautician(selectedServiceId) {
      this.selectedServiceId = selectedServiceId;
    },
    async loadInitData() {
      const _params = {
        merchantId: this.optionData.merchantId,
        shopId: this.optionData.shopId,
        skuId: this.optionData.skuId,
        // #ifdef H5
        userId: this.$dsBridge.call("getUserId", "getUserId"),
        // #endif
        // #ifdef MP-WEIXIN
        userId: uni.getStorageSync("storage_info").userId,
        // #endif
      };
      // #ifdef MP-WEIXIN

      // const auth = await getAuthSetting("scope.userLocation");
      // if (auth) {
      //   _params["lat"] = this.lat;
      //   _params["lng"] = this.lon;
      //   console.log(
      //     `有定位权限，添加经纬度。lat: ${this.lat}, lng: ${this.lon}`
      //   );
      // }
      _params["lat"] = this.lat;
      _params["lng"] = this.lon;
      // #endif

      // #ifdef H5
      _params["lat"] = this.lat;
      _params["lng"] = this.lon;
      // #endif
      await getReservationInfo(_params).then((res) => {
        const _info = res.data.data;
        this.commodityDetail = _info.commodityDetail;
        this.shopDetail = _info.shopDetail;
        console.log(this.commodityDetail, "commodityDetail222");
      });
      this.getSkuList();
      this.getAddItemList();
    },
    //    获取可选时间列表
    async getTimeSlotList() {
      const activeTimeslot = this.timeslots[this.activeDayIndex ?? 0];
      const params = {
        merchantId: this.optionData.merchantId,
        storeId: this.optionData.shopId,
        bizType: 1,
        mainSkuId: this.selectedSkuId,
        delayDay: this.toadyDate || (activeTimeslot && activeTimeslot.date),
      };
      if (this.selectAddItemList && this.selectAddItemList.length > 0) {
        params.additionalSkuIds = this.selectAddItemList.map((s) => s.skuId);
      }
      const res = await newServiceProviderDateInfoApi(params);
      console.log(res, "具体每一天的排班");
      this.weekTimeSlot = res?.data?.data?.workTimeSlots || [];
      // const res = await serviceProvider(params);
      // this.timeslots = res.data.data.serviceWorkScheduleList;
      for (let i = 0; i <= this.weekTimeSlot.length; i++) {
        if (this.weekTimeSlot[i] && this.weekTimeSlot[i].tag == 0) {
          console.log("abc", this.timeslots[i]);
          //找到第一个非休息天定位
          this.activeTimeSlotsIndex = i;
          this.activeTimeSlots = this.weekTimeSlot[i];
          this.beauticianListData = this.weekTimeSlot[i].serviceProviderInfos;
          this.selectedServiceIndex = 0;
          this.selectedServiceId =
            this.beauticianListData &&
            (this.beauticianListData[0].serviceId || "");
          // this.activeDayInfo = this.timeslots[i];
          // this.updateDayTimeSolts();
          break;
        } else {
          this.updateDayTimeSolts();
        }
      }
    },
    updateDayTimeSolts() {
      this.activeTimeSlotsIndex = null;
      this.activeTimeSlots = {};
      this.beauticianListData = [];
      this.selectedServiceId = null;
      // const list = this.timeslots[this.activeDayIndex]?.workTimeSlots;
      // this.weekTimeSlot = list;
    },

    getmore() {
      this.showmore = false;
    },
    async getPetList() {
      const res = await getMyPet(uni.getStorageSync("storage_info").userId);
      this.petList = res.data;
    },

    handleSwitchShop() {
      if (this.shopDetail) {
        const that = this;
        uni.navigateTo({
          url: `/pagesB/changeReservationShop/index?shopId=${this.shopDetail.shopId}&cityCode=${this.shopDetail.cityCode}`,
          events: {
            resultEvent(e) {
              // 选择店铺
              console.log("select shop: ", e.data);
              const shop = e.data;
              if (shop) {
                // 店铺，判断 是否相同店铺
                if (
                  that.optionData.merchantId != shop.merchantId ||
                  that.optionData.shopId != shop.storeId
                ) {
                  that.optionData.skuId = null;
                  // 置空
                  that.selectedSkuId = null;
                }
                that.optionData.merchantId = shop.merchantId;
                that.optionData.shopId = shop.storeId;
                that.loadInitData();
              }
            },
          },
        });
      }
    },

    handleShopCallPhone() {
      action_report({
        action_name: "washing_call_click",
        module_name: "washing",
      });
      const phone = this.shopDetail?.shopPhone;
      if (phone) {
        uni.makePhoneCall({
          phoneNumber: phone,
        });
      }
      // 咨询门店 - 埋点
      action_report({
        action_name: "appointmentsubmit_phone_clk",
        module_name: module_name,
        extend: {
          shopId: this.optionData.shopId,
        },
      });
    },
    handleFailClose() {
      this.failModalShow = false;
    },
    checkboxChange(n) {
      console.log("check change: ", this.checkboxValue);
    },

    chooseDate(item, index) {
      console.log(item, index);
      if (index !== this.activeDayIndex) {
        this.activeTimeSlotsIndex = null; //切换日期 重置时间段选择
      }
      this.activeDayIndex = index;
      this.toadyDate = item.date;
      this.getTimeSlotList();
      // this.updateDayTimeSolts();
      // this.activeDayInfo = item;
    },
    choosePet(petId, index) {
      if (this.selectPetIndex == index) return;
      this.selectPetIndex = index;
      this.optionData.skuId = null;
      this.selectedSkuId = null;
      this.getSkuList();
      this.getAddItemList();
    },

    handleShopSkuItemClick(item) {
      action_report({
        action_name: "washing_service_card_click",
        module_name: "washing",
      });
      // 选择 sku
      this.optionData.skuId = item.skuId;
      this.selectedSkuId = item.skuId;
      this.commodityDetail = item;
    },

    selectPeriod(item, index) {
      console.log(item, index);
      if (item.tag == 1) return;
      this.activeTimeSlotsIndex = index;
      this.activeTimeSlots = item;
      this.beauticianListData = item.serviceProviderInfos || [];
      // reservationFull: 1为约满, 0未约满
      if (
        this.beauticianListData.some(
          (t) => t.serviceId == this.selectedServiceId && t.reservationFull == 0
        )
      ) {
      } else {
        this.selectedServiceId = this.beauticianListData?.[0]?.serviceId || "";
      }
    },
    addPet() {
      console.log(1);

      let that = this;
      action_report({
        action_name: "washing_addpet_click",
        module_name: "washing",
      });
      //#ifdef MP-WEIXIN
      console.log(2);
      uni.navigateTo({
        url: `/pagesD/petInfo/index?type=YUYUEXIMEI`,
        events: {
          async resultEvent(res) {
            //新增加返回逻辑，
            console.log("从添加宠物返回", that.selectPetIndex);
            await that.getPetList();
            await that.loadInitData();
          },
        },
      });
      console.log(3);
      //#endif
      //#ifdef H5
      // this.$dsBridge.call("gotoPageThroughRoute", {
      //   page: `/user/add-pet?parentId=1`,
      // });
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesD/petInfo/index?nopet=nopet&type=YUYUEXIMEI&apptype=add&transparentTopBar=1`,
      });
      // #endif
    },
    refreshList() {
      this.getInit();
    },
    goAgreement() {
      action_report({
        action_name: "washing_select_protocol_click",
        module_name: "washing",
      });
      uni.navigateTo({
        url: `/pagesB/shopPrivacy/index?bizUrl=${this.shopDetail.bizPactImage}`,
      });
    },

    handleRemark() {
      action_report({
        action_name: "washing_remarks_click",
        module_name: "washing",
      });
      // 跳转编辑 备注，最多50字
      let that = this;
      uni.navigateTo({
        url: `/pagesC/editRemark/index?remark=${encodeURIComponent(
          that.remark ?? ""
        )}&maxlength=50&placeholder=${encodeURIComponent("请输入备注")}`,
        events: {
          resultEvent(res) {
            console.log(`res: ${JSON.stringify(res)}`);
            that.remark = res.data?.trim();
          },
        },
      });
    },

    async getNearestShop() {
      let params;
      // const auth = await getAuthSetting("scope.userLocation");
      params = {
        lat: this.lat,
        lng: this.lon,
        cityCode: this.cityCode,
        channelType: 1,
        bizType: 1,
      };
      console.log("params: ", params);
      // if (auth && this.cityCode) {
      //   params = {
      //     lat: this.lat,
      //     lng: this.lon,
      //     cityCode: this.cityCode,
      //     channelType: 1,
      //   };
      // } else {
      //   params = {
      //     channelType: 1,
      //   };
      // }
      try {
        const { data } = await GET_TOP_SHOP(params);
        console.log("nearest shop: ", data.data);
        this.$set(this.optionData, "shopId", data.data.storeId);
        this.$set(this.optionData, "merchantId", data.data.merchantId);
        this.$set(this.optionData, "actShopId", data.data.shopId);
        this.optionData.skuId = null;
        this.loadInitData();
      } catch (e) {
        console.log(e);
      }
    },

    async getSkuList() {
      console.log(
        "当前宠物petType",
        this.petList,
        this.selectPetIndex,
        this.petList[this.selectPetIndex]?.categoryType
      );
      try {
        const res = await getSkuList({
          storeId: this.optionData.shopId,
          merchantId: this.optionData.merchantId,
          petType: this.petList[this.selectPetIndex]?.categoryType,
          skuType: 1,
        });
        // 增加默认选中 逻辑
        const listData = res.data;
        if (!this.optionData.skuId && listData.data.length > 0) {
          this.commodityDetail = listData?.data?.[0];
          console.log("commodityDetail===>", this.commodityDetail);
          this.selectedSkuId = listData?.data?.[0]?.skuId;
        } else {
          this.selectedSkuId = this.optionData.skuId;
        }
        this.skuListData = listData;
        const array = [[], []];
        if (
          this.skuListData &&
          this.skuListData.data &&
          this.skuListData.data?.length > 2
        ) {
          this.skuListData.data.forEach((item, index) => {
            if (index % 2 == 0) {
              array[0].push(item);
            } else {
              array[1].push(item);
            }
          });
          this.skuListData.data = array;
        }
      } catch (e) {
        console.log("get goods list:");
        console.log(e);
      }
    },
    async getAddItemList() {
      getSkuList({
        storeId: this.optionData.shopId,
        merchantId: this.optionData.merchantId,
        petType: this.petList[this.selectPetIndex]?.categoryType,
        skuType: 2,
      }).then((res) => {
        console.log("🚀 ~ getAddItemList ~ res:", res);
        this.skuAddListData = res.data.data;
      });
    },
    async submitReservation() {
      if (this.submitFlag) return;
      action_report({
        action_name: "washing_submit_click",
        module_name: "washing",
      });
      if (this.allowSubmit) {
        const { data } = await createPetId({
          id: this.petList[this.selectPetIndex].id,
        });
        console.log(1111);
        //埋点
        // action_report({
        //   action_name: "appointmentsubmit_submit_clk",
        //   module_name: module_name,
        //   extend: {
        //     shopId: this.shopDetail.shopId,
        //     skuId: this.commodityDetail.skuId,
        //     petId: data.petId,
        //     reservationBeginTime:
        //       this.workTimeSlots[this.activeTimeSlotsIndex].time,
        //     duration: this.commodityDetail.duration,
        //   },
        // });
        console.log(222222, this.weekTimeSlot, this.activeTimeSlotsIndex);
        const _params = {
          shopId: this.shopDetail.shopId,
          merchantId: this.shopDetail.merchantId,
          reservationBeginTime:
            this.timeslots[this.activeDayIndex].date +
            " " +
            this.weekTimeSlot[this.activeTimeSlotsIndex].time,
          duration: this.commodityDetail.duration,
          petId: data.petId,
          mainSkuId: this.commodityDetail.skuId,
          remark: this.remark,
          serviceId: this.selectedServiceId,
          orderNo: this.optionData.orderNo,
          channelSource: 2,
        };
        console.log(_params, "=====================提交");
        if (this.selectAddItemList && this.selectAddItemList.length > 0) {
          _params.additionalSkuIds = this.selectAddItemList.map((s) => s.skuId);
        }
        this.submitFlag = true;
        console.log(_params, "params");
        submit(_params)
          .then((res) => {
            this.submitFlag = false;

            const _data = res.data.data;
            if (_data.reservationId) {
              // #ifdef MP-WEIXIN
              uni.requestSubscribeMessage({
                tmplIds: [
                  "vXiMmduYPxdVlcgw8xCCqYks83hj37XY5g1Hqr7k1nU",
                  "7y8S3xJW78FZFL6gN9th0ng5xotPU2avbqz4I_7HB2I",
                  "5eO4lSHq3REs3nFmsjD66FFuH3Q0o1-xIt9eQto7chw",
                ],
                complete: () => {
                  uni.redirectTo({
                    url: `/pagesB/reservationService/index?reservationId=${_data.reservationId}`,
                  });
                },
              });
              // #endif
              // #ifdef H5
              uni.redirectTo({
                url: `/pagesB/reservationService/index?reservationId=${_data.reservationId}`,
              });
              // #endif
            } else {
              if (!_data.success) {
                if (_data.failInfoList && _data.failInfoList.length > 0) {
                  this.failMessage = `商品${_data.failInfoList.map(
                    (f) => f.skuName
                  )}已下架，请重新选择`;
                  this.failModalShow = true;
                  return;
                }
                if (_data.failServiceProviderList) {
                  this.failMessage = `美容师${_data.failServiceProviderList[0].serviceName}已停止服务，请修改美容师`;
                  this.failModalShow = true;
                  return;
                }
              } else {
                if (_data.message) {
                  uni.showToast({
                    icon: "none",
                    title: _data.message,
                    duration: 2000,
                  });
                }
              }
            }
          })
          .catch((e) => {
            this.submitFlag = false;
          });
      }
    },
    async getH5Lat(type = false) {
      console.log("getH5Lat方法执行");
      const local = this.$dsBridge.call("getAddressInfo", "getAddressInfo")
        ? JSON.parse(
            this.$dsBridge.call("getAddressInfo", "getAddressInfo"),
            {}
          )
        : {};
      console.log(local, "localJson");
      const {
        lat = "", // 无定位时默认城市中心点
        lon = "", // 无定位时默认城市中心点
        cityCode = "", // 城市编码
      } = local;
      this.lat = lat ? (lat == "0.0" ? "" : lat) : ""; //兼容ios空值返回0.0
      this.lon = lon ? (lon == "0.0" ? "" : lon) : "";
      this.cityCode = cityCode ? (cityCode == "0.0" ? "" : cityCode) : "";
      if (type) {
        this.$dsBridge.call("startOnceLocation", "startOnceLocation");
      } else {
        this.getInit();
      }
    },
    getAppLoctaion(data) {
      console.log("再次接收经纬度数据", data);
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      this.lat = data?.lat || "";
      this.lon = data?.lon || "";
      this.cityCode = data?.cityCode || "";
      this.getInit();
    },
  },
  onReady() {
    // #ifdef H5
    this.$dsBridge.register("refreshCartPage", this.refreshList);
    this.$dsBridge.register("locationCallback", this.getAppLoctaion);
    // #endif
  },
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
