import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../components/constant/constant";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axios from "axios";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";

const UpdateUserDetail = () => {
  const { id } = useParams();
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
  const [formErrors, setFormErrors] = useState({});
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
      setLoading(false);
      console.log("prodOwnerGetUser,ERROR", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const validate = (values) => {
    const errors = {};
    const stringRegex = /^[a-zA-Z]+$/;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.First_Name) {
      errors.First_Name = "User name must be required!";
    } else if (!stringRegex.test(values.First_Name)) {
      errors.First_Name = "String containing only alphabets!";
    }

    if (!values.Last_Name) {
      errors.Last_Name = "User name must be required!";
    } else if (!stringRegex.test(values.Last_Name)) {
      errors.Last_Name = "String containing only alphabets!";
    }

    if (!values.email) {
      errors.email = "User email must be required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    return errors;
  };

  const updateUserHandle = () => {
    const monitorObj = {
      fname: user.First_Name,
      lname: user.Last_Name,
      email: user.email,
      typeofusr: user.Role,
      allowtoconfigalert: false,
      allowdeveoptoselectpak: false,
    };
    const devopObj = {
      fname: user.First_Name,
      lname: user.Last_Name,
      email: user.email,
      typeofusr: user.Role,
      allowtoconfigalert: user.Allow_Devop_Config_Alert,
      allowdeveoptoselectpak: user.Allow_Devop_Select_Package,
    };
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    const validationErrors = validate(user);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
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
            // console.log("CreTok", config);
            const response = await axios.post(
              `${BASE_URL}/updatedevopmonitorusr/${id}`,
              user.Role === "devop" ? devopObj : monitorObj,
              config
            );
            if (response?.data?.success) {
              Swal.fire(
                "Updated!",
                "User updated successfully.",
                "success"
              ).then((result) => {
                if (result.isConfirmed) {
                  navigate("/dashboard/user/manageUsers");
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
            console.log("Update User Error", error);
          }
        },
      });
    }
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
          onClick={() => navigate("/dashboard/user/manageUsers")}
        />
      </Box>
      {!loading ? (
        <Box
          sx={{
            minWidth: 300,
            width: { xs: "90%", sm: 500 },
            boxShadow: 3,
            paddingX: 3,
            paddingY: 2,
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
              justifyContent: "space-evenly",
              marginTop: 1,
              gap: 2,
            }}
          >
            <Grid item xs={11.5} sm={5.5}>
              <TextField
                fullWidth
                label="User First Name"
                name="First_Name"
                value={user.First_Name}
                onChange={handleChange}
              />
              <Typography color={"error"}>{formErrors.First_Name}</Typography>
            </Grid>
            <Grid item xs={11.5} sm={5.5}>
              <TextField
                fullWidth
                label="User Last Name"
                name="Last_Name"
                value={user.Last_Name}
                onChange={handleChange}
              />
              <Typography color={"error"}>{formErrors.Last_Name}</Typography>
            </Grid>
            <Grid item xs={11.5}>
              <TextField
                fullWidth
                label="User Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              <Typography color={"error"}>{formErrors.email}</Typography>
            </Grid>
            <Grid item xs={11.5}>
              <TextField
                fullWidth
                label="User Package"
                name="Package"
                value={user.Package}
                disabled
              />
            </Grid>
            <Grid item xs={11.5} display="flex" alignItems="center" gap={2}>
              <FormLabel
                sx={{ fontSize: 18, fontWeight: "400", color: "black" }}
              >
                User Role:
              </FormLabel>
              <RadioGroup
                name="Role"
                value={user.Role.toLocaleLowerCase()}
                onChange={handleChange}
                style={{ display: "flex", flexDirection: "row", marginTop: 1 }}
              >
                <FormControlLabel
                  value="devop"
                  control={<Radio />}
                  label="Devop"
                />
                <FormControlLabel
                  value="monitor"
                  control={<Radio />}
                  label="Monitor"
                />
              </RadioGroup>
            </Grid>
            {user.Role === "devop" && (
              <Grid container justifyContent="space-evenly">
                <Grid item xs={11.5}>
                  <FormControlLabel
                    label="Allow email configration"
                    control={
                      <Checkbox
                        checked={user.Allow_Devop_Config_Alert}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            Allow_Devop_Config_Alert: e.target.checked,
                          })
                        }
                      />
                    }
                  />
                </Grid>
                <Grid item xs={11.5}>
                  <FormControlLabel
                    label="Allow change packages"
                    control={
                      <Checkbox
                        checked={user.Allow_Devop_Select_Package}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            Allow_Devop_Select_Package: e.target.checked,
                          })
                        }
                      />
                    }
                  />
                </Grid>
              </Grid>
            )}

            <Grid item xs={11.5} sm={5.5}>
              <Button fullWidth variant="contained" onClick={updateUserHandle}>
                Update User
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default UpdateUserDetail;
