import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://mylegalpaddy.app"),
  title: {
    default: "My Legal Paddy | Legal Articles, Tutors & Career Guidance",
    template: "%s | My Legal Paddy",
  },
  description: "Practical Nigerian law articles, study guidance, legal career tools and tutors for university law students and young legal professionals.",
  applicationName: "My Legal Paddy",
  authors: [{ name: "My Legal Paddy", url: "https://mylegalpaddy.app" }],
  creator: "My Legal Paddy",
  publisher: "My Legal Paddy",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: "My Legal Paddy",
    title: "My Legal Paddy | The Law Students' Friend",
    description: "Practical Nigerian law articles, study guidance, legal career tools and tutors for university law students.",
    images: [{
      url: "/team/law-students-group.jpg",
      width: 1200,
      height: 1600,
      alt: "University law students with My Legal Paddy",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Legal Paddy | The Law Students' Friend",
    description: "Practical legal knowledge, career direction and tutoring for university law students.",
    images: ["/team/law-students-group.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "legal education",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://mylegalpaddy.app/#organization",
  name: "My Legal Paddy",
  url: "https://mylegalpaddy.app",
  logo: "https://mylegalpaddy.app/icon.png",
  description: "A legal education, career guidance and tutoring platform for university law students.",
  areaServed: "Nigeria",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://mylegalpaddy.app/#website",
  url: "https://mylegalpaddy.app",
  name: "My Legal Paddy",
  description: "The law students' friend for legal articles, tutors and career guidance.",
  publisher: { "@id": "https://mylegalpaddy.app/#organization" },
  inLanguage: "en-NG",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema]).replace(/</g, "\\u003c"),
          }}
        />
        <Script id="theme-init" strategy="beforeInteractive">{`try{const t=localStorage.getItem('mlp-theme');const d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}`}</Script>
        {children}
      </body>
    </html>
  );
}
