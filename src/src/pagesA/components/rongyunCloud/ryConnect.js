// import * as RongIMLib from "@rongcloud/imlib-next";
import {
  connect as RYCONNECT,
  ConversationType as RYConversationType,
  getConversation as RYgetConversation,
} from "./imlib-next.index.esm";
import { getSheetsList } from "./api/sheets";
import { GET_IN_SERVICE_LAST, GET_IN_SERVICE_FOR_AI } from "./api/chat";
import store from "@/store";

export async function RyConnect() {
  try {
    const { ryConnectStatus, userInfo } = store.state;

    console.log("============================store.state", store.state, userInfo, ryConnectStatus);

    if (!userInfo.ryId) {
      console.log("融云连接时 融云id不存在");
      return;
    }

    if (ryConnectStatus) {
      console.log("融云连接时 融云已经连接成功");
      return;
    }

    // 存在融云Id && 融云连接状态为false
    const res = await RYCONNECT(userInfo.ryId);

    if (res.code === 0) {
      console.log("融云连接成功 code 0", res, userInfo.ryId);
    } else {
      console.log("融云连接失败 code no 0", res);
    }
  } catch (e) {
    console.error("融云连接时失败", e);
  }
}

// 对接平安app建立连接
export async function pinganRyConnect(pinganId) {
  try {
    const { ryConnectStatus } = store.state;
    if (!pinganId) {
      console.log("融云连接时 平安融云id不存在");
      return;
    }

    if (ryConnectStatus) {
      console.log("融云连接时 融云已经连接成功");
      return;
    }

    // 存在融云Id && 融云连接状态为false
    const res = await RYCONNECT(pinganId);

    if (res.code === 0) {
      console.log("融云连接成功 code 0", res, pinganId);
    } else {
      console.log("融云连接失败 code no 0", res);
    }
  } catch (error) {
    console.log(error, "连接出错啦");
  }
}

// 接受消息
export async function handleMessages(evt) {
  try {
    console.log("store11111", store);
    console.log("来新消息了啊", evt);
    console.log(evt.messages);
    const item = evt.messages[evt.messages.length - 1];
    const serviceSheetsList = [...store.state.serviceSheetsList];
    // 当前问诊单结束的消息判断
    if (
      item.messageType === "RC:InfoNtf" &&
      item.content.message === "本次服务已结束，感谢您的使用！"
    ) {
      handleSheetsEnd();
      return;
    }

    //问诊单匹配到专家，需要重新请求一下
    if (
      item.messageType === "RC:InfoNtf" &&
      item.content.extra === "CONSULTATION:START"
    ) {
      const res = await _getSheetsServerList();
    }
    // 当前消息是服务中的问诊单
    if (
      serviceSheetsList[0] &&
      item.targetId === serviceSheetsList[0].groupId
    ) {
      let { content } = item;
      console.log("当前消息是服务中的问诊单", content);

      if (
        content.message &&
        content.message.indexOf("{") !== -1 &&
        JSON.parse(content.message).msgType == "PRESCRIPTION"
      ) {
        handleLastMes({
          groupId: item.targetId,
          mes: item,
          type: "newMes",
          prescriptionFlag: JSON.parse(JSON.parse(content.message).content)
            .prescriptionFlag,
        });
      } else {
        handleLastMes({
          groupId: item.targetId,
          mes: item,
          type: "newMes",
        });
      }

      return;
    }

    const res = await _getSheetsServerList();
  } catch (e) {
    console.error("来新消息了啊", e, evt);
  }
}

// 当前问诊单结束的消息结束处理
async function handleSheetsEnd() {
  const serviceSheetsList = [...store.state.serviceSheetsList];

  if (serviceSheetsList[0]) {
    serviceSheetsList[0].state = 2;
  }

  store.commit("setSheetsList", [
    ...serviceSheetsList,
    ...store.state.sheetsList,
  ]);
  console.log(1111111111111111111111111111111111111111);
  const res = await GET_IN_SERVICE_FOR_AI();
  console.log(111111111111111111111111111111111111111111111111111111111);
  store.commit("setServiceSheetsList", res.data ? [res.data] : []);
  uni.$emit("refreshSheetList");
  return;
}

// 获取历史信息
export async function getLastMes(groupId) {
  try {
    console.log("获取历史信息", groupId);
    const res = await RYgetConversation({
      conversationType: RYConversationType.GROUP,
      targetId: groupId,
    });

    console.log("getLastMes", res);

    if (res.code === 0) {
      // let prescriptionFlag;
      // 如果messageType === RC:TxtMsg
      if (res.data?.latestMessage?.messageType === "RCMedicalCustomMsg") {
        let { content } = res.data.latestMessage;
        // 判断是否含有处方，若没有按照先前的逻辑会导致AI的IM页面倒计时渲染阻塞
        let isPrescriptionFlag = JSON.parse(content.message).content
          ? true
          : false;
        res.data &&
          handleLastMes({
            groupId,
            mes: res.data.latestMessage,
            type: "lastMes",
            unreadMessageCount: res.data.unreadMessageCount,
            prescriptionFlag: isPrescriptionFlag
              ? JSON.parse(JSON.parse(content.message).content).prescriptionFlag
              : "",
          });
      } else {
        res.data &&
          handleLastMes({
            groupId,
            mes: res.data.latestMessage,
            type: "lastMes",
            unreadMessageCount: res.data.unreadMessageCount,
          });
      }

      return res;
    } else {
      const lastMes = store.state.lastSheetsMessage;
      store.commit("setLastSheetsMessage", {
        ...lastMes,
        [groupId]: {
          mes: "获取消息失败，等待更新",
          time: "",
          unreadMessageCount: 0,
        },
      });
      return "";
    }
  } catch (e) {
    console.error("获取历史信息", e);
  }
}

