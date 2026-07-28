# Eidos Studio — AI Persona Architecture Workbench

> **Eidos** *(Greek εἶδος)*: "Essential Form" or "Archetype".

**Eidos Studio** is a technical, client-side visual workbench designed for authoring AI character personas, scenario boundaries, and keyword-triggered lorebooks without writing raw prompt code. 

Behind the scenes, Eidos Studio compiles human descriptions, dialogue examples, and active world info into token-optimized system instructions, presenting a clean roleplay interface comparable to Claude Workbench, OpenAI Playground, and SillyTavern.

---

## Technical Highlights & Architectural Patterns

> **[Client-Side BYOK Architecture]** — Operates entirely in browser memory (`localStorage`). API keys (Anthropic, OpenAI, Gemini, Local Ollama) and character roster cards never pass through an intermediate backend proxy. *(look up: Browser Storage Security Primitives)*

> **[Pure-Function Prompt Compiler]** — Separates prompt compilation, character macro resolution (`{{char}}`, `{{user}}`), and token context budgeting (~4 chars/token) into deterministic pure functions in `src/utils/promptCompiler.ts`. *(look up: Pure Functions in State Compilation)*

> **[Universal Provider Adapter]** — Normalizes differences across provider API schemas (Anthropic system message blocks vs. OpenAI / Gemini `chat/completions` array interfaces) inside `src/utils/aiService.ts`. *(look up: Adapter Pattern in API Integration)*

---

## Key Features

### 1. Persona Studio & Live System Prompt Inspector
* **Visual Trait Authoring**: Inputs for identity tags, personality traits, scenario bounds, opening greetings, and dialogue examples.
* **Macro Insertion**: Quick-insert handles for standard `{{char}}` and `{{user}}` macros.
* **Real-time Code Inspector**: Side-by-side split drawer previewing the compiled markdown system prompt, token context budget gauges, and 1-click clipboard export.

### 2. Lore Vault & World Info Engine
* **Keyword-Triggered Context Injection**: Define world background facts and location rules that inject into system prompts only when active keywords match incoming conversation turns.
* **Trigger Sandbox Simulator**: Real-time testing bar to evaluate keyword detection and calculate exact token capacity overhead before sending API requests.

### 3. Roleplay Chat Engine
* **Atmospheric Backdrop**: Ambient visual glow generated from the active character's avatar artwork (`blur-[100px] opacity-15`).
* **Enclosed Message Headers**: High-contrast sender badges (`User` / `Character Name`) nested inside speech bubbles to guarantee readability over dark background tones.
* **Roleplay Markdown Parser**: Zero-dependency inline formatting that automatically converts action text (`*asterisks*`) into soft italics and spoken dialogue into crisp primary text.

### 4. Engine Credentials & Spec V2 Card Exporter
* **Multi-Provider BYOK Integration**: Native client REST dispatch for Anthropic (Claude 3.5 Sonnet), OpenAI (GPT-4o), Google Gemini, and custom local endpoints (Ollama, LM Studio).
* **Character Card Spec V2**: Full JSON export and import compatibility with standard character card formats (SillyTavern, JanitorAI).
* **Full Roster Backup & Restore**: 1-click JSON snapshot exports for your entire workspace character roster and conversation logs.

---

## Tech Stack

* **Framework**: React 18+ (Vite)
* **Language**: TypeScript (Strict Typings)
* **Styling**: Tailwind CSS v4 (Custom `@theme` keyframes & design system)
* **Icons**: Hand-crafted Inline SVG Iconography
* **Persistence**: Web Storage (`localStorage`)

---

## Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **pnpm**

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/eidos-studio.git](https://github.com/your-username/eidos-studio.git)
   cd eidos-studio

```

2. Install dependencies:
```bash
npm install

```


3. Launch the development server:
```bash
npm run dev

```


4. Build for production:
```bash
npm run build

```



---

## Repository Structure

```
├── public
│   ├── favicon.svg          # Custom SVG Brand Monogram Badge
│   └── icons.svg
├── src
│   ├── components
│   │   ├── chat             # Roleplay timeline & inline markdown formatter
│   │   │   ├── ChatEngine.tsx
│   │   │   └── FormattedMessageContent.tsx
│   │   ├── landing          # Technical landing page & live compiler showcase
│   │   │   └── LandingPage.tsx
│   │   ├── layout           # App Shell, Header bar, Sidebar roster
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── lore             # Lore Vault keyword trigger matrix
│   │   │   └── LoreVault.tsx
│   │   ├── settings         # API credentials manager & Character Spec v2 exporter
│   │   │   └── SettingsManager.tsx
│   │   └── studio           # Persona editor & live prompt inspector drawer
│   │       ├── CharacterStudio.tsx
│   │       └── PromptInspector.tsx
│   ├── types
│   │   └── character.ts     # CharacterCard, LoreEntry & Spec v2 Interfaces
│   ├── utils
│   │   ├── aiService.ts     # Client REST provider dispatch (Anthropic/OpenAI/Gemini)
│   │   └── promptCompiler.ts # Macro resolution, lore injection & token estimation
│   ├── App.tsx              # Root orchestrator & localStorage persistence
│   ├── index.css            # Tailwind v4 theme keyframe definitions
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts

```

---

## Character Spec V2 Compatibility

Cards exported from Eidos Studio conform to the standard **Character Card Spec V2** JSON format:

```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    "name": "Aethelgard",
    "description": "Ancient Knowledge Keeper",
    "personality": "Stoic, precise, speaks with deliberate cadence...",
    "scenario": "{{user}} breaches the inner archives...",
    "first_mes": "State your purpose, traveler.",
    "mes_example": "<START>\n{{user}}: I seek lost spellcraft...",
    "character_book": {
      "entries": [
        {
          "keys": ["obsidian library", "manuscript"],
          "content": "Built in the 3rd Arcane Era...",
          "enabled": true,
          "comment": "Obsidian Library History"
        }
      ]
    }
  }
}

```

---

Eidos Studio is open-source, local-first software. Your API keys, persona templates, and chat histories remain strictly stored inside your own browser session.
