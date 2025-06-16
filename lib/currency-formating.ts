export const rupiahFormatWithScale = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const gbpFormatWithScale = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(value);
};

export const jpyFormatWithScale = (value: number) => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(value);
};

export const myrFormatWithScale = (value: number) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const sgdFormatWithScale = (value: number) => {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
  }).format(value);
};

export const usdFormatWithScale = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};

// Helper function untuk memilih format berdasarkan currency code
export const currencyFormatWithScale = (value: number, currencyCode: string) => {
  switch (currencyCode) {
    case 'IDR':
      return rupiahFormatWithScale(value);
    case 'GBP':
      return gbpFormatWithScale(value);
    case 'JPY':
      return jpyFormatWithScale(value);
    case 'MYR':
      return myrFormatWithScale(value);
    case 'SGD':
      return sgdFormatWithScale(value);
    case 'USD':
      return usdFormatWithScale(value);
    default:
      return rupiahFormatWithScale(value); // Default ke IDR jika tidak ada yang cocok
  }
}; 