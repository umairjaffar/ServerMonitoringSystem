import { Box, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ContainerStatus = (props) => {
  const { data: containerGraph } = props;
  // console.log("containerGraph", containerGraph);
 
  const formatXAxis = (timeString) => {
    const dateTime = new Date(timeString);
    const day = dateTime.toLocaleString("default", { weekday: "short" });
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString("en-US", {
      timeZoneName: "short",
    });
    return `${day}\n${date}\n${time}`;
  };

  const CustomDot = (props) => {
    const { cx, cy, stroke, payload } = props;

    return (
      <svg x={cx - 6} y={cy - 6} width={16} height={16}>
        <circle
          cx={6}
          cy={6}
          r={5}
          fill={payload.showStatus === "up" ? "green" : "red"}
          stroke={stroke}
        />
      </svg>
    );
  };
  // console.log("chartData", chartData);

  return (
    <Box width="100%" boxShadow={3} paddingY={3}>
      <Typography
        sx={{
          marginX: 3,
          fontSize: 28,
          fontWeight: "500",
          color: "#000000",
          marginBottom: 2,
        }}
      >
        {props.name}
      </Typography>
      <Grid container justifyContent={"space-between"} gap={2}>
        {containerGraph ? (
          containerGraph?.map((item, index) => {
            // console.log("contItem:", item);
            // console.log("container:", item.Value);
            const chartData = item?.Value?.map(({ status, time }) => {
              if (status === "up") {
                return {
                  status: 1,
                  time,
                  showStatus: "up",
                };
              } else {
                return {
                  status: 0,
                  time,
                  showStatus: "down",
                };
              }
            });
            return (
              <Grid
                item
                xs={11}
                sm={containerGraph.length > 1 ? 5.5 : 11}
                key={index}
              >
                <ResponsiveContainer width="95%" height={250}>
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}
                    padding={{
                      top: 0,
                      right: 5,
                      left: 5,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 8 }}
                      tickFormatter={formatXAxis}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "status") {
                          return value === 1 ? "up" : "down";
                        }
                        return value;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="status"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      dot={<CustomDot />}
                    />
                    <Line type="monotone" dataKey="time" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
                <Typography
                  sx={{
                    textAlign: "center",
                    marginY: 2,
                    fontSize: 18,
                    fontWeight: "600",
                    color: "gray",
                  }}
                >
                  {item.Name}
                </Typography>
                <Divider />
              </Grid>
            );
          })
        ) : (
          <Typography
            sx={{
              width: "100%",
              textAlign: "center",
              marginY: 2,
              fontSize: 24,
              fontWeight: "500",
              color: "gray",
            }}
          >
            Loading...
          </Typography>
        )}
      </Grid>
      {/* ------------------------------------------------------- */}
      {/* <Grid container>
        <Grid item xs={12}>
          <Typography
            sx={{
              marginX: 3,
              fontSize: 28,
              fontWeight: "500",
              color: "#000000",
              marginBottom: 2,
            }}
          >
            {props.name}
          </Typography>
          <ResponsiveContainer width="95%" height={250}>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 8 }}
                tickFormatter={formatXAxis}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "status") {
                    return value === 1 ? "up" : "down";
                  }
                  return value;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="status"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                dot={<CustomDot />}
              />
              <Line type="monotone" dataKey="time" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid> */}
    </Box>
  );
};

export default ContainerStatus;
