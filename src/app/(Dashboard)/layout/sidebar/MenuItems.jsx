import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    href: "/dashboard",
    type: 1,
    icon: "/images/icons/db.svg",
    submenu: [],
  },
  {
    id: uniqueId(),
    title: "Masters",
    icon: "/images/icons/master.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Supplier",
        href: "/supplier_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Customer",
        href: "/customer_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Customer Class",
        href: "/customer_class",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Product",
        href: "/product_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "UOM",
        href: "/uom_master",
        submenu2: [],
      },
       {
        id: uniqueId(),
        title: "Sub UOM",
        href: "/sub_uom",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Trading Type",
        href: "/trading_type_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Route",
        href: "/route_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Customer Type",
        href: "/customer_type_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Division",
        href: "/division_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "RFA Division",
        href: "/rfa_division",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Category",
        href: "/category_handler_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Salesman Type",
        href: "/employee_type_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Department",
        href: "/department_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Designation",
        href: "/designation_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Salesman",
        href: "/sales_man_list",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Tax",
        href: "/tax_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Hawker",
        href: "/hawker_master",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Account Head",
        href: "/account_head_master",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Sub Account Head",
        href: "/sub_account_head_master",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Type Of Claims",
        href: "/type_of_claims_master",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Type Of Spent",
        href: "/type_of_spent_master",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Scheme",
        href: "/scam_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Approver Head",
        href: "/approver_head_master",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Approver",
        href: "/approver_master",
        submenu2: [],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Purchase",
    icon: "/images/icons/purchase.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Dispatch Order",
        href: "/dispatch-order",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Purchase Invoice",
        href: "/purchase-invoice",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "New Product List",
        href: "/product_list",
        submenu2: [],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Purchase Return",
    icon: "/images/icons/purchase_return.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Return Order",
        href: "/purchase_return",
        submenu2: [],
      }
    ],
  },
  {
    id: uniqueId(),
    title: "Inward Entry",
    icon: "/images/icons/inward.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Billed Entry",
        href: "/billed_entry",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Mismatch",
        href: "/mismatch_entry",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Shortage",
        href: "/shortage_entry",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Undelivered",
        href: "/out_of_stock_entry",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Excess",
        href: "/excess_entry",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Damage",
        href: "/damage_entry",
        submenu2: [],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Warehouse",
    icon: "/images/icons/warehouse.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Instock",
        href: "/inventory",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Inventory History",
        href: "/inventory_history",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Delivery Challan",
        href: "/purchase_delivery_challan",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Warehouse Damage",
        href: "/warehouse_damage",
        submenu2: [],
      }
    ],
  },
  {
    id: uniqueId(),
    title: "Sales",
    icon: "/images/icons/sales.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Sales By Excel",
        href: "/sales_excel_import",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Sales Invoice",
        href: "/sales-invoice",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Pick List",
        href: "/pick_list_page",
        submenu2: [],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Sales Return",
    icon: "/images/icons/sales_return.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Invioce Return",
        href: "/invoice_return",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Invoice Replacement",
        href: "/customer_replacement",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Damaged Goods",
        href: "/damage_return",
        submenu2: [],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Finance",
    icon: "/images/icons/sales.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Day Book Entry",
        href: "/day_book_entry",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "Claims Non CCIS",
        href: "/claims_non_ccis_list",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "CCIS K4",
        href: "/claims_k4_list",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "CCIS RFA",
        href: "/claims_rfa_list",
        submenu2: [],
      },{
        id: uniqueId(),
        title: "CCIS D&D",
        href: "/claims_d_d_list",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Claims Spent",
        href: "/claims_spends_list",
        submenu2: [],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Reports",
    icon: "/images/icons/reports.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Purchase Reports",
        href: "/purchase_reports",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Return Reports",
        href: "/return_reports",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Outward Reports",
        href: "/outward_reports",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Mismatch Report",
        href: "/mismatch_report",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Shortage Reports",
        href: "/sortage_report",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Undelivered Reports",
        href: "/undelivered_report",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Excess Reports",
        href: "/excess_report",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Damage Reports",
        href: "/damage_report",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Billed Reports",
        href: "/billed_report",
        submenu2: [],
      },
    ],
  },
  {
    id: uniqueId(),
    title: "MIS Reports",
    icon: "/images/icons/mis_reports.svg",
    submenu: [
      {
        id: uniqueId(),
        title: "Salesman Reports",
        href: "/salesman_reports",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Beat Reports",
        href: "/sales_beat_reports",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Sales Invoice Reports",
        href: "/sales_reports",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Picklist Reports",
        href: "/picklist_reports",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Return Reports",
        href: "/sales_return_report",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Replacement Reports",
        href: "/invoice_replacement",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "D&D Reports",
        href: "/damaged_goods_repeat",
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Margin Reports",
        href: "/margin_report", 
        submenu2: [],
      },
      {
        id: uniqueId(),
        title: "Delivery Chellan Reports",
        href: "/delivery_chellan_misreport", 
        submenu2: [],
      },
    ],
  },
];

export default Menuitems;
