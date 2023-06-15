// base url for all api's
export const BASE_URL = "https://bc34-154-192-15-201.ngrok-free.app";
// access token for header.
export const accesstoken = localStorage.getItem("access_token");
export const config = {
  headers: {
    Authorization: `Bearer ${accesstoken}`,
  },
};
