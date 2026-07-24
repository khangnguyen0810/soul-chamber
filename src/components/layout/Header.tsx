// src/components/layout/Header.tsx

import React, { useState } from "react";
import type { ActiveTab, CharacterCard } from "../../types/character";

interface HeaderProps {
    activeCharacter: CharacterCard | null;
    activeTab: ActiveTab;
    onTabChange: (tab: ActiveTab) => void;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    selectedModel?: string;
    onGoHome?: () => void; // Callback to return to Landing Page
}

export const Header: React.FC<HeaderProps> = ({
    activeCharacter,
    activeTab,
    onTabChange,
    isSidebarOpen,
    onToggleSidebar,
    selectedModel,
    onGoHome,
}) => {
    const [isNavigatingHome, setIsNavigatingHome] = useState(false);

    const handleHomeClick = () => {
        if (!onGoHome || isNavigatingHome) return;
        setIsNavigatingHome(true);
        setTimeout(() => {
            onGoHome();
            setIsNavigatingHome(false);
        }, 380);
    };

    return (
        <header className="relative flex h-14 items-center justify-between border-b border-white/[0.08] bg-[#0B0C0E] px-4 select-none">
            {/* Top Navigation Progress Indicator Bar */}
            {isNavigatingHome && (
                <div className="fixed top-0 right-0 left-0 z-50 h-[2px] overflow-hidden bg-zinc-900">
                    <div className="h-full animate-boot-progress bg-emerald-400 shadow-[0_0_10px_#10b981]" />
                </div>
            )}

            {/* Left section: Sidebar toggle, Home Logo & Character Info */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
                    title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>

                {onGoHome && (
                    <button
                        onClick={handleHomeClick}
                        disabled={isNavigatingHome}
                        className={`group flex items-center gap-2 rounded px-2 py-1 transition-all ${
                            isNavigatingHome
                                ? "bg-emerald-950/30 opacity-70"
                                : "hover:bg-zinc-800/60"
                        }`}
                        title="Return to Landing Page"
                    >
                        <div
                            className={`flex h-5 w-5 items-center justify-center rounded border font-mono text-[10px] font-bold transition-all ${
                                isNavigatingHome
                                    ? "animate-pulse border-emerald-400 bg-emerald-400 text-zinc-950"
                                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-400"
                            }`}
                        >
                            S
                        </div>
                        <span className="font-mono text-xs text-zinc-300 group-hover:text-zinc-100">
                            {isNavigatingHome ? "Navigating..." : "SoulChamber"}
                        </span>
                    </button>
                )}

                <div className="h-4 w-[1px] bg-white/[0.1]" />

                {activeCharacter ? (
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-800 text-xs font-semibold text-zinc-200">
                            {activeCharacter.avatarUrl ? (
                                <img
                                    src={activeCharacter.avatarUrl}
                                    alt={activeCharacter.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                activeCharacter.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h1 className="text-sm leading-tight font-medium text-zinc-100">
                                {activeCharacter.name}
                            </h1>
                            <p className="mt-0.5 text-[11px] leading-none text-zinc-400">
                                {activeCharacter.title || "Custom Persona"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-zinc-400">No Character Selected</span>
                )}
            </div>

            {/* Middle section: Mode Navigation Tabs */}
            <nav className="flex items-center rounded-lg border border-white/[0.06] bg-[#131518] p-0.5">
                <button
                    onClick={() => onTabChange("studio")}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                        activeTab === "studio"
                            ? "bg-zinc-800 text-zinc-100 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Studio
                </button>
                <button
                    onClick={() => onTabChange("chat")}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                        activeTab === "chat"
                            ? "bg-zinc-800 text-zinc-100 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Chat Engine
                </button>
                <button
                    onClick={() => onTabChange("lore")}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                        activeTab === "lore"
                            ? "bg-zinc-800 text-zinc-100 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Lore Vault
                </button>
            </nav>

            {/* Right section: System Status & Settings Button */}
            <div className="flex items-center gap-3">
                <div
                    className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-2.5 py-1 sm:flex"
                    title={`Active Saved Model: ${selectedModel || "None"}`}
                >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    <span className="max-w-[140px] truncate font-mono text-[11px] text-emerald-300">
                        {selectedModel || "No Model Set"}
                    </span>
                </div>

                <button
                    onClick={() => onTabChange("settings")}
                    className={`rounded-md p-1.5 transition-colors ${
                        activeTab === "settings"
                            ? "bg-zinc-800 text-zinc-100"
                            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
                    }`}
                    title="Engine Settings"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l.546.947c.276.479.16 1.085-.262 1.43l-1.02.833c-.273.223-.393.579-.327.927.027.142.046.286.057.432.027.353.227.659.544.814l1.17.573c.498.244.7.838.461 1.341l-.482.981a1.125 1.125 0 01-1.283.568l-1.272-.34c-.347-.093-.715.003-1.002.247-.087.073-.176.143-.268.21-.308.225-.48.59-.444.972l.142 1.302c.06.547-.33 1.037-.878 1.109l-1.082.143c-.548.072-1.036-.33-1.108-.878l-.142-1.302a1.125 1.125 0 00-.444-.972 11.536 11.536 0 00-.268-.21c-.287-.244-.655-.34-1.002-.247l-1.272.34a1.125 1.125 0 01-1.283-.568l-.482-.981c-.239-.503-.037-1.097.461-1.341l1.17-.573c.317-.155.517-.461.544-.814a11.122 11.122 0 01.057-.432c.066-.348-.054-.704-.327-.927l-1.02-.833a1.125 1.125 0 01-.262-1.43l.546-.947a1.125 1.125 0 011.37-.49l1.217.456c.355.133.751.072 1.076-.124.072-.044.145-.087.219-.127.332-.184.582-.496.645-.87l.213-1.281z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                </button>
            </div>
        </header>
    );
};
