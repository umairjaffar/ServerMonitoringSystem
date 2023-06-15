import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../components/constant/constant";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const UpdatePackage = () => {
  const { name } = useParams();
  // console.log("name", name);
  const navigate = useNavigate();
  const initialValues = {
    isactivate: "",
    Package_Name: "",
    type_of_package: "",
    accounttype: "",
    price: "",
    no_of_server: null,
    no_of_deveopusrs: null,
    no_of_monitorusrs: null,
    description: "",
    Setupfee: "",
    autoBilling: false,
    istrial: false,
    payFailerThres: null,
    taxpercentage: "",
  };
  const [updatePackage, setUpdatePackage] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getPackage = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    try {
      const resp = await axios.post(
        `${BASE_URL}/getpackagebyname/${name}`,
        null,
        config
      );
      // const result = resp?.data?.All_Packages;
      // console.log("packagesListResp", resp?.data);
      if (resp?.data?.success) {
        setLoading(false);
        setUpdatePackage(resp?.data?.Package);
      } else if (resp?.data?.token_error) {
        Swal.fire("ERROR!", resp?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
    } catch (error) {
      console.log("GetPacByNameError", error);
    }
  };
  useEffect(() => {
    getPackage();
  }, []);

  // console.log("updateData", updatePackage);

  const handleChange = (e) => {
    setUpdatePackage({
      ...updatePackage,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeNumber = (e) => {
    setUpdatePackage({
      ...updatePackage,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  console.log("errors", errors);
  const validate = (values) => {
    const errors = {};
    const numRegex = /^(\d+|\d+\.\d+)$/;
    const stringRegex = /^[a-zA-Z\s]+$/;
    if (!values.Package_Name) {
      errors.Package_Name = "Package name must be required!";
    } else if (!stringRegex.test(values.Package_Name)) {
      errors.Package_Name = "Package name accept only alphabets!";
    }

    if (values.price) {
      if (values.price <= 0) {
        errors.price = "Package price must be greater than 0!";
      } else if (values.price > 100000) {
        errors.price = "Package price must be less than 100000!";
      } else if (!numRegex.test(values.price)) {
        errors.price = "Package price accept only numbers!";
      }
    }

    if (!values.description) {
      errors.description = "Package description must be required!";
    } else if (values.description.length <= 0) {
      errors.description = "Package description must be greater than 0!";
    } else if (values.description.length > 2000) {
      errors.description = "Package description must be less than 2000!";
    }

    if (values.no_of_server) {
      if (values.no_of_server <= 0) {
        errors.no_of_server = "Number of servers must be greater than 0!";
      } else if (values.no_of_server > 100) {
        errors.no_of_server = "Number of servers must be less than 100!";
      } else if (!numRegex.test(values.no_of_server)) {
        errors.no_of_server = "Number of servers accept only numbers!";
      }
    }
    if (values.no_of_deveopusrs) {
      if (values.no_of_deveopusrs <= 0) {
        errors.no_of_deveopusrs = "Number of devopUsers must be greater than 0!";
      } else if (values.no_of_deveopusrs > 100) {
        errors.no_of_deveopusrs = "Number of devopUsers must be less than 100!";
      } else if (!numRegex.test(values.no_of_deveopusrs)) {
        errors.no_of_deveopusrs = "Number of devops accept only numbers!";
      }
    }
    if (values.no_of_monitorusrs) {
      if (values.no_of_monitorusrs <= 0) {
        errors.no_of_monitorusrs =
          "Number of monitorUsers must be greater than 0!";
      } else if (values.no_of_monitorusrs > 100) {
        errors.no_of_monitorusrs =
          "Number of monitorUsers must be less than 100!";
      } else if (!numRegex.test(values.no_of_monitorusrs)) {
        errors.no_of_monitorusrs = "Number of monitors accept only numbers!";
      }
    }

    if (values.Setupfee) {
      if (values.Setupfee <= 0) {
        errors.Setupfee = "Setup fee must be greater than 0!";
      } else if (values.Setupfee > 100) {
        errors.Setupfee = "Setup fee must be less than 100!";
      }
    }
    if (values.taxpercentage) {
      if (values.taxpercentage <= 0) {
        errors.taxpercentage = "Taxpercentage must be greater than 0!";
      } else if (values.taxpercentage > 100) {
        errors.taxpercentage = "Taxpercentage must be less than 100!";
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", updatePackage?.Package_Name || "");
    formData.append("activePackage", updatePackage?.isactivate || "");
    formData.append("typeofpack", updatePackage?.type_of_package || "");
    formData.append("price", updatePackage?.price || "");
    formData.append("servers", updatePackage?.no_of_server || 0);
    formData.append("devopUsers", updatePackage?.no_of_deveopusrs || 0);
    formData.append("monitorUsers", updatePackage?.no_of_monitorusrs || 0);
    formData.append("description", updatePackage?.description || "");
    formData.append("setupfee", updatePackage?.Setupfee || "");
    formData.append("payFailerThres", updatePackage?.payFailerThres || "");
    formData.append("taxPercentage", updatePackage?.taxpercentage || "");
    formData.append("accounttype", updatePackage?.accounttype || "");

    const jsonObject = {};
    for (const [key, value] of formData) {
      jsonObject[key] = value;
    }
    const jsonData = JSON.stringify(jsonObject);
    // console.log("Updated JSON Data:", jsonData);
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "Content-Type": "application/json",
      },
    };
    const validationErrors = validate(updatePackage);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await axios.post(
              `${BASE_URL}/updatepackage/${name}`,
              jsonData,
              config
            );
            console.log("updateRes", response);
            if (response?.data?.success) {
              Swal.fire(
                "Updated!",
                "Package updated successfully.",
                "success"
              ).then((result) => {
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
              Swal.fire("Error!", response?.data?.messege, "error");
            }
          } catch (error) {
            console.log("UpdatePacERROR", error);
          }
        },
      });
    }
  };

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
      {/* Add Package Detail to form */}
      {!loading ? (
        <Box
          sx={{
            minWidth: 300,
            width: { xs: "90%", sm: 500 },
            boxShadow: 3,
            paddingX: 3,
            paddingY: 2,
            borderRadius: 3,
          }}
          component="form"
        >
          <Typography
            sx={{
              fontSize: 24,
              fontWeight: "600",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            Update Package
          </Typography>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 1,
              gap: 2,
            }}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Package Name"
                value={updatePackage.Package_Name || ""}
                name="Package_Name"
                onChange={handleChange}
              />
              <Typography color={"error"}>{errors.Package_Name}</Typography>
            </Grid>
          </Grid>
          {/* Package Description */}
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <TextField
                fullWidth
                label="Package Description"
                name="description"
                value={updatePackage.description || ""}
                onChange={handleChange}
              />
              <Typography color={"error"}>{errors.description}</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 1,
            }}
          >
            <Grid item xs={12} sm={5.5} sx={{ marginTop: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="No of DevOps Users"
                value={updatePackage.no_of_deveopusrs || null}
                name="no_of_deveopusrs"
                onChange={handleChangeNumber}
              />
              <Typography color={"error"}>{errors.no_of_deveopusrs}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="No of Monitors Users"
                value={updatePackage.no_of_monitorusrs || null}
                name="no_of_monitorusrs"
                onChange={handleChangeNumber}
              />
              <Typography color={"error"}>
                {errors.no_of_monitorusrs}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            {!updatePackage.istrial && (
              <Grid item xs={12} sm={5.5} sx={{ marginTop: 1 }}>
                <TextField
                  fullWidth
                  label="Package Price"
                  name="price"
                  value={updatePackage.price || ""}
                  onChange={handleChange}
                />
                <Typography color={"error"}>{errors.price}</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="No of Servers"
                value={updatePackage.no_of_server || null}
                name="no_of_server"
                onChange={handleChangeNumber}
              />
              <Typography color={"error"}>{errors.no_of_server}</Typography>
            </Grid>
          </Grid>
          {/* PayPal Detail */}
          {!updatePackage.istrial && (
            <Grid
              container
              sx={{
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <Typography width="100%" sx={{ fontSize: 18, fontWeight: "500" }}>
                <span style={{ fontStyle: "italic" }}>PayPal Detail:</span>
              </Typography>
              <Grid item xs={12} sm={5.5} sx={{ marginTop: 1 }}>
                <TextField
                  fullWidth
                  label="SetUp Fee"
                  value={updatePackage.Setupfee || ""}
                  name="Setupfee"
                  onChange={handleChange}
                />
                <Typography color={"error"}>{errors.Setupfee}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
                <TextField
                  fullWidth
                  label="Tax Percentage"
                  value={updatePackage.taxpercentage || ""}
                  name="taxpercentage"
                  onChange={handleChange}
                />
                <Typography color={"error"}>{errors.taxpercentage}</Typography>
              </Grid>
            </Grid>
          )}
          {/* Radio Buttons */}
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              marginTop: 1,
            }}
          >
            <Grid
              item
              xs={12}
              sm={5.5}
              sx={{ marginLeft: 0.2, alignItems: "end" }}
            >
              <FormLabel
                sx={{ fontSize: 20, fontWeight: "400", color: "black" }}
              >
                Status:
              </FormLabel>
              <RadioGroup
                name="isactivate"
                value={updatePackage?.isactivate?.toLocaleUpperCase() || ""}
                onChange={handleChange}
                style={{ display: "flex", flexDirection: "row", marginLeft: 3 }}
              >
                <FormControlLabel
                  value="ACTIVE"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="INACTIVE"
                  control={<Radio />}
                  label="Inactive"
                />
              </RadioGroup>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ marginLeft: 0.2, alignItems: "end" }}
            >
              <FormLabel
                sx={{ fontSize: 20, fontWeight: "400", color: "black" }}
              >
                Duration:
              </FormLabel>
              <RadioGroup
                name="type_of_package"
                value={updatePackage.type_of_package || ""}
                onChange={handleChange}
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
            </Grid>
            {/*  */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{ marginLeft: 0.2, alignItems: "end" }}
            >
              <FormLabel
                sx={{ fontSize: 20, fontWeight: "400", color: "black" }}
              >
                Package Type:
              </FormLabel>
              <RadioGroup
                name="accounttype"
                value={updatePackage.accounttype || ""}
                onChange={handleChange}
                style={{ display: "flex", flexDirection: "row", marginLeft: 3 }}
              >
                <FormControlLabel
                  value="paid"
                  control={<Radio />}
                  label="Paid"
                />
                <FormControlLabel
                  value="unpaid"
                  control={<Radio />}
                  label="UnPaid"
                />
              </RadioGroup>
            </Grid>
          </Grid>

          <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{ minWidth: 220 }}
              onClick={handleSubmit}
            >
              Update Package
            </Button>
          </Box>
          {/* Add Package Detail to form End*/}
        </Box>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default UpdatePackage;
