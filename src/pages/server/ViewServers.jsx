import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TableCell,
  Typography,
  styled,
  tableCellClasses,
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

const StyledTableCell = styled(TableCell)(() => ({
  textAlign: "center",
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 700,
  },
}));

const ViewServers = () => {
  const navigate = useNavigate();
  const [servers, setServers] = useState([]);
  const [ID, setID] = useState();
  const [loading, setLoading] = useState(false);
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

  const getServers = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    const response = await axios.post(
      `${BASE_URL}/usrserverdata`,
      null,
      config
    );
    const result = response?.data?.User_Servers_Data;
    // console.log("result", result);
    if (response?.data?.success) {
      setLoading(false);
      setServers(result ? result : []);
    } else if (response?.data?.token_error) {
      Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };
  useEffect(() => {
    getServers();
  }, []);

  const columns = [
    {
      field: "Server_Name",
      headerName: "Name",
      minWidth: 140,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Lst_services",
      headerName: "Total Services",
      minWidth: 140,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueGetter: (params) => {
        return params.row.Lst_Services?.length;
      },
    },
    {
      field: "Lst_containers",
      headerName: "Total Containers",
      minWidth: 140,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      valueGetter: (params) => {
        // console.log("Params", params);
        // console.log("Totalcontainer", params.row.Lst_Containers?.length);
        return params.row.Lst_Containers?.length;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => (
        <StyledTableCell>
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
            <MenuItem onClick={() => handleServerDetail(ID)}>
              <ListItemIcon>
                <RemoveRedEyeIcon style={{ color: "green" }} />
              </ListItemIcon>
              Server Detail
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleUpdateServer(ID)}>
              <ListItemIcon>
                <EditIcon style={{ color: "blue" }} />
              </ListItemIcon>
              <ListItemText primary="Update Server" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleDeleteServer(ID)}>
              <ListItemIcon>
                <DeleteIcon style={{ color: "red" }} />
              </ListItemIcon>
              Delete Server
            </MenuItem>
          </Menu>
        </StyledTableCell>
      ),
    },
  ];

  const handleServerDetail = (ID) => {
    navigate(`/dashboard/user/viewServerDetail/${ID.id}`);
    handleClose();
  };
  const handleUpdateServer = (ID) => {
    console.log("ID", ID);
    navigate(`/dashboard/user/updateServer/${ID.row.Server_id}`);
    handleClose();
  };
  const handleDeleteServer = (ID) => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    const formData = new FormData();
    formData.append("ip", ID.row.Server_IP);
    // console.log("DeleteSERVER", ID.row.Server_IP);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return await axios
          .post(`${BASE_URL}/deleteserver`, formData, config)
          .then((response) => {
            console.log("response", response);
            if (response?.data?.success) {
              getServers();
              Swal.fire("Deleted!", "Server has been deleted.", "success").then(
                (result) => {
                  if (result.isConfirmed) {
                    navigate("/dashboard/user/viewServers");
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
            }
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
    });
  };

  return (
    <Box sx={{ paddingTop: 5, position: "relative" }}>
      {!loading ? (
        <>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: "600",
              marginBottom: "1px",
              color: "#1576D2",
            }}
          >
            Servers Detail:
          </Typography>
          {servers.length > 0 ? (
            <Box
              sx={{
                height: 450,
                width: "100%",
                "& .super-app-theme--header": {
                  fontWeight: "700",
                  fontSize: 20,
                  backgroundColor: "#1976D2",
                  color: "#ffffff",
                },
                "& .super-app-theme--cell": {
                  fontSize: 18,
                },
              }}
            >
              <DataGrid
                rows={servers || []}
                getRowId={(row) => row?.Server_id}
                columns={columns}
                rowHeight={60}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 20, 30]}
              />
            </Box>
          ) : (
            <Typography
              textAlign="center"
              fontSize={18}
              fontWeight="500"
              color="gray"
            >
              No any Server, please add the servers.
            </Typography>
          )}
        </>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default ViewServers;
