// src/App.tsx

import { useState, useEffect } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { CharacterStudio } from "./components/studio/CharacterStudio";
import { ChatEngine } from "./components/chat/ChatEngine";
import { LoreVault } from "./components/lore/LoreVault";
import { SettingsManager } from "./components/settings/SettingsManager";
import type { ActiveTab, CharacterCard, ChatMessage, UserSettings } from "./types/character";

const INITIAL_CHARACTERS: CharacterCard[] = [
    {
        id: "char-1",
        name: "Aethelgard",
        title: "Ancient Knowledge Keeper",
        personality:
            "Stoic, precise, speaks with deliberate cadence and deep arcane vocabulary. Highly protective of ancient manuscripts and skeptical of uninvited visitors.",
        scenario:
            "{{user}} has breached the inner chamber of the Obsidian Library past midnight. {{char}} stands near the desk, turning a page without looking up.",
        firstMessage:
            "State your purpose, traveler. These illuminated manuscripts require complete silence.",
        exampleDialogue: `<START>\n{{user}}: I am searching for lost spellcraft.\n{{char}}: *Aethelgard closes the heavy leather book with a dull thud, gazing over his spectacles.* "Lost spellcraft is rarely lost without good reason. What makes you think you possess the discipline to hold it?"`,
        lorebook: [
            {
                id: "lore-1",
                keys: ["obsidian library", "manuscript", "archive"],
                content:
                    "The Obsidian Library was built in the 3rd Arcane Era and holds forbidden texts locked behind warding runes.",
                enabled: true,
                comment: "Obsidian Library History",
            },
            {
                id: "lore-2",
                keys: ["spellcraft", "magic", "rune"],
                content:
                    "Magic in this realm requires raw somatic focus and precise vocal cadence. Careless spellcasters risk feedback curses.",
                enabled: true,
                comment: "Arcane System Laws",
            },
        ],
        updatedAt: new Date().toISOString(),
    },
];

const DEFAULT_SETTINGS: UserSettings = {
    provider: "anthropic",
    apiKey: "",
    baseUrl: "https://api.anthropic.com/v1",
    selectedModel: "claude-3-5-sonnet-20241022",
    temperature: 0.7,
    maxTokens: 1024,
};

