export interface Driver {
    Name: string;
    ITPLId: string | null;
    MobileNo?: Array<{
        MobileNo: string;
        IsDefaultNumber: boolean;
        LastUsed: boolean;
    }>;
}

export type FuelingTypes = 'Own' | 'Attatch' | 'Bulk Sale'

export interface Vehicle {
    vehicleNo: string;
    type: string;
    capacity: number;
    lastMaintenanceDate: Date;
    driverDetails: Driver;
}

export type BowserDriver = {
    id: string;
    name: string;
};

export type FuelingOrderData = {
    _id: string;
    bowserDriver: BowserDriver;
    driverId: string;
    driverMobile?: string;
    driverName: string;
    fuelQuantity: number;
    quantityType: "Full" | "Part";
    vehicleNumber: string;
    bowser: {
        regNo: string;
        driver: {
            id: string;
            name: string;
        }
    };
    allocationAdmin?: {
        name: string;
        id: string;
        allocationTime: string;
    };
};

export interface FuelNotificationProps {
    orderId: string;
    vehicleNumber: string;
    driverId: string;
    driverMobile: string;
    driverName: string;
    quantityType: "Part" | "Full";
    quantity: string;
    bowser: {
        regNo: string;
        driver: BowserDriver;
    };
    allocationAdmin: {
        name: string;
        id: string;
        allocationTime: string;
    };

}

export interface ReceiptDetails {
    name: string;
    mobile: string;
    address: string;
    dateTime: string;
    mad: 'Zakat' | 'Sadqa';
    subsType: string;
    modeOfPayment?: 'Online' | 'Cash';
    paymentProof: string;
    usoolKuninda: {
        name: string;
        id: string;
        phoneNo: string;
    }
}
export interface UserData {
    _id: string;
    userId: string;
    name: string;
    phoneNumber: string;
    verified: boolean;
    roles: Array<{
        name: string;
        permissions: {
            apps: Array<{
                name: string;
                access: 'read' | 'write' | 'admin' | null;
            }>;
            functions: Array<{
                name: string;
                allowed: boolean | null;
            }>;
            customPermissions: {
                canAccessUI: boolean;
                [key: string]: any;
            };
        };
    }>;
}

export interface TripSheet {
    tripSheetId: string;
    settelment: {
        settled: boolean;
    };
    // Add any other fields from your TripSheet schema that you might need
};