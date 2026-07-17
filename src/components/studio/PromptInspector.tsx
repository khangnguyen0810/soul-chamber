import React, { useState } from "react";
import type { CharacterCard } from "../../types/character";
import { compileSystemInstructions } from "../../utils/promptCompiler";

interface PromptInspectorProps {
    character: CharacterCard;
    previewUserName: string;
    onUserNameChange: (name: string) => void;
}

export const PromptInspector: React.FC<PromptInspectorProps> = ({
    character,
    previewUserName,
    onUserNameChange,
}) => {
    const [copied, setCopied] = useState(false);
    const compiled = compileSystemInstructions(character, previewUserName);

    const handleCopy = () => {
        navigator.clipboard.writeText(compiled.systemInstructions);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const TOKEN_BUDGET = 2048;
    const usagePercentage = Math.min(
        Math.round((compiled.estimatedTokens / TOKEN_BUDGET) * 100),
        100,
    );

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0E1013] select-none">
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#131518] px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <h3 className="font-mono text-xs font-semibold tracking-wider text-zinc-200 uppercase">
                        System Prompt Inspector
                    </h3>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded border border-white/10 bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
                >
                    {copied ? (
                        <>
                            <svg
                                className="h-3.5 w-3.5 text-emerald-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="text-emerald-300">Copied</span>
                        </>
                    ) : (
                        <>
                            <svg
                                className="h-3.5 w-3.5 text-zinc-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M15.75 17.25v2.25A2.25 2.25 0 0113.5 21.75h-7.5A2.25 2.25 0 013.75 19.5v-7.5A2.25 2.25 0 016 9.75h2.25m4.5 0h7.5a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-7.5a2.25 2.25 0 012.25-2.25z"
                                />
                            </svg>
                            <span>Copy Code</span>
                        </>
                    )}
                </button>
            </div>

            <div className="space-y-3 border-b border-white/[0.06] bg-[#0B0C0E] p-3.5">
                <div>
                    <div className="mb-1 flex justify-between font-mono text-[11px] text-zinc-400">
                        <span>Context Budget</span>
                        <span
                            className={
                                compiled.estimatedTokens > TOKEN_BUDGET
                                    ? "font-bold text-amber-400"
                                    : "text-zinc-300"
                            }
                        >
                            ~{compiled.estimatedTokens} / {TOKEN_BUDGET} tokens
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                            className={`h-full transition-all duration-300 ${
                                compiled.estimatedTokens > TOKEN_BUDGET
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                            }`}
                            style={{ width: `${usagePercentage}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                    <label className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                        <span>Test Macro</span>
                        <code className="rounded border border-white/5 bg-zinc-900 px-1 py-0.5 text-[10px] text-emerald-400">
                            {"{{user}}"}
                        </code>
                    </label>
                    <input
                        type="text"
                        value={previewUserName}
                        onChange={(e) => onUserNameChange(e.target.value)}
                        placeholder="User"
                        className="w-28 rounded border border-white/10 bg-zinc-900 px-2 py-0.5 font-mono text-xs text-zinc-200 focus:border-emerald-500/50 focus:outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0E1013] px-3.5 py-2 font-mono text-[10px] text-zinc-400">
                <span className="truncate">Persona: {compiled.breakdown.personalityTokens}t</span>
                <span className="truncate">Scenario: {compiled.breakdown.scenarioTokens}t</span>
                <span className="truncate">Examples: {compiled.breakdown.examplesTokens}t</span>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#0B0C0E]/90 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-300 select-text">
                {compiled.systemInstructions ? (
                    compiled.systemInstructions
                ) : (
                    <span className="text-zinc-600 italic">
                        // Start writing character traits or persona details on the left to see
                        compiled system instructions here in real time...
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#131518] p-2.5 font-mono text-[10px] text-zinc-500">
                <span>Format: Markdown System Prompt</span>
                <span>
                    Macro {"{{char}}"} &rarr; {character.name || "Assistant"}
                </span>
            </div>
        </div>
    );
};
