import axios from "axios";
import { User, LoginResponse, SignupResponse } from "../types/auth";

export const API_URL = "http://localhost:4000"; //https://kmwf-receipt-system.onrender.com

export async function login(
  phoneNo: string,
  pas: string
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      { phoneNo, pas, isWeb: true }, // Add `isWeb` to signal web client
      { withCredentials: true } // Include cookies in requests
    );

    // Store only non-sensitive data like user details (if needed)
    localStorage.setItem("adminUser", JSON.stringify(response.data.user));
    localStorage.setItem("isLoggedIn", "true");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("adminUser");
  localStorage.setItem("isLoggedIn", "false");
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false;
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("adminUser");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
}

export async function signup(userData: {
  pas: string;
  name: string;
  phoneNo: string;
}): Promise<SignupResponse> {
  try {
    const response = await axios.post<SignupResponse>(
      `${API_URL}/auth/signup`,
      userData
    );
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error("Signup failed");
  } catch (error) {
    throw error;
  }
}
