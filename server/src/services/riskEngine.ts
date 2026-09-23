/**
 * riskEngine.ts
 * Symptom extraction + risk scoring for MaaRakshak.
 *
 * When Gemini is available it handles everything.
 * When Gemini is unavailable the local path:
 *   1. Extracts symptoms from raw text (English + Hindi + Hinglish).
 *   2. Scores each extracted symptom using explicit clinical weights.
 *   3. Returns an input-specific result — not a generic template.
 */

export interface RiskInput {
  symptoms: string[];          // pre-labeled chips (English) or raw text entries
  gestationalWeek: number;
  bloodPressure?: string;
  previousComplications?: string[];
  transcription?: string;      // raw free-text in any language
  pregnancyId?: string;
}

export interface ExtractedSymptom {
  label: string;               // English clinical label
  originalText: string;        // supporting text from the input
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  negated: boolean;            // true if "nahi", "nahin", "no", "not" near match
}

export interface RiskOutput {
  riskLevel: 'GREEN' | 'YELLOW' | 'RED';
  riskScore: number;
  riskFactors: string[];
  extractedSymptoms: ExtractedSymptom[];
  clinicalReasoning: string;
  suggestedAction: string;
  followUpRecommendation: string;
  analysisSource: 'gemini' | 'local';
}

// ─── Multilingual symptom dictionary ─────────────────────────────────────────
// Each entry: patterns (regex fragments) → clinical label + severity
// Patterns cover English, Hindi devanagari, and Hinglish transliterations.

interface SymptomPattern {
  label: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  patterns: RegExp[];
}

