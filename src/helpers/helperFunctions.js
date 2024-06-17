import {
  colorList,
  treemapConfig__generator,
  colorDarknessChecker,
  cb_color_cycle,
  colorMap,
} from "./constants";
import _, { map } from "underscore";

const combined_bar_charts_colors = [
  "blue",
  "white",
  //more colors to add when need arises
];

let shades = [
  "#422afb",
  "#6956fc",
  "#5a48e7",
  "#8576f7",
  "#3421ca",
  "#4e41af",
  "#877dd2",
  "#231968",
  "#2000ff",
  "#3a3275",
  "#978de6",
  "#645CBB",
  "#A084DC",
  "#BFACE2",
  "#EBC7E6",
  "#674188",
  "#5B8FB9",
  "#03001C",
  "#453C67",
  "#6D67E4",
  "#46C2CB",
  "#F2F7A1",
  "#00005C",
  "#F49D1A",
  "#FFADBC",
  "#EF9A53",
  "#8D9EFF",
  "#ECA869",
  "#A31ACB",
  "#81C6E8",
  "#5DA7DB",
  "#16213E",
  "#FBA1A1",
  "#DEB6AB",
  "#B24080",
  "#ECAC5D",
  "#FFF9B2",
  "#F8485E",
  "#52006A",
  "#4A1C40",
  "#E9D5DA",
  "#827397",
  "#4D4C7D",
  "#363062",
];

let technical_shades = {
  Good: "#38a169",
  Needs_Improvement: "#ecc94b",
  Poor: "#e53e3e",
};
let channels = ["Direct", "Organic Search", "Paid Search", "cpc", "organic"];

