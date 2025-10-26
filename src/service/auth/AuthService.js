import axios from "axios";
import { SERVER_CONFIG } from "../../config/server.config.js";

function getAllUsers() {
  return axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/users`)
    .then((res) => res.data);
}

function getUserByUsername(username) {
  return axios
    .get(`${SERVER_CONFIG.CONTEXT_PATH}/users?username=${username}`)
    .then((res) => res.data);
}

function createUser(user) {
  axios
    .post(`${SERVER_CONFIG.CONTEXT_PATH}/users`, user)
    .then((res) => res.data);
}

async function login(username, password) {
  try {
    const users = await getAllUsers();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid username or password" };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: error.message };
  }
}

async function register(username, password) {
  let data;
  await getUserByUsername(username)
    .then((user) => {
      if (user.length > 0) {
        throw new Error("Username already exists");
      }
      createUser({ username: username, password: password, role: "Student" });
      data = { success: true, message: "Registration successful" };
    })
    .catch((error) => {
      data = { success: false, message: error.message };
    });

  return data;
}

const AuthService = {
  login,
  register,
};
export default AuthService;
