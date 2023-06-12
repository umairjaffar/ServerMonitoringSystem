import { Box, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Box display={"flex"}>
      <Link to="user/home" style={{ textDecoration: "none", color: "white" }}>
        <ListItemButton sx={{ textAlign: "center" }}>
          <ListItemText primary="Home" />
        </ListItemButton>
      </Link>
      <Link to="/varification" style={{ textDecoration: "none", color: "white" }}>
        <ListItemButton sx={{ textAlign: "center" }}>
          <ListItemText primary="Varification" />
        </ListItemButton>
      </Link>
      <Link to="/packages" style={{ textDecoration: "none", color: "white" }}>
        <ListItemButton sx={{ textAlign: "center" }}>
          <ListItemText primary="Packages" />
        </ListItemButton>
      </Link>
    </Box>
  );
};

export default NavBar;