const helpers = {
  getRecent: (
    year,
    compare,
    setSelectedYear,
    setCompareView,
    chartlist,
    setCompareData
  ) => {
    if (compare.includes("last") && year.includes("last")) {
      let year1 = year.split("_")[1];
      let compare1 = compare.split("_")[1];
      // console.log("In getRecent", year1,compare1)
      if (Number(year1) < Number(compare1)) {
        setSelectedYear(year);
        setCompareView(compare);
        setCompareData(helpers.comparedData(year, compare, chartlist));
      } else {
        setSelectedYear(compare);
        setCompareView(year);
        setCompareData(helpers.comparedData(compare, year, chartlist));
      }
    } else {
      if (Number(year) < Number(compare)) {
        setSelectedYear(compare);
        setCompareView(year);
        setCompareData(helpers.comparedData(compare, year, chartlist));
      } else {
        setSelectedYear(year);
        setCompareView(compare);
        setCompareData(helpers.comparedData(year, compare, chartlist));
      }
    }
  },

  comparedData: (year, compare, chartlist) => {
    console.log(
      "Inside comparedData - selected year state",
      year,
      chartlist[year]
    );
    console.log(
      "Inside comparedData - compare view state",
      compare,
      chartlist[compare]
    );

    const result = [];

    for (let i = 0; i < chartlist[year].length; i++) {
      const object1 = chartlist[year][i];
      for (let j = 0; j < chartlist[compare].length; j++) {
        const object2 = chartlist[compare][j];

        // remove the title check (&& object1.title) after getting title from transformations for tables.
        if (
          object1.type === object2.type &&
          object1.title &&
          object1.title.replace(/\d+/g, "") ===
            object2.title.replace(/\d+/g, "")
        ) {
          if (object1.type === "SCORECARD") {
            result.push({
              type: object1.type,
              title: object1.title,
              ranges: object1.ranges ? object1.ranges : null,
              measure: object1.measure ? object1.measure : null,
              data: object1.data,
              data2: object2.data,
            });
            // console.log("debug result inside scorecard", result)
            result.forEach((obj) => {
              if (!("percentage" in obj) && obj.type === "SCORECARD") {
                console.log(
                  "obj inside scorecard",
                  obj,
                  typeof obj.data,
                  typeof obj.data2
                );
                const value1 =
                  typeof obj.data === "number"
                    ? obj.data
                    : parseInt(obj.data.replace(/[^\d]/g, ""));
                const value2 =
                  typeof obj.data2 === "number"
                    ? obj.data2
                    : parseInt(obj.data2.replace(/[^\d]/g, ""));
                // console.log("debug values inside percentage check in scorecard", value1, value2)
                if (value2 === 0) {
                  obj.percentage = "N/A";
                } else {
                  const percentage = (
                    ((value1 - value2) / value2) *
                    100
                  ).toFixed(2);
                  obj.percentage = `${percentage}%`;
                }
                delete obj.data2;
              }
            });
          } else if (object1.type === "DONUT") {
            // console.log("debug main object in donut", object1)
            result.push({
              type: object1.type,
              title: object1.title,
              options: object1.options,
              series: object1.series,
              series2: object2.series,
            });
            result.forEach((obj) => {
              if (!("percentage" in obj) && obj.type === "DONUT") {
                // console.log("debug obj in donut", obj)
                if (obj.series2.reduce((a, b) => a + b, 0) === 0) {
                  obj.percentage = "N/A";
                } else {
                  const percentage = (
                    ((obj.series.reduce((a, b) => a + b, 0) -
                      obj.series2.reduce((a, b) => a + b, 0)) /
                      obj.series2.reduce((a, b) => a + b, 0)) *
                    100
                  ).toFixed(2);
                  obj.percentage = `${percentage}%`;
                }
                delete obj.series2;
              }
            });
          }
          // same as object1.type !== "TABLE"
          else if (object1.type === "BAR") {
            // console.log("debug object in bar", object1)
            let bar_data = {
              name: object1.title,
              labels:
                object1.options.xaxis.categories.length >
                object2.options.xaxis.categories.length
                  ? object1.options.xaxis.categories
                  : object2.options.xaxis.categories,
              data_bar: object1.series[0].data,
              data_line: object2.series[0].data,
            };
            result.push(
              chartsFactory.getSTACKED(
                bar_data,
                "column",
                year.includes("_") ? year.split("_").join(" ") : year,
                compare.includes("_") ? compare.split("_").join(" ") : compare
              )
              // type: object1.type,
              // title: object1.title,
              // options: object1.options,
              // series: object1.series,
              // series2: object2.series
            );
          } else {
            break;
          }
        }
      }
    }

    console.log("resultant compared data", result);
    return result;
  },

  formatBytes: (bytes, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  },
  sleep: (sleepDuration) => {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) {
      /* Do nothing */
    }
  },
  printformData: (formData) => {
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
  },
  formatCurrency: (value) => {
    let formatter = new Intl.NumberFormat("en-gb", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
    });
    return formatter.format(value);
  },
  sortObject: (obj) => {
    //This doesn't work
    const newObj = Object.keys(obj)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = obj[key];

        return accumulator;
      }, {});

    return newObj;
  },

  cleanData: (obj) => {
    const sum = obj.data.reduce((a, b) => a + b, 0);
    const newLabels = [];
    const newData = [];
    obj.labels.forEach((label, index) => {
      if (100 * (obj.data[index] / sum) > 2.2) {
        newLabels.push(label);
        newData.push(obj.data[index]);
      }
    });

    obj.data = [...newData];
    obj.labels = [...newLabels];

    return obj;
  },
  dedupeData: (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      // eslint-disable-next-line no-loop-func
      const non_combined_charts = value.filter(
        (val) => val.combined_key === ""
      );
      const combined_charts = value.filter((val) => val.combined_key !== "");
      // addming uniqueness in combined_charts
      const arr = {};
      combined_charts.forEach((element) => {
        if (!(element.combined_key in arr)) {
          arr[element.combined_key] = element;
        }
      });
      obj[key] = [...Object.values(arr), ...non_combined_charts];
    }
    return obj;
  },
};

