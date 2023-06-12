import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";

const OtpTimer = ({ expiryTimestamp }) => {
  const calculateTimeLeft = () => {
    const difference = expiryTimestamp - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  //   const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  });

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  //   const timerExpired = timeLeft.minutes === 0 && timeLeft.seconds === 0;
  //   console.log("timerExpired", timerExpired);

  return (
    <Typography sx={{ fontSize: 14, fontWeight: "600" }}>
      {timeLeft.minutes !== undefined ? (
        <Typography sx={{ color: "gray", fontSize: 16 }}>
          OTP expiry time:{" "}
          <span
            style={{
              fontSize: 18,
              fontWeight: "500",
              fontStyle: "italic",
              color: "#1976D2",
            }}
          >
            {formatTime(timeLeft.minutes)}
          </span>
          :{" "}
          <span
            style={{
              fontSize: 18,
              fontWeight: "500",
              fontStyle: "italic",
              color: "#1976D2",
            }}
          >
            {formatTime(timeLeft.seconds)}
          </span>
        </Typography>
      ) : null}
      {/* {timerExpired
        ? "OTP Expired, Resend OTP"
        : `Time remaining: ${formatTime(timeLeft.minutes)}:${formatTime(
            timeLeft.seconds
          )}`} */}
    </Typography>
  );
};

export default OtpTimer;
