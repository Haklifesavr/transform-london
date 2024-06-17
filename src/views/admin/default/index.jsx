import {
  Button,
  ButtonGroup,
  useColorModeValue,
  useMediaQuery
} from "@chakra-ui/react";
// Assets
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import {
  MdAnalytics,
} from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";
import PieCard from "views/admin/default/components/PieCard";
import transformFactory from "views/transformer/transformFactory";
import { useApp } from "AppContext/AppProvider";
import { useEffect } from "react";
import BarChartComponent from "./components/DailyTraffic";
import ReactApexChart from "react-apexcharts";
import Card from "components/card/Card";
import Performance from "../performance";
import Technical from "../technical";
import CLTV from "../cltv";
import Overview from "../overview";

export default function UserReports() {
  // Chakra Color Mode
  const ceo = useApp();

  const [isSmallScreen] = useMediaQuery(
    "(min-width: 600px) and (max-width: 1024px)"
  );

  const [isMedium] = useMediaQuery(
    "(min-width: 920px) and (max-width: 1670px)"
  );

  const [isMaxThan720] = useMediaQuery("(min-width: 0px) and (max-width: 655px)");


  const columns = isSmallScreen ? 1 : { base: 1, md: 2, lg: 2, sm: 1 };

  useEffect(() => {
    window.scrollTo(0, 0)
    console.log("DEBUG CHARTS DATA cltv", ceo.states.chartsData, isMedium, isMaxThan720)
    if (ceo.states.chartsData) {
      transformFactory(
        ceo.states.chartsData,
        ceo.actions.setTransformedData,
        ceo.actions.setChartsData,
        ceo.actions.setTablesData,
        ceo.actions.setSelectedYear,
        ceo.actions.setTempState,
        ceo.states.selectedDashboard.name,
        ceo.actions.setCompareView,
        ceo.actions.setCompareData,
        isMedium,
        isMaxThan720
      );
    }
  }, [ceo.states.chartsData, isMedium, isMaxThan720]);

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <>
      {
        ceo.states.selectedDashboard.name === "Performance" ?
          <Performance />
          :
          ceo.states.selectedDashboard.name === "CLTV" ?
            <CLTV />
            :
            ceo.states.selectedDashboard.name === "Overview" ?
              <Overview />
              :
              <Technical />
      }
    </>);
}
