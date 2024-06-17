import {
  Box,
  Icon,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  useMediaQuery,
  Button,
  ButtonGroup,
  Text,
  Flex,
  Select,
  Stack,
  HStack,
} from "@chakra-ui/react";

import Filter from "components/Filter/Filter";
// Assets
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React from "react";
import { MdAnalytics } from "react-icons/md";
import ComplexTable from "views/admin/default/components/ComplexTable";
import PieCard from "views/admin/default/components/PieCard";
import transformFactory from "views/transformer/transformFactory";
import { useApp } from "AppContext/AppProvider";
import { useEffect } from "react";
import Card from "components/card/Card";
import BarChartComponent from "../default/components/DailyTraffic";
import ReactApexChart from "react-apexcharts";
import Chart from "react-google-charts";
import ClickableTable from "../default/components/ClickableTable";
import { geo_data, geo_options } from "../default/components/GeoGraph";
import TechnicalScoreCard from "components/charts/TechnicalScoreCard/TechnicalScoreCard";
import { useState } from "react";
import { next } from "stylis";
import CircleChart from "components/charts/CircleChart/CircleChart";
import LineChart from "components/charts/LineAreaChart";
import ApexLineChart from "components/charts/ApexLineChart";

export default function Technical() {
  const ApexLineChartSeries = {
    series: [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41],
      },
      {
        name: "series3",
        data: [59, 13, 34, 41, 87, 51, 64],
      },
      {
        name: "series4",
        data: [23, 96, 84, 71, 38, 29, 68],
      },
      {
        name: "series5",
        data: [91, 48, 83, 6, 12, 38, 96],
      },
      {
        name: "series6",
        data: [74, 29, 62, 80, 8, 30, 69],
      },
    ],
  };

  const ApexLineChartOptions = {
    options: {
      chart: {
        height: 350,
        type: "line",
        toolbar: {
          show: true,
        },
      },
      markers: {
        size: [4, 4],
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
        labels: {
          style: {
            colors: "#959595",
          },
        },
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          style: {
            colors: "#959595",
          },
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
      legend: {
        labels: {
          colors: ["#FF0000", "#00FF00", "#0000FF"],
        },
      },
    },
  };
  // Chakra Color Mode
  const ceo = useApp();
  let same = false;
  let nextObj = "";
  let renderNext = true;
  const arr = {};
  const [isSmallScreen] = useMediaQuery(
    "(min-width: 700px) and (max-width: 1000px)"
  );
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  let backgroundcolorforcard = useColorModeValue("white", "#151418");
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const [selectedOptionForChart, setselectedoptionforchart] = useState(
    "Historical Data_month"
  );
  //on change function
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    console.log(selectedValue);

    if (selectedValue === "Historical Data_month") {
      setselectedoptionforchart("Historical Data_month");
    } else if (selectedValue === "Historical Data_30_d") {
      setselectedoptionforchart("Historical Data_30_d");
    } else if (selectedValue === "Historical Data_60_d") {
      setselectedoptionforchart("Historical Data_60_d");
    } else if (selectedValue === "Historical Data_90_d") {
      setselectedoptionforchart("Historical Data_90_d");
    }
  };

  const columns = isSmallScreen ? 1 : { base: 1, md: 3, lg: 3, sm: 1 };
  const [isLarge] = useMediaQuery("(min-width: 1024px)");
  // const [selectedOption, setSelectedOption] = useState(null);

  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [selectedRow, setSelectedRow] = React.useState(null);
  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
    console.log("ON CLICK WORKING");
  };
  const textColor = useColorModeValue("black", "white");
  const bgcolor = useColorModeValue("white", "black");

  const handleButtonChange = (newSelectedButton) => {
    console.log("testing technical", newSelectedButton);
    ceo.actions.setSelectedYear(newSelectedButton);
  };

  const DonutView = ({ values, width, title }) => {
    console.log("donotview", values);
    return (
      <SimpleGrid
        spacing={10}
        width={width}
        gap="20px"
        key={`${title}-stacked-grid`}
        // mb="20px"
      >
        {values
          .filter(
            (object) =>
              object && object.type === "DONUT" && object.title === title
          )
          .map((object) => {
            return object.series.every((element) => element === 0) ? (
              <></>
            ) : (
              <PieCard
                percentage={ceo.states.compareView ? object.percentage : null}
                key={`${object.title}-donut-view`}
                chartData={object.series}
                chartOptions={object.options}
                // title={object.title}
              />
            );
          })}
      </SimpleGrid>
    );
  };
  const StackedColumnView = ({ values, width }) => {
    // console.log("stackedvals", values);
    return (
      <SimpleGrid
        width={width}
        key={"stacked-column-view"}
        justifyItems="flex-end"
      >
        <div style={{ marginLeft: "auto" }}>
          <Select
            value={selectedOptionForChart}
            style={{ width: "auto" }}
            onChange={handleChange}
          >
            <option
              style={{ color: `${textColor}`, backgroundColor: `${bgcolor}` }}
              value="Historical Data_month"
            >
              Month
            </option>
            <option
              style={{ color: `${textColor}`, backgroundColor: `${bgcolor}` }}
              value="Historical Data_30_d"
            >
              Last 30 days
            </option>
            <option
              style={{ color: `${textColor}`, backgroundColor: `${bgcolor}` }}
              value="Historical Data_60_d"
            >
              Last 60 days
            </option>
            <option
              style={{ color: `${textColor}`, backgroundColor: `${bgcolor}` }}
              value="Historical Data_90_d"
            >
              Last 90 days
            </option>
          </Select>
        </div>
        {/* {console.log(
          "objectttttttttttttt",
          values.filter(
            (object) =>
              object &&
              object.type === "STACKEDCOLUMN" &&
              object.title=== "Historical Data_month"
          )
        )} */}
        {values
          .filter(
            (object) =>
              object &&
              object.type === "STACKEDCOLUMN" &&
              object.title.includes(selectedOptionForChart)
          )
          .map((object) => {
            return (
              <BarChartComponent
                key={`${object.title}-stacked-column-view`}
                chartData={object.series}
                chartOptions={object.options}
                title={
                  object.title === "Historical Data_30_d"
                    ? "Last 30 days"
                    : object.title === "Historical Data_60_d"
                    ? "Last 60 days"
                    : object.title === "Historical Data_90_d"
                    ? "Last 90 days"
                    : "Month"
                }
              />
            );
          })}
      </SimpleGrid>
    );
  };

  // console.log('technical test test', ceo.states)
  return (
    <>
      <Box pt={{ base: "80px", md: "80px", xl: "80px" }} key={"technical-body"}>
        {ceo.states.transformedData ? (
          <>
            <Flex key={"header"}>
              <ButtonGroup
                variant="outline"
                spacing="10"
                key={"outline-header"}
              >
                {Object.entries(ceo.states.transformedData.chartList).map(
                  (data) => (
                    <Button
                      boxShadow="none"
                      key={data[0]}
                      color={
                        ceo.states.selectedYear === data[0]
                          ? "#422AFB"
                          : "#A8B3D3"
                      }
                      onClick={() => handleButtonChange(data[0])}
                      // isselected={ceo.states.selectedYear === data[0]}
                      borderBottom={
                        ceo.states.selectedYear === data[0]
                          ? "2px solid #422AFB"
                          : "0px solid #A8B3D3"
                      }
                      borderRadius="0"
                      border={"0"}
                    >
                      {capitalizeFirstLetter(data[0])}
                    </Button>
                  )
                )}
              </ButtonGroup>
              <Box ml="auto" key={"filter-body"}>
                {ceo.states.selectedYear === null ? (
                  <Filter />
                ) : !ceo.states.selectedYear.includes("http") ? (
                  <Filter />
                ) : (
                  <></>
                )}
              </Box>
            </Flex>
            <Box mt={6} key={"body"}>
              <SimpleGrid container="true" spacing={5} key={"simple-body"}>
                {/* <UzafirChart/> */}
                {Object.entries(ceo.states.transformedData.chartList)
                  .reverse()
                  .map((data) => {
                    // console.log("debug charts data", data, ceo.states.transformedData.chartList)
                    let key = data[0];
                    // console.log('test',ceo.states.transformedData.chartList.desktop[0].ranges['Needs Improvement'])
                    // conditionally set values. create a compareData state that contains compared graphs data and if it's not null use it as values other use values as they are
                    let values = ceo.states.compareData
                      ? ceo.states.compareData
                      : data[1];
                    console.log("values", values);
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
                              ceo.states.selectedYear.includes("http")
                                ? "URL"
                                : "Company Name"
                            }
                            key={`${key}-device`}
                            value={capitalizeFirstLetter(
                              ceo.states.companyDetails
                            )}
                          />
                          {Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) ? (
                            <></>
                          ) : (
                            <div
                              style={
                                isLargerThan768
                                  ? { display: "flex", flexDirection: "row" }
                                  : { display: "flex", flexDirection: "column" }
                              }
                            >
                              <div
                                style={{
                                  width: isLargerThan768 ? "50%" : "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "20px",
                                  backgroundColor: `${backgroundcolorforcard}`,
                                  marginRight: isLargerThan768 ? "20px" : "0px",
                                  marginBottom: isLargerThan768
                                    ? "0px"
                                    : "20px",
                                  borderRadius: "15px",
                                }}
                              >
                                {values
                                  .filter((obj) => obj && obj.type === "CIRCLE")
                                  .map((obj, i) => {
                                    {
                                      console.log("Circle Data", obj);
                                    }
                                    return (
                                      <CircleChart
                                        lineLengthPercentage={parseInt(
                                          obj.score
                                        )}
                                        title={obj.title}
                                      />
                                    );
                                  })}
                              </div>
                              <SimpleGrid
                                style={{ width: "100%" }}
                                key={`${key}-scorecard`}
                                columns={{ base: 1, md: 2, lg: 2, sm: 1 }}
                                gap="20px"
                                // mb="20px"
                              >
                                {values
                                  .filter(
                                    (obj) => obj && obj.type === "SCORECARD"
                                  )
                                  .map((obj, i) => {
                                    console.log(obj);
                                    return (
                                      <TechnicalScoreCard
                                        key={`${obj.title}-scorecard`}
                                        index={i}
                                        range1={obj.ranges["Good"]}
                                        range2={obj.ranges["Needs Improvement"]}
                                        range3={obj.ranges["Poor"]}
                                        data={obj.data}
                                        measure={obj.measure}
                                        title={obj.title}
                                      />
                                    );
                                  })}
                              </SimpleGrid>
                            </div>
                          )}
                          {Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) ? (
                            <></>
                          ) : (
                            <Card
                              direction={"column"}
                              overflow="hidden"
                              key={"card-core-web-vitals-card"}
                              variant="outline"
                            >
                              <SimpleGrid
                                columns={1}
                                spacing="40px"
                                key={"card-core-web-vitals-grid"}
                              >
                                {/* {isLarge ? (
                                  <HStack>
                                    <DonutView
                                      values={values}
                                      title="Core Web Vitals Overview"
                                      width="27vw"
                                    />
                                    <StackedColumnView
                                      values={values}
                                      width="45vw"
                                    />
                                  </HStack>
                                ) : (
                                  <Stack>
                                    <DonutView
                                      values={values}
                                      title="Core Web Vitals Overview"
                                      width="100%"
                                    />
                                    <StackedColumnView
                                      values={values}
                                      width="100%"
                                    />
                                  </Stack>
                                )} */}
                                {isLarge ? (
                                  <Stack>
                                    <HStack style={{ width: "100%" }}>
                                      <div
                                        style={{
                                          color: "#A3AED0",
                                          width: "50%",
                                          fontWeight: "bold",
                                          fontSize: "20px",
                                        }}
                                      >
                                        Core Web Vitals Overview
                                      </div>
                                      <div
                                        style={{
                                          width: "50%",
                                          color: "#A3AED0",
                                          fontSize: "20px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Historical Data
                                      </div>
                                    </HStack>
                                    <HStack>
                                      <DonutView
                                        values={values}
                                        title="Core Web Vitals Overview"
                                        width="27vw"
                                      />
                                      <StackedColumnView
                                        values={values}
                                        width="45vw"
                                      />
                                    </HStack>
                                  </Stack>
                                ) : (
                                  <Stack>
                                    <div
                                      style={{
                                        color: "#A3AED0",
                                        width: "50%",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                      }}
                                    >
                                      Core Web Vitals Overview
                                    </div>
                                    <DonutView
                                      values={values}
                                      title="Core Web Vitals Overview"
                                      width="100%"
                                    />
                                    <div
                                      style={{
                                        color: "#A3AED0",
                                        width: "50%",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                      }}
                                    >
                                      Historical Data
                                    </div>
                                    <StackedColumnView
                                      type="STACKEDCOLUMN"
                                      values={values}
                                      width="100%"
                                    />
                                  </Stack>
                                )}
                              </SimpleGrid>
                            </Card>
                          )}
                          {/* {console.log("DEBUG STATE DONUT",Object.keys(ceo.states.chartsData.data)[0].includes("https"))} */}

                          {Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) ? (
                            <></>
                          ) : (
                            <Card
                              direction={{ base: "column", sm: "row" }}
                              overflow="hidden"
                              variant="outline"
                              key={"card-core-web-metrics-card"}
                            >
                              <Text
                                color="#A3AED0"
                                fontWeight={"bold"}
                                fontSize={"24px"}
                              >
                                Core Web Vitals Metrics
                              </Text>
                              <Text color="#A3AED0" fontSize={"14px"}>
                                Page status breakdown by Core Web Vitals metrics
                              </Text>
                              <SimpleGrid
                                item="true"
                                key={"card-core-web-metrics-grid"}
                                columns={{ base: 1, md: 1, lg: 3, sm: 1 }}
                                // minChildWidth='1vw'
                                // gap='20px'
                                // mb='20px'
                              >
                                {values
                                  .filter(
                                    (object) =>
                                      object &&
                                      object.type === "DONUT" &&
                                      object.title !==
                                        "Core Web Vitals Overview"
                                  )
                                  .map((object) => {
                                    // {console.log("object inside donut",object)}
                                    return object.series.every(
                                      (element) => element === 0
                                    ) ? (
                                      <></>
                                    ) : (
                                      <PieCard
                                        key={object.title}
                                        percentage={
                                          ceo.states.compareView
                                            ? object.percentage
                                            : null
                                        }
                                        chartData={object.series}
                                        chartOptions={object.options}
                                        title={object.title}
                                      />
                                    );
                                  })}
                              </SimpleGrid>
                            </Card>
                          )}
                          {!Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) && (
                            <SimpleGrid
                              item="true"
                              xs={12}
                              md={12}
                              lg={12}
                              key={"sample-card-grid"}
                              gap="20px"
                              // mb="20px"
                            >
                              {values
                                .filter(
                                  (object) =>
                                    object &&
                                    object.type === "TABLE" &&
                                    object.title === "URLs tracking Table"
                                )
                                .map((object) => {
                                  return (
                                    <ComplexTable
                                      key={object.title}
                                      pageName={
                                        ceo.states.selectedDashboard.name
                                      }
                                      columnsData={object.columns}
                                      tableData={object.rows}
                                      title={object.title}
                                    />
                                  );
                                })}
                            </SimpleGrid>
                          )}
                          {Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) ? (
                            <></>
                          ) : (
                            <Card
                              direction={{ base: "column", sm: "row" }}
                              overflow="hidden"
                              variant="outline"
                            >
                              <Text
                                color="#A3AED0"
                                fontWeight={"bold"}
                                fontSize={"20px"}
                              >
                                Core Tech Improvement Opportunities
                              </Text>
                              <SimpleGrid
                                columns={{ base: 1, md: 2, lg: 3, sm: 1 }}
                              >
                                {values
                                  .filter(
                                    (object) =>
                                      object &&
                                      object.type === "TABLE" &&
                                      !(object.title === "Performance Table") &&
                                      !(
                                        object.title === "URLs tracking Table"
                                      ) &&
                                      !object.heading1 &&
                                      !object.heading2
                                  )
                                  .map((object) => {
                                    const newTitle = object.title.includes(",")
                                      ? `${object.title.split(", ")[0]}`
                                      : object.title;
                                    return (
                                      <ComplexTable
                                        pageName={
                                          ceo.states.selectedDashboard.name
                                        }
                                        columnsData={object.columns}
                                        tableData={object.rows}
                                        // title={object.title}
                                        pageNamesmall={newTitle}
                                      />
                                    );
                                  })}
                              </SimpleGrid>
                            </Card>
                          )}
                          {/* </Flex> */}
                          {!Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) && (
                            <SimpleGrid
                              item="true"
                              xs={12}
                              md={12}
                              lg={12}
                              // gap="20px"
                              key={"Urls Tracking table Grid"}
                              mb="20px"
                            >
                              {values
                                .filter(
                                  (object) =>
                                    object &&
                                    object.type === "TABLE" &&
                                    object.title === "Urls Tracking table"
                                )
                                .map((object) => {
                                  return (
                                    <ComplexTable
                                      key={object.title}
                                      pageName={
                                        ceo.states.selectedDashboard.name
                                      }
                                      columnsData={object.columns}
                                      tableData={object.rows}
                                      title={object.title}
                                      heading1={
                                        object.heading1 && object.heading1
                                      }
                                      heading2={
                                        object.heading2 && object.heading2
                                      }
                                    />
                                  );
                                })}
                            </SimpleGrid>
                          )}
                          {!Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) && (
                            <SimpleGrid
                              item="true"
                              xs={12}
                              md={12}
                              lg={12}
                              key={"Performance Table"}
                              gap="20px"
                              // mb="20px"
                            >
                              {values
                                .filter(
                                  (object) =>
                                    object &&
                                    object.type === "TABLE" &&
                                    object.title === "Performance Table"
                                )
                                .map((object) => {
                                  return (
                                    <ClickableTable
                                      pageName={
                                        ceo.states.selectedDashboard.name
                                      }
                                      columnsData={object.columns}
                                      tableData={object.rows}
                                      key={object.title}
                                      title={object.title}
                                    />
                                  );
                                })}
                            </SimpleGrid>
                          )}
                          {Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) && (
                            <div
                              style={
                                isLargerThan768
                                  ? { display: "flex", flexDirection: "row" }
                                  : { display: "flex", flexDirection: "column" }
                              }
                            >
                              <div
                                style={{
                                  width: isLargerThan768 ? "50%" : "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "20px",
                                  backgroundColor: `${backgroundcolorforcard}`,
                                  marginRight: isLargerThan768 ? "20px" : "0px",
                                  marginBottom: isLargerThan768
                                    ? "0px"
                                    : "20px",
                                  borderRadius: "15px",
                                }}
                              >
                                <CircleChart
                                  lineLengthPercentage={parseInt("50")}
                                  title={"hello world"}
                                />
                                {/* {values
                                  .filter((obj) => obj && obj.type === "CIRCLE")
                                  .map((obj, i) => {
                                    {
                                      console.log("Circle Data", obj);
                                    }
                                    return (
                                      <CircleChart
                                        lineLengthPercentage={parseInt(
                                          "50"
                                        )}
                                        title={"hello world"}
                                      />
                                    );
                                  })} */}
                              </div>
                              <SimpleGrid
                                style={{ width: "100%" }}
                                key={`${key}-scorecard`}
                                columns={{ base: 1, md: 2, lg: 2, sm: 1 }}
                                gap="20px"
                                // mb="20px"
                              >
                                {[1, 2, 3, 4, 5, 6].map((obj, i) => {
                                  return (
                                    <TechnicalScoreCard
                                      key={`${obj.title}-scorecard`}
                                      index={i}
                                      range1={"0-49"}
                                      range2={"50-75"}
                                      range3={"76-100"}
                                      data={"23"}
                                      measure={"Good"}
                                      title={"TST"}
                                    />
                                  );
                                })}
                                {/* {values
                                  .filter(
                                    (obj) => obj && obj.type === "SCORECARD"
                                  )
                                  .map((obj, i) => {
                                    console.log(obj);
                                    return (
                                      <TechnicalScoreCard
                                        key={`${obj.title}-scorecard`}
                                        index={i}
                                        range1={"0-49"}
                                        range2={"50-75"}
                                        range3={"76-100"}
                                        data={"23"}
                                        measure={"Good"}
                                        title={"TST"}
                                      />
                                    );
                                  })} */}
                              </SimpleGrid>
                            </div>
                          )}
                          {Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) && (
                            <SimpleGrid
                              style={{ width: "100%" }}
                              key={`${key}-scorecard`}
                              columns={{ base: 1, md: 1, lg: 1, sm: 1 }}
                              gap="20px"
                              // mb="20px"
                            >
                              <div
                                style={{
                                  padding: "10px",
                                  backgroundColor: `${backgroundcolorforcard}`,
                                  borderRadius: "15px",
                                }}
                              >
                                <ApexLineChart
                                  series={ApexLineChartSeries.series}
                                  options={ApexLineChartOptions.options}
                                  height={350}
                                />
                              </div>
                              <div
                                style={{
                                  padding: "10px",
                                  backgroundColor: `${backgroundcolorforcard}`,
                                  borderRadius: "15px",
                                }}
                              >
                                <ApexLineChart
                                  series={ApexLineChartSeries.series}
                                  options={ApexLineChartOptions.options}
                                  height={350}
                                />
                              </div>
                              {/* {[1, 2, 3, 4, 5, 6].map((obj, i) => {
                                return <LineChart />;
                              })} */}
                              {/* {values
                                  .filter(
                                    (obj) => obj && obj.type === "SCORECARD"
                                  )
                                  .map((obj, i) => {
                                    console.log(obj);
                                    return (
                                      <TechnicalScoreCard
                                        key={`${obj.title}-scorecard`}
                                        index={i}
                                        range1={"0-49"}
                                        range2={"50-75"}
                                        range3={"76-100"}
                                        data={"23"}
                                        measure={"Good"}
                                        title={"TST"}
                                      />
                                    );
                                  })} */}
                            </SimpleGrid>
                            // <SimpleGrid
                            //   item="true"
                            //   xs={12}
                            //   md={12}
                            //   lg={12}
                            //   key={"sample-card-grid"}
                            //   gap="20px"
                            //   // mb="20px"
                            // >
                            //   <LineChart />
                            // </SimpleGrid>
                          )}
                          {Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) ? (
                            <SimpleGrid
                              columns={{ base: 1, md: 1, lg: 1, sm: 1 }}
                              gap="20px"
                              // mb="20px"
                            >
                              {values
                                .filter(
                                  (object) =>
                                    object &&
                                    object.type === "TABLE" &&
                                    object.heading1 &&
                                    object.heading2 &&
                                    object.rows.length > 0
                                )
                                .map((object, i) => {
                                  // console.log(object.title, object.heading1);
                                  // console.log(object.title, object.heading2);
                                  const key = `title${i}`;
                                  const value = {
                                    type: "TABLE",
                                    columns: object.columns,
                                    rows: object.rows,
                                    title: `${object.title}`,
                                    heading1: `${object.heading1}`,
                                    heading2: `${object.heading2}`,
                                    pageName: ceo.states.selectedDashboard.name,
                                  };
                                  arr[key] = value;
                                })}
                              {values
                                .filter(
                                  (object) =>
                                    object &&
                                    object.type === "TABLE" &&
                                    object.heading1 &&
                                    object.heading2 &&
                                    object.rows.length > 0
                                )
                                .map((object, i) => {
                                  if (same) {
                                    renderNext = false;
                                  } else {
                                    renderNext = true;
                                  }
                                  if (arr[`title${i + 1}`] === undefined) {
                                    nextObj = "undefined";
                                  } else {
                                    nextObj = arr[`title${i + 1}`];
                                  }
                                  same =
                                    nextObj.title !== undefined
                                      ? nextObj.title === object.title
                                      : false;
                                  return (
                                    <>
                                      {renderNext ? (
                                        same ? (
                                          <Card
                                            p="0px 10px"
                                            direction={{
                                              base: "column",
                                              sm: "row",
                                            }}
                                            overflow="hidden"
                                            variant="outline"
                                          >
                                            <ComplexTable
                                              pageName={
                                                ceo.states.selectedDashboard
                                                  .name
                                              }
                                              title={object.title}
                                              columnsData={nextObj.columns}
                                              tableData={nextObj.rows}
                                              heading1={nextObj.heading1}
                                              heading2={nextObj.heading2}
                                            />
                                            <ComplexTable
                                              pageName={
                                                ceo.states.selectedDashboard
                                                  .name
                                              }
                                              columnsData={object.columns}
                                              tableData={object.rows}
                                              title={object.title}
                                              heading1={
                                                object.heading1 &&
                                                object.heading1
                                              }
                                              heading2={
                                                object.heading2 &&
                                                object.heading2
                                              }
                                              renderTitle={false}
                                            />
                                          </Card>
                                        ) : (
                                          <Card
                                            p="0px 10px"
                                            direction={{
                                              base: "column",
                                              sm: "row",
                                            }}
                                            overflow="hidden"
                                            variant="outline"
                                          >
                                            <ComplexTable
                                              pageName={
                                                ceo.states.selectedDashboard
                                                  .name
                                              }
                                              columnsData={object.columns}
                                              tableData={object.rows}
                                              title={object.title}
                                              heading1={
                                                object.heading1 &&
                                                object.heading1
                                              }
                                              heading2={
                                                object.heading2 &&
                                                object.heading2
                                              }
                                            />
                                          </Card>
                                        )
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  );
                                })}
                            </SimpleGrid>
                          ) : (
                            <></>
                          )}

                          {!Object.keys(ceo.states.chartsData.data)[0].includes(
                            "https"
                          ) && (
                            <SimpleGrid
                              item="true"
                              xs={12}
                              md={12}
                              lg={12}
                              gap="20px"
                              // mb="20px"
                            >
                              {values
                                .filter(
                                  (object) =>
                                    object && object.type === "STACKED"
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
                          )}
                        </>
                      );
                    }
                  })}
              </SimpleGrid>
            </Box>
          </>
        ) : ceo.states.transformedData === 0 ? (
          <Text>No data exists against this URL</Text>
        ) : (
          <Box mt={1.5} key={"spinner-technical"}>
            <Spinner />
          </Box>
        )}
      </Box>
    </>
  );
}
