// src/components/landing/LandingPage.tsx

import React, { useState } from "react";
import type { CharacterCard } from "../../types/character";
import { compileSystemInstructions } from "../../utils/promptCompiler";

interface LandingPageProps {
    onLaunchStudio: () => void;
    onSelectSampleCharacter?: (card: CharacterCard) => void;
}

const DEMO_CHARACTER: CharacterCard = {
    id: "demo-card",
    name: "Aethelgard",
    title: "Ancient Knowledge Keeper",
    personality:
        "Stoic, precise, speaks with deliberate cadence and deep arcane vocabulary. Highly protective of ancient manuscripts.",
    scenario:
        "{{user}} breaches the inner archives past midnight. {{char}} turns a page without looking up.",
    firstMessage:
        "State your purpose, traveler. These illuminated manuscripts require complete silence.",
    exampleDialogue:
        '<START>\n{{user}}: I seek lost spellcraft.\n{{char}}: *Closes book with a thud.* "Lost spellcraft is rarely lost without reason."',
    lorebook: [
        {
            id: "lore-demo-1",
            keys: ["obsidian library", "manuscript"],
            content: "Built in the 3rd Arcane Era; holds ward-locked forbidden texts.",
            enabled: true,
            comment: "Obsidian Library History",
        },
    ],
    updatedAt: new Date().toISOString(),
};

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchStudio }) => {
    const [isLaunching, setIsLaunching] = useState(false);
    const [activeTabPreview, setActiveTabPreview] = useState<"compiled" | "lore" | "json">(
        "compiled",
    );

    const compiled = compileSystemInstructions(
        DEMO_CHARACTER,
        "Traveler",
        "tell me about the obsidian library manuscript",
    );

    const handleLaunch = () => {
        if (isLaunching) return;
        setIsLaunching(true);
        setTimeout(() => {
            onLaunchStudio();
            setIsLaunching(false);
        }, 380);
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#0B0C0E] font-sans text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* Top Navigation Progress Indicator Bar */}
            {isLaunching && (
                <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-zinc-900 overflow-hidden">
                    <div className="h-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-boot-progress" />
                </div>
            )}

            {/* Page Content Container */}
            <div className="scale-100 opacity-100 transition-opacity duration-300">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#0B0C0E]/80 px-6 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-bold text-emerald-400">
                            E
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-zinc-100">
                            Eidos Studio
                        </span>
                        <span className="rounded border border-white/5 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                            Spec V2 Engine
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLaunch}
                            disabled={isLaunching}
                            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium text-zinc-950 shadow-sm transition-all ${
                                isLaunching
                                    ? "bg-emerald-400 font-semibold"
                                    : "bg-zinc-100 hover:scale-105 hover:bg-white active:scale-100"
                            } disabled:opacity-90`}
                        >
                            <span>{isLaunching ? "Launching..." : "Launch Studio"}</span>
                            <svg
                                className="h-3.5 w-3.5 text-zinc-950"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="mx-auto max-w-6xl px-6 pt-16 pb-12">
                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                            <span>Zero Code • Client-Side BYOK • Spec v2 Compatible</span>
                        </div>

                        <h1 className="text-3xl leading-[1.15] font-semibold tracking-tight text-zinc-100 md:text-5xl">
                            Architect AI Personas & World Lore Without Code
                        </h1>

                        <p className="max-w-2xl font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
                            Transform character traits, scenario bounds, and lore keyword triggers into optimized system instruction code inside a high-density visual workbench.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                onClick={handleLaunch}
                                disabled={isLaunching}
                                className={`group flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold text-zinc-950 shadow-md transition-all duration-300 ${
                                    isLaunching
                                        ? "bg-emerald-400"
                                        : "bg-zinc-100 hover:scale-105 active:scale-100"
                                } disabled:opacity-90`}
                            >
                                <span>
                                    {isLaunching ? "Opening Studio..." : "Open Persona Studio"}
                                </span>
                                <svg
                                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </button>

                            <a
                                href="#how-it-works"
                                className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
                            >
                                See Interactive Preview
                            </a>
                        </div>
                    </div>
                </section>

                {/* Interactive Compiler Showcase */}
                <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-8">
                    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131518] shadow-2xl">
                        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.08] bg-[#0E1013] px-5 py-3.5 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                <span className="font-mono text-xs font-semibold text-zinc-200">
                                    Live Engine Compiler Preview
                                </span>
                                <span className="hidden font-mono text-[11px] text-zinc-500 sm:inline">
                                    (Trait Input &rarr; System Prompt Code)
                                </span>
                            </div>

                            <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-[#181B20] p-1">
                                <button
                                    onClick={() => setActiveTabPreview("compiled")}
                                    className={`rounded px-3 py-1 font-mono text-xs transition-colors ${
                                        activeTabPreview === "compiled"
                                            ? "bg-zinc-800 font-semibold text-emerald-300"
                                            : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                >
                                    System Prompt Code
                                </button>
                                <button
                                    onClick={() => setActiveTabPreview("lore")}
                                    className={`rounded px-3 py-1 font-mono text-xs transition-colors ${
                                        activeTabPreview === "lore"
                                            ? "bg-zinc-800 font-semibold text-emerald-300"
                                            : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                >
                                    Lorebook Triggering
                                </button>
                                <button
                                    onClick={() => setActiveTabPreview("json")}
                                    className={`rounded px-3 py-1 font-mono text-xs transition-colors ${
                                        activeTabPreview === "json"
                                            ? "bg-zinc-800 font-semibold text-emerald-300"
                                            : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                >
                                    Spec v2 Export
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 divide-y divide-white/[0.08] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
                            {/* Left Column: Visual Input Form */}
                            <div className="space-y-4 bg-[#0E1013]/50 p-5 lg:col-span-5">
                                <div className="font-mono text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                                    1. What You Write in Studio
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div>
                                        <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                            Character Name
                                        </label>
                                        <div className="rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-medium text-zinc-200">
                                            {DEMO_CHARACTER.name} ({DEMO_CHARACTER.title})
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                            Personality Traits
                                        </label>
                                        <div className="rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 text-[11px] leading-relaxed text-zinc-300">
                                            {DEMO_CHARACTER.personality}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                            Trigger Keywords (Lore Vault)
                                        </label>
                                        <div className="rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-mono text-[11px] text-emerald-400">
                                            {DEMO_CHARACTER.lorebook[0].keys.join(", ")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Dynamic Code Inspector */}
                            <div className="flex flex-col justify-between bg-[#0B0C0E] p-5 lg:col-span-7">
                                <div>
                                    <div className="mb-3 flex items-center justify-between border-b border-white/[0.06] pb-2">
                                        <span className="font-mono text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
                                            2. Optimal Code Sent to AI
                                        </span>
                                        <span className="font-mono text-[10px] text-zinc-500">
                                            Est. ~{compiled.estimatedTokens} tokens
                                        </span>
                                    </div>

                                    <pre className="max-h-80 overflow-y-auto rounded-lg border border-white/5 bg-[#131518]/60 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-300 select-text">
                                        {activeTabPreview === "compiled" &&
                                            compiled.systemInstructions}
                                        {activeTabPreview === "lore" &&
                                            `[LORE ENTRY INJECTED]\nKey Matches: "manuscript", "obsidian library"\nContent: ${DEMO_CHARACTER.lorebook[0].content}`}
                                        {activeTabPreview === "json" &&
                                            JSON.stringify(
                                                {
                                                    spec: "chara_card_v2",
                                                    spec_version: "2.0",
                                                    data: {
                                                        name: DEMO_CHARACTER.name,
                                                        description: DEMO_CHARACTER.title,
                                                        personality: DEMO_CHARACTER.personality,
                                                        scenario: DEMO_CHARACTER.scenario,
                                                        first_mes: DEMO_CHARACTER.firstMessage,
                                                    },
                                                },
                                                null,
                                                2,
                                            )}
                                    </pre>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[11px] text-zinc-500">
                                    <span>
                                        Compatible with Claude, GPT-4o, Gemini & Local Ollama
                                    </span>
                                    <button
                                        onClick={handleLaunch}
                                        disabled={isLaunching}
                                        className="font-semibold text-emerald-400 underline underline-offset-4 transition-colors hover:text-emerald-300 disabled:opacity-50"
                                    >
                                        {isLaunching ? "Launching..." : "Test in Studio \u2192"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Capabilities Grid */}
                <section className="mx-auto max-w-6xl px-6 py-12">
                    <div className="border-t border-white/[0.08] pt-10">
                        <h2 className="mb-6 text-xl font-semibold tracking-tight text-zinc-100">
                            Engine Capabilities Built for Persona Authors
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="space-y-2 rounded-xl border border-white/[0.08] bg-[#131518] p-5">
                                <span className="block font-mono text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                                    Visual Studio & Compiler
                                </span>
                                <h3 className="text-sm font-medium text-zinc-100">
                                    Live System Instruction Compiler
                                </h3>
                                <p className="text-xs leading-relaxed text-zinc-400">
                                    Write persona descriptions using natural text and standard
                                    macros like{" "}
                                    <code className="text-emerald-300">{"{{char}}"}</code> and{" "}
                                    <code className="text-emerald-300">{"{{user}}"}</code>. See
                                    exact token estimates in real time.
                                </p>
                            </div>

                            <div className="space-y-2 rounded-xl border border-white/[0.08] bg-[#131518] p-5">
                                <span className="block font-mono text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                                    Memory Subsystem
                                </span>
                                <h3 className="text-sm font-medium text-zinc-100">
                                    Keyword-Triggered Lore Vault
                                </h3>
                                <p className="text-xs leading-relaxed text-zinc-400">
                                    Add world background facts and location rules that inject into
                                    system instructions only when specific keywords are matched in
                                    conversation turns.
                                </p>
                            </div>

                            <div className="space-y-2 rounded-xl border border-white/[0.08] bg-[#131518] p-5">
                                <span className="block font-mono text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                                    Privacy First
                                </span>
                                <h3 className="text-sm font-medium text-zinc-100">
                                    Client-Side BYOK Storage
                                </h3>
                                <p className="text-xs leading-relaxed text-zinc-400">
                                    Your API keys (Anthropic, OpenAI, Gemini, Custom) and character
                                    cards remain 100% strictly in browser local storage. No
                                    middleman tracking servers.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/[0.08] bg-[#0E1013] px-6 py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-xs text-zinc-500 sm:flex-row">
                        <div>Eidos Studio • Client-Side Persona Architecture</div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLaunch}
                                disabled={isLaunching}
                                className="text-zinc-300 transition-colors hover:text-white disabled:opacity-50"
                            >
                                {isLaunching ? "Opening Workbench..." : "Open Workbench"}
                            </button>
                            <span>•</span>
                            <span>Character Spec v2 Standard</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};