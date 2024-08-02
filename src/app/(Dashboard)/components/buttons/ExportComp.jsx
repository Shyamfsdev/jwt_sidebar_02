import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import * as FileSaver from "file-saver";

import XLSX from "sheetjs-style";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ExportComp({
  td_data_set,
  columns,
  rows,
  heading,
}) {
    const print = () => {
        const pdf = new jsPDF("p", "pt", "a4");
        pdf.text(235, 40, heading);
      
        const tableConfig = {
          startY: 65,
          theme: "grid",
          styles: {
            font: "times",
            halign: "center",
            cellPadding: 3.5,
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            textColor: [0, 0, 0],
          },
          headStyles: {
            textColor: [0, 0, 0],
            fontStyle: "normal",
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
            fillColor: [166, 204, 247],
          },
          alternateRowStyles: {
            fillColor: [212, 212, 212],
            textColor: [0, 0, 0],
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
          rowStyles: {
            lineWidth: 0.5,
            lineColor: [0, 0, 0],
          },
          tableLineColor: [0, 0, 0],
        };
      
        pdf.autoTable(columns, rows, tableConfig);
        pdf.save(heading);
      };
      
// console.log('buirgfuiegue',rows)
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToExcel = async () => {
    const ws = XLSX.utils.json_to_sheet(td_data_set);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data1 = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data1, heading + fileExtension);
  };
  
  const handleOnPdf = () => {
    print();
  };
  const handleOnExcel = () => {
    exportToExcel(heading);
  };

  return (
    <div>
      <div style={{ display: "flex",justifyContent:'center', margin: "20px" }}>
        <Button
          variant="extended"
          size="small"
          aria-label="add"
          onClick={handleOnExcel}
          title="Click To Export Excel"
          style={{ marginLeft: "10px",backgroundColor:"#E1E1E1" }}
        >
          <div style={{ display: "flex" }}>
            <Image
              src="/images/icons/excel_icon.svg"
              alt=""
              width="25"
              height="25"
            />
            Export
          </div>
        </Button>
        <Button
          variant="extended"
          size="small"
          aria-label="add"
          onClick={handleOnPdf}
          title="Click To Export PDF"
          style={{ marginLeft: "10px",backgroundColor:"#E1E1E1" }}
        >
          <div style={{ display: "flex" }}>
            <Image src="/images/icons/pdf_icon.svg" alt="" width="20" height="20" />
            Export
          </div>
        </Button>
      </div>
    </div>
  );
}
