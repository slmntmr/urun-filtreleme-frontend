// src/app/layout.js

import { ProductProvider } from '../context/ProductContext'; // Context'i içe aktar

export const metadata = {
  title: 'Ürün Filtreleme Uygulaması', // sayfa başlığı
  description: 'Ürünleri filtrelemek için basit bir Next.js uygulaması', // sayfa açıklaması
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* SEO ve diğer meta bilgileri burada tanımlayabilirsiniz */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ProductProvider>
          {children} {/* Tüm sayfa içerikleri ProductProvider içinde render edilecek */}
        </ProductProvider>
      </body>
    </html>
  );
}
