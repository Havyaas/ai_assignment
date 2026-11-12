# NEURAL BREACH: The Cognitive Interrogator 🔍⚡

A cyber-noir cognitive interrogation room simulation that puts you in the detective's chair. Track hidden emotional parameters, monitor real-time biometric stress and cognitive load, present crime-scene evidence, and break down suspects using scientifically-grounded interrogation methodologies.

Powered by **Google Gemini AI** (`@google/genai`) with real-time dynamic persona roleplaying and a zero-latency fallback engine.

---

## 🌟 Key Features

### 1. 🧠 Dynamic Cognitive Load & Stress Architecture
- **Cognitive Load Theory in Deception**: Lying requires immense mental effort. Asking suspects to recount their timeline in reverse (*Reverse Storytelling*) overloads deceptive subjects with cognitive strain (+25% to +40% load), triggering stammering, hesitations, and contradictions. Innocent subjects recall episodic memory effortlessly.
- **Biometric Telemetry Engine**: Live simulated cardiovascular, autonomic, and ocular readouts:
  - **ECG Heart Rate Waveform**: Canvas-rendered real-time pulse matching stress spikes (60–160+ BPM).
  - **Galvanic Skin Response (GSR)**: Electrodermal conductance tracking sweat gland autonomic arousal.
  - **Pupil Dilation & Micro-tremor**: Ocular dilation and physiological tremors during acute pressure.
  - **Respiratory Rate**: Breathing rhythms reacting to tension and relaxation.

### 2. 🎯 Tactical Interrogation Matrix
Execute distinct psychological tactics to dismantle fabricated alibis:
- **Press Harder**: Direct aggressive confrontation to spike stress and breach composure.
- **Speak Calmly**: De-escalate and build rapport to lower defensive guards, easing cognitive load and encouraging candid cooperation.
- **Reverse Story**: Challenge the suspect to recount events backwards, exposing temporal inconsistencies and cognitive bottlenecks in fabricated stories.
- **Present Evidence**: Pull physical documents, surveillance video, phone logs, and forensic receipts from the Evidence Locker to corner the suspect with irrefutable contradictions.

### 3. 📁 Case Files & Custom Case Builder
- **Marcus Cole (Easy)**: Art gallery director accused of stealing the $4M *Midnight Star* Sapphire Necklace. Claims a rooftop dinner alibi.
- **Victoria Vance (Medium)**: Cold socialite heiress accused of poisoning her uncle's vintage cognac with strychnine. Claims an upstairs migraine.
- **Bobby Rivera (Hard)**: Night bank guard who disarmed security doors for armed robbers. A nuanced coerced accomplice case with family hostage stakes.
- **Custom Case Creator**: Build custom suspect dossiers with customized alibis, hidden truths, specific guilt states (Guilty, Innocent, Accomplice), weak spots, and multi-tier evidence items.

### 4. ⚖️ Indictment & Judicial Review
- Deliver your final verdict: **Guilty**, **Innocent**, or **Coerced Accomplice**.
- Get evaluated by the District Attorney Review system on:
  - Verdict accuracy
  - Contradictions exposed
  - Efficiency (turns remaining out of 12)
  - Suspect mental state at conclusion (Breakdown vs. Composed)
  - Final Detective Rank (S / A / B / C / F)

### 5. 🎨 Cyber-Noir Terminal Aesthetics
- CRT scanline filter and chromatic aberration toggle.
- Synthesized Web Audio sound effects (ECG beeps, lie-detection alarm spikes, mental breakdown alarms).
- Holographic suspect view with dynamic visual status indicators and expressive body language observations.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
- **Backend**: Node.js, Express, Vite middleware.
- **AI Engine**: `@google/genai` (Google Gemini 2.5 Flash / Gemini 3.8 Flash).
- **Audio & Visuals**: HTML5 Canvas ECG monitor, Web Audio API sound synthesis, retro CRT effects.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- *(Optional)* Gemini API Key (app automatically falls back to an intelligent local heuristic rule engine if no API key is provided).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/neural-breach.git
   cd neural-breach
