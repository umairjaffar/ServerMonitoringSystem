import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import KeyIcon from "@mui/icons-material/Key";
import { InputAdornment, IconButton } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../components/constant/constant";

const theme = createTheme();
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timerProgressBar: true,
  width: "400px",
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loginDisable, setLoginDisable] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "User email must be required!";
    }
    if (!values.password) {
      errors.password = "User password must be required!";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);

    const validationErrors = validate(formValues);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoginDisable(true);
        setTimeout(() => {
          setLoginDisable(false);
        }, 10000);

        const response = await axios.post(`${BASE_URL}/login`, formData); //API
        // console.log("resp", response)
        if (response?.data?.sucess) {
          Toast.fire({
            icon: "success",
            title: "Login Successfull",
            timer: 2000,
          }).then((result) => {
            localStorage.setItem(
              "verificationtoken",
              response?.data?.verificationtoken
            );
            const newExpiryTimestamp = new Date();
            newExpiryTimestamp.setSeconds(
              newExpiryTimestamp.getSeconds() + 120
            ); // Set expiry time to 2 minutes (120 seconds)
            localStorage.setItem("expiryTimestamp", newExpiryTimestamp);
            navigate("/otpVarification");
          });
        } else {
          Toast.fire({
            icon: "error",
            title: response?.data?.messege,
            timer: 9000,
          });
        }
      } catch (error) {
        console.log("LOGIN ERROR!", error.message);
      }
    }
  };
  const forgotHandler = async () => {
    const formData = new FormData();
    formData.append("email", formValues.email);
    setLoginDisable(true);
    const response = await axios.post(
      `${BASE_URL}/resetpasswordlink`,
      formData
    );
    if (response.data.success) {
      setLoginDisable(false);
      Toast.fire({
        icon: "success",
        title: response.data.messege,
        timer: 8000,
      });
    } else {
      setLoginDisable(false);
      Toast.fire({
        icon: "error",
        title: response?.data?.messege,
        timer: 9000,
      });
    }
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
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
              width={"100%"}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formValues.email}
                onChange={handleChange}
              />
              <Typography color={"error"}>{formErrors.email}</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formValues.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <KeyIcon /> : <KeyOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography color={"error"}>{formErrors.password}</Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loginDisable}
              >
                {loginDisable ? "Loading..." : "Sign In"}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    onClick={forgotHandler}
                    variant="body2"
                    style={{
                      textDecoration: "none",
                      color: "#1976D2",
                      fontSize: 14,
                    }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <span style={{ color: "gray", fontSize: 14 }}>
                    Don't have an account?
                  </span>
                  <Link
                    to="/"
                    variant="body2"
                    style={{ textDecoration: "none", color: "#1976D2" }}
                  >
                    {" Sign Up"}
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

export default Login;
