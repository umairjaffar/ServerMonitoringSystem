import * as React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import UnvarifiedUsers from "./UnvarifiedUsers";
import { useNavigate } from "react-router-dom";
import VarifiedUsers from "./VarifiedUsers";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`,
  };
}

export default function ManageUser() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    // <Box
    //   sx={{
    //     bgcolor: "background.paper",
    //     width: "100%",
    //     position: "relative",
    //     minHeight: 300,
    //   }}
    // >
    <Box sx={{ height: "85vh" }}>
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}>
        <Button
          onClick={() => navigate("/dashboard/user/addUser")}
          variant="contained"
          style={{ minWidth: 130 }}
        >
          Add User
        </Button>
      </Box>
      <AppBar position="static" sx={{ marginTop: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          sx={{ width: 450 }}
        >
          <Tab
            sx={{ fontWeight: "500", fontSize: 18 }}
            label="Varified Users"
            {...a11yProps(0)}
          />
          <Tab
            sx={{
              fontWeight: "500",
              fontSize: 18,
              borderLeft: "2px solid gray",
            }}
            label="UnVarified Users"
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <VarifiedUsers />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <UnvarifiedUsers />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