const chartsFactory = {
  getChart: (
    data,
    type,
    setChartsData,
    tablesData,
    setSelectedYear,
    selectedYear,
    setTransformedData,
    setTempState,
    pageName,
    setCompareState,
    setCompareData,
    isLarge,
    isMaxThan720
  ) => {
    // console.log("debug type and data in charts factory getchart", data, type)
    switch (type && type.toUpperCase()) {
      case "PIE":
        return chartsFactory.getPIE(data);
      case "LINE":
        return chartsFactory.getLINE(data);
      case "BAR":
        return chartsFactory.getBAR(
          data,
          selectedYear,
          pageName,
          isLarge,
          isMaxThan720
        );
      case "TREEMAP":
        return chartsFactory.getTREEMAP(data);
      case "SCORECARD":
        return chartsFactory.getSCORECARD(data, pageName);
      case "COMBINEDBAR":
        return chartsFactory.getBARCOMBINED(data);
      case "DONUT":
        return chartsFactory.getDONUT(
          data,
          setChartsData,
          tablesData,
          setSelectedYear,
          selectedYear,
          setTransformedData,
          setTempState,
          setCompareState,
          pageName,
          setCompareData
        );
      case "TABLE":
        return chartsFactory.getTABLE(data);
      case "NESTED_TABLE":
        return chartsFactory.getNESTEDTABLE(data);
      case "STACKED":
        return chartsFactory.getSTACKED(data);
      case "STACKEDCOLUMN":
        return chartsFactory.getSTACKEDCOLUMN(data, pageName);
      case "GEOCHART":
        return chartsFactory.getGeoCHART(data);
      case "CIRCLE":
        return chartsFactory.getCircle(data);
      default:
        console.log("NO CHARTS FOUND, PLEASE CHECK YOUR PREFIX");
        break;
    }
  },

  getSCORECARD: (data, pageName) => {
    // console.log("debug pageName in get scorecard", pageName, data)
    const score_card = {
      combined_key: data.combined_key,
      type: "SCORECARD",
      data:
        pageName === "Performance" || pageName === "CLTV"
          ? data.name.toUpperCase().includes("REVENUE") ||
            data.name.toUpperCase().includes("CUSTOMER LIFETIME")
            ? helpers.formatCurrency(Math.round(data.data))
            : !data.name.toUpperCase().includes("DURATION") &&
              !data.name.toUpperCase().includes("BOUNCE")
            ? helpers.formatCurrency(Math.round(data.data)).substring(1)
            : data.name.toUpperCase().includes("BOUNCE")
            ? data.data[0].toFixed(3)
            : data.data[0]
          : pageName === "Overview"
          ? data.name.toUpperCase().includes("REVENUE")
            ? helpers.formatCurrency(Math.round(data.data))
            : data.name.toUpperCase().includes("20")
            ? helpers.formatCurrency(Math.round(data.data)).substring(1)
            : data.data[0]
          : data.data[0],
      title: data.name,
      difference: data.difference ? data.difference : null,
      measure: data.measure ? data.measure : null,
      ranges: data.ranges ? data.ranges : null,
    };

    if (!data.measure) {
      delete score_card["measure"];
      delete score_card["ranges"];
    }

    return score_card;
  },

  getCircle: (data, pageName) => {
    // console.log("debug pageName in get Cricle", pageName, data)
    const circle_card = {
      combined_key: data.combined_key,
      type: "CIRCLE",
      score: data.score,
      title: data.name,
    };

    return circle_card;
  },
  getPIE: (data) => {
    const chart_pie = {
      type: "PIE",
      labels: labelsAndDataFactory.extendedLabels_withPercentageandValue(
        data.labels,
        data.data
      ),
      datasets: {
        label: data.name,
        data: data.data.map((num) => Math.round(num)),
        backgroundColors: [...Object.values(cb_color_cycle)],
      },
    };
    return chart_pie;
  },

  getDONUT: (
    data,
    setChartsData,
    tablesData,
    setSelectedYear,
    selectedYear,
    setTransformedData,
    setTempState,
    setCompareState,
    pageName,
    setCompareData
  ) => {
    if (data.name === "Total Engaged Sessions By Channel 2023") {
      console.log("debug donut charts inside getDonut", data);
    }
    const chart_donut = {
      type: "DONUT",
      title: data.name,
      fill: {
        colors:
          pageName === "Performance"
            ? shades.slice(0, data.labels.length)
            : data.color,
      },
      options: {
        stroke: {
          show: false,
          width: 0,
        },
        labels: labelsAndDataFactory.extendedLabels_withPercentageandValue(
          data.labels,
          data.data,
          data.name
        ),
        colors:
          pageName === "Technical"
            ? data.color
            : pageName === "Overview" &&
              data.name === "Core Web Vitals Overview"
            ? data.color
            : shades.slice(0, data.labels.length),
        theme: {
          monochrome: {
            enabled: false,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%",
              },
              legend: {
                show: false,
              },
            },
          },
        ],
        legend: {
          position:
            pageName &&
            pageName == "Overview" &&
            data.name == "Total Engaged Sessions By Channel 2023"
              ? "right"
              : "bottom",
          // horizontalAlign: 'right',
          // offsetX: 50,
          // width: 200,
          itemMargin: {
            horizontal: 10,
            vertical: 10,
          },
          // offsetX: -100, // Add a gap between the chart and the legend vertically
          // offsetY: 0,
          show: true,
          // show: pageName === "Technical"  ? true : pageName === "Overview" && data.name==='Core Web Vitals Overview' ? true : false, // working legends true false.
          fontSize: "14px",
          labels: {
            // color: 'white',
            colors: ["#F44336", "#E91E63", "#9C27B0"],
            useSeriesColors: false,
          },
        },
        chart: {
          donut: {
            size: "10vw",
            labels: {
              show: false,
              total: {
                show: true,
                fontSize: "1vw",
                color: "#000",
              },
            },
          },

          events: {
            dataPointSelection: (event, chartContext, config) => {
              // console.log("DEBUG SELECTED YEAR BEFORE ON CLICK", selectedYear)
              // console.log("DEBUG DONUT ONCLICK", config.w.config.labels[config.dataPointIndex]);
              // console.log("ON CLICK CHANNEL SPLITTED", config.w.config.labels[config.dataPointIndex].split(" (")[0])
              if (pageName === "Performance") {
                setTransformedData(null);
                setCompareData(null);
                setChartsData(null);
                setCompareState(null);
                setTempState(selectedYear);
                setSelectedYear(null);
                setChartsData(tablesData[selectedYear]);
                setSelectedYear(
                  config.w.config.labels[config.dataPointIndex].split(" (")[0]
                );
              }
            },
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#FFFFFF"],
          },
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              // size: "20%",
              labels: {
                show: pageName === "Technical" ? true : false,
                name: { show: true },
                total: {
                  show: pageName === "Technical" ? true : false,
                  color: "#A3AED0",
                  showAlways: true,
                },
                value: {
                  show: true,
                  color: "#A3AED0",
                },
              },
            },
          },
        },
      },
      series: data.data.map((num) => Math.round(num)),
    };
    !labelsAndDataFactory.findCommonElements(data.labels, channels) &&
      delete chart_donut["options"]["chart"]["events"];
    return chart_donut;
  },

  getSTACKED: (data, type2 = "line", year = "", compare = "") => {
    console.log(
      "debug labels in getStacked",
      data.labels,
      data.labels.map((obj) => {
        return obj
          .split(" ")
          .slice(0, obj.split(" ").length - 1)
          .join(" ");
      })
    );
    const chart_combined = {
      type: "STACKED",
      series: [
        {
          name: type2 === "line" ? "Search Volume" : `${year}`,
          type: "column",
          data: data.data_bar,
        },
        {
          name: type2 === "line" ? "Search Volume" : `${compare}`,
          type: type2,
          data: data.data_line,
        },
      ],
      options: {
        colors: ["#877dd2", "#422afb"],
        chart: {
          foreColor: "#A3AED0",
          height: 350,
          // type: 'line',
        },
        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
          },
          onDatasetHover: {
            style: {
              fontSize: "12px",
              fontFamily: undefined,
            },
          },
          theme: "dark",
        },
        title: {
          // text: `${data.name} for top 10 ranked keywords`
          text: `${
            type2 == "line" || !data.name.includes(year)
              ? data.name
              : data.name
                  .split(" ")
                  .slice(0, data.name.split(" ").length - 1)
                  .join(" ")
          }`,
        },
        dataLabels: {
          enabled: false,
          enabledOnSeries: [1],
        },
        labels: data.labels,
        // labels: data.labels.includes("%)") ? data.labels.map((obj => {
        //   return (
        //     obj.split(" ").slice(0, obj.split(" ").length - 1).join(" ")
        //   )
        // })) : data.labels,
        xaxis: {
          type: type2 === "line" ? "category" : "datetime",
        },
        yaxis: [
          {
            title: {
              text:
                type2 === "line"
                  ? "Search Volume"
                  : data.name.includes("Sessions")
                  ? "Sessions"
                  : "Revenue",
            },
          },
          {
            opposite: true,
            title: {
              text: "",
            },
          },
        ],
        xaxis: {
          show: false,
          labels: {
            show: true,
            style: {
              colors: "#A3AED0",
              fontSize: "14px",
              fontWeight: "500",
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
      },
    };
    return chart_combined;
  },

  getBAR: (data, selectedYear, pageName, isLarge, isMaxThan720) => {
    console.log(
      "page name and isLarge in getbar",
      pageName,
      isLarge,
      isMaxThan720
    );
    const chart_bar = {
      type: "BAR",
      title: data.name,
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
          },
          onDatasetHover: {
            style: {
              fontSize: "12px",
              fontFamily: undefined,
            },
          },
          theme: "dark",
        },
        xaxis: {
          categories: labelsAndDataFactory.extendedLabels_withPercentage(
            data.labels,
            data.data
          ),
          // type: selectedYear.includes("days") ? 'datetime' : '', //works the same as below but we might not include last 30/60 in
          // this state in future.
          type:
            data.name === "Total Engaged Sessions Per Month 2023" &&
            pageName === "Overview" &&
            (isLarge || isMaxThan720)
              ? "datetime"
              : "",
          show: false,
          labels: {
            show: true,
            style: {
              colors: "#A3AED0",
              fontSize: selectedYear.includes("30")
                ? "11px"
                : [
                    "Products That Sell Well Together",
                    "Highest Grossing Product",
                    "Conversion Rates Per Product",
                  ].includes(data.name)
                ? "10px"
                : data.name === "Most Sold Product Bundles"
                ? "9px"
                : "14px",
              fontWeight: "500",
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: false,
          color: "black",
          labels: {
            show: true,
            style: {
              colors: "#CBD5E0",
              fontSize: "14px",
            },
          },
        },
        grid: {
          show: false,
          strokeDashArray: 5,
          yaxis: {
            lines: {
              show: true,
            },
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            type: "vertical",
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            colorStops: [
              [
                {
                  offset: 0,
                  color: "#4318FF",
                  opacity: 1,
                },
                {
                  offset: 100,
                  color: "rgba(67, 24, 255, 1)",
                  opacity: 0.28,
                },
              ],
            ],
          },
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "40px",
          },
        },
      },
      series: [
        {
          name: data.name,
          data: data.data.map((num) => Math.round(num)),
        },
      ],
    };
    return chart_bar;
  },

  getSTACKEDCOLUMN: (data, pageName) => {
    console.log("stacked column data", data);
    const result = [...new Set(data.category)].map((value) => ({
      name: value,
      data: data.data.filter((item, index) => data.category[index] === value),
      color:
        value === "Poor"
          ? "#e53e3e"
          : value === "Needs Improvement"
          ? "#ecc94b"
          : "#38a169",
    }));
    const chart_stacked_col = {
      type: "STACKEDCOLUMN",
      title: data.name,
      series: result,
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: "bottom",
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],
        grid: {
          show: false,
          strokeDashArray: 5,
          yaxis: {
            lines: {
              show: true,
            },
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "50%",
            // borderRadius: 10,
            dataLabels: {
              total: {
                enabled: false,
                style: {
                  colors: ["#F44336", "#E91E63", "#9C27B0"],
                  fontSize: "14px",
                  fontWeight: 700,
                },
              },
            },
          },
        },
        xaxis: {
          type: pageName !== "Overview" && "datetime",
          categories: [...new Set(data.labels)],
          labels: {
            show: true,
            style: {
              colors: "#A3AED0",
              fontSize: "14px",
              fontWeight: "500",
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: true,
          color: "black",
          labels: {
            show: true,
            style: {
              colors: "#CBD5E0",
              fontSize: "14px",
            },
          },
        },
        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
          },
          onDatasetHover: {
            style: {
              fontSize: "12px",
              fontFamily: undefined,
            },
          },
          theme: "dark",
        },
        legend: {
          position: "top",
          offsetY: 10,
          fontSize: "14px",
          labels: {
            // color: 'white',
            colors: ["#F44336", "#E91E63", "#9C27B0"],
            useSeriesColors: false,
          },
        },
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: false,
        },
      },
    };
    return chart_stacked_col;
  },

  getBARCOMBINED: (data) => {
    data = _.sortBy(data, "name");
    data = data.reverse();
    const barcom = {
      combined_key: data[0].combined_key,
      type: "COMBINEDBAR",
      labels: data[0].labels,
      label: data.map((val) => val.name).join(" vs "),
      datasets: data.map((val, index) => {
        return {
          label: val.name,
          data: val.data,
          color: combined_bar_charts_colors[index],
        };
      }),
    };
    return barcom;
  },

  getLINE: (data) => {
    const chart_line = {
      combined_key: data.combined_key,
      labels: labelsAndDataFactory.extendedLabels_withPercentage(
        data.labels,
        data.data
      ),
      datasets: {
        label: data.name,
        data: data.data.map((num) => Math.round(num)),
        backgroundColors: [
          "info",
          "primary",
          "dark",
          "success",
          "warning",
          "error",
          "light",
          "grey",
        ],
      },
    };
    return chart_line;
  },

  getTABLE: (data) => {
    // console.log("TABLES DATA",data)
    const rows_data = [];
    const cols_data = [];
    let loop;
    for (let j = 0; j < Object.keys(data).length; j++) {
      let key = Object.keys(data)[j];
      // console.log("key inside nested table", key)
      if (typeof data[key] === "object") {
        loop = data[key];
        // console.log("loop variable inside nested table", loop)
        break;
      }
    }
    let index = 0;
    for (let i = 0; i < loop.length; i++) {
      let rows_dict = {};
      for (let j = 0; j < Object.keys(data).length; j++) {
        let cols_dict = {};
        let key = Object.keys(data)[j];
        // console.log("debug key in getTABBLE", key)
        if (typeof data[key] === "object" && key !== "nested") {
          rows_dict[key] = data[key][i];
          if (i === 0) {
            cols_dict["Header"] = key;
            cols_dict["accessor"] = key;
            cols_data[index] = cols_dict;
            index = index + 1;
          }
        }

        rows_data[i] = rows_dict;
      }
    }
    const table_data = {
      type: "TABLE",
      columns: cols_data,
      rows: rows_data,
      title: data.name,
    };
    // console.log("table dict before returning", table_data)
    return table_data;
  },

  getNESTEDTABLE: (data) => {
    const rows_data = [];
    const cols_data = [];
    let loop;
    for (let j = 0; j < Object.keys(data).length; j++) {
      let key = Object.keys(data)[j];

      if (typeof data[key] === "object") {
        loop = data[key];
        break;
      }
    }
    let index = 0;
    for (let i = 0; i < loop.length; i++) {
      let rows_dict = {};
      for (let j = 0; j < Object.keys(data).length; j++) {
        let cols_dict = {};
        let key = Object.keys(data)[j];
        // console.log("debug key in getTABBLE", key)
        if (typeof data[key] === "object" && key !== "nested") {
          rows_dict[key] = data[key][i];
          if (i === 0) {
            cols_dict["Header"] = key;
            cols_dict["accessor"] = key;
            cols_data[index] = cols_dict;
            index = index + 1;
          }
        }

        rows_data[i] = rows_dict;
      }
    }
    const table_data = {
      type: "TABLE",
      columns: cols_data,
      rows: rows_data,
      title: data.name,
      heading1: data["name inner"],
      heading2: data["name inner 2"],
    };
    // console.log("table dict before returning", table_data)
    return table_data;
  },

  getTREEMAP: (data) => {
    helpers.cleanData(data);
    const chart_tree = {
      combined_key: data.combined_key,
      type: "TREEMAP",
      labels: labelsAndDataFactory.extendedLabels_withPercentageandValue(
        data.labels,
        data.data
      ),
      datasets: {
        label: data.name,
        data: data.data.map((num) => Math.round(num)),
        backgroundColors: [...cb_color_cycle],
      },
    };
    return chart_tree;
  },
  getGeoCHART: (data) => {
    const dataArray = [
      ["Country", data.name],
      ...data.labels.map((label, index) => [label, data.data[index]]),
    ];
    const geochart = {
      type: "GEOCHART",
      title: data.name,
      data: dataArray,
      options: {
        geochartVersion: 11,
        colorAxis: { colors: shades.slice(0, data.labels.length) },
        magnifyingGlass: { enable: true, zoomFactor: 7.5 },
        backgroundColor: { fill: "transparent" },
        legend: "none",
        // zoomable: true,
        // region: 'world',
        datalessRegionColor: "#cccccc",
        // defaultColor: "#4318FF",
      },
    };
    return geochart;
  },
};

