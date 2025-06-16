import React from "react";

const formatCurrencyIDR = (amount: number): string =>
  new Intl.NumberFormat("id-ID", {
    // style: "currency",
    // currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace(/\s+/g, "");

export default formatCurrencyIDR;