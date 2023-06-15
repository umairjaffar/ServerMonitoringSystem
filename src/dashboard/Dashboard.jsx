import React, { useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Listitems from "./Listitems";
import { Route, Routes } from "react-router-dom";
import Server from "../pages/server/Server";
import Home from "../pages/Home";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Stack, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import logo from "../images/logo.avif";
import ServerDetail from "../pages/server/ServerDetail";
import ViewServers from "../pages/server/ViewServers";
import ViewServerDetail from "../pages/server/serverActions/ViewServerDetail";
import UpdateServer from "../pages/server/serverActions/UpdateServer";
import ViewPackages from "../admin/managePackages/ViewPackages";
import CreatePackage from "../admin/managePackages/CreatePackage";
import UpdatePackage from "../admin/managePackages/UpdatePackage";
import ViewUsers from "../admin/manageUsers/ViewUsers";
import AddUser from "../pages/AddUser";
import ConfigrationAlerts from "../pages/ConfigrationAlerts";
import UpdateUser from "../admin/manageUsers/UpdateUser";
import PackageDetail from "../admin/managePackages/PackageDetail";
import axios from "axios";
import { BASE_URL } from "../components/constant/constant";
import Swal from "sweetalert2";
import ManageUser from "../pages/manageUser/ManageUser";
import ViewUserDetail from "../pages/manageUser/ViewUserDetail";
import UpdateUserDetail from "../pages/manageUser/UpdateUserDetail";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../routes/ProtectedRoutes";
import UpdateProfile from "../pages/profile/UpdateProfile";
import PageNotFound from "../pages/PageNotFound";

const drawerWidth = 255;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(6.5),
      },
    }),
  },
}));

const mdTheme = createTheme();

