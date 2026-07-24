// src/components/chat/ChatEngine.tsx

import React, { useState, useRef, useEffect } from "react";
import type { CharacterCard, ChatMessage } from "../../types/character";
import { compileSystemInstructions } from "../../utils/promptCompiler";
import { FormattedMessageContent } from "./FormattedMessageContent";

interface ChatEngineProps {
    character: CharacterCard;
    messages: ChatMessage[];
    isGenerating: boolean;
    errorMessage: string | null;
    onSendMessage: (content: string) => void;
    onClearHistory: () => void;
    onRegenerateLastTurn: () => void;
    onDismissError: () => void;
}

export const ChatEngine: React.FC<ChatEngineProps> = ({
    character,
    messages,
    isGenerating,
    errorMessage,
    onSendMessage,
    onClearHistory,
    onRegenerateLastTurn,
    onDismissError,
}) => {
    const [input, setInput] = useState("");
    const [isPromptDrawerOpen, setIsPromptDrawerOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const compiledPrompt = compileSystemInstructions(character, "User");

    // Auto-scroll timeline to bottom on new dialogue turn additions or generation state changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages, isGenerating, errorMessage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;
        onSendMessage(input.trim());
        setInput("");
    };

    return (
        <div className="relative flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0B0C0E]">
            {/* Atmospheric Ambient Character Backdrop Blur */}
            {character.avatarUrl ? (
                <div
                    className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-15 blur-[100px] scale-125 transition-all duration-700"
                    style={{ backgroundImage: `url(${character.avatarUrl})` }}
                />
            ) : (
                <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-emerald-950/10 via-transparent to-transparent opacity-30 blur-[80px]" />
            )}

            {/* Primary Message Timeline Column */}
            <div className="relative z-10 flex h-full min-w-0 flex-1 flex-col">
                {/* Chat Control Toolbar */}
                <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0E1013]/80 px-4 backdrop-blur-md select-none">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-800 text-xs font-bold text-zinc-200 shadow-sm">
                            {character.avatarUrl ? (
                                <img
                                    src={character.avatarUrl}
                                    alt={character.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                character.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <span className="text-xs font-semibold text-zinc-100">{character.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsPromptDrawerOpen(!isPromptDrawerOpen)}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-all ${
                                isPromptDrawerOpen
                                    ? "border-emerald-500/40 bg-emerald-950/50 text-emerald-300 shadow-sm"
                                    : "border-white/10 bg-zinc-900/80 text-zinc-400 hover:text-zinc-200"
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
                                    strokeWidth={1.5}
                                    d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                                />
                            </svg>
                            <span>{isPromptDrawerOpen ? "Close Context" : "View Core Context"}</span>
                        </button>

                        <button
                            onClick={onClearHistory}
                            disabled={isGenerating}
                            className="rounded-lg border border-white/10 bg-zinc-900/80 px-2.5 py-1 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-40"
                            title="Reset current conversation state"
                        >
                            Reset Session
                        </button>
                    </div>
                </div>

                {/* API Error Notification Banner */}
                {errorMessage && (
                    <div className="flex items-center justify-between border-b border-rose-500/30 bg-rose-950/60 px-4 py-2.5 font-mono text-xs text-rose-300 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
                            <span>{errorMessage}</span>
                        </div>
                        <button
                            onClick={onDismissError}
                            className="rounded px-2 py-0.5 text-[10px] text-rose-400 hover:bg-rose-900/50 hover:text-rose-200"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Message Stream Scrollspace */}
                <div
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 md:px-8"
                >
                    {messages.length === 0 ? (
                        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-white/10 bg-[#131518]/40 p-8 text-center backdrop-blur-sm">
                            <span className="mb-1 block font-mono text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                                Conversation Initialized
                            </span>
                            <p className="mx-auto max-w-sm text-xs text-zinc-400">
                                Send a message below to start interacting with {character.name}.
                            </p>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-3xl space-y-6">
                            {messages.map((msg, idx) => {
                                const isUser = msg.role === "user";

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col space-y-1.5 ${
                                            isUser ? "items-end" : "items-start"
                                        }`}
                                    >
                                        {/* Speech Bubble Container with Enclosed Header */}
                                        <div
                                            className={`max-w-[85%] rounded-2xl p-4 shadow-lg transition-all ${
                                                isUser
                                                    ? "rounded-tr-xs bg-zinc-100 text-zinc-950 border border-white/20"
                                                    : "rounded-tl-xs border border-white/[0.08] bg-[#181B20]/90 text-zinc-100 backdrop-blur-md"
                                            }`}
                                        >
                                            {/* Header Label inside Speech Bubble */}
                                            <div
                                                className={`mb-2.5 flex items-center gap-2 border-b pb-2 select-none ${
                                                    isUser
                                                        ? "border-zinc-300/50"
                                                        : "border-white/[0.08]"
                                                }`}
                                            >
                                                {!isUser && (
                                                    <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-800 text-[10px] font-bold text-zinc-300">
                                                        {character.avatarUrl ? (
                                                            <img
                                                                src={character.avatarUrl}
                                                                alt={character.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            character.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                )}
                                                <span
                                                    className={`font-mono text-[11px] font-bold tracking-wider ${
                                                        isUser
                                                            ? "text-zinc-800"
                                                            : "text-emerald-400 uppercase"
                                                    }`}
                                                >
                                                    {isUser ? "User" : character.name}
                                                </span>
                                            </div>

                                            <FormattedMessageContent
                                                content={msg.content}
                                                isUser={isUser}
                                            />

                                            {/* Footer metadata & actions */}
                                            <div
                                                className={`mt-2.5 flex items-center justify-between border-t pt-2 text-[10px] font-mono ${
                                                    isUser
                                                        ? "border-zinc-300/40 text-zinc-500"
                                                        : "border-white/[0.06] text-zinc-500"
                                                }`}
                                            >
                                                <span>{msg.timestamp}</span>

                                                {!isUser &&
                                                    idx === messages.length - 1 &&
                                                    !isGenerating && (
                                                        <button
                                                            onClick={onRegenerateLastTurn}
                                                            className="flex items-center gap-1 text-zinc-400 transition-colors hover:text-emerald-400"
                                                            title="Regenerate last turn"
                                                        >
                                                            <svg
                                                                className="h-3 w-3"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={1.8}
                                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"
                                                                />
                                                            </svg>
                                                            <span>Regenerate</span>
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Active Inference Pulsing Indicator */}
                            {isGenerating && (
                                <div className="flex flex-col space-y-1.5 items-start">
                                    <div className="flex items-center gap-3 rounded-2xl rounded-tl-xs border border-emerald-500/20 bg-[#181B20]/90 px-4 py-3 shadow-lg backdrop-blur-md">
                                        <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-emerald-500/30 bg-emerald-950/40 text-[10px] font-bold text-emerald-400">
                                            {character.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                                        <span className="font-mono text-xs text-emerald-300">
                                            {character.name} is inferring response...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Interface Floor */}
                <div className="shrink-0 border-t border-white/[0.08] bg-[#0E1013]/90 p-4 backdrop-blur-md select-none">
                    <form
                        onSubmit={handleSubmit}
                        className="relative mx-auto flex max-w-3xl items-center rounded-xl border border-white/[0.1] bg-[#131518]/90 px-3 py-2 shadow-inner transition-colors focus-within:border-emerald-500/50"
                    >
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isGenerating}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder={
                                isGenerating
                                    ? "Awaiting model response..."
                                    : `Message ${character.name}... (Press Enter to send)`
                            }
                            rows={1}
                            className="max-h-32 min-h-[2.25rem] flex-1 resize-none scrollbar-none bg-transparent px-1 py-1 font-sans text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isGenerating}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-medium text-zinc-950 transition-all hover:bg-white active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:opacity-30 disabled:scale-100"
                            title="Send message"
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.2}
                                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                                />
                            </svg>
                        </button>
                    </form>
                    <div className="mx-auto mt-1.5 flex max-w-3xl items-center justify-between px-2 font-mono text-[9px] text-zinc-500">
                        <span>Shift + Enter for line breaks</span>
                        <span>Est. Context Frame: ~{compiledPrompt.estimatedTokens} tokens</span>
                    </div>
                </div>
            </div>

            {/* Slide-out Compiled Context Inspector Drawer Panel */}
            <div
                className={`relative z-20 flex h-full flex-col border-l border-white/[0.08] bg-[#0E1013]/95 backdrop-blur-md transition-all duration-300 ${
                    isPromptDrawerOpen ? "w-80 lg:w-96" : "w-0 overflow-hidden border-l-0 opacity-0"
                }`}
            >
                <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#131518] px-4 select-none">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-zinc-400">
                        COMPILED PROMPT STRUCT
                    </span>
                    <span className="rounded border border-emerald-500/30 bg-emerald-950/50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
                        Active
                    </span>
                </div>
                <div className="border-b border-white/[0.04] bg-[#0B0C0E] p-3.5 font-mono text-[10px] leading-normal text-zinc-500 select-none">
                    This read-only snapshot is injected invisibly behind the scenes ahead of user
                    queries.
                </div>
                <div className="flex-1 overflow-y-auto bg-[#0B0C0E]/50 p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-zinc-400 select-text">
                    {compiledPrompt.systemInstructions}
                </div>
            </div>
        </div>
    );
};