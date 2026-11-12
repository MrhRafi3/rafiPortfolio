import { ProjectItem, SkillCategory, WorkflowStage } from '../types';

export const PROFILE = {
  name: "MRH RAFI",
  shortName: "RAFI",
  monogram: "MR",
  primaryTitle: "App Developer",
  secondaryTitle: "Mobile UI & Systems",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  status: "Available for Apps & Contracts",
  email: "mrhrafi7@gmail.com",
  github: "https://github.com/MrhRafi3",
  linkedin: "https://www.linkedin.com/in/mrhrafi",
  positioning: "Building cross-platform mobile apps with thoughtful UI engineering and native-speed performance.",
  foundation: "C++ and Data Structures & Algorithms",
  biography: [
    "Independent App Developer based in Dhaka, Bangladesh. I craft cross-platform mobile applications with Flutter and Dart, focused on tactile interfaces and dependable 60–120fps responsiveness.",
    "Grounded in C++ and Data Structures & Algorithms, I approach app architecture from the ground up—bridging native C ABI/FFI engines when compute demands it and keeping UI boundaries clean."
  ],
  specs: [
    { label: "Role", value: "App Developer" },
    { label: "Primary Stack", value: "Flutter & Dart" },
    { label: "Systems", value: "C++17 / C ABI FFI" },
    { label: "Foundation", value: "Data Structures & Algorithms" },
    { label: "Persistence", value: "SQLite / Offline-First" },
    { label: "Frame Target", value: "60–120 FPS" }
  ]
};