// 获取服务中的问诊单
export async function _getSheetsServerList(state = 1) {
  try {
    if (!store.state.userInfo.token) {
      return;
    }
    const params = {
      state,
    };
    const res = await getSheetsList();
    // if (resLast.data.state == -1) {
    //   //存在待接诊的问诊单，服务中一定为空
    //   store.commit("setServiceSheetsList", [resLast.data]);
    // } else {
    //   store.commit("setServiceSheetsList", [...res.data.data]);
    // }
    if (
      res.data &&
      Array.isArray(res.data.data) &&
      res.data.data.length &&
      (res.data.data[0].state == 1 || res.data.data[0].state == -1)
    ) {
      store.commit("setServiceSheetsList", [res.data.data[0]]);
    } else {
      store.commit("setServiceSheetsList", []);
    }
    console.log("serviceList[0]", store.state.serviceSheetsList);
    // 目前只有一个服务中的问诊单
    res.data.data[0] &&
      store.state.ryConnectStatus &&
      getLastMes(res.data.data[0].groupId);
  } catch (e) {
    console.error("获取服务中的问诊单", e);
  }
}

export function handleLastMes({
  groupId,
  mes,
  type,
  unreadMessageCount = 0,
  prescriptionFlag,
}) {
  console.log("处理最后一条消息", unreadMessageCount, mes);
  let typeObj = {
    RCConsultationInfoMsg: "[问诊病情描述]",
    RCVeterinarianCardMessage: "医生资料",
    RCVeterinarianNoReplyMessage: "[医生未及时回复]",
    RCVeterinarianDiagnosisMessage: "[初诊结果]",
    RCNutritionDiagnosisMsg: "[营养建议]",
    // "RC:InfoNtf": "本次服务已结束，感谢您的使用！",
    RCMedicalCustomMsg: "[自定义卡片]",
    QUESTION_CARD: "[问答卡片]",
    PRESCRIPTION: "[电子处方笺]",
    "RC:ImgMsg": "[图片]",
    "RC:HQVCMsg": "[语音]",
    "RC:FileMsg": "[文件]",
    "RC:SightMsg": "[视频]",
    "RC:LBSMsg": "暂不支持的信息类型",
    "RC:SRSMsg": "",
    SightMessage: "视频消息",
  };
  const ignoreCounts = [
    "RCVeterinarianCardMessage",
    "RCVeterinarianNoReplyMessage",
    "RC:InfoNtf",
    "RC:CmdMsg",
  ];

  let result = {
    mes: "暂无",
    time: "",
    unreadMessageCount: 0,
    sendUser: {
      id: "",
      name: "",
    },
    messageType: "",
    subMsgType: "",
    diretion: 2,
    messageUId: "",
  };
  result.sendUser = (mes && mes.content.user) || {
    id: mes && mes.senderUserId,
    name: "医生",
  };
  result.time = mes && mes.sentTime;
  result.messageType = mes && mes.messageType;
  result.messageUId = mes && mes.messageUId;
  result.diretion = mes && mes.messageDirection;
  // 这俩种类型直接return;不做处理
  if (["RC:LBSMsg"].includes(mes && mes.messageType)) {
    return;
  }

  const lastMes = store.state.lastSheetsMessage;
  const currentMesInfo = store.state.currentMesInfo;

  if (mes && mes.messageType === "RC:SRSMsg" && lastMes[groupId]) {
    store.commit("setLastSheetsMessage", {
      [groupId]: {
        ...lastMes[groupId],
        unreadMessageCount: 0,
      },
    });
    return;
  }
  if (mes && mes.messageType === "RCMedicalCustomMsg") {
    let subMsgType = JSON.parse(mes && mes.content.message).msgType;
    result.subMsgType = subMsgType;
    if (subMsgType === "PRESCRIPTION" && !prescriptionFlag) {
      result.mes = "[诊断小结]";
    } else if (typeObj[subMsgType]) {
      result.mes = typeObj[subMsgType];
    } else {
      result.mes = typeObj["RCMedicalCustomMsg"];
    }
  } else if (mes && mes.messageType === "RC:TxtMsg") {
    result.mes = mes?.content?.content || "";
    // 有换行的处理
    result.mes.indexOf("\n") > -1 &&
      (result.mes = result.mes.split("\n")[0] + "...");
    result.mes.indexOf("<br/>") > -1 &&
      (result.mes = result.mes.split("<br/>")[0] + "...");
  } else if (mes && mes.messageType === "RC:InfoNtf") {
    result.mes = mes?.content?.message || "";
    if (mes?.content?.message === "温馨提示：您的问诊将于5分钟后结束") {
      result.sendUser.type = "system";
    }
  } else {
    // console.log(
    //   "======" + mes.messageType + " ssss:" + typeObj[mes.messageType]
    // );
    if (typeObj[mes && mes.messageType]) {
      result.mes = typeObj[mes && mes.messageType];
    } else {
      result.mes = "暂无";
    }
  }

  if (type === "lastMes") {
    result.unreadMessageCount = unreadMessageCount || 0;
  } else if (type === "newMes") {
    let unreadMessageCount = lastMes[groupId]
      ? lastMes[groupId].unreadMessageCount
      : 0;
    if (
      groupId !== currentMesInfo.groupId &&
      !ignoreCounts.includes(mes && mes.messageType) &&
      mes.messageDirection == 2
    ) {
      unreadMessageCount = lastMes[groupId]
        ? lastMes[groupId].unreadMessageCount + 1
        : 1;
    }

    result.unreadMessageCount = unreadMessageCount || 0;
  }

  store.commit("setLastSheetsMessage", {
    [groupId]: result,
  });

  console.log("store lastMess", store.state.lastSheetsMessage);
}
