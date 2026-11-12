import React, { useState } from 'react';
import { UserPlus, Sparkles, X, Plus, Trash2 } from 'lucide-react';
import { SuspectProfile, Evidence } from '../types/interrogation';
import { playClickSound } from '../utils/audio';

interface CustomCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustomCase: (profile: SuspectProfile) => void;
}

export const CustomCaseModal: React.FC<CustomCaseModalProps> = ({
  isOpen,
  onClose,
  onCreateCustomCase
}) => {
  const [name, setName] = useState('Valerie Cross');
  const [alias, setAlias] = useState('The Broker');
  const [role, setRole] = useState('Black-Market Bio-Chip Dealer');
  const [guilt, setGuilt] = useState<'guilty' | 'innocent' | 'accomplice'>('guilty');
  const [crime, setCrime] = useState('Illegal distribution of military-grade neural hacking firmware');
  const [alibi, setAlibi] = useState('Was conducting legitimate biometric diagnostic tests at Sector 4 clinic');
  const [truth, setTruth] = useState('Sold the zero-day firmware directly to rogue operatives and wiped the sales ledger');
  const [panicThreshold, setPanicThreshold] = useState(70);
  const [weakPointsText, setWeakPointsText] = useState('Sector 4 clinic, sales ledger, encrypted comms, buyer identity');
  const [evidenceTitle, setEvidenceTitle] = useState('Encrypted Ledger Fragment');
  const [evidenceDesc, setEvidenceDesc] = useState('Corrupted flash chip found in subject’s coat pocket showing transaction pings');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    const weakPoints = weakPointsText
      .split(',')
      .map((w) => w.trim())
      .filter(Boolean);

    const customEvidence: Evidence[] = [
      {
        id: 'ev_custom_1',
        title: evidenceTitle || 'Recovered Physical Exhibit #A',
        category: 'document',
        description: evidenceDesc || 'Forensic artifact collected from suspect custody.',
        hint: 'Contradicts the stated alibi regarding presence and intent.',
        secretTriggerId: 'sec_custom_1'
      }
    ];

    const newProfile: SuspectProfile = {
      id: `custom_${Date.now()}`,
      name,
      job: role,
      crime,
      story: alibi,
      truth,
      guilt,
      personality: ['Calculating', 'Nervous', 'Evasive'],
      baseStress: 25,
      panicThreshold,
      breakdownThreshold: Math.min(100, panicThreshold + 18),
      baseHeartRate: 78,
      weakSpots: weakPoints.length > 0 ? weakPoints : ['the timeline', 'the evidence'],
      hiddenSecrets: [
        {
          id: 'sec_custom_1',
          title: 'Concealed Forensic Artifact',
          description: truth,
          unlocked: false,
          contradiction: 'Evidence directly shatters suspect alibi.',
          evidenceIdRequired: 'ev_custom_1'
        }
      ],
      evidenceList: customEvidence,
      difficulty: 'Hard'
    };

    onCreateCustomCase(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono animate-fade-in">
      <div className="bg-[#0b101c] border border-cyan-800 rounded-lg max-w-xl w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-900">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-cyber">
              CREATE CUSTOM SUSPECT DOSSIER
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

        <form onSubmit={handleCreate} className="space-y-4 my-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Suspect Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#070b13] border border-cyan-950 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Alias / Street Handle</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                required
                className="w-full bg-[#070b13] border border-cyan-950 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Role / Occupation</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full bg-[#070b13] border border-cyan-950 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Actual Judicial Guilt Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['guilty', 'accomplice', 'innocent'] as const).map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => {
                    playClickSound();
                    setGuilt(g);
                  }}
                  className={`p-2 rounded border uppercase font-bold text-center transition ${
                    guilt === g
                      ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200'
                      : 'border-slate-800 bg-[#070b13] text-slate-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Alleged Crime</label>
            <input
              type="text"
              value={crime}
              onChange={(e) => setCrime(e.target.value)}
              required
              className="w-full bg-[#070b13] border border-cyan-950 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Claimed Alibi (What they tell you)</label>
            <textarea
              rows={2}
              value={alibi}
              onChange={(e) => setAlibi(e.target.value)}
              required
              className="w-full bg-[#070b13] border border-cyan-950 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Hidden Truth (What actually happened)</label>
            <textarea
              rows={2}
              value={truth}
              onChange={(e) => setTruth(e.target.value)}
              required
              className="w-full bg-[#070b13] border border-cyan-950 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-400">Panic Threshold</label>
              <span className="text-cyan-400 font-bold">{panicThreshold}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={85}
              value={panicThreshold}
              onChange={(e) => setPanicThreshold(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              Weak Point Keywords (Comma-separated words that spike stress)
            </label>
            <input
              type="text"
              value={weakPointsText}
              onChange={(e) => setWeakPointsText(e.target.value)}
              className="w-full bg-[#070b13] border border-cyan-950 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Initial Evidence */}
          <div className="p-3 bg-[#070b13] rounded border border-cyan-950 space-y-2">
            <span className="text-cyan-400 font-bold text-[11px] block">
              INITIAL PIECE OF EVIDENCE
            </span>
            <input
              type="text"
              value={evidenceTitle}
              onChange={(e) => setEvidenceTitle(e.target.value)}
              placeholder="Evidence title..."
              className="w-full bg-[#050811] border border-slate-800 rounded p-1.5 text-slate-200"
            />
            <textarea
              rows={2}
              value={evidenceDesc}
              onChange={(e) => setEvidenceDesc(e.target.value)}
              placeholder="Evidence forensic description..."
              className="w-full bg-[#050811] border border-slate-800 rounded p-1.5 text-slate-200"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-cyan-950">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="px-4 py-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Arm Custom Interrogation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
