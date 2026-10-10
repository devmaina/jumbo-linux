export type GradeBand = 'elementary' | 'middle' | 'high_early' | 'high_advanced';

export type ChallengeType = 
  | 'faq_intro'
  | 'file_tree_puzzle'
  | 'typing_rescue'
  | 'terminal_nav'
  | 'file_ops'
  | 'pipes_streams'
  | 'permissions'
  | 'text_manipulation'
  | 'process_mgmt'
  | 'bash_scripting'
  | 'ctf_security'
  | 'arcade'
  | 'network_archive';

export interface Objective {
  id: string;
  description: string;
  commandPattern?: string; // regex or exact command match
  completed: boolean;
  hint: string;
}

export interface LevelInfo {
  levelNumber: number; // 0 to 12
  title: string;
  subtitle: string;
  grade: string; // e.g. "Kindergarten", "3rd - 4th Grade", etc.
  gradeBand: GradeBand;
  iconName: string;
  color: string; // Tailwind color theme
  mascotTip: string;
  story: string;
  theory: string[];
  type: ChallengeType;
  starterCommands?: string[];
  suggestedPills: string[];
  objectives: {
    id: string;
    description: string;
    targetCheck: string; // verification identifier
    hint: string;
  }[];
  xpReward: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  levelRequired?: number;
  category?: 'curriculum' | 'arcade' | 'milestone';
  unlockedAt?: string;
  color: string;
}

export interface UserProgress {
  currentLevel: number;
  unlockedLevels: number[]; // e.g. [0, 1]
  completedLevels: number[];
  xp: number;
  streakDays: number;
  lastActiveDate?: string; // YYYY-MM-DD local calendar date
  longestStreak?: number; // Highest consecutive days record
  activeDates?: string[]; // Log of distinct YYYY-MM-DD active days
  badges: string[]; // badge IDs
  commandsRunCount: number;
  rescueHighScore: number;
  duelsWon: number;
}

export interface VFSNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  permissions: string; // e.g. "rwxr-xr-x"
  owner: string;
  size: number;
  children?: { [key: string]: VFSNode };
}

export interface TerminalOutputItem {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'system';
  text: string;
  path?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  badgeCount: number;
  isCurrentUser?: boolean;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface StudentProfile {
  id: string;
  name: string;
  authType: 'built_in_email' | 'parent_gmail' | 'no_email';
  email: string; // e.g. "jayden@jumbolinux.kids" or "parent@gmail.com"
  pin: string; // 4-character PIN
  school: string; // School name (e.g. "Oak Creek Elementary")
  dreamCareer: string; // What they want to be when they grow up (e.g. "Astronaut 🚀")
  grade: string;
  avatar: string; // emoji e.g. "🐘", "🐧", "🚀", "🦊"
  difficulty?: DifficultyLevel; // 'beginner' | 'intermediate' | 'advanced'
  createdAt: string;
  lastActiveAt?: string;
  progress: UserProgress;
}

// Alias for backwards compatibility
export type CadetProfile = StudentProfile;

export interface LinuxFact {
  id: string;
  fact: string;
  source: string; // e.g. "Linux for Dummies", "Space Tech", "Movie Magic"
  funIcon: string;
  kidTakeaway: string;
}

export interface LinuxQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