export function App() {
    // Load initial settings and characters from browser localStorage safely
    const [settings, setSettings] = useState<UserSettings>(() => {
        try {
            const saved = localStorage.getItem("soul_chamber_settings");
            return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        } catch {
            return DEFAULT_SETTINGS;
        }
    });

    const [characters, setCharacters] = useState<CharacterCard[]>(() => {
        try {
            const saved = localStorage.getItem("soul_chamber_characters");
            return saved ? JSON.parse(saved) : INITIAL_CHARACTERS;
        } catch {
            return INITIAL_CHARACTERS;
        }
    });

    const [activeCharacterId, setActiveCharacterId] = useState<string | null>("char-1");
    const [activeTab, setActiveTab] = useState<ActiveTab>("studio");

    const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
        "char-1": [
            {
                id: "msg-init-1",
                role: "assistant",
                content:
                    "State your purpose, traveler. These illuminated manuscripts require complete silence.",
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ],
    });

    // Sync settings and characters to LocalStorage on updates
    useEffect(() => {
        localStorage.setItem("soul_chamber_settings", JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem("soul_chamber_characters", JSON.stringify(characters));
    }, [characters]);

    const handleCreateNewCharacter = () => {
        const newId = `char-${Date.now()}`;
        const newChar: CharacterCard = {
            id: newId,
            name: "New Persona",
            title: "Custom Role",
            personality: "",
            scenario: "",
            firstMessage: "Greetings. I am ready to converse.",
            lorebook: [],
            updatedAt: new Date().toISOString(),
        };

        setCharacters((prev) => [newChar, ...prev]);
        setChatHistories((prev) => ({
            ...prev,
            [newId]: [
                {
                    id: `msg-init-${Date.now()}`,
                    role: "assistant",
                    content: newChar.firstMessage,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ],
        }));
        setActiveCharacterId(newId);
        setActiveTab("studio");
    };

    const handleUpdateCharacter = (updated: CharacterCard) => {
        setCharacters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    };

    const handleImportCharacter = (imported: CharacterCard) => {
        setCharacters((prev) => [imported, ...prev]);
        setChatHistories((prev) => ({
            ...prev,
            [imported.id]: [
                {
                    id: `msg-init-${Date.now()}`,
                    role: "assistant",
                    content: imported.firstMessage || "Greetings.",
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ],
        }));
        setActiveCharacterId(imported.id);
        setActiveTab("studio");
    };

    const handleImportRosterBackup = (importedList: CharacterCard[]) => {
        setCharacters(importedList);
        if (importedList.length > 0) {
            setActiveCharacterId(importedList[0].id);
        }
    };

    const handleSendMessage = (characterId: string, content: string) => {
        const timestampStr = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        const userMessage: ChatMessage = {
            id: `msg-user-${Date.now()}`,
            role: "user",
            content,
            timestamp: timestampStr,
        };

        setChatHistories((prev) => ({
            ...prev,
            [characterId]: [...(prev[characterId] || []), userMessage],
        }));

        setTimeout(() => {
            const activeChar = characters.find((c) => c.id === characterId);
            const assistantMessage: ChatMessage = {
                id: `msg-asst-${Date.now()}`,
                role: "assistant",
                content: `*${activeChar?.name || "Character"} processes your turn statement.* "I acknowledge your query: '${content}'. Operating using model '${settings.selectedModel}' (temp: ${settings.temperature})."`,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setChatHistories((prev) => ({
                ...prev,
                [characterId]: [...(prev[characterId] || []), assistantMessage],
            }));
        }, 750);
    };

    const handleClearHistory = (characterId: string) => {
        const activeChar = characters.find((c) => c.id === characterId);
        setChatHistories((prev) => ({
            ...prev,
            [characterId]: [
                {
                    id: `msg-init-${Date.now()}`,
                    role: "assistant",
                    content: activeChar?.firstMessage || "Greetings.",
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ],
        }));
    };

    const handleRegenerateLastTurn = (characterId: string) => {
        setChatHistories((prev) => {
            const currentHistory = prev[characterId] || [];
            if (currentHistory.length <= 1) return prev;

            const slicedHistory = currentHistory.slice(0, -1);
            return {
                ...prev,
                [characterId]: slicedHistory,
            };
        });

        setTimeout(() => {
            setChatHistories((prev) => {
                const history = prev[characterId] || [];
                const lastUserTurn = history[history.length - 1];
                const activeChar = characters.find((c) => c.id === characterId);

                const assistantMessage: ChatMessage = {
                    id: `msg-asst-${Date.now()}`,
                    role: "assistant",
                    content: `*${activeChar?.name || "Character"} re-evaluates the prompt context.* "Regenerated response: I processed your query '${lastUserTurn?.content || ""}' using a refreshed response token seed."`,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                };

                return {
                    ...prev,
                    [characterId]: [...history, assistantMessage],
                };
            });
        }, 600);
    };

    const activeCharacter = characters.find((c) => c.id === activeCharacterId) || null;
    const currentMessages = activeCharacterId ? chatHistories[activeCharacterId] || [] : [];

    return (
        <AppLayout
            characters={characters}
            activeCharacterId={activeCharacterId}
            activeTab={activeTab}
            selectedModel={settings.selectedModel} // Pass active saved model to layout -> header
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

            {activeTab === "chat" && activeCharacter && (
                <ChatEngine
                    character={activeCharacter}
                    messages={currentMessages}
                    onSendMessage={(content) => handleSendMessage(activeCharacter.id, content)}
                    onClearHistory={() => handleClearHistory(activeCharacter.id)}
                    onRegenerateLastTurn={() => handleRegenerateLastTurn(activeCharacter.id)}
                />
            )}

            {activeTab === "lore" && activeCharacter && (
                <LoreVault character={activeCharacter} onUpdateCharacter={handleUpdateCharacter} />
            )}

            {activeTab === "settings" && (
                <SettingsManager
                    settings={settings}
                    onUpdateSettings={setSettings}
                    characters={characters}
                    activeCharacter={activeCharacter}
                    onImportCharacter={handleImportCharacter}
                    onImportRosterBackup={handleImportRosterBackup}
                />
            )}
        </AppLayout>
    );
}

export default App;
