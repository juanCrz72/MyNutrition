import axios from "axios";
import { BASE_URL } from "./config.js";

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al registrar usuario" };
  }
};

// En tu auth.api.js
export const completeRegister = async (registrationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/complete-register`, registrationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al completar el registro" };
  }
};