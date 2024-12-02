import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import {
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

interface CameraComponentProps {
  onCapture: (base64: string) => void; // Callback to pass the image base64 data to parent
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState("");
  const [permission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        exif: false,
        base64: true,
        quality: 0.7,
      });
      setCapturedPhoto(photo?.base64?? "");
    }
  };

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const captureImage = async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true, // Include base64 data
        quality: 0.7, // 70% compression quality
      });
      onCapture(photo!.base64 ?? ""); // Send the base64 data back to the parent component
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting Camera Permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera.</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={cameraRef} // Correctly attaching the camera ref
        onCameraReady={() => setIsCameraReady(true)}
      />
      <Button title="Capture Image" onPress={captureImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: 400,
  },
});

export default CameraComponent;
