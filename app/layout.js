import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL('https://feelmitra.in'),
  title: {
    default: 'Feel Mitra - Your Emotional Companion',
    template: '%s | Feel Mitra'
  },
  description: 'Feel Mitra is your AI-powered emotional companion offering personalized emotional support, mental health guidance, stress management, anxiety relief, and depression support through confidential AI conversations. Experience 24/7 emotional wellness support with our intelligent chatbot.',
  keywords: [
    'AI emotional support',
    'mental health chatbot',
    'emotional wellness app',
    'anxiety relief chat',
    'depression support online',
    'stress management AI',
    'personal therapy assistant',
    'mental health support India',
    'emotional health companion',
    'AI counseling chat',
    'mental wellness app India',
    'psychological support bot',
    'emotional intelligence AI',
    'mental health technology',
    'self-help chatbot',
    'digital mental health',
    'virtual emotional support',
    'AI mental health assistant',
    'online therapy companion',
    'emotional wellbeing platform'
  ],
  authors: [{ name: 'Feel Mitra Team' }],
  creator: 'Feel Mitra',
  publisher: 'Feel Mitra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Feel Mitra - Your Emotional Companion',
    description: 'Your AI-powered emotional companion for better mental wellness',
    url: 'https://feelmitra.in',
    siteName: 'Feel Mitra',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Feel Mitra Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feel Mitra - Your Emotional Companion',
    description: 'Your AI-powered emotional companion for better mental wellness',
    images: ['/twitter-image.png'],
    creator: '@feelmitra',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/icon.png',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
