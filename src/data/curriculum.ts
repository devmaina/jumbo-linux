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
        description: "Find your explorer username: type \"whoami\" and press Enter!",
        targetCheck: 'whoami',
        commandToType: "whoami",
        instruction: "Find your explorer username with whoami",
        why: "Linux is a multi-user OS; knowing who you are confirms your file ownership and permission rights",
        followUpDone: "Identity verified: You confirmed your active user session in Linux!",
        hint: "Type \"whoami\" and press Enter!"
      },
            {
        id: 'obj_1_2',
        description: "Make the computer speak: type \"echo hello\" and press Enter!",
        targetCheck: 'echo',
        commandToType: "echo hello",
        instruction: "Make the computer speak with echo",
        why: "echo sends text directly to stdout, which is how scripts display information and pipe data",
        followUpDone: "Voice activated: Shell printed your greeting to stdout!",
        hint: "Type \"echo hello\" and press Enter!"
      },
            {
        id: 'obj_1_3',
        description: "Find a command location: type \"which bash\" and press Enter!",
        targetCheck: 'which',
        commandToType: "which bash",
        instruction: "Locate a command executable path",
        why: "Linux looks up programs via your $PATH variable; which tells you the exact binary location",
        followUpDone: "Binary located: Found the absolute executable path for bash!",
        hint: "Type \"which bash\" and press Enter!"
      },
            {
        id: 'obj_1_capstone',
        description: "🚀 Capstone Project: Announce your launch readiness! Type echo \"Ready for launch!\"",
        targetCheck: 'echo',
        commandToType: "echo \"Ready for launch!\"",
        instruction: "Announce launch readiness beacon",
        why: "Validates that your terminal output stream is online and ready for complex tasks",
        followUpDone: "Launch ready: Beacon broadcasted across the session!",
        hint: "Type echo \"Ready for launch!\" and press Enter"
      }
    ],
    capstone: {
      title: 'Astronaut Identity & Terminal Cleanse',
      scenario: 'A spacecraft terminal boots up. You need to verify your operator identity, broadcast a welcome beacon to Mission Control, and wipe the display clean.',
      learningTakeaway: 'Commands like whoami query the OS user registry, which confirms where binaries live, and echo transmits data to system output streams. Together, they establish your operational shell session.',
      command: 'echo "Ready for launch!"',
      targetCheck: 'echo',
      bonusXp: 60
    },
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
        description: "View the Tux mascot picture: type \"feh media/tux.png\" and press Enter!",
        targetCheck: 'feh',
        commandToType: "feh media/tux.png",
        instruction: "Open the Tux mascot picture",
        why: "feh is a fast X11 image viewer used on Linux to inspect graphic assets and screenshots",
        followUpDone: "Image inspected: Displayed Tux mascot graphic viewer!",
        hint: "Type \"feh media/tux.png\" and press Enter!"
      },
            {
        id: 'obj_2_2',
        description: "Render ASCII picture art: type \"chafa media/tux.png\" and press Enter!",
        targetCheck: 'chafa',
        commandToType: "chafa media/tux.png",
        instruction: "Render ASCII picture art in console",
        why: "chafa translates image pixels into Unicode character blocks for pure terminal display",
        followUpDone: "Art rendered: Generated full Unicode ASCII art in the shell!",
        hint: "Type \"chafa media/tux.png\" and press Enter!"
      },
            {
        id: 'obj_2_3',
        description: "Play terminal audio: type \"mpv media/anthem.mp3\" and press Enter!",
        targetCheck: 'mpv',
        commandToType: "mpv media/anthem.mp3",
        instruction: "Play terminal audio stream",
        why: "mpv plays audio and video directly through Linux ALSA/PulseAudio/PipeWire drivers",
        followUpDone: "Audio streamed: Successfully played audio through terminal sound system!",
        hint: "Type \"mpv media/anthem.mp3\" and press Enter!"
      },
            {
        id: 'obj_2_capstone',
        description: "🎨 Capstone Project: Render the mascot Tux in terminal ASCII art with chafa media/tux.png!",
        targetCheck: 'chafa',
        commandToType: "chafa media/tux.png",
        instruction: "Showcase mascot terminal artwork",
        why: "Demonstrates graphics rendering capabilities in headless and terminal environments",
        followUpDone: "Masterpiece complete: Tux mascot art is live in console!",
        hint: "Type chafa media/tux.png to render the mascot artwork"
      }
    ],
    capstone: {
      title: 'High-Resolution Mascot Terminal Art',
      scenario: 'The observatory is celebrating discovery day. Showcase Tux the Linux Penguin in high-definition ASCII graphic art right inside your console.',
      learningTakeaway: 'The terminal is not limited to plain text. Renderers like chafa convert bitmap images to Unicode blocks, feh triggers graphic viewers, and mpv handles real-time audio playback.',
      command: 'chafa media/tux.png',
      targetCheck: 'chafa',
      bonusXp: 75
    },
    xpReward: 140
  },
  {
    levelNumber: 3,
    title: 'Fun Shell Creatures & Trees',
    subtitle: 'The Non-Native Gang: tree, cowsay & fortune',
    grade: '3rd - 4th Grade',
    gradeBand: 'elementary',
    iconName: 'Trees',
    color: 'purple',
    mascotTip: 'Linux has a rich culture of quirky commands like cowsay and fortune that teach formatting and directory visualization!',
    story: 'Explore legendary open-source utilities! Use tree to see folder branches, make cowsay speak wise words, and print daily fortunes.',
    theory: [
      '"tree": Visualizes all folders and nested files in a branching tree diagram.',
      '"cowsay message": Draws a talking cow with a custom speech bubble.',
      '"fortune": Quotes random wisdom, kid-friendly jokes, and fun facts.'
    ],
    type: 'faq_intro',
    suggestedPills: ['tree', 'cowsay Linux is awesome', 'fortune'],
    objectives: [
            {
        id: 'obj_3_1',
        description: "Visualize folder branches: type \"tree\" and press Enter!",
        targetCheck: 'tree',
        commandToType: "tree",
        instruction: "Visualize directory tree branches",
        why: "tree displays nested folder hierarchies recursively so you instantly see file structure",
        followUpDone: "Tree mapped: Complete directory branches visualised!",
        hint: "Type \"tree\" and press Enter!"
      },
            {
        id: 'obj_3_2',
        description: "Make the cow speak: type \"cowsay Linux is awesome\" and press Enter!",
        targetCheck: 'cowsay',
        commandToType: "cowsay Linux is awesome",
        instruction: "Make the Linux cow speak a message",
        why: "cowsay demonstrates text formatting, ASCII art, and command-line argument processing",
        followUpDone: "Speech generated: Tux & the cow delivered your announcement!",
        hint: "Type \"cowsay Linux is awesome\" and press Enter!"
      },
            {
        id: 'obj_3_3',
        description: "Get a wisdom quote: type \"fortune\" and press Enter!",
        targetCheck: 'fortune',
        commandToType: "fortune",
        instruction: "Read a wisdom quote or joke",
        why: "fortune queries the Linux cookie database, a classic Unix tradition since 1979",
        followUpDone: "Wisdom retrieved: Loaded fresh inspiration from the Unix fortune database!",
        hint: "Type \"fortune\" and press Enter!"
      },
            {
        id: 'obj_3_capstone',
        description: "🐮 Capstone Project: Make the Linux cow cheer! Type cowsay \"Linux is superpower!\"",
        targetCheck: 'cowsay',
        commandToType: "cowsay \"Linux is superpower!\"",
        instruction: "Broadcast the Linux superpower motto",
        why: "Practices passing multi-word quoted string arguments into command line utilities",
        followUpDone: "Cheer broadcasted: Mascot celebration speech rendered!",
        hint: "Type cowsay \"Linux is superpower!\" and press Enter"
      }
    ],
    capstone: {
      title: 'The Wise Talking Penguin & Forest Tree',
      scenario: 'Cadets are entering the laboratory. Combine creature speech bubbles with directory tree inspection to create an interactive welcome station.',
      learningTakeaway: 'Linux modular utilities can be composed creatively: tree models hierarchical directory graphs, while text formatters like cowsay and fortune deliver dynamic user notices.',
      command: 'cowsay "Linux is superpower!"',
      targetCheck: 'cowsay',
      bonusXp: 80
    },
    xpReward: 160
  },
  {
    levelNumber: 4,
    title: 'Core Navigation & Filesystem Orientation',
    subtitle: 'Finding Your Way: pwd, ls -la, cd & The Linux Root Tree',
    grade: '4th - 5th Grade',
    gradeBand: 'middle',
    iconName: 'Compass',
    color: 'blue',
    mascotTip: 'In Linux, every single file and folder branches out from the root "/"! Use "pwd" to see your coordinates, "ls -la" to see all files (including hidden dotfiles), and "cd" to travel.',
    story: 'Welcome to core Linux navigation! Before an engineer can create blueprints or automate systems, they must master the universal commands of the Unix terminal: knowing where you are with pwd, revealing hidden system files with ls -la, traversing directories with cd, and inspecting the OS distribution.',
    theory: [
      '"pwd": Prints your exact Working Directory so you always know your location.',
      '"ls -la": Lists all directory entries with full details, including hidden dotfiles like .bashrc and file permissions.',
      '"cd /": Switches your active working context to the root directory where the Linux hierarchy begins.',
      '"cat /etc/os-release": Displays the official Linux distribution name, kernel edition, and OS details.'
    ],
    type: 'terminal_nav',
    suggestedPills: ['pwd', 'ls -la', 'cd /', 'cd ~', 'cat /etc/os-release'],
    objectives: [
            {
        id: 'obj_4_1',
        description: "Print your working location: type \"pwd\" and press Enter!",
        targetCheck: 'pwd',
        commandToType: "pwd",
        instruction: "Print current working directory",
        why: "pwd (Print Working Directory) prevents navigating or modifying files in the wrong folder",
        followUpDone: "Location confirmed: You established your exact coordinates in the Linux tree!",
        hint: "Type \"pwd\" and press Enter!"
      },
            {
        id: 'obj_4_2',
        description: "Inspect files & hidden dotfiles: type \"ls -la\" and press Enter!",
        targetCheck: 'ls',
        commandToType: "ls -la",
        instruction: "Inspect all files and hidden dotfiles",
        why: "The -a flag reveals hidden configuration files like .bashrc that start with a dot",
        followUpDone: "Dotfiles revealed: Unveiled all hidden configuration and permission entries!",
        hint: "Type \"ls -la\" and press Enter!"
      },
            {
        id: 'obj_4_3',
        description: "Travel to system root: type \"cd /\" and press Enter!",
        targetCheck: 'cd',
        commandToType: "cd /",
        instruction: "Navigate to root directory",
        why: "In Linux, every single disk, device, and file branches from the root tree standard \"/\"",
        followUpDone: "Root reached: You arrived at the base of the entire Linux filesystem!",
        hint: "Type \"cd /\" and press Enter!"
      },
            {
        id: 'obj_4_capstone',
        description: "🧭 Capstone Project: Verify the Linux distribution! Type cat /etc/os-release",
        targetCheck: 'cat',
        commandToType: "cat /etc/os-release",
        instruction: "Verify Linux operating system distribution",
        why: "/etc/os-release is the universal standard for identifying Linux distro, version, and architecture",
        followUpDone: "Distro verified: Read official operating system metadata from /etc!",
        hint: "Type cat /etc/os-release and press Enter"
      }
    ],
    capstone: {
      title: 'Filesystem Cartographer & Distro Scout',
      scenario: 'You have logged into a new Linux workstation. Locate your exact coordinates in the tree, audit hidden configuration files, navigate to root, and verify the Linux operating system distribution.',
      learningTakeaway: 'The Linux Filesystem Hierarchy Standard (FHS) is a single inverted tree starting at "/". Dotfiles (starting with a period) store user preferences, and system identity files live in "/etc". Mastering pwd, ls -la, and cd is the foundational skill of all system engineering.',
      command: 'cat /etc/os-release',
      targetCheck: 'cat',
      bonusXp: 90
    },
    xpReward: 180
  },
  {
    levelNumber: 5,
    title: 'Shell Super-Powers: Key Bindings, History & Help',
    subtitle: 'Terminal Ergonomics: history, help, echo $SHELL & Shortcuts',
    grade: '5th - 6th Grade',
    gradeBand: 'middle',
    iconName: 'Sparkles',
    color: 'amber',
    mascotTip: 'Power users never re-type long commands! Use the Tab key for auto-completion, Up Arrow for command history, echo $SHELL for environment variables, and built-in help flags!',
    story: 'Welcome to shell ergonomics! Discover the hidden super-powers built directly into the Bash shell: review your execution history, inspect shell environment variables like $SHELL and $USER, and consult help manuals with help or --help.',
    theory: [
      '"history": Displays previous commands executed in your current session.',
      '"echo $SHELL": Evaluates the shell environment variable, showing your active shell program (e.g. /bin/bash).',
      '"ls --help": Reads the built-in manual explaining command flags, options, and syntax.',
      '"uname -a": Prints the Linux kernel version, system hostname, and CPU architecture.'
    ],
    type: 'faq_intro',
    suggestedPills: ['history', 'echo $SHELL', 'echo $USER', 'ls --help', 'uname -a'],
    objectives: [
            {
        id: 'obj_5_1',
        description: "Review command history: type \"history\" and press Enter!",
        targetCheck: 'history',
        commandToType: "history",
        instruction: "Review previous command history",
        why: "history lists executed commands so you never lose past work and can re-run steps effortlessly",
        followUpDone: "History reviewed: Retrieved the terminal command log!",
        hint: "Type \"history\" and press Enter!"
      },
            {
        id: 'obj_5_2',
        description: "Query your shell environment variable: type \"echo $SHELL\" and press Enter!",
        targetCheck: 'echo',
        commandToType: "echo $SHELL",
        instruction: "Query active shell environment variable",
        why: "Environment variables store system settings; $SHELL informs software which interpreter is active",
        followUpDone: "Variable evaluated: Confirmed active shell interpreter binary!",
        hint: "Type \"echo $SHELL\" and press Enter!"
      },
            {
        id: 'obj_5_3',
        description: "Read command options and manual: type \"help\" and press Enter!",
        targetCheck: 'help',
        commandToType: "help",
        instruction: "Consult built-in shell help and options",
        why: "Reading documentation is the core superpower of every professional Linux engineer",
        followUpDone: "Manual opened: Read built-in syntax rules and command options!",
        hint: "Type \"help\" and press Enter!"
      },
            {
        id: 'obj_5_capstone',
        description: "⚡ Capstone Project: Audit kernel and CPU architecture! Type uname -a",
        targetCheck: 'uname',
        commandToType: "uname -a",
        instruction: "Audit system kernel and CPU architecture",
        why: "uname -a queries the running Linux kernel, host release, compile date, and CPU hardware",
        followUpDone: "Kernel audited: Inspected full OS architecture and system kernel specs!",
        hint: "Type uname -a and press Enter"
      }
    ],
    capstone: {
      title: 'Shell Productivity & Kernel Architecture Audit',
      scenario: 'Audit your shell workspace: inspect your execution history to track past operations, query environment variables, review syntax documentation, and print the active Linux kernel architecture.',
      learningTakeaway: 'Bash key bindings (Tab auto-complete, Ctrl+C interrupt) and environment variables ($SHELL, $USER, $HOME) are standard across every Linux distribution. They allow engineers to automate workflows and diagnose system states rapidly.',
      command: 'uname -a',
      targetCheck: 'uname',
      bonusXp: 100
    },
    xpReward: 200
  },
  {
    levelNumber: 6,
    title: 'Filesystem Architect: Creation, Copies & Renames',
    subtitle: 'Building Structures: mkdir -p, touch, cp & mv',
    grade: '6th - 7th Grade',
    gradeBand: 'middle',
    iconName: 'FolderPlus',
    color: 'sky',
    mascotTip: 'Now that you know how to navigate, let us build! Use "mkdir -p" to create directories, "touch" to craft new files, "cp" to clone backups, and "mv" to rename.',
    story: 'Time to become a Linux system architect! Build structured project directories with mkdir -p, forge new files with touch, create safe backup duplicates with cp, and rename or organize files with mv.',
    theory: [
      '"mkdir -p lab/gadgets": Creates parent and child directories in a single command.',
      '"touch lab/gadgets/laser.txt": Creates a fresh new file with current timestamps.',
      '"cp lab/gadgets/laser.txt lab/gadgets/backup.txt": Duplicates a file safely.',
      '"mv lab/gadgets/backup.txt lab/gadgets/final.txt": Moves or renames files across directories.'
    ],
    type: 'file_ops',
    suggestedPills: ['mkdir -p lab/gadgets', 'touch lab/gadgets/laser.txt', 'cp lab/gadgets/laser.txt lab/gadgets/backup.txt', 'cat lab/gadgets/laser.txt'],
    objectives: [
            {
        id: 'obj_6_1',
        description: "Construct nested folders: type \"mkdir -p lab/gadgets\" and press Enter!",
        targetCheck: 'mkdir',
        commandToType: "mkdir -p lab/gadgets",
        instruction: "Construct nested directory hierarchy",
        why: "mkdir -p creates all parent and child directories in one command without errors",
        followUpDone: "Directories created: Built the entire nested folder tree!",
        hint: "Type \"mkdir -p lab/gadgets\" and press Enter!"
      },
            {
        id: 'obj_6_2',
        description: "Create a blueprint file: type \"touch lab/gadgets/laser.txt\" and press Enter!",
        targetCheck: 'touch',
        commandToType: "touch lab/gadgets/laser.txt",
        instruction: "Create blueprint file with touch",
        why: "touch creates empty files or updates access timestamps without modifying existing content",
        followUpDone: "File forged: Created laser.txt with valid filesystem timestamps!",
        hint: "Type \"touch lab/gadgets/laser.txt\" and press Enter!"
      },
            {
        id: 'obj_6_3',
        description: "Duplicate a backup: type \"cp lab/gadgets/laser.txt lab/gadgets/backup.txt\" and press Enter!",
        targetCheck: 'cp',
        commandToType: "cp lab/gadgets/laser.txt lab/gadgets/backup.txt",
        instruction: "Duplicate a safe backup file",
        why: "cp creates an exact duplicate so you can safely experiment without losing original work",
        followUpDone: "Backup cloned: Created a safe replica of your project file!",
        hint: "Type \"cp lab/gadgets/laser.txt lab/gadgets/backup.txt\" and press Enter!"
      },
            {
        id: 'obj_6_capstone',
        description: "📁 Capstone Project: Build a nested sensor blueprint! Type mkdir -p probe/sensors/telemetry",
        targetCheck: 'mkdir',
        commandToType: "mkdir -p probe/sensors/telemetry",
        instruction: "Build nested telemetry architecture",
        why: "Organizes multi-tier sensor telemetry for automation and data collection",
        followUpDone: "Telemetry tree ready: Deep folder architecture constructed!",
        hint: "Type mkdir -p probe/sensors/telemetry"
      }
    ],
    capstone: {
      title: 'Deep Nested Mission Control Architecture',
      scenario: 'Construct the mission control folder blueprint for orbital sensors and telemetry using nested directory creation.',
      learningTakeaway: 'mkdir -p guarantees atomic creation of nested directory trees without race conditions, touch creates empty files or updates access stamps, and cp duplicates files safely.',
      command: 'mkdir -p probe/sensors/telemetry',
      targetCheck: 'mkdir',
      bonusXp: 110
    },
    xpReward: 220
  },
  {
    levelNumber: 7,
    title: 'File Protection & Permissions: Chmod & Ownership',
    subtitle: 'File Security: file, chmod, chown & rm',
    grade: '7th - 8th Grade',
    gradeBand: 'high_early',
    iconName: 'Shield',
    color: 'rose',
    mascotTip: 'In Linux, every file has permissions! Use "file" to detect formats, "chmod 755" or "chmod +x" to make programs runnable, and "rm" to delete.',
    story: 'Welcome to system security! Inspect file formats with file, configure executable permissions with chmod, and manage file lifecycles with rm.',
    theory: [
      '"file lab/gadgets/laser.txt": Detects whether a file contains plain ASCII text, binary code, or media.',
      '"chmod 755 firewall.sh": Sets permissions so owner can read/write/execute, and others can read/execute.',
      '"chmod +x firewall.sh": Grants immediate executable execution permission to a script.',
      '"rm old_temp.txt": Removes temporary or unwanted files from the system.'
    ],
    type: 'permissions',
    suggestedPills: ['file lab/gadgets/laser.txt', 'chmod 755 firewall.sh', 'chmod +x firewall.sh', 'ls -l firewall.sh'],
    objectives: [
            {
        id: 'obj_7_1',
        description: "Inspect file format: type \"file lab/gadgets/laser.txt\" and press Enter!",
        targetCheck: 'file',
        commandToType: "file lab/gadgets/laser.txt",
        instruction: "Inspect file format and MIME type",
        why: "file reads magic header bytes to tell you true file type, regardless of the extension",
        followUpDone: "Format inspected: Verified encoding and internal MIME classification!",
        hint: "Type \"file lab/gadgets/laser.txt\" and press Enter!"
      },
            {
        id: 'obj_7_2',
        description: "Make defense script executable: type \"chmod 755 firewall.sh\" and press Enter!",
        targetCheck: 'chmod',
        commandToType: "chmod 755 firewall.sh",
        instruction: "Set executable permissions for owner",
        why: "chmod 755 sets rwxr-xr-x: owner can run and edit, others can only read and execute",
        followUpDone: "Security granted: Assigned rwxr-xr-x permissions to script!",
        hint: "Type \"chmod 755 firewall.sh\" and press Enter!"
      },
            {
        id: 'obj_7_3',
        description: "Audit file permissions: type \"ls -l firewall.sh\" and press Enter!",
        targetCheck: 'ls',
        commandToType: "ls -l firewall.sh",
        instruction: "Audit security permissions in long listing",
        why: "ls -l displays permissions string (-rwxr-xr-x), owner, group, size, and date",
        followUpDone: "Permissions audited: Verified file ownership and access tier flags!",
        hint: "Type \"ls -l firewall.sh\" and press Enter!"
      },
            {
        id: 'obj_7_capstone',
        description: "🛡️ Capstone Project: Make the firewall script executable! Type chmod 755 firewall.sh",
        targetCheck: 'chmod',
        commandToType: "chmod 755 firewall.sh",
        instruction: "Harden firewall script executable gate",
        why: "Ensures the firewall daemon can run safely without unauthorized write access",
        followUpDone: "Firewall locked: Security gate verified and executable!",
        hint: "Type chmod 755 firewall.sh and press Enter"
      }
    ],
    capstone: {
      title: 'Safe Vault Backup & Executable Security Gate',
      scenario: 'Backup the station defense script to the archives and assign executable permissions so the automation daemon can guard the system.',
      learningTakeaway: 'Linux file permissions enforce security across 3 tiers (Owner, Group, Others) using read (4), write (2), and execute (1). chmod 755 allows execute permissions for programs, while cp safeguards originals.',
      command: 'chmod 755 firewall.sh',
      targetCheck: 'chmod',
      bonusXp: 120
    },
    xpReward: 240
  },
  {
    levelNumber: 8,
    title: 'The Magic Pipes & Redirection: Data Streams',
    subtitle: 'Connecting Tools: >, >>, | and wc -l',
    grade: '8th - 9th Grade',
    gradeBand: 'high_early',
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
        id: 'obj_8_1',
        description: "Redirect text to a new file: type \"echo \\\"Star Alpha\\\" > star.txt\" and press Enter!",
        targetCheck: 'redirection',
        commandToType: "echo \"Star Alpha\" > star.txt",
        instruction: "Redirect output to create a new file",
        why: "The > operator redirects stdout to a file, creating it or replacing existing contents",
        followUpDone: "Stream redirected: Created star.txt containing your new record!",
        hint: "Type \"echo \\\"Star Alpha\\\" > star.txt\" and press Enter!"
      },
            {
        id: 'obj_8_2',
        description: "Append another entry: type \"echo \\\"Star Beta\\\" >> star.txt\" and press Enter!",
        targetCheck: 'redirect_append',
        commandToType: "echo \"Star Beta\" >> star.txt",
        instruction: "Append record to file without overwriting",
        why: "The >> operator appends to the end of a file, preserving previous lines for logging",
        followUpDone: "Log appended: Added line to star.txt without losing previous data!",
        hint: "Type \"echo \\\"Star Beta\\\" >> star.txt\" and press Enter!"
      },
            {
        id: 'obj_8_3',
        description: "Count items using a pipe: type \"cat star.txt | wc -l\" and press Enter!",
        targetCheck: 'wc',
        commandToType: "cat star.txt | wc -l",
        instruction: "Pipe text into word/line counter",
        why: "The pipe | connects the stdout of cat to stdin of wc, building a modular data pipeline",
        followUpDone: "Pipes connected: Counted lines using Unix inter-process pipe stream!",
        hint: "Type \"cat star.txt | wc -l\" and press Enter!"
      },
            {
        id: 'obj_8_capstone',
        description: "⚡ Capstone Project: Append safety logs to the flight recorder! Type echo sensor_ok >> flight.log",
        targetCheck: 'redirect_append',
        commandToType: "echo \"sensor_ok\" >> flight.log",
        instruction: "Append flight recorder telemetry entry",
        why: "Simulates flight recorder black-box logging with continuous append operations",
        followUpDone: "Flight log saved: Appended telemetry record to flight.log!",
        hint: "Type echo \"sensor_ok\" >> flight.log and press Enter"
      }
    ],
    capstone: {
      title: 'Flight Telemetry Black Box Pipeline',
      scenario: 'A deep space telemetry packet has arrived. Append it to the mission flight recorder log using stream redirection operators.',
      learningTakeaway: 'UNIX streams (stdin, stdout, stderr) and operators (> overwrite, >> append, | pipe) form the circulatory system of Linux, allowing utilities to stream data directly into one another without intermediate storage.',
      command: 'echo "sensor_ok" >> flight.log',
      targetCheck: 'redirect_append',
      bonusXp: 130
    },
    xpReward: 260
  },
  {
    levelNumber: 9,
    title: 'Text Processing Gang: Grep, Head, Tail & Cut',
    subtitle: 'Inspection & Slicing: grep, head, tail, cut & sort',
    grade: '9th - 10th Grade',
    gradeBand: 'high_early',
    iconName: 'FileSearch',
    color: 'amber',
    mascotTip: 'Linux servers handle massive log files! Commands like grep, head, tail, cut, and sort let you slice and filter gigabytes of text in milliseconds.',
    story: 'Dive into text stream manipulation! Extract the top lines with head, the last records with tail, search for patterns with grep, and sort lists alphabetically.',
    theory: [
      '"head -n 3 animals.txt": Outputs the first 3 lines of a file.',
      '"tail -n 2 animals.txt": Outputs the last 2 lines of a file.',
      '"grep penguin animals.txt": Filters lines matching a keyword.',
      '"sort animals.txt": Orders lines alphabetically.'
    ],
    type: 'text_manipulation',
    suggestedPills: ['head -n 3 animals.txt', 'tail -n 2 animals.txt', 'grep penguin animals.txt', 'sort animals.txt'],
    objectives: [
            {
        id: 'obj_9_1',
        description: "View top lines: type \"head -n 3 animals.txt\" and press Enter!",
        targetCheck: 'head',
        commandToType: "head -n 3 animals.txt",
        instruction: "Inspect the first 3 lines of text",
        why: "head lets you sample massive files immediately without loading millions of lines into RAM",
        followUpDone: "Head extracted: Sampled the top 3 records of the data file!",
        hint: "Type \"head -n 3 animals.txt\" and press Enter!"
      },
            {
        id: 'obj_9_2',
        description: "Search for pattern: type \"grep penguin animals.txt\" and press Enter!",
        targetCheck: 'grep',
        commandToType: "grep penguin animals.txt",
        instruction: "Filter lines matching keyword pattern",
        why: "grep (Global Regular Expression Print) searches text at lightning speeds across files",
        followUpDone: "Pattern found: Filtered all lines matching the penguin keyword!",
        hint: "Type \"grep penguin animals.txt\" and press Enter!"
      },
            {
        id: 'obj_9_3',
        description: "Sort lines alphabetically: type \"sort animals.txt\" and press Enter!",
        targetCheck: 'sort',
        commandToType: "sort animals.txt",
        instruction: "Sort lines in alphabetical order",
        why: "sort organizes records A-to-Z for clean reporting and deduplication with uniq",
        followUpDone: "Lines sorted: Output ordered alphabetically from A to Z!",
        hint: "Type \"sort animals.txt\" and press Enter!"
      },
            {
        id: 'obj_9_capstone',
        description: "🔍 Capstone Project: Search for system errors! Type grep error /var/log/syslog",
        targetCheck: 'grep',
        commandToType: "grep error /var/log/syslog",
        instruction: "Search system logs for incident errors",
        why: "Essential forensic technique to diagnose crashes, daemon errors, and security events",
        followUpDone: "Incident isolated: Pinpointed all error log entries in /var/log/syslog!",
        hint: "Type grep error /var/log/syslog to search the logs"
      }
    ],
    capstone: {
      title: 'Incident Forensics & Error Log Triage',
      scenario: 'An anomaly triggered warning indicators. Scan the server logs using regular expression search to instantly pinpoint error lines.',
      learningTakeaway: 'Instead of opening multi-gigabyte log files in visual editors, system engineers employ grep to filter patterns in milliseconds, with head, tail, and wc extracting precise metrics and summaries.',
      command: 'grep error /var/log/syslog',
      targetCheck: 'grep',
      bonusXp: 140
    },
    xpReward: 280
  },
  {
    levelNumber: 10,
    title: 'System Calls & Process Watch',
    subtitle: 'Managing Systems: ps, top, kill, find & xargs',
    grade: '10th - 11th Grade',
    gradeBand: 'high_advanced',
    iconName: 'Activity',
    color: 'red',
    mascotTip: 'Every program running in Linux is a process with a PID! "ps" lists them, "top" monitors CPU loads, "kill" stops runaway tasks, and "find" traverses storage.',
    story: 'Take command of the operating system core! Inspect running tasks, spot high-resource hogs, signal stuck processes to terminate cleanly, and find files anywhere on disk.',
    theory: [
      '"ps aux": Displays all active running processes across the system.',
      '"top": Live real-time dashboard of CPU, memory, and process threads.',
      '"kill 404": Sends a termination signal to stop process PID 404.',
      '"find . -name \\"*.txt\\"": Recursively scans folders for matching filename patterns.'
    ],
    type: 'process_mgmt',
    suggestedPills: ['ps aux', 'top', 'find . -name "*.txt"', 'kill 404'],
    objectives: [
            {
        id: 'obj_10_1',
        description: "List all active processes: type \"ps aux\" and press Enter!",
        targetCheck: 'ps',
        commandToType: "ps aux",
        instruction: "List all active system processes",
        why: "ps aux reads /proc to reveal every process, user owner, CPU%, MEM%, and command line",
        followUpDone: "Processes listed: Scanned the active operating system task table!",
        hint: "Type \"ps aux\" and press Enter!"
      },
            {
        id: 'obj_10_2',
        description: "Monitor CPU load: type \"top\" and press Enter!",
        targetCheck: 'top',
        commandToType: "top",
        instruction: "Monitor real-time system performance",
        why: "top provides an interactive live dashboard of CPU load, RAM usage, and thread activity",
        followUpDone: "Performance monitored: Inspected live system load and memory consumption!",
        hint: "Type \"top\" and press Enter!"
      },
            {
        id: 'obj_10_3',
        description: "Find files by pattern: type \"find . -name \\\"*.txt\\\"\" and press Enter!",
        targetCheck: 'find',
        commandToType: "find . -name \"*.txt\"",
        instruction: "Locate files recursively across directories",
        why: "find traverses directory subtrees looking for filenames, sizes, permissions, or dates",
        followUpDone: "Files located: Traversed filesystem to locate all *.txt documents!",
        hint: "Type \"find . -name \\\"*.txt\\\"\" and press Enter!"
      },
            {
        id: 'obj_10_capstone',
        description: "⚡ Capstone Project: Inspect active system processes! Type ps aux to scan running jobs.",
        targetCheck: 'ps',
        commandToType: "ps aux",
        instruction: "Perform comprehensive process audit",
        why: "Ensures no rogue or orphaned processes are consuming CPU cycles on the host",
        followUpDone: "Audit complete: Host tasks verified healthy and operational!",
        hint: "Type ps aux to list all running processes"
      }
    ],
    capstone: {
      title: 'Rogue Process Interception & System Diagnostics',
      scenario: 'The server processor is running hot! Inspect the active process table, identify high-load PIDs, and prepare system cleanup.',
      learningTakeaway: 'Every running task is a Linux process with a PID tracked in the virtual /proc filesystem. ps and top inspect resource allocation, while kill signals and find maintain host health.',
      command: 'ps aux',
      targetCheck: 'ps',
      bonusXp: 150
    },
    xpReward: 300
  },
  {
    levelNumber: 11,
    title: 'Network & Archive Rangers',
    subtitle: 'Connecting the Globe: tar, gzip, curl, wget & ssh',
    grade: '11th - 12th Grade',
    gradeBand: 'high_advanced',
    iconName: 'Globe',
    color: 'cyan',
    mascotTip: 'The internet runs on Linux! "tar" bundles entire project folders into tape archives, "gzip" compresses them, and "curl" talks to web APIs across the globe.',
    story: 'Step into the cloud operations center! Package multi-file directories into tarballs, test network endpoints with curl, and simulate secure remote access with ssh.',
    theory: [
      '"tar -czvf backup.tar.gz lab": Bundles and compresses a directory into a single file.',
      '"tar -xzvf backup.tar.gz": Unpacks and decompresses an archive.',
      '"curl https://jumbolinux.kids": Sends HTTP requests to APIs and web services.',
      '"ssh cadet@lab": Opens an encrypted cryptographic remote shell connection.'
    ],
    type: 'network_archive',
    suggestedPills: ['tar -czvf backup.tar.gz lab', 'curl https://jumbolinux.kids', 'ssh cadet@lab'],
    objectives: [
            {
        id: 'obj_11_1',
        description: "Fetch web data: type \"curl https://jumbolinux.kids\" and press Enter!",
        targetCheck: 'curl',
        commandToType: "curl https://jumbolinux.kids",
        instruction: "Fetch web data over HTTP protocol",
        why: "curl is the universal Swiss-army knife for API requests, downloads, and testing microservices",
        followUpDone: "Network reached: Connected and retrieved HTTP payload from web server!",
        hint: "Type \"curl https://jumbolinux.kids\" and press Enter!"
      },
            {
        id: 'obj_11_2',
        description: "Create compressed archive: type \"tar -czvf backup.tar.gz lab\" and press Enter!",
        targetCheck: 'tar',
        commandToType: "tar -czvf backup.tar.gz lab",
        instruction: "Create compressed gzip tape archive",
        why: "tar bundles directory hierarchies with permissions intact, and gzip compresses size",
        followUpDone: "Archive created: Bundled and compressed directory into backup.tar.gz!",
        hint: "Type \"tar -czvf backup.tar.gz lab\" and press Enter!"
      },
            {
        id: 'obj_11_3',
        description: "Connect remote shell: type \"ssh cadet@lab\" and press Enter!",
        targetCheck: 'ssh',
        commandToType: "ssh cadet@lab",
        instruction: "Initiate encrypted remote shell connection",
        why: "SSH (Secure Shell) encrypts remote terminal administration over untrusted networks",
        followUpDone: "Remote shell connected: Cryptographic terminal session established!",
        hint: "Type \"ssh cadet@lab\" and press Enter!"
      },
            {
        id: 'obj_11_capstone',
        description: "🌐 Capstone Project: Ping the network API! Type curl https://jumbolinux.kids",
        targetCheck: 'curl',
        commandToType: "curl https://jumbolinux.kids",
        instruction: "Ping satellite uplink API endpoint",
        why: "Verifies network DNS resolution, TLS certificates, and HTTP response codes",
        followUpDone: "Satellite online: Uplink API responded with 200 OK status!",
        hint: "Type curl https://jumbolinux.kids and press Enter"
      }
    ],
    capstone: {
      title: 'Global Archive Bundle & Satellite Network Ping',
      scenario: 'Package telemetry logs into a compressed gzip tarball and ping the remote cloud endpoint to verify satellite uplink.',
      learningTakeaway: 'tar bundles directory structures while preserving UNIX ownership and permissions, gzip compresses bytes efficiently, and curl tests REST APIs and network connectivity worldwide.',
      command: 'curl https://jumbolinux.kids',
      targetCheck: 'curl',
      bonusXp: 160
    },
    xpReward: 320
  },
  {
    levelNumber: 12,
    title: "Hacker's Lab: Regex, Python & C",
    subtitle: 'Capstone Graduation: grep -E, python3 & gcc',
    grade: '12th Grade / Capstone',
    gradeBand: 'high_advanced',
    iconName: 'Terminal',
    color: 'emerald',
    mascotTip: 'Congratulations, Linux Master! You now wield the power of regular expressions, high-level Python scripting, and compiled C code right inside your terminal.',
    story: 'Your capstone graduation journey is here! Combine advanced regular expressions with grep -E, run standalone Python automation scripts in the shell, and invoke the GCC C compiler.',
    theory: [
      '"grep -E \'penguin|elephant\' animals.txt": Uses Extended Regular Expressions for multi-pattern searches.',
      '"python3 -c \'print(\\"Linux Champion!\\")\'": Runs immediate Python code directly from bash.',
      '"gcc -v": Verifies the GNU Compiler Collection that compiled the Linux kernel itself.'
    ],
    type: 'bash_scripting',
    suggestedPills: ['grep -E "penguin|elephant" animals.txt', 'python3 -c "print(\'Hello Linux!\')"', 'gcc -v'],
    objectives: [
            {
        id: 'obj_12_1',
        description: "Regex pattern matching: type \"grep -E \\\"penguin|elephant\\\" animals.txt\" and press Enter!",
        targetCheck: 'grep',
        commandToType: "grep -E \"penguin|elephant\" animals.txt",
        instruction: "Multi-pattern search using regex",
        why: "grep -E unlocks Extended Regular Expressions (ERE) using logical pipes (|) and quantifiers",
        followUpDone: "Regex matched: Identified all lines satisfying multi-pattern filter!",
        hint: "Type \"grep -E \\\"penguin|elephant\\\" animals.txt\" and press Enter!"
      },
            {
        id: 'obj_12_2',
        description: "Execute Python code in shell: type \"python3 -c \\\"print('Hello Linux!')\\\"\" and press Enter!",
        targetCheck: 'python',
        commandToType: "python3 -c \"print('Hello Linux!')\"",
        instruction: "Execute inline Python automation script",
        why: "python3 -c executes Python expressions directly inside shell automation pipelines",
        followUpDone: "Python executed: Interpreted and executed high-level scripting logic in shell!",
        hint: "Type \"python3 -c \\\"print('Hello Linux!')\\\"\" and press Enter!"
      },
            {
        id: 'obj_12_3',
        description: "Verify C compiler: type \"gcc -v\" and press Enter!",
        targetCheck: 'gcc',
        commandToType: "gcc -v",
        instruction: "Verify GNU C Compiler Collection",
        why: "GCC is the legendary compiler that translates C code into machine binaries and compiled Linux",
        followUpDone: "Compiler verified: GNU C Compiler toolchain inspected and verified!",
        hint: "Type \"gcc -v\" and press Enter!"
      },
            {
        id: 'obj_12_capstone',
        description: "🎓 Capstone Project: Run the graduation Python script! Type python3 -c \"print('Master Explorer!')\"",
        targetCheck: 'python',
        commandToType: "python3 -c \"print('Master Explorer!')\"",
        instruction: "Run grand graduation script",
        why: "Celebrates your complete mastery across the Linux terminal ecosystem",
        followUpDone: "Graduation achieved: You are officially a Certified Jumbo Linux Master!",
        hint: "Type python3 -c \"print('Master Explorer!')\" and press Enter"
      }
    ],
    capstone: {
      title: 'Grand Tux Linux Engineer Graduation Script',
      scenario: 'Run your final Python automation script in the shell to compile diagnostic telemetry and graduate as a Certified Jumbo Linux Master!',
      learningTakeaway: 'You have mastered shell navigation, pipelines, permissions, process management, network tools, and script execution. You now possess the foundational knowledge that powers cloud computing, Android, supercomputers, and space exploration!',
      command: 'python3 -c "print(\'Master Explorer!\')"',
      targetCheck: 'python',
      bonusXp: 250
    },
    xpReward: 500
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge_l1',
    title: 'Keyboard Explorer',
    description: 'Completed Level 1: Mastered whoami, echo, which & clear!',
    icon: 'Zap',
    color: '#4285F4',
    levelRequired: 1
  },
  {
    id: 'badge_l2',
    title: 'Terminal Cinema',
    description: 'Completed Level 2: Viewed images and ASCII art with feh & chafa!',
    icon: 'Play',
    color: '#0F9D58',
    levelRequired: 2
  },
  {
    id: 'badge_l3',
    title: 'Forest & Cow Whisperer',
    description: 'Completed Level 3: Unlocked tree, cowsay & fortune!',
    icon: 'Trees',
    color: '#AB47BC',
    levelRequired: 3
  },
  {
    id: 'badge_l4',
    title: 'Coreutils Navigator',
    description: 'Completed Level 4: Mastered pwd, ls -la, cd & Linux Root Tree!',
    icon: 'Compass',
    color: '#1E88E5',
    levelRequired: 4
  },
  {
    id: 'badge_l5',
    title: 'Shell Key Master',
    description: 'Completed Level 5: Mastered history, help, echo $SHELL & Shortcuts!',
    icon: 'Sparkles',
    color: '#FBBC05',
    levelRequired: 5
  },
  {
    id: 'badge_l6',
    title: 'Filesystem Architect',
    description: 'Completed Level 6: Mastered mkdir -p, touch, cp & mv!',
    icon: 'FolderPlus',
    color: '#00ACC1',
    levelRequired: 6
  },
  {
    id: 'badge_l7',
    title: 'Permission Craftsman',
    description: 'Completed Level 7: Mastered file formats, chmod 755 & security!',
    icon: 'Shield',
    color: '#E53935',
    levelRequired: 7
  },
  {
    id: 'badge_l8',
    title: 'Pipeline Sorcerer',
    description: 'Completed Level 8: Mastered data streams, pipes & wc -l!',
    icon: 'Workflow',
    color: '#00897B',
    levelRequired: 8
  },
  {
    id: 'badge_l9',
    title: 'Text Inspector',
    description: 'Completed Level 9: Mastered grep, head, tail, sort & cut!',
    icon: 'FileSearch',
    color: '#FB8C00',
    levelRequired: 9
  },
  {
    id: 'badge_l10',
    title: 'Process Commander',
    description: 'Completed Level 10: Mastered ps aux, top, kill & find!',
    icon: 'Activity',
    color: '#D81B60',
    levelRequired: 10
  },
  {
    id: 'badge_l11',
    title: 'Network & Archive Ranger',
    description: 'Completed Level 11: Mastered tar, gzip, curl & ssh!',
    icon: 'Globe',
    color: '#00BCD4',
    levelRequired: 11
  },
  {
    id: 'badge_l12',
    title: 'Grand Tux Capstone Legend',
    description: 'Graduated Level 12: Certified Linux Super-User & Engineer!',
    icon: 'Terminal',
    color: '#43A047',
    levelRequired: 12
  },
  {
    id: 'badge_matcher',
    title: 'Command Matcher Apprentice',
    description: 'Solved matching rounds in the Command Matcher lab!',
    icon: 'Puzzle',
    color: '#8E24AA'
  },
  {
    id: 'badge_rescue',
    title: 'Falling Keys Sharp-Shooter',
    description: 'Scored high in the Typing Rescue challenge!',
    icon: 'Flame',
    color: '#F4511E'
  },
  {
    id: 'badge_duel',
    title: 'Speed Duel Champion',
    description: 'Defeated rival cadets in rapid command showdowns!',
    icon: 'Sword',
    color: '#3949AB'
  },
  {
    id: 'badge_local_runner',
    title: 'Local Terminal Pioneer',
    description: 'Explored real local terminal guidelines and bash scripts!',
    icon: 'Cpu',
    color: '#5E35B1'
  },
  {
    id: 'badge_century',
    title: 'Century Master',
    description: 'Executed over 100 Linux commands in the shell!',
    icon: 'Award',
    color: '#F9A825'
  },
  {
    id: 'badge_streak_3',
    title: 'Terminal Habit Master',
    description: 'Maintained a 3-day Linux learning streak!',
    icon: 'Calendar',
    color: '#00897B'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Aria_Tux99', xp: 3420, badgeCount: 14, avatar: '🐧' },
  { rank: 2, name: 'BashMaster_Leo', xp: 3100, badgeCount: 12, avatar: '🦁' },
  { rank: 3, name: 'ZshNinja_Sam', xp: 2850, badgeCount: 11, avatar: '🥷' },
  { rank: 4, name: 'RootKid_Maya', xp: 2490, badgeCount: 10, avatar: '🚀' },
  { rank: 5, name: 'KernelKai', xp: 2150, badgeCount: 9, avatar: '🦊' },
  { rank: 6, name: 'PipSorcerer', xp: 1980, badgeCount: 8, avatar: '🧙' },
  { rank: 7, name: 'SudoZara', xp: 1720, badgeCount: 7, avatar: '⭐' },
  { rank: 8, name: 'ByteExplorer', xp: 1450, badgeCount: 6, avatar: '🤖' },
  { rank: 9, name: 'ChmodChamp', xp: 1200, badgeCount: 5, avatar: '🛡️' },
  { rank: 10, name: 'EchoCadet', xp: 950, badgeCount: 4, avatar: '🐘' }
];

export const MOCK_LEADERBOARD = INITIAL_LEADERBOARD;
