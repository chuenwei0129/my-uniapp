/// 在线医疗的问诊类型
const InquiryTypes = {
  QUICK: "快速问诊",
  EXPERT: "专家问诊",
  NUTRITION: "营养咨询",
  ONLINE_PRESCRIPTION: "在线开药",
  REPORT_INTERPRETATION: "报告解读",
};

export function getInquiryTypeString(type) {
  return InquiryTypes[type] || "专家问诊";
}
