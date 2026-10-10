import { LevelInfo, Badge, LeaderboardEntry } from '../types';

export const LEVELS: LevelInfo[] = [
  {
    levelNumber: 1,
    title: 'Hello, Explorer!',
    subtitle: 'Start Small: whoami, echo, which & clear',
    grade: 'Kindergarten - 2nd Grade',
    gradeBand: 'elementary',
    iconName: 'Zap',
    color: 'blue',
    mascotTip: 'The terminal is a magic prompt! Ask who you are, make it speak, and see where commands live.',
    story: 'Welcome to your first Linux terminal! Let us ask the system our explorer identity, make it echo greetings, check where commands are located, and clean our screen.',
    theory: [
      '"whoami": Prints your active explorer username.',
      '"echo hello": Makes the computer print words right to your screen.',
      '"which bash": Locates where an executable command lives on the filesystem.',
      '"clear": Wipes your screen clean and fresh.'
    ],
    type: 'typing_rescue',
    suggestedPills: ['whoami', 'echo hello', 'which bash', 'clear'],
    objectives: [
      {
        id: 'obj_1_1',
        description: 'Find your explorer name: type "whoami" and press Enter!',
        targetCheck: 'whoami',
        hint: 'Type "whoami" and press Enter!'
      },
      {
        id: 'obj_1_2',
        description: 'Make the computer speak: type "echo hello" and press Enter!',
        targetCheck: 'echo',
        hint: 'Type "echo hello" and press Enter!'
      },
      {
        id: 'obj_1_3',
        description: 'Find a command location: type "which bash" and press Enter!',
        targetCheck: 'which',
        hint: 'Type "which bash" and press Enter!'
      }
    ],
    xpReward: 120
  },
  {
    levelNumber: 2,
    title: 'The View Finder: Media & Graphics',
    subtitle: 'Viewing Images, Videos & Music with feh, chafa & mpv',
    grade: '2nd - 3rd Grade',
    gradeBand: 'elementary',
    iconName: 'Play',
    color: 'emerald',
    mascotTip: 'Terminals can display art, photos, and play music! "feh" and "chafa" render graphics, while "mpv" streams media.',
    story: 'Who said terminals are only black and white text? Let us view our mascot Tux in ASCII art using feh and chafa, and cue up a triumphant retro synth track with mpv!',
    theory: [
      '"feh media/tux.png": Opens an image viewer in the terminal.',
      '"chafa media/tux.png": Renders full high-res ASCII/Unicode art of any picture.',
      '"mpv media/anthem.mp3": Plays audio, sounds, or media streams directly from shell.'
    ],
    type: 'file_ops',
    suggestedPills: ['feh media/tux.png', 'chafa media/tux.png', 'mpv media/anthem.mp3'],
    objectives: [
      {
        id: 'obj_2_1',
        description: 'View the Tux mascot picture: type "feh media/tux.png" and press Enter!',
        targetCheck: 'feh',
        hint: 'Type "feh media/tux.png" and press Enter!'
      },
      {
        id: 'obj_2_2',
        description: 'Render ASCII picture art: type "chafa media/tux.png" and press Enter!',
        targetCheck: 'chafa',
        hint: 'Type "chafa media/tux.png" and press Enter!'
      },
      {
        id: 'obj_2_3',
        description: 'Play music in the shell: type "mpv media/anthem.mp3" and press Enter!',
        targetCheck: 'mpv',
        hint: 'Type "mpv media/anthem.mp3" and press Enter!'
      }
    ],
    xpReward: 150
  },
  {
    levelNumber: 3,
    title: 'Fun Shell Creatures & Trees',
    subtitle: 'The Non-Native Gang: tree, cowsay & fortune',
    grade: '3rd - 4th Grade',
    gradeBand: 'elementary',
    iconName: 'Sparkles',
    color: 'amber',
    mascotTip: 'Linux has an incredible sense of humor and wonder! "cowsay" and "fortune" bring smiles, while "tree" maps out all folders.',
    story: 'Meet the friendliest utilities in open source! Let the cow deliver your messages, receive wisdom from the fortune teller, and generate a visual map of the entire directory tree.',
    theory: [
      '"tree": Visualizes all folders and nested files in a branching tree diagram.',
      '"cowsay message": Draws a talking cow with a custom speech bubble.',
      '"fortune": Quotes random wisdom, kid-friendly jokes, and fun facts.'
    ],
    type: 'terminal_nav',
    suggestedPills: ['tree', 'cowsay "Linux is awesome"', 'fortune'],
    objectives: [
      {
        id: 'obj_3_1',
        description: 'Draw the directory tree: type "tree" and press Enter!',
        targetCheck: 'tree',
        hint: 'Type "tree" and press Enter!'
      },
      {
        id: 'obj_3_2',
        description: 'Make the cow speak: type "cowsay Linux is awesome" and press Enter!',
        targetCheck: 'cowsay',
        hint: 'Type "cowsay Linux is awesome" and press Enter!'
      },
      {
        id: 'obj_3_3',
        description: 'Get a fortune cookie: type "fortune" and press Enter!',
        targetCheck: 'fortune',
        hint: 'Type "fortune" and press Enter!'
      }
    ],
    xpReward: 160
  },
  {
    levelNumber: 4,
    title: 'Filesystem Architect: Folders & Blueprints',
    subtitle: 'Building Structures: mkdir -p, touch, file & tree',
    grade: '4th - 5th Grade',
    gradeBand: 'middle',
    iconName: 'FolderPlus',
    color: 'sky',
    mascotTip: 'Every great builder plans their folders! Use "mkdir -p" to craft nested directories, "touch" to create empty files, and "file" to discover what kind of data lives inside.',
    story: 'Time to become a Linux system architect! You have been granted a blank workspace. Build your robotics workshop with nested folders using mkdir -p, forge new blueprint files with touch, and inspect file formats with the file utility.',
    theory: [
      '"mkdir -p lab/gadgets": Creates parent and child directories in a single command.',
      '"touch lab/gadgets/laser.txt": Generates a brand new file with current timestamps.',
      '"file lab/gadgets/laser.txt": Detects whether a file contains plain ASCII text, binary code, or media.',
      '"tree lab": Displays your newly crafted folder architecture in full branches.'
    ],
    type: 'file_ops',
    suggestedPills: ['mkdir -p lab/gadgets', 'touch lab/gadgets/laser.txt', 'file lab/gadgets/laser.txt', 'tree lab'],
    objectives: [
      {
        id: 'obj_4_1',
        description: 'Construct nested folders: type "mkdir -p lab/gadgets" and press Enter!',
        targetCheck: 'mkdir',
        hint: 'Type "mkdir -p lab/gadgets" and press Enter!'
      },
      {
        id: 'obj_4_2',
        description: 'Craft a blueprint file: type "touch lab/gadgets/laser.txt" and press Enter!',
        targetCheck: 'touch',
        hint: 'Type "touch lab/gadgets/laser.txt" and press Enter!'
      },
      {
        id: 'obj_4_3',
        description: 'Inspect the file type: type "file lab/gadgets/laser.txt" and press Enter!',
        targetCheck: 'file',
        hint: 'Type "file lab/gadgets/laser.txt" and press Enter!'
      }
    ],
    xpReward: 180
  },
  {
    levelNumber: 5,
    title: 'The Magic Pipes & Redirection: Data Streams',
    subtitle: 'Connecting Tools: >, >>, | and wc -l',
    grade: '5th - 6th Grade',
    gradeBand: 'middle',
    iconName: 'Workflow',
    color: 'teal',
    mascotTip: 'The Unix philosophy: Write small tools that do one thing well, and connect them together with the pipe "|" and output arrows ">" and ">>" like LEGO bricks!',
    story: 'Welcome to the magic stream station! In Linux, you do not need huge monolithic programs. Instead, you send output into files with > and >>, and channel data straight from one tool into another with the pipe | operator.',
    theory: [
      '"echo \'Star Alpha\' > star.txt": Redirects output to create or overwrite a file.',
      '"echo \'Star Beta\' >> star.txt": Appends new lines to the bottom of the file without overwriting.',
      '"cat star.txt | wc -l": Streams the file into the word/line counter to tally entries.',
      '"cat animals.txt | grep Penguin | wc -l": Chains multiple commands together in a powerful pipeline.'
    ],
    type: 'pipes_streams',
    suggestedPills: ['echo "Star Alpha" > star.txt', 'echo "Star Beta" >> star.txt', 'cat star.txt | wc -l', 'cat star.txt'],
    objectives: [
      {
        id: 'obj_5_1',
        description: 'Redirect text to a new file: type "echo \\"Star Alpha\\" > star.txt" and press Enter!',
        targetCheck: 'redirection',
        hint: 'Type "echo \\"Star Alpha\\" > star.txt" and press Enter!'
      },
      {
        id: 'obj_5_2',
        description: 'Append another entry: type "echo \\"Star Beta\\" >> star.txt" and press Enter!',
        targetCheck: 'redirect_append',
        hint: 'Type "echo \\"Star Beta\\" >> star.txt" and press Enter!'
      },
      {
        id: 'obj_5_3',
        description: 'Count items using a pipe: type "cat star.txt | wc -l" and press Enter!',
        targetCheck: 'wc',
        hint: 'Type "cat star.txt | wc -l" and press Enter!'
      }
    ],
    xpReward: 200
  },
  {
    levelNumber: 6,
    title: 'Coreutils Gang I: Navigation & Reading',
    subtitle: 'The Core Utilities: pwd, ls, cd & cat',
    grade: '5th - 6th Grade',
    gradeBand: 'middle',
    iconName: 'Compass',
    color: 'orange',
    mascotTip: '"pwd" gives your coordinates, "ls" lists files, "cd" moves through folders, and "cat" prints text.',
    story: 'Enter the heart of standard Linux core utilities! Master the commands that every software engineer, cloud architect, and astronaut relies on every day.',
    theory: [
      '"pwd": Print working directory.',
      '"ls -l": Detailed listing showing files and metadata.',
      '"cd folder": Change into another directory.',
      '"cat mission.txt": Displays file contents directly.'
    ],
    type: 'terminal_nav',
    suggestedPills: ['pwd', 'ls -l', 'cd recipes', 'cat mission.txt'],
    objectives: [
      {
        id: 'obj_6_1',
        description: 'Check your coordinates: type "pwd" and press Enter!',
        targetCheck: 'pwd',
        hint: 'Type "pwd" and press Enter!'
      },
      {
        id: 'obj_6_2',
        description: 'List files with details: type "ls -l" and press Enter!',
        targetCheck: 'ls_l',
        hint: 'Type "ls -l" and press Enter!'
      },
      {
        id: 'obj_6_3',
        description: 'Read the mission note: type "cat mission.txt" and press Enter!',
        targetCheck: 'cat',
        hint: 'Type "cat mission.txt" and press Enter!'
      }
    ],
    xpReward: 220
  },
  {
    levelNumber: 7,
    title: 'Coreutils Gang II: File Ops & Permissions',
    subtitle: 'cp, mv, rm, chmod & chown',
    grade: '6th - 7th Grade',
    gradeBand: 'middle',
    iconName: 'Hammer',
    color: 'indigo',
    mascotTip: 'Copy blueprints with cp, rename with mv, clean up with rm, and unlock execute permissions with chmod +x!',
    story: 'Become a file craftsman! Duplicate files with cp, relocate them with mv, clear temporary debris with rm, and grant executable rights to scripts with chmod.',
    theory: [
      '"cp source dest": Copies a file.',
      '"mv old new": Moves or renames a file.',
      '"rm file": Removes a file safely.',
      '"chmod +x play.sh": Adds executable permissions to a script.',
      '"chown user file": Changes owner of a file.'
    ],
    type: 'permissions',
    suggestedPills: ['cp note.txt note_backup.txt', 'chmod +x play.sh', 'ls -l play.sh'],
    objectives: [
      {
        id: 'obj_7_1',
        description: 'Create a backup copy: type "cp note.txt note_backup.txt" and press Enter!',
        targetCheck: 'cp',
        hint: 'Type "cp note.txt note_backup.txt" and press Enter!'
      },
      {
        id: 'obj_7_2',
        description: 'Make play.sh runnable: type "chmod +x play.sh" and press Enter!',
        targetCheck: 'chmod',
        hint: 'Type "chmod +x play.sh" and press Enter!'
      },
      {
        id: 'obj_7_3',
        description: 'Verify new permissions: type "ls -l play.sh" and press Enter!',
        targetCheck: 'verify_chmod',
        hint: 'Type "ls -l play.sh" and press Enter!'
      }
    ],
    xpReward: 250
  },
  {
    levelNumber: 8,
    title: 'Text Processing Gang I: Grep, Head, Tail & WC',
    subtitle: 'Inspection & Metrics: grep, head, tail & wc',
    grade: '7th - 8th Grade',
    gradeBand: 'high_early',
    iconName: 'Search',
    color: 'purple',
    mascotTip: 'Use "head" for top lines, "tail" for fresh logs, "wc" to count, and "grep" to search patterns!',
    story: 'Text files can contain millions of lines. Instead of scrolling forever, use head to peek at the beginning, tail to see recent entries, wc to count words/lines, and grep to hunt down answers.',
    theory: [
      '"head -n 3 file": Shows the top 3 lines.',
      '"tail -n 3 file": Shows the bottom 3 lines.',
      '"wc -l file": Counts total lines.',
      '"grep penguin animals.txt": Finds all lines mentioning penguin.'
    ],
    type: 'text_manipulation',
    suggestedPills: ['head -n 3 animals.txt', 'tail -n 3 animals.txt', 'wc -l animals.txt', 'grep penguin animals.txt'],
    objectives: [
      {
        id: 'obj_8_1',
        description: 'Inspect first lines: type "head -n 3 animals.txt" and press Enter!',
        targetCheck: 'head',
        hint: 'Type "head -n 3 animals.txt" and press Enter!'
      },
      {
        id: 'obj_8_2',
        description: 'Count lines in animals: type "wc -l animals.txt" and press Enter!',
        targetCheck: 'wc',
        hint: 'Type "wc -l animals.txt" and press Enter!'
      },
      {
        id: 'obj_8_3',
        description: 'Search for penguins: type "grep penguin animals.txt" and press Enter!',
        targetCheck: 'grep',
        hint: 'Type "grep penguin animals.txt" and press Enter!'
      }
    ],
    xpReward: 280
  },
  {
    levelNumber: 9,
    title: 'Text Processing Gang II: Awk, Sed, Cut, Sort & Uniq',
    subtitle: 'Where awk & sed live: cut, sort, uniq, tr & sed',
    grade: '8th - 9th Grade',
    gradeBand: 'high_early',
    iconName: 'Workflow',
    color: 'rose',
    mascotTip: 'The heavy hitters of Unix text manipulation! "cut" isolates columns, "sort" and "uniq" organize data, and "sed" replaces words on the fly.',
    story: 'Step into the realm of the text processing masters! Filter specific columns with cut, alphabeticalize rosters with sort, remove duplicates with uniq, and do lightning find-and-replace using sed.',
    theory: [
      '"sort animals.txt": Sorts lines alphabetically.',
      '"cut -d\' \' -f1 animals.txt": Extracts the first column from space-separated text.',
      '"sed \'s/old/new/g\' file": Stream editor for replacing text patterns.',
      '"uniq animals.txt": Filters out duplicate adjacent lines.',
      '"tr \'a-z\' \'A-Z\'": Translates lowercase characters to UPPERCASE.'
    ],
    type: 'text_manipulation',
    suggestedPills: ['sort animals.txt', "cut -d' ' -f1 animals.txt", "sed 's/elephant/JUMBO/g' animals.txt"],
    objectives: [
      {
        id: 'obj_9_1',
        description: 'Sort the animals list: type "sort animals.txt" and press Enter!',
        targetCheck: 'sort',
        hint: 'Type "sort animals.txt" and press Enter!'
      },
      {
        id: 'obj_9_2',
        description: 'Extract column 1: type "cut -d\' \' -f1 animals.txt" and press Enter!',
        targetCheck: 'cut',
        hint: 'Type "cut -d\' \' -f1 animals.txt" and press Enter!'
      },
      {
        id: 'obj_9_3',
        description: 'Substitute words with sed: type "sed \'s/elephant/JUMBO/g\' animals.txt"!',
        targetCheck: 'sed',
        hint: 'Type "sed \'s/elephant/JUMBO/g\' animals.txt" and press Enter!'
      }
    ],
    xpReward: 300
  },
  {
    levelNumber: 10,
    title: 'System Calls & Process Watch',
    subtitle: 'Managing Systems: ps, top, kill, find & xargs',
    grade: '9th - 10th Grade',
    gradeBand: 'high_early',
    iconName: 'Cpu',
    color: 'violet',
    mascotTip: 'Monitor processes with "ps" and "top", terminate hung programs with "kill", and search files with "find" & "xargs".',
    story: 'Take command of the operating system! Inspect running processes, check CPU metrics with top, stop glitchy background jobs with kill, and recursively search the entire disk with find.',
    theory: [
      '"ps": Lists current active processes and their PIDs.',
      '"top": Real-time CPU and memory monitoring dashboard.',
      '"kill PID": Sends a signal to stop a running process.',
      '"find . -name "*.sh"": Searches files matching wildcard patterns.',
      '"xargs": Converts piped items into command arguments.'
    ],
    type: 'process_mgmt',
    suggestedPills: ['ps', 'top', 'find . -name "*.sh"', 'kill 404'],
    objectives: [
      {
        id: 'obj_10_1',
        description: 'View running processes: type "ps" and press Enter!',
        targetCheck: 'ps',
        hint: 'Type "ps" and press Enter!'
      },
      {
        id: 'obj_10_2',
        description: 'Open live system monitor: type "top" and press Enter!',
        targetCheck: 'top',
        hint: 'Type "top" and press Enter!'
      },
      {
        id: 'obj_10_3',
        description: 'Find all shell scripts: type "find . -name \"*.sh\"" and press Enter!',
        targetCheck: 'find',
        hint: 'Type "find . -name \"*.sh\"" and press Enter!'
      }
    ],
    xpReward: 320
  },
  {
    levelNumber: 11,
    title: 'Network & Archive Rangers',
    subtitle: 'Connecting the Globe: tar, gzip, curl, wget & ssh',
    grade: '10th - 11th Grade',
    gradeBand: 'high_early',
    iconName: 'Globe',
    color: 'red',
    mascotTip: 'The internet is powered by Linux! Use curl and wget to download web pages, and tar + gzip to compress archives.',
    story: 'Connect your terminal to the worldwide web! Fetch live API data with curl, download files with wget, package folders into tar.gz archives, and prepare for remote administration with ssh.',
    theory: [
      '"curl url": Transfers data from or to a server using supported protocols.',
      '"wget url": Downloads files directly from the web.',
      '"tar -czvf archive.tar.gz file": Bundles and compresses files.',
      '"gzip file": Compresses a single file to save disk space.',
      '"ssh user@host": Secure Shell for logging into remote Linux servers.'
    ],
    type: 'network_archive',
    suggestedPills: ['curl https://jumbolinux.kids', 'wget https://jumbolinux.kids/wallpaper.png', 'tar -czvf backup.tar.gz note.txt', 'ssh cadet@lab'],
    objectives: [
      {
        id: 'obj_11_1',
        description: 'Fetch web data: type "curl https://jumbolinux.kids" and press Enter!',
        targetCheck: 'curl',
        hint: 'Type "curl https://jumbolinux.kids" and press Enter!'
      },
      {
        id: 'obj_11_2',
        description: 'Compress an archive: type "tar -czvf backup.tar.gz note.txt" and press Enter!',
        targetCheck: 'tar',
        hint: 'Type "tar -czvf backup.tar.gz note.txt" and press Enter!'
      },
      {
        id: 'obj_11_3',
        description: 'Test remote connection: type "ssh cadet@lab" and press Enter!',
        targetCheck: 'ssh',
        hint: 'Type "ssh cadet@lab" and press Enter!'
      }
    ],
    xpReward: 350
  },
  {
    levelNumber: 12,
    title: "Hacker's Lab: Regex, Python & C",
    subtitle: 'Capstone Graduation: grep -E, python3 & gcc',
    grade: '12th Grade / Capstone',
    gradeBand: 'high_advanced',
    iconName: 'Code',
    color: 'yellow',
    mascotTip: 'Graduation Day! Harness Regular Expressions (regex) for pattern matching, execute Python scripts, and compile C code with GCC!',
    story: 'The ultimate graduation exam for Linux Rangers! Power-users weave regular expressions with grep -E, execute scripts in Python 3, and build high-performance binaries with the GNU Compiler Collection (GCC).',
    theory: [
      '"grep -E \'pattern1|pattern2\' file": Regular expression multi-pattern search.',
      '"python3 script.py": Runs Python programs directly.',
      '"gcc main.c -o program": Compiles C code into a lightning-fast native binary.',
      'Congratulations on mastering the full Linux command continuum!'
    ],
    type: 'ctf_security',
    suggestedPills: ["grep -E 'penguin|elephant' animals.txt", "python3 -c 'print(\"Hello Linux!\")'", "gcc -v"],
    objectives: [
      {
        id: 'obj_12_1',
        description: 'Search using Regex: type "grep -E \'penguin|elephant\' animals.txt" and press Enter!',
        targetCheck: 'grep',
        hint: 'Type "grep -E \'penguin|elephant\' animals.txt" and press Enter!'
      },
      {
        id: 'obj_12_2',
        description: 'Run Python code: type "python3 -c \'print(\"Hello Linux!\")\'" and press Enter!',
        targetCheck: 'python',
        hint: 'Type "python3 -c \'print(\"Hello Linux!\")\'" and press Enter!'
      },
      {
        id: 'obj_12_3',
        description: 'Check the C Compiler: type "gcc -v" and press Enter!',
        targetCheck: 'gcc',
        hint: 'Type "gcc -v" and press Enter!'
      }
    ],
    xpReward: 500
  }
];