const labelsAndDataFactory = {
  findCommonElements: (arr1, arr2) => {
    // Create an empty object
    let obj = {};

    // Loop through the first array
    for (let i = 0; i < arr1.length; i++) {
      // Check if element from first array
      // already exist in object or not
      if (!obj[arr1[i]]) {
        // If it doesn't exist assign the
        // properties equals to the
        // elements in the array
        const element = arr1[i];
        obj[element] = true;
      }
    }

    // Loop through the second array
    for (let j = 0; j < arr2.length; j++) {
      // Check elements from second array exist
      // in the created object or not
      if (obj[arr2[j]]) {
        return true;
      }
    }
    return false;
  },
  extendedLabels_withPercentageandValue: (labels, data, name) => {
    const sum = data.reduce((a, b) => a + b, 0);
    return labels.map((label, index) => {
      const format_data = name.toUpperCase().includes("REVENUE")
        ? helpers.formatCurrency(Math.round(data[index]))
        : helpers.formatCurrency(Math.round(data[index])).substring(1);
      return `${label} ( ${format_data})`;
    });
  },

  extendedLabels_onlyPercentageAndValue: (labels, data) => {
    const sum = data.reduce((a, b) => a + b, 0);
    return labels.map((label, index) => {
      return `${Math.round(100 * (data[index] / sum))})%\n ${Math.round(
        data[index]
      )}`;
    });
  },
  extendedLabels_withPercentage: (labels, data) => {
    const sum = data.reduce((a, b) => a + b, 0);
    return labels.map((label, index) => {
      return `${label} (${Math.round(100 * (data[index] / sum))}%)`;
    });
  },
};

