"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReceiptDetails } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import Loading from "../loading";
import { Eye} from "lucide-react";
import { BASE_URL } from "@/lib/api";
import { Toaster } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";

const VehicleDispensesPage = () => {
  const [records, setRecords] = useState<ReceiptDetails[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [filter, setFilter] = useState({
    bowserNumber: "",
    driverName: "",
    tripSheetId: "",
    verified: "all",
    vehicleNo: "",
  });
  const [sortBy, setSortBy] = useState("fuelingDateTime");
  const [order, setOrder] = useState("desc");
  const [localBowserNumber, setLocalBowserNumber] = useState("");
  const [localDriverName, setLocalDriverName] = useState("");
  const [localTripSheetId, setLocalTripSheetId] = useState("");
  const [localVehicleNo, setLocalVehicleNo] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("all");

  const checkAuth = () => {
    const authenticated = isAuthenticated();
    if (!authenticated) {
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [currentPage, sortBy, order, filter, limit, verificationStatus, category]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/receipts`, {
        params: {
          page: currentPage,
          limit: limit,
          //    sortBy,
          //    order,
        },
        withCredentials: true, // Include cookies in the request
      });

      console.log(response);

      setRecords(response.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <Loading />}
      <Toaster />
      {/* <div className="bigScreen bg-background z-10 hidden lg:block sticky top-0 pt-[60px] pb-2">
        <div className="mb-4 flex flex-col gap-3 justify-between  sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex items-center justify-between border rounded p-2 w-full">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fuelingDateTime">
                Sort by Fueling Time
              </SelectItem>
              <SelectItem value="vehicleNumber">
                Sort by Vehicle Number
              </SelectItem>
              <SelectItem value="bowser.regNo">
                Sort by Bowser Number
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={order} onValueChange={setOrder}>
            <SelectTrigger className="flex items-center justify-between border rounded p-2  w-full">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setVerificationStatus}>
            <SelectTrigger className="flex items-center justify-between border rounded p-2 w-full">
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setCategory}>
            <SelectTrigger className="flex items-center justify-between border rounded p-2 w-full">
              <SelectValue className="text-muted" placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Own">Own</SelectItem>
              <SelectItem value="Attatch">Attatch</SelectItem>
              <SelectItem value="Bulk Sale">Bulk Sale</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between min-w-[200px]">
            Records limit{" "}
            <Input
              type="number"
              className="w-20 ml-4"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            ></Input>{" "}
          </div>
        </div>
        <div className="mb-4 flex flex-col justify-between sm:flex-row flex-wrap gap-3 sm:space-x-2 space-y-2 sm:space-y-0">
          <Input
            placeholder="Filter by Bowser Number"
            value={localBowserNumber}
            onChange={(e) => setLocalBowserNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter({ ...filter, bowserNumber: localBowserNumber });
              }
            }}
            className="w-full sm:w-auto"
          />
          <Input
            placeholder="Filter by Driver Name"
            value={localDriverName}
            onChange={(e) => setLocalDriverName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter({ ...filter, driverName: localDriverName });
              }
            }}
            className="w-full sm:w-auto"
          />
          <div className="flex items-center justify-between">
            <Input
              placeholder="Filter by Trip Sheet Id/ Number"
              value={localTripSheetId}
              onChange={(e) => setLocalTripSheetId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setFilter({ ...filter, tripSheetId: localTripSheetId });
                }
              }}
              className="w-full sm:w-auto"
            />
          </div>
          <div className="flex items-center justify-between">
            <Input
              placeholder="Filter by Vehicle Number"
              value={localVehicleNo}
              onChange={(e) => setLocalVehicleNo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setFilter({ ...filter, vehicleNo: localVehicleNo });
                }
              }}
              className="w-full sm:w-auto"
            />
          </div>
          <div className="flex items-center justify-between text-muted-foreground font-[200]">
            {records.length} out of {totalRecords} records{" "}
          </div>
        </div>
      </div> */}
      {/* <Accordion
        type="single"
        collapsible
        className="block lg:hidden smallScreen bg-background z-10 top-0 py-2"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Filters and sorting</AccordionTrigger>
          <AccordionContent>
            <div className="mb-4 flex flex-col sm:flex-row flex-wrap sm:space-x-2 space-y-2 sm:space-y-0 w-full">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex items-center justify-between border rounded p-2  w-full self-center">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fuelingDateTime">
                    Sort by Fueling Time
                  </SelectItem>
                  <SelectItem value="vehicleNumber">
                    Sort by Vehicle Number
                  </SelectItem>
                  <SelectItem value="bowser.regNo">
                    Sort by Bowser Number
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={order} onValueChange={setOrder}>
                <SelectTrigger className="flex items-center justify-between border rounded p-2 w-full self-center">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setVerificationStatus}>
                <SelectTrigger className="flex items-center justify-between border rounded p-2 w-full self-center">
                  <SelectValue placeholder="Verification Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setCategory}>
                <SelectTrigger className="flex items-center justify-between border rounded p-2 w-full">
                  <SelectValue
                    className="text-muted"
                    placeholder="Fueling Type"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Own">Own</SelectItem>
                  <SelectItem value="Attatch">Attatch</SelectItem>
                  <SelectItem value="Bulk Sale">Bulk Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4 flex flex-col gap-3 justify-between sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 flex-wrap">
              <Input
                placeholder="Filter by Bowser Number"
                value={localBowserNumber}
                onChange={(e) => setLocalBowserNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilter({
                      ...filter,
                      bowserNumber: localBowserNumber,
                    });
                  }
                }}
                className="w-full sm:w-auto"
              />
              <Input
                placeholder="Filter by Driver Name"
                value={localDriverName}
                onChange={(e) => setLocalDriverName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilter({ ...filter, driverName: localDriverName });
                  }
                }}
                className="w-full sm:w-auto"
              />
              <Input
                placeholder="Filter by Vehicle Number"
                value={localVehicleNo}
                onChange={(e) => setLocalVehicleNo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilter({ ...filter, vehicleNo: localVehicleNo });
                  }
                }}
                className="w-full sm:w-auto"
              />
              <Input
                placeholder="Filter by Trip Sheet Id/ Number"
                value={localTripSheetId}
                onChange={(e) => setLocalTripSheetId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setFilter({ ...filter, tripSheetId: localTripSheetId });
                  }
                }}
                className="w-full sm:w-auto"
              />
              <div className="flex items-center justify-between min-w-[200px] max-w-full">
                Records limit{" "}
                <Input
                  type="number"
                  className="w-20"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                ></Input>{" "}
              </div>
              <div className="flex items-center justify-between text-gray-300 font-[200]">
                Total found record{records.length > 1 ? "s" : ""}{" "}
                {records.length} out of {totalRecords} records{" "}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S N</TableHead>
            <TableHead>Receipt No</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Mad</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>in Words</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Addres</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone No.</TableHead>
            <TableHead>Usool Kuninda</TableHead>
            <TableHead>WK Mo.</TableHead>
            <TableHead>View More</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-[50%] overflow-y-scroll">
          {records.length > 0 &&
            records.map((record, index) => (
              <TableRow
                key={index}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{record.receiptNumber}</TableCell>
                <TableCell>{record.modeOfPayment}</TableCell>
                <TableCell>{record.mad}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{record.amountInWords}</TableCell>
                <TableCell>{`${formatDate(record.createdAt!)}`}</TableCell>
                <TableCell>
                  {record.address?.substring(0, 15) + "..."}
                </TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.mobile}</TableCell>
                <TableCell>{record.usoolKuninda.name}</TableCell>
                <TableCell>{record.usoolKuninda.phoneNo}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  <Link href={`/dispense-records/${record._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Eye />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          {/* Calculate total fuel quantity if filtered by tripSheetId */}
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">
              Total:
            </TableCell>
            <TableCell colSpan={9}>
              ₹{" "}
              {records
                .reduce((total, record) => total + Number(record.amount), 0)
                .toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
        <TableCaption>
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </TableCaption>
      </Table>
    </div>
  );
};

export default VehicleDispensesPage;
