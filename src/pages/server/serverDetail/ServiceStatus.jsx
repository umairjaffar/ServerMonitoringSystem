import { Box, Grid, Typography, styled } from "@mui/material";
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
import CircleIcon from "@mui/icons-material/Circle";

const StatusUp = styled(CircleIcon)`
  font-size: 15px;
  color: green;
`;
const StatusDown = styled(CircleIcon)`
  font-size: 15px;
  color: red;
`;
const ServiceStatus = (props) => {
  const { data: statusGraph } = props;

  const formatXAxis = (timeString) => {
    const dateTime = new Date(timeString);
    const day = dateTime.toLocaleString("default", { weekday: "short" });
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString("en-US", {
      timeZoneName: "short",
    });
    return `${day}\n${time}\n\n${date}`;
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
    <Box
      width="100%"
      //  boxShadow={3}
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
        {props.name}
      </Typography>
      <Grid container justifyContent={"space-evenly"} gap={2}>
        {statusGraph ? (
          statusGraph?.map((item, index) => {
            // console.log("ItemGraph2", item.Value);
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
                md={statusGraph.length > 1 ? 5.5 : 11}
                key={index}
                borderBottom={"1px solid black"}
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
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flex: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <StatusUp />
                      <Typography> Status Up</Typography>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <StatusDown />
                      <Typography> Status Down</Typography>
                    </div>
                  </Box>
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
                </Box>
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
    </Box>
  );
};

export default ServiceStatus;
