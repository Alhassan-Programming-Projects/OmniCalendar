import {
  Cpu, FlaskConical, HeartPulse, Leaf, Palette, PawPrint, Scale, Users, UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, Recognition } from "@/types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes — literal strings so the JIT compiler keeps them. */
  chip: string;
  dot: string;
  tile: string;
  ring: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "animals", label: "Animals", icon: PawPrint,
    description: "Wildlife, pets and the creatures we share the planet with.",
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
    dot: "bg-amber-500", tile: "from-amber-400/25 to-amber-400/5", ring: "ring-amber-500/40",
  },
  {
    id: "technology", label: "Technology", icon: Cpu,
    description: "Computing, the internet, security and the people who build them.",
    chip: "bg-blue-100 text-blue-900 dark:bg-blue-400/15 dark:text-blue-200",
    dot: "bg-blue-600", tile: "from-blue-500/25 to-blue-500/5", ring: "ring-blue-500/40",
  },
  {
    id: "science", label: "Science", icon: FlaskConical,
    description: "Discovery, space, mathematics and the natural world explained.",
    chip: "bg-violet-100 text-violet-900 dark:bg-violet-400/15 dark:text-violet-200",
    dot: "bg-violet-600", tile: "from-violet-500/25 to-violet-500/5", ring: "ring-violet-500/40",
  },
  {
    id: "environment", label: "Environment", icon: Leaf,
    description: "Climate, oceans, forests, water and a liveable planet.",
    chip: "bg-emerald-100 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200",
    dot: "bg-emerald-600", tile: "from-emerald-500/25 to-emerald-500/5", ring: "ring-emerald-500/40",
  },
  {
    id: "food", label: "Food & Drink", icon: UtensilsCrossed,
    description: "Food safety, farming and the dishes people love.",
    chip: "bg-orange-100 text-orange-900 dark:bg-orange-400/15 dark:text-orange-200",
    dot: "bg-orange-500", tile: "from-orange-500/25 to-orange-500/5", ring: "ring-orange-500/40",
  },
  {
    id: "health", label: "Health", icon: HeartPulse,
    description: "Physical and mental health, medicine and wellbeing.",
    chip: "bg-rose-100 text-rose-900 dark:bg-rose-400/15 dark:text-rose-200",
    dot: "bg-rose-600", tile: "from-rose-500/25 to-rose-500/5", ring: "ring-rose-500/40",
  },
  {
    id: "culture", label: "Culture & Heritage", icon: Palette,
    description: "Festivals, arts, languages, faiths and national celebrations.",
    chip: "bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-400/15 dark:text-fuchsia-200",
    dot: "bg-fuchsia-600", tile: "from-fuchsia-500/25 to-fuchsia-500/5", ring: "ring-fuchsia-500/40",
  },
  {
    id: "relationships", label: "Relationships", icon: Users,
    description: "Family, friendship, kindness and the people who matter.",
    chip: "bg-pink-100 text-pink-900 dark:bg-pink-400/15 dark:text-pink-200",
    dot: "bg-pink-500", tile: "from-pink-500/25 to-pink-500/5", ring: "ring-pink-500/40",
  },
  {
    id: "society", label: "Society & Rights", icon: Scale,
    description: "Peace, human rights, education and global cooperation.",
    chip: "bg-cyan-100 text-cyan-900 dark:bg-cyan-400/15 dark:text-cyan-200",
    dot: "bg-cyan-600", tile: "from-cyan-500/25 to-cyan-500/5", ring: "ring-cyan-500/40",
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, CategoryMeta>;

export interface RecognitionMeta {
  id: Recognition;
  label: string;
  short: string;
  description: string;
  badge: string;
}

export const RECOGNITIONS: RecognitionMeta[] = [
  {
    id: "un", label: "UN International Day", short: "UN Official",
    description: "Proclaimed by the UN General Assembly or a UN specialised agency (UNESCO, WHO, FAO…).",
    badge: "border-sky-600/30 text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-400/10",
  },
  {
    id: "international", label: "International Observance", short: "International",
    description: "Coordinated by an international organisation outside the UN system.",
    badge: "border-indigo-600/30 text-indigo-800 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-400/10",
  },
  {
    id: "national", label: "National Holiday", short: "National Holiday",
    description: "A public or national holiday in one or more countries.",
    badge: "border-red-600/30 text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-400/10",
  },
  {
    id: "cultural", label: "Cultural / Religious", short: "Cultural",
    description: "A cultural, traditional or religious celebration.",
    badge: "border-fuchsia-600/30 text-fuchsia-800 dark:text-fuchsia-200 bg-fuchsia-50 dark:bg-fuchsia-400/10",
  },
  {
    id: "awareness", label: "Awareness Day", short: "Awareness",
    description: "An awareness campaign led by NGOs, foundations or industry groups.",
    badge: "border-emerald-600/30 text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-400/10",
  },
  {
    id: "unofficial", label: "Unofficial / Fun Day", short: "Unofficial",
    description: "A grassroots or just-for-fun day without formal recognition.",
    badge: "border-amber-600/30 text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-400/10",
  },
  {
    id: "event", label: "One-time Event", short: "One-time",
    description: "A dated event such as an eclipse — it happens once rather than every year.",
    badge: "border-slate-500/30 text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-400/10",
  },
];

export const RECOGNITION_MAP = Object.fromEntries(RECOGNITIONS.map((r) => [r.id, r])) as Record<Recognition, RecognitionMeta>;
