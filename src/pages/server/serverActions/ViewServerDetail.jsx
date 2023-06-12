import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DoneIcon from "@mui/icons-material/Done";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../components/constant/constant";
import Swal from "sweetalert2";

const ViewServerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Detail id", id);
  const [servers, setServers] = useState([]);

  const getServers = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    const response = await axios.post(
      `${BASE_URL}/usrserverdata`,
      null,
      config
    );
    if (response.data?.success) {
      const result = response?.data?.User_Servers_Data;
      setServers(result);
    } else if (response?.data?.token_error) {
      Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };
  useEffect(() => {
    getServers();
  }, []);

  const findServer = servers?.find((item) => item.Server_id === id);
  //   console.log("findServer", findServer);
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <KeyboardBackspaceIcon
        sx={{ fontSize: 44, marginTop: 2, cursor: "pointer" }}
        onClick={() => navigate("/dashboard/user/viewServers")}
      />

      <Box marginTop={2} boxShadow={3} borderRadius={4} padding={3}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: "600",
            marginBottom: "1px",
            color: "#1576D2",
          }}
        >
          Server Detail:
        </Typography>
        {findServer ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#1976D2", color: "#ffffff" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Server Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "left",
                      marginLeft: 4,
                    }}
                  >
                    Services
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "left",
                      marginLeft: 4,
                    }}
                  >
                    Containers
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {rows.map((row) => ( */}
                <TableRow
                  // key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ fontWeight: "600", textAlign: "center" }}>
                    {findServer?.Server_Name}
                  </TableCell>
                  <TableCell align="left">
                    <ListItem
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "left",
                      }}
                    >
                      {findServer?.Lst_Services?.map((item, i) => (
                        <Box
                          display={"flex"}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          <ListItemIcon>
                            <DoneIcon sx={{ mr: 1 }} />
                          </ListItemIcon>
                          <ListItemText key={i} primary={item} />
                        </Box>
                      ))}
                    </ListItem>
                  </TableCell>
                  <TableCell align="left">
                    <ListItem sx={{ display: "flex", flexDirection: "column" }}>
                      {findServer?.Lst_Containers?.map((item, i) => (
                        <Box
                          display={"flex"}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                          }}
                        >
                          <ListItemIcon>
                            <DoneIcon sx={{ mr: 1 }} />
                          </ListItemIcon>
                          <ListItemText key={i} primary={item} />
                        </Box>
                      ))}
                    </ListItem>
                  </TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
        )}
      </Box>
    </Box>
  );
};

export default ViewServerDetail;
