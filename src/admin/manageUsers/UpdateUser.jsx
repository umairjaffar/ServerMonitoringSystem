import React, { useState, useEffect } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../components/constant/constant";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateUser = () => {
  const { id } = useParams();
  console.log("userID", id);
  const navigate = useNavigate();
  const initialValues = {
    First_Name: "",
    Last_Name: "",
    email: "",
    Role: "",
    package_name: "",
    Package_type: "",
  };
  const [updateUser, setUpdateUser] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    const accesstoken = localStorage.getItem("access_token");
    // console.log("TOKEN", accesstoken);
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    try {
      const resp = await axios.post(
        `${BASE_URL}/getusrdata/${id}`,
        null,
        config
      );
      console.log("userResp", resp?.data);
      if (resp.data?.success) {
        setLoading(false);
        setUpdateUser(resp?.data?.Data);
      } else if (resp?.data?.token_error) {
        Swal.fire("ERROR!", resp?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        Swal.fire("ERROR!", resp?.data?.message, "error");
      }
    } catch (error) {
      console.log("getusrdata ERROR", error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("fname", updateUser.First_Name);
    formData.append("lname", updateUser.Last_Name);
    formData.append("email", updateUser.email);
    formData.append("role", updateUser.Role);

    const jsonObject = {};
    // formData?.forEach((value, key) => {
    //   jsonObject[key] = value;
    // });
    for (const [key, value] of formData) {
      jsonObject[key] = value;
    }
    const jsonData = JSON.stringify(jsonObject);
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "Content-Type": "application/json",
      },
    };
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
            `${BASE_URL}/changeuserdatabyadmin/${id}`,
            jsonData,
            config
          );
          console.log("updateRes", response);
          if (response?.data?.success) {
            Swal.fire("Updated!", "User updated successfull.", "success").then(
              (result) => {
                if (result.isConfirmed) {
                  navigate("/dashboard/admin/viewUsers");
                }
              }
            );
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
          console.log("changeuserdatabyadmin ERROR", error);
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
      <Box width="100%">
        <KeyboardBackspaceIcon
          sx={{ fontSize: 44, marginY: 1, cursor: "pointer" }}
          onClick={() => navigate("/dashboard/admin/viewUsers")}
        />
      </Box>
      {/* Add Package Detail to form */}
      {!loading ? (
        <Box
          sx={{
            minWidth: 300,
            width: { xs: "90%", sm: 500 },
            boxShadow: 3,
            paddingX: 3,
            paddingY: 5,
            borderRadius: 3,
          }}
          component="form"
        >
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: "600",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            Update User
          </Typography>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 1,
            }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="First_Name"
                value={updateUser.First_Name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={5.5} sx={{ marginTop: { xs: 2, sm: 0 } }}>
              <TextField
                fullWidth
                label="Last Name"
                name="Last_Name"
                value={updateUser.Last_Name}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          {/* Package Description */}
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 1,
            }}
          >
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={updateUser.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <TextField
                fullWidth
                label="User Role"
                name="Role"
                value={updateUser.Role}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Grid item xs={12} sm={6}>
              <TextField
                disabled
                fullWidth
                label="Package Name"
                name="package_name"
                value={updateUser.package_name}
                //   onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={5.5} sx={{ marginTop: { xs: 2, sm: 0 } }}>
              <TextField
                disabled
                fullWidth
                label="Package Type"
                name="Package_type"
                value={updateUser.Package_type}
                //   onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{ minWidth: 220 }}
              onClick={handleSubmit}
            >
              Update User
            </Button>
          </Box>
          {/* Add Package Detail to form End*/}
        </Box>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default UpdateUser;
