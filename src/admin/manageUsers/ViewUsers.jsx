import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../components/constant/constant";
import Swal from "sweetalert2";

const ViewUsers = () => {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ID, setID] = useState();
  // Navbar profile Icon handler...
  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchorEl = Boolean(anchorEl);
  const handleClick = (event, params) => {
    setID(params);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUsersList = async () => {
    const accesstoken = localStorage.getItem("access_token");
    console.log("TOKEN", accesstoken);
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    try {
      setLoading(true);
      const resp = await axios.post(
        `${BASE_URL}/getallusersadmin`,
        null,
        config
      );
      if (resp.data.success) {
        setLoading(false);
        const result = resp?.data?.Users;
        setUsersList(result || []);
      } else if (resp?.data?.token_error) {
        Swal.fire("ERROR!", resp?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
    } catch (error) {
      console.log("getallusersadmin ERROR", error);
    }
  };
  useEffect(() => {
    getUsersList();
  }, []);
  // console.log("USERS", usersList);

  const columns = [
    {
      field: "Username",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Role",
      headerName: "Role",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Email",
      headerName: "Email",
      minWidth: 300,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Package",
      headerName: "Package",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Issuspended",
      headerName: "Suspend",
      minWidth: 100,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <Box>
          <IconButton onClick={(e) => handleClick(e, params)}>
            <MoreVertIcon />
          </IconButton>
          {/* Menus */}
          <Menu
            anchorEl={anchorEl}
            open={openAnchorEl}
            onClose={handleClose}
            onClick={handleClose}
            // className={classes.sweetAlertContainer}
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
            anchorOrigin={{ horizontal: "right", vertical: "center" }}
          >
            {/* <MenuItem onClick={() => handleUserDetail(ID)}>
              <ListItemIcon>
                <RemoveRedEyeIcon style={{ color: "green" }} />
              </ListItemIcon>
              User Detail
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={() => handleUpdateUser(ID)}>
              <ListItemIcon>
                <EditIcon style={{ color: "blue" }} />
              </ListItemIcon>
              <ListItemText primary="Update User" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleUserSuspension(ID)}>
              <ListItemText
                sx={{
                  textAlign: "center",
                  color: ID?.row?.Issuspended ? "#4F8A10" : "#D8000C",
                }}
                primary={
                  ID?.row?.Issuspended ? "UnSuspend User" : "Suspend User"
                }
              />
            </MenuItem>
            <Divider />
          </Menu>
        </Box>
      ),
    },
  ];

  // const handleUserDetail = (ID) => {};
  const handleUpdateUser = (ID) => {
    navigate(`/dashboard/admin/updateUser/${ID.row.UserId}`);
    handleClose();
  };
  const handleUserSuspension = (ID) => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "Content-Type": "application/json",
      },
    };
    Swal.fire({
      title: "Are you sure?",
      text: ID?.row?.Issuspended
        ? "Are you sure you want to unsuspend the user?"
        : "Are you sure you want to suspend the user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "yes, Change it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.post(
            `${BASE_URL}/suspenduser/${ID?.row?.Email}`,
            JSON.stringify({
              issuspended: ID?.row?.Issuspended ? false : true,
            }),
            config
          );
          if (response?.data?.success) {
            getUsersList();
            Swal.fire(
              response?.data?.alertmsg,
              response?.data?.messege,
              "success"
            ).then((result) => {
              if (result.isConfirmed) {
                navigate("/dashboard/admin/viewUsers");
              }
            });
          } else if (response?.data?.token_error) {
            Swal.fire("ERROR!", response?.data?.message, "error").then(
              (result) => {
                if (result.isConfirmed) {
                  navigate("/login");
                }
              }
            );
          } else {
            Swal.fire(
              response?.data?.alertmsg,
              response?.data?.messege,
              "error"
            );
          }
        } catch (error) {
          console.log("suspenduser ERROR", error);
        }
      },
    });
  };

  return (
    <Box sx={{ height: "87vh" }}>
      {!loading ? (
        <Box
          sx={{
            marginTop: 2,
            height: 500,
            width: "100%",
            "& .super-app-theme--header": {
              fontWeight: "700",
              fontSize: 20,
              borderRight: 1,
              backgroundColor: "#1976D2",
              color: "#ffffff",
            },
            "& .super-app-theme--cell": {
              fontSize: 16,
              borderRight: 1,
            },
          }}
        >
          <DataGrid
            rows={usersList}
            columns={columns}
            getRowId={(row) => row?.UserId}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 20, 30]}
          />
        </Box>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
      <br style={{ marginBottom: 10 }} />
    </Box>
  );
};

export default ViewUsers;
