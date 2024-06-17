// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Text,
  useColorModeValue,
  useColorMode,
  Select,
  Box,
} from "@chakra-ui/react";

import Filter from "components/Filter/Filter";
import SelectNew from "react-select";
import { helpers } from "helpers/helperFunctions";

import { Image } from "@chakra-ui/react";
// Custom Components
import { ItemContent } from "components/menu/ItemContent";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "AppContext/AppProvider";
import Cookies from "js-cookie";
import { Container, Portal } from "@chakra-ui/react";
// Assets
import navImage from "assets/img/layout/Navbar.png";
import { MdNotificationsNone, MdInfoOutline } from "react-icons/md";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import routes from "routes.js";
import { useEffect, useState, startTransition } from "react";
import { ThemeEditor } from "./ThemeEditor";
import {
  ArrowBackIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
export default function HeaderLinks(props) {
  const { secondary } = props;
  // Chakra Color Mode
  const navbarIcon = useColorModeValue("gray.400", "white");
  const toggleColor = useColorModeValue("white", "gray.400");
  let menuBg = useColorModeValue("white", "#151418");
  let hoverBg = useColorModeValue("#f2f2f2", "#0d0d0d");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.700", "brand.400");
  const ethColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
  const ethBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inverted = useColorModeValue("white", "black");
  const shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const { colorMode, toggleColorMode } = useColorMode();
  const ceo = useApp();
  const navigate = useNavigate();
  const route = useLocation().pathname.split("/").slice(1);


  useEffect(() => {
    if (ceo.states.transformedData) {
      const key = Object.entries(ceo.states.transformedData.chartList)
        .reverse()
        .filter((item) => !item[0].includes("last"))[0][0];

      // FOR TECHNICAL
      if (ceo.states.selectedDashboard.name === "Technical") {
        console.log("temp state in use effect", ceo.states.tempState)
        if (isNaN(parseInt(key)) && key.includes("http")) {
          ceo.actions.setNewOption(null);
        } else {
          ceo.states.tempState ? ceo.actions.setSelectedYear(ceo.states.tempState) : ceo.actions.setSelectedYear(key);
        }
      }
      // FOR PERFORMANCE PAGE
      else if (
        ceo.states.selectedDashboard.name === "CLTV" ||
        ceo.states.selectedDashboard.name === "Overview" ||
        ceo.states.selectedDashboard.name === "Performance" ||
        ceo.states.selectedDashboard.name === "Opportunity"
      ) {
        if (isNaN(parseInt(key)) && !key.includes("days")) {
          ceo.actions.setNewOption(null);
        } else {
          ceo.states.tempState
            ? ceo.actions.setSelectedYear(ceo.states.tempState)
            : ceo.actions.setSelectedYear(key);
        }
      }
    }
  }, [ceo.states.transformedData]);

  const handleClick = () => {
    ceo.actions.emptyAllStates();
    navigate("/auth");
  };

  const handleChannel = () => {
    ceo.actions.setCompareView(null);
    ceo.actions.setCompareData(null);
    ceo.actions.setNewOption(null);
    ceo.actions.setChartsData(null);
    ceo.actions.setTransformedData(null);
    const temp = ceo.states.selectedDashboard;
    ceo.actions.setSelectedDashboard({});
    ceo.actions.setSelectedYear(ceo.states.tempState);
    console.log(
      "debug year and temp state",
      ceo.states.selectedYear,
      ceo.states.tempState
    );
    // setTimeout(() => {
    //   ceo.actions.setSelectedDashboard(temp);
    // }, 100);

    startTransition(() => {
      ceo.actions.setSelectedDashboard(temp);
    });
  };
  const handleURL = () => {
    console.log("inside handleURL before", ceo.states.tempState, ceo.states.selectedYear, ceo.states.selectedDashboard)
    ceo.actions.setNewOption(null);
    ceo.actions.setSelectedYear(null);
    ceo.actions.setTransformedData(null);
    ceo.actions.setChartsData(null);
    const temp = ceo.states.selectedDashboard;
    ceo.actions.setSelectedDashboard({});
    ceo.actions.setSelectedYear(ceo.states.tempState);
    // ceo.actions.setTempState(null)
    startTransition(() => {
      ceo.actions.setSelectedDashboard(temp);
    });
    // setTimeout(() => {
    //   ceo.actions.setSelectedDashboard(temp);
    // }, 100);
    console.log("inside handleURL after", ceo.states.tempState, ceo.states.selectedYear, ceo.states.selectedDashboard)
  };
  const handleYear = () => {
    ceo.actions.setCompareView(null);
    ceo.actions.setCompareData(null);
    ceo.actions.setNewOption(null);
    ceo.actions.setTempState(null);
    ceo.actions.setCompanyDetails(null);
    ceo.actions.setSelectedDashboard(null);
    ceo.actions.setSelectedYear(null);
    ceo.actions.setTransformedData(null);
    ceo.actions.setChartsData(null);
    navigate("/dashboards");
  };

  return (
    <Flex
      id="master_flex_header_navbar"
      justifyContent={"end"}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      gap="30px"
      p="10px"
    >

      {/* <SidebarResponsive routes={routes} /> */}
      {/* {console.log('console log overview', ceo.states, ceo.states.transformedData)} */}
      {((ceo.states.transformedData && route.includes('admin')) && ceo.states.selectedYear) ?
        <>
          {
            (isNaN(parseInt(ceo.states.selectedYear)) && !(ceo.states.selectedYear.includes("days")) && ceo.states.selectedDashboard.name === "Performance") ?
              <Button boxShadow='none' variant="contained" color={navbarIcon} onClick={() => handleChannel()}  >
                <ChevronLeftIcon /> Back
              </Button>
              :
              ceo.states.selectedYear.includes("http") ?
                <Button boxShadow='none' variant="contained" color={navbarIcon} onClick={() => handleURL()}  >
                  <ChevronLeftIcon /> Back
                </Button>
                :
                <Button boxShadow='none' variant="contained" color={navbarIcon} onClick={() => handleYear()}  >
                  <ChevronLeftIcon /> Back
                </Button>
          }
        </>
        :
        (ceo.states.selectedDashboard) ?
          <>
            <Button boxShadow='none' variant="contained" color={navbarIcon} onClick={() => handleYear()}  >
              <ChevronLeftIcon /> Back
            </Button>
          </>
          :
          <>
          </>
      }

      <Menu>
        <MenuButton onClick={toggleColorMode} p="0px">
          <Icon
            mt="6px"
            as={colorMode === "light" ? IoMdMoon : IoMdSunny}
            color={navbarIcon}
            w="25px"
            h="25px"
            me="10px"
          />
        </MenuButton>
      </Menu>


      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name="Haseeb"
            bg="#000000"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          id="profile_options_popup"
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, Haseeb
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              px={4}
              py={2}
              transition="all 0.2s"
              borderRadius="md"
              borderWidth="1px"
              _hover={{ bg: hoverBg }}
              onClick={handleClick}
            >
              <Text fontSize="sm">Sign Out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
