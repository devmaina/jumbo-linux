import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check';
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
  InferenceSource,
  GenerativeModel,
  AI,
} from 'firebase/ai';
import firebaseAppletConfig from '../../firebase-applet-config.json';

export type AIExecutionSource = 'on_device' | 'cloud_fallback' | 'local_offline';

export interface HybridAIResult {
  text: string;
  source: AIExecutionSource;
  model: string;
  cached?: boolean;
}

export interface TuxPromptContext {
  levelNumber?: number;
  levelTitle?: string;
  currentObjective?: string;
  objectiveHint?: string;
  mascotTip?: string;
  currentPath?: string;
  lastCommand?: string;
}

const DEFAULT_CLOUD_MODEL = import.meta.env.VITE_FIREBASE_AI_MODEL || 'gemini-2.5-flash';
const MAX_CACHE_ENTRIES = 30;

const TUX_SYSTEM_INSTRUCTION =
  'You are Tux the Penguin, a friendly K-12 Linux terminal mentor inside Jumbo-Linux-Kids. ' +
  'Keep every answer kid-friendly, safe, encouraging, and concise (2 to 3 short sentences max). ' +
  'Use simple words, avoid long markdown walls, and give 1 concrete Linux command example when helpful.';

interface ResolvedEnvConfig extends FirebaseOptions {
  recaptchaSiteKey?: string;
}

function resolveEnvFirebaseConfig(): ResolvedEnvConfig {
  const env = import.meta.env;
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || '',
    appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || '',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId || '',
    recaptchaSiteKey: env.VITE_FIREBASE_RECAPTCHA_SITE_KEY || firebaseAppletConfig.recaptchaSiteKey || '',
  };
}

export function isFirebaseAIConfigured(): boolean {
  const cfg = resolveEnvFirebaseConfig();
  return Boolean(cfg.apiKey && cfg.projectId && cfg.appId);
}

let appCheckInstance: AppCheck | null = null;
let appCheckInitialized = false;
let aiInstance: AI | null = null;
let hybridModelInstance: GenerativeModel | null = null;

const responseCache = new Map<string, HybridAIResult>();
const inFlightRequests = new Map<string, Promise<HybridAIResult>>();

function getOrInitApp(): FirebaseApp | null {
  const cfg = resolveEnvFirebaseConfig();
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) {
    return null;
  }

  const firebaseOptions: FirebaseOptions = {
    apiKey: cfg.apiKey,
    authDomain: cfg.authDomain,
    projectId: cfg.projectId,
    storageBucket: cfg.storageBucket,
    messagingSenderId: cfg.messagingSenderId,
    appId: cfg.appId,
    ...(cfg.measurementId ? { measurementId: cfg.measurementId } : {}),
  };

  return getApps().length > 0 ? getApp() : initializeApp(firebaseOptions);
}

