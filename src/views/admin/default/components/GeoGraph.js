import React from "react";
import { Chart } from "react-google-charts";

export const geo_data = [
    ["Country", "Total Revenue By Country"],
    ["United Kingdom", 5072775.59],
    ["Jersey",11398.6792],
    ["Ireland",6715.343489],
    ["Spain",1986.508483],
    ["United States",591.898257],
    ["Netherlands",373.7]
];

export const geo_options = {
    // region:"150",
    title:"Total Revenue by country",
    geochartVersion:11,
    magnifyingGlass:
    {enable: true, zoomFactor: 7.5},
    colorAxis: { colors: ["#00853f", "blue", "#e31b23"] },
//   backgroundColor: "#000000",
  datalessRegionColor: "#f8bbd0",
  defaultColor: "#f5f5f5",
};

