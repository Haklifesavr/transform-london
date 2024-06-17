import { createContext, useContext, useState, useLayoutEffect } from "react";

import { useColorMode } from "@chakra-ui/react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import manager from "helpers/manager";
// import {  useNavigate } from "react-router-dom";

// The Material Dashboard 2 PRO React main context
const AppContext = createContext();

// Setting custom name for the context which is visible on react dev tools
AppContext.displayName = "AppContext";

function AppProvider({ children }) {
  //temporay local consts
  // const navigate = useNavigate();
  //define states
  const [isAuthenticated, setIsAuthenticated] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  //Dashboard and Company Meta Data
  const [dashboardDetails, setDashboardDetails] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [userDashboards, setUserDashboards] = useState(null);
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  //charts Data
  const [chartsData, setChartsData] = useState(null);
  const [tablesData, setTablesData] = useState(null);
  const [transformedData, setTransformedData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [displayTest, setDisplayTest] = useState(false);
  // color modes
  const { colorMode, toggleColorMode } = useColorMode();
  // temp state
  const [tempState, setTempState] = useState(null);
  // comparison state
  const [compareView, setCompareView] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [tableState, setTablestate] = useState(null);
  const [newOption, setNewOption] = useState(null);

  const [selectedoptionforchart, setselectedoptionforchart] = useState(null);

  const emptyAllStates = () => {
    setIsAuthenticated(0);
    setUserProfile(null);
    setDashboardDetails(null);
    setCompanyDetails(null);
    setChartsData(null);
    setTablesData(null);
    setTransformedData(null);
    setDisplayTest(false);
    setUserDashboards(null);
    setSelectedDashboard(null);
    setSelectedYear(null);
    setTempState(null);
    setCompareView(null);
    setCompareData(null);
    setTablestate(null);
    setNewOption(null);
    Cookies.remove("token");
  };

  const states = {
    colorMode,
    isAuthenticated,
    userProfile,
    dashboardDetails,
    companyDetails,
    chartsData,
    tablesData,
    transformedData,
    displayTest,
    userDashboards,
    selectedDashboard,
    selectedYear,
    tempState,
    compareView,
    compareData,
    tableState,
    newOption,
  };

  const actions = {
    toggleColorMode,
    setIsAuthenticated,
    setUserProfile,
    setDashboardDetails,
    setCompanyDetails,
    setChartsData,
    setTablesData,
    setTransformedData,
    setDisplayTest,
    setUserDashboards,
    setSelectedDashboard,
    setSelectedYear,
    setTempState,
    emptyAllStates,
    setCompareView,
    setCompareData,
    setTablestate,
    setNewOption,
    setselectedoptionforchart,
  };

  //Trying to fetch data before rendering
  useLayoutEffect(() => {
    let fetchData;
    fetchData = async () => {
      const UserProfile_resp = await manager.getProfile();
      const UserProfile = await UserProfile_resp;
      setUserProfile(await UserProfile.json());
      const UserDashboards_resp = await manager.getUserDashboards();
      const userDashboards = await UserDashboards_resp;
      if (userDashboards.status === 200) {
        const userDashboardsList = await userDashboards.json();
        // console.log("User Dashboard are ",userDashboardsList);
        setUserDashboards(userDashboardsList);
      }
    };
    if (Cookies.get("token")) {
      fetchData();
    }
  }, [isAuthenticated]);

  useLayoutEffect(() => {
    // console.log("OUTSIDE Data Fetching INSIDE SELECTED DASHBOARD");
    const fetchData = async () => {
      // console.log("ID BEFORE SENDINg", selectedDashboard)
      const dashboardDetails_resp = await manager.getDashboardDetails(
        selectedDashboard.dashboard
      );
      const dashboardDetails = await dashboardDetails_resp.json();
      const chartsView_resp = await manager.getCharts(selectedDashboard.id);
      const chartsView = await chartsView_resp.json();

      setDashboardDetails(dashboardDetails);
      //setCompanyDetails()
      setChartsData(chartsView);
      console.log("DEBUG CHARTS IN APP PROVIDER", chartsData);
      // console.log(chartsView);
      // console.log("DATA FETCHED LOGIN");
    };
    if (selectedDashboard) {
      // console.log("Data Fetching started INSIDE SELECTED DASHBOARD");
      fetchData();
      // console.log("Data Fetching stopped");
    }
  }, [selectedDashboard]);

  const value = { states, actions };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  const context = useContext(AppContext);
  return context;
}

// Typechecking props for the MaterialUIControllerProvider
AppProvider.propTypes = PropTypes;

export { AppProvider, useApp };
