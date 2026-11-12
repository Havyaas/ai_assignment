import React, { useState, useEffect } from 'react';
import {
  Folder,
  Gavel,
  Volume2,
  VolumeX,
  Tv,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { CASE_FILES } from './game/cases';
import {
  Evidence,
  GameState,
  IndictmentReport,
  InterrogationTurn,
  SuspectProfile,
  TacticType
} from './types/interrogation';
import {
  calculateBiometrics,
  evaluateInterrogationTurn,
  evaluateVerdict
} from './game/interrogationLogic';
import {
  playClickSound,
  playLieSpikeSound,
  playBreakdownSound,
  setAudioMuted
} from './utils/audio';

import { BiometricMonitor } from './components/BiometricMonitor';
import { SuspectHoloView } from './components/SuspectHoloView';
import { TranscriptFeed } from './components/TranscriptFeed';
import { TacticalBar } from './components/TacticalBar';
import { EvidenceLockerModal } from './components/EvidenceLockerModal';
import { IndictmentModal } from './components/IndictmentModal';
import { ReportView } from './components/ReportView';
import { CaseSelectScreen } from './components/CaseSelectScreen';

export default function App() {
  const [screen, setScreen] = useState<'select' | 'interrogation' | 'report'>('select');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | undefined>(undefined);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isIndictmentModalOpen, setIsIndictmentModalOpen] = useState(false);
  const [isSubmittingTurn, setIsSubmittingTurn] = useState(false);
  const [audioMuted, setAudioMutedState] = useState(false);
  const [isCrtEnabled, setIsCrtEnabled] = useState(true);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Autostart URL parameter check for automated testing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startInterrogation(CASE_FILES[0]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => {
      setToastNotice((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const handleToggleAudio = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    setAudioMutedState(next);
  };

  const startInterrogation = (suspect: SuspectProfile) => {
    setGameState({
      suspect,
      currentStress: suspect.baseStress,
      currentCognitiveLoad: 20,
      turnsLeft: 12,
      maxTurns: 12,
      transcript: [],
      unlockedSecretIds: [],
      status: 'active'
    });

    setSelectedEvidence(undefined);
    setScreen('interrogation');
    showToast(`Interview started: ${suspect.name} is seated.`);
  };

  const handleQuestionSubmit = async (question: string, tactic: TacticType) => {
    if (!gameState || isSubmittingTurn || gameState.status !== 'active') return;

    setIsSubmittingTurn(true);
    const { suspect, currentStress, currentCognitiveLoad, unlockedSecretIds } = gameState;

    let turnResult: any = null;

    try {
      // 9.5-second timeout on fetch for live Gemini 2.5 Flash API calls
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9500);

      const resp = await fetch('/api/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          suspect,
          currentStress,
          currentCognitiveLoad: currentCognitiveLoad ?? 20,
          question,
          tactic,
          selectedEvidence,
          unlockedSecretIds,
          transcriptHistory: gameState.transcript.flatMap((t) => [
            { role: 'user', content: t.question },
            { role: 'assistant', content: t.suspectResponse }
          ])
        })
      });

      clearTimeout(timeoutId);

      if (resp.ok) {
        turnResult = await resp.json();
      } else {
        throw new Error('Server returned non-200');
      }
    } catch {
      // Immediate local fallback in under 1ms
      turnResult = evaluateInterrogationTurn({
        suspect,
        currentStress,
        currentCognitiveLoad: currentCognitiveLoad ?? 20,
        question,
        tactic,
        selectedEvidence,
        unlockedSecretIds
      });
    }

    const newSecretIds = [...unlockedSecretIds];
    if (turnResult.unlockedSecretId && !newSecretIds.includes(turnResult.unlockedSecretId)) {
      newSecretIds.push(turnResult.unlockedSecretId);
      const secretObj = suspect.hiddenSecrets.find((s) => s.id === turnResult.unlockedSecretId);
      showToast(`LIE EXPOSED: ${secretObj?.title || 'Contradiction found!'}`);
    }

    if (turnResult.verdict === 'CONFESSION' || turnResult.newStress >= suspect.breakdownThreshold) {
      playBreakdownSound();
    } else if (turnResult.isLying) {
      playLieSpikeSound();
    }

    const newTurn: InterrogationTurn = {
      id: `turn_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      question,
      tactic,
      evidenceUsedId: selectedEvidence?.id,
      suspectResponse: turnResult.generatedDialogue,
      internalThought: turnResult.internalThought,
      stressBefore: currentStress,
      stressAfter: turnResult.newStress,
      stressDelta: turnResult.stressDelta,
      cognitiveLoadBefore: currentCognitiveLoad ?? 20,
      cognitiveLoadAfter: turnResult.newCognitiveLoad,
      cognitiveLoadDelta: turnResult.cognitiveLoadDelta,
      biometrics: turnResult.biometrics,
      bodyLanguage: turnResult.bodyLanguage,
      isLying: turnResult.isLying,
      verdict: turnResult.verdict,
      unlockedSecretId: turnResult.unlockedSecretId
    };

    const nextTurnsLeft = gameState.turnsLeft - 1;
    const isBreakdown = turnResult.newStress >= suspect.breakdownThreshold;

    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentStress: turnResult.newStress,
        currentCognitiveLoad: turnResult.newCognitiveLoad,
        turnsLeft: nextTurnsLeft,
        transcript: [...prev.transcript, newTurn],
        unlockedSecretIds: newSecretIds,
        status: isBreakdown ? 'confessed' : nextTurnsLeft <= 0 ? 'time_up' : 'active'
      };
    });

    setSelectedEvidence(undefined);
    setIsSubmittingTurn(false);

    if (isBreakdown) {
      showToast('CONFESSION ACHIEVED: Suspect is breaking down and admitting the truth!');
    }
  };

  const handleSubmitIndictment = (verdict: 'guilty' | 'innocent' | 'accomplice') => {
    if (!gameState) return;
    setIsIndictmentModalOpen(false);

    const report = evaluateVerdict(
      gameState.suspect,
      verdict,
      gameState.unlockedSecretIds,
      gameState.transcript
    );

    setGameState((prev) => (prev ? { ...prev, status: 'closed', finalReport: report } : null));
    setScreen('report');
  };

  const handleRestartCurrentCase = () => {
    if (gameState) {
      startInterrogation(gameState.suspect);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] text-slate-100 flex flex-col relative font-mono selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      {/* CRT Scanline layer */}
      {isCrtEnabled && <div className="crt-overlay pointer-events-none" aria-hidden="true" />}

      {/* Toast Banner */}
      {toastNotice && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-bold shadow-lg flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 h-14 border-b border-slate-800 bg-[#111827]/95 backdrop-blur px-3 sm:px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          {screen !== 'select' && (
            <button
              onClick={() => {
                playClickSound();
                setScreen('select');
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-xs"
              aria-label="Back to Cases"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>CASES</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide text-sm md:text-base text-white">
              THE INTERROGATOR
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
              INTERVIEW ROOM 3
            </span>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          {gameState && screen === 'interrogation' && (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-[11px] text-slate-400">
                QUESTIONS LEFT: <strong className="text-emerald-400">{gameState.turnsLeft}</strong>
              </span>

              <button
                onClick={() => {
                  playClickSound();
                  setIsIndictmentModalOpen(true);
                }}
                className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>ACCUSE SUSPECT</span>
              </button>
            </div>
          )}

          {/* CRT scanlines toggle */}
          <button
            onClick={() => setIsCrtEnabled(!isCrtEnabled)}
            className={`p-1.5 rounded text-xs transition border ${
              isCrtEnabled
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Retro Screen Filter"
            aria-label="Toggle Retro Filter"
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-1.5 rounded text-xs transition border ${
              !audioMuted
                ? 'bg-slate-800 text-emerald-400 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={audioMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Audio"
          >
            {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Content Area: Smooth, scrollable layout so questions and options are never cut off */}
      <main className="flex-1 flex flex-col p-2 sm:p-4 pb-16 max-w-6xl w-full mx-auto">
        {screen === 'select' && (
          <CaseSelectScreen
            onSelectCase={startInterrogation}
            audioMuted={audioMuted}
            onToggleAudio={handleToggleAudio}
          />
        )}

        {screen === 'interrogation' && gameState && (
          <div className="flex flex-col gap-3 w-full">
            {/* Top Row: Suspect Profile (Left) + Retro Lie Detector (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 shrink-0">
              {/* Suspect Profile Card */}
              <div className="md:col-span-6">
                <SuspectHoloView
                  suspect={gameState.suspect}
                  stress={gameState.currentStress}
                  panicThreshold={gameState.suspect.panicThreshold}
                  breakdownThreshold={gameState.suspect.breakdownThreshold}
                  latestBodyLanguage={
                    gameState.transcript[gameState.transcript.length - 1]?.bodyLanguage
                  }
                  isLying={
                    gameState.transcript[gameState.transcript.length - 1]?.isLying
                  }
                />
              </div>

              {/* Retro Lie Detector Polygraph with Cognitive Load */}
              <div className="md:col-span-6">
                <BiometricMonitor
                  biometrics={
                    gameState.transcript[gameState.transcript.length - 1]?.biometrics ||
                    calculateBiometrics(
                      gameState.currentStress,
                      gameState.currentCognitiveLoad ?? 20,
                      gameState.suspect.baseHeartRate
                    )
                  }
                  stress={gameState.currentStress}
                  cognitiveLoad={gameState.currentCognitiveLoad ?? 20}
                  panicThreshold={gameState.suspect.panicThreshold}
                  breakdownThreshold={gameState.suspect.breakdownThreshold}
                />
              </div>
            </div>

            {/* Middle: Transcript Feed (Spacious, internal-scrolling log that never jumps) */}
            <div className="h-[290px] sm:h-[340px] w-full shrink-0">
              <TranscriptFeed
                transcript={gameState.transcript}
                suspectName={gameState.suspect.name}
                isSubmitting={isSubmittingTurn}
              />
            </div>

            {/* Bottom: Tactical Question Bar (Fully accessible, clearly visible) */}
            <div className="w-full shrink-0">
              <TacticalBar
                suspect={gameState.suspect}
                selectedEvidence={selectedEvidence}
                onClearEvidence={() => setSelectedEvidence(undefined)}
                onOpenEvidenceLocker={() => setIsEvidenceModalOpen(true)}
                onSubmitQuestion={handleQuestionSubmit}
                disabled={isSubmittingTurn || gameState.status !== 'active'}
              />
            </div>
          </div>
        )}

        {screen === 'report' && gameState && gameState.finalReport && (
          <ReportView
            report={gameState.finalReport}
            suspect={gameState.suspect}
            onRestartCase={handleRestartCurrentCase}
            onSelectNewCase={() => setScreen('select')}
            onReviewTranscript={() => setScreen('interrogation')}
          />
        )}
      </main>

      {/* Modals */}
      {gameState && (
        <>
          <EvidenceLockerModal
            isOpen={isEvidenceModalOpen}
            onClose={() => setIsEvidenceModalOpen(false)}
            evidenceList={gameState.suspect.evidenceList}
            unlockedSecretIds={gameState.unlockedSecretIds}
            onSelectEvidence={(ev) => {
              setSelectedEvidence(ev);
              showToast(`Clue Ready: ${ev.title}`);
            }}
            selectedEvidenceId={selectedEvidence?.id}
          />

          <IndictmentModal
            isOpen={isIndictmentModalOpen}
            onClose={() => setIsIndictmentModalOpen(false)}
            suspect={gameState.suspect}
            unlockedSecretIds={gameState.unlockedSecretIds}
            onSubmitIndictment={handleSubmitIndictment}
          />
        </>
      )}
    </div>
  );
}
