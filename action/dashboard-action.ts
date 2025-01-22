"use server";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const getQuotaStamp = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/peruri/get-saldo`, {
      method: "GET",
    });
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

export const getStatusTransaction = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/finpay/get-status-transaction`, {
      method: "GET",
    });
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
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const submitData = {
      company_cd: "GQCINV",
      company_name: "PT. First Jakarta International",
      payment_cd: "PVIWXC",
      customer: {
        email: "ahmad.prasetyo@ifca.co.id",
        // name: "Ahmad Donny Prasetyo",
        firstName: "Ahmad",
        lastName: "Donny Prasetyo",
        mobilePhone: "+6285710008512",
      },
      order: {
        amount: data.total,
        description: "Top Up Quota",
        itemAmount: data.quota,
      },
      url: {
        callbackUrl: `${url}/api/finpay/notification`,
      },
    };

    const response = await fetch(`${url}/api/finpay/initiate-pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });
    const result = await response.json();

    if (result.statusCode === 201) {
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
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/finpay/get-transaction`, {
      method: "GET",
    });
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
