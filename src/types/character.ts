export type ActiveTab = "studio" | "chat" | "lore" | "settings";

export interface LoreEntry {
    id: string;
    keys: string[];
    content: string;
    enabled: boolean;
    order?: number;
    comment?: string;
}

export interface CharacterCard {
    id: string;
    name: string;
    title: string;
    avatarUrl?: string;
    personality: string;
    scenario: string;
    firstMessage: string;
    exampleDialogue?: string;
    systemInstructionOverride?: string;
    creatorNotes?: string;
    lorebook: LoreEntry[];
    updatedAt: string;
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
    tokenCount?: number;
}

export interface UserSettings {
    apiKey: string;
    selectedModel: string;
    temperature: number;
}
