import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  ListItemIcon,
  Radio,
  RadioGroup,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PayPalButton from "../components/PayPalButton";
import Swal from "sweetalert2";
import { BASE_URL } from "../components/constant/constant";

const StyledTypography = styled(Typography)({
  color: "#595959",
  display: "flex",
  alignItems: "center",
});

const Packages = () => {
  const navigate = useNavigate();
  const [packageDetail, setPackageDetail] = useState();
  const [selectPackage, setSelectPackage] = useState("monthly");
  const [loading, setLoading] = useState(false);

  // filter the package on the basis of monthly & yearly
  // console.log("packageDetail", packageDetail);
  const filterPackage = packageDetail?.filter((item) => {
    return item.Type_Of_Package == selectPackage;
  });
  const Packages = filterPackage?.sort((a, b) => a.Price - b.Price);
  // console.log("sort", Packages);

  const getPackageDetail = async () => {
    // API TO GET ALL PACKAGES DETAIL
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    const resp = await axios.post(
      `${BASE_URL}/getallpackagesforusr`,
      null,
      config
    );

    const result = resp?.data?.All_Packages;
    setPackageDetail(result);
    // console.log("result", result);
  };
  useEffect(() => {
    getPackageDetail();
  }, []);

  const handleNavigate = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    const response = await axios.post(
      `${BASE_URL}/navigatetodashboard`,
      null,
      config
    );
    if (response?.data?.success) {
      setLoading(false);
      navigate(`/${response?.data?.URL}`);
    } else if (response?.data?.token_error) {
      Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      setLoading(false);
      Swal.fire("ERROR!", response?.data?.messege, "error");
    }
  };
  return (
    <Box sx={{ height: "100%", bgcolor: "#F5F5F5", paddingY: 5 }}>
      <Box display="flex" justifyContent="end" marginRight={2}>
        <ListItemIcon
          onClick={handleNavigate}
          sx={{ cursor: "pointer" }}
          disabled={loading}
        >
          Navigate to dashboard
        </ListItemIcon>
      </Box>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: 28,
          fontWeight: "500",
          marginBottom: 2,
          letterSpacing: -1,
        }}
      >
        Select Your Favourite Package.
      </Typography>
      <Box
        sx={{
          marginTop: 3,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <FormControl
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
          fullWidth
        >
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            sx={{ fontSize: 22, fontWeight: "400" }}
          >
            Package Type:
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="packageType"
            value={selectPackage ? selectPackage : "Loading..."}
            onChange={(e) => setSelectPackage(e.target.value)}
            style={{ display: "flex", flexDirection: "row", marginLeft: 3 }}
          >
            <FormControlLabel
              value="monthly"
              control={<Radio />}
              label="Monthly"
            />
            <FormControlLabel
              value="yearly"
              control={<Radio />}
              label="Yearly"
            />
          </RadioGroup>
        </FormControl>
        {Packages?.length > 0
          ? Packages?.map((pkg, i) => {
              // console.log("level", pkg);
              return (
                <Box
                  key={i}
                  sx={{
                    width: 260,
                    boxShadow: 3,
                    borderRadius: 5,
                    bgcolor: "#FFFFFF",
                    paddingX: 3,
                    paddingY: 4,
                    "&:hover": {
                      // cursor: "pointer",
                      boxShadow: "1px 2px 20px 4px rgba(115,101,101,0.75)",
                    },
                  }}
                >
                  <Typography
                    sx={{ textAlign: "left", fontSize: 24, fontWeight: "500" }}
                  >
                    {pkg.Package}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginY: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "left",
                        fontSize: "xx-large",
                        fontWeight: "600",
                      }}
                    >
                      ${pkg.Price ? pkg.Price : "0"}
                      <sub
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: "black",
                        }}
                      >
                        /{pkg.Type_Of_Package === "monthly" ? "month" : "year"}
                      </sub>
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ textAlign: "left", fontSize: 18, fontWeight: "500" }}
                  >
                    Package Details.
                  </Typography>
                  <Box marginLeft={2} flex={1} sx={{ height: 300 }}>
                    <StyledTypography
                      sx={{ fontSize: 17, fontWeight: 400, mt: 1 }}
                      gutterBottom
                    >
                      <DoneIcon sx={{ mr: 1 }} />
                      {pkg.Description}.
                    </StyledTypography>
                    <StyledTypography
                      sx={{ fontSize: 17, fontWeight: 400, mt: 1 }}
                      gutterBottom
                    >
                      <DoneIcon sx={{ mr: 1 }} />
                      This is {pkg.Plan_Type} package.
                    </StyledTypography>
                    <StyledTypography
                      sx={{ fontSize: 17, fontWeight: 400, mt: 1 }}
                      gutterBottom
                    >
                      <DoneIcon sx={{ mr: 1 }} />
                      This package is for {pkg.Type_Of_Package} usage.
                    </StyledTypography>
                    <StyledTypography
                      sx={{ fontSize: 17, fontWeight: 400, mt: 1 }}
                      gutterBottom
                    >
                      <DoneIcon sx={{ mr: 1 }} />
                      There are {pkg.No_of_devop_users} Dev_Op users.
                    </StyledTypography>
                    <StyledTypography
                      sx={{ fontSize: 17, fontWeight: 400, mt: 1 }}
                      gutterBottom
                    >
                      <DoneIcon sx={{ mr: 1 }} />
                      There are {pkg.No_of_monitor_users} monitor users.
                    </StyledTypography>
                    <StyledTypography
                      sx={{ fontSize: 17, fontWeight: 400, mt: 1 }}
                      gutterBottom
                    >
                      <DoneIcon sx={{ mr: 1 }} />
                      There are {pkg.Number_Of_Server} servers.
                    </StyledTypography>
                  </Box>
                  {/* <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: 24,
                      fontWeight: "600",
                      color: "#009CDE",
                    }}
                  >
                    {pkg.Plan_Type}
                  </Typography> */}
                  {/* PayPal Button */}
                  <Box marginTop={4}>
                    {pkg.Price ? (
                      <PayPalButton
                        planId={pkg?.Plan_id}
                        Package={pkg?.Package}
                        level={pkg?.PakLevel}
                      />
                    ) : (
                      <Button
                        fullWidth
                        onClick={async () => {
                          setLoading(true);
                          const accesstoken =
                            localStorage.getItem("access_token");
                          const config = {
                            headers: {
                              Authorization: `Bearer ${accesstoken}`,
                            },
                          };
                          const formData = new FormData();
                          formData.append("packname", pkg.Package);
                          const resp = await axios.post(
                            `${BASE_URL}/checkpackage`,
                            formData,
                            config
                          );
                          console.log("respD", resp);
                          if (resp?.data?.success) {
                            const trilObj = {
                              package: pkg.Package,
                              dataobj: null,
                            };
                            const respo = await axios.post(
                              `${BASE_URL}/selectpackage`,
                              trilObj,
                              config
                            );

                            if (respo?.data?.success) {
                              setLoading(false);
                              Swal.fire({
                                icon: "success",
                                text: respo?.data?.message,
                                confirmButtonText: "OK",
                              }).then((result) => {
                                navigate("/dashboard/user/server");
                              });
                            } else {
                              setLoading(false);
                              Swal.fire({
                                icon: "error",
                                title: "ERROR!",
                                text: respo?.data?.messege,
                                confirmButtonText: "OK",
                              });
                            }
                          } else if (resp?.data?.token_error) {
                            Swal.fire(
                              "ERROR!",
                              resp?.data?.message,
                              "error"
                            ).then((result) => {
                              if (result.isConfirmed) {
                                navigate("/login");
                              }
                            });
                          } else {
                            setLoading(false);
                            Swal.fire({
                              icon: "error",
                              title: "ERROR!",
                              text: resp?.data?.messege,
                              confirmButtonText: "OK",
                            });
                          }
                        }}
                        size="small"
                        variant="contained"
                        disabled={loading}
                        style={{
                          height: 48,
                          background: "#2C2E2F",
                          borderRadius: 5,
                          marginBottom: 15,
                          fontSize: 16,
                          fontWeight: "500",
                          textTransform: "none",
                        }}
                      >
                        {loading ? (
                          <Typography sx={{ color: "white" }}>
                            loading...
                          </Typography>
                        ) : (
                          <Typography sx={{ color: "white" }}>
                            Get Started Free
                          </Typography>
                        )}
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })
          : `No any ${selectPackage} package is availabe.`}
      </Box>
    </Box>
  );
};

export default Packages;
