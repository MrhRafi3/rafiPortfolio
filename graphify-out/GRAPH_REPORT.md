# Graph Report - TypoPortfolio  (2026-11-11)

## Corpus Check
- 43 files · ~26,190 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: (none) 10, .glb 6, .css 1)

## Summary
- 191 nodes · 439 edges · 11 communities (7 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `54ad5910`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- WorkflowSection.tsx
- App.tsx
- compilerOptions
- puppeteer
- HorizontalProjectGallery.tsx
- three
- HeroCapsuleCanvas.tsx
- README.md

## God Nodes (most connected - your core abstractions)
1. `react` - 29 edges
2. `App()` - 18 edges
3. `compilerOptions` - 16 edges
4. `three` - 14 edges
5. `create3DViewerController()` - 13 edges
6. `createSoftGroundShadow()` - 13 edges
7. `loadCachedGLB()` - 13 edges
8. `lucide-react` - 12 edges
9. `gsap` - 11 edges
10. `Lazy3DViewport()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `TechnicalDeepDiveSection()` --calls--> `Camera3DCanvas()`  [EXTRACTED]
  src/components/sections/TechnicalDeepDiveSection.tsx → src/components/canvas/Camera3DCanvas.tsx
- `HeroSection()` --calls--> `HeroLaptopCanvas()`  [EXTRACTED]
  src/components/sections/HeroSection.tsx → src/components/canvas/HeroLaptopCanvas.tsx
- `SkillsSection()` --calls--> `KeyboardCanvas()`  [EXTRACTED]
  src/components/sections/SkillsSection.tsx → src/components/canvas/KeyboardCanvas.tsx
- `Interactive3DPhoneSection()` --calls--> `Lazy3DViewport()`  [EXTRACTED]
  src/components/sections/Interactive3DPhoneSection.tsx → src/components/canvas/Lazy3DViewport.tsx
- `Interactive3DPhoneSection()` --calls--> `Phone3DCanvas()`  [EXTRACTED]
  src/components/sections/Interactive3DPhoneSection.tsx → src/components/canvas/Phone3DCanvas.tsx

## Import Cycles
- None detected.

## Communities (11 total, 4 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (40): dependencies, canvas-confetti@^1.9.3, gsap@^3.12.5, lenis@^1.1.18, lucide-react@^0.460.0, react@^18.3.1, react-dom@^18.3.1, three@^0.170.0 (+32 more)

### Community 1 - "WorkflowSection.tsx"
Cohesion: 0.15
Nodes (16): Lazy3DViewport(), Lazy3DViewportProps, Rocket3DCanvas(), Rocket3DCanvasProps, Terminal3DCanvas(), Terminal3DCanvasProps, SkillsSection(), TechnicalDeepDiveSection() (+8 more)

### Community 2 - "App.tsx"
Cohesion: 0.12
Nodes (24): gsap, react, App(), AnimatedCursor(), catmullRomToBezier(), ContinuousSnakeLine(), ContinuousSnakeLineProps, GradientStop (+16 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 4 - "puppeteer"
Cohesion: 0.19
Nodes (5): puppeteer@^25.16.0, puppeteer, outDir, outDir, outDir

### Community 5 - "HorizontalProjectGallery.tsx"
Cohesion: 0.31
Nodes (10): lucide-react, HorizontalProjectGallery(), Interactive3DPhoneSection(), ProjectDetailModal(), ProjectDetailModalProps, ProjectItem, SkillCategory, SkillItem (+2 more)

### Community 6 - "three"
Cohesion: 0.19
Nodes (23): three, Camera3DCanvas(), Camera3DCanvasProps, HeroLaptopCanvas(), HeroLaptopCanvasProps, KeyboardCanvas(), KeyboardCanvasProps, createRoundedScreenGeometry() (+15 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `package.json`, `WorkflowSection.tsx`, `HorizontalProjectGallery.tsx`, `three`, `HeroCapsuleCanvas.tsx`?**
  _High betweenness centrality (0.263) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06387921022067364 - nodes in this community are weakly interconnected._
- **Why does `puppeteer` connect `puppeteer` to `package.json`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `WorkflowSection.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14624505928853754 - nodes in this community are weakly interconnected._
- **Why does `three` connect `three` to `package.json`, `WorkflowSection.tsx`, `HeroCapsuleCanvas.tsx`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12233285917496443 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._