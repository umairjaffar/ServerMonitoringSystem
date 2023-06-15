import { Box, Grid, Typography } from "@mui/material";
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

const ServerPerformance = ({ serverPerformance, name }) => {
  // console.log("serverPerformance", serverPerformance);
  // console.log("CpuUsage", serverPerformance[1]?.Cpu_Usage);
  const cpuData = serverPerformance[1]?.Cpu_Usage?.map(({ value, time }) => ({
    value,
    time,
  }));
  const memoryData = serverPerformance[0]?.Disk_Usage?.map(
    ({ value, time }) => ({
      value,
      time,
    })
  );

  // const formatXAxis = (timeString) => {
  //   const dateTime = new Date(timeString);
  //   const date = dateTime.toLocaleDateString();
  //   const time = dateTime.toLocaleTimeString("en-US", {
  //     timeZoneName: "short",
  //   });
  //   return `${date}\n${time}`;
  // };
  // const tooltipFormatter = (value) => `${value}%`;
  // const tooltipLabelFormatter = (label) => console.log("label", label);

  return (
    <Box
      width="100%"
    >
      <Typography
        sx={{
          marginX: 3,
          fontSize: 22,
          fontWeight: "500",
          color: "#000000",
          marginBottom: 2,
        }}
      >
        {name}
      </Typography>
      <Grid container justifyContent={"space-between"} gap={2}>
        <Grid item xs={5.5}>
          <ResponsiveContainer width="95%" height={450}>
            <LineChart
              data={cpuData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="time" tick={{ fontSize: 8 }} />
              <YAxis dataKey="value" tick={{ fontSize: 8 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                dot={true}
                unit="%"
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
            CPU Usage
          </Typography>
        </Grid>
        {/* =======================Grid item for memory usage======================== */}
        <Grid item xs={5.5}>
          <ResponsiveContainer width="95%" height={450}>
            <LineChart
              data={memoryData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="4 4" />
              <XAxis dataKey="time" tick={{ fontSize: 8 }} />
              <YAxis dataKey="value" tick={{ fontSize: 8 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                dot={true}
                unit="%"
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
            Disk Usage
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ServerPerformance;
