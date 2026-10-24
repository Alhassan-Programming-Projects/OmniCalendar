import type { CategoryId, DateRule, Recognition, Source, SpecialDay } from "@/types";

/*
 * OmniCalendar event dataset.
 *
 * Guidelines for contributors:
 *  - Only add a day if its date AND its recognition level can be backed by a source.
 *  - Prefer the organiser's own page (un.org, who.int, unesco.org…) as the first source.
 *  - Lunar/lunisolar dates go in a `table` rule. Mark them `estimated` when they depend
 *    on moon sighting, and only list years with published dates.
 *  - Keep `summary` to one sentence; put history in `background`.
 */

// ---------- helpers ----------
const fixed = (month: number, day: number): DateRule => ({ type: "fixed", month, day });
/** weekday: 0=Sun … 6=Sat; n=-1 means last. */
const nth = (month: number, weekday: number, n: number): DateRule => ({ type: "nth-weekday", month, weekday, n });
const easter = (offset: number): DateRule => ({ type: "easter", offset });
const table = (dates: Record<number, string>, estimated = false): DateRule => ({ type: "table", dates, estimated });
const once = (date: string): DateRule => ({ type: "once", date });

const UN = (slug: string, label = "United Nations"): Source => ({ label, url: `https://www.un.org/en/observances/${slug}` });
const UN_LIST: Source = { label: "UN list of International Days", url: "https://www.un.org/en/observances/list-days-weeks" };
const WHO = (slug: string): Source => ({ label: "World Health Organization", url: `https://www.who.int/campaigns/${slug}` });
const WIKI = (title: string): Source => ({ label: "Wikipedia", url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}` });
const SRC = (label: string, url: string): Source => ({ label, url });

const GLOBAL = ["GLOBAL"];
const SUN = 0, MON = 1, TUE = 2, THU = 4, FRI = 5, SAT = 6;

interface Def {
  id: string;
  name: string;
  rule: DateRule;
  category: CategoryId;
  recognition: Recognition;
  summary: string;
  background: string;
  sources: Source[];
  countries?: string[];
  durationDays?: number;
  establishedBy?: string;
  note?: string;
  tags?: string[];
}

const ev = (d: Def): SpecialDay => ({ countries: GLOBAL, ...d });

export const EVENTS: SpecialDay[] = [
  // ======================= JANUARY =======================
  ev({
    id: "new-years-day", name: "New Year's Day", rule: fixed(1, 1), category: "culture", recognition: "national",
    summary: "The first day of the Gregorian calendar year, a public holiday in most countries.",
    background: "January 1 has marked the start of the civil year in the Gregorian calendar since its introduction in 1582. Today it is a public holiday in the majority of the world's countries and is celebrated with fireworks, resolutions and gatherings.",
    sources: [WIKI("New Year's Day")], tags: ["new year", "holiday"],
  }),
  ev({
    id: "world-braille-day", name: "World Braille Day", rule: fixed(1, 4), category: "society", recognition: "un",
    summary: "Raises awareness of braille as a means of communication for blind and partially sighted people.",
    background: "January 4 is the birthday of Louis Braille (born 1809), who invented the tactile reading and writing system. The UN General Assembly proclaimed the day in 2018 and it was first observed in 2019.",
    establishedBy: "UN General Assembly (2018)", sources: [UN("braille-day"), WIKI("World Braille Day")], tags: ["accessibility", "disability"],
  }),
  ev({
    id: "international-day-of-education", name: "International Day of Education", rule: fixed(1, 24), category: "society", recognition: "un",
    summary: "Celebrates the role of education for peace and development.",
    background: "The UN General Assembly proclaimed January 24 as the International Day of Education in December 2018; it was first celebrated in 2019. UNESCO coordinates the observance.",
    establishedBy: "UN General Assembly (2018)", sources: [UN("education-day"), WIKI("International Day of Education")], tags: ["education", "school"],
  }),
  ev({
    id: "republic-day-india", name: "Republic Day (India)", rule: fixed(1, 26), category: "culture", recognition: "national", countries: ["IN"],
    summary: "Marks the day India's constitution came into effect in 1950.",
    background: "The Constitution of India came into force on January 26, 1950, making India a republic. The day is a national holiday celebrated with a large parade in New Delhi.",
    sources: [WIKI("Republic Day (India)")], tags: ["national day"],
  }),
  ev({
    id: "australia-day", name: "Australia Day", rule: fixed(1, 26), category: "culture", recognition: "national", countries: ["AU"],
    summary: "Australia's official national day and a public holiday.",
    background: "Australia Day marks the anniversary of the arrival of the First Fleet at Sydney Cove in 1788. It is a public holiday in all states and territories, and its date is the subject of ongoing public debate, particularly among Aboriginal and Torres Strait Islander communities.",
    sources: [SRC("Australian Government", "https://www.australia.gov.au/australia-day"), WIKI("Australia Day")], tags: ["national day"],
  }),
  ev({
    id: "holocaust-remembrance-day", name: "International Holocaust Remembrance Day", rule: fixed(1, 27), category: "society", recognition: "un",
    summary: "Commemorates the victims of the Holocaust.",
    background: "January 27 is the anniversary of the liberation of the Auschwitz-Birkenau concentration and extermination camp in 1945. The UN General Assembly designated the day in 2005.",
    establishedBy: "UN General Assembly (2005)", sources: [UN("commemoration-holocaust-victims-day"), WIKI("International Holocaust Remembrance Day")], tags: ["history", "remembrance"],
  }),
  ev({
    id: "data-protection-day", name: "Data Protection Day (Data Privacy Day)", rule: fixed(1, 28), category: "technology", recognition: "international", countries: ["GLOBAL"],
    summary: "Promotes privacy and data-protection best practices.",
    background: "Launched by the Council of Europe, the day marks the anniversary of the opening for signature of Convention 108 on January 28, 1981 — the first legally binding international treaty on data protection. In North America it is commonly known as Data Privacy Day.",
    establishedBy: "Council of Europe", sources: [SRC("Council of Europe", "https://www.coe.int/en/web/data-protection/data-protection-day"), WIKI("Data Privacy Day")], tags: ["privacy", "cybersecurity", "security"],
  }),

  // ======================= FEBRUARY =======================
  ev({
    id: "world-wetlands-day", name: "World Wetlands Day", rule: fixed(2, 2), category: "environment", recognition: "un",
    summary: "Raises awareness of the vital role wetlands play for people and the planet.",
    background: "February 2 marks the adoption of the Convention on Wetlands (the Ramsar Convention) in 1971. The UN General Assembly proclaimed it a UN International Day in 2021.",
    establishedBy: "Ramsar Convention; UN General Assembly (2021)", sources: [UN("world-wetlands-day"), WIKI("World Wetlands Day")], tags: ["water", "nature"],
  }),
  ev({
    id: "groundhog-day", name: "Groundhog Day", rule: fixed(2, 2), category: "animals", recognition: "cultural", countries: ["US", "CA"],
    summary: "Folk tradition where a groundhog 'predicts' whether spring will come early.",
    background: "According to the tradition, if a groundhog sees its shadow on February 2 there will be six more weeks of winter. The best-known celebration takes place in Punxsutawney, Pennsylvania, where it has been held since the late 19th century.",
    sources: [WIKI("Groundhog Day")], tags: ["folklore", "weather"],
  }),
  ev({
    id: "world-cancer-day", name: "World Cancer Day", rule: fixed(2, 4), category: "health", recognition: "international",
    summary: "A global initiative to raise awareness of cancer and encourage prevention, detection and treatment.",
    background: "World Cancer Day is led by the Union for International Cancer Control (UICC). It traces back to the Charter of Paris Against Cancer, signed at the World Summit Against Cancer in Paris in 2000.",
    establishedBy: "Union for International Cancer Control (UICC)", sources: [SRC("UICC — World Cancer Day", "https://www.worldcancerday.org/"), WIKI("World Cancer Day")], tags: ["cancer"],
  }),
  ev({
    id: "world-pulses-day", name: "World Pulses Day", rule: fixed(2, 10), category: "food", recognition: "un",
    summary: "Celebrates beans, lentils, chickpeas and other pulses as nutritious, sustainable foods.",
    background: "Following the International Year of Pulses (2016), the UN General Assembly proclaimed February 10 as World Pulses Day in 2018. The Food and Agriculture Organization (FAO) leads the observance.",
    establishedBy: "UN General Assembly (2018)", sources: [SRC("FAO — World Pulses Day", "https://www.fao.org/world-pulses-day/en"), WIKI("World Pulses Day")], tags: ["nutrition", "farming"],
  }),
  ev({
    id: "women-and-girls-in-science", name: "International Day of Women and Girls in Science", rule: fixed(2, 11), category: "science", recognition: "un",
    summary: "Promotes full and equal access to and participation in science for women and girls.",
    background: "The UN General Assembly established the day in December 2015. It is implemented by UNESCO and UN Women together with other partners.",
    establishedBy: "UN General Assembly (2015)", sources: [UN("women-and-girls-in-science-day"), WIKI("International Day of Women and Girls in Science")], tags: ["stem", "equality", "women"],
  }),
  ev({
    id: "world-radio-day", name: "World Radio Day", rule: fixed(2, 13), category: "technology", recognition: "un",
    summary: "Celebrates radio as a powerful, accessible medium for information and community.",
    background: "UNESCO proclaimed World Radio Day in 2011, and the UN General Assembly endorsed it in 2012. February 13 is the anniversary of the establishment of United Nations Radio in 1946.",
    establishedBy: "UNESCO (2011)", sources: [UN("radio-day"), WIKI("World Radio Day")], tags: ["media", "broadcasting"],
  }),
  ev({
    id: "valentines-day", name: "Valentine's Day", rule: fixed(2, 14), category: "relationships", recognition: "cultural",
    summary: "A celebration of love and affection between partners, friends and family.",
    background: "Named after one or more early Christian martyrs called Valentine, the day became associated with romantic love in the Middle Ages. Today it is widely celebrated with cards, flowers and gifts.",
    sources: [WIKI("Valentine's Day")], tags: ["love", "romance"],
  }),
  ev({
    id: "world-day-of-social-justice", name: "World Day of Social Justice", rule: fixed(2, 20), category: "society", recognition: "un",
    summary: "Highlights the need to promote social justice, including poverty eradication and decent work.",
    background: "The UN General Assembly declared February 20 the World Day of Social Justice in 2007; it was first observed in 2009.",
    establishedBy: "UN General Assembly (2007)", sources: [UN("social-justice-day"), WIKI("World Day of Social Justice")], tags: ["equality", "work"],
  }),
  ev({
    id: "international-mother-language-day", name: "International Mother Language Day", rule: fixed(2, 21), category: "culture", recognition: "un",
    summary: "Promotes linguistic and cultural diversity and multilingualism.",
    background: "UNESCO proclaimed the day in 1999 and it has been observed since 2000. The date honours the 1952 Language Movement in what is now Bangladesh, when students protested for recognition of Bengali.",
    establishedBy: "UNESCO (1999)", sources: [UN("mother-language-day"), WIKI("International Mother Language Day")], tags: ["language", "diversity"],
  }),
  ev({
    id: "leap-day", name: "Leap Day", rule: fixed(2, 29), category: "science", recognition: "unofficial",
    summary: "The extra day added in leap years to keep the calendar in step with Earth's orbit.",
    background: "A tropical year is about 365.2422 days long. The Gregorian calendar adds February 29 in years divisible by 4, except century years not divisible by 400, to keep the calendar aligned with the seasons.",
    note: "Only occurs in leap years.", sources: [WIKI("February 29")], tags: ["calendar", "astronomy"],
  }),

  // ======================= MARCH =======================
  ev({
    id: "world-wildlife-day", name: "World Wildlife Day", rule: fixed(3, 3), category: "animals", recognition: "un",
    summary: "Celebrates wild animals and plants and raises awareness of the threats they face.",
    background: "March 3 is the anniversary of the adoption of CITES (the Convention on International Trade in Endangered Species of Wild Fauna and Flora) in 1973. The UN General Assembly proclaimed the day in 2013.",
    establishedBy: "UN General Assembly (2013)", sources: [UN("world-wildlife-day"), WIKI("World Wildlife Day")], tags: ["wildlife", "conservation"],
  }),
  ev({
    id: "international-womens-day", name: "International Women's Day", rule: fixed(3, 8), category: "society", recognition: "un",
    summary: "Celebrates women's achievements and calls for gender equality.",
    background: "International Women's Day grew out of early 20th-century labour movements in North America and Europe. The United Nations began celebrating it in 1975, International Women's Year. It is a public holiday in several countries.",
    sources: [UN("womens-day"), WIKI("International Women's Day")], tags: ["women", "equality"],
  }),
  ev({
    id: "pi-day", name: "Pi Day", rule: fixed(3, 14), category: "science", recognition: "unofficial",
    summary: "A celebration of the mathematical constant π (3.14…), often with pie.",
    background: "Pi Day was started by physicist Larry Shaw at the San Francisco Exploratorium in 1988. The US House of Representatives passed a non-binding resolution recognising it in 2009.",
    sources: [SRC("Exploratorium", "https://www.exploratorium.edu/pi"), WIKI("Pi Day")], tags: ["math", "pi"],
  }),
  ev({
    id: "international-day-of-mathematics", name: "International Day of Mathematics", rule: fixed(3, 14), category: "science", recognition: "un",
    summary: "Celebrates the beauty and importance of mathematics in everyday life.",
    background: "UNESCO's General Conference proclaimed March 14 as the International Day of Mathematics in 2019; it was first celebrated in 2020. The date was chosen because of Pi Day.",
    establishedBy: "UNESCO (2019)", sources: [SRC("International Day of Mathematics", "https://www.idm314.org/"), WIKI("International Day of Mathematics")], tags: ["math"],
  }),
  ev({
    id: "st-patricks-day", name: "St Patrick's Day", rule: fixed(3, 17), category: "culture", recognition: "national", countries: ["IE", "GLOBAL"],
    summary: "Ireland's national day, celebrated by Irish communities around the world.",
    background: "The feast day of Saint Patrick, patron saint of Ireland, is a public holiday in Ireland and Northern Ireland. Parades and festivals are held in many cities worldwide.",
    sources: [WIKI("Saint Patrick's Day")], tags: ["ireland", "parade"],
  }),
  ev({
    id: "world-sparrow-day", name: "World Sparrow Day", rule: fixed(3, 20), category: "animals", recognition: "awareness",
    summary: "Draws attention to the decline of the house sparrow and other common birds.",
    background: "The day was initiated by the Nature Forever Society of India and first celebrated in 2010.",
    establishedBy: "Nature Forever Society (2010)", sources: [WIKI("World Sparrow Day")], tags: ["birds"],
  }),
  ev({
    id: "international-day-of-happiness", name: "International Day of Happiness", rule: fixed(3, 20), category: "relationships", recognition: "un",
    summary: "Recognises happiness and well-being as universal goals.",
    background: "The UN General Assembly established the day in 2012, following an initiative led by Bhutan, which had long promoted 'Gross National Happiness'. It was first observed in 2013.",
    establishedBy: "UN General Assembly (2012)", sources: [UN("happiness-day"), WIKI("International Day of Happiness")], tags: ["wellbeing"],
  }),
  ev({
    id: "nowruz", name: "International Day of Nowruz", rule: fixed(3, 21), category: "culture", recognition: "un",
    summary: "Persian New Year, celebrated for over 3,000 years across many cultures.",
    background: "Nowruz marks the first day of spring and the beginning of the year in the Iranian calendar. The UN General Assembly recognised March 21 as the International Day of Nowruz in 2010. The exact start of the new year follows the vernal equinox, which can fall on March 20 or 21.",
    establishedBy: "UN General Assembly (2010)", sources: [UN("international-nowruz-day"), WIKI("Nowruz")], tags: ["new year", "spring"],
  }),
  ev({
    id: "international-day-of-forests", name: "International Day of Forests", rule: fixed(3, 21), category: "environment", recognition: "un",
    summary: "Raises awareness of the importance of all types of forests.",
    background: "The UN General Assembly proclaimed March 21 the International Day of Forests in 2012.",
    establishedBy: "UN General Assembly (2012)", sources: [SRC("FAO — International Day of Forests", "https://www.fao.org/international-day-of-forests/en"), WIKI("International Day of Forests")], tags: ["trees", "nature"],
  }),
  ev({
    id: "world-poetry-day", name: "World Poetry Day", rule: fixed(3, 21), category: "culture", recognition: "un",
    summary: "Celebrates poetry as one of humanity's most treasured forms of expression.",
    background: "UNESCO adopted March 21 as World Poetry Day during its 30th General Conference in Paris in 1999.",
    establishedBy: "UNESCO (1999)", sources: [UN_LIST, WIKI("World Poetry Day")], tags: ["poetry", "literature"],
  }),
  ev({
    id: "mothers-day-arab", name: "Mother's Day (Arab world)", rule: fixed(3, 21), category: "relationships", recognition: "cultural", countries: ["EG", "AE", "OM"],
    summary: "Mother's Day as celebrated in Egypt and many Arab countries, on the first day of spring.",
    background: "Mother's Day on March 21 was introduced in Egypt by journalists Mustafa and Ali Amin and first celebrated in 1956. The custom spread to many countries in the Arab world.",
    note: "Mother's Day dates differ by country — see also the May and UK versions.",
    sources: [WIKI("Mother's Day")], tags: ["mother", "family"],
  }),
  ev({
    id: "world-water-day", name: "World Water Day", rule: fixed(3, 22), category: "environment", recognition: "un",
    summary: "Highlights the importance of fresh water and sustainable water management.",
    background: "World Water Day was recommended at the 1992 UN Conference on Environment and Development in Rio de Janeiro. The UN General Assembly designated March 22 and the first World Water Day was held in 1993.",
    establishedBy: "UN General Assembly (1992)", sources: [UN("water-day"), WIKI("World Water Day")], tags: ["water"],
  }),
  ev({
    id: "world-meteorological-day", name: "World Meteorological Day", rule: fixed(3, 23), category: "science", recognition: "un",
    summary: "Celebrates the contribution of weather, climate and water services to society.",
    background: "The day commemorates the entry into force of the convention establishing the World Meteorological Organization (WMO) on March 23, 1950.",
    establishedBy: "World Meteorological Organization", sources: [SRC("World Meteorological Organization", "https://wmo.int/"), WIKI("World Meteorological Day")], tags: ["weather", "climate"],
  }),
  ev({
    id: "world-tuberculosis-day", name: "World Tuberculosis Day", rule: fixed(3, 24), category: "health", recognition: "un",
    summary: "Builds awareness of tuberculosis and efforts to end the epidemic.",
    background: "March 24 marks the day in 1882 when Robert Koch announced the discovery of the bacterium that causes tuberculosis. It is one of WHO's official global public health campaigns.",
    establishedBy: "World Health Organization", sources: [WHO("world-tb-day"), WIKI("World Tuberculosis Day")], tags: ["tb", "disease"],
  }),
  ev({
    id: "mothering-sunday", name: "Mothering Sunday (UK & Ireland)", rule: easter(-21), category: "relationships", recognition: "cultural", countries: ["GB", "IE"],
    summary: "Mother's Day in the UK and Ireland, held on the fourth Sunday of Lent.",
    background: "Mothering Sunday falls three weeks before Easter Sunday, so its date moves each year. It began as a Christian tradition of returning to one's 'mother church' and became a day to honour mothers.",
    note: "Movable — calculated from the date of Easter.", sources: [WIKI("Mothering Sunday")], tags: ["mother", "family"],
  }),
  ev({
    id: "world-backup-day", name: "World Backup Day", rule: fixed(3, 31), category: "technology", recognition: "unofficial",
    summary: "A reminder to back up your data — the day before April Fools'.",
    background: "World Backup Day was started in 2011 by digital strategist Ismail Jadun to raise awareness of data loss and the importance of regular backups.",
    sources: [SRC("World Backup Day", "https://www.worldbackupday.com/"), WIKI("World Backup Day")], tags: ["data", "security", "cybersecurity"],
  }),

  // ======================= APRIL =======================
  ev({
    id: "good-friday", name: "Good Friday", rule: easter(-2), category: "culture", recognition: "cultural",
    summary: "Christian commemoration of the crucifixion of Jesus; a public holiday in many countries.",
    background: "Good Friday falls on the Friday before Easter Sunday. Because Easter is a movable feast, the date changes each year.",
    note: "Movable — calculated from the date of Easter.", sources: [WIKI("Good Friday")], tags: ["easter", "religious", "holiday"],
  }),
  ev({
    id: "easter-sunday", name: "Easter Sunday", rule: easter(0), category: "culture", recognition: "cultural",
    summary: "The principal Christian festival, celebrating the resurrection of Jesus.",
    background: "In Western Christianity, Easter falls on the first Sunday after the ecclesiastical full moon on or after March 21, so it can occur between March 22 and April 25. Orthodox churches often celebrate on a different date.",
    note: "Movable — this is the Western (Gregorian) date.", sources: [WIKI("Easter")], tags: ["easter", "religious", "spring"],
  }),
  ev({
    id: "world-health-day", name: "World Health Day", rule: fixed(4, 7), category: "health", recognition: "un",
    summary: "Marks the founding of the World Health Organization and focuses on a priority health theme.",
    background: "World Health Day is celebrated on April 7, the anniversary of WHO's founding in 1948. Each year it highlights a specific global health theme.",
    establishedBy: "World Health Organization", sources: [WHO("world-health-day"), WIKI("World Health Day")], tags: ["who", "wellbeing"],
  }),
  ev({
    id: "human-spaceflight-day", name: "International Day of Human Space Flight", rule: fixed(4, 12), category: "science", recognition: "un",
    summary: "Celebrates the beginning of the space era for humankind.",
    background: "On April 12, 1961, Yuri Gagarin became the first human to travel into space aboard Vostok 1. The UN General Assembly declared the day in 2011, the 50th anniversary of the flight.",
    establishedBy: "UN General Assembly (2011)", sources: [UN("human-spaceflight-day"), WIKI("International Day of Human Space Flight")], tags: ["space", "astronomy"],
  }),
  ev({
    id: "monuments-and-sites-day", name: "International Day for Monuments and Sites", rule: fixed(4, 18), category: "culture", recognition: "international",
    summary: "Also called World Heritage Day — celebrates the diversity of cultural heritage.",
    background: "The day was proposed by the International Council on Monuments and Sites (ICOMOS) in 1982 and approved by UNESCO's General Conference in 1983.",
    establishedBy: "ICOMOS (1982)", sources: [SRC("ICOMOS", "https://www.icomos.org/"), WIKI("World Heritage Day")], tags: ["heritage", "history"],
  }),
  ev({
    id: "creativity-innovation-day", name: "World Creativity and Innovation Day", rule: fixed(4, 21), category: "technology", recognition: "un",
    summary: "Raises awareness of the role of creativity and innovation in problem-solving.",
    background: "The UN General Assembly designated April 21 as World Creativity and Innovation Day in 2017.",
    establishedBy: "UN General Assembly (2017)", sources: [UN("creativity-and-innovation-day"), WIKI("World Creativity and Innovation Day")], tags: ["innovation"],
  }),
  ev({
    id: "earth-day", name: "International Mother Earth Day (Earth Day)", rule: fixed(4, 22), category: "environment", recognition: "un",
    summary: "A worldwide day of action for environmental protection.",
    background: "The first Earth Day was held in the United States on April 22, 1970, and is widely credited with launching the modern environmental movement. The UN General Assembly designated April 22 as International Mother Earth Day in 2009.",
    establishedBy: "UN General Assembly (2009)", sources: [UN("earth-day"), SRC("EARTHDAY.ORG", "https://www.earthday.org/"), WIKI("Earth Day")], tags: ["climate", "planet"],
  }),
  ev({
    id: "world-book-day", name: "World Book and Copyright Day", rule: fixed(4, 23), category: "culture", recognition: "un",
    summary: "Celebrates books, reading and the protection of intellectual property.",
    background: "UNESCO chose April 23 in 1995 because it is a symbolic date for world literature: Miguel de Cervantes, William Shakespeare and Inca Garcilaso de la Vega all died in 1616 on or around this date.",
    establishedBy: "UNESCO (1995)", sources: [UN_LIST, WIKI("World Book Day")], tags: ["books", "reading", "literature"],
  }),
  ev({
    id: "world-malaria-day", name: "World Malaria Day", rule: fixed(4, 25), category: "health", recognition: "un",
    summary: "Highlights global efforts to control and eliminate malaria.",
    background: "World Malaria Day was established by the World Health Assembly in 2007 and is one of WHO's official global public health campaigns.",
    establishedBy: "World Health Assembly (2007)", sources: [WHO("world-malaria-day"), WIKI("World Malaria Day")], tags: ["disease"],
  }),
  ev({
    id: "world-penguin-day", name: "World Penguin Day", rule: fixed(4, 25), category: "animals", recognition: "unofficial",
    summary: "Celebrates penguins and raises awareness of threats to their habitats.",
    background: "The date coincides with the approximate start of the annual northward migration of Adélie penguins in Antarctica.",
    sources: [WIKI("World Penguin Day")], tags: ["birds", "antarctica"],
  }),
  ev({
    id: "international-jazz-day", name: "International Jazz Day", rule: fixed(4, 30), category: "culture", recognition: "un",
    summary: "Highlights jazz and its role in uniting people across the globe.",
    background: "UNESCO's General Conference proclaimed April 30 as International Jazz Day in 2011, in partnership with the Herbie Hancock Institute of Jazz.",
    establishedBy: "UNESCO (2011)", sources: [UN("jazz-day"), WIKI("International Jazz Day")], tags: ["music"],
  }),

  // ======================= MAY =======================
  ev({
    id: "international-workers-day", name: "International Workers' Day (Labour Day)", rule: fixed(5, 1), category: "society", recognition: "national",
    summary: "Celebrates workers and the labour movement; a public holiday in many countries.",
    background: "May Day as a workers' holiday commemorates the 1886 Haymarket affair in Chicago and the campaign for an eight-hour working day. It is a public holiday in more than 80 countries. The US and Canada observe Labor Day in September instead.",
    sources: [WIKI("International Workers' Day")], tags: ["work", "holiday"],
  }),
  ev({
    id: "world-password-day", name: "World Password Day", rule: nth(5, THU, 1), category: "technology", recognition: "awareness",
    summary: "Encourages better password habits — think long passphrases, password managers and MFA.",
    background: "World Password Day was created by Intel in 2013 and is held on the first Thursday of May. It promotes strong, unique passwords and multi-factor authentication.",
    establishedBy: "Intel (2013)", sources: [WIKI("World Password Day")], tags: ["cybersecurity", "security", "passwords"],
  }),
  ev({
    id: "world-press-freedom-day", name: "World Press Freedom Day", rule: fixed(5, 3), category: "society", recognition: "un",
    summary: "Celebrates the fundamental principles of press freedom.",
    background: "The UN General Assembly proclaimed the day in 1993 following a UNESCO recommendation. It marks the anniversary of the 1991 Windhoek Declaration on free and pluralistic media.",
    establishedBy: "UN General Assembly (1993)", sources: [UN("press-freedom-day"), WIKI("World Press Freedom Day")], tags: ["media", "journalism"],
  }),
  ev({
    id: "childrens-day-japan", name: "Children's Day (Japan)", rule: fixed(5, 5), category: "relationships", recognition: "national", countries: ["JP"],
    summary: "A Japanese national holiday celebrating children's happiness and health.",
    background: "Kodomo no Hi became a national holiday in 1948. Families fly koinobori — carp-shaped streamers — symbolising strength and success.",
    sources: [WIKI("Children's Day (Japan)")], tags: ["children", "family", "golden week"],
  }),
  ev({
    id: "world-migratory-bird-day-may", name: "World Migratory Bird Day (May)", rule: nth(5, SAT, 2), category: "animals", recognition: "un",
    summary: "Raises awareness of migratory birds and the need to protect them.",
    background: "Since 2018 the campaign has been celebrated twice a year, on the second Saturday of May and of October, organised by two UN environmental treaties (CMS and AEWA) together with Environment for the Americas.",
    sources: [SRC("World Migratory Bird Day", "https://www.worldmigratorybirdday.org/"), WIKI("World Migratory Bird Day")], tags: ["birds", "migration"],
  }),
  ev({
    id: "mothers-day", name: "Mother's Day", rule: nth(5, SUN, 2), category: "relationships", recognition: "cultural", countries: ["US", "CA", "AU", "BR", "DE", "IN", "JP", "ZA"],
    summary: "Honours mothers and motherhood on the second Sunday of May in many countries.",
    background: "The modern Mother's Day was promoted by Anna Jarvis in the United States after her mother's death; US President Woodrow Wilson proclaimed it a national observance in 1914. Many countries adopted the same date.",
    note: "Dates vary — the UK and many Arab countries celebrate on different days.",
    sources: [WIKI("Mother's Day (United States)"), WIKI("Mother's Day")], tags: ["mother", "family"],
  }),
  ev({
    id: "international-day-of-families", name: "International Day of Families", rule: fixed(5, 15), category: "relationships", recognition: "un",
    summary: "Reflects the importance the international community attaches to families.",
    background: "The UN General Assembly proclaimed May 15 as the International Day of Families in 1993.",
    establishedBy: "UN General Assembly (1993)", sources: [UN("international-day-of-families"), WIKI("International Day of Families")], tags: ["family"],
  }),
  ev({
    id: "international-day-of-light", name: "International Day of Light", rule: fixed(5, 16), category: "science", recognition: "un",
    summary: "Celebrates the role light and light-based technologies play in our lives.",
    background: "May 16 is the anniversary of the first successful operation of the laser by physicist Theodore Maiman in 1960. UNESCO proclaimed the day in 2017 and it was first celebrated in 2018.",
    establishedBy: "UNESCO (2017)", sources: [SRC("International Day of Light", "https://www.lightday.org/"), WIKI("International Day of Light")], tags: ["physics", "laser"],
  }),
  ev({
    id: "world-telecommunication-day", name: "World Telecommunication and Information Society Day", rule: fixed(5, 17), category: "technology", recognition: "un",
    summary: "Raises awareness of how the internet and ICTs can transform societies.",
    background: "May 17 marks the signing of the first International Telegraph Convention and the creation of the International Telecommunication Union (ITU) in 1865.",
    establishedBy: "ITU / UN General Assembly", sources: [UN("telecommunication-day"), WIKI("World Telecommunication and Information Society Day")], tags: ["internet", "itu"],
  }),
  ev({
    id: "international-museum-day", name: "International Museum Day", rule: fixed(5, 18), category: "culture", recognition: "international",
    summary: "Raises awareness of museums as engines of cultural exchange.",
    background: "International Museum Day has been organised by the International Council of Museums (ICOM) since 1977.",
    establishedBy: "ICOM (1977)", sources: [SRC("ICOM", "https://icom.museum/en/our-actions/events/international-museum-day/"), WIKI("International Museum Day")], tags: ["museums", "art", "history"],
  }),
  ev({
    id: "world-bee-day", name: "World Bee Day", rule: fixed(5, 20), category: "animals", recognition: "un",
    summary: "Raises awareness of the essential role of bees and other pollinators.",
    background: "Proposed by Slovenia, the day was proclaimed by the UN General Assembly in 2017. May 20 is the birthday of Anton Janša, a pioneer of modern beekeeping born in 1734.",
    establishedBy: "UN General Assembly (2017)", sources: [UN_LIST, WIKI("World Bee Day")], tags: ["bees", "pollinators", "insects"],
  }),
  ev({
    id: "international-tea-day", name: "International Tea Day", rule: fixed(5, 21), category: "food", recognition: "un",
    summary: "Celebrates tea's long history and its cultural and economic significance.",
    background: "The UN General Assembly designated May 21 as International Tea Day in December 2019; FAO leads the observance.",
    establishedBy: "UN General Assembly (2019)", sources: [SRC("FAO — International Tea Day", "https://www.fao.org/international-tea-day/en"), WIKI("International Tea Day")], tags: ["tea", "drinks"],
  }),
  ev({
    id: "biodiversity-day", name: "International Day for Biological Diversity", rule: fixed(5, 22), category: "environment", recognition: "un",
    summary: "Increases understanding and awareness of biodiversity issues.",
    background: "May 22 commemorates the adoption of the text of the Convention on Biological Diversity on May 22, 1992.",
    establishedBy: "UN General Assembly", sources: [UN("biological-diversity-day"), WIKI("International Day for Biological Diversity")], tags: ["nature", "species"],
  }),
  ev({
    id: "world-no-tobacco-day", name: "World No Tobacco Day", rule: fixed(5, 31), category: "health", recognition: "un",
    summary: "Highlights the health risks of tobacco use.",
    background: "WHO Member States created World No Tobacco Day in 1987 to draw attention to the tobacco epidemic and the preventable death and disease it causes.",
    establishedBy: "World Health Organization (1987)", sources: [WHO("world-no-tobacco-day"), WIKI("World No Tobacco Day")], tags: ["smoking"],
  }),

  // ======================= JUNE =======================
  ev({
    id: "global-day-of-parents", name: "Global Day of Parents", rule: fixed(6, 1), category: "relationships", recognition: "un",
    summary: "Appreciates parents for their commitment to their children.",
    background: "The UN General Assembly proclaimed June 1 as the Global Day of Parents in 2012.",
    establishedBy: "UN General Assembly (2012)", sources: [UN("parents-day"), WIKI("Global Day of Parents")], tags: ["family", "parents"],
  }),
  ev({
    id: "world-bicycle-day", name: "World Bicycle Day", rule: fixed(6, 3), category: "health", recognition: "un",
    summary: "Celebrates the bicycle as a simple, affordable and sustainable means of transport.",
    background: "The UN General Assembly declared June 3 as World Bicycle Day in April 2018.",
    establishedBy: "UN General Assembly (2018)", sources: [UN("bicycle-day"), WIKI("World Bicycle Day")], tags: ["cycling", "transport", "fitness"],
  }),
  ev({
    id: "world-environment-day", name: "World Environment Day", rule: fixed(6, 5), category: "environment", recognition: "un",
    summary: "The UN's principal day for encouraging awareness and action for the environment.",
    background: "Established by the UN General Assembly in 1972 on the opening day of the Stockholm Conference on the Human Environment, World Environment Day was first held in 1973. It is led by the UN Environment Programme (UNEP), with a different host country and theme each year.",
    establishedBy: "UN General Assembly (1972)", sources: [UN("environment-day"), SRC("UNEP — World Environment Day", "https://www.worldenvironmentday.global/"), WIKI("World Environment Day")], tags: ["climate", "planet", "unep"],
  }),
  ev({
    id: "world-food-safety-day", name: "World Food Safety Day", rule: fixed(6, 7), category: "food", recognition: "un",
    summary: "Draws attention to preventing, detecting and managing foodborne risks.",
    background: "The UN General Assembly adopted a resolution establishing World Food Safety Day in 2018; it was first observed in 2019 and is facilitated by WHO and FAO.",
    establishedBy: "UN General Assembly (2018)", sources: [UN("food-safety-day"), WIKI("World Food Safety Day")], tags: ["food safety", "nutrition"],
  }),
  ev({
    id: "world-oceans-day", name: "World Oceans Day", rule: fixed(6, 8), category: "environment", recognition: "un",
    summary: "Celebrates the ocean and the role it plays in everyday life.",
    background: "The idea was proposed at the 1992 Earth Summit in Rio de Janeiro. The UN General Assembly officially recognised June 8 as World Oceans Day in 2008.",
    establishedBy: "UN General Assembly (2008)", sources: [UN("oceans-day"), WIKI("World Oceans Day")], tags: ["ocean", "sea", "water"],
  }),
  ev({
    id: "world-blood-donor-day", name: "World Blood Donor Day", rule: fixed(6, 14), category: "health", recognition: "un",
    summary: "Thanks voluntary blood donors and raises awareness of the need for safe blood.",
    background: "June 14 is the birthday of Karl Landsteiner, who discovered the ABO blood group system. The day was first held in 2004 and is one of WHO's official global public health campaigns.",
    establishedBy: "World Health Organization", sources: [WHO("world-blood-donor-day"), WIKI("World Blood Donor Day")], tags: ["blood", "donation"],
  }),
  ev({
    id: "fathers-day", name: "Father's Day", rule: nth(6, SUN, 3), category: "relationships", recognition: "cultural", countries: ["US", "CA", "GB", "IN", "JP", "ZA", "FR", "IE"],
    summary: "Honours fathers and fatherhood on the third Sunday of June in many countries.",
    background: "In the United States, Father's Day was made a permanent national observance in 1972. Many other countries celebrate on the same day, while some — such as Germany and Australia — use different dates.",
    note: "Dates vary by country.", sources: [WIKI("Father's Day")], tags: ["father", "family"],
  }),
  ev({
    id: "world-refugee-day", name: "World Refugee Day", rule: fixed(6, 20), category: "society", recognition: "un",
    summary: "Honours refugees around the globe and celebrates their strength and courage.",
    background: "World Refugee Day was first held on June 20, 2001, marking the 50th anniversary of the 1951 Convention relating to the Status of Refugees.",
    establishedBy: "UN General Assembly (2000)", sources: [UN("refugee-day"), WIKI("World Refugee Day")], tags: ["refugees", "unhcr"],
  }),
  ev({
    id: "international-day-of-yoga", name: "International Day of Yoga", rule: fixed(6, 21), category: "health", recognition: "un",
    summary: "Raises awareness of the many benefits of practising yoga.",
    background: "Proposed by India, the day was proclaimed by the UN General Assembly in December 2014 and first observed in 2015. June 21 is close to the June solstice.",
    establishedBy: "UN General Assembly (2014)", sources: [UN("yoga-day"), WIKI("International Day of Yoga")], tags: ["yoga", "fitness", "wellbeing"],
  }),
  ev({
    id: "world-music-day", name: "World Music Day (Fête de la Musique)", rule: fixed(6, 21), category: "culture", recognition: "cultural",
    summary: "A day of free, public music-making in streets and parks.",
    background: "Fête de la Musique was launched in France in 1982 and has spread to cities in more than 100 countries.",
    countries: ["FR", "GLOBAL"], sources: [WIKI("Fête de la Musique")], tags: ["music", "festival"],
  }),

  // ======================= JULY =======================
  ev({
    id: "canada-day", name: "Canada Day", rule: fixed(7, 1), category: "culture", recognition: "national", countries: ["CA"],
    summary: "Canada's national day, marking Confederation in 1867.",
    background: "Canada Day celebrates the anniversary of the Constitution Act, 1867, which united three colonies into a single country within the British Empire on July 1, 1867.",
    sources: [SRC("Government of Canada", "https://www.canada.ca/en/canadian-heritage/campaigns/canada-day.html"), WIKI("Canada Day")], tags: ["national day"],
  }),
  ev({
    id: "us-independence-day", name: "Independence Day (United States)", rule: fixed(7, 4), category: "culture", recognition: "national", countries: ["US"],
    summary: "Commemorates the adoption of the Declaration of Independence in 1776.",
    background: "The Continental Congress adopted the Declaration of Independence on July 4, 1776. The day is a federal holiday marked by fireworks, parades and barbecues.",
    sources: [WIKI("Independence Day (United States)")], tags: ["national day", "fireworks"],
  }),
  ev({
    id: "world-chocolate-day", name: "World Chocolate Day", rule: fixed(7, 7), category: "food", recognition: "unofficial",
    summary: "A sweet excuse to celebrate chocolate in all its forms.",
    background: "World Chocolate Day is an informal celebration observed by chocolate lovers and confectioners. Other chocolate days exist on different dates in some countries.",
    sources: [WIKI("Chocolate")], tags: ["chocolate", "sweets"],
  }),
  ev({
    id: "world-population-day", name: "World Population Day", rule: fixed(7, 11), category: "society", recognition: "un",
    summary: "Focuses attention on the urgency and importance of population issues.",
    background: "The Governing Council of the UN Development Programme established the day in 1989, inspired by public interest in 'Five Billion Day' on July 11, 1987.",
    establishedBy: "UNDP Governing Council (1989)", sources: [UN("world-population-day"), WIKI("World Population Day")], tags: ["population", "demographics"],
  }),
  ev({
    id: "bastille-day", name: "Bastille Day (Fête nationale)", rule: fixed(7, 14), category: "culture", recognition: "national", countries: ["FR"],
    summary: "France's national day, commemorating the storming of the Bastille in 1789.",
    background: "The national holiday commemorates the storming of the Bastille on July 14, 1789, and the Fête de la Fédération of 1790. It features a military parade on the Champs-Élysées.",
    sources: [WIKI("Bastille Day")], tags: ["national day"],
  }),
  ev({
    id: "nelson-mandela-day", name: "Nelson Mandela International Day", rule: fixed(7, 18), category: "society", recognition: "un",
    summary: "Encourages everyone to take action and inspire change, honouring Nelson Mandela's legacy.",
    background: "Held on Nelson Mandela's birthday, the day was declared by the UN General Assembly in November 2009 and first observed in 2010.",
    establishedBy: "UN General Assembly (2009)", sources: [UN_LIST, WIKI("Mandela Day")], tags: ["peace", "service"],
  }),
  ev({
    id: "international-tiger-day", name: "International Tiger Day", rule: fixed(7, 29), category: "animals", recognition: "awareness",
    summary: "Raises awareness for tiger conservation.",
    background: "International Tiger Day was created at the Saint Petersburg Tiger Summit in 2010, where tiger-range countries pledged to double wild tiger numbers.",
    establishedBy: "Saint Petersburg Tiger Summit (2010)", sources: [WIKI("International Tiger Day")], tags: ["big cats", "conservation", "wildlife"],
  }),
  ev({
    id: "sysadmin-day", name: "System Administrator Appreciation Day", rule: nth(7, FRI, -1), category: "technology", recognition: "unofficial",
    summary: "Say thank you to the people who keep your servers, networks and laptops running.",
    background: "SysAdmin Day was started in 2000 by system administrator Ted Kekatos and is held on the last Friday of July.",
    sources: [SRC("SysAdmin Day", "https://sysadminday.com/"), WIKI("System Administrator Appreciation Day")], tags: ["it", "ops"],
  }),
  ev({
    id: "international-day-of-friendship", name: "International Day of Friendship", rule: fixed(7, 30), category: "relationships", recognition: "un",
    summary: "Celebrates friendship between peoples, countries and cultures.",
    background: "The UN General Assembly proclaimed July 30 the International Day of Friendship in 2011. Several countries also celebrate a Friendship Day on the first Sunday of August.",
    establishedBy: "UN General Assembly (2011)", sources: [UN("friendship-day"), WIKI("Friendship Day")], tags: ["friends"],
  }),

  // ======================= AUGUST =======================
  ev({
    id: "international-cat-day", name: "International Cat Day", rule: fixed(8, 8), category: "animals", recognition: "awareness",
    summary: "Celebrates cats and promotes their welfare.",
    background: "International Cat Day was created in 2002 by the International Fund for Animal Welfare (IFAW). Since 2020 it has been led by the charity International Cat Care. Some countries have their own cat days — for example, February 22 in Japan.",
    establishedBy: "IFAW (2002)", sources: [SRC("International Cat Care", "https://icatcare.org/"), WIKI("International Cat Day")], tags: ["cats", "pets"],
  }),
  ev({
    id: "indigenous-peoples-day", name: "International Day of the World's Indigenous Peoples", rule: fixed(8, 9), category: "society", recognition: "un",
    summary: "Promotes and protects the rights of the world's Indigenous peoples.",
    background: "The UN General Assembly established the day in 1994. August 9 marks the first meeting of the UN Working Group on Indigenous Populations in 1982.",
    establishedBy: "UN General Assembly (1994)", sources: [UN("indigenous-day"), WIKI("International Day of the World's Indigenous Peoples")], tags: ["indigenous", "rights"],
  }),
  ev({
    id: "world-lion-day", name: "World Lion Day", rule: fixed(8, 10), category: "animals", recognition: "awareness",
    summary: "Raises awareness of the lion and the threats it faces in the wild.",
    background: "World Lion Day was founded in 2013 by conservationists Dereck and Beverly Joubert.",
    sources: [WIKI("World Lion Day")], tags: ["big cats", "wildlife", "conservation"],
  }),
  ev({
    id: "international-youth-day", name: "International Youth Day", rule: fixed(8, 12), category: "society", recognition: "un",
    summary: "Brings youth issues to the attention of the international community.",
    background: "The UN General Assembly endorsed the recommendation of the World Conference of Ministers Responsible for Youth in 1999; the first International Youth Day was observed in 2000.",
    establishedBy: "UN General Assembly (1999)", sources: [UN("youth-day"), WIKI("International Youth Day")], tags: ["youth"],
  }),
  ev({
    id: "world-elephant-day", name: "World Elephant Day", rule: fixed(8, 12), category: "animals", recognition: "awareness",
    summary: "Brings attention to the urgent plight of Asian and African elephants.",
    background: "World Elephant Day was launched on August 12, 2012, co-founded by Canadian filmmaker Patricia Sims and Thailand's Elephant Reintroduction Foundation.",
    sources: [SRC("World Elephant Day", "https://worldelephantday.org/"), WIKI("World Elephant Day")], tags: ["elephants", "wildlife", "conservation"],
  }),
  ev({
    id: "india-independence-day", name: "Independence Day (India)", rule: fixed(8, 15), category: "culture", recognition: "national", countries: ["IN"],
    summary: "Commemorates India's independence from British rule in 1947.",
    background: "India became independent on August 15, 1947. The Prime Minister raises the national flag at the Red Fort in Delhi each year.",
    sources: [WIKI("Independence Day (India)")], tags: ["national day"],
  }),
  ev({
    id: "world-humanitarian-day", name: "World Humanitarian Day", rule: fixed(8, 19), category: "society", recognition: "un",
    summary: "Honours aid workers and advocates for the safety of humanitarian personnel.",
    background: "The day marks the anniversary of the August 19, 2003 bombing of the Canal Hotel in Baghdad, which killed 22 people including UN envoy Sérgio Vieira de Mello. The UN General Assembly designated it in 2008.",
    establishedBy: "UN General Assembly (2008)", sources: [UN("humanitarian-day"), WIKI("World Humanitarian Day")], tags: ["aid", "humanitarian"],
  }),
  ev({
    id: "national-dog-day", name: "National Dog Day", rule: fixed(8, 26), category: "animals", recognition: "unofficial", countries: ["US"],
    summary: "Celebrates dogs and encourages adoption from shelters.",
    background: "National Dog Day was founded in 2004 by pet lifestyle expert Colleen Paige. It is widely celebrated online, beyond the United States.",
    sources: [WIKI("National Dog Day")], tags: ["dogs", "pets", "adoption"],
  }),

  // ======================= SEPTEMBER =======================
  ev({
    id: "us-labor-day", name: "Labor Day (United States)", rule: nth(9, MON, 1), category: "society", recognition: "national", countries: ["US", "CA"],
    summary: "Honours the contributions of workers, on the first Monday of September.",
    background: "Labor Day became a US federal holiday in 1894. Canada celebrates Labour Day on the same day.",
    sources: [SRC("U.S. Department of Labor", "https://www.dol.gov/general/laborday/history"), WIKI("Labor Day")], tags: ["work", "holiday"],
  }),
  ev({
    id: "international-literacy-day", name: "International Literacy Day", rule: fixed(9, 8), category: "society", recognition: "un",
    summary: "Highlights the importance of literacy as a matter of dignity and human rights.",
    background: "UNESCO proclaimed September 8 as International Literacy Day in 1966; it was first celebrated in 1967.",
    establishedBy: "UNESCO (1966)", sources: [UN_LIST, WIKI("International Literacy Day")], tags: ["education", "reading"],
  }),
  ev({
    id: "programmers-day", name: "Programmers' Day", rule: { type: "day-of-year", day: 256 }, category: "technology", recognition: "unofficial",
    summary: "Celebrated on the 256th day of the year — the number of values in an 8-bit byte.",
    background: "Programmers' Day falls on September 13, or September 12 in leap years. It has been an official professional holiday in Russia since 2009 and is celebrated informally by developers worldwide.",
    note: "Falls on Sept 13, or Sept 12 in leap years.", sources: [WIKI("Programmers' Day")], tags: ["coding", "developers", "software"],
  }),
  ev({
    id: "international-day-of-democracy", name: "International Day of Democracy", rule: fixed(9, 15), category: "society", recognition: "un",
    summary: "Reviews the state of democracy in the world.",
    background: "The UN General Assembly established September 15 as the International Day of Democracy in 2007.",
    establishedBy: "UN General Assembly (2007)", sources: [UN("democracy-day"), WIKI("International Day of Democracy")], tags: ["democracy"],
  }),
  ev({
    id: "ozone-day", name: "International Day for the Preservation of the Ozone Layer", rule: fixed(9, 16), category: "environment", recognition: "un",
    summary: "Celebrates the Montreal Protocol and the healing of the ozone layer.",
    background: "September 16 marks the signing of the Montreal Protocol on Substances that Deplete the Ozone Layer in 1987. The UN General Assembly proclaimed the day in 1994.",
    establishedBy: "UN General Assembly (1994)", sources: [UN("ozone-day"), WIKI("International Day for the Preservation of the Ozone Layer")], tags: ["climate", "atmosphere"],
  }),
  ev({
    id: "mexico-independence-day", name: "Independence Day (Mexico)", rule: fixed(9, 16), category: "culture", recognition: "national", countries: ["MX"],
    summary: "Celebrates the start of Mexico's War of Independence in 1810.",
    background: "Celebrations begin on the night of September 15 with the 'Grito de Dolores', recalling Miguel Hidalgo's call to arms in 1810.",
    sources: [WIKI("Independence Day (Mexico)")], tags: ["national day"],
  }),
  ev({
    id: "international-day-of-peace", name: "International Day of Peace", rule: fixed(9, 21), category: "society", recognition: "un",
    summary: "Devoted to strengthening the ideals of peace, including 24 hours of non-violence and ceasefire.",
    background: "The UN General Assembly established the day in 1981. In 2001 it voted unanimously to designate it a day of non-violence and ceasefire, held annually on September 21.",
    establishedBy: "UN General Assembly (1981)", sources: [UN("international-day-peace"), WIKI("International Day of Peace")], tags: ["peace"],
  }),
  ev({
    id: "saudi-national-day", name: "Saudi National Day", rule: fixed(9, 23), category: "culture", recognition: "national", countries: ["SA"],
    summary: "Marks the unification of the Kingdom of Saudi Arabia in 1932.",
    background: "On September 23, 1932, King Abdulaziz Al Saud proclaimed the unification of the country as the Kingdom of Saudi Arabia.",
    sources: [WIKI("Saudi National Day")], tags: ["national day", "gcc"],
  }),
  ev({
    id: "world-tourism-day", name: "World Tourism Day", rule: fixed(9, 27), category: "culture", recognition: "un",
    summary: "Highlights tourism's social, cultural, political and economic value.",
    background: "Celebrated since 1980 by UN Tourism (formerly UNWTO), the date marks the adoption of the organisation's statutes on September 27, 1970.",
    establishedBy: "UN Tourism", sources: [SRC("UN Tourism", "https://www.untourism.int/"), WIKI("World Tourism Day")], tags: ["travel"],
  }),
  ev({
    id: "world-heart-day", name: "World Heart Day", rule: fixed(9, 29), category: "health", recognition: "international",
    summary: "Raises awareness of cardiovascular disease, the world's leading cause of death.",
    background: "World Heart Day is organised by the World Heart Federation and is held every year on September 29.",
    establishedBy: "World Heart Federation", sources: [SRC("World Heart Federation", "https://world-heart-federation.org/world-heart-day/"), WIKI("World Heart Day")], tags: ["heart"],
  }),

  // ======================= OCTOBER =======================
  ev({
    id: "cybersecurity-awareness-month", name: "Cybersecurity Awareness Month", rule: fixed(10, 1), durationDays: 31, category: "technology", recognition: "awareness", countries: ["US", "GLOBAL"],
    summary: "A month-long push to help everyone stay safer and more secure online.",
    background: "Cybersecurity Awareness Month has been held every October in the United States since 2004, led by CISA and the National Cybersecurity Alliance. The European Union runs a parallel European Cybersecurity Month (ECSM) coordinated by ENISA.",
    sources: [SRC("CISA", "https://www.cisa.gov/cybersecurity-awareness-month"), SRC("ENISA — ECSM", "https://cybersecuritymonth.eu/"), WIKI("Cybersecurity Awareness Month")], tags: ["cybersecurity", "security", "phishing"],
  }),
  ev({
    id: "international-day-of-older-persons", name: "International Day of Older Persons", rule: fixed(10, 1), category: "society", recognition: "un",
    summary: "Recognises the contributions of older people and examines issues affecting them.",
    background: "The UN General Assembly designated October 1 as the International Day of Older Persons in 1990.",
    establishedBy: "UN General Assembly (1990)", sources: [UN("older-persons-day"), WIKI("International Day of Older Persons")], tags: ["ageing", "elderly"],
  }),
  ev({
    id: "international-coffee-day", name: "International Coffee Day", rule: fixed(10, 1), category: "food", recognition: "international",
    summary: "Celebrates coffee and the millions of farmers who grow it.",
    background: "The International Coffee Organization launched the first official International Coffee Day in Milan in 2015.",
    establishedBy: "International Coffee Organization (2015)", sources: [UN("coffee-day"), SRC("International Coffee Organization", "https://www.ico.org/"), WIKI("International Coffee Day")], tags: ["coffee", "drinks"],
  }),
  ev({
    id: "german-unity-day", name: "German Unity Day", rule: fixed(10, 3), category: "culture", recognition: "national", countries: ["DE"],
    summary: "Germany's national day, marking reunification in 1990.",
    background: "On October 3, 1990, the German Democratic Republic joined the Federal Republic of Germany, reuniting the country.",
    sources: [WIKI("German Unity Day")], tags: ["national day"],
  }),
  ev({
    id: "world-animal-day", name: "World Animal Day", rule: fixed(10, 4), category: "animals", recognition: "awareness",
    summary: "A global day of action for animal rights and welfare.",
    background: "World Animal Day was first organised by cynologist Heinrich Zimmermann in Berlin in 1925. October 4 is the feast day of Francis of Assisi, patron saint of animals.",
    sources: [SRC("World Animal Day", "https://www.worldanimalday.org.uk/"), WIKI("World Animal Day")], tags: ["animal welfare", "pets", "wildlife"],
  }),
  ev({
    id: "world-space-week", name: "World Space Week", rule: fixed(10, 4), durationDays: 7, category: "science", recognition: "un",
    summary: "The largest annual space event in the world, held October 4–10.",
    background: "The UN General Assembly declared World Space Week in 1999. The dates mark the launch of Sputnik 1 on October 4, 1957, and the entry into force of the Outer Space Treaty on October 10, 1967.",
    establishedBy: "UN General Assembly (1999)", sources: [UN("world-space-week"), SRC("World Space Week Association", "https://www.worldspaceweek.org/"), WIKI("World Space Week")], tags: ["space", "astronomy"],
  }),
  ev({
    id: "world-teachers-day", name: "World Teachers' Day", rule: fixed(10, 5), category: "society", recognition: "un",
    summary: "Celebrates teachers and the essential role they play.",
    background: "Held since 1994, the day commemorates the adoption of the 1966 ILO/UNESCO Recommendation concerning the Status of Teachers.",
    establishedBy: "UNESCO (1994)", sources: [UN_LIST, WIKI("World Teachers' Day")], tags: ["education", "school"],
  }),
  ev({
    id: "world-mental-health-day", name: "World Mental Health Day", rule: fixed(10, 10), category: "health", recognition: "international",
    summary: "Raises awareness of mental health issues and mobilises support.",
    background: "World Mental Health Day was first celebrated in 1992 at the initiative of the World Federation for Mental Health. WHO supports the day each year.",
    establishedBy: "World Federation for Mental Health (1992)", sources: [WHO("world-mental-health-day"), WIKI("World Mental Health Day")], tags: ["mental health", "wellbeing"],
  }),
  ev({
    id: "world-migratory-bird-day-oct", name: "World Migratory Bird Day (October)", rule: nth(10, SAT, 2), category: "animals", recognition: "un",
    summary: "The autumn edition of the twice-yearly migratory bird campaign.",
    background: "Since 2018 World Migratory Bird Day has been celebrated on the second Saturday of May and of October, reflecting the cyclical nature of bird migration.",
    sources: [SRC("World Migratory Bird Day", "https://www.worldmigratorybirdday.org/"), WIKI("World Migratory Bird Day")], tags: ["birds", "migration"],
  }),
  ev({
    id: "thanksgiving-canada", name: "Thanksgiving (Canada)", rule: nth(10, MON, 2), category: "culture", recognition: "national", countries: ["CA"],
    summary: "Canada's harvest festival, on the second Monday of October.",
    background: "Thanksgiving has been celebrated on the second Monday of October in Canada since 1957.",
    sources: [WIKI("Thanksgiving (Canada)")], tags: ["harvest", "family", "holiday"],
  }),
  ev({
    id: "ada-lovelace-day", name: "Ada Lovelace Day", rule: nth(10, TUE, 2), category: "technology", recognition: "awareness",
    summary: "Celebrates the achievements of women in science, technology, engineering and maths.",
    background: "Founded in 2009 by Suw Charman-Anderson, the day is named after Ada Lovelace, often described as the first computer programmer for her notes on Charles Babbage's Analytical Engine. It is held on the second Tuesday of October.",
    establishedBy: "Suw Charman-Anderson (2009)", sources: [SRC("Ada Lovelace Day", "https://findingada.com/"), WIKI("Ada Lovelace Day")], tags: ["women", "stem", "computing"],
  }),
  ev({
    id: "world-food-day", name: "World Food Day", rule: fixed(10, 16), category: "food", recognition: "un",
    summary: "Promotes worldwide awareness and action against hunger.",
    background: "World Food Day marks the founding of the Food and Agriculture Organization of the United Nations (FAO) on October 16, 1945.",
    establishedBy: "FAO (1979)", sources: [SRC("FAO", "https://www.fao.org/world-food-day/en"), WIKI("World Food Day")], tags: ["hunger", "farming", "fao"],
  }),
  ev({
    id: "mole-day", name: "Mole Day", rule: fixed(10, 23), category: "science", recognition: "unofficial",
    summary: "Chemists celebrate Avogadro's number (6.02 × 10²³) from 6:02 a.m. to 6:02 p.m.",
    background: "Mole Day is celebrated mainly among chemistry students and teachers. The National Mole Day Foundation was founded in 1991.",
    sources: [SRC("National Mole Day Foundation", "https://www.moleday.org/"), WIKI("Mole Day")], tags: ["chemistry"],
  }),
  ev({
    id: "united-nations-day", name: "United Nations Day", rule: fixed(10, 24), category: "society", recognition: "un",
    summary: "Marks the anniversary of the UN Charter entering into force in 1945.",
    background: "The Charter of the United Nations entered into force on October 24, 1945, after being ratified by a majority of its signatories. The day has been celebrated since 1948.",
    establishedBy: "UN General Assembly (1947)", sources: [UN("un-day"), WIKI("United Nations Day")], tags: ["un", "peace", "cooperation"],
  }),
  ev({
    id: "world-pasta-day", name: "World Pasta Day", rule: fixed(10, 25), category: "food", recognition: "unofficial",
    summary: "A celebration of pasta, from spaghetti to orecchiette.",
    background: "World Pasta Day was established in 1995 during the first World Pasta Congress.",
    sources: [WIKI("World Pasta Day")], tags: ["pasta", "italian"],
  }),
  ev({
    id: "halloween", name: "Halloween", rule: fixed(10, 31), category: "culture", recognition: "cultural",
    summary: "The eve of All Saints' Day — costumes, pumpkins and trick-or-treating.",
    background: "Halloween's traditions have roots in the Celtic festival of Samhain and the Christian observance of All Hallows' Eve. It is especially popular in Ireland, the UK, the US and Canada.",
    sources: [WIKI("Halloween")], tags: ["costumes", "pumpkin", "autumn"],
  }),

  // ======================= NOVEMBER =======================
  ev({
    id: "day-of-the-dead", name: "Day of the Dead (Día de Muertos)", rule: fixed(11, 1), durationDays: 2, category: "culture", recognition: "cultural", countries: ["MX"],
    summary: "Families honour and remember loved ones who have died, with altars, marigolds and food.",
    background: "Día de Muertos is held mainly on November 1 and 2. UNESCO inscribed the Indigenous festivity dedicated to the dead on its Representative List of the Intangible Cultural Heritage of Humanity in 2008.",
    sources: [SRC("UNESCO Intangible Heritage", "https://ich.unesco.org/en/RL/indigenous-festivity-dedicated-to-the-dead-00054"), WIKI("Day of the Dead")], tags: ["remembrance", "festival", "mexico"],
  }),
  ev({
    id: "science-for-peace-day", name: "World Science Day for Peace and Development", rule: fixed(11, 10), category: "science", recognition: "un",
    summary: "Highlights the role of science in society and the need to engage the public in science.",
    background: "UNESCO proclaimed the day in 2001; it was first celebrated in 2002.",
    establishedBy: "UNESCO (2001)", sources: [UN("world-science-day"), WIKI("World Science Day for Peace and Development")], tags: ["research"],
  }),
  ev({
    id: "world-kindness-day", name: "World Kindness Day", rule: fixed(11, 13), category: "relationships", recognition: "awareness",
    summary: "Encourages good deeds and kindness in everyday life.",
    background: "World Kindness Day was introduced in 1998 by the World Kindness Movement, a coalition of kindness organisations.",
    establishedBy: "World Kindness Movement (1998)", sources: [WIKI("World Kindness Day")], tags: ["kindness", "community"],
  }),
  ev({
    id: "world-diabetes-day", name: "World Diabetes Day", rule: fixed(11, 14), category: "health", recognition: "un",
    summary: "The world's largest diabetes awareness campaign.",
    background: "Created in 1991 by the International Diabetes Federation and WHO, the day became an official UN day in 2006. November 14 is the birthday of Frederick Banting, who co-discovered insulin.",
    establishedBy: "IDF & WHO (1991); UN (2006)", sources: [UN("diabetes-day"), WIKI("World Diabetes Day")], tags: ["diabetes", "insulin"],
  }),
  ev({
    id: "world-toilet-day", name: "World Toilet Day", rule: fixed(11, 19), category: "health", recognition: "un",
    summary: "Raises awareness of the billions of people living without safely managed sanitation.",
    background: "The World Toilet Organization established the day in 2001. It became an official UN International Day in 2013.",
    establishedBy: "UN General Assembly (2013)", sources: [UN("toilet-day"), WIKI("World Toilet Day")], tags: ["sanitation", "water"],
  }),
  ev({
    id: "oman-national-day", name: "Oman National Day", rule: fixed(11, 20), category: "culture", recognition: "national", countries: ["OM"],
    summary: "The Sultanate of Oman's national day.",
    background: "Oman's National Day was traditionally celebrated on November 18. Royal Decree No. 15/2025 (January 2025) set November 20 and 21 as the official National Day holiday dates.",
    note: "The public holiday may be moved; check the official announcement for the observed days each year.",
    sources: [SRC("Office Holidays — Oman", "https://www.officeholidays.com/countries/oman/national_day.php"), WIKI("Oman National Day")], tags: ["national day", "gcc", "oman"],
  }),
  ev({
    id: "world-childrens-day", name: "World Children's Day", rule: fixed(11, 20), category: "relationships", recognition: "un",
    summary: "Promotes international togetherness and children's welfare.",
    background: "First established in 1954, November 20 marks the adoption of the Declaration of the Rights of the Child (1959) and the Convention on the Rights of the Child (1989) by the UN General Assembly.",
    establishedBy: "UN General Assembly (1954)", sources: [UN("world-childrens-day"), SRC("UNICEF", "https://www.unicef.org/world-childrens-day"), WIKI("Universal Children's Day")], tags: ["children", "rights"],
  }),
  ev({
    id: "world-hello-day", name: "World Hello Day", rule: fixed(11, 21), category: "relationships", recognition: "unofficial",
    summary: "Say hello to ten people today — a small act for peace.",
    background: "World Hello Day was created in 1973 in response to the conflict between Egypt and Israel, encouraging communication as a path to peace.",
    sources: [WIKI("World Hello Day")], tags: ["peace", "greetings"],
  }),
  ev({
    id: "world-television-day", name: "World Television Day", rule: fixed(11, 21), category: "technology", recognition: "un",
    summary: "Recognises television's role in communication and globalisation.",
    background: "The UN General Assembly proclaimed November 21 as World Television Day in 1996, marking the first World Television Forum held that year.",
    establishedBy: "UN General Assembly (1996)", sources: [UN("world-television-day"), WIKI("World Television Day")], tags: ["media", "broadcasting"],
  }),
  ev({
    id: "us-thanksgiving", name: "Thanksgiving (United States)", rule: nth(11, THU, 4), category: "culture", recognition: "national", countries: ["US"],
    summary: "A national holiday of gratitude and feasting, on the fourth Thursday of November.",
    background: "Thanksgiving became a national holiday under President Abraham Lincoln in 1863. Since 1941 it has been fixed by law as the fourth Thursday of November.",
    sources: [WIKI("Thanksgiving (United States)")], tags: ["harvest", "family", "holiday"],
  }),
  ev({
    id: "computer-security-day", name: "Computer Security Day", rule: fixed(11, 30), category: "technology", recognition: "unofficial",
    summary: "A yearly reminder to update, patch and protect your devices and accounts.",
    background: "Computer Security Day began in 1988, the year the Morris worm brought widespread attention to the vulnerability of networked computers.",
    sources: [WIKI("Computer Security Day")], tags: ["cybersecurity", "security", "infosec"],
  }),

  // ======================= DECEMBER =======================
  ev({
    id: "world-aids-day", name: "World AIDS Day", rule: fixed(12, 1), category: "health", recognition: "un",
    summary: "Unites people in the fight against HIV and commemorates those who have died.",
    background: "World AIDS Day was the first-ever global health day, first held in 1988. It is one of WHO's official global public health campaigns.",
    establishedBy: "WHO (1988)", sources: [WHO("world-aids-day"), WIKI("World AIDS Day")], tags: ["hiv", "aids"],
  }),
  ev({
    id: "uae-national-day", name: "UAE National Day", rule: fixed(12, 2), category: "culture", recognition: "national", countries: ["AE"],
    summary: "Celebrates the formation of the United Arab Emirates federation in 1971.",
    background: "On December 2, 1971, six emirates united to form the United Arab Emirates; Ras Al Khaimah joined in early 1972.",
    sources: [SRC("UAE Government portal", "https://u.ae/en/about-the-uae/the-uae-government/national-day"), WIKI("National Day (United Arab Emirates)")], tags: ["national day", "gcc"],
  }),
  ev({
    id: "persons-with-disabilities-day", name: "International Day of Persons with Disabilities", rule: fixed(12, 3), category: "society", recognition: "un",
    summary: "Promotes the rights and well-being of persons with disabilities.",
    background: "The UN General Assembly proclaimed December 3 as the International Day of Persons with Disabilities in 1992.",
    establishedBy: "UN General Assembly (1992)", sources: [UN("day-of-persons-with-disabilities"), WIKI("International Day of Persons with Disabilities")], tags: ["accessibility", "inclusion", "disability"],
  }),
  ev({
    id: "world-soil-day", name: "World Soil Day", rule: fixed(12, 5), category: "environment", recognition: "un",
    summary: "Focuses attention on healthy soil and the sustainable management of soil resources.",
    background: "Recommended by the International Union of Soil Sciences in 2002 and backed by FAO, the UN General Assembly designated December 5, 2014 as the first official World Soil Day.",
    establishedBy: "UN General Assembly (2013)", sources: [UN("world-soil-day"), WIKI("World Soil Day")], tags: ["soil", "farming"],
  }),
  ev({
    id: "anti-corruption-day", name: "International Anti-Corruption Day", rule: fixed(12, 9), category: "society", recognition: "un",
    summary: "Raises awareness of corruption and how to combat it.",
    background: "The UN General Assembly designated the day in 2003, when it adopted the United Nations Convention against Corruption.",
    establishedBy: "UN General Assembly (2003)", sources: [UN("anti-corruption-day"), WIKI("International Anti-Corruption Day")], tags: ["governance"],
  }),
  ev({
    id: "human-rights-day", name: "Human Rights Day", rule: fixed(12, 10), category: "society", recognition: "un",
    summary: "Commemorates the adoption of the Universal Declaration of Human Rights in 1948.",
    background: "On December 10, 1948, the UN General Assembly adopted the Universal Declaration of Human Rights, a milestone document proclaiming the inalienable rights of every person.",
    establishedBy: "UN General Assembly (1950)", sources: [UN("human-rights-day"), WIKI("Human Rights Day")], tags: ["rights", "udhr"],
  }),
  ev({
    id: "international-mountain-day", name: "International Mountain Day", rule: fixed(12, 11), category: "environment", recognition: "un",
    summary: "Highlights the importance of mountains to life and the threats they face.",
    background: "The UN General Assembly designated December 11 as International Mountain Day in 2003, following the International Year of Mountains in 2002.",
    establishedBy: "UN General Assembly (2003)", sources: [UN("mountain-day"), WIKI("International Mountain Day")], tags: ["mountains", "nature"],
  }),
  ev({
    id: "international-migrants-day", name: "International Migrants Day", rule: fixed(12, 18), category: "society", recognition: "un",
    summary: "Recognises the contributions and challenges of the world's migrants.",
    background: "The UN General Assembly proclaimed December 18 as International Migrants Day in 2000, marking the adoption of the International Convention on the Protection of the Rights of All Migrant Workers in 1990.",
    establishedBy: "UN General Assembly (2000)", sources: [UN("migrants-day"), WIKI("International Migrants Day")], tags: ["migration"],
  }),
  ev({
    id: "christmas-day", name: "Christmas Day", rule: fixed(12, 25), category: "culture", recognition: "cultural",
    summary: "The Christian celebration of the birth of Jesus, and a public holiday in many countries.",
    background: "Christmas is observed on December 25 by most Christian churches; some Orthodox churches celebrate on January 7. It is also widely celebrated as a cultural holiday.",
    sources: [WIKI("Christmas")], tags: ["religious", "winter", "holiday"],
  }),

  // ======================= LUNAR & LUNISOLAR (movable) =======================
  ev({
    id: "chinese-new-year", name: "Lunar New Year (Chinese New Year)", rule: table({ 2024: "02-10", 2025: "01-29", 2026: "02-17", 2027: "02-06", 2028: "01-26" }),
    category: "culture", recognition: "national", countries: ["CN", "GLOBAL"],
    summary: "The start of the lunisolar new year, celebrated by billions across East and Southeast Asia and beyond.",
    background: "Also called the Spring Festival, the celebration traditionally lasts until the Lantern Festival on the 15th day of the first lunar month. Its date falls between January 21 and February 20.",
    note: "Follows the Chinese lunisolar calendar.", sources: [WIKI("Chinese New Year")], tags: ["new year", "spring festival", "lunar"],
  }),
  ev({
    id: "ramadan", name: "Ramadan begins", rule: table({ 2025: "03-01", 2026: "02-18", 2027: "02-08" }, true),
    category: "culture", recognition: "cultural", durationDays: 30,
    summary: "The Islamic holy month of fasting, prayer and reflection.",
    background: "Ramadan is the ninth month of the Islamic lunar calendar. Because the Islamic year is about 11 days shorter than the solar year, Ramadan moves earlier each Gregorian year.",
    note: "Dates depend on moon sighting and can differ by a day between countries. Duration shown as 30 days; the month may last 29.",
    sources: [WIKI("Ramadan")], tags: ["islamic", "fasting", "lunar", "religious"],
  }),
  ev({
    id: "eid-al-fitr", name: "Eid al-Fitr", rule: table({ 2025: "03-30", 2026: "03-20", 2027: "03-09" }, true),
    category: "culture", recognition: "national", countries: ["OM", "AE", "SA", "EG", "GLOBAL"],
    summary: "The 'Festival of Breaking the Fast' that marks the end of Ramadan.",
    background: "Eid al-Fitr falls on the first day of Shawwal, the tenth month of the Islamic calendar, and is a public holiday in Muslim-majority countries.",
    note: "Dates depend on moon sighting and can differ by a day between countries.",
    sources: [SRC("Khaleej Times — 2027 likely dates", "https://www.khaleejtimes.com/uae/ramadan-eid-al-fitr-eid-al-adha-2027-likely-dates"), WIKI("Eid al-Fitr")], tags: ["islamic", "eid", "lunar", "religious"],
  }),
  ev({
    id: "eid-al-adha", name: "Eid al-Adha", rule: table({ 2025: "06-06", 2026: "05-27", 2027: "05-16" }, true),
    category: "culture", recognition: "national", countries: ["OM", "AE", "SA", "EG", "GLOBAL"],
    summary: "The 'Festival of Sacrifice', coinciding with the Hajj pilgrimage.",
    background: "Eid al-Adha falls on the 10th day of Dhu al-Hijjah, the last month of the Islamic calendar, and is a public holiday in Muslim-majority countries.",
    note: "Dates depend on moon sighting and can differ by a day between countries.",
    sources: [SRC("Khaleej Times — 2027 likely dates", "https://www.khaleejtimes.com/uae/ramadan-eid-al-fitr-eid-al-adha-2027-likely-dates"), WIKI("Eid al-Adha")], tags: ["islamic", "eid", "hajj", "lunar", "religious"],
  }),
  ev({
    id: "islamic-new-year", name: "Islamic New Year (Hijri New Year)", rule: table({ 2025: "06-26", 2026: "06-16", 2027: "06-06" }, true),
    category: "culture", recognition: "national", countries: ["OM", "AE", "SA", "EG"],
    summary: "The first day of Muharram, the start of the Islamic calendar year.",
    background: "The Hijri calendar begins with the migration (Hijra) of the Prophet Muhammad from Mecca to Medina in 622 CE.",
    note: "Dates depend on moon sighting and can differ by a day between countries.",
    sources: [WIKI("Islamic New Year")], tags: ["islamic", "new year", "lunar"],
  }),
  ev({
    id: "diwali", name: "Diwali (Deepavali)", rule: table({ 2025: "10-20", 2026: "11-08", 2027: "10-29", 2028: "10-17" }),
    category: "culture", recognition: "national", countries: ["IN", "GLOBAL"],
    summary: "The festival of lights, symbolising the victory of light over darkness.",
    background: "Diwali is one of the major festivals of Hinduism and is also celebrated by Sikhs, Jains and some Buddhists. Festivities usually last five days; the date shown is the main day of celebration.",
    note: "Follows the Hindu lunisolar calendar; regional dates may differ by a day.",
    sources: [SRC("PublicHolidays.com", "https://publicholidays.com/diwali/"), WIKI("Diwali")], tags: ["festival of lights", "hindu", "lunar", "religious"],
  }),

  // ======================= ONE-TIME EVENTS =======================
  ev({
    id: "total-solar-eclipse-2026", name: "Total Solar Eclipse — Greenland, Iceland & Spain", rule: once("2026-08-12"),
    category: "science", recognition: "event", countries: ["GL", "IS", "ES"],
    summary: "The first total solar eclipse visible from mainland Europe since 1999.",
    background: "The path of totality crosses Greenland, western Iceland and northern Spain. A partial eclipse is visible across much of Europe, North Africa and the North Atlantic.",
    sources: [SRC("NASA Eclipse Website", "https://eclipse.gsfc.nasa.gov/SEgoogle/SEgoogle2001/SE2026Aug12Tgoogle.html"), WIKI("Solar eclipse of August 12, 2026")], tags: ["eclipse", "astronomy", "sun"],
  }),
  ev({
    id: "total-solar-eclipse-2027", name: "Total Solar Eclipse — North Africa & Arabia", rule: once("2027-08-02"),
    category: "science", recognition: "event", countries: ["ES", "MA", "EG", "SA"],
    summary: "One of the longest total solar eclipses of the 21st century, over 6 minutes near Luxor.",
    background: "The path of totality crosses southern Spain, North Africa (including Morocco and Egypt), and the Arabian Peninsula including Saudi Arabia and Yemen. Maximum totality lasts about 6 minutes 23 seconds.",
    sources: [SRC("NASA Eclipse Website", "https://eclipse.gsfc.nasa.gov/SEgoogle/SEgoogle2001/SE2027Aug02Tgoogle.html"), WIKI("Solar eclipse of August 2, 2027")], tags: ["eclipse", "astronomy", "sun"],
  }),
];

export const EVENT_MAP: Record<string, SpecialDay> = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

/** Days chosen for the homepage's "Featured" row and the Day Spotlight fallback. */
export const FEATURED_IDS = [
  "world-environment-day", "international-cat-day", "pi-day", "data-protection-day",
  "international-day-of-peace", "world-bee-day", "diwali", "total-solar-eclipse-2027",
];
