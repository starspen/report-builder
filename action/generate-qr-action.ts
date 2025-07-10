"use server";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const generateQr = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/qr/generate`, {
      method: "GET",
    });

    const result = await response.json();

    if (response.status === 404) {
      return { success: result.success, message: result.message };
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${result.message || response.statusText}`
      );
    }
    return result;
  } catch (error) {
    console.error("Error generating QR:", error);
    return { success: false, message: "Error generating QR" };
  }
};

export const getNonQrData = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/qr/datanonqr`, {
      method: "GET",
    });

    const result = await response.json();

    if (response.status === 404) {
      return { success: result.success, message: result.message };
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${result.message || response.statusText}`
      );
    }
    return result;
  } catch (error) {
    console.error("Error getting non-QR data:", error);
    return { success: false, message: "Error getting non-QR data" };
  }
};

export const getWithQrData = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/qr/datawithqr`, {
      method: "GET",
    });

    const result = await response.json();

    if (response.status === 404) {
      return { success: result.success, message: result.message };
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${result.message || response.statusText}`
      );
    }
    return result;
  } catch (error) {
    console.error("Error getting QR data:", error);
    return { success: false, message: "Error getting QR listing data" };
  }
};

export const getSingleData = async (entity_cd: string, reg_id: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/qr/get-single-asset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          entity_cd,
          reg_id,
        },
      ]),
    });

    const result = await response.json();

    if (response.status === 404) {
      return { success: result.success, message: result.message };
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${result.message || response.statusText}`
      );
    }
    return result;
  } catch (error) {
    console.error("Error getting single QR data:", error);
    return { success: false, message: "Error getting single QR data" };
  }
};

// export const getSingleData = async (entity_cd: string, reg_id: string) => {
//   try {
//     const response = await fetch(`${process.env.API_URL}/get-asset`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify([
//         {
//           entity_cd,
//           reg_id,
//         },
//       ]),
//     });

//     const result = await response.json();

//     if (response.status === 404) {
//       return { success: result.success, message: result.message };
//     }

//     if (!response.ok) {
//       throw new Error(
//         `HTTP error! status: ${result.message || response.statusText}`,
//       );
//     }
//     return result;
//   } catch (error) {
//     console.error("Error getting single QR data:", error);
//     return { success: false, message: "Error getting single QR data" };
//   }
// };

export const getManyData = async (
  dataArray: Array<{ entity_cd: string; reg_id: string }>
) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/qr/get-many-asset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataArray),
    });

    const result = await response.json();

    if (response.status === 404) {
      return { success: result.success, message: result.message };
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${result.message || response.statusText}`
      );
    }
    return result;
  } catch (error) {
    console.error("Error getting non-QR data:", error);
    return { success: false, message: "Error getting Many QR data" };
  }
};

export const updatePrint = async (
  dataArray: Array<{ entity_cd: string; reg_id: string }>
) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/qr/update-print`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataArray),
    });

    const result = await response.json();

    if (response.status === 404) {
      return { success: result.success, message: result.message };
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${result.message || response.statusText}`
      );
    }
    return result;
  } catch (error) {
    console.error("Error updating print data:", error);
    return { success: false, message: "Error updating print data" };
  }
};

export const getAssetTrx = async (entity_cd: string, reg_id: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/qr/get-asset-trx`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          entity_cd,
          reg_id,
        },
      ]),
    });

    const result = await response.json();

    if (response.status === 404) {
      return { success: result.success, message: result.message };
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${result.message || response.statusText}`
      );
    }
    return result;
  } catch (error) {
    console.error("Error getting asset transaction data:", error);
    return { success: false, message: "Error getting asset transaction data" };
  }
};

// export const getAssetTrx = async (entity_cd: string, reg_id: string) => {
//   try {
//     const response = await fetch(`${process.env.API_URL}/get-asset-trx`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify([
//         {
//           entity_cd,
//           reg_id,
//         },
//       ]),
//     });

//     const result = await response.json();

//     if (response.status === 404) {
//       return { success: result.success, message: result.message };
//     }

//     if (!response.ok) {
//       throw new Error(
//         `HTTP error! status: ${result.message || response.statusText}`,
//       );
//     }
//     return result;
//   } catch (error) {
//     console.error("Error getting asset transaction data:", error);
//     return { success: false, message: "Error getting asset transaction data" };
//   }
// };
