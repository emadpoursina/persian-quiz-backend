import React from "react";
import Layout from "@/components/layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">حریم خصوصی</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          این صفحه مربوط به سیاست‌های حریم خصوصی سامانه است. اطلاعات شما نزد ما
          محفوظ است و فقط برای ارائه خدمات بهتر استفاده می‌شود. لطفاً برای
          اطلاعات بیشتر با پشتیبانی تماس بگیرید.
        </p>
      </div>
    </Layout>
  );
}