export const PROJECTS: ProjectItem[] = [
  {
    id: "clocky",
    number: "01",
    title: "CLOCKY",
    subtitle: "Neumorphic World Clock, Alarm & Stopwatch",
    category: "Utility App",
    year: "2025",
    platform: "Flutter · Android · iOS · Web",
    role: "Lead Developer & UI Designer",
    githubUrl: "https://github.com/MrhRafi3/Clocky",
    coverImage: "/images/project-covers/clocky-cover.webp",
    screenshots: [
      "/images/clocky/screen-1.png",
      "/images/clocky/screen-2.png",
      "/images/clocky/screen-3.png",
      "/images/clocky/screen-4.png",
      "/images/clocky/screen-5.png"
    ],
    overview: "A tactile Flutter timekeeping app uniting dark neumorphic dials, alarm scheduling, interval countdowns, world clock deltas, and a sub-millisecond stopwatch.",
    problemStatement: "Default system clocks split world time comparison, lap timing, and dark ergonomic controls across cluttered interfaces.",
    verifiedFeatures: [
      "Digital and neumorphic analog clock with smooth CustomPainter dial sweeps.",
      "Persistent alarm scheduling with local notification audio triggers.",
      "Sub-millisecond stopwatch with instant lap recording.",
      "Interval countdown timer with quick presets and completion alerts.",
      "Multi-city world clock with live timezone delta comparison."
    ],
    techStack: ["Flutter", "Dart", "Provider", "CustomPainter", "Local Notifications", "SharedPreferences"],
    metricsOrHighlight: "Sub-millisecond stopwatch accuracy with zero dropped frames.",
    accentColor: "#F20D16",
    tags: ["Flutter", "Neumorphism", "Stopwatch", "World Clock"]
  },
  {
    id: "expify",
    number: "02",
    title: "EXPIFY BETA",
    subtitle: "Offline-First Personal Expense Tracker",
    category: "Fintech App",
    year: "2025–2026",
    platform: "Flutter · Mobile",
    role: "App Developer & UX Engineer",
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
    overview: "A privacy-first personal finance app built for rapid transaction logging, category breakdowns, and monthly budget tracking powered by local SQLite.",
    problemStatement: "Finance apps often force cloud sign-ups and multi-step forms just to record a daily coffee or utility bill.",
    verifiedFeatures: [
      "Under-3-tap transaction entry modal for fast daily logging.",
      "Category breakdown across Food, Housing, Utilities, and Subscriptions.",
      "Weekly and monthly visual expense gauges on custom canvas charts.",
      "100% offline SQLite/Sqflite persistence for instant local queries.",
      "High-contrast dark interface tuned for quick evening reviews."
    ],
    techStack: ["Flutter", "Dart", "SQLite", "Custom Canvas Charts", "State Management"],
    metricsOrHighlight: "Sub-3-second expense entry with zero network dependency.",
    accentColor: "#81b29a",
    tags: ["Flutter", "SQLite", "Offline-First", "Fintech"]
  },
  {
    id: "nomnom",
    number: "03",
    title: "NOMNOM",
    subtitle: "Multi-Role Food Ordering Ecosystem",
    category: "E-Commerce App",
    year: "2025",
    platform: "Flutter · Cross-Platform",
    role: "App Developer",
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
    overview: "An end-to-end food delivery prototype uniting four workflows—customer ordering, kitchen queue, rider routing, and admin—on shared design tokens.",
    problemStatement: "Multi-role delivery apps break down when menu pricing, cart state, and order milestones live in tangled UI code.",
    verifiedFeatures: [
      "Dish discovery feed with filtering, promo offers, and live cart tallying.",
      "Interactive dish customizer with add-ons and instant price updates.",
      "Kitchen partner queue view for order acknowledgment and prep status.",
      "Rider delivery view with milestone state transitions.",
      "Fluid splash choreography, cart drawer physics, and reactive badges."
    ],
    techStack: ["Flutter", "Dart", "REST Architecture", "JSON Serialization", "Custom Animations"],
    metricsOrHighlight: "4 interconnected role flows built on a unified design system.",
    accentColor: "#f2cc8f",
    tags: ["Flutter", "Multi-Role", "Cart State", "Animations"]
  },
  {
    id: "alchemy",
    number: "04",
    title: "ALCHEMY",
    subtitle: "Bilingual Element Synthesis Puzzle Game",
    category: "Mobile Game",
    year: "2024–2025",
    platform: "Flutter · Android · iOS",
    role: "Game & UI Developer",
    githubUrl: "https://github.com/MrhRafi3",
    coverImage: "/images/project-covers/alchemy-cover.webp",
    screenshots: [
      "/images/alchemy/home.png",
      "/images/alchemy/discover.png",
      "/images/alchemy/collection.png",
      "/images/alchemy/element-detail.png",
      "/images/alchemy/profile.png"
    ],
    overview: "An element combination puzzle game in Flutter where players synthesize compounds across 9 realms with full English and Bengali localization.",
    problemStatement: "Casual mobile puzzle games rarely pair responsive crafting mechanics with native Bengali lore and cultural accessibility.",
    verifiedFeatures: [
      "Formula-matching synthesis engine unlocking 100+ elemental compounds.",
      "Categorized encyclopedia spanning 9 realms from Nature to Cosmic.",
      "Five rarity tiers (Common through Legendary) with distinct visual cues.",
      "Complete bilingual English and Bengali names and element lore.",
      "Persistent player progress, milestones, and discovery stats."
    ],
    techStack: ["Flutter", "Dart", "Provider", "SharedPreferences", "Bilingual Localization"],
    metricsOrHighlight: "100+ craftable combinations with bilingual English/Bengali lore.",
    accentColor: "#9d4edd",
    tags: ["Flutter", "Puzzle Game", "Bilingual", "Bengali"]
  },
  {
    id: "aevique",
    number: "05",
    title: "AEVIQUE",
    subtitle: "Photo Editor Powered by a Native C++ Engine",
    category: "Creative Tool",
    year: "2025–2026",
    platform: "Flutter · Native C++ (C ABI FFI)",
    role: "Systems & App Developer",
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
    overview: "A mobile photo editor pairing a refined Flutter UI with a custom C++ image processing engine (aevique_core) linked via Dart FFI.",
    developmentDirection: "Built to eliminate Dart VM pixel-loop lag by offloading tone curves, HSL tuning, and convolution filters to strided RGBA8888 C++ buffers.",
    problemStatement: "Cross-platform photo editors stutter during real-time slider drags when megapixel buffers are processed inside managed VM loops.",
    verifiedFeatures: [
      "Tactile Flutter editing interface with live preview and precision sliders.",
      "Custom C++17/20 core compiled with CMake and bound directly via Dart FFI.",
      "Strided AeviqueImageBuffer model avoiding redundant pixel copies.",
      "Parametric exposure, contrast, highlights, shadows, vibrance, and tint.",
      "Non-destructive preset pipeline and modular tone state."
    ],
    techStack: ["Flutter", "Dart FFI", "C++17 / C++20", "CMake", "C ABI"],
    metricsOrHighlight: "Real-time native C++ pixel processing over zero-copy Dart FFI.",
    accentColor: "#d4af37",
    tags: ["Flutter", "C++", "Dart FFI", "Image Processing"]
  },
  {
    id: "bomb-run",
    number: "06",
    title: "MEOW ESCAPE: BOMB RUN",
    subtitle: "Neon Arcade Survival Dodge Game",
    category: "Game Development",
    year: "2025–2026",
    platform: "Flutter · Android · iOS · Web",
    role: "Game & UI Developer",
    githubUrl: "https://github.com/MrhRafi3/MEOW-ESCAPE-BOMB-RUN",
    coverImage: "/images/project-covers/bomb-run-cover.webp",
    screenshots: [],
    overview: "A retro-modern Flutter arcade survival game where players guide a cat mascot across a bounded playfield to dodge falling bombs, collect temporary Shield and Slow-Mo power-ups, and push for high scores.",
    developmentDirection: "Built around a 60Hz ChangeNotifier game loop (16ms tick), responsive 480px-capped playfield pillar-boxing, and continuous horizontal drag plus left/right tap controls.",
    problemStatement: "Frame-rate-sensitive mobile dodge games quickly feel unresponsive when touch drags stutter, hitboxes ignore safe areas, or difficulty scales unevenly.",
    verifiedFeatures: [
      "Continuous horizontal drag and left/right tap-zone movement clamped cleanly within playfield bounds.",
      "60Hz ChangeNotifier game loop spawning falling hazards alongside timed 5-second Shield and Slow-Mo power-ups.",
      "Progressive difficulty scaling (+0.05 fall speed per dodged object) with 3-heart lives and AABB collision detection.",
      "Pause modal with backdrop blur, 3-second resume countdown, and pause-aware power-up timer preservation.",
      "Local high-score persistence, sound effect toggles, and animated shooting-star canvas backdrop via SharedPreferences and Audioplayers."
    ],
    techStack: ["Flutter", "Dart", "ChangeNotifier", "CustomPainter", "Audioplayers", "SharedPreferences"],
    metricsOrHighlight: "60Hz tick loop, 5-second Shield & Slow-Mo timers, and safe-area-aware playfield clamping.",
    accentColor: "#00E5FF",
    tags: ["Flutter", "Arcade Game", "CustomPainter", "Audioplayers"]
  },
  {
    id: "sonora",
    number: "07",
    title: "SONORA",
    subtitle: "Offline Audiophile Music Player & C++ DSP Suite",
    category: "Mobile App Development",
    year: "2026",
    platform: "Flutter · Android · iOS · C++17 FFI",
    role: "Developer & Audio Architect",
    githubUrl: "https://github.com/MrhRafi3/SONORA",
    coverImage: "/images/project-covers/sonora-cover.webp",
    screenshots: [],
    overview: "A dark-charcoal and warm-amber offline music player built with Feature-based Clean Architecture, combining Drift SQLite library indexing, just_audio background playback, and a native C++17 Biquad DSP engine over Dart FFI.",
    developmentDirection: "Offline library indexing, artwork caching, background just_audio/audio_service playback, and the 10-band EQ UI are implemented and verified in simulator/automated tests; live PCM audio tapping from ExoPlayer/AVPlayer into the C++ DSP pipeline and physical hardware QA remain deferred.",
    problemStatement: "Mobile music players often mix UI state with storage scans, drop frames during large library scrolls, or lack audiophile-grade dark ergonomics and modular DSP controls.",
    verifiedFeatures: [
      "Offline audio discovery via Android MediaStore platform channel (READ_MEDIA_AUDIO) and iOS Files sandboxed import.",
      "Indexed Drift SQLite library supporting search, 5 sort modes, format filters (Hi-Res/Lossless/Standard), favorites, and reorderable playlists.",
      "Embedded metadata parsing and SHA-1 artwork disk caching with 500-entry in-memory LRU lookup and 150 MB cap.",
      "Single-instance just_audio playback with audio_service lock-screen/notification controls, smart previous, non-destructive shuffle, and repeat modes.",
      "Charcoal-and-amber UI with 5 accent presets, 5/10-band EQ frequency-response graph, and a C++17 Biquad/FFT FFI package (live audio-pipeline tap deferred)."
    ],
    techStack: ["Flutter", "Dart", "Riverpod", "Drift SQLite", "just_audio", "C++17 FFI"],
    metricsOrHighlight: "Indexed Drift SQLite library, 150 MB LRU artwork cache, and C++17 Biquad/FFT FFI engine.",
    accentColor: "#E59866",
    tags: ["Flutter", "Drift SQLite", "just_audio", "C++17 FFI"]
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "primary",
    name: "Core Stack",
    headline: "Mobile App Engineering",
    skills: [
      {
        name: "Flutter",
        description: "Declarative cross-platform UI, custom painters, and responsive widget architecture.",
        isPrimary: true,
        tag: "Framework"
      },
      {
        name: "Dart",
        description: "Sound null-safe typing, async streams, isolates, and direct C FFI bindings.",
        isPrimary: true,
        tag: "Language"
      },
      {
        name: "Mobile UI Engineering",
        description: "60–120fps touch ergonomics, adaptive spacing, and tactile micro-interactions.",
        isPrimary: true,
        tag: "Craft"
      },
      {
        name: "Cross-Platform Systems",
        description: "Unified codebases respecting both iOS Cupertino and Android Material conventions.",
        isPrimary: true,
        tag: "Delivery"
      }
    ]
  },
  {
    id: "foundation",
    name: "Systems",
    headline: "Native & Algorithmic Depth",
    skills: [
      {
        name: "C++ (C++17 / C++20)",
        description: "RAII memory discipline, strided image buffers, and high-throughput native compute.",
        isPrimary: true,
        tag: "Native"
      },
      {
        name: "Data Structures & Algorithms",
        description: "Time and space complexity optimization, caching, and predictable data pipelines.",
        isPrimary: true,
        tag: "Core CS"
      },
      {
        name: "C ABI & Dart FFI",
        description: "Connecting Flutter isolates to compiled C++ libraries via CMake without buffer bloat.",
        isPrimary: true,
        tag: "Interop"
      }
    ]
  },
  {
    id: "architecture",
    name: "Architecture",
    headline: "State & Local Data",
    skills: [
      {
        name: "Clean Architecture & MVVM",
        description: "Clear boundaries across presentation, domain logic, and persistence layers.",
        tag: "Structure"
      },
      {
        name: "Provider & Riverpod",
        description: "Scoped reactive state management, dependency injection, and testable view models.",
        tag: "State"
      },
      {
        name: "SQLite / Sqflite",
        description: "Indexed local relational storage, transactional writes, and offline-first speed.",
        tag: "Database"
      },
      {
        name: "REST APIs & JSON",
        description: "Typed network clients, clean DTO serialization, and resilient error handling.",
        tag: "Networking"
      }
    ]
  },
  {
    id: "workflow",
    name: "Craft",
    headline: "Tooling & Profiling",
    skills: [
      {
        name: "Git & GitHub",
        description: "Clean commit history, feature branching, and disciplined release workflows.",
        tag: "VCS"
      },
      {
        name: "Android Studio & VS Code",
        description: "Native Android/iOS build toolchains, Gradle setup, and widget inspection.",
        tag: "IDE"
      },
      {
        name: "Widget & Unit Testing",
        description: "Automated regression tests verifying state logic and critical user flows.",
        tag: "Quality"
      },
      {
        name: "Frame & Memory Profiling",
        description: "Dart DevTools timeline analysis to keep animations jank-free on real hardware.",
        tag: "Performance"
      }
    ]
  }
];

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: "01",
    number: "01",
    title: "Discover",
    badge: "Requirements",
    summary: "Clarifying user flow, offline constraints, and ergonomic priorities before writing code.",
    details: "Mapping screens, state boundaries, and touch targets across device sizes.",
    deliverables: [
      "User flow & screen map",
      "Offline & online data scope",
      "State boundary definition",
      "Touch ergonomics checklist"
    ]
  },
  {
    step: "02",
    number: "02",
    title: "Design",
    badge: "Visual System",
    summary: "Shaping typography, color tokens, and tactile motion for iOS and Android.",
    details: "Building reusable component variants with strong contrast and clear hierarchy.",
    deliverables: [
      "Design token system",
      "Micro-interaction timing",
      "Phone & tablet layouts",
      "Contrast & legibility check"
    ]
  },
  {
    step: "03",
    number: "03",
    title: "Develop",
    badge: "Flutter & Dart",
    summary: "Implementing modular Flutter widgets and predictable reactive state.",
    details: "Strict typing, clean separation of concerns, and local or network data wiring.",
    deliverables: [
      "Modular widget tree",
      "Provider / Riverpod state",
      "SQLite & REST integration",
      "Accessible semantics"
    ]
  },
  {
    step: "04",
    number: "04",
    title: "Engineer",
    badge: "Native C++",
    summary: "Offloading heavy compute to native C++ when the VM isn't enough.",
    details: "Compiling C++ cores via CMake and exchanging strided buffers over Dart FFI.",
    deliverables: [
      "CMake native library",
      "C ABI / Dart FFI bridge",
      "Zero-copy buffer layout",
      "Background isolate work"
    ]
  },
  {
    step: "05",
    number: "05",
    title: "Refine",
    badge: "Profiling",
    summary: "Eliminating frame drops, memory bloat, and gesture rough edges on real devices.",
    details: "Auditing rebuilds in DevTools until every transition holds 60–120fps.",
    deliverables: [
      "DevTools frame audit",
      "Rebuild minimization",
      "Device gesture QA",
      "Release build check"
    ]
  }
];

