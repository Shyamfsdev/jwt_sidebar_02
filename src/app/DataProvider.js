

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { axiosGet } from "../lib/api";
import { usePathname } from "next/navigation";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const pathname = usePathname();

  const [accessToken, setAccessToken] = useState(
    () => Cookies.get("token") || null
  );

  const [userData, setUserData] = useState(
    () => {
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem("userData")) || null;
      }
      return null;
    }
  );
  const [selectedUniqId, setSelectedUniqId] = useState(
    () => {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem("selectedUniqId") || null;
      }
      return null;
    }
  );
  const [isCreate, setIsCreate] = useState(
    () => {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem("isCreate") || 'false';
      }
      return 'false';
    }
  );
  const [selectedData, setSelectedData] = useState(
    () => {
      if (typeof localStorage !== 'undefined') {
        return JSON.parse(localStorage.getItem("selectedData")) || [];
      }
      return [];
    }
  );

  const [bankData, setBankdata] = useState([]);

  const getBankNames = (accessToken) => {
    axiosGet
      .get(
        `bank_name_master/3?access_token=${accessToken}&active_status=1`
      )
      .then((response) => {
        // Handle the successful response here
        setBankdata(response.data.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const [caseTypeData, setCaseTypeData] = useState([]);

  const getcaseTypes = (accessToken) => {
    axiosGet
      .get(
        `case_type_master/3?access_token=${accessToken}&active_status=1`
      )
      .then((response) => {
        // Handle the successful response here
        setCaseTypeData(response.data.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const [docTypeData, setdocTypeData] = useState([]);

  const getdocTypes = (accessToken) => {
    axiosGet
      .get(
        `doc_type_master/3?access_token=${accessToken}&active_status=1`
      )
      .then((response) => {
        // Handle the successful response here
        setdocTypeData(response.data.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };


  const [bankMasterData, setbankMasterData] = useState([]);

  const getbankMasters = (accessToken) => {
    axiosGet
      .get(
        `bank_master/3?access_token=${accessToken}&active_status=1`
      )
      .then((response) => {
        // Handle the successful response here
        setbankMasterData(response.data.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };



  useEffect(() => {
    // Save to localStorage whenever accessToken, userData, selectedUniqId, or selectedData changes
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("selectedUniqId", selectedUniqId);
      localStorage.setItem("isCreate", isCreate);
      localStorage.setItem("selectedData", JSON.stringify(selectedData));
    }
  }, [accessToken, userData, selectedUniqId, selectedData, isCreate]);

  
  const authContextValue = {
    accessToken,
    setAccessToken,
    userData,
    setUserData,
    selectedUniqId,
    setSelectedUniqId,
    selectedData,
    setSelectedData,
    setIsCreate,
    isCreate,
    bankData,
    caseTypeData,
    docTypeData,
    bankMasterData,
    getBankNames,
    getcaseTypes,
    getdocTypes,
    getbankMasters,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

