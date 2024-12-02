import * as React from "react";
import "../../global.css";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { ReceiptDetails, UserData } from "@/src/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "@/src/utils/authUtils";
import { compressImage, formatDate } from "@/src/utils";

export default function App() {
  // declare state variables---->
  const colorScheme = useColorScheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<ReceiptDetails | null>(null);
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setaddress] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [subsType, setSubsType] = useState<"Mahana" | "Salana">("Mahana");
  const [mad, setMad] = useState<"Sadqa" | "Zakat">("Sadqa");
  const [modeOfPayment, setModeOfPayment] = useState<"Online" | "Cash">("Cash");
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // declare refs for input fields---->
  const nameInputRef = React.useRef<TextInput>(null);
  const amountInputRef = React.useRef<TextInput>(null);
  const mobileInputRef = React.useRef<TextInput>(null);
  const addressInputRef = React.useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // function declarations---->
  // startup function

  useEffect(() => {
    const getUserData = async () => {
      const userDataString = await AsyncStorage.getItem("userData");
      const token = await AsyncStorage.getItem("userToken");
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
      if (token) {
        setUserToken(token);
      }
    };
    getUserData();
  }, []);

  const submitDetails = async () => {
    setFormSubmitting(true);
    if (!validateInputs()) {
      setFormSubmitting(false);
      return;
    }
    await submitFormData();
  };

  const submitFormData = async () => {
    if (!userData) {
      Alert.alert("Error", "User data not found. Please log in again.");
      router.replace("/auth");
      return;
    }

    const formData: ReceiptDetails = {
      name,
      mobile,
      address,
      amount,
      mad,
      subsType,
      modeOfPayment,
      paymentProof,
      usoolKuninda: {
        name: userData.name,
        userid: userData.userid,
        phoneNo: userData.phoneNo,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/receipts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setResponseData(responseData.receipt);
      Alert.alert(
        responseData.title,
        responseData.message,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
      setModalVisible(true);
      console.log(responseData);
      resetForm();
    } catch (err) {
      console.error("Fetch error:", err);
      let errorMessage = "An unknown error occurred";

      if (err instanceof Response) {
        try {
          const errorData = await err.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      Alert.alert(
        "Error",
        errorMessage,
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const openCamera = async () => {
    if (paymentProof) {
      return;
    }
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const compressedImage = await compressImage(result.assets[0].uri);
      setPaymentProof(compressedImage);
    }
  };

  const resetForm = () => {};
  const validateInputs = () => {
    if (!name) {
      alert("Name is required.");
      return false;
    }
    return true;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View
          style={[styles.formContainer, { backgroundColor: colors.background }]}
        >
          <View style={styles.rowContainer}>
            <ThemedText type="title">KMWF Reciept</ThemedText>
          </View>
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <ThemedText>Name</ThemedText>
              <TextInput
                ref={nameInputRef}
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter Name"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9BA1A6" : "#687076"
                }
                value={name}
                onChangeText={(text) => {
                  setName(text);
                }}
                returnKeyType="next"
                onSubmitEditing={() => mobileInputRef.current?.focus()}
              />
            </View>
            <View style={styles.inputContainer}>
              <ThemedText>Mobile</ThemedText>
              <TextInput
                ref={mobileInputRef}
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter Mpbile Number"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9BA1A6" : "#687076"
                }
                value={mobile}
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={(text) => {
                  setMobile(text);
                }}
                returnKeyType="next"
                onSubmitEditing={() => addressInputRef.current?.focus()}
              />
            </View>
            <View style={styles.inputContainer}>
              <ThemedText>Address</ThemedText>
              <TextInput
                ref={addressInputRef}
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter Address"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9BA1A6" : "#687076"
                }
                value={address}
                keyboardType="default"
                lineBreakStrategyIOS="standard"
                numberOfLines={4}
                onChangeText={(text) => {
                  setaddress(text);
                }}
                returnKeyType="next"
                onSubmitEditing={() => amountInputRef.current?.focus()}
              />
            </View>
            <View style={styles.inputContainer}>
              <ThemedText>Amount</ThemedText>
              <TextInput
                ref={amountInputRef}
                style={[styles.input, { color: colors.text }]}
                placeholder="5000"
                keyboardType="number-pad"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9BA1A6" : "#687076"
                }
                value={String(amount)}
                onChangeText={(text) => {
                  setAmount(Number(text));
                }}
                returnKeyType="next"
                onSubmitEditing={() => mobileInputRef.current?.focus()}
              />
            </View>
            <View style={styles.inputContainer}>
              <ThemedText>Mad</ThemedText>
              <Picker
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                  },
                ]}
                selectedValue={mad}
                onValueChange={(itemValue) => {
                  setMad(itemValue);
                }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Sadqa" value="Sadqa" />
                <Picker.Item label="Zakat" value="Zakat" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <ThemedText>Subscription Type</ThemedText>
              <Picker
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                  },
                ]}
                selectedValue={subsType}
                onValueChange={(itemValue) => {
                  setSubsType(itemValue);
                }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Mahana" value="Mahana" />
                <Picker.Item label="Salana" value="Salana" />
              </Picker>
            </View>
            <View style={styles.inputContainer}>
              <ThemedText>Mod of Payment</ThemedText>
              <Picker
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                  },
                ]}
                selectedValue={modeOfPayment}
                onValueChange={(itemValue) => {
                  setModeOfPayment(itemValue);
                }}
                dropdownIconColor={colors.text}
              >
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Online" value="Online" />
              </Picker>
            </View>
            {modeOfPayment == "Online" && paymentProof && (
              <Image
                source={{ uri: `${paymentProof}` }}
                style={styles.uploadedImage}
              />
            )}
            {modeOfPayment == "Online" && !paymentProof && (
              <TouchableOpacity
                onPress={() => paymentProof === null && openCamera()}
                style={[styles.photoButton]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ThemedText style={{ color: "white" }}>Take Photo</ThemedText>
                </View>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={submitDetails}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
              <Ionicons name="send-outline" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <ThemedText
                style={[styles.resetButtonText, { color: colors.text }]}
              >
                Reset
              </ThemedText>
              <Ionicons name="refresh-outline" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {formSubmitting && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: colors.text }}>Close</Text>
          </TouchableOpacity>
          {responseData && (
            <Text style={{ color: colors.text }}>
              Created at: {formatDate(String(responseData.createdAt))}
            </Text>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  profileButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  navContainer: {
    paddingVertical: 10,
    borderRadius: 5,
    // backgroundColor: '#151718',
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  navButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: 90,
    alignItems: "center",
    textAlign: "center",
  },
  activeButton: {
    backgroundColor: "#0a7ea4",
  },
  containerTitles: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  resetButton: {
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  resetButtonText: {
    fontWeight: "bold",
    textAlign: "center",
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
  imageUploadContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  uploadButton: {
    backgroundColor: "#0a7ea4",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  uploadedImage: {
    borderBlockColor: "white",
    borderWidth: 1,
    width: 350,
    minHeight: 150,
    maxHeight: 250,
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 4,
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
  photoButton: {
    backgroundColor: "#0a7ea4",
    padding: 12,
    borderRadius: 4,
    marginVertical: 20,
    alignItems: "center",
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
  pickerContainer: {
    marginBottom: 8,
    textAlign: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  driverItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  closeButton: {
    padding: 10,
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quarterInput: {
    flex: 0.3,
    marginRight: 4,
  },
  threeQuarterInput: {
    flex: 0.7,
    marginLeft: 4,
  },
  imageSizeText: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 12,
  },
  vehicleItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 15,
  },
  modalTitle: {
    margin: 10,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalScrollView: {
    maxHeight: "70%",
  },
  modalBody: {
    padding: 15,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    marginLeft: 10,
  },
  closeButtonText: {
    color: "#0a7ea4",
    fontSize: 16,
  },
});
