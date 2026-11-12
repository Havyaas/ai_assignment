import {
  Biometrics,
  Evidence,
  IndictmentReport,
  InterrogationTurn,
  SuspectProfile,
  TacticType
} from '../types/interrogation';

export interface EvaluateTurnParams {
  suspect: SuspectProfile;
  currentStress: number;
  currentCognitiveLoad: number;
  question: string;
  tactic: TacticType;
  selectedEvidence?: Evidence;
  unlockedSecretIds: string[];
}

export interface TurnEvaluationResult {
  stressDelta: number;
  newStress: number;
  cognitiveLoadDelta: number;
  newCognitiveLoad: number;
  biometrics: Biometrics;
  bodyLanguage: string;
  isLying: boolean;
  verdict: 'TRUTH' | 'LIE' | 'NERVOUS' | 'CONFESSION';
  unlockedSecretId?: string;
  generatedDialogue: string;
  internalThought: string;
}

/**
 * Calculates pulse, voice tremor, and pacing based on stress and cognitive load.
 */
export function calculateBiometrics(
  stress: number,
  cognitiveLoad: number,
  baseHeartRate = 72
): Biometrics {
  const clampedStress = Math.max(0, Math.min(100, stress));
  const clampedCog = Math.max(0, Math.min(100, cognitiveLoad));

  // Pulse surges with stress and high mental strain
  const heartRate = Math.round(baseHeartRate + (clampedStress * 0.9) + (clampedCog * 0.1));

  const voiceJitter = Number((0.05 + (clampedStress / 100) * 0.75 + (clampedCog / 100) * 0.2).toFixed(2));

  let voiceTremor: Biometrics['voiceTremor'] = 'Steady';
  if (clampedStress >= 88) {
    voiceTremor = 'Cracking / Stuttering';
  } else if (clampedStress >= 68) {
    voiceTremor = 'Noticeably Shaky';
  } else if (clampedStress >= 45) {
    voiceTremor = 'Slight Shake';
  }

  // Voice pacing emerges from cognitive load!
  let voicePacing: Biometrics['voicePacing'] = 'Normal';
  if (clampedCog >= 75) {
    voicePacing = 'Stammering / Overloaded';
  } else if (clampedCog >= 50) {
    voicePacing = 'Hesitant & Slow';
  } else if (clampedStress < 40 && clampedCog < 35) {
    voicePacing = 'Confident & Smooth';
  }

  return {
    heartRate: Math.max(55, Math.min(200, heartRate)),
    voiceJitter,
    voiceTremor,
    voicePacing
  };
}

/**
 * Realistic, plain-English body language observed by the detective.
 */
export function deriveBodyLanguage(stress: number, cognitiveLoad: number, isLying: boolean): string {
  if (stress >= 90) {
    return 'Forehead dripping with sweat, voice breaking, clutching the desk in total panic.';
  }
  if (cognitiveLoad >= 75) {
    return 'Staring into blank space, pauses for 3 seconds between words, visibly mentally overloaded.';
  }
  if (stress >= 70) {
    return 'Swallowing repeatedly, eyes darting toward the door, hands visibly trembling.';
  }
  if (stress < 30 && cognitiveLoad < 30) {
    return 'Leaning back comfortably, shoulders relaxed, smiling with easy confidence.';
  }
  if (stress >= 45) {
    if (isLying) {
      return 'Briefly avoids eye contact, clears throat awkwardly, and rubs back of neck.';
    }
    return 'Shifting uncomfortably in the chair, fidgeting with shirt cuffs.';
  }
  if (isLying) {
    return 'Hesitates for a second, fingers tapping quietly against the table.';
  }
  return 'Calm posture, breathing steady, looking directly at you.';
}

/**
 * Main evaluation of each interrogation turn using emergent cognitive & semantic rules.
 */
