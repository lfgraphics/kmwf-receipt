export interface ReceiptDetails {
  _id?: string;
  name: string;
  mobile: string;
  address: string;
  amount: number;
  amountInWords: string;
  mad: "Zakat" | "Sadqa";
  subsType: "Mahana" | "Salana";
  modeOfPayment: "Online" | "Cash";
  paymentProof?: string | null;
  usoolKuninda: {
    name: string;
    phoneNo: string;
  };
  createdAt?: Date;
  receiptNumber?:number;
}
export interface UserData {
  _id: string;
  userid: string;
  name: string;
  phoneNo: string;
}

export interface DateOptions {
  year: "numeric" | "2-digit" | undefined;
  month: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
  day: "numeric" | "2-digit" | undefined;
  hour: "numeric" | "2-digit" | undefined;
  minute: "numeric" | "2-digit" | undefined;
  second: "numeric" | "2-digit" | undefined;
  hour12: boolean;
  timeZone: string;
}
