// 问诊派单minxins
import {mapMutations} from "vuex";
import {
    Events as RYEvents,
    addEventListener as RYaddEventListener,
    removeEventListener as RYremoveEventListener,
    ConversationType as RYConversationType,
    clearMessagesUnreadStatus as RYclearMessagesUnreadStatus,
    sendSyncReadStatusMessage as RYsendSyncReadStatusMessage,
    getHistoryMessages as RYgetHistoryMessages,
    init as RYinit,
    destroy as RYdestroy,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { RyConnect } from "@/pagesA/components/rongyunCloud/ryConnect";
import toast from "uview-ui/libs/config/props/toast";
import {getUserInfo} from "@/api/base";
import {acquireUserRyGroup} from "@/api/medical";

export default {
    date () {
        return {
        }
    },
    watch: {
        doctorShow (v) {
            //#ifdef H5
            this.$nextTick(() => {
                // 针对h5侧锁定滚动
                console.log('针对h5侧锁定滚动', document.body)
                if (document.body) {
                    document.body.style.overflow = v
                }
            })
            //#endif
        }
    },
    methods: {
        ...mapMutations(["setRyConnectStatus", "setUserInfo"]),
        // 融云初始化方法
        async RYconnectMethod() {
            let appkey =
                process.env.NODE_ENV === "production"
                    ? "6tnym1br6ffr7"
                    : "c9kqb3rdc22dj";

            // 融云初始化
            console.log("融云初始化");
            try {
                //#ifdef H5
                console.log("H5环境-获取userInfo信息，防止ryid未获取");
                const data = await getUserInfo(true);
                const userInfo = {
                    ...this.userInfo,
                    ...data,
                };
                this.setUserInfo(userInfo);
                console.log("getUserInfo接口", { data });
                //#endif
                await RYinit({ appkey });
                await RyConnect();
                RYaddEventListener(RYEvents.CONNECTED, () => {
                    console.log("连接成功app");
                    this.setRyConnectStatus(true);
                });

                RYaddEventListener(RYEvents.DISCONNECT, () => {
                    console.log("连接中断，需要业务层进行重连处理");
                    this.setRyConnectStatus(false);
                });
                /**
                 * 正在链接的事件状态
                 */
                RYaddEventListener(RYEvents.CONNECTING, function () {
                    console.log("正在链接服务器");
                });
                // 添加事件监听 消息的推送
                RYaddEventListener(RYEvents.MESSAGES, this.handleMessages);

                // 2s后拉取历史消息
                const tid = setTimeout(() => {
                    console.log('2s后拉取历史消息')
                    this.historyMessageHandler()
                    clearTimeout(tid)
                }, 1000)
            } catch (error) {
                console.log(error);
            }
        },
        handleMessages({messages}) {
            console.log(messages)
            if (messages && messages.length > 0) {
                // 发现有start任务 WAITING_RECEIVE_COUNTDOWN_START
                const findStartData = messages.find((i) => i.content.extra === 'WAITING_RECEIVE_COUNTDOWN_START')
                const findEndData = messages.find((i) => i.content.extra === 'SUSS_PRE')
                // 开始消息
                if (findStartData) {
                    console.log('发现有start任务', findStartData, findEndData)
                    this.startTask(findStartData)
                } else if (findEndData) { // 结束消息
                    this.endTask(findEndData)
                }
            }
        },
        // 融云拉取历史消息处理
        async historyMessageHandler () {
            // 没有来源不拉取历史消息
            console.log('拉取历史消息判断', this.from, this.consultationId)
            if (!(this.from && this.consultationId)) {
                return
            }
            // 获取当前用户的usergroupId
            const acquireUserRyGroupRes = await acquireUserRyGroup({})
            console.log('获取当前用户的usergroupId', acquireUserRyGroupRes)
            const { userGroupId } = acquireUserRyGroupRes.data
            if (!userGroupId) {
                return
            }
            // 拉取历史消息
            const conversation = {
                conversationType: RYConversationType.GROUP,
                targetId: userGroupId,
            };
            console.log('拉取历史消息conversation', userGroupId, conversation)
            // 从当前时间开始向前查询
            console.log("融云调用方法查询历史记录", conversation);
            const option = {
                timestamp: 0,
                count: 100,
                order: 0,
            };
            RYgetHistoryMessages(conversation, option).then((res) => {
                console.log(res, '返回的历史消息')
                if (res.code === 0) {
                    // 发现有start任务 注意需要识别出当前对应的问诊单的开始与结束消息
                    const findStartData = res.data?.list.find((i) => {
                        const innerMessage = JSON.parse(i.content.message)
                        return i.content.extra === 'WAITING_RECEIVE_COUNTDOWN_START' && innerMessage.consultationId === this.consultationId
                    })
                    const findEndData = res.data?.list.find((i) => {
                        const innerMessage = JSON.parse(i.content.message)
                        return i.content.extra === 'SUSS_PRE' && innerMessage.consultationId === this.consultationId
                    })
                    // 优先识别结束
                    if (findEndData) {
                        this.endTask(findEndData)
                    } else if (findStartData) {
                        this.startTask(findStartData)
                    }
                }
            })
        },
        /**
         * 开始任务
         * @param data {Object}
         *   messages: Array(1)
         *   0:
         *   content: {
         *    message: "{"preemptWaitDuration":86400,"preemptPoolId":"67458b90f001f000019a4439","deadLineTime":86400,"preemptBizType":"WAITING_RECEIVE_COUNTDOWN_START","consultationId":"67458b90f001f000019a4438","preemptState":"waitPreempt"}",
         *    extra: "WAITING_RECEIVE_COUNTDOWN_START"
         *   }
         *   messageType: "RCMedicalCustomMsg"
         *   targetId: "QDCZSWZD1861316213431468032"
         *
         * */
        startTask (data) {
            // 阻挡多个推送相同的信息
            console.log('========startTask=================', data, this.waitingTimer)
            if (data && !this.waitingTimer) {
                try {
                    console.log('开始定时任务')
                    //#ifdef H5
                    // app还需要向客户端提示“本次问诊还未结束，稍后可去问诊列表中查看”
                    this.$dsBridge.call('beforeDestroyToast', '本次问诊还未结束，稍后可去问诊列表中查看');
                    //#endif

                    const innerMessage = JSON.parse(data.content.message)
                    //                                                        截止时间-时间戳（毫秒级）
                    const { preemptWaitDuration, preemptPoolId, preemptState, deadLineTime } = innerMessage
                    // 差值
                    let intervalSecond = (deadLineTime - Date.now()) / 1000
                    if (intervalSecond > 0) {
                        // 初始化读秒
                        this.secondNum = +intervalSecond.toFixed(0)
                        // 打开弹窗
                        this.doctorShow = true
                        // 启动定时任务
                        this.waitingTimer = setInterval(() => {
                            // 任务未超时-读秒
                            if (intervalSecond >= 1) {
                                intervalSecond--
                                this.secondNum = +intervalSecond.toFixed(0)
                            } else {
                                //#ifdef H5
                                // 任务超时，app还需要向客户端删除提示
                                this.$dsBridge.call('beforeDestroyToast', '');
                                //#endif
                                // 任务超时-关闭弹窗
                                clearInterval(this.waitingTimer)
                                clearInterval(this.timeOutId)
                                this.waitingTimer = null
                                this.timeOutId = null
                                this.secondNum = 0
                                // 增加3s延时量，以防止网络波动或链路导致的任务未超时
                                this.timeOutId = setTimeout(() => {
                                    // 任务超时-关闭问诊单
                                    // 视为未返回消息融云- 温馨提醒 我们遇到了一些困难，您可以在问诊单列表中继续问诊。
                                    this.doctorShow = false
                                    this.$nextTick(() => {
                                        this.$refs.symptomPopup.openModal({
                                            title: '温馨提醒',
                                            text: '我们遇到了一些困难，您可以在问诊单列表中继续问诊。'
                                        })
                                    })
                                    // 使用后即刻销毁
                                    clearTimeout(this.timeOutId)
                                }, 5000)
                            }

                        }, 1000)
                    }

                } catch (e) {

                }
            }
        },
        /**
         * 结束任务
         * @param data {Object}
         *   messages: Array(1)
         *   0:
         *   content: {
         *      message: "{"consultationId":"6745c361571b040001aa3e04","inquiryType":"QUICK","groupId":"QDCZSWZD1861391579424620544","result":1,"doctorRyUid":"meow_1724831234217_15538590320","doctorUserName":"图图","doctorAvatarUrl":"https://image.henhenchina.com/390354934053543936/83156e62439943cbbaae3952ab25868e.jpg","preemptBizType":"SUSS_PRE"}",
         *      extra: "SUSS_PRE"
         *   }
         *   messageType: "RCMedicalCustomMsg"
         *   targetId: "QDCZSWZD1861316213431468032"
         *
         * */
        endTask (data) {
            try {
                /**
                 * 识别到SUSS_PRE
                 * {
                 *   "doctorUserName":"", // 医生名字 （超时为空）
                 *   "doctorRyUid":"", // 医生融云ID（超时为空）
                 *   "doctorAvatarUrl":"", // 医生头像（超时为空）
                 *   "consultationId":"",// 问诊单id
                 *   "inquiryType":"",// 问诊单类型
                 *   "groupId":"",//医生和用户问诊的聊天界面（超时为空）
                 *   "result":"", //  1、已分派到医生  2、超时拒接
                 *   "preemptBizType": "SUSS_PRE" // 抢单code： SUSS_PRE成功响应  NEW_INTERROGATION_ALERT（保底医生）新问诊单提醒
                 * }
                 *
                 * */
                const innerMessage = JSON.parse(data.content.message)
                //                                                        截止时间-时间戳（毫秒级）
                const { preemptWaitDuration, preemptPoolId, preemptState, deadLineTime } = innerMessage

                // 截止时间时间戳 - 当前时间戳 < 0  说明是过期消息不处理
                const intervalSecond = deadLineTime - Date.now()
                if (intervalSecond < 0) {
                    console.log('截止时间时间戳 - 当前时间戳 < 0  说明是过期消息不处理', deadLineTime)
                    return
                }

                console.log('结束任务消息： innerMessage', innerMessage)
                //#ifdef H5
                // 结束任务，app还需要向客户端删除提示
                this.$dsBridge.call('beforeDestroyToast', '')
                //#endif

                // 有返回消息后-立刻关闭弹窗
                this.doctorShow = false
                clearInterval(this.waitingTimer)
                this.waitingTimer = null
                clearInterval(this.timeOutId)
                this.timeOutId = null
                this.secondNum = 0

                // 已经分配医生
                if (innerMessage && +innerMessage.result === 1) {
                    console.log('已经分配医生')
                    const { consultationId, inquiryType, groupId, result, doctorRyUid, doctorUserName, doctorAvatarUrl } = innerMessage
                    console.log('已经匹配医生', innerMessage)
                    this.chatPageNavigateHandler(innerMessage)
                } else {
                    console.log('没有保底医生，超时拒接')
                    /**
                     * 是否付费 true付费单   false非付费单
                     */
                    const { isPay } = innerMessage
                    let text = isPay ? '医生暂时离开，退款将原路返回您的账户' : '医生暂时离开，请稍后咨询'
                    // 针对指定医生场景- 您咨询的兽医师正忙，该问诊单已关闭,退款稍后将返回您的账户
                    if (this.doctorUserId && this.doctorUserId !== '') {
                        text = '您咨询的兽医师正忙，该问诊单已关闭,退款稍后将返回您的账户'
                    }
                    this.$refs.symptomPopup.openModal({
                        title: '温馨提醒',
                        text
                    })
                }
            } catch (e) {
                console.log(e)
            }
        },
        // 跳转处理
        chatPageNavigateHandler (data) {
            // #ifdef MP-WEIXIN
            // 免费义诊
            if (this.inquiryType === 'QUICK') {
                uni.redirectTo({
                    url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
                        data
                    )}&fromOrigin=new&inquiryType=QUICK`,
                })
            } else { // 专家问诊
                uni.redirectTo({
                    url: `/pagesA/chatPage/index?messageInfo=${JSON.stringify(
                        data
                    )}&fromOrigin=new&inquiryType=EXPERT`,
                })
            }
            // #endif

            // #ifdef H5
            // app处理-5条逻辑（宠医义诊、专家问诊、报告解读、营养咨询、在线开药-问诊开方）跳转一致
            const { consultationId, inquiryType, groupId, result, doctorRyUid, doctorUserName, doctorAvatarUrl } = data
            this.$dsBridge.call('jumpInquiryIM', {
                //医生融云id
                doctorRyUid,
                //医生名称
                doctorUserName,
                //医生头像
                doctorAvatarUrl,
                groupId,
                inquiryType,
            })
            // 跳转后销毁当前页面
            setTimeout(() => {
                this.$dsBridge.call("closeCurrentWebview", {});
            }, 1500)
            // #endif

            // 销毁实例/定时器
            this.clearInstance()
        },
        // 销毁实例/定时器
        clearInstance() {
            if (this.waitingTimer) {
                this.waitingTimer = null
                clearInterval(this.waitingTimer)
            }
            if (this.timeOutId) {
                this.timeOutId = null
                clearInterval(this.timeOutId)
            }
            RYdestroy()
        },
    }
}