function DashboardContent() {
  const navigate = useNavigate();
  const [UserRole, setUserRole] = useState();
  const [openServer, setOpenServer] = useState(false);
  const [loading, setLoading] = useState(false);
  // Handle Drawer State..
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  // Navbar profile Icon handler..
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchorEl = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const userRole = localStorage.getItem("UserRole");
    setUserRole(userRole);
  }, []);
  const handleClose = () => {
    setAnchorEl(null);
  };

  function stringAvatar(name) {
    return {
      sx: {
        cursor: "pointer",
        // bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  const handleLogout = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    const resp = await axios.post(`${BASE_URL}/logoutusr`, null, config);
    // console.log("Logoutresp", resp);
    if (resp.data.success) {
      setLoading(false);
      localStorage.removeItem("access_token");
      navigate(`/login`);
    } else if (resp?.data?.token_error) {
      Swal.fire("ERROR!", resp?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: resp?.data?.message,
      });
    }
  };
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          {/* ------------------------------------ Header / Navbar  */}
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                toggleDrawer();
                setOpenServer(false);
              }}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }}>
              {/* <NavBar /> */}
              <Box
                component="img"
                sx={{
                  marginTop: "5px",
                  height: 50,
                  width: 50,
                  borderRadius: 2,
                }}
                src={logo}
                alt="logo..."
              />
            </Box>
            <Stack direction="row" spacing={2}>
              {/*  */}
              {UserRole === "admin" ||
              UserRole === "monitor" ||
              UserRole === "superadmin" ? (
                ""
              ) : (
                <Button
                  sx={{
                    textTransform: "none",
                    bgcolor: "white",
                    ":hover": {
                      bgcolor: "#D6D6D6",
                    },
                  }}
                  onClick={() => navigate("user/server")}
                >
                  Add Servers
                </Button>
              )}
              {/* //////// */}
              <Tooltip title="Profile" arrow>
                <Avatar
                  sx={{ bgcolor: "#D6D6D6", color: "#1976D2" }}
                  onClick={handleClick}
                  {...stringAvatar("Umair Jaffar")}
                />
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>
        {/* Navbar Profile XML Code... */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={openAnchorEl}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              navigate("/dashboard/user/profile");
              handleClose();
            }}
          >
            <Avatar /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Drawer XML Code... */}
        <Drawer variant="permanent" open={open}>
          {/* ------------------------------------ Side Bar  */}
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton
              onClick={() => {
                toggleDrawer();
                setOpenServer(false);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <Listitems openServer={openServer} setOpenServer={setOpenServer} />
            {/* <Divider sx={{ my: 1 }} /> */}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl">
            {!loading ? (
              <Routes>
                <Route path="*" element={<PageNotFound />} />
                {UserRole === "admin" || UserRole === "superadmin" ? (
                  <>
                    <Route
                      path="admin/*"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                          <Routes>
                            <Route index element={<ViewPackages />} />
                            <Route
                              path="createPackage"
                              element={<CreatePackage />}
                            />
                            <Route
                              path="packageDetail/:id"
                              element={<PackageDetail />}
                            />
                            <Route
                              path="updatePackage/:name"
                              element={<UpdatePackage />}
                            />
                            <Route
                              path="viewUsers"
                              element={<ViewUsers role={UserRole} />}
                            />
                            <Route
                              path="updateUser/:id"
                              element={<UpdateUser />}
                            />
                            <Route path="*" element={<PageNotFound />} />
                          </Routes>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="user/*"
                      element={
                        <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                          <Routes>
                            <Route path="profile" element={<Profile />} />
                            <Route
                              path="updateProfile"
                              element={<UpdateProfile />}
                            />
                            <Route path="*" element={<PageNotFound />} />
                          </Routes>
                        </ProtectedRoute>
                      }
                    />
                  </>
                ) : UserRole === "prodowner" ? (
                  <Route
                    path="user/*"
                    element={
                      <ProtectedRoute allowedRoles={["prodowner"]}>
                        <Routes>
                          <Route path="server" element={<Server />} />
                          <Route path="viewServers" element={<ViewServers />} />
                          <Route
                            path="serverDetail/:Server_id"
                            element={<ServerDetail />}
                          />
                          <Route
                            path="updateServer/:id"
                            element={<UpdateServer />}
                          />
                          <Route
                            path="viewServerDetail/:id"
                            element={<ViewServerDetail />}
                          />
                          {/* -----------------------------------------Manage Users */}
                          <Route path="manageUsers" element={<ManageUser />} />
                          <Route path="addUser" element={<AddUser />} />
                          <Route
                            path="viewUserDetail/:id"
                            element={<ViewUserDetail />}
                          />
                          <Route
                            path="updateUserDetail/:id"
                            element={<UpdateUserDetail />}
                          />
                          <Route
                            path="configrationAlert"
                            element={<ConfigrationAlerts />}
                          />
                          {/* profile */}
                          <Route path="profile" element={<Profile />} />
                          <Route
                            path="updateProfile"
                            element={<UpdateProfile />}
                          />
                          <Route path="*" element={<PageNotFound />} />
                        </Routes>
                      </ProtectedRoute>
                    }
                  />
                ) : UserRole === "devop" ? (
                  <Route
                    path="user/*" // Home Component Route
                    element={
                      <ProtectedRoute allowedRoles={["devop"]}>
                        <Routes>
                          {/* ----------------------------------------Manage Servers */}
                          <Route path="server" element={<Server />} />
                          <Route path="viewServers" element={<ViewServers />} />
                          <Route
                            path="serverDetail/:Server_id"
                            element={<ServerDetail />}
                          />
                          <Route
                            path="updateServer/:id"
                            element={<UpdateServer />}
                          />
                          <Route
                            path="viewServerDetail/:id"
                            element={<ViewServerDetail />}
                          />
                          {/* if allow config, packages */}
                          <Route
                            path="configrationAlert"
                            element={<ConfigrationAlerts />}
                          />
                          <Route path="profile" element={<Profile />} />
                          <Route
                            path="updateProfile"
                            element={<UpdateProfile />}
                          />
                          <Route path="*" element={<PageNotFound />} />
                        </Routes>
                      </ProtectedRoute>
                    }
                  />
                ) : UserRole === "monitor" ? (
                  <Route
                    path="user/*" // Home Component Route
                    element={
                      <ProtectedRoute allowedRoles={["monitor"]}>
                        <Routes>
                          <Route index element={<Home />} />
                          <Route
                            path="serverDetail/:Server_id"
                            element={<ServerDetail />}
                          />
                          <Route path="profile" element={<Profile />} />
                          <Route
                            path="updateProfile"
                            element={<UpdateProfile />}
                          />
                          <Route path="*" element={<PageNotFound />} />
                        </Routes>
                      </ProtectedRoute>
                    }
                  />
                ) : (
                  ""
                )}
              </Routes>
            ) : (
              <h3 style={{ textAlign: "center", color: "#1976D2" }}>
                Loading...
              </h3>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
