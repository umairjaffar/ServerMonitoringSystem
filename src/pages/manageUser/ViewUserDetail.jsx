import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  styled,
  List,
  ListItem,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useParams } from "react-router-dom";
// import DoneIcon from "@mui/icons-material/Done";
import { BASE_URL } from "../../components/constant/constant";
import axios from "axios";
import Swal from "sweetalert2";

const TypoText = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: "500",
  color: "#4687CA",
}));
// const Icon = styled(DoneIcon)(() => ({
//   backgroundColor: "#E0E0D8",
//   borderRadius: 10,
//   fontSize: 22,
//   marginRight: 5,
// }));

const ViewUserDetail = () => {
  const { id } = useParams();
  console.log("PrmID", id);
  const navigate = useNavigate();

  const initialValues = {
    First_Name: "",
    Last_Name: "",
    email: "",
    Role: "",
    Package: "",
    Allow_Devop_Config_Alert: false,
    Allow_Devop_Select_Package: false,
  };
  const [user, setUser] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/getdevopmonitorusrdata/${id}`,
        null,
        config
      );
      console.log("getUserResp", response.data?.Data);
      if (response.data.success) {
        setLoading(false);
        setUser(response.data?.Data);
      } else if (response?.data?.token_error) {
        Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
    } catch (error) {
      console.log("prodOwnerGetUser,ERROR", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log("USER", user);

  return (
    <Box
      sx={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box width="100%">
        <KeyboardBackspaceIcon
          sx={{ fontSize: 44, marginY: 1, cursor: "pointer" }}
          onClick={() => navigate("/dashboard/user/manageUsers")}
        />
      </Box>
      {/* View Package Detail */}
      {!loading ? (
        <Grid
          container
          sx={{
            marginTop: 1,
            marginBottom: 5,
            boxShadow: 2,
            borderRadius: 3,
            paddingY: 3,
            justifyContent: "space-evenly",
            gap: 2,
          }}
        >
          <Grid item xs={11}>
            <Typography
              sx={{
                marginBottom: 1,
                fontSize: 26,
                fontWeight: "600",
                color: "#4687CA",
              }}
            >
              <span style={{ fontStyle: "italic" }}>User Detail</span>
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              First Name :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {user.First_Name}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Last Name :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {user.Last_Name}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Email:{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {user.email}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Role :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {user.Role}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Package Name:{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {user.Package}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Package Type :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {user.Package_Type}
              </span>
            </TypoText>
          </Grid>
          {user.Role === "devop" && (
            <Grid item xs={10}>
              <TypoText>User Access</TypoText>
              <List sx={{ marginLeft: 3 }}>
                <ListItem>
                  {/* <Icon /> */}
                  <Typography>
                    {user.Allow_Devop_Config_Alert
                      ? "User have access for configuration alerts"
                      : "User don't have access for configuration alerts"}
                  </Typography>
                </ListItem>
                <ListItem>
                  {/* <Icon /> */}
                  <Typography>
                    {user.Allow_Devop_Select_Package
                      ? "User have access to upgrade package"
                      : "User don't have access to upgrade package"}
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          )}
        </Grid>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default ViewUserDetail;
