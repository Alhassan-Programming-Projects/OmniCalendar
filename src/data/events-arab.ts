import type { SpecialDay } from "@/types";
import { ev, fixed, nth, hijri, orthodoxEaster, UN, SRC, WIKI, TUE } from "./helpers";

/*
 * Arab world — national days, public holidays, official observances and region-wide occasions.
 * Existing ids kept in events.ts: saudi-national-day, uae-national-day, eid-al-fitr, eid-al-adha,
 * islamic-new-year, ramadan, mothers-day-arab. Oman lives in events-oman.ts.
 *
 * Recognition: "national" = public holiday; "observance" = official/national day without a day off.
 * Holiday lists were checked against government sources where available and each country's
 * "Public holidays in …" reference; recent changes (Syria 2025, Morocco 2023/2025, Tunisia 2021,
 * Iraq 2024) are cited individually.
 */

const PH = (country: string) => WIKI(`Public holidays in ${country}`);
const UAE_PORTAL = SRC("UAE Government portal — public holidays", "https://u.ae/en/information-and-services/public-holidays-and-religious-affairs/public-holidays");
const SYRIA_2025 = SRC("Enab Baladi — Syria's official holidays (Decree 188/2025)", "https://english.enabbaladi.net/archives/2025/10/syrian-president-defines-official-holidays/");
const IRAQ_LAW = SRC("Tech 4 Peace — Iraq's official holidays law (Law 12/2024)", "https://t4p.co/article/2024-07-10-july-14-iraqi-holidays-law");

