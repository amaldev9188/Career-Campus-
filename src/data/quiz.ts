import { QuizQuestion } from '../types';

export const aptitudeQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: "When you hear about a new mobile app, what interests you the most?",
    choices: [
      {
        text: "The science behind its algorithms and code.",
        weights: { Arts: 0, Science: 3, Commerce: 1, Vocational: 1 }
      },
      {
        text: "Its visual design, color scheme, and user experience.",
        weights: { Arts: 3, Science: 1, Commerce: 0, Vocational: 1 }
      },
      {
        text: "How it makes money, its marketing strategy, and target users.",
        weights: { Arts: 0, Science: 0, Commerce: 3, Vocational: 1 }
      },
      {
        text: "The hardware specifications required and how to troubleshoot it.",
        weights: { Arts: 0, Science: 1, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 2,
    text: "If you were to organize a school exhibition, which role would you enjoy most?",
    choices: [
      {
        text: "Writing scripts, designing brochures, and presenting the history/cultural context.",
        weights: { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 }
      },
      {
        text: "Setting up scientific models, doing live experiments, and explaining physics/chemistry.",
        weights: { Arts: 0, Science: 3, Commerce: 0, Vocational: 1 }
      },
      {
        text: "Managing the budget, calculating ticket sales, and securing sponsors.",
        weights: { Arts: 0, Science: 0, Commerce: 3, Vocational: 1 }
      },
      {
        text: "Assembling the sound systems, wiring the lights, and setting up display structures.",
        weights: { Arts: 0, Science: 0, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 3,
    text: "Which of these subjects grabs your attention when reading a magazine or news site?",
    choices: [
      {
        text: "Literature, political analysis, art history, and global social movements.",
        weights: { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 }
      },
      {
        text: "Space exploration, biotech breakthroughs, mathematics, or medical research.",
        weights: { Arts: 0, Science: 3, Commerce: 0, Vocational: 0 }
      },
      {
        text: "Stock market trends, start-ups, cryptocurrency, and trade policies.",
        weights: { Arts: 0, Science: 0, Commerce: 3, Vocational: 1 }
      },
      {
        text: "DIY electronics, engine tuning, farming innovations, and culinary arts.",
        weights: { Arts: 0, Science: 1, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 4,
    text: "How do you prefer to solve a difficult problem?",
    choices: [
      {
        text: "By looking at it from an emotional and human perspective, brainstorming creatively.",
        weights: { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 }
      },
      {
        text: "By collecting data, analyzing patterns logically, and testing hypotheses step-by-step.",
        weights: { Arts: 0, Science: 3, Commerce: 1, Vocational: 0 }
      },
      {
        text: "By evaluating the cost-benefit ratio, efficiency, and resource optimization.",
        weights: { Arts: 0, Science: 1, Commerce: 3, Vocational: 0 }
      },
      {
        text: "By working with physical tools, trying out hands-on fixes, and testing components.",
        weights: { Arts: 0, Science: 0, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 5,
    text: "What kind of project or hobby would you most like to do in your free time?",
    choices: [
      {
        text: "Painting, writing short stories/poetry, photography, or acting in a play.",
        weights: { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 }
      },
      {
        text: "Building a small robot, coding a web app, or studying plant/animal behaviors.",
        weights: { Arts: 0, Science: 3, Commerce: 0, Vocational: 1 }
      },
      {
        text: "Running a mini-business (like selling craft items online) or analyzing personal savings.",
        weights: { Arts: 0, Science: 0, Commerce: 3, Vocational: 1 }
      },
      {
        text: "Repairing a broken device, baking, carpentry, or gardening with specialized tools.",
        weights: { Arts: 0, Science: 0, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 6,
    text: "Select the sentence that describes you best:",
    choices: [
      {
        text: "I am deeply empathetic, love expressing feelings, and am curious about cultures.",
        weights: { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 }
      },
      {
        text: "I love discovering how natural systems work and solving abstract mathematical puzzles.",
        weights: { Arts: 0, Science: 3, Commerce: 0, Vocational: 0 }
      },
      {
        text: "I am highly organized, pay attention to transaction details, and am good with money.",
        weights: { Arts: 0, Science: 0, Commerce: 3, Vocational: 1 }
      },
      {
        text: "I love learning practical, real-world skills that let me build, fix, or manufacture things.",
        weights: { Arts: 0, Science: 0, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 7,
    text: "If you could meet any prominent figure, who would you choose?",
    choices: [
      {
        text: "A celebrated novelist, filmmaker, journalist, or human rights activist.",
        weights: { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 }
      },
      {
        text: "A Nobel Prize-winning scientist, leading astronaut, or pioneering mathematician.",
        weights: { Arts: 0, Science: 3, Commerce: 0, Vocational: 0 }
      },
      {
        text: "A successful CEO, visionary investor, or economic policymaker.",
        weights: { Arts: 0, Science: 1, Commerce: 3, Vocational: 0 }
      },
      {
        text: "A master mechanic, an award-winning chef, or a designer of smart energy grids.",
        weights: { Arts: 0, Science: 0, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 8,
    text: "In a group project, what is your natural tendency?",
    choices: [
      {
        text: "Crafting the narrative, creating slides, and focusing on creative storytelling.",
        weights: { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 }
      },
      {
        text: "Researching the technical facts, performing calculations, and checking the methodology.",
        weights: { Arts: 0, Science: 3, Commerce: 1, Vocational: 0 }
      },
      {
        text: "Keeping track of time, managing milestones, and calculating presentation efficiency.",
        weights: { Arts: 0, Science: 1, Commerce: 3, Vocational: 0 }
      },
      {
        text: "Handling physical setups, building the prototype, and wiring/assembling components.",
        weights: { Arts: 0, Science: 0, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 9,
    text: "If you visited a traditional Kerala heritage site, what would capture your thoughts first?",
    choices: [
      {
        text: "The historical tales, the mural paintings, and the architectural history of the structure.",
        weights: { Arts: 3, Science: 0, Commerce: 0, Vocational: 1 }
      },
      {
        text: "The engineering durability of the wood preservation, and the mathematical geometry of structures.",
        weights: { Arts: 0, Science: 3, Commerce: 0, Vocational: 1 }
      },
      {
        text: "The tourism potential, souvenir shop margins, and economic revenue generated for the community.",
        weights: { Arts: 0, Science: 0, Commerce: 3, Vocational: 1 }
      },
      {
        text: "The traditional wood carving techniques, metalwork of locks/lamps, and brick-laying skills.",
        weights: { Arts: 0, Science: 0, Commerce: 0, Vocational: 3 }
      }
    ]
  },
  {
    id: 10,
    text: "Which elective course would you sign up for immediately?",
    choices: [
      {
        text: "Creative Writing, Journalism, or Psychology.",
        weights: { Arts: 3, Science: 0, Commerce: 1, Vocational: 0 }
      },
      {
        text: "Astrophysics, Genetics, or Advanced Algebra.",
        weights: { Arts: 0, Science: 3, Commerce: 0, Vocational: 0 }
      },
      {
        text: "Entrepreneurship, Business Analytics, or Accountancy.",
        weights: { Arts: 0, Science: 0, Commerce: 3, Vocational: 0 }
      },
      {
        text: "Robotics, Automobile Repair, or Organic Farming.",
        weights: { Arts: 0, Science: 1, Commerce: 0, Vocational: 3 }
      }
    ]
  }
];
