"use server";
import { auth } from "@/lib/auth";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const getInvoiceSchedule = async (
  startDate: string,
  endDate: string
) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.email;


    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`
      ${url}/api/invoice/schedule/get?startDate=${startDate}&endDate=${endDate}&auditUser=${auditUser}
      `,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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

export const generateInvoiceSchedule = async (
  doc_no: string,
  project_no: string,
  debtor_acct: string,
  trx_type: string,
  related_class: string,
  entity_cd: string,
  email_addr: string
) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;
    const data = {
      doc_no,
      project_no,
      debtor_acct,
      trx_type,
      related_class,
      entity_cd,
      email_addr,
      auditUser
    }

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/invoice/schedule/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    console.log(result)

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

export const getInvoiceManual = async (startDate: string, endDate: string) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.email;


    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`
      ${url}/api/invoice/manual/get?startDate=${startDate}&endDate=${endDate}&auditUser=${auditUser}
      `,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
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

export const generateInvoiceManual = async (
  doc_no: string,
  project_no: string,
  debtor_acct: string,
  trx_type: string,
  entity_cd: string,
  email_addr: string,
  related_class: string,
) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;
    const data = {
      doc_no,
      project_no,
      debtor_acct,
      trx_type,
      entity_cd,
      email_addr,
      related_class,
      auditUser
    }

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/invoice/manual/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

