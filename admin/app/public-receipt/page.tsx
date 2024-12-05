"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchPublicReceipt } from "@/lib/apis/receipt"; // Assuming you have an API utility
import { ReceiptDetails } from "@/types";
import { formatDate } from "@/lib/utils";

const QueryPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [receiptData, setReceiptData] = useState<ReceiptDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const phoneNo = searchParams.get("phoneNo");
  const rectNo = searchParams.get("rectNo");

  useEffect(() => {
    const fetchData = async () => {
      if (phoneNo && rectNo) {
        setIsLoading(true);
        setError(null);
        try {
          const receiptData = await fetchPublicReceipt(phoneNo, rectNo); // This now returns ReceiptDetails
          setReceiptData(receiptData); // Set the state with the data directly
        } catch (err) {
          setError("Failed to fetch receipt data. Please try again.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [phoneNo, rectNo]);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Receipt Information</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {receiptData && (
        <div>
          <p>
            <strong>Receipt ID:</strong> {receiptData.receiptNumber}
          </p>
          <p>
            <strong>Amount:</strong> ${receiptData.amount.toFixed(2)}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(receiptData.createdAt!)}
          </p>
          {/* Add more receipt details as needed */}
        </div>
      )}
      {!isLoading && !error && !receiptData && (
        <p>No receipt data found for the provided credentials.</p>
      )}
    </div>
  );
};

export default QueryPage;
