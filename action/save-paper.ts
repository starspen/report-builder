import {
  Table,
  TableCell,
  TableLabel,
} from "@/app/[locale]/(site-plan)/site-plan-editor/component/image-renderer";

export interface SavePaper {
  documentId: string;
  entity_cd: string;
  company_cd: string;
  name: string;
  auditUser: string;
  auditDate: string | null;
  pages: Page[];
}

export interface Page {
  pageNumber: number;
  paperWidth: number;
  paperHeight: number;
  paperSize: string;
  items: PageItem[];
}

export interface PageItem {
  name: string;
  type: string;
  text?: string;
  text_column?: string;
  x: number;
  y: number;
  fill: string;
  width: number;
  height: number;
  font: string;
  fontSize: string;
  image_src: string;
  tables?: TableCell[];
  source_table_name?: string;
  column_filter?: string;
  tableId?: string;
  labels?: TableLabel[];
  group?: string;
  group_type?: string;
  position?: "absolute" | "relative";
  repeating?: "Y" | "N";
  repeating_per_page?: "Y" | "N";
}

export interface TableColumn {
  header: string;
  text_column: string;
  x: number;
  width: number;
}

export interface tableColumn {}

export const savePaper = async (payload: SavePaper): Promise<any> => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${baseUrl}/api/template/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to save masterplan: ${err}`);
  }

  const json = await response.json();
  return json;
};

export const exportPaper = async (document_id: string): Promise<any> => {
  const mode = process.env.NEXT_PUBLIC_ENV_MODE;
  const baseUrl =
    mode === "sandbox"
      ? process.env.NEXT_PUBLIC_API_BACKEND_SANDBOX_URL
      : process.env.NEXT_PUBLIC_API_BACKEND_PRODUCTION_URL;

  if (!baseUrl) {
    throw new Error("API base URL is not defined");
  }

  const response = await fetch(`${baseUrl}/api/generatets2/${document_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to export paper: ${err}`);
  }

  const json = await response.json();
  return json;
};