const chart_priorities = ["SCORECARD", "PIE", "TREEMAP", "LINE", "BAR"];

const prioritizer = {
  first: (arr, low, high, x, n) => {
    if (high >= low) {
      // (low + high)/2;
      let mid = low + Math.floor((high - low) / 2);

      if ((mid === 0 || x > arr[mid - 1]) && arr[mid] === x) return mid;
      if (x > arr[mid]) return prioritizer.first(arr, mid + 1, high, x, n);
      return prioritizer.first(arr, low, mid - 1, x, n);
    }
    return -1;
  },

  sortAccording: (A1, A2, m, n) => {
    let temp = [];
    let visited = [];

    for (let i = 0; i < m; i++) {
      temp[i] = A1[i];
      visited[i] = 0;
    }

    temp.sort(function (a, b) {
      return a - b;
    });

    let ind = 0;

    for (let i = 0; i < n; i++) {
      let f = prioritizer.first(temp, 0, m - 1, A2[i], m);
      // If not present, no need to proceed
      if (f === -1) {
        continue;
      }
      for (let j = f; j < m && temp[j] === A2[i]; j++) {
        A1[ind++] = temp[j];
        visited[j] = 1;
      }
    }
    for (let i = 0; i < m; i++) {
      if (visited[i] === 0) A1[ind++] = temp[i];
    }
  },
};

export {
  helpers,
  chartsFactory,
  labelsAndDataFactory,
  prioritizer,
  chart_priorities,
};
