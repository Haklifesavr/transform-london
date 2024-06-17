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
} from "@chakra-ui/react";

import Filter from "components/Filter/Filter";
// Assets
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import MiniStats from "components/card/MiniStats";
import Chart from "react-google-charts";
import { MdAnalytics } from "react-icons/md";
import IconBox from "components/icons/IconBox";
import React from "react";
import ComplexTable from "views/admin/default/components/ComplexTable";
import PieCard from "views/admin/default/components/PieCard";
import transformFactory from "views/transformer/transformFactory";
import { useApp } from "AppContext/AppProvider";
import { useEffect } from "react";
import Card from "components/card/Card";
import BarChartComponent from "../default/components/DailyTraffic";
import ReactApexChart from "react-apexcharts";
import { column } from "stylis";

export default function Performance() {
  // Chakra Color Mode
  const ceo = useApp();

  const [isSmallScreen] = useMediaQuery(
    "(min-width: 700px) and (max-width: 1024px)"
  );
  const [isLarge] = useMediaQuery("(min-width: 1024px)");
  const [isMedium] = useMediaQuery(
    "(min-width: 600px) and (max-width: 1023px)"
  );
  // const [isSmall] = useMediaQuery("(max-width: 500px)");

  const columns = isSmallScreen ? 1 : { base: 1, md: 2, lg: 2, sm: 1 };

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const handleButtonChange = (newSelectedButton) => {
    // ceo.actions.setNewOption(null)
    // console.log("debug new option before", newSelectedButton, typeof newSelectedButton)
    ceo.actions.setNewOption([
      { value: newSelectedButton, label: newSelectedButton },
    ]);
    // console.log("debug new option after", newSelectedButton, ceo.states.newOption, typeof newSelectedButton)
    ceo.actions.setSelectedYear(newSelectedButton);
  };

  // console.log('Performance Test',  ceo.states)
  return (
    <>
      <Box
        id="performance_dashboard_box"
        pt={{ base: "80px", md: "80px", xl: "80px" }}
      >
        {ceo.states.transformedData ? (
          <>
            {/* {} */}
            <Flex>
              <ButtonGroup variant="outline" spacing="10">
                {Object.entries(ceo.states.transformedData.chartList).map(
                  (data) =>
                    !isNaN(parseInt(data[0])) &&
                    !data[0].includes("days") && (
                      <Button
                        boxShadow="none"
                        color={
                          ceo.states.selectedYear === data[0]
                            ? "#422AFB"
                            : "#A8B3D3"
                        }
                        onClick={() => handleButtonChange(data[0])}
                        isSelected={ceo.states.selectedYear === data[0]}
                        borderBottom={
                          ceo.states.selectedYear === data[0]
                            ? "2px solid #422AFB"
                            : "0px solid #A8B3D3"
                        }
                        borderRadius="0"
                        border={"0"}
                      >
                        {data[0]}
                      </Button>
                    )
                )}
              </ButtonGroup>
              <Box ml="auto">
                <Filter />
              </Box>
            </Flex>
            {/* <Box mt={6}>
              <SimpleGrid container spacing={3}>
                <SimpleGrid item xs={12} md={12} lg={12}>
                  <Box mt={6} >
                    <MiniStatistics
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
                      name="Transform London Analytics"
                      value={ceo.states.companyDetails}
                      page={ceo.states.selectedDashboard.name}
                    />
                  </Box>
                </SimpleGrid>
              </SimpleGrid>
            </Box> */}
            <Box mt={6}>
              <SimpleGrid container spacing={5}>
                {Object.entries(ceo.states.transformedData.chartList)
                  .reverse()
                  .map((data) => {
                    // console.log("debug charts data raw and transformed", data, ceo.states.transformedData, ceo.states.chartData)
                    let key = data[0];
                    // console.log('test key.....', data);
                    // conditionally set values. create a compareData state that contains compared graphs data and if it's not null use it as values other use values as they are
                    let values = ceo.states.compareData
                      ? ceo.states.compareData
                      : data[1];
                    // console.log("debug chartlist values", values, ceo.states.selectedYear)
                    if (ceo.states.selectedYear === key) {
                      return (
                        <>
                          <MiniStatistics
                            endContent={
                              <IconBox
                                w="3.2em"
                                h="3.2em"
                                bg={boxBg}
                                icon={
                                  <Icon
                                    w="2.2em"
                                    h="2.2em"
                                    as={MdAnalytics}
                                    color={brandColor}
                                  />
                                }
                              />
                            }
                            name={
                              isNaN(parseInt(key)) && !key.includes("days")
                                ? "Channel"
                                : "Time Span"
                            }
                            value={
                              key.includes("last")
                                ? key
                                    .split("_")
                                    .join(" ")
                                    .replace("last", "Last")
                                : key
                            }
                          />
                          <SimpleGrid
                            columns={{ base: 1, md: 3, lg: 3, sm: 1 }}
                            // minChildWidth='20vw'
                            gap="20px"
                            mb="20px"
                          >
                            {values
                              .filter((obj) => obj && obj.type === "SCORECARD")
                              .map((obj) => {
                                // {console.log("object inside scorecard",obj, values)}
                                return (
                                  <>
                                    <MiniStatistics
                                      endContent={
                                        <>
                                          <IconBox
                                            w="3.2em"
                                            h="3.2em"
                                            bg={boxBg}
                                            icon={
                                              <Icon
                                                w="2.2em"
                                                h="2.2em"
                                                as={MdAnalytics}
                                                color={brandColor}
                                              />
                                            }
                                          />
                                        </>
                                      }
                                      growth={
                                        ceo.states.compareView && obj.percentage
                                      }
                                      name={obj.title}
                                      value={obj.data}
                                    />
                                  </>
                                );
                              })}
                          </SimpleGrid>
                          <SimpleGrid
                            item
                            columns={{ base: 1, md: 1, lg: 2, sm: 1 }}
                            // minChildWidth="40vw"
                            gap="20px"
                            mb="20px"
                          >
                            {values
                              .filter(
                                (object) => object && object.type === "DONUT"
                              )
                              .map((object) => {
                                // {console.log("object inside donut",object, values.filter((object) => object && object.type === "DONUT"))}
                                return object.series.every(
                                  (element) => element === 0
                                ) ? (
                                  <></>
                                ) : (
                                  <>
                                    <PieCard
                                      percentage={
                                        ceo.states.compareView
                                          ? object.percentage
                                          : null
                                      }
                                      chartData={object.series}
                                      chartOptions={object.options}
                                      title={object.title}
                                    />
                                  </>
                                );
                              })}
                            {/* <SimpleGrid
                              item
                              columns={{ base: 1, md: 1, lg: 1, sm: 1 }}
                              minChildWidth={
                                isLarge ? "25vw" : isMedium ? "30vw" : "100%"
                              }
                              gap="20px"
                              mb="20px"
                            >
                            </SimpleGrid> */}
                          </SimpleGrid>
                          <SimpleGrid
                            item
                            xs={12}
                            md={12}
                            lg={12}
                            gap="20px"
                            mb="20px"
                          >
                            {values
                              .filter(
                                (object) => object && object.type === "BAR"
                              )
                              .map((object) => {
                                {
                                  console.log("object inside bar", object);
                                }
                                return object.series[0].data.every(
                                  (element) => element === 0
                                ) ? (
                                  <></>
                                ) : (
                                  <>
                                    <BarChartComponent
                                      chartData={object.series}
                                      chartOptions={object.options}
                                      title={object.title}
                                    />
                                  </>
                                );
                              })}
                          </SimpleGrid>
                          <SimpleGrid
                            item
                            xs={12}
                            md={12}
                            lg={12}
                            gap="20px"
                            mb="20px"
                          >
                            {values
                              .filter(
                                (object) => object && object.type === "TABLE"
                              )
                              .map((object) => {
                                return (
                                  <>
                                    <ComplexTable
                                      pageName={
                                        ceo.states.selectedDashboard.name
                                      }
                                      columnsData={object.columns}
                                      tableData={object.rows}
                                      title={object.title}
                                    />
                                  </>
                                );
                              })}
                          </SimpleGrid>
                          <SimpleGrid
                            item
                            xs={12}
                            md={12}
                            lg={12}
                            gap="20px"
                            mb="20px"
                          >
                            {values
                              .filter(
                                (object) => object && object.type === "STACKED"
                              )
                              .map((object) => {
                                // {console.log("object inside stacked",object)}
                                return (
                                  <div id="chart">
                                    <Card
                                      align="center"
                                      direction="column"
                                      w="100%"
                                    >
                                      <Box h="350px">
                                        <ReactApexChart
                                          options={object.options}
                                          series={object.series}
                                          type="line"
                                          height={350}
                                        />
                                      </Box>
                                    </Card>
                                  </div>
                                );
                              })}
                          </SimpleGrid>
                          {values
                            .filter(
                              (object) => object && object.type === "GEOCHART"
                            )
                            .map((object) => {
                              return (
                                <SimpleGrid
                                  item
                                  // columns={columns}
                                  minChildWidth="10vw"
                                  gap="20px"
                                  mb="20px"
                                >
                                  <Card direction="column" w="100%">
                                    <Text>{object.title}</Text>
                                    <Box h="400px">
                                      <Chart
                                        chartType="GeoChart"
                                        width="100%"
                                        height="400px"
                                        data={object.data}
                                        options={object.options}
                                      />
                                    </Box>
                                  </Card>
                                </SimpleGrid>
                              );
                            })}
                        </>
                      );
                    }
                  })}
              </SimpleGrid>
            </Box>
          </>
        ) : (
          <Box mt={1.5}>
            <Spinner />
          </Box>
        )}
      </Box>
      <></>
    </>
  );
}
