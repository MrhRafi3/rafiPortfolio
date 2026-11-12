# Graph Report - TypoPortfolio  (2026-11-12)

## Corpus Check
- 33 files · ~14,572 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 11, .glb 2, .css 1)

## Summary
- 158 nodes · 315 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b532feb`
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
- dependencies
- README.md

## God Nodes (most connected - your core abstractions)
1. `react` - 18 edges
2. `compilerOptions` - 16 edges
3. `App()` - 15 edges
4. `scrollToSection()` - 9 edges
5. `lucide-react` - 9 edges
6. `HeroLaptopCanvas()` - 8 edges
7. `gsap` - 8 edges
8. `three` - 8 edges
9. `StopwatchCanvas()` - 7 edges
10. `ProjectItem` - 6 edges

## Surprising Connections (you probably didn't know these)
- `HeroSection()` --calls--> `HeroLaptopCanvas()`  [EXTRACTED]
  src/components/sections/HeroSection.tsx → src/components/canvas/HeroLaptopCanvas.tsx
- `App()` --calls--> `ContinuousSnakeLine()`  [EXTRACTED]
  src/App.tsx → src/components/common/ContinuousSnakeLine.tsx
- `ProjectSlideProps` --references--> `ProjectItem`  [EXTRACTED]
  src/components/sections/HorizontalProjectGallery.tsx → src/types/index.ts
- `ProjectDetailModalProps` --references--> `ProjectItem`  [EXTRACTED]
  src/components/sections/ProjectDetailModal.tsx → src/types/index.ts
- `App()` --calls--> `HorizontalProjectGallery()`  [EXTRACTED]
  src/App.tsx → src/components/sections/HorizontalProjectGallery.tsx

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.09
Nodes (27): devDependencies, autoprefixer@^10.4.20, postcss@^8.4.49, tailwindcss@^3.4.15, @types/react@^18.3.12, @types/react-dom@^18.3.1, @types/three@^0.170.0, typescript@~5.6.3 (+19 more)

### Community 1 - "WorkflowSection.tsx"
Cohesion: 0.19
Nodes (15): Lazy3DViewport(), Lazy3DViewportProps, HorizontalProjectGallery(), ProjectEditorialSlide(), ProjectSlideProps, ProjectDetailModal(), ProjectDetailModalProps, PROJECTS (+7 more)

### Community 2 - "App.tsx"
Cohesion: 0.16
Nodes (22): gsap, lucide-react, react, App(), AnimatedCursor(), NAV_ITEMS, Navbar(), NavbarProps (+14 more)

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

### Community 7 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, gsap@^3.12.5, lenis@^1.1.18, lucide-react@^0.460.0, react@^18.3.1, react-dom@^18.3.1, three@^0.170.0, lenis (+1 more)

## Knowledge Gaps
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `package.json`, `WorkflowSection.tsx`, `ContinuousSnakeLine.tsx`, `three`, `dependencies`?**
  _High betweenness centrality (0.208) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09359605911330049 - nodes in this community are weakly interconnected._
- **Why does `puppeteer` connect `puppeteer` to `package.json`?**
  _High betweenness centrality (0.134) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `package.json`, `dependencies`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._