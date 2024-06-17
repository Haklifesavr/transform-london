import {
  Button,
  ButtonGroup,
  Box,
  Flex,
  Icon,
  Select,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  useMediaQuery,
  Text,
  calc,
  HStack,
  Stack
} from "@chakra-ui/react";

import Filter from "components/Filter/Filter";
// Assets
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import MiniStats from "components/card/MiniStats";
import Chart from "react-google-charts";
import {
  MdAnalytics,
} from "react-icons/md";
import IconBox from "components/icons/IconBox";
import React from "react";
import ComplexTable from "views/admin/default/components/ComplexTable"
import PieCard from "views/admin/default/components/PieCard";
import transformFactory from "views/transformer/transformFactory";
import { useApp } from "AppContext/AppProvider";
import { useEffect } from "react";
import Card from "components/card/Card";
import BarChartComponent from "../default/components/DailyTraffic";
import ReactApexChart from "react-apexcharts";
import { column } from "stylis";
import CombineView from "./CombineView";

export default function CLTV() {
  // Chakra Color Mode
  const ceo = useApp();

  const [isSmallScreen] = useMediaQuery("(min-width: 700px) and (max-width: 1024px)");
  const [isLarge] = useMediaQuery("(min-width: 1024px)");
  const [isMedium] = useMediaQuery("(min-width: 600px) and (max-width: 1023px)");

  const columns = isSmallScreen ? 1 : { base: 1, md: 3, lg: 3, sm: 1 };

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");


  const handleButtonChange = (newSelectedButton) => {
    ceo.actions.setNewOption([{ value: newSelectedButton, label: newSelectedButton }])
    ceo.actions.setSelectedYear(newSelectedButton)
  };
  return (
    <>
      <Box id="cltv_dashboard_box" key={"cltv-dashboard"}
        pt={{ base: "80px", md: "80px", xl: "80px" }}
      >
        {ceo.states.transformedData ? (
          <>
            {/* {} */}
            <Flex key={"header"}>
              <ButtonGroup variant='outline' spacing='10' key={"outline-header"}>
                {Object.entries(ceo.states.transformedData.chartList).map((data) =>
                  !(isNaN(parseInt(data[0]))) && !(data[0].includes("days")) &&
                  <Button
                    boxShadow='none'
                    key={data[0]}
                    color={ceo.states.selectedYear === data[0] ? "#422AFB" : "#A8B3D3"}
                    onClick={() => handleButtonChange(data[0])}
                    // isselected={ceo.states.selectedYear === data[0]}
                    borderBottom={ceo.states.selectedYear === data[0] ? "2px solid #422AFB" : "0px solid #A8B3D3"}
                    borderRadius="0"
                    border={"0"}
                  >{data[0]}</Button>
                )
                }
              </ButtonGroup>
              <Box ml="auto" key={"filter-body"}>
                <Filter />
              </Box>
            </Flex>
            <Box mt={6} key={"body"}>
              <SimpleGrid container="true" spacing={5} key={"simple-body"}>
                {Object.entries(ceo.states.transformedData.chartList)
                  .reverse()
                  .map((data) => {
                    let key = data[0];
                    // conditionally set values. create a compareData state that contains compared graphs data and if it's not null use it as values other use values as they are
                    let values = ceo.states.compareData ? ceo.states.compareData : data[1];
                    // console.log("debug chartlist values", values, ceo.states.selectedYear)
                    if (ceo.states.selectedYear === key) {
                      return (
                        <div key={key}>
                          <SimpleGrid
                            columns={{ base: 1, md: 3, lg: 3, sm: 1 }}
                            // minChildWidth='20vw'
                            gap='20px'
                            mb='20px'>
                            {values
                              .filter((obj) => obj && obj.type === "SCORECARD")
                              .map((obj, index) => {
                                return (
                                  <MiniStatistics
                                    key={index}
                                    endContent={
                                      <IconBox
                                        w='3.2em'
                                        h='3.2em'
                                        bg={boxBg}
                                        icon={
                                          <Icon w='2.2em' h='2.2em' as={MdAnalytics} color={brandColor} />
                                        }
                                      />
                                    }
                                    growth={ceo.states.compareView && obj.percentage}
                                    name={obj.title}
                                    value={obj.data}
                                  />
                                );
                              })}
                          </SimpleGrid>
                          <CombineView values={values} ceo={ceo} title="Highest Grossing Product" description="Top 10 Products By Revenue" isLarge={isLarge} />
                          <CombineView values={values} ceo={ceo} title="Highest Earnings Per Session" description="Top 10 Products by Earnings Per Session" isLarge={false} />
                          <CombineView values={values} ceo={ceo} title="Conversion Rates Per Product" description="Top 10 Products by Conversion Rates - Conversion Rate (from 0 to 1)" isLarge={isLarge} />
                          <CombineView values={values} ceo={ceo} title="Products That Sell Well Together" description="Top 10 Products That Sell Well Together" isLarge={isLarge} />
                          <CombineView values={values} ceo={ceo} title="Most Sold Product Bundles" description="Top 10 Most Sold Product Bundles" isLarge={false} />
                        </div>
                      )
                    }
                  })
                }
              </SimpleGrid>
            </Box>
          </>
        ) : (
          <Box mt={1.5} key={"spinner-cltv"}>
            <Spinner />
          </Box>
        )}
      </Box>
    </>);
}
