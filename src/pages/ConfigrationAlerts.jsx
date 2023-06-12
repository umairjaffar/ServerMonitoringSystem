import { Box, Button, Checkbox, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BASE_URL } from "../components/constant/constant";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfigrationAlerts = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getConfigEmails = async () => {
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
    setLoading(true);
    const response = await axios.post(`${BASE_URL}/getalertdata`, null, config);
    // console.log("Emails resp", response.data.Alert_Data);
    if (response.data.success) {
      setLoading(false);
      setTableData(response.data.Alert_Data || []);
    } else if (response?.data?.token_error) {
      Swal.fire("ERROR!", response?.data?.message, "error").then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  useEffect(() => {
    getConfigEmails();
  }, []);

  const columns = [
    {
      field: "selected",
      headerName: "Selected",
      width: 150,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      renderCell: (params) => {
        const handleChange = (event) => {
          const updatedData = tableData.map((row) => {
            if (row.id === params.row.id) {
              return { ...row, selected: event.target.checked };
            }
            return row;
          });
          setTableData(updatedData);
        };

        return (
          <Checkbox
            checked={params.value}
            color="primary"
            onChange={handleChange}
            inputProps={{ "aria-label": "checkbox" }}
          />
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 250,
      flex: 1,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
  ];

  const handleUpdate = () => {
    console.log("Update", tableData);
    const filteredEmail = [];
    tableData.filter((item) =>
      item.selected ? filteredEmail.push(item.email) : null
    );

    const emailsObj = {
      alertemails: filteredEmail,
    };
    console.log("Filter", emailsObj);
    const accesstoken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    };
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
        return await axios
          .post(`${BASE_URL}/updatealertdata`, emailsObj, config)
          .then((response) => {
            console.log("response", response);
          })
          .catch((error) => {
            Swal.showValidationMessage(`Request failed: ${error}`);
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        getConfigEmails();
        Swal.fire("Updated!", "Your data has been updated.", "success");
      }
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
            Email Alerts Configration:
          </Typography>
          <Box
            sx={{
              height: 400,
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
              rows={tableData}
              columns={columns}
              rowHeight={60}
              checkboxSelection={false}
              disableSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 20, 30]}
            />
          </Box>
          <Box
            width="100%"
            sx={{
              marginTop: 2,
              display: "flex",
              justifyContent: { xs: "center", sm: "left" },
            }}
          >
            <Button
              onClick={handleUpdate}
              variant="contained"
              sx={{
                width: { xs: "90%", sm: 250, md: 300 },
                textTransform: "none",
                fontSize: 17,
                fontWeight: "500",
              }}
            >
              Set Email Alerts
            </Button>
          </Box>
        </>
      ) : (
        <h3 style={{ textAlign: "center", color: "#1976D2" }}>Loading...</h3>
      )}
    </Box>
  );
};

export default ConfigrationAlerts;
