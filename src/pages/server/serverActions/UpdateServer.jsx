import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import { BASE_URL } from "../../../components/constant/constant";

const UpdateServer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // console.log("id", id);
  const [updatedServer, setUpdatedServer] = useState({
    ip: "",
    name: "",
    service: [],
    container: [],
  });
  const [selectOptions, setSelectOptions] = useState();
  const [newService, setNewService] = useState("");
  const [newContainer, setNewContainer] = useState("");

  const [formErrors, setFormErrors] = useState({});
  // const [isSubmit, setIsSubmit] = useState(false);

  // 1) The findPreServices function check that is there service value
  // is already present in services list or not.

  // const findPreServices = updatedServer?.service.find(
  //   (item) => item?.toLowerCase() === newService?.toLowerCase()
  // );
  // const findPreContainer = updatedServer?.container.find(
  //   (item) => item?.toLowerCase() === newContainer?.toLowerCase()
  // );

  // Get server data from servers list.
  const getServer = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    // const svrObj = { svrid: id };
    const response = await axios.post(
      `${BASE_URL}/serverdetaildataupdated/${id}`,
      null,
      config
    );
    // console.log("SERVERresp:", response?.data?.User_Servers_Data);
    if (response?.data?.success) {
      const result = response?.data?.User_Servers_Data[0];
      console.log("updateServerList", result);
      setUpdatedServer({
        ...updatedServer,
        ip: result?.Server_IP,
        name: result?.Server_Name,
        service: result?.Lst_Services.filter((service) => service.selected),
        container: result?.Lst_Containers.filter(
          (container) => container.selected
        ),
      });
      // setUpdatedServer(result);
      setSelectOptions(result);
    } else if (response?.data?.token_error) {
      Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };
  useEffect(() => {
    getServer();
  }, []);

  const handleMultiServiceChange = (event, selectedOptions) => {
    setUpdatedServer((prevState) => ({
      ...prevState,
      service: selectedOptions,
    }));
  };
  // If you want to show new added services as options.
  // setSelectOptions((prev) => ({
  //   ...prev,
  //   Lst_services: [...prev.Lst_services, newService],
  // }));
  const handleAddNewService = () => {
    const validationErrors = newServiceValidate(newService);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (!formErrors.newService?.length > 0 && newService.length >= 2) {
        setUpdatedServer((prev) => ({
          ...prev,
          service: [
            ...prev.service,
            {
              selected: false,
              service: newService,
            },
          ],
        }));
        setNewService("");
      }
    }
  };
  const handleMultiContainerChange = (event, selectedOptions) => {
    setUpdatedServer((prevState) => ({
      ...prevState,
      container: selectedOptions,
    }));
  };
  const handleAddNewContainer = () => {
    const validationErrors = newContainerValidate(newContainer);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (!formErrors.newContainer?.length > 0 && newContainer.length >= 2) {
        setUpdatedServer((prev) => ({
          ...prev,
          container: [
            ...prev.container,
            { selected: false, container: newContainer },
          ],
        }));
        setNewContainer("");
      }
    }
  };
  // Send Data to API .
  const handleUpdateClick = () => {
    const validationErrors = validate(updatedServer);
    setFormErrors(validationErrors);
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    console.log("UPDATED", updatedServer);
    const services = [];
    updatedServer?.service.map((item) =>
      item ? services.push(item.service) : null
    );
    const containers = [];
    updatedServer.container.map((item) =>
      item ? containers.push(item.container) : null
    );
    const newData = {
      ip: updatedServer.ip,
      name: updatedServer.name,
      container: containers,
      service: services,
    };

    console.log("updatedData", newData);
    if (Object.keys(validationErrors).length === 0) {
      if (
        updatedServer.service.length > 0 &&
        updatedServer.container.length > 0
      ) {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!",
          showLoaderOnConfirm: true,
          preConfirm: async () => {
            try {
              return await axios
                .post(`${BASE_URL}/updateserviceandcontainer`, newData, config)
                .then((response) => {
                  console.log("response", response);
                  if (response?.data?.token_error) {
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
            } catch (error) {
              console.log("update ERROR", error);
            }
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Download Zip file",
              // text: "You won't be able to revert this!",
              icon: "info",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Download",
              showLoaderOnConfirm: true,
              preConfirm: async () => {
                await axios({
                  method: "post",
                  url: `${BASE_URL}/serverdetailfile`,
                  data: null,
                  responseType: "blob",
                  headers: {
                    Authorization: `Bearer ${accesstoken}`,
                  },
                })
                  .then((response) => {
                    // Rest of the code remains the same
                    const contentDispositionHeader =
                      response.headers["content-disposition"];
                    const fileName = contentDispositionHeader
                      ? contentDispositionHeader
                          .split("filename=")[1]
                          .trim()
                          .replace(/"/g, "")
                      : "serverbashscript.zip";

                    const blob = new Blob([response.data], {
                      type: "application/zip",
                    });
                    saveAs(blob, fileName);
                  })
                  .catch((error) => {
                    Swal.showValidationMessage(`Request failed: ${error}`);
                  });
              },
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire(
                  "Downloaded!",
                  "Your file has been downloaded.",
                  "success"
                ).then((result) => {
                  if (result.isConfirmed) {
                    navigate("/dashboard/user/viewServers");
                  }
                });
              } else if (result.isDismissed) {
                navigate("/dashboard/user/viewServers");
              }
            });
          }
        });
      }
    }
    // After Update the component You can move to view servers page.
  };

  //  here we defines functions for fields errors.
  // 4) validate fonction to check errors for formValues
  const validate = (values) => {
    const errors = {};

    if (!values?.service?.length > 0) {
      errors.service = "Service name must be required!";
    }

    if (!values?.container?.length > 0) {
      errors.container = "Container name must be required!";
    }

    return errors;
  };

  // 4.1) validate fonction to check errors for newService
  const newServiceValidate = (value) => {
    const errors = {};
    const stringRegex = /^[a-zA-Z\s]+$/;
    if (!newService) {
      errors.newService = "Service name must be required!";
    } else if (!stringRegex.test(newService)) {
      errors.newService = "Service name can only be alphabets!";
    } else if (newService.length < 2) {
      errors.newService = "Service name must be at least 2 characters!";
    }
    // else if (findPreServices) {
    //   errors.newService = "Service name already present in services list!";
    // }

    return errors;
  };
  // 4.2) validate fonction to check errors for newContainer
  const newContainerValidate = (value) => {
    const errors = {};
    const stringRegex = /^[a-zA-Z\s]+$/;
    if (!newContainer) {
      errors.newContainer = "Container name can only be alphabets!";
    } else if (!stringRegex.test(newContainer)) {
      errors.newContainer = "Container name can only except english alphabets!";
    } else if (newContainer.length < 2) {
      errors.newContainer = "Container name must be at least 2 characters!";
    }
    // else if (findPreContainer) {
    //   errors.newContainer =
    //     "Container name already present in containers list!";
    // }

    return errors;
  };

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <KeyboardBackspaceIcon
        sx={{ fontSize: 44, marginTop: 1, cursor: "pointer" }}
        onClick={() => navigate("/dashboard/user/viewServers")}
      />
      {selectOptions ? (
        <Box component="form" boxShadow={3} paddingY={4} borderRadius={4}>
          <Typography
            sx={{
              fontSize: 29,
              fontWeight: "500",
              marginLeft: 2,
              marginBottom: 2,
            }}
          >
            Update Server
          </Typography>
          <Grid
            container
            sx={{
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Grid item xs={11} md={5.8}>
              <TextField
                disabled
                fullWidth
                label="Server IP"
                value={selectOptions?.Server_IP}
              />
            </Grid>
            <Grid item xs={11} md={5}>
              <TextField
                disabled
                fullWidth
                label="Server Name"
                value={selectOptions?.Server_Name}
              />
            </Grid>
          </Grid>
          {/* Services Grid Start */}
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              marginY: 2,
            }}
          >
            <Grid item xs={11} md={5.8}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  options={selectOptions?.Lst_Services || []}
                  getOptionLabel={(option) => option?.service}
                  value={updatedServer?.service}
                  onChange={handleMultiServiceChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Services"
                      placeholder="Type to search or add new service"
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option.service}
                        label={option.service}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </FormControl>
              <Typography color={"error"}>{formErrors.service}</Typography>
            </Grid>
            <Grid item xs={11} md={5}>
              <TextField
                fullWidth
                label="Add new item to services"
                variant="outlined"
                value={newService}
                onChange={(event) => setNewService(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AddIcon
                        fontSize="large"
                        sx={{
                          color: "primary",
                          backgroundColor: "#d3d3d3",
                          cursor: "pointer",
                          borderRadius: 5,
                        }}
                        onClick={handleAddNewService}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography color={"error"}>{formErrors.newService}</Typography>
            </Grid>
          </Grid>
          {/* Services Grid End */}
          {/* Container Grid Start */}
          <Grid
            container
            sx={{
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              marginBottom: 5,
            }}
          >
            <Grid item xs={11} md={5.8}>
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  options={selectOptions?.Lst_Containers || []}
                  getOptionLabel={(option) => option?.container}
                  value={updatedServer?.container}
                  onChange={handleMultiContainerChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Containers"
                      placeholder="Type to search or add new container"
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        key={option.container}
                        label={option.container}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
              </FormControl>
              <Typography color={"error"}>{formErrors.container}</Typography>
            </Grid>
            <Grid item xs={11} md={5}>
              <TextField
                fullWidth
                label="Add new item to Containers"
                variant="outlined"
                value={newContainer}
                onChange={(event) => setNewContainer(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AddIcon
                        fontSize="large"
                        sx={{
                          color: "primary",
                          backgroundColor: "#d3d3d3",
                          cursor: "pointer",
                          borderRadius: 5,
                        }}
                        onClick={handleAddNewContainer}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography color={"error"}>{formErrors.newContainer}</Typography>
            </Grid>
          </Grid>
          {/* Container Grid End */}
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            <Button
              style={{
                minWidth: 140,
                borderRadius: 2,
              }}
              variant="contained"
              onClick={() => navigate("/dashboard/user/viewServers")}
            >
              Cancel
            </Button>
            <Button
              style={{
                minWidth: 160,
                borderRadius: 2,
              }}
              variant="contained"
              onClick={handleUpdateClick}
            >
              update
            </Button>
          </Box>
        </Box>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default UpdateServer;
