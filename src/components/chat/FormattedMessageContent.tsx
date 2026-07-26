// src/components/chat/FormattedMessageContent.tsx

import React from "react";

interface FormattedMessageContentProps {
    content: string;
    isUser?: boolean;
}

/**
 * Parses roleplay text:
 * - Text inside *asterisks* rendered as soft italicized action text
 * - Dialogue in "quotes" or standard text rendered in clear primary text
 */
export const FormattedMessageContent: React.FC<FormattedMessageContentProps> = ({
    content,
    isUser = false,
}) => {
    if (!content) return null;

    // Regex to capture *action text*, **bold text**, and normal text blocks
    const regex = /(\*[^*]+\*|\*\*[^*]+\*\*|\n+)/g;
    const parts = content.split(regex);

    return (
        <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap select-text">
            {parts.map((part, index) => {
                if (!part) return null;

                // Line breaks
                if (part.startsWith("\n")) {
                    return <span key={index}>{part}</span>;
                }

                // Asterisk actions: *nods thoughtfully*
                if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
                    const cleanText = part.slice(1, -1);
                    return (
                        <span
                            key={index}
                            className={
                                isUser
                                    ? "font-normal text-zinc-300/80 italic"
                                    : "font-normal text-zinc-400 italic"
                            }
                        >
                            {cleanText}
                        </span>
                    );
                }

                // Bold text: **important**
                if (part.startsWith("**") && part.endsWith("**")) {
                    const cleanText = part.slice(2, -2);
                    return (
                        <strong key={index} className="font-semibold text-zinc-100">
                            {cleanText}
                        </strong>
                    );
                }

                // Standard spoken text or dialogue
                return (
                    <span
                        key={index}
                        className={isUser ? "font-medium text-zinc-900" : "text-zinc-100"}
                    >
                        {part}
                    </span>
                );
            })}
        </div>
    );
};
