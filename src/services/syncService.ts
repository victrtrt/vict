import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { VisitReport } from '../types';

const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzivirqpLdVillSeoklvlnCMDliy_z9svPWx-ZNwtakaFRPueIEw22TSlvrayLqM5KW/exec';

export const submitVisitReport = async (report: VisitReport): Promise<void> => {
  if (navigator.onLine) {
    try {
      await addDoc(collection(db, 'visit_reports'), report);

      if (GOOGLE_SHEET_URL) {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });
      }
    } catch (error) {
      console.error('Firestore Error:', error);
      await queueOfflineReport(report);
    }
  } else {
    await queueOfflineReport(report);
  }
};

const queueOfflineReport = async (report: VisitReport): Promise<void> => {
  const offlineQueue = JSON.parse(localStorage.getItem('offline_reports') || '[]');
  offlineQueue.push(report);
  localStorage.setItem('offline_reports', JSON.stringify(offlineQueue));
};

window.addEventListener('online', async () => {
  const offlineQueue: VisitReport[] = JSON.parse(localStorage.getItem('offline_reports') || '[]');
  if (offlineQueue.length === 0) return;

  for (const report of offlineQueue) {
    await submitVisitReport(report);
  }
  localStorage.removeItem('offline_reports');
});
