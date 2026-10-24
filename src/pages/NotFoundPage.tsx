import { Link } from "react-router-dom";
import { CalendarX } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function NotFoundPage() {
  useDocumentTitle("Not found");
  return (
    <div className="container-page py-16">
      <EmptyState icon={CalendarX} title="This page isn't on the calendar">
        <p>The link may be wrong, or this special day was removed.</p>
        <Link to="/" className={buttonClasses("primary", "md", "mt-5")}>Back to home</Link>
      </EmptyState>
    </div>
  );
}
