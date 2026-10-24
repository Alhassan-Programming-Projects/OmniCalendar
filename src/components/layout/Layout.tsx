import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header, MobileNav } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/Toaster";

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main id="main" className="flex-1" tabIndex={-1}>
        {/* Enter-only fade: the new page renders immediately and simply settles in (220ms). */}
        <div key={pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  );
}
