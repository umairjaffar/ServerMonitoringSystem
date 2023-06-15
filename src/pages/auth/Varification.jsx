import { Button, IconButton, Typography } from "@mui/material";
import { Box, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import KeyIcon from "@mui/icons-material/Key";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../components/constant/constant";

const Varification = () => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*()_+=[\]{}|\\,.?:;!'\"<>~`-]).{8,}$/;
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    password: "",
    cPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const handleClickShowConPassword = () => setShowConPassword(!showConPassword);
  const handleMouseDownConPassword = () => setShowConPassword(!showConPassword);
  const [verificatioDisable, setVerificatioDisable] = useState(false);

  const verificationFunction = async () => {
    return await axios.post(`${BASE_URL}/verification/${id}`); // API
  };

  useEffect(() => {
    verificationFunction();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("password", formValues.password);
    formData.append("cPassword", formValues.cPassword);
    formData.append("userId", id);
    setFormErrors(validate(formValues));
    if (formValues.password.length >= 8) {
      try {
        if (
          formValues.password === formValues.cPassword &&
          passwordRegex.test(formValues.password)
        ) {
          setVerificatioDisable(true);
          setTimeout(() => {
            setVerificatioDisable(false);
          }, 12000);
          // API to make user Password.
          const resp = await axios.post(
            `${BASE_URL}/validated/${id}`,
            formData
          );
          // console.log("resp", resp);
          if (resp?.data?.success) {
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Password confirmed",
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/login");
              }
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "ERROR!",
              text: resp?.data?.messege,
              confirmButtonText: "OK",
            });
          }
        }
      } catch (error) {
        console.log("Verification ERROR!", error.message);
      }
    }
  };
  // console.log("length", formValues.password.length >= 8 ? "good" : "bad");
  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = "Password must be required!";
    } else if (values.password.length < 8) {
      errors.password = "Password must contain al least eight characters!";
    } else if (passwordRegex.test(values.password)) {
      if (
        values.password === values.cPassword &&
        passwordRegex.test(values.password)
      ) {
        console.log("Password confirmed!");
      } else {
        errors.cPassword = "Passwords do not match to comfirm password...!";
      }
    } else {
      errors.password =
        "Your password must contain at least one uppercase letter, one  lowercase letter, one special character and  one number!";
    }
    return errors;
  };
  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "rgb(250,250,250)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 445,
          bgcolor: "rgb(255,255,255)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          //   justifyContent:'center',
          marginX: 2,
          gap: 2,
          boxShadow: 2,
          paddingX: 4,
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <Typography sx={{ marginTop: 6, fontSize: 36, fontWeight: "600" }}>
          User Verification
        </Typography>
        <Box
          sx={{
            bgcolor: "rgb(212,236,222)",
            width: 350,
            paddingX: 1,
            paddingY: 1,
            // marginBottom: 1,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: "500" }}>
            Password & comfirm password must be same.
          </Typography>
          {/* <Typography color={"error"}>{formErrors.password}</Typography> */}
        </Box>
        <Box sx={{ width: "90%", marginBottom: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formValues?.password}
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
          {/* cPassword */}
          <TextField
            margin="normal"
            required
            fullWidth
            type={showConPassword ? "text" : "password"}
            name="cPassword"
            label="Confirm Password"
            id="cPassword"
            autoComplete="current-cPassword"
            value={formValues?.cPassword}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConPassword}
                    onMouseDown={handleMouseDownConPassword}
                  >
                    {showConPassword ? <KeyIcon /> : <KeyOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography color={"error"}>{formErrors.cPassword}</Typography>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            size="medium"
            style={{ marginTop: 16 }}
            disabled={verificatioDisable}
          >
            {verificatioDisable ? "loading..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Varification;
