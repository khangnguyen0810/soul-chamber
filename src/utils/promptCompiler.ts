import type { CharacterCard, LoreEntry } from "../types/character";

export interface CompiledPrompt {
    systemInstructions: string;
    charMacro: string;
    userMacro: string;
    estimatedTokens: number;
    activeLoreEntriesCount: number;
    breakdown: {
        coreIdentityTokens: number;
        personalityTokens: number;
        scenarioTokens: number;
        examplesTokens: number;
        loreTokens: number;
        overrideTokens: number;
    };
}

/**
 * Replaces standard AI character macros like {{char}} and {{user}}
 */
export function processMacros(text: string, charName: string, userName: string = "User"): string {
    if (!text) return "";
    return text
        .replace(/\{\{char\}\}/gi, charName || "Assistant")
        .replace(/\{\{user\}\}/gi, userName);
}

/**
 * Roughly estimates token count (approx 4 characters per token)
 */
export function estimateTokens(text: string): number {
    if (!text) return 0;
    const trimmed = text.trim();
    if (trimmed.length === 0) return 0;
    return Math.ceil(trimmed.length / 4);
}

/**
 * Evaluates which lore entries are triggered based on active chat text / prompt context
 */
export function getTriggeredLoreEntries(lorebook: LoreEntry[], queryText: string): LoreEntry[] {
    if (!queryText || !lorebook) return [];
    const normalizedQuery = queryText.toLowerCase();

    return lorebook.filter((entry) => {
        if (!entry.enabled || !entry.keys.length) return false;
        return entry.keys.some((key) => {
            const trimmedKey = key.trim().toLowerCase();
            return trimmedKey.length > 0 && normalizedQuery.includes(trimmedKey);
        });
    });
}

/**
 * Compiles a CharacterCard object into production-ready AI System Instructions
 */
export function compileSystemInstructions(
    card: CharacterCard,
    userName: string = "User",
    simulatedQuery: string = "",
): CompiledPrompt {
    const charName = card.name || "Assistant";

    const processedPersonality = processMacros(card.personality, charName, userName);
    const processedScenario = processMacros(card.scenario, charName, userName);
    const processedExamples = processMacros(card.exampleDialogue || "", charName, userName);
    const processedOverride = processMacros(
        card.systemInstructionOverride || "",
        charName,
        userName,
    );

    // Determine active lorebook entries (all enabled entries or keyword-triggered entries)
    const activeLore = simulatedQuery.trim()
        ? getTriggeredLoreEntries(card.lorebook, simulatedQuery)
        : card.lorebook.filter((e) => e.enabled);

    const compiledLoreText = activeLore
        .map((entry) => {
            const processedContent = processMacros(entry.content, charName, userName);
            const title = entry.comment || entry.keys.join(", ") || "Lore Entry";
            return `[LORE: ${title.toUpperCase()}]\n${processedContent}`;
        })
        .join("\n\n");

    let compiledText = "";

    if (processedOverride.trim()) {
        compiledText = processedOverride.trim();
    } else {
        const parts: string[] = [];

        parts.push(`[CHARACTER DEFINITION: ${charName.toUpperCase()}]`);
        if (card.title) {
            parts.push(`Role & Tagline: ${card.title}`);
        }

        if (processedPersonality) {
            parts.push(`\n[PERSONALITY & BEHAVIOR]\n${processedPersonality}`);
        }

        if (processedScenario) {
            parts.push(`\n[CURRENT SCENARIO & SETTING]\n${processedScenario}`);
        }

        if (compiledLoreText) {
            parts.push(`\n[WORLD LORE & CONTEXT VAULT]\n${compiledLoreText}`);
        }

        if (processedExamples) {
            parts.push(`\n[DIALOGUE STYLE EXAMPLES]\n${processedExamples}`);
        }

        parts.push(`\n[INSTRUCTIONS]
- You are strictly playing the role of ${charName}.
- Stay in character at all times. Do not break immersion or refer to yourself as an AI.
- Express ${charName}'s distinct mannerisms, voice, and emotional tone as defined above.`);

        compiledText = parts.join("\n");
    }

    const personalityTok = estimateTokens(processedPersonality);
    const scenarioTok = estimateTokens(processedScenario);
    const examplesTok = estimateTokens(processedExamples);
    const loreTok = estimateTokens(compiledLoreText);
    const overrideTok = estimateTokens(processedOverride);
    const totalTok = estimateTokens(compiledText);

    return {
        systemInstructions: compiledText,
        charMacro: charName,
        userMacro: userName,
        estimatedTokens: totalTok,
        activeLoreEntriesCount: activeLore.length,
        breakdown: {
            coreIdentityTokens: estimateTokens(card.name + (card.title || "")),
            personalityTokens: personalityTok,
            scenarioTokens: scenarioTok,
            examplesTokens: examplesTok,
            loreTokens: loreTok,
            overrideTokens: overrideTok,
        },
    };
}
