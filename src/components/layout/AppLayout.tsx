// src/components/layout/AppLayout.tsx
import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { ActiveTab, CharacterCard } from "../../types/character";

interface AppLayoutProps {
    characters: CharacterCard[];
    activeCharacterId: string | null;
    activeTab: ActiveTab;
    selectedModel?: string;
    onSelectCharacter: (id: string) => void;
    onCreateNewCharacter: () => void;
    onDeleteCharacter: (id: string) => void;
    onTabChange: (tab: ActiveTab) => void;
    onGoHome?: () => void; // Passed to Header
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    characters,
    activeCharacterId,
    activeTab,
    selectedModel,
    onSelectCharacter,
    onCreateNewCharacter,
    onDeleteCharacter,
    onTabChange,
    onGoHome,
    children,
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const activeCharacter = characters.find((c) => c.id === activeCharacterId) || null;

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0B0C0E] font-sans text-zinc-100 antialiased">
            <Header
                activeCharacter={activeCharacter}
                activeTab={activeTab}
                selectedModel={selectedModel}
                onTabChange={onTabChange}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                onGoHome={onGoHome}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    characters={characters}
                    activeCharacterId={activeCharacterId}
                    onSelectCharacter={onSelectCharacter}
                    onCreateNewCharacter={onCreateNewCharacter}
                    onDeleteCharacter={onDeleteCharacter}
                />

                <main className="flex-1 overflow-y-auto bg-[#0B0C0E]">{children}</main>
            </div>
        </div>
    );
};
