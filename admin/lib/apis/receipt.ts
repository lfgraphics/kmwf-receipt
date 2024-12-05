import axios from "axios";
import { API_URL } from "../auth";
import { ReceiptDetails } from "@/types";
export const BASE_URL = API_URL;

export const fetchPublicReceipt = async (
  phoneNo: string,
  rectNo: string
): Promise<ReceiptDetails> => {
  const response = await axios.post<ReceiptDetails>(
    `${BASE_URL}/receipts/publicroute`,
    {
      phoneNo,
      rectNo,
    },
    {
      withCredentials: true,
    }
  );
  return response.data; // Return only the data field
};

