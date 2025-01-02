import {
    httpRequest as e,
    NetworkType as t,
    HttpMethod as n,
    HTTP_TIMEOUT as o,
    appendUrl as r,
    ErrorCode as i,
    ReceivedStatus as s,
    ConversationType as a,
    EventEmitter as c,
    RCConnectionStatus as _,
    VersionManage as u,
    assert as d,
    AssertRules as E,
    isArray as T,
    isHttpUrl as S,
    APIContext as R,
    LogTagId as A,
    logger as f,
    validate as l,
    isValidConversationType as I,
    isValidNotificationLevel as g,
    NotificationLevel as O,
    isTypeInConversationList as N,
    UltraGroupChannelType as v,
    isNumber as h,
    isString as m,
    MessageType as C,
    MAX_UPLOAD_FILE_SIZE as p,
    UPLOAD_FILE_CHUNK_SIZE as U,
    UploadMethod as M,
    fixUrlProtocol as y,
    FileType as L,
    getUUID as G,
    MAX_MESSAGE_CONTENT_BYTES as P,
    isValidFileType as D,
    usingCppEngine as B,
    MessageDirection as w,
    SentStatus as V,
    isUndefined as b,
    transformReceivedStatusFlag as J
} from "./engine.index.esm.js";

export {
    AreaCode,
    ChatroomEntryType,
    ChatroomSyncStatusReason,
    ChatroomUserChangeType,
    ChrmMemBanType,
    ChrmMemOperateType,
    ChrmSyncStatus,
    ConnectionStatus,
    ConversationType,
    ErrorCode,
    FileType,
    InterruptionLevel,
    LogL,
    LogLevel,
    MentionedType,
    MessageBlockSourceType,
    MessageBlockType,
    MessageDirection,
    NotificationLevel,
    NotificationStatus,
    OperateStatus,
    PushImportanceHonor,
    RCConnectionStatus,
    ReceivedStatus,
    SentStatus,
    UltraGroupChannelChangeType,
    UltraGroupChannelType,
    UploadMethod
} from "./engine.index.esm.js";
var F = function (e, t) {
    return F = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
        e.__proto__ = t
    } || function (e, t) {
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
    }, F(e, t)
};

function H(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");

    function n() {
        this.constructor = e
    }

    F(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
}

var k = function () {
    return k = Object.assign || function (e) {
        for (var t, n = 1, o = arguments.length; n < o; n++) for (var r in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
        return e
    }, k.apply(this, arguments)
};

function x(e, t, n, o) {
    return new (n || (n = Promise))((function (r, i) {
        function s(e) {
            try {
                c(o.next(e))
            } catch (e) {
                i(e)
            }
        }

        function a(e) {
            try {
                c(o.throw(e))
            } catch (e) {
                i(e)
            }
        }

        function c(e) {
            var t;
            e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n((function (e) {
                e(t)
            }))).then(s, a)
        }

        c((o = o.apply(e, t || [])).next())
    }))
}

function Y(e, t) {
    var n, o, r, i, s = {
        label: 0, sent: function () {
            if (1 & r[0]) throw r[1];
            return r[1]
        }, trys: [], ops: []
    };
    return i = {
        next: a(0),
        throw: a(1),
        return: a(2)
    }, "function" == typeof Symbol && (i[Symbol.iterator] = function () {
        return this
    }), i;

    function a(a) {
        return function (c) {
            return function (a) {
                if (n) throw new TypeError("Generator is already executing.");
                for (; i && (i = 0, a[0] && (s = 0)), s;) try {
                    if (n = 1, o && (r = 2 & a[0] ? o.return : a[0] ? o.throw || ((r = o.return) && r.call(o), 0) : o.next) && !(r = r.call(o, a[1])).done) return r;
                    switch (o = 0, r && (a = [2 & a[0], r.value]), a[0]) {
                        case 0:
                        case 1:
                            r = a;
                            break;
                        case 4:
                            return s.label++, {value: a[1], done: !1};
                        case 5:
                            s.label++, o = a[1], a = [0];
                            continue;
                        case 7:
                            a = s.ops.pop(), s.trys.pop();
                            continue;
                        default:
                            if (!(r = s.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                s = 0;
                                continue
                            }
                            if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
                                s.label = a[1];
                                break
                            }
                            if (6 === a[0] && s.label < r[1]) {
                                s.label = r[1], r = a;
                                break
                            }
                            if (r && s.label < r[2]) {
                                s.label = r[2], s.ops.push(a);
                                break
                            }
                            r[2] && s.ops.pop(), s.trys.pop();
                            continue
                    }
                    a = t.call(e, s)
                } catch (e) {
                    a = [6, e], o = 0
                } finally {
                    n = r = 0
                }
                if (5 & a[0]) throw a[1];
                return {value: a[0] ? a[1] : void 0, done: !0}
            }([a, c])
        }
    }
}

var Z = function () {
    return !("undefined" == typeof uni || !function (e) {
        for (var t = ["request", "getSystemInfo"], n = 0, o = t.length; n < o; n++) if (!e[t[n]]) return !1;
        return !0
    }(uni))
}, K = Z();
var q = null, X = function (e) {
    return x(void 0, void 0, void 0, (function () {
        var t;
        return Y(this, (function (n) {
            switch (n.label) {
                case 0:
                    return [4, z.getNetworkType()];
                case 1:
                    return t = n.sent(), q({status: "online" === e.type, type: t}), [2]
            }
        }))
    }))
};
var z = {
    tag: "browser",
    httpReq: function (t) {
        return e(t).result()
    },
    localStorage: null === window || void 0 === window ? void 0 : window.localStorage,
    sessionStorage: null === window || void 0 === window ? void 0 : window.sessionStorage,
    useNavi: !0,
    connectPlatform: "",
    isFromUniapp: K,
    createWebSocket: function (e, t) {
        var n = new WebSocket(e, t);
        return n.binaryType = "arraybuffer", {
            id: Date.now(), onClose: function (e) {
                n.onclose = function (t) {
                    var n = t.code, o = t.reason;
                    e(n, o)
                }
            }, onError: function (e) {
                n.onerror = e
            }, onMessage: function (e) {
                n.onmessage = function (t) {
                    e(t.data)
                }
            }, onOpen: function (e) {
                n.onopen = e
            }, send: function (e) {
                n.send(e)
            }, close: function (e, t) {
                n.close()
            }
        }
    },
    getNetworkType: function () {
        var e = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {effectiveType: t.UNKONWN},
            n = e.type, o = e.effectiveType, r = n || o || t.UNKONWN;
        return Promise.resolve(r)
    },
    setNetworkStatusListener: function (e) {
        q = e, "undefined" != typeof window && window && (window.addEventListener("offline", X), window.addEventListener("online", X))
    },
    removeNetworkStatusListener: function () {
        "undefined" != typeof window && window && (window.removeEventListener("offline", X), window.removeEventListener("online", X)), q = null
    }
}, j = Z(), W = function (e) {
    return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        try {
            return wx[e].apply(wx, t)
        } catch (e) {
            null === console || void 0 === console || console.error(e)
        }
    }
}, Q = {
    setItem: W("setStorageSync"),
    getItem: W("getStorageSync"),
    removeItem: W("removeStorageSync"),
    clear: W("clearStorageSync")
}, $ = null, ee = function (e) {
    var t = e.isConnected, n = e.networkType;
    $({status: t, type: n})
};
var te = {
    tag: "wechat",
    httpReq: function (e) {
        var t = e.method || n.GET, s = e.timeout || o, a = e.headers, c = e.query, _ = e.body, u = r(e.url, c);
        return new Promise((function (e) {
            wx.request({
                url: u, method: t, header: a, timeout: s, data: _, success: function (t) {
                    e({data: t.data, status: t.statusCode})
                }, fail: function () {
                    e({status: i.RC_HTTP_REQ_FAIL})
                }
            })
        }))
    },
    localStorage: Q,
    sessionStorage: Q,
    useNavi: !1,
    connectPlatform: "MiniProgram",
    isFromUniapp: j,
    createWebSocket: function (e, t) {
        var n = wx.connectSocket({url: e, protocols: t});
        return {
            id: Date.now(), onClose: function (e) {
                n.onClose((function (t) {
                    e(t.code, t.reason)
                }))
            }, onError: function (e) {
                n.onError((function (t) {
                    e(t.errMsg)
                }))
            }, onMessage: function (e) {
                n.onMessage((function (t) {
                    e(t.data)
                }))
            }, onOpen: function (e) {
                n.onOpen(e)
            }, send: function (e) {
                n.send({data: e})
            }, close: function (e, t) {
                n.close({code: e, reason: t})
            }
        }
    },
    getNetworkType: function () {
        return new Promise((function (e) {
            wx.getNetworkType({
                success: function (t) {
                    var n = t.networkType;
                    e(n)
                }, fail: function () {
                    e(t.UNKONWN)
                }
            })
        }))
    },
    setNetworkStatusListener: function (e) {
        $ = e, wx.onNetworkStatusChange(ee)
    },
    removeNetworkStatusListener: function () {
        wx.offNetworkStatusChange(ee), $ = null
    }
}, ne = Z(), oe = function (e) {
    return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        try {
            if ("setStorageSync" === e) return my[e]({key: t[0], data: JSON.parse(t[1])});
            if ("clearStorageSync" === e) return my[e]();
            if ("removeStorageSync" === e) return my[e]({key: t[0]});
            var o = my[e]({key: t[0]}).data;
            return o ? JSON.stringify(o) : o
        } catch (e) {
        }
    }
}, re = {
    setItem: oe("setStorageSync"),
    getItem: oe("getStorageSync"),
    removeItem: oe("removeStorageSync"),
    clear: oe("clearStorageSync")
}, ie = null, se = function (e) {
    var t = e.isConnected, n = e.networkType;
    ie({status: t, type: n})
};
var ae = {
    tag: "alipay",
    httpReq: function (e) {
        var t = e.method || n.GET, s = e.timeout || o, a = e.headers, c = e.query, _ = e.body, u = r(e.url, c),
            d = e.dataType || "json";
        return new Promise((function (e) {
            my.request({
                url: u, method: t, headers: a, timeout: s, data: _, dataType: d, success: function (t) {
                    e({data: t.data, status: t.status})
                }, fail: function () {
                    e({status: i.RC_HTTP_REQ_FAIL})
                }
            })
        }))
    },
    localStorage: re,
    sessionStorage: re,
    useNavi: !1,
    connectPlatform: "MiniProgram",
    isFromUniapp: ne,
    createWebSocket: function (e) {
        var t = my.connectSocket({url: e, multiple: !0});
        return {
            id: Date.now(), onClose: function (e) {
                t.onClose(e)
            }, onError: function (e) {
                t.onError((function (t) {
                    e(t.errMsg)
                }))
            }, onMessage: function (e) {
                t.onMessage((function (t) {
                    t.data.isBuffer ? e(my.base64ToArrayBuffer(t.data.data)) : e(t.data.data)
                }))
            }, onOpen: function (e) {
                t.onOpen(e)
            }, send: function (e) {
                t.send({data: my.arrayBufferToBase64(e), isBuffer: !0})
            }, close: function () {
                t.close()
            }
        }
    },
    getNetworkType: function () {
        return new Promise((function (e) {
            my.getNetworkType({
                success: function (t) {
                    var n = t.networkType;
                    e(n)
                }, fail: function () {
                    e(t.UNKONWN)
                }
            })
        }))
    },
    setNetworkStatusListener: function (e) {
        ie = e, my.onNetworkStatusChange(se)
    },
    removeNetworkStatusListener: function () {
        my.offNetworkStatusChange(se), ie = null
    }
}, ce = Z(), _e = function (e) {
    return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        try {
            return tt[e].apply(tt, t)
        } catch (e) {
        }
    }
}, ue = {
    setItem: _e("setStorageSync"),
    getItem: _e("getStorageSync"),
    removeItem: _e("removeStorageSync"),
    clear: _e("clearStorageSync")
}, de = null, Ee = function (e) {
    var t = e.isConnected, n = e.networkType;
    de({status: t, type: n})
};
var Te = {
    tag: "toutiao",
    useNavi: !1,
    connectPlatform: "MiniProgram",
    isFromUniapp: ce,
    localStorage: ue,
    sessionStorage: ue,
    httpReq: function (e) {
        return new Promise((function (t) {
            tt.request({
                url: e.url, data: e.body, header: e.headers, method: e.method, success: function (e) {
                    var n = (null == e ? void 0 : e.data) || {}, o = {data: JSON.stringify(n), status: e.statusCode};
                    t(o)
                }, fail: function (e) {
                    t({status: i.RC_HTTP_REQ_FAIL})
                }
            })
        }))
    },
    createWebSocket: function (e, t) {
        var n = tt.connectSocket({url: e, protocols: t});
        return {
            id: Date.now(), onOpen: function (e) {
                n.onOpen(e)
            }, onClose: function (e) {
                n.onClose((function (t) {
                    return e(t.code, t.reason)
                }))
            }, onError: function (e) {
                n.onError((function (t) {
                    return e(t.errMsg)
                }))
            }, onMessage: function (e) {
                n.onMessage((function (t) {
                    return e(t.data)
                }))
            }, send: function (e) {
                n.send({data: e})
            }, close: function (e, t) {
                n.close({code: e, reason: t})
            }
        }
    },
    getNetworkType: function () {
        return new Promise((function (e) {
            tt.getNetworkType({
                success: function (t) {
                    var n = t.networkType;
                    e(n)
                }, fail: function () {
                    e(t.UNKONWN)
                }
            })
        }))
    },
    setNetworkStatusListener: function (e) {
        de = e, tt.onNetworkStatusChange(Ee)
    },
    removeNetworkStatusListener: function () {
        tt.offNetworkStatusChange(Ee), de = null
    }
}, Se = Z(), Re = function (e) {
    return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        try {
            return swan[e].apply(swan, t)
        } catch (e) {
        }
    }
}, Ae = {
    setItem: Re("setStorageSync"),
    getItem: Re("getStorageSync"),
    removeItem: Re("removeStorageSync"),
    clear: Re("clearStorageSync")
}, fe = null, le = function (e) {
    var t = e.isConnected, n = e.networkType;
    fe({status: t, type: n})
};
var Ie = {
    tag: "baidu",
    useNavi: !1,
    connectPlatform: "MiniProgram",
    isFromUniapp: Se,
    localStorage: Ae,
    sessionStorage: Ae,
    httpReq: function (e) {
        return new Promise((function (t) {
            swan.request({
                url: e.url, data: e.body, header: e.headers, method: e.method, success: function (e) {
                    var n = (null == e ? void 0 : e.data) || {}, o = {data: JSON.stringify(n), status: e.statusCode};
                    t(o)
                }, fail: function (e) {
                    t({status: i.RC_HTTP_REQ_FAIL})
                }
            })
        }))
    },
    createWebSocket: function (e, t) {
        var n = swan.connectSocket({url: e, protocols: t});
        return {
            id: Date.now(), onOpen: function (e) {
                n.onOpen(e)
            }, onClose: function (e) {
                n.onClose((function (t) {
                    return e(t.code, t.reason)
                }))
            }, onError: function (e) {
                n.onError((function (t) {
                    return e(t.errMsg)
                }))
            }, onMessage: function (e) {
                n.onMessage((function (t) {
                    return e(t.data)
                }))
            }, send: function (e) {
                n.send({data: e})
            }, close: function (e, t) {
                n.close({code: e, reason: t})
            }
        }
    },
    getNetworkType: function () {
        return x(this, void 0, void 0, (function () {
            return Y(this, (function (e) {
                return [2, new Promise((function (e) {
                    swan.getNetworkType({
                        success: function (t) {
                            var n = t.networkType;
                            e(n)
                        }, fail: function () {
                            e(t.UNKONWN)
                        }
                    })
                }))]
            }))
        }))
    },
    setNetworkStatusListener: function (e) {
        fe = e, swan.onNetworkStatusChange(le)
    },
    removeNetworkStatusListener: function () {
        swan.offNetworkStatusChange(le), fe = null
    }
}, ge = Z(), Oe = function (e) {
    return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        try {
            return jd[e].apply(jd, t)
        } catch (e) {
            null === console || void 0 === console || console.error(e)
        }
    }
}, Ne = {
    setItem: Oe("setStorageSync"),
    getItem: Oe("getStorageSync"),
    removeItem: Oe("removeStorageSync"),
    clear: Oe("clearStorageSync")
}, ve = null, he = function (e) {
    var t = e.isConnected, n = e.networkType;
    ve({status: t, type: n})
};
var me = {
    tag: "jingdong",
    httpReq: function (e) {
        var t = e.method || n.GET, s = e.timeout || o, a = e.headers, c = e.query, _ = e.body, u = r(e.url, c);
        return new Promise((function (e) {
            jd.request({
                url: u, method: t, headers: a, timeout: s, data: _, success: function (t) {
                    e({data: t.data, status: t.statusCode})
                }, fail: function () {
                    e({status: i.RC_HTTP_REQ_FAIL})
                }
            })
        }))
    },
    localStorage: Ne,
    sessionStorage: Ne,
    useNavi: !1,
    connectPlatform: "MiniProgram",
    isFromUniapp: ge,
    createWebSocket: function (e, t) {
        return jd.connectSocket({url: e, protocols: t}), {
            id: Date.now(), onClose: function (e) {
                jd.onSocketClose((function (t) {
                    e(t.code, t.reason)
                }))
            }, onError: function (e) {
                jd.onSocketError((function (t) {
                    e(t.errMsg)
                }))
            }, onMessage: function (e) {
                jd.onSocketMessage((function (t) {
                    e(t.data)
                }))
            }, onOpen: function (e) {
                jd.onSocketOpen(e)
            }, send: function (e) {
                jd.sendSocketMessage({data: e})
            }, close: function (e, t) {
                jd.closeSocket({code: e, reason: t})
            }
        }
    },
    getNetworkType: function () {
        return new Promise((function (e) {
            jd.getNetworkType({
                success: function (t) {
                    var n = t.networkType;
                    e(n)
                }, fail: function () {
                    e(t.UNKONWN)
                }
            })
        }))
    },
    setNetworkStatusListener: function (e) {
        ve = e, jd.onNetworkStatusChange(he)
    },
    removeNetworkStatusListener: function () {
        jd.offNetworkStatusChange(he), ve = null
    }
}, Ce = function (e) {
    return function () {
        for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
        try {
            return uni[e].apply(uni, t)
        } catch (e) {
            null === console || void 0 === console || console.error(e)
        }
    }
}, pe = {
    setItem: Ce("setStorageSync"),
    getItem: Ce("getStorageSync"),
    removeItem: Ce("removeStorageSync"),
    clear: Ce("clearStorageSync")
}, Ue = null, Me = function (e) {
    var t = e.isConnected, n = e.networkType;
    Ue({status: t, type: n})
};
var ye, Le = {
    tag: "uniapp",
    httpReq: function (e) {
        var t = e.method || n.GET, s = e.timeout || o, a = e.headers, c = e.query, _ = e.body, u = r(e.url, c);
        return new Promise((function (e) {
            uni.request({
                url: u, method: t, header: a, timeout: s, data: _, success: function (t) {
                    e({data: t.data, status: t.statusCode})
                }, fail: function () {
                    e({status: i.RC_HTTP_REQ_FAIL})
                }
            })
        }))
    },
    localStorage: pe,
    sessionStorage: pe,
    useNavi: !0,
    connectPlatform: "",
    isFromUniapp: !0,
    createWebSocket: function (e, t) {
        var n = {
            complete: function () {
            }, url: e, protocols: t
        }, o = uni.connectSocket(n);
        return {
            id: Date.now(), onClose: function (e) {
                o.onClose((function (t) {
                    e(t.code, t.reason)
                }))
            }, onError: function (e) {
                o.onError((function (t) {
                    e(t.errMsg)
                }))
            }, onMessage: function (e) {
                o.onMessage((function (t) {
                    e(t.data)
                }))
            }, onOpen: function (e) {
                o.onOpen(e)
            }, send: function (e) {
                o.send({data: e})
            }, close: function (e, t) {
                o.close({code: e, reason: t})
            }
        }
    },
    getNetworkType: function () {
        return new Promise((function (e) {
            uni.getNetworkType({
                success: function (t) {
                    var n = t.networkType;
                    e(n)
                }, fail: function () {
                    e(t.UNKONWN)
                }
            })
        }))
    },
    setNetworkStatusListener: function (e) {
        Ue = e, uni.onNetworkStatusChange(Me)
    },
    removeNetworkStatusListener: function () {
        uni.offNetworkStatusChange(Me), Ue = null
    }
}, Ge = function (e) {
    return e && e.request && e.getSystemInfo
}, Pe = "undefined" != typeof uni && Ge(uni) ? function () {
    switch (process.env.VUE_APP_PLATFORM) {
        case"app-plus":
            return Le;
        case"mp-jd":
            return me;
        case"mp-baidu":
            return Ie;
        case"mp-toutiao":
            return Te;
        case"mp-alipay":
            return ae;
        case"mp-weixin":
            return te;
        default:
            return z
    }
}() : "undefined" != typeof jd && Ge(jd) ? me : "undefined" != typeof my && Ge(my) ? ae : "undefined" != typeof tt && Ge(tt) ? Te : "undefined" != typeof swan && Ge(swan) ? Ie : "undefined" != typeof wx && Ge(wx) ? te : z;

function De(e) {
    var t = e.conversationType, n = e.channelId, o = e.messageType, r = e.content, i = e.senderUserId, a = e.targetId,
        c = e.sentTime, _ = e.receivedTime, u = e.messageUId, d = e.messageDirection, E = e.isPersited, T = e.isCounted,
        S = e.isOffLineMessage, R = e.canIncludeExpansion, A = e.expansion, f = e.receivedStatus,
        l = e.receivedStatusInfo, I = e.disableNotification, g = e.isMentioned, O = e.isStatusMessage,
        N = e.readReceiptInfo, v = e.pushConfig, h = e.messageId, m = e.isInterrupt, C = e.isModifyMessage,
        p = e.channelType, U = e.sentStatus;
    return f || (f = s.UNREAD), {
        messageType: o,
        channelId: n || "",
        content: r,
        senderUserId: i,
        targetId: a,
        conversationType: t,
        sentTime: c,
        receivedTime: _,
        messageUId: u,
        messageDirection: d,
        isPersited: E,
        isCounted: T,
        isMentioned: g,
        disableNotification: I,
        isStatusMessage: O,
        canIncludeExpansion: R,
        expansion: A,
        receivedStatus: f,
        receivedStatusInfo: l,
        readReceiptInfo: N,
        pushConfig: v,
        messageId: h,
        isInterrupt: m,
        isModifyMessage: C,
        sentStatus: U,
        isOffLineMessage: S,
        channelType: p
    }
}

function Be(e) {
    var t = e.conversationType, n = e.targetId, o = e.latestMessage, r = e.unreadMessageCount, i = e.hasMentioned,
        s = e.mentionedInfo, c = e.lastUnreadTime, _ = e.notificationStatus, u = e.notificationLevel, d = e.isTop,
        E = e.channelId, T = e.unreadMentionedCount, S = e.matchCount, R = e.unreadMentionedMeCount,
        A = e.operationTime, f = e.draft, l = {
            conversationType: t,
            targetId: n,
            latestMessage: o && De(o),
            unreadMessageCount: r,
            hasMentioned: i,
            mentionedInfo: i ? {type: null == s ? void 0 : s.type, userIdList: null == s ? void 0 : s.userIdList} : void 0,
            lastUnreadTime: c,
            notificationStatus: _,
            notificationLevel: u,
            isTop: d,
            channelId: E,
            unreadMentionedCount: T,
            matchCount: S,
            unreadMentionedMeCount: R,
            operationTime: A,
            draft: f || ""
        };
    return l.conversationType === a.ULTRA_GROUP && (l.firstUnreadMessage = e.firstUnreadMessage, l.channelType = e.channelType), l
}

function we(e, t) {
    null === console || void 0 === console || console.warn("Method '".concat(e, "' is deprecated, please use '").concat(t, "' instead"))
}

