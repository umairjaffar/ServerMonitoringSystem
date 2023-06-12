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
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../components/constant/constant";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreatePackage = () => {
  const navigate = useNavigate();
  const initialValues = {
    activePackage: "",
    name: "",
    typeofpack: "",
    price: "",
    servers: null,
    devopUsers: null,
    monitorUsers: null,
    description: "",
    stepupfee: "",
    autoBilling: false,
    istrial: false,
    payFailerThres: null,
    taxPercentage: "",
  };
  const [createPackage, setCreatePackage] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setCreatePackage({
      ...createPackage,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeNumber = (e) => {
    setCreatePackage({
      ...createPackage,
      [e.target.name]: parseInt(e.target.value),
    });
  };

  const validate = (values) => {
    const errors = {};
    const numRegex = /^[0-9]+$/;
    const stringRegex = /^[a-zA-Z]+$/;
    if (!values.name) {
      errors.name = "Package name must be required!";
    } else if (!stringRegex.test(values.name)) {
      errors.name = "Package name accept only alphabets!";
    }

    if (values.price) {
      if (!numRegex.test(values.price)) {
        errors.price = "Package price accept only numbers!";
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        "Content-Type": "application/json",
      },
    };
    const trialData = {
      activePackage: createPackage.activePackage,
      name: createPackage.name,
      typeofpack: createPackage.typeofpack,
      servers: createPackage.servers,
      devopUsers: createPackage.devopUsers,
      monitorUsers: createPackage.monitorUsers,
      description: createPackage.description,
      istrial: createPackage.istrial,
      price: "0",
      stepupfee: "0.0",
      autoBilling: false,
      payFailerThres: null,
      taxPercentage: "0",
    };
    const validationErrors = validate(createPackage);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "Are you sure to create the package!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Create it!",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            // console.log("CreTok", config);
            const response = await axios.post(
              `${BASE_URL}/createpackage`,
              createPackage.istrial
                ? JSON.stringify(trialData)
                : JSON.stringify(createPackage),
              config
            );
            if (response?.data?.success) {
              Swal.fire(
                "Created!",
                "Package created successfull.",
                "success"
              ).then((result) => {
                if (result.isConfirmed) {
                  navigate("/dashboard/admin");
                }
              });
              setCreatePackage(initialValues);
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
            console.log("Create Package Error", error);
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
          Create Package
        </Typography>
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            marginTop: 1,
          }}
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Package Name"
              value={createPackage.name}
              name="name"
              onChange={handleChange}
            />
            <Typography color={"error"}>{errors.name}</Typography>
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
              value={createPackage.description}
              onChange={handleChange}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
            <TextField
              fullWidth
              label="Pay"
              value={createPackage.servers}
              name="servers"
              onChange={handleChange}
            />
          </Grid> */}
        </Grid>
        {/* <Grid
          container
          sx={{
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
         
        </Grid> */}
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            marginTop: 1,
          }}
        >
          {!createPackage.istrial && (
            <Grid item xs={12} sm={5.5} sx={{ marginTop: 1 }}>
              <TextField
                fullWidth
                label="Package Price"
                name="price"
                value={createPackage.price}
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
              value={createPackage.servers}
              name="servers"
              onChange={handleChangeNumber}
            />
          </Grid>
          <Grid item xs={12} sm={5.5} sx={{ marginTop: 1 }}>
            <TextField
              fullWidth
              type="number"
              label="No of DevOps Users"
              value={createPackage.devopUsers}
              name="devopUsers"
              onChange={handleChangeNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
            <TextField
              fullWidth
              type="number"
              label="No of Monitors Users"
              value={createPackage.monitorUsers}
              name="monitorUsers"
              onChange={handleChangeNumber}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 1 }}>
            <FormControlLabel
              label="Select for trail package"
              control={
                <Checkbox
                  checked={createPackage.istrial}
                  onChange={(e) =>
                    setCreatePackage({
                      ...createPackage,
                      istrial: e.target.checked,
                    })
                  }
                />
              }
            />
            {/* <span style={{ color: "#1976D2", margin: "0px", fontSize: 12 }}>
              If you check the trail its mean you want to create free package.
            </span> */}
          </Grid>
        </Grid>

        {/* PayPal Detail */}
        {!createPackage.istrial && (
          <>
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
                  value={createPackage.stepupfee}
                  name="stepupfee"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
                <TextField
                  fullWidth
                  label="Tax Percentage"
                  value={createPackage.taxPercentage}
                  name="taxPercentage"
                  onChange={handleChange}
                />
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
                  label="Pay Failer Threshold"
                  value={createPackage.payFailerThres}
                  name="payFailerThres"
                  onChange={handleChangeNumber}
                />
              </Grid>
              <Grid item xs={12} sm={5.5} sx={{ alignSelf: "end" }}>
                <FormControlLabel
                  label="Auto Billing"
                  control={
                    <Checkbox
                      checked={createPackage.autoBilling}
                      onChange={(e) =>
                        setCreatePackage({
                          ...createPackage,
                          autoBilling: e.target.checked,
                        })
                      }
                    />
                  }
                />
              </Grid>
            </Grid>
          </>
        )}
        {/* Radio Buttons */}
        <Grid
          container
          sx={{
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
          <Grid
            item
            xs={12}
            sm={5.5}
            sx={{ marginLeft: 0.2, alignItems: "end" }}
          >
            <FormLabel sx={{ fontSize: 20, fontWeight: "400", color: "black" }}>
              <span style={{ fontStyle: "italic" }}>Status:</span>
            </FormLabel>
            <RadioGroup
              name="activePackage"
              value={createPackage?.activePackage}
              onChange={handleChange}
              style={{ display: "flex", flexDirection: "row", marginLeft: 3 }}
            >
              <FormControlLabel
                value="active"
                control={<Radio />}
                label="Active"
              />
              <FormControlLabel
                value="inactive"
                control={<Radio />}
                label="inactive"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ marginLeft: 0.2, alignItems: "end" }}>
            <FormLabel sx={{ fontSize: 20, fontWeight: "400", color: "black" }}>
              <span style={{ fontStyle: "italic" }}>Duration:</span>
            </FormLabel>
            <RadioGroup
              name="typeofpack"
              value={createPackage.typeofpack}
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
        </Grid>

        <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ minWidth: 220 }}
            onClick={handleSubmit}
          >
            ADD Package
          </Button>
        </Box>
        {/* Add Package Detail to form End*/}
      </Box>
    </Box>
  );
};

export default CreatePackage;
