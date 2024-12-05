"use client";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/api";
// import FuelRecordCard from "@/components/FuelRecord";
import { isAuthenticated } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { ReceiptDetails } from "@/types";
// import { DispensesRecord } from "@/types";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Page({ params }: { params: { id: string } }) {
  // const checkAuth = () => {
  //   const authenticated = isAuthenticated();
  //   if (!authenticated) {
  //     window.location.href = "/login";
  //   }
  // };
  // useEffect(() => {
  //   checkAuth();
  // }, []);

  const [record, setRecord] = useState<ReceiptDetails>();
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/receipts/params.id}`
        );
        setRecord(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      // High-quality canvas rendering
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3, // Increase scale for better resolution
        useCORS: true, // Enable cross-origin for external images
        backgroundColor: null, // Preserve transparency
      });

      // Generate a high-quality PNG
      const dataUrl = canvas.toDataURL("image/png");
      const anchorTag = document.createElement("a");
      const fileName = `${record?.name} ${record?.receiptNumber} ${record?.subsType} ${record?.mad} ${record?.amount} ${record?.createdAt} ${record?._id}.png`;
      anchorTag.download = fileName;
      anchorTag.href = dataUrl;
      anchorTag.target = "_blank";
      anchorTag.click();
    } catch (error) {
      console.error("Error generating receipt image:", error);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("rct");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      // Get the Tailwind styles (from <link> and <style> tags)
      const styles = Array.from(
        document.querySelectorAll("style, link[rel='stylesheet']")
      )
        .map((node) => node.outerHTML)
        .join("\n");

      // Get the content of the target div
      const content = printContent.outerHTML;

      // Write the document in the new window
      printWindow.document.open();
      printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Receipt</title>
        ${styles}
      </head>
      <body onload="window.print(); window.close();">
        <div>${content}</div>
      </body>
      </html>
    `);
      printWindow.document.close();
    }
  };

  return (
    <div>
      {/* <FuelRecordCard record={record} /> */}
      <h1>Receipt Details</h1>
      {record && (
        <>
          <div className="relative h-[200px]">
            <div
              ref={receiptRef}
              id="rct"
              className="overlay top-0 left-0 right-0 bottom-0 h-[2in] w-full absolute text-black text-sm"
            >
              <span className="absolute bottom-[180px] text-[10px] w-full text-center">
                {record._id}
              </span>
              <span className="absolute top-[73px] right-[60px]">
                {record.receiptNumber}
              </span>
              <span className="absolute top-[89px] right-[26px]">
                {record.name}
              </span>
              <span className="absolute top-[108px] right-[26px]">
                {record.address}
              </span>
              <span className="absolute top-[128px] right-[26px]">
                {record.amountInWords}
              </span>
              <span className="absolute top-[128px] right-[160px] font-urdu">
                :{record.mad === "Sadqa" ? "صدقہ" : "زکات"}
              </span>
              <span className="absolute top-[128px] right-[200px] font-urdu">
                {record.subsType === "Mahana" ? "ماہانہ" : "سالانہ"}
              </span>
              <span className="absolute top-[129px] left-[40px]">
                {record.amount}
              </span>
              <span className="absolute text-xs w-[95px] text-center top-[149px] right-[36px]">
                {record.usoolKuninda.name}
              </span>
              <span className="absolute top-[150px] text-xs left-[140px]">
                {new Date(record.createdAt!).toLocaleDateString()}
              </span>
              <img
                className="h-[2in] w-full"
                src="/assets/images/media/receipt.jpg"
                alt="Receipt Image"
              />
              <img
                className="absolute bottom-1 left-4 w-11"
                src="https://upload.wikimedia.org/wikipedia/commons/0/00/Todd_Strasser_signature.png"
                alt="Director Sign"
              />
            </div>
          </div>
          <div className="flex w-full justify-around">
            <Button variant="default" onClick={handleDownload}>
              Download
            </Button>
            <Button variant="default" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
