// =============================================
// SEPAY CONFIGURATION
// =============================================

// Bank account information for receiving payments
export const BANK_CONFIG = {
  bankId: 'MB', // MB Bank code
  bankName: 'MB Bank',
  accountNumber: '0342722059',
  accountName: 'MUSIC PREMIUM', // Display name
  template: 'compact2', // VietQR template
};

// Premium Plans
export const PREMIUM_PLANS = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    description: 'Unlimited music for 1 month',
    price: 2000, // 2,000 VND
    priceFormatted: '2.000₫',
    interval: 'month',
    intervalCount: 1,
    features: [
      'Ad-free music',
      'High quality audio',
      'Offline listening',
      'Unlimited skips',
    ],
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    description: 'Unlimited music for 1 year',
    price: 29000, // 29,000 VND
    priceFormatted: '29.000₫',
    interval: 'year',
    intervalCount: 1,
    popular: true, // Mark as popular plan
    saveText: 'Save 5.000₫',
    features: [
      'All Premium Monthly features',
      'Save 5.000₫ compared to monthly',
      'Priority support',
    ],
  },
] as const;

export type PlanId = typeof PREMIUM_PLANS[number]['id'];

// Function to generate unique transaction code
// Format: SP + [M/Y] + [8 characters from userId] + [timestamp base36]
// Only use letters and numbers to ensure compatibility with bank transfer content
export const generateTransactionCode = (userId: string, planId: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  // Remove hyphens from UUID to ensure code is alphanumeric only
  const userShort = userId.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `SP${planId.toUpperCase().slice(0, 1)}${userShort}${timestamp}`;
};

// Hàm tạo URL QR VietQR
export const generateVietQRUrl = (
  amount: number,
  transactionCode: string,
  description?: string
): string => {
  const { bankId, accountNumber, accountName, template } = BANK_CONFIG;
  const desc = description || `Premium ${transactionCode}`;
  
  // VietQR URL format
  const params = new URLSearchParams({
    accountNo: accountNumber,
    accountName: accountName,
    acqId: getBankBIN(bankId),
    amount: amount.toString(),
    addInfo: desc,
    template: template,
  });
  
  return `https://img.vietqr.io/image/${bankId}-${accountNumber}-${template}.png?${params.toString()}`;
};

// Lấy BIN code của ngân hàng
function getBankBIN(bankId: string): string {
  const bankBINs: Record<string, string> = {
    'MB': '970422',
    'VCB': '970436',
    'TCB': '970407',
    'ACB': '970416',
    'VPB': '970432',
    'TPB': '970423',
    'STB': '970403',
    'BIDV': '970418',
    'VTB': '970415',
    'OCB': '970448',
  };
  return bankBINs[bankId] || '970422';
}

// Hàm format tiền VND
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Thời gian hết hạn giao dịch (15 phút)
export const TRANSACTION_EXPIRY_MINUTES = 15;
