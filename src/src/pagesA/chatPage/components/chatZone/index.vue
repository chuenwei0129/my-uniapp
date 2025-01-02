<template>
  <view class="wrapper">
    <view class="input-wrapper">
      <view class="text-card">
        <textarea
          :adjust-position="false"
          class="input"
          :show-confirm-bar="false"
          auto-height="true"
          maxlength="500"
          confirm-type="send"
          :focus="isFocus"
          @confirm="sendMessText"
          :confirm-hold="true"
          v-model="inputValue"
          @input="handleChange"
          @focus="inputFocus"
        />
      </view>

      <image
        @click="
          () => {
            handleEmojiPanel('emoji');
          }
        "
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/emoji-tag.png"
        mode="scaleToFill"
      />
      <image
        v-if="!inputValue.length"
        @click="
          () => {
            handleEmojiPanel('more');
          }
        "
        src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/more-tag.png"
        mode="scaleToFill"
      />
      <view v-else class="send-button" @click="sendMessText">发送</view>
    </view>
    <view v-if="isShowEmoji" :class="[isShowEmoji ? 'extra-wrapper' : '']">
      <view class="content" v-if="isEmojiContent">
        <view
          class="emoji-item"
          v-for="(item, index) in emojiList"
          :key="index"
          @click="
            () => {
              chooseEmoji(item);
            }
          "
          >{{ item.emoji }}</view
        >
        <!-- <view class="delete" @click="deleteContent"></view> -->
        <!-- <view class="button" @click="sendMessText">发送</view> -->
      </view>
      <view class="upload" v-else>
        <view
          class="item"
          @click="
            () => {
              handlePhoto(2);
            }
          "
        >
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/photo-up-tag.png"
            mode="scaleToFill"
          />
          照片
        </view>
        <view
          class="item"
          @click="
            () => {
              handlePhoto(1);
            }
          "
        >
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/takephoto-tag.png"
            mode="scaleToFill"
          />
          拍照
        </view>
        <view
          class="item"
          @click="
            () => {
              handleVideo();
            }
          "
        >
          <image
            src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/takevideo-tag.png"
            mode="scaleToFill"
          />
          发送视频
        </view>
      </view>
    </view>
    <u-safe-bottom></u-safe-bottom>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
