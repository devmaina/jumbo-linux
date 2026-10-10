import { VFSNode } from '../types';

export interface VFSState {
  currentPath: string; // e.g. "/home/jumbo"
  root: VFSNode;
  processes: { pid: number; name: string; cpu: string; mem: string; status: string }[];
  history: string[];
  currentUser?: string;
  currentEmail?: string;
}

export function createInitialVFS(currentUser?: string, currentEmail?: string): VFSState {
  return {
    currentPath: '/home/jumbo',
    currentUser: currentUser || 'student',
    currentEmail: currentEmail || 'student@jumbolinux.kids',
    processes: [
      { pid: 1, name: 'systemd', cpu: '0.1%', mem: '1.2%', status: 'Ss' },
      { pid: 42, name: 'bash', cpu: '0.0%', mem: '0.8%', status: 'Ss+' },
      { pid: 108, name: 'tux_monitor', cpu: '0.2%', mem: '1.0%', status: 'S' },
      { pid: 215, name: 'chrome_sandbox', cpu: '1.5%', mem: '4.2%', status: 'Sl' },
      { pid: 404, name: 'space_glitch', cpu: '98.5%', mem: '14.8%', status: 'R' } // rogue process to kill in Level 10!
    ],
    history: [],
    root: {
      name: '',
      type: 'directory',
      permissions: 'rwxr-xr-x',
      owner: 'root',
      size: 4096,
      children: {
        bin: {
          name: 'bin',
          type: 'directory',
          permissions: 'rwxr-xr-x',
          owner: 'root',
          size: 4096,
          children: {
            ls: { name: 'ls', type: 'file', permissions: 'rwxr-xr-x', owner: 'root', size: 142000, content: '[ELF binary]' },
            cd: { name: 'cd', type: 'file', permissions: 'rwxr-xr-x', owner: 'root', size: 85000, content: '[Shell built-in]' },
            cat: { name: 'cat', type: 'file', permissions: 'rwxr-xr-x', owner: 'root', size: 43000, content: '[ELF binary]' },
            grep: { name: 'grep', type: 'file', permissions: 'rwxr-xr-x', owner: 'root', size: 165000, content: '[ELF binary]' },
            bash: { name: 'bash', type: 'file', permissions: 'rwxr-xr-x', owner: 'root', size: 1200000, content: '[ELF binary]' }
          }
        },
        etc: {
          name: 'etc',
          type: 'directory',
          permissions: 'rwxr-xr-x',
          owner: 'root',
          size: 4096,
          children: {
            'os-release': {
              name: 'os-release',
              type: 'file',
              permissions: 'rw-r--r--',
              owner: 'root',
              size: 240,
              content: 'NAME="Jumbo Linux Kids"\nVERSION="2026 LTS (Penguin Edition)"\nID=jumbo-linux\nPRETTY_NAME="Jumbo Linux for Young Explorers"\nHOME_URL="https://jumbo-linux-kids.edu"'
            },
            hostname: {
              name: 'hostname',
              type: 'file',
              permissions: 'rw-r--r--',
              owner: 'root',
              size: 16,
              content: 'jumbo-chromebook\n'
            }
          }
        },
        home: {
          name: 'home',
          type: 'directory',
          permissions: 'rwxr-xr-x',
          owner: 'root',
          size: 4096,
          children: {
            jumbo: {
              name: 'jumbo',
              type: 'directory',
              permissions: 'rwxr-xr-x',
              owner: 'jumbo',
              size: 4096,
              children: {
                'mission.txt': {
                  name: 'mission.txt',
                  type: 'file',
                  permissions: 'rw-r--r--',
                  owner: 'jumbo',
                  size: 180,
                  content: 'Welcome to Level 7, Ranger Jumbo!\nYour task is to inspect log files, track down system anomalies, and unlock the power of cat and pipes!'
                },
                'animals.txt': {
                  name: 'animals.txt',
                  type: 'file',
                  permissions: 'rw-r--r--',
                  owner: 'jumbo',
                  size: 420,
                  content: '1. Emperor Penguin [Species: Aptenodytes forsteri] - Status: Active\n2. African Elephant [Species: Loxodonta africana] - Status: Jumbo-Star\n3. Gentoo Penguin [Species: Pygoscelis papua] - Status: Fast\n4. Blue Whale [Species: Balaenoptera musculus] - Status: Majestic\n5. Little Blue Penguin [Species: Eudyptula minor] - Status: Friendly\n6. Red Panda [Species: Ailurus fulgens] - Status: Playful\n7. Tux Penguin [Species: Linux Mascot] - Status: CHAMPION'
                },
                'system_log.txt': {
                  name: 'system_log.txt',
                  type: 'file',
                  permissions: 'rw-r--r--',
                  owner: 'jumbo',
                  size: 512,
                  content: '[08:00:01] BOOT: Linux kernel 6.8.0 initialized.\n[08:00:02] NETWORK: Connected to School-WiFi.\n[08:00:03] AUTH: User jumbo logged in from terminal.\n[08:00:04] AUDIO: Penguin chirps enabled.\n[08:00:05] WARNING: space_glitch background thread started with PID 404!\n[08:00:06] NOTICE: Ready for commands.'
                },
                'play.sh': {
                  name: 'play.sh',
                  type: 'file',
                  permissions: 'rw-r--r--', // initially non-executable so kid learns chmod!
                  owner: 'jumbo',
                  size: 150,
                  content: '#!/bin/bash\necho "🎮 Loading Jumbo-Linux-Kids mini game..."\necho "🐧 Tux says: High-five! You made this script executable!"'
                },
                'backup.sh': {
                  name: 'backup.sh',
                  type: 'file',
                  permissions: 'rwxr-xr-x',
                  owner: 'jumbo',
                  size: 260,
                  content: '#!/bin/bash\n# Level 11 Bash Automation Script\nUSER="jumbo"\nDEST="/home/jumbo/backups"\necho "🚀 Starting automated backup for $USER..."\necho "📁 Synchronizing files to $DEST"\necho "✅ Backup completed successfully in 0.42s!"'
                },
                recipes: {
                  name: 'recipes',
                  type: 'directory',
                  permissions: 'rwxr-xr-x',
                  owner: 'jumbo',
                  size: 4096,
                  children: {
                    'icecream.txt': {
                      name: 'icecream.txt',
                      type: 'file',
                      permissions: 'rw-r--r--',
                      owner: 'jumbo',
                      size: 120,
                      content: '🍦 Tux & Jumbo Secret Ice Cream Recipe:\n- 2 cups Frozen Snow Flakes\n- 1 cup Vanilla Bean\n- 3 drops Berry Syrups\nMix with bash!'
                    }
                  }
                },
                games: {
                  name: 'games',
                  type: 'directory',
                  permissions: 'rwxr-xr-x',
                  owner: 'jumbo',
                  size: 4096,
                  children: {
                    'drop-catch.sh': {
                      name: 'drop-catch.sh',
                      type: 'file',
                      permissions: 'rwxr-xr-x',
                      owner: 'jumbo',
                      size: 240,
                      content: '#!/bin/bash\n# 1. Drop Catch Arcade\n# Catch falling stars with your basket!\ngame drop-catch\n'
                    },
                    'single-shot.sh': {
                      name: 'single-shot.sh',
                      type: 'file',
                      permissions: 'rwxr-xr-x',
                      owner: 'jumbo',
                      size: 240,
                      content: '#!/bin/bash\n# 2. Single Shot Target Range\n# Aim laser cannon at rogue glitch\ngame single-shot\n'
                    },
                    'missile-defense.sh': {
                      name: 'missile-defense.sh',
                      type: 'file',
                      permissions: 'rwxr-xr-x',
                      owner: 'jumbo',
                      size: 260,
                      content: '#!/bin/bash\n# 3. Missile Defense Base\n# Intercept asteroid cluster!\ngame missile-defense\n'
                    },
                    'letter-bomb.sh': {
                      name: 'letter-bomb.sh',
                      type: 'file',
                      permissions: 'rwxr-xr-x',
                      owner: 'jumbo',
                      size: 250,
                      content: '#!/bin/bash\n# 4. Letter Bomb Defusal\n# Defuse ticking terminal code!\ngame letter-bomb\n'
                    },
                    'left-right-bomb.sh': {
                      name: 'left-right-bomb.sh',
                      type: 'file',
                      permissions: 'rwxr-xr-x',
                      owner: 'jumbo',
                      size: 250,
                      content: '#!/bin/bash\n# 5. Left / Right Bomb Dodge\n# Dodge explosive bombs!\ngame left-right-bomb\n'
                    }
                  }
                },
                media: {
                  name: 'media',
                  type: 'directory',
                  permissions: 'rwxr-xr-x',
                  owner: 'jumbo',
                  size: 4096,
                  children: {
                    'tux.png': {
                      name: 'tux.png',
                      type: 'file',
                      permissions: 'rw-r--r--',
                      owner: 'jumbo',
                      size: 15360,
                      content: '[PNG Image: Tux the Penguin mascot 320x320 - view with feh or chafa]'
                    },
                    'song.mp3': {
                      name: 'song.mp3',
                      type: 'file',
                      permissions: 'rw-r--r--',
                      owner: 'jumbo',
                      size: 48200,
                      content: '[MP3 Audio: Tux Linux 8-bit theme track - play with mpv or mplayer]'
                    }
                  }
                },
                'note.txt': {
                  name: 'note.txt',
                  type: 'file',
                  permissions: 'rw-r--r--',
                  owner: 'jumbo',
                  size: 96,
                  content: 'Hello Linux! I created this note using the GNU Nano terminal editor.\nNo mouse needed here!'
                },
                '.tux_secret': {
                  name: '.tux_secret',
                  type: 'file',
                  permissions: 'rw-r--r--',
                  owner: 'jumbo',
                  size: 95,
                  content: '🤫 Shhh! You found the hidden dot-file! Files starting with "." are hidden from regular "ls". Use "ls -a"!'
                }
              }
            }
          }
        },
        secret: {
          name: 'secret',
          type: 'directory',
          permissions: 'rwxr-x---',
          owner: 'root',
          size: 4096,
          children: {
            '.flag.txt': {
              name: '.flag.txt',
              type: 'file',
              permissions: 'r--r--r--',
              owner: 'root',
              size: 88,
              content: '🎉🏆 FLAG{TUX_JUMBO_LINUX_HERO_2026} 🏆🎉\nYou have successfully completed the Capstone CTF Challenge!'
            },
            'clue.txt': {
              name: 'clue.txt',
              type: 'file',
              permissions: 'rw-r--r--',
              owner: 'root',
              size: 75,
              content: 'The flag is hidden right here as a dotfile! Run: cat /secret/.flag.txt'
            }
          }
        }
      }
    }
  };
}