!function (e) {
    e.CONNECTING = "CONNECTING", e.CONNECTED = "CONNECTED", e.DISCONNECT = "DISCONNECT", e.SUSPEND = "SUSPEND", e.MESSAGES = "MESSAGES", e.READ_RECEIPT_RECEIVED = "READ_RECEIPT_RECEIVED", e.MESSAGE_RECEIPT_REQUEST = "MESSAGE_RECEIPT_REQUEST", e.MESSAGE_RECEIPT_RESPONSE = "MESSAGE_RECEIPT_RESPONSE", e.MESSAGE_READ_RECEIPT_V4 = "MESSAGE_READ_RECEIPT_V4", e.SYNC_READ_STATUS = "SYNC_READ_STATUS", e.CONVERSATION = "CONVERSATION", e.CHATROOM = "CHATROOM", e.EXPANSION = "EXPANSION", e.PULL_OFFLINE_MESSAGE_FINISHED = "PULL_OFFLINE_MESSAGE_FINISHED", e.TAG = "TAG", e.CONVERSATION_TAG = "CONVERSATION_TAG", e.TYPING_STATUS = "TYPING_STATUS", e.MESSAGE_BLOCKED = "MESSAGE_BLOCKED", e.ULTRA_GROUP_ENABLE = "ULTRA_GROUP_ENABLE", e.OPERATE_STATUS = "OPERATE_STATUS", e.ULTRA_GROUP_MESSAGE_EXPANSION_UPDATED = "ULTRA_GROUP_MESSAGE_EXPANSION_UPDATED", e.ULTRA_GROUP_MESSAGE_MODIFIED = "ULTRA_GROUP_MESSAGE_MODIFIED", e.ULTRA_GROUP_MESSAGE_RECALLED = "ULTRA_GROUP_MESSAGE_RECALLED", e.ULTRA_GROUP_CHANNEL_TYPE_CHANGE = "ULTRA_GROUP_CHANNEL_TYPE_CHANGE", e.ULTRA_GROUP_CHANNEL_DELETE = "ULTRA_GROUP_CHANNEL_DELETE", e.ULTRA_GROUP_CHANNEL_USER_KICKED = "ULTRA_GROUP_CHANNEL_USER_KICKED", e.PRIVATE_MESSAGE_DELIVERED = "PRIVATE_MESSAGE_DELIVERED", e.GROUP_MESSAGE_DELIVERED = "GROUP_MESSAGE_DELIVERED", e.USER_GROUP_STATUS = "USER_GROUP_STATUS"
}(ye || (ye = {}));
var Ve, be = {
    A_ADD_TO_BLACKLIST_T: "A-add_to_blacklist-T",
    A_ADD_TO_BLACKLIST_R: "A-add_to_blacklist-R",
    A_REMOVE_FROM_BLACKLIST_T: "A-remove_from_blacklist-T",
    A_REMOVE_FROM_BLACKLIST_R: "A-remove_from_blacklist-R",
    A_GET_BLACKLIST_T: "A-get_blacklist-T",
    A_GET_BLACKLIST_R: "A-get_blacklist-R",
    A_GET_BLACKLIST_STATUS_T: "A-get_blacklist_status-T",
    A_GET_BLACKLIST_STATUS_R: "A-get_blacklist_status-R",
    A_GET_CHATROOM_INFO_T: "A-get_chatroom_info-T",
    A_GET_CHATROOM_INFO_R: "A-get_chatroom_info-R",
    A_SET_CHATROOM_ENTRY_T: "A-set_chatroom_entry-T",
    A_SET_CHATROOM_ENTRY_R: "A-set_chatroom_entry-R",
    A_SET_CHATROOM_ENTRIES_T: "A-set_chatroom_entries-T",
    A_SET_CHATROOM_ENTRIES_R: "A-set_chatroom_entries-R",
    A_FORCE_SET_CHATROOM_ENTRY_T: "A-force_set_chatroom_entry-T",
    A_FORCE_SET_CHATROOM_ENTRY_R: "A-force_set_chatroom_entry-R",
    A_REMOVE_CHATROOM_ENTRY_T: "A-remove_chatroom_entry-T",
    A_REMOVE_CHATROOM_ENTRY_R: "A-remove_chatroom_entry-R",
    A_REMOVE_CHATROOM_ENTRIES_T: "A-remove_chatroom_entries-T",
    A_REMOVE_CHATROOM_ENTRIES_R: "A-remove_chatroom_entries-R",
    A_FORCE_REMOVE_CHATROOM_ENTRY_T: "A-force_remove_chatroom_entry-T",
    A_FORCE_REMOVE_CHATROOM_ENTRY_R: "A-force_remove_chatroom_entry-R",
    A_GET_CHATROOM_ENTRY_T: "A-get_chatroom_entry-T",
    A_GET_CHATROOM_ENTRY_R: "A-get_chatroom_entry-R",
    A_GET_ALL_CHATROOM_ENTRIES_T: "A-get_all_chatroom_entries-T",
    A_GET_ALL_CHATROOM_ENTRIES_R: "A-get_all_chatroom_entries-R",
    A_GET_CHATROOM_HISTORY_MESSAGES_T: "A-get_chatroom_history_messages-T",
    A_GET_CHATROOM_HISTORY_MESSAGES_R: "A-get_chatroom_history_messages-R",
    A_BIND_RTC_ROOM_FOR_CHATROOM_T: "A-bind_rtc_room_for_chatroom-T",
    A_BIND_RTC_ROOM_FOR_CHATROOM_R: "A-bind_rtc_room_for_chatroom-R",
    A_GET_TOP_CONVERSATION_LIST_R: "A-get_top_conversation_list-R",
    A_GET_TOP_CONVERSATION_LIST_T: "A-get_top_conversation_list-T",
    A_GET_CONVERSATION_LIST_T: "A-get_conversation_list-T",
    A_GET_CONVERSATION_LIST_R: "A-get_conversation_list-R",
    A_GET_CONVERSATION_T: "A-get_conversation-T",
    A_GET_CONVERSATION_R: "A-get_conversation-R",
    A_REMOVE_CONVERSATION_T: "A-remove_conversation-T",
    A_REMOVE_CONVERSATION_R: "A-remove_conversation-R",
    A_GET_CONVERSATION_MESSAGE_DRAFT_T: "A-get_conversation_message_draft-T",
    A_GET_CONVERSATION_MESSAGE_DRAFT_R: "A-get_conversation_message_draft-R",
    A_SAVE_CONVERSATION_MESSAGE_DRAFT_T: "A-save_conversation_message_draft-T",
    A_SAVE_CONVERSATION_MESSAGE_DRAFT_R: "A-save_conversation_message_draft-R",
    A_CLEAR_CONVERSATION_MESSAGE_DRAFT_T: "A-clear_conversation_message_draft-T",
    A_CLEAR_CONVERSATION_MESSAGE_DRAFT_R: "A-clear_conversation_message_draft-R",
    A_GET_TOTAL_UNREAD_COUNT_T: "A-get_total_unread_count-T",
    A_GET_TOTAL_UNREAD_COUNT_R: "A-get_total_unread_count-R",
    A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_T: "A-get_total_unread_count_by_levels-T",
    A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_R: "A-get_total_unread_count_by_levels-R",
    A_GET_UNREAD_COUNT_T: "A-get_unread_count-T",
    A_GET_UNREAD_COUNT_R: "A-get_unread_count-R",
    A_CLEAR_UNREAD_COUNT_T: "A-clear_unread_count-T",
    A_CLEAR_UNREAD_COUNT_R: "A-clear_unread_count-R",
    A_CLEAR_ALL_UNREAD_COUNT_O: "A-clear_all_unread_count-O",
    A_SET_CONVERSATION_NOTIFICATION_LEVEL_T: "A-set_conversation_notification_level-T",
    A_SET_CONVERSATION_NOTIFICATION_LEVEL_R: "A-set_conversation_notification_level-R",
    A_SET_CONVERSATION_STATUS_T: "A-set_conversation_status-T",
    A_SET_CONVERSATION_STATUS_R: "A-set_conversation_status-R",
    A_GET_CONVERSATION_NOTIFICATION_LEVEL_T: "A-get_conversation_notification_level-T",
    A_GET_CONVERSATION_NOTIFICATION_LEVEL_R: "A-get_conversation_notification_level-R",
    A_GET_CONVERSATION_NOTIFICATION_STATUS_T: "A-get_conversation_notification_status-T",
    A_GET_CONVERSATION_NOTIFICATION_STATUS_R: "A-get_conversation_notification_status-R",
    A_GET_UNREAD_CONVERSATION_LIST_T: "A-get_unread_conversation_list-T",
    A_GET_UNREAD_CONVERSATION_LIST_R: "A-get_unread_conversation_list-R",
    A_GET_UNREAD_MENTIONED_COUNT_T: "A-get_unread_mentioned_count-T",
    A_GET_UNREAD_MENTIONED_COUNT_R: "A-get_unread_mentioned_count-R",
    A_GET_ALL_UNREAD_MENTIONED_COUNT_T: "A-get_all_unread_mentioned_count-T",
    A_GET_ALL_UNREAD_MENTIONED_COUNT_R: "A-get_all_unread_mentioned_count-R",
    A_GET_ALL_CONVERSATION_STATE_T: "A-get_all_conversation-state-T",
    A_GET_ALL_CONVERSATION_STATE_R: "A-get_all_conversation-state-R",
    A_E_GET_ALL_CONVERSATION_LIST_T: "A-e_get_all_conversation_list-T",
    A_E_GET_ALL_CONVERSATION_LIST_R: "A-e_get_all_conversation_list-R",
    A_E_GET_CONVERSATION_LIST_T: "A-e_get_conversation_list-T",
    A_E_GET_CONVERSATION_LIST_R: "A-e_get_conversation_list-R",
    A_E_SEARCH_CONVERSATION_BY_CONTENT_T: "A-e_search_conversation_by_content-T",
    A_E_SEARCH_CONVERSATION_BY_CONTENT_R: "A-e_search_conversation_by_content-R",
    A_E_SEARCH_MESSAGES_T: "A-e_search_messages-T",
    A_E_SEARCH_MESSAGES_R: "A-e_search_messages-R",
    A_E_SEARCH_MESSAGE_IN_TIME_RANGE_T: "A-e_search_message_in_time_range-T",
    A_E_SEARCH_MESSAGE_IN_TIME_RANGE_R: "A-e_search_message_in_time_range-R",
    A_E_SEARCH_MESSAGES_BY_USER_T: "A-e_search_messages_by_user-T",
    A_E_SEARCH_MESSAGES_BY_USER_R: "A-e_search_messages_by_user-R",
    A_E_GET_HISTORY_MESSAGES_BY_MESSAGE_TYPES_T: "A-e_get_history_messages_by_message_types-T",
    A_E_GET_HISTORY_MESSAGES_BY_MESSAGE_TYPES_R: "A-e_get_history_messages_by_message_types-R",
    A_E_SET_MESSAGE_STATUS_TO_READ_T: "A-e_set_message_status_to_read-T",
    A_E_SET_MESSAGE_STATUS_TO_READ_R: "A-e_set_message_status_to_read-R",
    A_E_SET_MESSAGE_RECEIVED_STATUS_T: "A-e_set_message_received_status-T",
    A_E_SET_MESSAGE_RECEIVED_STATUS_R: "A-e_set_message_received_status-R",
    A_E_SET_MESSAGE_SENT_STATUS_T: "A-e_set_message_sent_status-T",
    A_E_SET_MESSAGE_SENT_STATUS_R: "A-e_set_message_sent_status-R",
    A_E_SET_MESSAGE_SENT_STATUS_INFO_T: "A-e_set_message_sent_status_info-T",
    A_E_SET_MESSAGE_SENT_STATUS_INFO_R: "A-e_set_message_sent_status_info-R",
    A_E_SET_MESSAGE_CONTENT_T: "A-e_set_message_content-T",
    A_E_SET_MESSAGE_CONTENT_R: "A-e_set_message_content-R",
    A_E_DELETE_MESSAGES_T: "A-e_delete_messages-T",
    A_E_DELETE_MESSAGES_R: "A-e_delete_messages-R",
    A_E_CLEAR_MESSAGES_T: "A-e_clear_messages-T",
    A_E_CLEAR_MESSAGES_R: "A-e_clear_messages-R",
    A_E_DELETE_MESSAGES_BY_TIMESTAMP_T: "A-e_delete_messages_by_timestamp-T",
    A_E_DELETE_MESSAGES_BY_TIMESTAMP_R: "A-e_delete_messages_by_timestamp-R",
    A_E_INSERT_MESSAGE_T: "A-e_insert_message-T",
    A_E_INSERT_MESSAGE_R: "A-e_insert_message-R",
    A_E_BATCH_INSERT_MESSAGE_T: "A-e_batch_insert_message-T",
    A_E_BATCH_INSERT_MESSAGE_R: "A-e_batch_insert_message-R",
    A_E_GET_MESSAGE_COUNT_T: "A-e_get_message_count-T",
    A_E_GET_MESSAGE_COUNT_R: "A-e_get_message_count-R",
    A_E_GET_PRIVATE_MESSAGE_DELIVER_TIME_T: "A-e_get_private_message_deliver_time-T",
    A_E_GET_PRIVATE_MESSAGE_DELIVER_TIME_R: "A-e_get_private_message_deliver_time-R",
    A_E_GET_GROUP_MESSAGE_DELIVER_LIST_T: "A-e_get_group_message_deliver_list-T",
    A_E_GET_GROUP_MESSAGE_DELIVER_LIST_R: "A-e_get_group_message_deliver_list-R",
    A_E_SET_CHECK_DUPLICATE_MESSAGE_T: "A-e_set_check_duplicate_message-T",
    A_E_SET_CHECK_DUPLICATE_MESSAGE_R: "A-e_set_check_duplicate_message-R",
    A_E_CLEAR_LOCAL_DATA_T: "A-e_clear_local_data-T",
    A_E_CLEAR_LOCAL_DATA_R: "A-e_clear_local_data-R",
    A_BATCH_CLEAR_MESSAGES_BY_TIMESTAMP_T: "A-batch_clear_messages_by_timestamp-T",
    A_BATCH_CLEAR_MESSAGES_BY_TIMESTAMP_R: "A-batch_clear_messages_by_timestamp-R",
    A_BATCH_REMOVE_CONVERSATION_T: "A-batch_Remove_conversation-T",
    A_BATCH_REMOVE_CONVERSATION_R: "A-batch_Remove_conversation-R",
    A_BATCH_SET_CON_NOTIFI_LEVEL_T: "A-batch_set_con_notifi_level-T",
    A_BATCH_SET_CON_NOTIFI_LEVEL_R: "A-batch_set_con_notifi_level-R",
    A_BATCH_SET_CON_TO_TOP_T: "A-batch_set_con_to_top-T",
    A_BATCH_SET_CON_TO_TOP_R: "A-batch_set_con_to_top-R",
    A_BATCH_CLEAR_REMOTE_MSG_T: "A-batch_clear_remote_msg-T",
    A_BATCH_CLEAR_REMOTE_MSG_R: "A-batch_clear_remote_msg-R",
    A_BATCH_CLEAR_MSG_T: "A-batch_clear_msg-T",
    A_BATCH_CLEAR_MSG_R: "A-batch_clear_msg-R",
    A_GET_REMOTE_HISTORY_MESSAGES_T: "A-get_remote_history_messages-T",
    A_GET_REMOTE_HISTORY_MESSAGES_R: "A-get_remote_history_messages-R",
    A_RECALL_MESSAGE_T: "A-recall_message-T",
    A_RECALL_MESSAGE_R: "A-recall_message-R",
    A_DELETE_REMOTE_MESSAGE_T: "A-delete_remote_message-T",
    A_DELETE_REMOTE_MESSAGE_R: "A-delete_remote_message-R",
    A_DELETE_REMOTE_MESSAGE_BY_TIMESTAMP_T: "A-delete_remote_message_by_timestamp-T",
    A_DELETE_REMOTE_MESSAGE_BY_TIMESTAMP_R: "A-delete_remote_message_by_timestamp-R",
    A_UPDATE_MESSAGE_EXPANSION_T: "A-update_message_expansion-T",
    A_UPDATE_MESSAGE_EXPANSION_R: "A-update_message_expansion-R",
    A_REMOVE_MESSAGE_EXPANSION_FOR_KEY_T: "A-remove_message_expansion_for_key-T",
    A_REMOVE_MESSAGE_EXPANSION_FOR_KEY_R: "A-remove_message_expansion_for_key-R",
    A_GET_MESSAGE_READER_T: "A-get_message_reader-T",
    A_GET_MESSAGE_READER_R: "A-get_message_reader-R",
    A_GET_FIRST_UNREAD_MESSAGE_T: "A-get_first_unread_message-T",
    A_GET_FIRST_UNREAD_MESSAGE_R: "A-get_first_unread_message-R",
    A_GET_FIRST_UNREAD_MESSAGE_INFO_T: "A-get_first_unread_message_info-T",
    A_GET_FIRST_UNREAD_MESSAGE_INFO_R: "A-get_first_unread_message_info-R",
    A_INSERT_MESSAGE_T: "A-insert_message-T",
    A_INSERT_MESSAGE_R: "A-insert_message-R",
    A_GET_MESSAGE_T: "A-get_message-T",
    A_GET_MESSAGE_R: "A-get_message-R",
    A_GET_UNREAD_MENTIONED_MESSAGES_T: "A-get_unread_mentioned_messages-T",
    A_GET_UNREAD_MENTIONED_MESSAGES_R: "A-get_unread_mentioned_messages-R",
    A_DELETE_LOCAL_MESSAGES_BY_TIMESTAMP_T: "A-delete_local_messages_by_timestamp-T",
    A_DELETE_LOCAL_MESSAGES_BY_TIMESTAMP_R: "A-delete_local_messages_by_timestamp-R",
    A_CLEAR_MESSAGES_T: "A-clear_messages-T",
    A_CLEAR_MESSAGES_R: "A-clear_messages-R",
    A_SEARCH_CONVERSATION_BY_CONTENT_T: "A-search_conversation_by_content-T",
    A_SEARCH_CONVERSATION_BY_CONTENT_R: "A-search_conversation_by_content-R",
    A_CLEAR_UNREAD_COUNT_BY_TIMESTAMP_T: "A-clear_unread_count_by_timestamp-T",
    A_CLEAR_UNREAD_COUNT_BY_TIMESTAMP_R: "A-clear_unread_count_by_timestamp-R",
    A_SET_MESSAGE_RECEIVED_STATUS_T: "A-set_message_received_status-T",
    A_SET_MESSAGE_RECEIVED_STATUS_R: "A-set_message_received_status-R",
    A_SET_PROXY_T: "A-set_proxy-T",
    A_SET_PROXY_R: "A-set_proxy-R",
    A_GET_PROXY_T: "A-get_proxy-T",
    A_GET_PROXY_R: "A-get_proxy-R",
    A_TEST_PROXY_T: "A-test_proxy-T",
    A_TEST_PROXY_R: "A-test_proxy-R",
    A_ADD_TAG_T: "A-add_tag-T",
    A_ADD_TAG_R: "A-add_tag-R",
    A_REMOVE_TAG_T: "A-remove_tag-T",
    A_REMOVE_TAG_R: "A-remove_tag-R",
    A_UPDATE_TAG_T: "A-update_tag-T",
    A_UPDATE_TAG_R: "A-update_tag-R",
    A_GET_TAGS_T: "A-get_tags-T",
    A_GET_TAGS_R: "A-get_tags-R",
    A_GET_TAGS_FOR_CONVERSATION_T: "A-get_tags_for_conversation-T",
    A_GET_TAGS_FOR_CONVERSATION_R: "A-get_tags_for_conversation-R",
    A_ADD_TAG_FOR_CONVERSATIONS_T: "A-add_tag_for_conversations-T",
    A_ADD_TAG_FOR_CONVERSATIONS_R: "A-add_tag_for_conversations-R",
    A_REMOVE_CONVERSATIONS_FROM_TAG_T: "A-remove_conversations_from_tag-T",
    A_REMOVE_CONVERSATIONS_FROM_TAG_R: "A-remove_conversations_from_tag-R",
    A_REMOVE_TAGS_FROM_CONVERSATION_T: "A-remove_tags_from_conversation-T",
    A_REMOVE_TAGS_FROM_CONVERSATION_R: "A-remove_tags_from_conversation-R",
    A_REMOVE_TAG_FROM_CONVERSATIONS_T: "A-remove_tag_from_conversations-T",
    A_REMOVE_TAG_FROM_CONVERSATIONS_R: "A-remove_tag_from_conversations-R",
    A_GET_CONVERSATIONS_FROM_TAG_BY_PAGE_T: "A-get_conversations_from_tag_by_page-T",
    A_GET_CONVERSATIONS_FROM_TAG_BY_PAGE_R: "A-get_conversations_from_tag_by_page-R",
    A_GET_UNREAD_COUNT_BY_TAG_T: "A-get_unread_count_by_tag-T",
    A_GET_UNREAD_COUNT_BY_TAG_R: "A-get_unread_count_by_tag-R",
    A_SET_CONVERSATION_STATUS_IN_TAG_T: "A-set_conversation_status_in_tag-T",
    A_SET_CONVERSATION_STATUS_IN_TAG_R: "A-set_conversation_status_in_tag-R",
    A_GET_ULTRA_GROUP_LIST_T: "A-get_ultra_group_list-T",
    A_GET_ULTRA_GROUP_LIST_R: "A-get_ultra_group_list-R",
    A_GET_BLOCK_ULTRA_GROUP_LIST_T: "A-get_block_ultra_group_list-T",
    A_GET_BLOCK_ULTRA_GROUP_LIST_R: "A-get_block_ultra_group_list-R",
    A_SEND_ULTRA_GROUP_TYPING_STATUS_T: "A-send_ultra_group_typing_status-T",
    A_SEND_ULTRA_GROUP_TYPING_STATUS_R: "A-send_ultra_group_typing_status-R",
    A_GET_ULTRA_GROUP_MESSAGE_LIST_BY_MESSAGE_UID_T: "A-get_ultra_group_message_list_by_message_uid-T",
    A_GET_ULTRA_GROUP_MESSAGE_LIST_BY_MESSAGE_UID_R: "A-get_ultra_group_message_list_by_message_uid-R",
    A_UPDATE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_T: "A-update_expansion_for_ultra_group_message-T",
    A_UPDATE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_R: "A-update_expansion_for_ultra_group_message-R",
    A_REMOVE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_T: "A-remove_expansion_for_ultra_group_message-T",
    A_REMOVE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_R: "A-remove_expansion_for_ultra_group_message-R",
    A_REMOVE_ALL_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_T: "A-remove_all_expansion_for_ultra_group_message-T",
    A_REMOVE_ALL_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_R: "A-remove_all_expansion_for_ultra_group_message-R",
    A_MODIFY_MESSAGE_T: "A-modify_message-T",
    A_MODIFY_MESSAGE_R: "A-modify_message-R",
    A_GET_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_BY_TARGET_ID_T: "A-get_ultra_group_unread_mentioned_count_by_target_id-T",
    A_GET_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_BY_TARGET_ID_R: "A-get_ultra_group_unread_mentioned_count_by_target_id-R",
    A_GET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_T: "A-get_ultra_group_default_notification_level-T",
    A_GET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_R: "A-get_ultra_group_default_notification_level-R",
    A_SET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_T: "A-set_ultra_group_default_notification_level-T",
    A_SET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_R: "A-set_ultra_group_default_notification_level-R",
    A_GET_ULTRA_GROUP_UNREAD_COUNT_BY_TARGET_ID_T: "A-get_ultra_group_unread_count_by_target_id-T",
    A_GET_ULTRA_GROUP_UNREAD_COUNT_BY_TARGET_ID_R: "A-get_ultra_group_unread_count_by_target_id-R",
    A_GET_ALL_ULTRA_GROUP_UNREAD_COUNT_T: "A-get_all_ultra_group_unread_count-T",
    A_GET_ALL_ULTRA_GROUP_UNREAD_COUNT_R: "A-get_all_ultra_group_unread_count-R",
    A_GET_ALL_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_T: "A-get_all_ultra_group_unread_mentioned_count-T",
    A_GET_ALL_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_R: "A-get_all_ultra_group_unread_mentioned_count-R",
    A_GET_ULTRA_GROUP_UNREAD_MENTIONED_MESSAGES_T: "A-get_ultra_group_unread_mentioned_messages-T",
    A_GET_ULTRA_GROUP_UNREAD_MENTIONED_MESSAGES_R: "A-get_ultra_group_unread_mentioned_messages-R",
    A_GET_ULTRA_GROUP_FIRST_UNREAD_MESSAGE_TIMESTAMP_T: "A-get_ultra_group_first_unread_message_timestamp-T",
    A_GET_ULTRA_GROUP_FIRST_UNREAD_MESSAGE_TIMESTAMP_R: "A-get_ultra_group_first_unread_message_timestamp-R",
    A_GET_ULTRA_GROUP_UNREAD_INFO_LIST_T: "A-get_ultra_group_unread_info_list-T",
    A_GET_ULTRA_GROUP_UNREAD_INFO_LIST_R: "A-get_ultra_group_unread_info_list-R"
};
!function (e) {
    e[e.DISALLOW = 0] = "DISALLOW", e[e.ALLOW = 1] = "ALLOW"
}(Ve || (Ve = {}));
var Je = new c, Fe = {
    connection: function (e, t) {
        switch (e) {
            case _.CONNECTED:
                Je.emit(ye.CONNECTED);
                break;
            case _.CONNECTING:
                Je.emit(ye.CONNECTING);
                break;
            case _.SUSPENDED:
                Je.emit(ye.SUSPEND, t);
                break;
            case _.DISCONNECTED:
                Je.emit(ye.DISCONNECT, t)
        }
    }, batchMessage: function (e) {
        Je.emit(ye.MESSAGES, {
            messages: e.map((function (e) {
                return De(e)
            }))
        })
    }, typingState: function (e) {
        Je.emit(ye.TYPING_STATUS, {status: e})
    }, readReceiptReceived: function (e, t, n, o) {
        Je.emit(ye.READ_RECEIPT_RECEIVED, {conversation: e, messageUId: t, sentTime: n, sendUserId: o})
    }, messageReceiptRequest: function (e, t, n) {
        Je.emit(ye.MESSAGE_RECEIPT_REQUEST, {conversation: e, messageUId: t, senderUserId: n})
    }, messageReceiptResponse: function (e, t, n) {
        Je.emit(ye.MESSAGE_RECEIPT_RESPONSE, {conversation: e, receivedUserId: t, messageUIdList: n})
    }, conversationState: function (e) {
        var t = e.map((function (e) {
            var t = e.conversationType, n = {
                conversationType: t,
                latestMessage: e.latestMessage ? De(e.latestMessage) : null,
                targetId: e.targetId,
                unreadMessageCount: e.unreadMessageCount,
                unreadMentionedCount: e.unreadMentionedCount,
                notificationStatus: e.notificationStatus,
                notificationLevel: e.notificationLevel,
                lastUnreadTime: e.lastUnreadTime,
                channelId: e.channelId
            };
            return t === a.ULTRA_GROUP ? (n.versionTime = e.versionTime, n.unreadMessageCount = He(e.unreadMessageCount || 0), n.unreadMentionedCount = He(e.unreadMentionedCount || 0), n.unreadMentionedMeCount = He(e.unreadMentionedMeCount || 0), {conversation: n}) : (n.hasMentioned = e.hasMentioned, n.mentionedInfo = e.mentionedInfo, n.isTop = e.isTop, {
                conversation: n,
                updatedItems: e.updatedItems
            })
        }));
        Je.emit(ye.CONVERSATION, {conversationList: t})
    }, chatroomState: function (e) {
        Je.emit(ye.CHATROOM, e)
    }, expansion: function (e) {
        Je.emit(ye.EXPANSION, e)
    }, pullFinished: function () {
        Je.emit(ye.PULL_OFFLINE_MESSAGE_FINISHED)
    }, tag: function () {
        Je.emit(ye.TAG)
    }, conversationTagChanged: function () {
        Je.emit(ye.CONVERSATION_TAG)
    }, messageBlocked: function (e) {
        Je.emit(ye.MESSAGE_BLOCKED, e)
    }, messageDelivered: function (e) {
        Je.emit(ye.PRIVATE_MESSAGE_DELIVERED, e)
    }, groupMessageDeliveredStatus: function (e) {
        Je.emit(ye.GROUP_MESSAGE_DELIVERED, e)
    }, ultraGroupEnable: function (e) {
        Je.emit(ye.ULTRA_GROUP_ENABLE, e.map((function (e) {
            return Be(e)
        })))
    }, operateStatus: function (e) {
        Je.emit(ye.OPERATE_STATUS, e)
    }, ultraGroupMessageExpansionUpdated: function (e) {
        Je.emit(ye.ULTRA_GROUP_MESSAGE_EXPANSION_UPDATED, e.map((function (e) {
            return De(e)
        })))
    }, ultraGroupMessageModified: function (e) {
        Je.emit(ye.ULTRA_GROUP_MESSAGE_MODIFIED, e.map((function (e) {
            return De(e)
        })))
    }, ultraGroupMessageRecalled: function (e) {
        Je.emit(ye.ULTRA_GROUP_MESSAGE_RECALLED, e.map((function (e) {
            return De(e)
        })))
    }, ultraGroupChannelChangeType: function (e) {
        Je.emit(ye.ULTRA_GROUP_CHANNEL_TYPE_CHANGE, e)
    }, ultraGroupChannelUserKicked: function (e) {
        Je.emit(ye.ULTRA_GROUP_CHANNEL_USER_KICKED, e)
    }, ultraGroupChannelDelete: function (e) {
        Je.emit(ye.ULTRA_GROUP_CHANNEL_DELETE, e)
    }, userGroupStatus: function (e) {
        Je.emit(ye.USER_GROUP_STATUS, e)
    }, messageReadReceipt: function (e) {
        Je.emit(ye.MESSAGE_READ_RECEIPT_V4, e)
    }, syncReadStatus: function (e) {
        Je.emit(ye.SYNC_READ_STATUS, e)
    }
};

function He(e) {
    return e > 999 ? 999 : e
}

u.add("imlib-next", "5.9.5");
var ke = null, xe = null, Ye = null;

function Ze() {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (e) {
            switch (e.label) {
                case 0:
                    return ke ? (Ye.info(A.A_DESTROY_O), [4, R. destroy()]) : [2];
                case 1:
                    return e.sent(), xe = null, ke = null, Ye = null, [2]
            }
        }))
    }))
}

function Ke(e) {
    if (!ke) throw new Error("Not initialized yet!");
    return e(ke, Ye, xe)
}

function qe(e) {
    return ke ? e(ke, Ye, xe) : Promise.resolve({code: i.BIZ_ERROR_CLIENT_NOT_INIT})
}

function Xe(e) {
    return ke ? e(ke, Ye, xe) : {code: i.BIZ_ERROR_CLIENT_NOT_INIT}
}

function ze(e, t, n) {
    Je.on(e, t, n)
}

function je(e, t, n) {
    Je.once(e, t, n)
}

function We(e, t, n) {
    Je.off(e, t, n)
}

function Qe(e) {
    Je.removeAll(e)
}

function $e() {
    Je.clear()
}

function et(e) {
    !function (e) {
        var t, n = e.appkey, o = e.navigators;
        ke ? Ye.warn(A.A_INIT_REPEAT_O) : (d("options.appkey", e.appkey, E.STRING, !0), d("options.navigators", e.navigators, (function (e) {
            return T(e) && (0 === e.length || e.every(S))
        })), xe = e, ke = R.init((null === (t = e.__runtimeCreator__) || void 0 === t ? void 0 : t.call(e)) || Pe, {
            appkey: e.appkey,
            navigators: e.navigators || [],
            miniCMPProxy: e.customCMP || [],
            logOutputLevel: e.logOutputLevel,
            __reportLogLevel: e.__reportLogLevel,
            httpInMainProcess: !!e.httpInMainProcess,
            logExpireTime: e.logExpireTime,
            areaCode: e.areaCode,
            logServerUrl: e.logServerUrl
        }), (Ye = ke.createLogger("RC-IM", "IM")).setOutputLevel(e.logOutputLevel), Ye.info(A.A_INIT_O, JSON.stringify({
            appkey: n,
            navigators: o,
            version: "5.9.5",
            commit: "d7cdfc18d4a1ed1e7af4ebd5e9eaf0f8a0460a69"
        })), ke.assignWatcher(Fe), f.init(Ye))
    }(e)
}

function nt() {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (e) {
            return ke ? ($e(), [2, Ze()]) : [2]
        }))
    }))
}

function ot() {
    return Ke((function (e) {
        return e.getConnectionStatus()
    }))
}

function rt() {
    return Ke((function (e) {
        return e.getServerTime()
    }))
}

function it() {
    return Ke((function (e) {
        return e.getCurrentUserId()
    }))
}

function st(e, t) {
    u.add(e, t)
}

function at() {
    return Ke((function (e) {
        return e.getDeviceId()
    }))
}

function ct(e, t) {
    return Ke((function (n) {
        return n.install(e, t)
    }))
}

var _t = {
    TIMEOUT: {code: -1, msg: "Network timeout"},
    REJECTED_BY_BLACKLIST: {code: 405, msg: "Blacklisted by the other party"},
    SEND_TOO_FAST: {code: 20604, msg: "Sending messages too quickly"},
    NOT_IN_GROUP: {code: 22406, msg: "Not in group"},
    ULTRA_GROUP_USER_NOT_IN_PRIVATE_CHANNEL: {
        code: i.ULTRA_GROUP_USER_NOT_IN_PRIVATE_CHANNEL,
        msg: "ultra group user not in private channel"
    },
    FORBIDDEN_IN_GROUP: {code: 22408, msg: "Forbbiden from speaking in the group"},
    NOT_IN_CHATROOM: {code: 23406, msg: "Not in chatRoom"},
    FORBIDDEN_IN_CHATROOM: {code: 23408, msg: "Forbbiden from speaking in the chatRoom"},
    KICKED_FROM_CHATROOM: {code: 23409, msg: "Kicked out and forbbiden from joining the chatRoom"},
    CHATROOM_NOT_EXIST: {code: 23410, msg: "ChatRoom does not exist"},
    CHATROOM_IS_FULL: {code: 23411, msg: "ChatRoom members exceeded"},
    PARAMETER_INVALID_CHATROOM: {code: 23412, msg: "Invalid chatRoom parameters"},
    ROAMING_SERVICE_UNAVAILABLE_CHATROOM: {
        code: 23414,
        msg: "ChatRoom message roaming service is not open, Please go to the developer to open this service"
    },
    RECALLMESSAGE_PARAMETER_INVALID: {code: 25101, msg: "Invalid recall message parameter"},
    ROAMING_SERVICE_UNAVAILABLE_MESSAGE: {
        code: 25102,
        msg: "Single group chat roaming service is not open, Please go to the developer to open this service"
    },
    PUSHSETTING_PARAMETER_INVALID: {code: 26001, msg: "Invalid push parameter"},
    OPERATION_BLOCKED: {code: 20605, msg: "Operation is blocked"},
    OPERATION_NOT_SUPPORT: {code: 20606, msg: "Operation is not supported"},
    MSG_BLOCKED_SENSITIVE_WORD: {code: 21501, msg: "The sent message contains sensitive words"},
    REPLACED_SENSITIVE_WORD: {code: 21502, msg: "Sensitive words in the message have been replaced"},
    NOT_CONNECTED: {code: 30001, msg: "Please connect successfully first"},
    NAVI_REQUEST_ERROR: {code: 30007, msg: "Navigation http request failed"},
    CMP_REQUEST_ERROR: {code: 30010, msg: "CMP sniff http request failed"},
    CONN_APPKEY_FAKE: {code: 31002, msg: "Your appkey is fake"},
    CONN_MINI_SERVICE_NOT_OPEN: {
        code: 31003,
        msg: "Mini program service is not open, Please go to the developer to open this service"
    },
    CONN_ACK_TIMEOUT: {code: 31e3, msg: "Connection ACK timeout"},
    CONN_TOKEN_INCORRECT: {code: 31004, msg: "Your token is not valid or expired"},
    CONN_NOT_AUTHRORIZED: {code: 31005, msg: "AppKey and Token do not match"},
    CONN_REDIRECTED: {code: 31006, msg: "Connection redirection"},
    CONN_APP_BLOCKED_OR_DELETED: {code: 31008, msg: "AppKey is banned or deleted"},
    CONN_USER_BLOCKED: {code: 31009, msg: "User blocked"},
    CONN_DOMAIN_INCORRECT: {code: 31012, msg: "Connect domain error, Please check the set security domain"},
    ROAMING_SERVICE_UNAVAILABLE: {
        code: 33007,
        msg: "Roaming service cloud is not open, Please go to the developer to open this service"
    },
    RC_CONNECTION_EXIST: {code: 34001, msg: "Connection already exists"},
    CHATROOM_KV_EXCEED: {code: 23423, msg: "ChatRoom KV setting exceeds maximum"},
    CHATROOM_KV_OVERWRITE_INVALID: {code: 23424, msg: "ChatRoom KV already exists"},
    CHATROOM_KV_STORE_NOT_OPEN: {
        code: 23426,
        msg: "ChatRoom KV storage service is not open, Please go to the developer to open this service"
    },
    CHATROOM_KEY_NOT_EXIST: {code: 23427, msg: "ChatRoom key does not exist"},
    MSG_KV_NOT_SUPPORT: {code: 34008, msg: "The message cannot be extended"},
    SEND_MESSAGE_KV_FAIL: {code: 34009, msg: "Sending RC expansion message fail"},
    EXPANSION_LIMIT_EXCEET: {code: 34010, msg: "The message expansion size is beyond the limit"},
    ILLGAL_PARAMS: {code: 33003, msg: "Incorrect parameters passed in while calling the interface"},
    UPLOAD_FILE_FAILED: {code: 35020, msg: "File upload failed"},
    CHATROOM_KV_STORE_NOT_ALL_SUCCESS: {code: 23428, msg: "Chatroom kv store not all success"},
    CHATROOM_KV_STORE_OUT_LIMIT: {code: 23429, msg: "Chatroom kv's length is out of limit"},
    TAG_EXISTS: {code: 33101, msg: "The tag already exists"},
    TAG_NOT_EXIST: {code: 33100, msg: "The tag does not exist"},
    NOT_SUPPORT: {code: i.NOT_SUPPORT, msg: "The method is not supported in a browser!"}
}, ut = {};
for (var dt in _t) {
    var Et = _t[dt].code;
    ut[Et] = dt
}

