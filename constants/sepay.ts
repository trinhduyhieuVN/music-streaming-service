// =============================================
// SEPAY CONFIGURATION
// =============================================

// Thông tin tài khoản ngân hàng nhận thanh toán
export const BANK_CONFIG = {
  bankId: 'MB', // Mã ngân hàng MB Bank
  bankName: 'MB Bank',
  accountNumber: '0342722059',
  accountName: 'MUSIC PREMIUM', // Tên hiển thị
  template: 'compact2', // Template QR VietQR
};

// Gói Premium
export const PREMIUM_PLANS = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    description: 'Nghe nhạc không giới hạn trong 1 tháng',
    price: 2000, // 2,000 VND
    priceFormatted: '2.000₫',
    interval: 'month',
    intervalCount: 1,
    features: [
      'Nghe nhạc không quảng cáo',
      'Phát nhạc chất lượng cao',
      'Nghe offline',
      'Bỏ qua bài không giới hạn',
    ],
  },
  {
    id: 'yearly',
    name: 'Premium Yearly',
    description: 'Nghe nhạc không giới hạn trong 1 năm',
    price: 29000, // 29,000 VND
    priceFormatted: '29.000₫',
    interval: 'year',
    intervalCount: 1,
    popular: true, // Đánh dấu gói phổ biến
    saveText: 'Tiết kiệm 5.000₫',
    features: [
      'Tất cả tính năng Premium Monthly',
      'Tiết kiệm 5.000₫ so với mua theo tháng',
      'Ưu tiên hỗ trợ',
    ],
  },
] as const;

export type PlanId = typeof PREMIUM_PLANS[number]['id'];

// Hàm tạo mã giao dịch unique
export const generateTransactionCode = (userId: string, planId: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const userShort = userId.slice(0, 8).toUpperCase();
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
