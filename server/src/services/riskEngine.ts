interface RiskInput {
  symptoms: string[];
  gestationalWeek: number;
  bloodPressure?: string;
  previousComplications?: string[];
  transcription?: string;
  pregnancyId?: string;
}

interface RiskOutput {
  riskLevel: 'GREEN' | 'YELLOW' | 'RED';
  riskScore: number;
  riskFactors: string[];
  clinicalReasoning: string;
  suggestedAction: string;
  followUpRecommendation: string;
}

export function assessRiskLocal(input: RiskInput): RiskOutput {
  let score = 15;
  const factors: string[] = [];

  const highRisk = ['Reduced fetal movement', 'Bleeding', 'High BP symptoms', 'Breathing difficulty'];
  const medRisk = ['Severe headache', 'Oedema (swelling)', 'Blurred vision', 'Abdominal pain', 'Dizziness'];

  for (const s of input.symptoms) {
    if (highRisk.some(h => s.toLowerCase().includes(h.toLowerCase().split(' ')[0]))) {
      score += 25;
      factors.push(s);
    } else if (medRisk.some(m => s.toLowerCase().includes(m.toLowerCase().split(' ')[0]))) {
      score += 15;
      factors.push(s);
    } else {
      score += 5;
      factors.push(s);
    }
  }

  if (input.gestationalWeek >= 28) score += 5;
  if (input.gestationalWeek >= 34) score += 5;

  if (input.bloodPressure) {
    const sys = parseInt(input.bloodPressure.split('/')[0]);
    if (sys >= 160) { score += 30; factors.push(`Severely elevated BP (${input.bloodPressure})`); }
    else if (sys >= 140) { score += 20; factors.push(`Elevated BP (${input.bloodPressure})`); }
    else if (sys >= 130) { score += 10; factors.push(`Borderline BP (${input.bloodPressure})`); }
  }

  if (input.previousComplications?.length) {
    score += input.previousComplications.length * 8;
    factors.push(...input.previousComplications.map(c => `History: ${c}`));
  }

  score = Math.min(100, score);
  const riskLevel = score >= 70 ? 'RED' : score >= 40 ? 'YELLOW' : 'GREEN';

  return {
    riskLevel,
    riskScore: score,
    riskFactors: [...new Set(factors)],
    clinicalReasoning: `Clinical analysis of ${input.symptoms.length} symptom(s) at ${input.gestationalWeek} weeks gestation. ${riskLevel === 'RED' ? 'Critical presentation requiring immediate evaluation per WHO maternal health guidelines.' : riskLevel === 'YELLOW' ? 'Moderate risk indicators present. Enhanced monitoring recommended.' : 'Low risk profile. Continue routine antenatal care.'}`,
    suggestedAction: riskLevel === 'RED' ? 'URGENT: Immediate referral to PHC/district hospital. Do not delay.' : riskLevel === 'YELLOW' ? 'Schedule clinical assessment within 24-48 hours. Monitor BP and fetal movement.' : 'Continue routine ANC schedule. Next visit as planned.',
    followUpRecommendation: riskLevel === 'RED' ? 'ASHA to arrange emergency transport. Alert family, PHC staff, and district officer.' : 'ASHA home visit within 48 hours. Repeat voice symptom check in 24 hours.',
  };
}

