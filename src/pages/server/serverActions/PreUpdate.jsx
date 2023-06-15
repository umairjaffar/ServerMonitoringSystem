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

const PreUpdate = () => {
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
      console.log("result", result);
      setUpdatedServer({
        ...updatedServer,
        ip: result?.Server_IP,
        name: result?.Server_Name,
        service: result?.Lst_Services.filter((service) => service.selected),
        container: result?.Lst_Containers,
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

//   const handleMultiServiceChange = (event, value) => {
//     setUpdatedServer({
//       ...updatedServer,
//       service: value,
//     });
//   };

  console.log("selectOptions", selectOptions);

  const handleClick = () => {
    console.log("Data", updatedServer);
    const newData = {
      ip: updatedServer.ip,
      name: updatedServer.name,
      container: updatedServer.container,
      service: updatedServer?.service.map((item) => {
        return {
          selected: true,
          service: item.service,
        };
      }),
    };
    console.log("updatedData", newData);
    
  };
  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <KeyboardBackspaceIcon
        sx={{ fontSize: 44, marginTop: 1, cursor: "pointer" }}
        onClick={() => navigate("/dashboard/user/viewServers")}
      />

      <FormControl fullWidth>
        <Autocomplete
          multiple
          options={selectOptions?.Lst_Services || []}
          getOptionLabel={(option) => option?.service} // Change to option instead of option.service
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
          renderTags={(tagValue, getTagProps) => {
            // console.log("tagValue", tagValue);
            return tagValue.map((option, index) => {
              // console.log("option2", option);
              return (
                <Chip
                  key={option.service} // Change to key={option.service} instead of key={option}
                  label={option.service}
                  {...getTagProps({ index })}
                />
              );
            });
          }}
        />
      </FormControl>

      <Button onClick={handleClick} variant="contained">
        Submit
      </Button>
    </Box>
  );
};

export default PreUpdate;
