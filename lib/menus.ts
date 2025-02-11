export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
  visible?: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
  visible?: boolean;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(
  pathname: string,
  t: any,
  session: any,
  menu: any
): Group[] {
  const isAdmin = session?.user?.role === "administrator";
  const isMaker = session?.user?.role === "maker and blaster";
  const isApprover = session?.user?.role === "approver";
  const hasInvoiceData = menu?.hasInvoiceData;
  const hasOrData = menu?.hasOrData;

  return [
    {
      groupLabel: "Dashboard",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard/home",
          label: "Dashboard",
          active: pathname.includes("/dashboard/home"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Master",
      id: "master-data",
      menus: [
        {
          id: "master-data",
          href: "#",
          label: "Master Data",
          active: pathname.includes("/master-data/user"),
          icon: "heroicons-outline:list-bullet",
          submenus: [
            {
              href: "/master-data/user",
              label: "User",
              active: pathname === "/master-data/user",
              icon: "heroicons-outline:user",
              children: [],
            },
            {
              href: "/master-data/type-invoice",
              label: "Type Invoice",
              active: pathname === "/master-data/type-invoice",
              icon: "heroicons-outline:document-duplicate",
              children: [],
            },
            {
              href: "/master-data/assignment-invoice",
              label: "Assignment Invoice",
              active: pathname === "/master-data/assignment-invoice",
              icon: "heroicons-outline:user-group",
              children: [],
            },
            {
              href: "/master-data/type-receipt",
              label: "Type Receipt",
              active: pathname === "/master-data/type-receipt",
              icon: "heroicons-outline:document-duplicate",
              children: [],
            },
            {
              href: "/master-data/assignment-receipt",
              label: "Assignment Receipt",
              active: pathname === "/master-data/assignment-receipt",
              icon: "heroicons-outline:user-group",
              children: [],
            },
          ],
          visible: isAdmin,
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "Pages",
      id: "invoice",
      menus: [
        {
          id: "invoice",
          href: "#",
          label: "Invoice",
          active: pathname.includes("/invoice"),
          icon: "heroicons-outline:document-text",
          submenus: [
            {
              href: "#",
              label: "Generate Invoice",
              active: pathname === "/invoice/generate/schedule",
              icon: "heroicons-outline:document-plus",
              children: [
                {
                  href: "/invoice/generate/schedule",
                  label: "Invoice Schedule",
                  active: pathname === "/invoice/generate/schedule",
                },
                {
                  href: "/invoice/generate/manual",
                  label: "Invoice Manual",
                  active: pathname === "/invoice/generate/manual",
                },
                {
                  href: "/invoice/generate/proforma",
                  label: "Invoice Proforma",
                  active: pathname === "/invoice/generate/proforma",
                },
              ],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/list",
              label: "Invoice List",
              active: pathname === "/invoice/list",
              icon: "",
              children: [],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/approval",
              label: "Invoice Approval",
              active: pathname === "/invoice/approval",
              icon: "",
              children: [],
              visible: isApprover && hasInvoiceData,
            },
            {
              href: "/invoice/approval-history",
              label: "Invoice Approval History",
              active: pathname === "/invoice/approval-history",
              icon: "",
              children: [],
              visible: isApprover && hasInvoiceData,
            },
            {
              href: "/invoice/stamp",
              label: "Invoice Stamp",
              active: pathname === "/invoice/stamp",
              icon: "",
              children: [],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/stamp-history",
              label: "Invoice Stamp History",
              active: pathname === "/invoice/stamp-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/invoice/email",
              label: "Invoice Blast",
              active: pathname === "/invoice/email",
              icon: "",
              children: [],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/email-history",
              label: "Invoice Blast History",
              active: pathname === "/invoice/email-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/invoice/inquiry",
              label: "Invoice Inquiry",
              active: pathname === "/invoice/inquiry",
              icon: "",
              children: [],
            },
          ].filter((submenu) => submenu.visible !== false),
          visible:
            isAdmin ||
            (isMaker && hasInvoiceData) ||
            (isApprover && hasInvoiceData),
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "receipt",
      menus: [
        {
          id: "receipt",
          href: "#",
          label: "Official Receipt",
          active: pathname.includes("/receipt"),
          icon: "heroicons-outline:receipt-percent",
          submenus: [
            {
              href: "#",
              label: "Generate Receipt",
              active: pathname === "/receipt/generate",
              icon: "heroicons-outline:document-plus",
              children: [
                {
                  href: "/receipt/generate/schedule",
                  label: "Receipt",
                  active: pathname === "/receipt/generate/schedule",
                },
              ],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/list",
              label: "Receipt List",
              active: pathname === "/receipt/list",
              icon: "",
              children: [],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/approval",
              label: "Receipt Approval",
              active: pathname === "/receipt/approval",
              icon: "",
              children: [],
              visible: isApprover && hasOrData,
            },
            {
              href: "/receipt/approval-history",
              label: "Receipt Approval History",
              active: pathname === "/receipt/approval-history",
              icon: "",
              children: [],
              visible: isApprover && hasOrData,
            },
            {
              href: "/receipt/stamp",
              label: "Receipt Stamp",
              active: pathname === "/receipt/stamp",
              icon: "",
              children: [],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/stamp-history",
              label: "Receipt Stamp History",
              active: pathname === "/receipt/stamp-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/receipt/email",
              label: "Receipt Blast",
              active: pathname === "/receipt/email",
              icon: "",
              children: [],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/email-history",
              label: "Receipt Blast History",
              active: pathname === "/receipt/email-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/receipt/inquiry",
              label: "Receipt Inquiry",
              active: pathname === "/receipt/inquiry",
              icon: "",
              children: [],
            },
          ].filter((submenu) => submenu.visible !== false),
          visible:
            isAdmin || (isMaker && hasOrData) || (isApprover && hasOrData),
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "config",
      menus: [
        {
          id: "config",
          href: "/admin/email-config",
          label: "Email Config",
          active: pathname.includes("/admin/email-config"),
          icon: "heroicons-outline:cog-6-tooth",
          submenus: [],
          visible: isAdmin,
        },
      ].filter((menu) => menu.visible !== false),
    },
    // {
    //   groupLabel: "",
    //   id: "table",
    //   menus: [
    //     {
    //       id: "table",
    //       href: "/table/basic-table",
    //       label: t("table"),
    //       active: pathname.includes("/table"),
    //       icon: "heroicons:table-cells",
    //       submenus: [
    //         {
    //           href: "/table/basic-table",
    //           label: t("basicTable"),
    //           active: pathname === "/table/basic-table",
    //           icon: "",
    //           children: [],
    //         },
    //         {
    //           href: "/table/react-table",
    //           label: t("reactTable"),
    //           active: pathname === "/table/react-table",
    //           icon: "",
    //           children: [],
    //         },
    //         {
    //           href: "/table/data-table",
    //           label: t("advanceTable"),
    //           active: pathname === "/table/data-table",
    //           icon: "",
    //           children: [],
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];
}

export function getHorizontalMenuList(
  pathname: string,
  t: any,
  session: any,
  menu: any
): Group[] {
  const isAdmin = session?.user?.role === "administrator";
  const isMaker = session?.user?.role === "maker and blaster";
  const isApprover = session?.user?.role === "approver";
  const hasInvoiceData = menu?.hasInvoiceData;
  const hasOrData = menu?.hasOrData;

  return [
    {
      groupLabel: "Dashboard",
      id: "dashboard",
      menus: [
        {
          id: "dashboard",
          href: "/dashboard/home",
          label: "Dashboard",
          active: pathname.includes("/dashboard/home"),
          icon: "heroicons-outline:home",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Master",
      id: "master-data",
      menus: [
        {
          id: "master-data",
          href: "#",
          label: "Master Data",
          active: pathname.includes("/master-data/user"),
          icon: "heroicons-outline:list-bullet",
          submenus: [
            {
              href: "/master-data/user",
              label: "User",
              active: pathname === "/master-data/user",
              icon: "heroicons-outline:user",
              children: [],
            },
            {
              href: "/master-data/type-invoice",
              label: "Type Invoice",
              active: pathname === "/master-data/type-invoice",
              icon: "heroicons-outline:document-duplicate",
              children: [],
            },
            {
              href: "/master-data/assignment-invoice",
              label: "Assignment Invoice",
              active: pathname === "/master-data/assignment-invoice",
              icon: "heroicons-outline:user-group",
              children: [],
            },
            {
              href: "/master-data/type-receipt",
              label: "Type Receipt",
              active: pathname === "/master-data/type-receipt",
              icon: "heroicons-outline:document-duplicate",
              children: [],
            },
            {
              href: "/master-data/assignment-receipt",
              label: "Assignment Receipt",
              active: pathname === "/master-data/assignment-receipt",
              icon: "heroicons-outline:user-group",
              children: [],
            },
          ],
          visible: isAdmin,
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "Pages",
      id: "invoice",
      menus: [
        {
          id: "invoice",
          href: "#",
          label: "Invoice",
          active: pathname.includes("/invoice"),
          icon: "heroicons-outline:document-text",
          submenus: [
            {
              href: "#",
              label: "Generate Invoice",
              active: pathname === "/invoice/generate/schedule",
              icon: "heroicons-outline:document-plus",
              children: [
                {
                  href: "/invoice/generate/schedule",
                  label: "Invoice Schedule",
                  active: pathname === "/invoice/generate/schedule",
                },
                {
                  href: "/invoice/generate/manual",
                  label: "Invoice Manual",
                  active: pathname === "/invoice/generate/manual",
                },
                {
                  href: "/invoice/generate/proforma",
                  label: "Invoice Proforma",
                  active: pathname === "/invoice/generate/proforma",
                },
              ],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/list",
              label: "Invoice List",
              active: pathname === "/invoice/list",
              icon: "",
              children: [],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/approval",
              label: "Invoice Approval",
              active: pathname === "/invoice/approval",
              icon: "",
              children: [],
              visible: isApprover && hasInvoiceData,
            },
            {
              href: "/invoice/approval-history",
              label: "Invoice Approval History",
              active: pathname === "/invoice/approval-history",
              icon: "",
              children: [],
              visible: isApprover && hasInvoiceData,
            },
            {
              href: "/invoice/stamp",
              label: "Invoice Stamp",
              active: pathname === "/invoice/stamp",
              icon: "",
              children: [],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/stamp-history",
              label: "Invoice Stamp History",
              active: pathname === "/invoice/stamp-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/invoice/email",
              label: "Invoice Blast",
              active: pathname === "/invoice/email",
              icon: "",
              children: [],
              visible: isMaker && hasInvoiceData,
            },
            {
              href: "/invoice/email-history",
              label: "Invoice Blast History",
              active: pathname === "/invoice/email-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/invoice/inquiry",
              label: "Invoice Inquiry",
              active: pathname === "/invoice/inquiry",
              icon: "",
              children: [],
            },
          ].filter((submenu) => submenu.visible !== false),
          visible:
            isAdmin ||
            (isMaker && hasInvoiceData) ||
            (isApprover && hasInvoiceData),
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "receipt",
      menus: [
        {
          id: "receipt",
          href: "#",
          label: "Official Receipt",
          active: pathname.includes("/receipt"),
          icon: "heroicons-outline:receipt-percent",
          submenus: [
            {
              href: "#",
              label: "Generate Receipt",
              active: pathname === "/receipt/generate",
              icon: "heroicons-outline:document-plus",
              children: [
                {
                  href: "/receipt/generate/schedule",
                  label: "Receipt",
                  active: pathname === "/receipt/generate/schedule",
                },
              ],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/list",
              label: "Receipt List",
              active: pathname === "/receipt/list",
              icon: "",
              children: [],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/approval",
              label: "Receipt Approval",
              active: pathname === "/receipt/approval",
              icon: "",
              children: [],
              visible: isApprover && hasOrData,
            },
            {
              href: "/receipt/approval-history",
              label: "Receipt Approval History",
              active: pathname === "/receipt/approval-history",
              icon: "",
              children: [],
              visible: isApprover && hasOrData,
            },
            {
              href: "/receipt/stamp",
              label: "Receipt Stamp",
              active: pathname === "/receipt/stamp",
              icon: "",
              children: [],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/stamp-history",
              label: "Receipt Stamp History",
              active: pathname === "/receipt/stamp-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/receipt/email",
              label: "Receipt Blast",
              active: pathname === "/receipt/email",
              icon: "",
              children: [],
              visible: isMaker && hasOrData,
            },
            {
              href: "/receipt/email-history",
              label: "Receipt Blast History",
              active: pathname === "/receipt/email-history",
              icon: "",
              children: [],
              visible: isAdmin || isMaker,
            },
            {
              href: "/receipt/inquiry",
              label: "Receipt Inquiry",
              active: pathname === "/receipt/inquiry",
              icon: "",
              children: [],
            },
          ].filter((submenu) => submenu.visible !== false),
          visible:
            isAdmin || (isMaker && hasOrData) || (isApprover && hasOrData),
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "config",
      menus: [
        {
          id: "config",
          href: "/admin/email-config",
          label: "Email Config",
          active: pathname.includes("/admin/email-config"),
          icon: "heroicons-outline:cog-6-tooth",
          submenus: [],
          visible: isAdmin,
        },
      ].filter((menu) => menu.visible !== false),
    },
    // {
    //   groupLabel: "",
    //   id: "table",
    //   menus: [
    //     {
    //       id: "table",
    //       href: "/table/basic-table",
    //       label: t("table"),
    //       active: pathname.includes("/table"),
    //       icon: "heroicons:table-cells",
    //       submenus: [
    //         {
    //           href: "/table/basic-table",
    //           label: t("basicTable"),
    //           active: pathname === "/table/basic-table",
    //           icon: "",
    //           children: [],
    //         },
    //         {
    //           href: "/table/react-table",
    //           label: t("reactTable"),
    //           active: pathname === "/table/react-table",
    //           icon: "",
    //           children: [],
    //         },
    //         {
    //           href: "/table/data-table",
    //           label: t("advanceTable"),
    //           active: pathname === "/table/data-table",
    //           icon: "",
    //           children: [],
    //         },
    //       ],
    //     },
    //   ],
    // },
  ];
}
