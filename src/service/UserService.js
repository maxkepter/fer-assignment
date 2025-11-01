import axios from "axios";
import { SERVER_CONFIG } from "../config/server.config.js";
async function getUserById(userId) {
  return await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/users/${userId}`)
    .then((response) => response.data);
}
async function getAllUsers() {
  let data = await axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/users`)
    .then((response) => response.data);
  return data;
}

export const UserService = {
  getUserById,
  getAllUsers,
};
