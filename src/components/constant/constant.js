// base url for all api's
export const BASE_URL = "https://e167-154-192-15-95.ngrok-free.app";
// access token for header.
export const accesstoken = localStorage.getItem("access_token");
export const config = {
  headers: {
    Authorization: `Bearer ${accesstoken}`,
  },
};
