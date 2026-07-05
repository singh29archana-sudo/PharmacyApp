export interface Medicine {
  id: string;
  fullName: string;
  notes: string;
  expiryDate: string;
  quantity: number;
  price: number;
  brand: string;
}

export interface SaleRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  quantitySold: number;
  saleDate: string;
  priceAtSale: number;
}

export interface RecordSaleRequest {
  medicineId: string;
  quantitySold: number;
}
