import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  styled,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useParams } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";
import { BASE_URL } from "../../components/constant/constant";
import Swal from "sweetalert2";

const TypoText = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: "500",
  color: "#4687CA",
}));
const Icon = styled(DoneIcon)(() => ({
  backgroundColor: "#E0E0D8",
  borderRadius: 10,
  fontSize: 22,
  marginRight: 5,
}));

const PackageDetail = () => {
  const { id } = useParams();
  console.log("ID", id);
  const navigate = useNavigate();
  const [packagesList, setPackagesList] = useState([]);

  const getPackagesList = async () => {
    const accesstoken = localStorage.getItem("access_token");
    console.log("TOKEN", accesstoken);
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    try {
      const resp = await axios.post(
        `${BASE_URL}/getallpackagesforadmin`,
        null,
        config
      );
      // console.log("packagesListResp", resp.data.All_Packages);
      if (resp.data.success) {
        const result = resp?.data?.All_Packages;
        setPackagesList(result);
      } else if (resp?.data?.token_error) {
        Swal.fire("ERROR!", resp?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
    } catch (error) {
      console.log("GetPackages ERROR", error);
    }
  };
  useEffect(() => {
    getPackagesList();
  }, [id]);

  const findedPackage = packagesList.find((item) => id === item.PackageId);

  return (
    <Box
      sx={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box width="100%">
        <KeyboardBackspaceIcon
          sx={{ fontSize: 44, marginY: 1, cursor: "pointer" }}
          onClick={() => navigate("/dashboard/admin")}
        />
      </Box>
      {/* Add Package Detail */}
      {findedPackage ? (
        <Grid
          container
          sx={{
            marginTop: 1,
            marginBottom: 5,
            boxShadow: 2,
            borderRadius: 3,
            paddingY: 3,
            justifyContent: "space-evenly",
            gap: 2,
          }}
        >
          <Grid item xs={11}>
            <Typography
              sx={{
                marginBottom: 1,
                fontSize: 26,
                fontWeight: "600",
                color: "#4687CA",
              }}
            >
              <span style={{ fontStyle: "italic" }}>Package Detail</span>
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Package Type :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {findedPackage?.Package}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Package Plan :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {findedPackage?.Plan_Type}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Duration :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {findedPackage?.Type_Of_Package}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>
              Price :{" "}
              <span
                style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
              >
                {findedPackage?.Price}
              </span>
            </TypoText>
          </Grid>
          <Grid item xs={10}>
            <TypoText>Package Features </TypoText>
            <List sx={{ marginLeft: 3 }}>
              <ListItem>
                <Icon />
                <Typography>{findedPackage?.Description}</Typography>
              </ListItem>
              <ListItem>
                <Icon />
                <Typography>
                  This package utilizes only {findedPackage?.Number_Of_Server}{" "}
                  servers.
                </Typography>
              </ListItem>
              <ListItem>
                <Icon />
                <Typography>
                  With this package, you can only add{" "}
                  {findedPackage?.No_of_devop_users} Devop's users.
                </Typography>
              </ListItem>
              <ListItem>
                <Icon />
                <Typography>
                  With this package, you can only add{" "}
                  {findedPackage?.No_of_monitor_users} Monitor users.
                </Typography>
              </ListItem>
            </List>
          </Grid>
        </Grid>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default PackageDetail;
