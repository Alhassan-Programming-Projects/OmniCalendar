import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";

const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const ExplorePage = lazy(() => import("@/pages/ExplorePage"));
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const EventPage = lazy(() => import("@/pages/EventPage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function Loading() {
  return <div className="container-page py-20 text-center text-sm text-muted" role="status">Loading…</div>;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categories/:id" element={<CategoryPage />} />
              <Route path="event/:id" element={<EventPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AppProvider>
    </BrowserRouter>
  );
}
