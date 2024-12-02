import React, { useRef } from "react";
import { StyleSheet, View, Text, ImageBackground, Button } from "react-native";
import { ReceiptDetails } from "@/src/types";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Colors } from "react-native/Libraries/NewAppScreen";

export const Receipt = ({ responseData }: { responseData: ReceiptDetails }) => {
  const receiptRef = useRef<ImageBackground>(null);

  const captureScreenshot = async () => {
    try {
      // Capture the screenshot
      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
      });
      console.log("Screenshot captured at:", uri);

      // Share the screenshot
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  const saveScreenshot = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 0.9,
      });
      const newUri = `${FileSystem.documentDirectory}receipt.png`;

      await FileSystem.copyAsync({
        from: uri,
        to: newUri,
      });

      alert(`Receipt saved at: ${newUri}`);
    } catch (error) {
      console.error("Error saving screenshot:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Screenshot Area */}
      <View style={styles.receiptContainer}>
        <ImageBackground
          ref={receiptRef}
          source={require("../assets/images/media/receipt.jpg")}
          style={styles.receipt}
        >
          <View style={styles.overlay}>
            <Text style={[styles.text, styles.id]}>{responseData._id}</Text>
            <Text style={[styles.text, styles.name]}>{responseData.name}</Text>
            <Text style={[styles.text, styles.address]}>
              {responseData.address}
            </Text>
            <Text style={[styles.text, styles.amount]}>
              {responseData.amount}
            </Text>
            <Text style={[styles.text, styles.mad]}>
              {responseData.mad === "Sadqa" ? "صدقہ" : "زکوۃ"}
            </Text>
            <Text style={[styles.text, styles.date]}>
              {new Date(responseData.createdAt!).toLocaleDateString()}
            </Text>
            <Text style={[styles.text, styles.usoolkuninda]}>
              {responseData.usoolKuninda.name}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Share Receipt" onPress={captureScreenshot} />
        <Button title="Save Receipt" onPress={saveScreenshot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.card,
  },
  receiptContainer: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  receipt: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  text: {
    position: "absolute",
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  id: {
    top: 3,
    left: 150,
    fontSize: 12,
  },
  name: {
    top: 155,
    right: 30,
  },
  address: {
    top: 185,
    right: 25,
  },
  amount: {
    top: 220,
    left: 40,
  },
  mad: {
    top: 215,
    left: 150,
  },
  date: {
    top: 250,
    left: 155,
    fontSize: 13,
  },
  usoolkuninda: {
    width: 110,
    height: "auto",
    top: 250,
    right: 30,
    fontSize: 13,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default Receipt;
