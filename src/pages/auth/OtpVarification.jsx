import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../../components/constant/constant";
import OtpTimer from "./OtpTimer";

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

const OtpVarification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendDisabled, setResendDisabled] = useState(false);

  const validate = (value) => {
    const errors = {};
    const regex = /^[0-9]+$/;
    if (!otp) {
      errors.otp = "OTP must be required!";
    } else if (otp.length < 6) {
      errors.otp = "OTP must have six numbers!";
    } else if (!regex.test(otp)) {
      errors.otp = "OTP accept only numbers!";
    }
    return errors;
  };

  const confirmedOTP = async () => {
    const validatioErrors = validate(otp);
    setErrors(validatioErrors);
    const token = localStorage.getItem("verificationtoken");
    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("token", token);
    console.log("ErrorOtp", errors);
    if (Object.keys(validatioErrors).length === 0) {
      if (otp.length > 5) {
        setLoader(true);
        const otp_resp = await axios.post(`${BASE_URL}/verifyotp`, formData); //API
        localStorage.setItem("access_token", otp_resp?.data?.access_token);
        const accesstoken = localStorage.getItem("access_token");
        const config = {
          headers: {
            Authorization: `Bearer ${accesstoken}`,
          },
        };
        if (otp_resp?.data?.success) {
          setLoader(false);
          Toast.fire({
            icon: "success",
            title: "OTP confirmed",
            timer: 3000,
          }).then(async (result) => {
            const userAuth = await axios.post(
              `${BASE_URL}/userauthenticated`,
              null,
              config
            );
            console.log("unauthrespo:", userAuth);
            if (userAuth?.data?.success && userAuth?.data?.UserRole) {
              setLoader(false);
              // console.log("otpAlert", userAuth?.data?.isallowedalert);
              localStorage.setItem("UserRole", userAuth?.data?.UserRole);
              localStorage.setItem("alert", userAuth?.data?.isallowedalert);
              localStorage.setItem("package", userAuth?.data?.isallowedtosel);
              navigate(userAuth?.data?.URL);
            } else {
              setLoader(false);
              Toast.fire({
                icon: "error",
                title: userAuth?.data?.messege,
                confirmButtonText: "OK",
                timer: 3000,
              });
            }
          });
          setOtp(null);
        } else {
          setLoader(false);
          Swal.fire({
            icon: "error",
            title: "error",
            text: otp_resp?.data?.messege,
            confirmButtonText: "OK",
          });
          setOtp(null);
        }
      }
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimeout(() => {
      setResendDisabled(false);
    }, 2 * 60 * 1000); // 2 minutes in milliseconds
    setOtp(null);
    const token = localStorage.getItem("verificationtoken");
    const formData = new FormData();
    formData.append("token", token);
    const resend_resp = await axios.post(`${BASE_URL}/resendotp`, formData); //API
    // console.log("resend_resp", resend_resp);
    if (resend_resp?.data?.success) {
      Toast.fire({
        icon: "success",
        title: "OTP resend successfully.",
        timer: 3000,
      });
    } else {
      Toast.fire({
        icon: "error",
        title: resend_resp?.data?.messege,
        timer: 3000,
      });
    }
  };
  const expiryTimestamp = localStorage.getItem("expiryTimestamp");
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
          width: 455,
          height: 450,
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
          paddingTop: 4,
        }}
      >
        <OtpTimer expiryTimestamp={new Date(expiryTimestamp)} />
        <Typography sx={{ fontSize: 36, fontWeight: "600" }}>
          OTP Verification
        </Typography>
        <Box
          sx={{
            bgcolor: "rgb(212,236,222)",
            width: 320,
            paddingX: 2,
            paddingY: 1,
            marginBottom: 2,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: "500" }}>
            We've sent a verification code to your email <br />
            please check your email and enter it here.
            {/* <a style={{ color: "#1976D2", cursor: "pointer", marginLeft: 3 }}>
              example@gmail.com
            </a>
            <br /> */}
          </Typography>
        </Box>
        <MuiOtpInput
          display="flex"
          gap={1}
          style={{ width: "99%" }}
          length={6}
          value={otp ? otp : ""}
          TextFieldsProps={{ size: "small", placeholder: "-" }}
          onChange={(newValue) => setOtp(newValue)}
        />
        <Typography color={"error"}>{errors.otp}</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
          did't get the otp{" "}
          <a
            style={{
              color: resendDisabled ? "gray" : "#1976D2",
              cursor: resendDisabled ? "auto" : "pointer",
            }}
            onClick={handleResendOtp}
          >
            Resend
          </a>
        </Typography>
        <Button
          onClick={confirmedOTP}
          variant="contained"
          fullWidth
          size="medium"
          style={{ marginTop: 16 }}
          disabled={loader}
        >
          {loader ? "loading..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default OtpVarification;
