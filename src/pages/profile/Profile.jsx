import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../components/constant/constant";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TypoText = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: "500",
  color: "#4687CA",
}));
const Icon = styled(DoneIcon)(() => ({
  backgroundColor: "#E0E0D8",
  borderRadius: 10,
  fontSize: 22,
  marginRight: 5,
}));

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);

  const getProfileData = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    const response = await axios.post(
      `${BASE_URL}/getprofileusrdata`,
      null,
      config
    );
    // console.log("ProfileResp", response?.data?.Data);
    if (response?.data?.success) {
      setLoading(false);
      setProfile(response?.data?.Data);
    } else if (response?.data?.token_error) {
      Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };
  useEffect(() => {
    getProfileData();
  }, []);

  //   console.log("profile", profile ? profile : "");
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
      {!loading ? (
        <>
          {profile ? (
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 26,
                      fontWeight: "600",
                      color: "#4687CA",
                    }}
                  >
                    <span style={{ fontStyle: "italic" }}>User Profile</span>
                  </Typography>
                  <Tooltip title="Update Profile" arrow>
                    <ListItemIcon
                      onClick={() => navigate("/dashboard/user/updateProfile")}
                      sx={{
                        backgroundColor: "#e0e0e0",
                        justifyContent: "center",
                        borderRadius: 10,
                        paddingY: "13px",
                        cursor: "pointer",
                      }}
                    >
                      <EditIcon style={{ color: "#1976d2" }} />
                    </ListItemIcon>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={10}>
                <TypoText>
                  Name :{" "}
                  <span
                    style={{
                      fontSize: 18,
                      fontStyle: "italic",
                      color: "#202020",
                    }}
                  >
                    {profile.User_Name}
                  </span>
                </TypoText>
              </Grid>
              <Grid item xs={10}>
                <TypoText>
                  Email :{" "}
                  <span
                    style={{
                      fontSize: 18,
                      fontStyle: "italic",
                      color: "#202020",
                    }}
                  >
                    {profile.email}
                  </span>
                </TypoText>
              </Grid>
              <Grid item xs={10}>
                <TypoText>
                  Package Name :{" "}
                  <span
                    style={{
                      fontSize: 18,
                      fontStyle: "italic",
                      color: "#202020",
                    }}
                  >
                    {profile.package_name}
                  </span>
                </TypoText>
              </Grid>
              <Grid item xs={10}>
                <TypoText>
                  Role :{" "}
                  <span
                    style={{
                      fontSize: 18,
                      fontStyle: "italic",
                      color: "#202020",
                    }}
                  >
                    {profile.Role}
                  </span>
                </TypoText>
              </Grid>
              <Grid item xs={10}>
                <TypoText>
                  Package Type :{" "}
                  <span
                    style={{
                      fontSize: 18,
                      fontStyle: "italic",
                      color: "#202020",
                    }}
                  >
                    {profile.Package_type}
                  </span>
                </TypoText>
              </Grid>
              {profile?.Role === "prodowner" ? (
                <Grid item xs={10}>
                  <TypoText>User Can</TypoText>
                  <List sx={{ marginLeft: 3 }}>
                    <ListItem>
                      <Icon />
                      <Typography>
                        add {profile.No_of_servers} servers.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Icon />
                      <Typography>
                        add {profile.No_of_devop_users} devop users.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Icon />
                      <Typography>
                        add {profile.No_of_monitor_users} monitor users.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Icon />
                      <Typography>
                        You already added {profile.Added_devop_users} devop
                        users.
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Icon />
                      <Typography>
                        You already added {profile.Added_monitor_users} monitor
                        users.
                      </Typography>
                    </ListItem>
                  </List>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          ) : (
            "UserProfile...."
          )}
        </>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default Profile;
