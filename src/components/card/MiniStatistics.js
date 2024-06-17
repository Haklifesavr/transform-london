// Chakra imports
// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
// Custom icons
import React from "react";

const NumberDisplay = ({ range }) => {
  return (
      <div
        style={{
          display: 'flex',
          width: '25vw',
        }}
      >
        <div style={{ flex: 1, backgroundColor: '#38A169', fontSize: '14px', textAlign: 'center', padding: '0.2vw'}}>{range['Good']}</div>
        <div style={{ flex: 1, backgroundColor: '#ECC94B', fontSize: '14px', textAlign: 'center', padding: '0.2vw'}}>{range['Needs Improvement']}</div>
        <div style={{ flex: 1, backgroundColor: '#E53E3E', fontSize: '14px', textAlign: 'center', padding: '0.2vw'}}>{range['Poor']}</div>
      </div>
  );
};



export default function Default(props) {
  const { startContent, endContent, name, growth, measure, ranges, value } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";

  return (
    <Card
    py='20px'     
    >
      <Flex
        my='auto'
        h='100%'
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}>
        {startContent}

        <Stat my='auto' ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize='1em'
            >
            {name}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize='1.2em'
            >
            {value}
          </StatNumber>
          {growth ? (
            <Flex align='center'>
              <Text color={growth.includes("-") ? 'red.500' : growth.includes("N/A") ? 'secondaryGray.600' : 'green.500'} fontSize='sm' fontWeight='700' me='5px'>
                {!growth.includes("-") ?
                  <>+{Math.round(growth)}</> : Math.round(growth)}
              </Text>
            {!(growth.includes("N/A")) &&
              <Text color='secondaryGray.600' fontSize='sm' fontWeight='400'>
                since last year
              </Text>}
            </Flex>
          ) : null}
          {measure ? (
            <Flex gap={'10px'} direction={'column'}>

              <Text color={measure === "Good" ? 'green.500' : measure === "Needs Improvement" ? 'yellow.400' : 'red.500'} fontSize='sm' fontWeight='700' me='5px'>
                {measure}
              </Text>
              <NumberDisplay range={ranges}/>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms='auto' w='max-content'>
          {endContent}
        </Flex>
      </Flex>
     </Card>
  );
}