export async function assessRiskWithAI(input: RiskInput, generateJSON: <T>(prompt: string) => Promise<T>): Promise<RiskOutput> {
  const symptomsText = input.symptoms.length > 0 ? input.symptoms.join(', ') : 'No symptoms reported';
  const bpText = input.bloodPressure || 'Not measured';
  const complicationsText = input.previousComplications?.length ? input.previousComplications.join(', ') : 'None';
  const transcriptionText = input.transcription?.trim() || 'None';
  const week = input.gestationalWeek || 20;

  // Derive trimester for context
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

  const prompt = `You are a senior maternal health physician specializing in high-risk obstetrics in rural India. Perform a clinical risk assessment for this pregnant patient.

PATIENT DATA:
- Gestational Week: ${week} (Trimester ${trimester})
- Reported Symptoms: ${symptomsText}
- Blood Pressure: ${bpText}
- Previous Complications: ${complicationsText}
- Patient's Own Description: ${transcriptionText}

CLINICAL ASSESSMENT RULES:
1. Score 0-100 where: 0-39 = GREEN (low risk), 40-69 = YELLOW (moderate risk), 70-100 = RED (high risk)
2. HIGH RISK symptoms (each adds 20-30 points): vaginal bleeding, reduced/absent fetal movement, blurred vision, severe headache with BP issues, severe abdominal pain, signs of preeclampsia
3. MODERATE RISK symptoms (each adds 10-15 points): persistent headache, swelling of face/hands, dizziness, fever >38°C, vomiting affecting nutrition
4. LOW RISK symptoms (each adds 3-8 points): mild nausea, fatigue, mild back pain, no symptoms
5. BP ≥160/110: add 35 points. BP ≥140/90: add 20 points. BP ≥130/85: add 10 points
6. Gestational week ≥36: add 5 points. Week 28-35: add 3 points
7. Previous complications: add 10 points each
8. Base score is 5 (not 0) — every pregnancy carries some inherent risk
9. "No symptoms" alone = score around 5-15 depending on week

IMPORTANT: Analyze the actual symptoms provided. Do NOT return a generic score. Each patient's score MUST reflect their specific symptom combination and clinical profile.

Return ONLY this exact JSON structure (no markdown, no explanation):
{
  "riskLevel": "GREEN" or "YELLOW" or "RED",
  "riskScore": <integer 0-100>,
  "riskFactors": ["factor1", "factor2"],
  "clinicalReasoning": "<2-3 sentences explaining why this specific score was assigned based on the symptoms>",
  "suggestedAction": "<specific action for this patient>",
  "followUpRecommendation": "<specific follow-up plan>"
}`;

  try {
    const result = await generateJSON<RiskOutput>(prompt);

    // Validate the response has required fields and sensible values
    if (
      !result ||
      typeof result.riskScore !== 'number' ||
      result.riskScore < 0 || result.riskScore > 100 ||
      !['GREEN', 'YELLOW', 'RED'].includes(result.riskLevel) ||
      !result.clinicalReasoning
    ) {
      console.warn('[riskEngine] Gemini returned invalid structure, using local fallback:', JSON.stringify(result));
      return assessRiskLocal(input);
    }

    // Ensure riskLevel matches the score (Gemini sometimes returns inconsistent values)
    const correctedLevel: 'GREEN' | 'YELLOW' | 'RED' =
      result.riskScore >= 70 ? 'RED' : result.riskScore >= 40 ? 'YELLOW' : 'GREEN';

    console.log(`[riskEngine] Gemini AI risk: score=${result.riskScore}, level=${correctedLevel} (week=${week}, symptoms=${input.symptoms.length})`);

    return {
      ...result,
      riskLevel: correctedLevel,
      riskFactors: Array.isArray(result.riskFactors) ? result.riskFactors : [],
    };
  } catch (err) {
    console.error('[riskEngine] Gemini AI assessment failed, falling back to local:', (err as Error).message);
    return assessRiskLocal(input);
  }
}

export function extractSymptomsLocal(transcription: string): string[] {
  const mappings: Record<string, string> = {
    headache: 'Severe headache', swelling: 'Oedema (swelling)', swollen: 'Oedema (swelling)',
    dizzy: 'Dizziness', dizziness: 'Dizziness', bleed: 'Bleeding', bleeding: 'Bleeding',
    movement: 'Reduced fetal movement', vision: 'Blurred vision', breath: 'Breathing difficulty',
    pain: 'Abdominal pain', nausea: 'Nausea/Vomiting', fever: 'Fever', contraction: 'Contractions',
    सिरदर्द: 'Severe headache', सूजन: 'Oedema (swelling)', चक्कर: 'Dizziness',
    खून: 'Bleeding', हलचल: 'Reduced fetal movement',
  };
  const lower = transcription.toLowerCase();
  const found: string[] = [];
  for (const [key, label] of Object.entries(mappings)) {
    if (lower.includes(key) && !found.includes(label)) found.push(label);
  }
  return found.length ? found : ['General discomfort reported'];
}
