import React from "react";
import { Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function CreateButton({
  amount,
  qty,
  order_material,
  state_user,
}) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("sm"));

  let totalTax = 0;
  order_material?.forEach((item) => {
    totalTax += Number(item.total_tax) || 0;
  });

  let totalCGST = 0;
  order_material?.forEach((item) => {
    totalCGST += Number(item.cgst_value) || 0;
  });

  let totalSGST = 0;
  order_material?.forEach((item) => {
    totalSGST += Number(item.sgst_value) || 0;
  });

  let totalTrade = 0;

  if (state_user == 0) {
    order_material?.forEach((item) => {
      totalTrade += Number(item.trade_discount_value) || 0;
    });
  }

  return (
    <>
      <div className="display_flex" style={{ width: "100%", padding: "3px" }}>
        <Typography
          variant="h4"
          className="nunito_font"
          style={{ fontSize: "14px", fontWeight: "600" }}
        >
          Total Quantity : {parseFloat(qty || 0).toFixed(0)}
        </Typography>
      </div>
      {state_user == 1 ? (
        <div className="display_flex" style={{ width: "100%", padding: "3px" }}>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "14px", fontWeight: "600" }}
          >
            Total GST : {parseFloat(totalCGST + totalSGST || 0).toFixed(0)}
          </Typography>
        </div>
      ) : (
        <div className="display_flex" style={{ width: "100%", padding: "3px" }}>
          <Typography
            variant="h4"
            className="nunito_font"
            style={{ fontSize: "14px", fontWeight: "600" }}
          >
            Total Trade Discount : {parseFloat(totalTrade || 0).toFixed(0)}
          </Typography>
        </div>
      )}

      <div className="display_flex" style={{ width: "100%", padding: "3px" }}>
        <Typography
          variant="h4"
          className="nunito_font"
          style={{ fontSize: "14px", fontWeight: "600" }}
        >
          Total Tax : {parseFloat(totalTax || 0).toFixed(0)}
        </Typography>
      </div>
      <div className="display_flex" style={{ width: "100%", padding: "3px" }}>
        <Typography
          variant="h4"
          className="nunito_font"
          style={{ fontSize: "14px", fontWeight: "600" }}
        >
          Total Amount : {parseFloat(amount|| 0).toFixed(2)}
        </Typography>
      </div>
    </>
  );
}
