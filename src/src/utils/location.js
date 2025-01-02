export function getAuthSetting(scope) {
  return new Promise((resolve, reject) => {
    uni.getSetting({
      success: (res) => {
        resolve(res.authSetting[scope]);
      },
      fail: (e) => {
        reject(e);
      },
    });
  });
}

function authorize(scope) {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope,
      success: (res) => {
        resolve(res);
      },
      fail: (e) => {
        reject(e);
      },
    });
  });
}

function openAuthSetting(scope) {
  return new Promise((resolve, reject) => {
    uni.openSetting({
      success: (res) => {
        if (res.authSetting[scope]) {
          resolve(true);
        } else {
          reject({
            errMsg: "authorize:fail auth deny",
          });
        }
      },
      fail: (e) => {
        reject(e);
      },
    });
  });
}

function getLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: "gcj02", //设置type为gcj02
      isHighAccuracy: true,
      success: (res) => {
        console.log("res", res);
        resolve(res);
      },
      fail: (e) => {
        console.log("reject", e);
        reject(e);
      },
    });
  });
}

export async function checkLocationAuth() {
  return await getAuthSetting("scope.userLocation");
}

export async function getAuthLocation() {
  const auth = await getAuthSetting("scope.userLocation");
  console.log("auth", auth);
  // 首次 未授权
  if (typeof auth === "undefined") {
    await authorize("scope.userLocation");
  } else if (auth == false) {
    await openAuthSetting("scope.userLocation");
  }
  // 已授权定位，开始定位
  return await getLocation();
}
