// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import PieChart from "components/charts/PieChart";
import { pieChartData, pieChartOptions } from "variables/charts";
import { VSeparator } from "components/separator/Separator";
import React from "react";

export default function Conversion({chartOptions, chartData, title, percentage, pageName}) {
  // const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  const textColorSecondary = "secondaryGray.600";
  if (title === "Total Engaged Sessions By Channel 2023"){
    console.log("debug donut charts", chartOptions, chartData, title, percentage)
  }
  return (
    <Card p='20px' align={pageName && pageName == "Overview" && title == "Total Engaged Sessions By Channel 2023" ? 'left' : 'center'} direction='column'>
      <Flex
        px={{ base: "0px", "2xl": "10px" }}
        justifyContent='space-between'
        alignItems={pageName && pageName == "Overview" && title == "Total Engaged Sessions By Channel 2023" ? 'left' : 'center'}
        direction={"column"}
        mb='8px'
        >
        <Text color={textColorSecondary} fontSize='md' fontWeight='600' mt='4px'>
          {title}
        </Text>
        {
      percentage && 
        <Flex align={pageName && pageName == "Overview" && title == "Total Engaged Sessions By Channel 2023" ? 'left' : 'center'} pt='5px' gap={2}>
          <Text fontSize='sm' fontWeight='700' color={percentage.includes("-") ? 'red.500' : percentage.includes("N/A") ? 'secondaryGray.600' : 'green.500'}>
            {percentage}
          </Text>
          {!(percentage.includes("N/A")) &&
          <Text color='secondaryGray.600' fontSize='sm' fontWeight='400'>
            since last year
          </Text>}
        </Flex>
      }
        {/* <Select
          fontSize='sm'
          variant='subtle'
          defaultValue='monthly'
          width='unset'
          fontWeight='700'>
          <option value='daily'>Daily</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </Select> */}
      </Flex>
    
      <PieChart
        chartData={chartData}
        chartOptions={chartOptions}
      />
    </Card>
  );
}
