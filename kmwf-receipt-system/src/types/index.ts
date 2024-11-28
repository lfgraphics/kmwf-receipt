export interface ReceiptDetails {
  name: string;
  mobile: string;
  address: string;
  mad: "Zakat" | "Sadqa";
  subsType: "Mahana" | "Salana";
  modeOfPayment: "Online" | "Cash";
  paymentProof?: string;
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
