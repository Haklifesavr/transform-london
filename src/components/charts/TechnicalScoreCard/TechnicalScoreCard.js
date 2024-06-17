import React from "react";
import "./TechnicalScoreCard.css";
import { color } from "@chakra-ui/system";
import { useColorModeValue } from "@chakra-ui/react";
import square from "assets/img/layout/orange_square.png";
import circle from "assets/img/layout/green_circle.png";
import triangle from "assets/img/layout/red_triangle.png";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useState } from "react";

const TechnicalScoreCard = (props) => {
  let index = props.index;
  let good = props.range1;
  let medium = props.range2;
  let bad = props.range3;
  let dataraw = props.data;
  let measure = props.measure;
  let value = 0;
  let colorcode = "";
  value = dataraw.split(" ")[0];
  var rounded = round(value, 3);
  var unit = dataraw.split(" ")[1];
  let left = 0;
  let left_text = 0;
  let total = 0;
  let picture = null;
  let fontcolor = useColorModeValue("black", "white");
  let arrow_background = useColorModeValue("#F4F7FE", "#232126");
  let backgroundcolorforcard = useColorModeValue("white", "#151418");
  const [expanded, setExpanded] = useState(false);

  if (measure == "Needs Improvement") {
    colorcode = "#ecc94b";
  } else if (measure == "Good") {
    colorcode = "#38a169";
  } else {
    colorcode = "#e53c3e";
  }

  if (measure == "Needs Improvement") {
    picture = square;
  } else if (measure == "Good") {
    picture = circle;
  } else {
    picture = triangle;
  }

  good = parseFloat(good.split("-")[1]);
  medium = parseFloat(medium.split("-")[1]) - parseFloat(medium.split("-")[0]);
  bad = parseFloat(bad.replace("+", ""));
  total = good + medium + bad;
  left = (value / total) * 100;

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  // console.log("left", left);
  if (left > 99) {
    left = 100;
  }

  if (left > 95) {
    left_text = "calc(95% - 50px)";
  } else {
    left_text = `${left}%`;
  }

  return (
    <div
      className="scorechart_master"
      style={{ backgroundColor: `${backgroundcolorforcard}` }}
    >
      <div id="scorechart_header">
        <img id="scorechart_shapes" src={picture} />
        <div style={{ fontWeight: "bold", color: `${fontcolor}` }}>
          {props.title}
        </div>
      </div>
      <div id="scorechart_3divs_master">
        <div
          id="scorechart_value_div"
          style={{
            left: `${left_text}`,
            color: `${colorcode}`,
          }}
        >
          {rounded} {unit}
        </div>
        <div id="scorechart_indicator" style={{ left: `${left}%` }}>
          ||
        </div>
        <div
          id="scorechart_good_div"
          style={{
            width: `${(good / total) * 100}%`,
            borderRight: `2px solid ${backgroundcolorforcard}`,
          }}
        ></div>
        <div
          id="scorechart_intermediate_div"
          style={{
            width: `${(medium / total) * 100}%`,
            borderRight: `2px solid ${backgroundcolorforcard}`,
          }}
        ></div>
        <div
          id="scorechart_bad_div"
          style={{
            width: `${(bad / total) * 100}%`,
          }}
        ></div>
      </div>
      {
        //Check if expanded
        expanded ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  display: "flex",
                }}
              >
                <span style={{ color: "#38a169",marginRight:"5px" }}>Good</span> (≤ {props.range1}
                ){" "}
                <span style={{ marginLeft: "auto" }}>
                  {round((good / total) * 100, 1)}%
                </span>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  marginTop: "5px",
                  display: "flex",
                }}
              >
                <span style={{ color: "#ecc94b",marginRight:"5px" }}>Needs Improvement</span>(
                {props.range2}){" "}
                <span style={{ marginLeft: "auto" }}>
                  {round((medium / total) * 100, 1)}%
                </span>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  marginTop: "5px",
                  display: "flex",
                }}
              >
                <span style={{ color: "#e53c3e",marginRight:"5px" }}>Bad</span> ({props.range3}){" "}
                <span style={{ marginLeft: "auto" }}>
                  {round((bad / total) * 100, 1)}%
                </span>
              </div>
            </div>
            <div
              onClick={() => {
                setExpanded(false);
                document.getElementsByClassName("scorechart_master")[index].style.height="138.53px";
              }}
              style={{ backgroundColor: `${arrow_background}` }}
              id="scorechart_down_icon_div"
            >
              <ChevronUpIcon w={25} h={25} />
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setExpanded(true);
              document.getElementsByClassName("scorechart_master")[index].style.height="240.53px";
            }}
            style={{ backgroundColor: `${arrow_background}` }}
            id="scorechart_down_icon_div"
          >
            <ChevronDownIcon w={25} h={25} />
          </div>
        )
      }
    </div>
  );
};

export default TechnicalScoreCard;