export const ARAB_EVENTS: SpecialDay[] = [
  // ======================= Region-wide =======================
  ev({
    id: "arabic-language-day", name: "UN Arabic Language Day", rule: fixed(12, 18), category: "culture", recognition: "un",
    summary: "Celebrates Arabic, one of the six official languages of the United Nations.",
    background: "The date marks 18 December 1973, when the UN General Assembly adopted Arabic as an official language of the UN. UNESCO marks the same date as World Arabic Language Day.",
    establishedBy: "United Nations (2010)",
    sources: [UN("arabiclanguageday"), WIKI("UN Arabic Language Day")], tags: ["arabic", "language", "unesco"],
  }),
  ev({
    id: "day-of-arafah", name: "Day of Arafah", rule: hijri(12, 9, { 2026: "05-26" }), category: "culture", recognition: "national",
    countries: ["SA", "AE", "BH", "KW", "LY", "OM"],
    summary: "The 9th of Dhu al-Hijjah, when Hajj pilgrims gather at Mount Arafat — the eve of Eid al-Adha.",
    background: "On the Day of Arafah, pilgrims performing the Hajj stand in prayer on the plain of Arafat near Mecca; many Muslims elsewhere fast. It is a public holiday in the UAE, Bahrain, Kuwait and Libya, and falls within the official Eid al-Adha holiday in Saudi Arabia and Oman.",
    note: "Dates depend on moon sighting.",
    sources: [UAE_PORTAL, PH("Bahrain"), PH("Kuwait"), PH("Libya"), PH("Saudi Arabia"), SRC("Oman Observer — Eid al-Adha 2026", "https://www.omanobserver.om/article/1189816/oman/community/eid-al-adha-holidays-announced-in-oman")],
    tags: ["islamic", "hajj", "arafat", "lunar", "hijri"],
  }),
  ev({
    id: "ashura", name: "Ashura", rule: hijri(1, 10), category: "culture", recognition: "national", countries: ["BH", "IQ", "DZ", "LB"],
    summary: "The 10th of Muharram, observed by Muslims with fasting and, among Shia Muslims, mourning for Imam Husayn.",
    background: "Many Sunni Muslims observe a voluntary fast on Ashura. For Shia Muslims it is the day of mourning for Husayn ibn Ali, the Prophet's grandson, killed at Karbala in 680 CE. It is a public holiday in Bahrain (9–10 Muharram), Iraq, Algeria and Lebanon.",
    note: "Dates depend on moon sighting.",
    sources: [PH("Bahrain"), IRAQ_LAW, PH("Algeria"), SRC("Calendarific — Lebanon holidays 2026", "https://calendarific.com/holidays/2026/LB")],
    tags: ["islamic", "muharram", "lunar", "hijri", "religious"],
  }),
  ev({
    id: "eid-al-ghadir", name: "Eid al-Ghadir", rule: hijri(12, 18), category: "culture", recognition: "national", countries: ["IQ"],
    summary: "Commemorated by Shia Muslims on 18 Dhu al-Hijjah; an official holiday in Iraq since 2024.",
    background: "Eid al-Ghadir marks the Prophet Muhammad's sermon at Ghadir Khumm in 632 CE. Iraq's official holidays law (Law 12 of 2024) lists the Day of Ghadir as a public holiday.",
    note: "Dates depend on moon sighting.",
    sources: [IRAQ_LAW, PH("Iraq")], tags: ["islamic", "shia", "lunar", "hijri", "iraq"],
  }),
  ev({
    id: "gargeean", name: "Gargee'an (Garangao)", rule: hijri(9, 14), category: "culture", recognition: "cultural", countries: ["KW", "BH", "QA", "SA", "IQ"],
    summary: "Mid-Ramadan night when Gulf children go door to door singing for sweets.",
    background: "Gargee'an is a Gulf and Iraqi tradition — known in Qatar as Garangao — in which children in traditional dress visit neighbours, singing songs and collecting sweets and nuts. In Saudi Arabia it is especially associated with Qatif and Al-Ahsa.",
    note: "Held on the 13th, 14th or 15th night of Ramadan depending on the locality; the date shown is the evening of 14 Ramadan. Oman's version is Qaranqasho.",
    sources: [WIKI("Gargee'an"), SRC("Gulf Times — Garangao at Katara", "https://gulf-times.com/story/498783/Children-and-adults-flock-to-Katara-to-celebrate-Garagao")],
    tags: ["ramadan", "children", "heritage", "gulf", "hijri"],
  }),
  ev({
    id: "human-fraternity-day", name: "International Day of Human Fraternity", rule: fixed(2, 4), category: "society", recognition: "un",
    summary: "Promotes interfaith and intercultural dialogue and mutual respect.",
    background: "The date marks the signing of the Document on Human Fraternity in Abu Dhabi on 4 February 2019 by Pope Francis and the Grand Imam of Al-Azhar, Ahmed el-Tayeb. The UN General Assembly proclaimed the day in 2020.",
    sources: [UN("human-fraternity"), WIKI("Document on Human Fraternity")], tags: ["interfaith", "tolerance", "abu dhabi"],
  }),
  ev({
    id: "arabian-leopard-day", name: "International Day of the Arabian Leopard", rule: fixed(2, 10), category: "animals", recognition: "un",
    summary: "Raises awareness of the critically endangered Arabian leopard.",
    background: "The UN General Assembly proclaimed 10 February as the International Day of the Arabian Leopard in 2023, to draw attention to the conservation of the Arabian Peninsula's last big cat.",
    establishedBy: "UN General Assembly (2023)",
    sources: [UN("arabian-leopard-day"), SRC("UNEP — first commemoration", "https://unep.org/events/un-day/first-commemoration-international-day-arabian-leopard")],
    tags: ["leopard", "wildlife", "arabia", "oman", "saudi"],
  }),
  ev({
    id: "combat-islamophobia-day", name: "International Day to Combat Islamophobia", rule: fixed(3, 15), category: "society", recognition: "un",
    summary: "Calls for tolerance and an end to discrimination against Muslims.",
    background: "The UN General Assembly proclaimed 15 March as the International Day to Combat Islamophobia in 2022.",
    establishedBy: "UN General Assembly (2022)", sources: [UN("anti-islamophobia-day")], tags: ["tolerance", "religion"],
  }),
  ev({
    id: "argania-day", name: "International Day of Argania", rule: fixed(5, 10), category: "environment", recognition: "un", countries: ["GLOBAL", "MA"],
    summary: "Celebrates the argan tree and the communities of south-western Morocco who depend on it.",
    background: "The UN General Assembly adopted 10 May as the International Day of Argania in 2021, on Morocco's initiative. The argan tree is endemic to south-western Morocco and the argan agro-sylvo-pastoral system is a UNESCO biosphere reserve.",
    establishedBy: "UN General Assembly (2021)",
    sources: [UN("argania-day"), SRC("Morocco World News", "https://www.moroccoworldnews.com/2021/03/61201/un-adopts-may-10th-as-international-day-of-argania/"), WIKI("International Day of Argania")],
    tags: ["argan", "morocco", "trees", "biodiversity"],
  }),
  ev({
    id: "sand-dust-storms-day", name: "International Day of Combating Sand and Dust Storms", rule: fixed(7, 12), category: "environment", recognition: "un",
    summary: "Highlights the health, economic and environmental impacts of sand and dust storms.",
    background: "Proclaimed by the UN General Assembly and first observed in 2023. Sand and dust storms particularly affect North Africa, the Middle East and Central Asia.",
    sources: [UN("day-of-combating-sand-and-dust-storms")], tags: ["dust", "desert", "climate", "air quality"],
  }),
  ev({
    id: "palestinian-solidarity-day", name: "International Day of Solidarity with the Palestinian People", rule: fixed(11, 29), category: "society", recognition: "un",
    countries: ["GLOBAL", "PS"],
    summary: "UN observance in solidarity with the Palestinian people.",
    background: "Observed by the United Nations since 1978. The date recalls 29 November 1947, when the General Assembly adopted resolution 181 on the partition of Palestine.",
    sources: [UN("international-day-of-solidarity-with-the-palestinian-people")], tags: ["palestine", "solidarity"],
  }),
  ev({
    id: "orthodox-easter", name: "Orthodox Easter", rule: orthodoxEaster(0), category: "culture", recognition: "cultural", countries: ["GLOBAL", "SY", "LB"],
    summary: "Easter Sunday in the Eastern Orthodox and Oriental Orthodox churches (Julian calendar).",
    background: "Orthodox churches calculate Easter using the Julian calendar, so it usually falls one to five weeks after Western Easter (and occasionally on the same day). Eastern Easter is an official holiday in Syria and Lebanon.",
    sources: [SYRIA_2025, SRC("Calendarific — Lebanon holidays 2026", "https://calendarific.com/holidays/2026/LB"), WIKI("Easter")],
    tags: ["christian", "orthodox", "coptic", "easter"],
  }),
  ev({
    id: "coptic-christmas", name: "Orthodox Christmas (Coptic Christmas)", rule: fixed(1, 7), category: "culture", recognition: "national", countries: ["EG", "PS", "SD"],
    summary: "Christmas in the Coptic and Orthodox churches that follow the Julian calendar.",
    background: "Coptic Orthodox Christians celebrate Christmas on 29 Koiak in the Coptic calendar, which corresponds to 7 January. It is a public holiday in Egypt, Palestine and Sudan.",
    sources: [PH("Egypt"), PH("Palestine"), PH("Sudan")], tags: ["christian", "coptic", "orthodox", "christmas"],
  }),

  // ======================= Saudi Arabia =======================
  ev({
    id: "saudi-founding-day", name: "Saudi Founding Day", rule: fixed(2, 22), category: "culture", recognition: "national", countries: ["SA"],
    summary: "Commemorates the founding of the First Saudi State in 1727; a public holiday since 2022.",
    background: "Founding Day (Yawm Al-Ta'sis) marks the establishment of the First Saudi State by Imam Muhammad bin Saud in 1727. It was established by royal order and first celebrated in 2022.",
    sources: [SRC("Saudipedia — Founding Day", "https://saudipedia.com/en/article/1589/government-and-politics/national-symbols/what-is-the-saudi-national-founding-day"), PH("Saudi Arabia")],
    tags: ["saudi", "national day", "gcc", "history"],
  }),
  ev({
    id: "saudi-flag-day", name: "Saudi Flag Day", rule: fixed(3, 11), category: "culture", recognition: "observance", countries: ["SA"],
    summary: "Celebrates the Saudi flag, whose design King Abdulaziz approved on 11 March 1937.",
    background: "King Salman ordered in March 2023 that the Kingdom mark Flag Day every year on 11 March — the day in 1937 (27 Dhu al-Hijjah 1355) when King Abdulaziz endorsed the flag's design. It is not a public holiday.",
    sources: [SRC("The National", "https://www.thenationalnews.com/gulf-news/2023/03/01/saudi-arabia-declares-march-11-flag-day/"), WIKI("Saudi Flag Day")],
    tags: ["saudi", "flag", "gcc"],
  }),

  // ======================= United Arab Emirates =======================
  ev({
    id: "emirati-womens-day", name: "Emirati Women's Day", rule: fixed(8, 28), category: "society", recognition: "observance", countries: ["AE"],
    summary: "Honours the contribution of Emirati women; first announced in 2015.",
    background: "Emirati Women's Day was first announced on 28 August 2015 by Sheikha Fatima bint Mubarak, the 'Mother of the Nation'. The date coincides with the 1975 founding of the UAE General Women's Union.",
    sources: [SRC("UAE Government portal", "https://u.ae/en/participate/blogs/blog?id=862")], tags: ["uae", "women"],
  }),
  ev({
    id: "uae-flag-day", name: "UAE Flag Day", rule: fixed(11, 3), category: "culture", recognition: "observance", countries: ["AE"],
    summary: "Flags are raised across the UAE; marks the 2004 inauguration of Sheikh Khalifa bin Zayed as President.",
    background: "Flag Day is observed every 3 November, the anniversary of Sheikh Khalifa bin Zayed Al Nahyan becoming President in 2004. Residents are invited to raise the flag together at 11 am. It is not a public holiday.",
    sources: [WIKI("Flag Day (United Arab Emirates)"), SRC("Gulf News", "https://gulfnews.com/uae/uae-to-mark-flag-day-nationwide-on-november-3-all-you-need-to-know-1.500330696")],
    tags: ["uae", "flag", "gcc"],
  }),
  ev({
    id: "uae-commemoration-day", name: "Commemoration Day (UAE)", rule: fixed(11, 30), category: "society", recognition: "observance", countries: ["AE"],
    summary: "Honours Emiratis who gave their lives in service of the nation.",
    background: "Commemoration Day (Martyrs' Day) is marked with a minute of silence at 11 am and flags at half-mast, ahead of the National Day holiday. It is not a separate day off.",
    sources: [SRC("The National — UAE National Day 2025", "https://www.thenationalnews.com/news/uae/2025/11/03/uae-national-day-holiday/"), UAE_PORTAL],
    tags: ["uae", "martyrs", "remembrance"],
  }),

  // ======================= Qatar, Bahrain, Kuwait =======================
  ev({
    id: "qatar-national-sport-day", name: "Qatar National Sport Day", rule: nth(2, TUE, 2), category: "health", recognition: "national", countries: ["QA"],
    summary: "A public holiday dedicated to sport and active living, on the second Tuesday of February.",
    background: "Qatar has held National Sport Day as a public holiday since its first edition in 2012, with sporting events across the country.",
    sources: [PH("Qatar")], tags: ["qatar", "sport", "fitness", "gcc"],
  }),
  ev({
    id: "qatar-national-day", name: "Qatar National Day", rule: fixed(12, 18), category: "culture", recognition: "national", countries: ["QA"],
    summary: "Qatar's National Day, a public holiday.",
    background: "Since 2008 Qatar has celebrated National Day on 18 December (previously 3 September), marking the succession of Sheikh Jassim bin Mohammed Al Thani in 1878.",
    sources: [PH("Qatar")], tags: ["qatar", "national day", "gcc"],
  }),
  ev({
    id: "bahrain-national-day", name: "Bahrain National Day", rule: fixed(12, 16), durationDays: 2, category: "culture", recognition: "national", countries: ["BH"],
    summary: "Bahrain's National Day, a two-day public holiday on 16–17 December.",
    background: "Bahrain celebrates its National Day as an official holiday over 16 and 17 December.",
    sources: [PH("Bahrain")], tags: ["bahrain", "national day", "gcc"],
  }),
  ev({
    id: "kuwait-national-day", name: "Kuwait National Day", rule: fixed(2, 25), category: "culture", recognition: "national", countries: ["KW"],
    summary: "Kuwait's National Day, followed by Liberation Day.",
    background: "Kuwait's National Day on 25 February is a public holiday and opens two days of national celebrations together with Liberation Day.",
    sources: [PH("Kuwait")], tags: ["kuwait", "national day", "gcc"],
  }),
  ev({
    id: "kuwait-liberation-day", name: "Kuwait Liberation Day", rule: fixed(2, 26), category: "culture", recognition: "national", countries: ["KW"],
    summary: "Marks the liberation of Kuwait on 26 February 1991, at the end of the Iraqi occupation.",
    background: "Liberation Day commemorates the end of the Iraqi occupation of Kuwait during the 1991 Gulf War. It is a public holiday.",
    sources: [PH("Kuwait")], tags: ["kuwait", "liberation", "gcc"],
  }),

  // ======================= Yemen =======================
  ev({
    id: "yemen-unity-day", name: "Yemen Unity Day", rule: fixed(5, 22), category: "culture", recognition: "national", countries: ["YE"],
    summary: "Anniversary of the unification of North and South Yemen on 22 May 1990.",
    background: "The Yemen Arab Republic and the People's Democratic Republic of Yemen united as the Republic of Yemen on 22 May 1990.",
    sources: [PH("Yemen")], tags: ["yemen", "national day", "unity"],
  }),
  ev({
    id: "yemen-revolution-day", name: "Revolution Day (Yemen, 26 September)", rule: fixed(9, 26), category: "culture", recognition: "national", countries: ["YE"],
    summary: "Marks the 1962 revolution against the Imamate and the founding of the Yemen Arab Republic.",
    background: "On 26 September 1962 the Imamate in northern Yemen was overthrown and the Yemen Arab Republic declared.",
    sources: [PH("Yemen")], tags: ["yemen", "revolution"],
  }),
  ev({
    id: "yemen-october-14", name: "Liberation Day (Yemen, 14 October)", rule: fixed(10, 14), category: "culture", recognition: "national", countries: ["YE"],
    summary: "Marks the start of the 1963 revolution against British rule in South Yemen.",
    background: "The 14 October Revolution began in 1963 in the Radfan mountains against British colonial rule in the south.",
    sources: [PH("Yemen")], tags: ["yemen", "revolution", "independence"],
  }),
  ev({
    id: "yemen-independence-day", name: "Independence Day (Yemen)", rule: fixed(11, 30), category: "culture", recognition: "national", countries: ["YE"],
    summary: "Marks the departure of the last British soldier from Aden on 30 November 1967.",
    background: "South Yemen became independent from Britain on 30 November 1967.",
    sources: [PH("Yemen")], tags: ["yemen", "independence", "aden"],
  }),

  // ======================= Levant =======================
  ev({
    id: "jordan-independence-day", name: "Jordan Independence Day", rule: fixed(5, 25), category: "culture", recognition: "national", countries: ["JO"],
    summary: "Marks Jordan's independence on 25 May 1946.",
    background: "The Emirate of Transjordan became the independent Hashemite Kingdom on 25 May 1946, ending the British mandate.",
    sources: [PH("Jordan"), WIKI("Independence Day (Jordan)")], tags: ["jordan", "independence", "national day"],
  }),
  ev({
    id: "palestine-independence-day", name: "Palestinian Independence Day", rule: fixed(11, 15), category: "culture", recognition: "national", countries: ["PS"],
    summary: "Marks the Palestinian Declaration of Independence of 15 November 1988.",
    background: "The Palestinian Declaration of Independence was proclaimed in Algiers on 15 November 1988. The day is a public holiday in Palestine.",
    sources: [PH("Palestine"), WIKI("Palestinian Declaration of Independence")], tags: ["palestine", "independence", "national day"],
  }),
  ev({
    id: "land-day", name: "Land Day (Palestine)", rule: fixed(3, 30), category: "society", recognition: "observance", countries: ["PS"],
    summary: "Palestinian commemoration of the 30 March 1976 protests against land expropriation.",
    background: "Land Day commemorates the general strike and protests of 30 March 1976 against land expropriation in the Galilee, in which six Palestinian citizens of Israel were killed. It is marked annually by Palestinians.",
    sources: [WIKI("Land Day"), WIKI("List of Gregorian Palestinian-related observances")], tags: ["palestine", "remembrance"],
  }),
  ev({
    id: "nakba-day", name: "Nakba Day", rule: fixed(5, 15), category: "society", recognition: "observance", countries: ["PS"],
    summary: "Palestinian day of remembrance for the displacement of 1948.",
    background: "Nakba ('catastrophe') Day remembers the displacement of Palestinians during the 1948 war. It is marked on 15 May, the day after the declaration of the State of Israel. The United Nations held its first official commemoration in 2023.",
    sources: [WIKI("Nakba Day"), WIKI("List of Gregorian Palestinian-related observances")], tags: ["palestine", "remembrance", "1948"],
  }),
  ev({
    id: "st-maron-day", name: "St Maron's Day", rule: fixed(2, 9), category: "culture", recognition: "national", countries: ["LB"],
    summary: "Feast of the patron saint of the Maronite Church; a public holiday in Lebanon.",
    background: "Saint Maron, a 4th–5th-century monk, gave his name to the Maronite Church, Lebanon's largest Christian community.",
    sources: [SRC("Calendarific — Lebanon holidays 2026", "https://calendarific.com/holidays/2026/LB"), WIKI("Maron")], tags: ["lebanon", "christian", "maronite"],
  }),
  ev({
    id: "annunciation-lebanon", name: "Feast of the Annunciation (Lebanon)", rule: fixed(3, 25), category: "culture", recognition: "national", countries: ["LB"],
    summary: "A joint Christian–Muslim national holiday honouring the Virgin Mary.",
    background: "Lebanon made the Feast of the Annunciation a national holiday in 2010, as a day shared by Christians and Muslims, both of whom revere Mary.",
    sources: [SRC("Calendarific — Lebanon holidays 2026", "https://calendarific.com/holidays/2026/LB"), WIKI("Feast of the Annunciation")], tags: ["lebanon", "interfaith", "mary"],
  }),
  ev({
    id: "lebanon-liberation-day", name: "Liberation and Resistance Day (Lebanon)", rule: fixed(5, 25), category: "culture", recognition: "national", countries: ["LB"],
    summary: "Marks the Israeli withdrawal from southern Lebanon on 25 May 2000.",
    background: "Israeli forces withdrew from southern Lebanon on 25 May 2000. The anniversary is a public holiday.",
    sources: [SRC("Calendarific — Lebanon holidays 2026", "https://calendarific.com/holidays/2026/LB")], tags: ["lebanon", "liberation"],
  }),
  ev({
    id: "lebanon-independence-day", name: "Lebanese Independence Day", rule: fixed(11, 22), category: "culture", recognition: "national", countries: ["LB"],
    summary: "Marks the end of the French mandate in Lebanon on 22 November 1943.",
    background: "On 22 November 1943 the French authorities released Lebanon's president and ministers, whom they had arrested after parliament abolished the mandate's provisions — the date celebrated as independence.",
    sources: [PH("Lebanon"), WIKI("Lebanese Independence Day")], tags: ["lebanon", "independence", "national day"],
  }),
  ev({
    id: "syria-revolution-day", name: "Syrian Revolution Day", rule: fixed(3, 18), category: "culture", recognition: "national", countries: ["SY"],
    summary: "Marks the start of the 2011 Syrian uprising; a public holiday since 2025.",
    background: "Decree No. 188 of 2025 added 18 March — the date of the March 2011 protests in Daraa that began the Syrian revolution — to Syria's official holidays.",
    sources: [SYRIA_2025, PH("Syria")], tags: ["syria", "revolution", "2011"],
  }),
  ev({
    id: "syria-evacuation-day", name: "Evacuation Day (Syria)", rule: fixed(4, 17), category: "culture", recognition: "national", countries: ["SY"],
    summary: "Syria's Independence Day, marking the departure of the last French troops in 1946.",
    background: "Evacuation Day (Eid al-Jalaa) marks 17 April 1946, when the last French soldiers left Syria. It remains an official holiday under Decree No. 188 of 2025.",
    sources: [SYRIA_2025, PH("Syria")], tags: ["syria", "independence", "national day"],
  }),
  ev({
    id: "syria-liberation-day", name: "Liberation Day (Syria)", rule: fixed(12, 8), category: "culture", recognition: "national", countries: ["SY"],
    summary: "Marks the fall of the Assad government on 8 December 2024; a public holiday since 2025.",
    background: "Decree No. 188 of 2025 made 8 December an official holiday. The same decree removed several former holidays, including 8 March, 6 May and 6 October.",
    sources: [SYRIA_2025, PH("Syria")], tags: ["syria", "liberation"],
  }),

  // ======================= Iraq =======================
  ev({
    id: "iraq-army-day", name: "Iraqi Army Day", rule: fixed(1, 6), category: "society", recognition: "national", countries: ["IQ"],
    summary: "Marks the founding of the Iraqi Army in 1921; an official holiday.",
    background: "Army Day on 6 January is one of the public holidays in Iraq's official holidays law (Law 12 of 2024).",
    sources: [IRAQ_LAW, PH("Iraq")], tags: ["iraq", "army"],
  }),
  ev({
    id: "iraq-national-day", name: "Iraq National Day", rule: fixed(10, 3), category: "culture", recognition: "observance", countries: ["IQ"],
    summary: "Marks Iraq's independence on 3 October 1932, when it joined the League of Nations.",
    background: "The government of Prime Minister Mustafa al-Kadhimi designated 3 October as Iraq's National Day, recalling the end of the British mandate in 1932.",
    note: "Public-holiday status is disputed: 3 October is not among the holidays in Law 12 of 2024 and proposals to add it had not been approved. Check official announcements each year.",
    sources: [SRC("Asharq Al-Awsat", "https://english.aawsat.com/arab-world/5325593-national-day-stirs-debate-over-independence-iraq"), IRAQ_LAW, PH("Iraq")],
    tags: ["iraq", "national day", "independence"],
  }),

  // ======================= Egypt =======================
  ev({
    id: "egypt-january-25", name: "January 25 Revolution Day and Police Day (Egypt)", rule: fixed(1, 25), category: "culture", recognition: "national", countries: ["EG"],
    summary: "Marks the start of the 2011 revolution and Police Day, which recalls the police's stand at Ismailia in 1952.",
    background: "January 25 is both National Police Day, commemorating police resistance to British forces in Ismailia in 1952, and the anniversary of the start of the 2011 revolution.",
    sources: [PH("Egypt")], tags: ["egypt", "revolution", "police"],
  }),
  ev({
    id: "sham-el-nessim", name: "Sham el-Nessim", rule: orthodoxEaster(1), category: "culture", recognition: "national", countries: ["EG"],
    summary: "Egypt's spring festival, celebrated by Egyptians of all faiths on the Monday after Orthodox Easter.",
    background: "Sham el-Nessim ('smelling the breeze') is a national spring holiday with roots in ancient Egypt. Families picnic outdoors and eat traditional foods such as feseekh (salted fish), green onions and coloured eggs.",
    sources: [PH("Egypt"), WIKI("Sham el-Nessim")], tags: ["egypt", "spring", "festival", "food"],
  }),
  ev({
    id: "sinai-liberation-day", name: "Sinai Liberation Day", rule: fixed(4, 25), category: "culture", recognition: "national", countries: ["EG"],
    summary: "Marks Israel's final withdrawal from the Sinai Peninsula on 25 April 1982.",
    background: "Under the 1979 Egypt–Israel peace treaty, Israel completed its withdrawal from Sinai (except Taba) on 25 April 1982.",
    sources: [PH("Egypt")], tags: ["egypt", "sinai"],
  }),
  ev({
    id: "egypt-june-30", name: "June 30 Revolution Day (Egypt)", rule: fixed(6, 30), category: "culture", recognition: "national", countries: ["EG"],
    summary: "Public holiday commemorating the mass protests of 30 June 2013.",
    background: "The protests of 30 June 2013 led to the removal of President Mohamed Morsi on 3 July 2013. The anniversary is an official holiday.",
    sources: [PH("Egypt")], tags: ["egypt", "revolution"],
  }),
  ev({
    id: "egypt-revolution-day", name: "Revolution Day (Egypt, 23 July)", rule: fixed(7, 23), category: "culture", recognition: "national", countries: ["EG"],
    summary: "Egypt's National Day, marking the revolution of 23 July 1952.",
    background: "On 23 July 1952 the Free Officers ended the monarchy of King Farouk; Egypt became a republic in 1953. The anniversary is Egypt's National Day.",
    sources: [PH("Egypt")], tags: ["egypt", "national day", "revolution"],
  }),
  ev({
    id: "egypt-armed-forces-day", name: "Armed Forces Day (Egypt)", rule: fixed(10, 6), category: "culture", recognition: "national", countries: ["EG"],
    summary: "Marks the crossing of the Suez Canal at the start of the October War on 6 October 1973.",
    background: "On 6 October 1973 Egyptian forces crossed the Suez Canal and breached the Bar Lev Line. The anniversary is a public holiday.",
    sources: [PH("Egypt")], tags: ["egypt", "october war"],
  }),

  // ======================= Sudan, Libya =======================
  ev({
    id: "sudan-independence-day", name: "Sudan Independence Day", rule: fixed(1, 1), category: "culture", recognition: "national", countries: ["SD"],
    summary: "Marks Sudan's independence on 1 January 1956.",
    background: "Sudan became independent from Anglo-Egyptian rule on 1 January 1956.",
    sources: [PH("Sudan")], tags: ["sudan", "independence", "national day"],
  }),
  ev({
    id: "libya-revolution-day", name: "February 17 Revolution Day (Libya)", rule: fixed(2, 17), category: "culture", recognition: "national", countries: ["LY"],
    summary: "Marks the start of the 2011 uprising in Libya.",
    background: "Protests that began on 17 February 2011 grew into the revolution that ended Muammar Gaddafi's rule.",
    sources: [PH("Libya")], tags: ["libya", "revolution"],
  }),
  ev({
    id: "libya-martyrs-day", name: "Martyrs' Day (Libya)", rule: fixed(9, 16), category: "culture", recognition: "national", countries: ["LY"],
    summary: "Honours Omar Mukhtar, the resistance leader executed on 16 September 1931.",
    background: "Omar Mukhtar led resistance to Italian colonial rule and was executed by the Italian authorities on 16 September 1931.",
    sources: [PH("Libya"), WIKI("Omar Mukhtar")], tags: ["libya", "remembrance"],
  }),
  ev({
    id: "libya-liberation-day", name: "Liberation Day (Libya)", rule: fixed(10, 23), category: "culture", recognition: "national", countries: ["LY"],
    summary: "Marks the declaration of Libya's liberation on 23 October 2011.",
    background: "The National Transitional Council declared the liberation of Libya on 23 October 2011.",
    sources: [PH("Libya")], tags: ["libya", "liberation"],
  }),
  ev({
    id: "libya-independence-day", name: "Libya Independence Day", rule: fixed(12, 24), category: "culture", recognition: "national", countries: ["LY"],
    summary: "Marks Libya's independence on 24 December 1951.",
    background: "Libya became independent as the United Kingdom of Libya on 24 December 1951.",
    sources: [PH("Libya")], tags: ["libya", "independence", "national day"],
  }),

  // ======================= Tunisia =======================
  ev({
    id: "tunisia-independence-day", name: "Tunisia Independence Day", rule: fixed(3, 20), category: "culture", recognition: "national", countries: ["TN"],
    summary: "Marks Tunisia's independence from France on 20 March 1956.",
    background: "Tunisia became independent from France on 20 March 1956.",
    sources: [PH("Tunisia")], tags: ["tunisia", "independence", "national day"],
  }),
  ev({
    id: "tunisia-martyrs-day", name: "Martyrs' Day (Tunisia)", rule: fixed(4, 9), category: "culture", recognition: "national", countries: ["TN"],
    summary: "Honours those killed during the protests of 9 April 1938 in Tunis.",
    background: "French troops fired on demonstrators demanding a Tunisian parliament on 9 April 1938.",
    sources: [PH("Tunisia")], tags: ["tunisia", "remembrance"],
  }),
  ev({
    id: "tunisia-republic-day", name: "Republic Day (Tunisia)", rule: fixed(7, 25), category: "culture", recognition: "national", countries: ["TN"],
    summary: "Marks the proclamation of the Tunisian Republic on 25 July 1957.",
    background: "The Constituent Assembly abolished the monarchy and proclaimed the republic on 25 July 1957.",
    sources: [PH("Tunisia")], tags: ["tunisia", "republic"],
  }),
  ev({
    id: "tunisia-womens-day", name: "Women's Day (Tunisia)", rule: fixed(8, 13), category: "society", recognition: "national", countries: ["TN"],
    summary: "Marks the Code of Personal Status of 13 August 1956, a landmark for women's rights.",
    background: "The Code of Personal Status, promulgated on 13 August 1956, abolished polygamy and introduced judicial divorce. The anniversary is a public holiday.",
    sources: [PH("Tunisia"), WIKI("Code of Personal Status (Tunisia)")], tags: ["tunisia", "women", "rights"],
  }),
  ev({
    id: "tunisia-evacuation-day", name: "Evacuation Day (Tunisia)", rule: fixed(10, 15), category: "culture", recognition: "national", countries: ["TN"],
    summary: "Marks the departure of the last French troops from Bizerte on 15 October 1963.",
    background: "France evacuated its naval base at Bizerte, its last military presence in Tunisia, on 15 October 1963.",
    sources: [PH("Tunisia")], tags: ["tunisia", "bizerte"],
  }),
  ev({
    id: "tunisia-revolution-day", name: "Revolution and Youth Day (Tunisia)", rule: fixed(12, 17), category: "culture", recognition: "national", countries: ["TN"],
    summary: "Marks the start of the 2010–2011 Tunisian revolution in Sidi Bouzid.",
    background: "Protests began in Sidi Bouzid on 17 December 2010. In December 2021 President Kais Saied moved the official revolution anniversary from 14 January to 17 December.",
    sources: [SRC("Africanews", "https://africanews.com/2021/12/03/tunisia-president-saied-changes-revolution-commemoration-date-to-december-17"), PH("Tunisia")],
    tags: ["tunisia", "revolution", "youth"],
  }),

  // ======================= Algeria =======================
  ev({
    id: "yennayer-algeria", name: "Yennayer — Amazigh New Year (Algeria)", rule: fixed(1, 12), category: "culture", recognition: "national", countries: ["DZ"],
    summary: "The Amazigh (Berber) New Year; a paid public holiday in Algeria since 2018.",
    background: "Algeria made Yennayer a paid public holiday from 12 January 2018. It opens the Amazigh agricultural calendar.",
    sources: [SRC("Le Desk", "https://ledesk.ma/encontinu/bouteflika-consacre-yennayer-journee-chomee-et-payee-des-le-12-janvier-2018/"), PH("Algeria")],
    tags: ["algeria", "amazigh", "berber", "new year", "heritage"],
  }),
  ev({
    id: "algeria-independence-day", name: "Algeria Independence Day", rule: fixed(7, 5), category: "culture", recognition: "national", countries: ["DZ"],
    summary: "Marks Algeria's independence from France on 5 July 1962.",
    background: "Algeria declared independence on 5 July 1962, after the eight-year War of Independence.",
    sources: [PH("Algeria")], tags: ["algeria", "independence", "national day"],
  }),
  ev({
    id: "algeria-revolution-day", name: "Revolution Day (Algeria)", rule: fixed(11, 1), category: "culture", recognition: "national", countries: ["DZ"],
    summary: "Marks the start of the Algerian War of Independence on 1 November 1954.",
    background: "The National Liberation Front (FLN) launched the armed struggle for independence on 1 November 1954.",
    sources: [PH("Algeria")], tags: ["algeria", "revolution"],
  }),

  // ======================= Morocco =======================
  ev({
    id: "morocco-independence-manifesto", name: "Independence Manifesto Day (Morocco)", rule: fixed(1, 11), category: "culture", recognition: "national", countries: ["MA"],
    summary: "Marks the Proclamation of Independence presented on 11 January 1944.",
    background: "Moroccan nationalists presented the Manifesto of Independence on 11 January 1944, demanding the end of the French protectorate.",
    sources: [PH("Morocco")], tags: ["morocco", "independence"],
  }),
  ev({
    id: "yennayer-morocco", name: "Amazigh New Year (Morocco)", rule: fixed(1, 14), category: "culture", recognition: "national", countries: ["MA"],
    summary: "Id Yennayer, the Amazigh New Year; a paid public holiday in Morocco since 2024.",
    background: "In 2023 King Mohammed VI decided to make 14 January — the Amazigh New Year — an official paid public holiday, first observed in January 2024.",
    sources: [SRC("TelQuel", "https://telquel.ma/instant-t/2023/08/07/nouvel-an-amazigh-le-14-janvier-desormais-jour-ferie-national-officiellement-remunere_1825156/"), PH("Morocco")],
    tags: ["morocco", "amazigh", "berber", "new year", "heritage"],
  }),
  ev({
    id: "throne-day-morocco", name: "Throne Day (Morocco)", rule: fixed(7, 30), category: "culture", recognition: "national", countries: ["MA"],
    summary: "Commemorates King Mohammed VI's accession to the throne in 1999.",
    background: "Throne Day marks the enthronement of the reigning king; Mohammed VI acceded on 30 July 1999.",
    sources: [PH("Morocco")], tags: ["morocco", "national day", "monarchy"],
  }),
  ev({
    id: "oued-ed-dahab-day", name: "Oued Ed-Dahab Day (Morocco)", rule: fixed(8, 14), category: "culture", recognition: "national", countries: ["MA"],
    summary: "Moroccan public holiday marking the 1979 allegiance of the Oued Ed-Dahab region.",
    background: "The day marks 14 August 1979, when representatives of the Oued Ed-Dahab region pledged allegiance to King Hassan II.",
    sources: [PH("Morocco")], tags: ["morocco"],
  }),
  ev({
    id: "revolution-king-people", name: "Revolution of the King and the People (Morocco)", rule: fixed(8, 20), category: "culture", recognition: "national", countries: ["MA"],
    summary: "Marks the uprising that followed the French exile of Sultan Mohammed V on 20 August 1953.",
    background: "French authorities exiled Sultan Mohammed V on 20 August 1953, sparking a national resistance that led to his return in 1955 and independence in 1956.",
    sources: [PH("Morocco")], tags: ["morocco", "independence"],
  }),
  ev({
    id: "youth-day-morocco", name: "Youth Day (Morocco)", rule: fixed(8, 21), category: "society", recognition: "national", countries: ["MA"],
    summary: "Public holiday on the birthday of King Mohammed VI.",
    background: "Youth Day coincides with the birthday of King Mohammed VI, born on 21 August 1963.",
    sources: [PH("Morocco")], tags: ["morocco", "youth"],
  }),
  ev({
    id: "unity-day-morocco", name: "Unity Day (Morocco)", rule: fixed(10, 31), category: "culture", recognition: "national", countries: ["MA"],
    summary: "National holiday proclaimed in 2025 after UN Security Council Resolution 2797 on the Sahara.",
    background: "King Mohammed VI proclaimed 31 October a national holiday, 'Unity Day', following the adoption of UN Security Council Resolution 2797 on 31 October 2025.",
    sources: [SRC("Maroc.ma — Royal Office statement", "https://maroc.ma/en/news/his-majesty-king-proclaims-october-31-unity-day-statement-royal-office"), SRC("Hespress", "https://en.hespress.com/124851-124851.html"), PH("Morocco")],
    tags: ["morocco", "sahara", "unity"],
  }),
  ev({
    id: "green-march-day", name: "Green March Day (Morocco)", rule: fixed(11, 6), category: "culture", recognition: "national", countries: ["MA"],
    summary: "Commemorates the Green March of 6 November 1975.",
    background: "Around 350,000 Moroccans marched south into the then Spanish Sahara on 6 November 1975 at the call of King Hassan II.",
    sources: [PH("Morocco"), WIKI("Green March")], tags: ["morocco", "sahara"],
  }),
  ev({
    id: "morocco-independence-day", name: "Morocco Independence Day", rule: fixed(11, 18), category: "culture", recognition: "national", countries: ["MA"],
    summary: "Marks Morocco's independence from the French and Spanish protectorates in 1956.",
    background: "Independence Day is celebrated on 18 November, following Sultan Mohammed V's return from exile in November 1955; Morocco's independence was recognised in 1956.",
    sources: [PH("Morocco")], tags: ["morocco", "independence", "national day"],
  }),

  // ======================= Mauritania, Horn of Africa, Comoros =======================
  ev({
    id: "mauritania-independence-day", name: "Mauritania Independence Day", rule: fixed(11, 28), category: "culture", recognition: "national", countries: ["MR"],
    summary: "Marks Mauritania's independence from France on 28 November 1960.",
    background: "Mauritania became independent from France on 28 November 1960.",
    sources: [PH("Mauritania")], tags: ["mauritania", "independence", "national day"],
  }),
  ev({
    id: "somalia-june-26", name: "Independence of the Northern Regions (Somalia)", rule: fixed(6, 26), category: "culture", recognition: "national", countries: ["SO"],
    summary: "Marks the independence of the former British Somaliland on 26 June 1960.",
    background: "British Somaliland became independent on 26 June 1960 and united with the former Italian trust territory five days later to form the Somali Republic.",
    sources: [SRC("AllAfrica — Somalia marks 65 years of northern independence", "https://allafrica.com/stories/202506270066.html"), WIKI("Independence Day (Somaliland)")],
    tags: ["somalia", "independence"],
  }),
  ev({
    id: "somalia-independence-day", name: "Somalia Independence Day", rule: fixed(7, 1), category: "culture", recognition: "national", countries: ["SO"],
    summary: "Marks independence and the union that formed the Somali Republic on 1 July 1960.",
    background: "On 1 July 1960 the Trust Territory of Somaliland became independent and united with the former British Somaliland as the Somali Republic.",
    sources: [SRC("Somalia Ministry of Foreign Affairs", "https://web.mfa.gov.so/independence-day/"), WIKI("Independence Day (Somalia)")], tags: ["somalia", "independence", "national day"],
  }),
  ev({
    id: "djibouti-independence-day", name: "Djibouti Independence Day", rule: fixed(6, 27), category: "culture", recognition: "national", countries: ["DJ"],
    summary: "Marks Djibouti's independence from France on 27 June 1977.",
    background: "The French Territory of the Afars and the Issas became the independent Republic of Djibouti on 27 June 1977.",
    sources: [WIKI("Independence Day (Djibouti)"), SRC("Office Holidays — Djibouti", "https://www.officeholidays.com/holidays/djibouti/djibouti-independence-day")],
    tags: ["djibouti", "independence", "national day"],
  }),
  ev({
    id: "comoros-national-day", name: "Comoros National Day", rule: fixed(7, 6), category: "culture", recognition: "national", countries: ["KM"],
    summary: "Marks the independence of the Comoros from France on 6 July 1975.",
    background: "The Comoros declared independence from France on 6 July 1975.",
    sources: [WIKI("Public holidays in the Comoros")], tags: ["comoros", "independence", "national day"],
  }),
];
