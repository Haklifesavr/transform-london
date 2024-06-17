import React from "react";
import { useApp } from "AppContext/AppProvider";
// Chakra imports
import { Flex, useColorModeValue, Text, Box, Image, useMediaQuery } from "@chakra-ui/react";
import companyLogo from "assets/img/auth/Transform-White.png";
import companyLogoBlack from "assets/img/auth/Transform-Black.png";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  const ceo = useApp();
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");
  const [isSmallScreen] = useMediaQuery("(min-width: 1200px) and (max-width: 1660px)");

  return (
    <Flex align='center' direction='column'>
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      {/* <Text>Transform London</Text> */}
      <Box alignSelf="center" w="9vw"
      // mb={isSmallScreen ? "20px" : "16px"}
      mb={"60px"}
      >
      <Image src={ceo.states.colorMode === "light" ? companyLogoBlack : companyLogo} alt="Image" />
      </Box>
      {/* <HSeparator mb='20px' /> */}
      {/*  */}
    </Flex>
  );
}

export default SidebarBrand;
