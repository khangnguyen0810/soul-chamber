// src/components/lore/LoreVault.tsx
import React, { useState } from "react";
import type { CharacterCard, LoreEntry } from "../../types/character";
import { estimateTokens, getTriggeredLoreEntries } from "../../utils/promptCompiler";

interface LoreVaultProps {
    character: CharacterCard;
    onUpdateCharacter: (updated: CharacterCard) => void;
}

export const LoreVault: React.FC<LoreVaultProps> = ({ character, onUpdateCharacter }) => {
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [testQuery, setTestQuery] = useState("");
    const [rawKeyInputs, setRawKeyInputs] = useState<Record<string, string>>({});

    const lorebook = character.lorebook || [];

    const handleAddEntry = () => {
        const newEntry: LoreEntry = {
            id: `lore-${Date.now()}`,
            keys: ["keyword"],
            content: "",
            enabled: true,
            comment: "New Lore Block",
        };
        const updatedBook = [newEntry, ...lorebook];
        onUpdateCharacter({
            ...character,
            lorebook: updatedBook,
            updatedAt: new Date().toISOString(),
        });
        setEditingEntryId(newEntry.id);
        setRawKeyInputs((prev) => ({ ...prev, [newEntry.id]: "keyword" }));
    };

    const handleToggleEntry = (id: string) => {
        const updatedBook = lorebook.map((entry) =>
            entry.id === id ? { ...entry, enabled: !entry.enabled } : entry,
        );
        onUpdateCharacter({
            ...character,
            lorebook: updatedBook,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleDeleteEntry = (id: string) => {
        const updatedBook = lorebook.filter((entry) => entry.id !== id);
        onUpdateCharacter({
            ...character,
            lorebook: updatedBook,
            updatedAt: new Date().toISOString(),
        });
        if (editingEntryId === id) setEditingEntryId(null);
    };

    const handleUpdateEntry = (id: string, updates: Partial<LoreEntry>) => {
        const updatedBook = lorebook.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry,
        );
        onUpdateCharacter({
            ...character,
            lorebook: updatedBook,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleKeysBlur = (id: string, entry: LoreEntry) => {
        const raw = rawKeyInputs[id] ?? entry.keys.join(", ");
        const keysArray = raw
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0);
        handleUpdateEntry(id, { keys: keysArray });
    };

    // Active trigger testing simulation
    const triggeredEntries = testQuery.trim() ? getTriggeredLoreEntries(lorebook, testQuery) : [];
    const triggeredIds = new Set(triggeredEntries.map((e) => e.id));

    const totalLoreTokens = lorebook
        .filter((e) => e.enabled)
        .reduce((acc, curr) => acc + estimateTokens(curr.content), 0);

    return (
        <div className="mx-auto flex h-full max-w-6xl flex-col space-y-6 p-4 md:p-6">
            {/* Header Bar */}
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                            Lore Vault & World Info
                        </h2>
                        <span className="rounded border border-white/5 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                            {lorebook.length} Entries
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                        Dynamic world entries for{" "}
                        <strong className="text-zinc-200">{character.name}</strong> injected into
                        system context when trigger keywords match dialogue turns.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                        <span className="block font-mono text-[10px] text-zinc-500">
                            Total Active Capacity
                        </span>
                        <span className="font-mono text-xs font-semibold text-emerald-400">
                            ~{totalLoreTokens} tokens
                        </span>
                    </div>
                    <button
                        onClick={handleAddEntry}
                        className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3.5 py-2 text-xs font-medium text-zinc-950 shadow-sm transition-colors hover:bg-white"
                    >
                        <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                        <span>Add Lore Entry</span>
                    </button>
                </div>
            </div>

            {/* Trigger Sandbox Simulator */}
            <div className="space-y-3 rounded-xl border border-white/[0.08] bg-[#131518] p-4">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-mono text-xs font-medium text-zinc-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span>Keyword Trigger Sandbox Simulator</span>
                    </label>
                    {testQuery.trim() && (
                        <span className="font-mono text-[11px] text-emerald-300">
                            {triggeredEntries.length} / {lorebook.length} entries activated
                        </span>
                    )}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={testQuery}
                        onChange={(e) => setTestQuery(e.target.value)}
                        placeholder="Type a sample sentence to test keyword detection (e.g. 'Tell me about the Obsidian Manuscripts')..."
                        className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3.5 py-2.5 pr-8 font-mono text-xs text-zinc-100 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                    />
                    {testQuery && (
                        <button
                            onClick={() => setTestQuery("")}
                            className="absolute top-2.5 right-2.5 font-mono text-xs text-zinc-500 hover:text-zinc-300"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Lore Entries List */}
            <div className="flex-1 space-y-4">
                {lorebook.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-[#131518]/30 p-12 text-center">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-400">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25"
                                />
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium text-zinc-200">Lore Vault is empty</h3>
                        <p className="mx-auto mt-1 mb-4 max-w-sm text-xs text-zinc-400">
                            Create world entries with target keywords to conditionally inject
                            context into AI responses.
                        </p>
                        <button
                            onClick={handleAddEntry}
                            className="rounded-md border border-white/10 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
                        >
                            Create First Entry
                        </button>
                    </div>
                ) : (
                    lorebook.map((entry) => {
                        const isEditing = editingEntryId === entry.id;
                        const isTriggered = testQuery.trim() && triggeredIds.has(entry.id);
                        const tokenCount = estimateTokens(entry.content);

                        return (
                            <div
                                key={entry.id}
                                className={`rounded-xl border bg-[#131518] transition-all ${
                                    isTriggered
                                        ? "border-emerald-500/60 bg-emerald-950/10 ring-1 ring-emerald-500/20"
                                        : entry.enabled
                                          ? "border-white/[0.08]"
                                          : "border-white/[0.04] opacity-60"
                                }`}
                            >
                                {/* Entry Header */}
                                <div className="flex items-center justify-between rounded-t-xl border-b border-white/[0.06] bg-[#0E1013]/60 p-3.5 select-none">
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <button
                                            onClick={() => handleToggleEntry(entry.id)}
                                            className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                                entry.enabled
                                                    ? "border-emerald-400 bg-emerald-500 text-zinc-950"
                                                    : "border-white/10 bg-zinc-800 text-transparent"
                                            }`}
                                            title={
                                                entry.enabled ? "Entry Enabled" : "Entry Disabled"
                                            }
                                        >
                                            <svg
                                                className="h-3 w-3 stroke-[3]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4.5 12.75l6 6 9-13.5"
                                                />
                                            </svg>
                                        </button>

                                        <input
                                            type="text"
                                            value={entry.comment || ""}
                                            onChange={(e) =>
                                                handleUpdateEntry(entry.id, {
                                                    comment: e.target.value,
                                                })
                                            }
                                            placeholder="Title or Tag..."
                                            className="min-w-0 truncate rounded border border-transparent bg-transparent px-1.5 py-0.5 text-xs font-medium text-zinc-200 focus:border-white/10 focus:bg-zinc-900/60 focus:outline-none"
                                        />

                                        {isTriggered && (
                                            <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                                                MATCHED TRIGGER
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 items-center gap-3">
                                        <span className="hidden font-mono text-[10px] text-zinc-500 sm:inline">
                                            ~{tokenCount} tokens
                                        </span>

                                        <button
                                            onClick={() =>
                                                setEditingEntryId(isEditing ? null : entry.id)
                                            }
                                            className="p-1 text-zinc-400 transition-colors hover:text-zinc-200"
                                            title={isEditing ? "Collapse Entry" : "Expand Entry"}
                                        >
                                            <svg
                                                className={`h-4 w-4 transition-transform ${isEditing ? "rotate-180" : ""}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                                />
                                            </svg>
                                        </button>

                                        <button
                                            onClick={() => handleDeleteEntry(entry.id)}
                                            className="p-1 text-zinc-500 transition-colors hover:text-rose-400"
                                            title="Delete Entry"
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Entry Body */}
                                <div className="space-y-3 p-4">
                                    <div>
                                        <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                            Trigger Keywords{" "}
                                            <span className="font-sans text-zinc-500">
                                                (comma separated)
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={rawKeyInputs[entry.id] ?? entry.keys.join(", ")}
                                            onChange={(e) =>
                                                setRawKeyInputs((prev) => ({
                                                    ...prev,
                                                    [entry.id]: e.target.value,
                                                }))
                                            }
                                            onBlur={() => handleKeysBlur(entry.id, entry)}
                                            placeholder="e.g. manuscript, ancient library, obsidian archive"
                                            className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-1.5 font-mono text-xs text-emerald-300 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                        />
                                        <div className="mt-1.5 flex flex-wrap gap-1">
                                            {entry.keys.map((key, kIdx) => (
                                                <span
                                                    key={kIdx}
                                                    className="rounded border border-white/5 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300"
                                                >
                                                    {key}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block font-mono text-[11px] text-zinc-400">
                                            Lore Content / World Knowledge
                                        </label>
                                        <textarea
                                            rows={isEditing ? 5 : 2}
                                            value={entry.content}
                                            onChange={(e) =>
                                                handleUpdateEntry(entry.id, {
                                                    content: e.target.value,
                                                })
                                            }
                                            placeholder="Describe the background fact, rule, or backstory to inject into system context when triggers match..."
                                            className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-sans text-xs leading-relaxed text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/60 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
