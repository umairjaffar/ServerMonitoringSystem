import React from "react";
import { Box, Typography } from "@mui/material";

const Home = () => {

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
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: "600",
          color: "gray",
        }}
      >
        Thank you for using our services.
      </Typography>
    </Box>
  );
};

export default Home;
