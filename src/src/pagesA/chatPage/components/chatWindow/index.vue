<template>
  <scroll-view
    class="wrapper"
    id="chat-window"
    scroll-y="true"
    :scroll-into-view="scrollToView"
    :refresher-enabled="hasMore"
    :refresher-triggered="triggered"
    @refresherrefresh="myPullDownRefresh"
    @scroll="handleScroll"
    :scroll-top="scrollTop"
  >
    <view
      v-if="chatMessage.length"
      :style="{
        '-webkit-overflow-scrolling': scrollFlag ? 'auto' : 'touch',
        '-webkit-backface-visibility': 'hidden',
        '-webkit-transform': 'translateZ(0rpx)',
      }"
    >
      <view
        v-for="(item, index) in chatMessage"
        :key="item.messageUId"
        :id="'msg' + item.sentTime"
      >
        <view
          class="timeInfo"
          v-if="
            index > 2 &&
            item.sentTime - chatMessage[index - 1].sentTime > 180000
          "
        >
          {{ initTime(item.sentTime) }}
        </view>
        <view class="timeInfo" v-if="index == 0">
          {{ initTime(item.sentTime) }}
        </view>
        <view
          :class="[
            'InfoNtf',
            item.expansion && item.expansion.type == 'AUDIT_INTERCEPT_NOTIFY'
              ? 'info-expansion'
              : 'info-normal',
          ]"
          v-if="item.messageType == 'RC:InfoNtf'"
        >
          {{
            item.content.message.indexOf("问诊信息仅供参考") == -1
              ? item.content.message
              : item.content.message.split("医院就诊！")[0] +
                `医院就诊！\n` +
                item.content.message.split("医院就诊！")[1]
          }}
          <!-- {{ item.content.message }} -->
        </view>
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCVeterinarianDiagnosisMessage' &&
            item.direction == 2
          "
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body diagnosis-body">
            <view class="diagnosis-con item-con">
              <view class="item-title diagnosis-title">
                <text class="round"></text>
                <text class="title-text">
                  根据您描述的情况，初步诊断{{
                    JSON.parse(item.content.message).diagnosisIndex == 4
                      ? "疑似"
                      : ""
                  }}：</text
                >
              </view>
              <view
                class="diagnosis-text pd-l42"
                v-if="
                  [1, 2, 3].includes(
                    JSON.parse(item.content.message).diagnosisIndex
                  )
                "
              >
                {{
                  diagnosisOptions.find((optionsItem) => {
                    return (
                      optionsItem.value ==
                      JSON.parse(item.content.message).diagnosisIndex
                    );
                  }).label || ""
                }}
              </view>
              <view
                class="diagnosis-text pd-l42"
                v-if="
                  [4].includes(
                    JSON.parse(item.content.message).diagnosisIndex
                  ) && JSON.parse(item.content.message).diagnosis
                "
              >
                {{
                  JSON.parse(item.content.message)
                    .diagnosis.map((dItem) => dItem.name)
                    .join("、")
                }}
              </view>
              <view
                v-if="
                  ![5].includes(JSON.parse(item.content.message).diagnosisIndex)
                "
              >
                <view
                  class="diagnosisRemarks pd-l42"
                  v-if="JSON.parse(item.content.message).diagnosisRemarks"
                >
                  {{ JSON.parse(item.content.message).diagnosisRemarks }}
                </view>
              </view>
              <view v-else>
                <view
                  class="diagnosisRemarks pd-l42"
                  v-if="JSON.parse(item.content.message).diagnosisRemarks"
                >
                  {{ JSON.parse(item.content.message).diagnosisRemarks }}
                </view>
                <view v-else style="font-weight: bold" class="pd-l42">无</view>
              </view>
            </view>
            <view class="offlineAdvice-con item-con">
              <view class="item-title">
                <text class="round"></text>
                <text class="title-text"> 医嘱：</text>
              </view>
              <view class="item-content pd-l42">
                {{ JSON.parse(item.content.message).offlineAdvice || "无" }}
              </view>
            </view>
            <view
              class="medicationAdvice-con item-con"
              v-if="JSON.parse(item.content.message).medicationAdvice"
            >
              <view class="item-title">
                <text class="round"></text>
                <text class="title-text"> 用药建议：</text>
              </view>
              <view class="item-content pd-l42">
                {{ JSON.parse(item.content.message).medicationAdvice || "无" }}
              </view>
            </view>
            <view
              class="otherAdvice-con item-con last-no-mb"
              v-if="JSON.parse(item.content.message).otherAdvice"
            >
              <view class="item-title">
                <text class="round"></text>
                <text class="title-text"> 其他建议：</text>
              </view>
              <view class="item-content pd-l42">
                {{ JSON.parse(item.content.message).otherAdvice || "无" }}
              </view>
            </view>
          </view>
        </view>
        <!-- 营养诊断 -->
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCNutritionDiagnosisMsg' && item.direction == 2
          "
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body diagnosis-body">
            <view class="diagnosis-con item-con">
              <view class="item-title diagnosis-title">
                <text class="round"></text>
                <text class="title-text"> 根据您描述的情况，初步结论：</text>
              </view>
              <view class="diagnosis-text pd-l42">
                {{ JSON.parse(item.content.message).conclusion || "无" }}
              </view>
            </view>
            <view class="offlineAdvice-con item-con">
              <view class="item-title">
                <text class="round"></text>
                <text class="title-text"> 营养建议：</text>
              </view>
              <view class="item-content pd-l42">
                {{ JSON.parse(item.content.message).nutritionAdvice || "无" }}
              </view>
            </view>
          </view>
        </view>
        <!-- AI问诊问题 -->
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            JSON.parse(item.content.message).customType == 'question' &&
            !JSON.parse(item.content.message).filter
          "
        >
          <view class="left-ava" @click="reportCollect"
            ><image :src="item.userAvatarUrl || userAvatarUrl" alt=""
          /></view>
          <view class="left-body">
            <view
              class="left-body-text"
              v-html="
                handleTxtMsgToHtml(
                  JSON.parse(item.content.message).questionDesc.question
                )
              "
            >
            </view>
            <!-- 有图片的渲染情况 -->
            <view class="left-body-image" style="display: flex">
              <view
                class="queDesImage"
                v-for="(images, index) in JSON.parse(item.content.message)
                  .questionDesc.images"
                :key="index"
                @click="clickImg(images)"
                style="border-radius: 2px; margin-top: 10px; margin-right: 8px"
              >
                <image
                  :src="images"
                  mode="scaleToFill"
                  style="width: 60px; height: 60px"
                />
              </view>
            </view>
            <!-- 有视频的情况 -->
            <view class="left-body-video">
              <view
                class="queDesVideo"
                v-for="(video, index) in JSON.parse(item.content.message)
                  .questionDesc.videos"
                :key="index"
              >
                <video
                  :src="video"
                  :controls="true"
                  :autoplay="false"
                  :muted="true"
                  object-fit="contain"
                  :enable-progress-gesture="false"
                  :show-fullscreen-btn="true"
                  :show-progress="false"
                  :enable-play-gesture="false"
                  play-btn-position="center"
                  style="
                    width: 90px;
                    height: 120px;
                    border-radius: 2px;
                    margin-top: 10px;
                  "
                ></video>
              </view>
            </view>
          </view>
        </view>
        <!-- 智能问诊卡片 -->
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            item.direction == 2 &&
            JSON.parse(item.content.message).msgType == 'QUESTION_CARD'
          "
        >
          <view class="left-ava">
            <image :src="item.userAvatarUrl" alt="" />
          </view>
          <view class="ai-quest-left-body">
            <view
              class="ai-quest-title"
              v-if="
                !item.expansion ||
                (item.expansion && item.expansion.optionIndex.length == 0)
              "
              >{{
                JSON.parse(JSON.parse(item.content.message).content).description
              }}</view
            >
            <view
              class="ai-quest-content"
              v-html="
                handleTxtMsgToHtml(
                  JSON.parse(JSON.parse(item.content.message).content).content
                )
              "
            ></view>
            <view
              v-if="
                !item.expansion ||
                (item.expansion && item.expansion.optionIndex.length == 0)
              "
              class="ai-quest-list"
            >
              <view
                class="ai-quest-list-cell"
                v-for="(title, index) in JSON.parse(
                  JSON.parse(item.content.message).content
                ).options"
                :key="index"
              >
                <image
                  v-if="index > 0"
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/chat-aiquest-line%402x.png"
                  style="height: 4rpx"
                ></image>
                <view
                  class="ai-quest-list-cell-content"
                  @click="aiQuestCardDidSelect(item, index, title)"
                >
                  <view class="ai-quest-list-cell-dot"></view>
                  <view class="ai-quest-list-cell-title">{{ title }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 电子处方笺 -->

        <!-- 疾病问诊结果v2.0 -->
        <view
          class="left-mes"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            item.direction == 2 &&
            JSON.parse(item.content.message).msgType == 'PRESCRIPTION'
          "
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <!-- 新版电子处方笺 -->
          <view
            class="left-body diagnosis-body"
            @click="diagnosisDetails(item)"
            v-if="
              JSON.parse(JSON.parse(item.content.message).content)
                .prescriptionFlag &&
              JSON.parse(JSON.parse(item.content.message).content).medicines
            "
          >
            <view>
              <view class="flex-row space-between" style="margin-bottom: 12rpx">
                <view class="done-title">已开具处方</view>
                <view
                  class="fl-row-leftNowrap"
                  v-if="
                    !(
                      item.expansion &&
                      item.expansion.status.toString() == 'CANCELLED'
                    )
                  "
                >
                  <view
                    style="font-size: 23rpx; font-weight: 400; color: #1e95ea"
                    >详情</view
                  >
                  <image
                    style="width: 27rpx; height: 27rpx"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/right-arrow-green.png"
                  >
                  </image>
                </view>
              </view>
              <view class="diagnosis-con item-con">
                <view class="item-title diagnosis-title">
                  <span class="title-text">
                    {{
                      JSON.parse(JSON.parse(item.content.message).content)
                        .diagnosisIndex == 4
                        ? "根据您描述的情况，初步诊断疑似："
                        : "根据您描述的情况，初步诊断："
                    }}
                  </span>
                </view>
                <!-- 第一次开具会全部展示，后续只是更新卡片 -->
                <view
                  class="diagnosis-text"
                  v-if="
                    [1, 2, 3].includes(
                      JSON.parse(JSON.parse(item.content.message).content)
                        .diagnosisIndex
                    )
                  "
                >
                  {{
                    diagnosisOptions.find((optionsItem) => {
                      return (
                        optionsItem.value ==
                        JSON.parse(JSON.parse(item.content.message).content)
                          .diagnosisIndex
                      );
                    }).label || ""
                  }}
                </view>
                <view
                  class="diagnosis-text ml-round"
                  v-if="
                    [4].includes(
                      JSON.parse(JSON.parse(item.content.message).content)
                        .diagnosisIndex
                    ) &&
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosis
                  "
                  >【拟】
                  {{
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosis.map((dItem) => dItem.name)
                      .join("、")
                  }}
                </view>
                <view
                  class="diagnosis-text"
                  v-if="
                    [5].includes(
                      JSON.parse(JSON.parse(item.content.message).content)
                        .diagnosisIndex
                    ) &&
                    !JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosisRemarks
                  "
                >
                  {{ "无" }}
                </view>

                <view
                  class="diagnosisRemarks"
                  v-if="
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosisRemarks
                  "
                >
                  {{
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosisRemarks
                  }}
                </view>
              </view>

              <view class="goods-title flex-row space-between">
                <view
                  >药品（共{{
                    JSON.parse(JSON.parse(item.content.message).content)
                      .medicines
                      ? JSON.parse(JSON.parse(item.content.message).content)
                          .medicines.length
                      : 0
                  }}个）</view
                >
                <view
                  class="fl-row-leftNowrap"
                  v-if="
                    parseFloat(
                      JSON.parse(JSON.parse(item.content.message).content)
                        .totalPrice
                    ) > 0
                  "
                >
                  <view style="color: black">合计：</view>
                  <view style="color: #ff5b05; font-weight: 600"
                    >￥{{
                      JSON.parse(JSON.parse(item.content.message).content)
                        .totalPrice
                    }}</view
                  >
                </view>
              </view>
              <view class="prescription-detail-new">
                <view
                  class="goods-row"
                  v-for="(bean, index) in JSON.parse(
                    JSON.parse(item.content.message).content
                  ).medicines.slice(0, 3)"
                  :key="index"
                >
                  <image
                    v-if="index > 0"
                    src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/chat-aiquest-line%402x.png"
                    style="height: 4rpx"
                  ></image>
                  <view
                    class="flex-row space-between"
                    style="white-space: nowrap; margin-top: 4rpx"
                  >
                    <view
                      style="
                        width: 300rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                      >{{ bean.name }}</view
                    >
                    <view>x {{ bean.quantity }} {{ bean.quantityUnit }}</view>
                  </view>
                </view>
                <view
                  class="pay-btn-gray fl-column-center"
                  v-if="
                    item.expansion &&
                    item.expansion.status.toString() == 'CANCELLED'
                  "
                  >处方已作废</view
                >
                <view
                  v-else
                  class="pay-btn fl-column-center"
                  @click.stop="prescriptPayBtnClick(item)"
                  >{{
                    item.expansion
                      ? prescriptionPayBtnShowEnum[item.expansion.status]
                      : "复诊开方"
                  }}</view
                >

                <view
                  class="title-row fl-column-center"
                  v-if="
                    !(
                      item.expansion &&
                      item.expansion.status.toString() == 'CANCELLED'
                    )
                  "
                >
                  {{
                    JSON.parse(JSON.parse(item.content.message).content)
                      .prescriptionExpireTime
                  }}处方失效
                </view>
                <view v-else style="height: 31rpx"></view>
              </view>
              <view
                class="outtime-image"
                v-if="
                  item.expansion &&
                  item.expansion.status.toString() == 'CANCELLED'
                "
              >
                <image
                  src="https://frontend-cdn.chongpangpang.com/image/medical-mp/chat/chat-prescription-outtime%402x.png"
                  style="height: 142rpx; width: 142rpx"
                  mode="widthFix"
                ></image>
              </view>
            </view>
          </view>
          <!-- 老版电子处方笺&处方小结 -->
          <view
            class="left-body diagnosis-body flex-row"
            v-else
            @click="diagnosisDetails(item)"
          >
            <view class="left-dot"></view>
            <view>
              <view class="diagnosis-con item-con">
                <view class="item-title diagnosis-title">
                  <span class="title-text">
                    {{
                      JSON.parse(JSON.parse(item.content.message).content)
                        .messageDescription
                    }}
                  </span>
                </view>
                <!-- 第一次开具会全部展示，后续只是更新卡片 -->
                <view
                  class="diagnosis-text"
                  v-if="
                    [1, 2, 3].includes(
                      JSON.parse(JSON.parse(item.content.message).content)
                        .diagnosisIndex
                    ) &&
                    JSON.parse(JSON.parse(item.content.message).content)
                      .operationType == 'CREATE'
                  "
                >
                  {{
                    diagnosisOptions.find((optionsItem) => {
                      return (
                        optionsItem.value ==
                        JSON.parse(JSON.parse(item.content.message).content)
                          .diagnosisIndex
                      );
                    }).label || ""
                  }}
                </view>
                <view
                  class="diagnosis-text ml-round"
                  v-if="
                    [4].includes(
                      JSON.parse(JSON.parse(item.content.message).content)
                        .diagnosisIndex
                    ) &&
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosis &&
                    JSON.parse(JSON.parse(item.content.message).content)
                      .operationType == 'CREATE'
                  "
                  >【拟】
                  {{
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosis.map((dItem) => dItem.name)
                      .join("、")
                  }}
                </view>
                <view
                  class="diagnosis-text"
                  v-if="
                    [5].includes(
                      JSON.parse(JSON.parse(item.content.message).content)
                        .diagnosisIndex
                    ) &&
                    !JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosisRemarks &&
                    JSON.parse(JSON.parse(item.content.message).content)
                      .operationType == 'CREATE'
                  "
                >
                  {{ "无" }}
                </view>

                <view
                  class="diagnosisRemarks"
                  v-if="
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosisRemarks &&
                    JSON.parse(JSON.parse(item.content.message).content)
                      .operationType == 'CREATE'
                  "
                >
                  {{
                    JSON.parse(JSON.parse(item.content.message).content)
                      .diagnosisRemarks
                  }}
                </view>
              </view>

              <view
                v-if="
                  JSON.parse(JSON.parse(item.content.message).content)
                    .prescriptionFlag
                "
                class="prescription-detail"
              >
                <view class="left">
                  <view class="first-row">
                    <view class="tag">
                      <image
                        src="https://image.henhenchina.com/61ee0fe4f58112000178d924/6f7e3e445c8a4dabb9bffae5000b6b38.png"
                      ></image>
                    </view>
                    <view>电子处方笺</view>
                  </view>
                  <view class="sec-row">
                    截至{{
                      JSON.parse(JSON.parse(item.content.message).content)
                        .prescriptionExpireTime
                    }}前有效
                  </view>
                </view>
                <view class="right">
                  <image
                    src="https://image.henhenchina.com/61ee0fe4f58112000178d924/3a0f11fad31c4a50bbe61e7b9ca79858.png"
                  >
                  </image>
                </view>
              </view>
              <view v-else class="diagnose-detail">
                <view class="tag">
                  <image
                    src="https://image.henhenchina.com/61ee0fe4f58112000178d924/6f7e3e445c8a4dabb9bffae5000b6b38.png"
                  ></image>
                </view>
                <view style="flex: 1">诊断小结</view>
                <view class="arrow">
                  <image
                    src="https://image.henhenchina.com/61ee0fe4f58112000178d924/3a0f11fad31c4a50bbe61e7b9ca79858.png"
                  >
                  </image>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- AI收集到足够的信息后给出报告 -->
        <view
          class="aiReportBox"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            JSON.parse(item.content.message).customType == 'report' &&
            JSON.parse(item.content.message).filter == false &&
            JSON.parse(item.content.message).hasReport
          "
        >
          <view class="left-ava" @click="reportCollect"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="giveTheReport">
            <view class="card-box">

            <view class="theReportTitle">
              <view class="theReportName">{{
                JSON.parse(item.content.message).reports[0].diseaseName
              }}</view>
              <view
                class="toGotoCheckTheReport"
                @click="skinToTheHoleReport(0)"
              >
                <view class="theMethodName">完整报告</view>
                <u-icon
                  name="play-right-fill"
                  color="#666666"
                  size="6"
                ></u-icon>
              </view>
            </view>
            <view class="theReportLevel">
              <view class="fill">匹配度</view>
              <image
                class="levelImage"
                :src="
                  JSON.parse(item.content.message).reports[0].matchLevelImage
                "
                mode="scaleToFill"
              />
              <view
                class="whichLevel"
                :style="{
                  color: `${
                    levelClass[
                      JSON.parse(item.content.message).reports[0].matchLevel - 1
                    ]
                  }`,
                }"
                >{{
                  matchLevel[
                    JSON.parse(item.content.message).reports[0].matchLevel - 1
                  ]
                }}</view
              >
            </view>
            <view class="theReportInfo">
              <view class="firstIllness">
                <view class="illnessTitle">疾病定义：</view>
                <view class="illnessInfo">{{
                  JSON.parse(item.content.message).reports[0].definition
                }}</view>
              </view>
              <view class="firstSaveAdvice">
                <view class="adviceTitle">治疗建议：</view>
                <view class="adviceInfo">{{
                  JSON.parse(item.content.message).reports[0]
                    .treatmentSuggestions
                }}</view>
              </view>
            </view>
            </view>
       
            <view class="theOtherIllness">
              <view
                class="simpleContent card-box"
                v-if="JSON.parse(item.content.message).reports.length >= 2"
              >
                <view class="left">
                  <view class="name">{{
                    JSON.parse(item.content.message).reports[1].diseaseName
                  }}</view>
                  <view class="right" @click="skinToTheHoleReport(1)">
                    <view class="toCheck">去查看</view>
                    <u-icon
                      name="play-right-fill"
                      color="#666666"
                      size="6"
                    ></u-icon>
                  </view>
                </view>
                <view class="right" @click="skinToTheHoleReport(1)">
                <view class="fill">匹配度</view>
                    <image
                      class="levelImage"
                      :src="
                        JSON.parse(item.content.message).reports[1].matchLevelImage
                      "
                      mode="scaleToFill"
                    />
                     <view
                      class="whichLevel"
                      :style="{
                        color: `${
                          levelClass[
                            JSON.parse(item.content.message).reports[1].matchLevel - 1
                          ]
                        }`,
                      }"
                      >{{
                        matchLevel[
                          JSON.parse(item.content.message).reports[1].matchLevel - 1
                        ]
                      }}</view
                    >
                </view>
              </view>
              <!-- <view
                class="line"
                v-if="JSON.parse(item.content.message).reports.length == 3"
              ></view> -->
              <view
                class="simpleContent card-box"
                v-if="JSON.parse(item.content.message).reports.length == 3"
              >
                <view class="left">
                  <view class="name">{{
                    JSON.parse(item.content.message).reports[2].diseaseName
                  }}</view>
                  <view class="right" @click="skinToTheHoleReport(2)">
                      <view class="toCheck">去查看</view>
                      <u-icon
                        name="play-right-fill"
                        color="#666666"
                        size="6"
                      ></u-icon>
                  </view>
                </view>
          
                <view class="right" >
                 <view class="fill">匹配度</view>
                    <image
                      class="levelImage"
                      :src="
                        JSON.parse(item.content.message).reports[2].matchLevelImage
                      "
                      mode="scaleToFill"
                    />
                     <view
                      class="whichLevel"
                      :style="{
                        color: `${
                          levelClass[
                            JSON.parse(item.content.message).reports[2].matchLevel - 1
                          ]
                        }`,
                      }"
                      >{{
                        matchLevel[
                          JSON.parse(item.content.message).reports[2].matchLevel - 1
                        ]
                      }}</view
                    >
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- AI问诊结束后的评价 -->
        <view
          class="theErrorAdvice"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            JSON.parse(item.content.message).customType == 'error'
          "
        >
          <view class="errorInSQL">
            <u-popup
              :show="showThroughError"
              @close="close"
              :round="10"
              mode="center"
              :customStyle="{
                width: '300px',
              }"
              :safeAreaInsetBottom="false"
            >
              <view class="errorContent">
                <view class="errorInfo">
                  {{ JSON.parse(item.content.message).errorMsg }}
                </view>
                <view class="skinPeo" @click="notInSQLMethod">
                  返回在线问诊
                </view>
              </view>
            </u-popup>
          </view>
        </view>
        <view
          class="theEndAdvice"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            JSON.parse(item.content.message).customType == 'report' &&
            JSON.parse(item.content.message).hasReport == false &&
            JSON.parse(item.content.message).filter != true
          "
        >
          <view class="left-ava" @click="reportCollect"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="notInSQL">
            <view class="content"
              >很抱歉！基于当前信息，豚豚医生暂无法做出有效判断。您可尝试重新选择症状再测一次或转人工问诊。</view
            >
            <view class="skinToQuick" @click="notInSQLMethod"> 智能问诊 </view>
          </view>
        </view>
        <!-- 引流之后用户跳转人工显示报告页 -->
        <view
          class="aiReportBoxNotAi"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            JSON.parse(item.content.message).customType == 'report' &&
            JSON.parse(item.content.message).filter != true &&
            inquiryType != 'AI_INQUIRY'
          "
        >
          <view class="giveTheReport">
            <view class="theReportTitle">
              <view class="theReportName">智能问诊结论</view>
              <view
                class="toGotoCheckTheReport"
                @click="skinToTheHoleReport(0)"
              >
                <view class="theMethodName">完整报告</view>
                <u-icon
                  name="play-right-fill"
                  color="#666666"
                  size="6"
                ></u-icon>
              </view>
            </view>
            <view class="theReportEndAiContent">
              <view
                class="theReportEndAiContentItem"
                v-for="(ill, index) in JSON.parse(item.content.message).reports"
              >
                <view class="illnessName">{{ ill.diseaseName }}</view>
                <view class="level">匹配度</view>
                <view class="levelInfo">{{
                  matchLevel[ill.matchLevel - 1]
                }}</view>
              </view>
            </view>
            <view class="aiHistoryMessage" @click="skinHistoryMessage">
              <view class="historyMessage">聊天记录</view>
              <u-icon name="play-right-fill" color="#666666" size="6"></u-icon>
            </view>
          </view>
        </view>
        <!-- 引流之后用户跳转人工显示信息过少 -->
        <view
          class="aiReportBoxNotAi"
          v-if="
            item.messageType == 'RCMedicalCustomMsg' &&
            JSON.parse(item.content.message).customType == 'error' &&
            JSON.parse(item.content.message).filter != true &&
            inquiryType != 'AI_INQUIRY'
          "
        >
          <view class="giveTheReport">
            <view class="theReportTitle">
              <view class="theReportName">智能问诊结论</view>
            </view>
            <view class="theReportEndAiContentError">
              <view class="itemContent"> 信息过少，无法判断 </view>
              <view class="line"></view>
            </view>
            <view class="aiHistoryMessage">
              <view class="historyMessage">聊天记录</view>
              <u-icon name="play-right-fill" color="#666666" size="6"></u-icon>
            </view>
          </view>
        </view>
        <view
          class="theEnd"
          v-if="
            item.content.extra == 'CONSULTATION:END' &&
            inquiryType == 'AI_INQUIRY' &&
            isCancleSheet == true
          "
        >
          <view class="left-ava" @click="reportCollect"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="allGoodBadBox">
            <view class="aIGoodOrBad" v-if="sheetState < 3">
              <view class="aIGoodOrBadStepBox">
                <view class="goodcontent">请对本次服务进行评价 </view>
                <view class="goodOrBadIcon">
                  <!-- ai评论在业务上，只会收集第一次的结果不考虑误触以及点击错误等场景且已经评价过的订单在后续查询记录时，该区域不会显示 -->
                  <view
                    class="conmmon-item"
                    v-for="(icon, index) in commonList"
                    @click.once="commandMethod(icon.id)"
                    :class="{ actived: isSelected(icon.id) }"
                  >
                    <image
                      :src="icon.icon"
                      mode="scaleToFill"
                      class="item-icon"
                    />
                    <view class="common-name">
                      {{ icon.name }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="afterAISkin">
              <view class="skinTitle">如有更多疑问</view>
              <view
                class="skinItme"
                @click="skinItemMethod(index)"
                v-for="(skin, index) in entrInfo"
                :key="index"
              >
                {{ skin.name }}
              </view>
              <!-- 附近门店做特殊处理，根据字段中所携带的值判断是否显示 -->
              <view
                v-if="isShowLocalShop"
                class="skinItme"
                @click="skinItemMethod(3)"
              >
                附近门店
              </view>
            </view>
            <view class="safeBottom" style="width: 100%; height: 80px"> </view>
          </view>
        </view>
        <view
          class="left-mes"
          v-if="item.messageType == 'RCVeterinarianCardMessage'"
        >
          <view class="left-ava" @click="reportCollect"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body">
            <view style="margin-bottom: 16rpx">
              <text style="font-size: 31rpx; margin-right: 15rpx">{{
                JSON.parse(item.content.message).userName
              }}</text>
              <text style="color: rgba(0, 0, 0, 0.65)">{{
                JSON.parse(item.content.message).title
              }}</text>
            </view>
            <view>
              {{ JSON.parse(item.content.message).inaugurationUnit }}
            </view>
            <view>
              {{ JSON.parse(item.content.message).introduction }}
            </view>
          </view>
        </view>
        <view
          class="right-mes"
          v-if="item.messageType == 'RCConsultationInfoMsg'"
        >
          <view class="right-body">
            <!-- v-if="JSON.parse(item.content.message).petId" -->
            <view>
              <view>
                爱宠名称：
                {{ JSON.parse(item.content.message).nickName }}
              </view>
              <view>
                品种：
                {{ JSON.parse(item.content.message).age }}
                &nbsp;
                <text style="padding-left: 8rpx">{{
                  JSON.parse(item.content.message).categoryName
                }}</text>
              </view>
              <view>
                性别：{{ genderEnum[JSON.parse(item.content.message).gender] }}
                <text style="padding-left: 8rpx">{{
                  sterilizationEnum[
                    JSON.parse(item.content.message).sterilizationStatus
                  ]
                }}</text>
              </view>
              <view
                v-if="
                  JSON.parse(item.content.message).weight &&
                  JSON.parse(item.content.message).weight != 0
                "
              >
                当前体重：
                {{ JSON.parse(item.content.message).weight }}kg
              </view>
              <view v-if="JSON.parse(item.content.message).dietHabit">
                主食习惯：
                {{ JSON.parse(item.content.message).dietHabit.join("、") }}
              </view>
              <view v-if="JSON.parse(item.content.message).dailyExerciseAmount">
                运动量：
                {{ JSON.parse(item.content.message).dailyExerciseAmount }}
              </view>
              <view v-if="JSON.parse(item.content.message).medicalDemand">
                问诊诉求：
                {{ JSON.parse(item.content.message).medicalDemand.join("、") }}
              </view>
              <view v-if="JSON.parse(item.content.message).vaccine">
                疫苗情况：
                {{ vaccineEnum[JSON.parse(item.content.message).vaccine] }}
              </view>
              <view v-if="JSON.parse(item.content.message).expelInsects">
                是否驱虫：
                {{
                  expelInsectsEnum[
                    JSON.parse(item.content.message).expelInsects
                  ]
                }}
              </view>
              <view v-if="JSON.parse(item.content.message).symptomType">
                症状类型：
                {{ JSON.parse(item.content.message).symptomType.join("、") }}
              </view>
              <view v-if="JSON.parse(item.content.message).symptomDuration">
                症状时长：
                {{ JSON.parse(item.content.message).symptomDuration }}
              </view>
            </view>
            <view
              v-if="JSON.parse(item.content.message).illnessDesc"
              style="
                margin-top: 20rpx;
                font-weight: bold;
                color: rgba(0, 0, 0, 0.85);
              "
            >
              {{
                JSON.parse(item.content.message).inquiryType == "NUTRITION"
                  ? "具体描述："
                  : "主诉症状："
              }}
              {{ JSON.parse(item.content.message).illnessDesc }}
            </view>
            <view
              style="
                font-weight: bold;
                color: rgba(0, 0, 0, 0.85);
                margin-top: 20rpx;
              "
              v-if="
                JSON.parse(item.content.message).inquiryType ===
                'REPORT_INTERPRETATION'
              "
            >
              报告解读目的：{{
                JSON.parse(item.content.message).interpretationPurpose
              }}
            </view>
          </view>
          <view class="right-ava"
            ><image :src="userAvatarUrl || avatarUrl" alt=""
          /></view>
        </view>
        <view
          class="right-mes"
          v-if="
            item.messageType === 'RCMedicalCustomMsg' &&
            JSON.parse(item.content.message).msgType === 'HISTORY_PRESCRIPTION'
          "
        >
          <view class="right-body">
            <view>历史处方</view>
            <view>
              诊断：
              {{
                JSON.parse(JSON.parse(item.content.message).content).diagnosis
              }}</view
            >
            <view
              >药品：{{
                JSON.parse(JSON.parse(item.content.message).content).medicines
              }}</view
            >
          </view>
          <view class="right-ava"
            ><image :src="userAvatarUrl || avatarUrl" alt=""
          /></view>
        </view>
        <view
          class="left-mes"
          v-if="item.messageType == 'RC:TxtMsg' && item.direction == 2"
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body left-text">
            <view v-html="item.content.content"></view>
          </view>
        </view>
        <view
          class="right-mes"
          v-if="item.messageType == 'RC:TxtMsg' && item.direction == 1"
        >
          <view class="right-body right-text">
            <view v-html="item.content.content"></view>
          </view>
          <view class="right-ava"
            ><image :src="userAvatarUrl || avatarUrl" alt=""
          /></view>
        </view>
        <view
          class="left-mes"
          v-if="item.messageType == 'RC:HQVCMsg' && item.direction == 2"
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body left-text">
            <!-- <audio controls>
            <source :src="item.content.remoteUrl" type="audio/aac" />
          </audio> -->
            <view
              class="audio"
              @click="
                () => {
                  playAudio(item.content.remoteUrl);
                }
              "
              >接收到音频，请点击播放</view
            >
          </view>
        </view>
        <view
          class="right-mes"
          v-if="item.messageType == 'RC:HQVCMsg' && item.direction == 1"
        >
          <view class="right-body right-text">
            <!-- <audio controls>
            <source :src="item.content.remoteUrl" type="audio/aac" />
          </audio> -->
            <view
              class="audio"
              @click="
                () => {
                  playAudio(item.content.remoteUrl);
                }
              "
              >接收到音频，请点击播放</view
            >
          </view>
          <view class="right-ava"
            ><image :src="userAvatarUrl || avatarUrl" alt=""
          /></view>
        </view>
        <view
          class="left-mes"
          v-if="item.messageType == 'RC:ImgMsg' && item.direction == 2"
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="no-border img-wrapper-left">
            <image
              class="chatImg"
              :src="item.content.imageUri"
              mode="scaleToFill"
              @click="
                () => {
                  clickImg(item.content.imageUri);
                }
              "
            />
          </view>
        </view>
        <view
          class="right-mes"
          v-if="item.messageType == 'RC:ImgMsg' && item.direction == 1"
        >
          <view class="no-border img-wrapper-right">
            <image
              class="chatImg"
              :src="item.content.imageUri"
              mode="aspectFill"
              @click="
                () => {
                  clickImg(item.content.imageUri);
                }
              "
            />
          </view>
          <view class="right-ava"
            ><image :src="userAvatarUrl || avatarUrl" alt=""
          /></view>
        </view>
        <!-- 视频消息 -->
        <view
          class="left-mes"
          v-if="item.messageType == 'RC:SightMsg' && item.direction == 2"
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="no-border video-wrapper-left">
            <!-- <video
              :show-fullscreen-btn="false"
              :show-progress="false"
              :enable-play-gesture="true"
              :show-play-btn="false"
              play-btn-position="center"
              :src="item.content.sightUrl"
            ></video> -->
            <video
              :src="item.content.sightUrl"
              :controls="true"
              :autoplay="true"
              :muted="true"
              object-fit="contain"
              :enable-progress-gesture="false"
              :show-fullscreen-btn="false"
              :show-progress="false"
              :enable-play-gesture="true"
              play-btn-position="center"
            ></video>
          </view>
        </view>
        <view
          class="right-mes"
          v-if="item.messageType == 'RC:SightMsg' && item.direction == 1"
        >
          <view class="no-border video-wrapper-right">
            <video :src="item.content.sightUrl"></video>
          </view>
          <view class="right-ava"
            ><image :src="userAvatarUrl || avatarUrl" alt=""
          /></view>
        </view>
        <view
          class="left-mes"
          v-if="item.messageType == 'RC:FileMsg' && item.direction == 2"
        >
          <view class="left-ava"
            ><image :src="item.userAvatarUrl" alt=""
          /></view>
          <view class="left-body">
            <text>对方发送了一个文件，请</text>
            <!-- <a :href="item.content.fileUrl.replace('http', 'https')" download
              >点击下载</a
            > -->
            <text
              style="color: blue"
              @click="
                () => {
                  download(item.content.fileUrl);
                }
              "
              >点击下载</text
            >
          </view>
        </view>
        <view
          class="right-mes"
          v-if="item.messageType == 'RC:FileMsg' && item.direction == 1"
        >
          <view class="right-body">
            <a>您发送了一个文件</a>
          </view>
          <view class="right-ava"
            ><image :src="userAvatarUrl || avatarUrl" alt=""
          /></view>
        </view>
      </view>
    </view>
    <!-- 平安环境下不展示 -->
    <view
      v-if="source != '30'"
      class="safeBottom"
      v-show="isShowAllSelect"
      style="height: 230px"
    ></view>
    <view
      :class="['to-bottom', 'to-bottom-init']"
      v-show="isShowToBottom && sheetState == 1 && !isKeyActive"
      @click="handleToBottom"
    >
    </view>
    <GoToChatPage :show.sync="showGoTo"></GoToChatPage>
  </scroll-view>
</template>

<script>
import { initTime } from "@/utils/index.js";
import { mapState, mapMutations } from "vuex";
// import * as RongIMLib from "@rongcloud/imlib-next";
import {
  ConversationType as RYConversationType,
  TextMessage as RYTextMessage,
  sendMessage as RYsendMessage,
  updateMessageExpansion as RYupdateMessageExpansion,
  ErrorCode as RYErrorCode,
} from "@/pagesA/components/rongyunCloud/imlib-next.index.esm";
import { handleLastMes } from "@/pagesA/components/rongyunCloud/ryConnect";
import { debounce } from "@/utils/index";
import {
  CAN_I_ASK_V2,
  CHAT_AIQUEST_CARD_CLICK_UPLOAD,
  GET_AIQUEST_CARD_CLICK_UPLOAD,
  GET_AIQUEST_UPLOAD,
  GET_BANNER_INFO,
  GET_RESOURCE_LIST_IN_POP,
} from "@/api";
import { action_report } from "@/utils/track";
import OutOfStockPop from "@/pagesA/electronPrescription/components/outOfStockPop/index.vue";
import { getCheckMedical, getPrescriptionList } from "@/api/sheets";
import GoToChatPage from "@/components/goToChatPage/index.vue";
import store from "@/store";
export default {
  components: { GoToChatPage, OutOfStockPop },
  options: { styleIsolation: "shared" },
  props: {
    isShowAllSelect: {
      typeof: Boolean,
    },
    isShowLocalShop: {
      typeof: Boolean,
    },
    inquiryType: {
      typeof: String,
    },
    entrInfo: {
      type: Array,
    },
    sheetState: {
      type: Number,
    },
    chatMessage: {
      type: Array,
    },
    keyBoardHeight: {
      type: Number,
    },
    hasMore: {
      type: Boolean,
    },
    groupId: {
      type: String,
    },
    // lastMesSentTime: {
    //   type: String,
    // },
    diagnosticSheetId: {
      type: String,
    },
    sheetId: {
      typeof: String,
    },
    petId: {
      typeof: String,
    },
    petIdStr: {
      typeof: String,
    },
    isShowImages: {
      typeof: Boolean,
      default: true,
    },
    isShowVideos: {
      typeof: Boolean,
      default: true,
    },
    isCancleSheet: {
      typeof: Boolean,
      default: true,
    },
    showThroughError: {
      typeof: Boolean,
      default: false,
    },
    userAvatarUrl: {
      typeof: String,
    },
    location: {
      typeof: Object,
    },
    source: {
      typeof: String,
      default: "",
    },
  },
  data() {
    return {
      timerId: null, //用于储存定时器的ID
      // isShowLocalShop: false,
      avatarUrl: "",
      scrollToView: "msg0",
      scrollComponent: null,
      // 初始化赋值一次
      // lastMesSentTimeLocal: this.lastMesSentTime,
      lastMesSentTimeLocal: "",
      triggered: false,
      showGoTo: false,
      levelClass: ["#42d8ae", "#9be236", "#fac336", "#ffa646"],
      commandChecked: null,
      commonList: [
        {
          id: 1,
          name: "不满意",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/badFaceDis.png",
        },
        {
          id: 2,
          name: "满意",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/goodFaceDis.png",
        },
      ],
      commonListAfter: [
        {
          id: 1,
          name: "不满意",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/badFace.png",
        },
        {
          id: 2,
          name: "满意",
          icon: "https://frontend-cdn.chongpangpang.com/image/medical-mp/aiConsultation/goodFace.png",
        },
      ],
      vaccineEnum: {
        1: "已接种",
        2: "未接种",
        3: "接种不全",
        4: "接种不详",
      },
      sterilizationEnum: {
        0: "绝育未知",
        1: "未绝育",
        2: "已绝育",
      },
      genderEnum: {
        1: "GG",
        2: "MM",
        3: "GG",
        4: "MM",
        5: "未知",
      },
      expelInsectsEnum: {
        1: "定时驱虫",
        2: "未定时驱虫",
        3: "未做驱虫",
      },
      petEnum: {
        CAT: "猫",
        DOG: "犬",
        OTHER: "异宠",
      },
      scrollFlag: false,
      timer_dm: null,
      scrollTop: "",
      diagnosisOptions: [
        {
          label: "待查，需要结合线下进一步诊断",
          value: 1,
        },
        {
          label: "用户未及时回复或终止聊天",
          value: 2,
        },
        {
          label: "据本次问诊描述，未发现异常",
          value: 3,
        },
        {
          label: "拟",
          value: 4,
        },
        {
          label: "疾病未收录",
          value: 5,
        },
      ],
      diagnosisRemarksOptions: [
        {
          label: "无",
          value: 1,
        },
        {
          label: "线下就医进一步诊断",
          value: 2,
        },
        {
          label: "建议3-7天后线上复诊",
          value: 3,
        },
        {
          label: "建议日常关注宠物状态",
          value: 4,
        },
        {
          label: "",
          value: 5,
        },
      ],
      isShowToBottom: false,
      isKeyActive: false,
      oldScrollTop: 0,
      isLockScreen: false,
      lastDocMesUid: "",
      prescriptionPayBtnShowEnum: {
        ISSUED: "购买药品",
        EXECUTED: "购药记录",
        CANCELLED: "处方已作废",
        EXPIRED: "复诊开方",
      },
      matchLevel: ["较低", "中", "较高", "高"],
      commentData: {
        commentStampOut: 0,
        content: "",
        id: "",
      },
    };
  },
  created() {},
  mounted() {
    const { userInfo } = store.state;
    this.avatarUrl = userInfo.avatarUrl;
    // // #ifdef MP-WEIXIN

    // // #endif
    // // #ifdef H5
    // this.$dsBridge.call('getUserInfo')
    // // #endif
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userInfo,
      lastMesSentTime: (state) => state.lastMesSentTime,
      isChooseImage: (state) => state.isChooseImage,
      serviceSheetsList: (state) => state.serviceSheetsList,
      pingAn: (state) => state.pingAn,
    }),
  },
  onPageScroll(e) {},
  methods: {
    close() {
      this.$emit("closeErrorPopup", false);
    },
    changeCommentInput(val) {
      console.log(val);
      this.commentData.content = val;
      this.$emit("commentSuccess", this.commentData);
    },
    focusMethod(e) {
      console.log(e);
      // this.scrollTop = 0;
      this.handleToBottom();
    },

    // 跳转报告页
    skinToTheHoleReport(index) {
      const { userId } = uni.getStorageSync("storage_info");
      if (index === 0) {
        action_report({
          action_name: "IntelligentconsultationIM_ConsultationFullReport_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
      } else {
        action_report({
          action_name: "IntelligentconsultationIM_GoView_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
      }
      // #ifdef MP-WEIXIN
      uni.navigateTo({
        url: `/pagesF/illnessReport/index?tabs=${index}&sheetId=${this.sheetId}&shareType=WECHAT_CIRCLE&userId=${userId}`,
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `${window.location.origin}/crm-medical-h5/#/pagesF/illnessReport/index?tabs=${index}&sheetId=${this.sheetId}&transparentTopBar=1`,
      });
      // #endif
    },
    // ...mapMutations(["setLastMesSentTime"]),
    ...mapMutations([
      "setIsChooseImage",
      "setHistoryPrescription",
      "setServiceSheetsList",
    ]),

    initTime,
    // 获取首页的跳转配置项

    // 新的评价交互
    commandMethod(id) {
      if (id == 2) {
        action_report({
          action_name: "IntelligentconsultationIM_thumbs-up_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
      } else {
        action_report({
          action_name: "IntelligentconsultationIM_thumbs-down_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
      }
      this.commandChecked = id;
      const newCommandArry = this.commonListAfter.find((item) => item.id == id);
      this.commonList = [newCommandArry];
      this.$emit("commentSuccess", id);
    },
    isSelected(id) {
      return this.commandChecked == id ? true : false;
    },
    // AI问诊评价下方跳转方法
    skinItemMethod(index) {
      console.log(index, this.sheetId);

      if (index === 0) {
        console.log("跳转义诊断");
        action_report({
          action_name: "IntelligentconsultationIM_FreeClinic_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/tool/inquiry/doctor?petId=${this.petIdStr}&inquiryType=QUICK&sheetId=${this.sheetId}`,
        });
        // #endif
      } else if (index === 1) {
        console.log("专家问诊");
        action_report({
          action_name: "IntelligentconsultationIM_ExpertConsultation_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/tool/inquiry/doctor?petId=${this.petIdStr}&inquiryType=EXPERT&sheetId=${this.sheetId}`,
        });
        // #endif
      } else if (index === 2) {
        console.log("在线开药");
        action_report({
          action_name:
            "IntelligentconsultationIM_Online-medication-prescription_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesE/guideApp/index?type=2`,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `/tool/inquiry/prescribe/home?petId=${this.petIdStr}&sheetId=${this.sheetId}`,
        });
        // #endif
      } else {
        console.log("附近门店");
        action_report({
          action_name: "IntelligentconsultationIM_NearbyStores_click",
          module_name: "ai_consultation",
          extend: {
            source:
              uni.getStorageSync("umt_extend").umt_code ||
              uni.getStorageSync("shareType"),
          },
        });
        // #ifdef MP-WEIXIN
        uni.navigateTo({
          url: `/pagesF/vicinityStore/index?cityCode=${this.location.cityCode}&lon=${this.location.lon}&lat=${this.location.lat}`,
        });
        // #endif
        // #ifdef H5
        this.$dsBridge.call("gotoPageThroughRoute", {
          page: `${window.location.origin}/crm-medical-h5/#/pagesF/vicinityStore/index?cityCode=${this.location.cityCode}&lon=${this.location.lon}&lat=${this.location.lat}`,
        });
        // #endif
      }
    },
    // 描述不全时跳转人工问诊
    notInSQLMethod() {
      console.log("跳转人工问诊");
      // #ifdef MP-WEIXIN
      uni.switchTab({
        url: "/pages/index/index",
      });
      // #endif
      // #ifdef H5
      this.$dsBridge.call("gotoPageThroughRoute", {
        page: `/medical/inquiry/home`,
      });
      // #endif
    },
    getDomInfo() {
      const query = uni.createSelectorQuery().in(this);
      query
        .select("#chat-window")
        .boundingClientRect((data) => {
          console.log("当前dom高度", data.height);
        })
        .exec();
    },
    scrolltoupper() {
      console.log("检测到到顶", this.hasMore);
      if (!this.hasMore) return;
      this.$emit("scrolltoupper");
    },
    myPullDownRefresh() {
      console.log("检测到到顶", this.hasMore);
      var that = this;
      this.triggered = true;
      this.$emit("scrolltoupper");
      // setTimeout(function () {
      //   that.triggered = false;
      // }, 1000);
    },
    playAudio(url) {
      const innerAudioContext = uni.createInnerAudioContext();
      innerAudioContext.src = url;
      innerAudioContext.onPlay(() => {
        console.log("开始播放");
      });
      innerAudioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
      });
      innerAudioContext.play();
    },
    clickImg(url) {
      var that = this;
      this.setIsChooseImage(true);
      // uni.$emit("previewImgLock", true);

      uni.previewImage({
        urls: [url], //需要预览的图片http链接列表，多张的时候，url直接写在后面就行了
        current: url, // 当前显示图片的http链接，默认是第一个
        success: function (res) {},
        fail: function (res) {},
        complete: function (res) {
          that.setIsChooseImage(false);
        },
      });
    },
    download(url) {
      let that = this;
      // console.log(url, encodeURI(url.replace("http:", "https:")));
      uni.downloadFile({
        url: url.replace("http:", "https:"), //下载地址，后端接口获取的链接
        success: (data) => {
          if (data.statusCode === 200) {
            uni.saveFile({
              //文件保存到本地
              tempFilePath: data.tempFilePath, //临时路径
              success: function (res) {
                console.log("下载成功" + res.savedFilePath);
                console.log(JSON.stringify(res));
                uni.showToast({
                  icon: "none",
                  mask: true,
                  title: "文件已保存!",
                  duration: 3000,
                });
              },
            });
          }
        },
        fail: (err) => {
          console.log(err);
          uni.showToast({
            icon: "none",
            mask: true,
            title: "失败请重新下载",
          });
        },
      });
    },
    handleScroll: debounce(function (e) {
      let that = this;
      if (this.scrollFlag) {
        this.scrollFlag = false;
        return;
      }
      // console.log(e.detail.scrollHeight - e.detail.scrollTop);
      // this.scrollTop = e.detail.scrollTop;
      //开始滚动时，-webkit-overflow-scrolling:auto
      // this.scrollFlag = false;
      clearTimeout(this.timer_dm);
      this.timer_dm = setTimeout(() => {
        this.scrollFlag = true;
        this.scrollTop = e.detail.scrollTop + 1;
      }, 200);
      if (this.sheetState == 1) {
        let clientHeight = 0;
        uni
          .createSelectorQuery()
          .in(this)
          .select(".wrapper")
          .boundingClientRect((result) => {
            if (result) {
              clientHeight = result.height;
              console.log(Math.ceil(e.detail.scrollTop), that.oldScrollTop);
              if (Math.ceil(e.detail.scrollTop) - that.oldScrollTop > 0) {
                // 滚动到底判断
                if (
                  e.detail.scrollHeight - e.detail.scrollTop >=
                  Math.ceil(clientHeight)
                ) {
                  // 判断是否下滑到底
                  console.log("下滑到底");
                  that.isShowToBottom = false;
                  that.isLockScreen = false;
                }
              } else {
                // 上滑后展示tag,锁屏,判断有无新消息
                console.log("上滑");
                that.isLockScreen = true;
              }
              that.oldScrollTop = e.detail.scrollTop;
            }
          })
          .exec();
      }
    }, 300),

    diagnosisDetails(item) {
      console.log("diagnosisDetails ==", item);
      if (item.expansion && item.expansion.status.toString() == "CANCELLED") {
        return;
      }
      let consultSheetId = JSON.parse(
        JSON.parse(item.content.message).content
      ).consultationSheetId;
      uni.navigateTo({
        url: `/pagesA/electronPrescription/index?id=${consultSheetId}&source=${this.source}`,
      });
    },

    // 新的电子处方笺-购买按钮点击
    prescriptPayBtnClick(item) {
      if (item.expansion) {
        const status = item.expansion.status;
        if (status == "ISSUED") {
          // ISSUED-未执行-购买药品-跳转到药品支付页;
          this.diagnosticSheetId = JSON.parse(
            JSON.parse(item.content.message).content
          ).id;
          console.log("%%%%%%%%%%%%%=", this.diagnosticSheetId);
          this.$emit("buyingMedicine", this.diagnosticSheetId);
        } else if (status == "EXECUTED") {
          //EXECUTED-已执行-购药记录-跳转到商品订单页;
          const orderNo = item.expansion.orderNo;
          uni.navigateTo({
            url: `/pagesA/bussinessOrder/orderDetail/index?orderNo=${orderNo}&source=${this.source}`,
          });
        } else if (status == "EXPIRED") {
          //EXPIRED-已过期-复诊开方-跳转到【复诊开方】页面
          const petId = JSON.parse(
            JSON.parse(item.content.message).content
          ).petId;
          console.log("&&$%^&*%^&*(====", petId, this.serviceSheetsList);

          if (this.serviceSheetsList.length) {
            console.log("showGoTo");
            return (this.showGoTo = true);
          }
          console.log("123&&$%^&*%^&*(====", petId);
          CAN_I_ASK_V2("ONLINE_PRESCRIPTION")
            .then((res) => {
              console.log("！！！！！！！！！！！&&$%^&*%^&*(====", res);
              getPrescriptionList({
                diagnosticType: "PRESCRIPTION",
                petId: petId,
              }).then((res) => {
                this.setHistoryPrescription(res.data.data[0] || {});
                //去复诊新页面
                uni.navigateTo({
                  url: `/pagesA/subsequent/index?petId=${petId}&inquiryType=ONLINE_PRESCRIPTION&source=${this.source}`,
                });
              });
              // if (res.data == 1) {
              //   //没有宠物，跳转添加宠物
              //   if (this.userPetList.length === 1 || !this.userSelectedPetId) {
              //     uni.navigateTo({
              //       url: "/pagesD/petInfo/index",
              //     });
              //     return;
              //   }
              //   if (info.type == "QUICK") {
              //     uni.navigateTo({
              //       url: `/pagesA/diseaseDesc/index?petId=${this.userSelectedPetId}&inquiryType=${info.type}`,
              //     });
              //   }
              //   if (info.type == "ONLINE_PRESCRIPTION") {
              //     this.getFirstPrescription(info);
              //   }
              // } else if (res.data == 2) {
              // //请求优惠券数据
              // GET_RESOURCE_LIST_IN_POP(type).then((resCoupon) => {
              //   this.couponCommendList = resCoupon.data;
              //   this.isCouponShow = true;
              // });
              // } else {
              //   this.isInviteShow = true;
              // }
            })
            .catch((err) => {
              console.log("err", err.message);
            });
        }
      }
    },

    // 智能卡片点击交互
    aiQuestCardDidSelect(item, index, title) {
      console.log("aiQuestCardDidSelect ==", item);
      console.log("messageUId ==", item.messageUId);
      console.log("index == ", index.toString());
      console.log("grouoId == ", this.groupId);
      if (this.sheetState != 1) {
        return;
      }
      let expansion = { optionIndex: index.toString() };

      // 发送新消息
      console.log("发送新消息。。。");
      let options;
      let conversation = {
        conversationType: RYConversationType.GROUP,
        targetId: this.groupId,
      };
      const newMessage = new RYTextMessage({
        content: title,
        extra: "文本消息",
      });
      RYsendMessage(conversation, newMessage, options)
        .then((res) => {
          console.log(res);
          if (res.code === RYErrorCode.SUCCESS) {
            console.log(res);
            console.log("新消息发送成功。。。");
            let data = res.data;
            // 发送完成后，问诊单最后一条消息 更新
            handleLastMes({
              groupId: this.groupId,
              mes: res.data,
              type: "newMes",
            });
            // 消息发送成功回调显示。
            this.$emit("sendSuccess", {
              content: {
                content: data?.content.content,
              },
              messageType: data.messageType,
              userAvatarUrl: item.avatarUrl,
              sentTime: data.sentTime,
              direction: data.messageDirection,
              messageUId: data.messageUId,
              state: this.sheetState,
            });
            // 更新消息
            console.log("开始更新消息。。。");
            RYupdateMessageExpansion(expansion, item).then((res) => {
              if (res.code === 0) {
                let data = res.data;
                console.log(res.code, "消息更新成功");
                // 上报服务
                this.uploadClickService(item, index);
                // 更新回调显示
                this.$emit("updateSuccess", item, {
                  ...item,
                  expansion: expansion,
                });
              } else {
                console.log(res.code, res.msg);
              }
            });
          } else {
            console.log("消息发送失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 卡片点击上报服务
    uploadClickService(item, index) {
      console.log("卡片点击上报服务。。。");
      CHAT_AIQUEST_CARD_CLICK_UPLOAD({
        optionIndex: index.toString(),
        questionCardUsageRecordId: JSON.parse(
          JSON.parse(item.content.message).content
        ).questionCardUsageRecordId,
        questionScriptUsageRecordId: JSON.parse(
          JSON.parse(item.content.message).content
        ).questionScriptUsageRecordId,
      })
        .then((res) => {
          console.log(res);
          console.log("上报服务成功。。。");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 跳转到底
    handleToBottom() {
      this.scrollToView = "";
      this.$nextTick(() => {
        this.scrollToView =
          "msg" + this.chatMessage[this.chatMessage.length - 1].sentTime;
        this.isShowToBottom = false;
        this.isLockScreen = false;
      });
    },
    // 换行符处理
    handleTxtMsgToHtml(content) {
      content = content.replace(/\n/g, (lineStr) => {
        return lineStr.slice(1) + "<br />";
      });

      return content;
    },
  },
  watch: {
    chatMessage: {
      handler(newV, oldV) {
        if (newV.length) {
          console.log(
            "返回页面进入watch chatMessage",
            newV,
            "是否锁屏",
            this.isLockScreen,
            "最后消息判断",
            this.lastDocMesUid,
            this.chatMessage[this.chatMessage.length - 1].messageUId
          );
          if (uni.getStorageSync("lastMesSentTime") !== newV[0].sentTime) {
            console.log("进入不等条件", newV);
            //说明是下拉了
            this.triggered = false;
            this.scrollToView = "msg" + uni.getStorageSync("lastMesSentTime");
            uni.setStorageSync("lastMesSentTime", newV[0].sentTime);
            return;
          }
          //新增显示下滑按钮逻辑
          if (this.isLockScreen) {
            //医生发的，显示按钮且更新uid
            if (this.chatMessage[this.chatMessage.length - 1]?.direction == 2) {
              if (
                this.lastDocMesUid ==
                this.chatMessage[this.chatMessage.length - 1].messageUId
              ) {
                // 说明不是新消息，是消息队列拓展,不做逻辑处理
              } else {
                this.lastDocMesUid =
                  this.chatMessage[this.chatMessage.length - 1].messageUId;
                this.isShowToBottom = true;
                return;
              }
            } else {
              this.lastDocMesUid = "";
            }
          }
          this.scrollToView = "";
          this.$nextTick(() => {
            this.scrollToView =
              "msg" + this.chatMessage[this.chatMessage.length - 1].sentTime;
          });
        }
      },
      deep: true,
      // immediate: true,
    },
    // 埋点点击AI医生头像
    reportCollect() {
      action_report({
        action_name: "IntelligentconsultationIM_AIProfilePicture_click",
        module_name: "ai_consultation",
        extend: {
          source:
            uni.getStorageSync("umt_extend").umt_code ||
            uni.getStorageSync("shareType"),
        },
      });
    },
    keyBoardHeight: function (newV, oldV) {
      this.isKeyActive = newV ? true : false;
      if (newV !== oldV) {
        this.scrollToView = "";
        this.$nextTick(() => {
          this.scrollToView =
            "msg" + this.chatMessage[this.chatMessage.length - 1].sentTime;
        });
      }
    },
    isShowImageOrVideo(arr) {
      if (arr.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  onLoad() {},
};
</script>

<style lang="scss">
@import "./index.scss";
</style>
