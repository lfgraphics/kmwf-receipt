"use client";
import { BASE_URL } from "@/lib/api";
// import FuelRecordCard from "@/components/FuelRecord";
import { isAuthenticated } from "@/lib/auth";
import { ReceiptDetails } from "@/types";
// import { DispensesRecord } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const Page = ({ params }: { params: { id: string } }) => {
  //   const checkAuth = () => {
  //     const authenticated = isAuthenticated();
  //     if (!authenticated) {
  //       window.location.href = "/login";
  //     }
  //   };
  //   useEffect(() => {
  //     checkAuth();
  //   }, []);

  const [record, setRecord] = useState<ReceiptDetails>();
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://192.168.137.1:4000/receipts/${params.id}`
        );
        setRecord(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);
  return (
    <div>
      {/* <FuelRecordCard record={record} /> */}
      <h1>Receipt Details</h1>
      {/* {record && ( */}
      <>
        <div className="h-full w-full">
          <img
            className="h-[2in] w-full"
            src="https://kmwf-admin.vercel.app/assets/images/media/receipt.jpg"
            alt="check"
          />
        </div>
      </>
      {/* //   )} */}
    </div>
  );
};

export default Page;
