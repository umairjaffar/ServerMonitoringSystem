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
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { BASE_URL } from "../../components/constant/constant";

// const Services = ["web service", "mail service", "file service"];
// const Containers = ["web container", "mail container", "file container"];

const Server = () => {
  const navigate = useNavigate();
  // Get Data for containers and services from api for options.
  const [Services, setServices] = useState([]);
  const [Containers, setContainers] = useState([]);
  // New Data for add server
  const initialValues = {
    ip: "",
    name: "",
    service: [],
    container: [],
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [selectService, setSelectService] = useState([]);
  const [newService, setNewService] = useState("");
  const [selectContainer, setSelectContainer] = useState([]);
  const [newContainer, setNewContainer] = useState("");
  const [disable, setDisable] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  // api for get servers.
  const getServers = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    try {
      const resp = await axios.post(
        `${BASE_URL}/getsuggesteddata`,
        null,
        config
      );
      // console.log("RESp", resp.data);
      // console.log("RESp", resp.data?.Services);
      if (resp?.data?.success) {
        setServices(resp.data?.Services);
        setContainers(resp.data?.Containers);
      } else if (resp?.data?.token_error) {
        Swal.fire("ERROR!", resp?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      }
    } catch (error) {
      console.log("GetServers ERROR", error);
    }
  };
  useEffect(() => {
    getServers();
  }, []);
  // console.log("SERV", Services);
  // 1) The findPreServices function check that is there service value
  // is already present in services list or not.
  const findPreServices = formValues?.service.find(
    (item) => item?.toLowerCase() === newService?.toLowerCase()
  );
  const findPreContainer = formValues?.container.find(
    (item) => item?.toLowerCase() === newContainer?.toLowerCase()
  );

  // 2) The Change functions for Services and newService
  const handleMultiServiceChange = (event, value) => {
    setSelectService(value);
    setFormValues({
      ...formValues,
      service: value,
    });
  };
  const handleAddNewService = () => {
    const validationErrors = newServiceValidate(newService);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (
        !findPreServices &&
        !formErrors.newService?.length > 0 &&
        newService.length >= 2
      ) {
        setSelectService([...selectService, newService]);
        setFormValues((prev) => ({
          ...prev,
          service: [...prev.service, newService],
        }));
        setNewService("");
      }
    }
  };

  // 3) The Change functions for Containers and newContainer.
  const handleMultiContainerChange = (event, value) => {
    setSelectContainer(value);
    setFormValues({ ...formValues, container: value });
  };
  const handleAddNewContainer = () => {
    const validationErrors = newContainerValidate(newContainer);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (
        !findPreContainer &&
        !formErrors.newContainer?.length > 0 &&
        newContainer.length >= 2
      ) {
        setSelectContainer([...selectContainer, newContainer]);
        setFormValues((prev) => ({
          ...prev,
          container: [...prev.container, newContainer],
        }));
        setNewContainer("");
      }
    }
  };
  // 4) validate fonction to check errors for formValues
  const validate = (values) => {
    const errors = {};
    // const stringRegex = /^[a-zA-Z\s]+$/;
    const ipRegex =
      /^((25[0-5]|(2[0-4]|1?\d{1,2})|0)\.){3}(25[0-5]|(2[0-4]|1?\d{1,2})|0)$/;
    if (!values.ip) {
      errors.ip = "Server ip must be required!";
    } else if (!ipRegex.test(values.ip)) {
      errors.ip = "Not a valid ip formate i.e 192.168.0.0";
    }

    if (!values.name) {
      errors.name = "Server name must be required!";
    }

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
      errors.newService = "Server name only except english alphabets!";
    } else if (newService.length < 2) {
      errors.newService = "Service name must be at least 2 characters!";
    } else if (findPreServices) {
      errors.newService = "Service name already present in services list!";
    }

    return errors;
  };
  // 4.2) validate fonction to check errors for newContainer
  const newContainerValidate = (value) => {
    const errors = {};
    const stringRegex = /^[a-zA-Z\s]+$/;
    if (!newContainer) {
      errors.newContainer = "Container name must be required!";
    } else if (!stringRegex.test(newContainer)) {
      errors.newContainer = "Container name only except english alphabets!";
    } else if (newContainer.length < 2) {
      errors.newContainer = "Container name must be at least 2 characters!";
    } else if (findPreContainer) {
      errors.newContainer =
        "Container name already present in containers list!";
    }

    return errors;
  };

  // 5) The Submit function for formValues
  const handleSubmit = async (event) => {
    event.preventDefault();
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    const validationErrors = validate(formValues);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (
        formValues.ip &&
        formValues.name &&
        formValues.service.length > 0 &&
        formValues.container.length > 0
      ) {
        setDisable(true);
        // API Call
        const response = await axios.post(
          `${BASE_URL}/insertserver`,
          formValues,
          config
        ); // API to add Server
        console.log("resp", response);
        if (response?.data?.messege?.success) {
          setDisable(false);
          Swal.fire({
            title: "Download Zip file",
            // text: "You won't be able to revert this!",
            icon: "info",
            // showCancelButton: true,
            confirmButtonColor: "#3085d6",
            // cancelButtonColor: "#d33",
            confirmButtonText: "Download",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
              axios({
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
          });
          setFormValues(initialValues);
          setSelectService([]);
          setSelectContainer([]);
          setNewContainer("");
          setNewService("");
        } else if (response?.data?.token_error) {
          setDisable(false);
          Swal.fire("ERROR!", response?.data?.message, "error").then(
            (result) => {
              if (result.isConfirmed) {
                navigate("/login");
              }
            }
          );
        } else {
          setDisable(false);
          Swal.fire({
            icon: "error",
            title: response?.data?.messege,
          });
        }
      }
    }
  };

  return (
    <Box component="form" sx={{ padding: 3 }} onSubmit={handleSubmit}>
      <Box sx={{ marginTop: 4, boxShadow: 3, padding: 2, borderRadius: 3 }}>
        <Typography
          sx={{
            fontSize: 29,
            fontWeight: "500",
            marginLeft: 2,
            marginBottom: 2,
          }}
        >
          Add New Server
        </Typography>
        <Grid container gap={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Server IP"
              name="ip"
              autoFocus
              value={formValues.ip}
              onChange={(event) =>
                setFormValues({
                  ...formValues,
                  ip: event.target.value,
                })
              }
            />
            <Typography color={"error"}>{formErrors.ip}</Typography>
          </Grid>
          <Grid item xs={12} md={5.5}>
            <TextField
              fullWidth
              label="Server Name"
              name="name"
              value={formValues.name}
              onChange={(event) =>
                setFormValues({
                  ...formValues,
                  name: event.target.value,
                })
              }
            />
            <Typography color={"error"}>{formErrors.name}</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          gap={2}
          justifyContent="center"
          alignItems="center"
          marginTop={2}
        >
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                multiple
                options={Services || []}
                getOptionLabel={(option) => option}
                value={selectService}
                onChange={handleMultiServiceChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Services"
                    placeholder="Type to search or add new service"
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
              />
            </FormControl>
            <Typography color={"error"}>{formErrors.service}</Typography>
          </Grid>
          <Grid item xs={12} md={5.5}>
            <TextField
              fullWidth
              id="new-item"
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
        {/* ----------------------------Container.......... */}
        <Grid
          container
          gap={2}
          justifyContent="center"
          alignItems="center"
          marginTop={2}
        >
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                multiple
                options={Containers || []}
                getOptionLabel={(option) => option}
                value={selectContainer}
                onChange={handleMultiContainerChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Select Containers"
                    placeholder="Type to search or add new service"
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
              />
            </FormControl>
            <Typography color={"error"}>{formErrors.container}</Typography>
          </Grid>
          {/* add newContainer */}
          <Grid item xs={12} md={5.5}>
            <TextField
              fullWidth
              label="Add new item to container"
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

        <Grid
          container
          sx={{
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Grid item xs={10} sm={4} md={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={disable}
            >
              {disable ? "Loading..." : "Add Server"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Server;
