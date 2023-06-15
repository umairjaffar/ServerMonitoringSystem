import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../dashboard/Dashboard";
import Packages from "../pages/Packages";
import OtpVarification from "../pages/auth/OtpVarification";
import Varification from "../pages/auth/Varification";

const NavRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route path="/varification/:id" element={<Varification />} />
        <Route path="/otpVarification" element={<OtpVarification />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default NavRoutes;
