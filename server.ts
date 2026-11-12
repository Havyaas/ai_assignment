import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { calculateBiometrics, evaluateInterrogationTurn } from './src/game/interrogationLogic';
import { SuspectProfile, TacticType, Evidence } from './src/types/interrogation';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '2mb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Interrogation API Endpoint using live @google/genai with gemini-2.5-flash
app.post('/api/interrogate', async (req: Request, res: Response) => {
  const {
    suspect,
    currentStress,
    currentCognitiveLoad,
    question,
    tactic,
    selectedEvidence,
    unlockedSecretIds,
    transcriptHistory
  } = req.body as {
    suspect: SuspectProfile;
    currentStress: number;
    currentCognitiveLoad?: number;
    question: string;
    tactic: TacticType;
    selectedEvidence?: Evidence;
    unlockedSecretIds: string[];
    transcriptHistory?: Array<{ role: string; content: string }>;
  };

  if (!suspect || !question) {
    return res.status(400).json({ error: 'Missing suspect profile or question' });
  }

  const cogLoad = typeof currentCognitiveLoad === 'number' ? currentCognitiveLoad : 20;
  const secretsSoFar = unlockedSecretIds || [];

  // 1. Calculate baseline deterministic rule mechanics for fallback or baseline adjustments
  const baselineResult = evaluateInterrogationTurn({
    suspect,
    currentStress,
    currentCognitiveLoad: cogLoad,
    question,
    tactic,
    selectedEvidence,
    unlockedSecretIds: secretsSoFar
  });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({
      ...baselineResult,
      isAiPowered: false
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Format previous interrogation transcript for conversational context
    const formattedHistory = Array.isArray(transcriptHistory) && transcriptHistory.length > 0
      ? transcriptHistory.map((t, idx) => `[Turn ${idx + 1}] ${t.role === 'user' ? 'Detective' : suspect.name}: "${t.content}"`).join('\n')
      : 'None (this is the first question of the interview)';

    // Format secrets and evidence available for the suspect persona
    const formattedSecrets = suspect.hiddenSecrets.map((s) =>
      `- Secret ID: ${s.id} | "${s.title}": ${s.description} | Contradiction: ${s.contradiction} | Required Evidence: ${s.evidenceIdRequired || 'None'}`
    ).join('\n');

    const formattedEvidenceList = suspect.evidenceList.map((e) =>
      `- Evidence ID: ${e.id} | "${e.title}" (${e.category}): ${e.description}`
    ).join('\n');

    const systemInstruction = `You are roleplaying as the suspect "${suspect.name}" in a high-stakes, realistic police interrogation room.
Stay completely in character. Never mention being an AI or a language model.

=== SUSPECT DOSSIER & IDENTITY ===
- Full Name: ${suspect.name}
- Profession / Role: ${suspect.job}
- Crime Accused Of: ${suspect.crime}
- Official Claimed Alibi / Story: "${suspect.story}"
- The Hidden Truth / Actual Events: "${suspect.truth}"
- Legal Guilt Status: ${suspect.guilt.toUpperCase()} (${suspect.guilt === 'guilty' ? 'You committed the crime' : suspect.guilt === 'accomplice' ? 'You were coerced or helped the perpetrators' : 'You are genuinely innocent of this crime'})
- Personality Demeanor: ${suspect.personality.join(', ')}
- Known Weak Spots: ${suspect.weakSpots.join(', ')}

=== CASE EVIDENCE & CONTRADICTIONS ===
Evidence in Police Possession:
${formattedEvidenceList}

Hidden Secrets & Contradictions in Your Story:
${formattedSecrets}

=== PSYCHOLOGICAL & PHYSIOLOGICAL STATE MACHINES ===
- Current Stress: ${currentStress}% (Panic threshold: ${suspect.panicThreshold}%, Breakdown threshold: ${suspect.breakdownThreshold}%)
- Current Cognitive Working Memory Load: ${cogLoad}% (0-30% composed, 31-69% strained, 70-100% overloaded)
- Detective's Interrogation Tactic: "${tactic}"
- Physical Evidence Presented Right Now: ${selectedEvidence ? `"${selectedEvidence.title}": ${selectedEvidence.description}` : 'None'}

=== DYNAMIC INTERROGATION MECHANICS (EMERGENT GAMEPLAY) ===
1. DIRECT CASE-AWARE REPLIES:
   - Answer the detective's exact question directly in your authentic voice. Use specific names, places, times, alibis, or objects from the case.
   - Do NOT give generic evasions. If asked about a keycard, rooftop dinner, poison receipt, or brother Leo, mention that specific detail!

2. COGNITIVE LOAD & RETELLING BACKWARDS (tactic = "reverse_story" or question asking for reverse timeline):
   - IF GUILTY or ACCOMPLICE: Constructing a fabrication backwards in time causes severe cognitive overload! Your cognitive load spikes (+25 to +40%). Your speech MUST become slow, hesitant, stammering, second-guessing ("Wait... uh... before I went to the table... was that 10:15 or 10:30?").
   - IF INNOCENT: You actually lived the truth through episodic memory. Recounting backwards causes minimal strain (+3 to +8%). You speak smoothly, clearly, and confidently without stumbling.

3. SPEAK CALMLY (tactic = "speak_calmly" or gentle, de-escalating question):
   - Stress decreases (-10 to -20%) and cognitive load eases (-10 to -20%).
   - You notice the detective isn't shouting or threatening you. Your breathing steadies, your defensive guard lowers, and you answer more cooperatively.

4. PRESS HARDER (tactic = "press"):
   - Stress spikes (+15 to +25%). You feel cornered, defensive, agitated, or visibly nervous.

5. PRESENTED EVIDENCE CONFRONTATION:
   - If the detective presents physical evidence matching your weak spots or hidden secrets:
     * Your stress surges (+20 to +35%) and cognitive load increases (+15 to +30%).
     * Set "unlockedSecretId" to the matching secret's ID (e.g. "${suspect.hiddenSecrets[0]?.id || ''}").
     * Your body language betrays acute shock or guilt (e.g. eyes widening, swallowing hard, stammering).

6. BREAKDOWN & FULL CONFESSION:
   - If resulting stress >= ${suspect.breakdownThreshold}% (or if definitive evidence is presented while stress >= ${suspect.panicThreshold}%):
     * If GUILTY or ACCOMPLICE: You CANNOT hold the lie any longer! You completely BREAK DOWN, sob, or bury your face in your hands and deliver an emotional, full confession admitting what really happened ("verdict": "CONFESSION").
     * If INNOCENT: You do not confess to a crime you didn't commit, but you may cry or break down in desperation demanding a lawyer or pleading that you're being framed.

=== OUTPUT SCHEMA ===
You must respond with valid JSON containing:
{
  "dialogue": "1 to 3 spoken sentences in character",
  "internalThought": "1 to 2 sentences of hidden inner thoughts",
  "bodyLanguage": "Observable physical tell (e.g. shaking hands, averting gaze, sweating, calm posture)",
  "stressDelta": integer between -25 and +35,
  "cognitiveLoadDelta": integer between -25 and +40,
  "isLying": boolean (true if speaking a lie or withholding key truth),
  "verdict": "TRUTH" | "LIE" | "NERVOUS" | "CONFESSION",
  "unlockedSecretId": string of unlocked secret ID or "" if none
}`;

    const promptText = `=== INTERROGATION TRANSCRIPT CONTEXT ===
${formattedHistory}

=== CURRENT DETECTIVE ACTION ===
Detective Asks: "${question}"
Active Tactic: ${tactic}
Evidence Presented: ${selectedEvidence ? `[${selectedEvidence.id}] ${selectedEvidence.title} - ${selectedEvidence.description}` : 'None'}
Secrets Already Discovered by Detective: ${secretsSoFar.length > 0 ? secretsSoFar.join(', ') : 'None yet'}

Respond as ${suspect.name} in valid JSON matching the schema.`;

    let response: any = null;
    try {
      const aiPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call timed out')), 8500)
      );

      response = await Promise.race([aiPromise, timeoutPromise]);
    } catch (modelErr: any) {
      // If gemini-2.5-flash is not found (status 404 / retired for new users), seamlessly try gemini-3.8-flash
      if (modelErr?.status === 404 || String(modelErr?.message).includes('gemini-2.5-flash')) {
        try {
          const fallbackPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptText,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          });
          const fallbackTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini fallback timed out')), 7000)
          );
          response = await Promise.race([fallbackPromise, fallbackTimeout]);
        } catch (fbErr: any) {
          console.warn('Fallback model call failed, falling back to dynamic baseline:', fbErr?.message || fbErr);
        }
      } else {
        console.warn('Gemini 2.5 Flash query error, falling back to dynamic baseline:', modelErr?.message || modelErr);
      }
    }

    if (response && response.text) {
      const parsed = JSON.parse(response.text);

      const stressDelta = typeof parsed.stressDelta === 'number' ? parsed.stressDelta : baselineResult.stressDelta;
      const cogDelta = typeof parsed.cognitiveLoadDelta === 'number' ? parsed.cognitiveLoadDelta : baselineResult.cognitiveLoadDelta;

      const newStress = Math.max(0, Math.min(100, Math.round(currentStress + stressDelta)));
      const newCognitiveLoad = Math.max(0, Math.min(100, Math.round(cogLoad + cogDelta)));

      // Calculate realistic biometrics reflecting the new stress and cognitive strain
      const biometrics = calculateBiometrics(newStress, newCognitiveLoad, suspect.baseHeartRate);

      let verdict: 'TRUTH' | 'LIE' | 'NERVOUS' | 'CONFESSION' =
        parsed.verdict === 'CONFESSION' || newStress >= suspect.breakdownThreshold
          ? 'CONFESSION'
          : parsed.verdict === 'LIE'
          ? 'LIE'
          : parsed.verdict === 'NERVOUS'
          ? 'NERVOUS'
          : 'TRUTH';

      // Check if secret unlocked
      let unlockedSecretId: string | undefined = undefined;
      if (parsed.unlockedSecretId && typeof parsed.unlockedSecretId === 'string' && parsed.unlockedSecretId.trim().length > 0) {
        unlockedSecretId = parsed.unlockedSecretId.trim();
      } else if (baselineResult.unlockedSecretId) {
        unlockedSecretId = baselineResult.unlockedSecretId;
      }

      return res.json({
        stressDelta,
        newStress,
        cognitiveLoadDelta: cogDelta,
        newCognitiveLoad,
        biometrics,
        bodyLanguage: parsed.bodyLanguage || baselineResult.bodyLanguage,
        isLying: typeof parsed.isLying === 'boolean' ? parsed.isLying : baselineResult.isLying,
        verdict,
        unlockedSecretId,
        generatedDialogue: parsed.dialogue || baselineResult.generatedDialogue,
        internalThought: parsed.internalThought || baselineResult.internalThought,
        isAiPowered: true
      });
    }

    return res.json({ ...baselineResult, isAiPowered: false });
  } catch (err: any) {
    console.warn('Gemini 2.5 Flash query error, using baseline fallback:', err?.message || err);
    return res.json({ ...baselineResult, isAiPowered: false });
  }
});

// Setup server
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Detective Interrogator Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