export const BADGES: Badge[] = [
  {
    id: 'first_shell',
    title: 'Keyboard Explorer',
    description: 'Typed your very first terminal commands with whoami, echo & which!',
    icon: 'Zap',
    levelRequired: 1,
    color: 'bg-blue-500'
  },
  {
    id: 'media_pioneer',
    title: 'Terminal Cinema',
    description: 'Rendered pictures and audio in the terminal with feh, chafa & mpv!',
    icon: 'Play',
    levelRequired: 2,
    color: 'bg-emerald-500'
  },
  {
    id: 'treehouse_architect',
    title: 'Forest & Cow Whisperer',
    description: 'Mastered tree visualizer, cowsay humor, and terminal fortunes.',
    icon: 'Sparkles',
    levelRequired: 3,
    color: 'bg-amber-500'
  },
  {
    id: 'filesystem_architect',
    title: 'Filesystem Architect',
    description: 'Engineered nested directory trees and created files with mkdir -p, touch & file!',
    icon: 'FolderPlus',
    levelRequired: 4,
    color: 'bg-sky-500'
  },
  {
    id: 'stream_sorcerer',
    title: 'Pipeline Sorcerer',
    description: 'Mastered Unix output redirection (>, >>) and chained commands with pipes (|)!',
    icon: 'Workflow',
    levelRequired: 5,
    color: 'bg-teal-500'
  },
  {
    id: 'coreutils_navigator',
    title: 'Coreutils Navigator',
    description: 'Navigated Linux paths with pwd, ls, cd, and cat.',
    icon: 'Compass',
    levelRequired: 6,
    color: 'bg-orange-500'
  },
  {
    id: 'file_crafter',
    title: 'Permission Craftsman',
    description: 'Manipulated files and set permissions with cp, mv, rm, and chmod.',
    icon: 'Hammer',
    levelRequired: 7,
    color: 'bg-indigo-500'
  },
  {
    id: 'text_detective',
    title: 'Text Inspector',
    description: 'Searched and measured text streams with head, tail, wc, and grep.',
    icon: 'Search',
    levelRequired: 8,
    color: 'bg-purple-500'
  },
  {
    id: 'awk_sed_sorcerer',
    title: 'Awk & Sed Sorcerer',
    description: 'Wielded the legendary gang of awk, sed, cut, sort, and uniq.',
    icon: 'Workflow',
    levelRequired: 9,
    color: 'bg-rose-500'
  },
  {
    id: 'process_commander',
    title: 'Process Commander',
    description: 'Monitored systems in real-time with ps, top, kill, and find.',
    icon: 'Cpu',
    levelRequired: 10,
    color: 'bg-violet-500'
  },
  {
    id: 'network_ranger',
    title: 'Network & Archive Ranger',
    description: 'Compressed tar/gzip archives and transferred data via curl and ssh.',
    icon: 'Globe',
    levelRequired: 11,
    color: 'bg-red-500'
  },
  {
    id: 'polyglot_hacker',
    title: 'Grand Tux Capstone Legend',
    description: 'Graduated through Regex pattern matching, Python scripting, and GCC compiling!',
    icon: 'Code',
    levelRequired: 12,
    color: 'bg-yellow-500'
  },
  {
    id: 'matcher_apprentice',
    title: 'Command Matcher Apprentice',
    description: 'Successfully matched terminal commands with their definitions in Arcade.',
    icon: 'Gamepad2',
    category: 'arcade',
    color: 'bg-blue-500'
  },
  {
    id: 'falling_keys_ace',
    title: 'Falling Keys Sharp-Shooter',
    description: 'Scored 100+ points protecting Tux in the Falling Keys typing arcade.',
    icon: 'Keyboard',
    category: 'arcade',
    color: 'bg-emerald-500'
  },
  {
    id: 'duel_victor',
    title: 'Speed Duel Champion',
    description: 'Out-typed Tux AI in the head-to-head terminal speed arena.',
    icon: 'Swords',
    category: 'arcade',
    color: 'bg-purple-500'
  },
  {
    id: 'cli_explorer',
    title: 'Local Terminal Pioneer',
    description: 'Downloaded the JumboLinux Bash Companion Script to run on physical hardware!',
    icon: 'Download',
    category: 'milestone',
    color: 'bg-indigo-500'
  },
  {
    id: 'xp_century',
    title: 'Century Master',
    description: 'Accumulated 500+ XP across learning missions and arcade challenges.',
    icon: 'Sparkles',
    category: 'milestone',
    color: 'bg-amber-500'
  },
  {
    id: 'streak_legend',
    title: 'Terminal Habit Master',
    description: 'Returned daily to train your Linux muscle memory.',
    icon: 'Flame',
    category: 'milestone',
    color: 'bg-rose-500'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Tux_SuperSpeed', avatar: '🐧', level: 12, xp: 3200, badgeCount: 13 },
  { rank: 2, name: 'Jumbo_Explorer', avatar: '🐘', level: 9, xp: 2150, badgeCount: 9 },
  { rank: 3, name: 'Linus_Junior', avatar: '💻', level: 8, xp: 1840, badgeCount: 8 },
  { rank: 4, name: 'CommandNinja99', avatar: '⚡', level: 7, xp: 1520, badgeCount: 7 },
  { rank: 5, name: 'ChromebookRanger', avatar: '🚀', level: 5, xp: 1100, badgeCount: 5 },
  { rank: 6, name: 'RootPrincess', avatar: '👑', level: 4, xp: 850, badgeCount: 4 },
  { rank: 7, name: 'PipesGuru', avatar: '🔧', level: 3, xp: 620, badgeCount: 3 }
];
