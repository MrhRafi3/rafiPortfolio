export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  platform: string;
  role: string;
  githubUrl?: string;
  coverImage: string;
  screenshots: string[];
  overview: string;
  developmentDirection?: string;
  problemStatement: string;
  verifiedFeatures: string[];
  techStack: string[];
  metricsOrHighlight: string;
  accentColor: string;
  tags: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  headline: string;
  skills: {
    name: string;
    description: string;
    isPrimary?: boolean;
    tag?: string;
  }[];
}

export interface WorkflowStage {
  step: string;
  number: string;
  title: string;
  summary: string;
  deliverables: string[];
  details: string;
  badge: string;
}

export const PROFILE = {
  name: "MRH RAFI",
  shortName: "RAFI",
  monogram: "MR",
  primaryTitle: "Flutter App Developer",
  secondaryTitle: "Mobile UI Engineer",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  coordinates: "23.8103° N, 90.4125° E",
  status: "OPEN FOR MOBILE APPS & CONTRACTS",
  email: "mrhrafi7@gmail.com",
  github: "https://github.com/MrhRafi3",
  linkedin: "https://www.linkedin.com/in/mrhrafi",
  positioning: "I build modern mobile experiences with Flutter, combining thoughtful UI engineering, performance-focused development, and attention to detail.",
  foundation: "C++ and Data Structures & Algorithms",
  bioHeadline: "DESIGNING EXPERIENCES. ENGINEERING MOBILE APPLICATIONS.",
  biography: [
    "Independent Flutter developer and mobile UI engineer based in Dhaka, Bangladesh, dedicated to building fluid, tactile cross-platform mobile applications with uncompromising performance.",
    "Rooted in C++ fundamentals and Data Structures & Algorithms, I approach mobile UI engineering from the metal up—respecting frame-rate budgets (60/120fps), touch ergonomics, and clean architectural boundaries.",
    "Whether bridging low-latency native image processing via C ABI / FFI or designing responsive, micro-animated mobile interfaces, I focus on authentic usability and production-grade stability."
  ],
  stats: [
    { label: "PRIMARY STACK", value: "Flutter & Dart" },
    { label: "FOUNDATION", value: "C++ & DSA" },
    { label: "ENGINEERED PROJECTS", value: "5 Verified" },
    { label: "FRAME TARGET", value: "60–120 FPS" },
  ]
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "clocky",
    number: "01",
    title: "CLOCKY",
    subtitle: "Luxury Neumorphic World Clock & Alarm Application",
    category: "Mobile Application / Utility",
    year: "2025",
    platform: "Flutter / Android / iOS / Web",
    role: "Lead Flutter Developer & UI Designer",
    githubUrl: "https://github.com/MrhRafi3/Clocky",
    coverImage: "/images/project-covers/clocky-cover.webp",
    screenshots: [
      "/images/clocky/screen-1.png",
      "/images/clocky/screen-2.png",
      "/images/clocky/screen-3.png",
      "/images/clocky/screen-4.png",
      "/images/clocky/screen-5.png"
    ],
    overview: "A tactile Flutter application engineered to streamline daily time tracking, alarm scheduling, interval countdowns, and world time comparison. Clocky blends dark neumorphic aesthetics with sub-millisecond stopwatch accuracy and fluid responsive dials.",
    problemStatement: "Standard system clocks frequently lack unified control over multi-timezone comparison, customizable dark neumorphic ergonomics, and low-latency stopwatch lap recording without frame stutter.",
    verifiedFeatures: [
      "Digital & Neumorphic Clock with live second tick and high-precision dial rendering.",
      "Alarm Management system utilizing flutter alarm plugins with persistent audio triggers.",
      "Precision Stopwatch with sub-millisecond counter and instant lap recording table.",
      "Countdown Interval Timer with quick interval presets and audio completion cues.",
      "World Clock supporting multi-city local time delta calculations and time zone comparisons."
    ],
    techStack: ["Flutter", "Dart", "Provider", "Local Notifications", "Custom Painters", "SharedPreferences"],
    metricsOrHighlight: "Sub-millisecond stopwatch accuracy with zero dropped frames on mobile hardware.",
    accentColor: "#F20D16",
    tags: ["Flutter", "Neumorphism", "Alarm Scheduler", "Stopwatch", "World Clock"]
  },
  {
    id: "expify",
    number: "02",
    title: "EXPIFY BETA",
    subtitle: "Intuitive Personal Expense & Budget Tracking",
    category: "Fintech / Utility",
    year: "2025 - 2026",
    platform: "Flutter / Mobile UI",
    role: "Flutter Developer & UX Engineer",
    githubUrl: "https://github.com/MrhRafi3",
    coverImage: "/images/project-covers/expify-cover.webp",
    screenshots: [
      "/images/expify/screen-1.png",
      "/images/expify/screen-2.png",
      "/images/expify/screen-3.png",
      "/images/expify/screen-4.png",
      "/images/expify/screen-5.png",
      "/images/expify/screen-6.png",
      "/images/expify/screen-7.png",
      "/images/expify/screen-8.png"
    ],
    overview: "A focused personal expense tracking application designed for frictionless transaction logging, dynamic category distribution, and monthly budget clarity. Expify Beta utilizes an offline-first SQLite database architecture to ensure instantaneous feedback.",
    problemStatement: "Most personal finance apps enforce bloated multi-step dialogs and mandatory online accounts, causing budget logging fatigue and abandonment.",
    verifiedFeatures: [
      "Frictionless transaction logging modal requiring under 3 taps to capture any purchase.",
      "Dynamic categorical breakdowns (Food, Housing, Utilities, Subscriptions, Entertainment).",
      "Weekly and monthly visual expense summaries with progress gauges.",
      "Offline-first SQLite/Sqflite architecture ensuring 100% data privacy and instant queries.",
      "Optimized dark theme with high-contrast numerical readouts for evening expense audits."
    ],
    techStack: ["Flutter", "Dart", "SQLite / Sqflite", "State Management", "Custom Canvas Charts"],
    metricsOrHighlight: "Sub-3-second transaction entry speed with zero network dependency.",
    accentColor: "#81b29a",
    tags: ["Flutter", "SQLite", "Offline-First", "Expense Analytics", "Fintech UI"]
  },
  {
    id: "nomnom",
    number: "03",
    title: "NOMNOM",
    subtitle: "Multi-Role Food Delivery & Order Ecosystem",
    category: "E-Commerce / Food Logistics UI",
    year: "2025",
    platform: "Flutter / Cross-Platform",
    role: "Full-Lifecycle Mobile Developer",
    githubUrl: "https://github.com/mrhrafi3/NomNom_food",
    coverImage: "/images/project-covers/nomnom-cover.webp",
    screenshots: [
      "/images/NomNom/splash-interface.png",
      "/images/NomNom/home.png",
      "/images/NomNom/explore-menu.png",
      "/images/NomNom/food.png",
      "/images/NomNom/food-combo.png",
      "/images/NomNom/cart.png",
      "/images/NomNom/order-tracking.png",
      "/images/NomNom/offers.png",
      "/images/NomNom/progile-settings.png"
    ],
    overview: "An end-to-end mobile food ordering application demo exploring four interconnected user touchpoints: customer ordering, kitchen partner queue, rider delivery routing, and administration. Crafted with rich micro-animations, cart drawer state transitions, and intuitive item customization.",
    problemStatement: "Coordinating multi-stakeholder delivery workflows requires clean state separation so menu updates, cart calculations, and delivery statuses remain synchronised without spaghetti logic.",
    verifiedFeatures: [
      "Customer discovery feed with dish filtering, real-time cart tallying, and discount application.",
      "Interactive dish customizer with condiment selection and dynamic pricing recalculation.",
      "Kitchen partner interface concept for queue acknowledgment and preparation toggling.",
      "Rider routing view with delivery coordinate simulation and status milestone transitions.",
      "Polished splash screen animation, reactive badges, and fluid drawer physics."
    ],
    techStack: ["Flutter", "Dart", "REST Client Architecture", "State Management", "JSON Serialization", "Custom Animation Controllers"],
    metricsOrHighlight: "Architected across 4 distinct role flows with shared design token foundation.",
    accentColor: "#f2cc8f",
    tags: ["Flutter", "Food Delivery", "Multi-Role UI", "Cart Mechanics", "State Machine"]
  },
  {
    id: "alchemy",
    number: "04",
    title: "ALCHEMY",
    subtitle: "Element Synthesis & Discovery Mobile Puzzle Game",
    category: "Interactive Game / Puzzle UI",
    year: "2024 - 2025",
    platform: "Flutter / Android / iOS",
    role: "Flutter Game Developer & UI Architect",
    githubUrl: "https://github.com/MrhRafi3",
    coverImage: "/images/project-covers/alchemy-cover.webp",
    screenshots: [
      "/images/alchemy/home.png",
      "/images/alchemy/discover.png",
      "/images/alchemy/collection.png",
      "/images/alchemy/element-detail.png",
      "/images/alchemy/profile.png"
    ],
    overview: "An immersive element combination and synthesis puzzle game built in Flutter. Players combine basic natural elements to discover hundreds of compounds across nature, matter, energy, technology, and cosmic realms, complete with bilingual English/Bengali descriptions and rarity tiers.",
    problemStatement: "Casual puzzle games often suffer from clunky UI, rigid animations, and lack of localized cultural accessibility for non-English speakers.",
    verifiedFeatures: [
      "Dynamic combination engine checking ingredient formulas to unlock new elemental compounds.",
      "Categorized discovery encyclopedia spanning 9 distinct realms (Nature, Energy, Cosmic, Tech, etc.).",
      "Rarity grading system (Common, Uncommon, Rare, Epic, Legendary) with tiered visual effects.",
      "Full bilingual support with authentic English and Bengali names and lore descriptions.",
      "Persistent player collection progress, achievement milestones, and statistics tracking."
    ],
    techStack: ["Flutter", "Dart", "Provider", "SharedPreferences", "Custom Vector Icons", "Bilingual Localization"],
    metricsOrHighlight: "Over 100+ craftable element combinations with instant state restoration.",
    accentColor: "#9d4edd",
    tags: ["Flutter Game", "Element Synthesis", "Bilingual UI", "Progress Tracking", "Bengali Support"]
  },
  {
    id: "aevique",
    number: "05",
    title: "AEVIQUE",
    subtitle: "Creative Image Editor with Native C++ Processing Engine",
    category: "Creative Tool / High-Performance Mobile",
    year: "2025 - 2026",
    platform: "Flutter + Native C++ (C ABI FFI)",
    role: "Systems & Mobile UI Engineer",
    githubUrl: "https://github.com/MrhRafi3/AEVIQUE",
    coverImage: "/images/project-covers/aevique-cover.webp",
    screenshots: [
      "/images/Aevique/Simulator Screenshot - iPhone 16e - 2026-10-22 at 15.08.46.png",
      "/images/Aevique/Simulator Screenshot - iPhone 16e - 2026-10-22 at 15.10.03.png",
      "/images/Aevique/Simulator Screenshot - iPhone 16e - 2026-10-22 at 15.11.53.png",
      "/images/Aevique/Simulator Screenshot - iPhone 16e - 2026-10-22 at 15.12.20.png",
      "/images/Aevique/Simulator Screenshot - iPhone 16e - 2026-10-22 at 15.12.50.png",
      "/images/Aevique/Simulator Screenshot - iPhone 16e - 2026-10-22 at 15.18.25.png"
    ],
    overview: "A premier creative photo editing application combining an elegant Flutter mobile user interface with a custom, high-performance native C++ image processing engine (aevique_core). Designed with ivory, champagne gold, and obsidian aesthetic tokens, Aevique executes tonal curve adjustments, HSL color tuning, and convolution filters via a direct C ABI bridge.",
    developmentDirection: "Engineered specifically to overcome the performance ceiling of Dart VM pixel loops by offloading compute-intensive pixel operations (exposure, highlights, shadows, tone curves, RGB/HSL balancing) to a dedicated C++ engine using strided RGBA8888 memory buffers.",
    problemStatement: "Mobile photo editors in cross-platform frameworks often lag when processing multi-megapixel images, causing touch latency and slider stutter during real-time adjustments.",
    verifiedFeatures: [
      "Flutter-powered mobile interface with tactile curve editors, sliders, and live preview rendering.",
      "Custom C++ native core (aevique_engine.cpp) compiled with CMake and linked via Dart FFI.",
      "Strided AeviqueImageBuffer memory model with zero unnecessary buffer copies.",
      "Parametric tone adjustments: Exposure, contrast, highlights, shadows, vibrance, and tint.",
      "Modular preset architecture and non-destructive image editing state pipeline."
    ],
    techStack: ["Flutter", "Dart FFI", "C++17 / C++20", "CMake", "Direct C ABI", "SIMD / Strided Memory"],
    metricsOrHighlight: "Near-instantaneous native C++ pixel processing with zero-overhead FFI data passing.",
    accentColor: "#d4af37",
    tags: ["Flutter", "C++ Engine", "Dart FFI", "Image Processing", "Hardware Performance"]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "primary",
    name: "PRIMARY TECHNOLOGIES",
    headline: "Mobile Engineering Core",
    skills: [
      {
        name: "Flutter",
        description: "Declarative UI framework for multi-platform applications, custom rendering pipelines, and responsive widget composition.",
        isPrimary: true,
        tag: "Core Platform"
      },
      {
        name: "Dart",
        description: "Strongly-typed object-oriented language, asynchronous streams, isolates, and native C FFI integration.",
        isPrimary: true,
        tag: "Core Language"
      },
      {
        name: "Mobile UI Engineering",
        description: "Translating Figma designs into 60/120fps tactile mobile interfaces, touch ergonomics, and fluid micro-animations.",
        isPrimary: true,
        tag: "Specialization"
      },
      {
        name: "Cross-Platform Development",
        description: "Adaptive layouts balancing iOS Cupertino feel and Android Material 3 design tokens from single unified codebases.",
        isPrimary: true,
        tag: "Architecture"
      }
    ]
  },
  {
    id: "foundation",
    name: "SYSTEMS FOUNDATION",
    headline: "Underlying Engineering Depth",
    skills: [
      {
        name: "C++ (Modern C++17/20)",
        description: "Low-level memory management, RAII, high-throughput pixel manipulation algorithms, and custom native libraries.",
        isPrimary: true,
        tag: "Native Core"
      },
      {
        name: "Data Structures & Algorithms",
        description: "Algorithmic efficiency, time/space optimization, graph traversal, caching strategies, and mathematical computing.",
        isPrimary: true,
        tag: "Foundation"
      },
      {
        name: "Native Platform Integration (C ABI / FFI)",
        description: "Connecting Flutter Dart isolates to compiled native dynamic libraries via foreign function interfaces with strided buffers.",
        isPrimary: true,
        tag: "Interoperability"
      }
    ]
  },
  {
    id: "architecture",
    name: "ARCHITECTURE & DATA",
    headline: "Predictable State & Persistence",
    skills: [
      {
        name: "Clean Architecture & MVVM",
        description: "Separation of concerns between Presentation, Domain, and Data layers with clear dependency boundaries.",
        tag: "Architecture"
      },
      {
        name: "Provider & Riverpod",
        description: "Reactive state management, scoped state lifecycle, dependency injection, and testable view models.",
        tag: "State Management"
      },
      {
        name: "SQLite / Sqflite",
        description: "Local relational database persistence, indexing, transactional queries, and offline-first synchronization.",
        tag: "Persistence"
      },
      {
        name: "REST APIs & JSON Serialization",
        description: "Resilient HTTP networking, interceptors, exponential backoff retries, and typed DTO models.",
        tag: "Networking"
      }
    ]
  },
  {
    id: "workflow",
    name: "TOOLING & CRAFTSMANSHIP",
    headline: "Development Standards",
    skills: [
      {
        name: "Git & GitHub Workflows",
        description: "Atomic commits, pull request discipline, semantic versioning, and branch management.",
        tag: "VCS"
      },
      {
        name: "Android Studio & VS Code",
        description: "Native Android toolchain, Gradle configurations, DevTools profiler, and widget inspector.",
        tag: "IDE"
      },
      {
        name: "Widget & Unit Testing",
        description: "Automated regression prevention, mock service testing, and verified UI behavior assertions.",
        tag: "Testing"
      },
      {
        name: "Performance & Frame Profiling",
        description: "Dart DevTools CPU/memory profiling, frame build budget monitoring, and jank elimination.",
        tag: "Optimization"
      }
    ]
  }
];

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: "01",
    number: "01",
    title: "DISCOVER",
    badge: "REQUIREMENTS & ERGONOMICS",
    summary: "Deconstructing core product objectives and user touch ergonomics.",
    details: "I start by analyzing the real mobile problem: understanding user constraints, data flow, offline behavior, and screen density variations. No code is written before defining clear input requirements.",
    deliverables: [
      "User journey & screen mapping",
      "Offline vs online data requirements",
      "System constraints & state boundaries",
      "Touch target & ergonomic benchmarks"
    ]
  },
  {
    step: "02",
    number: "02",
    title: "DESIGN",
    badge: "TACTILE UI & DESIGN TOKENS",
    summary: "Architecting intuitive, responsive mobile design tokens.",
    details: "Translating concepts into a coherent visual system. I structure typography hierarchies, color swatches, component variants, and tactile feedback patterns that feel at home on both iOS and Android.",
    deliverables: [
      "Modular design token library",
      "Fluid micro-interaction specifications",
      "Responsive layout rules (phone & tablet)",
      "Dark / Light theme contrast validation"
    ]
  },
  {
    step: "03",
    number: "03",
    title: "DEVELOP",
    badge: "FLUTTER & DART CORE",
    summary: "Building robust applications with Flutter and modern Dart.",
    details: "Writing clean, declarative Flutter code with predictable state management (Provider / Riverpod). I prioritize modular widgets, strict typing, reusable view components, and smooth page transitions.",
    deliverables: [
      "Modular widget architecture",
      "Reactive state container wiring",
      "REST & offline persistence integrations",
      "Accessible semantics & screen-reader keys"
    ]
  },
  {
    step: "04",
    number: "04",
    title: "ENGINEER",
    badge: "NATIVE INTEGRATION & C++",
    summary: "Pushing beyond framework limits with native performance bridges.",
    details: "When high compute is required—such as real-time pixel processing in Aevique—I bridge native C++ engines via Dart FFI and C ABI, orchestrating strided memory buffers with zero unnecessary copies.",
    deliverables: [
      "C++ native engine compilation (CMake)",
      "Dart FFI memory-safe C ABI binding",
      "Zero-copy strided buffer exchange",
      "Multithreaded background isolate tasks"
    ]
  },
  {
    step: "05",
    number: "05",
    title: "REFINE",
    badge: "PROFILING & POLISH",
    summary: "Rigorous profiling on physical devices for 60/120fps perfection.",
    details: "Testing on real hardware to catch frame drops, memory leaks, and edge-case gestures. I tune widget rebuild costs, verify offline states, and polish touch interactions until every swipe feels natural.",
    deliverables: [
      "Dart DevTools frame rate profiling",
      "Widget rebuild optimization",
      "Real device hardware testing",
      "Production release build verification"
    ]
  }
];

