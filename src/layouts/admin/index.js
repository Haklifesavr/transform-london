// Chakra imports
import { Portal, Box, useDisclosure } from "@chakra-ui/react";
import Footer from "components/footer/FooterAdmin.js";
// Layout components
import Navbar from "components/navbar/NavbarAdmin.js";
import Sidebar from "components/sidebar/Sidebar.js";
import { SidebarContext } from "contexts/SidebarContext";
import React, { useState } from "react";
// import { Redirect, Route, Switch } from "react-router-dom";
import { Route, Routes, useNavigate } from "react-router-dom"
import routes from "routes.js";
import UserReports from "views/admin/default";
import { useApp } from "AppContext/AppProvider";
// Custom Chakra theme
export default function Dashboard(props) {
  // const navigate = useNavigate()
  const { ...rest } = props;
  const ceo = useApp();
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  // functions for changing the states from components

  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}>
        {/* <Portal> */}
        <Sidebar position="absolute" routes={routes} display='none' {...rest} zIndex="9999" />
        {/* </Portal> */}
        <Box
          float='right'
          minHeight='100vh'
          height='100%'
          overflow='auto'
          position='relative'
          maxHeight='100%'
          w={{ base: "100%", xl: "calc( 100% - 300px )" }}
          // maxWidth={{ base: "100%", xl: "calc( 100% - 290px )" }}
          transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
          transitionDuration='.2s, .2s, .35s'
          transitionProperty='top, bottom, width'
          transitionTimingFunction='linear, linear, ease'
        >
          {ceo.states.selectedDashboard &&
            <Navbar
              onOpen={onOpen}
              brandText={ceo.states.selectedDashboard.name}
              fixed={fixed}
              {...rest}
            />
          } 
          <Box
            p={5}
          // w={"95%"}
          // alignItems={"center"}
          >
            <UserReports />
          </Box>

          {/* <UserReports /> */}
        </Box>


        {/* <Box>
            <Footer />
          </Box> */}
      </SidebarContext.Provider>
    </Box>
  );
}
