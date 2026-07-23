// src/types/character.ts
// src/types/character.ts
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

// src/types/character.ts
export type APIProvider = "anthropic" | "openai" | "gemini" | "deepseek" | "custom";

export interface UserSettings {
    provider: APIProvider;
    apiKey: string;
    baseUrl: string;
    selectedModel: string;
    temperature: number;
    maxTokens: number;
}

/** Standard Character Card V2 JSON Export Spec */
export interface CharacterCardExportSpec {
    spec: "chara_card_v2";
    spec_version: "2.0";
    data: {
        name: string;
        description: string;
        personality: string;
        scenario: string;
        first_mes: string;
        mes_example: string;
        creator_notes?: string;
        system_prompt?: string;
        character_book?: {
            entries: Array<{
                keys: string[];
                content: string;
                enabled: boolean;
                comment?: string;
            }>;
        };
    };
}
