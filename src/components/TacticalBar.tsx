import React, { useState } from 'react';
import { Send, Folder, X, MessageSquare, Clock, Smile, Flame, HeartHandshake } from 'lucide-react';
import { Evidence, SuspectProfile, TacticType } from '../types/interrogation';
import { playClickSound } from '../utils/audio';

interface TacticalBarProps {
  suspect: SuspectProfile;
  selectedEvidence?: Evidence;
  onClearEvidence: () => void;
  onOpenEvidenceLocker: () => void;
  onSubmitQuestion: (question: string, tactic: TacticType) => void;
  disabled?: boolean;
}

export const TacticalBar: React.FC<TacticalBarProps> = ({
  suspect,
  selectedEvidence,
  onClearEvidence,
  onOpenEvidenceLocker,
  onSubmitQuestion,
  disabled
}) => {
  const [questionText, setQuestionText] = useState('');
  const [selectedTactic, setSelectedTactic] = useState<TacticType>('speak_calmly');

  const tacticOptions: Array<{
    id: TacticType;
    label: string;
    icon: React.ReactNode;
    hint: string;
    badge: string;
  }> = [
    {
      id: 'speak_calmly',
      label: 'Speak Calmly',
      icon: <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />,
      hint: 'Lowers stress by 12% and calms heart rate',
      badge: 'Reduces Stress'
    },
    {
      id: 'normal',
      label: 'Normal Question',
      icon: <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />,
      hint: 'Standard inquiry',
      badge: 'Balanced'
    },
    {
      id: 'press',
      label: 'Press Harder',
      icon: <Flame className="w-3.5 h-3.5 text-red-400" />,
      hint: 'Pushes their stress up fast',
      badge: '+Stress Spike'
    },
    {
      id: 'reverse_story',
      label: 'Tell Story Backwards',
      icon: <Clock className="w-3.5 h-3.5 text-purple-400" />,
      hint: 'Overloads working memory if lying; voice stumbles',
      badge: '+Cognitive Load'
    },
    {
      id: 'friendly',
      label: 'Be Friendly',
      icon: <Smile className="w-3.5 h-3.5 text-amber-400" />,
      hint: 'Lowers guard to reveal hidden background',
      badge: 'Lowers Guard'
    }
  ];

  // Dynamic quick questions tailored uniquely to the suspect AND the selected tactic
  const getDynamicQuickQuestions = (): string[] => {
    // If evidence is armed, show evidence-specific questions
    if (selectedEvidence) {
      if (selectedEvidence.id === 'ev_waiter') {
        return [
          "The rooftop waiter testified that you disappeared from your table between 10:05 PM and 11:00 PM!",
          "Why did the waiter say your table was completely empty for nearly an hour?"
        ];
      }
      if (selectedEvidence.id === 'ev_keycard') {
        return [
          "Your personal manager keycard swiped into the vault at 10:22 PM. Explain that!",
          "Electronic vault logs don't lie. Why did you use your manager keycard during dinner?"
        ];
      }
      if (selectedEvidence.id === 'ev_video') {
        return [
          "Security camera shows a man in your grey suit fleeing down the fire escape with a duffel bag!",
          "That's your suit on the fire escape video at 10:28 PM, Marcus. Where were you taking that bag?"
        ];
      }
      if (selectedEvidence.id === 'ev_earring') {
        return [
          "Your custom gold pearl earring was found right behind Uncle Arthur's poisoned cognac decanter!",
          "You claim you never left your bedroom, but your earring was dropped behind the bar cabinet!"
        ];
      }
      if (selectedEvidence.id === 'ev_receipt') {
        return [
          "We have the store receipt showing you bought concentrated rat poison three days ago!",
          "Explain why you purchased the exact same chemical found in Arthur's hospital toxicology report!"
        ];
      }
      if (selectedEvidence.id === 'ev_texts') {
        return [
          "Debt collectors were threatening to seize everything you own unless you paid $250,000 by Monday!",
          "You needed Uncle Arthur's inheritance money immediately to avoid total bankruptcy!"
        ];
      }
      if (selectedEvidence.id === 'ev_ropes') {
        return [
          "Your wrist ropes were tied with loose slipknots and you had zero struggle marks or bruises!",
          "Why did the robbers tie your ropes loosely enough that you could untie yourself easily?"
        ];
      }
      if (selectedEvidence.id === 'ev_audio') {
        return [
          "We found the threatening voicemail on your phone: 'Open the bank door or you won't see your brother Leo again!'",
          "Bobby, who is Leo? Did the robbers kidnap your little brother?!"
        ];
      }
      if (selectedEvidence.id === 'ev_alarm_log') {
        return [
          "You entered your standard guard PIN to disarm the alley door without tripping the silent emergency alarm!",
          "Why didn't you punch in the silent 911 alert code when the robbers entered?"
        ];
      }

      return [
        `How do you explain this ${selectedEvidence.title}?`,
        `This ${selectedEvidence.title} contradicts your story. Tell me the truth!`
      ];
    }

    // SPEAK CALMLY TACTIC (Relieves stress for all suspects)
    if (selectedTactic === 'speak_calmly') {
      if (suspect.id === 'case_marcus') {
        return [
          "Take a breath, Marcus. I'm here to listen calmly. Tell me what happened at the gallery in your own words.",
          "I know running a high-end gallery carries immense pressure. Let's talk reasonably."
        ];
      }
      if (suspect.id === 'case_victoria') {
        return [
          "Take a breath, Victoria. I understand your head is pounding. Let's speak calmly about Uncle Arthur.",
          "Nobody is shouting here. Tell me what you observed calmly when you were upstairs."
        ];
      }
      if (suspect.id === 'case_bobby') {
        return [
          "Breathe easy, Bobby. You are safe in this room. Tell me calmly what you experienced tonight.",
          "Take your time, Bobby. I want to hear your side without any threats or pressure."
        ];
      }
    }

    // TELL STORY BACKWARDS (Overloads cognitive working memory)
    if (selectedTactic === 'reverse_story') {
      if (suspect.id === 'case_marcus') {
        return [
          "Start from when the police sirens arrived at midnight and walk me backwards hour by hour.",
          "What were you doing at 10:20 PM, right before you returned to your table?"
        ];
      }
      if (suspect.id === 'case_victoria') {
        return [
          "Tell me what you did right before Arthur collapsed, in reverse step by step.",
          "Where were you standing 10 minutes before the evening toast?"
        ];
      }
      if (suspect.id === 'case_bobby') {
        return [
          "Start from when the police cut your ropes and tell me what happened in reverse.",
          "Where were the armed men standing right before the vault opened?"
        ];
      }
    }

    // PRESS HARDER
    if (selectedTactic === 'press') {
      if (suspect.id === 'case_marcus') {
        return [
          "We know you owe half a million in debt, Marcus. Where is the sapphire necklace?!",
          "Your red sports car was seen speeding away at 10:35 PM. Cut the act!",
          "You're lying about staying at the dinner table all night. Who helped you?"
        ];
      }
      if (suspect.id === 'case_victoria') {
        return [
          "Uncle Arthur was cutting you out of his will, wasn't he?!",
          "We found lethal rat poison in Arthur's decanter. Where did you buy it?!",
          "Your story about reading upstairs with tea is a complete fabrication!"
        ];
      }
      if (suspect.id === 'case_bobby') {
        return [
          "You disarmed the alley security door from the inside! You let the robbers in!",
          "Two million dollars vanished on your watch. Stop holding back and start talking!",
          "Your knots were slipknots. You were working with the robbery crew!"
        ];
      }
    }

    // BE FRIENDLY
    if (selectedTactic === 'friendly') {
      if (suspect.id === 'case_marcus') {
        return [
          "Marcus, you're a respected art dealer. Did someone pressure you into this?",
          "If you made a bad choice due to money trouble, telling us now will help you in court."
        ];
      }
      if (suspect.id === 'case_victoria') {
        return [
          "Victoria, family dinners can be exhausting. Did an argument get out of hand?",
          "Were you feeling desperate because of your debt collectors? Help me understand."
        ];
      }
      if (suspect.id === 'case_bobby') {
        return [
          "Bobby, you have a clean record. Are you protecting someone you love?",
          "Were you or your family threatened tonight, Bobby? Talk to me."
        ];
      }
    }

    // NORMAL INQUIRY
    if (suspect.id === 'case_marcus') {
      return [
        "Where were you between 10:00 PM and 11:00 PM during the gala?",
        "Did you access the gallery vault at any point tonight?",
        "Who can verify your rooftop dinner alibi besides yourself?"
      ];
    }
    if (suspect.id === 'case_victoria') {
      return [
        "What time did you go up to the guest room with your headache?",
        "Did you pour or touch any of Uncle Arthur's drinks tonight?",
        "When was the last time you spoke with Uncle Arthur?"
      ];
    }
    if (suspect.id === 'case_bobby') {
      return [
        "What exact time did the armed robbers arrive at the bank?",
        "Why did you use your standard PIN instead of the silent alarm code?",
        "Did the robbers say anything specific or call anyone by name?"
      ];
    }

    return [
      "Where were you when the crime happened?",
      "Can anyone confirm your story?",
      "Are you telling me the whole truth?"
    ];
  };

  const handleSend = () => {
    const trimmed = questionText.trim();
    if (!trimmed || disabled) return;
    playClickSound();
    onSubmitQuestion(trimmed, selectedTactic);
    setQuestionText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#131a29] border-2 border-slate-700 rounded-lg p-3 font-mono shadow-md w-full">
      {/* Question Style Selector */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">HOW YOU ASK:</span>
        {tacticOptions.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              playClickSound();
              setSelectedTactic(t.id);
            }}
            disabled={disabled}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition border ${
              selectedTactic === t.id
                ? 'bg-slate-800 text-white border-emerald-400 font-bold shadow-sm'
                : 'bg-[#0a0f1d] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={t.hint}
          >
            {t.icon}
            <span>{t.label}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">
              {t.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Evidence Banner */}
      {selectedEvidence && (
        <div className="mb-2 p-1.5 px-2.5 rounded bg-amber-950/40 border border-amber-600/80 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">CLUE READY:</span>
            <span className="text-white font-medium">{selectedEvidence.title}</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClearEvidence();
            }}
            className="p-1 text-slate-400 hover:text-red-400"
            title="Remove clue"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Case-Specific Quick Questions */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-slate-400">QUICK QUESTIONS:</span>
        {getDynamicQuickQuestions().slice(0, 3).map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => {
              playClickSound();
              setQuestionText(q);
            }}
            className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition text-left truncate max-w-sm"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onOpenEvidenceLocker();
          }}
          disabled={disabled}
          className={`px-3 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
            selectedEvidence
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
              : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
          }`}
        >
          <Folder className="w-4 h-4 text-amber-400" />
          <span>{selectedEvidence ? 'CLUE READY' : 'PICK CLUE'}</span>
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              selectedEvidence
                ? `Ask ${suspect.name} about ${selectedEvidence.title}...`
                : `Type your question for ${suspect.name}...`
            }
            className="w-full bg-[#0a0f1d] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !questionText.trim()}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 transition shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{disabled ? 'WAIT...' : 'ASK'}</span>
        </button>
      </div>
    </div>
  );
};
