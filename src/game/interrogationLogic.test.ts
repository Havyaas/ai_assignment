import test from 'node:test';
import assert from 'node:assert/strict';
import { CASE_FILES } from './cases';
import {
  calculateBiometrics,
  deriveBodyLanguage,
  evaluateInterrogationTurn,
  evaluateVerdict
} from './interrogationLogic';

test('calculateBiometrics outputs pulse, tremor, and emergent voice pacing', () => {
  // Low stress & low load = Confident & Smooth
  const calm = calculateBiometrics(15, 20, 70);
  assert.equal(calm.voiceTremor, 'Steady');
  assert.equal(calm.voicePacing, 'Confident & Smooth');

  // High cognitive load = Hesitant & Slow or Stammering
  const overloaded = calculateBiometrics(50, 80, 70);
  assert.equal(overloaded.voicePacing, 'Stammering / Overloaded');

  // Breakdown
  const breakdown = calculateBiometrics(95, 90, 70);
  assert.equal(breakdown.voiceTremor, 'Cracking / Stuttering');
  assert.ok(breakdown.heartRate > 150);
});

test('retell story backwards spikes cognitive load if guilty and causes hesitant voice', () => {
  const caseMarcus = CASE_FILES[0]; // Guilty

  const result = evaluateInterrogationTurn({
    suspect: caseMarcus,
    currentStress: 25,
    currentCognitiveLoad: 20,
    question: "Walk me through your evening in reverse from midnight back to 8 PM.",
    tactic: 'reverse_story',
    unlockedSecretIds: []
  });

  assert.ok(result.cognitiveLoadDelta >= 30, 'Cognitive load should surge by 30%+ for guilty liar');
  assert.ok(result.newCognitiveLoad >= 50, 'Cognitive load should exceed 50%');
  assert.equal(result.biometrics.voicePacing, 'Hesitant & Slow');
  assert.match(result.generatedDialogue, /backwards|spin|wait|um/i, 'Dialogue must show hesitation and struggle');
});

test('speaking calmly actively reduces stress and cognitive load', () => {
  const caseVictoria = CASE_FILES[1];

  const result = evaluateInterrogationTurn({
    suspect: caseVictoria,
    currentStress: 60,
    currentCognitiveLoad: 50,
    question: "Take a deep breath, Victoria. I want to speak calmly and understand your side.",
    tactic: 'speak_calmly',
    unlockedSecretIds: []
  });

  assert.ok(result.stressDelta < 0, 'Stress delta must be negative when speaking calmly');
  assert.ok(result.cognitiveLoadDelta < 0, 'Cognitive load must decrease when speaking calmly');
  assert.ok(result.newStress < 60);
  assert.ok(result.newCognitiveLoad < 50);
  assert.match(result.generatedDialogue, /thank you|lowering your voice|sigh/i);
});

test('hard difficulty Bobby Rivera reacts specifically to brother and ransom evidence', () => {
  const caseBobby = CASE_FILES.find((c) => c.id === 'case_bobby')!;
  assert.ok(caseBobby, 'Bobby Rivera case must exist');
  assert.equal(caseBobby.difficulty, 'Hard');

  const voicemailEvidence = caseBobby.evidenceList.find((e) => e.id === 'ev_audio')!;
  assert.ok(voicemailEvidence, 'Voicemail evidence must exist');

  const result = evaluateInterrogationTurn({
    suspect: caseBobby,
    currentStress: 40,
    currentCognitiveLoad: 30,
    question: "We found the voicemail about your brother Leo on your phone!",
    tactic: 'normal',
    selectedEvidence: voicemailEvidence,
    unlockedSecretIds: []
  });

  assert.ok(result.stressDelta >= 25, 'Confrontation should spike stress');
  assert.equal(result.unlockedSecretId, 'sec_ransom_voicemail');
  assert.match(result.generatedDialogue, /leo|brother/i, 'Bobby must mention his brother Leo');
  assert.equal(caseBobby.guilt, 'accomplice', 'Bobby must be accomplice due to coercion');
});

test('evaluateVerdict scores correct convictions with Master Detective rating', () => {
  const caseMarcus = CASE_FILES[0];
  const report = evaluateVerdict(
    caseMarcus,
    'guilty',
    ['sec_dinner_alibi', 'sec_keycard_log', 'sec_camera_footage'],
    [
      {
        id: '1',
        timestamp: '10:00',
        question: 'Confess!',
        tactic: 'normal',
        suspectResponse: 'I confess!',
        stressBefore: 80,
        stressAfter: 95,
        stressDelta: 15,
        cognitiveLoadBefore: 60,
        cognitiveLoadAfter: 85,
        cognitiveLoadDelta: 25,
        biometrics: {
          heartRate: 165,
          voiceJitter: 0.9,
          voiceTremor: 'Cracking / Stuttering',
          voicePacing: 'Stammering / Overloaded'
        },
        bodyLanguage: 'Sweating',
        isLying: false,
        verdict: 'CONFESSION'
      }
    ]
  );

  assert.equal(report.isCorrect, true);
  assert.equal(report.gotConfession, true);
  assert.equal(report.rating, 'Master Detective');
  assert.ok(report.score >= 8000);
});