const SYMPTOM_PATTERNS: SymptomPattern[] = [
  // ── HIGH severity ──────────────────────────────────────────────────────────
  {
    label: 'Vaginal Bleeding',
    severity: 'HIGH',
    patterns: [
      /\bbleed(ing)?\b/i,
      /\bblood\b.*\b(vagina|private|niche|yoni)\b/i,
      /\b(yoni|private)\b.*\bblood\b/i,
      /\bkhoon\b/i, /\brakta\b/i, /\braktasrav\b/i,
      /\bkhun\b.*\b(aa|aa rha|ata)\b/i,
    ],
  },
  {
    label: 'Reduced Fetal Movement',
    severity: 'HIGH',
    patterns: [
      /\b(no|less|reduced|absent|decreased|stopped)\b.*\b(kick|movement|move|baby)\b/i,
      /\bbaby\b.*\b(not|less|no)\b.*\b(kick|move|moving)\b/i,
      /\bbache\b.*\b(hilna|movement|nahi|kam)\b/i,
      /\bhilna\b.*\bband\b/i,
      /\bhalchal\b.*\b(nahi|kam|band)\b/i,
      /\b(kam|nahi|nahin)\b.*\bhalchal\b/i,
      /\bmovement\b.*\b(kam|nahi|nahin|band|less)\b/i,
    ],
  },
  {
    label: 'Blurred Vision',
    severity: 'HIGH',
    patterns: [
      /\b(blurr?ed?|blurry|dim|hazy|double)\b.*\bvision\b/i,
      /\bvision\b.*\b(blurr?|dim|hazy)\b/i,
      /\b(aankhon|aankh)\b.*\b(dhundla|dhund|흐릿|흐릿하)\b/i,
      /\bdhundla\b.*\b(dikhna|dikh)\b/i,
      /\bdikhna\b.*\bband\b/i,
    ],
  },
  {
    label: 'Severe Abdominal Pain',
    severity: 'HIGH',
    patterns: [
      /\b(severe|acute|sharp|unbearable|extreme|intense)\b.*\b(abdominal|stomach|belly|tummy|uterus|pelvic)\b.*\bpain\b/i,
      /\b(pet|paet)\b.*\b(tez|bhayanak|bahut)\b.*\b(dard|pain|drd)\b/i,
      /\btez\b.*\b(dard|drd)\b.*\b(pet|paet)\b/i,
      /\bpelvic\b.*\b(pain|pressure|dard)\b/i,
      /\bcontraction\b/i,
    ],
  },
  {
    label: 'Preeclampsia Signs',
    severity: 'HIGH',
    patterns: [
      /\b(face|hand|feet|foot|leg)\b.*\bswell(ing|ed)?\b.*\bheadache\b/i,
      /\bheadache\b.*\bswell\b/i,
      /\b(preeclampsia|eclampsia)\b/i,
    ],
  },

  // ── MEDIUM severity ────────────────────────────────────────────────────────
  {
    label: 'Headache',
    severity: 'MEDIUM',
    patterns: [
      /\bheadache\b/i, /\bhead\b.*\bache\b/i, /\bhead\b.*\bpain\b/i, /\bhead\b.*\bhurt\b/i,
      /\bsirdard\b/i, /\bsir\b.*\b(dard|drd|ache|pain|dukhna|dukh)\b/i,
      /\b(sir|sar|head)\b.*\b(drd|dard|bhari|bhari ho|heavy)\b/i,
      /\bdrd\b.*\b(sir|sar)\b/i,
      /\bsir\s+me[in]*\s+(drd|dard)\b/i,
      /\b(sar|sir)\s+(dukh|dard|drd)\b/i,
    ],
  },
  {
    label: 'Fever',
    severity: 'MEDIUM',
    patterns: [
      /\bfever\b/i, /\bhigh\s+temp(erature)?\b/i, /\bpyrexia\b/i,
      /\bbukhar\b/i, /\bbukh[ae]r\b/i, /\bbuhar\b/i, /\bbhukar\b/i, /\bbhukhar\b/i,
      /\bbukhaar\b/i, /\bjwar\b/i, /\btap\b.*\b(badan|body)\b/i,
      /\bbadan\b.*\b(garam|gar[am]+|tap)\b/i,
      /\b(temperature|temp)\b.*\b(high|zyada|badh)\b/i,
    ],
  },
  {
    label: 'Swelling',
    severity: 'MEDIUM',
    patterns: [
      /\bswell(ing|ed)?\b/i, /\boedema\b/i, /\bedema\b/i, /\bpuffy\b/i,
      /\bsooj(na|na|han)?\b/i, /\bsoojan\b/i, /\bsujan\b/i, /\bfoot\b.*\bswollen\b/i,
      /\bpaaon\b.*\b(soojan|sooj|sooja)\b/i, /\bhath\b.*\b(sooja|soojan)\b/i,
    ],
  },
  {
    label: 'Dizziness',
    severity: 'MEDIUM',
    patterns: [
      /\bdizz(y|iness|ying)\b/i, /\blight.?headed\b/i, /\bfaint(ing|ed)?\b/i,
      /\bchakar\b/i, /\bchakkar\b/i, /\bghuma(o|na)?\b/i, /\bsar\b.*\bghoom\b/i,
      /\b(sir|sar|head)\b.*\b(ghoom|chakar)\b/i,
    ],
  },
  {
    label: 'High Blood Pressure',
    severity: 'MEDIUM',
    patterns: [
      /\bhigh\b.*\b(blood\s+pressure|bp)\b/i, /\bhypertension\b/i,
      /\b(bp|blood\s+pressure)\b.*\b(high|badh|zyada|elevated)\b/i,
      /\buchch\b.*\b(rakta\s+chap|bp)\b/i, /\bblood\s+pressure\b.*\bbadh\b/i,
    ],
  },
  {
    label: 'Vomiting / Nausea',
    severity: 'MEDIUM',
    patterns: [
      /\bvomit(ing|ed)?\b/i, /\bnausea\b/i, /\bthrow(ing)?\s+up\b/i, /\bmorning\s+sickness\b/i,
      /\bulti\b/i, /\bukrai\b/i, /\bji\b.*\b(machal|machal)\b/i, /\bmatli\b/i,
      /\bmatali\b/i, /\bukalna\b/i, /\bubki\b/i,
    ],
  },
  {
    label: 'Abdominal Pain',
    severity: 'MEDIUM',
    patterns: [
      /\b(stomach|abdominal|belly|tummy|abdomen)\b.*\b(pain|ache|hurt|cramp)\b/i,
      /\b(pain|ache)\b.*\b(stomach|abdomen|belly)\b/i,
      /\bpet\b.*\b(dard|drd|ache|pain|dukh)\b/i,
      /\b(drd|dard)\b.*\b(pet|paet)\b/i,
      /\bpet\s+me[in]*\s+(drd|dard)\b/i,
      /\b(paet|pet)\s+(dukh|dard|drd)\b/i,
    ],
  },

  // ── LOW severity ───────────────────────────────────────────────────────────
  {
    label: 'Fatigue',
    severity: 'LOW',
    patterns: [
      /\btired(ness)?\b/i, /\bfatigue\b/i, /\bweak(ness)?\b/i, /\bexhaust(ed|ion)?\b/i,
      /\bthakan\b/i, /\bthak(i|e|a|na)?\b/i, /\bkamzori\b/i, /\bkamzor\b/i,
      /\bbadan\b.*\b(dard|thaka|thakna)\b/i,
    ],
  },
  {
    label: 'Back Pain',
    severity: 'LOW',
    patterns: [
      /\bback\b.*\b(pain|ache|hurt)\b/i, /\b(pain|ache)\b.*\bback\b/i,
      /\bkamar\b.*\b(dard|drd|ache)\b/i, /\b(dard|drd)\b.*\bkamar\b/i,
    ],
  },
  {
    label: 'Shortness of Breath',
    severity: 'LOW',
    patterns: [
      /\b(short(ness)?|difficulty)\b.*\b(breath|breathing)\b/i, /\bbreath(less|ing)\b/i,
      /\bsans\b.*\b(nahi|nahi aa|takleef)\b/i, /\bsans\b.*\b(lena|mushkil)\b/i,
    ],
  },
  {
    label: 'No Symptoms',
    severity: 'LOW',
    patterns: [
      /\bno\s+symptoms?\b/i, /\bfine\b/i, /\ball\s+good\b/i, /\bnormal\b/i,
      /\b(koi|kuch)\b.*\b(problem|takleef|symptom)\b.*\b(nahi|nahin)\b/i,
      /\btheek\s+(hoon|hain|hai)\b/i, /\bsab\s+(theek|acha)\b/i,
    ],
  },
];

