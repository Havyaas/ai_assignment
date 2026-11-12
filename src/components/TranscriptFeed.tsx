import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, ShieldAlert, Eye } from 'lucide-react';
import { InterrogationTurn } from '../types/interrogation';
import { playClickSound } from '../utils/audio';

interface TranscriptFeedProps {
  transcript: InterrogationTurn[];
  suspectName: string;
  isSubmitting?: boolean;
}

export const TranscriptFeed: React.FC<TranscriptFeedProps> = ({
  transcript,
  suspectName,
  isSubmitting
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [revealedThoughts, setRevealedThoughts] = useState<Record<string, boolean>>({});

  // Clean, non-jumping scroll that only scrolls the container and never the page
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [transcript.length, isSubmitting]);

  const toggleThought = (id: string) => {
    playClickSound();
    setRevealedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-[#131a29] border-2 border-slate-700 rounded-lg p-3 font-mono flex flex-col h-full overflow-hidden shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 text-xs uppercase tracking-wide">
            INTERVIEW TRANSCRIPT
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          QUESTIONS ASKED: <strong className="text-white">{transcript.length}</strong>
        </span>
      </div>

      {/* Transcript Log Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs"
      >
        {transcript.length === 0 ? (
          <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-center p-4 text-slate-400">
            <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">The suspect is sitting across the table.</p>
            <div className="text-[11px] text-slate-400 max-w-md mt-2 space-y-1">
              <p>Ask a question or confront them with evidence to test their story.</p>
              <p className="text-purple-300/90 text-[10px]">
                🧠 <strong className="text-purple-300">Emergent Mechanic:</strong> Ask them to recount backwards to overload their working memory if lying (their voice will turn hesitant and slow). Or <strong className="text-emerald-300">Speak Calmly</strong> to reduce stress and open up honest dialog.
              </p>
            </div>
          </div>
        ) : (
              transcript.map((turn, idx) => {
                const isConfession = turn.verdict === 'CONFESSION';
                const isLie = turn.verdict === 'LIE';
                const isNervous = turn.verdict === 'NERVOUS';
                const thoughtOpen = !!revealedThoughts[turn.id];

                // Emergent voice pacing styling
                const voicePacing = turn.biometrics?.voicePacing || 'Normal';
                const isHesitant = voicePacing === 'Hesitant & Slow';
                const isOverloaded = voicePacing === 'Stammering / Overloaded';
                const isConfident = voicePacing === 'Confident & Smooth';

                // Tactic badge
                let tacticLabel = '';
                let tacticBadgeClass = '';
                if (turn.tactic === 'reverse_story') {
                  tacticLabel = 'REVERSE TIMELINE';
                  tacticBadgeClass = 'bg-purple-950 text-purple-300 border-purple-800';
                } else if (turn.tactic === 'speak_calmly') {
                  tacticLabel = 'SPEAK CALMLY';
                  tacticBadgeClass = 'bg-emerald-950 text-emerald-300 border-emerald-800';
                } else if (turn.tactic === 'press') {
                  tacticLabel = 'PRESS HARDER';
                  tacticBadgeClass = 'bg-red-950 text-red-300 border-red-800';
                } else if (turn.tactic === 'friendly') {
                  tacticLabel = 'FRIENDLY';
                  tacticBadgeClass = 'bg-amber-950 text-amber-300 border-amber-800';
                }

                return (
                  <div
                    key={turn.id}
                    className={`p-3 rounded-lg border transition ${
                      isConfession
                        ? 'border-red-600 bg-red-950/30'
                        : isLie
                        ? 'border-red-900/60 bg-[#0c121e]'
                        : isNervous
                        ? 'border-amber-900/60 bg-[#0c121e]'
                        : 'border-slate-800 bg-[#0a0f1d]'
                    }`}
                  >
                    {/* Turn Header */}
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 mb-1.5 pb-1 border-b border-slate-800/80 gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">Q #{idx + 1}</span>
                        {tacticLabel && (
                          <span className={`px-1.5 py-0.2 rounded border font-semibold text-[9px] ${tacticBadgeClass}`}>
                            {tacticLabel}
                          </span>
                        )}
                        {turn.evidenceUsedId && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold text-[9px]">
                            CLUE CONFRONTED
                          </span>
                        )}
                      </div>

                      {/* Emergent Metric Deltas */}
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${turn.stressDelta >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          Stress: {turn.stressDelta >= 0 ? `+${turn.stressDelta}%` : `${turn.stressDelta}%`}
                        </span>
                        {typeof turn.cognitiveLoadDelta === 'number' && (
                          <span className={`font-semibold ${turn.cognitiveLoadDelta > 0 ? 'text-purple-400' : 'text-slate-400'}`}>
                            Cog Load: {turn.cognitiveLoadDelta >= 0 ? `+${turn.cognitiveLoadDelta}%` : `${turn.cognitiveLoadDelta}%`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* You asked */}
                    <div className="mb-2">
                      <span className="font-bold text-cyan-400 text-xs">YOU: </span>
                      <span className="text-slate-100">{turn.question}</span>
                    </div>

                    {/* Suspect replied */}
                    <div className="bg-[#060a12] p-2.5 rounded border border-slate-900">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-400 text-xs">
                            {suspectName.toUpperCase()}:
                          </span>

                          {/* Emergent Voice Pacing Tag */}
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border ${
                            isOverloaded
                              ? 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                              : isHesitant
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : isConfident
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}>
                            Voice: {voicePacing}
                          </span>
                        </div>

                        {/* Simple Lie Detector Stamp */}
                        <div>
                          {isConfession ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900 text-red-100 flex items-center gap-1 animate-pulse">
                              <ShieldAlert className="w-3 h-3 text-red-200" />
                              CONFESSION!
                            </span>
                          ) : isLie ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                              CAUGHT LYING
                            </span>
                          ) : isNervous ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                              NERVOUS / STUMBLING
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                              SEEMS TRUTHFUL
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-100 text-xs leading-relaxed font-sans">
                        "{turn.suspectResponse}"
                      </p>

                      {/* Body Language tell */}
                      {turn.bodyLanguage && (
                        <div className="mt-2 pt-1 border-t border-slate-900 text-[11px] text-slate-400 italic">
                          Tell: {turn.bodyLanguage}
                        </div>
                      )}

                      {/* What they're thinking */}
                      {turn.internalThought && (
                        <div className="mt-2 pt-1 border-t border-slate-900">
                          <button
                            onClick={() => toggleThought(turn.id)}
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
                          >
                            <Eye className="w-3 h-3" />
                            {thoughtOpen ? 'Hide thoughts' : "See what they're secretly thinking"}
                          </button>
                          {thoughtOpen && (
                            <div className="mt-1 p-2 rounded bg-indigo-950/40 border border-indigo-900/60 text-indigo-200 text-xs italic">
                              "{turn.internalThought}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
        )}

        {isSubmitting && (
          <div className="p-3 rounded-lg border border-cyan-800/60 bg-[#0c1626] animate-pulse flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold text-xs tracking-wide">
                {suspectName} is processing the question...
              </span>
            </div>
            <span className="text-[10px] text-cyan-400/80 font-mono tracking-wider">
              LIVE GEMINI 2.5 FLASH
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