export function evaluateInterrogationTurn(params: EvaluateTurnParams): TurnEvaluationResult {
  const { suspect, currentStress, currentCognitiveLoad, question, tactic, selectedEvidence, unlockedSecretIds } = params;
  const qLower = question.toLowerCase();

  let stressDelta = 0;
  let cognitiveLoadDelta = 0;
  let isLying = false;
  let verdict: 'TRUTH' | 'LIE' | 'NERVOUS' | 'CONFESSION' = 'TRUTH';
  let unlockedSecretId: string | undefined = undefined;

  // 1. Evidence confrontation
  if (selectedEvidence) {
    const matchingSecret = suspect.hiddenSecrets.find(
      (s) => s.evidenceIdRequired === selectedEvidence.id || s.id === selectedEvidence.secretTriggerId
    );

    if (matchingSecret) {
      stressDelta += 28; // Massive stress spike
      cognitiveLoadDelta += 25; // Working memory overwhelmed by proof
      if (!unlockedSecretIds.includes(matchingSecret.id)) {
        unlockedSecretId = matchingSecret.id;
      }
    } else {
      stressDelta -= 3;
      cognitiveLoadDelta -= 5;
    }
  }

  // 2. Question tactic modifier (Emergent Mechanics!)
  const isReverseTimeline = tactic === 'reverse_story' || qLower.includes('backward') || qLower.includes('in reverse') || qLower.includes('before that');
  const isSpeakingCalmly = tactic === 'speak_calmly' || qLower.includes('calm') || qLower.includes('take a breath') || qLower.includes('take your time') || qLower.includes('relax');

  if (isSpeakingCalmly) {
    // Speaking calmly actively reduces stress and eases cognitive strain
    stressDelta -= 12;
    cognitiveLoadDelta -= 15;
  } else if (isReverseTimeline) {
    // Cognitive Load Theory: Lying backwards strains working memory immensely!
    if (suspect.guilt !== 'innocent') {
      cognitiveLoadDelta += 32; // Overloaded!
      stressDelta += 15;
    } else {
      cognitiveLoadDelta += 6; // Truthful recall backwards is easy
      stressDelta += 2;
    }
  } else {
    switch (tactic) {
      case 'press':
        stressDelta += 16;
        cognitiveLoadDelta += 10;
        break;
      case 'friendly':
        stressDelta -= 6;
        cognitiveLoadDelta -= 5;
        break;
      case 'normal':
      default:
        stressDelta += 5;
        cognitiveLoadDelta += 4;
        break;
    }
  }

  // 3. Weak spots keywords
  for (const wp of suspect.weakSpots) {
    if (qLower.includes(wp.toLowerCase())) {
      stressDelta += 10;
      cognitiveLoadDelta += 8;
    }
  }

  const newStress = Math.max(5, Math.min(100, currentStress + stressDelta));
  const newCognitiveLoad = Math.max(5, Math.min(100, currentCognitiveLoad + cognitiveLoadDelta));

  // Determine lie / confession / truth status
  if (newStress >= suspect.breakdownThreshold) {
    verdict = 'CONFESSION';
    isLying = false;
  } else if (suspect.guilt === 'innocent') {
    verdict = newStress >= suspect.panicThreshold ? 'NERVOUS' : 'TRUTH';
    isLying = false;
  } else {
    // Suspect is guilty or accomplice
    if (selectedEvidence && unlockedSecretId) {
      verdict = 'LIE';
      isLying = true;
    } else if (newStress >= suspect.panicThreshold || newCognitiveLoad >= 70) {
      verdict = 'NERVOUS';
      isLying = true;
    } else {
      verdict = 'LIE';
      isLying = true;
    }
  }

  const biometrics = calculateBiometrics(newStress, newCognitiveLoad, suspect.baseHeartRate);
  const bodyLanguage = deriveBodyLanguage(newStress, newCognitiveLoad, isLying);

  // Generate intelligent case-specific and cognitive-aware dialogue
  const dialogueResult = generateContextualDialogue(
    suspect,
    newStress,
    newCognitiveLoad,
    question,
    selectedEvidence,
    tactic,
    isSpeakingCalmly,
    isReverseTimeline
  );

  return {
    stressDelta,
    newStress,
    cognitiveLoadDelta,
    newCognitiveLoad,
    biometrics,
    bodyLanguage,
    isLying,
    verdict,
    unlockedSecretId,
    generatedDialogue: dialogueResult.dialogue,
    internalThought: dialogueResult.thought
  };
}

