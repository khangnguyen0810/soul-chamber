// src/components/layout/Sidebar.tsx

import React from "react";
import type { CharacterCard } from "../../types/character";

interface SidebarProps {
    isOpen: boolean;
    characters: CharacterCard[];
    activeCharacterId: string | null;
    onSelectCharacter: (id: string) => void;
    onCreateNewCharacter: () => void;
    onDeleteCharacter: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    characters,
    activeCharacterId,
    onSelectCharacter,
    onCreateNewCharacter,
    onDeleteCharacter,
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
                <div className="px-2 py-1.5 font-mono text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
                    Characters ({characters.length})
                </div>

                {characters.length === 0 ? (
                    <div className="p-4 text-center text-xs text-zinc-500">
                        No characters yet. Click above to create one.
                    </div>
                ) : (
                    characters.map((char) => {
                        const isActive = char.id === activeCharacterId;
                        return (
                            <div
                                key={char.id}
                                onClick={() => onSelectCharacter(char.id)}
                                className={`group relative flex w-full cursor-pointer items-center gap-2.5 rounded-lg p-2 transition-colors ${
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
                                        char.name.charAt(0).toUpperCase()
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-xs font-medium text-zinc-200">
                                        {char.name}
                                    </div>
                                    <div className="truncate text-[11px] text-zinc-500">
                                        {char.title || "No description"}
                                    </div>
                                </div>

                                {/* Delete Character Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Delete character "${char.name}"?`)) {
                                            onDeleteCharacter(char.id);
                                        }
                                    }}
                                    className="rounded p-1 text-zinc-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-950/60 hover:text-rose-400"
                                    title="Delete Character"
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
                                            strokeWidth={1.5}
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer Info */}
            <div className="border-t border-white/[0.06] bg-[#0B0C0E] p-3">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                    <span>Prompt Engine v1.0</span>
                    <span className="text-emerald-400">Ready</span>
                </div>
            </div>
        </aside>
    );
};
