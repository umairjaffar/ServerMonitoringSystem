// import React, { useEffect } from "react";
// import "@amcharts/amcharts5-react/esm5/index.js";
// import * as am5charts from "@amcharts/amcharts5/charts";
// import * as am5core from "@amcharts/amcharts5/core";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import { useTheme } from "@amcharts/amcharts5-react";

// const ServerStatusGraph = ({ data }) => {
//   const theme = useTheme();

//   // Convert GMT time to local time
//   const formatTime = (time) => {
//     const localTime = new Date(time);
//     return localTime.toLocaleString();
//   };

//   // Prepare the data for the chart
//   const chartData = data.map((item) => ({
//     status: item.status,
//     time: formatTime(item.time),
//   }));

//   // Create the chart
//   useEffect(() => {
//     const chart = am5xy.create("chartdiv", am5xy.XYChart);
//     chart.paddingRight = am5core.percent(5);

//     const dateAxis = chart.xAxes.push(new am5xy.DateAxis());
//     dateAxis.renderer.labels.template.fill = am5core.color(
//       theme.colors.secondary
//     );

//     const valueAxis = chart.yAxes.push(new am5xy.ValueAxis());
//     valueAxis.renderer.labels.template.fill = am5core.color(
//       theme.colors.secondary
//     );

//     const series = chart.series.push(new am5xy.LineSeries());
//     series.data = chartData;
//     series.dateXField = "time";
//     series.valueYField = "status";

//     const bullet = series.bullets.push(new am5charts.CircleBullet());
//     bullet.circle.radius = 4;
//     bullet.circle.fill = am5core.color(theme.colors.primary);
//     bullet.circle.stroke = am5core.color(theme.colors.secondary);
//     bullet.tooltipText = "{valueY}";

//     return () => {
//       chart.dispose();
//     };
//   }, [chartData, theme]);

//   return <div id="chartdiv" style={{ width: "100%", height: "500px" }} />;
// };

// export default ServerStatusGraph;
