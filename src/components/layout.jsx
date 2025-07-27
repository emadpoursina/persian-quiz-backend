import type React from "react"

export const metadata = {
  title: "آزمون دانش فارسی",
  description: "یک آزمون تعاملی و زیبا به زبان فارسی",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
        <style>{`
          * {
            font-family: 'Vazirmatn', sans-serif !important;
          }
        `}</style>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
