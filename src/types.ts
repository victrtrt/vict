export type UserRole = 'visitor' | 'senior' | 'admin';

export type Province = 'کابل' | 'هرات' | 'مزارشریف' | 'قندهار' | 'ننگرهار' | 'غزنی' | 'کندز' | 'خوست';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  province: Province;
}

export interface OrderItem {
  productId: string;
  productName: string;
  dozenCount: number;
  wholesalePrice: number;
  retailPrice: number;
  totalAmount: number;
  deliveryDate: string;
}

export interface CompetitorReport {
  brandName: string;
  price: number;
  sellerRating: number;
  marginToCenter: number;
}

export interface VisitReport {
  id?: string;
  visitorId: string;
  visitorEmail: string;
  visitorName: string;
  visitDate: string;
  enterTime: string;
  exitTime: string;
  province: Province;
  area: string;
  locationName: string;
  businessType: string;
  contactPerson: string;
  customerPhone: string;
  visitStatus: 'موفق' | 'ناموفق' | 'نیاز به پیگیری';
  visitResult: 'ثبت شد' | 'نیاز به پیگیری' | 'علاقه مند نبود' | 'حضور نداشت' | 'محصول رقیب دارد' | 'در آینده همکاری می‌کند';
  orders: OrderItem[];
  totalOrderAmount: number;
  customerFeedback: 'ضعیف' | 'متوسط' | 'عالی';
  centerCategoryLevel: 'ضعیف' | 'متوسط' | 'عالی';
  remarks: string;
  gpsLocation?: { lat: number; lng: number } | string;
  competitorReport?: CompetitorReport;
  photoUrl?: string;
  lowSellingItemsCount: number;
  highSellingItemsCount: number;
  averageOrder: number;
  followUpDate?: string;
  followUpDays?: 7 | 14 | 30;
  createdAt: string;
}
