import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MultiProductSelector } from './MultiProductSelector';
import { submitVisitReport } from '../../services/syncService';
import { VisitReport, OrderItem, CompetitorReport, Province } from '../../types';

export const VisitReportForm: React.FC = () => {
  const { currentUser } = useAuth();

  // وضعیت‌های فرم
  const [visitDate, setVisitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [enterTime, setEnterTime] = useState<string>('');
  const [exitTime, setExitTime] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('فروشگاه آرایشی');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [visitStatus, setVisitStatus] = useState<'موفق' | 'ناموفق' | 'نیاز به پیگیری'>('موفق');
  const [visitResult, setVisitResult] = useState<'ثبت شد' | 'نیاز به پیگیری' | 'علاقه مند نبود' | 'حضور نداشت' | 'محصول رقیب دارد' | 'در آینده همکاری می‌کند'>('ثبت شد');
  
  // سفارشات و گزارش رقیب
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [hasCompetitor, setHasCompetitor] = useState<boolean>(false);
  const [competitor, setCompetitor] = useState<CompetitorReport>({
    brandName: '',
    price: 0,
    sellerRating: 3,
    marginToCenter: 0,
  });

  // بازخورد و اطلاعات تکمیلی
  const [customerFeedback, setCustomerFeedback] = useState<'ضعیف' | 'متوسط' | 'عالی'>('متوسط');
  const [centerCategoryLevel, setCenterCategoryLevel] = useState<'ضعیف' | 'متوسط' | 'عالی'>('متوسط');
  const [remarks, setRemarks] = useState<string>('');
  const [followUpDays, setFollowUpDays] = useState<7 | 14 | 30 | undefined>(undefined);
  
  // موقعیت مکانی
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // دریافت اتوماتیک موقعیت مکانی
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setGpsLocation('موقعیت دریافت نشد')
      );
    }
  }, []);

  // محاسبه مجموع مبلغ سفارشات
  const totalOrderAmount = orders.reduce((sum, item) => sum + item.totalAmount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    setMessage('');

    // محاسبه تاریخ پیگیری بعدی در صورت انتخاب
    let followUpDate: string | undefined = undefined;
    if (followUpDays) {
      const d = new Date();
      d.setDate(d.getDate() + followUpDays);
      followUpDate = d.toISOString().split('T')[0];
    }

    const reportData: VisitReport = {
      visitorId: currentUser.id,
      visitorEmail: currentUser.email,
      visitorName: currentUser.name,
      visitDate,
      enterTime,
      exitTime,
      province: currentUser.province as Province,
      area,
      locationName,
      businessType,
      contactPerson,
      customerPhone,
      visitStatus,
      visitResult,
      orders,
      totalOrderAmount,
      customerFeedback,
      centerCategoryLevel,
      remarks,
      gpsLocation,
      competitorReport: hasCompetitor ? competitor : undefined,
      lowSellingItemsCount: 0,
      highSellingItemsCount: orders.length,
      averageOrder: orders.length > 0 ? totalOrderAmount / orders.length : 0,
      followUpDate,
      followUpDays,
      createdAt: new Date().toISOString(),
    };

    try {
      await submitVisitReport(reportData);
      setMessage('گزارش با موفقیت ثبت و ارسال شد.');
      // ریست کردن فرم
      setOrders([]);
      setRemarks('');
      setLocationName('');
      setContactPerson('');
      setCustomerPhone('');
    } catch (err) {
      setMessage('خطا در ثبت گزارش. اطلاعات در حافظه دستگاه ذخیره شد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ direction: 'rtl', maxWidth: '800px', margin: '20px auto', fontFamily: 'B Lotus, Tahoma, sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ color: '#802882', textAlign: 'center' }}>فرم ثبت گزارش ویزیت (VICTORIA ROSE)</h2>

      {message && <div style={{ padding: '10px', backgroundColor: '#e0f7fa', color: '#006064', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}

      {/* اطلاعات اولیه ویزیت */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label>تاریخ ویزیت:</label>
          <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>ولایت:</label>
          <input type="text" value={currentUser?.province || ''} disabled style={{ width: '100%', padding: '8px', backgroundColor: '#f0f0f0' }} />
        </div>
        <div>
          <label>ساعت ورود:</label>
          <input type="time" value={enterTime} onChange={(e) => setEnterTime(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>ساعت خروج:</label>
          <input type="time" value={exitTime} onChange={(e) => setExitTime(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
      </div>

      {/* اطلاعات مشتری */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label>منطقه / ناحیه:</label>
          <input type="text" value={area} onChange={(e) => setArea(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>نام فروشگاه / مرکز:</label>
          <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>نام شخص مرتبط:</label>
          <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>شماره تماس مشتری:</label>
          <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
      </div>

      {/* وضعیت و نتیجه ویزیت */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label>وضعیت ویزیت:</label>
          <select value={visitStatus} onChange={(e) => setVisitStatus(e.target.value as any)} style={{ width: '100%', padding: '8px' }}>
            <option value="موفق">موفق</option>
            <option value="ناموفق">ناموفق</option>
            <option value="نیاز به پیگیری">نیاز به پیگیری</option>
          </select>
        </div>
        <div>
          <label>نتیجه ویزیت:</label>
          <select value={visitResult} onChange={(e) => setVisitResult(e.target.value as any)} style={{ width: '100%', padding: '8px' }}>
            <option value="ثبت شد">ثبت شد</option>
            <option value="نیاز به پیگیری">نیاز به پیگیری</option>
            <option value="علاقه مند نبود">علاقه مند نبود</option>
            <option value="حضور نداشت">حضور نداشت</option>
            <option value="محصول رقیب دارد">محصول رقیب دارد</option>
            <option value="در آینده همکاری می‌کند">در آینده همکاری می‌کند</option>
          </select>
        </div>
      </div>

      {/* بخش انتخاب محصولات */}
      <MultiProductSelector orders={orders} setOrders={setOrders} />

      {/* گزارش محصولات رقیب */}
      <div style={{ margin: '15px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <label>
          <input type="checkbox" checked={hasCompetitor} onChange={(e) => setHasCompetitor(e.target.checked)} />
          ثبت گزارش محصول رقیب در این مرکز
        </label>

        {hasCompetitor && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
            <input type="text" placeholder="نام برند رقیب" value={competitor.brandName} onChange={(e) => setCompetitor({ ...competitor, brandName: e.target.value })} style={{ padding: '8px' }} />
            <input type="number" placeholder="قیمت رقیب (افغانی)" value={competitor.price || ''} onChange={(e) => setCompetitor({ ...competitor, price: Number(e.target.value) })} style={{ padding: '8px' }} />
          </div>
        )}
      </div>

      {/* پیگیری بعدی و توضیحات */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div>
          <label>یادآوری پیگیری بعدی:</label>
          <select value={followUpDays || ''} onChange={(e) => setFollowUpDays(Number(e.target.value) as any)} style={{ width: '100%', padding: '8px' }}>
            <option value="">بدون پیگیری</option>
            <option value="7">۷ روز بعد</option>
            <option value="14">۱۴ روز بعد</option>
            <option value="30">۳۰ روز بعد</option>
          </select>
        </div>
        <div>
          <label>بازخورد مشتری:</label>
          <select value={customerFeedback} onChange={(e) => setCustomerFeedback(e.target.value as any)} style={{ width: '100%', padding: '8px' }}>
            <option value="عالی">عالی</option>
            <option value="متوسط">متوسط</option>
            <option value="ضعیف">ضعیف</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>ملاحظات و توضیحات تکمیلی:</label>
        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} style={{ width: '100%', padding: '8px' }} />
      </div>

      <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: '#802882', color: '#fff', padding: '12px', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}>
        {loading ? 'در حال ارسال...' : 'ثبت نهایی گزارش ویزیت'}
      </button>
    </form>
  );
};
