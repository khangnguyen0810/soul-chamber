import { useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { CharacterStudio } from "./components/studio/CharacterStudio";
import type { ActiveTab, CharacterCard } from "./types/character";

// Default initial character for quick setup
const INITIAL_CHARACTERS: CharacterCard[] = [
    {
        id: "char-1",
        name: "Aethelgard",
        title: "Ancient Knowledge Keeper",
        personality: "Stoic, precise, speaks with deliberate cadence and deep arcane vocabulary.",
        scenario: "You meet Aethelgard in the Obsidian Archives at midnight.",
        firstMessage:
            "State your purpose traveler. These illuminated manuscripts require complete silence.",
        lorebook: [],
        updatedAt: new Date().toISOString(),
    },
];

export function App() {
    const [characters, setCharacters] = useState<CharacterCard[]>(INITIAL_CHARACTERS);
    const [activeCharacterId, setActiveCharacterId] = useState<string | null>("char-1");
    const [activeTab, setActiveTab] = useState<ActiveTab>("studio");

    const handleCreateNewCharacter = () => {
        const newChar: CharacterCard = {
            id: `char-${Date.now()}`,
            name: "Unnamed Character",
            title: "Draft Persona",
            personality: "",
            scenario: "",
            firstMessage: "",
            lorebook: [],
            updatedAt: new Date().toISOString(),
        };
        setCharacters((prev) => [newChar, ...prev]);
        setActiveCharacterId(newChar.id);
        setActiveTab("studio");
    };

    const handleUpdateCharacter = (updated: CharacterCard) => {
        setCharacters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    };

    const activeCharacter = characters.find((c) => c.id === activeCharacterId);

    return (
        <AppLayout
            characters={characters}
            activeCharacterId={activeCharacterId}
            activeTab={activeTab}
            onSelectCharacter={setActiveCharacterId}
            onCreateNewCharacter={handleCreateNewCharacter}
            onTabChange={setActiveTab}
        >
            {activeTab === "studio" && activeCharacter && (
                <CharacterStudio
                    character={activeCharacter}
                    onUpdateCharacter={handleUpdateCharacter}
                />
            )}

            {activeTab === "chat" && (
                <div className="mx-auto max-w-4xl p-8 text-center">
                    <div className="rounded-xl border border-white/[0.08] bg-[#131518] p-10">
                        <p className="mb-2 font-mono text-xs text-emerald-400">Up Next</p>
                        <h3 className="text-base font-semibold text-zinc-100">
                            Interactive Chat Engine
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-xs text-zinc-400">
                            Feature 3 will introduce the conversation interface with live AI prompt
                            streaming, token meters, and turn controls for {activeCharacter?.name}.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "lore" && (
                <div className="mx-auto max-w-4xl p-8 text-center">
                    <div className="rounded-xl border border-white/[0.08] bg-[#131518] p-10">
                        <p className="mb-2 font-mono text-xs text-emerald-400">Lore Vault</p>
                        <h3 className="text-base font-semibold text-zinc-100">
                            World Info & Keyword Triggers
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-xs text-zinc-400">
                            Lorebook keyword matching and recursive entries will be configured here.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="mx-auto max-w-4xl p-8 text-center">
                    <div className="rounded-xl border border-white/[0.08] bg-[#131518] p-10">
                        <p className="mb-2 font-mono text-xs text-emerald-400">Engine Settings</p>
                        <h3 className="text-base font-semibold text-zinc-100">
                            API Key & Model Selection
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-xs text-zinc-400">
                            Configure OpenAI, Anthropic, or custom endpoint API keys safely in
                            browser local storage.
                        </p>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

export default App;