export interface ExecResult {
  output: string;
  type: 'output' | 'error' | 'success' | 'system';
  newPath?: string;
  eventsTriggered: string[];
}

export function executeCommand(rawCommand: string, state: VFSState): { result: ExecResult; nextState: VFSState } {
  const trimmed = rawCommand.trim();
  const nextState: VFSState = JSON.parse(JSON.stringify(state));
  const eventsTriggered: string[] = [];

  if (!trimmed) {
    return {
      result: { output: '', type: 'output', eventsTriggered: [] },
      nextState
    };
  }

  nextState.history.push(trimmed);

  // Check for pipes "|"
  if (trimmed.includes('|')) {
    return handlePipedCommand(trimmed, state, nextState);
  }

  // Check for redirection ">"
  if (trimmed.includes('>')) {
    return handleRedirection(trimmed, state, nextState);
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  eventsTriggered.push(`cmd_${cmd}`);

  switch (cmd) {
    case 'help': {
      const helpText = `🐧 JUMBO-LINUX-KIDS COMMAND REFERENCE 🐘
------------------------------------------------------
Navigation:     pwd, ls [-l, -a], cd [dir, .., ~]
File Ops:       touch [file], mkdir [dir], rm [-r item]
Viewing & Text: cat [file], head [-n N], tail [-n N], grep [word] [file]
Plumbing:       | (pipe output into another command), > (redirect to file)
System:         whoami, uname -a, date, clear, ps [aux], kill [PID]
Automation:     bash [script.sh], ./[script.sh], echo [text]
Permissions:    chmod [+x, 755] [file]
------------------------------------------------------
Tip: Press [Tab] for command hints or click the Quick Pills below!`;
      return {
        result: { output: helpText, type: 'system', eventsTriggered },
        nextState
      };
    }

    case 'whoami': {
      eventsTriggered.push('whoami');
      eventsTriggered.push('cmd_whoami');
      const studentName = nextState.currentUser || 'student';
      return {
        result: { output: studentName, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'who': {
      eventsTriggered.push('whoami');
      eventsTriggered.push('cmd_whoami');
      const studentName = nextState.currentUser || 'student';
      if (args.join(' ').toLowerCase() === 'am i') {
        return {
          result: { output: studentName, type: 'output', eventsTriggered },
          nextState
        };
      }
      return {
        result: { output: `${studentName}  tty7         2026-09-07 09:00 (:0)`, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'uname': {
      eventsTriggered.push('uname');
      if (args.includes('-a')) {
        return {
          result: {
            output: 'Linux jumbo-chromebook 6.8.0-kids-generic #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
            type: 'output',
            eventsTriggered
          },
          nextState
        };
      }
      return {
        result: { output: 'Linux', type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'date': {
      return {
        result: { output: new Date().toUTCString(), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'clear': {
      eventsTriggered.push('clear');
      return {
        result: { output: '__CLEAR__', type: 'system', eventsTriggered },
        nextState
      };
    }

    case 'pwd': {
      eventsTriggered.push('pwd');
      return {
        result: { output: nextState.currentPath, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'ls': {
      eventsTriggered.push('ls');
      const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
      if (showAll) eventsTriggered.push('ls_a');
      if (showLong) eventsTriggered.push('ls_l');

      // Find target path
      let targetPath = nextState.currentPath;
      const pathArg = args.find(a => !a.startsWith('-'));
      if (pathArg) {
        targetPath = resolvePath(nextState.currentPath, pathArg);
        if (targetPath === '/') eventsTriggered.push('ls_root');
        if (targetPath === '/home') eventsTriggered.push('ls_home');
        if (targetPath === '/secret') eventsTriggered.push('ls_secret');
        if (targetPath === '/home/jumbo/recipes' || pathArg === 'recipes') eventsTriggered.push('ls_inside_recipes');
      } else {
        if (targetPath === '/home/jumbo/recipes') eventsTriggered.push('ls_inside_recipes');
      }

      const node = getNodeAtPath(nextState.root, targetPath);
      if (!node) {
        return {
          result: { output: `ls: cannot access '${pathArg}': No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }

      if (node.type === 'file') {
        return {
          result: { output: node.name, type: 'output', eventsTriggered },
          nextState
        };
      }

      const children = node.children || {};
      const entries = Object.keys(children).filter(name => {
        if (showAll) return true;
        return !name.startsWith('.');
      });

      // Special verification check
      if (children['projects'] && (children['projects'].children?.['ideas.txt'] || children['ideas.txt'])) {
        eventsTriggered.push('ls_verify_creation');
      }

      if (showLong) {
        const lines = entries.map(name => {
          const item = children[name];
          const isDir = item.type === 'directory';
          const perms = isDir ? `d${item.permissions}` : `-${item.permissions}`;
          return `${perms}  1 ${item.owner} ${item.owner}  ${String(item.size).padStart(5, ' ')} Mar 02  ${name}${isDir ? '/' : ''}`;
        });
        return {
          result: { output: `total ${entries.length * 4}\n` + lines.join('\n'), type: 'output', eventsTriggered },
          nextState
        };
      }

      return {
        result: {
          output: entries.map(name => {
            const isDir = children[name].type === 'directory';
            return isDir ? `${name}/` : name;
          }).join('   '),
          type: 'output',
          eventsTriggered
        },
        nextState
      };
    }

    case 'cd': {
      eventsTriggered.push('cd');
      const targetArg = args[0] || '~';
      let dest = '';
      if (targetArg === '~' || targetArg === '') {
        dest = '/home/jumbo';
        eventsTriggered.push('cd_home');
      } else {
        dest = resolvePath(nextState.currentPath, targetArg);
      }

      if (dest === '/home/jumbo' && (targetArg === '..' || targetArg === '~')) {
        eventsTriggered.push('cd_home');
      }

      if (dest === '/home/jumbo/recipes') {
        eventsTriggered.push('cd_recipes');
      }

      const node = getNodeAtPath(nextState.root, dest);
      if (!node) {
        return {
          result: { output: `cd: ${targetArg}: No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }
      if (node.type !== 'directory') {
        return {
          result: { output: `cd: not a directory: ${targetArg}`, type: 'error', eventsTriggered },
          nextState
        };
      }

      nextState.currentPath = dest;
      return {
        result: { output: '', type: 'output', newPath: dest, eventsTriggered },
        nextState
      };
    }

    case 'mkdir': {
      eventsTriggered.push('mkdir');
      const isP = args.includes('-p');
      const dirArg = args.find(a => !a.startsWith('-'));
      if (!dirArg) {
        return {
          result: { output: 'mkdir: missing operand', type: 'error', eventsTriggered },
          nextState
        };
      }
      const targetPath = resolvePath(nextState.currentPath, dirArg);
      const parts = targetPath.split('/').filter(Boolean);
      let curr = nextState.root;
      for (let i = 0; i < parts.length; i++) {
        const seg = parts[i];
        if (!curr.children) curr.children = {};
        if (!curr.children[seg]) {
          if (i < parts.length - 1 && !isP) {
            return {
              result: { output: `mkdir: cannot create directory '${dirArg}': No such file or directory`, type: 'error', eventsTriggered },
              nextState
            };
          }
          curr.children[seg] = {
            name: seg,
            type: 'directory',
            permissions: 'rwxr-xr-x',
            owner: 'jumbo',
            size: 4096,
            children: {}
          };
        }
        curr = curr.children[seg];
      }
      if (dirArg.includes('lab') || dirArg.includes('gadgets') || dirArg.includes('projects')) {
        eventsTriggered.push('mkdir_lab');
      }
      return {
        result: { output: `📁 Created directory '${dirArg}'`, type: 'success', eventsTriggered },
        nextState
      };
    }

    case 'touch': {
      eventsTriggered.push('touch');
      const fileArg = args.find(a => !a.startsWith('-'));
      if (!fileArg) {
        return {
          result: { output: 'touch: missing file operand', type: 'error', eventsTriggered },
          nextState
        };
      }
      const targetPath = resolvePath(nextState.currentPath, fileArg);
      const lastSlash = targetPath.lastIndexOf('/');
      const parentPath = targetPath.slice(0, lastSlash) || '/';
      const fileName = targetPath.slice(lastSlash + 1);
      const parentNode = getNodeAtPath(nextState.root, parentPath);
      if (parentNode && parentNode.children) {
        if (!parentNode.children[fileName]) {
          parentNode.children[fileName] = {
            name: fileName,
            type: 'file',
            permissions: 'rw-r--r--',
            owner: 'jumbo',
            size: 0,
            content: ''
          };
        }
        if (fileArg.includes('laser.txt') || fileArg.includes('blueprint') || fileArg.includes('ideas.txt')) {
          eventsTriggered.push('touch_laser');
          eventsTriggered.push('touch_ideas');
        }
        return {
          result: { output: `📄 Created file '${fileArg}'`, type: 'success', eventsTriggered },
          nextState
        };
      }
      return {
        result: { output: `touch: cannot touch '${fileArg}': No such file or directory`, type: 'error', eventsTriggered },
        nextState
      };
    }

    case 'file': {
      eventsTriggered.push('file');
      const targetName = args.find(a => !a.startsWith('-')) || '';
      if (!targetName) {
        return {
          result: { output: 'file: missing argument', type: 'error', eventsTriggered },
          nextState
        };
      }
      const target = resolvePath(nextState.currentPath, targetName);
      const node = getNodeAtPath(nextState.root, target);
      if (!node) {
        return {
          result: { output: `file: cannot open '${targetName}': No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }
      if (node.type === 'directory') {
        return {
          result: { output: `${targetName}: directory`, type: 'output', eventsTriggered },
          nextState
        };
      }
      const content = node.content || '';
      let fileTypeDesc = 'ASCII text';
      if (targetName.endsWith('.sh') || content.startsWith('#!')) fileTypeDesc = 'POSIX shell script text executable';
      else if (targetName.endsWith('.png') || targetName.endsWith('.jpg')) fileTypeDesc = 'PNG image data, 320 x 320, 8-bit/color RGBA';
      else if (targetName.endsWith('.mp3')) fileTypeDesc = 'Audio file with ID3 version 2.4.0, MP3';
      else if (targetName.endsWith('.tar.gz')) fileTypeDesc = 'gzip compressed data, POSIX tar archive';
      else if (targetName.endsWith('.py')) fileTypeDesc = 'Python script text executable';
      return {
        result: { output: `${targetName}: ${fileTypeDesc}`, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'rm': {
      if (!args[0]) {
        return {
          result: { output: 'rm: missing operand', type: 'error', eventsTriggered },
          nextState
        };
      }
      const isRecursive = args.includes('-r') || args.includes('-rf');
      const targetName = args.find(a => !a.startsWith('-'));
      if (!targetName) {
        return {
          result: { output: 'rm: missing file operand', type: 'error', eventsTriggered },
          nextState
        };
      }
      const parentNode = getNodeAtPath(nextState.root, nextState.currentPath);
      if (parentNode?.children && parentNode.children[targetName]) {
        const item = parentNode.children[targetName];
        if (item.type === 'directory' && !isRecursive) {
          return {
            result: { output: `rm: cannot remove '${targetName}': Is a directory (use 'rm -r')`, type: 'error', eventsTriggered },
            nextState
          };
        }
        delete parentNode.children[targetName];
        return {
          result: { output: `🗑️ Removed '${targetName}'`, type: 'success', eventsTriggered },
          nextState
        };
      }
      return {
        result: { output: `rm: cannot remove '${targetName}': No such file or directory`, type: 'error', eventsTriggered },
        nextState
      };
    }

    case 'cat': {
      eventsTriggered.push('cat');
      if (!args[0]) {
        return {
          result: { output: 'cat: missing file operand', type: 'error', eventsTriggered },
          nextState
        };
      }
      const filePath = args[0];
      const target = resolvePath(nextState.currentPath, filePath);
      const node = getNodeAtPath(nextState.root, target);

      if (!node) {
        return {
          result: { output: `cat: ${filePath}: No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }
      if (node.type === 'directory') {
        return {
          result: { output: `cat: ${filePath}: Is a directory`, type: 'error', eventsTriggered },
          nextState
        };
      }

      if (filePath === 'mission.txt' || target.endsWith('mission.txt')) {
        eventsTriggered.push('cat_mission');
      }
      if (filePath === 'note.txt' || target.endsWith('note.txt')) {
        eventsTriggered.push('cat_note');
      }
      if (filePath === 'backup.sh' || target.endsWith('backup.sh')) {
        eventsTriggered.push('cat_backup');
      }
      if (filePath.includes('.flag.txt') || target.includes('.flag.txt')) {
        eventsTriggered.push('cat_flag');
      }

      return {
        result: { output: node.content || '', type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'head': {
      const fileName = args[args.length - 1];
      const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1], 10) || 5 : 5;
      const target = resolvePath(nextState.currentPath, fileName);
      const node = getNodeAtPath(nextState.root, target);
      if (!node || node.type !== 'file') {
        return {
          result: { output: `head: cannot open '${fileName}': No such file`, type: 'error', eventsTriggered },
          nextState
        };
      }
      if (fileName.includes('system_log.txt')) {
        eventsTriggered.push('head_log');
      }
      const lines = (node.content || '').split('\n').slice(0, numLines).join('\n');
      return {
        result: { output: lines, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'tail': {
      const fileName = args[args.length - 1];
      const numLines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1], 10) || 5 : 5;
      const target = resolvePath(nextState.currentPath, fileName);
      const node = getNodeAtPath(nextState.root, target);
      if (!node || node.type !== 'file') {
        return {
          result: { output: `tail: cannot open '${fileName}': No such file`, type: 'error', eventsTriggered },
          nextState
        };
      }
      if (fileName.includes('system_log.txt')) {
        eventsTriggered.push('tail_log');
      }
      const allLines = (node.content || '').split('\n');
      const lines = allLines.slice(Math.max(0, allLines.length - numLines)).join('\n');
      return {
        result: { output: lines, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'grep': {
      eventsTriggered.push('grep');
      const isCaseInsensitive = args.includes('-i');
      const pattern = args.find(a => !a.startsWith('-'));
      const targetFile = args[args.length - 1];

      if (!pattern || !targetFile || pattern === targetFile) {
        return {
          result: { output: 'grep: usage: grep [-i] <pattern> <file>', type: 'error', eventsTriggered },
          nextState
        };
      }

      const target = resolvePath(nextState.currentPath, targetFile);
      const node = getNodeAtPath(nextState.root, target);
      if (!node || node.type !== 'file') {
        return {
          result: { output: `grep: ${targetFile}: No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }

      if (pattern.toLowerCase() === 'penguin') {
        eventsTriggered.push('grep_penguin');
      }
      if (pattern.toLowerCase() === 'jumbo' && isCaseInsensitive) {
        eventsTriggered.push('grep_i_jumbo');
      }

      const lines = (node.content || '').split('\n');
      const matched = lines.filter(line => {
        if (isCaseInsensitive) {
          return line.toLowerCase().includes(pattern.toLowerCase());
        }
        return line.includes(pattern);
      });

      return {
        result: {
          output: matched.length > 0 ? matched.join('\n') : '(No matches found)',
          type: matched.length > 0 ? 'output' : 'system',
          eventsTriggered
        },
        nextState
      };
    }

    case 'chmod': {
      eventsTriggered.push('chmod');
      if (args.length < 2) {
        return {
          result: { output: 'chmod: missing operand after chmod', type: 'error', eventsTriggered },
          nextState
        };
      }
      const mode = args[0];
      const targetFile = args[1];
      const target = resolvePath(nextState.currentPath, targetFile);
      const node = getNodeAtPath(nextState.root, target);
      if (!node) {
        return {
          result: { output: `chmod: cannot access '${targetFile}': No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }

      if (mode.includes('+x') || mode === '755' || mode === '777') {
        node.permissions = 'rwxr-xr-x';
        if (targetFile === 'play.sh') {
          eventsTriggered.push('chmod_exec');
          eventsTriggered.push('verify_chmod');
        }
      }
      return {
        result: { output: `🛡️ Permissions changed for '${targetFile}' to [${node.permissions}]`, type: 'success', eventsTriggered },
        nextState
      };
    }

    case 'ps': {
      eventsTriggered.push('ps');
      const isAux = args.includes('aux') || args.includes('-aux');
      const header = '  PID TTY          TIME CMD';
      const rows = nextState.processes.map(p => {
        return `${String(p.pid).padStart(5, ' ')} pts/0    00:00:01 ${p.name}`;
      });
      return {
        result: {
          output: header + '\n' + rows.join('\n'),
          type: 'output',
          eventsTriggered
        },
        nextState
      };
    }

    case 'kill': {
      eventsTriggered.push('kill');
      if (!args[0]) {
        return {
          result: { output: 'kill: usage: kill [-9] <pid>', type: 'error', eventsTriggered },
          nextState
        };
      }
      const pidStr = args.find(a => !a.startsWith('-'));
      const pid = parseInt(pidStr || '', 10);
      const procIdx = nextState.processes.findIndex(p => p.pid === pid);
      if (procIdx === -1) {
        return {
          result: { output: `kill: (${pidStr}) - No such process`, type: 'error', eventsTriggered },
          nextState
        };
      }
      const removed = nextState.processes.splice(procIdx, 1)[0];
      if (removed.pid === 404 || removed.name === 'space_glitch') {
        eventsTriggered.push('kill_glitch');
      }
      return {
        result: { output: `⚡ Process ${removed.pid} [${removed.name}] terminated safely!`, type: 'success', eventsTriggered },
        nextState
      };
    }

    case 'echo': {
      eventsTriggered.push('echo');
      const text = args.join(' ');
      return {
        result: { output: text.replace(/^["']|["']$/g, ''), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'bash':
    case './backup.sh':
    case './play.sh': {
      eventsTriggered.push('bash');
      const scriptName = cmd.startsWith('./') ? cmd.substring(2) : args[0];
      if (!scriptName) {
        return {
          result: { output: 'bash: missing script argument', type: 'error', eventsTriggered },
          nextState
        };
      }
      const target = resolvePath(nextState.currentPath, scriptName);
      const node = getNodeAtPath(nextState.root, target);
      if (!node) {
        return {
          result: { output: `bash: ${scriptName}: No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }
      if (scriptName === 'backup.sh') {
        eventsTriggered.push('run_backup');
        return {
          result: {
            output: `🚀 Running /home/jumbo/backup.sh...\n📁 Synchronizing directories...\n🌟 14 files archived to /home/jumbo/backups\n✅ [Status: 0] Shell script finished with 0 errors!`,
            type: 'success',
            eventsTriggered
          },
          nextState
        };
      }
      if (scriptName === 'play.sh') {
        if (!node.permissions.includes('x')) {
          return {
            result: { output: `bash: ./${scriptName}: Permission denied! (Hint: use chmod +x ${scriptName})`, type: 'error', eventsTriggered },
            nextState
          };
        }
        return {
          result: {
            output: `🎮 Loading Jumbo-Linux-Kids mini game...\n🐧 Tux says: High-five! Script executed cleanly!`,
            type: 'success',
            eventsTriggered
          },
          nextState
        };
      }
      return {
        result: { output: `Executed script ${scriptName}`, type: 'success', eventsTriggered },
        nextState
      };
    }

    case 'nano': {
      eventsTriggered.push('nano');
      eventsTriggered.push('nano_opened');
      const targetFile = args[0] || 'note.txt';
      const target = resolvePath(nextState.currentPath, targetFile);
      let node = getNodeAtPath(nextState.root, target);
      if (!node) {
        const parentNode = getNodeAtPath(nextState.root, nextState.currentPath);
        if (parentNode && parentNode.type === 'directory') {
          parentNode.children = parentNode.children || {};
          parentNode.children[targetFile] = {
            name: targetFile,
            type: 'file',
            permissions: 'rw-r--r--',
            owner: nextState.currentUser || 'jumbo',
            size: 0,
            content: ''
          };
        }
      }
      return {
        result: {
          output: `__NANO__:${targetFile}`,
          type: 'output',
          eventsTriggered
        },
        nextState
      };
    }

    case 'vi':
    case 'vim': {
      eventsTriggered.push('vi');
      eventsTriggered.push('vi_opened');
      const targetFile = args[0] || 'note.txt';
      return {
        result: {
          output: `__VI__:${targetFile}`,
          type: 'output',
          eventsTriggered
        },
        nextState
      };
    }

    case 'cp': {
      eventsTriggered.push('cp');
      if (args.length < 2) {
        return {
          result: { output: 'cp: missing destination file operand', type: 'error', eventsTriggered },
          nextState
        };
      }
      const srcArg = args.find(a => !a.startsWith('-')) || '';
      const destArg = args[args.length - 1];
      const srcPath = resolvePath(nextState.currentPath, srcArg);
      const srcNode = getNodeAtPath(nextState.root, srcPath);
      if (!srcNode) {
        return {
          result: { output: `cp: cannot stat '${srcArg}': No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }
      const parentNode = getNodeAtPath(nextState.root, nextState.currentPath);
      if (parentNode && parentNode.children) {
        parentNode.children[destArg] = JSON.parse(JSON.stringify(srcNode));
        parentNode.children[destArg].name = destArg;
        return {
          result: { output: `📋 Copied '${srcArg}' -> '${destArg}'`, type: 'success', eventsTriggered },
          nextState
        };
      }
      return {
        result: { output: 'cp: failed to copy', type: 'error', eventsTriggered },
        nextState
      };
    }

    case 'mv': {
      eventsTriggered.push('mv');
      if (args.length < 2) {
        return {
          result: { output: 'mv: missing destination file operand', type: 'error', eventsTriggered },
          nextState
        };
      }
      const srcArg = args[0];
      const destArg = args[1];
      const parentNode = getNodeAtPath(nextState.root, nextState.currentPath);
      if (parentNode?.children && parentNode.children[srcArg]) {
        const item = parentNode.children[srcArg];
        delete parentNode.children[srcArg];
        item.name = destArg;
        parentNode.children[destArg] = item;
        return {
          result: { output: `📦 Moved/Renamed '${srcArg}' -> '${destArg}'`, type: 'success', eventsTriggered },
          nextState
        };
      }
      return {
        result: { output: `mv: cannot stat '${srcArg}': No such file or directory`, type: 'error', eventsTriggered },
        nextState
      };
    }

    case 'which': {
      eventsTriggered.push('which');
      const target = args[0] || 'bash';
      return {
        result: { output: `/usr/bin/${target}`, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'chown': {
      eventsTriggered.push('chown');
      if (args.length < 2) {
        return {
          result: { output: 'chown: missing operand after chown', type: 'error', eventsTriggered },
          nextState
        };
      }
      const newOwner = args[0];
      const targetFile = args[1];
      const target = resolvePath(nextState.currentPath, targetFile);
      const node = getNodeAtPath(nextState.root, target);
      if (!node) {
        return {
          result: { output: `chown: cannot access '${targetFile}': No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }
      node.owner = newOwner;
      return {
        result: { output: `👤 Ownership of '${targetFile}' changed to ${newOwner}`, type: 'success', eventsTriggered },
        nextState
      };
    }

    case 'awk': {
      eventsTriggered.push('awk');
      const fieldIdxMatch = args.join(' ').match(/\$([0-9]+)/);
      const fieldIdx = fieldIdxMatch ? parseInt(fieldIdxMatch[1], 10) - 1 : 0;
      const targetFile = args[args.length - 1];
      let content = '';
      if (targetFile && !targetFile.includes('{') && !targetFile.startsWith('-')) {
        const target = resolvePath(nextState.currentPath, targetFile);
        const node = getNodeAtPath(nextState.root, target);
        if (node && node.type === 'file') content = node.content || '';
      }
      if (!content) content = 'Emperor Penguin Aptenodytes\nAfrican Elephant Loxodonta\nBlue Whale Balaenoptera\nTux Linux Mascot';
      const lines = content.split('\n').filter(Boolean);
      const output = lines.map(line => {
        const tokens = line.trim().split(/\s+/);
        return tokens[fieldIdx] !== undefined ? tokens[fieldIdx] : line;
      }).join('\n');
      return {
        result: { output, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'sed': {
      eventsTriggered.push('sed');
      const targetFile = args[args.length - 1];
      let content = '';
      if (targetFile && !targetFile.startsWith('s/') && !targetFile.startsWith('-')) {
        const target = resolvePath(nextState.currentPath, targetFile);
        const node = getNodeAtPath(nextState.root, target);
        if (node && node.type === 'file') content = node.content || '';
      }
      if (!content) content = 'Linux is cool\nLinux is powerful\nLinux is fun';
      const sedExpr = args.find(a => a.startsWith('s/') || a.startsWith("'s/") || a.startsWith('"s/')) || '';
      const cleanExpr = sedExpr.replace(/^['"]|['"]$/g, '');
      const sParts = cleanExpr.split('/');
      let output = content;
      if (sParts.length >= 3) {
        const findStr = sParts[1];
        const replStr = sParts[2];
        output = content.replace(new RegExp(findStr, 'g'), replStr);
      }
      return {
        result: { output, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'cut': {
      eventsTriggered.push('cut');
      const dIdx = args.indexOf('-d');
      const delim = dIdx !== -1 ? args[dIdx + 1] : ' ';
      const fIdx = args.indexOf('-f');
      const field = fIdx !== -1 ? parseInt(args[fIdx + 1], 10) - 1 : 0;
      const targetFile = args[args.length - 1];
      let content = '';
      if (targetFile && !targetFile.startsWith('-')) {
        const target = resolvePath(nextState.currentPath, targetFile);
        const node = getNodeAtPath(nextState.root, target);
        if (node && node.type === 'file') content = node.content || '';
      }
      if (!content) content = 'Tux Linux Mascot\nJumbo Elephant Hero';
      const lines = content.split('\n').filter(Boolean);
      const output = lines.map(line => {
        const cols = line.split(delim);
        return cols[field] !== undefined ? cols[field] : line;
      }).join('\n');
      return {
        result: { output, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'sort': {
      eventsTriggered.push('sort');
      const reverse = args.includes('-r');
      const targetFile = args.find(a => !a.startsWith('-'));
      let content = '';
      if (targetFile) {
        const target = resolvePath(nextState.currentPath, targetFile);
        const node = getNodeAtPath(nextState.root, target);
        if (node && node.type === 'file') content = node.content || '';
      }
      if (!content) content = 'Zebra\nAntelope\nPenguin\nElephant\nFox';
      const lines = content.split('\n').filter(Boolean).sort();
      if (reverse) lines.reverse();
      return {
        result: { output: lines.join('\n'), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'uniq': {
      eventsTriggered.push('uniq');
      const count = args.includes('-c');
      const targetFile = args.find(a => !a.startsWith('-'));
      let content = '';
      if (targetFile) {
        const target = resolvePath(nextState.currentPath, targetFile);
        const node = getNodeAtPath(nextState.root, target);
        if (node && node.type === 'file') content = node.content || '';
      }
      if (!content) content = 'apple\napple\nbanana\ncherry\ncherry';
      const lines = content.split('\n').filter(Boolean);
      const resLines: string[] = [];
      let prev = '';
      let curCount = 0;
      for (const l of lines) {
        if (l === prev) {
          curCount++;
        } else {
          if (prev) resLines.push(count ? `${curCount} ${prev}` : prev);
          prev = l;
          curCount = 1;
        }
      }
      if (prev) resLines.push(count ? `${curCount} ${prev}` : prev);
      return {
        result: { output: resLines.join('\n'), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'tr': {
      eventsTriggered.push('tr');
      let output = 'HELLO LINUX CADET';
      const expr = args.join(' ');
      if (expr.includes('a-z') && expr.includes('A-Z')) {
        output = (args[2] || 'hello world').toUpperCase();
      }
      return {
        result: { output, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'wc': {
      eventsTriggered.push('wc');
      const targetFile = args.find(a => !a.startsWith('-'));
      let content = '';
      if (targetFile) {
        const target = resolvePath(nextState.currentPath, targetFile);
        const node = getNodeAtPath(nextState.root, target);
        if (node && node.type === 'file') content = node.content || '';
      }
      if (!content) content = '1 2 3 4 5\n6 7 8 9 10\n11 12 13 14 15';
      const lines = content.split('\n').length;
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const chars = content.length;
      let output = `${lines} ${words} ${chars} ${targetFile || ''}`;
      if (args.includes('-l')) output = `${lines} ${targetFile || ''}`;
      if (args.includes('-w')) output = `${words} ${targetFile || ''}`;
      if (args.includes('-c')) output = `${chars} ${targetFile || ''}`;
      return {
        result: { output: output.trim(), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'find': {
      eventsTriggered.push('find');
      const nameIdx = args.indexOf('-name');
      const pattern = nameIdx !== -1 ? args[nameIdx + 1]?.replace(/['"]/g, '') : null;
      const matches: string[] = [];
      function searchNode(node: VFSNode, currPath: string) {
        if (node.type === 'file') {
          if (!pattern || pattern === '*' || (pattern.endsWith('.txt') && node.name.endsWith('.txt')) || (pattern.endsWith('.sh') && node.name.endsWith('.sh')) || node.name.includes(pattern.replace(/\*/g, ''))) {
            matches.push(currPath);
          }
        } else if (node.children) {
          Object.keys(node.children).forEach(k => {
            searchNode(node.children![k], currPath === '/' ? `/${k}` : `${currPath}/${k}`);
          });
        }
      }
      searchNode(nextState.root, '/');
      return {
        result: { output: matches.slice(0, 15).join('\n'), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'xargs': {
      eventsTriggered.push('xargs');
      const subCmd = args.join(' ') || 'echo';
      return {
        result: { output: `[xargs]: executed '${subCmd}' with input parameters`, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'top': {
      eventsTriggered.push('top');
      const topOutput = `top - ${new Date().toLocaleTimeString()} up 14 days,  2 users,  load average: 0.08, 0.05, 0.02
Tasks:  12 total,   1 running,  11 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.1 us,  0.9 sy,  0.0 ni, 97.0 id,  0.0 wa,  0.0 hi,  0.0 si
MiB Mem :   7840.2 total,   4210.5 free,   1920.8 used,   1708.9 buff/cache

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0  168392  12480   8420 S   0.0   0.2   0:02.14 systemd
  102 jumbo     20   0   42100   6120   4200 S   0.5   0.1   0:01.05 bash
  404 space_g+  20   0   84200  16200   8100 S   4.2   0.2   0:08.42 space_glitch
  777 jumbo     20   0   68400  14200   9800 R   1.2   0.2   0:00.32 top`;
      return {
        result: { output: topOutput, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'tar': {
      eventsTriggered.push('tar');
      if (args.includes('-czvf') || args.includes('-cvf')) {
        const archiveName = args.find(a => a.endsWith('.tar.gz') || a.endsWith('.tar')) || 'archive.tar.gz';
        return {
          result: { output: `📦 Created tar archive '${archiveName}' [Compressed with gzip]`, type: 'success', eventsTriggered },
          nextState
        };
      }
      return {
        result: { output: `📦 tar: archive extracted/inspected successfully.`, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'gzip': {
      eventsTriggered.push('gzip');
      const target = args[0] || 'file.txt';
      return {
        result: { output: `🗜️ Compressed '${target}' -> '${target}.gz'`, type: 'success', eventsTriggered },
        nextState
      };
    }

    case 'curl': {
      eventsTriggered.push('curl');
      const url = args.find(a => !a.startsWith('-')) || 'https://jumbolinux.kids';
      if (url.includes('wttr.in') || url.includes('weather')) {
        return {
          result: { output: `Weather report: Linux Cloud Station ⛅ 21°C / 70°F | Wind: 5mph Calm | Status: Clear skies for hacking!`, type: 'output', eventsTriggered },
          nextState
        };
      }
      return {
        result: { output: `HTTP/2 200 OK\nContent-Type: application/json\n\n{"status": "online", "message": "Welcome to Jumbo-Linux-Kids Server!", "mascot": "🐧 Tux & 🐘 Jumbo"}`, type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'wget': {
      eventsTriggered.push('wget');
      const url = args[0] || 'https://jumbolinux.kids/wallpaper.png';
      return {
        result: {
          output: `--2026-09-22 12:00:00--  ${url}\nResolving jumbolinux.kids... 192.0.2.1\nConnecting... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 10240 (10K) [image/png]\nSaving to: 'wallpaper.png'\n\nwallpaper.png       100%[===================>]  10.00K  --.-KB/s    in 0.02s\n\n2026-09-22 12:00:00 (500 KB/s) - 'wallpaper.png' saved [10240/10240]`,
          type: 'output',
          eventsTriggered
        },
        nextState
      };
    }

    case 'ssh': {
      eventsTriggered.push('ssh');
      const host = args[0] || 'cadet@lab.jumbolinux.kids';
      return {
        result: {
          output: `🔒 Connecting to ${host} via OpenSSH (port 22)...\nECDSA key fingerprint is SHA256:4tUx...Jumb0.\nAuthenticated to ${host}!\nWelcome to Jumbo Linux Remote Lab!\n(Type 'exit' to return to local terminal)`,
          type: 'success',
          eventsTriggered
        },
        nextState
      };
    }

    case 'python':
    case 'python3': {
      eventsTriggered.push('python');
      const cIdx = args.indexOf('-c');
      if (cIdx !== -1 && args[cIdx + 1]) {
        const code = args.slice(cIdx + 1).join(' ').replace(/^["']|["']$/g, '');
        let pyOut = 'Hello from Python 3.12!';
        if (code.includes('print')) {
          const m = code.match(/print\((.*)\)/);
          pyOut = m ? m[1].replace(/["']/g, '') : 'Python Output: OK';
        }
        return {
          result: { output: pyOut, type: 'output', eventsTriggered },
          nextState
        };
      }
      return {
        result: {
          output: `Python 3.12.3 (main, Apr 2026, Linux)\n[GCC 13.2.0] on linux\nType "help", "copyright", "credits" or "license" for more information.\n>>> print("Welcome to Python inside Jumbo Linux Kids!")\nWelcome to Python inside Jumbo Linux Kids!`,
          type: 'output',
          eventsTriggered
        },
        nextState
      };
    }

    case 'gcc': {
      eventsTriggered.push('gcc');
      return {
        result: {
          output: `⚙️ GCC 13.2.0 (GNU C Compiler):\n[OK] Source compiled successfully into executable binary './a.out'!\nRun './a.out' to execute your C program!`,
          type: 'success',
          eventsTriggered
        },
        nextState
      };
    }

    case 'tree': {
      eventsTriggered.push('tree');
      const targetPath = args[0] ? resolvePath(nextState.currentPath, args[0]) : nextState.currentPath;
      const node = getNodeAtPath(nextState.root, targetPath);
      if (!node) {
        return {
          result: { output: `tree: '${args[0]}': No such file or directory`, type: 'error', eventsTriggered },
          nextState
        };
      }
      const lines = [targetPath === nextState.currentPath ? '.' : targetPath, ...buildTreeLines(node)];
      return {
        result: { output: lines.join('\n'), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'cowsay': {
      eventsTriggered.push('cowsay');
      const msg = args.join(' ') || 'Linux is awesome!';
      return {
        result: { output: renderCowsay(msg), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'fortune': {
      eventsTriggered.push('fortune');
      return {
        result: { output: getFortune(), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'figlet': {
      eventsTriggered.push('figlet');
      const text = (args.join(' ') || 'LINUX').toUpperCase();
      return {
        result: {
          output: ` _     ___ _   _ _   ___  __\n| |   |_ _| \\ | | | | \\ \\/ /\n| |    | ||  \\| | | |  \\  / \n| |___ | || |\\  | |_|  /  \\ \n|_____|___|_| \\_|\\___//_/\\_\\ [${text}]`,
          type: 'output',
          eventsTriggered
        },
        nextState
      };
    }

    case 'feh':
    case 'chafa': {
      eventsTriggered.push('feh');
      const imgName = args[0] || 'tux.png';
      return {
        result: { output: renderAsciiImage(imgName), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'mpv':
    case 'mplayer':
    case 'mpg123': {
      eventsTriggered.push('mpv');
      const songName = args[0] || 'song.mp3';
      return {
        result: { output: renderAsciiPlayer(songName), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'game': {
      eventsTriggered.push('game');
      const gameName = args[0] || '';
      const subArg = args[1] || '';
      return {
        result: { output: renderGame(gameName, subArg), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'drop-catch':
    case './drop-catch':
    case './drop-catch.sh':
    case './games/drop-catch.sh': {
      eventsTriggered.push('game_drop_catch');
      return {
        result: { output: renderGame('drop-catch', args[0]), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'single-shot':
    case './single-shot':
    case './single-shot.sh':
    case './games/single-shot.sh': {
      eventsTriggered.push('game_single_shot');
      return {
        result: { output: renderGame('single-shot', args[0]), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'missile-defense':
    case './missile-defense':
    case './missile-defense.sh':
    case './games/missile-defense.sh': {
      eventsTriggered.push('game_missile_defense');
      return {
        result: { output: renderGame('missile-defense', args[0]), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'letter-bomb':
    case './letter-bomb':
    case './letter-bomb.sh':
    case './games/letter-bomb.sh': {
      eventsTriggered.push('game_letter_bomb');
      return {
        result: { output: renderGame('letter-bomb', args.join(' ')), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'left-right-bomb':
    case 'bomb-dodge':
    case './left-right-bomb':
    case './left-right-bomb.sh':
    case './games/left-right-bomb.sh': {
      eventsTriggered.push('game_left_right_bomb');
      return {
        result: { output: renderGame('left-right-bomb', args[0]), type: 'output', eventsTriggered },
        nextState
      };
    }

    case 'sl': {
      return {
        result: {
          output: `🚂 CHOO-CHOO! You typed 'sl' instead of 'ls'! Here is a steam locomotive! 🐧`,
          type: 'system',
          eventsTriggered
        },
        nextState
      };
    }

    default: {
      return {
        result: {
          output: `bash: ${cmd}: command not found. (Type "help" for friendly command suggestions!)`,
          type: 'error',
          eventsTriggered
        },
        nextState
      };
    }
  }
}

function buildTreeLines(node: VFSNode, prefix = ''): string[] {
  if (node.type === 'file' || !node.children) return [];
  const entries = Object.keys(node.children).filter(n => !n.startsWith('.'));
  const lines: string[] = [];
  entries.forEach((name, idx) => {
    const isLast = idx === entries.length - 1;
    const child = node.children![name];
    const branch = isLast ? '└── ' : '├── ';
    const isDir = child.type === 'directory';
    lines.push(`${prefix}${branch}${name}${isDir ? '/' : ''}`);
    if (isDir) {
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      lines.push(...buildTreeLines(child, childPrefix));
    }
  });
  return lines;
}

function renderCowsay(msg: string): string {
  const text = msg.trim() || 'Moo! Linux is awesome!';
  const border = '-'.repeat(text.length + 2);
  return ` ${border}
< ${text} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
}

const FORTUNES = [
  "🐧 'Talk is cheap. Show me the code.' — Linus Torvalds",
  "🐘 'In open source we trust: share, learn, build together!' — Jumbo",
  "🚀 'Linux powers 100% of the world's top 500 supercomputers and NASA rovers on Mars!'",
  "💡 'There is no place like /home.'",
  "🛡️ 'With great sudo power comes great responsibility!'",
  "🌟 'Everything in Unix is a file — even your screen and keyboard!'",
  "🎮 'Hackers do not break things; hackers understand how things work and make them better!'"
];

function getFortune(): string {
  return FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
}

function renderAsciiImage(name: string): string {
  if (name.includes('elephant') || name.includes('jumbo')) {
    return `   __      __
  /  \\.-.  /  \\
  \\__/\\_  \\__/
   /o    o\\
  (   "    )    [feh / chafa: Displaying ${name} - Jumbo Explorer]
   \\__--__/
   /      \\
  / |    | \\`;
  }
  return `     .--.
    |o_o |
    |:_/ |     [feh / chafa: Displaying ${name} (320x320 PNG)]
   //   \\ \\    [Viewer: X11 / Wayland Framebuffer Terminal]
  (|     | )   Status: 24-bit TrueColor Rendered
 /'\\_   _/\\'\\
 \\___)=(___/`;
}

function renderAsciiPlayer(name: string): string {
  return `🎵 [mpv player] Now Playing: ${name || 'Tux_Anthem.mp3'}
Codec: MP3 Audio (Stereo 44.1kHz 320kbps)
Volume: [████████████████░░░░] 80%  | Time: 01:14 / 03:42
Visualizer:
 ▂ ▃ ▄ ▅ ▆ ▇ █ ▇ ▆ ▅ ▄ ▃ ▂   ▂ ▃ ▄ ▅ ▆ ▇ █ ▇ ▆ ▅ ▄ ▃ ▂
(Simulating audio playback in terminal sandbox - Web Audio Active!)`;
}

function renderGame(name: string, action?: string): string {
  const norm = name.toLowerCase().replace(/\.sh$/, '').replace(/^game\s*/, '').replace(/^\.\/(games\/)?/, '');
  switch (norm) {
    case 'drop-catch': {
      const pos = action === 'left' ? 2 : action === 'right' ? 8 : 5;
      const leftPad = ' '.repeat(pos);
      return `=====================================================
🧺 DROP CATCH ARCADE - TERMINAL MINI-GAME 🧺
=====================================================
Level: 1  |  Score: 120  |  Lives: ❤❤❤

        ⭐ (Falling Star!)
        |
        v

${leftPad}\\_____/   <-- [Your Shell Basket]
-----------------------------------------------------
[ROUND RESULT] ${action ? `Basket moved ${action.toUpperCase()}!` : 'Star caught cleanly! +30 PTS'}
Controls: Type 'drop-catch left' or 'drop-catch right'!
=====================================================`;
    }
    case 'single-shot': {
      return `=====================================================
🎯 SINGLE SHOT SNIPER - TARGET ARCADE 🎯
=====================================================
Target:   [ 👾 ROGUE GLITCH (PID: 404) ]
Angle:    [ 45° ]  |  Ammo: [ | | ]

              ^
              |   <-- TUX LASER BEAM FIRED!
              |
          [🚀 CANNON]

[DIRECT HIT] Target glitch destroyed! +50 XP!
Type 'single-shot fire' or 'single-shot aim' to shoot!
=====================================================`;
    }
    case 'missile-defense': {
      return `=====================================================
🛡️ MISSILE DEFENSE BASE - COMMAND TERMINAL 🛡️
=====================================================
Threat: ☄️ ASTEROID CLUSTER DETECTED AT SECTOR 7!
Shields: [██████████] 100%

      ☄️              ☄️              ☄️
       \\              |              /
        \\             |             /
         💥 COUNTER-MEASURE LAUNCHED!
                   [ / \\ ]
              [🏰 JUMBO LINUX BASE]

[THREAT DEFUSED] Asteroid neutralized by Linux Firewall!
=====================================================`;
    }
    case 'letter-bomb': {
      const isDefused = action?.toLowerCase().includes('cut') || action?.toLowerCase().includes('tux');
      return `=====================================================
💣 LETTER BOMB DEFUSAL UNIT - RAPID TYPING ⏱️
=====================================================
Bomb Clock: [ 00:08s REMAINING ]
Defusal Wire: "TUX-HERO"

       [💣 TICK... TICK... TICK...]

${isDefused 
  ? '✂️ SNIP! You cut the wire with code! Bomb DEFUSED! +60 XP' 
  : 'Run: "letter-bomb cut TUX-HERO" before the timer expires!'}
=====================================================`;
    }
    case 'left-right-bomb':
    case 'bomb-dodge': {
      const side = action === 'left' ? 'LEFT' : action === 'right' ? 'RIGHT' : 'CENTER';
      return `=====================================================
💥 LEFT / RIGHT BOMB DODGE RUNNER 🏃
=====================================================
Wave: 4  |  Bombs Dodged: 12  |  Agility: 100%

     [💣 BOMB LEFT]           [💣 BOMB RIGHT]
            \\                       /
             \\                     /
              [ 🐧 TUX DASHED ${side}! ]

[SAFE!] The bomb exploded safely in the ditch!
Controls: Type 'left-right-bomb left' or 'left-right-bomb right'!
=====================================================`;
    }
    default: {
      return `🎮 JUMBO LINUX TERMINAL ARCADE:
-----------------------------------------------------
1. drop-catch       - Catch falling stars with your basket!
2. single-shot      - Target range arcade shooter!
3. missile-defense  - Defend the Linux base against asteroids!
4. letter-bomb      - Rapid typing bomb defusal!
5. left-right-bomb  - Dodge falling bombs left and right!
-----------------------------------------------------
Type 'game <name>' (e.g. 'game drop-catch') or './games/<name>.sh' to play!`;
    }
  }
}

function handlePipedCommand(raw: string, originalState: VFSState, nextState: VFSState): { result: ExecResult; nextState: VFSState } {
  const parts = raw.split('|').map(p => p.trim()).filter(Boolean);
  const eventsTriggered: string[] = ['pipe_used'];

  let currentOutput = '';
  let currentState = originalState;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const cmdTokens = part.split(/\s+/);
    const cmd = cmdTokens[0];
    const cmdArgs = cmdTokens.slice(1);

    if (i === 0) {
      const res = executeCommand(part, currentState);
      currentOutput = res.result.output;
      eventsTriggered.push(...res.result.eventsTriggered);
      currentState = res.nextState;
      continue;
    }

    eventsTriggered.push(`pipe_${cmd}`);

    if (cmd === 'grep') {
      const isCaseInsensitive = cmdArgs.includes('-i');
      const pattern = cmdArgs.find(a => !a.startsWith('-')) || '';
      const lines = currentOutput.split('\n').filter(l => {
        if (isCaseInsensitive) return l.toLowerCase().includes(pattern.toLowerCase());
        return l.includes(pattern);
      });
      currentOutput = lines.length > 0 ? lines.join('\n') : '(No matches in pipeline)';
    } else if (cmd === 'wc') {
      const lines = currentOutput ? currentOutput.split('\n').length : 0;
      const words = currentOutput.trim().split(/\s+/).filter(Boolean).length;
      if (cmdArgs.includes('-l')) currentOutput = `${lines}`;
      else if (cmdArgs.includes('-w')) currentOutput = `${words}`;
      else currentOutput = `${lines} ${words} ${currentOutput.length}`;
    } else if (cmd === 'sort') {
      const reverse = cmdArgs.includes('-r');
      const lines = currentOutput.split('\n').filter(Boolean).sort();
      if (reverse) lines.reverse();
      currentOutput = lines.join('\n');
    } else if (cmd === 'uniq') {
      const count = cmdArgs.includes('-c');
      const lines = currentOutput.split('\n').filter(Boolean);
      const resLines: string[] = [];
      let prev = '';
      let curCount = 0;
      for (const l of lines) {
        if (l === prev) {
          curCount++;
        } else {
          if (prev) resLines.push(count ? `${curCount} ${prev}` : prev);
          prev = l;
          curCount = 1;
        }
      }
      if (prev) resLines.push(count ? `${curCount} ${prev}` : prev);
      currentOutput = resLines.join('\n');
    } else if (cmd === 'awk') {
      const fieldIdxMatch = cmdArgs.join(' ').match(/\$([0-9]+)/);
      const fieldIdx = fieldIdxMatch ? parseInt(fieldIdxMatch[1], 10) - 1 : 0;
      const lines = currentOutput.split('\n').filter(Boolean);
      currentOutput = lines.map(line => {
        const toks = line.trim().split(/\s+/);
        return toks[fieldIdx] !== undefined ? toks[fieldIdx] : line;
      }).join('\n');
    } else if (cmd === 'sed') {
      const sedExpr = cmdArgs.find(a => a.startsWith('s/') || a.startsWith("'s/") || a.startsWith('"s/')) || '';
      const cleanExpr = sedExpr.replace(/^['"]|['"]$/g, '');
      const sParts = cleanExpr.split('/');
      if (sParts.length >= 3) {
        const findStr = sParts[1];
        const replStr = sParts[2];
        currentOutput = currentOutput.replace(new RegExp(findStr, 'g'), replStr);
      }
    } else if (cmd === 'tr') {
      if (cmdArgs.join(' ').includes('a-z') && cmdArgs.join(' ').includes('A-Z')) {
        currentOutput = currentOutput.toUpperCase();
      } else if (cmdArgs.join(' ').includes('A-Z') && cmdArgs.join(' ').includes('a-z')) {
        currentOutput = currentOutput.toLowerCase();
      }
    } else if (cmd === 'head') {
      const n = cmdArgs.includes('-n') ? parseInt(cmdArgs[cmdArgs.indexOf('-n') + 1], 10) || 5 : 5;
      currentOutput = currentOutput.split('\n').slice(0, n).join('\n');
    } else if (cmd === 'tail') {
      const n = cmdArgs.includes('-n') ? parseInt(cmdArgs[cmdArgs.indexOf('-n') + 1], 10) || 5 : 5;
      const allLines = currentOutput.split('\n');
      currentOutput = allLines.slice(Math.max(0, allLines.length - n)).join('\n');
    } else if (cmd === 'cowsay') {
      currentOutput = renderCowsay(currentOutput);
    } else if (cmd === 'xargs') {
      const sub = cmdArgs.join(' ') || 'echo';
      currentOutput = `[xargs ${sub}]: ${currentOutput}`;
    }
  }

  return {
    result: {
      output: currentOutput,
      type: 'output',
      eventsTriggered
    },
    nextState: currentState
  };
}

function handleRedirection(raw: string, originalState: VFSState, nextState: VFSState): { result: ExecResult; nextState: VFSState } {
  const isAppend = raw.includes('>>');
  const separator = isAppend ? '>>' : '>';
  const [left, right] = raw.split(separator).map(s => s.trim());
  const leftRes = executeCommand(left, originalState);
  const fileName = right;

  const target = resolvePath(nextState.currentPath, fileName);
  const lastSlash = target.lastIndexOf('/');
  const dirPath = target.slice(0, lastSlash) || '/';
  const baseName = target.slice(lastSlash + 1);
  const parentNode = getNodeAtPath(nextState.root, dirPath);

  if (parentNode?.children) {
    const existing = (isAppend && parentNode.children[baseName]?.content)
      ? (parentNode.children[baseName].content + '\n')
      : '';
    const newContent = existing + leftRes.result.output;
    parentNode.children[baseName] = {
      name: baseName,
      type: 'file',
      permissions: 'rw-r--r--',
      owner: 'jumbo',
      size: newContent.length,
      content: newContent
    };
    const eventsTriggered = [
      'redirection',
      isAppend ? 'redirect_append' : 'redirect_write',
      ...leftRes.result.eventsTriggered
    ];
    if (fileName.includes('star.txt') || baseName === 'star.txt') {
      eventsTriggered.push('redirect_star');
    }
    return {
      result: {
        output: isAppend ? `📥 Appended output to '${baseName}'` : `✍️ Written output to '${baseName}'`,
        type: 'success',
        eventsTriggered
      },
      nextState
    };
  }

  return {
    result: { output: `Failed to redirect to ${fileName}`, type: 'error', eventsTriggered: [] },
    nextState
  };
}

export function resolvePath(current: string, target: string): string {
  if (target.startsWith('/')) {
    return normalizePath(target);
  }
  if (target === '~') {
    return '/home/jumbo';
  }
  if (target.startsWith('~/')) {
    return normalizePath('/home/jumbo/' + target.slice(2));
  }
  return normalizePath(`${current}/${target}`);
}

export function normalizePath(p: string): string {
  const parts = p.split('/').filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }
  return '/' + stack.join('/');
}

export function getNodeAtPath(root: VFSNode, path: string): VFSNode | null {
  if (path === '/' || path === '') return root;
  const segments = path.split('/').filter(Boolean);
  let current: VFSNode = root;

  for (const seg of segments) {
    if (current.type !== 'directory' || !current.children || !current.children[seg]) {
      return null;
    }
    current = current.children[seg];
  }
  return current;
}

export const COMMON_COMMANDS = [
  'awk', 'bash', 'cat', 'cd', 'chafa', 'chmod', 'chown', 'clear', 'cowsay', 'cp', 
  'curl', 'cut', 'date', 'drop-catch', 'echo', 'feh', 'figlet', 'find', 
  'fortune', 'game', 'gcc', 'grep', 'gzip', 'head', 'help', 'history', 
  'kill', 'left-right-bomb', 'letter-bomb', 'ls', 'missile-defense', 'mkdir', 
  'mplayer', 'mpv', 'mv', 'nano', 'ps', 'python', 'python3', 'pwd', 'rm', 'sed', 
  'single-shot', 'sl', 'sort', 'ssh', 'tail', 'tar', 'top', 'touch', 
  'tr', 'tree', 'uname', 'uniq', 'wc', 'wget', 'which', 'whoami', 'xargs'
];

export interface TabCompletionResult {
  completedText: string;
  suggestions: string[];
  type: 'command' | 'file' | 'flag' | 'none';
  matchCount: number;
}

function findLongestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (strings[i].toLowerCase().indexOf(prefix.toLowerCase()) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}

export function computeTabCompletion(input: string, state: VFSState): TabCompletionResult {
  const trimmed = input.trim();

  // Case 1: Empty input - return common commands
  if (!trimmed) {
    return {
      completedText: input,
      suggestions: [...COMMON_COMMANDS],
      type: 'command',
      matchCount: COMMON_COMMANDS.length
    };
  }

  // Check if completing the first word (command) vs argument
  const hasSpace = input.includes(' ');

  if (!hasSpace) {
    // Check if user is typing a local script like ./play.sh or ./backup.sh
    if (input.startsWith('./') || input.startsWith('../') || input.startsWith('/')) {
      const lastSlash = input.lastIndexOf('/');
      const dirPart = input.slice(0, lastSlash + 1);
      const filePart = input.slice(lastSlash + 1);
      const targetPath = resolvePath(state.currentPath, dirPart);
      const dirNode = getNodeAtPath(state.root, targetPath);

      if (dirNode && dirNode.type === 'directory' && dirNode.children) {
        const entries = Object.keys(dirNode.children);
        const matches = entries.filter(e => {
          if (filePart.startsWith('.')) return e.startsWith(filePart);
          return !e.startsWith('.') && e.toLowerCase().startsWith(filePart.toLowerCase());
        }).map(e => {
          const child = dirNode.children![e];
          return child.type === 'directory' ? `${e}/` : e;
        });

        if (matches.length === 1) {
          const isDir = matches[0].endsWith('/');
          return {
            completedText: dirPart + matches[0] + (isDir ? '' : ' '),
            suggestions: matches,
            type: 'file',
            matchCount: 1
          };
        } else if (matches.length > 1) {
          const lcp = findLongestCommonPrefix(matches);
          return {
            completedText: dirPart + lcp,
            suggestions: matches,
            type: 'file',
            matchCount: matches.length
          };
        }
      }
    }

    // Matching a command from COMMON_COMMANDS
    const matches = COMMON_COMMANDS.filter(cmd => cmd.toLowerCase().startsWith(input.toLowerCase()));

    if (matches.length === 1) {
      return {
        completedText: matches[0] + ' ',
        suggestions: matches,
        type: 'command',
        matchCount: 1
      };
    } else if (matches.length > 1) {
      const lcp = findLongestCommonPrefix(matches);
      return {
        completedText: lcp.length > input.length ? lcp : input,
        suggestions: matches,
        type: 'command',
        matchCount: matches.length
      };
    }

    return {
      completedText: input,
      suggestions: [],
      type: 'none',
      matchCount: 0
    };
  }

  // Case 2: Argument completion (files, directories, or flags)
  const lastSpaceIdx = input.lastIndexOf(' ');
  const lead = input.slice(0, lastSpaceIdx + 1);
  const token = input.slice(lastSpaceIdx + 1);
  const commandWord = input.trim().split(/\s+/)[0].toLowerCase();

  // Flag completion for ls, head, tail, ps, uname
  if (token.startsWith('-')) {
    const commonFlags: Record<string, string[]> = {
      ls: ['-a', '-l', '-la', '-al', '-lh'],
      ps: ['aux', '-ef'],
      head: ['-n'],
      tail: ['-n'],
      uname: ['-a', '-r'],
      rm: ['-r', '-rf'],
      grep: ['-i', '-n', '-v', '-c'],
      chmod: ['+x', '755', '644']
    };
    const flagsForCmd = commonFlags[commandWord] || ['-h', '--help'];
    const flagMatches = flagsForCmd.filter(f => f.startsWith(token));
    if (flagMatches.length === 1) {
      return {
        completedText: lead + flagMatches[0] + ' ',
        suggestions: flagMatches,
        type: 'flag',
        matchCount: 1
      };
    } else if (flagMatches.length > 1) {
      return {
        completedText: lead + findLongestCommonPrefix(flagMatches),
        suggestions: flagMatches,
        type: 'flag',
        matchCount: flagMatches.length
      };
    }
  }

  // File or directory completion
  const lastSlash = token.lastIndexOf('/');
  let dirPart = '';
  let filePart = token;
  let targetPath = state.currentPath;

  if (lastSlash !== -1) {
    dirPart = token.slice(0, lastSlash + 1);
    filePart = token.slice(lastSlash + 1);
    targetPath = resolvePath(state.currentPath, dirPart);
  }

  const dirNode = getNodeAtPath(state.root, targetPath);
  if (!dirNode || dirNode.type !== 'directory' || !dirNode.children) {
    return {
      completedText: input,
      suggestions: [],
      type: 'none',
      matchCount: 0
    };
  }

  const allEntries = Object.keys(dirNode.children);
  const matches = allEntries.filter(entry => {
    if (filePart.startsWith('.')) {
      return entry.startsWith(filePart);
    }
    // By default hide hidden files unless explicitly typed or query is dot
    return !entry.startsWith('.') && entry.toLowerCase().startsWith(filePart.toLowerCase());
  }).map(entry => {
    const child = dirNode.children![entry];
    return child.type === 'directory' ? `${entry}/` : entry;
  });

  if (matches.length === 1) {
    const isDir = matches[0].endsWith('/');
    const completedToken = dirPart + matches[0];
    return {
      completedText: lead + completedToken + (isDir ? '' : ' '),
      suggestions: matches,
      type: 'file',
      matchCount: 1
    };
  } else if (matches.length > 1) {
    const lcp = findLongestCommonPrefix(matches);
    const completedToken = dirPart + lcp;
    return {
      completedText: lead + completedToken,
      suggestions: matches,
      type: 'file',
      matchCount: matches.length
    };
  }

  return {
    completedText: input,
    suggestions: [],
    type: 'none',
    matchCount: 0
  };
}
