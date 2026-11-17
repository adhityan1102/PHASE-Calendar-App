import { ScheduleItem, SectionDailySession } from '../types';

export const CBSE_2027_EXAM_CONFIG = {
  examName: "CBSE Class 10 Board Examinations 2027",
  firstExamDate: "2027-02-16T10:30:00+05:30", // 16th Feb 2027, 10:30 AM IST
  reportingTime: "09:30 AM",
  readingTime: "10:15 AM",
  examStartTime: "10:30 AM",
  standardDuration: "3 Hours (10:30 AM – 1:30 PM)",
  phaseStartDate: "2026-10-22",
  preFinalStartDate: "2026-12-05",
  milestones: [
    {
      dateRange: "22 Oct – 29 Nov 2026",
      label: "PHASE 100% Revision",
      detail: "66 Sessions & 23 FAT Exams across all subjects",
    },
    {
      dateRange: "01 Dec – 03 Dec 2026",
      label: "Mistake Rectification",
      detail: "3-Day Full Syllabus Review & Weak-Area Practice",
    },
    {
      dateRange: "05 Dec – 14 Dec 2026",
      label: "PHASE Pre-Final Exams",
      detail: "Full 80M / 50M Board Simulation Papers",
    },
    {
      dateRange: "16 Feb 2027",
      label: "CBSE Board Exams",
      detail: "Official Class 10 Board Examinations Start",
    },
  ],
};

