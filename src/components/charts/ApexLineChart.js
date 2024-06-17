import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ApexLineChart = ({ series, options, height }) => {
  const [chartData, setChartData] = useState({
    series: series,
    options: options,
  });

  useEffect(() => {
    // Optional: You can fetch or update the chart data here
  }, []);

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={height}
      />
    </div>
  );
};

export default ApexLineChart;
