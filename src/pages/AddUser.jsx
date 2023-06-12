import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../components/constant/constant";

const AddUser = () => {
  const navigate = useNavigate();
  const initialValues = {
    userType: "",
    fname: "",
    lname: "",
    email: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [checkedPackage, setCheckedPackage] = useState(false);
  const [checkedAlert, setCheckedAlert] = useState(false);
  const [addUserDisable, setAddUserDisable] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setFormErrors(validate(formValues));
    const { userType, fname, lname, email } = formValues;
    const formData = new FormData();
    formData.append("fname", formValues.fname);
    formData.append("lname", formValues.lname);
    formData.append("email", formValues.email);
    formData.append("typeofusr", formValues.userType);
    formData.append("allowdeveoptoselectpak", checkedPackage);
    formData.append("allowtoconfigalert", checkedAlert);
    if (userType && fname && lname && email) {
      setAddUserDisable(true);
      setTimeout(() => {
        setAddUserDisable(false);
      }, 12000);
      const response = await axios.post(
        `${BASE_URL}/adduser`, // Send Data to api of addUser page.
        formData,
        config
      );
      console.log("Response", response);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "The link is successfully sent to user email.",
        }).then((result) => {
          Swal.fire({
            title: "Add more user?",
            text: "Do you want to add another user!",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
          }).then((result) => {
            if (!result.isConfirmed) {
              navigate("/dashboard/user/manageUsers");
            }
          });
        });

        setFormValues(initialValues);
        setCheckedPackage(false);
        setCheckedAlert(false);
      } else if (response?.data?.token_error) {
        Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: response.data?.messege,
        });
      }
    }
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      //   console.log("vvvvv", formValues);
    }
  }, [formErrors, isSubmit, formValues]);

  const validate = (values) => {
    const errors = {};
    const stringRegex = /^[a-zA-Z\s]+$/;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.userType) {
      errors.userType = "User type must be provided";
    }
    if (!values.fname) {
      errors.fname = "User first name must be provided";
    } else if (!stringRegex.test(values.fname)) {
      errors.fname = "First name only except english alphabets!";
    }

    if (!values.lname) {
      errors.lname = "User lname name must be provided";
    } else if (!stringRegex.test(values.lname)) {
      errors.lname = "Last name only except english alphabets!";
    }

    if (!values.email) {
      errors.email = "User email must be provided";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    return errors;
  };
  //   render user information
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 3,
      }}
    >
      <Box width="100%">
        <KeyboardBackspaceIcon
          sx={{ fontSize: 44, marginY: 1, cursor: "pointer" }}
          onClick={() => navigate("/dashboard/user/manageUsers")}
        />
      </Box>
      <Box sx={{ width: 500, height: "auto", boxShadow: 3, borderRadius: 3 }}>
        <Typography
          sx={{ fontSize: 24, fontWeight: "600", marginLeft: 2, marginTop: 2 }}
        >
          Add User
        </Typography>
        <Box
          sx={{ marginX: 4, marginBottom: 4 }}
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="User first name"
            variant="outlined"
            name="fname"
            value={formValues?.fname}
            onChange={handleChange}
          />
          <Typography color={"error"}>{formErrors.fname}</Typography>
          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="User last name"
            variant="outlined"
            name="lname"
            value={formValues?.lname}
            onChange={handleChange}
          />
          <Typography color={"error"}>{formErrors.lname}</Typography>
          <TextField
            sx={{ marginTop: 2 }}
            margin="normal"
            fullWidth
            label="User email"
            name="email"
            autoComplete="email"
            value={formValues?.email}
            onChange={handleChange}
          />
          <Typography color={"error"}>{formErrors.email}</Typography>
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
              gap: 2,
              marginTop: 1,
            }}
            fullWidth
          >
            <FormLabel sx={{ fontSize: 20, fontWeight: "400", color: "black" }}>
              User Type:
            </FormLabel>
            <RadioGroup
              name="userType"
              value={formValues?.userType}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "row", marginLeft: 3 }}
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
          </FormControl>
          <Typography color={"error"}>{formErrors.userType}</Typography>
          {/* Check boxes allow package, allow alert */}
          {formValues.userType === "devop" ? (
            <Box>
              <FormControlLabel
                label="Allow devop user to add package."
                control={
                  <Checkbox
                    checked={checkedPackage}
                    onChange={(e) => setCheckedPackage(e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
              <br />
              <FormControlLabel
                label="Allow devop user to access email alert configuration."
                control={
                  <Checkbox
                    checked={checkedAlert}
                    onChange={(e) => setCheckedAlert(e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
            </Box>
          ) : (
            ""
          )}
          {/* Buttons  */}
          <Grid container justifyContent="space-evenly">
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                sx={{ marginTop: 4 }}
                variant="contained"
                disabled={addUserDisable}
              >
                {addUserDisable ? "loading..." : "Add User"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AddUser;