export const SUBJECT_CODES_MAP: Record<string, { subject: string; topic: string }> = {
  // Mathematics Sessions (1 to 13) — CBSE PHASE Session-Wise Syllabus
  "MAT-1": { subject: "Mathematics (Session 1)", topic: "Real Numbers" },
  "MAT-2": { subject: "Mathematics (Session 2)", topic: "Polynomials" },
  "MAT-3": { subject: "Mathematics (Session 3)", topic: "Introduction to Trigonometry" },
  "MAT-4": { subject: "Mathematics (Session 4)", topic: "Pair of Linear Equations in two variables" },
  "MAT-5": { subject: "Mathematics (Session 5)", topic: "Coordinate Geometry" },
  "MAT-6": { subject: "Mathematics (Session 6)", topic: "Surface Areas and Volumes" },
  "MAT-7": { subject: "Mathematics (Session 7)", topic: "Circles" },
  "MAT-8": { subject: "Mathematics (Session 8)", topic: "Cumulative Session (Based on Session VI & VII: Surface Areas and Volumes + Circles) [1 Hr | 30M]" },
  "MAT-9": { subject: "Mathematics (Session 9)", topic: "Areas Related to Circles + Arithmetic Progressions" },
  "MAT-10": { subject: "Mathematics (Session 10)", topic: "Quadratic Equations" },
  "MAT-11": { subject: "Mathematics (Session 11)", topic: "Triangles" },
  "MAT-12": { subject: "Mathematics (Session 12)", topic: "Some Applications of Trigonometry" },
  "MAT-13": { subject: "Mathematics (Session 13)", topic: "Statistics + Probability" },
  "MAT": { subject: "Mathematics", topic: "Comprehensive Mathematics Revision & Worksheet Practice" },

  // Physics Sessions (1 to 6)
  "PHY-1": { subject: "Physics (Session 1)", topic: "Light - Reflection" },
  "PHY-2": { subject: "Physics (Session 2)", topic: "Light - Refraction" },
  "PHY-3": { subject: "Physics (Session 3)", topic: "Light - Reflection & Refraction" },
  "PHY-4": { subject: "Physics (Session 4)", topic: "Human Eye and the Colourful World" },
  "PHY-5": { subject: "Physics (Session 5)", topic: "Electricity" },
  "PHY 6": { subject: "Physics (Session 6)", topic: "Magnetic Effects of Electric Current" },
  "PHY-6": { subject: "Physics (Session 6)", topic: "Magnetic Effects of Electric Current" },
  "PHY": { subject: "Physics", topic: "Physics Practice, Ray Diagrams & Numericals" },
  "CHE/PHY": { subject: "Chemistry / Physics (Buffer)", topic: "Pending Science Session & Fun Worksheet Consolidation" },
  "PHY/BIO": { subject: "Physics / Biology Rectification", topic: "Physics & Biology Mistake Rectification and Diagrams" },

  // Chemistry Sessions (1 to 5)
  "CHE-1": { subject: "Chemistry (Session 1)", topic: "Chemical Reactions and Equations Part 1, 2, 3 (SET D: Part 2, 3)" },
  "CHE-2": { subject: "Chemistry (Session 2)", topic: "Carbon and its Compounds - Part 1 (Bonding, Isotopes, Allotropes, Unique Properties) & Part 2 (Hydrocarbons, Homologous Series & IUPAC) (SET D: Part 2)" },
  "CHE-3": { subject: "Chemistry (Session 3)", topic: "Carbon and its Compounds - Part 3 (Chemical Properties, Ethyl Alcohol, Ethanoic Acid, Soaps & Detergents)" },
  "CHE-4": { subject: "Chemistry (Session 4)", topic: "Acids, Bases and Salts & Metals and Non-Metals (SET D: Acids, Bases and Salts Part 1, 3)" },
  "CHE-5": { subject: "Chemistry (Session 5)", topic: "Periodic Classification of Elements (SET D: Metals and Non-Metals Part 2, 3)" },
  "CHE 5": { subject: "Chemistry (Session 5)", topic: "Periodic Classification of Elements (SET D: Metals and Non-Metals Part 2, 3)" },
  "CHE": { subject: "Chemistry", topic: "Chemistry Equations, Reactions & Worksheet Review" },

  // Biology Sessions (1 to 5)
  "BIO-1": { subject: "Biology (Session 1)", topic: "Chapter 5: Life Processes — 5.1 What are Life Processes?, 5.2 Nutrition & 5.3 Respiration" },
  "BIO-2": { subject: "Biology (Session 2)", topic: "Chapter 5: Life Processes — 5.4 Transportation & 5.5 Excretion" },
  "BIO-3": { subject: "Biology (Session 3)", topic: "Chapter 6: Control and Coordination" },
  "BIO-4": { subject: "Biology (Session 4)", topic: "Chapter 7: How do organisms reproduce?" },
  "BIO-5": { subject: "Biology (Session 5)", topic: "Chapter 8: Heredity | Chapter 13: Our Environment" },
  "BIO 5": { subject: "Biology (Session 5)", topic: "Chapter 8: Heredity | Chapter 13: Our Environment" },
  "BIO": { subject: "Biology", topic: "Life Processes, Heredity & Bio Diagrams Revision" },

  // Social Science Sessions (1 to 14)
  "SS-1": { subject: "Social Science (Session 1)", topic: "Geo-1: Resources & Development | Geo-2: Forest & Wildlife Resources | Map: Soil Types, Major Dams" },
  "SS-2": { subject: "Social Science (Session 2)", topic: "DP-3: Gender, Religion and Caste | Map: Software Techno Parks, Cotton Textiles" },
  "SS-3": { subject: "Social Science (Session 3)", topic: "Eco-1: Development | Eco-4: Globalisation & The Indian Economy | Map: Major Crops (Rice, Wheat), Sugarcane, Tea, Coffee, Rubber, Cotton, Jute, Iron & Steel Plants" },
  "SS-4": { subject: "Social Science (Session 4)", topic: "His-5: Print Culture & The Modern World (1. First Printed Books, 2. Print Comes to Europe, 3. Print Revolution, 4. Reading Mania, 5. Nineteenth Century) | Map: INC Sessions, National Movement Centres, Thermal & Nuclear Power Plants" },
  "SS-5": { subject: "Social Science (Session 5)", topic: "His-5: Print Culture & The Modern World (6. India & World of Print, 7. Religious Reform, 8. New Forms of Publication, 9. Print & Censorship) | Map: Major Ports, International Airports" },
  "SS-6": { subject: "Social Science (Session 6)", topic: "His-1: The Rise of Nationalism in Europe | Map: Iron Ore Mines, Coal Mines & Oil Fields" },
  "SS-7": { subject: "Social Science (Session 7)", topic: "Geo-3: Water Resources | Eco-3: Money and Credit | Map: Cumulative" },
  "SS-8": { subject: "Social Science (Session 8)", topic: "His-2: Nationalism in India | Map: INC Sessions, National Movement Centres, Thermal & Nuclear Power Plants" },
  "SS-9": { subject: "Social Science (Session 9)", topic: "DP-1: Power Sharing | DP-2: Federalism | Map: Soil Types, Major Dams" },
  "SS-10": { subject: "Social Science (Session 10)", topic: "Geo-4: Agriculture | Geo-6: Manufacturing Industries | Map: Major Crops, Sugarcane/Tea/Coffee/Rubber/Cotton/Jute, Iron & Steel Plants" },
  "SS-11": { subject: "Social Science (Session 11)", topic: "DP-5: Outcomes of Democracy | Map: Software Techno Parks, Cotton Textiles" },
  "SS-12": { subject: "Social Science (Session 12)", topic: "Geo-5: Minerals & Energy Resources | Map: Iron Ore Mines, Coal Mines & Oil Fields" },
  "SS-13": { subject: "Social Science (Session 13)", topic: "Eco-2: Sectors of the Indian Economy | Map: Major Ports, International Airports" },
  "SS-14": { subject: "Social Science (Session 14)", topic: "DP-4: Political Parties | His-3: Making of a Global World (1.1–1.3) | Map: Cumulative" },
  "SS": { subject: "Social Science", topic: "Social Science Practice & Map Work" },

  // English First Language (FL 1 to 10)
  "FL-1": { subject: "English (Session 1)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. I & II | Writing: Complaint Letter, Excerpts, Product Based | Literature: Prose - A Letter to God, Poem - Dust of Snow & Fire and Ice" },
  "FL-2": { subject: "English (Session 2)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. III–IV | Writing: Analytical Paragraph (Tabular, Profiles, Event/Area Based) | Literature: Prose - Nelson Mandela, Poem - A Tiger in the Zoo, SR - A Triumph of Surgery" },
  "FL-3": { subject: "English (Session 3)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. V–VI | Writing: Letter to the Editor, Excerpts | Literature: Prose - Two Stories about Flying (Part I & II), SR - The Thief's Story" },
  "FL-4": { subject: "English (Session 4)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. VII–VIII | Writing: Analytical Paragraph (SWOT, Profiles) | Literature: Prose - From the Diary of Anne Frank, Poem - How to Tell Wild Animals, SR - The Midnight Visitor" },
  "FL-5": { subject: "English (Session 5)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. IX–X | Writing: Letter of Placing an Order, Excerpts | Literature: Glimpses of India (I. A Baker from Goa, II. Coorg, III. Tea from Assam)" },
  "FL-6": { subject: "English (Session 6)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. XI–XII | Writing: Analytical Paragraph (Pie Chart, Profiles) | Literature: Poem - The Ball Poem & Amanda!, SR - A Question of Trust & Footprints without Feet" },
  "FL-7": { subject: "English (Session 7)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. I–XII | Writing: Letter of Inquiry, Excerpts | Literature: Prose - Mijbil the Otter, Poem - The Trees, SR - The Making of a Scientist" },
  "FL-8": { subject: "English (Session 8)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. I–XII | Writing: Analytical Paragraph (Bar Graph, Profiles) | Literature: Prose - Madam Rides the Bus, Poem - Fog, SR - The Necklace" },
  "FL-9": { subject: "English (Session 9)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. I–XII | Writing: Analytical Paragraph - Report Writing, Excerpts | Literature: Prose - The Sermon at Benares, Poem - The Tale of Custard the Dragon, SR - Bholi" },
  "FL-10": { subject: "English (Session 10)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. I–XII | Writing: Analytical Paragraph (Line Graph, Map & Profiles) | Literature: Prose - The Proposal (Play), Poem - For Anne Gregory, SR - The Book that Saved the Earth" },
  "FL 10": { subject: "English (Session 10)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. I–XII | Writing: Analytical Paragraph (Line Graph, Map & Profiles) | Literature: Prose - The Proposal (Play), Poem - For Anne Gregory, SR - The Book that Saved the Earth" },
  "FL10": { subject: "English (Session 10)", topic: "Reading: Discursive & Case Based Passages | Grammar: Q. No. I–XII | Writing: Analytical Paragraph (Line Graph, Map & Profiles) | Literature: Prose - The Proposal (Play), Poem - For Anne Gregory, SR - The Book that Saved the Earth" },
  "FL": { subject: "English (First Language)", topic: "Reading, Grammar Q. I–XII, Letters, Analytical Paragraphs & Full Literature" },

  // Tamil / Second Language (SL 1 to 10)
  "SL-1": { subject: "Tamil (Session 1)", topic: "இயல் - 1: உரைநடை: பாவாணர் பார்வையில் தமிழ்ச்சொல் வளம் (2x5=10) | செய்யுள்: அன்னை மொழியே, காலக்கணிதம் (3x4=12) | செய்யுள்வரி வினாவிடை (3x1=3)" },
  "SL-2": { subject: "Tamil (Session 2)", topic: "இயல் - 2: உரைநடை: கேட்கிறதா என்குரல்! (2x5=10) | செய்யுள்: பரிபாடல், மேகம் (3x4=12) | செய்யுள்வரி வினாவிடை (3x1=3)" },
  "SL-3": { subject: "Tamil (Session 3)", topic: "இயல் - 3: உரைநடை: விருந்து போற்றுதும்! (2x5=10) | செய்யுள்: காசிக்காண்டம், முத்துக்குமாரசாமி பிள்ளைத்தமிழ், திருக்குறள் (3x4=12) | செய்யுள்வரி வினாவிடை (3x1=3)" },
  "SL-4": { subject: "Tamil (Session 4)", topic: "துணைப்பாடம்: புயலிலே ஒரு தோணி, கோபல்லபுரத்து மக்கள், பிரும்மம் (1x10=10) | இலக்கணம்: சொல், தொகைநிலைத் தொடர்கள், தொகாநிலைத் தொடர்கள் (15x1=15)" },
  "SL-5": { subject: "Tamil (Session 5)", topic: "இயல் - 4: உரைநடை: மொழிபெயர்ப்புக் கல்வி (1x5=5) | செய்யுள்: திருவிளையாடற் புராணம் (1x4=4) | துணைப்பாடம்: புதிய நம்பிக்கை (1x10=10) | இலக்கணம்: பொது (6x1=6)" },
  "SL-6": { subject: "Tamil (Session 6)", topic: "இயல் - 5: உரைநடை: பன்முகக் கலைஞர் (1x5=5) | செய்யுள்: கம்பராமாயணம், திருக்குறள் (1x4=4) | துணைப்பாடம்: பாய்ச்சல் (1x10=10) | இலக்கணம்: அகப்பொருள் இலக்கணம் (6x1=6)" },
  "SL-7": { subject: "Tamil (Session 7)", topic: "இயல் - 6: உரைநடை: சிற்றகல் ஒளி (1x5=5) | செய்யுள்: சிலப்பதிகாரம், முத்தொள்ளாயிரம் (1x4=4) | துணைப்பாடம்: மங்கையராய்ப் பிறப்பதற்கே (1x10=10) | இலக்கணம்: புறப்பொருள் இலக்கணம் (6x1=6)" },
  "SL-8": { subject: "Tamil (Session 8)", topic: "இயல் - 7: உரைநடை: சங்க இலக்கியத்தில் அறம் (1x5=5) | செய்யுள்: தேம்பாவணி, அக்கறை (1x4=4) | துணைப்பாடம்: இராமானுசர் (நாடகம்) (1x10=10) | இலக்கணம்: பா வகை, அலகிடுதல் (6x1=6)" },
  "SL-9": { subject: "Tamil (Session 9)", topic: "காட்சியைக் கண்டு கவினுற எழுதுக (2x3=6) | நிரப்புக - இயல் 3 (6x1=6) | பத்தி வினா - சுருக்கமான விடை (5x1=5) | கடிதம்/விண்ணப்பம் (1x8=8)" },
  "SL-10": { subject: "Tamil (Session 10)", topic: "பொதுக்கட்டுரை (1x6=6) | கடிதம்/விண்ணப்பம் (1x8=8) | நிரப்புக - இயல் 5 (11x1=11)" },
  "SL": { subject: "Second Language (Tamil)", topic: "இயல் 1–7 உரைநடை, செய்யுள், துணைப்பாடம் & இலக்கணம்" },

  // Information Technology (IT 1 to 3 + IT 5 Lab/Cumulative)
  "IT-1": { subject: "Information Technology (Session 1)", topic: "Part A Employability Skills & Part B Digital Documentation (Advanced)" },
  "IT-2": { subject: "Information Technology (Session 2)", topic: "Part B Electronic Spreadsheet (Advanced) & Employability Skills" },
  "IT-3": { subject: "Information Technology (Session 3)", topic: "Part B Database Management System (DBMS) & Maintain Health, Safety and Secure Working Environment" },
  "IT 5": { subject: "Information Technology (Cumulative & Practical)", topic: "Full Part A & Part B Blueprint Practice & Practical Questions" },
  "IT": { subject: "Information Technology", topic: "IT Part A & Part B Revision" },

  // Motivation, Error Rectification & Pre-Final Prep Slots (Nov 30 – Dec 04)
  "Life Skills": { subject: "Life Skills & Exam Mindset", topic: "1 Day Life Skills Motivation Session & Board Exam Strategy" },
  "Motivation": { subject: "Confidence & Time Management", topic: "Organize Notes for Dec 1–3 Error Rectification" },
  "Error Rect": { subject: "Mistake Rectification", topic: "Re-solve incorrect questions & weak concepts from PHASE session exams" },
  "Maths & Sci": { subject: "Mathematics & Science Review", topic: "All Maths Formulas, Physics Numerics, Chemical Equations & Bio Diagrams" },
  "Social & Lang": { subject: "Social Science & Languages Review", topic: "Complete Map Work, Grammar Rules & Writing Formats" },
  "Final Recap": { subject: "Final 100% Syllabus Rapid Revision", topic: "Complete Subject Recap before Pre-Final Exams" },
  "Pre-Final Setup": { subject: "Pre-Final Readiness Check", topic: "Final FAT & Formula Review across all subjects" },
  "Pre-Final Prep": { subject: "Pre-Final Exam Preparation", topic: "Full Day Preparation for Pre-Final Social Science Exam (05 Dec)" },
  "Social Science": { subject: "Social Science — Full 100% Syllabus", topic: "History, Geography, Civics, Economics & Complete Map Marathon" },
};

