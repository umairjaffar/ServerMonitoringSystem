import axios from "axios";
const API_URL = "http://127.0.0.1:5000/server";

// add data to server in dataBase.
export const addServerData = async (data) => {
  try {
    console.log("data", data);
    const res = await axios.post(API_URL, data);
    console.log("res", res);
    return res;
  } catch (error) {
    console.log("Error Occure while calling addServerData api");
  }
};

// get data from server
export const getServerData = async () => {
  try {
    return await axios.get(API_URL);
  } catch (error) {
    console.log("Error Occure while calling getServerData api");
  }
};