// import * as RongIMLib from "@rongcloud/imlib-next";
import {
  ConversationType as RYConversationType,
  TextMessage as RYTextMessage,
  sendMessage as RYsendMessage,
  ErrorCode as RYErrorCode,
  ImageMessage as RYImageMessage,
  SightMessage as RYSightMessage,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { mapState, mapMutations } from "vuex";
import { BASR_URL } from "@/utils/http";
import { handleLastMes } from "@/pagesA/components/rongyunCloud/ryConnect";
export default {
  components: {},
  props: {
    groupId: {
      type: String,
    },
    isPageEmojiHalf: {
      type: Boolean,
    },
  },
  data() {
    return {
      inputValue: "",
      keyboardHeight: "",
      isShowEmoji: false,
      // photoShow: false,
      isEmojiContent: false,
      emojiList: [],
      qiniuyunToken: "",
      isFocus: false,
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      isChooseImage: (state) => state.isChooseImage,
    }),
    isAnd() {
      return uni.$u.os() === "android";
    },
  },
  mounted() {
    const RongEmoji = require("./libs/RongEmoji-2.2.10.js");
    var emojiConfig = {
      size: 50,
    };
    RongEmoji.init(emojiConfig);
    var list = RongEmoji.list;
    this.emojiList = list;
    uni.onKeyboardHeightChange((res) => {
      this.keyboardHeight = res.height;
      if (res.height) {
        //呼起键盘，此时要关闭表情看板
        this.isShowEmoji = false;
        this.$emit("handleEmojiPanel", false);
      }
      this.$emit("keyBoardActive", res.height);
    });
    // this.uploadQN(
    //   "http://tmp/z2XU6XqmnCsOff7123412163ce8e719ce34599a834d5.mp4"
    // );
  },
  watch: {
    isPageEmojiHalf: {
      handler: function (newV) {
        if (!newV) {
          //关闭表情看板
          this.isShowEmoji = false;
          this.isEmojiContent = false;
          this.$emit("handleEmojiPanel", false);
        }
      },
    },
  },
  methods: {
    inputFocus() {
      this.isShowEmoji = false;
      this.isEmojiContent = false;
      this.$emit("handleEmojiPanel", false);
      this.handleChange();
    },
    ...mapMutations(["setIsChooseImage"]),
    handleFocus() {
      this.$nextTick(() => {});
    },
    handleChange(e) {
      uni
        .createSelectorQuery()
        .in(this)
        .select(".input")
        .boundingClientRect((result) => {
          if (result) {
            this.$emit("heightChange", result);
          }
        })
        .exec();
    },
    sendMessText() {
      if (!this.inputValue.length) {
        return;
      }
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };

      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      console.log(123456789);
      const message1 = new RYTextMessage({
        // 文本内容
        content: this.inputValue,
        extra: "文本消息",
      });
      let options;
      RYsendMessage(conversation, message1, options).then((res) => {
        // 发送完成后，问诊单最后一条消息 更新
        handleLastMes({
          groupId: this.groupId,
          mes: res.data,
          type: "newMes",
        });

        if (res.code === RYErrorCode.SUCCESS) {
          // 消息发送成功，可以根据返回结果中的 messageId 字段将列表中的该消息状态改为发送成功。
          // console.log("消息发送成功", res.data);
          let data = res.data;
          this.$emit("sendSuccess", {
            content: { content: data?.content.content },
            messageType: data.messageType,
            userAvatarUrl: this.userInfo.avatarUrl,
            sentTime: data.sentTime,
            direction: data.messageDirection,
            messageUId: data.messageUId,
            state: 1,
          });
          this.inputValue = "";
          //文本信息添加到当前的message列表内，已经保存了groupid
        } else {
          // message.error("消息发送失败");
        }
      });
    },
    sendMessImg(imgUrl, base64) {
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      const message1 = new RYImageMessage({
        content: base64, // 图片缩略图，应为 Base64 字符串，且不可超过 80KB
        imageUri: imgUrl, // 图片的远程访问地址
      });
      let options;
      RYsendMessage(conversation, message1, options).then((res) => {
        if (res.code === RYErrorCode.SUCCESS) {
          // 消息发送成功，可以根据返回结果中的 messageId 字段将列表中的该消息状态改为发送成功。
          let data = res.data;
          // console.log(data);

          // 发送完成后，问诊单最后一条消息 更新
          handleLastMes({
            groupId: this.groupId,
            mes: res.data,
            type: "newMes",
          });
          this.$emit("sendSuccess", {
            content: {
              content: data?.content.content,
              imageUri: data?.content.imageUri,
            },
            messageType: data.messageType,
            userAvatarUrl: this.userInfo.avatarUrl,
            sentTime: data.sentTime,
            direction: data.messageDirection,
            messageUId: data.messageUId,
            state: 1,
          });
          //文本信息添加到当前的message列表内，已经保存了groupid
        } else {
          // message.error("消息发送失败");
        }
      });
    },
    handleEmojiPanel(type) {
      if (type == "emoji" && !this.isEmojiContent) {
        this.isEmojiContent = true;
        this.isFocus = false;
      } else if (type == "emoji" && this.isEmojiContent) {
        // 获取焦点并关闭表情面板
        this.isFocus = true;
        this.isEmojiContent = false;
        this.isShowEmoji = false;
        this.$emit("handleEmojiPanel", false);
      } else {
        this.isEmojiContent = false;
      }
      if (this.keyboardHeight) {
        //键盘唤起状态，一定是打开看板
        this.isShowEmoji = true;
        this.$emit("handleEmojiPanel", true);
      } else {
        //键盘关闭时
        if (this.isShowEmoji) {
          //当前是显示看板状态
        } else {
          this.isShowEmoji = !this.isShowEmoji;
          this.$emit("handleEmojiPanel", this.isShowEmoji);
        }
      }
    },
    urlTobase64(url) {
      // #ifdef MP-WEIXIN
      let base64 = "";
      return new Promise((resolve, reject) => {
        uni.getFileSystemManager().readFile({
          filePath: url, //选择图片返回的相对路径
          encoding: "base64", //编码格式
          success: (res) => {
            //成功的回调
            console.log(res);
            base64 = "data:image/jpeg;base64," + res.data; //不加上这串字符，在页面无法显示的哦
            resolve(base64);
          },
          fail: (e) => {
            console.log("图片转换失败");
            reject(e);
          },
        });
      });
      // #endif
      // #ifdef H5
      return new Promise((resolve) => {
        const image = new Image();
        // 先设置图片跨域属性
        image.crossOrigin = "Anonymous";
        // 再给image赋值src属性，先后顺序不能颠倒
        image.src = url;
        image.onload = function () {
          const canvas = document.createElement("CANVAS");
          // 设置canvas宽高等于图片实际宽高
          canvas.width = image.width;
          canvas.height = image.height;
          canvas.getContext("2d").drawImage(image, 0, 0);
          // toDataUrl可以接收2个参数，参数一：图片类型，参数二： 图片质量0-1（不传默认为0.92）
          const dataURL = canvas.toDataURL("image/jpeg");
          resolve(dataURL);
        };
        image.onerror = () => {
          resolve({ message: "相片处理失败" });
        };
      });

      // #endif
    },
    showSize(base64url) {
      //把头部去掉
      var str = base64url.replace("data:image/png;base64,", "");
      // 找到等号，把等号也去掉
      var equalIndex = str.indexOf("=");
      if (str.indexOf("=") > 0) {
        str = str.substring(0, equalIndex);
      }
      // 原来的字符流大小，单位为字节
      var strLength = str.length;
      // 计算后得到的文件流大小，单位为字节
      var fileLength = parseInt(strLength - (strLength / 8) * 2);
      // 由字节转换为kb
      var size = "";
      size = (fileLength / 1024).toFixed(2);
      var sizeStr = size + ""; //转成字符串
      var index = sizeStr.indexOf("."); //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
      if (dou == "00") {
        //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
      }
      return size;
    },
    handlePhoto(data) {
      const that = this;

      this.setIsChooseImage(true);
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: data == 1 ? ["camera"] : ["album"],
        success: function (res) {
          console.log("ddddddd success", res);
          that.setIsChooseImage(false);
          that.handleCompress(res.tempFilePaths[0]);
        },
        fail: () => {
          console.log("eeeeee fail", res);

          this.setIsChooseImage(false);
        },
      });
    },
    handleCompress(res) {
      var that = this;
      // #ifdef MP-WEIXIN
      uni.compressImage({
        src: res,
        quality: 10,
        compressedWidth: 300,
        success: (rescompress) => {
          that.urlTobase64(rescompress.tempFilePath).then((res1) => {
            console.log(that.showSize(res1));
            if (that.showSize(res1) < 80) {
              const url = process.env.NODE_ENV?.includes("local")
                ? "/api/"
                : BASR_URL;
              //缩略图小于80kb，可以发送
              uni.uploadFile({
                url: url + "cpp-common-management/v1/file/upload",
                filePath: res,
                name: "file",
                header: {
                  Authorization: uni.getStorageSync("storage_info").token,
                  fromChannel: "MP",
                },
                formData: {
                  file: res,
                },
                success: (uploadFileRes) => {
                  console.log(res1.split(",")[1]);
                  that.sendMessImg(uploadFileRes.data, res1.split(",")[1]);
                },
                fail: (res) => {
                  uni.showToast({
                    title: "图片上传失败",
                    duration: 2000,
                    icon: "error",
                  });
                },
              });
            } else {
              uni.showToast({
                title: "图片压缩失败",
                duration: 2000,
                icon: "error",
              });
            }
          });
        },
        fail: (res) => {
          uni.showToast({
            title: "图片略缩图过大",
            duration: 2000,
            icon: "error",
          });
        },
      });
      // #endif
      // #ifdef H5
      this.translate(res, 0.5).then((ress) => {
        that.urlTobase64(ress).then((res1) => {
          console.log("that.showSize", that.showSize(res1));
          if (that.showSize(res1) < 80) {
            const url = process.env.NODE_ENV?.includes("local")
              ? "/api/"
              : BASR_URL;
            //缩略图小于80kb，可以发送
            uni.uploadFile({
              url: url + "cpp-common-management/v1/file/upload",
              filePath: res,
              name: "file",
              header: {
                Authorization: uni.getStorageSync("storage_info").token,
                fromChannel: "MP",
              },
              formData: {
                file: res,
              },
              success: (uploadFileRes) => {
                console.log(res1.split(",")[1]);
                that.sendMessImg(uploadFileRes.data, res1.split(",")[1]);
              },
              fail: (res) => {
                uni.showToast({
                  title: "图片上传失败",
                  duration: 2000,
                  icon: "error",
                });
              },
            });
          } else {
            // uni.showToast({
            //   title: "图片压缩失败",
            //   duration: 2000,
            //   icon: "error",
            // });
          }
        });
      });
      // #endif
    },
    translate(imgSrc, scale) {
      //imgSrc:图片的路径
      //scale:缩放比例 0-1之间
      return new Promise((reslove, reject) => {
        var img = new Image(); //创建Image对象生成一个<img>标签
        img.src = imgSrc; //将图片路径赋给<img>标签的src
        img.onload = () => {
          //onload在图片加载成功后触发，在onload中完成压缩功能
          var h = img.height / 8; // 获取原本图片的宽高
          var w = img.width / 8; //默认按比例压缩,根据需求修改
          var canvas = document.createElement("canvas"); //创建画布
          var ctx = canvas.getContext("2d"); //设置为2d效果
          var width = document.createAttribute("width"); //创建属性节点
          width.nodeValue = w; //设置属性值
          var height = document.createAttribute("height");
          height.nodeValue = h;
          canvas.setAttributeNode(width); //设置画布宽高
          canvas.setAttributeNode(height);
          ctx.drawImage(img, 0, 0, w, h); //将图片贴到画布上
          //img:图片 0,0:粘贴的位置 w,h:粘贴图片的大小
          var base64 = canvas.toDataURL("image/png", scale);
          //'image/png':压缩返回图片的类型 scale:图片质量
          //如果要base64的流，可以直接将结果返回了
          canvas = null; //清除画布
          var blob = this.base64ToBlob(base64); //需要二进制流调用该方法拿到
          let blobUrl = window.URL.createObjectURL(blob); //blob地址
          reslove(blobUrl);
        };
      });
    },
    // base64转Blob
    base64ToBlob(base64) {
      var arr = base64.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime,
      });
    },

    chooseEmoji(item) {
      this.inputValue += item.emoji;
    },
    deleteContent() {
      if (this.inputValue.length) {
        console.log(this.inputValue);
      }
    },
    handleVideo() {
      const that = this;

      this.setIsChooseImage(true);
      uni.chooseVideo({
        maxDuration: 60,
        count: 1,
        compressed: true, //是否压缩所选的视频源文件，默认值为 true，需要压缩。
        sourceType: ["camera", "album"],
        success: (res) => {
          that.setIsChooseImage(false);
          if (res.duration > 120) {
            return this.$refs.uToast.show({
              type: "default",
              title: "默认主题",
              message: "视频大于120秒，无法上传",
              iconUrl: "https://cdn.uviewui.com/uview/demo/toast/default.png",
            });
          }
          let p1 = new Promise((resolve, reject) => {
            const url = process.env.NODE_ENV?.includes("local")
              ? "/api/"
              : BASR_URL;
            uni.uploadFile({
              url: url + "operations-mgt-common-management/v1/file/upload",
              // url: "https://up.qiniup.com",
              filePath: res.tempFilePath,
              name: "file",
              header: {
                Authorization: uni.getStorageSync("storage_info").token,
                fromChannel: "MP",
              },
              formData: {
                file: res,
              },
              // formData: {
              //   key: `${new Date().valueOf()}+${res.tempFilePath.substring(
              //     res.tempFilePath.lastIndexOf(".")
              //   )}`, //key值
              //   token: tokenData.uploadToken, //七牛云token值
              // },
              success: (uploadFileRes) => {
                resolve({
                  sightUrl: uploadFileRes.data,
                  duration: res.duration,
                  size: res.size,
                });
              },
              fail: (res) => {
                reject(res);
                uni.showToast({
                  title: "视频上传失败",
                  duration: 2000,
                  icon: "error",
                });
              },
            });
          });
          let p2 = new Promise((resolve, reject) => {
            if (res.thumbTempFilePath) {
              uni.compressImage({
                src: res.thumbTempFilePath,
                quality: 10,
                compressedWidth: 300,
                success: (rescompress) => {
                  that.urlTobase64(rescompress.tempFilePath).then((res1) => {
                    console.log(that.showSize(res1));
                    if (that.showSize(res1) < 80) {
                      //缩略图小于80kb，可以发送
                      resolve(res1.split(",")[1]);
                    } else {
                      reject();
                      uni.showToast({
                        title: "图片压缩失败",
                        duration: 2000,
                        icon: "error",
                      });
                    }
                  });
                },
                fail: (res) => {
                  reject(res);
                  uni.showToast({
                    title: "图片略缩图过大",
                    duration: 2000,
                    icon: "error",
                  });
                },
              });
            } else {
              let base64 =
                "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMADgoLDQsJDg0MDRAPDhEWJBcWFBQWLCAhGiQ0Ljc2My4yMjpBU0Y6PU4+MjJIYklOVlhdXl04RWZtZVpsU1tdWf/bAEMBDxAQFhMWKhcXKlk7MjtZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWf/AABEIARsBLAMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABv/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z";
              resolve(base64);
            }
          });
          Promise.all([p1, p2])
            .then((result) => {
              console.log("promise.all，result", result);
              const { sightUrl, duration, size } = result[0];
              that.sendMessVideo(sightUrl, result[1], duration, size);
            })
            .catch((e) => {
              console.log("上传错误", e);
            });
        },
        fail: () => {
          this.setIsChooseImage(false);
        },
      });
    },
    sendMessVideo(sightUrl, content, duration, size) {
      const conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      // 实例化待发送消息，RYTextMessage 为内置文本型消息
      const message1 = new RYSightMessage({
        sightUrl,
        content,
        duration,
        size,
        name: "miniVideo",
      });
      let options;
      RYsendMessage(conversation, message1, options).then((res) => {
        console.log(res);
        if (res.code === RYErrorCode.SUCCESS) {
          // 消息发送成功，可以根据返回结果中的 messageId 字段将列表中的该消息状态改为发送成功。
          let data = res.data;
          // 发送完成后，问诊单最后一条消息 更新
          handleLastMes({
            groupId: this.groupId,
            mes: res.data,
            type: "newMes",
          });
          this.$emit("sendSuccess", {
            content: {
              content: data?.content.content, //base64
              sightUrl: data?.content.sightUrl,
            },
            messageType: data.messageType,
            userAvatarUrl: this.userInfo.avatarUrl,
            sentTime: data.sentTime,
            direction: data.messageDirection,
            messageUId: data.messageUId,
            state: 1,
          });
          //文本信息添加到当前的message列表内，已经保存了groupid
        } else {
          // message.error("消息发送失败");
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
