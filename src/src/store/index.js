import Vue from "vue";
import Vuex from "vuex";
import { searchHistoryState } from "./modules/searchHistory";
// import { GET_CART_TOTAL } from "@/api/mallv2";

Vue.use(Vuex);
// TODO  生产

// #ifdef MP-WEIXIN
// const infoData = uni.getStorageSync("storage_info");
// #endif
// TODO  临时开发
// #ifdef H5
// const storage_info = uni.getStorageSync("storage_info");
// const infoData = storage_info
//   ? storage_info
//   : {
//       token:
//         "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJzdWIiOiJDUFAtSldUIiwib2xkVXNlcklkIjoiMzAwMDkwMDk4MDk5MTM0NDY0IiwiaXNzIjoibWVvdy1rOHMtY24tZGV2MDIiLCJleHAiOjE3MDY4NTk1NTcsImlhdCI6MTcwNTA0NTE1NywidXNlcklkIjoiMzAwMDkwMDk4MDk5MTM0NDY0IiwianRpIjoiNjVhMGVjYTUwOWFlOTEwMDAxODk0MGUyIiwibWVtYmVySWQiOiIzMDAwOTAwOTgwOTkxMzQ0NjQifQ.5j6BC1IvPZDUaz0LBScwu-Il-ud07LMWzxtBo4OsTko3gJeTGiuoST2w2hBY3SNSUlZ9KsWmykMVTY0XIULNHQ",
//       openId: "ogGoH4yQB8bk99h0bPB2CmvhjpLs",
//       userId: "300090098099134464",
//       isNewUser: false,
//       phone: "13003636137",
//       appId: "wx49133dd26d6fc20b",
//       unionId: "oTcb46S0o6nCXUjT99FOqhnMcUzo",
//       avatarUrl: "https://image.henhenchina.com/account_21.png",
//       nickName: "宠友cdnrAA",
//       memberId: "300090098099134464",
//       showUserId: "9999972342",
//       oldUserId: "300090098099134464",
//       city: null,
//       age: null,
//       ryId: "f8i+Z3Vq/ZT1b0gjQSThUMHz17Inv6sv/+ygg9KvpBrVZ5Yu+jDMPDau6fUgC60pLhyWbnqX7+g=@37xa.cn.rongnav.com;37xa.cn.rongcfg.com",
//       ryUid: "meow_1703145670856_13003636137",
//       sex: 2,
//       isOfficial: null,
//       userAvatarDecoration: null,
//     };
// #endif
const infoData = uni.getStorageSync("storage_info");
const store = new Vuex.Store({
  state: {
    pingAn: false, //问诊来源是否为平安
    sourceRecord:'',//记录来源
    pinganOpenId:'',//平安openId记录
    pinganId:'',//平安问诊Id记录
    PAgroupID:'',
    userId: infoData.userId || "",
    userInfo: infoData || {}, //用户登陆基本信息
    userDetail: uni.getStorageSync("storage_userDetail") || {}, // 用户详情
    city: "北京市",
    userCity: {
      city: "",
      province: "北京市",
      cityCode: "",
    },
    channel: "other",
    storeID: "",
    isOriginator: false,
    userSelectedPetId: "",
    userPetList: [],
    //友盟埋点
    // #ifdef MP-WEIXIN
    umengChannel: "weixin",
    // #endif
    // #ifdef MP-ALIPAY
    umengChannel: "alipay",
    // #endif

    ryConnectStatus: false, // 融云连接状态
    serviceSheetsList: [], // 服务中的问诊单列表
    sheetsList: [], // 除了服务中的问诊单
    // lastMesSentTime: "", //接收到的第一条消息的发送时间，用来做下拉刷新定位判断
    /**
       * title
     * lastSheetsMessage: {
      [groupId]: {
        mes: "", //最后一条消息的内容
        time: "", // 最后一条的
        unreadMessageCount: 0, //未读消息数
        sendUser: { // 最后一条的发送者消息
          id: "",
          name: "",
          type: '', // system: 系统消息类型,
        },
      },
    */
    lastSheetsMessage: {}, // 服务中的问诊单最后一条消息

    currentMesInfo: {
      // 正在聊天的问诊消息
      groupId: "",
    },
    isChooseImage: false,
    addressId: "",
    //历史处方
    historyPrescription: {},
    allShopList: [], //门店信息
    selectedShopId: "", //选中门店
    selectedAddress: {}, // 选中地址
    cartNum: 0,
    openSetting: false, // 是否打开了隐私定位
    locFailMsg: false, //拒绝定位弹窗标记
    lastMesInfo: {
      PRESCRIPTION: {
        id: "",
        consultationSheetId: "",
        doctorAvatarUrl: "",
        doctorUserName: "",
        read: "",
        content: "",
        time: "",
        fromtype: 1, //1融云消息 2接口
        msgType: 0, //1 会话消息 2 开具处方单 3 处方单即将过期
      },
      NEWCHAT: {
        id: "",
        consultationSheetId: "",
        doctorAvatarUrl: "",
        doctorUserName: "",
        read: "",
        content: "",
        time: "",
        fromtype: 1, //1融云消息 2接口
        msgType: 0, //1 会话消息 2 开具处方单 3 处方单即将过期
      },
    },
    customTabbarIndex: 0,
    feederPaymentInfo: {},
    symptom: [], // 症状数据
    symptomData: [], // 症状显示数据
    searchSymptom: [], // 症状搜索数据
    searchCommonSymptom: [], // 常见症状搜索数据
    aiIdentifyShow: false, //识别弹窗
    liuShow: false, //拖拽按钮
    saveDeliverShow: true, //分娩弹窗
    jumpModelShow: "", //记录跳转之前选择的模式
    selectPetItem: {}, //当前选中的宠物
    symptomDesc: "", //症状描述
    aiTypeName: [], //问诊类型
    consultationShow: false, //问诊记录是否刷新
  },

  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      state.userId = userInfo.userId;
    },
    setUserDetail(state, data) {
      state.userDetail = data;
    },
    setCity(state, city) {
      state.city = city;
    },
    setUserCity(state, city) {
      state.userCity = city;
      if (city.adcode) {
        uni.setStorageSync(
          "storage_location_city_code",
          city.adcode.slice(0, 4) + "00"
        );
      }
      console.log(state.userCity, 433);
    },
    setChannel(state, channel) {
      state.channel = channel;
    },
    setStoreID(state, storeID) {
      state.storeID = storeID;
    },
    setOriginatorIdentity(state, val) {
      state.isOriginator = val;
    },

    setRyConnectStatus(state, val) {
      state.ryConnectStatus = val;
    },
    setServiceSheetsList(state, val) {
      state.serviceSheetsList = val;
    },
    setSheetsList(state, val) {
      state.sheetsList = val;
    },
    setLastSheetsMessage(state, val) {
      state.lastSheetsMessage = val;
    },
    setUserSelectedPetId(state, val) {
      state.userSelectedPetId = val;
    },
    setUserPetList(state, val) {
      state.userPetList = val;
    },
    setCurrentMesInfo(state, val) {
      state.currentMesInfo = val;
    },

    setIsChooseImage(state, val) {
      state.isChooseImage = val;
    },
    setAddressId(state, val) {
      state.addressId = val;
    },
    setHistoryPrescription(state, val) {
      state.historyPrescription = val;
    },
    setAllShopList(state, val) {
      state.allShopList = val;
    },
    setSelectShopId(state, val) {
      state.selectedShopId = val;
    },
    setSelectedAddress(state, val) {
      state.selectedAddress = val;
    },
    setCartNum(state, val) {
      state.cartNum = val;
    },
    setOpenSetting(state, val) {
      console.log("vvvvvvvv", val);
      state.openSetting = val;
    },
    setLocationFailMsg(state, val) {
      state.locFailMsg = val;
    },
    setlastMessInfo(state, val) {
      state.lastMesInfo = val;
    },
    setCustomTabbarIndex(state, val) {
      state.customTabbarIndex = val;
    },
    setFeederPaymentInfo(state, val) {
      state.feederPaymentInfo = val;
    },
    addSymptomData(state, val) {
      let exists = state.symptomData.some(
        (item) => item.diseaseName === val.diseaseName
      );
      if (!exists) {
        state.symptomData.unshift(val);
      }
    },
    clearSymptomData(state, val) {
      state.symptomData = [];
    },
    aiAddSymptomData(state, item) {
      state.symptomData.forEach((value) => {
        if (value.diseaseName == item) {
          value.aiShow = true;
        }
      });
      // console.log(index, state.symptomData[index], "111111133333");
    },
    setSymptom(state, symptom) {
      state.symptom = symptom;
    },
    deleteSymptomData(state, index) {
      state.symptomData.splice(index, 1);
    },

    setAiTypeName(state, value) {
      state.aiTypeName = value;
    },
    clearSymptomData(state, index) {
      state.symptomData = [];
    },
    assignmentSymptomData(state, arry) {
      state.symptomData = arry;
    },
    setsearchSymptom(state, searchSymptom) {
      state.searchSymptom = searchSymptom;
    },
    setsearchCommonSymptom(state, searchCommonSymptom) {
      state.searchCommonSymptom = searchCommonSymptom;
    },
    setAiIdentifyShow(state, val) {
      state.aiIdentifyShow = val;
    },
    setLiuShow(state, val) {
      state.liuShow = val;
    },
    setSaveDeliverShow(state, val) {
      state.saveDeliverShow = val;
    },

    setConsultationShow(state, val) {
      state.consultationShow = val;
    },
    setJumpModelShow(state, val) {
      state.jumpModelShow = val;
    },
    setSelectPetItem(state, val) {
      state.selectPetItem = val;
    },
    setSymptomDesc(state, val) {
      state.symptomDesc = val;
    },
    setpingAnSource(state, val) {
      state.pingAn = val;
    },
    setpinganGroupID(state, val) {
      state.PAgroupID = val;
    },
    setSourceRecord(state, val) {
      state.sourceRecord = val;
    },

    setPinganOpenId(state, val) {
      state.pinganOpenId = val;
    },
    setPinganId(state, val) {
      state.pinganId = val;
    },
  },
  actions: {
    async uploadCartNum({ commit }) {
      let params = {
        checked: false,
        cartType: 1,
      };
      // const res = await GET_CART_TOTAL(params);
      // let { data } = res.data;
      // commit("setCartNum", data);
      // return data;
    },
  },
  modules: {
    searchHistoryState,
  },
});
export default store;
