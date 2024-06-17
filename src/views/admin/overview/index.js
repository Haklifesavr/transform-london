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
  Stack,
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
import { activeRouteHandle } from "helpers/constants";
import TechnicalScoreCard from "components/charts/TechnicalScoreCard/TechnicalScoreCard";
import CircleChart from "components/charts/CircleChart/CircleChart";
import { object } from "underscore";

export default function Overview() {
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // Chakra Color Mode
  const ceo = useApp();
  const textColor = useColorModeValue("black", "white");
  const bgcolor = useColorModeValue("white", "black");
  let backgroundcolorforcard = useColorModeValue("white", "#151418");
  const [isLargerThan920] = useMediaQuery("(min-width: 920px)");
  const [isSmallScreen] = useMediaQuery(
    "(min-width: 700px) and (max-width: 1024px)"
  );
  const selectStyles = {
    menu: (base) => ({
      ...base,
      borderRadius: "0.25rem",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      zIndex: "9999",
      color: "red", // Set the text color to red
      // Add any other styles you want to customize the popup
    }),
    option: (base, { isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "blue.500" : "white",
      color: isSelected ? "white" : "black",
      // Add any other styles you want to customize the options
    }),
  };
  const [isLarge] = useMediaQuery("(min-width: 920px)");
  const bg1 = useColorModeValue("white", "#151418");
  const [isMedium] = useMediaQuery(
    "(min-width: 600px) and (max-width: 1023px)"
  );
  // const [isSmall] = useMediaQuery("(max-width: 500px)");
  const DonutView = ({ values, width, title }) => {
    console.log(
      "inside donut view overview",
      ceo.states.selectedDashboard.name
    );
    return (
      <SimpleGrid
        spacing={10}
        // width={isLarge ? "700px" : "100%"}
        width={"100%"}
        gap="20px"
        key={`${title}-stacked-grid`}
        // mb="20px"
        id="testingid"
      >
        {values
          .filter((object) => object && object.type === "DONUT")
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
                pageName={ceo.states.selectedDashboard.name}
              />
            );
          })}
      </SimpleGrid>
    );
  };

  const StackedColumnView = ({ values, width, type }) => {
    console.log("valuessssss", values);
    return (
      <SimpleGrid width={"100%"} key={"stacked-column-view"}>
        {/* {render && (
          <Select>
            <option
              style={{ color: `${textColor}`, backgroundColor: `${bgcolor}` }}
              value="30days"
            >
              Last 30 days
            </option>
            <option
              style={{ color: `${textColor}`, backgroundColor: `${bgcolor}` }}
              value="60days"
            >
              Last 60 days
            </option>
            <option
              style={{ color: `${textColor}`, backgroundColor: `${bgcolor}` }}
              value="90days"
            >
              Last 90 days
            </option>
          </Select>
        )} */}
        {values
          .filter((object) => object && object.type === type)
          .map((object) => {
            return (
              <BarChartComponent
                key={`${object.title}-stacked-column-view`}
                chartData={object.series}
                chartOptions={object.options}
                // title={object.title}
                size={isLarge}
              />
            );
          })}
      </SimpleGrid>
    );
  };
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

  return (
    <>
      <Box
        id="performance_dashboard_box"
        pt={{ base: "80px", md: "80px", xl: "80px" }}
      >
        {ceo.states.transformedData ? (
          <>
            {console.log(
              "Performance Test",
              ceo.states.transformedData.chartList
            )}
            {ceo.states.transformedData.chartList["2023"] && (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    backgroundColor: `${bg1}`,
                    marginBottom: "20px",
                    borderRadius: "20px",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontSize: "16px",
                        borderRadius: "10px",
                        color: `#A0AEC0`,
                      }}
                    >
                      Company Name
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {capitalizeFirstLetter(ceo.states.companyDetails)}
                    </span>
                  </div>
                  <IconBox
                    w="3.2em"
                    h="3.2em"
                    style={{ marginLeft: "auto" }}
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
                </div>
                <div
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#422AFB",
                      width: "6px",
                      height: "23px",
                      marginRight: "5px",
                    }}
                  ></div>
                  <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                    Performance Summary
                  </span>
                </div>
                <SimpleGrid
                  columns={{ base: 1, md: 3, lg: 3, sm: 1 }}
                  // minChildWidth='20vw'
                  gap="20px"
                  mb="20px"
                >
                  {ceo.states.transformedData.chartList["2023"]
                    .filter((obj) => obj && obj.type === "SCORECARD")
                    .map((obj) => {
                      console.log("onj", obj);
                      // {console.log("object inside scorecard",obj)}
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
                            growth={obj.difference}
                            name={obj.title}
                            value={obj.data}
                          />
                        </>
                      );
                    })}
                </SimpleGrid>
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
                    {isLarge ? (
                      <Stack>
                        <HStack style={{ width: "100%" }}>
                          <div style={{ width: "50%" }}>
                            {ceo.states.transformedData.chartList["2023"]
                              .filter(
                                (object) => object && object.type === "DONUT"
                              )
                              .map((object) => {
                                console.log("oooobject title", object.title);
                                return (
                                  <div
                                    style={{
                                      color: "#A3AED0",
                                      fontWeight: "bold",
                                      fontSize: "20px",
                                    }}
                                  >
                                    {object.title}
                                  </div>
                                );
                              })}
                          </div>
                          <div style={{ width: "50%" }}>
                            {ceo.states.transformedData.chartList["2023"]
                              .filter(
                                (object) => object && object.type === "BAR"
                              )
                              .map((object) => {
                                return (
                                  <div
                                    style={{
                                      color: "#A3AED0",
                                      fontWeight: "bold",
                                      fontSize: "20px",
                                    }}
                                  >
                                    {object.title}
                                  </div>
                                );
                              })}
                          </div>
                        </HStack>
                        <HStack>
                          <DonutView
                            values={
                              ceo.states.transformedData.chartList["2023"]
                            }
                            width="27vw"
                          />
                          <StackedColumnView
                            type="BAR"
                            values={
                              ceo.states.transformedData.chartList["2023"]
                            }
                            width="45vw"
                          />
                        </HStack>
                      </Stack>
                    ) : (
                      <Stack>
                        {ceo.states.transformedData.chartList["2023"]
                          .filter((object) => object && object.type === "DONUT")
                          .map((object) => {
                            console.log("oooobject title", object.title);
                            return (
                              <div
                                style={{
                                  color: "#A3AED0",
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                }}
                              >
                                {object.title}
                              </div>
                            );
                          })}
                        <DonutView
                          values={ceo.states.transformedData.chartList["2023"]}
                          width="100%"
                        />
                        {ceo.states.transformedData.chartList["2023"]
                          .filter((object) => object && object.type === "BAR")
                          .map((object) => {
                            return (
                              <div
                                style={{
                                  color: "#A3AED0",
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                }}
                              >
                                {object.title}
                              </div>
                            );
                          })}
                        <StackedColumnView
                          type="BAR"
                          values={ceo.states.transformedData.chartList["2023"]}
                          width="100%"
                        />
                      </Stack>
                    )}
                  </SimpleGrid>
                </Card>
                <div
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                    display: "flex",
                  }}
                >
                  <button
                    onClick={() => {
                      activeRouteHandle("Performance", ceo, null);
                    }}
                    style={{
                      color: "white",
                      backgroundColor: "#422AFB",
                      padding: "7px 10px",
                      borderRadius: "5px",
                      marginTop: "20px",
                    }}
                  >
                    View Full Report
                  </button>
                </div>
                <hr
                  style={{
                    width: "100%",
                    height: "3px",
                    backgroundColor: "white",
                    opacity: "0.3",
                    margin: "20px 0px",
                  }}
                ></hr>
              </>
            )}
            {ceo.states.transformedData.chartList["desktop"] && (
              <>
                <div
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#38A169",
                      width: "6px",
                      height: "23px",
                      marginRight: "5px",
                    }}
                  ></div>
                  <span style={{ fontWeight: "bold", fontSize: "24px" }}>
                    Technical Summary (Desktop)
                  </span>
                </div>
                <div
                  style={
                    isLargerThan920
                      ? { display: "flex", flexDirection: "row" }
                      : { display: "flex", flexDirection: "column" }
                  }
                >
                  <div
                    style={{
                      width: isLargerThan920 ? "50%" : "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      backgroundColor: `${backgroundcolorforcard}`,
                      marginRight: isLargerThan920 ? "20px" : "0px",
                      marginBottom: isLargerThan920 ? "0px" : "20px",
                      borderRadius: "15px",
                    }}
                  >
                    {/* <CircleChart lineLengthPercentage={70} title={"Performance Score"} /> */}
                    {ceo.states.transformedData.chartList["desktop"]
                      .filter((obj) => obj && obj.type === "CIRCLE")
                      .map((obj, i) => {
                        return (
                          <CircleChart
                            lineLengthPercentage={obj.score}
                            title={obj.title}
                          />
                        );
                      })}
                  </div>
                  <SimpleGrid
                    style={{ width: "100%" }}
                    key={`we-scorecard`}
                    columns={{ base: 1, md: 2, lg: 2, sm: 1 }}
                    gap="20px"
                    // mb="20px"
                  >
                    {ceo.states.transformedData.chartList["desktop"]
                      .filter((obj) => obj && obj.type === "SCORECARD")
                      .map((obj, i) => {
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
                <Card
                  style={{ marginTop: "20px" }}
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
                    {isLarge ? (
                      <Stack>
                        <HStack style={{ width: "100%" }}>
                          <div style={{ width: "50%" }}>
                            {ceo.states.transformedData.chartList["desktop"]
                              .filter(
                                (object) => object && object.type === "DONUT"
                              )
                              .map((object) => {
                                console.log("oooobject title", object.title);
                                return (
                                  <div
                                    style={{
                                      color: "#A3AED0",
                                      fontWeight: "bold",
                                      fontSize: "20px",
                                    }}
                                  >
                                    {object.title}
                                  </div>
                                );
                              })}
                          </div>
                          <div style={{ width: "50%" }}>
                            {ceo.states.transformedData.chartList["desktop"]
                              .filter(
                                (object) =>
                                  object && object.type === "STACKEDCOLUMN"
                              )
                              .map((object) => {
                                return (
                                  <div
                                    style={{
                                      color: "#A3AED0",
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {object.title}
                                  </div>
                                );
                              })}
                          </div>
                        </HStack>
                        <HStack>
                          <DonutView
                            values={
                              ceo.states.transformedData.chartList["desktop"]
                            }
                            width="27vw"
                          />
                          <StackedColumnView
                            type="STACKEDCOLUMN"
                            values={
                              ceo.states.transformedData.chartList["desktop"]
                            }
                            width="45vw"
                          />
                        </HStack>
                      </Stack>
                    ) : (
                      <Stack>
                        {ceo.states.transformedData.chartList["desktop"]
                          .filter((object) => object && object.type === "DONUT")
                          .map((object) => {
                            console.log("oooobject title", object.title);
                            return (
                              <div
                                style={{
                                  color: "#A3AED0",
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                }}
                              >
                                {object.title}
                              </div>
                            );
                          })}
                        <DonutView
                          values={
                            ceo.states.transformedData.chartList["desktop"]
                          }
                          width="100%"
                        />
                        {ceo.states.transformedData.chartList["desktop"]
                          .filter(
                            (object) =>
                              object && object.type === "STACKEDCOLUMN"
                          )
                          .map((object) => {
                            return (
                              <div
                                style={{
                                  color: "#A3AED0",
                                  fontWeight: "bold",
                                  fontSize: "20px",
                                }}
                              >
                                {object.title}
                              </div>
                            );
                          })}
                        <StackedColumnView
                          type="STACKEDCOLUMN"
                          values={
                            ceo.states.transformedData.chartList["desktop"]
                          }
                          width="100%"
                        />
                      </Stack>
                    )}

                    {/* {isLarge ? (
                      <HStack>
                        <DonutView
                          values={
                            ceo.states.transformedData.chartList["desktop"]
                          }
                          width="27vw"
                        />
                        <StackedColumnView
                          type="STACKEDCOLUMN"
                          values={
                            ceo.states.transformedData.chartList["desktop"]
                          }
                          width="45vw"
                        />
                      </HStack>
                    ) : (
                      <Stack>
                        <DonutView
                          values={
                            ceo.states.transformedData.chartList["desktop"]
                          }
                          width="100%"
                        />
                        <StackedColumnView
                          type="STACKEDCOLUMN"
                          values={
                            ceo.states.transformedData.chartList["desktop"]
                          }
                          width="100%"
                        />
                      </Stack>
                    )} */}
                  </SimpleGrid>
                </Card>
                <div
                  style={{
                    width: "100%",
                    justifyContent: "flex-end",
                    display: "flex",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={() => {
                      activeRouteHandle("Technical", ceo, "mobile");
                    }}
                    style={{
                      color: "white",
                      backgroundColor: "#38A169",
                      padding: "7px 10px",
                      borderRadius: "5px",
                      marginRight: "10px",
                    }}
                  >
                    View Mobile Report
                  </button>

                  <button
                    onClick={() => {
                      activeRouteHandle("Technical", ceo, null);
                    }}
                    style={{
                      color: "white",
                      backgroundColor: "#38A169",
                      padding: "7px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    View Full Report
                  </button>
                </div>
              </>
            )}
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
