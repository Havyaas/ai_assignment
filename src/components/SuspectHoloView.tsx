import React from 'react';
import { User, Eye, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SuspectProfile } from '../types/interrogation';

interface SuspectHoloViewProps {
  suspect: SuspectProfile;
  stress: number;
  panicThreshold: number;
  breakdownThreshold: number;
  latestBodyLanguage?: string;
  isLying?: boolean;
}

export const SuspectHoloView: React.FC<SuspectHoloViewProps> = ({
  suspect,
  stress,
  panicThreshold,
  breakdownThreshold,
  latestBodyLanguage,
  isLying
}) => {
  const isBreakdown = stress >= breakdownThreshold;
  const isPanic = stress >= panicThreshold;

  return (
    <div className="bg-[#131a29] border-2 border-slate-700 rounded-lg p-3 text-xs font-mono shadow-md flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">SUSPECT FILE</span>
          <h2 className="text-base font-bold text-white">{suspect.name}</h2>
          <span className="text-[11px] text-emerald-400">{suspect.job}</span>
        </div>

        {/* Lie detector quick stamp */}
        {isLying !== undefined && (
          <div>
            {isLying ? (
              <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                CAUGHT LYING
              </span>
            ) : (
              <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SEEMS TRUTHFUL
              </span>
            )}
          </div>
        )}
      </div>

      {/* Retro Mugshot / Sketch Area */}
      <div className="my-2.5 bg-[#0a0f1d] border border-slate-800 rounded p-3 flex items-center gap-3">
        {/* Avatar icon */}
        <div
          className={`w-20 h-20 rounded-md border-2 flex items-center justify-center shrink-0 ${
            isBreakdown
              ? 'border-red-500 bg-red-950/40 animate-pulse'
              : isPanic
              ? 'border-amber-500 bg-amber-950/30'
              : 'border-slate-600 bg-slate-900'
          }`}
        >
          <User
            className={`w-12 h-12 ${
              isBreakdown ? 'text-red-400' : isPanic ? 'text-amber-400' : 'text-slate-300'
            }`}
          />
        </div>

        {/* Suspect Quick Bio */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Accused of:</span>
          <p className="text-xs text-slate-200 line-clamp-2 leading-snug">{suspect.crime}</p>

          <div className="flex flex-wrap gap-1 mt-1.5">
            {suspect.personality.map((trait, i) => (
              <span
                key={i}
                className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Body Language Tell */}
      <div className="bg-[#0a0f1d] p-2.5 rounded border border-slate-800 mb-2">
        <div className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] mb-1">
          <Eye className="w-3.5 h-3.5" />
          <span>WHAT YOU NOTICE (BODY LANGUAGE):</span>
        </div>
        <p className="text-slate-200 text-xs italic leading-relaxed">
          "{latestBodyLanguage || 'Sitting upright, hands resting quietly, waiting for your next question.'}"
        </p>
      </div>

      {/* Their Stated Alibi */}
      <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px]">
        <span className="text-slate-400 font-bold block uppercase text-[10px]">What they claim happened:</span>
        <p className="text-slate-300 mt-0.5 leading-snug">{suspect.story}</p>
      </div>
    </div>
  );
};
