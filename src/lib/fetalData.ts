/**
 * Clinically accurate fetal development data.
 * Sources: WHO Fetal Growth Charts, ACOG guidelines, BabyCenter Medical Advisory Board.
 */

export interface FetalWeekData {
  week: number;
  lengthCm: number;
  weightGrams: number;
  weightDisplay: string;
  stage: string;
  trimester: 1 | 2 | 3;
  /** 4 key developmental milestones this week */
  milestones: string[];
  /** Brain / neurological development */
  brainDevelopment: string;
  /** Movement status */
  movement: string;
  /** Hearing status */
  hearing: string;
  /** Lung development */
  lungs: string;
  /** Educational insight for the mother */
  insight: string;
  /** Which SVG file to use (mapped to trimester bands) */
  svgKey: 'w08' | 'w12' | 'w20' | 'w28' | 'w36' | 'w40';
}

const DATA: FetalWeekData[] = [
  {
    week: 4, lengthCm: 0.2, weightGrams: 0, weightDisplay: '< 1 g',
    stage: 'Implantation', trimester: 1,
    milestones: ['Embryo implants in uterine wall', 'Placenta begins forming', 'Neural tube starts developing', 'Heart cells forming'],
    brainDevelopment: 'Neural tube forming', movement: 'None detectable', hearing: 'Not yet developed', lungs: 'Not yet formed',
    insight: 'The embryo is smaller than a grain of rice, but already the foundation for all major organs is being laid. Start folic acid immediately.',
    svgKey: 'w08',
  },
  {
    week: 6, lengthCm: 0.6, weightGrams: 0, weightDisplay: '< 1 g',
    stage: 'Embryonic Period', trimester: 1,
    milestones: ['Heart begins beating (~100 bpm)', 'Brain forming rapidly', 'Arm and leg buds appear', 'Facial features starting'],
    brainDevelopment: 'Brain and spinal cord forming', movement: 'None felt yet', hearing: 'Not yet developed', lungs: 'Lung buds forming',
    insight: 'Your baby\'s heart is beating for the first time. The embryo is about the size of a lentil, and the heartbeat can sometimes be seen on ultrasound.',
    svgKey: 'w08',
  },
  {
    week: 8, lengthCm: 1.6, weightGrams: 1, weightDisplay: '~1 g',
    stage: 'Organogenesis', trimester: 1,
    milestones: ['All major organs forming', 'Fingers and toes developing', 'Eyes forming with pigment', 'Heartbeat clearly detectable'],
    brainDevelopment: 'Brain growing rapidly', movement: 'Tiny reflex movements', hearing: 'Not yet', lungs: 'Lung buds present',
    insight: 'All major organs are now forming. The embryo has graduated to "fetus" status. Morning sickness peaks around this time — small, frequent meals help.',
    svgKey: 'w08',
  },
  {
    week: 10, lengthCm: 3.1, weightGrams: 4, weightDisplay: '~4 g',
    stage: 'Fetal Period Begins', trimester: 1,
    milestones: ['Vital organs functional', 'Fingernails forming', 'Tooth buds appearing', 'Baby can swallow'],
    brainDevelopment: 'Brain divides into sections', movement: 'Spontaneous, not felt', hearing: 'Ear structure forming', lungs: 'Airways branching',
    insight: 'Your baby can now make small swallowing movements. The critical period of organ development is nearly complete, which is why avoiding toxins now is so important.',
    svgKey: 'w08',
  },
  {
    week: 12, lengthCm: 5.4, weightGrams: 14, weightDisplay: '~14 g',
    stage: 'End of First Trimester', trimester: 1,
    milestones: ['Risk of miscarriage drops significantly', 'Reflexes developing', 'Kidneys producing urine', 'Placenta fully formed'],
    brainDevelopment: 'Cerebral cortex forming', movement: 'Active but unfelt', hearing: 'Inner ear developing', lungs: 'Beginning to practice breathing',
    insight: 'You have reached the end of the first trimester — the highest-risk period is now behind you. The placenta is now fully functioning as your baby\'s lifeline.',
    svgKey: 'w12',
  },
  {
    week: 14, lengthCm: 8.7, weightGrams: 43, weightDisplay: '~43 g',
    stage: 'Second Trimester', trimester: 2,
    milestones: ['Facial muscles developing', 'Baby can grimace', 'Lanugo (fine hair) appearing', 'Gender identifiable on ultrasound'],
    brainDevelopment: 'Brain impulses firing', movement: 'Somersaulting in amniotic fluid', hearing: 'Sounds transmitted', lungs: 'Breathing fluid',
    insight: 'Many women feel energy returning as morning sickness subsides. Your baby can now make facial expressions and is very active, though you may not feel it yet.',
    svgKey: 'w12',
  },
  {
    week: 16, lengthCm: 11.6, weightGrams: 100, weightDisplay: '~100 g',
    stage: 'Second Trimester', trimester: 2,
    milestones: ['Eyes can move side to side', 'Hearing developing rapidly', 'Skeleton hardening (ossification)', 'Heartbeat audible by Doppler'],
    brainDevelopment: 'Nerve connections multiplying', movement: 'Quickening may begin', hearing: 'Can hear low-frequency sounds', lungs: 'Surfactant production starting',
    insight: 'You may begin to feel the first fluttering movements called "quickening" — often described as bubbles or butterflies. Talk and sing to your baby; they can hear you.',
    svgKey: 'w12',
  },
  {
    week: 18, lengthCm: 14.2, weightGrams: 190, weightDisplay: '~190 g',
    stage: 'Second Trimester', trimester: 2,
    milestones: ['Unique fingerprints forming', 'Myelin forming around nerves', 'Intestines developing', 'Fallopian tubes / testes in position'],
    brainDevelopment: 'Myelination beginning', movement: 'Noticeable kicks and rolls', hearing: 'Responds to mother\'s voice', lungs: 'Air sacs forming',
    insight: 'Your baby now has unique fingerprints — no other human has the same pattern. Nutrient intake is critical as rapid growth continues. Iron-rich foods are essential.',
    svgKey: 'w20',
  },
  {
    week: 20, lengthCm: 25.0, weightGrams: 300, weightDisplay: '~300 g',
    stage: 'Halfway Point', trimester: 2,
    milestones: ['Anomaly scan recommended', 'Vernix caseosa coating forming', 'Sleep-wake cycles established', 'Baby swallowing amniotic fluid'],
    brainDevelopment: 'Brain growing rapidly', movement: 'Strong kicks felt', hearing: 'Responds to external sounds', lungs: 'Practicing breathing movements',
    insight: 'You are halfway through your pregnancy. The anomaly scan at this stage is the most important ultrasound — it checks baby\'s brain, spine, heart, and organs.',
    svgKey: 'w20',
  },
  {
    week: 22, lengthCm: 27.8, weightGrams: 430, weightDisplay: '~430 g',
    stage: 'Second Trimester', trimester: 2,
    milestones: ['Eyes fully formed (lids still fused)', 'Grip reflex developing', 'Lips and eyebrows visible', 'Inner ear balance developing'],
    brainDevelopment: 'Sensory areas developing', movement: 'Regular movement patterns', hearing: 'Can hear music and voices', lungs: 'Surfactant increasing',
    insight: 'Your baby can feel touch through the amniotic fluid. Playing music and talking frequently can stimulate brain development at this critical stage.',
    svgKey: 'w20',
  },
  {
    week: 24, lengthCm: 30.0, weightGrams: 600, weightDisplay: '~600 g',
    stage: 'Viability Threshold', trimester: 2,
    milestones: ['Viable outside womb with intensive care', 'Taste buds forming on tongue', 'Brain wave activity detectable', 'Rapid weight gain begins'],
    brainDevelopment: 'Active brain wave patterns', movement: 'Strong, regular patterns', hearing: 'Startle response to loud sounds', lungs: 'Surfactant production active',
    insight: 'A critical milestone — your baby has reached the threshold of viability. If born now with intensive care, survival is possible. Screening for gestational diabetes is due this week.',
    svgKey: 'w28',
  },
  {
    week: 26, lengthCm: 35.6, weightGrams: 760, weightDisplay: '~760 g',
    stage: 'Third Trimester Approaching', trimester: 2,
    milestones: ['Eyes begin to open', 'Eyelashes present', 'Spine strengthening', 'Immune system developing'],
    brainDevelopment: 'Visual cortex developing', movement: 'Responds to light', hearing: 'Recognises mother\'s heartbeat', lungs: 'Lung branching complete',
    insight: 'Your baby can now open their eyes and respond to light. The brain is maturing rapidly. Ensure adequate calcium and vitamin D intake for bone development.',
    svgKey: 'w28',
  },
  {
    week: 28, lengthCm: 37.6, weightGrams: 1100, weightDisplay: '1.1 kg',
    stage: 'Third Trimester', trimester: 3,
    milestones: ['Eyes can blink', 'Hearing is improving rapidly', 'Brain growth accelerating', 'Sleep cycles developing'],
    brainDevelopment: 'Active — rapid growth phase', movement: 'Strong, count 10 in 2 hrs', hearing: 'Developing well', lungs: 'In progress',
    insight: 'Third trimester begins — the most critical monitoring period. Count fetal movements daily: you should feel at least 10 movements in 2 hours. Report any reduction immediately.',
    svgKey: 'w28',
  },
  {
    week: 30, lengthCm: 39.9, weightGrams: 1300, weightDisplay: '1.3 kg',
    stage: 'Third Trimester', trimester: 3,
    milestones: ['Brain developing grooves and ridges', 'Red blood cells produced by bone marrow', 'Body fat accumulating rapidly', 'Toenails fully formed'],
    brainDevelopment: 'Cortex folding forming', movement: 'Very active, strong kicks', hearing: 'Nearly complete', lungs: 'Maturing rapidly',
    insight: 'Your baby is now gaining about 200g per week. The wrinkled skin is beginning to smooth as fat deposits build up. Sleep on your left side to optimize blood flow.',
    svgKey: 'w28',
  },
  {
    week: 32, lengthCm: 42.4, weightGrams: 1700, weightDisplay: '1.7 kg',
    stage: 'Third Trimester', trimester: 3,
    milestones: ['Rapid brain development phase', 'Most babies turn head-down', 'Practice breathing movements', 'Immune antibodies transferring'],
    brainDevelopment: 'Rapid neural growth', movement: 'Strong but space reducing', hearing: 'Fully developed', lungs: 'Nearly mature',
    insight: 'Your baby is receiving maternal antibodies that will protect them for the first months after birth. Brain development is now in the fastest phase of the entire pregnancy.',
    svgKey: 'w36',
  },
  {
    week: 34, lengthCm: 45.0, weightGrams: 2100, weightDisplay: '2.1 kg',
    stage: 'Third Trimester', trimester: 3,
    milestones: ['Fingernails reach fingertips', 'Lanugo hair mostly shed', 'Fat deposits 8% of body weight', 'Central nervous system maturing'],
    brainDevelopment: 'Cortex active', movement: 'Rhythmic patterns', hearing: 'Complete', lungs: 'Surfactant levels adequate',
    insight: 'If born now, most babies do well with minimal medical support. Prepare your hospital bag and review the signs of labour with your ASHA worker.',
    svgKey: 'w36',
  },
  {
    week: 36, lengthCm: 47.4, weightGrams: 2600, weightDisplay: '2.6 kg',
    stage: 'Late Third Trimester', trimester: 3,
    milestones: ['Nearly full-term', 'Skull bones flexible for delivery', 'Immune system strengthening', 'Digestive system ready'],
    brainDevelopment: 'Mature and active', movement: 'Regular patterns felt', hearing: 'Complete', lungs: 'Mature for breathing',
    insight: 'Your baby is almost fully developed. Weekly antenatal visits are now essential. Discuss your birth plan with your doctor. Watch for signs of labour — contractions, water breaking.',
    svgKey: 'w36',
  },
  {
    week: 38, lengthCm: 49.8, weightGrams: 3000, weightDisplay: '3.0 kg',
    stage: 'Full Term', trimester: 3,
    milestones: ['Fully formed and ready for birth', 'Lungs fully mature', 'Brain still developing (continues after birth)', 'Head engaged in pelvis'],
    brainDevelopment: 'Fully functional', movement: 'Less space, but still active', hearing: 'Complete', lungs: 'Fully mature',
    insight: 'Your baby is full-term and ready for birth. Labour can begin any day now. Go to hospital immediately if you experience contractions every 5 minutes, water breaking, or reduced movement.',
    svgKey: 'w40',
  },
  {
    week: 40, lengthCm: 51.2, weightGrams: 3400, weightDisplay: '3.4 kg',
    stage: 'Due Date', trimester: 3,
    milestones: ['Complete development', 'Ready for independent life', 'All organs functional', 'Immune system active'],
    brainDevelopment: 'Fully mature', movement: 'Active, count regularly', hearing: 'Complete', lungs: 'Complete',
    insight: 'Your due date has arrived. If labour has not started, your doctor may discuss induction. Breastfeed within 1 hour of birth — colostrum provides crucial immunity.',
    svgKey: 'w40',
  },
];

