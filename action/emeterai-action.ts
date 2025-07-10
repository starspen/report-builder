"use server";

import { mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import { url } from "inspector";
import { auth } from "@/lib/auth";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const getUnsignEmeterai = async (source: string) => {
  console.log(source);
  try {
    const session = await auth();
    const auditUser = session?.user?.email;
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    let response;
    if (source === "x") {
      console.log("pending emeterai from x");
      response = await fetch(`${url}/api/getUnsignedEmaterai/${source}`, {
        method: "GET",
      });
      const result = await response.json();
      //  console.log(result)
      return result;
    } else if (source === "pb") {
      console.log("pending emeterai from pb");
      response = await fetch(`${url}/api/receipt/stamp/S/${auditUser}`, {
        method: "GET",
      });
      const result = await response.json();
      //  console.log(result)
      return result;
    }
  } catch (error) {
    console.error("Error getting unsign emeterai:", error);
    return { success: false, message: "Error getting unsign emeterai" };
  }
};
export const getFailedEmeterai = async (source: string) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.email;
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    let response;
    if (source === "x") {
      console.log("failed emeterai from x");
      response = await fetch(`${url}/api/getFailedEmaterai/${source}`, {
        method: "GET",
      });
      const result = await response.json();
      console.log(result);
      return result;
    } else if (source === "pb") {
      console.log("failed emeterai from pb");
      response = await fetch(`${url}/api/invoice/stamp/F/${auditUser}`, {
        method: "GET",
      });
      const result = await response.json();
      console.log(result);
      return result;
    }
  } catch (error) {
    console.error("Error getting unsign emeterai:", error);
    return { success: false, message: "Error getting unsign emeterai" };
  }
};

export const getStampHistoryX = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/getStampHistory`, {
      method: "GET",
    });
    const result = await response.json();
    console.log("result", result.data);
    return result;
  } catch (error) {
    console.error("Error getting unsign emeterai:", error);
    return { success: false, message: "Error getting unsign emeterai" };
  }
};

interface StampDocument {
  doc_no: string;
  resource_url: string;
}

interface StampBody {
  doc_no: string;
  file_name: string;
  file_token?: string;
  file_serial_number?: string;
  file_status: string;
  company_cd: string;
}

export const stampingFile = async (stampBody: StampBody) => {
  const session = await auth();
  const access_token = session?.user?.accessToken;
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }
    const response = await fetch(`${url}/api/emeterai/stamp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(stampBody),
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
    console.error("Stamping Failed : ", error);
    return { success: false, message: "Stamping Failed" };
  }
};

export const stampingEmeterai = async (stampDocs: StampDocument[]) => {
  try {
    // Buat folder jika belum ada
    const uploadDir = path.join(process.cwd(), "public/uploads/emeterai");

    await mkdir(uploadDir, { recursive: true });

    const results = await Promise.all(
      stampDocs.map(async ({ resource_url, doc_no }) => {
        try {
          // Ambil nama file dari URL
          const fileName = path.basename(doc_no);

          // Download file dari resource_url
          const response = await fetch(resource_url);

          if (!response.ok) {
            throw new Error(`Download file failed from ${resource_url}`);
          }

          // Konversi response ke array buffer
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const signedFilePath = path.join(uploadDir, `${fileName}_signed.pdf`);

          fs.writeFileSync(signedFilePath, buffer);

          return {
            success: true,
            doc_no,
            path: `/uploads/emeterai/${fileName}_signed.pdf`,
          };
        } catch (error) {
          return {
            success: false,
            doc_no,
            error: `Failed to process file: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          };
        }
      })
    );
    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    return {
      success: false,
      message: "Failed to save file",
    };
  }
};
