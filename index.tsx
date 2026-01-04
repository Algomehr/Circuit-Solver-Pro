
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("المان root در فایل HTML یافت نشد.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("خطا در هنگام اجرای اولیه اپلیکیشن:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: white; text-align: center;">
      <h2>خطا در بارگذاری برنامه</h2>
      <p>لطفاً کنسول مرورگر را چک کنید.</p>
    </div>`;
  }
}