function ensureAppCheck(app: FirebaseApp): void {
  if (appCheckInitialized || typeof window === 'undefined') return;
  appCheckInitialized = true;

  const { recaptchaSiteKey } = resolveEnvFirebaseConfig();
  if (!recaptchaSiteKey) return;

  try {
    if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN === 'true') {
      (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (err) {
    console.warn('Firebase App Check skipped:', err);
  }
}

export function getHybridGenerativeModel(): GenerativeModel | null {
  if (hybridModelInstance) return hybridModelInstance;

  const app = getOrInitApp();
  if (!app) return null;

  ensureAppCheck(app);

  if (!aiInstance) {
    // GoogleAIBackend works on the Firebase Spark (free) plan without Blaze billing
    aiInstance = getAI(app, {
      backend: new GoogleAIBackend(),
    });
  }

  hybridModelInstance = getGenerativeModel(aiInstance, {
    mode: InferenceMode.PREFER_ON_DEVICE,
    onDeviceParams: {
      createOptions: {
        expectedInputs: [{ type: 'text', languages: ['en'] }],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
      },
    },
    inCloudParams: {
      model: DEFAULT_CLOUD_MODEL,
      systemInstruction: TUX_SYSTEM_INSTRUCTION,
      generationConfig: {
        maxOutputTokens: 220,
        temperature: 0.4,
      },
    },
  });

  return hybridModelInstance;
}

const BUILTIN_COMMAND_GUIDES: Record<string, string> = {
  whoami: '`whoami` prints your active Linux username so you always know which account you are using.',
  pwd: '`pwd` stands for Print Working Directory — it shows the exact folder path where you are standing right now.',
  ls: '`ls` lists the files and folders inside your current directory. Try `ls -la` to also see hidden dot-files!',
  cd: '`cd <folder>` moves you into another folder. Use `cd ..` to go back up one folder or `cd ~` to go home.',
  cat: '`cat <file>` reads a text file and prints all of its contents right into the terminal.',
  echo: '`echo <text>` prints words onto the screen — super handy for messages and shell scripts!',
  touch: '`touch <filename>` creates a brand-new empty file in your current directory.',
  mkdir: '`mkdir <folder>` creates a brand-new directory (folder) to keep your files organized.',
  grep: '`grep <word> <file>` searches through a file and highlights every line that matches your word.',
  chmod: '`chmod +x <script.sh>` adds execute permission so Linux lets you run the script as a program.',
  ps: '`ps` shows running processes (programs) and their PID numbers so you can monitor what is active.',
  top: '`top` opens a live system monitor showing CPU usage, memory, and running tasks.',
  tree: '`tree` draws a neat branching map of all folders and files inside your current directory.',
  cowsay: '`cowsay <message>` draws a friendly ASCII cow speaking your message in the terminal!',
  which: '`which <command>` shows the exact folder path where a Linux program lives (like `/bin/bash`).',
  history: '`history` prints the recent commands you typed so you can review or reuse them fast.',
  alias: '`alias short=\'command\'` creates your own custom shortcut nickname for longer commands.',
  uname: '`uname -a` displays your Linux operating system and kernel details.',
  df: '`df -h` checks how much disk space is used and available in human-readable sizes.',
  head: '`head -n 3 <file>` shows just the first 3 lines of a file instead of the whole thing.',
  wc: '`wc -l <file>` counts how many lines, words, or characters are inside a file.',
  sort: '`sort <file>` arranges lines of text alphabetically from A to Z.',
  cut: '`cut` slices out specific columns from text lines, great for structured files.',
  sed: '`sed` finds and replaces text patterns cleanly right inside a stream or file.',
  find: '`find . -name "*.sh"` searches folders recursively to locate files matching a pattern.',
  curl: '`curl <url>` fetches data from a web address straight into your terminal.',
  tar: '`tar -czvf archive.tar.gz <file>` bundles and compresses files into a `.tar.gz` archive.',
  ssh: '`ssh user@host` opens a secure encrypted terminal session to another computer.',
  python3: '`python3` runs Python code directly from your Linux shell!',
};

function buildOfflineTuxGuide(question: string, context?: TuxPromptContext): string {
  const lower = question.toLowerCase();

  for (const [cmd, explanation] of Object.entries(BUILTIN_COMMAND_GUIDES)) {
    const regex = new RegExp(`\\b${cmd}\\b`, 'i');
    if (regex.test(lower)) {
      return `🐧 ${explanation}`;
    }
  }

  if (context?.objectiveHint || context?.currentObjective) {
    const parts: string[] = [];
    if (context.currentObjective) {
      parts.push(`🎯 Current goal: ${context.currentObjective}`);
    }
    if (context.objectiveHint) {
      parts.push(`💡 ${context.objectiveHint}`);
    }
    if (context.mascotTip) {
      parts.push(`🐧 ${context.mascotTip}`);
    }
    return parts.join('\n');
  }

  return (
    '🐧 Tip: Try `pwd` to see where you are, `ls` to peek inside the folder, ' +
    'or `tasks` to check your current mission steps!'
  );
}

function buildCompactPrompt(question: string, context?: TuxPromptContext): string {
  const lines: string[] = [
    'Answer as Tux the Penguin (K-12 Linux coach) in 2-3 short, friendly sentences.',
  ];

  if (context?.levelNumber !== undefined && context?.levelTitle) {
    lines.push(`Mission ${context.levelNumber}: ${context.levelTitle}`);
  }
  if (context?.currentObjective) {
    lines.push(`Current step: ${context.currentObjective}`);
  }
  if (context?.currentPath) {
    lines.push(`Working folder: ${context.currentPath}`);
  }
  if (context?.lastCommand) {
    lines.push(`Recent command: ${context.lastCommand}`);
  }

  lines.push(`Student question: ${question.trim().slice(0, 300)}`);
  return lines.join('\n');
}

function cacheResult(key: string, result: HybridAIResult): void {
  if (responseCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, result);
}

/**
 * Queries Firebase AI Logic using InferenceMode.PREFER_ON_DEVICE (Chrome Gemini Nano first,
 * automatic cloud fallback to free-tier Gemini 2.5 Flash via GoogleAIBackend), with a safe
 * deterministic offline fallback if Firebase env vars are missing or the network is unavailable.
 */
export async function askTuxHybridAI(
  question: string,
  context?: TuxPromptContext
): Promise<HybridAIResult> {
  const cleanQuestion = question.trim() || 'Explain my current Linux mission step simply.';
  const cacheKey = `${context?.levelNumber ?? 0}|${context?.currentObjective ?? ''}|${cleanQuestion.toLowerCase()}`;

  const cached = responseCache.get(cacheKey);
  if (cached) {
    return { ...cached, cached: true };
  }

  const pending = inFlightRequests.get(cacheKey);
  if (pending) {
    return pending;
  }

  const execution = (async (): Promise<HybridAIResult> => {
    const model = getHybridGenerativeModel();
    if (!model) {
      return {
        text: buildOfflineTuxGuide(cleanQuestion, context),
        source: 'local_offline',
        model: 'tux-offline-guide',
      };
    }

    try {
      const prompt = buildCompactPrompt(cleanQuestion, context);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      if (!responseText) {
        return {
          text: buildOfflineTuxGuide(cleanQuestion, context),
          source: 'local_offline',
          model: 'tux-offline-guide',
        };
      }

      const isOnDevice = result.response.inferenceSource === InferenceSource.ON_DEVICE;
      const aiResult: HybridAIResult = {
        text: responseText,
        source: isOnDevice ? 'on_device' : 'cloud_fallback',
        model: isOnDevice ? 'gemini-nano (on-device)' : DEFAULT_CLOUD_MODEL,
      };

      cacheResult(cacheKey, aiResult);
      return aiResult;
    } catch (err) {
      console.warn('Hybrid AI fallback to built-in Tux guide:', err);
      return {
        text: buildOfflineTuxGuide(cleanQuestion, context),
        source: 'local_offline',
        model: 'tux-offline-guide',
      };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, execution);
  return execution;
}

export function getAppCheckInstance(): AppCheck | null {
  return appCheckInstance;
}
