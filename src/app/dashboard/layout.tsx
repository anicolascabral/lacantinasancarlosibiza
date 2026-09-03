import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Reservas · Panel interno",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#181613",
};

// Applies the saved theme before first paint so there's no light→dark flash.
const NO_FLASH_THEME_SCRIPT = `(function(){try{if(localStorage.getItem('dashboard-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="min-h-full antialiased" style={{ background: "var(--dash-bg)", color: "var(--dash-fg)" }}>
        {children}
      </body>
    </html>
  );
}
