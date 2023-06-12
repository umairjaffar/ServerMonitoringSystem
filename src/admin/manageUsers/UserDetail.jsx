// import React from "react";
// import { Box, Grid, List, ListItem, Typography, styled } from "@mui/material";
// import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
// import DoneIcon from "@mui/icons-material/Done";
// import { useNavigate } from "react-router-dom";

// const TypoText = styled(Typography)(() => ({
//   fontSize: 20,
//   fontWeight: "500",
//   color: "black",
// }));
// const Icon = styled(DoneIcon)(() => ({
//   backgroundColor: "#E0E0D8",
//   borderRadius: 10,
//   fontSize: 22,
//   marginRight: 5,
// }));

// const UserDetail = () => {
//   const navigate = useNavigate();
//   return (
//     <Box
//       sx={{
//         marginTop: 4,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Box width="100%">
//         <KeyboardBackspaceIcon
//           sx={{ fontSize: 44, marginY: 1, cursor: "pointer" }}
//           onClick={() => navigate("/dashboard/admin/viewUsers")}
//         />
//       </Box>
//       {/* Add Package Detail */}
//       {/* {findedPackage ? ( */}
//       <Grid
//         container
//         sx={{
//           marginTop: 1,
//           marginBottom: 5,
//           boxShadow: 2,
//           borderRadius: 3,
//           paddingY: 3,
//           justifyContent: "space-evenly",
//           gap: 2,
//         }}
//       >
//         <Grid item xs={11}>
//           <Typography
//             sx={{
//               marginBottom: 1,
//               fontSize: 26,
//               fontWeight: "600",
//               color: "#4687CA",
//             }}
//           >
//             <span style={{ fontStyle: "italic" }}>Package Detail</span>
//           </Typography>
//         </Grid>
//         <Grid item xs={10}>
//           <TypoText>
//             User Name :{" "}
//             <span
//               style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
//             >
//               Umair Jaffar
//             </span>
//           </TypoText>
//         </Grid>
//         <Grid item xs={10}>
//           <TypoText>
//             Email :{" "}
//             <span
//               style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
//             >
//               example@gmail.com
//             </span>
//           </TypoText>
//         </Grid>
//         <Grid item xs={10}>
//           <TypoText>
//             Duration :{" "}
//             <span
//               style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
//             >
//               {/* {findedPackage?.Type_Of_Package} */}
//             </span>
//           </TypoText>
//         </Grid>
//         <Grid item xs={10}>
//           <TypoText>
//             Price :{" "}
//             <span
//               style={{ fontSize: 18, fontStyle: "italic", color: "#202020" }}
//             >
//               {/* {findedPackage?.Price} */}
//             </span>
//           </TypoText>
//         </Grid>
//         <Grid item xs={10}>
//           <TypoText>User Features </TypoText>
//           <List sx={{ marginLeft: 3 }}>
//             <ListItem>
//               <Icon />
//               <Typography>This is a valid user</Typography>
//             </ListItem>
//             <ListItem>
//               <Icon />
//               <Typography>This package utilizes only 9 servers.</Typography>
//             </ListItem>
//             <ListItem>
//               <Icon />
//               <Typography>
//                 With this package, you can only add 87 Devop's users.
//               </Typography>
//             </ListItem>
//             <ListItem>
//               <Icon />
//               <Typography>
//                 With this package, you can only add 77 Monitor users.
//               </Typography>
//             </ListItem>
//           </List>
//         </Grid>
//       </Grid>
//       {/* ) : ( */}
//       <Typography sx={{ fontSize: 24, fontWeight: "500", textAlign: "center" }}>
//         Loading...
//       </Typography>
//       {/* )} */}
//     </Box>
//   );
// };

// export default UserDetail;
