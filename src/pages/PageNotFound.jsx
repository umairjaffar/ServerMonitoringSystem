import { Box, Typography } from "@mui/material";
import React from "react";

const PageNotFound = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "590px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>404!</h1>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: "600",
          color: "red",
        }}
      >
        Page Not Found...
      </Typography>
    </Box>
  );
};

export default PageNotFound;
