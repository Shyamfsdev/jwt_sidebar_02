"use client";
import { Grid, Box, Typography, Button } from "@mui/material";
import PageContainer from "../(Dashboard)/components/container/PageContainer";
// components
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const ACCESS_TOKEN = Cookies.get("token");
  const USERID = Cookies.get("user_id");
  const today = new Date();
  const formattedToday = today.toISOString().slice(0, 10);
  // const {userType} = useUserData(ACCESS_TOKEN);
//   const { userData, userType, isLoading } = useUserData(ACCESS_TOKEN);
  const [createdStartDate, setCreatedStartDate] = useState(formattedToday);
  const [listData, setListData] = useState(null);
  const [createdEndDate, setCreatedEndDate] = useState(formattedToday);
  const [amount, setAmount] = useState(0);
  const [company, setCompany] = useState(1);
  const [payable, setpayable] = useState(0);
  const [totalSst, settotalSst] = useState(0);
  const [claimsNo, setclaimsNo] = useState(0);
  const [lossNo, setlossNo] = useState(0);
  const [winNo, setWinNo] = useState(0);
  const [openNo, setOpenNo] = useState(0);
  const [invNo, setinvNo] = useState(0);
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      
    </PageContainer>
  );
};

export default Dashboard;
