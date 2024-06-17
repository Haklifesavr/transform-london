import React, { Component } from "react";
import Chart from "react-apexcharts";

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: false, // Set this to false to remove the labels for empty columns
            },
          },
        },
      },
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
      size: this.props.size,
    });
  }

  render() {
    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        size={this.state.size}
        type='bar'
        width='100%'
        height='100%'
      />
    );
  }
}

export default ColumnChart;
