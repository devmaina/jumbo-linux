import { LinuxFact, LinuxQuizQuestion } from '../types';

export const LINUX_FACTS: LinuxFact[] = [
  {
    id: 'fact-1',
    fact: 'NASA\'s Mars Perseverance Rover and Ingenuity Helicopter both run on Linux to explore the red planet!',
    source: 'Space Explorers',
    funIcon: '🚀',
    kidTakeaway: 'You are learning the exact same computer brain that flies on Mars!'
  },
  {
    id: 'fact-2',
    fact: 'Linux was created in 1991 by Linus Torvalds when he was 21 years old because he wanted a free system for his own computer.',
    source: 'Linux for Dummies',
    funIcon: '🐧',
    kidTakeaway: 'One student\'s hobby project changed the whole world!'
  },
  {
    id: 'fact-3',
    fact: 'Tux the Penguin became the mascot because Linus Torvalds got gently pecked by a cute little penguin at a zoo in Australia!',
    source: 'Penguin Lore',
    funIcon: '❤️',
    kidTakeaway: 'Tux loves eating fish, sitting in snow, and helping friendly coders!'
  },
  {
    id: 'fact-4',
    fact: 'Almost all Hollywood animated movies (including Pixar, Disney, and Marvel movies) are rendered on giant Linux computers!',
    source: 'Movie Magic',
    funIcon: '🎬',
    kidTakeaway: 'Without Linux, movies like Toy Story and Spider-Man would take forever to draw!'
  },
  {
    id: 'fact-5',
    fact: 'All top 500 of the fastest supercomputers on Earth run on Linux!',
    source: 'Supercomputer Club',
    funIcon: '⚡',
    kidTakeaway: 'Linux is fast, stable, and never gets tired!'
  },
  {
    id: 'fact-6',
    fact: 'Your school Chromebook is secretly running Linux underneath its colorful browser!',
    source: 'Chromebook Secrets',
    funIcon: '💻',
    kidTakeaway: 'Turn on Linux in Chromebook Settings and you have a full coding lab!'
  },
  {
    id: 'fact-7',
    fact: 'More than 3 billion smartphones run on Linux every day inside their computer brain.',
    source: 'Friendly Tech',
    funIcon: '📱',
    kidTakeaway: 'When you play a phone game or watch a video, Linux is helping in the background!'
  },
  {
    id: 'fact-8',
    fact: 'Japan\'s bullet trains (Shinkansen) that travel at 200 mph use Linux to stay perfectly on schedule without ever crashing.',
    source: 'High-Speed Tech',
    funIcon: '🚄',
    kidTakeaway: 'Linux is trusted when safety matters most!'
  },
  {
    id: 'fact-9',
    fact: 'Linux is 100% Open Source — that means anyone can peek inside the code and see how it works, totally free!',
    source: 'Open Source Spirit',
    funIcon: '🔓',
    kidTakeaway: 'Nobody owns Linux alone; it belongs to the whole human family!'
  },
  {
    id: 'fact-10',
    fact: 'The Steam Deck handheld video game console runs on SteamOS, which is powered by Linux!',
    source: 'Gaming World',
    funIcon: '🎮',
    kidTakeaway: 'You can play thousands of top video games right on Linux!'
  },
  {
    id: 'fact-11',
    fact: 'The International Space Station (ISS) switched all their astronaut laptops from Windows to Linux for safety!',
    source: 'Astronaut Log',
    funIcon: '🛰️',
    kidTakeaway: 'Astronauts float in zero gravity typing commands in Linux!'
  },
  {
    id: 'fact-12',
    fact: 'In Linux, the "root" user is like the master wizard of the whole computer. They can change any setting!',
    source: 'Linux for Dummies',
    funIcon: '🧙',
    kidTakeaway: 'With great power comes great responsibility — use sudo wisely!'
  }
];

export const LINUX_QUIZ_QUESTIONS: LinuxQuizQuestion[] = [
  {
    id: 'q-1',
    question: 'What animal is the official, lovable mascot of Linux?',
    options: ['A) A fierce tiger 🐯', 'B) Tux the gentle Penguin 🐧', 'C) A purple unicorn 🦄', 'D) A grumpy robot 🤖'],
    correctIndex: 1,
    explanation: 'Linus Torvalds picked Tux the Penguin because penguins are friendly, happy, and love cold climates!'
  },
  {
    id: 'q-2',
    question: 'How much does it cost to download and install genuine Linux?',
    options: ['A) $100 per year', 'B) $20 per month', 'C) $0.00 — It is 100% free! 🎉', 'D) One chocolate bar 🍫'],
    correctIndex: 2,
    explanation: 'Linux is open source and free forever! Anyone in the world can learn it without paying a dime.'
  },
  {
    id: 'q-3',
    question: 'Which super cool space robot on Mars runs on Linux?',
    options: ['A) The Mars Perseverance Rover 🚀', 'B) The Apollo Moon Buggy', 'C) A toy drone', 'D) None of them'],
    correctIndex: 0,
    explanation: 'NASA chose Linux to guide their rover and the Ingenuity helicopter across Martian dunes!'
  },
  {
    id: 'q-4',
    question: 'What is the master starting point of all folders in Linux called?',
    options: ['A) C:\\ Drive', 'B) The Root "/" folder 🌳', 'C) The Attic', 'D) Folder 99'],
    correctIndex: 1,
    explanation: 'In Linux, everything branches off the Root directory, shown as a single friendly slash "/"!'
  },
  {
    id: 'q-5',
    question: 'What magic spell command tells you your current username in Linux?',
    options: ['A) whoami', 'B) hello', 'C) saymyname', 'D) whoisthere'],
    correctIndex: 0,
    explanation: '"whoami" stands for "Who am I?" — it politely tells you who is logged in!'
  },
  {
    id: 'q-6',
    question: 'What key on your keyboard finishes long file names for you like a magic wand?',
    options: ['A) The Tab key ⇥', 'B) The Caps Lock key', 'C) The Escape key', 'D) The number 7 key'],
    correctIndex: 0,
    explanation: 'Tab auto-completion is every hacker\'s best friend — tap Tab and Linux completes the word!'
  }
];
