import { helpers, chartsFactory } from "helpers/helperFunctions";
import { object } from "underscore";

const transformFactory = (
  chartsData,
  setTransformedData,
  setChartsData,
  setTablesData,
  setSelectedYear,
  setTempState,
  pageName,
  setCompareState,
  setCompareData,
  isLarge,
  isMaxThan720
) => {
  let chartList = {};
  let index = 0;

  const channels = {};
  for (const [key, value] of Object.entries(chartsData)) {
    if (typeof value === "object") {
      for (const [key2, value2] of Object.entries(value)) {
        if (Object.keys(value2).includes("channels"))
          // console.log("DEBUG CHANNELS DYNAMIC",chartsData[key])
          channels[key2] = chartsData[key][key2]["channels"];
        delete chartsData[key][key2]["channels"];
        // for (const [key3, value3] of Object.entries(value2)) {
        //   console.log(`INSIDE - ${key3}: ${value3}`);
        // }
      }
      setTablesData(channels);
    }
  }

  // })
  //YEARLY AND MONTHLY CHARTS

  // console.log("debug nested type in transform factory", Object.entries(chartsData["data"]), chartsData["data"])

  // let containsUrl = false;
  // for (const key in chartsData["data"]) {
  //   if (key.startsWith("http")) {
  //     containsUrl = true;
  //     break;
  //   }
  // }

  // console.log("debug contains url or not", containsUrl); // true

  for (const [key, value] of Object.entries(chartsData["data"])) {
    if (key.startsWith("http")) {
      chartList[key] = [];
      let values = {};
      for (const [key1, value1] of Object.entries(chartsData["data"][key])) {
        if (key1 === "type" || key1 === "URL") {
        } else {
          value1["name"] = key1;

          for (const key2 in chartsData["data"][key][key1]) {
            if (key2 !== "name") {
              value1["name inner"] = key2;
            }
            if (key2 === "HOW TO IMPROVE") {
              for (const key3 in chartsData["data"][key][key1][key2]) {
                value1["name inner 2"] = key3;
                values = chartsData["data"][key][key1][key2][key3];
                values["name"] = value1["name"];
                values["name inner"] = value1["name inner"];
                values["name inner 2"] = value1["name inner 2"];
                delete value1["PASSED AUDITS"];
                chartList[key][index] = chartsFactory.getChart(
                  values,
                  "nested_table"
                );
                index = index + 1;
              }
            }
          }
        }
      }
      chartList[key].push();
      setTransformedData(chartsData["data"]);
    } else {
      Object.keys(value).forEach((new_obj) => {
        if (Object.keys(chartList).includes(key)) {
          chartList[key].push(
            value[new_obj].combined_key
              ? value[new_obj].combined_key === ""
                ? chartsFactory.getChart(
                    value[new_obj],
                    value[new_obj].type,
                    setChartsData,
                    channels,
                    setSelectedYear,
                    key,
                    setTransformedData,
                    setTempState,
                    pageName,
                    setCompareState,
                    setCompareData,
                    isLarge,
                    isMaxThan720
                  )
                : chartsFactory.getChart(
                    value.filter(
                      (temp) =>
                        value[new_obj].combined_key === temp.combined_key
                    ),
                    "COMBINED" + value[new_obj].type,
                    setChartsData,
                    channels,
                    setSelectedYear,
                    key,
                    setTransformedData,
                    setTempState,
                    pageName,
                    setCompareState,
                    setCompareData,
                    isLarge,
                    isMaxThan720
                  )
              : chartsFactory.getChart(
                  value[new_obj],
                  value[new_obj].type,
                  setChartsData,
                  channels,
                  setSelectedYear,
                  key,
                  setTransformedData,
                  setTempState,
                  pageName,
                  setCompareState,
                  setCompareData,
                  isLarge,
                  isMaxThan720
                )
          );
        } else {
          var object = {};
          object[key] = [];
          chartList = { ...chartList, ...object };
          chartList[key].push(
            value[new_obj].combined_key
              ? value[new_obj].combined_key === ""
                ? chartsFactory.getChart(
                    value[new_obj],
                    value[new_obj].type,
                    setChartsData,
                    channels,
                    setSelectedYear,
                    key,
                    setTransformedData,
                    setTempState,
                    pageName,
                    setCompareState,
                    setCompareData,
                    isLarge,
                    isMaxThan720
                  )
                : chartsFactory.getChart(
                    value[new_obj],
                    "COMBINED" + value[new_obj].type,
                    value.filter(
                      (temp, index) =>
                        value[new_obj].combined_key === temp.combined_key
                    )
                  )
              : chartsFactory.getChart(
                  value[new_obj],
                  value[new_obj].type,
                  setChartsData,
                  channels,
                  setSelectedYear,
                  key,
                  setTransformedData,
                  setTempState,
                  pageName,
                  setCompareState,
                  setCompareData,
                  isLarge,
                  isMaxThan720
                )
          );
        }
      });
    }
    console.log("debug transformed data before setting", chartList);
    setTransformedData({ chartList });
  }
  // eslint-disable-next-line no-loop-func

  return "OK";
};

export default transformFactory;
