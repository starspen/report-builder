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
  const isMaker = ["maker and blaster", "maker"].includes(session?.user?.role);
  const isBlaster = ["maker and blaster", "blaster"].includes(session?.user?.role);
  const isApprover = session?.user?.role === "approver";
  const hasOrDataMaker = menu?.data?.hasOrDataMaker
  const hasOrDataBlaster = menu?.data?.hasOrDataBlaster
  const hasOrDataApprover = menu?.data?.hasOrDataApprover

  const menuList: string[] = menu?.data?.menuList ?? [];
  const moduleList: string[] = menu?.data?.moduleList ?? [];
  console.log(menuList)
  // helper to check visibility
  const canSee = (label: string) =>
    isAdmin || menuList.includes(label);

  const canSeeModule = (label: string) => isAdmin || moduleList.includes(label)
  // console.log(canSee("Generate Invoice"))

  // console.log("user role : " + session?.user?.role)
  // console.log("menu invoice : " + menu?.hasInvoiceData)
  // console.log("menu or : " + menu?.hasOrData)

  // console.log("user isMaker : " + isMaker)
  // console.log("user isBlaster : " + isBlaster)

  const invoiceSubmenus: Submenu[] = [
    {
      href: "#",
      label: "Generate Invoice",
      active: pathname === "/invoice/generate",
      icon: "heroicons-outline:document-plus",
      children: [
        { href: "/invoice/generate/schedule", label: "Invoice Schedule", active: pathname === "" },
        { href: "/invoice/generate/manual", label: "Invoice Manual" , active: pathname === "" },
      ],
      visible: canSee("Generate Invoice") || isAdmin,
    },
    {
      href: "/invoice/list",
      label: "Invoice List",
      icon : "",
      active: pathname === "/invoice/list",
      children: [],
      visible: canSee("Invoice List") || isAdmin,
    },
    {
      href: "/invoice/approval",
      label: "Invoice Approval",
      active: pathname === "/invoice/approval",
      icon: "",
      children: [],
      visible: canSee("Invoice Approval"),
    },
    {
      href: "/invoice/approval-history",
      label: "Invoice Approval History",
      active: pathname === "/invoice/approval-history",
      icon: "",
      children: [],
      visible: canSee("Invoice Approval History"),
    },
    {
      href: "/invoice/stamp",
      label: "Invoice Stamp",
      active: pathname === "/invoice/stamp",
      icon: "",
      children: [],
      visible: (canSee("Invoice Stamp")) || isAdmin,
    },
    {
      href: "/invoice/stamp-history",
      label: "Invoice Stamp History",
      active: pathname === "/invoice/stamp-history",
      icon: "",
      children: [],
      visible: canSee("Invoice Stamp History"),
    },
    {
      href: "/invoice/email",
      label: "Invoice Blast",
      active: pathname === "/invoice/email",
      icon: "",
      children: [],
      visible: (canSee("Invoice Blast")) || isAdmin,
    },
    {
      href: "/invoice/email-history",
      label: "Invoice Blast History",
      active: pathname === "/invoice/email-history",
      icon: "",
      children: [],
      visible: isAdmin || canSee("Invoice Blast History"),
    },
    {
      href: "/invoice/inquiry",
      label: "Invoice Inquiry",
      icon : "",
      active: pathname === "/invoice/inquiry",
      children: [],
      visible: canSee("Invoice Inquiry"),
    },
  ];
  const receiptSubmenus: Submenu[] = [
    {
      href: "#",
      label: "Generate Receipt",
      active: pathname.includes("/receipt/generate"),
      icon: "heroicons-outline:document-plus",
      children: [
        { href: "/receipt/generate/schedule", label: "Receipt Schedule", active: pathname === "" },
      ],
      visible: canSee("Generate Receipt") || isAdmin,
    },
    {
      href: "/receipt/list",
      label: "Receipt List",
      icon : "",
      active: pathname === "/receipt/list",
      children: [],
      visible: canSee("Receipt List") || isAdmin,
    },
    {
      href: "/receipt/approval",
      label: "Receipt Approval",
      active: pathname === "/receipt/approval",
      icon: "",
      children: [],
      visible: canSee("Receipt Approval"),
    },
    {
      href: "/receipt/approval-history",
      label: "Receipt Approval History",
      active: pathname === "/receipt/approval-history",
      icon: "",
      children: [],
      visible: canSee("Receipt Approval History"),
    },
    {
      href: "/receipt/stamp",
      label: "Receipt Stamp",
      active: pathname === "/receipt/stamp",
      icon: "",
      children: [],
      visible: (canSee("Receipt Stamp")) || isAdmin,
    },
    {
      href: "/receipt/stamp-history",
      label: "Receipt Stamp History",
      active: pathname === "/receipt/stamp-history",
      icon: "",
      children: [],
      visible: canSee("Receipt Stamp History"),
    },
    {
      href: "/receipt/email",
      label: "Receipt Blast",
      active: pathname === "/receipt/email",
      icon: "",
      children: [],
      visible: (canSee("Receipt Blast")) || isAdmin,
    },
    {
      href: "/receipt/email-history",
      label: "Receipt Blast History",
      active: pathname === "/receipt/email-history",
      icon: "",
      children: [],
      visible: isAdmin || canSee("Receipt Blast History"),
    },
    {
      href: "/receipt/inquiry",
      label: "Receipt Inquiry",
      icon : "",
      active: pathname === "/receipt/inquiry",
      children: [],
      visible: canSee("Receipt Inquiry"),
    },
  ];

  // filter out the hidden ones
  const filteredInvoiceSubmenus = invoiceSubmenus.filter(s => s.visible);
  const filteredReceiptSubmenus = receiptSubmenus.filter(s => s.visible);
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
            // {
            //   href: "/master-data/amount",
            //   label: "Amount Range",
            //   active: pathname === "/master-data/amount",
            //   icon: "heroicons-outline:user",
            //   children: [],
            // },
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
            // {
            //   href: "/master-data/assignment-invoice",
            //   label: "Assignment Invoice",
            //   active: pathname === "/master-data/assignment-invoice",
            //   icon: "heroicons-outline:user-group",
            //   children: [],
            // },
            {
              href: "/master-data/assignment-invoice-copy",
              label: "Assignment Invoice",
              active: pathname === "/master-data/assignment-invoice-copy",
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
            // {
            //   href: "/master-data/assignment-receipt",
            //   label: "Assignment Receipt",
            //   active: pathname === "/master-data/assignment-receipt",
            //   icon: "heroicons-outline:user-group",
            //   children: [],
            // },
            {
              href: "/master-data/assignment-receipt-copy",
              label: "Assignment Receipt",
              active: pathname === "/master-data/assignment-receipt-copy",
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
          submenus: filteredInvoiceSubmenus,
          visible:
            isAdmin ||
            filteredInvoiceSubmenus.length > 0,
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
          submenus: filteredReceiptSubmenus,
          visible:
            isAdmin ||
            filteredReceiptSubmenus.length > 0,
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "assets",
      menus: [
        {
          id: "assets",
          href: "#",
          label: "Assets",
          active: pathname.includes("/assets"),
          icon: "heroicons-outline:receipt-percent",
          submenus: [
            {
              href: "/assets/generate-qr",
              label: "Generate QR",
              active: pathname === "/assets/generate-qr",
              icon: "",
              children: [],
              visible: true,
            },
            {
              href: "/assets/print-qr",
              label: "Print QR",
              active: pathname === "/assets/print-qr",
              icon: "",
              children: [],
              visible: true,
            },
          ].filter((submenu) => submenu.visible !== false),
          visible: true,
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
    {
      groupLabel: "",
      id: "system-admin",
      menus: [
        {
          id: "system-admin",
          href: "/system-admin",
          label: "System Admin",
          active: pathname.includes("/system-admin"),
          icon: "heroicons:user-group",
          visible: isAdmin,
          submenus: [
            {
              href: "/system-admin/users",
              label: "Users",
              active: pathname.includes("/system-admin/users"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
            {
              href: "/system-admin/assign-user",
              label: "Assign User",
              active: pathname.includes("/system-admin/assign-user"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
            {
              href: "/system-admin/modules",
              label: "Modules",
              active: pathname.includes("/system-admin/modules"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
            {
              href: "/system-admin/menus",
              label: "Menus",
              active: pathname.includes("/system-admin/menus"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
            {
              href: "/system-admin/todo",
              label: "Todo",
              active: pathname.includes("/system-admin/todo"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
          ].filter((submenu) => submenu.visible !== false),
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "emeterai",
      menus: [
        {
          id: "emeterai",
          href: "/emeterai",
          label: "Emeterai",
          active: pathname.includes("/emeterai"),
          icon: "lucide:stamp",
          visible: isAdmin,
          submenus: [
            {
              href: "/emeterai/stamp",
              label: "Stamp",
              active: pathname === "/emeterai/stamp",
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
            {
              href: "/emeterai/stamp-history",
              label: "Stamp History",
              active: pathname.includes("/emeterai/stamp-history"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
          ].filter((submenu) => submenu.visible !== false),
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
  const isMaker = ["maker and blaster", "maker"].includes(session?.user?.role);
  const isBlaster = ["maker and blaster", "blaster"].includes(session?.user?.role);
  const isApprover = session?.user?.role === "approver";
  const hasInvoiceData = menu?.hasInvoiceData;
  const hasOrData = menu?.hasOrData;

  const menuList: string[] = menu?.data?.menuList ?? [];
  // console.log(menu?.data)

  // helper to check visibility
  const canSee = (label: string) =>
    isAdmin || menuList.includes(label);

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
                // {
                //   href: "/invoice/generate/proforma",
                //   label: "Invoice Proforma",
                //   active: pathname === "/invoice/generate/proforma",
                // },
              ],
              visible: (canSee("Generate Invoive")) || isAdmin,
            },
            {
              href: "/invoice/list",
              label: "Invoice List",
              active: pathname === "/invoice/list",
              icon: "",
              children: [],
              visible: canSee("Invoive List"),
            },
            {
              href: "/invoice/approval",
              label: "Invoice Approval",
              active: pathname === "/invoice/approval",
              icon: "",
              children: [],
              visible: canSee("Invoive Approval"),
            },
            {
              href: "/invoice/approval-history",
              label: "Invoice Approval History",
              active: pathname === "/invoice/approval-history",
              icon: "",
              children: [],
              visible: canSee("Invoive Approval History"),
            },
            {
              href: "/invoice/stamp",
              label: "Invoice Stamp",
              active: pathname === "/invoice/stamp",
              icon: "",
              children: [],
              visible: canSee("Invoive Stamp"),
            },
            {
              href: "/invoice/stamp-history",
              label: "Invoice Stamp History",
              active: pathname === "/invoice/stamp-history",
              icon: "",
              children: [],
              visible: isAdmin || canSee("Invoive Stamp History"),
            },
            {
              href: "/invoice/email",
              label: "Invoice Blast",
              active: pathname === "/invoice/email",
              icon: "",
              children: [],
              visible: canSee("Invoive Blast"),
            },
            {
              href: "/invoice/email-history",
              label: "Invoice Blast History",
              active: pathname === "/invoice/email-history",
              icon: "",
              children: [],
              visible: isAdmin || canSee("Invoive Blast History"),
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
            (isBlaster && hasInvoiceData) ||
            (isApprover),
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
              visible: (isMaker && hasOrData) || isAdmin,
            },
            {
              href: "/receipt/list",
              label: "Receipt List",
              active: pathname === "/receipt/list",
              icon: "",
              children: [],
              visible: (isMaker && hasOrData) || isAdmin,
            },
            {
              href: "/receipt/approval",
              label: "Receipt Approval",
              active: pathname === "/receipt/approval",
              icon: "",
              children: [],
              visible: isApprover,
            },
            {
              href: "/receipt/approval-history",
              label: "Receipt Approval History",
              active: pathname === "/receipt/approval-history",
              icon: "",
              children: [],
              visible: isApprover,
            },
            {
              href: "/receipt/stamp",
              label: "Receipt Stamp",
              active: pathname === "/receipt/stamp",
              icon: "",
              children: [],
              visible: isBlaster && hasOrData,
            },
            {
              href: "/receipt/stamp-history",
              label: "Receipt Stamp History",
              active: pathname === "/receipt/stamp-history",
              icon: "",
              children: [],
              visible: isAdmin || isBlaster,
            },
            {
              href: "/receipt/email",
              label: "Receipt Blast",
              active: pathname === "/receipt/email",
              icon: "",
              children: [],
              visible: isBlaster && hasOrData,
            },
            {
              href: "/receipt/email-history",
              label: "Receipt Blast History",
              active: pathname === "/receipt/email-history",
              icon: "",
              children: [],
              visible: isAdmin || isBlaster,
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
            isAdmin || (isMaker && hasOrData) || (isApprover) || (isBlaster && hasOrData),
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "assets",
      menus: [
        {
          id: "assets",
          href: "#",
          label: "Assets",
          active: pathname.includes("/assets"),
          icon: "heroicons-outline:receipt-percent",
          submenus: [
            {
              href: "/assets/generate-qr",
              label: "Generate QR",
              active: pathname === "/assets/generate-qr",
              icon: "",
              children: [],
              visible: true,
            },
            {
              href: "/assets/print-qr",
              label: "Print QR",
              active: pathname === "/assets/print-qr",
              icon: "",
              children: [],
              visible: true,
            },
          ].filter((submenu) => submenu.visible !== false),
          visible: true,
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
    {
      groupLabel: "",
      id: "system-admin",
      menus: [
        {
          id: "system-admin",
          href: "/system-admin",
          label: "System Admin",
          active: pathname.includes("/system-admin"),
          icon: "heroicons:user-group",
          visible: isAdmin,
          submenus: [
            {
              href: "/system-admin/users",
              label: "Users",
              active: pathname.includes("/system-admin/users"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
            {
              href: "/system-admin/assign-user",
              label: "Assign User",
              active: pathname.includes("/system-admin/assign-user"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
          ].filter((submenu) => submenu.visible !== false),
        },
      ].filter((menu) => menu.visible !== false),
    },
    {
      groupLabel: "",
      id: "emeterai",
      menus: [
        {
          id: "emeterai",
          href: "/emeterai",
          label: "Emeterai",
          active: pathname.includes("/emeterai"),
          icon: "lucide:stamp",
          visible: isAdmin,
          submenus: [
            {
              href: "/emeterai/stamp",
              label: "Stamp",
              active: pathname.includes("/emeterai/stamp"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
            {
              href: "/emeterai/stamp-history",
              label: "Stamp History",
              active: pathname.includes("/emeterai/stamp-history"),
              icon: "heroicons:arrow-trending-up",
              children: [],
              visible: isAdmin,
            },
          ].filter((submenu) => submenu.visible !== false),
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

