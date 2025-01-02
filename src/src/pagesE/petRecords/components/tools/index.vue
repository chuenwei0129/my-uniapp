<template>
    <view class="tools" v-if="tools">
        <view class="icons">
            <view class="icon" v-for="(item, index) in tools" :key="index">
                <image class="img" @click="go(item.url, item.title)" mode="aspectFit" :src="item.icon" />
                <view class="name" @click="go(item.url, item.title)">{{ item.title }}</view>
            </view>

        </view>
    </view>
</template>
<script>
import { action_report, display_report } from "@/utils/track";
import { checkLocationAuth, getAuthLocation } from "@/utils/location";
import {
    searchUserLocation,
} from "@/api/base/index";
export default {
    components: {},
    props: {
        tools: {
            type: Array,
            default: null,
        },
        agePhase: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
        };
    },
    computed: {},
    async mounted() {

        // const { latitude, longitude } = await getAuthLocation();
        // await this.searchLocation({
        //     lon: longitude,
        //     lat: latitude,
        // });



    },
    methods: {
        //根据经纬度查取地区
        async searchLocation(data) {
            // const res = await searchUserLocation({ data });
            // console.log("res", res);
            // this.city = res.data.city;
            // // let cityCode = res.data.adcode.slice(0, 4) + "00";
            // let cityCode = res.data.adcode.slice(0, 4);
            // console.log("city", cityCode);
            // uni.setStorageSync("city", res.data.city);
            // uni.setStorageSync("cityCode", cityCode);
        },

        async go(url, title) {
            let path = url
            let age = this.agePhase

            if (title == 'MBTI') {
                action_report({
                    action_name: "pet_page_tools_mbti_click",
                    module_name: "petpage",
                    extend: {
                        age: age,
                    },
                });
            } else if (title == '能不能吃') {
                action_report({
                    action_name: "pet_page_tools_nbnc_click",
                    module_name: "petpage",
                    extend: {
                        age: age,
                    },
                });
            } else if (title == '宠龄换算器') {
                action_report({
                    action_name: "pet_page_tools_cnhsq_click",
                    module_name: "petpage",
                    extend: {
                        age: age,
                    },
                });
            } else if (title == '养犬政策') {
                action_report({
                    action_name: "pet_page_tools_yqzc_click",
                    module_name: "petpage",
                    extend: {
                        age: age,
                    },
                });
            }

            if (path.indexOf("cpp.chongpangpang.com") !== -1) {
                console.log("chongpangpang  1");
                let char = "#";
                let index = path.indexOf(char);
                console.log("chongpangpang  index: ", index);
                if (index !== -1) {
                    let result = path.substring(index + 1);
                    console.log(result);
                    uni.navigateTo({
                        url: result,
                    });
                    return
                } else {
                    console.log(" no result");
                }
                return
            }

            // if (title == 'MBTI') {
            //     uni.navigateTo({
            //         url: "/pagesD/mbtiTest/index",
            //     });
            //     return
            // }
            if (path.indexOf("http") !== -1) {
                let newRoute = "";
                if (path.indexOf("h5/shareActivity/?random=123#")) {
                    newRoute = path.replace("h5/shareActivity/?random=123#", "#");
                } else if (path.indexOf("h5/shareActivity/?random=123/#/")) {
                    newRoute = path.replace("h5/shareActivity/?random=123/#/", "#");
                } else if (path.indexOf("h5/shareActivity/?random=123")) {
                    newRoute = path.replace("h5/shareActivity/?random=123/", "");
                }
                let str = `/pagesA/webView/index?route=${encodeURIComponent(
                    newRoute
                )}&type=icon`;

                // if (title == '养犬政策') {
                //     let cityName = uni.getStorageSync("city") || '杭州'
                //     let cityCode = uni.getStorageSync("cityCode") || '3301'
                //     console.log(`cityName:${cityName}  cityCode:${cityCode}`)
                //     str = str + `&cityName=${cityName}&cityCode=${cityCode}00`
                //     console.log('str:', str)
                // }


                return uni.navigateTo({
                    url: str,
                });
            } else {
                return uni.navigateTo({
                    url: path,
                });
            }
        }
    },
    watch: {
        agePhase: {
            immediate: true,
            handler(newValue, oldValue) {
                let tools = this.tools
                if (tools && tools.length) {
                    for (let index = 0; index < tools.length; index++) {
                        const item = tools[index];
                        let title = item.title
                        if (title == 'MBTI') {
                            display_report({
                                display_name: "pet_page_tools_mbti_display",
                                object_type: "petpage",
                                extend: {
                                    age: this.agePhase,
                                },
                            });
                        } else if (title == '能不能吃') {
                            display_report({
                                display_name: "pet_page_tools_nbnc_display",
                                object_type: "petpage",
                                extend: {
                                    age: this.agePhase,
                                },
                            });
                        } else if (title == '宠龄换算器') {
                            display_report({
                                display_name: "pet_page_tools_cnhsq_display",
                                object_type: "petpage",
                                extend: {
                                    age: this.agePhase,
                                },
                            });
                        } else if (title == '养犬政策') {
                            display_report({
                                display_name: "pet_page_tools_yqzc_display",
                                object_type: "petpage",
                                extend: {
                                    age: this.agePhase,
                                },
                            });
                        }
                    }
                }


            },
        },
    },
};
</script>
  
<style scoped lang="scss">
.tools {
    padding-bottom: 60rpx;
}

.icons {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    // gap: 80rpx;
}

.icon {
    display: flex;
    flex-direction: column;
    width: 172rpx;
    height: 172rpx;
    align-items: center;
}

.img {
    width: 96rpx;
    height: 96rpx;
}

.name {
    // width: 100rpx;
    height: 35rpx;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 25rpx;
    color: #1F1F1F;
    line-height: 35rpx;
    text-align: center;
    font-style: normal;
}
</style>
  