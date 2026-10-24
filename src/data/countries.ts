export interface CountryMeta {
  code: string;
  name: string;
  flag: string;
}

/** Regional-indicator flag emoji from an ISO alpha-2 code. */
function flagOf(code: string): string {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const NAMES: Record<string, string> = {
  GLOBAL: "Worldwide",
  AE: "United Arab Emirates", AU: "Australia", BR: "Brazil", CA: "Canada", CN: "China", DE: "Germany",
  EG: "Egypt", ES: "Spain", FR: "France", GB: "United Kingdom", IE: "Ireland", IN: "India", IS: "Iceland",
  JP: "Japan", MX: "Mexico", OM: "Oman", RU: "Russia", SA: "Saudi Arabia", US: "United States",
  MA: "Morocco", GL: "Greenland", ZA: "South Africa",
  // Arab League members and neighbours
  BH: "Bahrain", DJ: "Djibouti", DZ: "Algeria", IQ: "Iraq", JO: "Jordan", KM: "Comoros", KW: "Kuwait",
  LB: "Lebanon", LY: "Libya", MR: "Mauritania", PS: "Palestine", QA: "Qatar", SD: "Sudan", SO: "Somalia",
  SY: "Syria", TN: "Tunisia", YE: "Yemen",
};

/** Arab League member states — used for region-wide observances such as the Eids. */
export const ARAB_LEAGUE = ["DZ", "BH", "KM", "DJ", "EG", "IQ", "JO", "KW", "LB", "LY", "MR", "MA", "OM", "PS", "QA", "SA", "SO", "SD", "SY", "TN", "AE", "YE"];

/** Gulf Cooperation Council members. */
export const GCC = ["BH", "KW", "OM", "QA", "SA", "AE"];

/**
 * Region filters that group several countries. Used by the region selector next to single countries;
 * a region matches any event listed for one of its member states.
 */
export const REGIONS: Record<string, { name: string; flag: string; members: string[] }> = {
  ARAB: { name: "Arab world", flag: "🌙", members: ARAB_LEAGUE },
  GCC: { name: "Gulf (GCC)", flag: "🏝️", members: GCC },
};

/**
 * Extra search terms per country: common abbreviations, demonyms and the Arabic name,
 * so "uae", "emirati", "ksa" or "عمان" find the right days.
 */
export const COUNTRY_ALIASES: Record<string, string> = {
  GLOBAL: "international worldwide global world",
  OM: "omani sultanate muscat salalah dhofar عمان سلطنة",
  AE: "uae emirates emirati dubai abu dhabi الإمارات",
  SA: "ksa saudi riyadh السعودية",
  QA: "qatari doha قطر",
  BH: "bahraini manama البحرين",
  KW: "kuwaiti الكويت",
  YE: "yemeni sanaa aden اليمن",
  JO: "jordanian amman الأردن",
  PS: "palestinian فلسطين",
  LB: "lebanese beirut لبنان",
  SY: "syrian damascus سوريا",
  IQ: "iraqi baghdad العراق",
  EG: "egyptian cairo مصر",
  SD: "sudanese khartoum السودان",
  LY: "libyan tripoli ليبيا",
  TN: "tunisian tunis تونس",
  DZ: "algerian algiers الجزائر",
  MA: "moroccan rabat المغرب",
  MR: "mauritanian موريتانيا",
  SO: "somali mogadishu الصومال",
  DJ: "djiboutian جيبوتي",
  KM: "comorian جزر القمر",
  GB: "uk britain british england", US: "usa america american", IN: "indian", CN: "chinese", JP: "japanese",
  DE: "german", FR: "french", ES: "spanish", MX: "mexican", CA: "canadian", AU: "australian", IE: "irish",
};

export const COUNTRIES: Record<string, CountryMeta> = Object.fromEntries(
  Object.entries(NAMES).map(([code, name]) => [code, { code, name, flag: code === "GLOBAL" ? "🌍" : flagOf(code) }]),
);

export function countryLabel(code: string): string {
  const c = COUNTRIES[code];
  return c ? `${c.flag} ${c.name}` : code;
}

/** Countries in a region code (ARAB, GCC) or the single country itself. */
export function regionMembers(code: string): string[] {
  return REGIONS[code]?.members ?? (code ? [code] : []);
}

/** Display label for a country or region code. */
export function regionLabel(code: string): string {
  const r = REGIONS[code];
  return r ? `${r.flag} ${r.name}` : countryLabel(code);
}
