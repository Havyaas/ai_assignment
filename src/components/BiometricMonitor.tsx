import React, { useEffect, useRef } from 'react';
import { Heart, Mic, Activity, AlertCircle, Brain } from 'lucide-react';
import { Biometrics } from '../types/interrogation';
import { playHeartbeatPulse } from '../utils/audio';

interface BiometricMonitorProps {
  biometrics: Biometrics;
  stress: number;
  cognitiveLoad: number;
  panicThreshold: number;
  breakdownThreshold: number;
}

export const BiometricMonitor: React.FC<BiometricMonitorProps> = ({
  biometrics,
  stress,
  cognitiveLoad,
  panicThreshold,
  breakdownThreshold
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const offsetRef = useRef<number>(0);
  const lastPulseRef = useRef<number>(0);

  // Play heartbeat pulse sound
  useEffect(() => {
    const intervalMs = Math.max(380, Math.min(1200, (60 / biometrics.heartRate) * 1000));
    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastPulseRef.current > intervalMs * 0.9) {
        lastPulseRef.current = now;
        playHeartbeatPulse(biometrics.heartRate);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [biometrics.heartRate]);

  // Retro polygraph paper line simulation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    const height = (canvas.height = 55);

    const render = () => {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(75, 85, 99, 0.25)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 14) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Needle line color
      let lineColor = '#10b981'; // Green
      if (stress >= breakdownThreshold) {
        lineColor = '#ef4444'; // Red
      } else if (stress >= panicThreshold || cognitiveLoad >= 70) {
        lineColor = '#f59e0b'; // Amber
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      offsetRef.current += (biometrics.heartRate / 60) * 2;
      const centerY = height / 2;

      for (let x = 0; x < width; x++) {
        const cycle = ((x + offsetRef.current) % 120) / 120;
        let yOffset = 0;

        if (cycle > 0.45 && cycle < 0.5) {
          yOffset = -20 * Math.sin(((cycle - 0.45) / 0.05) * Math.PI);
        } else if (cycle >= 0.5 && cycle < 0.55) {
          yOffset = 7 * Math.sin(((cycle - 0.5) / 0.05) * Math.PI);
        }

        // Add jitter if suspect is stressed or cognitively overloaded
        if (stress > 45 || cognitiveLoad > 50) {
          yOffset += (Math.random() - 0.5) * Math.max((stress - 40) * 0.15, (cognitiveLoad - 40) * 0.15);
        }

        const y = centerY + yOffset;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [biometrics.heartRate, stress, cognitiveLoad, panicThreshold, breakdownThreshold]);

  let stressLabel = 'CALM';
  let stressTagBg = 'bg-emerald-950 text-emerald-300 border-emerald-700';
  if (stress >= breakdownThreshold) {
    stressLabel = 'BREAKING DOWN!';
    stressTagBg = 'bg-red-950 text-red-300 border-red-600 animate-pulse';
  } else if (stress >= panicThreshold) {
    stressLabel = 'SWEATING / PANICKING';
    stressTagBg = 'bg-amber-950 text-amber-300 border-amber-600 animate-pulse';
  } else if (stress >= 45) {
    stressLabel = 'NERVOUS';
    stressTagBg = 'bg-yellow-950 text-yellow-300 border-yellow-700';
  }

  // Cognitive load state label
  let cogLabel = 'Low (Effortless)';
  let cogColor = 'text-purple-300';
  let cogBarBg = 'bg-purple-500';
  if (cognitiveLoad >= 75) {
    cogLabel = 'OVERLOADED (Hesitant / Stumbling!)';
    cogColor = 'text-red-400 font-bold';
    cogBarBg = 'bg-red-500 animate-pulse';
  } else if (cognitiveLoad >= 50) {
    cogLabel = 'High Strain (Hesitant & Slow)';
    cogColor = 'text-amber-300 font-bold';
    cogBarBg = 'bg-amber-500';
  }

  return (
    <div className="bg-[#131a29] border-2 border-slate-700 rounded-lg p-3 text-xs font-mono shadow-md flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wide">
            RETRO LIE DETECTOR (POLYGRAPH)
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${stressTagBg}`}>
          {stressLabel}
        </span>
      </div>

      {/* Stress Meter */}
      <div className="mb-2 bg-[#0a0f1d] p-2 rounded border border-slate-800">
        <div className="flex justify-between items-center mb-1">
          <span className="text-slate-300 font-semibold text-[11px]">PSYCHOLOGICAL STRESS</span>
          <span className="text-xs font-bold text-white">{Math.round(stress)}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800 relative">
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
            style={{ left: `${panicThreshold}%` }}
            title="Panic Threshold"
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: `${breakdownThreshold}%` }}
            title="Confession Threshold"
          />
          <div
            className={`h-full transition-all duration-300 ${
              stress >= breakdownThreshold
                ? 'bg-red-500'
                : stress >= panicThreshold
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${stress}%` }}
          />
        </div>
      </div>

      {/* NEW: Cognitive Load Bar */}
      <div className="mb-2 bg-[#0a0f1d] p-2 rounded border border-purple-900/40">
        <div className="flex justify-between items-center mb-1">
          <span className="text-purple-300 font-semibold flex items-center gap-1.5 text-[11px]">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>COGNITIVE LOAD (WORKING MEMORY)</span>
          </span>
          <span className={`text-xs ${cogColor}`}>{Math.round(cognitiveLoad)}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${cogBarBg}`}
            style={{ width: `${cognitiveLoad}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] mt-1 text-slate-400">
          <span>Mental Strain: <strong className={cogColor}>{cogLabel}</strong></span>
          <span className="text-slate-500 text-[9px]">Spikes on Reverse Timeline</span>
        </div>
      </div>

      {/* Polygraph Paper Scrolling Needle */}
      <div className="rounded overflow-hidden border border-slate-800 mb-2">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      {/* Pulse, Voice Shakiness & Voice Pacing */}
      <div className="grid grid-cols-3 gap-1.5 text-[11px]">
        {/* Pulse */}
        <div className="bg-[#0a0f1d] p-2 rounded border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">PULSE</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-sm font-bold ${biometrics.heartRate > 115 ? 'text-red-400' : 'text-slate-100'}`}>
                {biometrics.heartRate}
              </span>
              <span className="text-[9px] text-slate-500">BPM</span>
            </div>
          </div>
          <Heart className={`w-4 h-4 ${biometrics.heartRate > 115 ? 'text-red-500 animate-ping' : 'text-rose-400'}`} />
        </div>

        {/* Voice Tremor */}
        <div className="bg-[#0a0f1d] p-2 rounded border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">VOICE TREMOR</span>
            <span className={`text-[11px] font-bold block mt-0.5 truncate ${
              biometrics.voiceTremor === 'Cracking / Stuttering'
                ? 'text-red-400'
                : biometrics.voiceTremor === 'Noticeably Shaky'
                ? 'text-amber-400'
                : 'text-slate-200'
            }`}>
              {biometrics.voiceTremor}
            </span>
          </div>
          <Mic className="w-4 h-4 text-indigo-400 shrink-0" />
        </div>

        {/* Voice Pacing */}
        <div className="bg-[#0a0f1d] p-2 rounded border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 uppercase block font-semibold">PACING</span>
            <span className={`text-[11px] font-bold block mt-0.5 truncate ${
              biometrics.voicePacing === 'Stammering / Overloaded'
                ? 'text-red-400 font-bold'
                : biometrics.voicePacing === 'Hesitant & Slow'
                ? 'text-amber-300'
                : 'text-emerald-300'
            }`}>
              {biometrics.voicePacing}
            </span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {stress >= panicThreshold && (
        <div className="mt-2 p-1.5 rounded bg-red-950/50 border border-red-800 flex items-center gap-1.5 text-[10px] text-red-200 font-semibold animate-pulse">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>
            {stress >= breakdownThreshold
              ? 'SUSPECT IS BREAKING DOWN! READY TO CONFESS!'
              : 'PANIC THRESHOLD SURPASSED! PRESS FOR ADMISSIONS!'}
          </span>
        </div>
      )}
    </div>
  );
};