/**
 * Generates responses tailored specifically to:
 * 1. Suspect's case (Marcus, Victoria, Bobby)
 * 2. Exact question asked
 * 3. Stress & Cognitive Load (confident if truth, slow/hesitant if cognitive overload!)
 */
function generateContextualDialogue(
  suspect: SuspectProfile,
  stress: number,
  cognitiveLoad: number,
  question: string,
  evidence?: Evidence,
  tactic?: TacticType,
  isSpeakingCalmly = false,
  isReverseTimeline = false
): { dialogue: string; thought: string } {
  const q = question.toLowerCase();
  const isPanic = stress >= suspect.panicThreshold;
  const isBreakdown = stress >= suspect.breakdownThreshold;
  const isOverloaded = cognitiveLoad >= 65;

  // 1. REVERSE TIMELINE COGNITIVE DYNAMICS
  if (isReverseTimeline) {
    if (suspect.guilt !== 'innocent') {
      // Guilty or Accomplice: Cognitive load spikes, speech becomes hesitant, slow, and struggling
      if (suspect.id === 'case_marcus') {
        return {
          dialogue: "Backwards...? Uh... well... at midnight the sirens went off... and... um... before that, around 11:15, I was... wait, was the dessert before or after the phone call? Hold on, Detective, my head is spinning trying to recall every single second backwards...",
          thought: "I can't keep the fake timeline straight in reverse! If I say the wrong time, they'll know I left the table."
        };
      }
      if (suspect.id === 'case_victoria') {
        return {
          dialogue: "In reverse order...? At 10:00 PM the commotion started... and before that... um... I was in the guest room... or wait, did I come down for water at 9:30? No, wait... stop trying to disorient me with these backwards parlor tricks!",
          thought: "Working memory overload. If I recount it backwards, I might accidentally mention the bar cabinet at 9:15."
        };
      }
      // Bobby Rivera
      return {
        dialogue: "Start from the end...? When you cut my ropes at 2:00 AM... before that was the vault door opening at 1:30... wait, no, the alley door was 1:15... uh, they made me... I mean, I was tied up... my thoughts are all scrambled, Detective, please...",
        thought: "I almost blurted out that I unlocked the door at 1:15 before they tied me up! I have to be so careful."
      };
    } else {
      // Truthful recount: Low cognitive load, confident and smooth!
      return {
        dialogue: "Recount it backwards? Easily. At midnight I was paying the tab. At 11:30, we were finishing our coffee. At 10:30, we had our main course. When you actually lived the evening, Detective, it's just as clear in reverse.",
        thought: "Nothing to hide. Recounting the truth backwards doesn't trip me up at all."
      };
    }
  }

  // 2. SPEAK CALMLY DYNAMICS (Relieves stress, encourages candid open dialogue)
  if (isSpeakingCalmly) {
    if (suspect.id === 'case_marcus') {
      return {
        dialogue: "Thank you... I appreciate you speaking to me with some basic dignity. Look, between you and me, tonight has been a living nightmare. The gallery has been struggling with cash flow, but I genuinely wanted this gala to succeed. What specific detail do you need to know?",
        thought: "Their calm tone makes me feel less defensive. My heart is finally slowing down. Maybe I can explain things reasonably."
      };
    }
    if (suspect.id === 'case_victoria') {
      return {
        dialogue: "*sighs softly* Thank you for lowering your voice. I've had a migraine pounding behind my eyes all evening. Uncle Arthur and I had our differences—everyone in high society knows he was tyrannical with the estate funds—but I am trying my best to cooperate with you.",
        thought: "They aren't barking at me like the patrol sergeant was. I can breathe for a second."
      };
    }
    if (suspect.id === 'case_bobby') {
      return {
        dialogue: "*takes a deep breath, hands steadying* Thank you, Detective... nobody has spoken to me calmly since the sirens started. I'm just a normal security guard who does the midnight rounds. If you promise to hear me out, I want to tell you what really happened tonight...",
        thought: "This detective is actually listening. Maybe it's safe to tell them about the threat to Leo."
      };
    }
  }

  // 3. BREAKDOWN CONFESSIONS
  if (isBreakdown) {
    if (suspect.id === 'case_marcus') {
      return {
        dialogue: "All right, all right, stop! Turn the tape recorder on! Yes, I took the sapphire necklace! I owed half a million to loan sharks who threatened my family. The necklace is in the spare tire of my sports car in the alley. Just please keep me in protective custody!",
        thought: "It's completely over. They have my keycard swipe, the video, and the waiter's word. I have to cooperate."
      };
    }
    if (suspect.id === 'case_victoria') {
      return {
        dialogue: "Fine! You want the truth?! Yes, I poured the weed killer into Arthur's decanter! He was going to cut me out of the will completely! I was drowning in gambling debts and I had no other way out! He treated me like dirt my whole life!",
        thought: "They found my earring and the store receipt... there's nowhere left to hide."
      };
    }
    return {
      dialogue: "Look, I had to do it! The robbers kidnapped my little brother Leo! They sent me a picture of him tied up in a basement with a gun to his head! If I didn't unlock the rear alley door at 1:15 AM, they said they'd execute him! I never wanted the money, I swear to God! Please save Leo!",
      thought: "I can't hold this in anymore. I have to tell the detective so they can send SWAT to rescue Leo!"
    };
  }

  // 4. EVIDENCE CONFRONTATIONS
  if (evidence) {
    if (evidence.id === 'ev_waiter') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...The waiter said my seat was empty for fifty minutes?! I... well... I had a stomach cramp from the shellfish! I was in the restroom! Why would the waiter monitor my bathroom schedule?!"
          : "The waiter must be mistaken. The rooftop was packed with fifty donors. I stepped away to make a couple of private gallery calls on the balcony, not to rob my own vault.",
        thought: "Damn it, I tipped that waiter a hundred dollars. How did they get him to talk so fast?"
      };
    }

    if (evidence.id === 'ev_keycard') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...My manager keycard at 10:22 PM?! I... I keep my keycard on my lanyard! Unless... someone lifted it when I left my suit jacket on my chair! That's it, someone stole my card!"
          : "Every senior curator has access to that floor. If my card was scanned, someone must have cloned or borrowed it from my desk.",
        thought: "The digital timestamp... 10:22 PM. There is no innocent reason for my card to swipe into the vault during dinner."
      };
    }

    if (evidence.id === 'ev_video') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...A man in a grey suit on the fire escape?! Lots of men wore grey suits tonight! That camera is fifty feet away in the rain! You can't see a face on that footage!"
          : "That video is dark and grainy. You can barely make out the outline of a coat, let alone prove that was me.",
        thought: "They have the rear alley camera angle. They are going to search my sports car next."
      };
    }

    if (evidence.id === 'ev_earring') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...My pearl earring was behind the liquor cabinet?! I... I dropped it earlier in the afternoon! I was looking for a cocktail napkin before dinner! That doesn't mean I poisoned Uncle Arthur!"
          : "I wondered where that went. I must have dropped it before dinner when I set the floral centerpiece on the sideboard.",
        thought: "How could I be so clumsy?! Leaving my custom jewelry right next to the poisoned decanter..."
      };
    }

    if (evidence.id === 'ev_receipt') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...A receipt for rat poison?! The gardener asked me to pick that up for the greenhouse rodents! I buy dozens of supplies for the estate every week!"
          : "Managing a twelve-bedroom country estate involves pest control supplies. Presenting a routine garden receipt as murder evidence is absurd.",
        thought: "The chemical match... the hospital lab will prove Arthur ingested the exact same compound."
      };
    }

    if (evidence.id === 'ev_texts') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...Those debt collectors are ruthless loan sharks! Yes, I owe money, but that doesn't mean I would kill my own flesh and blood for an inheritance!"
          : "My private investment accounts are none of your concern. A short-term liquidity dip is hardly motive for murder.",
        thought: "They saw the 250k deadline for Monday. They know I was desperate for the inheritance."
      };
    }

    if (evidence.id === 'ev_audio') {
      return {
        dialogue: "You... you heard the voicemail on my phone?! Detective, please listen to me! That's my brother Leo! They grabbed him outside his high school! They told me they would shoot him if I touched the silent alarm! I had to let them in or Leo dies!",
        thought: "They know about Leo! This is my only chance to get police help before the gang kills him."
      };
    }

    if (evidence.id === 'ev_ropes') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...The ropes were loose slipknots?! I don't know why they tied them that way! Maybe the robber was in a hurry! Why are you interrogating my ropes instead of chasing the gang?!"
          : "They tied my hands behind the chair before they cracked the safe. I wriggled my hands for an hour trying to get loose.",
        thought: "The robber told me: 'I'm tying slipknots so you can reach your phone after we hit the highway.' If police figure that out, they'll think I'm in on it."
      };
    }

    if (evidence.id === 'ev_alarm_log') {
      return {
        dialogue: isPanic || isOverloaded
          ? "...The standard PIN code?! The guy had a 9mm pistol jammed against the base of my skull! My fingers were shaking so hard I just punched in whatever code came to mind!"
          : "When two men with assault rifles storm your security desk, you comply to preserve life. I entered the PIN they demanded.",
        thought: "The leader whispered: 'If you touch the duress digit, we put a bullet through Leo's spine.' I couldn't risk it."
      };
    }
  }

  // 5. SPECIFIC QUESTION TOPIC PARSING
  if (q.includes('money') || q.includes('debt') || q.includes('loan') || q.includes('will') || q.includes('inherit') || q.includes('cash')) {
    if (suspect.id === 'case_marcus') {
      return {
        dialogue: isPanic
          ? "My business loans have nothing to do with a missing sapphire! Every high-end art gallery operates on leveraged credit lines!"
          : "The gallery is having a routine quarterly cash-flow adjustment, Detective. Nothing out of the ordinary for the art market.",
        thought: "If they subpoena my offshore accounts and see the loan shark notices, I'm sunk."
      };
    }
    if (suspect.id === 'case_victoria') {
      return {
        dialogue: isPanic
          ? "Uncle Arthur promised to maintain my family trust fund! Why would I jeopardize my own future inheritance?!"
          : "Uncle Arthur's estate planning was between him and his attorneys. We had normal family discussions regarding trust allocations.",
        thought: "He told me directly at breakfast that he was removing me from the will on Monday morning."
      };
    }
  }

  if (q.includes('brother') || q.includes('leo') || q.includes('family') || q.includes('hostage')) {
    if (suspect.id === 'case_bobby') {
      return {
        dialogue: "My brother Leo is everything to me... he's just seventeen, Detective. If anything happens to him because of this robbery, I won't be able to live with myself.",
        thought: "Please let police find Leo before the gang realizes I'm being questioned."
      };
    }
  }

  if (q.includes('wife') || q.includes('dinner') || q.includes('rooftop')) {
    if (suspect.id === 'case_marcus') {
      return {
        dialogue: isPanic
          ? "My wife was sitting right across from me! We ordered the sea bass and champagne! Ask any of the patrons on the terrace!"
          : "My wife and I spent the evening together celebrating the opening gala. We rarely get an evening without gallery interruptions.",
        thought: "She had three glasses of Pinot Noir by 10 PM. If they question her carefully, she'll admit she dosed off."
      };
    }
  }

  if (q.includes('headache') || q.includes('guest room') || q.includes('tea')) {
    if (suspect.id === 'case_victoria') {
      return {
        dialogue: isPanic
          ? "I suffer from chronic migraines! The housekeeper brought me a pot of chamomile tea at 8:15 and I didn't leave that bed until the sirens started!"
          : "I had a splitting migraine from the dinner noise. I rested upstairs in the west wing guest room until the emergency services arrived.",
        thought: "I never drank the tea. I was standing in the dark by the landing watching Uncle Arthur pour his drink."
      };
    }
  }

  if (q.includes('pin') || q.includes('alarm') || q.includes('code') || q.includes('silent')) {
    if (suspect.id === 'case_bobby') {
      return {
        dialogue: isPanic
          ? "If I pressed the silent alarm, the warning beacon flashes on the outer security wall! The gunmen told me they'd kill everyone if an alarm went off!"
          : "Our security protocol prioritizes human life over bank property. Disarming the entry under direct gun threat was standard protocol.",
        thought: "They knew my guard shift and they knew about the silent alarm. They had inside info."
      };
    }
  }

  // 6. GENERAL REACTION BY STRESS
  if (isPanic) {
    return {
      dialogue: "Why are you badgering me with these aggressive theories?! I told you what I saw and what I did! I have rights and I expect them to be respected!",
      thought: "They are closing the net. Maintain composure. Don't look at their hands."
    };
  }

  return {
    dialogue: "I am cooperating fully with this investigation, Detective. What other details can I clarify for you?",
    thought: "Keep answers brief and steady. Don't volunteer extra information."
  };
}

