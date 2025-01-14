"use server";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const getQuotaStamp = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `http://sandbox-finpay.ifca.co.id`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/manage/get-kuota-transaction?company_cd=GQCINV`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    // if (result.statusCode === 200) {
    if (result.success === true) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const getStatusTransaction = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `http://sandbox-finpay.ifca.co.id`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/manage/count-status-transaction?email=demo.fji@ifca.co.id&company_cd=GQCINV`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const topUpQuota = async (data: any) => {
  const submitData = {
    company_cd: "GQCINV",
    company_name: "PT. First Jakarta International",
    payment_cd: "PVIWXC",
    customer: {
      email: "ahmad.prasetyo@ifca.co.id",
      name: "Ahmad Donny Prasetyo",
      mobilePhone: "+6285710008512",
    },
    order: {
      qty: data.quota,
      amount: data.price,
      description: "Top Up Quota",
    },
    total: data.total,
    url: {
      callbackUrl: "http://sandbox-finpay.ifca.co.id/api/notification/payment",
    },
  };

  try {
    let url = "";
    if (mode === "sandbox") {
      url = `http://sandbox-finpay.ifca.co.id`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/generate/create-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });
    const result = await response.json();

    // if (result.statusCode === 201) {
    if (result.success === true) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error submit data:", error);
    return error;
  }
};

export const getTransactionSummary = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `http://sandbox-finpay.ifca.co.id`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/manage/get-data-transaction?email=ahmad.prasetyo@ifca.co.id&company_cd=GQCINV&status=`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};
