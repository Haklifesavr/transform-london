import React from "react";
import ReactApexChart from "react-apexcharts";
import {Flex, Box} from "@chakra-ui/react";

class PieChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <Box>
      <ReactApexChart 
        options={this.state.chartOptions}
        series={this.state.chartData}
        type='donut'
      />
      </Box>
    );
  }
}

export default PieChart;