// Authoritative Independent FAT Exam Portions (Taught 6:30 AM MCQs + Independent FAT Syllabus)
export const FAT_EXAMS_MAP: Record<string, { subject: string; topic: string }> = {
  // English FATs (4 Total)
  "FL-1": { subject: "English FAT-1 (20M | 30m)", topic: "Funworks 1 & 2 (Sessions 1 & 2) | A Letter to God, Dust of Snow, Fire and Ice, Nelson Mandela, Tiger in Zoo, Triumph of Surgery, Complaint Letter & Tabular Paragraph" },
  "FL-2": { subject: "English FAT-2 (20M | 30m)", topic: "Funworks 3 & 4 (Sessions 3 & 4) | Two Stories about Flying, Thief's Story, Anne Frank, Wild Animals, Midnight Visitor, Letter to Editor & SWOT Paragraph" },
  "FL-3": { subject: "English FAT-3 (20M | 30m)", topic: "Funworks 5 & 6 (Sessions 5 & 6) | Glimpses of India, The Ball Poem, Amanda!, Question of Trust, Footprints without Feet, Placing an Order & Pie Chart" },
  "FL-4": { subject: "English FAT-4 (20M | 30m)", topic: "Funworks 7 & 8 (Sessions 7–10) | Mijbil, Trees, Making of a Scientist, Madam Rides the Bus, Fog, Necklace, Sermon at Benares, Custard, Bholi, Proposal, Anne Gregory & Book that Saved the Earth" },

  // Tamil / SL FATs (4 Total — Page 10)
  "SL-1": { subject: "Tamil FAT-1 (20M | 30m)", topic: "Fun Works 1 & 2 | பத்தி வினா (2x5=10) | பத்தி வினா - சுருக்கமான விடை (2x5=10)" },
  "SL-2": { subject: "Tamil FAT-2 (20M | 30m)", topic: "Fun Works 3 & 4 | காட்சியைக் கண்டு கவினுற எழுதுக (3x3=9) | திருக்குறள் (இயல் - 3) நிரப்புக (11x1=11)" },
  "SL-3": { subject: "Tamil FAT-3 (20M | 30m)", topic: "Fun Works 5 & 6 | பத்தி வினா - சுருக்கமான விடை (2x5=10) | பத்தி வினா (2x5=10)" },
  "SL-4": { subject: "Tamil FAT-4 (20M | 30m)", topic: "Fun Works 7 & 8 | இலக்கணம் - இயல் 4, 5, 6, 7 (12x1=12) | கடிதம் / விண்ணப்பம் (1x8=8)" },

  // Mathematics FATs (5 Total — Page 11)
  "MAT-1": { subject: "Mathematics FAT-1 (20M | 30m)", topic: "Funwork 1 & 2 | Real Numbers, Polynomials & Introduction to Trigonometry" },
  "MAT-2": { subject: "Mathematics FAT-2 (20M | 30m)", topic: "Funwork 3 & 4 | Pair of Linear Equations in Two Variables & Coordinate Geometry" },
  "MAT-3": { subject: "Mathematics FAT-3 (20M | 30m)", topic: "Funwork 5 & 6 | Surface Areas and Volumes & Circles" },
  "MAT-4": { subject: "Mathematics FAT-4 (20M | 30m)", topic: "Funwork 7 & 8 | Areas Related to Circles, Arithmetic Progressions, Quadratic Equations & Triangles" },
  "MAT-5": { subject: "Mathematics FAT-5 (20M | 30m)", topic: "Funwork 9 & 10 | Some Applications of Trigonometry, Statistics & Probability" },

  // Physics FATs (2 Total — Page 4)
  "PHY-1": { subject: "Physics FAT-1 (20M | 30m)", topic: "Fun Worksheet I & II | Light - Reflection & Refraction and Human Eye & Colourful World" },
  "PHY-2": { subject: "Physics FAT-2 (20M | 30m)", topic: "Fun Worksheet III & Additional Worksheet | Electricity & Magnetic Effects of Electric Current" },

  // Chemistry FATs (2 Total — Page 12)
  "CHE-1": { subject: "Chemistry FAT-1 (20M | 30m)", topic: "Chemical Reactions & Equations (WS-1) & Metals and Non-Metals (WS-1)" },
  "CHE-2": { subject: "Chemistry FAT-2 (20M | 30m)", topic: "Acids, Bases and Salts (WS-1) & Carbon and its Compounds (WS-1)" },

  // Biology FATs (2 Total — Page 13)
  "BIO-1": { subject: "Biology FAT-1 (20M | 30m)", topic: "Worksheet 1 | Chapter 5: Life Processes (Complete)" },
  "BIO-2": { subject: "Biology FAT-2 (20M | 30m)", topic: "Worksheets 2 & 3 | Ch 6: Control & Coordination, Ch 7: How do Organisms Reproduce?, Ch 8: Heredity & Ch 13: Our Environment" },

  // Social Science FATs (5 Total — Page 17 Funwork pairs)
  "SS-1": { subject: "Social Science FAT-1 (20M | 30m)", topic: "Day 1 & 2 Funworks (Sheets 1–6) | Geo-1 Resources & Dev, Geo-2 Forest & Wildlife, DP-3 Gender Religion & Caste, Eco-1 Development & Maps" },
  "SS-2": { subject: "Social Science FAT-2 (20M | 30m)", topic: "Day 3 & 4 Funworks (Sheets 7–12) | Geo-6 Manufacturing Industries, His-5 Print Culture (1–9), His-1 Rise of Nationalism in Europe & Maps" },
  "SS-3": { subject: "Social Science FAT-3 (20M | 30m)", topic: "Day 5 & 6 Funworks (Sheets 13–18) | Geo-3 Water Resources, Eco-3 Money & Credit, His-2 Nationalism in India, DP-1 Power Sharing & Maps" },
  "SS-4": { subject: "Social Science FAT-4 (20M | 30m)", topic: "Day 7 & 8 Funworks (Sheets 19–25) | Geo-4 Agriculture, DP-2 Federalism, Eco-4 Globalisation, DP-5 Outcomes of Democracy, Geo-5 Minerals & Energy & Maps" },
  "SS-5": { subject: "Social Science FAT-5 (20M | 30m)", topic: "Day 9 & 10 Funworks (Sheets 26–29) | Eco-2 Sectors of Indian Economy, DP-4 Political Parties, His-3 Making of a Global World (1.1–1.3) & Cumulative Maps" },

  // IT FAT (1 Total — Page 7)
  "IT-1": { subject: "Information Technology FAT-1 (20M | 30m)", topic: "IT Funworks 1 & 2 | Part A Employability Skills & Part B Subject Skills Units" },
};

