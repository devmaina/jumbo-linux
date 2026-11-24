# Jumbo-Linux-Kids

Gamified, interactive K–12 Linux learning web app featuring a simulated Bash terminal, 12 progressive missions, 8 terminal arcade games, keyboard training, and a real-time Cloud Firestore leaderboard.

## Core Features

- **Interactive Linux Terminal Simulator**: In-memory Virtual File System (VFS) supporting navigation (`pwd`, `ls`, `cd`), file operations (`touch`, `mkdir`, `cp`, `rm`), text pipelines (`cat`, `head`, `tail`, `grep`, `sort`, `cut`, `sed`, `|`, `>`), permissions (`chmod`), processes (`ps`, `top`, `kill`), tab completion, and 13-command history.
- **12 Guided K–12 Missions**: Progressive challenges from beginner shell basics to scripting, networking, and capstone tasks.
- **8 Terminal Arcade Games**: Matcher, Falling Keyboard Rescue, Duels, Folder Maze, Permission Lockpick, Process Zapper, Pipe Conductor, and Retro CLI.
- **Real-Time Student Sync**: Student profiles, XP, daily streaks, and Top 10 leaderboard powered by Cloud Firestore with local cache fallback.

---

## What's New for #BuildHybridAI 2026

Jumbo-Linux-Kids now includes **Hybrid AI Mentorship ("Ask Tux AI")** powered by **Firebase AI Logic** (`firebase` SDK `v12.18.0`, compatible with `v12.5.0+`), engineered to run strictly within the **Firebase Spark (free) plan**.

### How the Hybrid AI Architecture Works

1. **On-Device First (`InferenceMode.PREFER_ON_DEVICE`)**:
   - Implemented in `src/lib/firebaseAI.ts` using `getAI(app, { backend: new GoogleAIBackend() })` and `getGenerativeModel(ai, { mode: InferenceMode.PREFER_ON_DEVICE, ... })`.
   - When a student runs `ask <question>`, `tux <question>`, `explain <command>`, or clicks **Ask Tux** / **Ask Tux AI**, the SDK checks for Chrome's built-in on-device Gemini Nano model first for zero-latency, zero-cost local inference.
2. **Automatic Free-Tier Cloud Fallback (`gemini-2.5-flash`)**:
   - On browsers or devices without local Gemini Nano support, Firebase AI Logic automatically falls back to `gemini-2.5-flash` via `GoogleAIBackend` (no Blaze billing or Vertex AI required).
   - If Firebase environment variables are not configured or the device is offline, a built-in deterministic Linux guide handles the query seamlessly so core learning never breaks.
3. **Spark-Plan Cost & Abuse Protections**:
   - Compact prompts, capped output tokens (`maxOutputTokens: 220`), in-memory response caching, and in-flight request deduplication minimize token usage.
   - Optional **Firebase App Check** (`ReCaptchaV3Provider`) support protects the Gemini Developer API endpoint from unauthorized requests.
4. **Live Inference Source Badge**:
   - Every AI response displays a clean badge (`On-Device (Local)` or `Cloud Fallback`) right next to the output so students and demo viewers can immediately see where inference ran.

### Required Environment Variables

Configure these Vite environment variables locally in `.env` (see `.env.example`) or in your Vercel project settings:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_ID` *(optional, defaults to `(default)`)*
- `VITE_FIREBASE_MEASUREMENT_ID` *(optional)*
- `VITE_FIREBASE_RECAPTCHA_SITE_KEY` *(optional, enables Firebase App Check)*
- `VITE_FIREBASE_AI_MODEL` *(optional, defaults to `gemini-2.5-flash`)*

## Local Development

```bash
npm install
npm run dev
```
