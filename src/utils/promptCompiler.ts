import type { CharacterCard } from "../types/character";

export interface CompiledPrompt {
    systemInstructions: string;
    charMacro: string;
    userMacro: string;
    estimatedTokens: number;
    breakdown: {
        coreIdentityTokens: number;
        personalityTokens: number;
        scenarioTokens: number;
        examplesTokens: number;
        overrideTokens: number;
    };
}

export function processMacros(text: string, charName: string, userName: string = "User"): string {
    if (!text) return "";
    return text
        .replace(/\{\{char\}\}/gi, charName || "Assistant")
        .replace(/\{\{user\}\}/gi, userName);
}

export function estimateTokens(text: string): number {
    if (!text) return 0;
    const trimmed = text.trim();
    if (trimmed.length === 0) return 0;
    return Math.ceil(trimmed.length / 4);
}

export function compileSystemInstructions(
    card: CharacterCard,
    userName: string = "User",
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
    const overrideTok = estimateTokens(processedOverride);
    const totalTok = estimateTokens(compiledText);

    return {
        systemInstructions: compiledText,
        charMacro: charName,
        userMacro: userName,
        estimatedTokens: totalTok,
        breakdown: {
            coreIdentityTokens: estimateTokens(card.name + (card.title || "")),
            personalityTokens: personalityTok,
            scenarioTokens: scenarioTok,
            examplesTokens: examplesTok,
            overrideTokens: overrideTok,
        },
    };
}