// Exact Date-to-Funwork Portion Map aligned to Updated 10A-10E Timetable & Syllabus PDF
export const DAILY_FUNWORK_MAP: Record<string, { subject: string; topic: string }> = {
  "2026-11-10": { subject: "English (First Language) · Funwork 3 & 4", topic: "Two Stories about Flying, Thief's Story, Anne Frank, Wild Animals, Midnight Visitor, Letter to Editor & SWOT Paragraph" },
  "2026-11-11": { subject: "Biology · Funwork Worksheet 1", topic: "Chapter 5: Life Processes (Complete — Prepares for Biology FAT-1 on Nov 12)" },
  "2026-11-12": { subject: "Information Technology · Funwork 1 & 2", topic: "Employability Skills & Digital Documentation / Spreadsheet Worksheets (Prepares for IT FAT-1 on Nov 13)" },
  "2026-11-13": { subject: "Mathematics · Funwork 5 & 6", topic: "Surface Areas and Volumes & Circles (Prepares for Maths FAT-3 on Nov 14)" },
  "2026-11-14": { subject: "Physics · Fun Worksheet III", topic: "Electricity & Magnetic Effects of Electric Current Drill Sheets" },
  "2026-11-15": { subject: "Tamil · Funwork 3 & 4", topic: "காட்சியைக் கண்டு கவினுற எழுதுக | திருக்குறள் (இயல் - 3) நிரப்புக (Prepares for Tamil FAT-2 on Nov 16)" },
  "2026-11-16": { subject: "Social Science · Day 5 & 6 (Sheets 13–18)", topic: "Geo-3 Water Resources, Eco-3 Money & Credit, His-2 Nationalism in India, DP-1 Power Sharing & Map Worksheets (Prepares for SS FAT-3)" },
  "2026-11-17": { subject: "English (First Language) · Funwork 5 & 6", topic: "Glimpses of India, The Ball Poem, Amanda!, Question of Trust, Footprints without Feet, Placing Order & Pie Chart (Prepares for FL FAT-3)" },
  "2026-11-18": { subject: "Chemistry · Funwork Worksheet 1", topic: "Acids, Bases and Salts (WS-1) & Carbon and its Compounds (WS-1) (Prepares for Chemistry FAT-2 on Nov 19)" },
  "2026-11-19": { subject: "Mathematics · Funwork 7", topic: "Areas Related to Circles & Arithmetic Progressions" },
  "2026-11-20": { subject: "Biology · Funwork Worksheets 2 & 3", topic: "Ch 6 Control & Coordination, Ch 13 Our Environment, Ch 7 How do Organisms Reproduce? & Ch 8 Heredity (Prepares for Bio FAT-2 on Nov 21)" },
  "2026-11-21": { subject: "Tamil · Funwork 5", topic: "பத்தி வினா (சுருக்கமான விடை) Practice Sheet" },
  "2026-11-22": { subject: "Social Science · Day 7 (Sheets 19–22)", topic: "Geo-4 Agriculture, DP-2 Federalism, Eco-4 Globalisation & Map WS (Soil Types, Major Dams, Cotton Textiles)" },
  "2026-11-23": { subject: "Mathematics · Funwork 8", topic: "Quadratic Equations & Triangles (Prepares for Maths FAT-4 on Nov 24)" },
  "2026-11-24": { subject: "Social Science · Day 8 (Sheets 23–25)", topic: "DP-5 Outcomes of Democracy, Geo-5 Minerals & Energy Resources & Map WS (Mines, Oil Fields, Airports) (Prepares for SS FAT-4)" },
  "2026-11-25": { subject: "Tamil · Funwork 6", topic: "பத்தி வினா (Phase 1 - Page No. 137) (Prepares for Tamil FAT-3 on Nov 26)" },
  "2026-11-26": { subject: "English (First Language) · Funwork 7", topic: "Mijbil the Otter, The Trees, Making of a Scientist & Letter of Inquiry" },
  "2026-11-27": { subject: "Physics · Additional Worksheet", topic: "Cumulative Physics Numericals, Ray Diagrams & Magnetic Effects (Prepares for Physics FAT-2 on Nov 28)" },
  "2026-11-28": { subject: "Social Science · Day 9 (Sheets 26–29)", topic: "Eco-2 Sectors of Indian Economy, DP-4 Political Parties, His-3 Making of a Global World (1.1–1.3) & Map WS" },
  "2026-11-29": { subject: "Mathematics · Funwork 9", topic: "Some Applications of Trigonometry & Statistics" },
  "2026-11-30": { subject: "Tamil · Funwork 7", topic: "இலக்கணம் (இயல் 4, 5, 6, 7) Practice Worksheet" },
  "2026-12-01": { subject: "English (First Language) · Funwork 8", topic: "Madam Rides the Bus, Fog, The Necklace, Sermon at Benares, Custard, Bholi, Proposal, Anne Gregory & Book that Saved the Earth (Prepares for FL FAT-4)" },
  "2026-12-02": { subject: "Mathematics · Funwork 10", topic: "Probability & Cumulative Trigonometry/Statistics (Prepares for Maths FAT-5)" },
  "2026-12-03": { subject: "Tamil · Funwork 8", topic: "கடிதம் / விண்ணப்பம் Practice Sheet (Prepares for Tamil FAT-4)" },
  "2026-12-04": { subject: "Social Science · Day 10 (Cumulative)", topic: "All 29 Map & Social Worksheets Cumulative Revision (Prepares for SS FAT-5 & Pre-Final Exam)" },
};

// Updated Timetable Data (Official 10A-10E PHASE Session Timetable)
export const SECTION_TIMETABLE_DATA: SectionDailySession[] = [
  {
    date: "2026-11-10",
    day: "Tuesday",
    sections: {
      "10A": { fn: "SS-4", an: "BIO" },
      "10B": { fn: "MAT-8", an: "IT-2" },
      "10C": { fn: "MAT-8", an: "FL-5" },
      "10D": { fn: "MAT-8", an: "FL-5" },
      "10E": { fn: "SS-8", an: "FL-5" }
    },
    funwork: "FL",
    fat: "FL-2"
  },
  {
    date: "2026-11-11",
    day: "Wednesday",
    sections: {
      "10A": { fn: "CHE", an: "FL-3" },
      "10B": { fn: "SL-5", an: "BIO-3" },
      "10C": { fn: "SL-5", an: "SS-8" },
      "10D": { fn: "SL-5", an: "SS-8" },
      "10E": { fn: "SL-5", an: "MAT-8" }
    },
    funwork: "BIO",
    fat: "None"
  },
  {
    date: "2026-11-12",
    day: "Thursday",
    sections: {
      "10A": { fn: "FL-3", an: "SL-3" },
      "10B": { fn: "FL-5", an: "SS-8" },
      "10C": { fn: "BIO-3", an: "MAT-9" },
      "10D": { fn: "BIO-3", an: "MAT-9" },
      "10E": { fn: "IT-2", an: "CHE-3" }
    },
    funwork: "IT",
    fat: "BIO-1"
  },
  {
    date: "2026-11-13",
    day: "Friday",
    sections: {
      "10A": { fn: "SL-3", an: "SS-5" },
      "10B": { fn: "PHY-3", an: "MAT-9" },
      "10C": { fn: "SS-9", an: "FL-6" },
      "10D": { fn: "SS-9", an: "FL-6" },
      "10E": { fn: "PHY-3", an: "MAT-9" }
    },
    funwork: "MAT",
    fat: "IT-1"
  },
  {
    date: "2026-11-14",
    day: "Saturday",
    sections: {
      "10A": { fn: "SS-5", an: "MAT-5" },
      "10B": { fn: "SS-9", an: "FL-6" },
      "10C": { fn: "PHY-3", an: "IT-2" },
      "10D": { fn: "PHY-3", an: "IT-2" },
      "10E": { fn: "SS-9", an: "FL-6" }
    },
    funwork: "PHY",
    fat: "MAT-3"
  },
  {
    date: "2026-11-15",
    day: "Sunday",
    sections: {
      "10A": { fn: "MAT", an: "—" },
      "10B": { fn: "CHE-3", an: "—" },
      "10C": { fn: "CHE-3", an: "—" },
      "10D": { fn: "CHE-3", an: "—" },
      "10E": { fn: "BIO-3", an: "—" }
    },
    funwork: "SL",
    fat: "None"
  },
  {
    date: "2026-11-16",
    day: "Monday",
    sections: {
      "10A": { fn: "MAT-5", an: "BIO" },
      "10B": { fn: "SL-6", an: "SS-10" },
      "10C": { fn: "SL-6", an: "FL-7" },
      "10D": { fn: "SL-6", an: "FL-7" },
      "10E": { fn: "SL-6", an: "SS-10" }
    },
    funwork: "SS",
    fat: "SL-2"
  },
  {
    date: "2026-11-17",
    day: "Tuesday",
    sections: {
      "10A": { fn: "PHY", an: "IT-1" },
      "10B": { fn: "MAT-10", an: "FL-7" },
      "10C": { fn: "MAT-10", an: "SS-10" },
      "10D": { fn: "MAT-10", an: "SS-10" },
      "10E": { fn: "BIO-4", an: "FL-7" }
    },
    funwork: "FL",
    fat: "SS-3"
  },
  {
    date: "2026-11-18",
    day: "Wednesday",
    sections: {
      "10A": { fn: "IT-1", an: "FL-4" },
      "10B": { fn: "SS-11", an: "SL-7" },
      "10C": { fn: "PHY-4", an: "SL-7" },
      "10D": { fn: "PHY-4", an: "SL-7" },
      "10E": { fn: "SS-11", an: "SL-7" }
    },
    funwork: "CHE",
    fat: "FL-3"
  },
  {
    date: "2026-11-19",
    day: "Thursday",
    sections: {
      "10A": { fn: "FL-4", an: "SL-4" },
      "10B": { fn: "FL-8", an: "PHY-4" },
      "10C": { fn: "SS-11", an: "BIO-4" },
      "10D": { fn: "SS-11", an: "BIO-4" },
      "10E": { fn: "CHE-4", an: "MAT-10" }
    },
    funwork: "MAT",
    fat: "CHE-2"
  },
  {
    date: "2026-11-20",
    day: "Friday",
    sections: {
      "10A": { fn: "SL-4", an: "MAT-6" },
      "10B": { fn: "BIO-4", an: "SS-12" },
      "10C": { fn: "CHE-4", an: "FL-8" },
      "10D": { fn: "CHE-4", an: "FL-8" },
      "10E": { fn: "PHY-4", an: "SS-12" }
    },
    funwork: "BIO",
    fat: "None"
  },
  {
    date: "2026-11-21",
    day: "Saturday",
    sections: {
      "10A": { fn: "MAT-6", an: "PHY" },
      "10B": { fn: "CHE-4", an: "SL-8" },
      "10C": { fn: "SS-12", an: "SL-8" },
      "10D": { fn: "SS-12", an: "SL-8" },
      "10E": { fn: "MAT-11", an: "SL-8" }
    },
    funwork: "SL",
    fat: "BIO-2"
  },
  {
    date: "2026-11-22",
    day: "Sunday",
    sections: {
      "10A": { fn: "CHE/PHY", an: "—" },
      "10B": { fn: "MAT-11", an: "—" },
      "10C": { fn: "MAT-11", an: "—" },
      "10D": { fn: "MAT-11", an: "—" },
      "10E": { fn: "FL-8", an: "—" }
    },
    funwork: "SS",
    fat: "None"
  },
  {
    date: "2026-11-23",
    day: "Monday",
    sections: {
      "10A": { fn: "CHE", an: "IT-2" },
      "10B": { fn: "FL-9", an: "BIO-5" },
      "10C": { fn: "SS-13", an: "PHY-5" },
      "10D": { fn: "SS-13", an: "PHY-5" },
      "10E": { fn: "MAT-12", an: "IT-3" }
    },
    funwork: "MAT",
    fat: "None"
  },
  {
    date: "2026-11-24",
    day: "Tuesday",
    sections: {
      "10A": { fn: "IT-2", an: "SS-6" },
      "10B": { fn: "SS-13", an: "SL-9" },
      "10C": { fn: "MAT-12", an: "SL-9" },
      "10D": { fn: "MAT-12", an: "SL-9" },
      "10E": { fn: "FL-9", an: "SL-9" }
    },
    funwork: "SS",
    fat: "MAT-4"
  },
  {
    date: "2026-11-25",
    day: "Wednesday",
    sections: {
      "10A": { fn: "SS-6", an: "SL-5" },
      "10B": { fn: "MAT-12", an: "CHE-5" },
      "10C": { fn: "FL-9", an: "IT-3" },
      "10D": { fn: "FL-9", an: "IT-3" },
      "10E": { fn: "SS-13", an: "PHY-5" }
    },
    funwork: "SL",
    fat: "SS-4"
  },
  {
    date: "2026-11-26",
    day: "Thursday",
    sections: {
      "10A": { fn: "SL-5", an: "FL-5" },
      "10B": { fn: "PHY-5", an: "FL10" },
      "10C": { fn: "MAT-13", an: "SS-14" },
      "10D": { fn: "MAT-13", an: "SS-14" },
      "10E": { fn: "MAT-13", an: "CHE-5" }
    },
    funwork: "FL",
    fat: "SL-3"
  },
  {
    date: "2026-11-27",
    day: "Friday",
    sections: {
      "10A": { fn: "FL-5", an: "MAT-7" },
      "10B": { fn: "SS-14", an: "MAT-13" },
      "10C": { fn: "CHE 5", an: "PHY 6" },
      "10D": { fn: "CHE 5", an: "PHY 6" },
      "10E": { fn: "SS-14", an: "BIO 5" }
    },
    funwork: "PHY",
    fat: "None"
  },
  {
    date: "2026-11-28",
    day: "Saturday",
    sections: {
      "10A": { fn: "MAT-7", an: "CHE" },
      "10B": { fn: "PHY 6", an: "IT 5" },
      "10C": { fn: "BIO 5", an: "FL 10" },
      "10D": { fn: "BIO 5", an: "FL 10" },
      "10E": { fn: "PHY 6", an: "FL-10" }
    },
    funwork: "SS",
    fat: "PHY-2"
  },
  {
    date: "2026-11-29",
    day: "Sunday",
    sections: {
      "10A": { fn: "SL-10", an: "—" },
      "10B": { fn: "SL-10", an: "—" },
      "10C": { fn: "SL-10", an: "—" },
      "10D": { fn: "SL-10", an: "—" },
      "10E": { fn: "SL-10", an: "—" }
    },
    funwork: "MAT",
    fat: "None"
  },
  {
    date: "2026-11-30",
    day: "Monday",
    sections: {
      "10A": { fn: "BIO", an: "SS-7" },
      "10B": { fn: "Life Skills", an: "Motivation" },
      "10C": { fn: "Life Skills", an: "Motivation" },
      "10D": { fn: "Life Skills", an: "Motivation" },
      "10E": { fn: "Life Skills", an: "Motivation" }
    },
    funwork: "SL",
    fat: "None"
  },
  {
    date: "2026-12-01",
    day: "Tuesday",
    sections: {
      "10A": { fn: "SS-7", an: "PHY/BIO" },
      "10B": { fn: "Error Rect", an: "Maths & Sci" },
      "10C": { fn: "Error Rect", an: "Maths & Sci" },
      "10D": { fn: "Error Rect", an: "Maths & Sci" },
      "10E": { fn: "Error Rect", an: "Maths & Sci" }
    },
    funwork: "FL",
    fat: "FL-4"
  },
  {
    date: "2026-12-02",
    day: "Wednesday",
    sections: {
      "10A": { fn: "CHE", an: "MAT" },
      "10B": { fn: "Error Rect", an: "Social & Lang" },
      "10C": { fn: "Error Rect", an: "Social & Lang" },
      "10D": { fn: "Error Rect", an: "Social & Lang" },
      "10E": { fn: "Error Rect", an: "Social & Lang" }
    },
    funwork: "MAT",
    fat: "MAT-5"
  },
  {
    date: "2026-12-03",
    day: "Thursday",
    sections: {
      "10A": { fn: "SL", an: "—" },
      "10B": { fn: "Final Recap", an: "Pre-Final Setup" },
      "10C": { fn: "Final Recap", an: "Pre-Final Setup" },
      "10D": { fn: "Final Recap", an: "Pre-Final Setup" },
      "10E": { fn: "Final Recap", an: "Pre-Final Setup" }
    },
    funwork: "SL",
    fat: "SL-4"
  },
  {
    date: "2026-12-04",
    day: "Friday",
    sections: {
      "10A": { fn: "Pre-Final Prep", an: "Social Science" },
      "10B": { fn: "Pre-Final Prep", an: "Social Science" },
      "10C": { fn: "Pre-Final Prep", an: "Social Science" },
      "10D": { fn: "Pre-Final Prep", an: "Social Science" },
      "10E": { fn: "Pre-Final Prep", an: "Social Science" }
    },
    funwork: "SS",
    fat: "SS-5"
  }
];