export const getInvoiceProforma = async (
  startDate: string,
  endDate: string
) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.email;

    const data = {
      startDate: startDate,
      endDate: endDate,
      auditUser: auditUser,
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice-proforma`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export const generateInvoiceProforma = async (
  docNo: string,
  relatedClass: string
) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/invoice-proforma-generate/?doc_no=${docNo}&related_class=${relatedClass}&name=${auditUser}`,
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

export const getInvoiceList = async () => {
  try {
    const session = await auth();
    const auditUser = session?.user?.email;

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/invoice-approval-list/${auditUser}`,
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

export const cancelInvoice = async (docNo: string, processId: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const data = {
      doc_no: docNo,
      process_id: processId,
    };

    const response = await fetch(`${url}/api/invoice/blast-cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error cancel data:", error);
    return error;
  }
};

export const submitInvoiceEmail = async (
  docNo: string,
  processId: string,
  relatedClass: string,
  doc_amt: string,
  entity_cd: string,
  project_no: string,
  debtor_acct: string,
) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;

    const data = {
      doc_no: docNo,
      process_id: processId,
      audit_user: auditUser,
      related_class: relatedClass || "DF",
      doc_amt,
      type_cd: relatedClass || "DF",
      entity_cd,
      project_no,
      debtor_acct,
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice-submit`, {
      // const response = await fetch(`${url}/api/invoice/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export const deleteInvoice = async (docNo: string, processId: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/invoice-delete/${docNo}/${processId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

export const getInvoiceApprovalByUser = async () => {
  try {
    const session = await auth();
    const approvalUser = session?.user?.email;

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/get-approval-user/${approvalUser}`,
      // `${url}/api/invoice/approval/${approvalUser}`,
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

export const getInvoiceApprovalHistoryByUser = async (
  startDate: string,
  endDate: string
) => {
  try {
    const session = await auth();
    const approvalUser = session?.user?.email;

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/get-approval-history/${approvalUser}?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const getInvoiceApprovalHd = async (processId: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/get-approval/${processId}`, {
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

export const getInvoiceApprovalDetail = async (processId: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/get-approval-dtl/${processId}`, {
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

export const submitInvoiceApproval = async (data: any) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.email;

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    let queryParams = `doc_no=${data.docNo}&process_id=${data.process_id}&approval_user=${auditUser}&approval_status=${data.approvalStatus}&approval_level=${data.approvalLevel}`;
    if (data.approvalStatus === "A") {
      queryParams += `&approval_remarks=Approved by ${auditUser}`;
    } else {
      queryParams += `&approval_remarks=${data.approvalRemark}`;
    }

    const response = await fetch(`${url}/api/invoice-approve?${queryParams}`, {
      method: "GET",
    });
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error submit data:", error);
    return error;
  }
};

// export const submitInvoiceApproval = async (data: any) => {
//   try {
//     console.log(data)
//     const session = await auth();
//     const auditUser = session?.user?.email;
//     const body = {
//       doc_no: data.docNo,
//       process_id: data.process_id,
//       status_approve: data.approvalStatus,
//       email: auditUser,
//       approval_remarks: data.approvalRemark,
//     }
//     console.log(JSON.stringify(body))
//     let url = "";
//     if (mode === "sandbox") {
//       url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
//     } else {
//       url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
//     }


//     const response = await fetch(`${url}/api/invoice/approve`, 
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body:JSON.stringify(body),
//       });
//     const result = await response.json();

//     if (result.statusCode === 200) {
//       return result;
//     } else {
//       return result;
//     }
//   } catch (error) {
//     console.error("Error submit data:", error);
//     return error;
//   }
// };

export const getInvoiceEmail = async () => {
  const session = await auth();
  const auditUser = session?.user?.email;
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice/email/${auditUser}`, {
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

export const uploadFakturPajak = async (data: any) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/upload-faktur/${data.get("docNo")}`,
      {
        method: "POST",
        body: data,
      }
    );
    const result = await response.json();

    if (result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error upload file:", error);
    return error;
  }
};

export const sendInvoiceEmail = async (docNo: string, processId: string) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/mail/blast-email-inv/${docNo}/${processId}/${auditUser}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error sending data:", error);
    return error;
  }
};

export const getInvoiceEmailHistorySuccess = async (
  startDate: string,
  endDate: string
) => {
  const session = await auth();
  const auditUser = session?.user?.email;
  try {
    const session = await auth();
    const auditUser = session?.user?.name;
    const data = {
      startDate: startDate,
      endDate: endDate,
      status: "S",
      auditUser
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice/email-history`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
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

export const getInvoiceEmailHistoryFailed = async (
  startDate: string,
  endDate: string
) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;
    const data = {
      startDate: startDate,
      endDate: endDate,
      status: "F",
      auditUser
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice/email-history`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
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

export const resendInvoiceEmail = async (
  docNo: string,
  processId: string,
  email: string
) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/mail/resend-inv?doc_no=${docNo}&process_id=${processId}&email=${email}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const stampInvoice = async (fileName: string, fileType: string, processId: string) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;

    const data = {
      company_cd: "EPBOIQ",
      file_name: fileName,
      file_type: fileType,
      audit_user: auditUser,
      process_id: processId
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/peruri/stamp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export const regenerateInvoiceEmail = async (
  docNo: string,
  processId: string
) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const submitData = {
      doc_no: docNo,
      process_id: processId,
    };

    const response = await fetch(`${url}/api/mail/request-regenerate-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const noStampInvoice = async (docNo: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/peruri/no-stamp/${docNo}`, {
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

export const getInvoiceStampSuccess = async () => {
  const session = await auth();
  const auditUser = session?.user?.email;
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice/stamp/S/${auditUser}`, {
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

export const getInvoiceStampFailed = async () => {
  const session = await auth();
  const auditUser = session?.user?.email;
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice/stamp/F/${auditUser}`, {
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

export const reStampInvoice = async (fileName: string, fileType: string, processId: string) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;

    const data = {
      company_cd: "EPBOIQ",
      file_name: fileName,
      file_type: fileType,
      audit_user: auditUser,
      process_id: processId
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/peruri/stamp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export const getInvoiceStampHistory = async (
  startDate: string,
  endDate: string
) => {
  try {
    const data = {
      company_cd: "EPBOIQ",
      startDate: startDate,
      endDate: endDate,
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/invoice/stamp-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

export const downloadInvoiceStampHistory = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/download?start_date=${startDate}&end_date=${endDate}`,
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

export const getInvoiceInquiry = async (startDate: string, endDate: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/invoice-inqueries?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};

export const deleteFakturPajak = async (docNo: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/delete-faktur/${docNo}`, {
      method: "DELETE",
    });
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return error;
  }
};

export const uploadAdditionalFile = async (data: any) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/upload-extra-file`, {
      method: "POST",
      body: data,
    });
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error upload file:", error);
    return error;
  }
};

export const deleteAdditionalFile = async (docNo: string, fileName: string) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/delete-extra-file/invoice?doc_no=${docNo}&file_name=${fileName}`,
      {
        method: "DELETE",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return error;
  }
};

export const completeInvoiceEmail = async (
  docNo: string,
  processId: string
) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const data = {
      doc_no: docNo,
      process_id: processId,
    };

    const response = await fetch(`${url}/api/mail/complete/invoice`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error completing data:", error);
    return error;
  }
};

export const getInvoiceEmailHistoryCompleted = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(
      `${url}/api/invoice/completed?start_date=${startDate}&end_date=${endDate}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();

    if (result.statusCode === 200 || result.statusCode === 201) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return error;
  }
};