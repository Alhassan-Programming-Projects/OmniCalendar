import type { SpecialDay } from "@/types";
import { ev, fixed, nth, UN, UN_LIST, WHO, SRC, WIKI, MON, TUE, THU } from "./helpers";

/*
 * International days across all categories. UN days are taken from the official UN list
 * (https://www.un.org/en/observances/list-days-weeks) with the organiser's link; non-UN days cite
 * the organising body. Days already in events.ts are not repeated here.
 */

const FAO = (path: string) => SRC("FAO", `https://www.fao.org/${path}`);

export const WORLD_EVENTS: SpecialDay[] = [
  // ======================= Technology & cybersecurity =======================
  ev({
    id: "clean-energy-day", name: "International Day of Clean Energy", rule: fixed(1, 26), category: "technology", recognition: "un",
    summary: "Promotes a just and inclusive transition to clean energy.",
    background: "Proclaimed by the UN General Assembly in 2023 and first observed in 2024. The date marks the founding of the International Renewable Energy Agency (IRENA) on 26 January 2009.",
    sources: [UN("clean-energy-day")], tags: ["energy", "renewables", "climate"],
  }),
  ev({
    id: "safer-internet-day", name: "Safer Internet Day", rule: nth(2, TUE, 2), category: "technology", recognition: "awareness",
    summary: "Promotes a safer and better internet for everyone, especially children and young people.",
    background: "Safer Internet Day began in 2004 as an EU initiative and is coordinated by the Insafe and INHOPE networks with support from the European Commission. It is now marked in around 180 countries on the second Tuesday of February.",
    sources: [SRC("Safer Internet Day", "https://www.saferinternetday.org/")], tags: ["online safety", "children", "cybersecurity", "privacy"],
  }),
  ev({
    id: "girls-in-ict-day", name: "International Girls in ICT Day", rule: nth(4, THU, 4), category: "technology", recognition: "un",
    summary: "Encourages girls and young women to consider studies and careers in ICT.",
    background: "Initiated by the International Telecommunication Union (ITU) and held on the fourth Thursday of April each year.",
    establishedBy: "International Telecommunication Union", sources: [SRC("ITU", "https://www.itu.int/women-and-girls/girls-in-ict/"), UN_LIST], tags: ["women in tech", "stem", "girls", "itu"],
  }),
  ev({
    id: "world-ip-day", name: "World Intellectual Property Day", rule: fixed(4, 26), category: "technology", recognition: "un",
    summary: "Explores how patents, trademarks, designs and copyright support innovation and creativity.",
    background: "WIPO established the day in 2000. 26 April is the date on which the WIPO Convention entered into force in 1970.",
    establishedBy: "World Intellectual Property Organization (2000)", sources: [SRC("WIPO", "https://www.wipo.int/ip-outreach/en/ipday/")], tags: ["patents", "copyright", "innovation"],
  }),
  ev({
    id: "star-wars-day", name: "Star Wars Day", rule: fixed(5, 4), category: "technology", recognition: "unofficial",
    summary: "\"May the Fourth be with you\" — a fan celebration of the Star Wars films.",
    background: "The date is a pun on the line \"May the Force be with you\". Fans and Lucasfilm celebrate with screenings, costumes and events.",
    sources: [WIKI("Star Wars Day")], tags: ["fun", "movies", "sci-fi", "geek"],
  }),
  ev({
    id: "global-accessibility-awareness-day", name: "Global Accessibility Awareness Day", rule: nth(5, THU, 3), category: "technology", recognition: "awareness",
    summary: "Gets people talking and learning about digital access and inclusion for people with disabilities.",
    background: "Global Accessibility Awareness Day (GAAD) was inspired by a 2011 blog post by web developer Joe Devon and is held on the third Thursday of May.",
    sources: [SRC("GAAD", "https://accessibility.day/")], tags: ["accessibility", "a11y", "inclusion", "web"],
  }),
  ev({
    id: "world-emoji-day", name: "World Emoji Day", rule: fixed(7, 17), category: "technology", recognition: "unofficial",
    summary: "A celebration of emoji, held on the date shown on the calendar emoji 📅.",
    background: "World Emoji Day was created in 2014 by Emojipedia founder Jeremy Burge. 17 July is the date displayed on Apple's calendar emoji.",
    sources: [WIKI("World Emoji Day")], tags: ["fun", "emoji", "internet"],
  }),
  ev({
    id: "information-access-day", name: "International Day for Universal Access to Information", rule: fixed(9, 28), category: "technology", recognition: "un",
    summary: "Highlights the right to seek, receive and impart information, online and offline.",
    background: "Proclaimed by UNESCO in 2015 and by the UN General Assembly in 2019.",
    sources: [UN("information-access-day")], tags: ["information", "transparency", "internet"],
  }),
  ev({
    id: "global-encryption-day", name: "Global Encryption Day", rule: fixed(10, 21), category: "technology", recognition: "awareness",
    summary: "Raises awareness of strong encryption as a foundation of online security and privacy.",
    background: "Launched in 2021 by the Global Encryption Coalition, whose members include the Internet Society, the Center for Democracy & Technology and Global Partners Digital.",
    sources: [SRC("Internet Society", "https://www.internetsociety.org/events/global-encryption-day-2026/"), SRC("CDT", "https://cdt.org/insights/cdt-celebrates-global-encryption-day/")],
    tags: ["encryption", "cybersecurity", "privacy"],
  }),
  ev({
    id: "civil-aviation-day", name: "International Civil Aviation Day", rule: fixed(12, 7), category: "technology", recognition: "un",
    summary: "Highlights the role of civil aviation in connecting the world.",
    background: "Marks the signing of the Chicago Convention on International Civil Aviation on 7 December 1944, which created ICAO.",
    sources: [UN("civil-aviation-day")], tags: ["aviation", "icao", "travel"],
  }),
  ev({
    id: "anti-cybercrime-day", name: "International Anti-Cybercrime Day", rule: fixed(12, 24), category: "technology", recognition: "un",
    summary: "Raises awareness of cybercrime and international cooperation to counter it.",
    background: "Observed on 24 December, the date in 2024 on which the UN General Assembly adopted the United Nations Convention against Cybercrime.",
    sources: [SRC("UNODC", "https://www.unodc.org/unodc/en/cybercrime/day.html"), UN_LIST], tags: ["cybercrime", "cybersecurity", "unodc"],
  }),

  // ======================= Science & space =======================
  ev({
    id: "world-quantum-day", name: "World Quantum Day", rule: fixed(4, 14), category: "science", recognition: "awareness",
    summary: "Promotes public understanding of quantum science and technology.",
    background: "Launched in 2022 by an international group of scientists. The date, 4/14, nods to the rounded first digits of Planck's constant (4.14 × 10⁻¹⁵ eV·s).",
    sources: [SRC("World Quantum Day", "https://worldquantumday.org/")], tags: ["quantum", "physics"],
  }),
  ev({
    id: "solstice-day", name: "International Day of the Celebration of the Solstice", rule: fixed(6, 21), category: "science", recognition: "un",
    summary: "Celebrates the solstice and the cultural traditions associated with it.",
    background: "Proclaimed by the UN General Assembly in 2019. The June solstice is the longest day of the year in the Northern Hemisphere.",
    sources: [UN("solstice-day")], tags: ["astronomy", "sun", "seasons"],
  }),
  ev({
    id: "women-in-engineering-day", name: "International Women in Engineering Day", rule: fixed(6, 23), category: "science", recognition: "awareness",
    summary: "Celebrates women engineers and encourages girls into engineering careers.",
    background: "Started by the UK's Women's Engineering Society (WES), first held in 2014.",
    sources: [SRC("INWED (Women's Engineering Society)", "https://www.inwed.org.uk/")], tags: ["engineering", "women in stem"],
  }),
  ev({
    id: "asteroid-day", name: "International Asteroid Day", rule: fixed(6, 30), category: "science", recognition: "un",
    summary: "Raises awareness of asteroid impact hazards and planetary defence.",
    background: "Marks the anniversary of the Tunguska event over Siberia on 30 June 1908. Proclaimed by the UN General Assembly in 2016.",
    establishedBy: "UN General Assembly (2016)", sources: [UN("asteroid-day")], tags: ["space", "asteroids", "astronomy"],
  }),
  ev({
    id: "international-moon-day", name: "International Moon Day", rule: fixed(7, 20), category: "science", recognition: "un",
    summary: "Celebrates humanity's exploration of the Moon.",
    background: "Marks the Apollo 11 Moon landing on 20 July 1969. Proclaimed by the UN General Assembly in 2021 and first observed in 2022.",
    sources: [UN("moon-day")], tags: ["space", "moon", "apollo", "astronomy"],
  }),

  // ======================= Health =======================
  ev({
    id: "world-ntd-day", name: "World Neglected Tropical Diseases Day", rule: fixed(1, 30), category: "health", recognition: "un",
    summary: "Calls for action against neglected tropical diseases, which affect over a billion people.",
    background: "Recognised by the World Health Assembly in 2021.",
    sources: [WHO("world-ntd-day")], tags: ["ntd", "who", "global health"],
  }),
  ev({
    id: "zero-discrimination-day", name: "Zero Discrimination Day", rule: fixed(3, 1), category: "health", recognition: "un",
    summary: "Promotes equality before the law and in practice, in health and beyond.",
    background: "Launched by UNAIDS in 2014.",
    sources: [SRC("UNAIDS", "https://www.unaids.org/en/zero-discrimination-day")], tags: ["equality", "hiv", "unaids"],
  }),
  ev({
    id: "world-hearing-day", name: "World Hearing Day", rule: fixed(3, 3), category: "health", recognition: "un",
    summary: "Raises awareness of how to prevent deafness and hearing loss and promote ear care.",
    background: "Led by the World Health Organization each year on 3 March.",
    sources: [WHO("world-hearing-day")], tags: ["hearing", "who"],
  }),
  ev({
    id: "world-kidney-day", name: "World Kidney Day", rule: nth(3, THU, 2), category: "health", recognition: "international",
    summary: "Raises awareness of the importance of kidney health, on the second Thursday of March.",
    background: "A joint initiative of the International Society of Nephrology and the International Federation of Kidney Foundations, first held in 2006.",
    sources: [SRC("World Kidney Day", "https://www.worldkidneyday.org/")], tags: ["kidney", "health"],
  }),
  ev({
    id: "down-syndrome-day", name: "World Down Syndrome Day", rule: fixed(3, 21), category: "health", recognition: "un",
    summary: "Raises awareness of Down syndrome and the rights of people who have it.",
    background: "The date 21/3 reflects the triplication of chromosome 21. UN-recognised since 2012.",
    sources: [UN("down-syndrome-day")], tags: ["down syndrome", "inclusion"],
  }),
  ev({
    id: "autism-awareness-day", name: "World Autism Awareness Day", rule: fixed(4, 2), category: "health", recognition: "un",
    summary: "Promotes the full inclusion of autistic people in society.",
    background: "Proclaimed by the UN General Assembly in 2007.",
    establishedBy: "UN General Assembly (2007)", sources: [UN("autism-day")], tags: ["autism", "inclusion", "neurodiversity"],
  }),
  ev({
    id: "world-immunization-week", name: "World Immunization Week", rule: fixed(4, 24), durationDays: 7, category: "health", recognition: "un",
    summary: "Promotes the use of vaccines to protect people of all ages against disease.",
    background: "Coordinated by the World Health Organization in the last week of April (24–30 April).",
    sources: [WHO("world-immunization-week")], tags: ["vaccines", "immunization", "who"],
  }),
  ev({
    id: "world-hand-hygiene-day", name: "World Hand Hygiene Day", rule: fixed(5, 5), category: "health", recognition: "un",
    summary: "Promotes hand hygiene in health care to prevent infections.",
    background: "Part of the World Health Organization's SAVE LIVES: Clean Your Hands campaign, held every 5 May since 2009.",
    sources: [WHO("world-hand-hygiene-day")], tags: ["hygiene", "infection prevention", "who"],
  }),
  ev({
    id: "world-asthma-day", name: "World Asthma Day", rule: nth(5, TUE, 1), category: "health", recognition: "awareness",
    summary: "Raises awareness of asthma care, on the first Tuesday of May.",
    background: "Organised by the Global Initiative for Asthma (GINA) since 1998.",
    sources: [SRC("Global Initiative for Asthma", "https://ginasthma.org/")], tags: ["asthma", "respiratory"],
  }),
  ev({
    id: "red-cross-red-crescent-day", name: "World Red Cross and Red Crescent Day", rule: fixed(5, 8), category: "health", recognition: "international",
    summary: "Honours the volunteers of the Red Cross and Red Crescent Movement.",
    background: "8 May is the birthday of Henry Dunant (1828), founder of the International Committee of the Red Cross. Red Crescent societies operate in most Muslim-majority countries.",
    sources: [SRC("IFRC", "https://www.ifrc.org/")], tags: ["red cross", "red crescent", "humanitarian", "volunteers"],
  }),
  ev({
    id: "world-thalassaemia-day", name: "World Thalassaemia Day", rule: fixed(5, 8), category: "health", recognition: "awareness",
    summary: "Raises awareness of thalassaemia, an inherited blood disorder common in the Middle East and Mediterranean.",
    background: "Organised by the Thalassaemia International Federation (TIF) every 8 May.",
    sources: [SRC("Thalassaemia International Federation", "https://thalassaemia.org.cy/")], tags: ["thalassaemia", "blood", "genetics"],
  }),
  ev({
    id: "world-sickle-cell-day", name: "World Sickle Cell Day", rule: fixed(6, 19), category: "health", recognition: "un",
    summary: "Raises awareness of sickle cell disease, an inherited blood disorder.",
    background: "Recognised by the UN General Assembly in 2008 and first observed in 2009.",
    sources: [WIKI("World Sickle Cell Day")], tags: ["sickle cell", "blood", "genetics"],
  }),
  ev({
    id: "drowning-prevention-day", name: "World Drowning Prevention Day", rule: fixed(7, 25), category: "health", recognition: "un",
    summary: "Highlights drowning as a leading cause of death and how to prevent it.",
    background: "Proclaimed by the UN General Assembly in 2021.",
    sources: [UN("drowning-prevention-day")], tags: ["water safety", "swimming"],
  }),
  ev({
    id: "world-hepatitis-day", name: "World Hepatitis Day", rule: fixed(7, 28), category: "health", recognition: "un",
    summary: "Raises awareness of viral hepatitis and the push to eliminate it.",
    background: "One of the World Health Organization's official global health campaigns. 28 July is the birthday of Nobel laureate Baruch Blumberg, who discovered the hepatitis B virus.",
    sources: [WHO("world-hepatitis-day")], tags: ["hepatitis", "liver", "who"],
  }),
  ev({
    id: "world-breastfeeding-week", name: "World Breastfeeding Week", rule: fixed(8, 1), durationDays: 7, category: "health", recognition: "un",
    summary: "Promotes and supports breastfeeding, 1–7 August.",
    background: "Coordinated by WABA together with WHO and UNICEF.",
    sources: [WHO("world-breastfeeding-week")], tags: ["breastfeeding", "maternal health", "infants"],
  }),
  ev({
    id: "world-suicide-prevention-day", name: "World Suicide Prevention Day", rule: fixed(9, 10), category: "health", recognition: "international",
    summary: "Raises awareness that suicide can be prevented, and of where to find help.",
    background: "Organised by the International Association for Suicide Prevention (IASP), co-sponsored by the World Health Organization, since 2003.",
    note: "If you are struggling, please reach out to someone you trust or a local crisis line.",
    sources: [SRC("IASP", "https://www.iasp.info/")], tags: ["mental health", "prevention"],
  }),
  ev({
    id: "world-patient-safety-day", name: "World Patient Safety Day", rule: fixed(9, 17), category: "health", recognition: "un",
    summary: "Calls for global action to reduce avoidable harm in health care.",
    background: "Established by the World Health Assembly in 2019.",
    sources: [WHO("world-patient-safety-day")], tags: ["patient safety", "who"],
  }),
  ev({
    id: "world-alzheimers-day", name: "World Alzheimer's Day", rule: fixed(9, 21), category: "health", recognition: "international",
    summary: "Raises awareness of Alzheimer's disease and dementia.",
    background: "Organised by Alzheimer's Disease International (ADI) since 1994; September is World Alzheimer's Month.",
    sources: [SRC("Alzheimer's Disease International", "https://www.alzint.org/")], tags: ["dementia", "alzheimer's", "brain"],
  }),
  ev({
    id: "world-rabies-day", name: "World Rabies Day", rule: fixed(9, 28), category: "health", recognition: "awareness",
    summary: "Raises awareness of rabies prevention in people and animals.",
    background: "Coordinated by the Global Alliance for Rabies Control since 2007. 28 September is the anniversary of the death of Louis Pasteur, who developed the first rabies vaccine.",
    sources: [SRC("Global Alliance for Rabies Control", "https://rabiesalliance.org/")], tags: ["rabies", "vaccines", "pets", "zoonoses"],
  }),
  ev({
    id: "world-sight-day", name: "World Sight Day", rule: nth(10, THU, 2), category: "health", recognition: "international",
    summary: "Focuses attention on blindness and vision impairment, on the second Thursday of October.",
    background: "Coordinated by the International Agency for the Prevention of Blindness (IAPB).",
    sources: [SRC("IAPB", "https://www.iapb.org/")], tags: ["eyes", "vision", "blindness"],
  }),
  ev({
    id: "world-polio-day", name: "World Polio Day", rule: fixed(10, 24), category: "health", recognition: "awareness",
    summary: "Marks progress towards a polio-free world.",
    background: "Established by Rotary International to mark progress in the Global Polio Eradication Initiative, of which Rotary is a founding partner.",
    sources: [SRC("End Polio Now (Rotary)", "https://www.endpolio.org/")], tags: ["polio", "vaccines", "rotary"],
  }),
  ev({
    id: "world-stroke-day", name: "World Stroke Day", rule: fixed(10, 29), category: "health", recognition: "international",
    summary: "Raises awareness of stroke prevention and treatment.",
    background: "Organised by the World Stroke Organization since 2006.",
    sources: [SRC("World Stroke Organization", "https://www.world-stroke.org/")], tags: ["stroke", "brain", "heart"],
  }),
  ev({
    id: "amr-awareness-week", name: "World AMR Awareness Week", rule: fixed(11, 18), durationDays: 7, category: "health", recognition: "un",
    summary: "Raises awareness of antimicrobial resistance and the responsible use of antibiotics, 18–24 November.",
    background: "Led by WHO with FAO, UNEP and WOAH.",
    sources: [WHO("world-antimicrobial-awareness-week")], tags: ["antibiotics", "amr", "who"],
  }),
  ev({
    id: "universal-health-coverage-day", name: "International Universal Health Coverage Day", rule: fixed(12, 12), category: "health", recognition: "un",
    summary: "Calls for quality, affordable health care for everyone, everywhere.",
    background: "Marks the UN General Assembly's endorsement of universal health coverage on 12 December 2012; proclaimed as an international day in 2017.",
    sources: [UN("universal-health-coverage-day")], tags: ["health systems", "uhc"],
  }),

  // ======================= Environment =======================
  ev({
    id: "world-seagrass-day", name: "World Seagrass Day", rule: fixed(3, 1), category: "environment", recognition: "un",
    summary: "Highlights seagrass meadows, vital coastal ecosystems and carbon stores.",
    background: "Proclaimed by the UN General Assembly in 2022.",
    sources: [UN("seagrass-day")], tags: ["ocean", "coast", "marine"],
  }),
  ev({
    id: "world-glaciers-day", name: "World Day for Glaciers", rule: fixed(3, 21), category: "environment", recognition: "un",
    summary: "Raises awareness of glaciers' role in the climate system and water supply.",
    background: "Proclaimed by the UN General Assembly and observed from 2025, the International Year of Glaciers' Preservation.",
    sources: [UN("world-glaciers-day")], tags: ["glaciers", "ice", "climate", "water"],
  }),
  ev({
    id: "zero-waste-day", name: "International Day of Zero Waste", rule: fixed(3, 30), category: "environment", recognition: "un",
    summary: "Promotes zero-waste initiatives and responsible consumption.",
    background: "Proclaimed by the UN General Assembly in 2022 and first observed in 2023.",
    sources: [UN("zero-waste-day")], tags: ["waste", "recycling", "circular economy"],
  }),
  ev({
    id: "desertification-drought-day", name: "Desertification and Drought Day", rule: fixed(6, 17), category: "environment", recognition: "un",
    summary: "Raises awareness of land degradation, desertification and drought.",
    background: "Proclaimed by the UN General Assembly in 1994, the year the UN Convention to Combat Desertification was adopted.",
    establishedBy: "UN General Assembly (1994)", sources: [UN("desertification-day")], tags: ["desert", "drought", "land"],
  }),
  ev({
    id: "mangrove-day", name: "International Day for the Conservation of the Mangrove Ecosystem", rule: fixed(7, 26), category: "environment", recognition: "un",
    summary: "Raises awareness of mangroves as a unique, special and vulnerable ecosystem.",
    background: "Proclaimed by UNESCO's General Conference in 2015.",
    establishedBy: "UNESCO (2015)", sources: [WIKI("International Day for the Conservation of the Mangrove Ecosystem")], tags: ["mangroves", "coast", "oman", "uae"],
  }),
  ev({
    id: "world-lake-day", name: "World Lake Day", rule: fixed(8, 27), category: "environment", recognition: "un",
    summary: "Highlights the importance of lakes and their protection.",
    background: "Proclaimed by the UN General Assembly in 2024.",
    sources: [UN("world-lake-day")], tags: ["lakes", "water", "freshwater"],
  }),
  ev({
    id: "clean-air-day", name: "International Day of Clean Air for Blue Skies", rule: fixed(9, 7), category: "environment", recognition: "un",
    summary: "Calls for action to improve air quality.",
    background: "Proclaimed by the UN General Assembly in 2019 and facilitated by UNEP.",
    sources: [SRC("UNEP — Clean Air for Blue Skies", "https://www.cleanairblueskies.org/"), UN_LIST], tags: ["air quality", "pollution"],
  }),
  ev({
    id: "world-cleanup-day", name: "World Cleanup Day", rule: fixed(9, 20), category: "environment", recognition: "un",
    summary: "A global day of action to clean up waste from streets, beaches and nature.",
    background: "Started by the Let's Do It! movement in 2018 and proclaimed a UN day in 2023.",
    sources: [UN("cleanup-day")], tags: ["waste", "volunteering", "beaches"],
  }),
  ev({
    id: "world-habitat-day", name: "World Habitat Day", rule: nth(10, MON, 1), category: "environment", recognition: "un",
    summary: "Reflects on the state of towns and cities and the right to adequate shelter, on the first Monday of October.",
    background: "Designated by the UN General Assembly in 1985 and first celebrated in 1986.",
    sources: [UN("habitat-day")], tags: ["housing", "cities", "un-habitat"],
  }),
  ev({
    id: "disaster-risk-reduction-day", name: "International Day for Disaster Risk Reduction", rule: fixed(10, 13), category: "environment", recognition: "un",
    summary: "Promotes a global culture of disaster risk awareness and reduction.",
    background: "Started in 1989 and set on 13 October by the UN General Assembly in 2009.",
    sources: [UN("disaster-reduction-day")], tags: ["disasters", "resilience"],
  }),
  ev({
    id: "world-cities-day", name: "World Cities Day", rule: fixed(10, 31), category: "environment", recognition: "un",
    summary: "Promotes sustainable urbanisation worldwide.",
    background: "Designated by the UN General Assembly in 2013 and first celebrated in 2014.",
    sources: [UN("cities-day")], tags: ["cities", "urban", "un-habitat"],
  }),
  ev({
    id: "tsunami-awareness-day", name: "World Tsunami Awareness Day", rule: fixed(11, 5), category: "environment", recognition: "un",
    summary: "Raises awareness of tsunami risks and early warning.",
    background: "Designated by the UN General Assembly in 2015, inspired by Japan's 'Inamura-no-hi' story of 1854.",
    sources: [UN("tsunami-awareness-day")], tags: ["tsunami", "disasters", "oceans"],
  }),

  // ======================= Animals =======================
  ev({
    id: "world-tuna-day", name: "World Tuna Day", rule: fixed(5, 2), category: "animals", recognition: "un",
    summary: "Highlights the importance of sustainable tuna fisheries.",
    background: "Proclaimed by the UN General Assembly in 2016.",
    sources: [UN("tuna-day")], tags: ["fish", "ocean", "fisheries"],
  }),
  ev({
    id: "world-turtle-day", name: "World Turtle Day", rule: fixed(5, 23), category: "animals", recognition: "unofficial",
    summary: "Celebrates turtles and tortoises and encourages their protection.",
    background: "Sponsored by the American Tortoise Rescue since 2000.",
    sources: [WIKI("World Turtle Day")], tags: ["turtles", "reptiles", "oman"],
  }),
  ev({
    id: "world-horse-day", name: "World Horse Day", rule: fixed(7, 11), category: "animals", recognition: "un",
    summary: "Recognises the horse's role in human history, culture, sport and work.",
    background: "Proclaimed by the UN General Assembly and observed from 2025.",
    sources: [UN("horse-day")], tags: ["horses", "equestrian", "arabian horse"],
  }),
  ev({
    id: "world-rhino-day", name: "World Rhino Day", rule: fixed(9, 22), category: "animals", recognition: "awareness",
    summary: "Celebrates the five rhino species and the threats they face.",
    background: "Announced by WWF-South Africa in 2010 and now marked worldwide.",
    sources: [WIKI("World Rhino Day")], tags: ["rhino", "wildlife", "conservation"],
  }),

  // ======================= Food =======================
  ev({
    id: "world-milk-day", name: "World Milk Day", rule: fixed(6, 1), category: "food", recognition: "un",
    summary: "Recognises milk as a global food and the dairy sector's role in livelihoods.",
    background: "Established by the Food and Agriculture Organization (FAO) in 2001.",
    establishedBy: "FAO (2001)", sources: [WIKI("World Milk Day")], tags: ["dairy", "milk", "farming"],
  }),
  ev({
    id: "sustainable-gastronomy-day", name: "Sustainable Gastronomy Day", rule: fixed(6, 18), category: "food", recognition: "un",
    summary: "Celebrates cuisine that takes account of where ingredients come from and how they are grown.",
    background: "Adopted by the UN General Assembly in 2016 and facilitated by FAO and UNESCO.",
    sources: [FAO("sustainable-gastronomy-day/en"), UN_LIST], tags: ["gastronomy", "cooking", "sustainability"],
  }),
  ev({
    id: "food-loss-waste-day", name: "International Day of Awareness of Food Loss and Waste", rule: fixed(9, 29), category: "food", recognition: "un",
    summary: "Calls for action to reduce food loss and waste.",
    background: "Designated by the UN General Assembly in 2019 and first observed in 2020.",
    sources: [FAO("platform-food-loss-waste/flw-events/international-day-food-loss-and-waste/en"), UN_LIST], tags: ["food waste", "sustainability"],
  }),

  // ======================= Culture, sport & education =======================
  ev({
    id: "world-theatre-day", name: "World Theatre Day", rule: fixed(3, 27), category: "culture", recognition: "international",
    summary: "Celebrates theatre and the performing arts.",
    background: "Initiated by the International Theatre Institute (ITI) in 1961 and first celebrated in 1962.",
    sources: [WIKI("World Theatre Day")], tags: ["theatre", "performing arts"],
  }),
  ev({
    id: "world-art-day", name: "World Art Day", rule: fixed(4, 15), category: "culture", recognition: "un",
    summary: "Promotes the development, diffusion and enjoyment of art.",
    background: "Proclaimed by UNESCO's General Conference in 2019. 15 April is the birthday of Leonardo da Vinci.",
    establishedBy: "UNESCO (2019)", sources: [WIKI("World Art Day")], tags: ["art", "creativity", "unesco"],
  }),
  ev({
    id: "international-dance-day", name: "International Dance Day", rule: fixed(4, 29), category: "culture", recognition: "international",
    summary: "Celebrates dance in all its forms.",
    background: "Created in 1982 by the International Theatre Institute's dance committee. 29 April is the birthday of ballet master Jean-Georges Noverre.",
    sources: [WIKI("International Dance Day")], tags: ["dance", "performing arts"],
  }),
  ev({
    id: "cultural-diversity-day", name: "World Day for Cultural Diversity for Dialogue and Development", rule: fixed(5, 21), category: "culture", recognition: "un",
    summary: "Celebrates the richness of the world's cultures and intercultural dialogue.",
    background: "Proclaimed by the UN General Assembly in 2002, following UNESCO's 2001 Universal Declaration on Cultural Diversity.",
    sources: [UN("cultural-diversity-day")], tags: ["diversity", "dialogue", "unesco"],
  }),
  ev({
    id: "world-football-day", name: "World Football Day", rule: fixed(5, 24), category: "culture", recognition: "un",
    summary: "Celebrates football's power to unite people and promote inclusion.",
    background: "Proclaimed by the UN General Assembly in 2024. The date marks the first international Olympic football tournament, held in Paris on 24 May 1924.",
    sources: [UN("football-day")], tags: ["football", "soccer", "sport"],
  }),
  ev({
    id: "international-day-of-play", name: "International Day of Play", rule: fixed(6, 11), category: "relationships", recognition: "un",
    summary: "Celebrates the importance of play for children and adults alike.",
    background: "Proclaimed by the UN General Assembly in 2024.",
    sources: [UN("international-day-of-play")], tags: ["play", "children", "wellbeing"],
  }),
  ev({
    id: "youth-skills-day", name: "World Youth Skills Day", rule: fixed(7, 15), category: "society", recognition: "un",
    summary: "Highlights the importance of equipping young people with skills for work.",
    background: "Declared by the UN General Assembly in 2014.",
    sources: [UN("world-youth-skills-day")], tags: ["skills", "youth", "employment", "education"],
  }),
  ev({
    id: "world-chess-day", name: "World Chess Day", rule: fixed(7, 20), category: "culture", recognition: "un",
    summary: "Celebrates chess, a game of strategy played worldwide.",
    background: "Marks the founding of the International Chess Federation (FIDE) in Paris on 20 July 1924; recognised by the UN General Assembly in 2019.",
    sources: [UN("world-chess-day")], tags: ["chess", "games", "fide"],
  }),
  ev({
    id: "world-photography-day", name: "World Photography Day", rule: fixed(8, 19), category: "culture", recognition: "unofficial",
    summary: "Celebrates the art, craft and science of photography.",
    background: "The date recalls 19 August 1839, when the French government announced the daguerreotype process as a gift free to the world.",
    sources: [WIKI("World Photography Day")], tags: ["photography", "art"],
  }),
  ev({
    id: "protect-education-day", name: "International Day to Protect Education from Attack", rule: fixed(9, 9), category: "society", recognition: "un",
    summary: "Raises awareness of attacks on schools, students and teachers in conflict zones.",
    background: "Proclaimed by the UN General Assembly in 2020 on a resolution proposed by Qatar.",
    sources: [UN("protect-education-day")], tags: ["education", "children", "conflict"],
  }),
  ev({
    id: "talk-like-a-pirate-day", name: "International Talk Like a Pirate Day", rule: fixed(9, 19), category: "culture", recognition: "unofficial",
    summary: "Arrr! A tongue-in-cheek day for speaking like a pirate.",
    background: "Invented in 1995 by John Baur and Mark Summers of Oregon and popularised by humorist Dave Barry in 2002.",
    sources: [WIKI("International Talk Like a Pirate Day")], tags: ["fun", "pirates"],
  }),
  ev({
    id: "sign-languages-day", name: "International Day of Sign Languages", rule: fixed(9, 23), category: "culture", recognition: "un",
    summary: "Raises awareness of sign languages and the rights of deaf people.",
    background: "Proclaimed by the UN General Assembly in 2017; 23 September marks the founding of the World Federation of the Deaf in 1951.",
    sources: [UN("sign-languages-day")], tags: ["sign language", "deaf", "accessibility"],
  }),
  ev({
    id: "world-maritime-day", name: "World Maritime Day", rule: nth(9, THU, -1), category: "society", recognition: "un",
    summary: "Celebrates the shipping industry and seafarers, on the last Thursday of September.",
    background: "Organised by the International Maritime Organization (IMO).",
    sources: [UN("maritime-day")], tags: ["shipping", "sea", "imo"],
  }),
  ev({
    id: "translation-day", name: "International Translation Day", rule: fixed(9, 30), category: "culture", recognition: "un",
    summary: "Honours the work of translators and interpreters.",
    background: "Proclaimed by the UN General Assembly in 2017. 30 September is the feast of St Jerome, translator of the Bible.",
    sources: [UN("international-translation-day")], tags: ["translation", "languages"],
  }),
  ev({
    id: "non-violence-day", name: "International Day of Non-Violence", rule: fixed(10, 2), category: "society", recognition: "un",
    summary: "Spreads the message of non-violence, on the birthday of Mahatma Gandhi.",
    background: "Established by the UN General Assembly in 2007.",
    sources: [UN("non-violence-day")], tags: ["peace", "gandhi"],
  }),
  ev({
    id: "world-post-day", name: "World Post Day", rule: fixed(10, 9), category: "technology", recognition: "un",
    summary: "Celebrates the role of postal services in people's lives.",
    background: "Marks the founding of the Universal Postal Union in Bern on 9 October 1874; declared in 1969.",
    sources: [UN("world-post-day")], tags: ["post", "mail", "upu"],
  }),
  ev({
    id: "girl-child-day", name: "International Day of the Girl Child", rule: fixed(10, 11), category: "society", recognition: "un",
    summary: "Promotes girls' rights and addresses the challenges they face.",
    background: "Declared by the UN General Assembly in 2011 and first observed in 2012.",
    sources: [UN("girl-child-day")], tags: ["girls", "children", "rights"],
  }),
  ev({
    id: "poverty-eradication-day", name: "International Day for the Eradication of Poverty", rule: fixed(10, 17), category: "society", recognition: "un",
    summary: "Calls for an end to poverty in all its forms.",
    background: "Declared by the UN General Assembly in 1992.",
    sources: [UN("day-for-eradicating-poverty")], tags: ["poverty", "development"],
  }),
  ev({
    id: "tolerance-day", name: "International Day for Tolerance", rule: fixed(11, 16), category: "society", recognition: "un",
    summary: "Promotes mutual understanding among cultures and peoples.",
    background: "UNESCO adopted the Declaration of Principles on Tolerance on 16 November 1995; the UN General Assembly invited states to observe the day in 1996.",
    sources: [SRC("UNESCO", "https://www.unesco.org/en/days/tolerance")], tags: ["tolerance", "dialogue", "unesco"],
  }),
  ev({
    id: "end-violence-against-women-day", name: "International Day for the Elimination of Violence against Women", rule: fixed(11, 25), category: "society", recognition: "un",
    summary: "Calls for an end to violence against women and girls.",
    background: "Designated by the UN General Assembly in 1999. It opens 16 days of activism, which end on Human Rights Day.",
    sources: [UN("ending-violence-against-women-day")], tags: ["women", "rights", "orange the world"],
  }),
  ev({
    id: "volunteer-day", name: "International Volunteer Day", rule: fixed(12, 5), category: "society", recognition: "un",
    summary: "Celebrates volunteers and their contribution to communities.",
    background: "Designated by the UN General Assembly in 1985.",
    sources: [UN("volunteer-day")], tags: ["volunteering", "community"],
  }),
  ev({
    id: "world-basketball-day", name: "World Basketball Day", rule: fixed(12, 21), category: "culture", recognition: "un",
    summary: "Celebrates basketball and its role in sport and development.",
    background: "Proclaimed by the UN General Assembly in 2023. On 21 December 1891 James Naismith organised the first basketball game in Springfield, Massachusetts.",
    sources: [UN("world-basketball-day")], tags: ["basketball", "sport"],
  }),
];
