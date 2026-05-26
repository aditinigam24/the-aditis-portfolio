// logger.mjs

const SENSITIVE_KEYS = ["password", "pass", "key", "token", "auth", "secret", "email_pass", "groq_api_key"];

/**
 * Recursively sanitizes objects by redacting keys that match typical sensitive patterns
 */
export function sanitize(data) {
  if (data === null || data === undefined) {
    return data;
  }

  // If it's a string, try to redact known secrets
  if (typeof data === "string") {
    let sanitizedString = data;
    const secretsToRedact = [
      process.env.EMAIL_PASS,
      process.env.GROQ_API_KEY,
    ].filter((secret) => typeof secret === "string" && secret.length > 0);

    for (const secret of secretsToRedact) {
      // Avoid redacting short strings to prevent false positives
      if (secret.length > 4) {
        sanitizedString = sanitizedString.replace(new RegExp(escapeRegExp(secret), "g"), "[REDACTED_SECRET]");
      }
    }
    return sanitizedString;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  }

  if (typeof data === "object") {
    const sanitizedObj = {};
    for (const key of Object.keys(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
        sanitizedObj[key] = "[REDACTED]";
      } else {
        sanitizedObj[key] = sanitize(data[key]);
      }
    }
    return sanitizedObj;
  }

  return data;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatTimestamp() {
  return new Date().toISOString();
}

function log(level, emoji, message, ...args) {
  const timestamp = formatTimestamp();
  const sanitizedMessage = sanitize(message);
  const sanitizedArgs = args.map((arg) => (arg instanceof Error ? formatError(arg) : sanitize(arg)));

  const formattedLog = `[${timestamp}] [${emoji} ${level.toUpperCase()}] ${sanitizedMessage}`;
  
  if (level === "error" || level === "critical") {
    console.error(formattedLog, ...sanitizedArgs);
  } else if (level === "warn") {
    console.warn(formattedLog, ...sanitizedArgs);
  } else {
    console.log(formattedLog, ...sanitizedArgs);
  }
}

function formatError(error) {
  return {
    name: error.name,
    message: sanitize(error.message),
    stack: error.stack ? sanitize(error.stack) : undefined,
    ...sanitize(error),
  };
}

export const logger = {
  info: (message, ...args) => log("info", "ℹ️", message, ...args),
  warn: (message, ...args) => log("warn", "⚠️", message, ...args),
  error: (message, ...args) => log("error", "🔥", message, ...args),
  critical: (message, ...args) => log("critical", "🚨", message, ...args),
  sanitize,
};
