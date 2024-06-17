import React from "react";
import square from "assets/img/layout/orange_square.png";
import circle from "assets/img/layout/green_circle.png";
import triangle from "assets/img/layout/red_triangle.png";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";

const CircleChart = ({ lineLengthPercentage, title }) => {
  let picture = null;
  if (lineLengthPercentage < 50) {
    picture = triangle;
  } else if (lineLengthPercentage >= 50 && lineLengthPercentage < 90) {
    picture = square;
  } else {
    picture = circle;
  }
  let trackcolor = useColorModeValue("#FAFAFA", "#232126");
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          textAlign: "left",
          marginBottom: "auto",
        }}
      >
        <img
          style={{ width: "15px", height: "15px", marginRight: "5px" }}
          src={picture}
          alt=""
        />
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            width: "100%",
            textAlign: "left",
          }}
        >
          {title}
        </span>
      </div>
      <CircularProgress
        style={{ marginTop: "15px" }}
        value={lineLengthPercentage}
        trackColor={`${trackcolor}`}
        color={
          lineLengthPercentage < 50
            ? "#e53c3e"
            : lineLengthPercentage >= 50 && lineLengthPercentage < 90
            ? "#ecc94b"
            : "#38a169"
        }
        size={"100%"}
      >
        <CircularProgressLabel style={{ fontSize: "30px" }}>
          {lineLengthPercentage}%
        </CircularProgressLabel>
      </CircularProgress>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "10px",
            backgroundColor: "#e53c3e",
            marginRight: "3px",
          }}
        ></div>
        <span style={{ marginRight: "15px", whiteSpace: "nowrap" }}>0-49</span>
        <div
          style={{
            width: "30px",
            height: "10px",
            backgroundColor: "#ecc94b",
            marginRight: "3px",
          }}
        ></div>
        <span style={{ marginRight: "15px", whiteSpace: "nowrap" }}>50-89</span>
        <div
          style={{
            width: "30px",
            height: "10px",
            backgroundColor: "#38a169",
            marginRight: "3px",
          }}
        ></div>
        <span style={{ marginRight: "15px", whiteSpace: "nowrap" }}>
          90-100
        </span>
      </div>
    </div>
  );
};

export default CircleChart;
