import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BASE_URL } from "../../components/constant/constant";

const UnvarifiedUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
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

  const getUsers = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/getallverifiedandunverifiedusrs`,
        null,
        config
      );
      console.log("getUsersResp", response?.data);
      if (response.data.success) {
        setLoading(false);
        setUsers(response?.data?.Unverified_User || []);
      } else if (response?.data?.token_error) {
        Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        Swal.fire("ERROR!", response?.data?.message, "error");
      }
    } catch (error) {
      console.log("prodOwnerGetUsers,ERROR", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      field: "unverified",
      headerName: "Varify",
      width: 150,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const handleChange = (event) => {
          const updatedData = users.map((row) => {
            console.log("ROW", row);
            if (row.Userid === params.row.Userid) {
              return { ...row, unverified: event.target.checked };
            }
            return row;
          });
          console.log("dataCheckbox", updatedData);
          setUsers(updatedData);
        };

        return (
          <Checkbox
            checked={params.value}
            color="primary"
            onChange={handleChange}
            inputProps={{ "aria-label": "checkbox" }}
          />
        );
      },
    },
    {
      field: "Username",
      headerName: "User Name",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Email",
      headerName: "User Email",
      minWidth: 250,
      flex: 1.8,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Role",
      headerName: "User Role",
      minWidth: 130,
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
        <>
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
            <MenuItem onClick={() => handleUserDetail(ID)}>
              <ListItemIcon>
                <RemoveRedEyeIcon style={{ color: "green" }} />
              </ListItemIcon>
              User Detail
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleUpdateUser(ID)}>
              <ListItemIcon>
                <EditIcon style={{ color: "blue" }} />
              </ListItemIcon>
              <ListItemText primary="Update User" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleDeleteUser(ID)}>
              <ListItemIcon>
                <DeleteIcon style={{ color: "red" }} />
              </ListItemIcon>
              Delete User
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];
  const handleUserDetail = (ID) => {
    // console.log("detailID", ID);
    navigate(`/dashboard/user/viewUserDetail/${ID.id}`);
    handleClose();
  };
  const handleUpdateUser = (ID) => {
    // console.log("updateID", ID);
    navigate(`/dashboard/user/updateUserDetail/${ID.id}`);
    handleClose();
  };
  const handleDeleteUser = (ID) => {
    console.log("DelID", ID);
    const accesstoken = localStorage.getItem("access_token");
    // console.log("TOKEN", accesstoken);
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    const formData = new FormData();
    formData.append("email", ID.row.Email);
    formData.append("typeofusr", ID.row.Role);

    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete the user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes delete it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const response = await axios.post(
          `${BASE_URL}/deleteusrrelprodowner`,
          formData,
          config
        );
        console.log("UserDeleteResp", response);
        if (response?.data?.success) {
          Swal.fire("SUCCESS!", response?.data?.messege, "success").then(
            (result) => {
              getUsers();
              if (result.isConfirmed) {
                navigate("/dashboard/user/manageUsers");
              }
            }
          );
        } else if (response?.data?.token_error) {
          Swal.fire("ERROR!", response?.data?.message, "error").then(
            (result) => {
              if (result.isConfirmed) {
                navigate("/login");
              }
            }
          );
        } else {
          Swal.fire("ERROR!", response?.data?.messege, "error");
        }
      },
    });
    handleClose();
  };

  const handleUpdate = () => {
    console.log("Update", users);
    const filteredEmail = [];
    users.filter((item) =>
      item.unverified ? filteredEmail.push(item.Email) : null
    );

    const emailsObj = {
      lstusrveriflink: filteredEmail,
    };
    console.log("Filter", emailsObj);

    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You want to resend link on emails!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Send link!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await axios
          .post(`${BASE_URL}/resendvarificationemail`, emailsObj, config)
          .then((response) => {
            console.log("response", response);
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        getUsers();
        Swal.fire("Send!", "Link send Successfully.", "success");
      }
    });
  };
  return (
    <Box sx={{ height: "85vh" }}>
      {!loading ? (
        <>
          <Box
            sx={{
              height: 450,
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
            {users.length > 0 ? (
              <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row?.Userid}
                checkboxSelection={false}
                disableSelectionOnClick
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 20, 30]}
              />
            ) : (
              <h3 style={{ textAlign: "center", color: "#1976D2" }}>
                No User added yet!
              </h3>
            )}
          </Box>
          <Box
            width="100%"
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: { xs: "center", sm: "left" },
            }}
          >
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                width: { xs: "90%", sm: 250, md: 300 },
                textTransform: "none",
                fontSize: 17,
                fontWeight: "500",
              }}
            >
              Set Email Alerts
            </Button>
          </Box>
        </>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}

      <br style={{ marginBottom: 10 }} />
    </Box>
  );
};

export default UnvarifiedUsers;
