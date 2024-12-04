import { DateOptions } from "./../types/index";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

export const frontendUrl = "http://localhost:3000"

export const imageToBase64 = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/jpeg;base64,${base64}`;
};

export const compressImage = async (uri: string): Promise<string> => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 500 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  const base64Image = await imageToBase64(manipulatedImage.uri);
  return base64Image;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: DateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  return new Intl.DateTimeFormat("en-IN", options).format(date);
};

export const generateQr = (data: string): string => {
  if (!data) {
    throw new Error("Data is required to generate a QR code");
  }
  return `https://api.qrserver.com/v1/create-qr-code/?size=1200x1200&margin=5&data=${encodeURIComponent(
    data
  )}`;
};