// Full Official PHASE Schedule
export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { date: "2026-10-15", day: "Thursday", test1_subject: "Dasara Vacation", test1_portion: "Dasara Vacation (15.10.2026 to 21.10.2026)", test2_subject: null, test2_portion: null, fat_subject: "Study Hour / Funwork Prep", fat_portion: "PHASE Preliminary Study Hours" },
  { date: "2026-10-16", day: "Friday", test1_subject: "Dasara Vacation", test1_portion: "Dasara Vacation (15.10.2026 to 21.10.2026)", test2_subject: null, test2_portion: null, fat_subject: "PHASE Prep: Maths & Science", fat_portion: "Review Real Numbers | Review Light - Reflection" },
  { date: "2026-10-17", day: "Saturday", test1_subject: "Dasara Vacation", test1_portion: "Dasara Vacation (15.10.2026 to 21.10.2026)", test2_subject: null, test2_portion: null, fat_subject: "PHASE Prep: Social Science", fat_portion: "Geo-1: Resources and Development | Geo-2: Forest and Wildlife" },
  { date: "2026-10-18", day: "Sunday", test1_subject: "Dasara Vacation", test1_portion: "Dasara Vacation (15.10.2026 to 21.10.2026)", test2_subject: null, test2_portion: null, fat_subject: "Holiday", fat_portion: "Dasara Festival Break" },
  { date: "2026-10-19", day: "Monday", test1_subject: "Dasara Vacation", test1_portion: "Dasara Vacation (15.10.2026 to 21.10.2026)", test2_subject: null, test2_portion: null, fat_subject: "Holiday", fat_portion: "Dasara Festival Break" },
  { date: "2026-10-20", day: "Tuesday", test1_subject: "Dasara Vacation", test1_portion: "Dasara Vacation (15.10.2026 to 21.10.2026)", test2_subject: null, test2_portion: null, fat_subject: "Holiday", fat_portion: "Dasara Festival Break" },
  { date: "2026-10-21", day: "Wednesday", test1_subject: "Dasara Vacation", test1_portion: "Dasara Vacation (15.10.2026 to 21.10.2026)", test2_subject: null, test2_portion: null, fat_subject: "Day-1 Readiness Check", fat_portion: "Maths: Real Numbers | Social: Geo-1 & Geo-2" },
  { date: "2026-10-22", day: "Thursday", test1_subject: "Mathematics (Session 1)", test1_portion: "Real Numbers", test2_subject: "Social Science (Session 1)", test2_portion: "Geo-1: Resources and Development | Geo-2: Forest and Wild Life Resources | Map Work: Soil Types, Major Dams", fat_subject: "Funwork: Maths FW-1 & Social Day-1", fat_portion: "Maths FW-1: a) Real Numbers, b) Polynomials | Social FW Sheets 1, 2 & 3: Geo-1, Geo-2 & Map WS" },
  { date: "2026-10-23", day: "Friday", test1_subject: "Physics (Session 1)", test1_portion: "Light - Reflection", test2_subject: "English (Session 1)", test2_portion: "Reading Passages | Grammar: Q. No. I & II | Writing: Complaint Letter, Excerpts, Product Based | Literature: A Letter to God, Dust of Snow & Fire and Ice", fat_subject: "Funwork: Physics FW-I & English FW-1", fat_portion: "Physics Fun Worksheet-I: Light - Reflection and Refraction | English Funwork 1: Reading & Grammar Q. I-II" },
  { date: "2026-10-24", day: "Saturday", test1_subject: "Chemistry (Session 1)", test1_portion: "Chemical reactions and equations Part 1, 2, 3 (SET D: Part 2, 3)", test2_subject: "Tamil (Session 1)", test2_portion: "இயல் - 1: உரைநடை: பாவாணர் பார்வையில் தமிழ்ச்சொல் வளம் (2x5=10) | செய்யுள்: அன்னை மொழியே, காலக்கணிதம் (3x4=12) | செய்யுள்வரி வினாவிடை (3x1=3)", fat_subject: "Funwork: Chemistry Day-1 & Tamil FW-1", fat_portion: "Chemistry: Chemical reactions and equations - WS 1 (FAT-1) | Tamil FW-1: பத்தி வினா" },
  { date: "2026-10-25", day: "Sunday", test1_subject: "Social Science (Session 2 - Sunday)", test1_portion: "DP-3: Gender, Religion and Caste | Map Work: Software Techno Parks, Cotton Textiles", test2_subject: null, test2_portion: null, fat_subject: "Funwork: Social Day-2", fat_portion: "Social FW Sheets 4, 5 & 6: DP-3 Gender, Religion and Caste | Eco-1 Development | Map WS" },
  { date: "2026-10-26", day: "Monday", test1_subject: "Mathematics (Session 2)", test1_portion: "Polynomials", test2_subject: "Biology (Session 1)", test2_portion: "Chapter 5: Life Processes - 5.1 What are Life Processes?, 5.2 Nutrition & 5.3 Respiration", fat_subject: "FAT #1: Social Science FAT-1", fat_portion: "Social FAT-1 (20M | 30m): Based on Funwork Day 1 & 2 (Geo-1, Geo-2, DP-3, Eco-1 & Maps)" },
  { date: "2026-10-27", day: "Tuesday", test1_subject: "Social Science (Session 3)", test1_portion: "Eco-1: Development | Eco-4: Globalisation & The Indian Economy | Map Work: Major Crops, Iron & Steel Plants", test2_subject: "English (Session 2)", test2_portion: "Reading Passages | Grammar: Q. No. III-IV | Writing: Analytical Paragraph - Tabular, Profiles | Literature: Nelson Mandela, A Tiger in the Zoo, A Triumph of Surgery", fat_subject: "FAT #2: English FAT-1", fat_portion: "English FAT-1 (20M | 30m): Based on Funworks 1 & 2 (Sessions 1 & 2 Syllabus)" },
  { date: "2026-10-28", day: "Wednesday", test1_subject: "Physics (Session 2)", test1_portion: "Light - Refraction", test2_subject: "Tamil (Session 2)", test2_portion: "இயல் - 2: உரைநடை: கேட்கிறதா என்குரல்! (2x5=10) | செய்யுள்: பரிபாடல், மேகம் (3x4=12) | செய்யுள்வரி வினாவிடை (3x1=3)", fat_subject: "FAT #3: Tamil FAT-1", fat_portion: "Tamil FAT-1 (20M | 30m): Fun Works 1 & 2 — பத்தி வினா (சுருக்கமான விடை) (2x5=10, 2x5=10)" },
  { date: "2026-10-29", day: "Thursday", test1_subject: "Mathematics (Session 3)", test1_portion: "Introduction to Trigonometry", test2_subject: "Chemistry (Session 2)", test2_portion: "Carbon and its compounds - Part 1 & Part 2 (Hydrocarbons, Homologous series & IUPAC) (SET D: Part 2)", fat_subject: "FAT #4: Mathematics FAT-1", fat_portion: "Maths FAT-1 (20M | 30m): Funwork 1 & 2 — a) Real Numbers, b) Polynomials, Introduction to Trigonometry" },
  { date: "2026-10-30", day: "Friday", test1_subject: "Social Science (Session 4)", test1_portion: "His-5: Print Culture (3. The Print Revolution, 4. The Reading Mania) | Map Work: INC Sessions, National Movement, Power Plants", test2_subject: "Biology (Session 2)", test2_portion: "Chapter 5: Life Processes - 5.4 Transportation & 5.5 Excretion", fat_subject: "FAT #5: Biology FAT-1", fat_portion: "Biology FAT-1 (20M | 30m): Worksheet 1 — Chapter 5: Life Processes (Complete)" },
  { date: "2026-10-31", day: "Saturday", test1_subject: "English (Session 3)", test1_portion: "Reading Passages | Grammar: Q. No. V-VI | Writing: Letter to the Editor | Literature: Two Stories about Flying, SR - The Thief's Story", test2_subject: "Tamil (Session 3)", test2_portion: "இயல் - 3: உரைநடை: விருந்து போற்றுதும்! (2x5=10) | செய்யுள்: காசிக்காண்டம், முத்துக்குமாரசாமி பிள்ளைத்தமிழ், திருக்குறள் (3x4=12)", fat_subject: "FAT #6: Chemistry FAT-1", fat_portion: "Chemistry FAT-1 (20M | 30m): Chemical reactions and equations (WS-1) & Metals and Non-metals (WS-1)" },
  { date: "2026-11-01", day: "Sunday", test1_subject: "Physics (Session 6 - Sunday Buffer)", test1_portion: "Magnetic Effects of Electric Current", test2_subject: null, test2_portion: null, fat_subject: "Funwork: Social Day-3 & Tamil FW-3", fat_portion: "Social FW Sheets 7, 8 & 9: Geo-6, His-5 (1-5) & Maps | Tamil FW-3: காட்சியைக் கண்டு கவினுற எழுதுக" },
  { date: "2026-11-02", day: "Monday", test1_subject: "Mathematics (Session 4)", test1_portion: "Pair of Linear Equations in two variables", test2_subject: "Social Science (Session 5)", test2_portion: "His-5: Print Culture (1, 2, 5, 6, 7, 8, 9) | Map Work: Major Ports, International Airports", fat_subject: "FAT #7: Social Science FAT-2", fat_portion: "Social FAT-2 (20M | 30m): Funwork Day 3 & 4 — Geo-6, His-5 (Complete), His-1 & Maps" },
  { date: "2026-11-03", day: "Tuesday", test1_subject: "Physics (Session 3)", test1_portion: "Light - Reflection & Refraction", test2_subject: "English (Session 4)", test2_portion: "Reading Passages | Grammar: Q. No. VII-VIII | Writing: Analytical Paragraph - SWOT | Literature: Anne Frank, Wild Animals, Midnight Visitor", fat_subject: "FAT #8: English FAT-2", fat_portion: "English FAT-2 (20M | 30m): Based on Funworks 3 & 4 (Sessions 3 & 4 Syllabus)" },
  { date: "2026-11-04", day: "Wednesday", test1_subject: "Chemistry (Session 3)", test1_portion: "Carbon and its compounds - Part 3 (Chemical properties, Ethyl alcohol, Ethanoic acid, Soaps and Detergents)", test2_subject: "Tamil (Session 4)", test2_portion: "துணைப்பாடம்: புயலிலே ஒரு தோணி, கோபல்லபுரத்து மக்கள், பிரும்மம் (1x10=10) | இலக்கணம்: சொல், தொகைநிலை, தொகாநிலைத் தொடர்கள் (15x1=15)", fat_subject: "FAT #9: Tamil FAT-2", fat_portion: "Tamil FAT-2 (20M | 30m): Fun Works 3 & 4 — காட்சியைக் கண்டு கவினுற எழுதுக (2x3=9) | திருக்குறள் இயல்-3 நிரப்புக (11x1=11)" },
  { date: "2026-11-05", day: "Thursday", test1_subject: "Mathematics (Session 5)", test1_portion: "Coordinate Geometry", test2_subject: "Biology (Session 3)", test2_portion: "Chapter 6: Control and Coordination", fat_subject: "FAT #10: Mathematics FAT-2", fat_portion: "Maths FAT-2 (20M | 30m): Funwork 3 & 4 — Pair of Linear Equations & Coordinate Geometry" },
  { date: "2026-11-06", day: "Friday", test1_subject: "Social Science (Session 6)", test1_portion: "His-1: The Rise of Nationalism in Europe | Geo-3: Water Resources | Map Work: Iron Ore Mines, Coal Mines & Oil Fields", test2_subject: "Information Technology (Session 1)", test2_portion: "IT Session 1 Revision (Part A & Part B Units)", fat_subject: "FAT #11: Information Technology FAT-1", fat_portion: "IT FAT-1 (20M | 30m): Based on IT Funworks 1 & 2" },
  { date: "2026-11-07", day: "Saturday", test1_subject: "Diwali Vacation", test1_portion: "Diwali Vacation (07.11.2026 to 09.11.2026)", test2_subject: null, test2_portion: null, fat_subject: "Holiday", fat_portion: "Diwali Festival Break" },
  { date: "2026-11-08", day: "Sunday", test1_subject: "Diwali Vacation", test1_portion: "Diwali Vacation (07.11.2026 to 09.11.2026)", test2_subject: null, test2_portion: null, fat_subject: "Holiday", fat_portion: "Diwali Festival Break" },
  { date: "2026-11-09", day: "Monday", test1_subject: "Diwali Vacation", test1_portion: "Diwali Vacation (07.11.2026 to 09.11.2026)", test2_subject: null, test2_portion: null, fat_subject: "Holiday", fat_portion: "Diwali Festival Break" },
  { date: "2026-11-10", day: "Tuesday", test1_subject: "Mathematics (Session 6)", test1_portion: "Surface Areas and Volumes", test2_subject: "English (Session 5)", test2_portion: "Reading Passages | Grammar: Q. No. IX-X | Writing: Letter of Placing an Order | Literature: Glimpses of India (Baker, Coorg, Tea)", fat_subject: "Funwork: Maths FW-5 & Social Day-5", fat_portion: "Maths FW-5: Surface Areas and Volumes | Social FW Sheets 13, 14 & 15: Geo-3, Eco-3, Map WS" },
  { date: "2026-11-11", day: "Wednesday", test1_subject: "Social Science (Session 7)", test1_portion: "Eco-3: Money and Credit | Map Work: Cumulative", test2_subject: "Tamil (Session 5)", test2_portion: "இயல் - 4: உரைநடை: மொழிபெயர்ப்புக் கல்வி (1x5=5) | செய்யுள்: திருவிளையாடற் புராணம் (1x4=4) | துணைப்பாடம்: புதிய நம்பிக்கை (1x10=10) | இலக்கணம்: பொது (6x1=6)", fat_subject: "Funwork: Tamil FW-5 & Physics FW-II", fat_portion: "Tamil FW-5: பத்தி வினா | Physics Fun Worksheet-II: Human Eye and Colourful World" },
  { date: "2026-11-12", day: "Thursday", test1_subject: "Physics (Session 4)", test1_portion: "Human Eye and the Colourful World", test2_subject: "Chemistry (Session 4)", test2_portion: "Acids, bases and salts & Metals and non-metals (SET D: Acids, bases and salts Part 1, 3)", fat_subject: "FAT #12: Physics FAT-1 & Chemistry FAT-2", fat_portion: "Physics FAT-1: Fun Worksheet I & II | Chemistry FAT-2: Acids, Bases & Salts + Carbon & its Compounds" },
  { date: "2026-11-13", day: "Friday", test1_subject: "Mathematics (Session 7)", test1_portion: "Circles", test2_subject: "Biology (Session 4)", test2_portion: "Chapter 7: How do organisms reproduce?", fat_subject: "FAT #13: Mathematics FAT-3", fat_portion: "Maths FAT-3 (20M | 30m): Funwork 5 & 6 — Surface Areas and Volumes & Circles" },
  { date: "2026-11-14", day: "Saturday", test1_subject: "Social Science (Session 8)", test1_portion: "His-2: Nationalism in India | Map Work: INC Sessions, National Movement Centres, Power Plants", test2_subject: "English (Session 6)", test2_portion: "Reading Passages | Grammar: Q. No. XI-XII | Writing: Analytical Paragraph - Pie chart | Literature: The Ball Poem, Amanda!, Question of Trust, Footprints", fat_subject: "FAT #14: Social FAT-3 & English FAT-3", fat_portion: "Social FAT-3: Funwork Day 5 & 6 | English FAT-3: Funworks 5 & 6" },
  { date: "2026-11-15", day: "Sunday", test1_subject: "Mathematics (Session 8 - Cumulative)", test1_portion: "Cumulative Session (Session VI & VII: Surface Areas and Volumes, Circles) [Duration: 1 Hour | Max Marks: 30]", test2_subject: null, test2_portion: null, fat_subject: "Funwork: Tamil FW-6", fat_portion: "Tamil FW-6: பத்தி வினா (Phase 1 - Page No. 137)" },
  { date: "2026-11-16", day: "Monday", test1_subject: "Tamil (Session 6)", test1_portion: "இயல் - 5: உரைநடை: பன்முகக் கலைஞர் (1x5=5) | செய்யுள்: கம்பராமாயணம், திருக்குறள் (1x4=4) | துணைப்பாடம்: பாய்ச்சல் (1x10=10) | இலக்கணம்: அகப்பொருள் (6x1=6)", test2_subject: "Information Technology (Session 2)", test2_portion: "IT Session 2 Revision (Part A & Part B Units)", fat_subject: "FAT #15: Tamil FAT-3", fat_portion: "Tamil FAT-3 (20M | 30m): Fun Works 5 & 6 — பத்தி வினா (சுருக்கமான விடை) & பத்தி வினா" },
  { date: "2026-11-17", day: "Tuesday", test1_subject: "Mathematics (Session 9)", test1_portion: "Areas Related to Circles + Arithmetic Progressions", test2_subject: "Social Science (Session 9)", test2_portion: "DP-1: Power Sharing | DP-2: Federalism | Map Work: Soil Types, Major Dams", fat_subject: "Funwork: Maths FW-7 & Social Day-7", fat_portion: "Maths FW-7: Areas Related to Circles & AP | Social FW Sheets 19-22: Geo-4, DP-2, Eco-4 & Maps" },
  { date: "2026-11-18", day: "Wednesday", test1_subject: "Physics (Session 5)", test1_portion: "Electricity", test2_subject: "English (Session 7)", test2_portion: "Reading Passages | Grammar: Q. No. I-XII | Writing: Letter of Inquiry | Literature: Mijbil the Otter, The Trees, Making of a Scientist", fat_subject: "FAT #16: Physics FAT-2", fat_portion: "Physics FAT-2 (20M | 30m): Fun Worksheet-III (Electricity) & Additional Worksheet (Magnetic Effects)" },
  { date: "2026-11-19", day: "Thursday", test1_subject: "Biology (Session 5)", test1_portion: "Chapter 8: Heredity & Chapter 13: Our Environment", test2_subject: "Tamil (Session 7)", test2_portion: "இயல் - 6: உரைநடை: சிற்றகல் ஒளி (1x5=5) | செய்யுள்: சிலப்பதிகாரம், முத்தொள்ளாயிரம் (1x4=4) | துணைப்பாடம்: மங்கையராய்ப் பிறப்பதற்கே (1x10=10) | இலக்கணம்: புறப்பொருள் (6x1=6)", fat_subject: "FAT #17: Biology FAT-2", fat_portion: "Biology FAT-2 (20M | 30m): Worksheets 2 & 3 — Ch 6, Ch 7, Ch 8, Ch 13" },
  { date: "2026-11-20", day: "Friday", test1_subject: "Mathematics (Session 10)", test1_portion: "Quadratic Equations", test2_subject: "Social Science (Session 10)", test2_portion: "Geo-4: Agriculture | Geo-6: Manufacturing Industries | Map Work: Major Crops, Iron & Steel Plants", fat_subject: "Funwork: Maths FW-8 & Social Day-8", fat_portion: "Maths FW-8: Quadratic Equations & Triangles | Social FW Sheets 23-25: DP-5, Geo-5 & Maps" },
  { date: "2026-11-21", day: "Saturday", test1_subject: "English (Session 8)", test1_portion: "Reading Passages | Grammar: Q. No. I-XII | Writing: Analytical Paragraph - Bar Graph | Literature: Madam Rides the Bus, Fog, The Necklace", test2_subject: "Tamil (Session 8)", test2_portion: "இயல் - 7: உரைநடை: சங்க இலக்கியத்தில் அறம் (1x5=5) | செய்யுள்: தேம்பாவணி, அக்கறை (1x4=4) | துணைப்பாடம்: இராமானுசர் (1x10=10) | இலக்கணம்: பா வகை (6x1=6)", fat_subject: "FAT #18: Social Science FAT-4", fat_portion: "Social FAT-4 (20M | 30m): Based on Funwork Day 7 & 8 (Geo-4, DP-2, Eco-4, DP-5, Geo-5 & Maps)" },
  { date: "2026-11-22", day: "Sunday", test1_subject: "Chemistry (Session 5 - Sunday Buffer)", test1_portion: "Periodic classification of elements (SET D: Metals and non-metals Part 2, 3)", test2_subject: null, test2_portion: null, fat_subject: "Funwork: Tamil FW-7", fat_portion: "Tamil FW-7: இலக்கணம் (இயல் 4, 5, 6, 7)" },
  { date: "2026-11-23", day: "Monday", test1_subject: "Mathematics (Session 11)", test1_portion: "Triangles", test2_subject: "Social Science (Session 11)", test2_portion: "DP-5: Outcomes of Democracy | Map Work: Software Techno Parks, Cotton Textiles", fat_subject: "FAT #19: Mathematics FAT-4", fat_portion: "Maths FAT-4 (20M | 30m): Funwork 7 & 8 — Areas Related to Circles, AP, Quadratic Equations, Triangles" },
  { date: "2026-11-24", day: "Tuesday", test1_subject: "English (Session 9)", test1_portion: "Reading Passages | Grammar: Q. No. I-XII | Writing: Analytical Paragraph - Report | Literature: Sermon at Benares, Custard the Dragon, Bholi", test2_subject: "Tamil (Session 9)", test2_portion: "காட்சியைக் கண்டு கவினுற எழுதுக (2x3=6) | நிரப்புக - இயல் 3 (6x1=6) | பத்தி வினா (5x1=5) | கடிதம்/விண்ணப்பம் (1x8=8)", fat_subject: "Funwork: Tamil FW-8 & Maths FW-9", fat_portion: "Tamil FW-8: கடிதம் / விண்ணப்பம் | Maths FW-9: Applications of Trigonometry & Statistics" },
  { date: "2026-11-25", day: "Wednesday", test1_subject: "Mathematics (Session 12)", test1_portion: "Some Applications of Trigonometry", test2_subject: "Social Science (Session 12)", test2_portion: "Geo-5: Minerals And Energy Resources | Map Work: Iron Ore Mines, Coal Mines & Oil Fields", fat_subject: "Funwork: Social Day-9", fat_portion: "Social FW Sheets 26-29: Eco-2, DP-4, His-3 (1.1-1.3) & Maps" },
  { date: "2026-11-26", day: "Thursday", test1_subject: "English (Session 10)", test1_portion: "Reading Passages | Grammar: Q. No. I-XII | Writing: Analytical Paragraph - Line Graph, Map | Literature: The Proposal, For Anne Gregory, Book that Saved the Earth", test2_subject: "Information Technology (Session 3)", test2_portion: "IT Session 3 Revision (Part A & Part B Units)", fat_subject: "FAT #20: English FAT-4", fat_portion: "English FAT-4 (20M | 30m): Based on Funworks 7 & 8 (Sessions 7–10 Syllabus)" },
  { date: "2026-11-27", day: "Friday", test1_subject: "Mathematics (Session 13)", test1_portion: "Statistics + Probability", test2_subject: "Social Science (Session 13)", test2_portion: "Eco-2: Sectors of the Indian Economy | Map Work: Major Ports, International Airports", fat_subject: "FAT #21: Mathematics FAT-5", fat_portion: "Maths FAT-5 (20M | 30m): Funwork 9 & 10 — Applications of Trigonometry, Statistics & Probability" },
  { date: "2026-11-28", day: "Saturday", test1_subject: "Tamil (Session 10)", test1_portion: "பொதுக்கட்டுரை (1x6=6) | கடிதம்/விண்ணப்பம் (1x8=8) | நிரப்புக - இயல் 5 (11x1=11)", test2_subject: "Social Science (Session 14)", test2_portion: "DP-4: Political Parties | His-3: The Making of a Global World (1.1-1.3) | Map Work: Cumulative", fat_subject: "FAT #22 & #23: Tamil FAT-4 & Social FAT-5", fat_portion: "Tamil FAT-4: FW 7 & 8 — இலக்கணம் & கடிதம் | Social FAT-5: Day 9 & 10 Cumulative" },
  { date: "2026-11-29", day: "Sunday", test1_subject: "Sunday Self-Study Buffer", test1_portion: "Full Syllabus Consolidation & Pending Funwork Completion", test2_subject: null, test2_portion: null, fat_subject: "Buffer Revision", fat_portion: "Review all 25 FAT Question Papers" },
  { date: "2026-11-30", day: "Monday", test1_subject: "Life Skills Motivation", test1_portion: "1 Day for Life Skills Motivation Session", test2_subject: null, test2_portion: null, fat_subject: "Mindset & Board Exam Strategy", fat_portion: "Organize Notes for Dec 1–3 Rectification" },
  { date: "2026-12-01", day: "Tuesday", test1_subject: "Review & Mistake Rectification (Day 1)", test1_portion: "Mathematics & Science Rectification", test2_subject: "Review & Rectification (Evening)", test2_portion: "Revise weak numericals & concepts", fat_subject: "Mistake Rectification Focus", fat_portion: "Re-solve incorrect questions from Session Exams 1–30" },
  { date: "2026-12-02", day: "Wednesday", test1_subject: "Review & Mistake Rectification (Day 2)", test1_portion: "Social Science & Languages Rectification", test2_subject: "Review & Rectification (Evening)", test2_portion: "Complete Map Work & Grammar Rectification", fat_subject: "Mistake Rectification Focus", fat_portion: "Re-solve incorrect questions from Session Exams 31–66" },
  { date: "2026-12-03", day: "Thursday", test1_subject: "Review & Mistake Rectification (Day 3)", test1_portion: "Final 100% Syllabus Rapid Revision", test2_subject: "Review & Rectification (Evening)", test2_portion: "Pre-Final Readiness Check", fat_subject: "Final FAT & Formula Review", fat_portion: "All 25 FAT Papers Rapid Recap" },
  { date: "2026-12-04", day: "Friday", test1_subject: "Pre-Final Prep: Social Science", test1_portion: "Full Day Preparation for Pre-Final First Exam (Social Science)", test2_subject: null, test2_portion: null, fat_subject: "Map & Timeline Marathon", fat_portion: "Revise all 29 Social Funwork & Map Worksheets" },
  { date: "2026-12-05", day: "Saturday", test1_subject: "Pre-Final Exam: Social Science", test1_portion: "Full Syllabus (100%) | Exam Time: 10:15 A.M to 01:30 P.M", test2_subject: "Prep for English", test2_portion: "Literature & Writing Formats Revision", fat_subject: "Board Exam Simulation", fat_portion: "Social Science 80M Board Paper" },
  { date: "2026-12-06", day: "Sunday", test1_subject: "Pre-Final Prep: English", test1_portion: "Full Day Preparation for Pre-Final English Exam", test2_subject: null, test2_portion: null, fat_subject: "Grammar & Writing Marathon", fat_portion: "Letters, Analytical Paragraphs, All Poems & Prose" },
  { date: "2026-12-07", day: "Monday", test1_subject: "Pre-Final Exam: English", test1_portion: "Full Syllabus (100%) | Exam Time: 10:15 A.M to 01:30 P.M", test2_subject: "Prep for Science", test2_portion: "Physics Numericals & Ray Diagrams", fat_subject: "Board Exam Simulation", fat_portion: "English 80M Board Paper" },
  { date: "2026-12-08", day: "Tuesday", test1_subject: "Pre-Final Prep: Science", test1_portion: "Full Day Preparation for Pre-Final Science (Physics, Chemistry, Biology)", test2_subject: null, test2_portion: null, fat_subject: "Equations & Diagrams Review", fat_portion: "All Chemical Equations, Bio Diagrams & Physics Formulas" },
  { date: "2026-12-09", day: "Wednesday", test1_subject: "Pre-Final Exam: Science", test1_portion: "Full Syllabus (100%) | Exam Time: 10:15 A.M to 01:30 P.M", test2_subject: "Prep for Second Language (Tamil)", test2_portion: "இயல் 1–7 உரைநடை & செய்யுள்", fat_subject: "Board Exam Simulation", fat_portion: "Science 80M Board Paper" },
  { date: "2026-12-10", day: "Thursday", test1_subject: "Pre-Final Prep: Tamil", test1_portion: "Full Day Preparation for Pre-Final Second Language (Tamil) Exam", test2_subject: null, test2_portion: null, fat_subject: "இலக்கணம் & கட்டுரை Review", fat_portion: "All 8 Tamil Funwork Topics & Letters" },
  { date: "2026-12-11", day: "Friday", test1_subject: "Pre-Final Exam: Tamil (SL)", test1_portion: "Full Syllabus (100%) | Exam Time: 10:15 A.M to 01:30 P.M", test2_subject: "Prep for Information Technology", test2_portion: "Part A Employability Skills & Part B Subject Skills", fat_subject: "Board Exam Simulation", fat_portion: "Tamil 80M Board Paper" },
  { date: "2026-12-12", day: "Saturday", test1_subject: "Pre-Final Exam: Information Technology", test1_portion: "Full Syllabus (100%) | Exam Time: 10:15 A.M to 12:30 P.M", test2_subject: "Prep for Mathematics", test2_portion: "Trigonometry, Triangles & Surface Areas", fat_subject: "Board Exam Simulation", fat_portion: "IT 50M Board Paper" },
  { date: "2026-12-13", day: "Sunday", test1_subject: "Pre-Final Prep: Mathematics", test1_portion: "Full Day Preparation for Pre-Final Mathematics Exam", test2_subject: null, test2_portion: null, fat_subject: "Formula & Theorem Marathon", fat_portion: "All 13 Maths Sessions & 10 Funwork Sheets" },
  { date: "2026-12-14", day: "Monday", test1_subject: "Pre-Final Exam: Mathematics", test1_portion: "Full Syllabus (100%) | Exam Time: 12:45 P.M to 04:00 P.M", test2_subject: "Answer Script Distribution", test2_portion: "Distribution of Answer Scripts with Analysis & Remedial", fat_subject: "Board Exam Simulation", fat_portion: "Mathematics 80M Board Paper" },
  { date: "2026-12-15", day: "Tuesday", test1_subject: "Answer Script Analysis & Remedial", test1_portion: "Complete Analysis and Remedial Session", test2_subject: null, test2_portion: null, fat_subject: "PHASE Complete", fat_portion: "Review Pre-Final Performance" }
];

export const OPTIMISTIC_QUOTES = [
  "Consistency beats intensity. One focused session at a time.",
  "Every solved problem today is an easy question on February 16.",
  "Protect your energy, master your syllabus, own your board exams.",
  "Quiet effort, compounding progress. You've got this.",
  "Focus on the process; the board results will take care of themselves."
];

