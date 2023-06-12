import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Image from "../../images/sideImg.avif";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../../components/constant/constant";

const theme = createTheme();
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 12000,
  timerProgressBar: true,
  width: "400px",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const Signup = () => {
  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [signupDisable, setSignupDisable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  // ------------------------handleSubmit.........
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("fname", formValues.fname);
    formData.append("lname", formValues.lname);
    formData.append("email", formValues.email);
    setFormErrors(validate(formValues));

    if (formValues.fname && formValues.lname && formValues.email) {
      try {
        setSignupDisable(true);
        setTimeout(() => {
          setSignupDisable(false);
        }, 12000);
        const response = await axios.post(`${BASE_URL}/signup`, formData); //API
        console.log("response", response);
        if (response?.data?.success) {
          Toast.fire({
            icon: "success",
            title: "We sent a link on your eamil please click on that link.",
          });
          setFormValues({
            fname: "",
            lname: "",
            email: "",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: response?.data?.messege,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    setIsSubmit(true);
  };

  const validate = (values) => {
    const errors = {};
    const stringRegex = /^[a-zA-Z]+$/;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.fname) {
      errors.fname = "User name must be required!";
    } else if (!stringRegex.test(values.fname)) {
      errors.fname =
        "String containing only English alphabets (a to z) in either lowercase or uppercase!";
    }

    if (!values.lname) {
      errors.lname = "User name must be required!";
    } else if (!stringRegex.test(values.lname)) {
      errors.lname =
        "String containing only English alphabets (a to z) in either lowercase or uppercase!";
    }

    if (!values.email) {
      errors.email = "User email must be required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    return errors;
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Image})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "secondary.main",
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} width={"100%"}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="fname"
                label="First Name"
                name="fname"
                autoComplete="fname"
                value={formValues?.fname}
                onChange={handleChange}
              />
              <Typography color={"error"}>{formErrors.fname}</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="lname"
                label="Last Name"
                name="lname"
                autoComplete="lname"
                value={formValues?.lname}
                onChange={handleChange}
              />
              <Typography color={"error"}>{formErrors.lname}</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                type="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formValues?.email}
                onChange={handleChange}
              />
              <Typography color={"error"}>{formErrors.email}</Typography>
              <Button
                // type="submit"
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, textTransform: "none" }}
                disabled={signupDisable}
              >
                {signupDisable ? "Loading..." : "Sign Up"}
              </Button>
              <Grid container>
                <Grid item xs={12} sx={{ textAlign: "end" }}>
                  <span style={{ color: "gray", fontSize: 14 }}>
                    If already have account?
                  </span>
                  <Link
                    to="/login"
                    variant="body2"
                    style={{ textDecoration: "none", color: "#1976D2" }}
                  >
                    {" Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Signup;
