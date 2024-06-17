/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useApp } from "AppContext/AppProvider";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  const ceo = useApp();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("black", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const [setUseColor, useColor] = React.useState(null)
  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };
  const activeRouteHandle = (event, page) => {
    const dashboarddic = ceo.states.userDashboards.filter(data => data.name===ceo.states.companyDetails)
    // console.log('test name...!', ceo.states.userDashboards);
    // console.log('test name...!', dashboarddic, page);
    // console.log('test name...!', ceo.states.companyDetails);
    const dashboardpage = dashboarddic[0].pages.filter(data => data.name===page)
    // console.log('test name...!', dashboardpage[0]);
    if (ceo.states.selectedDashboard.name !== page)
    {
      ceo.actions.setTransformedData(null);
      ceo.actions.setChartsData(null);  
    }
    // console.log("test name...!",page, dashboardpage)
    ceo.actions.setSelectedDashboard(dashboardpage[0]);
    ceo.actions.setCompanyDetails(dashboarddic[0].name);
    // navigate("/admin");
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const names = ceo.states.userDashboards.filter(data => data.name===ceo.states.companyDetails)[0].pages.map((item) => item.name);
  // console.log('test name...', names);
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight='bold'
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='18px'
              pb='12px'
              key={index}>
              {route.name}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (
        (route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl") && names.includes(route.name)
      ) {
        return (
          <NavLink key={index} to={route.layout + route.path}  onClick={event => activeRouteHandle(event, route.name)}>
            {route.icon ? (
              <Box>
                <HStack 
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box
                    color={ceo.states.selectedDashboard.name ===  route.name ? "#422AFB" : activeIcon}
                      // color={
                      //   activeRoute(route.path.toLowerCase())
                      //     ? activeIcon
                      //     : textColor
                      // }
                      me='18px'>
                      {route.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={ceo.states.selectedDashboard.name ===  route.name ? "#422AFB" : activeIcon}
                      // color={
                      //   activeRoute(route.path.toLowerCase())
                      //     ? activeColor
                      //     : textColor
                      // }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }>
                      {route.name}
                    </Text>
                  </Flex>
                  <Box
                    h='36px'
                    w='4px'
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius='5px'
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Text
                    me='auto'
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }>
                    {route.name}
                  </Text>
                  <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;