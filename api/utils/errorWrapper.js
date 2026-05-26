// api/utils/errorWrapper.js
const SENSITIVE_KEYS = ["password", "pass", "key", "token", "auth", "secret", "email_pass", "groq_api_key"];

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(errors, message = "Validation failed") {
    super(message, 400);
    this.errors = errors;
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message = "Method not allowed") {
    super(message, 405);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "Service temporarily unavailable") {
    super(message, 503);
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function sanitize(data) {
  if (data === null || data === undefined) {
    return data;
  }
  if (typeof data === "string") {
    let sanitizedString = data;
    const secretsToRedact = [
      process.env.EMAIL_PASS,
      process.env.GROQ_API_KEY,
    ].filter((secret) => typeof secret === "string" && secret.length > 0);

    for (const secret of secretsToRedact) {
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

function log(level, emoji, message, ...args) {
  const timestamp = new Date().toISOString();
  const sanitizedMessage = sanitize(message);
  const sanitizedArgs = args.map((arg) => (arg instanceof Error ? { name: arg.name, message: sanitize(arg.message), stack: arg.stack ? sanitize(arg.stack) : undefined } : sanitize(arg)));

  const formattedLog = `[${timestamp}] [${emoji} ${level.toUpperCase()}] ${sanitizedMessage}`;
  if (level === "error" || level === "critical") {
    console.error(formattedLog, ...sanitizedArgs);
  } else if (level === "warn") {
    console.warn(formattedLog, ...sanitizedArgs);
  } else {
    console.log(formattedLog, ...sanitizedArgs);
  }
}

export const logger = {
  info: (msg, ...args) => log("info", "ℹ️", msg, ...args),
  warn: (msg, ...args) => log("warn", "⚠️", msg, ...args),
  error: (msg, ...args) => log("error", "🔥", msg, ...args),
  critical: (msg, ...args) => log("critical", "🚨", msg, ...args),
};

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export function withErrorHandling(handler) {
  return async (req, res) => {
    // 1. Enforce POST request method
    if (req.method !== "POST") {
      logger.warn(`Rejected invalid request method ${req.method} on ${req.url}`);
      return res.status(405).json({
        status: "fail",
        message: `Method ${req.method} not allowed. Please use POST instead.`,
      });
    }

    try {
      // 2. Wrap request body handling to catch malformed payloads
      if (req.body && typeof req.body === "string") {
        try {
          req.body = JSON.parse(req.body);
        } catch (e) {
          throw new BadRequestError("Malformed JSON payload: please check your syntax structure.");
        }
      }

      await handler(req, res, { AppError, BadRequestError, ValidationError, NotFoundError, ServiceUnavailableError, logger, EMAIL_REGEX, sanitizeInput });
    } catch (err) {
      let statusCode = err.statusCode || 500;
      let status = err.status || "error";
      let message = err.message || "An unexpected serverless function error occurred.";
      let errors = err.errors || undefined;

      if (err.isOperational) {
        logger.warn(`${err.constructor.name}: ${message} [${req.method} ${req.url}]`, { errors });
      } else {
        logger.critical(`Unhandled Serverless Exception: ${err.message} [${req.method} ${req.url}]`, err);
        if (process.env.NODE_ENV === "production") {
          statusCode = 500;
          status = "error";
          message = "An internal server error occurred.";
        }
      }

      const responsePayload = {
        status,
        message,
      };

      if (errors) {
        responsePayload.errors = errors;
      }

      if (process.env.NODE_ENV !== "production") {
        responsePayload.error = {
          name: err.name,
          message: err.message,
        };
        responsePayload.stack = err.stack;
      }

      res.status(statusCode).json(responsePayload);
    }
  };
}
