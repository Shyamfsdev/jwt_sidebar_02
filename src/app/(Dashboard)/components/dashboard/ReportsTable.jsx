import React, { useState, useEffect } from "react";
import BaseCard from "../shared/DashboardCard";

const UserTbale = ({ TableComponents }) => {
  return <BaseCard>{TableComponents()}</BaseCard>;
};

export default UserTbale;
