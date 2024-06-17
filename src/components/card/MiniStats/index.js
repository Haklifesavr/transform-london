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


export default function MiniStats(props) {
  const { startContent, endContent, name, growth, value, nameBig } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  return (
    <>
      <Flex
        my='auto'
        h='100%'
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}>
        {startContent}

        <Stat my='auto'>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize='1em'
            >
            {name}
          </StatLabel>
          <StatLabel
            lineHeight='100%'
            color={textColorSecondary}
            fontSize='1.5em'
            >
            {nameBig}
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
                {growth}
              </Text>
            {!(growth.includes("N/A")) &&
              <Text color='secondaryGray.600' fontSize='sm' fontWeight='400'>
                since last year
              </Text>}
            </Flex>
          ) : null}
        </Stat>
        <Flex ms='auto' w='max-content'>
          {endContent}
        </Flex>
      </Flex>
      </>
  );
}
