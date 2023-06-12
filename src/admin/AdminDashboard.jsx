import { Box, Typography } from "@mui/material";
import React from "react";

const AdminDashboard = () => {
  return (
    <Box border="1px solid red" sx={{ height: "100vh" }}>
      <Typography
        sx={{ fontSize: 24, fontWeight: "600", marginLeft: 2, marginTop: 2,marginBottom:1 }}
      >
        Admin Dashboard 
      </Typography>
      UserList
    </Box>
  );
};

export default AdminDashboard;
