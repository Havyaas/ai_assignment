import React from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, MessageSquare } from 'lucide-react';
import { IndictmentReport, SuspectProfile } from '../types/interrogation';
import { playClickSound } from '../utils/audio';

interface ReportViewProps {
  report: IndictmentReport;
  suspect: SuspectProfile;
  onRestartCase: () => void;
  onSelectNewCase: () => void;
  onReviewTranscript: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  suspect,
  onRestartCase,
  onSelectNewCase,
  onReviewTranscript
}) => {
  return (
    <div className="max-w-2xl mx-auto p-4 font-mono animate-fade-in text-slate-200">
      <div className="bg-[#131a29] border-2 border-slate-700 rounded-xl p-5 md:p-6 shadow-2xl">
        {/* Banner */}
        <div className="text-center pb-4 mb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 uppercase font-semibold mb-2">
            <span>POLICE DEPARTMENT // CASE CLOSED</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {report.isCorrect ? 'CASE SOLVED!' : 'WRONG CALL!'}
          </h1>

          <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border bg-slate-900 border-slate-700">
            RATING: <span className={report.isCorrect ? 'text-emerald-400' : 'text-amber-400'}>{report.rating}</span>
          </div>
        </div>

        {/* Verdict Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-[#0a0f1d] rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">YOUR ACCUSATION</span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {report.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-base font-bold text-white uppercase">
                {report.selectedVerdict}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#0a0f1d] rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">ACTUAL REALITY</span>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className="text-base font-bold text-emerald-400 uppercase">
                {report.actualGuilt}
              </span>
            </div>
          </div>
        </div>

        {/* Feedback paragraph */}
        <p className="text-xs text-slate-300 leading-relaxed bg-[#0a0f1d] p-3 rounded border border-slate-800 mb-4">
          {report.feedback}
        </p>

        {/* Simple Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-[#0a0f1d] p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">LIES EXPOSED</span>
            <span className="text-sm font-bold text-emerald-400">{report.secretsFound} / {report.totalSecrets}</span>
          </div>
          <div className="bg-[#0a0f1d] p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">CONFESSION?</span>
            <span className={`text-sm font-bold ${report.gotConfession ? 'text-emerald-400' : 'text-slate-400'}`}>
              {report.gotConfession ? 'YES!' : 'NO'}
            </span>
          </div>
          <div className="bg-[#0a0f1d] p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">SCORE</span>
            <span className="text-sm font-bold text-amber-400">{report.score} pts</span>
          </div>
        </div>

        {/* What really happened */}
        <div className="bg-[#0a0f1d] p-3.5 rounded-lg border border-slate-800 mb-5">
          <span className="text-xs font-bold text-amber-400 uppercase block mb-1">
            WHAT REALLY HAPPENED (THE TRUTH):
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {suspect.truth}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              playClickSound();
              onReviewTranscript();
            }}
            className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Read Transcript</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onRestartCase();
              }}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onSelectNewCase();
              }}
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5"
            >
              <span>Choose Another Case</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
