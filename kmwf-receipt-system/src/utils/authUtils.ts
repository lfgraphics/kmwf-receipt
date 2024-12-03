// import { registerForPushNotificationsAsync } from '@/app/utils/notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const baseUrl = "http://192.168.137.1:4000"; //http://192.168.177.228:4000 // https://kmwf-receipt-system.onrender.com //192.168.177.228 //192.168.137.1

export const checkUserLoggedIn = async () => {
  try {
    const isOnline = await checkInternetConnection();

    if (!isOnline) {
      return true; // Assume logged in for offline mode
    }

    const response = await fetch(`${baseUrl}/auth/verify-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.message === "Invalid or expired token") {
        // Trigger logout or token refresh process
        logoutUser();
      }
      Alert.alert(
        "Authentication Error",
        errorData.message || "Invalid session"
      );
      return false;
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    Alert.alert("Error checking login status", `${error}`);
    return false;
  }
};

const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://www.google.com", {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const loginUser = async (
  userId: string,
  password: string
): Promise<void> => {
  try {
    const deviceUUID = await AsyncStorage.getItem("deviceUUID");
    const response = await fetch(
      "https://bowser-backend-2cdr.onrender.com/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          password,
          deviceUUID,
          appName: "Bowsers Fueling",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    await AsyncStorage.setItem("userToken", data.token);
    await AsyncStorage.setItem("loginTime", data.loginTime);
    await AsyncStorage.setItem("userData", JSON.stringify(data.user));
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const signupUser = async (
  email: string,
  password: string
): Promise<void> => {
  // Implement your signup logic here
  // This could involve making an API call to your backend
  console.log("Signing up with:", email, password);
};

export const logoutUser = async (): Promise<void> => {
  // Remove push token from AsyncStorage on logout
  await AsyncStorage.removeItem("pushToken");
  await AsyncStorage.removeItem("UserData");
};
