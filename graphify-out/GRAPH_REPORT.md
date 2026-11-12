# Graph Report - TypoPortfolio  (2026-11-12)

## Corpus Check
- 37 files · ~16,780 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 11, .glb 2, .css 1)

## Summary
- 171 nodes · 373 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38e81611`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- WorkflowSection.tsx
- App.tsx
- compilerOptions
- puppeteer
- ContinuousSnakeLine.tsx
- three
- react
- README.md

## God Nodes (most connected - your core abstractions)
1. `react` - 21 edges
2. `App()` - 16 edges
3. `compilerOptions` - 16 edges
4. `prefersReducedMotion()` - 13 edges
5. `RevealHeading()` - 12 edges
6. `scrollToSection()` - 9 edges
7. `lucide-react` - 9 edges
8. `gsap` - 9 edges
9. `HorizontalProjectGallery()` - 8 edges
10. `HeroLaptopCanvas()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ProjectSlideProps` --references--> `ProjectItem`  [EXTRACTED]
  src/components/sections/HorizontalProjectGallery.tsx → src/types/index.ts
- `ProjectEditorialSlide()` --calls--> `StopwatchCanvas()`  [EXTRACTED]
  src/components/sections/HorizontalProjectGallery.tsx → src/components/canvas/StopwatchCanvas.tsx
- `ProjectEditorialSlide()` --calls--> `TextScramble()`  [EXTRACTED]
  src/components/sections/HorizontalProjectGallery.tsx → src/components/common/TextScramble.tsx
- `App()` --calls--> `HorizontalProjectGallery()`  [EXTRACTED]
  src/App.tsx → src/components/sections/HorizontalProjectGallery.tsx
- `HorizontalProjectGallery()` --calls--> `RevealHeading()`  [EXTRACTED]
  src/components/sections/HorizontalProjectGallery.tsx → src/components/common/RevealHeading.tsx

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (36): dependencies, gsap@^3.12.5, lenis@^1.1.18, lucide-react@^0.460.0, react@^18.3.1, react-dom@^18.3.1, three@^0.170.0, devDependencies (+28 more)

### Community 1 - "WorkflowSection.tsx"
Cohesion: 0.18
Nodes (16): Lazy3DViewport(), Lazy3DViewportProps, HorizontalProjectGallery(), ProjectEditorialSlide(), ProjectSlideProps, ProjectDetailModal(), ProjectDetailModalProps, PROJECTS (+8 more)

### Community 2 - "App.tsx"
Cohesion: 0.20
Nodes (18): lucide-react, App(), NAV_ITEMS, Navbar(), NavbarProps, SECTION_IDS, RevealHeading(), AboutMeSection() (+10 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 4 - "puppeteer"
Cohesion: 0.19
Nodes (5): puppeteer@^25.16.0, puppeteer, outDir, outDir, outDir

### Community 5 - "ContinuousSnakeLine.tsx"
Cohesion: 0.50
Nodes (4): catmullRomToBezier(), ContinuousSnakeLine(), GradientStop, Point

### Community 6 - "three"
Cohesion: 0.19
Nodes (17): three, createMacBookDisplayGeometry(), HeroLaptopCanvas(), HeroLaptopCanvasProps, StopwatchCanvas(), StopwatchCanvasProps, create3DViewerController(), ViewerController (+9 more)

### Community 7 - "react"
Cohesion: 0.21
Nodes (12): gsap, react, AnimatedCursor(), TRAIL_SPECS, RevealHeadingProps, RevealLine, BOUNDARY_IDS, SectionTransitionStreak() (+4 more)

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `WorkflowSection.tsx`, `App.tsx`, `ContinuousSnakeLine.tsx`, `three`?**
  _High betweenness centrality (0.231) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06970128022759602 - nodes in this community are weakly interconnected._
- **Why does `puppeteer` connect `puppeteer` to `package.json`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._