export const CHAT_MODEL = "anthropic/claude-haiku-4.5";
export const MAX_OUTPUT_TOKENS = 512;
export const MAX_INPUT_CHARS = 500;
// Assistant history turns replay model output, which runs ~4 chars/token.
export const MAX_ASSISTANT_CHARS = 4 * MAX_OUTPUT_TOKENS;
export const MAX_HISTORY = 6;
export const MAX_BODY_BYTES = 16 * 1024;
export const RATE_LIMIT_REQUESTS = 10;
export const RATE_LIMIT_WINDOW = "1 d";
export const INTERRUPTED_MESSAGE =
  "The answer was interrupted - please try again.";
