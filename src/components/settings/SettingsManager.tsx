// src/components/settings/SettingsManager.tsx
import React, { useState, useRef, useEffect } from "react";
import type { CharacterCard, UserSettings, CharacterCardExportSpec } from "../../types/character";

interface SettingsManagerProps {
    settings: UserSettings;
    onUpdateSettings: (newSettings: UserSettings) => void;
    characters: CharacterCard[];
    activeCharacter: CharacterCard | null;
    onImportCharacter: (card: CharacterCard) => void;
    onImportRosterBackup: (cards: CharacterCard[]) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
    settings,
    onUpdateSettings,
    characters,
    activeCharacter,
    onImportCharacter,
    onImportRosterBackup,
}) => {
    // Local draft state for explicit save flow
    const [draftSettings, setDraftSettings] = useState<UserSettings>(settings);
    const [showApiKey, setShowApiKey] = useState(false);
    const [statusNotification, setStatusNotification] = useState<string | null>(null);

    const singleFileInputRef = useRef<HTMLInputElement>(null);
    const backupFileInputRef = useRef<HTMLInputElement>(null);

    // Keep draft synced if external settings prop updates
    useEffect(() => {
        setDraftSettings(settings);
    }, [settings]);

    const showToast = (msg: string) => {
        setStatusNotification(msg);
        setTimeout(() => setStatusNotification(null), 3000);
    };

    const handleSaveSettings = () => {
        onUpdateSettings(draftSettings);
        showToast(`Saved settings (Model: ${draftSettings.selectedModel})`);
    };

    const handleProviderChange = (provider: UserSettings["provider"]) => {
        let defaultModel = "claude-3-5-sonnet-20241022";
        let defaultBaseUrl = "https://api.anthropic.com/v1";

        if (provider === "openai") {
            defaultModel = "gpt-4o";
            defaultBaseUrl = "https://api.openai.com/v1";
        } else if (provider === "gemini") {
            defaultModel = "gemini-1.5-pro";
            defaultBaseUrl = "https://generativelanguage.googleapis.com";
        } else if (provider === "custom") {
            defaultModel = "local-model";
            defaultBaseUrl = "http://localhost:1234/v1";
        }

        setDraftSettings((prev) => ({
            ...prev,
            provider,
            selectedModel: defaultModel,
            baseUrl: defaultBaseUrl,
        }));
    };

    // Export single character card in Spec v2 JSON format
    const handleExportActiveCard = () => {
        if (!activeCharacter) return;

        const specCard: CharacterCardExportSpec = {
            spec: "chara_card_v2",
            spec_version: "2.0",
            data: {
                name: activeCharacter.name,
                description: activeCharacter.title || "",
                personality: activeCharacter.personality || "",
                scenario: activeCharacter.scenario || "",
                first_mes: activeCharacter.firstMessage || "",
                mes_example: activeCharacter.exampleDialogue || "",
                system_prompt: activeCharacter.systemInstructionOverride || "",
                character_book: {
                    entries: (activeCharacter.lorebook || []).map((e) => ({
                        keys: e.keys,
                        content: e.content,
                        enabled: e.enabled,
                        comment: e.comment,
                    })),
                },
            },
        };

        const blob = new Blob([JSON.stringify(specCard, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeCharacter.name.toLowerCase().replace(/\s+/g, "_")}_card.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported "${activeCharacter.name}" as JSON spec v2`);
    };

    // Export entire workspace roster backup
    const handleExportRosterBackup = () => {
        const backupData = {
            app: "SoulChamberStudio",
            version: "1.0",
            exportedAt: new Date().toISOString(),
            characters,
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `character_roster_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Exported full backup (${characters.length} characters)`);
    };

    // Import single JSON file
    const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                let importedCard: CharacterCard;

                if (json.spec === "chara_card_v2" && json.data) {
                    importedCard = {
                        id: `char-${Date.now()}`,
                        name: json.data.name || "Imported Character",
                        title: json.data.description || "",
                        personality: json.data.personality || "",
                        scenario: json.data.scenario || "",
                        firstMessage: json.data.first_mes || "",
                        exampleDialogue: json.data.mes_example || "",
                        systemInstructionOverride: json.data.system_prompt || "",
                        lorebook: (json.data.character_book?.entries || []).map(
                            (entry: any, i: number) => ({
                                id: `lore-${Date.now()}-${i}`,
                                keys: Array.isArray(entry.keys) ? entry.keys : [],
                                content: entry.content || "",
                                enabled: entry.enabled ?? true,
                                comment: entry.comment || `Entry ${i + 1}`,
                            }),
                        ),
                        updatedAt: new Date().toISOString(),
                    };
                } else if (json.name) {
                    importedCard = {
                        id: `char-${Date.now()}`,
                        name: json.name,
                        title: json.title || json.description || "",
                        personality: json.personality || "",
                        scenario: json.scenario || "",
                        firstMessage: json.firstMessage || json.first_mes || "",
                        exampleDialogue: json.exampleDialogue || json.mes_example || "",
                        systemInstructionOverride: json.systemInstructionOverride || "",
                        lorebook: json.lorebook || [],
                        updatedAt: new Date().toISOString(),
                    };
                } else {
                    throw new Error("Unrecognized JSON character format.");
                }

                onImportCharacter(importedCard);
                showToast(`Successfully imported "${importedCard.name}"`);
            } catch (err: any) {
                showToast(`Import failed: ${err.message || "Invalid JSON file"}`);
            }
        };
        reader.readAsText(file);
        if (e.target) e.target.value = "";
    };

    // Import roster backup
    const handleBackupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.characters && Array.isArray(json.characters)) {
                    onImportRosterBackup(json.characters);
                    showToast(`Restored ${json.characters.length} characters from backup`);
                } else {
                    throw new Error("File does not contain a valid roster array.");
                }
            } catch (err: any) {
                showToast(`Restore failed: ${err.message || "Invalid backup JSON"}`);
            }
        };
        reader.readAsText(file);
        if (e.target) e.target.value = "";
    };

    const hasUnsavedChanges = JSON.stringify(draftSettings) !== JSON.stringify(settings);

    return (
        <div className="mx-auto flex h-full max-w-5xl flex-col space-y-6 p-4 select-none md:p-6">
            {/* Toast Notification Banner */}
            {statusNotification && (
                <div className="fixed right-6 bottom-6 z-50 flex animate-fade-in items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950 px-4 py-2.5 font-mono text-xs text-emerald-200 shadow-2xl">
                    <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                    <span>{statusNotification}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-white/[0.08] pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                        Engine Credentials & Data Vault
                    </h2>
                    <p className="mt-1 text-xs text-zinc-400">
                        Configure local API keys, fine-tune model parameters, and backup or transfer
                        character personas.
                    </p>
                </div>

                {/* Save Settings Button */}
                <button
                    onClick={handleSaveSettings}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-semibold shadow-sm transition-all ${
                        hasUnsavedChanges
                            ? "bg-emerald-400 text-zinc-950 ring-2 ring-emerald-400/30 hover:bg-emerald-300"
                            : "border border-white/10 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
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
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                    <span>{hasUnsavedChanges ? "Save Changes" : "Settings Saved"}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Left Column: API & Model Settings */}
                <div className="space-y-5 rounded-xl border border-white/[0.08] bg-[#131518] p-5">
                    <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                        <svg
                            className="h-4 w-4 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0121 7.5z"
                            />
                        </svg>
                        <h3 className="font-mono text-xs font-bold tracking-wider text-zinc-200 uppercase">
                            API Connection Config
                        </h3>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-300">
                            Target Provider
                        </label>
                        <div className="grid grid-cols-4 gap-1.5 rounded-lg border border-white/10 bg-[#0B0C0E] p-1">
                            {(["anthropic", "openai", "gemini", "custom"] as const).map((prov) => (
                                <button
                                    key={prov}
                                    type="button"
                                    onClick={() => handleProviderChange(prov)}
                                    className={`rounded py-1.5 font-mono text-xs capitalize transition-colors ${
                                        draftSettings.provider === prov
                                            ? "border border-white/10 bg-zinc-800 font-semibold text-emerald-400 shadow-sm"
                                            : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                >
                                    {prov}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                            API Secret Key{" "}
                            <span className="font-mono text-zinc-500">
                                (stored in browser storage)
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type={showApiKey ? "text" : "password"}
                                value={draftSettings.apiKey}
                                onChange={(e) =>
                                    setDraftSettings({ ...draftSettings, apiKey: e.target.value })
                                }
                                placeholder={
                                    draftSettings.provider === "anthropic"
                                        ? "sk-ant-api03-..."
                                        : draftSettings.provider === "openai"
                                          ? "sk-proj-..."
                                          : "Paste API Key here..."
                                }
                                className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 pr-16 font-mono text-xs text-zinc-100 placeholder-zinc-600 focus:border-emerald-500/60 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="absolute top-2 right-2 rounded border border-white/5 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400 hover:text-zinc-200"
                            >
                                {showApiKey ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                            API Base Endpoint
                        </label>
                        <input
                            type="text"
                            value={draftSettings.baseUrl}
                            onChange={(e) =>
                                setDraftSettings({ ...draftSettings, baseUrl: e.target.value })
                            }
                            placeholder="https://..."
                            className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-mono text-xs text-zinc-200 focus:border-emerald-500/60 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                            Model Identifier
                        </label>
                        <input
                            type="text"
                            value={draftSettings.selectedModel}
                            onChange={(e) =>
                                setDraftSettings({
                                    ...draftSettings,
                                    selectedModel: e.target.value,
                                })
                            }
                            placeholder="e.g. claude-3-5-sonnet-20241022 or gpt-4o"
                            className="w-full rounded-lg border border-white/10 bg-[#0B0C0E] px-3 py-2 font-mono text-xs text-zinc-200 focus:border-emerald-500/60 focus:outline-none"
                        />
                    </div>

                    <div className="space-y-4 border-t border-white/[0.06] pt-2">
                        <div>
                            <div className="mb-1.5 flex justify-between text-xs">
                                <span className="text-zinc-300">Temperature (Creativity)</span>
                                <span className="font-mono text-emerald-400">
                                    {draftSettings.temperature}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1.5"
                                step="0.05"
                                value={draftSettings.temperature}
                                onChange={(e) =>
                                    setDraftSettings({
                                        ...draftSettings,
                                        temperature: parseFloat(e.target.value),
                                    })
                                }
                                className="h-1.5 w-full cursor-pointer rounded-lg bg-zinc-800 accent-emerald-500"
                            />
                            <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-500">
                                <span>0.0 (Precise / Deterministic)</span>
                                <span>1.5 (Creative / Expressive)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Character Card Backup & Import/Export */}
                <div className="flex flex-col justify-between space-y-5 rounded-xl border border-white/[0.08] bg-[#131518] p-5">
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                            <svg
                                className="h-4 w-4 text-emerald-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                />
                            </svg>
                            <h3 className="font-mono text-xs font-bold tracking-wider text-zinc-200 uppercase">
                                Card Exporter & Import Vault
                            </h3>
                        </div>

                        {/* Active Character Export Spec */}
                        <div className="space-y-3 rounded-lg border border-white/10 bg-[#0B0C0E] p-4">
                            <div>
                                <span className="block font-mono text-[10px] tracking-wider text-emerald-400 uppercase">
                                    Single Card Spec
                                </span>
                                <h4 className="mt-0.5 text-xs font-medium text-zinc-100">
                                    {activeCharacter
                                        ? activeCharacter.name
                                        : "No character selected"}
                                </h4>
                                <p className="mt-1 text-[11px] text-zinc-400">
                                    Exports character identity, personality instructions, example
                                    dialogues, and lorebook in Standard Character Spec V2 JSON
                                    format.
                                </p>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={handleExportActiveCard}
                                    disabled={!activeCharacter}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-700 disabled:opacity-40"
                                >
                                    <svg
                                        className="h-3.5 w-3.5 text-emerald-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    <span>Export JSON Card</span>
                                </button>

                                <button
                                    onClick={() => singleFileInputRef.current?.click()}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
                                >
                                    <svg
                                        className="h-3.5 w-3.5 text-emerald-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                        />
                                    </svg>
                                    <span>Import JSON Card</span>
                                </button>
                                <input
                                    type="file"
                                    ref={singleFileInputRef}
                                    onChange={handleSingleFileChange}
                                    accept=".json"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Full Roster Backup */}
                        <div className="space-y-3 rounded-lg border border-white/10 bg-[#0B0C0E] p-4">
                            <div>
                                <span className="block font-mono text-[10px] tracking-wider text-amber-400 uppercase">
                                    Full Roster Archive
                                </span>
                                <h4 className="mt-0.5 text-xs font-medium text-zinc-100">
                                    Workspace Backup ({characters.length} personas)
                                </h4>
                                <p className="mt-1 text-[11px] text-zinc-400">
                                    Save all character cards and their configured lorebooks into a
                                    single backup archive file.
                                </p>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={handleExportRosterBackup}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
                                >
                                    <span>Backup Roster</span>
                                </button>

                                <button
                                    onClick={() => backupFileInputRef.current?.click()}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-white/10 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-100 transition-colors hover:bg-zinc-700"
                                >
                                    <span>Restore Roster</span>
                                </button>
                                <input
                                    type="file"
                                    ref={backupFileInputRef}
                                    onChange={handleBackupFileChange}
                                    accept=".json"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-white/5 bg-[#0B0C0E] p-3 font-mono text-[10px] leading-normal text-zinc-500">
                        Cards exported here conform to SillyTavern / Janitor Spec v2 and can be
                        re-imported seamlessly across character creation suites.
                    </div>
                </div>
            </div>
        </div>
    );
};