// Negation words that flip a match to negated=true
const NEGATION_PATTERNS = [
  /\b(no|not|don't|doesn't|didn't|without|none|nahi[n]?|nahin|na|nah|koi\s+nahi|abhi\s+nahi|ab\s+nahi|ab\s+nahin)\b/i,
];

// Resolved / past — symptoms already gone
const RESOLVED_PATTERNS = [
  /\b(tha|thi|the|kal|pehle|pahle|was|were|had|used\s+to|ho\s+gaya|theek\s+ho|better\s+now|ab\s+theek)\b/i,
];

/**
 * Extract structured symptoms from free text in any supported language.
 * Handles negation and resolved markers.
 */
export function extractSymptomsFromText(text: string): ExtractedSymptom[] {
  if (!text.trim()) return [];

  // Split on "and", "or", "aur", "ya", commas, semicolons to get clauses
  const clauses = text
    .split(/(?:\band\b|\bor\b|\baur\b|\bya\b|,|;)/i)
    .map(c => c.trim())
    .filter(Boolean);

  const found: ExtractedSymptom[] = [];
  const seenLabels = new Set<string>();

  const checkClause = (clause: string) => {
    const lower = clause.toLowerCase();

    // Check negation
    const negated = NEGATION_PATTERNS.some(p => p.test(lower));
    // Check if this is a resolved/past symptom
    const resolved = RESOLVED_PATTERNS.some(p => p.test(lower));

    for (const sp of SYMPTOM_PATTERNS) {
      if (sp.label === 'No Symptoms') continue; // handle separately
      if (sp.patterns.some(p => p.test(lower))) {
        if (!seenLabels.has(sp.label)) {
          seenLabels.add(sp.label);
          found.push({
            label: sp.label,
            originalText: clause.slice(0, 120),
            severity: sp.severity,
            negated: negated || resolved,
          });
        }
      }
    }
  };

  // Check clauses first, then whole text for multi-symptom sentences
  for (const clause of clauses) {
    checkClause(clause);
  }
  // Also scan full text for patterns spanning clause boundaries
  checkClause(text);

  // Deduplicate (already handled by seenLabels) and remove negated HIGH symptoms
  // that shouldn't inflate score
  return found;
}

// ─── Scoring weights ───────────────────────────────────────────────────────────
const SEVERITY_SCORES: Record<'HIGH' | 'MEDIUM' | 'LOW', number> = {
  HIGH: 28,
  MEDIUM: 14,
  LOW: 6,
};

/**
 * Local risk assessment that reads the transcription text directly.
 * Produces input-specific results — not a generic template.
 */
export function assessRiskLocal(input: RiskInput): RiskOutput {
  const BASE_SCORE = 5;
  let score = BASE_SCORE;
  const factors: string[] = [];

  // ── 1. Extract symptoms from transcription if available ───────────────────
  let extractedSymptoms: ExtractedSymptom[] = [];

  if (input.transcription?.trim()) {
    extractedSymptoms = extractSymptomsFromText(input.transcription);
  }

  // Also parse any raw-text entries in input.symptoms (text mode entries)
  for (const s of input.symptoms) {
    // If it looks like a raw sentence (>3 words), extract from it too
    if (s.split(' ').length > 3) {
      const extra = extractSymptomsFromText(s);
      for (const e of extra) {
        if (!extractedSymptoms.find(x => x.label === e.label)) {
          extractedSymptoms.push(e);
        }
      }
    }
  }

  // Include chip-selected symptoms that aren't in transcription
  const CHIP_LABELS = new Set([
    'Headache', 'Fever', 'Bleeding', 'Dizziness', 'Swelling',
    'Reduced Fetal Movement', 'Vomiting / Nausea', 'High Blood Pressure',
    'Abdominal Pain', 'Fatigue', 'Blurred Vision',
  ]);

  const CHIP_SEVERITY: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
    'Bleeding': 'HIGH', 'Reduced Fetal Movement': 'HIGH', 'Blurred Vision': 'HIGH',
    'Headache': 'MEDIUM', 'Fever': 'MEDIUM', 'Dizziness': 'MEDIUM',
    'Swelling': 'MEDIUM', 'High Blood Pressure': 'MEDIUM',
    'Vomiting / Nausea': 'MEDIUM', 'Abdominal Pain': 'MEDIUM',
    'Fatigue': 'LOW',
  };

  for (const s of input.symptoms) {
    if (CHIP_LABELS.has(s) && !extractedSymptoms.find(e => e.label === s)) {
      extractedSymptoms.push({
        label: s,
        originalText: s,
        severity: CHIP_SEVERITY[s] || 'LOW',
        negated: false,
      });
    }
  }

  // ── 2. Score active (non-negated) extracted symptoms ─────────────────────
  const activeSymptoms = extractedSymptoms.filter(e => !e.negated);

  for (const sym of activeSymptoms) {
    score += SEVERITY_SCORES[sym.severity];
    factors.push(sym.label);
  }

  // ── 3. Escalation rules (override score if any high-risk sign present) ───
  const hasHighRisk = activeSymptoms.some(s => s.severity === 'HIGH');
  if (hasHighRisk && score < 70) score = Math.max(score, 70);

  // ── 4. Gestational week adjustment ────────────────────────────────────────
  if (input.gestationalWeek >= 36) score += 8;
  else if (input.gestationalWeek >= 28) score += 5;

  // ── 5. Blood pressure ─────────────────────────────────────────────────────
  if (input.bloodPressure) {
    const sys = parseInt(input.bloodPressure.split('/')[0]);
    if (!isNaN(sys)) {
      if (sys >= 160) { score += 35; factors.push(`Severely elevated BP (${input.bloodPressure})`); }
      else if (sys >= 140) { score += 20; factors.push(`Elevated BP (${input.bloodPressure})`); }
      else if (sys >= 130) { score += 10; factors.push(`Borderline BP (${input.bloodPressure})`); }
    }
  }

  // ── 6. Previous complications ─────────────────────────────────────────────
  if (input.previousComplications?.length) {
    score += input.previousComplications.length * 8;
    factors.push(...input.previousComplications.map(c => `History: ${c}`));
  }

  score = Math.min(100, Math.round(score));
  const riskLevel: 'GREEN' | 'YELLOW' | 'RED' = score >= 70 ? 'RED' : score >= 40 ? 'YELLOW' : 'GREEN';

  // ── 7. Input-specific reasoning ───────────────────────────────────────────
  const symptomList = activeSymptoms.length > 0
    ? activeSymptoms.map(s => s.label).join(', ')
    : 'no specific symptoms identified';

  const noInfoCase = extractedSymptoms.length === 0 && input.symptoms.length === 0;

  let clinicalReasoning: string;
  if (noInfoCase) {
    clinicalReasoning = `Insufficient symptom information provided. Unable to complete assessment. Please describe current symptoms.`;
  } else if (activeSymptoms.length === 0 && extractedSymptoms.some(e => e.negated)) {
    clinicalReasoning = `Patient reports absence or resolution of symptoms at ${input.gestationalWeek} weeks gestation. Routine monitoring recommended.`;
  } else {
    clinicalReasoning = `At ${input.gestationalWeek} weeks gestation, patient reports: ${symptomList}. ${
      riskLevel === 'RED'
        ? 'One or more high-risk signs detected — immediate clinical evaluation required.'
        : riskLevel === 'YELLOW'
        ? 'Moderate-risk symptoms present — enhanced monitoring and timely clinical review advised.'
        : 'Symptoms are low-risk at this stage — continue routine antenatal care.'
    }`;
  }

  const suggestedAction =
    riskLevel === 'RED' ? 'URGENT: Visit PHC or district hospital today. Do not delay.'
    : riskLevel === 'YELLOW' ? 'Contact ASHA worker within 24 hours and monitor symptoms closely.'
    : noInfoCase ? 'Please provide symptom details for a complete assessment.'
    : 'Continue routine ANC schedule. Report any worsening symptoms immediately.';

  const followUpRecommendation =
    riskLevel === 'RED' ? 'ASHA to arrange emergency transport. Alert family, PHC staff, and district officer.'
    : riskLevel === 'YELLOW' ? 'ASHA home visit within 48 hours. Repeat symptom check in 24 hours.'
    : 'Routine ASHA follow-up at next scheduled visit.';

  return {
    riskLevel,
    riskScore: noInfoCase ? 0 : score,
    riskFactors: [...new Set(factors)],
    extractedSymptoms,
    clinicalReasoning,
    suggestedAction,
    followUpRecommendation,
    analysisSource: 'local',
  };
}

