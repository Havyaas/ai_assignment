import React from 'react';
import { Folder, FileText, CheckCircle2, X, HelpCircle } from 'lucide-react';
import { Evidence } from '../types/interrogation';
import { playClickSound, playEvidenceSlamSound } from '../utils/audio';

interface EvidenceLockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceList: Evidence[];
  unlockedSecretIds: string[];
  onSelectEvidence: (evidence: Evidence) => void;
  selectedEvidenceId?: string;
}

export const EvidenceLockerModal: React.FC<EvidenceLockerModalProps> = ({
  isOpen,
  onClose,
  evidenceList,
  unlockedSecretIds,
  onSelectEvidence,
  selectedEvidenceId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono animate-fade-in">
      <div className="bg-[#131a29] border-2 border-slate-600 rounded-lg max-w-xl w-full p-4 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white uppercase">
                CASE EVIDENCE & CLUES
              </h3>
              <p className="text-[11px] text-slate-400">
                Choose a clue to show to the suspect to catch them in a lie.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evidence List */}
        <div className="overflow-y-auto py-3 space-y-3 flex-1 pr-1">
          {evidenceList.map((item) => {
            const isSelected = selectedEvidenceId === item.id;
            const alreadyUsed = item.secretTriggerId && unlockedSecretIds.includes(item.secretTriggerId);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-lg border transition ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-950/30'
                    : 'border-slate-800 bg-[#0a0f1d] hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-slate-800 text-amber-400">
                      <FileText className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Type: {item.category}
                      </span>
                    </div>
                  </div>

                  {alreadyUsed ? (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      LIE EXPOSED!
                    </span>
                  ) : null}
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-2 p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Why it matters: {item.hint}</span>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      playEvidenceSlamSound();
                      onSelectEvidence(item);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                      isSelected
                        ? 'bg-emerald-500 text-black'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {isSelected ? 'SELECTED FOR NEXT QUESTION' : 'USE THIS EVIDENCE'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
