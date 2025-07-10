"use server";
import { auth } from "@/lib/auth";

const mode = `${process.env.NEXT_PUBLIC_ENV_MODE}`;

export const getEmailConfig = async () => {
  try {
    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/mail/config`, {
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

export const submitEmailConfig = async (data: any) => {
  try {
    const session = await auth();
    const auditUser = session?.user?.name;

    const dataSubmit = {
      driver: data.mailDriver,
      host: data.mailHost,
      port: data.mailPort,
      username: data.mailUsername,
      password: data.mailPassword,
      encryption: data.mailEncryption,
      sender_name: data.mailFromName,
      sender_email: data.mailFromAddress,
      audit_user: auditUser,
    };

    let url = "";
    if (mode === "sandbox") {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL}`;
    }

    const response = await fetch(`${url}/api/mail/edit-config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataSubmit),
    });
    const result = await response.json();

    if (result.statusCode === 200) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error submit data:", error);
    return error;
  }
};
