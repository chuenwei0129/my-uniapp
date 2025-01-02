import Vue from "vue";

export const regDataList = function (targetList) {
  // 正则匹配出11位手机号和固定电话，并且可以拨打电话
  let phoneReg = /1[3,5,7,8]{1}[0-9]{1}[0-9]{8}/g;
  let telReg =
    /0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/g;
  let current = ""; //匹配项，手机号
  if (targetList) {
    targetList.map((item, index) => {
      console.log("regregreg:::", item);
      if (phoneReg.test(item.status)) {
        //全局匹配，返回匹配项手机号数组
        item.status.match(phoneReg).map((num, i) => {
          current = num;
          console.log("phone--1q123123121:::", current);
          item.status = item.status.replace(
            phoneReg,
            `<a  style="color:#FF5B05">${current}</a>`
          );
        });
      }
    });
    targetList.map((item, index) => {
      console.log("pppppp:::", item);
      if (telReg.test(item.status)) {
        //全局匹配，返回匹配项固话数组
        item.status.match(telReg).map((num, i) => {
          current = num;
          console.log("tel--1q123123121:::", current);
          item.status = item.status.replace(
            telReg,
            `<a  style="color:#FF5B05">${current}</a>`
          );
        });
      }
    });
  }
  return targetList;
};
export default {
  regDataList,
};
