import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * helper function for getting the max value in my graphing data
 */
export const getMaxValue = (data, key) => {
  return Math.max(...data.map((item) => Math.abs(item[key])));
};

const formatNumber = (value) => {
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return {
      value: value / 1000000,
      suffix: "M",
    };
  } else if (absValue >= 1000) {
    return {
      value: value / 1000,
      suffix: "k",
    };
  }
  return {
    value: value,
    suffix: "",
  };
};

export const formatYAxisTick = (value, key) => {
  const { value: formattedValue, suffix } = formatNumber(value);
  return `$${formattedValue}${suffix}`;
};

export const formatTooltipValue = (value, key) => {
  const { value: formattedValue, suffix } = formatNumber(value);
  if (suffix === "k") {
    return [`$${formattedValue.toFixed(0)}${suffix}`];
  }
  return [`$${formattedValue.toFixed(3)}${suffix}`];
};
