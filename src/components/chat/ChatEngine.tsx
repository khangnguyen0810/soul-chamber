// src/components/chat/ChatEngine.tsx

import React, { useState, useRef, useEffect } from "react";
import type { CharacterCard, ChatMessage } from "../../types/character";
import { compileSystemInstructions } from "../../utils/promptCompiler";

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
        <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0B0C0E]">
            {/* Primary Message Timeline Column */}
            <div className="relative flex h-full min-w-0 flex-1 flex-col">
                {/* Chat Control Toolbar */}
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#131518]/60 px-4 select-none">
                    <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
                            Name:
                        </span>
                        <span className="text-xs font-medium text-zinc-200">{character.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsPromptDrawerOpen(!isPromptDrawerOpen)}
                            className={`flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] transition-colors ${
                                isPromptDrawerOpen
                                    ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                                    : "border-white/5 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
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
                            <span>{isPromptDrawerOpen ? "Close Spec" : "View Core Context"}</span>
                        </button>

                        <button
                            onClick={onClearHistory}
                            disabled={isGenerating}
                            className="rounded border border-white/5 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-40"
                            title="Reset current conversation state"
                        >
                            Reset Session
                        </button>
                    </div>
                </div>

                {/* API Error Notification Banner */}
                {errorMessage && (
                    <div className="flex items-center justify-between border-b border-rose-500/30 bg-rose-950/40 px-4 py-2.5 font-mono text-xs text-rose-300">
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
                    className="flex-1 scrollbar-thin scrollbar-thumb-zinc-800 space-y-6 overflow-y-auto px-4 py-6 md:px-8"
                >
                    {messages.length === 0 ? (
                        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-dashed border-white/5 bg-[#131518]/20 p-8 text-center">
                            <span className="mb-1 block font-mono text-xs text-zinc-500">
                                Session Initialized
                            </span>
                            <p className="mx-auto max-w-sm text-xs text-zinc-400">
                                Send a message below to generate live responses using your
                                configured API model.
                            </p>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-3xl space-y-6">
                            {messages.map((msg, idx) => {
                                const isUser = msg.role === "user";

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col space-y-1.5 rounded-xl border border-white/[0.04] p-4 ${
                                            isUser
                                                ? "ml-8 bg-[#131518]/40 md:ml-16"
                                                : "mr-8 bg-[#181B20]/30 md:mr-16"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 select-none">
                                            <span
                                                className={`font-semibold tracking-wider ${
                                                    isUser ? "text-zinc-400" : "text-emerald-400"
                                                }`}
                                            >
                                                {isUser ? "USER" : character.name.toUpperCase()}
                                            </span>
                                            <span>{msg.timestamp}</span>
                                        </div>
                                        <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-zinc-200 select-text">
                                            {msg.content}
                                        </div>

                                        {!isUser &&
                                            idx === messages.length - 1 &&
                                            !isGenerating && (
                                                <div className="mt-2 flex items-center gap-3 border-t border-white/[0.04] pt-2">
                                                    <button
                                                        onClick={onRegenerateLastTurn}
                                                        className="flex items-center gap-1 font-mono text-[10px] text-zinc-500 transition-colors hover:text-zinc-300"
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
                                                        <span>Regenerate Turn</span>
                                                    </button>
                                                </div>
                                            )}
                                    </div>
                                );
                            })}

                            {/* Active Inference Pulsing Indicator */}
                            {isGenerating && (
                                <div className="mr-8 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-[#181B20]/40 p-4 md:mr-16">
                                    <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                                    <span className="font-mono text-xs text-emerald-300">
                                        {character.name} is inferring response...
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Input Interface Floor */}
                <div className="shrink-0 border-t border-white/[0.06] bg-[#0E1013] p-4 select-none">
                    <form
                        onSubmit={handleSubmit}
                        className="relative mx-auto flex max-w-3xl items-center rounded-xl border border-white/[0.08] bg-[#131518] px-2 py-1.5 shadow-inner transition-colors focus-within:border-emerald-500/40"
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
                                    ? "Awaiting model turn response..."
                                    : `Send message to ${character.name}... (Press Enter to transmit)`
                            }
                            rows={1}
                            className="max-h-32 min-h-[2.25rem] flex-1 resize-none scrollbar-none bg-transparent px-2 py-1.5 font-sans text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isGenerating}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-medium text-zinc-950 transition-all disabled:bg-zinc-800 disabled:text-zinc-600 disabled:opacity-20"
                            title="Transmit token stream"
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
                    <div className="mx-auto mt-1.5 flex max-w-3xl items-center justify-between px-2 font-mono text-[9px] text-zinc-600">
                        <span>Shift + Enter for line breaks</span>
                        <span>Est. Prompt Frame: ~{compiledPrompt.estimatedTokens} tokens</span>
                    </div>
                </div>
            </div>

            {/* Slide-out Compiled Context Inspector Drawer Panel */}
            <div
                className={`relative flex h-full flex-col border-l border-white/[0.08] bg-[#0E1013] transition-all duration-300 ${
                    isPromptDrawerOpen ? "w-80 lg:w-96" : "w-0 overflow-hidden border-l-0 opacity-0"
                }`}
            >
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#131518] px-4 select-none">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-zinc-400">
                        COMPILED PROMPT STRUCT
                    </span>
                    <span className="rounded border border-emerald-500/20 bg-emerald-950/50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
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
