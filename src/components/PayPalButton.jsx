import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "./constant/constant";

const PayPalButton = (props) => {
  const navigate = useNavigate();

  const formData = new FormData();
  formData.append("packname", props.Package);

  const handleSubscriptionCreate = async (data, actions) => {
    const accessToken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const resp = await axios.post(
        `${BASE_URL}/checkpackage`,
        formData,
        config
      );
      if (resp.data.success) {
        console.log("Successsssssss");
        return actions.subscription.create({
          plan_id: props.planId,
        });
      } else if (resp?.data?.token_error) {
        Swal.fire("ERROR!", resp?.data?.message, "error").then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ERROR!",
          text: resp.data.messege,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.log("checkpackage ERROR", error);
    }
  };

  const handleSubscriptionApprove = async (data, actions) => {
    console.log("approve");
    const accessToken = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const subObj = {
      package: props.Package,
      dataobj: data,
    };

    try {
      const respo = await axios.post(
        `${BASE_URL}/selectpackage`,
        subObj,
        config
      );

      console.log("RespSelect", respo);

      if (respo.data.success) {
        Swal.fire({
          icon: "success",
          text: respo.data.messege,
          confirmButtonText: "OK",
        }).then((result) => {
          navigate("/dashboard/user/server");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ERROR!",
          text: respo.data.messege,
          confirmButtonText: "OK",
        });
        throw new Error("Subscription selection failed.");
      }
    } catch (error) {
      console.log("selectpackage ERROR", error);
      throw new Error("An error occurred while selecting the package.");
    }
  };

  const handleSubscriptionError = (err) => {
    console.log("Subscription error:", err);
  };

  return (
    <PayPalButtons
      style={{
        shape: "rect",
        color: "gold",
        layout: "vertical",
        label: "subscribe",
        height: 48,
      }}
      createSubscription={handleSubscriptionCreate}
      onApprove={handleSubscriptionApprove}
      onError={handleSubscriptionError}
    />
  );
};

export default PayPalButton;
