export interface ReceiptDetails {
  name: string;
  mobile: string;
  address: string;
  amount: number;
  mad: "Zakat" | "Sadqa";
  subsType: "Mahana" | "Salana";
  modeOfPayment: "Online" | "Cash";
  paymentProof?: string | null;
  usoolKuninda: {
    name: string;
    userid: string;
    phoneNo: string;
  };
  createdAt?: Date;
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