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
};

export const COUNTRIES: Record<string, CountryMeta> = Object.fromEntries(
  Object.entries(NAMES).map(([code, name]) => [code, { code, name, flag: code === "GLOBAL" ? "🌍" : flagOf(code) }]),
);

export function countryLabel(code: string): string {
  const c = COUNTRIES[code];
  return c ? `${c.flag} ${c.name}` : code;
}
