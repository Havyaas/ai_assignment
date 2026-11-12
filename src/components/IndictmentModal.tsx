import React, { useState } from 'react';
import { Gavel, X, AlertTriangle } from 'lucide-react';
import { SuspectProfile } from '../types/interrogation';
import { playClickSound, playEvidenceSlamSound } from '../utils/audio';

interface IndictmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  suspect: SuspectProfile;
  unlockedSecretIds: string[];
  onSubmitIndictment: (verdict: 'guilty' | 'innocent' | 'accomplice') => void;
}

export const IndictmentModal: React.FC<IndictmentModalProps> = ({
  isOpen,
  onClose,
  suspect,
  unlockedSecretIds,
  onSubmitIndictment
}) => {
  const [selectedVerdict, setSelectedVerdict] = useState<'guilty' | 'innocent' | 'accomplice'>('guilty');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fade-in">
      <div className="bg-[#131a29] border-2 border-slate-600 rounded-lg max-w-md w-full p-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase">
              MAKE YOUR FINAL ACCUSATION
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suspect Recap */}
        <div className="my-3 p-3 bg-[#0a0f1d] rounded border border-slate-800 text-xs">
          <div className="text-slate-300 mb-1">
            <span className="text-slate-500 uppercase font-semibold">SUSPECT: </span>
            <strong className="text-white">{suspect.name}</strong> ({suspect.job})
          </div>
          <div className="text-slate-400 text-[11px]">
            Lies Caught with Evidence: <strong className="text-emerald-400">{unlockedSecretIds.length}</strong> of {suspect.hiddenSecrets.length}
          </div>
        </div>

        {/* Verdict choices */}
        <div className="my-3">
          <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
            WHAT IS YOUR FINAL CALL?
          </label>
          <div className="space-y-2">
            {[
              {
                id: 'guilty',
                title: 'GUILTY',
                desc: 'They planned and committed the crime directly.'
              },
              {
                id: 'accomplice',
                title: 'ACCOMPLICE',
                desc: 'They helped or were forced into helping the real criminals.'
              },
              {
                id: 'innocent',
                title: 'INNOCENT',
                desc: 'They had nothing to do with it and should be released.'
              }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedVerdict(opt.id as any);
                }}
                className={`w-full p-2.5 rounded-lg border text-left transition ${
                  selectedVerdict === opt.id
                    ? 'border-emerald-400 bg-emerald-950/40'
                    : 'border-slate-800 bg-[#0a0f1d] hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-white">{opt.title}</div>
                <div className="text-[11px] text-slate-400">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() => {
              playEvidenceSlamSound();
              onSubmitIndictment(selectedVerdict);
            }}
            className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5"
          >
            <Gavel className="w-4 h-4" />
            <span>SUBMIT FINAL CALL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
