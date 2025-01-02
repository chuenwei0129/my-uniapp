!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports.supplier = t())
    : (e.supplier = t());
})(globalThis, () =>
  (() => {
    "use strict";
    var e = {
        d: (t, o) => {
          for (var n in o)
            e.o(o, n) &&
              !e.o(t, n) &&
              Object.defineProperty(t, n, { enumerable: !0, get: o[n] });
        },
        o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
      },
      t = {};
    e.d(t, { default: () => C });
    var o,
      n,
      r,
      i,
      a,
      c = "hcz",
      p = "hsh",
      s = "carPlugin",
      l = "hshWxApp",
      w = "jkWxApp",
      f =
        ((r =
          (n =
            (o =
              "undefined" != typeof window &&
              window.navigator.userAgent.toLowerCase()) &&
            -1 !== o.toLowerCase().indexOf("micromessenger")) &&
          o &&
          -1 !== o.indexOf("miniprogram")),
        (i = function (e, t) {
          var o = {};
          return (
            (e = e || window.location.href).replace(
              /\??(\w+)=([http://|%\d\w_\-|.]+)&?/g,
              function (e, t, n) {
                (n = decodeURIComponent(n)),
                  void 0 !== o[t] ? (o[t] = [].concat(o[t], n)) : (o[t] = n);
              }
            ),
            void 0 === t ? o : o[t] || ""
          );
        }),
        (a = function () {
          var e = {
              HSH: ["wxde82164776ca1c48", "wx15cd5d7964bcf326"],
              JK: ["wx5a7bcd03b5fbbc37", "wx6576bd7fd254ae29"],
              HCZ: ["wxb45e54a8165df819", "wxf225684ee1536a5f"],
            },
            t = i("", "appId") || i("", "appid") || o.split("miniprogram/")[1],
            n = "";
          for (var r in e)
            if (
              Object.prototype.hasOwnProperty.call(e, r) &&
              e[r].indexOf(t) > -1
            ) {
              n = r;
              break;
            }
          return n;
        }),
        o &&
        -1 === o.toUpperCase().indexOf("IS_PAMINA") &&
        -1 !== o.toUpperCase().indexOf("HCZ")
          ? c
          : o &&
            -1 === o.toUpperCase().indexOf("IS_PAMINA") &&
            -1 !== o.toUpperCase().indexOf("HSH")
          ? p
          : o && -1 !== o.toLowerCase().indexOf("carplugin")
          ? s
          : r && "HSH" === a()
          ? l
          : r && "JK" === a()
          ? w
          : n
          ? "wechat"
          : "other");
    function u(e, t) {
      var o =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        n = "LCRoute://"
          .concat(e, "/")
          .concat(t, "?params=")
          .concat(encodeURIComponent(JSON.stringify(o)));
      return (
        console.log("===cmdStr", n),
        window.LCApp
          ? (window.LCApp.CallNative(n), !0)
          : !(
              !window.webkit ||
              !window.webkit.messageHandlers.LCApp ||
              (window.webkit.messageHandlers.LCApp.postMessage(n), 0)
            )
      );
    }
    function d(e) {
      var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        o = { MethodName: e, Parameters: t };
      return (
        t.CallBack && (o.CallBack = t.CallBack),
        (o = JSON.stringify(o)),
        window.hczApp
          ? (window.hczApp.CallNative(o), !0)
          : !(
              !window.webkit ||
              !window.webkit.messageHandlers.hczApp ||
              (window.webkit.messageHandlers.hczApp.postMessage(o), 0)
            )
      );
    }
    function b(e) {
      var t =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (window.pluginJSImp) {
        var o = JSON.stringify({ MethodName: e, Parameters: t });
        return window.pluginJSImp.post(o), !0;
      }
      return !1;
    }
    const h = {
      openPage: function (e) {
        switch (f) {
          case p:
            !1 === u("MTUIRoute", "openWebVC", { url: e }) &&
              (window.location.href = e);
            break;
          case c:
            !1 === d("dispatcher", { urlParams: e }) &&
              (window.location.href = e);
            break;
          case s:
            !1 === b("openWebView", { url: e }) && (window.location.href = e);
            break;
          case (l || w) && wx:
            wx.miniProgram.navigateTo({
              url: "/pages/webview/transferWithBack?src=".concat(
                encodeURIComponent(e)
              ),
            });
            break;
          default:
            window.location.href = e;
        }
      },
      back: function () {
        switch (f) {
          case p:
            u("MTUIRoute", "popSelfVC") || window.history.back();
            break;
          case c:
            d("popSelfVC") || window.history.back();
            break;
          case s:
            b("closeWebContainer") || window.history.back();
            break;
          case (l || w) && wx:
            wx.miniProgram.navigateBack({});
            break;
          default:
            window.history.back();
        }
      },
      hideHeaderRightBtn: function () {
        f === p && u("MTUIRoute", "showRightBarButton", { IsShow: 0 });
      },
      goToHshWxGZH: function (e) {
        f === p &&
          u("MTShareRoute", "goWXSubscribeMsg", {
            title: "点击关注公众号",
            content: "就差一步！关注公众号，每天准时接收微信提醒！",
            color: "#666666",
            url: e
              ? "https://mp.weixin.qq.com/s/OLgifzMVQB3VyRtS7objbg"
              : "https://mp.weixin.qq.com/s/gXolXgcko6KR_x6VSA3DYQ",
            scene: "6666",
          });
      },
      hideCloseBtn: function () {
        (f === p || f === c) && u("MTUIRoute", "isHideCloseBtn", { isHide: 1 });
      },
      openScanner: function () {
        f === p
          ? u("openScannerVC", { hiddenScanAlert: !0 })
          : f === c && u("pushScanQRCodeVC", { selectItem: [101] });
      },
      openWXWMP: function (e) {
        f === p
          ? u("MTUIRoute", "openWXMiniProgram", e)
          : f === c && d("openWXMiniProgram", e);
      },
      hshCallNative: u,
      hczCallNative: d,
    };
    function m(e) {
      return (
        (m =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  "function" == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? "symbol"
                  : typeof e;
              }),
        m(e)
      );
    }
    function g(e, t) {
      var o = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        t &&
          (n = n.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          o.push.apply(o, n);
      }
      return o;
    }
    function y(e) {
      for (var t = 1; t < arguments.length; t++) {
        var o = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? g(Object(o), !0).forEach(function (t) {
              v(e, t, o[t]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(o))
          : g(Object(o)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(o, t)
              );
            });
      }
      return e;
    }
    function v(e, t, o) {
      return (
        (t = (function (e) {
          var t = (function (e, t) {
            if ("object" !== m(e) || null === e) return e;
            var o = e[Symbol.toPrimitive];
            if (void 0 !== o) {
              var n = o.call(e, "string");
              if ("object" !== m(n)) return n;
              throw new TypeError(
                "@@toPrimitive must return a primitive value."
              );
            }
            return String(e);
          })(e);
          return "symbol" === m(t) ? t : String(t);
        })(t)) in e
          ? Object.defineProperty(e, t, {
              value: o,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = o),
        e
      );
    }
    window.paH5Utils = y(y({}, h), {}, { env: f });
    const C = y(y({}, h), {}, { env: f, hshCallNative: u, hczCallNative: d });
    return t.default;
  })()
);
