import { Button, Spinner } from "@chakra-ui/react";
import {
    Flex,
    Stat,
    StatLabel,
    StatNumber,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import { useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { useApp } from "AppContext/AppProvider";
import { useNavigate } from "react-router-dom";
import Navbar from "components/navbar/NavbarAdmin.js";
import { Portal, useDisclosure } from "@chakra-ui/react";
import routes from "routes.js";
import { SimpleGrid } from "@chakra-ui/react";

function ListDashboard() {
    const ceo = useApp();
    const navigate = useNavigate();
    const { onOpen } = useDisclosure();
    const [fixed] = useState(false);
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const buttonColor = useColorModeValue("gray", "gray");
    const textColorSecondary = "secondaryGray.600";

    const getActiveRoute = (routes) => {
        let activeRoute = "Dashboards";
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = getActiveRoute(routes[i].items);
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute;
                }
            } else if (routes[i].category) {
                let categoryActiveRoute = getActiveRoute(routes[i].items);
                if (categoryActiveRoute !== activeRoute) {
                    return categoryActiveRoute;
                }
            } else {
                if (
                    window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
                ) {
                    return routes[i].name;
                }
            }
        }
        return activeRoute;
    };
    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbar(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbar(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (
                    window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
                ) {
                    return routes[i].secondary;
                }
            }
        }
        return activeNavbar;
    };
    const getActiveNavbarText = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (
                    window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
                ) {
                    return routes[i].messageNavbar;
                }
            }
        }
        return activeNavbar;
    };
    return (
        <Box p={10}>
            <Portal>
                <Box>
                    <Navbar
                        onOpen={onOpen}
                        logoText={"Horizon UI Dashboard PRO"}
                        brandText={getActiveRoute(routes)}
                        secondary={getActiveNavbar(routes)}
                        message={getActiveNavbarText(routes)}
                        fixed={fixed}
                    />
                </Box>
            </Portal>

            <Box>
                <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
                    gap='20px'
                    mb='20px'>

                    {ceo.states.userDashboards
                        ? ceo.states.userDashboards.map((dashboard) => {
                            { console.log("user dashboards overview", ceo.states.userDashboards) }
                            return (
                                <Box pt={{ base: "130px", md: "80px", xl: "80px" }} key={dashboard.id}>
                                    <Card
                                        py='20px'>
                                        <Flex
                                            my='auto'
                                            h='100%'
                                            align={{ base: "center", xl: "start" }}
                                            justify={{ base: "center", xl: "center" }}>
                                            {/* {startContent} */}

                                            <Stat my='auto'
                                                // ms={startContent ? "18px" : "0px"}
                                                ms={"0px"}
                                            >
                                                <StatLabel
                                                    lineHeight='100%'
                                                    color={textColorSecondary}
                                                    // fontSize={{
                                                    //   base: "0.8em",
                                                    // }}
                                                    fontSize='1em'
                                                >
                                                    Owner: Haseeb Shaik
                                                </StatLabel>
                                                <StatNumber
                                                    color={textColor}
                                                    // fontSize={{
                                                    //   base: "1.3em",
                                                    // }}
                                                    fontSize='1.2em'
                                                >
                                                    {dashboard.name}
                                                </StatNumber>
                                            </Stat>

                                        </Flex>
                                        <Flex ms='auto' w='max-content' flexDirection='row' mt='5px' columnGap='5px'>
                                            {/* {endContent} */}
                                            {/* Haris */}
                                            {dashboard.pages
                                                .filter((page) => page && !['Technical', 'Performance'].includes(page.name))
                                                .map((page) => {
                                                    console.log('dashboard.pages  overview', page)

                                                    return (
                                                        <div key={page.id}>
                                                            <Button
                                                                colorScheme={buttonColor}
                                                                variant='solid'
                                                                width='130px'
                                                                boxShadow='none'
                                                                onClick={() => {
                                                                    // set_loading(false);
                                                                    ceo.actions.setTransformedData(null);
                                                                    ceo.actions.setChartsData(null);
                                                                    // console.log("Selected page is",page, dashboard)
                                                                    ceo.actions.setSelectedDashboard(page);
                                                                    ceo.actions.setCompanyDetails(dashboard.name);
                                                                    navigate("/admin");
                                                                }
                                                                }
                                                            >{page.name}</Button></div>
                                                    )
                                                })}
                                        </Flex>
                                    </Card>
                                </Box>

                            );
                        })
                        :
                        <Box pt={{ base: "130px", md: "80px", xl: "80px" }} >
                            <Spinner p={25} />
                        </Box>
                    }
                </SimpleGrid>
            </Box>
            {/* <ReusableTable data={myData}/> */}
        </Box>
    );
}

export default ListDashboard;
