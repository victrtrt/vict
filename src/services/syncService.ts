import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // اطمینان حاصل کنید فایل firebase.ts در همین پوشه وجود دارد
import { VisitReport } from '../types';

// لینک گوگل شیت خود را مستقیماً داخل کوتیشن زیر قرار دهید
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzivirqpLdVillSeoklvlnCMDliy_z9svPWx-ZNwtakaFRPueIEw22TSlvrayLqM5KW/exec';

export const submitVisitReport = async (report: VisitReport): Promise<void> => {
  if (navigator.onLine) {
    try {
      // ۱. ذخیره در فایربیس
      await addDoc(collection(db, 'visit_reports'), report);

      // ۲. ارسال به گوگل شیت
      if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'https://script.google.com/macros/s/کد_اختصاصی_گوگل_شیت_شما/exec') {
        fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        }).catch((err) => console.error('Google Sheet Sync Error:', err));
      }
    } catch (error) {
      console.error('Firestore Submission Error:', error);
      await queueOfflineReport(report);
    }
  } else {
    // ذخیره در حافظه دستگاه در صورت قطعی اینترنت
    await queueOfflineReport(report);
  }
};

const queueOfflineReport = async (report: VisitReport): Promise<void> => {
  const offlineQueue = JSON.parse(localStorage.getItem('offline_reports') || '[]');
  offlineQueue.push(report);
  localStorage.setItem('offline_reports', JSON.stringify(offlineQueue));
};

// همگام‌سازی اتوماتیک پس از وصل شدن اینترنت
window.addEventListener('online', async () => {
  const offlineQueue: VisitReport[] = JSON.parse(localStorage.getItem('offline_reports') || '[]');
  if (offlineQueue.length === 0) return;

  for (const report of offlineQueue) {
    await submitVisitReport(report);
  }
  localStorage.removeItem('offline_reports');
});
