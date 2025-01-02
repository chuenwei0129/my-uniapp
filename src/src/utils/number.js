export const subtractFloat = (num1, num2) => {
    // 计算小数部分的最大长度
    const decimalPlaces = Math.max(
      (num1.toString().split(".")[1] || "").length,
      (num2.toString().split(".")[1] || "").length
    );
  
    // 将数字转换为整数
    const factor = Math.pow(10, decimalPlaces);
    const int1 = Math.round(num1 * factor);
    const int2 = Math.round(num2 * factor);
  
    // 执行整数减法
    const result = (int1 - int2) / factor;
  
    return result;
  };