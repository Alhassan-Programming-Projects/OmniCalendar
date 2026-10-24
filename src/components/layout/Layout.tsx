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
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <Toaster />
    </div>
  );
}