Install dependencies:
Bash
npm install
Configure Environment Variables:
Copy .env.example to .env:
Bash
cp .env.example .env
Add your Gemini API Key:
Env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
Run the Development Server:
Bash
npm run dev
Open http://localhost:3000 in your browser.
Build for Production:
Bash
npm run build
npm start
🕹️ How to Play
Select a Case File from the headquarters terminal (Marcus, Victoria, or Bobby).
Review the Dossier: Study the suspect's background, claimed alibi, and known weak spots.
Inspect the Evidence Locker: Examine receipts, surveillance tapes, witness testimonies, and phone logs.
Conduct the Interview:
Type custom questions or pick tactical inquiry lines.
Attach relevant evidence to expose lies when the suspect makes a contradictory statement.
Watch the Biometric Monitor and observe Body Language tells.
Indict: Once you've broken their story or run out of turns, bring down the gavel and submit the charges.
📄 License
MIT License. Free for educational, portfolio, and gaming use.
Code
The file has also been saved directly to `/README.md` in your project repository.
Checkpoint
give me in text
Gemini 3.8 Flash
Ran for 8s
NEURAL BREACH: The Cognitive Interrogator 🔍⚡
A cyber-noir cognitive interrogation room simulation that puts you in the detective's chair. Track hidden emotional parameters, monitor real-time biometric stress and cognitive load, present crime-scene evidence, and break down suspects using scientifically-grounded interrogation methodologies.
Powered by Google Gemini AI (@google/genai) with real-time dynamic persona roleplaying and a zero-latency fallback engine.
🌟 Key Features
1. 🧠 Dynamic Cognitive Load & Stress Architecture
Cognitive Load Theory in Deception: Lying requires immense mental effort. Asking suspects to recount their timeline in reverse (Reverse Storytelling) overloads deceptive subjects with cognitive strain (+25% to +40% load), triggering stammering, hesitations, and contradictions. Innocent subjects recall episodic memory effortlessly.
Biometric Telemetry Engine: Live simulated cardiovascular, autonomic, and ocular readouts:
ECG Heart Rate Waveform: Canvas-rendered real-time pulse matching stress spikes (60–160+ BPM).
Galvanic Skin Response (GSR): Electrodermal conductance tracking sweat gland autonomic arousal.
Pupil Dilation & Micro-tremor: Ocular dilation and physiological tremors during acute pressure.
Respiratory Rate: Breathing rhythms reacting to tension and relaxation.
2. 🎯 Tactical Interrogation Matrix
Execute distinct psychological tactics to dismantle fabricated alibis:
Press Harder: Direct aggressive confrontation to spike stress and breach composure.
Speak Calmly: De-escalate and build rapport to lower defensive guards, easing cognitive load and encouraging candid cooperation.
Reverse Story: Challenge the suspect to recount events backwards, exposing temporal inconsistencies and cognitive bottlenecks in fabricated stories.
Present Evidence: Pull physical documents, surveillance video, phone logs, and forensic receipts from the Evidence Locker to corner the suspect with irrefutable contradictions.
3. 📁 Case Files & Custom Case Builder
Marcus Cole (Easy): Art gallery director accused of stealing the $4M "Midnight Star" Sapphire Necklace. Claims a rooftop dinner alibi.
Victoria Vance (Medium): Cold socialite heiress accused of poisoning her uncle's vintage cognac with strychnine. Claims an upstairs migraine.
Bobby Rivera (Hard): Night bank guard who disarmed security doors for armed robbers. A nuanced coerced accomplice case with family hostage stakes.
Custom Case Creator: Build custom suspect dossiers with customized alibis, hidden truths, specific guilt states (Guilty, Innocent, Accomplice), weak spots, and multi-tier evidence items.
4. ⚖️ Indictment & Judicial Review
Deliver your final verdict: Guilty, Innocent, or Coerced Accomplice.
Get evaluated by the District Attorney Review system on:
Verdict accuracy
Contradictions exposed
Efficiency (turns remaining out of 12)
Suspect mental state at conclusion (Breakdown vs. Composed)
Final Detective Rank (S / A / B / C / F)
5. 🎨 Cyber-Noir Terminal Aesthetics
CRT scanline filter and chromatic aberration toggle.
Synthesized Web Audio sound effects (ECG beeps, lie-detection alarm spikes, mental breakdown alarms).
Holographic suspect view with dynamic visual status indicators and expressive body language observations.
🛠️ Tech Stack
Frontend: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
Backend: Node.js, Express, Vite middleware.
AI Engine: @google/genai (Google Gemini 2.5 Flash / Gemini 3.8 Flash).
Audio & Visuals: HTML5 Canvas ECG monitor, Web Audio API sound synthesis, retro CRT effects.
🚀 Getting Started
Prerequisites
Node.js (v18+ recommended)
npm or yarn
(Optional) Gemini API Key (app automatically falls back to an intelligent local heuristic rule engine if no API key is provided).
Installation
Clone the repository:
git clone https://github.com/your-username/neural-breach.git
cd neural-breach
Install dependencies:
npm install
Configure Environment Variables:
Copy .env.example to .env:
cp .env.example .env
Add your Gemini API Key:
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
Run the Development Server:
npm run dev
Open http://localhost:3000 in your browser.
Build for Production:
npm run build
npm start
🕹️ How to Play
Select a Case File from the headquarters terminal (Marcus, Victoria, or Bobby).
Review the Dossier: Study the suspect's background, claimed alibi, and known weak spots.
Inspect the Evidence Locker: Examine receipts, surveillance tapes, witness testimonies, and phone logs.
Conduct the Interview:
Type custom questions or pick tactical inquiry lines.
Attach relevant evidence to expose lies when the suspect makes a contradictory statement.
Watch the Biometric Monitor and observe Body Language tells.
Indict: Once you've broken their story or run out of turns, bring down the gavel and submit the charges.
