import { Link } from "react-router-dom";
import { EVENTS } from "@/data/events";
import { RECOGNITIONS } from "@/data/categories";
import { RecognitionBadge } from "@/components/events/Badges";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClasses } from "@/components/ui/Button";

const RULES = [
  ["Fixed date", "Same day every year — e.g. World Environment Day on June 5."],
  ["Nth weekday", "e.g. Mother's Day on the second Sunday of May, US Thanksgiving on the fourth Thursday of November."],
  ["Easter-based", "Calculated from Western Easter using the Gregorian computus — e.g. Mothering Sunday (Easter − 21 days)."],
  ["Day of year", "e.g. Programmers' Day on the 256th day of the year."],
  ["Lunar table", "Islamic, Chinese and Hindu festivals use published dates per year. Islamic dates depend on moon sighting and are marked as estimates."],
  ["One-time", "Single dated events such as total solar eclipses."],
];

export default function AboutPage() {
  useDocumentTitle("About the data");
  return (
    <div>
    <PageHeader eyebrow="About" title="About the data"
      description={<>OmniCalendar currently lists {EVENTS.length} special days. Each one has a recognition label, a date rule and at least one source link.
        Dates are calculated in your browser for any year, so nothing is hard-coded to a single year.</>} />
    <div className="container-page max-w-3xl py-10">
      <h2 className="section-title">Recognition levels</h2>
      <ul className="mt-4 space-y-3">
        {RECOGNITIONS.map((r) => (
          <li key={r.id} className="card flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
            <RecognitionBadge id={r.id} long className="self-start sm:w-56 sm:justify-center" />
            <span className="text-sm text-muted">{r.description}</span>
          </li>
        ))}
      </ul>
      <h2 className="section-title mt-10">How dates are calculated</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {RULES.map(([t, d]) => (
          <div key={t} className="card p-4">
            <dt className="font-semibold">{t}</dt>
            <dd className="mt-1 text-sm text-muted">{d}</dd>
          </div>
        ))}
      </dl>
      <h2 className="section-title mt-10">Accuracy</h2>
      <p className="mt-3 text-fg/80">
        Public-holiday dates can be moved by governments, and lunar dates may differ by a day between countries. Check the official
        announcement before planning around a holiday. Spotted a mistake? The dataset lives in a single file — <code className="rounded bg-surface-2 px-1.5 py-0.5 text-sm">src/data/events.ts</code> — and is easy to correct.
      </p>
      <Link to="/explore" className={buttonClasses("primary", "md", "mt-8")}>Start exploring →</Link>
    </div>
    </div>
  );
}
