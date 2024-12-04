import * as React from "react";
import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { baseUrl } from "@/src/utils/authUtils";

export default function AuthScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const [isLogin, setIsLogin] = useState(true);
  const [pas, setPassword] = useState("");
  const [phoneNo, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const nameInputRef = useRef<TextInput>(null);
  const phoneNumberInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleAuth = async () => {
    setIsLoading(true);
    if (!validateInputs()) {
      setIsLoading(false);
      return;
    }

    try {
      const body = JSON.stringify({
        name: isLogin ? undefined : name,
        phoneNo,
        pas,
      });

      const endpoint = isLogin ? "login" : "signup";
      const response = await fetch(`${baseUrl}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: body,
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          "Error",
          data.message || "An error occurred",
          [{ text: "OK" }],
          { cancelable: false }
        );
        throw new Error(data.message || "An error occurred");
      }

      if (!isLogin) {
        Alert.alert(
          "Signup Successful",
          "Your account has been created successfully. Please wait for admin verification.",
          [{ text: "OK" }],
          { cancelable: false }
        );
        setIsLogin(true);
        setIsLoading(false);
        return;
      }

      // Login process
      if (data.token) {
        try {
          await AsyncStorage.setItem("userToken", data.token);
          await AsyncStorage.setItem("isLoggedIn", "true");
          if (data.loginTime) {
            await AsyncStorage.setItem("loginTime", data.loginTime);
          }
          if (data.user) {
            await AsyncStorage.setItem("userData", JSON.stringify(data.user));
          }
          router.replace("/");
        } catch (storageError) {
          console.error("Error saving to AsyncStorage:", storageError);
          Alert.alert(
            "Storage Error",
            "Failed to save user data. Please try again.",
            [{ text: "OK" }]
          );
        }
      } else {
        Alert.alert(
          "Error",
          "Login failed. Please try again.",
          [{ text: "OK" }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Authentication Error",
        (error instanceof Error ? error.message : String(error)) ||
          (isLogin
            ? "Login failed. Please try again."
            : "Signup failed. Please try again."),
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!isLogin) {
      if (!name) {
        alert("Name is required.");
        nameInputRef.current?.focus();
        return false;
      }
    }
    if (!phoneNo) {
      alert("Phone number is required.");
      phoneNumberInputRef.current?.focus();
      return false;
    }
    if (!pas) {
      alert("Password is required.");
      passwordInputRef.current?.focus();
      return false;
    }

    // Check if Phone Number is in the format +1234567890 (optional + and 10-13 digits)
    const isValidPhoneNumber = /^\+?\d{10,13}$/; // Example: "+1234567890" is valid, "123456789" is valid, "123456" is not
    if (!isLogin && !isValidPhoneNumber.test(phoneNo)) {
      Alert.alert(
        "Enter Correct Details",
        "Invalid Phone Number format. Phone Number should be in the format +1234567890.",
        [{ text: "Okay", onPress: () => phoneNumberInputRef.current?.focus() }],
        { cancelable: false }
      );
      return false;
    }

    // Check if Name contains only letters and spaces
    const isValidName = /^[a-zA-Z ]+$/; // Example: "John Doe" is valid, "John!Doe" is not
    if (!isLogin && !isValidName.test(name)) {
      Alert.alert(
        "Enter Correct Details",
        "Invalid Name format. Name should only contain letters and spaces.",
        [{ text: "Okay", onPress: () => nameInputRef.current?.focus() }],
        { cancelable: false }
      );
      return false;
    }
    return true;
  };

  return (
    <View style={[styles.container, styles.main]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.formContainer}>
          <View style={{ height: 60 }} />
          <Text style={[styles.title, { color: colors.text }]}>
            {isLogin ? "Login" : "Sign Up"}
          </Text>

          <View style={styles.section}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={{ color: colors.text }}>Name:</Text>
                <TextInput
                  ref={nameInputRef}
                  style={[
                    styles.input,
                    { color: colorScheme === "dark" ? "#ECEDEE" : "#11181C" },
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9BA1A6" : "#687076"
                  }
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                  onSubmitEditing={() => phoneNumberInputRef.current?.focus()}
                  blurOnSubmit={true}
                />
              </View>
            )}
            <View style={styles.inputContainer}>
              <Text style={{ color: colors.text }}>Phone Number:</Text>
              <TextInput
                ref={phoneNumberInputRef}
                style={[
                  styles.input,
                  { color: colorScheme === "dark" ? "#ECEDEE" : "#11181C" },
                ]}
                placeholder="Enter phone number"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9BA1A6" : "#687076"
                }
                value={phoneNo}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={{ color: colors.text }}>{!isLogin ? "Create a new" : "Enter your" } password:</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={passwordInputRef}
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { color: colorScheme === "dark" ? "#ECEDEE" : "#11181C" },
                  ]}
                  placeholder="Enter password"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9BA1A6" : "#687076"
                  }
                  value={pas}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType={isLogin ? "done" : "next"}
                  onSubmitEditing={handleAuth}
                  blurOnSubmit={isLogin}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color={colorScheme === "dark" ? "#9BA1A6" : "#687076"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
            <Text style={styles.submitButtonText}>
              {isLogin ? "Login" : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? "Need an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "dark",
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#0a7ea4",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 16,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#0a7ea4",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    padding: 10,
    position: "absolute",
    right: 0,
  },
});
