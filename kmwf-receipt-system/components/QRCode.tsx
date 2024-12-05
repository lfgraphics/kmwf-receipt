import React from "react";
import {
  Modal,
  Image,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  Alert,
  View,
} from "react-native";
import * as Linking from "expo-linking";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useTheme } from "@react-navigation/native";
import { frontendUrl, generateQr } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { ReceiptDetails } from "@/src/types";

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  responseData: ReceiptDetails;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  responseData,
}) => {
  const url = `${frontendUrl}/public-receipt/${responseData._id}`;
  const qrCodeUrl = `${generateQr(url)}`;

  const { colors } = useTheme();

  const copyToClipboard = () => {
    Clipboard.setString(url);
    Alert.alert(
      "Copied to Clipboard",
      "The URL has been copied to your clipboard."
    );
  };

  const openInBrowser = () => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Failed to open URL in browser.");
    });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <ThemedView
        style={[styles.overlay, { backgroundColor: colors.background }]}
      >
        <ThemedView
          style={[styles.modalContainer, { backgroundColor: colors.card }]}
        >
          <ThemedText style={styles.title}>Scan to get your Receipt</ThemedText>
          <Image source={{ uri: qrCodeUrl }} style={styles.qrCodeImage} />
          <ThemedView style={styles.receiptData}>
            <ThemedText>ID: {responseData._id}</ThemedText>
            <ThemedText>
              Receipt Number (Sequence): {responseData.receiptNumber}
            </ThemedText>
          </ThemedView>
          <View style={styles.row}>
            <ThemedText style={styles.urlText}>
              {url.substring(0, 28) + "..."}
            </ThemedText>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}
            >
              <Ionicons name="copy" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.visitButton}
              onPress={openInBrowser}
            >
              <ThemedText style={styles.buttonText}>
                Visit in Browser
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <ThemedText style={styles.closeText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default QRCodeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  receiptData: {
    width: "95%",
    alignItems: "center",
    flexDirection: "column",
    gap: 3,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  urlText: {
    fontSize: 14,
    color: "#0a7ea4",
    marginBottom: 20,
    textAlign: "center",
  },
  copyButton: {
    flexDirection: "row",
    gap: 3,
    backgroundColor: "#0a7ea4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  visitButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#f44336",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});
