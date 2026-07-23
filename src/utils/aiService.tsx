// src/utils/aiService.tsx

import type { ChatMessage, UserSettings } from "../types/character";

/**
 * Sends compiled system instructions and chat history to the configured AI API provider.
 */
export async function sendAiRequest(
    settings: UserSettings,
    systemPrompt: string,
    historyMessages: ChatMessage[],
): Promise<string> {
    const provider = settings.provider;
    const apiKey = settings.apiKey.trim();

    // Pre-validation check for cloud providers
    if (provider !== "custom" && !apiKey) {
        throw new Error(
            `Missing API Key for ${provider.toUpperCase()}. Please configure your API key in Settings.`,
        );
    }

    // Filter chat history to user and assistant turns
    const conversation = historyMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
        }));

    if (provider === "anthropic") {
        const baseUrl = settings.baseUrl.trim().replace(/\/+$/, "");
        const endpoint = `${baseUrl}/messages`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true",
            },
            body: JSON.stringify({
                model: settings.selectedModel || "claude-3-5-sonnet-20241022",
                max_tokens: settings.maxTokens || 1024,
                temperature: settings.temperature ?? 0.7,
                system: systemPrompt,
                messages: conversation,
            }),
        });

        if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            const msg = errJson.error?.message || response.statusText;
            throw new Error(`Anthropic API Error (${response.status}): ${msg}`);
        }

        const data = await response.json();
        const textBlock = data.content?.find((b: any) => b.type === "text");
        return textBlock?.text || "No response generated.";
    } else {
        // Provider is 'openai', 'gemini', or 'custom'
        let endpoint = settings.baseUrl.trim();

        if (
            provider === "gemini" &&
            (endpoint.includes("generativelanguage.googleapis.com") || !endpoint)
        ) {
            endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
        } else if (!endpoint.endsWith("/chat/completions")) {
            endpoint = `${endpoint.replace(/\/+$/, "")}/chat/completions`;
        }

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (apiKey) {
            headers["Authorization"] = `Bearer ${apiKey}`;
        }

        const apiMessages = [{ role: "system", content: systemPrompt }, ...conversation];

        const response = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify({
                model: settings.selectedModel || "gpt-4o",
                temperature: settings.temperature ?? 0.7,
                max_tokens: settings.maxTokens || 1024,
                messages: apiMessages,
            }),
        });

        if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            const msg = errJson.error?.message || errJson.message || response.statusText;
            throw new Error(`${provider.toUpperCase()} API Error (${response.status}): ${msg}`);
        }

        const data = await response.json();
        const resultText = data.choices?.[0]?.message?.content;
        return resultText || "No response generated.";
    }
}
