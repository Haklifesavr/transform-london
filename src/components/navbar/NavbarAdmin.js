// Chakra Imports
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbarLinks from "components/navbar/NavbarLinksAdmin";
import { useApp } from "AppContext/AppProvider";
import { Image } from "@chakra-ui/react";
import companyLogo from "assets/img/auth/Transform-White.png";
import companyLogoBlack from "assets/img/auth/Transform-Black.png";
export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);
  const ceo = useApp();
  const navigate = useNavigate();
// 
  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  });

  const { secondary, message, brandText } = props;

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("white", "white");
  let secondaryText = useColorModeValue("white", "white");
  let navbarText = useColorModeValue("black", "white");
  let navbarcolor=useColorModeValue("white", "#151418");
  let navbarPosition = "absolute";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(20px)";
  let navbarShadow = "none";
  let navbarBg = useColorModeValue(
    "#151418",
    "#151418"
  );
  let navbarBorder = "transparent";
  let secondaryMargin = "0px";
  let paddingX = "15px";
  let gap = "0px";
  const changeNavbar = () => {               
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box id="headernavbar"
    position={navbarPosition}
    boxShadow={navbarShadow}
    bg={navbarBg}
    borderColor={navbarBorder}
    filter={navbarFilter}
    backdropFilter={navbarBackdrop}
    backgroundPosition='center'
    backgroundSize='cover'
    backgroundColor={navbarcolor}
    // borderRadius='16px'
    borderWidth='1.5px'
    borderStyle='solid'
    transitionDelay='0s, 0s, 0s, 0s'
    transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
    transition-property='box-shadow, background-color, filter, border'
    transitionTimingFunction='linear, linear, linear, linear'
    alignItems={{ xl: "center" }}
    display={secondary ? "block" : "flex"}
    // minH='75px'
    justifyContent={{ xl: "center" }}
    lineHeight='25.6px'
    mx='auto'
    mt={secondaryMargin}
    pb='8px'
    // right={{ base: "12px", md: "30px", lg: "30px", xl: "30px" }}
    right={{ base: "0px", md: "0px", lg: "0px", xl: "0px" }}
    px={{
      sm: paddingX,
      md: "10px",
    }}
    ps={{
      xl: "12px",
    }}
    pt='8px'
    top={{ base: "0px", md: "0px", xl: "0px" }}
    // w={{
    //   base: "calc(100vw - 6%)",
    //   md: "calc(100vw - 8%)",
    //   lg: "calc(100vw - 6%)",
    //   xl: "calc(100vw - 350px)",
    //   "2xl": "calc(100vw - 310px)",
    //   }}
    // w={"84.5%"}
    w={"100%"}
      >
      <Flex
        w='100%'
        flexDirection={{
          sm: "row",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
        mb={gap}>

          <Box alignSelf="center" w="auto">
          {ceo.states.selectedDashboard ? 
          <Text style={{fontWeight:"bold"}} color={navbarText} fontSize={"20px"}>{ceo.states.selectedDashboard.name}</Text>
          :
         <Image src={ceo.states.colorMode === "light" ? companyLogoBlack : companyLogo} w="200px" h="auto" alt="Image" />
          } 
         </Box>         
        <Box>
        </Box>
        <Box ms='auto' w={{ sm: "100%" }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
      {secondary ? <Text color='white'>{message}</Text> : null}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