/**
 * Scores the interrogation and evaluates the player's final indictment verdict.
 */
export function evaluateVerdict(
  suspect: SuspectProfile,
  selectedVerdict: 'guilty' | 'innocent' | 'accomplice',
  unlockedSecretIds: string[],
  transcript: InterrogationTurn[]
): IndictmentReport {
  const isCorrect = selectedVerdict === suspect.guilt;
  const secretsFound = unlockedSecretIds.length;
  const totalSecrets = suspect.hiddenSecrets.length;
  const liesCaught = transcript.filter((t) => t.verdict === 'LIE').length;
  const peakStress = Math.max(...transcript.map((t) => t.stressAfter), suspect.baseStress);
  const gotConfession = peakStress >= suspect.breakdownThreshold;

  let score = isCorrect ? 5000 : 800;
  score += secretsFound * 800;
  score += liesCaught * 250;
  if (gotConfession) score += 1500;

  let rating: IndictmentReport['rating'] = 'Wrong Call';
  if (isCorrect && gotConfession) {
    rating = 'Master Detective';
  } else if (isCorrect) {
    rating = 'Good Detective';
  } else if (secretsFound >= 2) {
    rating = 'Rookie Mistake';
  }

  let feedback = '';
  if (isCorrect) {
    feedback = `Spot-on Detective work! You correctly determined that ${suspect.name} was ${selectedVerdict.toUpperCase()}. You caught their lies, exposed the contradictions, and closed the case!`;
  } else {
    feedback = `Case thrown out! You accused ${suspect.name} of being ${selectedVerdict.toUpperCase()}, but they were actually ${suspect.guilt.toUpperCase()}. The real truth slipped through your fingers.`;
  }

  return {
    selectedVerdict,
    actualGuilt: suspect.guilt,
    isCorrect,
    secretsFound,
    totalSecrets,
    liesCaught,
    peakStress,
    gotConfession,
    score,
    rating,
    feedback
  };
}
