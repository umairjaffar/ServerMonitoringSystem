// base url for all api's
export const BASE_URL = "https://8ad4-182-191-88-177.ngrok-free.app";
// access token for header.
export const accesstoken = localStorage.getItem("access_token");
export const config = {
  headers: {
    Authorization: `Bearer ${accesstoken}`,
  },
};
