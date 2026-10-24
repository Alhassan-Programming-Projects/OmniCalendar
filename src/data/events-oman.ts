import type { SpecialDay } from "@/types";
import { ev, fixed, table, hijri, SRC, WIKI } from "./helpers";

/*
 * Sultanate of Oman — official holidays, national observances and heritage occasions.
 * Oman National Day lives in events.ts (existing id "oman-national-day").
 *
 * Holiday law: Royal Decree 88/2022 (list of official holidays), amended by Royal Decree 15/2025
 * (National Day → 20–21 November). Since 2026 the Council of Ministers publishes the year's holiday
 * calendar in advance; the days off can differ from the occasion itself, so announced dates are
 * recorded in `observed`. The two Eids are still announced separately after moon sighting.
 */

const RD_88_2022 = SRC("Royal Decree 88/2022 — official holidays (decree.om)", "https://decree.om/2022/rd20220088/");
const OM_2026 = SRC("Times of Oman — 2026 holiday calendar", "https://timesofoman.com/article/166620-oman-declares-holiday-calendar-for-2026");
const OM_2026_JAN = SRC("Gulf News — Oman's advance holiday announcement policy", "https://gulfnews.com/world/gulf/oman-sets-january-2026-public-holidays-under-new-advance-announcement-policy-1.500392367");