/** Get the closest week data (rounds down to nearest available entry) */
export function getFetalData(week: number): FetalWeekData {
  // clamp
  const w = Math.max(4, Math.min(40, week));
  // find exact or closest lower
  let best = DATA[0];
  for (const d of DATA) {
    if (d.week <= w) best = d;
    else break;
  }
  return best;
}

/** SVG import map — trimester-keyed */
export const FETAL_SVGS: Record<string, string> = {
  w08: new URL('../assets/fetal-development/week-08.svg', import.meta.url).href,
  w12: new URL('../assets/fetal-development/week-12.svg', import.meta.url).href,
  w20: new URL('../assets/fetal-development/week-20.svg', import.meta.url).href,
  w28: new URL('../assets/fetal-development/week-28.svg', import.meta.url).href,
  w36: new URL('../assets/fetal-development/week-36.svg', import.meta.url).href,
  w40: new URL('../assets/fetal-development/week-40.svg', import.meta.url).href,
};

// ─── Multilingual fetal data translations ────────────────────────────────────
// Keyed by language code → week → field

type FetalLangData = {
  stage: string;
  brain: string;
  hearing: string;
  lungs: string;
  movement: string;
  milestones: string[];
};

const FETAL_TRANSLATIONS: Record<string, Partial<Record<number, FetalLangData>>> = {
  hi: {
    4:  { stage: 'आरोपण', brain: 'तंत्रिका नली बन रही है', hearing: 'अभी विकसित नहीं', lungs: 'अभी नहीं बने', movement: 'कोई नहीं', milestones: ['भ्रूण गर्भाशय की दीवार में प्रत्यारोपित', 'प्लेसेंटा बनना शुरू', 'तंत्रिका नली विकसित', 'हृदय कोशिकाएं बन रही हैं'] },
    6:  { stage: 'भ्रूण काल', brain: 'मस्तिष्क और रीढ़ बन रहे हैं', hearing: 'अभी विकसित नहीं', lungs: 'फेफड़ों की कलियां बन रही हैं', movement: 'अभी महसूस नहीं', milestones: ['दिल धड़कना शुरू', 'मस्तिष्क तेजी से बन रहा है', 'हाथ-पैर की कलियां दिखीं', 'चेहरे की विशेषताएं शुरू'] },
    8:  { stage: 'अंग निर्माण', brain: 'मस्तिष्क तेजी से बढ़ रहा है', hearing: 'अभी नहीं', lungs: 'फेफड़ों की कलियां हैं', movement: 'छोटी प्रतिवर्त हलचलें', milestones: ['सभी प्रमुख अंग बन रहे हैं', 'उंगलियां-पैर की उंगलियां', 'आंखें बन रही हैं', 'दिल की धड़कन स्पष्ट'] },
    10: { stage: 'भ्रूण काल शुरू', brain: 'मस्तिष्क के भाग बन रहे हैं', hearing: 'कान की संरचना बन रही है', lungs: 'वायुमार्ग शाखाएं', movement: 'अपने आप, महसूस नहीं', milestones: ['महत्वपूर्ण अंग काम कर रहे हैं', 'नाखून बन रहे हैं', 'दांतों की कलियां', 'शिशु निगल सकता है'] },
    12: { stage: 'पहली तिमाही का अंत', brain: 'सेरेब्रल कॉर्टेक्स बन रहा है', hearing: 'आंतरिक कान विकसित', lungs: 'सांस लेने का अभ्यास शुरू', movement: 'सक्रिय पर महसूस नहीं', milestones: ['गर्भपात का जोखिम कम', 'प्रतिवर्त विकसित', 'गुर्दे मूत्र बना रहे हैं', 'प्लेसेंटा पूरी तरह बना'] },
    14: { stage: 'दूसरी तिमाही', brain: 'मस्तिष्क के आवेग सक्रिय', hearing: 'ध्वनि प्रेषित', lungs: 'तरल पदार्थ में सांस', movement: 'एमनियोटिक द्रव में हलचल', milestones: ['चेहरे की मांसपेशियां बन रही हैं', 'शिशु मुस्कुरा सकता है', 'लैनुगो बाल दिख रहे हैं', 'लिंग पहचाना जा सकता है'] },
    16: { stage: 'दूसरी तिमाही', brain: 'तंत्रिका संबंध बढ़ रहे हैं', hearing: 'कम आवृत्ति सुन सकता है', lungs: 'सर्फेक्टेंट उत्पादन शुरू', movement: 'हलचल शुरू हो सकती है', milestones: ['आंखें इधर-उधर हिल सकती हैं', 'सुनने की क्षमता तेजी से विकसित', 'हड्डियां सख्त हो रही हैं', 'डॉप्लर पर दिल की धड़कन'] },
    18: { stage: 'दूसरी तिमाही', brain: 'माइलिनेशन शुरू', hearing: 'माँ की आवाज पहचानता है', lungs: 'वायु थैलियां बन रही हैं', movement: 'किक और लुढ़कना महसूस', milestones: ['अद्वितीय उंगलियों के निशान', 'नसों के आसपास माइलिन', 'आंतें विकसित', 'प्रजनन अंग स्थिति में'] },
    20: { stage: 'आधा पड़ाव', brain: 'मस्तिष्क तेजी से बढ़ रहा है', hearing: 'बाहरी आवाजों पर प्रतिक्रिया', lungs: 'सांस लेने की हलचल', movement: 'तेज किक महसूस', milestones: ['विसंगति स्कैन जरूरी', 'वर्निक्स केसेओसा बन रहा है', 'नींद-जागने का चक्र', 'शिशु एमनियोटिक द्रव पी रहा है'] },
    22: { stage: 'दूसरी तिमाही', brain: 'संवेदी क्षेत्र विकसित', hearing: 'संगीत और आवाजें सुन सकता है', lungs: 'सर्फेक्टेंट बढ़ रहा है', movement: 'नियमित हलचल पैटर्न', milestones: ['आंखें पूरी बनी (पलकें बंद)', 'पकड़ने की प्रतिवर्त', 'होंठ और भौंहें दिखती हैं', 'आंतरिक कान संतुलन'] },
    24: { stage: 'व्यवहार्यता सीमा', brain: 'सक्रिय मस्तिष्क तरंग', hearing: 'तेज आवाज पर चौंकता है', lungs: 'सर्फेक्टेंट उत्पादन सक्रिय', movement: 'मजबूत नियमित पैटर्न', milestones: ['बाहर जीवित रह सकता है', 'जीभ पर स्वाद कलियां', 'मस्तिष्क तरंग गतिविधि', 'तेजी से वजन बढ़ना'] },
    26: { stage: 'तीसरी तिमाही आ रही है', brain: 'दृश्य कॉर्टेक्स विकसित', hearing: 'माँ की दिल की धड़कन पहचानता है', lungs: 'फेफड़ों की शाखाएं पूरी', movement: 'प्रकाश पर प्रतिक्रिया', milestones: ['आंखें खुलने लगी हैं', 'पलकें मौजूद', 'रीढ़ मजबूत हो रही है', 'प्रतिरक्षा प्रणाली विकसित'] },
    28: { stage: 'तीसरी तिमाही', brain: 'सक्रिय — तेजी से बढ़ रहा है', hearing: 'अच्छी तरह विकसित', lungs: 'प्रगति में', movement: 'मजबूत, 2 घंटे में 10 गिनें', milestones: ['आंखें झपका सकती हैं', 'सुनने की क्षमता बढ़ रही है', 'मस्तिष्क तेजी से बढ़ रहा है', 'नींद के चक्र विकसित'] },
    30: { stage: 'तीसरी तिमाही', brain: 'कॉर्टेक्स मोड़ बन रहे हैं', hearing: 'लगभग पूरा', lungs: 'तेजी से परिपक्व', movement: 'बहुत सक्रिय, मजबूत किक', milestones: ['मस्तिष्क में खांचे बन रहे हैं', 'अस्थि मज्जा RBC बना रही है', 'शरीर में वसा जमा', 'पैर के नाखून पूरे'] },
    32: { stage: 'तीसरी तिमाही', brain: 'तेजी से तंत्रिका विकास', hearing: 'पूरी तरह विकसित', lungs: 'लगभग परिपक्व', movement: 'मजबूत पर जगह कम', milestones: ['तेजी से मस्तिष्क विकास', 'अधिकतर शिशु सिर नीचे', 'सांस लेने की हलचल', 'प्रतिरक्षा एंटीबॉडी'] },
    34: { stage: 'तीसरी तिमाही', brain: 'कॉर्टेक्स सक्रिय', hearing: 'पूरा', lungs: 'सर्फेक्टेंट पर्याप्त', movement: 'लयबद्ध पैटर्न', milestones: ['नाखून उंगलियों तक', 'लैनुगो बाल झड़ रहे हैं', 'वसा 8%', 'केंद्रीय तंत्रिका तंत्र परिपक्व'] },
    36: { stage: 'देर से तीसरी तिमाही', brain: 'परिपक्व और सक्रिय', hearing: 'पूरा', lungs: 'सांस के लिए परिपक्व', movement: 'नियमित पैटर्न', milestones: ['लगभग पूर्ण अवधि', 'खोपड़ी की हड्डियां लचीली', 'प्रतिरक्षा प्रणाली मजबूत', 'पाचन तंत्र तैयार'] },
    38: { stage: 'पूर्ण अवधि', brain: 'पूरी तरह काम कर रहा है', hearing: 'पूरा', lungs: 'पूरी तरह परिपक्व', movement: 'कम जगह, पर सक्रिय', milestones: ['पूरी तरह बना, जन्म के लिए तैयार', 'फेफड़े परिपक्व', 'मस्तिष्क विकसित', 'सिर श्रोणि में'] },
    40: { stage: 'नियत तारीख', brain: 'पूरी तरह परिपक्व', hearing: 'पूरा', lungs: 'पूरा', movement: 'सक्रिय, नियमित गिनें', milestones: ['पूर्ण विकास', 'स्वतंत्र जीवन के लिए तैयार', 'सभी अंग काम कर रहे हैं', 'प्रतिरक्षा प्रणाली सक्रिय'] },
  },
  mr: {
    4:  { stage: 'रोपण', brain: 'तंत्रिका नलिका तयार होत आहे', hearing: 'अद्याप विकसित नाही', lungs: 'अद्याप तयार नाही', movement: 'काहीच नाही', milestones: ['भ्रूण गर्भाशयात रोपण', 'प्लेसेंटा तयार होणे', 'तंत्रिका नलिका विकास', 'हृदय पेशी तयार'] },
    14: { stage: 'दुसरी तिमाही', brain: 'मेंदूचे आवेग सक्रिय', hearing: 'ध्वनी प्रसारित', lungs: 'द्रव श्वसन', movement: 'एमनियोटिक द्रवात हालचाल', milestones: ['चेहऱ्याचे स्नायू', 'बाळ हसू शकते', 'लॅनुगो केस', 'लिंग ओळखता येते'] },
    16: { stage: 'दुसरी तिमाही', brain: 'तंत्रिका संबंध वाढत आहेत', hearing: 'कमी वारंवारता ऐकू येते', lungs: 'सर्फेक्टंट उत्पादन सुरू', movement: 'हालचाल सुरू होऊ शकते', milestones: ['डोळे हलू शकतात', 'श्रवण वेगाने विकसित', 'हाडे कठीण होत आहेत', 'डॉप्लरवर हृदयाचे ठोके'] },
    20: { stage: 'अर्धा मार्ग', brain: 'मेंदू वेगाने वाढत आहे', hearing: 'बाह्य आवाजांना प्रतिसाद', lungs: 'श्वसन हालचाल', movement: 'जोरदार किक', milestones: ['विसंगती स्कॅन आवश्यक', 'व्हर्निक्स थर', 'झोप-जागे चक्र', 'एमनियोटिक द्रव पिणे'] },
    28: { stage: 'तिसरी तिमाही', brain: 'सक्रिय — वेगवान वाढ', hearing: 'चांगले विकसित', lungs: 'प्रगतीत', movement: 'मजबूत, 2 तासात 10 मोजा', milestones: ['डोळे लुकलुकू शकतात', 'श्रवण सुधारत आहे', 'मेंदू वेगाने वाढत आहे', 'झोपेचे चक्र'] },
    36: { stage: 'उशीरा तिसरी तिमाही', brain: 'प्रौढ आणि सक्रिय', hearing: 'पूर्ण', lungs: 'श्वसनासाठी प्रौढ', movement: 'नियमित नमुने', milestones: ['जवळजवळ पूर्ण मुदत', 'कवटीची हाडे लवचिक', 'रोगप्रतिकार शक्ती मजबूत', 'पचन तंत्र तयार'] },
    40: { stage: 'नियत तारीख', brain: 'पूर्णपणे प्रौढ', hearing: 'पूर्ण', lungs: 'पूर्ण', movement: 'सक्रिय, नियमित मोजा', milestones: ['संपूर्ण विकास', 'स्वतंत्र जीवनासाठी तयार', 'सर्व अवयव कार्यरत', 'रोगप्रतिकार शक्ती सक्रिय'] },
  },
  te: {
    4:  { stage: 'అమరిక', brain: 'నాడీ నాళం ఏర్పడుతోంది', hearing: 'ఇంకా అభివృద్ధి కాలేదు', lungs: 'ఇంకా ఏర్పడలేదు', movement: 'ఏమీ లేదు', milestones: ['భ్రూణం గర్భాశయ గోడలో అమరిక', 'మావి ఏర్పడటం ప్రారంభం', 'నాడీ నాళం అభివృద్ధి', 'హృదయ కణాలు ఏర్పడుతున్నాయి'] },
    16: { stage: 'రెండవ త్రైమాసికం', brain: 'నాడీ కనెక్షన్లు పెరుగుతున్నాయి', hearing: 'తక్కువ పౌనఃపున్యం వినగలదు', lungs: 'సర్ఫాక్టెంట్ ఉత్పత్తి ప్రారంభం', movement: 'కదలిక ప్రారంభమవుతుంది', milestones: ['కళ్ళు పక్కకు కదలగలవు', 'వినికిడి వేగంగా అభివృద్ధి', 'అస్థిపంజరం గట్టిపడుతోంది', 'డాప్లర్‌లో గుండె చప్పుడు'] },
    20: { stage: 'సగం మార్గం', brain: 'మెదడు వేగంగా పెరుగుతోంది', hearing: 'బాహ్య శబ్దాలకు స్పందిస్తుంది', lungs: 'శ్వాసక్రియ కదలికలు', movement: 'బలమైన తన్నులు', milestones: ['క్రమరాహిత్యం స్కాన్ అవసరం', 'వెర్నిక్స్ పూత', 'నిద్ర-మెలకువ చక్రాలు', 'అమ్నియోటిక్ ద్రవం తాగుతోంది'] },
    28: { stage: 'మూడవ త్రైమాసికం', brain: 'చురుకుగా — వేగంగా అభివృద్ధి', hearing: 'బాగా అభివృద్ధైంది', lungs: 'పురోగతిలో', movement: 'బలమైన, 2 గంటల్లో 10 లెక్కించండి', milestones: ['కళ్ళు మూయగలవు', 'వినికిడి మెరుగవుతోంది', 'మెదడు వేగంగా పెరుగుతోంది', 'నిద్ర చక్రాలు అభివృద్ధి'] },
    40: { stage: 'ప్రసవ తేదీ', brain: 'పూర్తిగా పరిపక్వం', hearing: 'పూర్తి', lungs: 'పూర్తి', movement: 'చురుకు, క్రమంగా లెక్కించండి', milestones: ['పూర్తి అభివృద్ధి', 'స్వతంత్ర జీవనానికి సిద్ధం', 'అన్ని అవయవాలు క్రియాత్మకం', 'రోగనిరోధక వ్యవస్థ సక్రియం'] },
  },
  ta: {
    4:  { stage: 'பொருத்துதல்', brain: 'நரம்பு குழாய் உருவாகிறது', hearing: 'இன்னும் வளரவில்லை', lungs: 'இன்னும் உருவாகவில்லை', movement: 'எதுவும் இல்லை', milestones: ['கரு கர்ப்பப்பை சுவரில் பொருத்தல்', 'நஞ்சுக்கொடி உருவாக தொடங்குகிறது', 'நரம்பு குழாய் வளர்ச்சி', 'இதய செல்கள் உருவாகின்றன'] },
    16: { stage: 'இரண்டாவது மூன்று மாத காலம்', brain: 'நரம்பு இணைப்புகள் பெருகுகின்றன', hearing: 'குறைந்த அதிர்வெண் கேட்கலாம்', lungs: 'சர்பாக்டன்ட் உற்பத்தி தொடங்குகிறது', movement: 'அசைவு தொடங்கலாம்', milestones: ['கண்கள் பக்கவாட்டில் நகரலாம்', 'கேட்கும் திறன் வேகமாக வளர்கிறது', 'எலும்புகள் கட்டியாகின்றன', 'டாப்ளரில் இதயத்துடிப்பு'] },
    20: { stage: 'பாதி வழி', brain: 'மூளை வேகமாக வளர்கிறது', hearing: 'வெளிப்புற ஒலிகளுக்கு பதில்', lungs: 'சுவாச அசைவுகள்', movement: 'வலுவான உதைகள்', milestones: ['அசாதாரண ஸ்கேன் பரிந்துரை', 'வெர்னிக்ஸ் பூச்சு', 'தூக்க-விழிப்பு சுழற்சிகள்', 'அம்னியோடிக் திரவம் குடிக்கிறது'] },
    28: { stage: 'மூன்றாவது மூன்று மாத காலம்', brain: 'சுறுசுறுப்பான — வேகமான வளர்ச்சி', hearing: 'நன்கு வளர்ந்துள்ளது', lungs: 'முன்னேற்றத்தில்', movement: 'வலுவான, 2 மணிக்கு 10 எண்ணுங்கள்', milestones: ['கண்கள் சிமிட்டலாம்', 'கேட்கும் திறன் மேம்படுகிறது', 'மூளை வேகமாக வளர்கிறது', 'தூக்க சுழற்சிகள்'] },
    40: { stage: 'பிரசவ தேதி', brain: 'முழுமையாக முதிர்ந்தது', hearing: 'முழுமை', lungs: 'முழுமை', movement: 'சுறுசுறுப்பு, தொடர்ந்து எண்ணுங்கள்', milestones: ['முழு வளர்ச்சி', 'சுதந்திர வாழ்க்கைக்கு தயார்', 'அனைத்து உறுப்புகளும் செயல்படுகின்றன', 'நோய் எதிர்ப்பு அமைப்பு சுறுசுறுப்பு'] },
  },
  bn: {
    4:  { stage: 'ইমপ্লান্টেশন', brain: 'নিউরাল টিউব তৈরি হচ্ছে', hearing: 'এখনো বিকশিত হয়নি', lungs: 'এখনো তৈরি হয়নি', movement: 'কিছু নেই', milestones: ['ভ্রূণ জরায়ু প্রাচীরে স্থাপিত', 'প্লাসেন্টা তৈরি শুরু', 'নিউরাল টিউব বিকাশ', 'হৃদয় কোষ তৈরি হচ্ছে'] },
    16: { stage: 'দ্বিতীয় ত্রৈমাসিক', brain: 'নার্ভ সংযোগ বাড়ছে', hearing: 'কম ফ্রিকোয়েন্সি শুনতে পারে', lungs: 'সার্ফ্যাক্ট্যান্ট উৎপাদন শুরু', movement: 'নড়াচড়া শুরু হতে পারে', milestones: ['চোখ পাশে নড়তে পারে', 'শ্রবণশক্তি দ্রুত বিকাশ', 'হাড় শক্ত হচ্ছে', 'ডপলারে হৃৎস্পন্দন'] },
    20: { stage: 'মাঝপথ', brain: 'মস্তিষ্ক দ্রুত বাড়ছে', hearing: 'বাহ্যিক শব্দে সাড়া দেয়', lungs: 'শ্বাস-প্রশ্বাসের নড়াচড়া', movement: 'শক্তিশালী লাথি', milestones: ['অ্যানোমালি স্ক্যান প্রয়োজন', 'ভার্নিক্স আবরণ', 'ঘুম-জাগা চক্র', 'অ্যামনিওটিক তরল পান করছে'] },
    28: { stage: 'তৃতীয় ত্রৈমাসিক', brain: 'সক্রিয় — দ্রুত বৃদ্ধি', hearing: 'ভালোভাবে বিকশিত', lungs: 'অগ্রগতিতে', movement: 'শক্তিশালী, ২ ঘণ্টায় ১০টি গুনুন', milestones: ['চোখ পলক ফেলতে পারে', 'শ্রবণশক্তি উন্নত হচ্ছে', 'মস্তিষ্ক দ্রুত বাড়ছে', 'ঘুমের চক্র বিকাশ'] },
    40: { stage: 'প্রসবের তারিখ', brain: 'সম্পূর্ণ পরিপক্ব', hearing: 'সম্পূর্ণ', lungs: 'সম্পূর্ণ', movement: 'সক্রিয়, নিয়মিত গুনুন', milestones: ['সম্পূর্ণ বিকাশ', 'স্বাধীন জীবনের জন্য প্রস্তুত', 'সমস্ত অঙ্গ কার্যকর', 'ইমিউন সিস্টেম সক্রিয়'] },
  },
};

/**
 * Get fetal data translated for a specific language.
 * Falls back to English data if no translation exists for that week/language.
 */
export function getTranslatedFetalFields(week: number, lang: string): FetalLangData | null {
  const langData = FETAL_TRANSLATIONS[lang];
  if (!langData) return null;

  // Find the closest week entry at or below the requested week
  const weeks = Object.keys(langData).map(Number).sort((a, b) => a - b);
  let best: number | null = null;
  for (const w of weeks) {
    if (w <= week) best = w;
    else break;
  }
  return best !== null ? langData[best] ?? null : null;
}
