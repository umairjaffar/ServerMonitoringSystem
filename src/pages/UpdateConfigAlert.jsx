// import {
//     Box,
//     Button,
//     Checkbox,
//     FormControl,
//     InputLabel,
//     ListItemText,
//     MenuItem,
//     OutlinedInput,
//     Select,
//     Typography,
//   } from "@mui/material";
//   import React, { useEffect, useState } from "react";
//   import axios from "axios";
//   import { BASE_URL } from "../components/constant/constant";
//   import Swal from "sweetalert2";
  
//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: 250,
//       },
//     },
//   };
  
//   const UpdateConfigAlert = () => {
//     const [emails, setEmails] = useState([]);
//     const [userEmails, setUserEmails] = useState([]);
//     const [loading, setLoading] = useState(false);
  
//     const handleChange = (event) => {
//       const {
//         target: { value },
//       } = event;
//       setUserEmails(
//         // On autofill we get a stringified value.
//         typeof value === "string" ? value.split(",") : value
//       );
//     };
  
//     const getEmails = async () => {
//       const accesstoken = localStorage.getItem("access_token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${accesstoken}`,
//         },
//       };
//       const response = await axios.post(
//         `${BASE_URL}/getemailsdata`,
//         null,
//         config
//       );
//       const newMails = response?.data?.Emials_Data;
//       console.log("responseEmail", newMails);
//       setEmails(newMails);
//     };
//     useEffect(() => {
//       getEmails();
//     }, []);
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       const accesstoken = localStorage.getItem("access_token");
//       const config = {
//         headers: {
//           Authorization: `Bearer ${accesstoken}`,
//         },
//       };
//       if (userEmails.length > 0) {
//         setLoading(true);
//         console.log("formValues", userEmails);
//         const formData = new FormData();
//         formData.append("alertemails", JSON.stringify(userEmails));
//         // formData.append("alertemails", userEmails);
//         const response = await axios.post(
//           `${BASE_URL}/insertalertdata`,
//           formData,
//           config
//         );
//         console.log("SubmitEmail", response);
//         if (response?.data?.success) {
//           setLoading(false);
//           setUserEmails([]);
//           Swal.fire({
//             icon: "success",
//             title: "SuccessFil!",
//             text: response?.data?.messege,
//             confirmButtonText: "OK",
//           });
//         } else {
//           setLoading(false);
//           Swal.fire({
//             icon: "error",
//             title: "ERROR!",
//             text: response?.data?.messege,
//             confirmButtonText: "OK",
//           });
//         }
//       }
//     };
  
//     return (
//       <Box
//         sx={{
//           height: "100%",
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         {emails ? (
//           <Box
//             sx={{
//               width: 500,
//               marginTop: 10,
//               boxShadow: 3,
//               borderRadius: 3,
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: 24,
//                 fontWeight: "600",
//                 marginLeft: 2,
//                 marginTop: 2,
//               }}
//             >
//               Add Email
//             </Typography>
//             <Box
//               sx={{ marginX: 4, marginBottom: 4 }}
//               component="form"
//               onSubmit={handleSubmit}
//             >
//               <FormControl fullWidth sx={{ marginTop: 3 }}>
//                 <InputLabel>User Emails</InputLabel>
//                 <Select
//                   fullWidth
//                   multiple
//                   value={userEmails}
//                   onChange={handleChange}
//                   input={<OutlinedInput label="User Emails" />}
//                   renderValue={(selected) => selected.join(", ")}
//                   MenuProps={MenuProps}
//                 >
//                   {emails.map((name) => (
//                     <MenuItem key={name} value={name}>
//                       <Checkbox checked={userEmails.indexOf(name) > -1} />
//                       <ListItemText primary={name} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <Button
//                 fullWidth
//                 type="submit"
//                 sx={{ marginTop: 4 }}
//                 variant="contained"
//                 disabled={loading}
//               >
//                 {loading ? "loading..." : "Add Emails"}
//               </Button>
//             </Box>
//           </Box>
//         ) : (
//           "Loading..."
//         )}
//       </Box>
//     );
//   };
  
//   export default UpdateConfigAlert;
  