export const OMAN_EVENTS: SpecialDay[] = [
  // ---------- Official holidays ----------
  ev({
    id: "oman-accession-day", name: "Accession Day (Oman)", rule: fixed(1, 11), category: "culture", recognition: "national", countries: ["OM"],
    summary: "Anniversary of His Majesty Sultan Haitham bin Tarik's accession to the throne on 11 January 2020.",
    background: "Sultan Haitham bin Tarik acceded to the throne on 11 January 2020, following the death of Sultan Qaboos bin Said. The Day of the Sultan's Accession is one of the official holidays listed in Royal Decree 88/2022.",
    note: "The announced day off can differ from the anniversary — in 2026 it was Thursday 15 January.",
    sources: [RD_88_2022, OM_2026_JAN, OM_2026, WIKI("Public holidays in Oman")],
    observed: [{ country: "OM", start: "2026-01-15", note: "Announced in the 2026 official holiday calendar.", source: OM_2026_JAN }],
    tags: ["oman", "sultan haitham", "public holiday", "gcc"],
  }),
  ev({
    id: "isra-and-miraj", name: "Isra and Mi'raj", rule: hijri(7, 27), category: "culture", recognition: "national", countries: ["OM", "KW", "PS"],
    summary: "Commemorates the Prophet Muhammad's Night Journey and Ascension, on 27 Rajab.",
    background: "Al-Isra wal-Mi'raj marks the Night Journey of the Prophet Muhammad from Mecca to Jerusalem and his ascension to the heavens. It is an official holiday in Oman (Royal Decree 88/2022), Kuwait and Palestine.",
    note: "In Oman the announced day off can differ from 27 Rajab — in 2026 it was Sunday 18 January.",
    sources: [RD_88_2022, WIKI("Public holidays in Kuwait"), WIKI("Public holidays in Palestine"), OM_2026_JAN],
    observed: [{ country: "OM", start: "2026-01-18", note: "Announced in the 2026 official holiday calendar.", source: OM_2026_JAN }],
    tags: ["islamic", "isra", "miraj", "lunar", "hijri", "religious"],
  }),
  ev({
    id: "mawlid", name: "Prophet's Birthday (Mawlid an-Nabi)", rule: hijri(3, 12), category: "culture", recognition: "national",
    countries: ["OM", "AE", "BH", "KW", "YE", "JO", "PS", "LB", "SY", "IQ", "EG", "LY", "TN", "DZ", "MA", "MR"],
    summary: "Marks the birth of the Prophet Muhammad on 12 Rabi al-Awwal; a public holiday in most Arab countries.",
    background: "Mawlid an-Nabi commemorates the birth of the Prophet Muhammad, dated to 12 Rabi al-Awwal in Sunni tradition. It is a public holiday in most Arab states, but not in Saudi Arabia or Qatar.",
    note: "Dates depend on moon sighting and can differ by a day between countries. Oman's 2026 holiday was Thursday 27 August.",
    sources: [RD_88_2022, SRC("Oman Observer — Prophet's Birthday holiday 2026", "https://www.omanobserver.om/article/1194793/oman/community/oman-announces-holiday-for-prophets-birthday"), SRC("UAE Government portal — public holidays", "https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays"), WIKI("Public holidays in Saudi Arabia")],
    observed: [{ country: "OM", start: "2026-08-27", note: "Official holiday for 12 Rabi al-Awwal 1448.", source: SRC("Oman Observer", "https://www.omanobserver.om/article/1194793/oman/community/oman-announces-holiday-for-prophets-birthday") }],
    tags: ["islamic", "mawlid", "prophet", "lunar", "hijri", "religious"],
  }),

  // ---------- National observances (not public holidays) ----------
  ev({
    id: "rop-day", name: "Royal Oman Police Day", rule: fixed(1, 5), category: "society", recognition: "observance", countries: ["OM"],
    summary: "The Royal Oman Police's annual day, marked every year on 5 January.",
    background: "The Royal Oman Police celebrates its annual day on 5 January with ceremonies and graduation parades.",
    sources: [SRC("Times of Oman", "https://timesofoman.com/article/153747-royal-oman-police-marks-annual-day-1")],
    tags: ["oman", "police"],
  }),
  ev({
    id: "oman-environment-day", name: "Oman Environment Day", rule: fixed(1, 8), category: "environment", recognition: "observance", countries: ["OM"],
    summary: "Oman's national environment day, celebrated each year on 8 January.",
    background: "Oman marks its own Environment Day every 8 January, with activities led by the Environment Authority.",
    sources: [SRC("Times of Oman", "https://timesofoman.com/article/125269-oman-to-mark-environment-day-on-january-8"), SRC("Environment Authority (Oman)", "https://www.ea.gov.om/en/")],
    tags: ["oman", "environment"],
  }),
  ev({
    id: "omani-teachers-day", name: "Omani Teachers' Day", rule: fixed(2, 24), category: "society", recognition: "observance", countries: ["OM"],
    summary: "Honours Oman's teachers; a day off for educators at public and private schools.",
    background: "Following a directive from Sultan Haitham bin Tarik, the Ministry of Education made 24 February an official holiday for educators at public and private schools, first in 2024. When the date falls on a weekend, a nearby working day may be designated instead.",
    sources: [SRC("Gulf News", "https://gulfnews.com/world/gulf/oman/extended-weekend-omani-teachers-day-declared-official-holiday-1.101161250")],
    tags: ["oman", "teachers", "education"],
  }),
  ev({
    id: "omani-womens-day", name: "Omani Women's Day", rule: fixed(10, 17), category: "society", recognition: "observance", countries: ["OM"],
    summary: "Celebrates the achievements and contributions of Omani women.",
    background: "Omani Women's Day was designated by the late Sultan Qaboos bin Said following a 2009 symposium on Omani women held at Saih Al Makarim in Suhar.",
    sources: [SRC("Oman Observer", "https://www.omanobserver.om/ampArticle/9425"), WIKI("Public holidays in Oman")],
    tags: ["oman", "women"],
  }),
  ev({
    id: "omani-youth-day", name: "Omani Youth Day", rule: fixed(10, 26), category: "society", recognition: "observance", countries: ["OM"],
    summary: "Honours Oman's young people, celebrated annually on 26 October.",
    background: "Sultan Qaboos bin Said designated 26 October as Omani Youth Day by royal order. The day is marked with youth programmes and awards.",
    sources: [SRC("Oman Ministry of Foreign Affairs", "https://www.fm.gov.om/en/17866/"), SRC("Oman Observer", "https://www.omanobserver.om/ampArticle/70026")],
    tags: ["oman", "youth"],
  }),
  ev({
    id: "oman-armed-forces-day", name: "Sultan's Armed Forces Day", rule: fixed(12, 11), category: "society", recognition: "observance", countries: ["OM"],
    summary: "Oman's Armed Forces Day, marked every year on 11 December.",
    background: "The Sultan's Armed Forces Day (SAF Day) is celebrated annually on 11 December with military displays and award ceremonies.",
    sources: [SRC("Oman News Agency", "https://www.omannews.gov.om/topics/en/79/show/120058/ona")],
    tags: ["oman", "armed forces"],
  }),
  ev({
    id: "oman-renaissance-day", name: "Renaissance Day (Oman)", rule: fixed(7, 23), category: "culture", recognition: "cultural", countries: ["OM"],
    summary: "Anniversary of 23 July 1970, when Sultan Qaboos bin Said came to power.",
    background: "Renaissance Day marks Sultan Qaboos bin Said's accession on 23 July 1970, the start of what Omanis call the Renaissance (al-Nahda). It was a public holiday until it was cancelled in 2020, and it does not appear in the official holiday list of Royal Decree 88/2022.",
    note: "Historical anniversary — not a public holiday.",
    sources: [SRC("Office Holidays — Renaissance Day", "https://www.officeholidays.com/holidays/oman/renaissance-day"), RD_88_2022, WIKI("Public holidays in Oman")],
    tags: ["oman", "sultan qaboos", "history", "nahda"],
  }),

  // ---------- Heritage, seasons and festivals ----------
  ev({
    id: "qaranqasho", name: "Qaranqasho", rule: hijri(9, 14), category: "culture", recognition: "cultural", countries: ["OM"],
    summary: "Omani children's mid-Ramadan night: traditional dress, folk songs and sweets from neighbours.",
    background: "Qaranqasho is celebrated on the night of the 15th of Ramadan. After the Isha prayer, children put on traditional clothes and go around their neighbourhoods singing folk songs, and families welcome them with sweets.",
    note: "In the Islamic calendar the night comes before the day, so the 15th night falls on the evening of the 14th fasting day — the date shown. See also Gargee'an, the same custom elsewhere in the Gulf.",
    sources: [SRC("Oman Observer", "https://www.omanobserver.om/article/1167610/oman/kids-mark-qaranqasho-today-with-joy-and-fun")],
    tags: ["oman", "ramadan", "children", "heritage", "hijri"],
  }),
  ev({
    id: "khareef-dhofar", name: "Khareef Season (Dhofar)", rule: fixed(6, 21), durationDays: 93, category: "environment", recognition: "cultural", countries: ["OM"],
    summary: "Dhofar's monsoon season, when mist and drizzle turn the Salalah hills green.",
    background: "The khareef (monsoon) season runs from 21 June to 21 September in Oman's Dhofar Governorate. It draws visitors from across the Gulf, and a programme of cultural and tourism events runs throughout — over 125 events were scheduled for 2026.",
    sources: [SRC("Oman Observer — Khareef 2026", "https://www.omanobserver.om/article/1191554/oman/as-khareef-begins-today-dhofar-gears-up-for-visitors"), SRC("Times of Oman — Khareef Dhofar 2026 events", "https://timesofoman.com/article/173046-over-125-cultural-and-artistic-events-scheduled-for-khareef-dhofar-season-2026")],
    tags: ["oman", "salalah", "dhofar", "monsoon", "tourism", "season"],
  }),
  ev({
    id: "muscat-nights", name: "Muscat Nights", rule: table({ 2026: "01-01" }), durationDays: 31, category: "culture", recognition: "cultural", countries: ["OM"],
    summary: "A month-long winter festival across Muscat's parks, beaches and venues.",
    background: "Muscat Nights runs across Muscat Governorate with events at venues including Al Qurum Natural Park, Al Amerat Public Park, the Royal Opera House Muscat and A'Seeb Beach. The 2026 edition ran from 1 to 31 January.",
    note: "Dates are announced each year; only confirmed editions are listed.",
    sources: [SRC("Times of Oman — Muscat Nights 2026", "https://timesofoman.com/article/166415-activities-of-muscat-nights-2026-to-begin-in-january")],
    tags: ["oman", "muscat", "festival", "winter"],
  }),
  ev({
    id: "muscat-international-book-fair", name: "Muscat International Book Fair", rule: table({ 2027: "03-24" }), durationDays: 11, category: "culture", recognition: "cultural", countries: ["OM"],
    summary: "Oman's annual international book fair; the 30th edition runs 24 March – 3 April 2027.",
    background: "The Muscat International Book Fair is organised under a main committee chaired by Oman's Minister of Information. The 30th edition is scheduled for 24 March to 3 April 2027.",
    note: "Dates are announced each year; only confirmed editions are listed.",
    sources: [SRC("Oman Observer", "https://www.omanobserver.om/article/1198211/oman/30th-muscat-international-book-fair-set-for-march-24-april-3")],
    tags: ["oman", "muscat", "books", "reading", "education"],
  }),
];