// ─── AI-assisted assessment (when Gemini is available) ───────────────────────
export async function assessRiskWithAI(
  input: RiskInput,
  generateJSON: <T>(prompt: string) => Promise<T>,
): Promise<RiskOutput> {
  const week = input.gestationalWeek || 20;
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  const transcriptionText = input.transcription?.trim() || '';

  // Pre-extract symptoms from transcription so they inform the prompt
  const preExtracted = transcriptionText ? extractSymptomsFromText(transcriptionText) : [];
  const activePreExtracted = preExtracted.filter(s => !s.negated).map(s => s.label);

  // Combine chip-selected + pre-extracted for prompt context
  const allSymptomContext = [
    ...input.symptoms.filter(s => s.split(' ').length <= 4), // chips only
    ...activePreExtracted,
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const prompt = `You are a senior maternal health physician. Assess risk for this pregnant patient and return ONLY valid JSON.

PATIENT:
- Gestational Week: ${week} (Trimester ${trimester})
- Patient's description (any language): "${transcriptionText || 'none'}"
- Pre-identified symptoms: ${allSymptomContext.join(', ') || 'none'}
- Blood Pressure: ${input.bloodPressure || 'not measured'}
- Previous complications: ${input.previousComplications?.join(', ') || 'none'}

RULES:
- Extract ALL symptoms from the description regardless of language (English/Hindi/Hinglish)
- Score: base=5, HIGH risk symptom +25, MEDIUM +12, LOW +5, week≥36 +8, week≥28 +5
- HIGH: bleeding, reduced fetal movement, blurred vision, severe abdominal pain, fits/convulsions
- MEDIUM: headache, fever, swelling, dizziness, vomiting, high BP, abdominal pain
- LOW: fatigue, back pain, mild nausea
- If score≥70→RED, 40-69→YELLOW, <40→GREEN
- clinicalReasoning MUST mention the specific symptoms found

Return this exact JSON (no markdown):
{"riskLevel":"GREEN","riskScore":0,"riskFactors":[],"clinicalReasoning":"","suggestedAction":"","followUpRecommendation":""}`;

  try {
    const result = await generateJSON<Omit<RiskOutput, 'extractedSymptoms' | 'analysisSource'>>(prompt);

    if (
      !result ||
      typeof result.riskScore !== 'number' ||
      result.riskScore < 0 || result.riskScore > 100 ||
      !['GREEN', 'YELLOW', 'RED'].includes(result.riskLevel) ||
      !result.clinicalReasoning ||
      result.clinicalReasoning.length < 20
    ) {
      console.warn('[riskEngine] Gemini invalid response, using local. Got:', JSON.stringify(result).slice(0, 200));
      return assessRiskLocal(input);
    }

    const correctedLevel: 'GREEN' | 'YELLOW' | 'RED' =
      result.riskScore >= 70 ? 'RED' : result.riskScore >= 40 ? 'YELLOW' : 'GREEN';

    console.log(`[riskEngine] Gemini: score=${result.riskScore} level=${correctedLevel} week=${week}`);

    return {
      ...result,
      riskLevel: correctedLevel,
      riskFactors: Array.isArray(result.riskFactors) ? result.riskFactors : [],
      extractedSymptoms: preExtracted,
      analysisSource: 'gemini',
    };
  } catch (err) {
    console.error('[riskEngine] Gemini failed, using local:', (err as Error).message?.slice(0, 120));
    return assessRiskLocal(input);
  }
}

/**
 * Legacy helper — extracts a flat string array from text.
 * Used by /api/ai/symptoms fallback.
 */
export function extractSymptomsLocal(transcription: string): string[] {
  const extracted = extractSymptomsFromText(transcription);
  const active = extracted.filter(s => !s.negated).map(s => s.label);
  return active.length ? active : ['General discomfort reported'];
}