function Tt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return l("token", e, E.STRING, !0) && l("reconnectKickEnable", t, E.BOOLEAN) ? (n = r.createTraceId(), r.info(A.A_CONNECT_T, JSON.stringify({
                                    token: e,
                                    reconnectKickEnable: t
                                }), n), [4, o.connect(e, !!t, n)]) : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                            case 1:
                                return s = c.sent(), a = s.code === i.SUCCESS ? "info" : "warn", r[a](A.A_CONNECT_R, JSON.stringify({
                                    code: s.code,
                                    userId: s.userId
                                }), n), s.code === i.SUCCESS ? [2, {
                                    code: s.code,
                                    data: {userId: s.userId}
                                }] : [2, {code: s.code, msg: ut[s.code]}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function St(e) {
    return f.info(A.A_DISCONNECT_O, {}), Ke((function (t) {
        return t.disconnect(e)
    }))
}

function Rt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("options.count", null == e ? void 0 : e.count, E.NUMBER) && l("options.startTime", null == e ? void 0 : e.startTime, E.NUMBER) && l("options.order", null == e ? void 0 : e.order, E.NUMBER) && l("channelId", t, E.CHANNEL_ID) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_CONVERSATION_LIST_T, JSON.stringify({
                                    count: null == e ? void 0 : e.count,
                                    startTime: null == e ? void 0 : e.startTime,
                                    order: null == e ? void 0 : e.order,
                                    channelId: t
                                }), n), [4, o.getConversationList(null == e ? void 0 : e.count, void 0, null == e ? void 0 : e.startTime, null == e ? void 0 : e.order, t)];
                            case 1:
                                return s = u.sent(), a = s.code, c = s.data, a === i.SUCCESS && c ? (_ = c.map((function (e) {
                                    return Be(e)
                                })), r.info(be.A_GET_CONVERSATION_LIST_R, JSON.stringify({
                                    code: a,
                                    list: _.length
                                }), n), [2, {
                                    code: 0,
                                    data: _
                                }]) : (r.warn(be.A_GET_CONVERSATION_LIST_R, JSON.stringify({code: a})), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function At(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u, d;
                    return Y(this, (function (E) {
                        switch (E.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_GET_CONVERSATION_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.getConversation(t, r, s || "")];
                            case 1:
                                return c = E.sent(), _ = c.code, u = c.data, d = _ === i.SUCCESS ? "info" : "warn", o[d](be.A_GET_CONVERSATION_R, JSON.stringify({code: _}), a), _ !== i.SUCCESS ? [2, {
                                    code: _,
                                    msg: ut[_]
                                }] : [2, {code: _, data: u ? Be(u) : null}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function ft(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_REMOVE_CONVERSATION_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.removeConversation(t, r, s)];
                            case 1:
                                return c = u.sent(), _ = c === i.SUCCESS ? "info" : "warn", o[_](be.A_REMOVE_CONVERSATION_R, JSON.stringify({code: c}), a), c !== i.SUCCESS ? [2, {
                                    code: c,
                                    msg: ut[c]
                                }] : [2, {code: c}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function lt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                if (!l("conversations", e, E.ARRAY, !0) || !l("conversations", e, (function (t) {
                                    return !(e.length > 20 || 0 === e.length) || (o.error(be.A_BATCH_REMOVE_CONVERSATION_R, "conversations length should not be greater than 20 and not be equal to 0"), !1)
                                }), !0)) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                for (t = 0, r = e; t < r.length; t++) if (s = r[t], !(l("conversations", s, E.OBJECT, !0) && l("conversations.targetId", s.targetId, E.STRING, !0) && l("conversations.conversationType", s.conversationType, (function (e) {
                                    var t = [a.PRIVATE, a.GROUP, a.SYSTEM].includes(e);
                                    return t || o.error(be.A_BATCH_REMOVE_CONVERSATION_R, "conversations.conversationType is invalid, It should be one of the following values:\n              ConversationType.PRIVATE,\n              ConversationType.GROUP,\n              ConversationType.SYSTEM,\n            "), t
                                }), !0) && l("conversations.channelId", s.channelId, E.ONLY_STRING))) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                return c = e.map((function (e) {
                                    return {
                                        conversationType: e.conversationType,
                                        targetId: e.targetId,
                                        channelId: e.channelId || ""
                                    }
                                })), _ = o.createTraceId(), o.info(be.A_BATCH_REMOVE_CONVERSATION_T, "conversations: ".concat(JSON.stringify(c)), _), [4, n.batchRemoveConversation(c)];
                            case 1:
                                return u = d.sent(), o[i.SUCCESS === u ? "info" : "warn"](be.A_BATCH_REMOVE_CONVERSATION_R, "code: ".concat(u), _), [2, {code: u}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function It(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u, d;
                    return Y(this, (function (E) {
                        switch (E.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_GET_CONVERSATION_MESSAGE_DRAFT_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.getConversationMessageDraft(t, r, s)];
                            case 1:
                                return c = E.sent(), _ = c.code, u = c.data, d = _ === i.SUCCESS ? "info" : "warn", o[d](be.A_GET_CONVERSATION_MESSAGE_DRAFT_R, JSON.stringify({
                                    code: _,
                                    data: u
                                }), a), _ === i.SUCCESS ? [2, {code: _, data: u || ""}] : [2, {code: _, msg: ut[_]}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function gt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("options", e, E.CONVERSATION, !0) && l("draft", t, E.STRING, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_SAVE_CONVERSATION_MESSAGE_DRAFT_T, JSON.stringify({
                                    conversationType: e.conversationType,
                                    targetId: e.targetId,
                                    channelId: e.channelId,
                                    draft: t
                                }), n), [4, o.saveConversationMessageDraft(e.conversationType, e.targetId, t, e.channelId)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_SAVE_CONVERSATION_MESSAGE_DRAFT_R, JSON.stringify({code: s}), n), s === i.SUCCESS ? [2, {code: s}] : [2, {
                                    code: s,
                                    msg: ut[s]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Ot(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_CLEAR_CONVERSATION_MESSAGE_DRAFT_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.clearConversationMessageDraft(t, r, s)];
                            case 1:
                                return c = u.sent(), _ = c === i.SUCCESS ? "info" : "warn", o[_](be.A_CLEAR_CONVERSATION_MESSAGE_DRAFT_R, JSON.stringify({code: c}), a), c === i.SUCCESS ? [2, {code: c}] : [2, {
                                    code: c,
                                    msg: ut[c]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Nt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("includeMuted", e, E.BOOLEAN, !1) && l("conversationTypes", t, E.ARRAY, !1) && !(null == t ? void 0 : t.some((function (e) {
                return !l("conversationType", e, I)
            }))) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_TOTAL_UNREAD_COUNT_T, JSON.stringify({
                                    conversationTypes: t,
                                    includeMuted: e
                                }), n), [4, o.getTotalUnreadCount("", t, e)];
                            case 1:
                                return s = _.sent(), a = s.code, c = s.data, a === i.SUCCESS ? (r.info(be.A_GET_TOTAL_UNREAD_COUNT_R, JSON.stringify({
                                    code: a,
                                    data: c
                                }), n), [2, {
                                    code: a,
                                    data: c
                                }]) : (r.warn(be.A_GET_TOTAL_UNREAD_COUNT_R, JSON.stringify({code: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function vt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return !l("conversationTypes", e, E.ARRAY, !0) || !l("levels", t, E.ARRAY, !0) || e.some((function (e) {
                return !l("conversationType", e, I)
            })) || t.some((function (e) {
                return !l("level", e, g)
            })) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_T, JSON.stringify({
                                    conversationTypes: e,
                                    levels: t,
                                    isMentioned: !1
                                }), n), [4, o.getTotalUnreadCountByLevels(e, t)];
                            case 1:
                                return s = _.sent(), a = s.code, c = s.data, a === i.SUCCESS ? (r.info(be.A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_R, JSON.stringify({
                                    code: a,
                                    data: c
                                }), n), [2, {
                                    code: a,
                                    data: c
                                }]) : (r.warn(be.A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_R, JSON.stringify({code: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function ht(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return !l("conversationTypes", e, E.ARRAY, !0) || !l("levels", t, E.ARRAY, !0) || e.some((function (e) {
                return !l("conversationType", e, I)
            })) || t.some((function (e) {
                return !l("level", e, g)
            })) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_T, JSON.stringify({
                                    conversationTypes: e,
                                    levels: t,
                                    isMentioned: !0
                                }), n), [4, o.getTotalUnreadCountByLevels(e, t, !0)];
                            case 1:
                                return s = _.sent(), a = s.code, c = s.data, a === i.SUCCESS ? (r.info(be.A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_R, JSON.stringify({
                                    code: a,
                                    data: c
                                }), n), [2, {
                                    code: a,
                                    data: c
                                }]) : (r.warn(be.A_GET_TOTAL_UNREAD_COUNT_BY_LEVELS_R, JSON.stringify({code: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function mt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_GET_UNREAD_COUNT_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.getUnreadCount(t, r, s)];
                            case 1:
                                return c = d.sent(), _ = c.code, u = c.data, _ === i.SUCCESS ? (o.info(be.A_GET_UNREAD_COUNT_R, JSON.stringify({
                                    code: _,
                                    data: u
                                })), [2, {
                                    code: _,
                                    data: u
                                }]) : (o.warn(be.A_GET_UNREAD_COUNT_R, JSON.stringify({code: _})), [2, {
                                    code: _,
                                    msg: ut[_]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Ct(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_CLEAR_UNREAD_COUNT_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.clearUnreadCount(t, r, s)];
                            case 1:
                                return c = u.sent(), _ = c === i.SUCCESS ? "info" : "warn", o[_](be.A_CLEAR_UNREAD_COUNT_R, JSON.stringify({code: c}), a), c !== i.SUCCESS ? [2, {
                                    code: c,
                                    msg: ut[c]
                                }] : [2, {code: c}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function pt() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e;
                    return Y(this, (function (o) {
                        switch (o.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_CLEAR_ALL_UNREAD_COUNT_O, "", e), [4, t.clearAllUnreadCount()];
                            case 1:
                                return [2, {code: o.sent()}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

_t.ROAMING_SERVICE_UNAVAILABLE.code;
var Ut = function (e, t, n, o) {
    return void 0 === o && (o = ""), x(void 0, void 0, void 0, (function () {
        var r, s;
        return Y(this, (function (a) {
            switch (a.label) {
                case 0:
                    return r = function (e, t, n) {
                        void 0 === n && (n = "");
                        var o = "conversationType:".concat(t.conversationType, ",targetId:").concat(t.targetId);
                        return e.debug(A.O, "".concat(n, " -> ").concat(o)), o
                    }(e, t, o), [4, n()];
                case 1:
                    return (s = a.sent()) !== i.SUCCESS ? (e.warn(A.O, "".concat(o, " fail -> ").concat(s, " : ").concat(ut[s], " , ").concat(r)), [2, {
                        code: s,
                        msg: ut[s]
                    }]) : [2, {code: s}]
            }
        }))
    }))
};

function Mt(e, t) {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (n) {
            return l("notificationLevel", t, (function (e) {
                return void 0 !== O[e]
            }), !0) && l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return Ut(o, e, (function () {
                    return n.setConversationNotificationLevel(e.conversationType, e.targetId, t, e.channelId)
                }), "setConversationNotificationLevel")
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function yt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, c, _, u, d;
                    return Y(this, (function (T) {
                        switch (T.label) {
                            case 0:
                                if (!l("conversations", e, E.ARRAY, !0) || !l("conversations", e, (function (t) {
                                    return !(e.length > 20 || 0 === e.length) || (r.error(be.A_BATCH_SET_CON_NOTIFI_LEVEL_R, "conversations length should not be greater than 20 and not be equal to 0"), !1)
                                }), !0) || !l("notificationLevel", t, (function (e) {
                                    return [-1, 0, 1, 2, 3, 4, 5].includes(e)
                                }), !0)) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                for (n = 0, s = e; n < s.length; n++) if (c = s[n], !(l("conversations", c, E.OBJECT, !0) && l("conversations.targetId", c.targetId, E.STRING, !0) && l("conversations.conversationType", c.conversationType, (function (e) {
                                    var t = [a.PRIVATE, a.GROUP, a.SYSTEM].includes(e);
                                    return t || r.error(be.A_BATCH_SET_CON_NOTIFI_LEVEL_R, "conversations.conversationType is invalid, It should be one of the following values:\n              ConversationType.PRIVATE,\n              ConversationType.GROUP,\n              ConversationType.SYSTEM,\n            "), t
                                }), !0) && l("conversations.channelId", c.channelId, E.ONLY_STRING))) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                return _ = e.map((function (e) {
                                    return {
                                        conversationType: e.conversationType,
                                        targetId: e.targetId,
                                        channelId: e.channelId || ""
                                    }
                                })), u = r.createTraceId(), r.info(be.A_BATCH_SET_CON_NOTIFI_LEVEL_T, "conversations: ".concat(JSON.stringify(_)), u), [4, o.batchSetConversationNotificationLevel(_, t)];
                            case 1:
                                return d = T.sent(), r[i.SUCCESS === d ? "info" : "warn"](be.A_BATCH_SET_CON_NOTIFI_LEVEL_R, "code: ".concat(d), u), [2, {code: d}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Lt(e, t) {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (n) {
            return l("notificationStatus", t, (function (e) {
                return 1 === e || 2 === e
            }), !0) && l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return Ut(o, e, (function () {
                    return n.setConversationStatus(e.conversationType, e.targetId, void 0, t, e.channelId)
                }), "setConversationNotificationStatus")
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Gt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_GET_CONVERSATION_NOTIFICATION_LEVEL_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.getConversationNotificationLevel(t, r, s)];
                            case 1:
                                return c = d.sent(), _ = c.code, u = c.data, _ === i.SUCCESS ? (o.info(be.A_GET_CONVERSATION_NOTIFICATION_LEVEL_R, JSON.stringify({
                                    code: _,
                                    data: u
                                }), a), [2, {
                                    code: _,
                                    data: u
                                }]) : (o.warn(be.A_GET_CONVERSATION_NOTIFICATION_LEVEL_R, JSON.stringify({code: _}), a), [2, {
                                    code: _,
                                    msg: ut[_]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Pt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_GET_CONVERSATION_NOTIFICATION_STATUS_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.getConversationNotificationStatus(t, r, s)];
                            case 1:
                                return c = d.sent(), _ = c.code, u = c.data, _ === i.SUCCESS ? (o.info(be.A_GET_CONVERSATION_NOTIFICATION_STATUS_R, JSON.stringify({
                                    code: _,
                                    data: u
                                }), a), [2, {
                                    code: _,
                                    data: u
                                }]) : (o.warn(be.A_GET_CONVERSATION_NOTIFICATION_STATUS_R, JSON.stringify({code: _}), a), [2, {
                                    code: _,
                                    msg: ut[_]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Dt() {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (e) {
            return [2, qe((function (e) {
                return e.getBlockConversationList()
            }))]
        }))
    }))
}

function Bt(e, t, n) {
    return void 0 === t && (t = !0), void 0 === n && (n = !0), x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return l("options", e, E.CONVERSATION, !0) && l("isTop", t, E.BOOLEAN) ? [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, a, c, _, u, d;
                    return Y(this, (function (E) {
                        switch (E.label) {
                            case 0:
                                return o = e.conversationType, a = e.targetId, c = e.channelId, _ = s.createTraceId(), s.info(be.A_SET_CONVERSATION_STATUS_T, JSON.stringify({
                                    conversationType: o,
                                    targetId: a,
                                    channelId: c,
                                    isTop: t
                                }), _), [4, r.setConversationStatus(e.conversationType, e.targetId, t, void 0, e.channelId, n)];
                            case 1:
                                return u = E.sent(), d = u === i.SUCCESS ? "info" : "warn", s[d](be.A_SET_CONVERSATION_STATUS_R, JSON.stringify({code: u}), _), u !== i.SUCCESS ? [2, {
                                    code: u,
                                    msg: ut[u]
                                }] : [2, {code: u}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function wt(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, c, _, u, d, T;
                    return Y(this, (function (S) {
                        switch (S.label) {
                            case 0:
                                if (!(l("conversations", e, E.ARRAY, !0) && l("conversations", e, (function (t) {
                                    return !(e.length > 20 || 0 === e.length) || (s.error(be.A_BATCH_SET_CON_TO_TOP_R, "conversations length should not be greater than 20 and not be equal to 0"), !1)
                                }), !0) && l("isTop", t, E.BOOLEAN, !0) && l("isCreateConversation", n, E.BOOLEAN))) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                for (o = 0, c = e; o < c.length; o++) if (_ = c[o], !(l("conversations", _, E.OBJECT, !0) && l("conversations.targetId", _.targetId, E.STRING, !0) && l("conversations.conversationType", _.conversationType, (function (e) {
                                    var t = [a.PRIVATE, a.GROUP, a.SYSTEM].includes(e);
                                    return t || s.error(be.A_BATCH_SET_CON_TO_TOP_R, "conversations.conversationType is invalid, It should be one of the following values:\n            ConversationType.PRIVATE,\n            ConversationType.GROUP,\n            ConversationType.SYSTEM,\n          "), t
                                }), !0) && l("conversations.channelId", _.channelId, E.ONLY_STRING))) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                return u = e.map((function (e) {
                                    return {
                                        conversationType: e.conversationType,
                                        targetId: e.targetId,
                                        channelId: e.channelId || ""
                                    }
                                })), d = s.createTraceId(), s.info(be.A_BATCH_SET_CON_TO_TOP_T, "conversations: ".concat(JSON.stringify(u)), d), [4, r.batchSetConversationToTop(u, t, n)];
                            case 1:
                                return T = S.sent(), s[i.SUCCESS === T ? "info" : "warn"](be.A_BATCH_SET_CON_TO_TOP_R, "code: ".concat(T), d), [2, {code: T}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Vt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("conversationTypes", e, E.ARRAY) && !(null == e ? void 0 : e.some((function (e) {
                return !l("conversationType", e, I)
            }))) && l("channelId", t, E.CHANNEL_ID) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_TOP_CONVERSATION_LIST_T, JSON.stringify({
                                    conversationTypes: e,
                                    channelId: t
                                }), n), [4, o.getTopConversationList(e, t)];
                            case 1:
                                return s = d.sent(), a = s.code, c = s.data, a === i.SUCCESS && c ? (_ = [], u = c.map((function (e) {
                                    return _.push({
                                        targetId: e.targetId,
                                        conversationType: e.conversationType,
                                        channelId: e.channelId
                                    }), Be(e)
                                })), r.info(be.A_GET_TOP_CONVERSATION_LIST_R, JSON.stringify({
                                    code: a,
                                    list: _
                                }), n), [2, {
                                    code: 0,
                                    data: u
                                }]) : (r.warn(A.A_GET_TOP_CONVERSATION_LIST_E, JSON.stringify({code: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function bt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return !l("conversationTypes", e, E.ARRAY) || (null == e ? void 0 : e.some((function (e) {
                return !l("conversationType", e, N)
            }))) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_UNREAD_CONVERSATION_LIST_T, JSON.stringify({conversationTypes: e}), t), [4, n.getUnreadConversationList(e)];
                            case 1:
                                return r = u.sent(), s = r.code, a = r.data, s === i.SUCCESS && a ? (c = [], _ = a.map((function (e) {
                                    return c.push({
                                        targetId: e.targetId,
                                        conversationType: e.conversationType,
                                        channelId: e.channelId,
                                        unreadMessageCount: e.unreadMessageCount
                                    }), Be(e)
                                })), o.info(be.A_GET_UNREAD_CONVERSATION_LIST_R, JSON.stringify({
                                    code: s,
                                    list: c
                                }), t), [2, {
                                    code: 0,
                                    data: _
                                }]) : (o.warn(be.A_GET_UNREAD_CONVERSATION_LIST_R, JSON.stringify({code: s}), t), [2, {
                                    code: s,
                                    msg: ut[s]
                                }])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Jt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_UNREAD_MENTIONED_COUNT_T, JSON.stringify({
                                    conversationType: e.conversationType,
                                    targetId: e.targetId,
                                    channelId: e.channelId
                                }), t), [4, n.getUnreadMentionedCount(e)];
                            case 1:
                                return r = c.sent(), s = r.code, a = r.data, s === i.SUCCESS ? (o.info(be.A_GET_UNREAD_MENTIONED_COUNT_R, JSON.stringify({
                                    code: s,
                                    data: a
                                }), t), [2, {
                                    code: s,
                                    data: a
                                }]) : (o.warn(be.A_GET_UNREAD_MENTIONED_COUNT_R, JSON.stringify({code: s}), t), [2, {code: s}])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Ft() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_ALL_UNREAD_MENTIONED_COUNT_T, "", e), [4, t.getAllUnreadMentionedCount()];
                            case 1:
                                return o = a.sent(), r = o.code, s = o.data, r === i.SUCCESS ? (n.warn(be.A_GET_ALL_UNREAD_MENTIONED_COUNT_R, JSON.stringify({
                                    code: r,
                                    data: s
                                }), e), [2, {code: r, data: s}]) : [2, {code: r}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Ht() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_ALL_CONVERSATION_STATE_T, "", e), [4, t.getAllConversationState()];
                            case 1:
                                return o = c.sent(), r = o.code, s = o.data, a = r === i.SUCCESS ? "info" : "warn", n[a](be.A_SET_CONVERSATION_STATUS_R, JSON.stringify({code: r}), e), r === i.SUCCESS ? [2, {
                                    code: r,
                                    data: s
                                }] : [2, {code: r}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function kt(e) {
    return void 0 === e && (e = {}), x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options.targetId", e.targetId, E.STRING, !1) && l("options.channelType", e.channelType, (function (e) {
                return void 0 !== v[e]
            }), !1) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_ULTRA_GROUP_LIST_T, JSON.stringify({
                                    targetId: e.targetId,
                                    channelType: e.channelType
                                }), t), [4, n.getUltraGroupList(e)];
                            case 1:
                                return r = c.sent(), s = r.code, a = r.data, s === i.SUCCESS ? (o.info(be.A_GET_ULTRA_GROUP_LIST_R, JSON.stringify({
                                    code: s,
                                    length: null == a ? void 0 : a.length
                                }), t), [2, {
                                    code: i.SUCCESS,
                                    data: a
                                }]) : (o.warn(be.A_GET_ULTRA_GROUP_LIST_R, JSON.stringify({code: s}), t), [2, {
                                    code: s,
                                    msg: ut[s]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function xt() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_BLOCK_ULTRA_GROUP_LIST_T, "", e), [4, t.getBlockUltraGroupList()];
                            case 1:
                                return o = a.sent(), r = o.code, s = o.data, r === i.SUCCESS ? (n.info(be.A_GET_BLOCK_ULTRA_GROUP_LIST_R, JSON.stringify({
                                    code: r,
                                    length: null == s ? void 0 : s.length
                                }), e), [2, {
                                    code: i.SUCCESS,
                                    data: s
                                }]) : (n.warn(be.A_GET_BLOCK_ULTRA_GROUP_LIST_R, JSON.stringify({code: r}), e), [2, {
                                    code: r,
                                    msg: ut[r]
                                }])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Yt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_SEND_ULTRA_GROUP_TYPING_STATUS_T, JSON.stringify({
                                    targetId: e.targetId,
                                    channelId: e.channelId
                                }), t), [4, n.sendUltraGroupTypingStatus(e)];
                            case 1:
                                return r = a.sent().code, s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_SEND_ULTRA_GROUP_TYPING_STATUS_R, JSON.stringify({code: r}), t), r === i.SUCCESS ? [2, {code: i.SUCCESS}] : [2, {
                                    code: r,
                                    msg: ut[r]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Zt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("options", e, E.CONVERSATION, !0) && l("msgs", t, E.ARRAY, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u, d, E, T, S, R, A;
                    return Y(this, (function (f) {
                        switch (f.label) {
                            case 0:
                                return n = e.targetId, s = e.conversationType, a = e.channelId, c = [], t.forEach((function (e) {
                                    var t = e.sendTime, n = e.messageUId;
                                    c.push({sendTime: t, messageUId: n, channelId: a})
                                })), _ = {
                                    targetId: n,
                                    conversationType: s,
                                    messages: c
                                }, u = r.createTraceId(), r.info(be.A_GET_ULTRA_GROUP_MESSAGE_LIST_BY_MESSAGE_UID_T, JSON.stringify(_), u), [4, o.getUltraGroupMessageListByMessageUId(_)];
                            case 1:
                                if (d = f.sent(), E = d.code, T = d.data, E === i.SUCCESS) {
                                    for (A in S = {}, R = [], T) R.push(A), S[A] = T[A] ? De(T[A]) : void 0;
                                    return r.info(be.A_GET_ULTRA_GROUP_MESSAGE_LIST_BY_MESSAGE_UID_R, JSON.stringify({
                                        code: E,
                                        messageUIds: R
                                    }), u), [2, {code: i.SUCCESS, data: S}]
                                }
                                return r.warn(be.A_GET_ULTRA_GROUP_MESSAGE_LIST_BY_MESSAGE_UID_R, JSON.stringify({code: E}), u), [2, {
                                    code: E,
                                    msg: ut[E]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Kt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("expansion", e, E.OBJECT, !0) && l("message", t, E.OBJECT, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u, d, E, T, S;
                    return Y(this, (function (R) {
                        switch (R.label) {
                            case 0:
                                return n = t.conversationType, s = t.targetId, a = t.messageUId, c = t.sentTime, _ = t.canIncludeExpansion, u = t.channelId, d = r.createTraceId(), r.info(be.A_UPDATE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_T, JSON.stringify({
                                    conversationType: n,
                                    targetId: s,
                                    messageUId: a,
                                    channelId: u
                                }), d), E = {
                                    targetId: s,
                                    channelId: u,
                                    conversationType: n,
                                    sendTime: c,
                                    canIncludeExpansion: _,
                                    messageUId: a,
                                    expansion: e
                                }, [4, o.expandUltraMessage(E)];
                            case 1:
                                return T = R.sent().code, S = T === i.SUCCESS ? "info" : "warn", r[S](be.A_UPDATE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_R, JSON.stringify({code: T}), d), T === i.SUCCESS ? [2, {code: i.SUCCESS}] : [2, {
                                    code: T,
                                    msg: ut[T]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function qt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("expansion", e, E.ARRAY, !0) && l("message", t, E.OBJECT, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u, d, E, T, S;
                    return Y(this, (function (R) {
                        switch (R.label) {
                            case 0:
                                return n = t.conversationType, s = t.targetId, a = t.messageUId, c = t.sentTime, _ = t.canIncludeExpansion, u = t.channelId, d = r.createTraceId(), r.info(be.A_REMOVE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_T, JSON.stringify({
                                    conversationType: n,
                                    targetId: s,
                                    messageUId: a,
                                    channelId: u
                                }), d), E = {
                                    targetId: s,
                                    channelId: u,
                                    conversationType: n,
                                    sendTime: c,
                                    canIncludeExpansion: _,
                                    messageUId: a,
                                    keys: e
                                }, [4, o.expandUltraMessage(E)];
                            case 1:
                                return T = R.sent().code, S = T === i.SUCCESS ? "info" : "warn", r[S](be.A_REMOVE_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_R, JSON.stringify({code: T}), d), T === i.SUCCESS ? [2, {code: i.SUCCESS}] : [2, {
                                    code: T,
                                    msg: ut[T]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Xt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("message", e, E.OBJECT, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u, d, E, T;
                    return Y(this, (function (S) {
                        switch (S.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.messageUId, a = e.sentTime, c = e.canIncludeExpansion, _ = e.channelId, u = o.createTraceId(), o.info(be.A_REMOVE_ALL_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    messageUId: s,
                                    channelId: _
                                }), u), d = {
                                    targetId: r,
                                    channelId: _,
                                    conversationType: t,
                                    sendTime: a,
                                    canIncludeExpansion: c,
                                    messageUId: s,
                                    removeAll: !0
                                }, [4, n.expandUltraMessage(d)];
                            case 1:
                                return E = S.sent().code, T = E === i.SUCCESS ? "info" : "warn", o[T](be.A_REMOVE_ALL_EXPANSION_FOR_ULTRA_GROUP_MESSAGE_R, JSON.stringify({code: E}), u), E === i.SUCCESS ? [2, {code: i.SUCCESS}] : [2, {
                                    code: E,
                                    msg: ut[E]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function zt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("content", e, E.OBJECT, !0) && l("message", t, E.OBJECT, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u, d, E, T, S, R;
                    return Y(this, (function (A) {
                        switch (A.label) {
                            case 0:
                                return n = t.conversationType, s = t.targetId, a = t.messageUId, c = t.senderUserId, _ = t.sentTime, u = t.canIncludeExpansion, d = t.channelId, E = r.createTraceId(), r.info(be.A_MODIFY_MESSAGE_T, JSON.stringify({
                                    conversationType: n,
                                    targetId: s,
                                    messageUId: a,
                                    channelId: d
                                }), E), T = {
                                    targetId: s,
                                    channelId: d,
                                    conversationType: n,
                                    fromUserId: c,
                                    sendTime: _,
                                    canIncludeExpansion: u,
                                    messageUId: a,
                                    content: e
                                }, [4, o.modifyMessage(T)];
                            case 1:
                                return S = A.sent().code, R = S === i.SUCCESS ? "info" : "warn", r[R](be.A_MODIFY_MESSAGE_R, JSON.stringify({code: S}), E), S === i.SUCCESS ? [2, {code: i.SUCCESS}] : [2, {
                                    code: S,
                                    msg: ut[S]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function jt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && l("notificationLevels", t, E.ARRAY) && !(null == t ? void 0 : t.some((function (e) {
                return !l("notificationLevel", e, g)
            }))) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_BY_TARGET_ID_T, JSON.stringify({
                                    targetId: e,
                                    notificationLevels: t
                                }), n), [4, o.getUltraGroupUnreadMentionedCountByTargetId(e, t)];
                            case 1:
                                return s = _.sent(), a = s.code, c = s.data, a === i.SUCCESS ? (r.info(be.A_GET_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_BY_TARGET_ID_R, JSON.stringify({
                                    code: a,
                                    data: c
                                }), e), [2, {
                                    code: i.SUCCESS,
                                    data: c
                                }]) : (r.warn(be.A_GET_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_BY_TARGET_ID_R, JSON.stringify({code: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Wt(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("options.targetId", e.targetId, E.STRING, !0) && l("options.channelId", e.channelId, E.CHANNEL_ID) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_T, JSON.stringify({
                                    targetId: e.targetId,
                                    channelId: e.channelId
                                }), t), [4, n.getUltraGroupDefaultNotificationLevel(e.targetId, e.channelId)];
                            case 1:
                                return r = c.sent(), s = r.code, a = r.data, s === i.SUCCESS ? (o.info(be.A_GET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_R, JSON.stringify({
                                    code: s,
                                    data: a
                                }), t), [2, {
                                    code: s,
                                    data: a
                                }]) : (o.warn(be.A_GET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_R, JSON.stringify({code: s}), t), [2, {
                                    code: s,
                                    msg: ut[s]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Qt(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return e.channelId = e.channelId || "", l("options.targetId", e.targetId, E.STRING, !0) && l("options.channelId", e.channelId, E.CHANNEL_ID, !0) && l("notificationLevel", t, (function (e) {
                return void 0 !== O[e]
            }), !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_SET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_T, JSON.stringify({
                                    targetId: e.targetId,
                                    channelId: e.channelId,
                                    notificationLevel: t
                                }), n), [4, o.setUltraGroupDefaultNotificationLevel(e.targetId, t, e.channelId)];
                            case 1:
                                return s = c.sent().code, a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_SET_ULTRA_GROUP_DEFAULT_NOTIFICATION_LEVEL_R, JSON.stringify({code: s}), n), s === i.SUCCESS ? [2, {code: s}] : [2, {
                                    code: s,
                                    msg: ut[s]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function $t(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && l("notificationLevels", t, E.ARRAY) && !(null == t ? void 0 : t.some((function (e) {
                return !l("notificationLevel", e, g)
            }))) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_ULTRA_GROUP_UNREAD_COUNT_BY_TARGET_ID_T, JSON.stringify({
                                    targetId: e,
                                    notificationLevels: t
                                }), n), [4, o.getUltraGroupUnreadCountByTargetId(e, t)];
                            case 1:
                                return s = u.sent(), a = s.code, c = s.data, _ = a === i.SUCCESS ? "info" : "warn", r[_](be.A_GET_ULTRA_GROUP_UNREAD_COUNT_BY_TARGET_ID_R, JSON.stringify({
                                    code: a,
                                    data: c
                                }), n), [2, {code: a, data: c}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function en() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_ALL_ULTRA_GROUP_UNREAD_COUNT_T, "getAllUltraGroupUnreadCount", e), [4, t.getAllUltraGroupUnreadCount()];
                            case 1:
                                return o = c.sent(), r = o.code, s = o.data, a = r === i.SUCCESS ? "info" : "warn", n[a](be.A_GET_ALL_ULTRA_GROUP_UNREAD_COUNT_R, JSON.stringify({
                                    code: r,
                                    data: s
                                }), e), r === i.SUCCESS ? [2, {code: r, data: s}] : [2, {code: r, msg: ut[r]}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function tn() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_ALL_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_T, "getAllUltraGroupUnreadCount", e), !0, [4, t.getAllUltraGroupUnreadCount(true)];
                            case 1:
                                return o = c.sent(), r = o.code, s = o.data, a = r === i.SUCCESS ? "info" : "warn", n[a](be.A_GET_ALL_ULTRA_GROUP_UNREAD_MENTIONED_COUNT_R, JSON.stringify({
                                    code: r,
                                    data: s
                                }), e), r === i.SUCCESS ? [2, {code: r, data: s}] : [2, {code: r, msg: ut[r]}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function nn(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return e.channelId = e.channelId || "", l("options.targetId", e.targetId, E.STRING, !0) && l("options.channelId", e.channelId, E.CHANNEL_ID, !0) && l("options.sentTime", e.sentTime, E.NUMBER, !0) && l("options.count", e.count, (function (e) {
                return h(e) && e > 0 && e <= 50
            }), !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u, d, E;
                    return Y(this, (function (T) {
                        switch (T.label) {
                            case 0:
                                return t = e.targetId, r = e.channelId, s = e.sentTime, a = e.count, c = {
                                    targetId: t,
                                    channelId: r,
                                    sentTime: s,
                                    count: a
                                }, _ = o.createTraceId(), o.info(be.A_GET_ULTRA_GROUP_UNREAD_MENTIONED_MESSAGES_T, JSON.stringify(c), _), [4, n.getUltraGroupUnreadMentionedMessages(c)];
                            case 1:
                                return u = T.sent(), d = u.code, E = u.data, d === i.SUCCESS ? (o.info(be.A_GET_ULTRA_GROUP_UNREAD_MENTIONED_MESSAGES_R, JSON.stringify({
                                    code: d,
                                    data: null == E ? void 0 : E.map((function (e) {
                                        return e.messageUId
                                    }))
                                }), _), [2, {
                                    code: d,
                                    data: E
                                }]) : (o.warn(be.A_GET_ULTRA_GROUP_UNREAD_MENTIONED_MESSAGES_R, JSON.stringify({code: d}), _), [2, {
                                    code: d,
                                    msg: ut[d]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function on(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("conversation.targetId", e.targetId, E.STRING, !0) && l("conversation.channelId", e.channelId, E.CHANNEL_ID, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return t = e.targetId, r = e.channelId, s = {
                                    targetId: t,
                                    channelId: r
                                }, a = o.createTraceId(), o.info(be.A_GET_ULTRA_GROUP_FIRST_UNREAD_MESSAGE_TIMESTAMP_T, JSON.stringify(s), a), [4, n.getUltraGroupFirstUnreadMessageTimestamp(s)];
                            case 1:
                                return c = d.sent(), _ = c.code, u = c.data, _ === i.SUCCESS ? (o.info(be.A_GET_ULTRA_GROUP_FIRST_UNREAD_MESSAGE_TIMESTAMP_R, JSON.stringify({
                                    code: _,
                                    sentTime: null == u ? void 0 : u.sentTime
                                }), a), [2, {
                                    code: _,
                                    data: u
                                }]) : (o.warn(be.A_GET_ULTRA_GROUP_FIRST_UNREAD_MESSAGE_TIMESTAMP_R, JSON.stringify({code: _}), a), [2, {
                                    code: _,
                                    msg: ut[_]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function rn(e) {
    return x(this, void 0, void 0, (function () {
        var t, n = this;
        return Y(this, (function (o) {
            return l("targetIds", e, E.ARRAY, !0) && l("targetIds.length", e, (function (e) {
                return e.length > 0 && e.length < 20
            })) && !e.some((function (e) {
                return !l("targetId", e, E.STRING)
            })) ? (t = e.filter((function (t, n) {
                return e.indexOf(t) === n
            })), [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_ULTRA_GROUP_UNREAD_INFO_LIST_T, JSON.stringify({targetIds: e}), n), [4, o.getUltraGroupUnreadInfoList(t)];
                            case 1:
                                return s = u.sent(), a = s.code, c = s.data, _ = a === i.SUCCESS ? "info" : "warn", r[_](be.A_GET_ULTRA_GROUP_UNREAD_INFO_LIST_R, JSON.stringify({code: a}), n), a === i.SUCCESS ? [2, {
                                    code: a,
                                    data: c
                                }] : [2, {code: a, msg: ut[a]}]
                        }
                    }))
                }))
            }))]) : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

var sn = function (e) {
    return !!(l("options.key", e.key, E.STRING, !0) && l("options.value", e.value, E.STRING, !0) && l("options.isAutoDelete", e.isAutoDelete, E.BOOLEAN) && l("options.isSendNotification", e.isSendNotification, E.BOOLEAN) && l("options.notificationExtra", e.notificationExtra, E.STRING))
}, an = function (e) {
    return e.entries.every((function (e) {
        return l("entry.key", e.key, E.STRING, !0) && l("entry.value", e.value, E.STRING, !0)
    })) && l("options.isAutoDelete", e.isAutoDelete, E.BOOLEAN) && l("options.notificationExtra", e.notificationExtra, E.STRING) && l("options.isForce", e.isForce, E.BOOLEAN)
}, cn = function (e) {
    return l("options.key", e.key, E.STRING, !0) && l("options.isSendNotification", e.isSendNotification, E.BOOLEAN) && l("options.notificationExtra", e.notificationExtra, E.STRING)
}, _n = function (e) {
    return e.entries.every((function (e) {
        return l("key", e, E.STRING, !0)
    })) && l("options.notificationExtra", e.notificationExtra, E.STRING)
};

function un(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && l("options", t, E.OBJECT, !0) && l("options.count", t.count, E.NUMBER, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(A.A_JOIN_CHATROOM_T, JSON.stringify({
                                    chatroomId: e,
                                    count: t.count,
                                    joinExist: !1
                                }), n), [4, o.joinChatroom(e, t.count, n)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](A.A_JOIN_CHATROOM_R, JSON.stringify({
                                    code: s,
                                    timestamp: (new Date).getTime()
                                }), n), s !== i.SUCCESS ? [2, {code: s, msg: ut[s]}] : [2, {code: s}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function dn(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && l("options", t, E.OBJECT, !0) && l("options.count", t.count, E.NUMBER, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(A.A_JOIN_CHATROOM_T, JSON.stringify({
                                    chatroomId: e,
                                    count: t.count,
                                    joinExist: !0
                                }), n), [4, o.joinExistChatroom(e, t.count, n)];
                            case 1:
                                return s = u.sent(), a = s.code, c = s.data, _ = a === i.SUCCESS ? "info" : "warn", r[_](A.A_JOIN_CHATROOM_R, JSON.stringify({
                                    code: a,
                                    timestamp: (new Date).getTime()
                                }), n), a !== i.SUCCESS ? [2, {code: a, msg: ut[a]}] : [2, {code: a, data: c}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function En(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("targetId", e, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(A.A_QUIT_CHATROOM_T, JSON.stringify({chatroomId: e}), t), [4, n.quitChatroom(e)];
                            case 1:
                                return r = a.sent(), s = r === i.SUCCESS ? "info" : "warn", o[s](A.A_QUIT_CHATROOM_R, JSON.stringify({code: r}), t), r !== i.SUCCESS ? [2, {
                                    code: r,
                                    msg: ut[r]
                                }] : [2, {code: r}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Tn(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && l("options.count", null == t ? void 0 : t.count, E.NUMBER) && l("options.order", null == t ? void 0 : t.order, (function (e) {
                return [0, 1, 2].includes(e)
            })) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_CHATROOM_INFO_T, JSON.stringify({
                                    chatroomId: e,
                                    count: null == t ? void 0 : t.count,
                                    order: null == t ? void 0 : t.order
                                }), n), [4, o.getChatroomInfo(e, null == t ? void 0 : t.count, null == t ? void 0 : t.order)];
                            case 1:
                                return s = u.sent(), a = s.code, c = s.data, _ = a === i.SUCCESS ? "info" : "warn", r[_](be.A_GET_CHATROOM_INFO_R, JSON.stringify({code: a}), n), a === i.SUCCESS && c ? [2, {
                                    code: a,
                                    data: c
                                }] : [2, {code: a, msg: ut[a]}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Sn(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && sn(t) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_SET_CHATROOM_ENTRY_T, JSON.stringify({
                                    chatroomId: e,
                                    key: t.key,
                                    value: t.value,
                                    isSendNotification: t.isSendNotification,
                                    isAutoDelete: t.isAutoDelete,
                                    notificationExtra: t.notificationExtra
                                }), n), [4, o.setChatroomEntry(e, t)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_SET_CHATROOM_ENTRY_R, JSON.stringify({code: s}), n), s !== i.SUCCESS ? [2, {
                                    code: s,
                                    msg: ut[s]
                                }] : [2, {code: s}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Rn(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && an(t) ? t.entries.length > 10 ? [2, _t.CHATROOM_KV_STORE_OUT_LIMIT] : [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_SET_CHATROOM_ENTRIES_T, JSON.stringify({
                                    chatroomId: e,
                                    entries: t.entries.map((function (e) {
                                        return {key: e.key, value: e.value}
                                    })),
                                    isAutoDelete: t.isAutoDelete,
                                    notificationExtra: t.notificationExtra,
                                    isForce: t.isForce
                                }), n), [4, o.setChatroomEntries(e, t)];
                            case 1:
                                return s = u.sent(), a = s.code, c = s.data, _ = a === i.SUCCESS ? "info" : "warn", r[_](be.A_SET_CHATROOM_ENTRIES_R, JSON.stringify({code: a}), n), a !== i.SUCCESS ? [2, {
                                    code: a,
                                    msg: ut[a],
                                    data: c
                                }] : [2, {code: a}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function An(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && sn(t) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_FORCE_SET_CHATROOM_ENTRY_T, JSON.stringify({
                                    chatroomId: e,
                                    key: t.key,
                                    value: t.value,
                                    isSendNotification: t.isSendNotification,
                                    isAutoDelete: t.isAutoDelete,
                                    notificationExtra: t.notificationExtra
                                }), n), [4, o.forceSetChatroomEntry(e, t)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_FORCE_SET_CHATROOM_ENTRY_R, JSON.stringify({code: s}), n), s !== i.SUCCESS ? [2, {
                                    code: s,
                                    msg: ut[s]
                                }] : [2, {code: s}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function fn(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && cn(t) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_REMOVE_CHATROOM_ENTRY_T, JSON.stringify({
                                    chatroomId: e,
                                    key: t.key,
                                    isSendNotification: t.isSendNotification,
                                    notificationExtra: t.notificationExtra
                                }), n), [4, o.removeChatroomEntry(e, t)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_REMOVE_CHATROOM_ENTRY_R, JSON.stringify({code: s}), n), s !== i.SUCCESS ? [2, {
                                    code: s,
                                    msg: ut[s]
                                }] : [2, {code: s}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function ln(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && _n(t) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return n = t.entries.map((function (e) {
                                    return {key: e}
                                })), s = r.createTraceId(), r.info(be.A_REMOVE_CHATROOM_ENTRIES_T, JSON.stringify({
                                    chatroomId: e,
                                    notificationExtra: t.notificationExtra,
                                    entries: n
                                }), s), [4, o.removeChatroomEntries(e, {
                                    entries: n,
                                    notificationExtra: t.notificationExtra
                                })];
                            case 1:
                                return a = d.sent(), c = a.code, _ = a.data, u = c === i.SUCCESS ? "info" : "warn", r[u](be.A_REMOVE_CHATROOM_ENTRIES_R, JSON.stringify({code: c}), s), c !== i.SUCCESS ? [2, {
                                    code: c,
                                    msg: ut[c],
                                    data: _
                                }] : [2, {code: c}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function In(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && cn(t) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_FORCE_REMOVE_CHATROOM_ENTRY_T, JSON.stringify({
                                    chatroomId: e,
                                    key: t.key,
                                    isSendNotification: t.isSendNotification,
                                    notificationExtra: t.notificationExtra
                                }), n), [4, o.forceRemoveChatroomEntry(e, t)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_FORCE_REMOVE_CHATROOM_ENTRY_R, JSON.stringify({code: s}), n), s !== i.SUCCESS ? [2, {
                                    code: s,
                                    msg: ut[s]
                                }] : [2, {code: s}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function gn(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && l("key", t, (function (e) {
                return m(e) && /[\w+=-]+/.test(e) && e.length <= 128
            }), !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_CHATROOM_ENTRY_T, JSON.stringify({
                                    chatroomId: e,
                                    key: t
                                }), n), [4, o.getChatroomEntry(e, t)];
                            case 1:
                                return s = _.sent(), a = s.code, c = s.data, a === i.SUCCESS && c ? (r.info(be.A_GET_CHATROOM_ENTRY_R, JSON.stringify({
                                    code: a,
                                    data: c
                                }), n), [2, {
                                    code: a,
                                    data: c
                                }]) : (r.warn(be.A_GET_CHATROOM_ENTRY_R, JSON.stringify({code: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function On(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("targetId", e, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_ALL_CHATROOM_ENTRIES_T, JSON.stringify({chatroomId: e}), t), [4, n.getAllChatroomEntries(e)];
                            case 1:
                                return r = c.sent(), s = r.code, a = r.data, s === i.SUCCESS && a ? (o.info(be.A_GET_ALL_CHATROOM_ENTRIES_R, JSON.stringify({
                                    code: s,
                                    data: a
                                }), t), [2, {
                                    code: s,
                                    data: a
                                }]) : (o.warn(be.A_GET_ALL_CHATROOM_ENTRIES_R, JSON.stringify({code: s}), t), [2, {
                                    code: s,
                                    msg: ut[s]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Nn(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("targetId", e, E.STRING, !0) && l("options.timestamp", t.timestamp, E.NUMBER) && l("options.count", t.count, E.NUMBER) && l("options.count", t.count, (function (e) {
                var t = e > 0 && e <= 100;
                return t || null === console || void 0 === console || console.error('"options.count" is invalid, It should be greater than 0 and less than 100'), t
            })) && l("options.order", t.order, (function (e) {
                return 0 === e || 1 === e
            })) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_CHATROOM_HISTORY_MESSAGES_T, JSON.stringify({
                                    chatroomId: e,
                                    timestamp: t.timestamp,
                                    count: t.count,
                                    order: t.order
                                }), n), [4, o.getChatRoomHistoryMessages(e, t.count, t.order, t.timestamp)];
                            case 1:
                                return s = d.sent(), a = s.code, c = s.data, a === i.SUCCESS && c ? (_ = [], u = c.list.map((function (e) {
                                    return _.push(e.messageUId), De(e)
                                })), r.info(be.A_GET_CHATROOM_HISTORY_MESSAGES_R, JSON.stringify({
                                    code: a,
                                    data: _
                                }), n), [2, {
                                    code: a,
                                    data: {list: u, hasMore: !!c.hasMore}
                                }]) : (r.warn(be.A_GET_CHATROOM_HISTORY_MESSAGES_R, JSON.stringify({code: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function vn(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("option", e, E.OBJECT, !0) && l("option.chatRoomId", e.chatRoomId, E.STRING, !0) && l("option.rtcRoomId", e.rtcRoomId, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_BIND_RTC_ROOM_FOR_CHATROOM_T, JSON.stringify({
                                    chatRoomId: e.chatRoomId,
                                    rtcRoomId: e.rtcRoomId
                                }), t), [4, n.bindRTCRoomForChatroom(e)];
                            case 1:
                                return r = a.sent(), s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_BIND_RTC_ROOM_FOR_CHATROOM_R, JSON.stringify({code: r}), t), [2, {
                                    code: r,
                                    msg: ut[r]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function hn(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("userId", e, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_ADD_TO_BLACKLIST_T, JSON.stringify({userId: e}), t), [4, n.addToBlacklist(e)];
                            case 1:
                                return r = a.sent(), s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_ADD_TO_BLACKLIST_R, JSON.stringify({code: r}), t), [2, {code: r}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function mn(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("userId", e, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_REMOVE_FROM_BLACKLIST_T, JSON.stringify({userId: e}), t), [4, n.removeFromBlacklist(e)];
                            case 1:
                                return r = a.sent(), s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_REMOVE_FROM_BLACKLIST_R, JSON.stringify({code: r}), t), [2, {code: r}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Cn() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_BLACKLIST_T, "getBlacklist -> ", e), [4, t.getBlacklist()];
                            case 1:
                                return o = a.sent(), r = o.code, s = o.data, r === i.SUCCESS && s ? (n.info(be.A_GET_BLACKLIST_R, JSON.stringify({
                                    code: r,
                                    data: s
                                }), e), [2, {
                                    code: r,
                                    data: s
                                }]) : (n.warn(be.A_GET_BLACKLIST_R, JSON.stringify({code: r}), e), [2, {code: r}])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function pn(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("userId", e, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_BLACKLIST_STATUS_T, JSON.stringify({userId: e}), t), [4, n.getBlacklistStatus(e)];
                            case 1:
                                return r = c.sent(), s = r.code, a = r.data, s === i.SUCCESS ? (o.info(be.A_GET_BLACKLIST_STATUS_R, JSON.stringify({
                                    code: s,
                                    data: 0 === a
                                }), t), [2, {
                                    code: s,
                                    data: 0 === a
                                }]) : (o.warn(be.A_GET_BLACKLIST_STATUS_R, JSON.stringify({code: s}), t), [2, {code: s}])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

var Un = function (e, t, n, o) {
    void 0 === n && (n = !0), void 0 === o && (o = !0), this.messageType = e, this.content = t, this.isPersited = n, this.isCounted = o
};

function Mn(e, t, n) {
    void 0 === t && (t = !0), void 0 === n && (n = !0);
    return function (o) {
        return new Un(e, o, t, n)
    }
}

var yn, Ln = Mn("RC:ImgMsg"), Gn = Mn("RC:HQVCMsg"), Pn = Mn("RC:SightMsg"), Dn = Mn("RC:TxtMsg"),
    Bn = Mn("RC:CombineMsg"), wn = Mn(C.COMBINE_V2), Vn = Mn("RC:FileMsg"), bn = Mn("RC:GIFMsg"), Jn = Mn("RC:VcMsg"),
    Fn = Mn("RC:LBSMsg"), Hn = Mn("RC:ReferenceMsg"), kn = Mn("RC:ImgTextMsg"), xn = Mn("RC:CmdMsg"),
    Yn = Mn("RC:InfoNtf"), Zn = Mn("RC:GrpNtf");
!function (e) {
    e.ALIYUN = "aliyun", e.S3 = "s3", e.STC = "stc", e.MINIO = "minio", e.QINIU = "qiniu", e.BAIDU = "baidu", e.RCX = "rcx"
}(yn || (yn = {}));
var Kn, qn = function () {
    function e(e, t, n) {
        this.isSupportMultipart = !1, this._serverType = 0, this._isAbort = !1, this._url = e, this._getFileToken = t, this._serverType = n
    }

    return e.prototype.isAbort = function () {
        return this._isAbort
    }, e.prototype.abort = function () {
        this._isAbort = !0, this._abortHandler()
    }, e.prototype.upload = function (e) {
        return e.file.size > p ? Promise.resolve({
            code: i.UPLOAD_FAIL,
            msg: "the file size is over 5GB!"
        }) : e.file.size > U && this.isSupportMultipart ? this.multipartUpload(e) : this.commonUpload(e)
    }, e
}(), Xn = function (t) {
    function n() {
        var e = null !== t && t.apply(this, arguments) || this;
        return e._promise = null, e
    }

    return H(n, t), n.prototype.commonUpload = function (t) {
        return x(this, void 0, void 0, (function () {
            var n, o, r, s, a, c, _;
            return Y(this, (function (u) {
                switch (u.label) {
                    case 0:
                        n = t.file, o = t.onProgress, r = t.fileType, u.label = 1;
                    case 1:
                        return u.trys.push([1, 3, , 4]), [4, this._getFileToken(r, n.name)];
                    case 2:
                        return s = u.sent(), [3, 4];
                    case 3:
                        return [2, {code: u.sent()}];
                    case 4:
                        return a = {}, (c = new FormData).set("token", s.token), c.set("key", s.fileName), c.set("file", n), this._promise = e({
                            url: y(this._url),
                            headers: a,
                            onProgress: function (e) {
                                return null == o ? void 0 : o(e.loaded, e.total)
                            },
                            method: "POST",
                            body: c,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return _ = u.sent().status, this._promise = null, 200 === _ || 204 === _ ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: s.fileName, uploadMethod: M.QINIU}
                        }] : [2, {code: i.UPLOAD_FAIL, msg: _.toString()}]
                }
            }))
        }))
    }, n.prototype.multipartUpload = function (e) {
        return x(this, void 0, void 0, (function () {
            return Y(this, (function (e) {
                throw new Error("Method not implemented.")
            }))
        }))
    }, n.prototype._abortHandler = function () {
        var e;
        null === (e = this._promise) || void 0 === e || e.abort()
    }, n
}(qn), zn = function (t) {
    function n() {
        var e = null !== t && t.apply(this, arguments) || this;
        return e._promise = null, e
    }

    return H(n, t), n.prototype.commonUpload = function (t) {
        return x(this, void 0, void 0, (function () {
            var n, o, r, s, a, c, _;
            return Y(this, (function (u) {
                switch (u.label) {
                    case 0:
                        n = t.file, o = t.onProgress, r = t.fileType, u.label = 1;
                    case 1:
                        return u.trys.push([1, 3, , 4]), [4, this._getFileToken(r)];
                    case 2:
                        return s = u.sent(), [3, 4];
                    case 3:
                        return [2, {code: u.sent()}];
                    case 4:
                        return a = y("".concat(s.ossBucketName, ".").concat(this._url)), (c = new FormData).set("token", s.token), c.set("OSSAccessKeyId", s.osskeyId), c.set("policy", s.ossPolicy), c.set("Signature", s.ossSign), c.set("success_action_status", "200"), c.set("key", s.fileName), c.set("file", n), this._promise = e({
                            url: a,
                            onProgress: function (e) {
                                return null == o ? void 0 : o(e.loaded, e.total)
                            },
                            method: "POST",
                            body: c,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return _ = u.sent().status, this._promise = null, 200 === _ || 204 === _ ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: s.fileName, uploadMethod: M.ALI}
                        }] : [2, {code: i.UPLOAD_FAIL, msg: _.toString()}]
                }
            }))
        }))
    }, n.prototype._abortHandler = function () {
        var e;
        null === (e = this._promise) || void 0 === e || e.abort()
    }, n.prototype.multipartUpload = function (e) {
        throw new Error("Method not implemented.")
    }, n
}(qn), jn = function (t) {
    function n() {
        var e = null !== t && t.apply(this, arguments) || this;
        return e._promise = null, e
    }

    return H(n, t), n.prototype.commonUpload = function (t) {
        return x(this, void 0, void 0, (function () {
            var n, o, r, s, a, c, _, u, d;
            return Y(this, (function (E) {
                switch (E.label) {
                    case 0:
                        n = t.file, o = t.onProgress, r = t.fileType, s = t.contentDisposition, E.label = 1;
                    case 1:
                        return E.trys.push([1, 3, , 4]), [4, this._getFileToken(r <= L.FILE ? r : L.FILE)];
                    case 2:
                        return a = E.sent(), [3, 4];
                    case 3:
                        return [2, {code: E.sent()}];
                    case 4:
                        return c = s || ("text/html" === n.type ? "inline" : "attachment"), _ = {
                            authorization: a.bosToken,
                            "x-bce-date": a.bosDate,
                            "Content-Disposition": "".concat(c, "; filename=").concat(encodeURIComponent(n.name), ";")
                        }, u = y("".concat(this._url).concat(a.path)), this._promise = e({
                            url: u,
                            headers: _,
                            onProgress: function (e) {
                                return null == o ? void 0 : o(e.loaded, e.total)
                            },
                            method: "POST",
                            body: n,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return d = E.sent().status, this._promise = null, 200 === d || 204 === d ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: a.fileName, downloadUrl: u}
                        }] : [2, {code: i.UPLOAD_FAIL, msg: d.toString()}]
                }
            }))
        }))
    }, n.prototype.multipartUpload = function (e) {
        throw new Error("Method not implemented.")
    }, n.prototype._abortHandler = function () {
        var e;
        null === (e = this._promise) || void 0 === e || e.abort()
    }, n
}(qn), Wn = function (t) {
    function n() {
        var e = null !== t && t.apply(this, arguments) || this;
        return e._promise = null, e.isSupportMultipart = !0, e
    }

    return H(n, t), n.prototype.commonUpload = function (t) {
        return x(this, void 0, void 0, (function () {
            var n, o, r, s, a, c, _;
            return Y(this, (function (u) {
                switch (u.label) {
                    case 0:
                        n = t.file, o = t.onProgress, r = t.fileType, u.label = 1;
                    case 1:
                        return u.trys.push([1, 3, , 4]), [4, this._getFileToken(r)];
                    case 2:
                        return s = u.sent(), [3, 4];
                    case 3:
                        return [2, {code: u.sent()}];
                    case 4:
                        return a = y("".concat(this._url, "/").concat(s.minioBucketName, "/").concat(s.fileName)), c = this.getBaseHeaders(n, s, t), this._promise = e({
                            url: a,
                            headers: c,
                            onProgress: function (e) {
                                return null == o ? void 0 : o(e.loaded, e.total)
                            },
                            method: "PUT",
                            body: n,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return _ = u.sent().status, this._promise = null, 200 === _ || 204 === _ ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: s.fileName, uploadMethod: M.MINIO}
                        }] : [2, {code: i.UPLOAD_FAIL, msg: _.toString()}]
                }
            }))
        }))
    }, n.prototype.multipartUpload = function (t) {
        var n;
        return x(this, void 0, void 0, (function () {
            var o, r, s, a, c, _, u, d, E, T, S, R, A, f, l, I;
            return Y(this, (function (g) {
                switch (g.label) {
                    case 0:
                        o = t.file, r = t.fileType, g.label = 1;
                    case 1:
                        return g.trys.push([1, 3, , 4]), [4, this._getFileToken(r, o.name, "POST", "uploads")];
                    case 2:
                        return s = g.sent(), [3, 4];
                    case 3:
                        return [2, {code: g.sent()}];
                    case 4:
                        return a = y("".concat(this._url, "/").concat(s.minioBucketName, "/").concat(s.fileName)), c = this.getBaseHeaders(o, s, t), this._promise = e({
                            url: "".concat(a, "?uploads"),
                            headers: c,
                            method: "POST"
                        }), [4, this._promise.result()];
                    case 5:
                        return _ = g.sent(), u = _.status, d = _.data, this._promise = null, E = null === (n = null == d ? void 0 : d.match(/(?:<UploadId>)(\S*?)(?:<\/UploadId>)/)) || void 0 === n ? void 0 : n[1], 200 !== u && 204 !== u || !E ? [2, {
                            code: i.UPLOAD_FAIL,
                            msg: "start upload fail"
                        }] : (T = [], [4, this.requestUploadPart(a, o, E, s.fileName, t, T)]);
                    case 6:
                        if (S = g.sent(), R = S.code, A = S.msg, R !== i.SUCCESS) return [2, {code: R, msg: A}];
                        g.label = 7;
                    case 7:
                        return g.trys.push([7, 9, , 10]), [4, this._getFileToken(r, s.fileName, "POST", "uploadId=".concat(E))];
                    case 8:
                        return s = g.sent(), [3, 10];
                    case 9:
                        return [2, {code: g.sent()}];
                    case 10:
                        return f = T.map((function (e, t) {
                            return "<Part><PartNumber>".concat(t + 1, "</PartNumber><ETag>").concat(e, "</ETag></Part>")
                        })).join(""), f = "<CompleteMultipartUpload xmlns='http://s3.amazonaws.com/doc/2006-03-01/'>".concat(f, "</CompleteMultipartUpload>"), l = this.getBaseHeaders(o, s, t), this._promise = e({
                            url: "".concat(a, "?uploadId=").concat(E),
                            headers: l,
                            method: "POST",
                            body: f,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 11:
                        return I = g.sent().status, this._promise = null, 200 === I || 204 === I ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: s.fileName, uploadMethod: M.MINIO}
                        }] : [2, {code: i.UPLOAD_FAIL, msg: "end upload fail"}]
                }
            }))
        }))
    }, n.prototype.requestUploadPart = function (t, n, o, r, s, a, c, _) {
        return void 0 === c && (c = 1), void 0 === _ && (_ = 0), x(this, void 0, void 0, (function () {
            var u, d, E, T, S, R, A, f, l;
            return Y(this, (function (I) {
                switch (I.label) {
                    case 0:
                        if (_ >= 5) return [2, {code: i.UPLOAD_FAIL, msg: "Upload retry times exceeded 5. Procedure"}];
                        u = (c - 1) * U, d = Math.min(U, n.size - u), E = "partNumber=".concat(c, "&uploadId=").concat(o), I.label = 1;
                    case 1:
                        return I.trys.push([1, 3, , 4]), [4, this._getFileToken(s.fileType, r, "PUT", E)];
                    case 2:
                        return T = I.sent(), [3, 4];
                    case 3:
                        return [2, {code: I.sent()}];
                    case 4:
                        return S = n.slice(u, c * U), R = this.getBaseHeaders(n, T, s), this._promise = e({
                            url: "".concat(t, "?").concat(E),
                            headers: R,
                            method: "PUT",
                            body: S,
                            timeout: 0,
                            onProgress: function (e) {
                                var t;
                                return null === (t = null == s ? void 0 : s.onProgress) || void 0 === t ? void 0 : t.call(s, u + e.loaded, n.size)
                            }
                        }), [4, this._promise.result()];
                    case 5:
                        return A = I.sent(), f = A.status, l = A.xhr, this._promise = null, 200 === f || 204 === f ? (a.push((null == l ? void 0 : l.getResponseHeader("ETag")) || ""), u + d < n.size ? [2, this.requestUploadPart(t, n, o, r, s, a, c + 1, 0)] : [2, {code: i.SUCCESS}]) : [2, this.requestUploadPart(t, n, o, r, s, a, c, _ + 1)]
                }
            }))
        }))
    }, n.prototype.getBaseHeaders = function (e, t, n) {
        var o = n.contentDisposition || ("text/html" === e.type ? "inline" : "attachment");
        return {
            "Content-Disposition": "".concat(o, "; filename=").concat(encodeURIComponent(e.name), ";"),
            Authorization: t.minioAuthorization,
            "x-amz-content-sha256": t.minioContentSha256,
            "x-amz-date": t.minioDate,
            "Content-Type": e.type || "text/plain"
        }
    }, n.prototype._abortHandler = function () {
        var e;
        null === (e = this._promise) || void 0 === e || e.abort()
    }, n
}(qn), Qn = function (t) {
    function n() {
        var e = null !== t && t.apply(this, arguments) || this;
        return e.isSupportMultipart = !0, e._promise = null, e
    }

    return H(n, t), n.prototype.commonUpload = function (t) {
        return x(this, void 0, void 0, (function () {
            var n, o, r, s, a, c, _, u, d, E, T;
            return Y(this, (function (S) {
                switch (S.label) {
                    case 0:
                        n = t.file, o = t.onProgress, r = t.fileType, S.label = 1;
                    case 1:
                        return S.trys.push([1, 3, , 4]), [4, this._getFileToken(r, n.name)];
                    case 2:
                        return s = S.sent(), [3, 4];
                    case 3:
                        return [2, {code: S.sent()}];
                    case 4:
                        return a = {}, (c = new FormData).set("token", s.token), c.set("key", s.fileName), c.set("file", n), _ = y(this._url), this._promise = e({
                            url: _,
                            headers: a,
                            onProgress: function (e) {
                                return null == o ? void 0 : o(e.loaded, e.total)
                            },
                            method: "POST",
                            body: c,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return u = S.sent(), d = u.status, E = u.data, this._promise = null, 200 !== d && 204 !== d || !E ? [2, {
                            code: i.UPLOAD_FAIL,
                            msg: d.toString()
                        }] : (T = JSON.parse(E), [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: T.rc_url.file_name, downloadUrl: "".concat(_, "/").concat(T.rc_url.path)}
                        }])
                }
            }))
        }))
    }, n.prototype.multipartUpload = function (e) {
        return x(this, void 0, void 0, (function () {
            var t, n, o, r, i;
            return Y(this, (function (s) {
                switch (s.label) {
                    case 0:
                        t = e.file, n = e.onProgress, o = e.fileType, r = G(), s.label = 1;
                    case 1:
                        return s.trys.push([1, 3, , 4]), [4, this._getFileToken(o, t.name)];
                    case 2:
                        return i = s.sent(), [3, 4];
                    case 3:
                        return [2, {code: s.sent()}];
                    case 4:
                        return [2, this._requestUploadPart(r, t, i.token, n)]
                }
            }))
        }))
    }, n.prototype._requestUploadPart = function (t, n, o, r, s) {
        return void 0 === s && (s = 0), x(this, void 0, void 0, (function () {
            var a, c, _, u, d, E, T, S, R, A;
            return Y(this, (function (f) {
                switch (f.label) {
                    case 0:
                        return a = Math.min(U, n.size - s), c = t + n.name.substring(n.name.lastIndexOf(".")), _ = {
                            Range: "bytes=".concat(s, "-").concat(s + a),
                            "X-File-TransactionId": c,
                            "X-File-Total-Size": n.size.toString()
                        }, u = n.slice(s, s + a), (d = new FormData).set("file", u, n.name), d.set("key", c), d.set("name", c), d.set("token", o), E = y(this._url), this._promise = e({
                            url: E,
                            headers: _,
                            onProgress: function (e) {
                                return null == r ? void 0 : r(s + e.loaded, n.size)
                            },
                            method: "POST",
                            body: d,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 1:
                        return T = f.sent(), S = T.status, R = T.data, this._promise = null, 200 === S || 204 === S ? s + a < n.size ? [2, this._requestUploadPart(t, n, o, r, s + a)] : (A = JSON.parse(R), [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: A.rc_url.file_name, downloadUrl: "".concat(E, "/").concat(A.rc_url.path)}
                        }]) : [2, {code: i.UPLOAD_FAIL, msg: S.toString()}]
                }
            }))
        }))
    }, n.prototype._abortHandler = function () {
        var e;
        null === (e = this._promise) || void 0 === e || e.abort()
    }, n
}(qn), $n = function (t) {
    function n() {
        var e = null !== t && t.apply(this, arguments) || this;
        return e._promise = null, e
    }

    return H(n, t), n.prototype.commonUpload = function (t) {
        return x(this, void 0, void 0, (function () {
            var n, o, r, s, a, c, _, u, d, E;
            return Y(this, (function (T) {
                switch (T.label) {
                    case 0:
                        n = t.file, o = t.onProgress, r = t.fileType, s = t.contentDisposition, T.label = 1;
                    case 1:
                        return T.trys.push([1, 3, , 4]), [4, this._getFileToken(r, n.name)];
                    case 2:
                        return a = T.sent(), [3, 4];
                    case 3:
                        return [2, {code: T.sent()}];
                    case 4:
                        return c = {}, _ = y("".concat(a.s3BucketName, ".").concat(this._url)), u = new FormData, s ? u.set("Content-Disposition", s) : u.set("Content-Disposition", "text/html" === n.type ? "inline;" : "attachment;"), u.set("Content-Type", n.type), u.set("x-amz-credential", a.s3Credential), u.set("x-amz-algorithm", a.s3Algorithm), u.set("x-amz-date", a.s3Date), u.set("policy", a.s3Policy), u.set("x-amz-signature", a.s3Signature), u.set("key", a.fileName), u.set("file", n), this._promise = e({
                            url: _,
                            headers: c,
                            onProgress: function (e) {
                                return null == o ? void 0 : o(e.loaded, e.total)
                            },
                            method: "POST",
                            body: u,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return d = T.sent(), E = d.status, d.data, this._promise = null, 200 === E || 204 === E ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: a.fileName, uploadMethod: M.AWS}
                        }] : [2, {code: i.UPLOAD_FAIL, msg: E.toString()}]
                }
            }))
        }))
    }, n.prototype.multipartUpload = function (e) {
        throw new Error("Method not implemented.")
    }, n.prototype._abortHandler = function () {
        var e;
        null === (e = this._promise) || void 0 === e || e.abort()
    }, n
}(qn), eo = function (t) {
    function n() {
        var e = null !== t && t.apply(this, arguments) || this;
        return e._promise = null, e.isSupportMultipart = !0, e
    }

    return H(n, t), n.prototype.commonUpload = function (t) {
        return x(this, void 0, void 0, (function () {
            var n, o, r, s, a, c, _;
            return Y(this, (function (u) {
                switch (u.label) {
                    case 0:
                        n = t.file, o = t.onProgress, r = t.fileType, u.label = 1;
                    case 1:
                        return u.trys.push([1, 3, , 4]), [4, this._getFileToken(r)];
                    case 2:
                        return s = u.sent(), [3, 4];
                    case 3:
                        return [2, {code: u.sent()}];
                    case 4:
                        return a = y("".concat(this._url, "/").concat(s.stcBucketName, "/").concat(s.fileName)), c = this.getBaseHeaders(n, s, t), this._promise = e({
                            url: a,
                            headers: c,
                            onProgress: function (e) {
                                return null == o ? void 0 : o(e.loaded, e.total)
                            },
                            method: "PUT",
                            body: n,
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return _ = u.sent().status, this._promise = null, 200 === _ || 204 === _ ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: s.fileName, uploadMethod: M.STC}
                        }] : [2, {code: i.UPLOAD_FAIL}]
                }
            }))
        }))
    }, n.prototype.multipartUpload = function (t) {
        var n;
        return x(this, void 0, void 0, (function () {
            var o, r, s, a, c, _, u, d, E, T, S, R, A, f, l, I;
            return Y(this, (function (g) {
                switch (g.label) {
                    case 0:
                        o = t.file, t.onProgress, r = t.fileType, g.label = 1;
                    case 1:
                        return g.trys.push([1, 3, , 4]), [4, this._getFileToken(r, o.name, "POST", "uploads")];
                    case 2:
                        return s = g.sent(), [3, 4];
                    case 3:
                        return [2, {code: g.sent()}];
                    case 4:
                        return a = y("".concat(this._url, "/").concat(s.stcBucketName, "/").concat(s.fileName)), c = this.getBaseHeaders(o, s, t), this._promise = e({
                            url: "".concat(a, "?uploads"),
                            headers: c,
                            method: "POST"
                        }), [4, this._promise.result()];
                    case 5:
                        return _ = g.sent(), u = _.status, d = _.data, this._promise = null, E = null === (n = null == d ? void 0 : d.match(/(?:<UploadId>)(\S*?)(?:<\/UploadId>)/)) || void 0 === n ? void 0 : n[1], 200 !== u && 204 !== u || !E ? [2, {
                            code: i.UPLOAD_FAIL,
                            msg: "start upload fail"
                        }] : (T = [], [4, this.requestUploadPart(a, o, E, s.fileName, t, T)]);
                    case 6:
                        if (S = g.sent(), R = S.code, A = S.msg, R !== i.SUCCESS) return [2, {code: R, msg: A}];
                        g.label = 7;
                    case 7:
                        return g.trys.push([7, 9, , 10]), [4, this._getFileToken(r, s.fileName, "POST", "uploadId=".concat(E))];
                    case 8:
                        return s = g.sent(), [3, 10];
                    case 9:
                        return [2, {code: g.sent()}];
                    case 10:
                        return f = T.map((function (e, t) {
                            return "<Part><PartNumber>".concat(t + 1, "</PartNumber><ETag>").concat(e, "</ETag></Part>")
                        })).join(""), f = "<CompleteMultipartUpload xmlns='http://s3.amazonaws.com/doc/2006-03-01/'>".concat(f, "</CompleteMultipartUpload>"), l = this.getBaseHeaders(o, s, t), this._promise = e({
                            url: "".concat(a, "?uploadId=").concat(E),
                            headers: l,
                            method: "POST",
                            body: f
                        }), [4, this._promise.result()];
                    case 11:
                        return I = g.sent().status, this._promise = null, 200 === I || 204 === I ? [2, {
                            code: i.SUCCESS,
                            data: {uniqueName: s.fileName, uploadMethod: M.STC}
                        }] : [2, {code: i.UPLOAD_FAIL, msg: "end upload fail"}]
                }
            }))
        }))
    }, n.prototype.requestUploadPart = function (t, n, o, r, s, a, c, _) {
        return void 0 === c && (c = 1), void 0 === _ && (_ = 0), x(this, void 0, void 0, (function () {
            var u, d, E, T, S, R, A, f, l;
            return Y(this, (function (I) {
                switch (I.label) {
                    case 0:
                        if (_ >= 5) return [2, {code: i.UPLOAD_FAIL, msg: "Upload retry times exceeded 5. Procedure"}];
                        u = (c - 1) * U, d = Math.min(U, n.size - u), E = "partNumber=".concat(c, "&uploadId=").concat(o), I.label = 1;
                    case 1:
                        return I.trys.push([1, 3, , 4]), [4, this._getFileToken(s.fileType, r, "PUT", E)];
                    case 2:
                        return T = I.sent(), [3, 4];
                    case 3:
                        return [2, {code: I.sent()}];
                    case 4:
                        return S = n.slice(u, c * U), R = this.getBaseHeaders(n, T, s), this._promise = e({
                            url: "".concat(t, "?").concat(E),
                            headers: R,
                            method: "PUT",
                            body: S,
                            onProgress: function (e) {
                                var t;
                                return null === (t = null == s ? void 0 : s.onProgress) || void 0 === t ? void 0 : t.call(s, u + e.loaded, n.size)
                            },
                            timeout: 0
                        }), [4, this._promise.result()];
                    case 5:
                        return A = I.sent(), f = A.status, A.data, l = A.xhr, this._promise = null, 200 === f || 204 === f ? (a.push((null == l ? void 0 : l.getResponseHeader("ETag")) || ""), u + d < n.size ? [2, this.requestUploadPart(t, n, o, r, s, a, c + 1, 0)] : [2, {code: i.SUCCESS}]) : [2, this.requestUploadPart(t, n, o, r, s, a, c, _ + 1)]
                }
            }))
        }))
    }, n.prototype.getBaseHeaders = function (e, t, n) {
        var o = n.contentDisposition || ("text/html" === e.type ? "inline" : "attachment");
        return {
            "Content-Disposition": "".concat(o, "; filename=").concat(encodeURIComponent(e.name), ";"),
            Authorization: t.stcAuthorization,
            "x-amz-content-sha256": t.stcContentSha256,
            "x-amz-date": t.stcDate,
            "Content-Type": e.type || "text/plain"
        }
    }, n.prototype._abortHandler = function () {
        var e;
        null === (e = this._promise) || void 0 === e || e.abort()
    }, n
}(qn);
var to = ((Kn = {})[yn.QINIU] = Xn, Kn[yn.ALIYUN] = zn, Kn[yn.BAIDU] = jn, Kn[yn.S3] = $n, Kn[yn.STC] = eo, Kn[yn.MINIO] = Wn, Kn[yn.RCX] = Qn, Kn);

function no(e, t, n, o) {
    var r = document.createElement("canvas"), s = r.getContext("2d"), a = new Image;
    a.onload = function (t) {
        var c = o || {}, _ = c.maxHeight, u = void 0 === _ ? 160 : _, d = c.maxWidth, E = void 0 === d ? 160 : d,
            T = c.quality, S = void 0 === T ? .7 : T, R = c.scale, A = void 0 === R ? 1 : R,
            f = ro(a.width, a.height, {maxHeight: u, maxWidth: E, scale: A});
        r.width = Math.min(f.w, E), r.height = Math.min(f.h, u), s.drawImage(a, f.x, f.y, f.w, f.h);
        var l = oo(r, S);
        l = l.replace(/data:image\/[^;]+;base64,/, ""), e({
            code: i.SUCCESS,
            data: k(k({}, n), {thumbnail: l, width: f.w, height: f.h})
        })
    }, a.onerror = function (t) {
        e({code: i.UPLOAD_FAIL, msg: "get image info fail:".concat(JSON.stringify(t))})
    }, a.src = (window.URL || window.webkitURL).createObjectURL(t)
}

function oo(e, t) {
    var n = e.toDataURL("image/jpeg", t);
    return n.length > P - 10240 ? oo(e, t - .1) : n
}

var ro = function (e, t, n) {
    var o, r, i = n.maxHeight, s = void 0 === i ? 160 : i, a = n.maxWidth, c = void 0 === a ? 160 : a, _ = n.scale,
        u = e < t, d = 0, E = 0;
    return (u ? t / e : e / t) > (void 0 === _ ? 1 : _) ? (u ? (o = 100, E = ((r = t / (e / 100)) - s) / 2) : (r = 100, d = ((o = e / (t / 100)) - c) / 2), {
        w: o,
        h: r,
        x: -d,
        y: -E
    }) : (u ? (r = s, o = e / (t / s)) : (o = c, r = t / (e / c)), {w: o, h: r, x: -d, y: -E})
}, io = 0, so = function () {
    function e(e, t) {
        this._client = null, this.id = ++io, this._promise = this._handleUpload(e, t)
    }

    return e.prototype.abort = function () {
        var e;
        this._resolve({
            code: i.UPLOAD_FAIL,
            msg: "upload abort"
        }), null === (e = this._client) || void 0 === e || e.abort()
    }, e.prototype._uploadInLoop = function (e, t, n, o, r) {
        return void 0 === r && (r = []), x(this, void 0, void 0, (function () {
            var s, a, c, _, u, d;
            return Y(this, (function (E) {
                switch (E.label) {
                    case 0:
                        s = 0, E.label = 1;
                    case 1:
                        return s < e.length ? (a = e[s], this._client = new to[a.type](a.url, n, o), [4, this._client.upload(t)]) : [3, 4];
                    case 2:
                        if (c = E.sent(), _ = c.code, u = c.data, d = c.msg, _ === i.SUCCESS) return [2, {
                            code: _,
                            data: u
                        }];
                        if (this._client.isAbort()) return this._client = null, [2, {code: _, data: u, msg: d}];
                        this._client = null, r.push({type: a.type, url: a.url, code: _, msg: d}), E.label = 3;
                    case 3:
                        return s++, [3, 1];
                    case 4:
                        return [2, {
                            code: i.UPLOAD_FAIL,
                            msg: "Failed to upload all channels, msg: ".concat(JSON.stringify(r))
                        }]
                }
            }))
        }))
    }, e.prototype._handleUpload = function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return [2, new Promise((function (o) {
                    return x(n, void 0, void 0, (function () {
                        var n, r, s, a, c, _, u, d, E, T, S, R, A, f, l, I, g, O, N;
                        return Y(this, (function (v) {
                            switch (v.label) {
                                case 0:
                                    return this._resolve = o, n = t.getFileToken, r = t.serverType, s = t.customDomain, a = t.ossConfig, c = t.uploadServer, _ = t.bosAddr, u = e.file, d = e.fileType, E = e.thumbnailConfig, T = function (e, t, n, o, r) {
                                        if (n) return [{type: yn.RCX, url: n, p: "1"}];
                                        if (e) return JSON.parse(e).map((function (e) {
                                            var t = {type: yn.QINIU, url: "", p: ""};
                                            return Object.keys(e).forEach((function (n) {
                                                "p" === n ? t.p = e[n] : (t.type = n, t.url = e[n])
                                            })), t
                                        })).sort((function (e, t) {
                                            return e.p - t.p
                                        }));
                                        var i = [];
                                        return o && i.push({
                                            type: yn.QINIU,
                                            url: o,
                                            p: "1"
                                        }), r && i.push({type: yn.BAIDU, url: r, p: "2"}), i
                                    }(a, 0, s, c, _), 0 === T.length ? (o({
                                        code: i.BIZ_ERROR_INVALID_PARAMETER,
                                        msg: "uploadUrlList is empty"
                                    }), [2]) : [4, this._uploadInLoop(T, e, n, r)];
                                case 1:
                                    if (S = v.sent(), R = S.code, A = S.data, f = S.msg, R !== i.SUCCESS || !A) return o({
                                        code: R,
                                        msg: f
                                    }), [2];
                                    if (l = A.downloadUrl) return [3, 5];
                                    v.label = 2;
                                case 2:
                                    return v.trys.push([2, 4, , 5]), [4, t.getFileUrl(d, A.uniqueName, u.name, void 0, A.uploadMethod)];
                                case 3:
                                    return I = v.sent(), l = I.downloadUrl, [3, 5];
                                case 4:
                                    return g = v.sent(), o({code: g, msg: "Get download url fail"}), [3, 5];
                                case 5:
                                    return l ? (O = {
                                        downloadUrl: l,
                                        uniqueName: (null == A ? void 0 : A.uniqueName) || "",
                                        name: u.name,
                                        size: u.size,
                                        type: u.type
                                    }, d !== L.AUDIO ? [3, 7] : [4, u.arrayBuffer()]) : (o({
                                        code: i.UPLOAD_FAIL,
                                        msg: "Get download url fail"
                                    }), [2]);
                                case 6:
                                    return N = v.sent(), function (e, t, n) {
                                        (new AudioContext).decodeAudioData(t, (function (t) {
                                            e({
                                                code: i.SUCCESS,
                                                data: k(k({}, n), {duration: t.duration, length: t.length})
                                            })
                                        }), (function (t) {
                                            e({
                                                code: i.UPLOAD_FAIL,
                                                msg: "get audio info fail:".concat(JSON.stringify(t))
                                            })
                                        }))
                                    }(o, N, O), [2];
                                case 7:
                                    return d === L.IMAGE ? (no(o, u, O, E), [2]) : (o({code: R, data: O}), [2])
                            }
                        }))
                    }))
                }))]
            }))
        }))
    }, e.prototype.awaitResult = function () {
        return x(this, void 0, void 0, (function () {
            return Y(this, (function (e) {
                return [2, this._promise]
            }))
        }))
    }, e
}(), ao = {};

function co(e, t) {
    var n = new so(e, t);
    return function (e) {
        x(this, void 0, void 0, (function () {
            return Y(this, (function (t) {
                switch (t.label) {
                    case 0:
                        return ao[e.id] = e, [4, e.awaitResult()];
                    case 1:
                        return t.sent(), delete ao[e.id], [2]
                }
            }))
        }))
    }(n), n
}

function _o(e) {
    var t = ao[e];
    return !!t && (t.abort(), !0)
}

var uo = function (e) {
    var t = e.contentDisposition, n = e.fileType, o = e.file;
    return !l("contentDisposition", t, (function (e) {
        return "inline" === e || "attachment" === e
    }), !1) || !l("fileType", n, (function (e) {
        return !!L[e]
    }), !0) || !l("file", o, (function (e) {
        return e instanceof File && (!(n === L.IMAGE && !e.type.match(/^image\//)) && !(n === L.AUDIO && !e.type.match(/^audio\//)))
    }), !0)
}, Eo = function (e, t) {
    var n = e.getNaviInfoFromCache();
    return {
        getFileToken: e.getFileToken.bind(e),
        getFileUrl: e.getFileUrl.bind(e),
        customDomain: t.uploadDomain || "",
        serverType: null == n ? void 0 : n.type,
        ossConfig: null == n ? void 0 : n.ossConfig,
        uploadServer: null == n ? void 0 : n.uploadServer,
        bosAddr: null == n ? void 0 : n.bosAddr
    }
};

function To(e) {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (t) {
            return uo(e) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, Xe((function (t, n, o) {
                var r = co(e, Eo(t, o));
                return {code: i.SUCCESS, data: r}
            }))]
        }))
    }))
}

function So(e) {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (t) {
            return [2, {code: i.SUCCESS, data: _o(e)}]
        }))
    }))
}

function Ro(e) {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (t) {
            return uo(e) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, qe((function (t, n, o) {
                return function (e, t) {
                    return x(this, void 0, void 0, (function () {
                        return Y(this, (function (n) {
                            return [2, new so(e, t).awaitResult()]
                        }))
                    }))
                }(e, Eo(t, o))
            }))]
        }))
    }))
}

function Ao(e, t, n, o) {
    return qe((function (r) {
        return new Promise((function (s) {
            r.getFileToken(e, t, n, o).then((function (e) {
                s({code: i.SUCCESS, data: e})
            })).catch((function (e) {
                s({code: e, msg: ut[e]})
            }))
        }))
    }))
}

function fo(e) {
    return l("url", e, E.STRING, !0) ? qe((function (t) {
        return new Promise((function (n) {
            t.getFileToken(1, void 0, void 0, void 0, e).then((function (e) {
                var t = e.token, o = e.downloadAuthInfo, r = e.deadline;
                n({code: i.SUCCESS, data: {token: t, downloadAuthInfo: o, deadline: r}})
            })).catch((function (e) {
                n({code: e, msg: ut[e]})
            }))
        }))
    })) : Promise.resolve({code: i.BIZ_ERROR_INVALID_PARAMETER})
}

function lo(e, t, n, o, r) {
    return l("fileType", e, D, !0) && l("filename", t, E.STRING) && l("saveName", n, E.STRING) && l("serverType", r, E.NUMBER) ? qe((function (s) {
        return new Promise((function (a) {
            s.getFileUrl(e, t, n, o, r).then((function (e) {
                a({code: i.SUCCESS, data: e})
            })).catch((function (e) {
                a({code: e})
            }))
        }))
    })) : Promise.resolve({code: i.BIZ_ERROR_INVALID_PARAMETER})
}

function Io(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return [2, qe((function (r, c) {
                return x(o, void 0, void 0, (function () {
                    var o, _, u, d, T, S, R, f, I, g, O, N;
                    return Y(this, (function (v) {
                        switch (v.label) {
                            case 0:
                                return n = n || {}, o = c.createTraceId(), t instanceof Un == !1 ? (c.warn(A.A_SEND_MSG_T, JSON.stringify({
                                    code: i.BIZ_ERROR_INVALID_PARAMETER,
                                    msg: "message parameter is not an instance of BaseMessage"
                                }), o), [2, _t.ILLGAL_PARAMS]) : l("conversation", e, E.OBJECT, !0) ? (_ = e.conversationType, u = e.targetId, d = e.channelId, l("conversation.targetId", u, E.STRING, !0) && l("conversation.conversationType", _, E.NUMBER, !0) && l("conversation.channelId", d, E.CHANNEL_ID) && l("options.isStatusMessage", null == n ? void 0 : n.isStatusMessage, E.BOOLEAN) && l("options.disableNotification", null == n ? void 0 : n.disableNotification, E.BOOLEAN) && l("options.pushContent", null == n ? void 0 : n.pushContent, E.STRING) && l("options.pushData", null == n ? void 0 : n.pushData, E.STRING) && l("options.isMentioned", null == n ? void 0 : n.isMentioned, E.BOOLEAN) && l("options.mentionedType", null == n ? void 0 : n.mentionedType, E.NUMBER) && l("options.mentionedUserIdList", null == n ? void 0 : n.mentionedUserIdList, E.ARRAY) && l("options.directionalUserIdList", null == n ? void 0 : n.directionalUserIdList, E.ARRAY) && l("options.isVoipPush", null == n ? void 0 : n.isVoipPush, E.BOOLEAN) && l("options.canIncludeExpansion", null == n ? void 0 : n.canIncludeExpansion, E.BOOLEAN) && l("options.expansion", null == n ? void 0 : n.expansion, E.OBJECT) && l("options.pushConfig", null == n ? void 0 : n.pushConfig, E.OBJECT) && l("options.messageId", null == n ? void 0 : n.messageId, E.NUMBER) ? (T = function (e, t, n) {
                                    var o = e.isStatusMessage, r = e.disableNotification, i = e.pushContent,
                                        s = e.pushData, a = e.isMentioned, c = e.mentionedType,
                                        _ = e.mentionedUserIdList, u = e.directionalUserIdList, d = e.isVoipPush,
                                        E = e.canIncludeExpansion, T = e.expansion, S = e.isFilerWhiteBlacklist,
                                        R = e.pushConfig, A = e.messageId, f = n.channelId;
                                    return k({
                                        isStatusMessage: o,
                                        disableNotification: r,
                                        pushContent: i,
                                        pushData: s,
                                        isMentioned: a,
                                        mentionedType: c,
                                        mentionedUserIdList: _,
                                        directionalUserIdList: u,
                                        isVoipPush: d,
                                        canIncludeExpansion: E,
                                        expansion: T,
                                        isFilerWhiteBlacklist: S,
                                        pushConfig: R,
                                        channelId: f || "",
                                        messageId: A
                                    }, t)
                                }(n, t, e), S = {
                                    isMentioned: !!n.isMentioned,
                                    content: t.content,
                                    messageType: t.messageType,
                                    isPersited: !!t.isPersited,
                                    isCounted: !!t.isCounted,
                                    disableNotification: !!(null == n ? void 0 : n.disableNotification),
                                    canIncludeExpansion: !!(null == n ? void 0 : n.canIncludeExpansion),
                                    expansion: (null == n ? void 0 : n.expansion) || null,
                                    conversationType: e.conversationType,
                                    targetId: e.targetId,
                                    channelId: e.channelId,
                                    senderUserId: r.getCurrentUserId(),
                                    messageUId: "",
                                    messageDirection: w.SEND,
                                    receivedTime: 0,
                                    isStatusMessage: !!n.isStatusMessage,
                                    receivedStatus: s.UNREAD,
                                    isOffLineMessage: !1,
                                    pushConfig: null == n ? void 0 : n.pushConfig,
                                    sentStatus: V.SENDING
                                }, _ !== a.ULTRA_GROUP && (S.isOffLineMessage = !1), R = function (e) {
                                    S.messageId = e;
                                    try {
                                        (null == n ? void 0 : n.onSendBefore) && n.onSendBefore(De(S))
                                    } catch (e) {
                                        c.error(A.A_SEND_MSG_T, 'Callback method "onSendBefore" execution error.\n'.concat(null == e ? void 0 : e.stack), o)
                                    }
                                }, c.info(A.A_SEND_MSG_T, JSON.stringify({
                                    messageType: t.messageType,
                                    conversationType: _,
                                    targetId: u,
                                    channelId: d
                                }), o), [4, r.sendMessage(_, u, T, R, o)]) : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]) : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                            case 1:
                                return f = v.sent(), I = f.code, g = f.data, O = f.msg, I === i.SUCCESS ? (c.info(A.A_SEND_MSG_R, JSON.stringify({
                                    code: I,
                                    messageUId: g.messageUId,
                                    messageId: g.messageId
                                }), o), N = De(g), [2, {
                                    code: I,
                                    data: N
                                }]) : (c.warn(A.A_SEND_MSG_R, JSON.stringify({code: I}), o), S.sentTime = (null == g ? void 0 : g.sentTime) || 0, S.sentStatus = null == g ? void 0 : g.sentStatus, [2, {
                                    code: I,
                                    msg: O || ut[I],
                                    data: De(S)
                                }])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function go(e, t, n) {
    return Io(e, new Dn(t), n)
}

function Oo(e, t) {
    return function (n, o, r, s) {
        if (!l("sendOptions.contentDisposition", null == s ? void 0 : s.contentDisposition, (function (e) {
            return ["inline", "attachment"].includes(e)
        }))) return Promise.resolve({code: i.BIZ_ERROR_INVALID_PARAMETER});
        var a = {contentDisposition: null == s ? void 0 : s.contentDisposition};
        if (s && "thumbnailConfig" in s) {
            var c = null == s ? void 0 : s.thumbnailConfig;
            if (!(l("sendOptions.maxHeight", null == c ? void 0 : c.maxHeight, E.NUMBER) && l("sendOptions.maxWidth", null == c ? void 0 : c.maxWidth, E.NUMBER) && l("sendOptions.quality", null == c ? void 0 : c.quality, E.NUMBER) && l("sendOptions.scale", null == c ? void 0 : c.scale, E.NUMBER))) return Promise.resolve({code: i.BIZ_ERROR_INVALID_PARAMETER});
            a.thumbnailConfig = c
        }
        return qe((function (c, _, u) {
            return new Promise((function (c) {
                var u = _.createTraceId();
                _.info(A.L_MEDIA_UPLOAD_T, JSON.stringify({filesize: o.file.size, type: e}), u), Ro({
                    file: o.file,
                    fileType: e,
                    onProgress: function (e, t) {
                        var n;
                        null === (n = null == r ? void 0 : r.onProgress) || void 0 === n || n.call(r, Math.floor(e / t * 100))
                    },
                    contentDisposition: a.contentDisposition,
                    thumbnailConfig: a.thumbnailConfig
                }).then((function (e) {
                    var a, d = e.code, E = e.data, T = e.msg;
                    if (d === i.SUCCESS && E) {
                        var S = (null === (a = null == r ? void 0 : r.onComplete) || void 0 === a ? void 0 : a.call(r, k({url: E.downloadUrl}, E))) || t(E, o);
                        return _.info(A.L_MEDIA_UPLOAD_R, JSON.stringify({
                            downurl: E.downloadUrl,
                            code: i.SUCCESS
                        }), u), void Io(n, S, s).then(c)
                    }
                    c({code: d, msg: T})
                }))
            }))
        }))
    }
}

var No = Oo(L.FILE, (function (e, t) {
    var n, o, r = {
        name: e.name,
        size: t.file.size,
        type: (n = e.name, o = n.match(/\.(\w+)$/), o ? o[1] : "bin"),
        fileUrl: e.downloadUrl
    };
    return t.user && (r.user = t.user), t.extra && (r.extra = t.extra), t.mentionedInfo && (r.mentionedInfo = t.mentionedInfo), new Vn(r)
})), vo = Oo(L.IMAGE, (function (e, t) {
    var n = {content: e.thumbnail, imageUri: e.downloadUrl};
    return t.user && (n.user = t.user), t.extra && (n.extra = t.extra), t.mentionedInfo && (n.mentionedInfo = t.mentionedInfo), t.audit && (n.audit = t.audit), new Ln(n)
})), ho = Oo(L.IMAGE, (function (e, t) {
    var n = {gifDataSize: e.size, remoteUrl: e.downloadUrl, width: e.width, height: e.height};
    return t.user && (n.user = t.user), t.extra && (n.extra = t.extra), t.mentionedInfo && (n.mentionedInfo = t.mentionedInfo), t.audit && (n.audit = t.audit), new bn(n)
})), mo = Oo(L.AUDIO, (function (e, t) {
    var n = {remoteUrl: e.downloadUrl, duration: e.duration, type: e.type};
    return t.user && (n.user = t.user), t.extra && (n.extra = t.extra), t.mentionedInfo && (n.mentionedInfo = t.mentionedInfo), t.audit && (n.audit = t.audit), new Gn(n)
})), Co = Oo(L.SIGHT, (function (e, t) {
    var n = {
        sightUrl: e.downloadUrl,
        content: t.thumbnail,
        duration: t.duration,
        size: t.file.size || e.size,
        name: t.name || e.name
    };
    return t.user && (n.user = t.user), t.extra && (n.extra = t.extra), t.mentionedInfo && (n.mentionedInfo = t.mentionedInfo), t.audit && (n.audit = t.audit), new Pn(n)
}));
Oo(L.COMBINE_HTML, (function (e, t) {
    var n = {
        remoteUrl: e.downloadUrl,
        nameList: t.nameList,
        summaryList: t.summaryList,
        conversationType: t.conversationType
    };
    return t.user && (n.user = t.user), t.extra && (n.extra = t.extra), t.mentionedInfo && (n.mentionedInfo = t.mentionedInfo), new Bn(n)
}));
var po = function (e, t) {
    if (!(l("options.timestamp", null == t ? void 0 : t.timestamp, E.NUMBER) && l("options.count", null == t ? void 0 : t.count, E.NUMBER) && (B() || l("options.count", null == t ? void 0 : t.count, (function (e) {
        var t = e > 0 && e <= 100;
        return t || null === console || void 0 === console || console.error('"options.count" is invalid, It should be greater than 0 and less than 100'), t
    }))) && l("options.order", null == t ? void 0 : t.order, (function (e) {
        return 0 === e || 1 === e
    })) && l("conversation", e, E.CONVERSATION, !0))) return i.BIZ_ERROR_INVALID_PARAMETER
};

function Uo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return po(e, t) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(A.A_GET_HISTORY_MSG_T, JSON.stringify({
                                    targetId: e.targetId,
                                    conversationType: e.conversationType,
                                    channelId: e.channelId,
                                    timestamp: null == t ? void 0 : t.timestamp,
                                    count: null == t ? void 0 : t.count
                                }), n), 1 !== (o.getNaviInfoFromCache() || {}).repairHisMsg ? [3, 2] : (null == t ? void 0 : t.count) && (null == t ? void 0 : t.count) > 100 ? (r.warn(A.A_GET_HISTORY_MSG_R, '"options.count" is invalid, It should be greater than 0 and less than 100', n), [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]) : [4, o.getMessages(e.conversationType, e.targetId, null == t ? void 0 : t.timestamp, null == t ? void 0 : t.count, null == t ? void 0 : t.order, null == e ? void 0 : e.channelId, n)];
                            case 1:
                                return s = d.sent(), [3, 4];
                            case 2:
                                return [4, o.getHistoryMessage(e.conversationType, e.targetId, null == t ? void 0 : t.timestamp, null == t ? void 0 : t.count, null == t ? void 0 : t.order, null == e ? void 0 : e.channelId, "", n)];
                            case 3:
                                s = d.sent(), d.label = 4;
                            case 4:
                                return a = s.code, c = s.data, a === i.SUCCESS && c ? (_ = [], u = c.list.map((function (e) {
                                    return _.push(e.messageUId), De(e)
                                })), r.info(A.A_GET_HISTORY_MSG_R, JSON.stringify({
                                    code: a,
                                    messageUIds: _
                                }), n), [2, {
                                    code: a,
                                    data: {list: u, hasMore: c.hasMore}
                                }]) : (r.warn(A.A_GET_HISTORY_MSG_R, JSON.stringify({
                                    code: a,
                                    messageUIds: ""
                                }), n), [2, {code: a, msg: ut[a]}])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Mo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("options.timestamp", null == t ? void 0 : t.timestamp, E.NUMBER) && l("options.count", null == t ? void 0 : t.count, E.NUMBER) && l("options.count", null == t ? void 0 : t.count, (function (e) {
                var t = e > 0 && e <= 100;
                return t || null === console || void 0 === console || console.error("options.count is invalid, It should be greater than 0 and less than 100"), t
            })) && l("options.order", null == t ? void 0 : t.order, (function (e) {
                return 0 === e || 1 === e
            })) && l("conversation", e, E.CONVERSATION, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_REMOTE_HISTORY_MESSAGES_T, JSON.stringify({
                                    targetId: e.targetId,
                                    conversationType: e.conversationType,
                                    channelId: e.channelId,
                                    timestamp: null == t ? void 0 : t.timestamp,
                                    count: null == t ? void 0 : t.count,
                                    order: null == t ? void 0 : t.order
                                }), n), [4, o.getRemoteHistoryMessages(e.conversationType, e.targetId, (null == t ? void 0 : t.timestamp) || 0, (null == t ? void 0 : t.count) || 20, (null == t ? void 0 : t.order) || 0, e.channelId || "")];
                            case 1:
                                return s = d.sent(), a = s.code, c = s.data, a === i.SUCCESS && c ? (_ = [], u = c.list.map((function (e) {
                                    return _.push(e.messageUId), De(e)
                                })), r.info(be.A_GET_REMOTE_HISTORY_MESSAGES_R, JSON.stringify({
                                    code: a,
                                    messageUIds: _
                                })), [2, {
                                    code: a,
                                    data: {list: u, hasMore: c.hasMore}
                                }]) : (r.warn(be.A_GET_REMOTE_HISTORY_MESSAGES_R, JSON.stringify({code: a})), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function yo(e, t, n, o) {
    return x(this, void 0, void 0, (function () {
        var r = this;
        return Y(this, (function (s) {
            return l("targetId", e, E.STRING, !0) && l("messageUId", t, E.STRING, !0) && l("timestamp", n, E.NUMBER, !0) && l("channelId", o, E.CHANNEL_ID) ? [2, qe((function (i) {
                return x(r, void 0, void 0, (function () {
                    var r, i, s, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return r = {
                                    targetId: e,
                                    conversationType: a.PRIVATE,
                                    channelId: o
                                }, i = new Un("RC:ReadNtf", {
                                    messageUId: t,
                                    lastMessageSendTime: n,
                                    type: 1
                                }), [4, Io(r, i)];
                            case 1:
                                return s = u.sent(), c = s.code, _ = s.msg, 0 === c ? [2, {code: c}] : [2, {
                                    code: c,
                                    msg: _
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Lo(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return l("messageUId", t, E.STRING, !0) && l("targetId", e, E.STRING, !0) && l("channelId", n, E.CHANNEL_ID) ? [2, qe((function (r, i) {
                return x(o, void 0, void 0, (function () {
                    var o, r, s, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return o = "messageUId:".concat(t, ",targetId:").concat(e), i.debug(A.A_SEND_MSG_T, "send read receipt message ->".concat(o)), r = new Un("RC:RRReqMsg", {messageUId: t}), [4, Io({
                                    targetId: e,
                                    conversationType: a.GROUP,
                                    channelId: n
                                }, r)];
                            case 1:
                                return s = u.sent(), c = s.code, _ = s.msg, 0 === c ? [2, {code: c}] : [2, {
                                    code: c,
                                    msg: _
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Go(e, t, n) {
    return x(this, void 0, void 0, (function () {
        return Y(this, (function (e) {
            throw new Error("This method is deprecated, please use method sendReadReceiptResponseV2.")
        }))
    }))
}

var Po = function (e, t, n, o) {
    return x(void 0, void 0, void 0, (function () {
        var r, s;
        return Y(this, (function (a) {
            switch (a.label) {
                case 0:
                    return !l("messageList", o, E.OBJECT, !0) || Object.keys(o).some((function (e) {
                        return !l(e, o[e], E.ARRAY)
                    })) ? [2, Promise.resolve({code: i.BIZ_ERROR_INVALID_PARAMETER})] : (r = [], Object.keys(o).forEach((function (e) {
                        o[e].forEach((function (e) {
                            -1 === r.indexOf(e) && r.push(e)
                        }))
                    })), r.length ? [4, e.sendReadReceiptMessage(n.targetId, r, n.channelId)] : (t.warn(A.A_SEND_MSG_R, JSON.stringify({
                        code: i.BIZ_ERROR_INVALID_PARAMETER,
                        msg: "Error in parameter messageList."
                    })), [2, Promise.resolve({code: i.BIZ_ERROR_INVALID_PARAMETER})]));
                case 1:
                    return s = a.sent().code, [2, Promise.resolve({code: s})]
            }
        }))
    }))
};

function Do(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return l("targetId", e, E.STRING, !0) && l("channelId", n, E.CHANNEL_ID) ? [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, c, _, u, d;
                    return Y(this, (function (T) {
                        switch (T.label) {
                            case 0:
                                return o = {
                                    targetId: e,
                                    conversationType: a.GROUP,
                                    channelId: n
                                }, _ = r.getNaviInfoFromCache(), 1 !== (null == _ ? void 0 : _.grpRRVer) ? [3, 2] : [4, Po(r, s, o, t)];
                            case 1:
                                return c = T.sent(), [3, 4];
                            case 2:
                                return !l("messageList", t, E.OBJECT, !1) || t && Object.keys(t).some((function (e) {
                                    return !l(e, t[e], E.ARRAY)
                                })) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : (u = new Un("RC:RRRspMsg", {receiptMessageDic: t}), [4, Io(o, u)]);
                            case 3:
                                c = T.sent(), T.label = 4;
                            case 4:
                                return (d = c.code) === i.SUCCESS ? [2, {code: d}] : [2, {code: d, msg: ut[d]}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Bo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, c, _, u, d, T;
                    return Y(this, (function (S) {
                        switch (S.label) {
                            case 0:
                                return n = "conversationType:".concat(e.conversationType, ",targetId:").concat(e.targetId, ",\n    channelId: ").concat(e.channelId, ", timestamp:").concat(t), s = r.createTraceId(), r.info(A.A_SYNC_READ_STATUS_T, n, s), c = o.getNaviInfoFromCache(), l("conversation", e, E.CONVERSATION, !0) && l("timestamp", t, E.NUMBER, !0) && l("conversation.conversationType", e.conversationType, (function (e) {
                                    var t = e === a.GROUP || e === a.PRIVATE;
                                    return t || r.error(A.A_SYNC_READ_STATUS_R, "It should be ConversationType.GROUP or ConversationType.PRIVATE", s), t
                                })) ? 1 !== (null == c ? void 0 : c.sesDriven) ? [3, 2] : [4, o.updateConversationReadTime(e, t)] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                            case 1:
                                return _ = S.sent(), [3, 4];
                            case 2:
                                return u = new Un("RC:SRSMsg", {lastMessageSendTime: t}), [4, Io(e, u)];
                            case 3:
                                _ = S.sent(), S.label = 4;
                            case 4:
                                return d = _.code, T = _.msg, r[d === i.SUCCESS ? "info" : "warn"](A.A_SYNC_READ_STATUS_R, "code: ".concat(d, ", msg: ").concat(T), s), [2, {
                                    code: d,
                                    msg: T
                                }]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function wo(e, t, n) {
    return void 0 === n && (n = ""), x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, c, _, u, d, T;
                    return Y(this, (function (S) {
                        switch (S.label) {
                            case 0:
                                return o = s.createTraceId(), c = "conversationType:".concat(e.conversationType, ",targetId:").concat(e.targetId, ",\n    channelId: ").concat(e.channelId, ", startMsgUId:").concat(n, ", endMsgUId: ").concat(t), s.info(A.A_SEND_MESSAGE_READ_RECEIPT_V4_T, c, o), 3 !== (null == (_ = r.getNaviInfoFromCache()) ? void 0 : _.grpRRVer) ? [2, {code: i.READ_RECEIPT_V4_NOT_SUPPORT}] : l("conversation", e, E.CONVERSATION, !0) && l("startMsgUId", n, E.ONLY_STRING, !0) && l("endMsgUId", t, E.STRING, !0) && l("conversation.conversationType", e.conversationType, (function (e) {
                                    var t = e === a.PRIVATE || e === a.GROUP;
                                    return t || s.error(A.A_SEND_MESSAGE_READ_RECEIPT_V4_R, "It should be ConversationType.PRIVATE or ConversationType.GROUP", o), t
                                })) ? [4, r.sendReadReceiptMessageV4(e, n, t)] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                            case 1:
                                return u = S.sent(), d = u.code, T = u.msg, s[d === i.SUCCESS ? "info" : "warn"](A.A_SEND_MESSAGE_READ_RECEIPT_V4_R, "code: ".concat(d, ", msg: ").concat(T), o), [2, {
                                    code: d,
                                    msg: T
                                }]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Vo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, c, _, u, d, T;
                    return Y(this, (function (S) {
                        switch (S.label) {
                            case 0:
                                return n = "conversationType:".concat(e.conversationType, ",targetId:").concat(e.targetId, ",\n    channelId: ").concat(e.channelId, ", messageUid:").concat(t), s = r.createTraceId(), r.info(A.A_GET_MESSAGE_READ_RECEIPT_V4_T, n, s), 3 !== (null == (c = o.getNaviInfoFromCache()) ? void 0 : c.grpRRVer) ? [2, {code: i.READ_RECEIPT_V4_NOT_SUPPORT}] : l("conversation", e, E.CONVERSATION, !0) && l("messageUid", t, E.STRING, !0) && l("conversation.conversationType", e.conversationType, (function (e) {
                                    var t = e === a.GROUP;
                                    return t || r.error(A.A_GET_MESSAGE_READ_RECEIPT_V4_R, "It should be ConversationType.GROUP", s), t
                                })) ? [4, o.getMessageReadReceiptV4(e, t)] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                            case 1:
                                return _ = S.sent(), u = _.code, d = _.msg, T = _.data, r[u === i.SUCCESS ? "info" : "warn"](A.A_GET_MESSAGE_READ_RECEIPT_V4_R, "code: ".concat(u, ", msg: ").concat(d), s), u === i.SUCCESS && T ? [2, {
                                    code: u,
                                    data: T
                                }] : [2, {code: u, msg: d}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function bo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, c, _, u, d, T;
                    return Y(this, (function (S) {
                        switch (S.label) {
                            case 0:
                                return n = "conversationType:".concat(e.conversationType, ",targetId:").concat(e.targetId, ",\n    channelId: ").concat(e.channelId, ", messageUid:").concat(t.toString()), s = r.createTraceId(), r.info(A.A_BATCH_GET_MESSAGE_READ_RECEIPT_INFO_V4_T, n, s), 3 !== (null == (c = o.getNaviInfoFromCache()) ? void 0 : c.grpRRVer) ? [2, {code: i.READ_RECEIPT_V4_NOT_SUPPORT}] : l("conversation", e, E.CONVERSATION, !0) && l("messageUIds", t, E.ARRAY, !0) && l("conversation.conversationType", e.conversationType, (function (e) {
                                    var t = e === a.GROUP;
                                    return t || r.error(A.A_BATCH_GET_MESSAGE_READ_RECEIPT_INFO_V4_R, "It should be ConversationType.GROUP", s), t
                                })) ? [4, o.batchGetMessageReadReceiptInfoV4(e, t)] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                            case 1:
                                return _ = S.sent(), u = _.code, d = _.msg, T = _.data, r[u === i.SUCCESS ? "info" : "warn"](A.A_BATCH_GET_MESSAGE_READ_RECEIPT_INFO_V4_R, "code: ".concat(u, ", msg: ").concat(d), s), u === i.SUCCESS ? [2, {
                                    code: u,
                                    data: T
                                }] : [2, {code: u, msg: d}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function Jo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("conversation", e, E.CONVERSATION, !0) && l("options.messageUId", t.messageUId, E.STRING, !0) && l("options.sentTime", t.sentTime, E.NUMBER, !0) && l("options.disableNotification", null == t ? void 0 : t.disableNotification, E.BOOLEAN) && l("options.pushConfig", null == t ? void 0 : t.pushConfig, E.OBJECT) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = {
                                    user: t.user,
                                    channelId: e.channelId || "",
                                    disableNotification: null == t ? void 0 : t.disableNotification,
                                    pushConfig: null == t ? void 0 : t.pushConfig,
                                    extra: t.extra,
                                    isDelete: t.isDelete
                                }, s = r.createTraceId(), r.info(be.A_RECALL_MESSAGE_T, JSON.stringify({
                                    targetId: e.targetId,
                                    conversationType: e.conversationType,
                                    messageUId: t.messageUId
                                }), s), [4, o.recallMessage(e.conversationType, e.targetId, t.messageUId, t.sentTime, n)];
                            case 1:
                                return a = u.sent(), c = a.code, _ = a.data, c === i.SUCCESS && _ ? (r.info(be.A_RECALL_MESSAGE_R, JSON.stringify({
                                    code: c,
                                    messageUId: _.messageUId
                                }), s), [2, {
                                    code: c,
                                    data: De(_)
                                }]) : c === i.SUCCESS ? [2, {code: c}] : (r.warn(be.A_RECALL_MESSAGE_R, JSON.stringify({code: c}), s), [2, {
                                    code: c,
                                    msg: ut[c]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Fo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("conversation", e, E.CONVERSATION, !0) && l("options", t, (function (e) {
                return T(e) && e.length
            }), !0) && !t.some((function (e) {
                return !l("options.messageUId", e.messageUId, E.STRING, !0) || !l("options.sentTime", e.sentTime, E.NUMBER, !0) || !l("options.messageDirection", e.messageDirection, (function (e) {
                    return 1 === e || 2 === e
                }), !0)
            })) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_DELETE_REMOTE_MESSAGE_T, JSON.stringify({
                                    targetId: e.targetId,
                                    conversationType: e.conversationType,
                                    channelId: e.channelId,
                                    messages: t.map((function (e) {
                                        return e.messageUId
                                    }))
                                }), n), [4, o.deleteRemoteMessage(e.conversationType, e.targetId, t, e.channelId)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_DELETE_REMOTE_MESSAGE_R, JSON.stringify({code: s}), n), s !== i.SUCCESS ? [2, {
                                    code: s,
                                    msg: ut[s]
                                }] : [2, {code: i.SUCCESS}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Ho(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("conversation", e, E.CONVERSATION, !0) && l("timestamp", t, E.NUMBER, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_DELETE_REMOTE_MESSAGE_BY_TIMESTAMP_T, JSON.stringify({
                                    targetId: e.targetId,
                                    conversationType: e.conversationType,
                                    channelId: e.channelId,
                                    timestamp: t
                                }), n), [4, o.deleteRemoteMessageByTimestamp(e.conversationType, e.targetId, t, e.channelId)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_DELETE_REMOTE_MESSAGE_BY_TIMESTAMP_R, JSON.stringify({code: s}), n), s !== i.SUCCESS ? [2, {
                                    code: s,
                                    msg: ut[s]
                                }] : [2, {code: i.SUCCESS}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function ko(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, c, _, u, d;
                    return Y(this, (function (T) {
                        switch (T.label) {
                            case 0:
                                if (!l("options", e, E.ARRAY, !0) || !l("isDeleteLocal", t, E.BOOLEAN, !1) || !l("options", e, (function (t) {
                                    return !(e.length > 20 || 0 === e.length) || (r.error(be.A_BATCH_CLEAR_REMOTE_MSG_R, "conversations length should not be greater than 20 and not be equal to 0"), !1)
                                }), !0)) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                for (n = 0, s = e; n < s.length; n++) if (c = s[n], !(l("options", c, E.OBJECT, !0) && l("options.targetId", c.targetId, E.STRING, !0) && l("options.conversationType", c.conversationType, (function (e) {
                                    var t = [a.PRIVATE, a.GROUP, a.CHATROOM, a.SYSTEM].includes(e);
                                    return t || r.error(be.A_BATCH_CLEAR_REMOTE_MSG_R, "conversations.conversationType is invalid, It should be one of the following values:\n            ConversationType.PRIVATE,\n            ConversationType.GROUP,\n            ConversationType.CHATROOM,\n            ConversationType.SYSTEM,\n          "), t
                                }), !0) && l("options.timestamp", c.timestamp, E.NUMBER, !0) && l("options.channelId", c.channelId, E.ONLY_STRING))) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                                return _ = e.map((function (e) {
                                    return {
                                        conversationType: e.conversationType,
                                        targetId: e.targetId,
                                        timestamp: e.timestamp,
                                        channelId: e.channelId || ""
                                    }
                                })), u = r.createTraceId(), r.info(be.A_BATCH_CLEAR_REMOTE_MSG_T, "options: ".concat(JSON.stringify(_), ", isDeleteLocal: ").concat(t), u), [4, o.batchClearRemoteHistoryMessages(_, t)];
                            case 1:
                                return d = T.sent(), r[i.SUCCESS === d ? "info" : "warn"](be.A_BATCH_CLEAR_REMOTE_MSG_R, "code: ".concat(d), u), [2, {code: d}]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function xo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("expansion", e, E.OBJECT, !0) && l("message", t, E.OBJECT, !0) && l("message.conversationType", t.conversationType, E.NUMBER, !0) && l("message.targetId", t.targetId, E.STRING, !0) && l("message.channelId", t.channelId, E.CHANNEL_ID) && l("message.messageUId", t.messageUId, E.STRING, !0) && l("message.expansion", t.expansion, E.OBJECT) && l("message.canIncludeExpansion", t.canIncludeExpansion, E.BOOLEAN, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u, d, E, T;
                    return Y(this, (function (S) {
                        switch (S.label) {
                            case 0:
                                return n = t.conversationType, s = t.targetId, a = t.messageUId, c = t.canIncludeExpansion, _ = t.expansion, u = t.channelId, d = r.createTraceId(), r.info(be.A_UPDATE_MESSAGE_EXPANSION_T, JSON.stringify({
                                    targetId: s,
                                    channelId: u,
                                    conversationType: n,
                                    messageUId: a,
                                    canIncludeExpansion: c
                                }), d), [4, o.sendExpansionMessage({
                                    conversationType: n,
                                    targetId: s,
                                    messageUId: a,
                                    expansion: e,
                                    canIncludeExpansion: c,
                                    originExpansion: _,
                                    channelId: u
                                })];
                            case 1:
                                return E = S.sent().code, T = E === i.SUCCESS ? "info" : "warn", r[T](be.A_UPDATE_MESSAGE_EXPANSION_R, JSON.stringify({code: E}), d), E !== i.SUCCESS ? [2, {
                                    code: E,
                                    msg: ut[E]
                                }] : [2, {code: E}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Yo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("keys", e, E.ARRAY, !0) && l("message", t, E.OBJECT, !0) && l("message.conversationType", t.conversationType, E.NUMBER, !0) && l("message.targetId", t.targetId, E.STRING, !0) && l("message.channelId", t.channelId, E.CHANNEL_ID) && l("message.messageUId", t.messageUId, E.STRING, !0) && l("message.canIncludeExpansion", t.canIncludeExpansion, E.BOOLEAN, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u, d, E;
                    return Y(this, (function (T) {
                        switch (T.label) {
                            case 0:
                                return n = t.conversationType, s = t.targetId, a = t.messageUId, c = t.canIncludeExpansion, _ = t.channelId, u = r.createTraceId(), r.info(be.A_REMOVE_MESSAGE_EXPANSION_FOR_KEY_T, JSON.stringify({
                                    targetId: s,
                                    channelId: _,
                                    conversationType: n,
                                    messageUId: a,
                                    canIncludeExpansion: c
                                }), u), [4, o.sendExpansionMessage({
                                    conversationType: n,
                                    targetId: s,
                                    messageUId: a,
                                    canIncludeExpansion: c,
                                    keys: e,
                                    channelId: _
                                })];
                            case 1:
                                return d = T.sent().code, E = d === i.SUCCESS ? "info" : "warn", r[E](be.A_REMOVE_MESSAGE_EXPANSION_FOR_KEY_R, JSON.stringify({code: d}), u), d !== i.SUCCESS ? [2, {
                                    code: d,
                                    msg: ut[d]
                                }] : [2, {code: d}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Zo(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("conversation", e, E.CONVERSATION, !0) && l("typingContentType", t, E.STRING, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return n = {
                                    messageType: "RC:TypSts",
                                    content: {typingContentType: t},
                                    isStatusMessage: !0,
                                    channelId: e.channelId
                                }, s = r.createTraceId(), r.info(A.A_SEND_MSG_T, JSON.stringify({
                                    messageType: n.messageType,
                                    conversationType: e.conversationType,
                                    targetId: e.targetId,
                                    channelId: e.channelId
                                }), s), [4, o.sendMessage(e.conversationType, e.targetId, n, void 0, s)];
                            case 1:
                                return a = d.sent(), c = a.code, _ = a.data, u = c === i.SUCCESS ? "info" : "warn", r[u](A.A_SEND_MSG_R, JSON.stringify({
                                    code: c,
                                    messageUId: _ ? _.messageUId : "",
                                    messageId: _ ? _.messageId : ""
                                }), s), c === i.SUCCESS ? [2, {code: c, data: De(_)}] : [2, {code: c, msg: ut[c]}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Ko(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return l("messageUId", t, E.STRING, !0) && l("targetId", e, E.STRING, !0) && l("channelId", n, E.CHANNEL_ID) ? [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return o = s.createTraceId(), s.info(be.A_GET_MESSAGE_READER_T, JSON.stringify({
                                    targetId: e,
                                    messageUId: t,
                                    channelId: n
                                }), o), [4, r.getMessageReader(e, t, n)];
                            case 1:
                                return a = u.sent(), c = a.code, _ = a.data, c === i.SUCCESS ? (s.info(be.A_GET_MESSAGE_READER_R, JSON.stringify({
                                    code: c,
                                    totalMemberCount: null == _ ? void 0 : _.totalMemberCount
                                }), o), [2, {
                                    code: c,
                                    data: _
                                }]) : (s.warn(be.A_GET_MESSAGE_READER_R, JSON.stringify({code: c})), [2, {
                                    code: c,
                                    msg: ut[c]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function qo(e, t, n, o, r) {
    return Ke((function (i, s) {
        return d("messageType", e, E.STRING, !0), d("isPersited", t, E.BOOLEAN, !0), d("isCounted", n, E.BOOLEAN, !0), d("isStatusMessage", r, E.BOOLEAN, !1), d("searchProps", o, E.ARRAY), s.info(A.A_REGTYP_O, JSON.stringify({
            messageType: e,
            isCounted: n,
            isStatusMessage: r,
            isPersited: t
        })), i.registerMessageType(e, t, n, o, r), Mn(e, t, n)
    }))
}

function Xo(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return B() ? l("conversation", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u, d;
                    return Y(this, (function (E) {
                        switch (E.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_GET_FIRST_UNREAD_MESSAGE_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.getFirstUnreadMessage(t, r, s)];
                            case 1:
                                return c = E.sent(), _ = c.code, u = c.data, _ === i.SUCCESS ? (d = u && De(u) || null, o.info(be.A_GET_FIRST_UNREAD_MESSAGE_R, JSON.stringify({
                                    code: _,
                                    messageUId: null == u ? void 0 : u.messageUId
                                }), a), [2, {
                                    code: _,
                                    data: d
                                }]) : (o.warn(be.A_GET_FIRST_UNREAD_MESSAGE_R, JSON.stringify({code: _}), a), [2, {
                                    code: _,
                                    msg: ut[_]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function zo(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("conversation", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_GET_FIRST_UNREAD_MESSAGE_INFO_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.getFirstUnreadMessageInfo(t, r, s || "")];
                            case 1:
                                return c = d.sent(), _ = c.code, u = c.data, _ === i.SUCCESS ? (o.info(be.A_GET_FIRST_UNREAD_MESSAGE_INFO_R, JSON.stringify({
                                    code: _,
                                    messageUId: null == u ? void 0 : u.messageUId,
                                    sentTime: null == u ? void 0 : u.sentTime
                                }), a), [2, {
                                    code: _,
                                    data: u
                                }]) : (o.warn(be.A_GET_FIRST_UNREAD_MESSAGE_INFO_R, JSON.stringify({code: _}), a), [2, {
                                    code: _,
                                    msg: ut[_]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function jo(e, t, n) {
    return void 0 === n && (n = {}), x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return we("RongIMLib.insertMessage", "RongIMLib.ElectronExtension.insertMessage"), B() ? l("conversation", e, E.CONVERSATION, !0) && l("message", t, E.OBJECT, !0) && l("options", n, E.OBJECT) && l("options.isUnread", null == n ? void 0 : n.isUnread, E.BOOLEAN) && l("options.searchContent", null == n ? void 0 : n.searchContent, E.STRING) && l("content.senderUserId", t.senderUserId, E.STRING, !0) && l("content.messageType", t.messageType, E.STRING, !0) && l("content.content", t.content, E.OBJECT, !0) && l("content.messageDirection", t.messageDirection, E.NUMBER, !0) && l("content.canIncludeExpansion", t.canIncludeExpansion, E.BOOLEAN) && l("content.expansion", t.expansion, E.OBJECT) && l("content.disableNotification", t.disableNotification, E.BOOLEAN) && l("content.sentTime", t.sentTime, E.NUMBER) && l("content.sentStatus", t.sentStatus, E.NUMBER) ? [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, a, c, _, u, d, E, T, S, R, A, f, l, I, g, O, N;
                    return Y(this, (function (v) {
                        switch (v.label) {
                            case 0:
                                return o = t.senderUserId, a = t.messageType, c = t.content, _ = t.messageDirection, u = t.messageUId, d = t.canIncludeExpansion, E = t.expansion, T = t.disableNotification, S = t.sentTime, R = t.sentStatus, A = s.createTraceId(), s.info(be.A_INSERT_MESSAGE_T, JSON.stringify({
                                    conversationType: e.conversationType,
                                    targetId: e.targetId,
                                    channelId: e.channelId
                                }), A), f = n.isUnread, l = n.searchContent, I = {
                                    senderUserId: o,
                                    messageType: a,
                                    content: c,
                                    messageDirection: _,
                                    sentTime: S,
                                    sentStatus: R,
                                    searchContent: l,
                                    isUnread: f,
                                    messageUId: u,
                                    disableNotification: T,
                                    canIncludeExpansion: d,
                                    expansionMsg: JSON.stringify(E),
                                    channelId: e.channelId || ""
                                }, [4, r.insertMessage(e.conversationType, e.targetId, I)];
                            case 1:
                                return g = v.sent(), O = g.code, N = g.data, O === i.SUCCESS ? (s.info(be.A_INSERT_MESSAGE_R, JSON.stringify({
                                    code: O,
                                    messageId: null == N ? void 0 : N.messageId
                                }), A), [2, {
                                    code: O,
                                    data: De(N)
                                }]) : (s.warn(be.A_INSERT_MESSAGE_R, JSON.stringify({code: O}), A), [2, {
                                    code: O,
                                    msg: ut[O]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function Wo(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return B() ? l("messageId", e, (function (e) {
                return h(e) || m(e)
            }), !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_MESSAGE_T, JSON.stringify({messageId: e}), t), [4, n.getMessage(e)];
                            case 1:
                                return r = c.sent(), s = r.code, a = r.data, s === i.SUCCESS ? (o.info(be.A_GET_MESSAGE_R, JSON.stringify({
                                    code: s,
                                    messageUId: null == a ? void 0 : a.messageUId,
                                    messageId: null == a ? void 0 : a.messageId
                                })), [2, {
                                    code: s,
                                    data: De(a)
                                }]) : (o.warn(be.A_GET_MESSAGE_R, JSON.stringify({code: s})), [2, {
                                    code: s,
                                    msg: ut[s]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function Qo(e) {
    if (!B()) return {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]};
    var t = e.conversationType, n = e.targetId, o = e.channelId;
    return l("conversation", e, E.CONVERSATION, !0) ? Xe((function (e, r) {
        var s = r.createTraceId();
        r.info(be.A_GET_UNREAD_MENTIONED_MESSAGES_T, JSON.stringify({
            conversationType: t,
            targetId: n,
            channelId: o
        }), s);
        var a = e.getUnreadMentionedMessages(t, n, o), c = [];
        return a && a.length && a.forEach((function (e) {
            return c.push(De(e))
        })), r.info(be.A_GET_UNREAD_MENTIONED_MESSAGES_R, JSON.stringify({
            code: i.SUCCESS,
            count: c.length
        }), s), {code: i.SUCCESS, data: c}
    })) : {code: i.BIZ_ERROR_INVALID_PARAMETER}
}

function $o(e, t, n, o) {
    return x(this, void 0, void 0, (function () {
        var r = this;
        return Y(this, (function (s) {
            return we("RongIMLib.searchMessages", "RongIMLib.ElectronExtension.searchMessages"), B() ? l("conversation", e, E.CONVERSATION, !0) && l("keyword", t, E.STRING, !0) && l("timestamp", n, E.NUMBER) && l("count", o, E.NUMBER) ? [2, qe((function (s, a) {
                return x(r, void 0, void 0, (function () {
                    var r, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return 1, [4, s.searchMessageByContent(e.conversationType, e.targetId, t, n, o, 1, e.channelId)];
                            case 1:
                                return r = d.sent(), c = r.code, _ = r.data, c === i.SUCCESS ? (u = [], (null == _ ? void 0 : _.messages) && _.messages.length && _.messages.forEach((function (e) {
                                    return u.push(De(e))
                                })), [2, {
                                    code: c,
                                    data: {messages: u, count: null == _ ? void 0 : _.count}
                                }]) : (a.warn(A.O, "searchMessages ->code:".concat(c, ",targetId:").concat(e.targetId)), [2, {
                                    code: c,
                                    msg: ut[c]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function er(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o, r, s, a = this;
        return Y(this, (function (c) {
            return we("RongIMLib.deleteLocalMessagesByTimestamp", "RongIMLib.ElectronExtension.deleteMessagesByTimestamp"), B() ? (o = e.conversationType, r = e.targetId, s = e.channelId, l("conversationType", o, E.NUMBER, !0) && l("targetId", r, E.STRING, !0) && l("timestamp", t, E.NUMBER, !0) && l("cleanSpace", n, E.BOOLEAN) ? [2, qe((function (e, c) {
                return x(a, void 0, void 0, (function () {
                    var a, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return a = c.createTraceId(), c.info(be.A_DELETE_LOCAL_MESSAGES_BY_TIMESTAMP_T, JSON.stringify({
                                    conversationType: o,
                                    targetId: r,
                                    channelId: s,
                                    timestamp: t,
                                    cleanSpace: n
                                }), a), [4, e.deleteMessagesByTimestamp(o, r, t, n, s)];
                            case 1:
                                return _ = d.sent(), c.debug(A.A_DELETE_MESSAGES_S, JSON.stringify({
                                    code: _,
                                    conversationType: o,
                                    targetId: r,
                                    channelId: s,
                                    timestamp: t
                                })), u = _ === i.SUCCESS ? "info" : "warn", c[u](be.A_DELETE_LOCAL_MESSAGES_BY_TIMESTAMP_R, JSON.stringify({code: _}), a), _ === i.SUCCESS ? [2, {code: _}] : [2, {
                                    code: _,
                                    msg: ut[_]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]) : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function tr(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return we("RongIMLib.clearMessages", "RongIMLib.ElectronExtension.clearMessages"), B() ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return t = e.conversationType, r = e.targetId, s = e.channelId, a = o.createTraceId(), o.info(be.A_CLEAR_MESSAGES_T, JSON.stringify({
                                    conversationType: t,
                                    targetId: r,
                                    channelId: s
                                }), a), [4, n.clearMessages(t, r, s)];
                            case 1:
                                return c = u.sent(), _ = c === i.SUCCESS ? "info" : "warn", o[_](be.A_CLEAR_MESSAGES_R, JSON.stringify({code: c}), a), c === i.SUCCESS ? [2, {code: c}] : [2, {
                                    code: c,
                                    msg: ut[c]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function nr(e, t, n, o) {
    return x(this, void 0, void 0, (function () {
        var r = this;
        return Y(this, (function (s) {
            return we("RongIMLib.searchConversationByContent", "RongIMLib.ElectronExtension.searchConversationByContent"), B() ? l("keyword", e, E.STRING, !0) && l("conversationTypes", t, E.ARRAY) && !(null == t ? void 0 : t.some((function (e) {
                return !l("conversationType", e, I)
            }))) && l("customMessageType", n, E.ARRAY) && !(null == n ? void 0 : n.some((function (e) {
                return !l("customMessageType", e, E.STRING)
            }))) && l("channelId", o, E.STRING) ? [2, qe((function (s, a) {
                return x(r, void 0, void 0, (function () {
                    var r, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return r = a.createTraceId(), a.info(be.A_SEARCH_CONVERSATION_BY_CONTENT_T, JSON.stringify({
                                    keyword: e,
                                    conversationTypes: t,
                                    customMessageType: n,
                                    channelId: o
                                }), r), [4, s.searchConversationByContent(e, n, o, t)];
                            case 1:
                                return c = d.sent(), _ = c.code, u = c.data, _ === i.SUCCESS ? (a.info(be.A_SEARCH_CONVERSATION_BY_CONTENT_R, JSON.stringify({
                                    code: _,
                                    count: null == u ? void 0 : u.length
                                }), r), [2, {
                                    code: _,
                                    data: u
                                }]) : (a.warn(be.A_SEARCH_CONVERSATION_BY_CONTENT_R, JSON.stringify({code: _}), r), [2, {
                                    code: _,
                                    msg: ut[_]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function or(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return B() ? l("conversation", e, E.CONVERSATION, !0) && l("timestamp", t, E.NUMBER) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return n = e.conversationType, s = e.targetId, a = e.channelId, c = r.createTraceId(), r.info(be.A_CLEAR_UNREAD_COUNT_BY_TIMESTAMP_T, JSON.stringify({
                                    conversationType: n,
                                    targetId: s,
                                    channelId: a,
                                    timestamp: t
                                }), c), [4, o.clearUnreadCountByTimestamp(n, s, t, a)];
                            case 1:
                                return _ = d.sent(), u = _ === i.SUCCESS ? "info" : "warn", r[u](be.A_CLEAR_UNREAD_COUNT_BY_TIMESTAMP_R, JSON.stringify({code: _}), c), _ === i.SUCCESS ? [2, {code: _}] : [2, {
                                    code: _,
                                    msg: ut[_]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function rr(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return we("RongIMLib.setMessageReceivedStatus", "RongIMLib.ElectronExtension.setMessageReceivedStatus"), B() ? l("messageId", e, E.NUMBER, !0) && l("receivedStatus", t, E.NUMBER, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_SET_MESSAGE_RECEIVED_STATUS_T, JSON.stringify({
                                    messageId: e,
                                    receivedStatus: t
                                }), n), [4, o.setMessageReceivedStatus(e, t)];
                            case 1:
                                return s = c.sent(), a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_SET_MESSAGE_RECEIVED_STATUS_R, JSON.stringify({code: s}), n), s === i.SUCCESS ? [2, {code: s}] : [2, {
                                    code: s,
                                    msg: ut[s]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
        }))
    }))
}

function ir(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("tag", e, E.OBJECT, !0) && l("tag.tagId", e.tagId, E.STRING, !0) && l("tag.tagId", e.tagId, (function (e) {
                return e.length <= 10
            })) && l("tag.tagName", e.tagName, (function (e) {
                return e.length <= 15
            })) && l("tag.tagName", e.tagName, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_ADD_TAG_T, JSON.stringify({
                                    tagId: e.tagId,
                                    tagName: e.tagName
                                }), t), [4, n.createTag(e)];
                            case 1:
                                return r = a.sent().code, s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_SET_PROXY_R, JSON.stringify({code: r}), t), r === i.SUCCESS ? [2, {code: r}] : [2, {
                                    code: r,
                                    msg: ut[r]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function sr(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("tagId", e, E.STRING, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_REMOVE_TAG_T, JSON.stringify({tagId: e}), t), [4, n.removeTag(e)];
                            case 1:
                                return r = a.sent().code, s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_REMOVE_TAG_R, JSON.stringify({code: r}), t), r === i.SUCCESS ? [2, {code: r}] : [2, {
                                    code: r,
                                    msg: ut[r]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function ar(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("tag", e, E.OBJECT, !0) && l("tag.tagId", e.tagId, E.STRING, !0) && l("tag.tagName", e.tagName, E.STRING, !0) && l("tag.tagName", e.tagName, (function (e) {
                return e.length <= 15
            })) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_UPDATE_TAG_T, JSON.stringify({
                                    tagId: e.tagId,
                                    tagName: e.tagName
                                }), t), [4, n.updateTag(e)];
                            case 1:
                                return r = a.sent().code, s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_UPDATE_TAG_R, JSON.stringify({code: r}), t), r === i.SUCCESS ? [2, {code: r}] : [2, {
                                    code: r,
                                    msg: ut[r]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function cr() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_TAGS_T, "", e), [4, t.getTagList()];
                            case 1:
                                return o = c.sent(), r = o.code, s = o.data, a = r === i.SUCCESS ? "info" : "warn", n[a](be.A_GET_TAGS_R, JSON.stringify({code: r}), e), [2, {
                                    code: i.SUCCESS,
                                    data: s
                                }]
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function _r(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return l("conversation", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_GET_TAGS_FOR_CONVERSATION_T, JSON.stringify({
                                    conversationType: e.conversationType,
                                    targetId: e.targetId,
                                    channelId: e.channelId
                                }), t), [4, n.getTagsForConversation(e)];
                            case 1:
                                return r = _.sent(), s = r.code, a = r.data, c = s === i.SUCCESS ? "info" : "warn", o[c](be.A_GET_TAGS_FOR_CONVERSATION_R, JSON.stringify({code: s}), t), s === i.SUCCESS ? [2, {
                                    code: s,
                                    data: a
                                }] : [2, {code: s, msg: ut[s]}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function ur(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("tagId", e, E.STRING, !0) && l("conversations", t, E.ARRAY, !0) && l("conversations.length", t.length, (function (e) {
                return e > 0
            })) && !t.some((function (e) {
                return !l("conversation", e, E.CONVERSATION, !0)
            })) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_ADD_TAG_FOR_CONVERSATIONS_T, JSON.stringify({
                                    conversations: t.map((function (e) {
                                        return {conversationType: e.conversationType, targetId: e.targetId}
                                    })), tagId: e
                                }), n), [4, o.addTagForConversations(e, t)];
                            case 1:
                                return s = c.sent().code, a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_ADD_TAG_FOR_CONVERSATIONS_R, JSON.stringify({code: s}), n), s === i.SUCCESS ? [2, {code: s}] : [2, {
                                    code: s,
                                    msg: ut[s]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function dr(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("tagId", e, E.STRING, !0) && l("conversations", t, E.ARRAY, !0) && l("conversations.length", t.length, (function (e) {
                return e > 0
            })) && !t.some((function (e) {
                return !l("conversation", e, E.CONVERSATION, !0)
            })) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_REMOVE_CONVERSATIONS_FROM_TAG_T, JSON.stringify({
                                    conversations: t.map((function (e) {
                                        return {conversationType: e.conversationType, targetId: e.targetId}
                                    })), tagId: e
                                }), n), [4, o.removeTagForConversations(e, t)];
                            case 1:
                                return s = c.sent().code, a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_REMOVE_CONVERSATIONS_FROM_TAG_R, JSON.stringify({code: s}), n), s === i.SUCCESS ? [2, {code: s}] : [2, {
                                    code: s,
                                    msg: ut[s]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Er(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("conversation", e, E.CONVERSATION, !0) && l("tagIds", t, E.ARRAY, !0) && !t.some((function (e) {
                return !l("tagId", e, E.STRING, !0)
            })) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_REMOVE_TAGS_FROM_CONVERSATION_T, JSON.stringify({
                                    tagIds: t,
                                    targetId: e.targetId,
                                    conversationType: e.conversationType
                                }), n), [4, o.removeTagsForConversation(e, t)];
                            case 1:
                                return s = c.sent().code, a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_REMOVE_TAGS_FROM_CONVERSATION_R, JSON.stringify({code: s}), n), s === i.SUCCESS ? [2, {code: s}] : [2, {
                                    code: s,
                                    msg: ut[s]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Tr(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("tagId", e, E.STRING, !0) && l("conversations", t, E.ARRAY, !0) && l("conversations.length", t.length, (function (e) {
                return e > 0
            })) && !t.some((function (e) {
                return !l("conversation", e, E.CONVERSATION, !0)
            })) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a;
                    return Y(this, (function (c) {
                        switch (c.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_REMOVE_TAG_FROM_CONVERSATIONS_T, JSON.stringify({
                                    conversations: t.map((function (e) {
                                        return {conversationType: e.conversationType, targetId: e.targetId}
                                    })), tagId: e
                                }), n), [4, o.removeTagForConversations(e, t)];
                            case 1:
                                return s = c.sent().code, a = s === i.SUCCESS ? "info" : "warn", r[a](be.A_REMOVE_TAG_FROM_CONVERSATIONS_R, JSON.stringify({code: s}), n), s === i.SUCCESS ? [2, {code: s}] : [2, {
                                    code: s,
                                    msg: ut[s]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Sr(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return l("tagId", e, E.STRING, !0) && l("count", t, E.NUMBER, !0) && l("startTime", n, E.NUMBER, !0) ? [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, a, c, _, u;
                    return Y(this, (function (d) {
                        switch (d.label) {
                            case 0:
                                return o = s.createTraceId(), s.info(be.A_GET_CONVERSATIONS_FROM_TAG_BY_PAGE_T, JSON.stringify({
                                    tagId: e,
                                    count: t,
                                    startTime: n
                                }), o), [4, r.getConversationListByTag(e, n, t)];
                            case 1:
                                return a = d.sent(), c = a.code, _ = a.data, c === i.SUCCESS ? (u = null == _ ? void 0 : _.map((function (e) {
                                    return function (e) {
                                        return k(k({}, Be(e)), {isTopInTag: e.isTopInTag})
                                    }(e)
                                })), s.info(be.A_GET_CONVERSATIONS_FROM_TAG_BY_PAGE_R, JSON.stringify({
                                    code: c,
                                    length: null == u ? void 0 : u.length
                                }), o), [2, {
                                    code: c,
                                    data: u
                                }]) : (s.warn(be.A_GET_CONVERSATIONS_FROM_TAG_BY_PAGE_R, JSON.stringify({code: c}), o), [2, {
                                    code: c,
                                    msg: ut[c]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Rr(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return l("tagId", e, E.STRING, !0) && l("containMuted", t, E.BOOLEAN, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c, _;
                    return Y(this, (function (u) {
                        switch (u.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_GET_UNREAD_COUNT_BY_TAG_T, JSON.stringify({
                                    tagId: e,
                                    containMuted: t
                                }), n), [4, o.getUnreadCountByTag(e, t)];
                            case 1:
                                return s = u.sent(), a = s.code, c = s.data, _ = a === i.SUCCESS ? "info" : "warn", r[_](be.A_GET_UNREAD_COUNT_BY_TAG_T, JSON.stringify({
                                    code: a,
                                    data: c
                                }), n), [2, {code: a, data: c}]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Ar(e, t, n) {
    return x(this, void 0, void 0, (function () {
        var o = this;
        return Y(this, (function (r) {
            return l("tagId", e, E.STRING, !0) && l("conversation", t, E.CONVERSATION, !0) && l("status.isTop", n, E.BOOLEAN, !0) ? [2, qe((function (r, s) {
                return x(o, void 0, void 0, (function () {
                    var o, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return o = s.createTraceId(), s.info(be.A_GET_UNREAD_COUNT_BY_TAG_T, JSON.stringify({
                                    tagId: e,
                                    targetId: t.targetId,
                                    conversationType: t.conversationType,
                                    isTop: n
                                }), o), [4, r.setConversationStatusInTag(e, t, {isTop: n})];
                            case 1:
                                return a = _.sent().code, c = a === i.SUCCESS ? "info" : "warn", s[c](be.A_SET_CONVERSATION_STATUS_IN_TAG_R, JSON.stringify({code: a}), o), a === i.SUCCESS ? [2, {code: a}] : [2, {
                                    code: a,
                                    msg: ut[a]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

var fr = {COMET: "comet", WEBSOCKET: "websocket"}, lr = {
    TEXT: "RC:TxtMsg",
    VOICE: "RC:VcMsg",
    HQ_VOICE: "RC:HQVCMsg",
    IMAGE: "RC:ImgMsg",
    GIF: "RC:GIFMsg",
    RICH_CONTENT: "RC:ImgTextMsg",
    LOCATION: "RC:LBSMsg",
    FILE: "RC:FileMsg",
    SIGHT: "RC:SightMsg",
    COMBINE: "RC:CombineMsg",
    COMBINE_V2: "RC:CombineV2Msg",
    CHRM_KV_NOTIFY: "RC:chrmKVNotiMsg",
    LOG_COMMAND: "RC:LogCmdMsg",
    EXPANSION_NOTIFY: "RC:MsgExMsg",
    REFERENCE: "RC:ReferenceMsg",
    RECALL_MESSAGE_TYPE: "RC:RcCmd"
};
var Ir = function (e, t) {
    if (!l("options", e, E.ARRAY, !0) || !l("options", e, (function (n) {
        return !(e.length > 20 || 0 === e.length) || (t.error(be.A_BATCH_CLEAR_MSG_R, "conversations length should not be greater than 20 and not be equal to 0"), !1)
    }), !0)) return i.BIZ_ERROR_INVALID_PARAMETER;
    for (var n = 0, o = e; n < o.length; n++) {
        var r = o[n];
        if (!(l("options", r, E.OBJECT, !0) && l("options.targetId", r.targetId, E.STRING, !0) && l("options.conversationType", r.conversationType, (function (e) {
            var n = [a.PRIVATE, a.GROUP, a.CHATROOM, a.SYSTEM].includes(e);
            return n || t.error(be.A_BATCH_CLEAR_MSG_R, "conversations.conversationType is invalid, It should be one of the following values:\n        ConversationType.PRIVATE,\n        ConversationType.GROUP,\n        ConversationType.CHATROOM,\n        ConversationType.SYSTEM,\n      "), n
        }), !0) && l("options.timestamp", r.timestamp, E.NUMBER, !0) && l("options.channelId", r.channelId, E.ONLY_STRING))) return i.BIZ_ERROR_INVALID_PARAMETER
    }
};
var gr = Object.freeze({
    __proto__: null, getAllConversationList: function (e) {
        return x(this, void 0, void 0, (function () {
            var t = this;
            return Y(this, (function (n) {
                return B() ? l("channelId", e, E.CHANNEL_ID) ? [2, qe((function (n, o) {
                    return x(t, void 0, void 0, (function () {
                        var t, r, s, a, c;
                        return Y(this, (function (_) {
                            switch (_.label) {
                                case 0:
                                    return t = o.createTraceId(), o.info(be.A_E_GET_ALL_CONVERSATION_LIST_T, JSON.stringify({channelId: e}), t), b(e) ? [4, n.getConversationListWithAllChannel()] : [3, 2];
                                case 1:
                                    return r = _.sent(), [3, 4];
                                case 2:
                                    return [4, n.getConversationList(void 0, void 0, void 0, void 0, e)];
                                case 3:
                                    r = _.sent(), _.label = 4;
                                case 4:
                                    return s = r.code, a = r.data, o.info(be.A_E_GET_ALL_CONVERSATION_LIST_R, JSON.stringify({
                                        code: s,
                                        length: null == a ? void 0 : a.length
                                    }), t), s === i.SUCCESS && a ? (c = a.map((function (e) {
                                        return Be(e)
                                    })), [2, {
                                        code: s,
                                        data: c
                                    }]) : (o.warn(be.A_E_GET_ALL_CONVERSATION_LIST_R, JSON.stringify({code: s}), t), [2, {
                                        code: s,
                                        msg: ut[s]
                                    }])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, getConversationList: function (e, t, n, o) {
        return x(this, void 0, void 0, (function () {
            var r = this;
            return Y(this, (function (s) {
                return B() ? l("startTime", e, E.NUMBER, !0) && l("count", t, E.NUMBER, !0) && l("channelId", n, E.CHANNEL_ID) && l("topPriority", o, E.BOOLEAN) ? [2, qe((function (s, a) {
                    return x(r, void 0, void 0, (function () {
                        var r, c, _, u, d, E;
                        return Y(this, (function (T) {
                            switch (T.label) {
                                case 0:
                                    return r = a.createTraceId(), a.info(be.A_E_GET_CONVERSATION_LIST_T, JSON.stringify({
                                        startTime: e,
                                        count: t,
                                        channelId: n
                                    }), r), b(n) ? [4, s.getConversationListWithAllChannelByPage(e, t)] : [3, 2];
                                case 1:
                                    return c = T.sent(), [3, 4];
                                case 2:
                                    return _ = [1, 2, 3, 5, 6, 7, 8], [4, s.getConversationsByPage(_, e, t, n, o)];
                                case 3:
                                    c = T.sent(), T.label = 4;
                                case 4:
                                    return u = c.code, d = c.data, u === i.SUCCESS && d ? (E = d.map((function (e) {
                                        return Be(e)
                                    })), a.info(be.A_E_GET_CONVERSATION_LIST_R, JSON.stringify({
                                        code: u,
                                        length: E.length
                                    }), r), [2, {
                                        code: u,
                                        data: E
                                    }]) : (a.warn(be.A_E_GET_CONVERSATION_LIST_R, JSON.stringify({code: u}), r), [2, {
                                        code: u,
                                        msg: ut[u]
                                    }])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, searchConversationByContent: function (e, t, n) {
        return x(this, void 0, void 0, (function () {
            var o = this;
            return Y(this, (function (r) {
                return B() ? l("keyword", e, E.STRING, !0) && l("messageTypes", t, E.ARRAY, !0) && l("channelId", n, E.CHANNEL_ID) && !t.some((function (e) {
                    return !l("messageType", e, E.STRING, !0)
                })) ? [2, qe((function (r, s) {
                    return x(o, void 0, void 0, (function () {
                        var o, a, c, _, u;
                        return Y(this, (function (d) {
                            switch (d.label) {
                                case 0:
                                    return o = s.createTraceId(), s.info(be.A_E_SEARCH_CONVERSATION_BY_CONTENT_T, JSON.stringify({
                                        keyword: e,
                                        messageTypes: t,
                                        channelId: n
                                    }), o), b(n) ? [4, r.searchConversationByContentWithAllChannel(e, t)] : [3, 2];
                                case 1:
                                    return a = d.sent(), [3, 4];
                                case 2:
                                    return [4, r.searchConversationByContent(e, t, n)];
                                case 3:
                                    a = d.sent(), d.label = 4;
                                case 4:
                                    return c = a.code, _ = a.data, c === i.SUCCESS && _ ? (u = _.map((function (e) {
                                        return Be(e)
                                    })), s.info(be.A_E_SEARCH_CONVERSATION_BY_CONTENT_R, JSON.stringify({
                                        code: c,
                                        length: u.length
                                    }), o), [2, {
                                        code: c,
                                        data: u
                                    }]) : (s.warn(be.A_E_SEARCH_CONVERSATION_BY_CONTENT_R, JSON.stringify({code: c}), o), [2, {
                                        code: c,
                                        msg: ut[c]
                                    }])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, searchMessages: function (e, t, n, o) {
        return x(this, void 0, void 0, (function () {
            var r = this;
            return Y(this, (function (s) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) && l("keyword", t, E.STRING, !0) && l("startTime", n, E.NUMBER, !0) && l("count", o, E.NUMBER, !0) ? [2, qe((function (s, a) {
                    return x(r, void 0, void 0, (function () {
                        var r, c, _, u, d, E, T, S, R, A, f;
                        return Y(this, (function (l) {
                            switch (l.label) {
                                case 0:
                                    return r = e.targetId, c = e.conversationType, _ = e.channelId, u = a.createTraceId(), a.info(be.A_E_SEARCH_MESSAGES_T, JSON.stringify({
                                        targetId: r,
                                        conversationType: c,
                                        channelId: _,
                                        keyword: t,
                                        startTime: n,
                                        count: o
                                    }), u), b(_) ? [4, s.searchMessageByContentWithAllChannel(c, r, t, n, o)] : [3, 2];
                                case 1:
                                    return d = l.sent(), [3, 4];
                                case 2:
                                    return 0, [4, s.searchMessageByContent(c, r, t, n, o, 0, _)];
                                case 3:
                                    d = l.sent(), l.label = 4;
                                case 4:
                                    return E = d.code, T = d.data, E === i.SUCCESS && T ? (S = T.messages, R = T.count, A = [], f = S.map((function (e) {
                                        return A.push(e.messageUId), De(e)
                                    })), a.info(be.A_E_SEARCH_MESSAGES_R, JSON.stringify({
                                        code: E,
                                        list: A
                                    }), u), [2, {
                                        code: E,
                                        data: {messages: f, count: R}
                                    }]) : (a.warn(be.A_E_SEARCH_MESSAGES_R, JSON.stringify({code: E}), u), [2, {
                                        code: E,
                                        msg: ut[E]
                                    }])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, searchMessageInTimeRange: function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) && l("option", t, E.OBJECT, !0) && l("option.keyword", t.keyword, E.STRING, !0) && l("option.startTime", t.startTime, E.NUMBER, !0) && l("option.endTime", t.endTime, E.NUMBER, !0) && l("option.offset", t.offset, E.NUMBER) && l("option.limit", t.limit, E.NUMBER) ? [2, qe((function (o, r) {
                    return x(n, void 0, void 0, (function () {
                        var n, s, a, c, _, u, d, E, T, S, R;
                        return Y(this, (function (A) {
                            switch (A.label) {
                                case 0:
                                    return n = e.conversationType, s = e.targetId, a = t.keyword, c = t.startTime, _ = t.endTime, u = t.offset, d = t.limit, u = u || 0, d = d || 5, E = r.createTraceId(), r.info(be.A_E_SEARCH_MESSAGE_IN_TIME_RANGE_T, JSON.stringify({
                                        targetId: s,
                                        conversationType: n,
                                        keyword: a,
                                        startTime: c,
                                        endTime: _,
                                        offset: u,
                                        limit: d
                                    }), E), [4, o.searchMessageByContentInTimeRangeWithAllChannel(n, s, a, c, _, u, d)];
                                case 1:
                                    return T = A.sent(), S = T.code, R = T.data, S === i.SUCCESS && R ? [2, {
                                        code: S,
                                        data: {
                                            messages: R.messages.map((function (e) {
                                                return De(e)
                                            }))
                                        }
                                    }] : (r.warn(be.A_E_SEARCH_MESSAGE_IN_TIME_RANGE_R, JSON.stringify({code: S}), E), [2, {code: S}])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, searchMessagesByUser: function (e, t, n, o) {
        return x(this, void 0, void 0, (function () {
            var r = this;
            return Y(this, (function (s) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) && l("userId", t, E.STRING, !0) && l("startTime", n, E.NUMBER, !0) && l("count", o, E.NUMBER, !0) ? [2, qe((function (s, a) {
                    return x(r, void 0, void 0, (function () {
                        var r, c, _, u, d, E, T;
                        return Y(this, (function (S) {
                            switch (S.label) {
                                case 0:
                                    return r = e.conversationType, c = e.targetId, _ = e.channelId, u = a.createTraceId(), a.info(be.A_E_SEARCH_MESSAGES_BY_USER_T, JSON.stringify({
                                        targetId: c,
                                        conversationType: r,
                                        channelId: _,
                                        startTime: n,
                                        userId: t,
                                        count: o
                                    }), u), [4, s.searchMessagesByUser(r, c, t, n, o, _)];
                                case 1:
                                    return d = S.sent(), E = d.code, T = d.data, E === i.SUCCESS && T ? [2, {
                                        code: E,
                                        data: {
                                            messages: T.messages.map((function (e) {
                                                return De(e)
                                            }))
                                        }
                                    }] : (a.warn(be.A_E_SEARCH_MESSAGES_BY_USER_T, JSON.stringify({code: E})), [2, {code: E}])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, getHistoryMessagesByMessageTypes: function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) && l("option", t, E.OBJECT, !0) && l("option.count", t.count, E.NUMBER) && l("options.count", t.count, (function (e) {
                    var t = e > 0 && e <= 100;
                    return t || null === console || void 0 === console || console.error("option.count is invalid, It should be greater than 0 and less than 100"), t
                })) && l("option.timestamp", t.timestamp, E.NUMBER) && l("option.order", t.order, (function (e) {
                    return [0, 1].includes(e)
                })) && l("option.messageTypes", t.messageTypes, E.ARRAY, !0) && !t.messageTypes.some((function (e) {
                    return !l("option.messageType", e, E.STRING, !0)
                })) ? [2, qe((function (o, r) {
                    return x(n, void 0, void 0, (function () {
                        var n, s, a, c, _, u, d, E, T, S, R, A, f, l, I, g, O, N, v;
                        return Y(this, (function (h) {
                            switch (h.label) {
                                case 0:
                                    return n = t.count, s = void 0 === n ? 20 : n, a = t.timestamp, c = void 0 === a ? 0 : a, _ = t.order, u = void 0 === _ ? 0 : _, d = t.messageTypes, E = e.conversationType, T = e.targetId, S = e.channelId, R = void 0 === S ? "" : S, A = r.createTraceId(), r.info(be.A_E_GET_HISTORY_MESSAGES_BY_MESSAGE_TYPES_T, JSON.stringify({
                                        targetId: T,
                                        conversationType: E,
                                        channelId: R,
                                        count: s,
                                        timestamp: c,
                                        messageTypes: d
                                    }), A), [4, o.getHistoryMessagesByObjectNames(E, T, c, s, d, u, R)];
                                case 1:
                                    return f = h.sent(), l = f.code, I = f.data, l === i.SUCCESS ? (O = (g = I).list, N = g.hasMore, v = O.map((function (e) {
                                        return De(e)
                                    })), [2, {
                                        code: l,
                                        data: {messages: v, hasMore: N, list: v}
                                    }]) : (r.warn(be.A_E_GET_HISTORY_MESSAGES_BY_MESSAGE_TYPES_R, JSON.stringify({code: l})), [2, {
                                        code: l,
                                        msg: ut[l]
                                    }])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, setMessageStatusToRead: function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) && l("timestamp", t, E.NUMBER, !0) ? [2, qe((function (o, r) {
                    return x(n, void 0, void 0, (function () {
                        var n, i, s, a, c;
                        return Y(this, (function (_) {
                            switch (_.label) {
                                case 0:
                                    return n = e.conversationType, i = e.targetId, s = e.channelId, a = r.createTraceId(), r.info(be.A_E_SET_MESSAGE_STATUS_TO_READ_T, JSON.stringify({
                                        targetId: i,
                                        conversationType: n,
                                        channelId: s,
                                        timestamp: t
                                    }), a), [4, o.setMessageStatusToRead(n, i, t, s)];
                                case 1:
                                    return c = _.sent(), r.info(be.A_E_SET_MESSAGE_STATUS_TO_READ_R, JSON.stringify(c), a), [2, c]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, setMessageReceivedStatus: function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return console.warn("`setMessageSentStatus` has being deprecated, use `setMessageReceivedStatusInfo` instead."), B() ? l("messageId", e, E.NUMBER, !0) && l("receivedStatus", t, (function (e) {
                    return !b(s[e])
                }), !0) ? [2, qe((function (o, r) {
                    return x(n, void 0, void 0, (function () {
                        var n, i;
                        return Y(this, (function (s) {
                            switch (s.label) {
                                case 0:
                                    return n = r.createTraceId(), r.info(be.A_E_SET_MESSAGE_RECEIVED_STATUS_T, JSON.stringify({
                                        messageId: e,
                                        receivedStatus: t
                                    }), n), [4, o.setMessageReceivedStatus(e, t)];
                                case 1:
                                    return i = s.sent(), r.info(be.A_E_SET_MESSAGE_RECEIVED_STATUS_R, JSON.stringify({code: i}), n), [2, {code: i}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, setMessageReceivedStatusInfo: function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return B() ? l("messageId", e, E.NUMBER, !0) && l("receivedStatusInfo", t, E.OBJECT, !0) && l("receivedStatusInfo.isRead", t.isRead, E.BOOLEAN) && l("receivedStatusInfo.isListened", t.isListened, E.BOOLEAN) && l("receivedStatusInfo.isDownload", t.isDownload, E.BOOLEAN) && l("receivedStatusInfo.isRetrieved", t.isRetrieved, E.BOOLEAN) ? [2, qe((function (o, r) {
                    return x(n, void 0, void 0, (function () {
                        var n, i, s;
                        return Y(this, (function (a) {
                            switch (a.label) {
                                case 0:
                                    return n = J(t), i = r.createTraceId(), r.info(be.A_E_SET_MESSAGE_SENT_STATUS_INFO_T, JSON.stringify({
                                        messageId: e,
                                        sentStatus: n
                                    }), i), [4, o.setMessageReceivedStatus(e, n)];
                                case 1:
                                    return s = a.sent(), r.info(be.A_E_SET_MESSAGE_SENT_STATUS_INFO_R, JSON.stringify({code: s}), i), [2, {code: s}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, setMessageSentStatus: function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return B() ? l("messageId", e, E.NUMBER, !0) && l("sentStatus", t, (function (e) {
                    return !b(V[e])
                }), !0) ? [2, qe((function (o, r) {
                    return x(n, void 0, void 0, (function () {
                        var n, i;
                        return Y(this, (function (s) {
                            switch (s.label) {
                                case 0:
                                    return n = r.createTraceId(), r.info(be.A_E_SET_MESSAGE_SENT_STATUS_T, JSON.stringify({
                                        messageId: e,
                                        sentStatus: t
                                    }), n), [4, o.setMessageSentStatus(e, t)];
                                case 1:
                                    return i = s.sent(), r.info(be.A_E_SET_MESSAGE_SENT_STATUS_R, JSON.stringify({code: i}), n), [2, {code: i}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, setMessageContent: function (e, t, n) {
        return void 0 === n && (n = ""), x(this, void 0, void 0, (function () {
            var o = this;
            return Y(this, (function (r) {
                return B() ? l("messageId", e, E.NUMBER, !0) && l("content", t, E.OBJECT, !0) && l("messageType", n, E.ONLY_STRING, !0) ? [2, qe((function (r, i) {
                    return x(o, void 0, void 0, (function () {
                        var o, s;
                        return Y(this, (function (a) {
                            switch (a.label) {
                                case 0:
                                    return o = i.createTraceId(), i.info(be.A_E_SET_MESSAGE_CONTENT_T, JSON.stringify({
                                        messageId: e,
                                        messageType: n
                                    }), o), [4, r.setMessageContent(e, t, n)];
                                case 1:
                                    return s = a.sent(), i.info(be.A_E_SET_MESSAGE_CONTENT_R, JSON.stringify({code: s}), o), [2, {code: s}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, deleteMessages: function (e) {
        return x(this, void 0, void 0, (function () {
            var t = this;
            return Y(this, (function (n) {
                return B() ? !l("messageIds", e, E.ARRAY, !0) || e.some((function (e) {
                    return !l("messageId", e, E.NUMBER, !0)
                })) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, qe((function (n, o) {
                    return x(t, void 0, void 0, (function () {
                        var t, r;
                        return Y(this, (function (i) {
                            switch (i.label) {
                                case 0:
                                    return t = o.createTraceId(), o.info(be.A_E_DELETE_MESSAGES_T, JSON.stringify({messageIds: e}), t), [4, n.deleteMessages(e)];
                                case 1:
                                    return r = i.sent(), o.info(be.A_E_DELETE_MESSAGES_R, JSON.stringify({code: r}), t), [2, {code: r}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, clearMessages: function (e) {
        return x(this, void 0, void 0, (function () {
            var t = this;
            return Y(this, (function (n) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                    return x(t, void 0, void 0, (function () {
                        var t, r, i, s, a;
                        return Y(this, (function (c) {
                            switch (c.label) {
                                case 0:
                                    return t = e.conversationType, r = e.targetId, i = e.channelId, s = o.createTraceId(), o.info(be.A_E_CLEAR_MESSAGES_T, JSON.stringify({
                                        conversationType: t,
                                        targetId: r,
                                        channelId: i
                                    }), s), [4, n.clearMessages(t, r, i)];
                                case 1:
                                    return a = c.sent(), o.info(be.A_E_CLEAR_MESSAGES_R, JSON.stringify({code: a}), s), [2, {code: a}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, deleteMessagesByTimestamp: function (e, t, n) {
        return x(this, void 0, void 0, (function () {
            var o, r, s, a = this;
            return Y(this, (function (c) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) && l("timestamp", t, E.NUMBER, !0) && l("cleanSpace", n, E.BOOLEAN) ? (o = e.conversationType, r = e.targetId, s = e.channelId, [2, qe((function (e, c) {
                    return x(a, void 0, void 0, (function () {
                        var a, _, u;
                        return Y(this, (function (d) {
                            switch (d.label) {
                                case 0:
                                    return a = c.createTraceId(), c.info(be.A_E_DELETE_MESSAGES_BY_TIMESTAMP_T, JSON.stringify({
                                        conversationType: o,
                                        targetId: r,
                                        channelId: s,
                                        timestamp: t,
                                        cleanSpace: n
                                    }), a), [4, e.deleteMessagesByTimestamp(o, r, t, n, s)];
                                case 1:
                                    return _ = d.sent(), u = _ === i.SUCCESS ? "info" : "warn", c[u](be.A_E_DELETE_MESSAGES_BY_TIMESTAMP_R, JSON.stringify({code: _}), a), [2, {code: _}]
                            }
                        }))
                    }))
                }))]) : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, batchClearMessagesByTimestamp: function (e) {
        return x(this, void 0, void 0, (function () {
            var t = this;
            return Y(this, (function (n) {
                return B() ? [2, qe((function (n, o) {
                    return x(t, void 0, void 0, (function () {
                        var t, r, s;
                        return Y(this, (function (a) {
                            switch (a.label) {
                                case 0:
                                    return Ir(e, o) ? [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : (t = e.map((function (e) {
                                        return {
                                            conversationType: e.conversationType,
                                            targetId: e.targetId,
                                            timestamp: e.timestamp,
                                            channelId: e.channelId || ""
                                        }
                                    })), r = o.createTraceId(), o.info(be.A_BATCH_CLEAR_MSG_T, "options: ".concat(JSON.stringify(t)), r), [4, n.batchClearMessagesByTimestamp(t)]);
                                case 1:
                                    return s = a.sent(), o[i.SUCCESS === s ? "info" : "warn"](be.A_BATCH_CLEAR_MSG_R, "code: ".concat(s), r), [2, {code: s}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, insertMessage: function (e, t, n) {
        return void 0 === n && (n = {}), x(this, void 0, void 0, (function () {
            var o = this;
            return Y(this, (function (r) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) && l("message", t, E.OBJECT, !0) && l("options", n, E.OBJECT) && l("options.isUnread", null == n ? void 0 : n.isUnread, E.BOOLEAN) && l("options.searchContent", null == n ? void 0 : n.searchContent, E.STRING) && (t instanceof Un || l("message.senderUserId", t.senderUserId, E.STRING, !0) && l("message.messageType", t.messageType, E.STRING, !0) && l("message.content", t.content, E.OBJECT, !0) && l("message.messageDirection", t.messageDirection, E.NUMBER, !0) && l("message.canIncludeExpansion", t.canIncludeExpansion, E.BOOLEAN) && l("message.expansion", t.expansion, E.OBJECT) && l("message.disableNotification", t.disableNotification, E.BOOLEAN) && l("message.sentTime", t.sentTime, E.NUMBER) && l("message.sentStatus", t.sentStatus, E.NUMBER) && l("message.receivedStatus", t.receivedStatus, E.NUMBER) && l("message.receivedStatusInfo", t.receivedStatusInfo, E.OBJECT)) ? [2, qe((function (r, a) {
                    return x(o, void 0, void 0, (function () {
                        var o, c, _, u, d, E, T, S, R, A, f, l, I, g, O, N, v, h, m;
                        return Y(this, (function (C) {
                            switch (C.label) {
                                case 0:
                                    return o = "", c = 1, E = !1, S = s.UNREAD, A = t.messageType, f = t.content, t instanceof Un || (o = t.senderUserId, c = t.messageDirection, E = t.canIncludeExpansion, T = t.expansion, d = t.disableNotification, _ = t.sentTime, u = t.sentStatus, S = t.receivedStatus, R = t.receivedStatusInfo), l = a.createTraceId(), a.info(be.A_E_INSERT_MESSAGE_T, JSON.stringify({
                                        conversationType: e.conversationType,
                                        targetId: e.targetId,
                                        messageType: A,
                                        sentTime: _
                                    }), l), I = n.isUnread, g = n.searchContent, O = S, R && (O = J(R)), N = {
                                        senderUserId: o,
                                        messageType: A,
                                        content: f,
                                        messageDirection: c,
                                        sentTime: _,
                                        sentStatus: u,
                                        searchContent: g,
                                        isUnread: I,
                                        messageUId: "",
                                        disableNotification: d,
                                        canIncludeExpansion: E,
                                        expansionMsg: JSON.stringify(T),
                                        channelId: e.channelId || "",
                                        readStatus: O
                                    }, [4, r.insertMessage(e.conversationType, e.targetId, N)];
                                case 1:
                                    return v = C.sent(), h = v.code, m = v.data, h === i.SUCCESS ? (a.info(be.A_E_INSERT_MESSAGE_R, JSON.stringify({
                                        code: h,
                                        messageId: null == m ? void 0 : m.messageId
                                    }), l), [2, {
                                        code: h,
                                        data: De(m)
                                    }]) : (a.warn(be.A_E_INSERT_MESSAGE_R, JSON.stringify({code: h}), l), [2, {
                                        code: h,
                                        msg: ut[h]
                                    }])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, batchInsertMessage: function (e, t) {
        var n, o, r, s;
        return x(this, void 0, void 0, (function () {
            var c, _ = this;
            return Y(this, (function (u) {
                if (!B()) return [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}];
                if (!l("messages", e, (function (e) {
                    return T(e) && !(e.length <= 0 || e.length >= 500)
                }), !0) || !l("checkDuplicate", t, E.BOOLEAN)) return [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}];
                for (c in e) if (!(l("message", e[c], E.OBJECT, !0) && l("message.conversationType", e[c].conversationType, (function (e) {
                    return [a.PRIVATE, a.DISCUSSION, a.GROUP, a.CUSTOMER_SERVICE, a.SYSTEM, a.APP_PUBLIC_SERVICE, a.PUBLIC_SERVICE].includes(e)
                }), !0) && l("message.targetId", e[c].targetId, E.STRING, !0) && l("message.senderUserId", e[c].senderUserId, E.STRING, !0) && l("message.messageType", e[c].messageType, E.STRING, !0) && l("message.content", e[c].content, E.OBJECT, !0) && l("message.messageDirection", e[c].messageDirection, E.NUMBER, !0) && l("message.canIncludeExpansion", e[c].canIncludeExpansion, E.BOOLEAN) && l("message.expansion", e[c].expansion, E.OBJECT) && l("message.disableNotification", e[c].disableNotification, E.BOOLEAN) && l("message.sentTime", e[c].sentTime, E.NUMBER) && l("message.sentStatus", e[c].sentStatus, E.NUMBER) && l("options.isUnread", null === (n = e[c]) || void 0 === n ? void 0 : n.isUnread, E.BOOLEAN) && l("options.searchContent", null === (o = e[c]) || void 0 === o ? void 0 : o.searchContent, E.STRING) && l("options.receivedStatus", null === (r = e[c]) || void 0 === r ? void 0 : r.receivedStatus, E.NUMBER) && l("options.receivedStatusInfo", null === (s = e[c]) || void 0 === s ? void 0 : s.receivedStatusInfo, E.OBJECT))) return [2, {
                    code: i.BIZ_ERROR_INVALID_PARAMETER,
                    msg: String(c)
                }];
                return [2, qe((function (n, o) {
                    return x(_, void 0, void 0, (function () {
                        var r, s, a, c;
                        return Y(this, (function (_) {
                            switch (_.label) {
                                case 0:
                                    return r = o.createTraceId(), o.info(be.A_E_BATCH_INSERT_MESSAGE_T, JSON.stringify({
                                        checkDuplicate: t,
                                        length: e.length
                                    }), r), [4, n.batchInsertMessage(e, t)];
                                case 1:
                                    return s = _.sent(), a = s.code, c = s.data, a === i.SUCCESS ? (o.info(be.A_E_BATCH_INSERT_MESSAGE_R, JSON.stringify({
                                        code: a,
                                        data: c
                                    }), r), [2, {
                                        code: a,
                                        data: c
                                    }]) : (o.warn(be.A_E_BATCH_INSERT_MESSAGE_R, JSON.stringify({code: a}), r), [2, {
                                        code: a,
                                        msg: ut[a]
                                    }])
                            }
                        }))
                    }))
                }))]
            }))
        }))
    }, getMessageCount: function (e) {
        return x(this, void 0, void 0, (function () {
            var t = this;
            return Y(this, (function (n) {
                return B() ? l("conversation", e, E.CONVERSATION, !0) ? [2, qe((function (n, o) {
                    return x(t, void 0, void 0, (function () {
                        var t, r, i, s, a, c, _;
                        return Y(this, (function (u) {
                            switch (u.label) {
                                case 0:
                                    return t = e.conversationType, r = e.targetId, i = e.channelId, s = o.createTraceId(), o.info(be.A_E_GET_MESSAGE_COUNT_T, JSON.stringify({
                                        conversationType: t,
                                        targetId: r,
                                        channelId: i
                                    }), s), [4, n.getMessageCount(t, r, i)];
                                case 1:
                                    return a = u.sent(), c = a.code, _ = a.data, o.info(be.A_E_GET_MESSAGE_COUNT_R, JSON.stringify({
                                        code: c,
                                        data: _
                                    }), s), [2, {code: c, data: _}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, getPrivateMessageDeliverTime: function (e) {
        return x(this, void 0, void 0, (function () {
            var t = this;
            return Y(this, (function (n) {
                return B() ? l("messageUId", e, E.STRING, !0) ? [2, qe((function (n, o) {
                    return x(t, void 0, void 0, (function () {
                        var t, r, s, a;
                        return Y(this, (function (c) {
                            switch (c.label) {
                                case 0:
                                    return t = o.createTraceId(), o.info(be.A_E_GET_PRIVATE_MESSAGE_DELIVER_TIME_T, JSON.stringify({messageUId: e}), t), [4, n.getPrivateMessageDeliverTime(e)];
                                case 1:
                                    return r = c.sent(), s = r.code, a = r.data, s === i.SUCCESS ? (o.info(be.A_E_GET_PRIVATE_MESSAGE_DELIVER_TIME_R, JSON.stringify({
                                        code: s,
                                        data: a
                                    }), t), [2, {
                                        code: s,
                                        data: a
                                    }]) : (o.warn(be.A_E_GET_PRIVATE_MESSAGE_DELIVER_TIME_R, JSON.stringify({code: s}), t), [2, {
                                        code: s,
                                        msg: ut[s]
                                    }])
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, getGroupMessageDeliverList: function (e, t) {
        return x(this, void 0, void 0, (function () {
            var n = this;
            return Y(this, (function (o) {
                return B() ? l("targetId", e, E.STRING, !0) && l("messageUId", t, E.STRING, !0) ? [2, qe((function (o, r) {
                    return x(n, void 0, void 0, (function () {
                        var n, s, a, c, _;
                        return Y(this, (function (u) {
                            switch (u.label) {
                                case 0:
                                    return n = r.createTraceId(), r.info(be.A_E_GET_GROUP_MESSAGE_DELIVER_LIST_T, JSON.stringify({
                                        targetId: e,
                                        messageUId: t
                                    }), n), [4, o.getGroupMessageDeliverList(e, t)];
                                case 1:
                                    return s = u.sent(), a = s.code, c = s.data, _ = a === i.SUCCESS ? "info" : "warn", r[_](be.A_E_GET_GROUP_MESSAGE_DELIVER_LIST_R, JSON.stringify({code: a}), n), a === i.SUCCESS ? [2, {
                                        code: a,
                                        data: c
                                    }] : [2, {code: a, msg: ut[a]}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, setCheckDuplicateMessage: function (e) {
        return x(this, void 0, void 0, (function () {
            var t = this;
            return Y(this, (function (n) {
                return B() ? l("enableCheck", e, E.BOOLEAN) ? [2, qe((function (n, o) {
                    return x(t, void 0, void 0, (function () {
                        var t, r, i, s;
                        return Y(this, (function (a) {
                            switch (a.label) {
                                case 0:
                                    return t = o.createTraceId(), o.info(be.A_E_SET_CHECK_DUPLICATE_MESSAGE_T, JSON.stringify({enableCheck: e}), t), [4, n.setCheckDuplicateMessage(!!e)];
                                case 1:
                                    return r = a.sent(), i = r.code, s = r.data, o.info(be.A_E_SET_CHECK_DUPLICATE_MESSAGE_R, JSON.stringify({
                                        code: i,
                                        data: s
                                    }), t), [2, {code: i}]
                            }
                        }))
                    }))
                }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, clearLocalData: function () {
        return x(this, void 0, void 0, (function () {
            var e = this;
            return Y(this, (function (t) {
                return B() ? [2, qe((function (t, n) {
                    return x(e, void 0, void 0, (function () {
                        var e, o, r, s, a;
                        return Y(this, (function (c) {
                            switch (c.label) {
                                case 0:
                                    return e = n.createTraceId(), n.info(be.A_E_SET_CHECK_DUPLICATE_MESSAGE_T, "clearLocalData ->", e), [4, t.clearData()];
                                case 1:
                                    return o = c.sent(), r = o.code, s = o.data, a = r === i.SUCCESS ? "info" : "warn", n[a](be.A_E_SET_CHECK_DUPLICATE_MESSAGE_R, JSON.stringify({code: r}), e), [2, {
                                        code: r,
                                        data: s
                                    }]
                            }
                        }))
                    }))
                }))] : [2, {code: i.NOT_SUPPORT, msg: ut[i.NOT_SUPPORT]}]
            }))
        }))
    }, enable: function () {
        return B()
    }
});

function Or(e) {
    return x(this, void 0, void 0, (function () {
        var t = this;
        return Y(this, (function (n) {
            return !e || l("proxy.socksHost", e.socksHost, E.STRING, !0) && l("proxy.socksPort", e.socksPort, E.NUMBER, !0) ? [2, qe((function (n, o) {
                return x(t, void 0, void 0, (function () {
                    var t, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return t = o.createTraceId(), o.info(be.A_SET_PROXY_T, JSON.stringify({
                                    socksHost: null == e ? void 0 : e.socksHost,
                                    socksPort: null == e ? void 0 : e.socksPort
                                }), t), [4, n.setProxy(e)];
                            case 1:
                                return r = a.sent().code, s = r === i.SUCCESS ? "info" : "warn", o[s](be.A_SET_PROXY_R, JSON.stringify({code: r}), t), r === i.SUCCESS ? [2, {code: r}] : [2, {
                                    code: r,
                                    msg: ut[r]
                                }]
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

function Nr() {
    return x(this, void 0, void 0, (function () {
        var e = this;
        return Y(this, (function (t) {
            return [2, qe((function (t, n) {
                return x(e, void 0, void 0, (function () {
                    var e, o, r, s;
                    return Y(this, (function (a) {
                        switch (a.label) {
                            case 0:
                                return e = n.createTraceId(), n.info(be.A_GET_PROXY_T, "", e), [4, t.getProxy()];
                            case 1:
                                return o = a.sent(), r = o.code, s = o.data, r === i.SUCCESS ? (n.info(be.A_GET_PROXY_R, JSON.stringify({
                                    code: r,
                                    data: s
                                }), e), [2, {
                                    code: r,
                                    data: s
                                }]) : (n.warn(be.A_GET_PROXY_R, JSON.stringify({code: r}), e), [2, {
                                    code: r,
                                    msg: ut[r]
                                }])
                        }
                    }))
                }))
            }))]
        }))
    }))
}

function vr(e, t) {
    return x(this, void 0, void 0, (function () {
        var n = this;
        return Y(this, (function (o) {
            return !e || l("proxy.socksHost", e.socksHost, E.STRING, !0) && l("proxy.socksPort", e.socksPort, E.NUMBER, !0) ? [2, qe((function (o, r) {
                return x(n, void 0, void 0, (function () {
                    var n, s, a, c;
                    return Y(this, (function (_) {
                        switch (_.label) {
                            case 0:
                                return n = r.createTraceId(), r.info(be.A_TEST_PROXY_T, JSON.stringify({
                                    socksHost: null == e ? void 0 : e.socksHost,
                                    socksPort: null == e ? void 0 : e.socksPort
                                }), n), [4, o.testProxy(e, t)];
                            case 1:
                                return s = _.sent(), a = s.status, c = s.data, a === i.SUCCESS ? [2, {
                                    code: a,
                                    msg: c
                                }] : (r.warn(be.A_TEST_PROXY_R, JSON.stringify({status: a}), n), [2, {
                                    code: a,
                                    msg: ut[a]
                                }])
                        }
                    }))
                }))
            }))] : [2, {code: i.BIZ_ERROR_INVALID_PARAMETER}]
        }))
    }))
}

export {
    Un as BaseMessage,
    Bn as CombineMessage,
    wn as CombineV2Message,
    xn as CommandMessage,
    fr as ConnectType,
    ye as Events,
    Vn as FileMessage,
    bn as GIFMessage,
    Zn as GroupNotificationMessage,
    Gn as HQVoiceMessage,
    Ln as ImageMessage,
    Yn as InformationNotificationMessage,
    Fn as LocationMessage,
    lr as MessageType,
    Hn as ReferenceMessage,
    kn as RichContentMessage,
    Pn as SightMessage,
    Dn as TextMessage,
    Jn as VoiceMessage,
    st as __addSDKVersion,
    ur as addConversationsToTag,
    ze as addEventListener,
    ir as addTag,
    hn as addToBlacklist,
    ko as batchClearRemoteHistoryMessages,
    bo as batchGetMessageReadReceiptInfoV4,
    lt as batchRemoveConversation,
    yt as batchSetConversationNotificationLevel,
    wt as batchSetConversationToTop,
    vn as bindRTCRoomForChatroom,
    pt as clearAllMessagesUnreadStatus,
    $e as clearEventListeners,
    Ho as clearHistoryMessages,
    tr as clearMessages,
    Ct as clearMessagesUnreadStatus,
    Ot as clearTextMessageDraft,
    or as clearUnreadCountByTimestamp,
    Tt as connect,
    To as createUploadTask,
    er as deleteLocalMessagesByTimestamp,
    Fo as deleteMessages,
    nt as destroy,
    St as disconnect,
    gr as electronExtension,
    In as forceRemoveChatRoomEntry,
    An as forceSetChatRoomEntry,
    On as getAllChatRoomEntries,
    Ht as getAllConversationState,
    en as getAllUltraGroupUnreadCount,
    tn as getAllUltraGroupUnreadMentionedCount,
    Ft as getAllUnreadMentionedCount,
    Cn as getBlacklist,
    pn as getBlacklistStatus,
    xt as getBlockUltraGroupList,
    Dt as getBlockedConversationList,
    gn as getChatRoomEntry,
    Tn as getChatRoomInfo,
    Nn as getChatroomHistoryMessages,
    ot as getConnectionStatus,
    At as getConversation,
    Rt as getConversationList,
    Gt as getConversationNotificationLevel,
    Pt as getConversationNotificationStatus,
    Sr as getConversationsFromTagByPage,
    it as getCurrentUserId,
    at as getDeviceId,
    fo as getDownloadAuth,
    Ao as getFileToken,
    lo as getFileUrl,
    Xo as getFirstUnreadMessage,
    zo as getFirstUnreadMessageInfo,
    Uo as getHistoryMessages,
    Wo as getMessage,
    Vo as getMessageReadReceiptV4,
    Ko as getMessageReader,
    Nr as getProxy,
    Mo as getRemoteHistoryMessages,
    rt as getServerTime,
    cr as getTags,
    _r as getTagsFromConversation,
    It as getTextMessageDraft,
    Vt as getTopConversationList,
    Nt as getTotalUnreadCount,
    vt as getTotalUnreadCountByLevels,
    ht as getTotalUnreadMentionedCountByLevels,
    Wt as getUltraGroupDefaultNotificationLevel,
    on as getUltraGroupFirstUnreadMessageTimestamp,
    kt as getUltraGroupList,
    Zt as getUltraGroupMessageListByMessageUId,
    $t as getUltraGroupUnreadCountByTargetId,
    rn as getUltraGroupUnreadInfoList,
    jt as getUltraGroupUnreadMentionedCountByTargetId,
    nn as getUltraGroupUnreadMentionedMessages,
    bt as getUnreadConversationList,
    mt as getUnreadCount,
    Rr as getUnreadCountByTag,
    Jt as getUnreadMentionedCount,
    Qo as getUnreadMentionedMessages,
    et as init,
    jo as insertMessage,
    ct as installPlugin,
    un as joinChatRoom,
    dn as joinExistChatRoom,
    zt as modifyMessage,
    je as onceEventListener,
    En as quitChatRoom,
    Jo as recallMessage,
    qo as registerMessageType,
    Xt as removeAllExpansionForUltraGroupMessage,
    ln as removeChatRoomEntries,
    fn as removeChatRoomEntry,
    ft as removeConversation,
    dr as removeConversationsFromTag,
    We as removeEventListener,
    Qe as removeEventListeners,
    qt as removeExpansionForUltraGroupMessage,
    mn as removeFromBlacklist,
    Yo as removeMessageExpansionForKey,
    sr as removeTag,
    Tr as removeTagFromConversations,
    Er as removeTagsFromConversation,
    gt as saveTextMessageDraft,
    nr as searchConversationByContent,
    $o as searchMessages,
    No as sendFileMessage,
    ho as sendGIFMessage,
    mo as sendHQVoiceMessage,
    vo as sendImageMessage,
    Io as sendMessage,
    yo as sendReadReceiptMessage,
    wo as sendReadReceiptMessageV4,
    Lo as sendReadReceiptRequest,
    Go as sendReadReceiptResponse,
    Do as sendReadReceiptResponseV2,
    Co as sendSightMessage,
    Bo as sendSyncReadStatusMessage,
    go as sendTextMessage,
    Zo as sendTypingStatusMessage,
    Yt as sendUltraGroupTypingStatus,
    Rn as setChatRoomEntries,
    Sn as setChatRoomEntry,
    Mt as setConversationNotificationLevel,
    Lt as setConversationNotificationStatus,
    Bt as setConversationToTop,
    Ar as setConversationToTopInTag,
    rr as setMessageReceivedStatus,
    Or as setProxy,
    Qt as setUltraGroupDefaultNotificationLevel,
    So as stopUploadTask,
    vr as testProxy,
    Kt as updateExpansionForUltraGroupMessage,
    xo as updateMessageExpansion,
    ar as updateTag,
    Ro as upload
};
