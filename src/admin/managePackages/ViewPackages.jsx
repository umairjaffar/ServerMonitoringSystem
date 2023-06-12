import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../components/constant/constant";

const ViewPackages = () => {
  const navigate = useNavigate();
  const [packagesList, setPackagesList] = useState([]);
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

  const getPackagesList = async () => {
    const accesstoken = localStorage.getItem("access_token");
    // console.log("TOKEN", accesstoken);
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    try {
      setLoading(true);
      const resp = await axios.post(
        `${BASE_URL}/getallpackagesforadmin`,
        null,
        config
      );
      // console.log("packagesListResp", resp.data.All_Packages);
      if (resp.data.success) {
        setLoading(false);
        const result = resp?.data?.All_Packages;
        setPackagesList(result);
      }
    } catch (error) {
      console.log("GetPacForAdminError", error);
    }
  };
  useEffect(() => {
    getPackagesList();
  }, []);
  // console.log("List", packagesList);
  const columns = [
    {
      field: "Package",
      headerName: "Package Type",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Type_Of_Package",
      headerName: "Duration",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Price",
      headerName: "Price",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      // valueGetter:(params) => console.log("param", params)
    },
    {
      field: "isactive",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
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
            <MenuItem onClick={() => handlePackageDetail(ID)}>
              <ListItemIcon>
                <RemoveRedEyeIcon style={{ color: "green" }} />
              </ListItemIcon>
              Package Detail
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleUpdatePackage(ID)}>
              <ListItemIcon>
                <EditIcon style={{ color: "blue" }} />
              </ListItemIcon>
              <ListItemText primary="Update Package" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handlePackagePlane(ID)}>
              <ListItemText
                sx={{
                  textAlign: "center",
                  color:
                    ID?.row?.isactive.toLowerCase() === "active"
                      ? "#D8000C"
                      : "#4F8A10",
                }}
                primary={
                  ID?.row?.isactive.toLowerCase() === "active"
                    ? "TURN OFF PLAN"
                    : "TURN ON PLAN"
                }
              />
            </MenuItem>
          </Menu>
        </Box>
      ),
    },
  ];

  const handlePackageDetail = (ID) => {
    navigate(`/dashboard/admin/packageDetail/${ID.row?.PackageId}`);
    handleClose();
  };
  const handleUpdatePackage = (ID) => {
    console.log("ViewID", ID);
    navigate(`/dashboard/admin/updatePackage/${ID.row.Package}`);
    handleClose();
  };

  const handlePackagePlane = (ID) => {
    console.log("SID", ID);
    const accesstoken = localStorage.getItem("access_token");
    console.log("TOKEN", accesstoken);
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "Content-Type": "application/json",
      },
    };
    Swal.fire({
      title: "Are you sure?",
      text:
        ID?.row?.isactive.toLowerCase() === "active"
          ? "You want to deactivate the plan?"
          : "You want to activate the plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Change Plan!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const response = await axios.post(
          `${BASE_URL}/activateplan`,
          JSON.stringify({
            packname: ID?.row?.Package,
            typeofpack: ID?.row?.Type_Of_Package,
            isactive:
              ID?.row?.isactive.toLowerCase() === "active" ? false : true,
          }),
          config
        );
        console.log("PlanResp", response);
        if (response?.data?.success) {
          Swal.fire(
            response?.data?.alertmsg,
            response?.data?.messege,
            "success"
          ).then((result) => {
            getPackagesList();
            if (result.isConfirmed) {
              navigate("/dashboard/admin");
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
          Swal.fire(response?.data?.alertmsg, response?.data?.messege, "error");
        }
      },
    });
  };

  return (
    <Box sx={{ height: "85vh" }}>
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: 3 }}>
        <Button
          onClick={() => navigate("/dashboard/admin/createPackage")}
          variant="contained"
          style={{ minWidth: 130 }}
        >
          Add Package
        </Button>
      </Box>
      {!loading ? (
        <Box
          sx={{
            marginTop: 3,
            height: 480,
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
            rows={packagesList}
            getRowId={(row) => row?.PackageId}
            columns={columns}
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

export default ViewPackages;
