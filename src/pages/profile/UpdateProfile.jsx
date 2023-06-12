import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../components/constant/constant";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const getUserUpdate = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    const response = await axios.post(
      `${BASE_URL}/getuserdetail`,
      null,
      config
    );
    // console.log("ProfileResp", response?.data?.Data);
    if (response?.data?.success) {
      setLoading(false);
      setUser(response?.data?.Data);
    } else if (response?.data?.token_error) {
      setLoading(false);
      Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };
  useEffect(() => {
    getUserUpdate();
  }, []);
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  console.log("userUpdate", user);
  const updateProfileHandler = (e) => {
    e.preventDefault();
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    const formData = new FormData();
    formData.append("fname", user.First_name);
    formData.append("lname", user.Last_name);
    formData.append("email", user.email);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.post(
            `${BASE_URL}/updateuserdata`,
            formData,
            config
          );
          console.log("UpdatedDataRes", response);
          if (response?.data?.success) {
            Swal.fire(
              "Updated!",
              "User profile updated successfull.",
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                navigate("/dashboard/user/profile");
              }
            });
          } else if (response?.data?.token_error) {
            Swal.fire("ERROR!", response?.data?.message, "error").then(
              (result) => {
                if (result.isConfirmed) {
                  navigate("/login");
                }
              }
            );
          } else {
            Swal.fire("Error!", response?.data?.messege, "error");
          }
        } catch (error) {
          console.log("updateProfile ERROR", error);
        }
      },
    });
  };
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
          <Box width="100%">
            <KeyboardBackspaceIcon
              sx={{ fontSize: 44, marginY: 1, cursor: "pointer" }}
              onClick={() => navigate("/dashboard/user/profile")}
            />
          </Box>
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
            <Grid item xs={11} marginBottom={3}>
              <Typography
                sx={{
                  fontSize: 26,
                  fontWeight: "600",
                  color: "#4687CA",
                }}
              >
                <span style={{ fontStyle: "italic" }}>Update Profile</span>
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Grid container gap={2} justifyContent="space-between">
                <Grid item xs={12} md={5.8}>
                  <TextField
                    fullWidth
                    placeholder="First Name"
                    value={user?.First_name}
                    name="First_name"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={5.8}>
                  <TextField
                    fullWidth
                    placeholder="Last Name"
                    value={user?.Last_name}
                    name="Last_name"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={10}>
              <TextField
                fullWidth
                placeholder="Email"
                value={user?.email}
                name="email"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={10}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: { xs: "70%", sm: "40%", md: "30%" } }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={updateProfileHandler}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default UpdateProfile;