export const TECHNICAL_DEEP_DIVE = {
  headline: "Systems Engineering In A Mobile Runtime",
  topics: [
    {
      id: "aevique-cpp",
      title: "Aevique C++ Engine",
      badge: "C++17 · Dart FFI · Zero-Copy",
      description: "Offloading megapixel tone curves and convolution filters from the Dart VM to a native C++ core using strided RGBA8888 buffers.",
      highlights: [
        "Direct C ABI header (aevique_engine.h) linked via Dart FFI",
        "Explicit stride_bytes alignment avoids unnecessary image copies",
        "Predictable tone, exposure, highlight, and shadow passes",
        "Cross-compiled cleanly for mobile targets with CMake"
      ],
      codeSnippet: `typedef struct AeviqueImageBuffer {
    uint8_t* data;
    int32_t width;
    int32_t height;
    int32_t stride_bytes;
    int32_t format;
} AeviqueImageBuffer;

AEVIQUE_API AeviqueStatus aevique_apply_tone_adjustments(
    const AeviqueImageBuffer* src,
    AeviqueImageBuffer* dst,
    const AeviqueToneParameters* params
);`,
      codeLang: "cpp",
      filename: "aevique_engine.h"
    },
    {
      id: "clocky-precision",
      title: "Clocky Timing Loop",
      badge: "CustomPainter · 60fps Tick",
      description: "Rendering smooth stopwatch arcs and live dial ticks without triggering expensive widget subtree rebuilds.",
      highlights: [
        "Isolates high-frequency tick state via lightweight ValueNotifiers",
        "Direct Canvas arc rendering inside CustomPainter",
        "Hardware-scheduled alarms using native platform managers",
        "GPU-friendly dark neumorphic shadow composition"
      ],
      codeSnippet: `class ClockDialPainter extends CustomPainter {
  final double progressAngle;
  final Color accentColor;

  ClockDialPainter({required this.progressAngle, required this.accentColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width * 0.46;
    final paint = Paint()
      ..color = accentColor
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2, progressAngle, false, paint,
    );
  }

  @override
  bool shouldRepaint(ClockDialPainter old) => old.progressAngle != progressAngle;
}`,
      codeLang: "dart",
      filename: "clock_dial_painter.dart"
    },
    {
      id: "expify-persistence",
      title: "Expify Local SQLite",
      badge: "SQLite · Offline-First",
      description: "Instant transaction logging and category summaries with indexed local SQLite queries and zero cloud latency.",
      highlights: [
        "Indexed timestamp and category columns for fast monthly aggregations",
        "Sub-3-tap logging modal with optimistic UI state updates",
        "Asynchronous background commit keeping touch animations fluid",
        "100% on-device financial data with zero mandatory sign-in"
      ],
      codeSnippet: `await db.execute('''
  CREATE TABLE expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    category_id TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    note TEXT
  );
  CREATE INDEX idx_expenses_timestamp
    ON expenses(timestamp DESC);
''');`,
      codeLang: "sql",
      filename: "schema.sql"
    }
  ]
};
