/**
 * Custom hook to compute concatenated messages from logger logs
 */
import { useLoggerStore } from "../lib/store-logger";
import { LoggerFilterType } from "../components/logger/Logger";

export function useConcatenatedMessages(filter: LoggerFilterType = "none") {
  const { logs } = useLoggerStore();

  const filters: Record<LoggerFilterType, (log: any) => boolean> = {
    tools: (log: any) =>
      typeof log.message === "object" &&
      ("toolCall" in log.message ||
        "functionResponses" in log.message ||
        "toolCallCancellation" in log.message),
    conversations: (log: any) =>
      typeof log.message === "object" &&
      (("turns" in log.message && "turnComplete" in log.message) ||
        "serverContent" in log.message),
    none: () => true,
  };

  const filterFn = filters[filter];

  // Concatenate all messages from filtered logs
  const concatenatedMessages = logs
    .filter(filterFn)
    .map((log) => {
      if (typeof log.message === "string") {
        return log.message;
      } else if (typeof log.message === "object") {
        // Try to extract text from known structures
        if ("turns" in log.message && Array.isArray(log.message.turns)) {
          // For ClientContentLogType
          return log.message.turns
            .map((part: any) => part.text || "")
            .join("");
        }
        if ("serverContent" in log.message && log.message.serverContent) {
          const serverContent = log.message.serverContent;
          if ("modelTurn" in serverContent && serverContent.modelTurn?.parts) {
            return serverContent.modelTurn.parts
              .map((part: any) => part.text || "")
              .join("");
          }
        }
        // Fallback: stringify the object
        return JSON.stringify(log.message);
      }
      return "";
    })
    .filter(Boolean)
    .join("");

  return concatenatedMessages
    .replaceAll(".", ". ")
    .replaceAll("?", "? ")
    .replaceAll("!", "! ")
    .replaceAll("  ", " ");
} 