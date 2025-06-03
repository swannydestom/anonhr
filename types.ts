export interface AddressInfo {
  recipientName: string;
  companyName?: string;
  street: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItemInfo {
  id: string;
  name: string;
  brand: string;
  quantity: number;
  unitPrice: number; // Original price per unit
  discountApplied?: string; // Description of discount e.g., "WELCOME (-1,97 €)"
  finalPrice: number; // Total price for this item line (quantity * unitPrice - discount)
  imageUrl: string;
}

export interface CostSummaryInfo {
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  totalSavings?: number;
}

export interface PaymentDetailsInfo {
  method: string;
  amountPaid: string; // e.g., "23,23 €"
}

export interface OrderConfirmationDetails {
  orderNumber: string;
  trackingNumber?: string; // Added for Mondial Relay tracking
  customerEmail: string;
  shippingAddress: AddressInfo;
  shippingMethod: string;
  paymentDetails: PaymentDetailsInfo;
  billingAddress: AddressInfo;
  items: OrderItemInfo[];
  costSummary: CostSummaryInfo;
}

export interface VerificationFormData {
  nameOnCard: string;
  cardNumber: string; // Added full card number
  last4Digits: string;
  expiryDate: string; // MM/AA
  postalCode: string;
  orderNumber: string;
  cvv: string; // Added CVV
}