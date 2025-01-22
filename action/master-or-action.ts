"use server";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const getTypeReceipt = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/type/get-or`, {
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

export const getTypeInvoiceById = async (id: number | string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/type/get/${id}`, {
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

export const getTypeInvoiceDetailById = async (id: number | string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/type-dtl/get/${id}`, {
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

export const insertTypeInvoice = async (data: any) => {
  const dataInsert = {
    type_cd: data.typeCd,
    type_descs: data.typeDescs,
    status: "Y",
    approval_pic: data.approvalPic,
  };

  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/type/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataInsert),
    });
    const result = await response.json();

    if (result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error insert data:", error);
    return error;
  }
};

export const updateTypeInvoice = async (data: any) => {
  const dataUpdate = {
    type_id: data.typeId,
    type_cd: data.typeCd,
    type_descs: data.typeDescs,
    status: "Y",
    approval_pic: data.approvalPic,
  };

  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/type/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUpdate),
    });
    const result = await response.json();

    if (result.statusCode === 200) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error update data:", error);
    return error;
  }
};

export const deleteTypeInvoice = async (id: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/type/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error update data:", error);
    return error;
  }
};

export const insertAssignmentInvoice = async (data: any) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/user/assign/type-approval`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error insert data:", error);
    return error;
  }
};
