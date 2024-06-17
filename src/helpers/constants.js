import ShadeGenerator from "shade-generator";

const colorMap = ShadeGenerator.hue("#e41a1c").shadesMap("hex");
const colorList = [
    "#313171",
    "#FAEBD7",
    "#00FFFF",
    "#7FFFD4",
    "#F0FFFF",
    "#F5F5DC",
    "#FFE4C4",
    "#000000",
    "#FFEBCD",
    "#0000FF",
    "#8A2BE2",
    "#A52A2A",
    "#DEB887",
    "#5F9EA0",
    "#7FFF00",
    "#D2691E",
    "#FF7F50",
    "#6495ED",
    "#FFF8DC",
    "#DC143C",
    "#00FFFF",
    "#00008B",
    "#008B8B",
    "#B8860B",
    "#A9A9A9",
    "#A9A9A9",
    "#006400",
    "#BDB76B",
    "#8B008B",
    "#556B2F",
    "#FF8C00",
    "#9932CC",
    "#8B0000",
    "#E9967A",
    "#8FBC8F",
    "#483D8B",
    "#2F4F4F",
    "#2F4F4F",
    "#00CED1",
    "#9400D3",
    "#FF1493",
    "#00BFFF",
    "#696969",
    "#696969",
    "#1E90FF",
    "#B22222",
    "#FFFAF0",
    "#228B22",
    "#FF00FF",
    "#DCDCDC",
    "#F8F8FF",
    "#FFD700",
    "#DAA520",
    "#808080",
    "#808080",
    "#008000",
    "#ADFF2F",
    "#F0FFF0",
    "#FF69B4",
    "#CD5C5C",
    "#4B0082",
    "#FFFFF0",
    "#F0E68C",
    "#E6E6FA",
    "#FFF0F5",
    "#7CFC00",
    "#FFFACD",
    "#ADD8E6",
    "#F08080",
    "#E0FFFF",
    "#FAFAD2",
    "#D3D3D3",
    "#D3D3D3",
    "#90EE90",
    "#FFB6C1",
    "#FFA07A",
    "#20B2AA",
    "#87CEFA",
    "#778899",
    "#778899",
    "#B0C4DE",
    "#FFFFE0",
    "#00FF00",
    "#32CD32",
    "#FAF0E6",
    "#FF00FF",
    "#800000",
    "#66CDAA",
    "#0000CD",
    "#BA55D3",
    "#9370DB",
    "#3CB371",
    "#7B68EE",
    "#00FA9A",
    "#48D1CC",
    "#C71585",
    "#191970",
    "#F5FFFA",
    "#FFE4E1",
    "#FFE4B5",
    "#FFDEAD",
    "#000080",
    "#FDF5E6",
    "#808000",
    "#6B8E23",
    "#FFA500",
    "#FF4500",
    "#DA70D6",
    "#EEE8AA",
    "#98FB98",
    "#AFEEEE",
    "#DB7093",
    "#FFEFD5",
    "#FFDAB9",
    "#CD853F",
    "#FFC0CB",
    "#DDA0DD",
    "#B0E0E6",
    "#800080",
    "#663399",
    "#FF0000",
    "#BC8F8F",
    "#4169E1",
    "#8B4513",
    "#FA8072",
    "#F4A460",
    "#2E8B57",
    "#FFF5EE",
    "#A0522D",
    "#C0C0C0",
    "#87CEEB",
    "#6A5ACD",
    "#708090",
    "#708090",
    "#FFFAFA",
    "#00FF7F",
    "#4682B4",
    "#D2B48C",
    "#008080",
    "#D8BFD8",
    "#FF6347",
    "#40E0D0",
    "#EE82EE",
    "#F5DEB3",
    "#FFFFFF",
    "#F5F5F5",
    "#FFFF00",
    "#9ACD32",
];
const cb_color_cycle = [
    "#0072b2",
    "#d55e00",
    "#009e73",
    "#cc79a7",
    "#a65628",
    "#984ea3",
    "#999999",
    "#e41a1c",
    "#f0e442",
];

const colorDarknessChecker = (color, evaluatorValue) => {
    const hex = color.replace("#", "");
    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
    return brightness < evaluatorValue;
};

const treemapConfig__generator = (title) => {
    const options = {
        dataLabels: {
            enabled: true,
            enabledOnSeries: undefined,
            formatter: function (val, opts) {
                return val;
            },
            textAnchor: "middle",
            distributed: true,
            offsetX: 0,
            offsetY: 0,
            style: {
                fontSize: "70rem",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "bold",
                color:'white'
            },
            background: {
                enabled: true,
                foreColor: "#fff",
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: "#fff",
                opacity: 0.9,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: "#000",
                    opacity: 0.45,
                },
            },
            dropShadow: {
                enabled: false,
                top: 1,
                left: 1,
                blur: 1,
                color: "#000",
                opacity: 0.45,
            },
        },
        legend: {
            show: true,
        },
        chart: {
            height: 350,
            type: "treemap",
        },
        title: {
            text: `${title}`,
            align: "left",
            style: {
                fontSize: "20",
            },
        },

        colors: cb_color_cycle,

        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false,
            },
        },
    };
    return options;

};

const activeRouteHandle = ( page, ceo, type) => {
    const dashboarddic = ceo.states.userDashboards.filter(data => data.name===ceo.states.companyDetails)
    // console.log('test name...!', ceo.states.userDashboards);
    // console.log('test name...!', dashboarddic, page);
    // console.log('test name...!', ceo.states.companyDetails);
    const dashboardpage = dashboarddic[0].pages.filter(data => data.name===page)
    // console.log('test name...!', dashboardpage[0]);
    ceo.actions.setTransformedData(null);
    ceo.actions.setChartsData(null);
    if (type!=null){
        ceo.actions.setSelectedYear("mobile");
        ceo.actions.setTempState("mobile")
    }
    // console.log("Selected page is",page, dashboard)
    ceo.actions.setSelectedDashboard(dashboardpage[0]);
    ceo.actions.setCompanyDetails(dashboarddic[0].name);
    // navigate("/admin");
  };

export { colorList, treemapConfig__generator,colorDarknessChecker ,cb_color_cycle , colorMap , activeRouteHandle};
