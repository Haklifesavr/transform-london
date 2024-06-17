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
  import { useEffect, useState } from "react";
//   import { ThemeEditor } from "./ThemeEditor";
  import {
    ArrowBackIcon,
    ChevronLeftIcon,
    ChevronDownIcon,
  } from "@chakra-ui/icons";
  export default function Filter(props) {
    const ceo = useApp();
    const [custom, setCustom] = useState(false);

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    // IndicatorContainer: (styles) => ({display:'none'}),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        // backgroundColor: isDisabled ? 'red' : 'blue',
        color: "#000",
        cursor: isDisabled ? "not-allowed" : "default",
      };
    },
  };

  const getOptions = (chartList) => {
    let a = Object.entries(chartList)
              .reverse()
              .map((data,i) => {
                const key = data[0];
                if (key.includes("last")) {
                  // temp_key = 
                  // console.log('filter check ......', );
                  return (custom ? {value: key, label: key.split('_').join(' ').replace('last', 'Last')} : null); // exclude key
                }
                else if ((isNaN(parseInt(key)) && !(key.includes("days")))) {
                  return ({value: key, label: key})
                }

                return (custom ? null : {value: key, label: key})
              }).filter(item => item !== null);

    let check_days = Object.entries(chartList)
              .reverse()
              .map((data,i) => {
                const key = data[0];
                if (key.includes("last")) {
                  return true; // exclude key
                }
                else {
                  return false;
                }
              })

    if (check_days.includes(true)) {
    !(custom) ? a.push({value: "Custom", label: "Custom"}) : a.push({value: "Back", label: "Back"})
    !(ceo.states.newOption) && custom && !(ceo.states.tempState) && ceo.actions.setSelectedYear(a[0].value)
    !(ceo.states.newOption) && !(custom) && !(ceo.states.tempState) && ceo.actions.setSelectedYear(a[0].value)
  }
    return a
  }

  const handleChange = (selectedOption) => {
    let result = selectedOption.some(obj => Object.values(obj).some(val => {
      if (typeof val === 'string') {
        return val.toLowerCase().includes("Custom".toLowerCase()) ? true : false;
      }
    }));

    let foundCustom = false;
    let foundBack = false;

    selectedOption.some(obj => {
      Object.values(obj).some(val => {
        if (typeof val === 'string') {
          if (val.toLowerCase().includes('custom')) {
            foundCustom = true;
            return true;
          } else if (val.toLowerCase().includes('back')) {
            foundBack = true;
            return true;
          }
        }
      });
      return foundCustom || foundBack;
    });

    let btn = foundCustom ? 'Custom' : foundBack ? 'Back' : null;

      // console.log("debug selectedOption and btn", selectedOption, btn)
  
    if (selectedOption) {
      if (result && btn === "Custom") {
      // console.log("debug inside custom and result", btn)
      ceo.actions.setTempState(null);
      ceo.actions.setNewOption(null);
      }
      else if (btn === "Custom"){
        // console.log("debug inside custom", btn)
        ceo.actions.setTempState(null);
        ceo.actions.setNewOption(null);
      }
      else if (btn === "Back") {
      // console.log("debug inside back", btn)
      ceo.actions.setTempState(null);
      ceo.actions.setNewOption(null);
      }
      else {
      ceo.actions.setNewOption(selectedOption)
      }
    } else {
      ceo.actions.setNewOption(null);
    }

    if (selectedOption.some(obj => obj.label === "Custom" || obj.label === "Back")) {
      setCustom(result)
      }

    if (selectedOption.length === 1 && !(result) && btn !== "Back") {
      ceo.actions.setSelectedYear(selectedOption[0]["value"])
      ceo.actions.setCompareView(null)
      ceo.actions.setCompareData(null)
    }
    else if (selectedOption.length === 2 && !(result) && btn !== "Back") {
      helpers.getRecent(selectedOption[0]["value"],selectedOption[1]["value"], ceo.actions.setSelectedYear, ceo.actions.setCompareView, ceo.states.transformedData.chartList, ceo.actions.setCompareData)
    }
    else {
      ceo.actions.setCompareView(null)
      ceo.actions.setCompareData(null)
    }
  };

  // console.log('value result 123', );
  // let value_filter = ceo.states.selectedYear;
  // let label_filter = ceo.states.selectedYear;
  // let key_label = data[0];
  return(
        // {console.log("debug new option before select new", ceo.states.newOption)}
          <SelectNew
          classNamePrefix="react-select"
          // defaultValue={[{value: ceo.states.selectedYear, label: ceo.states.selectedYear}]}
          value={ceo.states.newOption ? ceo.states.newOption : [{value: ceo.states.selectedYear, label: ceo.states.selectedYear ? ceo.states.selectedYear.includes('last_') ? ceo.states.selectedYear.split('_').join(' ').replace('last', 'Last') : ceo.states.selectedYear :  ceo.states.selectedYear }]}
          closeMenuOnSelect={false}
          onChange={handleChange}
          isMulti
          isOptionDisabled={() => ceo.states.compareView !== null}
          options={
            getOptions(ceo.states.transformedData.chartList)
          }
          styles={colourStyles}
        /> 
    )
  }