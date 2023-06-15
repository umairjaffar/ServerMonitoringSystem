import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ServiceStatus from "./serverDetail/ServiceStatus";
import ServerPerformance from "./serverDetail/ServerPerformance";
import { useParams } from "react-router-dom";
import axios from "axios";
import ContainerStatus from "./serverDetail/ContainerStatus";
import { BASE_URL } from "../../components/constant/constant";
import ServerStatusGraph from "./serverDetail/Graph";

export default function ServerDetail() {
  const { Server_id } = useParams();
  console.log("Server_id", Server_id);
  const [serverService, serServerService] = useState([]);
  const [serverContainer, serServerContainer] = useState([]);
  const [serverPerformance, serServerPerformance] = useState([]);
  const [serverName, setServername] = useState("");
  const [loading, setLoading] = useState(false);

  const getServerData = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/servicecontainerandperformancerelserverdataforgraph`,
        null,
        config
      );
      console.log("RESP", res);
      if (res?.data) {
        setLoading(false);
        const servers = Object.values(res?.data);
        // console.log("servers1", servers);
        // console.log("Servers", servers[0]);
        const serverData = servers[0]?.filter(
          (server) => server.Server_Id === Server_id
        );
        console.log("SERVICE2", serverData[0]);
        serServerService(serverData[0].Services);
        setServername(serverData[0].Server_Name);
        serServerContainer(serverData[0].Containers);
        serServerPerformance(serverData[0].Server_Performance);
      }
    } catch (error) {
      setLoading(false);
      console.log("ServerDetail ERROR", error);
    }
  };

  useEffect(() => {
    getServerData();
  }, [Server_id]);
  // console.log("SSS", serverPerformance);
  return (
    <React.Fragment>
      <Box
        sx={{
          height: "100% ",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingY: 2,
        }}
      >
        {!loading ? (
          <Grid container boxShadow={3} marginY={2} padding={1}>
            <Grid item xs={12}>
              <Typography
                sx={{
                  marginX: 3,
                  fontSize: 28,
                  fontWeight: "500",
                  textAlign: "center",
                  color: "#1976D2",
                  marginBottom: 0,
                }}
              >
                {serverName}
              </Typography>
            </Grid>
            {/* <Grid item xs={12}>
              <ServerStatusGraph data={serverService} />
            </Grid> */}
            <Grid item xs={12} marginTop={2}>
              <ServiceStatus name="Services" data={serverService} />
            </Grid>
            <Grid item xs={12} marginTop={2}>
              <ContainerStatus name="Containers" data={serverContainer} />
            </Grid>
            <Grid item xs={12} marginTop={2}>
              <ServerPerformance
                name="Server Performance"
                serverPerformance={serverPerformance}
              />
            </Grid>
          </Grid>
        ) : (
          <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
        )}
      </Box>
    </React.Fragment>
  );
}
