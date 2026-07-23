// src/components/layout/Sidebar.tsx
import React from "react";
import type { CharacterCard } from "../../types/character";

interface SidebarProps {
    isOpen: boolean;
    characters: CharacterCard[];
    activeCharacterId: string | null;
    onSelectCharacter: (id: string) => void;
    onCreateNewCharacter: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    characters,
    activeCharacterId,
    onSelectCharacter,
    onCreateNewCharacter,
}) => {
    if (!isOpen) return null;

    return (
        <aside className="flex w-64 shrink-0 flex-col border-r border-white/[0.08] bg-[#0E1013] select-none">
            {/* Sidebar Header & New Action */}
            <div className="border-b border-white/[0.06] p-3">
                <button
                    onClick={onCreateNewCharacter}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950 shadow-sm transition-colors hover:bg-white"
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
                    New Character
                </button>
            </div>

            {/* Character Roster */}
            <div className="flex-1 space-y-1 overflow-y-auto p-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">
                    Characters ({characters.length})
                </div>

                {characters.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-400">
                        No characters yet. Click above to create one.
                    </div>
                ) : (
                    characters.map((char) => {
                        const isActive = char.id === activeCharacterId;
                        return (
                            <button
                                key={char.id}
                                onClick={() => onSelectCharacter(char.id)}
                                className={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition-colors ${
                                    isActive
                                        ? "border border-white/10 bg-zinc-800/80 text-zinc-100"
                                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                                }`}
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-zinc-800 text-xs font-bold text-zinc-300">
                                    {char.avatarUrl ? (
                                        <img
                                            src={char.avatarUrl}
                                            alt={char.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        char.name.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-xs font-medium text-zinc-200">
                                        {char.name}
                                    </div>
                                    <div className="truncate text-[11px] text-zinc-400">
                                        {char.title || "No description"}
                                    </div>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>

            {/* Footer Info */}
            <div className="border-t border-white/[0.06] bg-[#0B0C0E] p-3">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                    <span>Prompt Engine v1.0</span>
                    <span className="text-emerald-400">Ready</span>
                </div>
            </div>
        </aside>
    );
};
