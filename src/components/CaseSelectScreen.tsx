import React from 'react';
import { Shield, Play, Volume2, VolumeX, Folder, Sparkles } from 'lucide-react';
import { CASE_FILES } from '../game/cases';
import { SuspectProfile } from '../types/interrogation';
import { playClickSound } from '../utils/audio';

interface CaseSelectScreenProps {
  onSelectCase: (profile: SuspectProfile) => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const CaseSelectScreen: React.FC<CaseSelectScreenProps> = ({
  onSelectCase,
  audioMuted,
  onToggleAudio
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-mono animate-fade-in text-slate-200">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-400 font-bold mb-2">
          <span>POLICE HEADQUARTERS // INTERVIEW ROOM 3</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide mb-2">
          THE INTERROGATOR
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Interview suspects sitting across the table. Watch their heart rate and voice shakiness on the retro polygraph lie detector, catch their lies with evidence, and make them confess!
        </p>

        {/* Global Controls */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={() => {
              playClickSound();
              onToggleAudio();
            }}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
          >
            {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{audioMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
          </button>
        </div>
      </div>

      {/* Case Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {CASE_FILES.map((c) => (
          <div
            key={c.id}
            className="bg-[#131a29] border-2 border-slate-700 hover:border-emerald-500 rounded-xl p-5 flex flex-col justify-between transition-all shadow-md group"
          >
            <div>
              {/* Top tag */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-amber-300 border border-slate-700">
                  {c.difficulty} Difficulty
                </span>
                <span className="text-[10px] text-slate-400">
                  {c.evidenceList.length} Clues Available
                </span>
              </div>

              {/* Suspect Title */}
              <div className="my-2">
                <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  {c.name}
                </h2>
                <span className="text-xs text-emerald-400 font-semibold">{c.job}</span>
              </div>

              {/* Crime */}
              <div className="p-2.5 rounded bg-[#0a0f1d] border border-slate-800 my-2 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">The Crime:</span>
                <p className="text-slate-200 mt-0.5 leading-snug">{c.crime}</p>
              </div>

              {/* What they claim */}
              <div className="p-2.5 rounded bg-[#0a0f1d] border border-slate-800 my-2 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Their Alibi (Story):</span>
                <p className="text-slate-300 mt-0.5 leading-snug italic">{c.story}</p>
              </div>

              {/* Personality traits */}
              <div className="flex flex-wrap gap-1 my-2">
                {c.personality.map((trait, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => {
                playClickSound();
                onSelectCase(c);
              }}
              className="w-full mt-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>INTERROGATE SUSPECT</span>
            </button>
          </div>
        ))}
      </div>

      {/* 3 Simple Rules */}
      <div className="bg-[#131a29] border-2 border-slate-700 rounded-xl p-4 text-xs text-slate-300">
        <h4 className="font-bold text-white uppercase mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          HOW TO PLAY (3 EASY STEPS):
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed text-slate-300">
          <div className="p-2.5 bg-[#0a0f1d] rounded border border-slate-800">
            <strong className="text-emerald-400 block mb-0.5">1. Watch the Lie Detector</strong>
            Check their Pulse (BPM) and Voice status. If they are lying or you ask about a sensitive spot, their stress will climb!
          </div>
          <div className="p-2.5 bg-[#0a0f1d] rounded border border-slate-800">
            <strong className="text-amber-400 block mb-0.5">2. Show Evidence</strong>
            Click "Pick Clue" to confront them with photos, keycards, or receipts. Matching evidence shatters their alibi instantly!
          </div>
          <div className="p-2.5 bg-[#0a0f1d] rounded border border-slate-800">
            <strong className="text-cyan-400 block mb-0.5">3. Push for a Confession</strong>
            Push their stress to 90%+ and they will break down and confess the whole truth. When you're ready, make your final accusation call!
          </div>
        </div>
      </div>
    </div>
  );
};
