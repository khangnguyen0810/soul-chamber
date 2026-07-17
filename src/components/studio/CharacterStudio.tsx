import React, { useState } from "react";
import type { CharacterCard } from "../../types/character";
import { PromptInspector } from "./PromptInspector";

interface CharacterStudioProps {
    character: CharacterCard;
    onUpdateCharacter: (updated: CharacterCard) => void;
}

export const CharacterStudio: React.FC<CharacterStudioProps> = ({
    character,
    onUpdateCharacter,
}) => {
    const [activeFormSection, setActiveFormSection] = useState<
        "persona" | "scenario" | "dialogue" | "advanced"
    >("persona");
    const [previewUserName, setPreviewUserName] = useState("Traveler");
    const [showInspectorMobile, setShowInspectorMobile] = useState(false);

    const handleChange = (field: keyof CharacterCard, value: string) => {
        onUpdateCharacter({
            ...character,
            [field]: value,
            updatedAt: new Date().toISOString(),
        });
    };

    const insertMacro = (field: keyof CharacterCard, macro: string) => {
        const currentValue = (character[field] as string) || "";
        handleChange(
            field,
            currentValue + (currentValue.endsWith(" ") || !currentValue ? "" : " ") + macro,
        );
    };

    return (
        <div className="mx-auto flex h-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col space-y-5">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div>
                        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-zinc-100">
                            <span>Persona Studio</span>
                            <span className="rounded-full border border-white/5 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                                Spec V2
                            </span>
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-400">
                            Define the identity, speech parameters, and starting context for{" "}
                            <strong className="text-zinc-200">
                                {character.name || "this persona"}
                            </strong>
                            .
                        </p>
                    </div>

                    <button
                        onClick={() => setShowInspectorMobile(!showInspectorMobile)}
                        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-200 lg:hidden"
                    >
                        <svg
                            className="h-4 w-4 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                            />
                        </svg>
                        <span>{showInspectorMobile ? "Hide Code" : "Inspect Code"}</span>
                    </button>
                </div>

                <div className="flex max-w-full items-center gap-1 self-start overflow-x-auto rounded-lg border border-white/[0.06] bg-[#131518] p-1">
                    <button
                        onClick={() => setActiveFormSection("persona")}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                            activeFormSection === "persona"
                                ? "border border-white/10 bg-zinc-800 text-zinc-100 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Identity & Persona
                    </button>
                    <button
                        onClick={() => setActiveFormSection("scenario")}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                            activeFormSection === "scenario"
                                ? "border border-white/10 bg-zinc-800 text-zinc-100 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Scenario & Greeting
                    </button>
                    <button
                        onClick={() => setActiveFormSection("dialogue")}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                            activeFormSection === "dialogue"
                                ? "border border-white/10 bg-zinc-800 text-zinc-100 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Example Dialogue
                    </button>
                    <button
                        onClick={() => setActiveFormSection("advanced")}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                            activeFormSection === "advanced"
                                ? "border border-white/10 bg-zinc-800 text-zinc-100 shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Raw Prompt Override
                    </button>
                </div>

                <div className="space-y-5 rounded-xl border border-white/[0.08] bg-[#131518] p-5">
                    {activeFormSection === "persona" && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                                        Character Name <span className="text-emerald-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={character.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="e.g. Aethelgard"
                                        className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                                        Role / Short Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={character.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        placeholder="e.g. Keeper of the Arcane Archives"
                                        className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                                    Avatar Image URL{" "}
                                    <span className="font-normal text-zinc-500">(Optional)</span>
                                </label>
                                <input
                                    type="url"
                                    value={character.avatarUrl || ""}
                                    onChange={(e) => handleChange("avatarUrl", e.target.value)}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-mono text-xs text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                />
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="block text-xs font-medium text-zinc-300">
                                        Personality & Behavioral Traits
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-[10px] text-zinc-500">
                                            Insert Macro:
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => insertMacro("personality", "{{char}}")}
                                            className="rounded border border-white/5 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-zinc-700"
                                        >
                                            {"{{char}}"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertMacro("personality", "{{user}}")}
                                            className="rounded border border-white/5 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-zinc-700"
                                        >
                                            {"{{user}}"}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    rows={6}
                                    value={character.personality}
                                    onChange={(e) => handleChange("personality", e.target.value)}
                                    placeholder="Describe personality traits, speech patterns, mindset...&#10;e.g. Speaks in measured, solemn sentences. Never uses slang."
                                    className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-sans text-xs leading-relaxed text-zinc-100 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {activeFormSection === "scenario" && (
                        <div className="space-y-4">
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="block text-xs font-medium text-zinc-300">
                                        Scenario & World Setting
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => insertMacro("scenario", "{{char}}")}
                                            className="rounded border border-white/5 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-zinc-700"
                                        >
                                            {"{{char}}"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertMacro("scenario", "{{user}}")}
                                            className="rounded border border-white/5 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-zinc-700"
                                        >
                                            {"{{user}}"}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    rows={4}
                                    value={character.scenario}
                                    onChange={(e) => handleChange("scenario", e.target.value)}
                                    placeholder="Set the opening scene or environment...&#10;e.g. {{user}} has entered the library past midnight."
                                    className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 text-xs leading-relaxed text-zinc-100 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                />
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="block text-xs font-medium text-zinc-300">
                                        First Message (Opening Greeting)
                                    </label>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => insertMacro("firstMessage", "{{char}}")}
                                            className="rounded border border-white/5 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-zinc-700"
                                        >
                                            {"{{char}}"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertMacro("firstMessage", "{{user}}")}
                                            className="rounded border border-white/5 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400 hover:bg-zinc-700"
                                        >
                                            {"{{user}}"}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    rows={4}
                                    value={character.firstMessage}
                                    onChange={(e) => handleChange("firstMessage", e.target.value)}
                                    placeholder="Write the exact opening message {{char}} sends when starting a new chat..."
                                    className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 text-xs leading-relaxed text-zinc-100 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {activeFormSection === "dialogue" && (
                        <div className="space-y-4">
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="block text-xs font-medium text-zinc-300">
                                        Example Dialogue & Speech Examples
                                    </label>
                                    <span className="font-mono text-[10px] text-zinc-500">
                                        Format: &lt;START&gt; or User / Char turns
                                    </span>
                                </div>
                                <textarea
                                    rows={8}
                                    value={character.exampleDialogue || ""}
                                    onChange={(e) =>
                                        handleChange("exampleDialogue", e.target.value)
                                    }
                                    placeholder={`<START>\n{{user}}: Can you teach me magic?\n{{char}}: *Aethelgard scoffs lightly.* "Magic is not taught like arithmetic."`}
                                    className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-mono text-xs leading-relaxed text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {activeFormSection === "advanced" && (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-amber-500/20 bg-amber-950/30 p-3 text-xs leading-normal text-amber-200/90">
                                <span className="font-semibold text-amber-400">
                                    Power User Mode:
                                </span>{" "}
                                Text entered here replaces the compiled system instructions
                                entirely.
                            </div>
                            <div>
                                <textarea
                                    rows={8}
                                    value={character.systemInstructionOverride || ""}
                                    onChange={(e) =>
                                        handleChange("systemInstructionOverride", e.target.value)
                                    }
                                    placeholder="Optional custom raw system prompt..."
                                    className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-mono text-xs leading-relaxed text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div
                className={`shrink-0 lg:w-96 ${showInspectorMobile ? "block" : "hidden lg:block"}`}
            >
                <div className="sticky top-6 h-[calc(100vh-6rem)]">
                    <PromptInspector
                        character={character}
                        previewUserName={previewUserName}
                        onUserNameChange={setPreviewUserName}
                    />
                </div>
            </div>
        </div>
    );
};
