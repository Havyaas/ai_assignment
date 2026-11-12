export type EvidenceCategory = 'photo' | 'document' | 'video' | 'receipt' | 'witness';

export interface Evidence {
  id: string;
  title: string;
  category: EvidenceCategory;
  description: string;
  secretTriggerId?: string;
  hint: string;
}

export interface Secret {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  contradiction: string;
  evidenceIdRequired?: string;
}

export type TacticType =
  | 'speak_calmly'
  | 'normal'
  | 'press'
  | 'reverse_story'
  | 'friendly';

export interface SuspectProfile {
  id: string;
  name: string;
  job: string;
  crime: string;
  story: string; // Claimed alibi
  truth: string; // The real truth
  guilt: 'guilty' | 'innocent' | 'accomplice';
  personality: string[];
  baseStress: number;
  panicThreshold: number; // e.g. 70%
  breakdownThreshold: number; // e.g. 90%
  baseHeartRate: number;
  weakSpots: string[];
  evidenceList: Evidence[];
  hiddenSecrets: Secret[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Biometrics {
  heartRate: number; // Pulse in BPM
  voiceJitter: number;
  voiceTremor: 'Steady' | 'Slight Shake' | 'Noticeably Shaky' | 'Cracking / Stuttering';
  voicePacing: 'Confident & Smooth' | 'Normal' | 'Hesitant & Slow' | 'Stammering / Overloaded';
}

export interface InterrogationTurn {
  id: string;
  timestamp: string;
  question: string;
  tactic: TacticType;
  evidenceUsedId?: string;
  suspectResponse: string;
  internalThought?: string;
  stressBefore: number;
  stressAfter: number;
  stressDelta: number;
  cognitiveLoadBefore: number;
  cognitiveLoadAfter: number;
  cognitiveLoadDelta: number;
  biometrics: Biometrics;
  bodyLanguage: string;
  isLying: boolean;
  verdict: 'TRUTH' | 'LIE' | 'NERVOUS' | 'CONFESSION';
  unlockedSecretId?: string;
}

export interface IndictmentReport {
  selectedVerdict: 'guilty' | 'innocent' | 'accomplice';
  actualGuilt: 'guilty' | 'innocent' | 'accomplice';
  isCorrect: boolean;
  secretsFound: number;
  totalSecrets: number;
  liesCaught: number;
  peakStress: number;
  gotConfession: boolean;
  score: number;
  rating: 'Master Detective' | 'Good Detective' | 'Rookie Mistake' | 'Wrong Call';
  feedback: string;
}

export interface GameState {
  suspect: SuspectProfile;
  currentStress: number;
  currentCognitiveLoad: number;
  turnsLeft: number;
  maxTurns: number;
  transcript: InterrogationTurn[];
  unlockedSecretIds: string[];
  status: 'active' | 'confessed' | 'time_up' | 'closed';
  finalReport?: IndictmentReport;
}
