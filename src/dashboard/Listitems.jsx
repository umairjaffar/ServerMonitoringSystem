import React, { useEffect, useLayoutEffect, useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Collapse, List, Typography } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import { GoServer, GoPackage } from "react-icons/go";
import axios from "axios";
// import { ImUsers } from "react-icons/im";
import { BsLifePreserver } from "react-icons/bs";
import { FaUsersCog } from "react-icons/fa";
import { VscServer } from "react-icons/vsc";
import { MdEmail } from "react-icons/md";
import { BASE_URL } from "../components/constant/constant";
import Swal from "sweetalert2";

const Listitems = ({ openServer, setOpenServer }) => {
  const navigate = useNavigate();
  const [servers, setServers] = useState();

  const [UserRole, setUserRole] = useState();
  const [dashboardList, setDashboardList] = useState([]);

  const handleServerClick = () => {
    setOpenServer(!openServer);
  };

  const getServers = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/usrserverdata`,
        null,
        config
      );
      if (response?.data?.success) {
        setServers(response?.data);
      } else if (response?.data?.token_error) {
        Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
      
    } catch (error) {
      console.log("Get Server ERROR", error);
    }
    // console.log("serverList", response?.data);
  };
  useEffect(() => {
    getServers();
    const userRole = localStorage.getItem("UserRole");
    setUserRole(userRole);
  }, []);

  const handleUsers = () => {
    if (
      localStorage.getItem("UserRole") === "admin" ||
      localStorage.getItem("UserRole") === "superadmin"
    ) {
      const layoutItems = [
        {
          path: "/dashboard/admin",
          name: "Manage Package",
          icon: <GoPackage style={{ width: 23, height: 23 }} />,
        },
        {
          path: "/dashboard/admin/viewUsers",
          name: "Manage Users",
          icon: <FaUsersCog style={{ width: 23, height: 23 }} />,
        },
      ];
      setDashboardList(layoutItems);
    } else if (localStorage.getItem("UserRole") === "prodowner") {
      const layoutItems = [
        {
          path: "/dashboard/user/viewServers",
          name: "Manage Servers",
          icon: <BsLifePreserver style={{ width: 23, height: 23 }} />,
        },
        {
          path: "/dashboard/user/manageUsers",
          name: "Manage Users",
          icon: <FaUsersCog style={{ width: 23, height: 23 }} />,
        },
        {
          path: "/dashboard/user/configrationAlert",
          name: "Email Configration",
          icon: <MdEmail style={{ width: 23, height: 23 }} />,
        },
        {
          path: "/packages",
          name: "Manage Pricing",
          icon: <VscServer style={{ width: 23, height: 23 }} />,
        },
      ];
      setDashboardList(layoutItems);
    } else if (localStorage.getItem("UserRole") === "devop") {
      const allowAlert = localStorage.getItem("alert");
      const allowpackages = localStorage.getItem("package");

      const layoutItems = [
        {
          path: "/dashboard/user/viewServers",
          name: "Manage Servers",
          icon: <BsLifePreserver style={{ width: 23, height: 23 }} />,
        },
        allowAlert === "true" && {
          path: "/dashboard/user/configrationAlert",
          name: "Email Configuration",
          icon: <MdEmail style={{ width: 23, height: 23 }} />,
        },
        allowpackages === "true" && {
          path: "/packages",
          name: "Manage Pricing",
          icon: <VscServer style={{ width: 23, height: 23 }} />,
        },
      ].filter(Boolean);

      // console.log("LayItem", layoutItems);
      setDashboardList(layoutItems);
    }
  };

  useLayoutEffect(() => {
    handleUsers();
  }, []);

  // console.log("Servers", servers);
  return (
    <React.Fragment>
      {/*  */}
      {UserRole === "admin" || UserRole === "superadmin" ? (
        ""
      ) : (
        <ListItemButton onClick={handleServerClick} sx={{ paddingBottom: 0 }}>
          <ListItemIcon sx={{ minWidth: 30 }}>
            <GoServer style={{ width: 23, height: 23 }} />
          </ListItemIcon>
          <ListItemText
            // sx={{ maxWidth: 100 }}
            primary={
              <Typography sx={{ fontSize: 20, marginLeft: 1 }}>
                Servers Analytics
              </Typography>
            }
          />
          {openServer ? (
            <ExpandLess style={{ width: 23, height: 23 }} />
          ) : (
            <ExpandMore style={{ width: 23, height: 23 }} />
          )}
        </ListItemButton>
      )}
      <Collapse in={openServer} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {servers?.User_Servers_Data?.map((ser, indx) => {
            // console.log("SERVER", ser);
            return (
              <Link
                key={indx}
                to={`user/serverDetail/${ser.Server_id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemButton
                  sx={{
                    paddingY: 0,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: 20, marginLeft: 7 }}>
                        {ser.Server_Name}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            );
          })}
        </List>
      </Collapse>
      {dashboardList
        ? dashboardList.map((value, index) => {
            // console.log("DashList", dashboardList);
            return (
              <ListItemButton
                key={index}
                sx={{ paddingBottom: 0 }}
                onClick={() => {
                  navigate(value.path);
                  setOpenServer(false);
                }}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>{value.icon}</ListItemIcon>
                <ListItemText
                  sx={{ maxWidth: 100 }}
                  primary={
                    <Typography sx={{ fontSize: 20, marginLeft: 1 }}>
                      {value.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })
        : ""}

      {/* 
      <ListItemButton
        sx={{ paddingBottom: 0 }}
        onClick={() => navigate("/dashboard/user/viewServers")}
      >
        <ListItemIcon sx={{ minWidth: 30 }}>
          <GoServer style={{ width: 23, height: 23 }} />
        </ListItemIcon>
        <ListItemText
          sx={{ maxWidth: 100 }}
          primary={
            <Typography sx={{ fontSize: 20, marginLeft: 1 }}>
              Manage Servers
            </Typography>
          }
        />
      </ListItemButton>
     
      <ListItemButton
        sx={{ paddingBottom: 0 }}
        onClick={() => navigate("/dashboard/admin/viewPackages")}
      >
       
        <ListItemIcon sx={{ minWidth: 30 }}>
          <GoServer style={{ width: 23, height: 23 }} />
        </ListItemIcon>
        <ListItemText
          sx={{ maxWidth: 100 }}
          primary={
            <Typography sx={{ fontSize: 20, marginLeft: 1 }}>
              Manage Packages
            </Typography>
          }
        />
      </ListItemButton>
      <ListItemButton
        sx={{ paddingBottom: 0 }}
        onClick={() => navigate("/dashboard/admin/viewUsers")}
      >
        
        <ListItemIcon sx={{ minWidth: 30 }}>
          <GoServer style={{ width: 23, height: 23 }} />
        </ListItemIcon>
        <ListItemText
          sx={{ maxWidth: 100 }}
          primary={
            <Typography sx={{ fontSize: 20, marginLeft: 1 }}>
              Manage Users
            </Typography>
          }
        />
      </ListItemButton>
      
      */}
    </React.Fragment>
  );
};

export default Listitems;
