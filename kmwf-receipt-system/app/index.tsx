import * as React from "react";
import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { checkUserLoggedIn } from "../src/utils/authUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const App = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    userId: string;
  } | null>(null);

  const { colors } = useTheme();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userData");
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        }

        if (!checkUserLoggedIn) {
          router.replace("/auth" as any);
          return;
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        setError(
          "An error occurred while initializing the app. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  const handleLogout = async () => {
    try {
      const userConfirmed = await new Promise((resolve) => {
        Alert.alert(
          "Logout Confirmation",
          "Are you sure you want to logout?",
          [
            { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
            { text: "Logout", onPress: () => resolve(true) },
          ],
          { cancelable: false }
        );
      });

      if (!userConfirmed) return;
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("pushToken");
      router.replace("/auth" as any);
    } catch (error) {
      Alert.alert(
        "Logout Error",
        "An error occurred during logout. Please try again."
      );
    }
  };

  const renderUserData = () => {
    if (!userData) return null;

    return (
      <View style={[styles.modalBody, { backgroundColor: colors.card }]}>
        {Object.entries(userData)
          .filter(([key]) => key !== "_id")
          .map(([key, value]) => (
            <View key={key} style={styles.dataRow}>
              <Text style={[styles.dataKey, { color: colors.text }]}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
              </Text>
              <Text style={[styles.dataValue, { color: colors.text }]}>
                {String(value)}
              </Text>
            </View>
          ))}
      </View>
    );
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setProfileModalVisible(true)}
      >
        <Ionicons name="person-circle-outline" size={32} color="#0a7ea4" />
      </TouchableOpacity>

      <Link style={styles.button} href={"/screens/receipt"}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white" }}>Create Receipt</Text>
        </View>
      </Link>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Profile
              </Text>
            </View>
            <ScrollView
              style={[styles.modalScrollView, { backgroundColor: colors.card }]}
            >
              {renderUserData()}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => handleLogout()}
              >
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "dark",
    height: 80,
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#0a7ea4",
    borderRadius: 5,
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 20,
    color: "white",
  },
  disabledButton: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "gray",
    borderRadius: 5,
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 20,
    color: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  profileButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  dataRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  dataKey: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dataValue: {
    fontSize: 16,
    color: "#666",
  },
  offlineDataButton: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  offlineDataButtonText: {
    color: "white",
    fontSize: 16,
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
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#0a7ea4",
    fontSize: 16,
  },
  buttonText: {
    color: "white",
  },
  accordion: {
    // marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0a7ea4",
  },
  accordionContent: {
    padding: 10,
  },
  dataImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginVertical: 5,
  },
  bowserDriverItem: {
    marginLeft: 10,
    marginBottom: 5,
    borderLeftWidth: 2,
    borderLeftColor: "#0a7ea4",
    paddingLeft: 5,
  },
  submitButton: {
    backgroundColor: "#0a7ea4",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default App;