export const TECHNICAL_DEEP_DIVE = {
  headline: "SYSTEMS-LEVEL PERFORMANCE IN A MOBILE RUNTIME",
  subheadline: "Where Flutter's declarative expressiveness meets native C++ compute efficiency.",
  topics: [
    {
      id: "aevique-cpp",
      title: "AEVIQUE NATIVE C++ ENGINE",
      badge: "C++17 / DART FFI / ZERO-COPY",
      description: "How Aevique bypasses Flutter's Dart VM rendering bottleneck to achieve instantaneous tone curve adjustments and convolution filters.",
      highlights: [
        "Direct C ABI export `aevique_engine.h` and strided memory buffers",
        "Avoids costly image cloning by directly passing raw pointer pointers through Dart FFI",
        "Predictable SIMD-ready algorithms for exposure, saturation, highlights, and shadows",
        "Modular architecture allowing desktop and mobile cross-compilation via CMake"
      ],
      codeSnippet: `// Aevique C ABI Engine Export (aevique_engine.h)
typedef struct AeviqueImageBuffer {
    uint8_t* data;
    int32_t width;
    int32_t height;
    int32_t stride_bytes; /* Explicit stride for memory alignment */
    int32_t format;       /* AEVIQUE_PIXEL_FORMAT_RGBA8888 */
} AeviqueImageBuffer;

AEVIQUE_API AeviqueStatus aevique_apply_tone_adjustments(
    const AeviqueImageBuffer* src,
    AeviqueImageBuffer* dst,
    const AeviqueToneParameters* params
);`,
      codeLang: "cpp"
    },
    {
      id: "clocky-precision",
      title: "CLOCKY SUB-MILLISECOND TIMING",
      badge: "CUSTOM PAINTERS / 60FPS TICK",
      description: "Delivering microsecond-accurate stopwatch and dial sweeps without triggering costly widget subtree rebuilds.",
      highlights: [
        "Separation of high-frequency ticker from UI widget tree using lightweight ValueNotifiers",
        "Direct CustomPainter canvas rendering for analog clock sweep and millisecond lap dial",
        "Hardware-scheduled background alarms using platform-native alarm managers",
        "Neumorphic drop shadow calculations optimized for mobile GPU rasterization"
      ],
      codeSnippet: `// Clocky High-Frequency Dial Painter
class ClockDialPainter extends CustomPainter {
  final double progressAngle;
  final Color accentColor;

  ClockDialPainter({required this.progressAngle, required this.accentColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width * 0.46;
    final sweepPaint = Paint()
      ..color = accentColor
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2, progressAngle, false, sweepPaint,
    );
  }
  @override
  bool shouldRepaint(ClockDialPainter old) => old.progressAngle != progressAngle;
}`,
      codeLang: "dart"
    },
    {
      id: "expify-persistence",
      title: "EXPIFY OFFLINE-FIRST PERSISTENCE",
      badge: "SQLITE / SUB-3S TRANSACTION LOG",
      description: "Zero network latency, 100% private financial tracking with indexed SQLite queries and instant state updates.",
      highlights: [
        "Direct local SQLite database with indexed category and timestamp columns",
        "Single-modal transaction logging optimized to require fewer than 3 taps",
        "Instant optimistic UI updates with background asynchronous database commit",
        "Zero tracking, zero cloud dependencies, ensuring user privacy by design"
      ],
      codeSnippet: `// Expify Indexed Database Schema & Optimistic Insert
await db.execute('''
  CREATE TABLE expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    note TEXT
  );
  CREATE INDEX idx_expenses_timestamp ON expenses(timestamp DESC);
''');`,
      codeLang: "sql"
    }
  ]
};
