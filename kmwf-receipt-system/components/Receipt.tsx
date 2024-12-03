import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Button,
  Image,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { ReceiptDetails } from "@/src/types";
// import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
// import * as FileSystem from "expo-file-system";
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as Print from "expo-print";

export const Receipt = ({ responseData }: { responseData: ReceiptDetails }) => {
  // const [status, requestPermission] = MediaLibrary.usePermissions();
  const receiptRef = useRef<View>(null);

  const captureScreenshot = async () => {
    console.log("Starting screenshot capture");

    if (!receiptRef.current) {
      console.error("receiptRef is not set. Unable to capture screenshot.");
      return;
    }

    console.log("receiptRef is set, proceeding with capture...");

    try {
      // Adding a slight delay to ensure everything is rendered properly
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Delay completed, starting capture...");

      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
      });

      console.log("Screenshot captured at:", uri);

      if (await Sharing.isAvailableAsync()) {
        console.log("Sharing available. Proceeding with sharing...");
        await Sharing.shareAsync(uri);
      } else {
        console.error("Sharing is not available on this device.");
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  };

  const saveScreenshot = async () => {
    try {
      const localUri = await captureRef(receiptRef, {
        height: 440,
        width: 300,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const printReceipt = async () => {
    try {
      // Capture the view as an image
      const uri = await captureRef(receiptRef, {
        format: "png",
        quality: 1,
      });

      if (!uri) {
        throw new Error("Failed to capture screenshot.");
      }

      // Create HTML to print the image
      const htmlContent = `
      <html>
        <body>
          <img src="${uri}" style="width:100%;" />
        </body>
      </html>
    `;

      // Print the HTML with the embedded image
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error("Error printing receipt:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.receiptContainer}
        collapsable={false}
        ref={receiptRef}
      >
        <ImageBackground
          source={require("../assets/images/media/receipt.jpg")}
          style={styles.receipt}
        >
          <View style={styles.overlay}>
            <Text style={[styles.text, styles.id]}>{responseData._id}</Text>
            <Text style={[styles.text, styles.name]}>{responseData.name}</Text>
            <Text style={[styles.text, styles.receiptNumber]}>
              {responseData.receiptNumber}
            </Text>
            <Text style={[styles.text, styles.address]}>
              {responseData.address}
            </Text>
            <Text style={[styles.text, styles.amount]}>
              {responseData.amount}
            </Text>
            <Text style={[styles.text, styles.amountInWords]}>
              {responseData.amountInWords}
            </Text>
            <Text style={[styles.text, styles.mad]}>
              {responseData.mad === "Sadqa" ? "صدقہ" : "زکوٰۃ"}
            </Text>
            <Text style={[styles.text, styles.subsType]}>
              رکنیت: {responseData.subsType === "Mahana" ? "ماہانہ" : "سالانہ"}
            </Text>
            <Text style={[styles.text, styles.date]}>
              {new Date(responseData.createdAt!).toLocaleDateString()}
            </Text>
            <Text style={[styles.text, styles.usoolkuninda]}>
              {responseData.usoolKuninda.name}
            </Text>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/0/00/Todd_Strasser_signature.png",
              }}
              onError={(e) =>
                console.error(
                  "Error loading signature image:",
                  e.nativeEvent.error
                )
              }
              style={styles.signature}
            />
          </View>
        </ImageBackground>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Share Receipt" onPress={captureScreenshot} />
        <Button title="Save Receipt" onPress={saveScreenshot} />
        <Button title="Print Receipt" onPress={printReceipt} />
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
  signature: {
    width: 60,
    height: 40,
    position: "absolute",
    bottom: 15,
    left: 15,
  },
  text: {
    position: "absolute",
    color: "#000",
    fontSize: 16,
    fontWeight: "semibold",
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
  receiptNumber: {
    top: 131,
    left: 325,
  },
  address: {
    top: 185,
    right: 25,
  },
  amount: {
    top: 220,
    left: 40,
  },
  amountInWords: {
    top: 215,
    right: 25,
  },
  mad: {
    top: 220,
    left: 190,
  },
  subsType: {
    top: 220,
    left: 100,
  },
  date: {
    textAlign: "center",
    width: 70,
    top: 250,
    left: 155,
    fontSize: 13,
  },
  usoolkuninda: {
    textAlign: "center",
    width: 103,
    height: "auto",
    top: 250,
    right: 40,
    fontSize: 13,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default Receipt;
